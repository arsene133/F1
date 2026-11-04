// ==========================================================================
// Boîte de Leitner de Pot-Bouille : interface (navigateur uniquement).
//
// La page est rendue statiquement par Astro ; ce module lit la progression
// locale, remplit le tableau de bord et pilote les séances. Il n'est exécuté
// que côté client (aucun risque d'écart d'hydratation : rien n'est hydraté,
// les valeurs dépendant de la progression sont affichées « – » au rendu).
// ==========================================================================

import {
	categoryLabels,
	categoryShortLabels,
	difficultyLabels,
	potBouilleLeitnerCards,
	skillLabels,
	type LeitnerCard,
	type LeitnerCategory,
	type LeitnerDifficulty,
} from '../../data/pot-bouille-leitner';
import {
	BOXES,
	BOX_INTERVAL_DAYS,
	cardStatus,
	cardsNeedingAttention,
	createProgress,
	dailyActivity,
	daysBetween,
	deckStats,
	dueCardIds,
	introducedOn,
	newCardIds,
	nextBox,
	nextDueDay,
	reviewCard,
	reviewsOn,
	toDayKey,
	type BoxNumber,
	type DayKey,
	type ReviewResult,
} from './scheduler';
import {
	getBrowserStore,
	loadState,
	resetState,
	saveState,
	type LeitnerSettings,
	type LeitnerState,
} from './storage';

export const STORAGE_KEY = 'arsene-carrere:pot-bouille-leitner';

type Mode = 'revision' | 'decouverte' | 'entrainement';

interface Session {
	mode: Mode;
	queue: string[];
	index: number;
	/** Cartes oubliées déjà remises en fin de file pendant cette séance. */
	requeued: Set<string>;
	results: { id: string; result: ReviewResult }[];
	revealed: boolean;
}

const cards = potBouilleLeitnerCards;
const cardIds = cards.map((c) => c.id);
const byId = new Map(cards.map((c) => [c.id, c]));
const difficultyRank: Record<LeitnerDifficulty, number> = { facile: 0, intermediaire: 1, avance: 2 };

const modeTitles: Record<Mode, string> = {
	revision: 'Révision quotidienne',
	decouverte: 'Découverte',
	entrainement: 'Entraînement libre',
};

// ---------------------------------------------------------------------------
// Utilitaires
// ---------------------------------------------------------------------------
function today(): DayKey {
	return toDayKey(new Date());
}

function dayKeyToDate(day: DayKey): Date {
	const [y, m, d] = day.split('-').map(Number);
	return new Date(y, m - 1, d);
}

const longDate = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
const shortDate = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' });

function whenLabel(days: number): string {
	if (days <= 0) return 'à la prochaine séance';
	if (days === 1) return 'demain';
	return `dans ${days} jours`;
}

function plural(n: number, singular: string, pluralForm = `${singular}s`): string {
	return `${n} ${n > 1 ? pluralForm : singular}`;
}

function el<K extends keyof HTMLElementTagNameMap>(
	tag: K,
	props: { className?: string; text?: string; attrs?: Record<string, string> } = {},
	children: (Node | string)[] = [],
): HTMLElementTagNameMap[K] {
	const node = document.createElement(tag);
	if (props.className) node.className = props.className;
	if (props.text !== undefined) node.textContent = props.text;
	if (props.attrs) for (const [k, v] of Object.entries(props.attrs)) node.setAttribute(k, v);
	for (const child of children) node.append(child);
	return node;
}

function $(root: ParentNode, selector: string): HTMLElement {
	const node = root.querySelector<HTMLElement>(selector);
	if (!node) throw new Error(`Élément introuvable : ${selector}`);
	return node;
}

/** Ordre d'introduction : du plus simple au plus exigeant, en alternant les catégories. */
export function introductionOrder(ids: readonly string[], category: LeitnerCategory | '' = ''): string[] {
	const pool = ids.map((id) => byId.get(id)!).filter((c) => !category || c.category === category);
	const buckets = new Map<string, LeitnerCard[]>();
	for (const c of pool) {
		const key = `${difficultyRank[c.difficulty]}`;
		if (!buckets.has(key)) buckets.set(key, []);
		buckets.get(key)!.push(c);
	}
	const out: string[] = [];
	for (const key of ['0', '1', '2']) {
		const group = buckets.get(key) ?? [];
		const byCat = new Map<string, LeitnerCard[]>();
		for (const c of group) {
			if (!byCat.has(c.category)) byCat.set(c.category, []);
			byCat.get(c.category)!.push(c);
		}
		const lists = [...byCat.values()];
		for (let i = 0; lists.some((l) => i < l.length); i++) {
			for (const l of lists) if (i < l.length) out.push(l[i].id);
		}
	}
	return out;
}

function shuffle<T>(items: T[]): T[] {
	const a = [...items];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

// ---------------------------------------------------------------------------
// Application
// ---------------------------------------------------------------------------
export function initLeitnerApp(root: HTMLElement | null = document.getElementById('leitner-app')): void {
	if (!root) return;

	const store = getBrowserStore();
	const loaded = loadState(store, STORAGE_KEY);
	let state: LeitnerState = loaded.state;
	let session: Session | null = null;
	let extraNewToday = 0;

	const warning = $(root, '#lb-storage-warning');
	if (loaded.status === 'unavailable') {
		warning.hidden = false;
		warning.textContent =
			'Ce navigateur ne permet pas d’enregistrer votre progression (navigation privée ou stockage bloqué). Vous pouvez réviser, mais rien ne sera conservé après la fermeture de la page.';
	} else if (loaded.status === 'reset-malformed' || loaded.status === 'reset-unsupported-version') {
		warning.hidden = false;
		warning.textContent =
			'Les données de progression enregistrées étaient illisibles : une nouvelle progression a été commencée (une copie de l’ancienne a été conservée dans le navigateur).';
	}

	function persist(): void {
		if (store && !saveState(store, STORAGE_KEY, state)) {
			warning.hidden = false;
			warning.textContent =
				'Impossible d’enregistrer votre progression (espace de stockage plein ou bloqué). Votre séance continue, mais elle risque de ne pas être conservée.';
		}
	}

	const announcer = $(root, '[data-announcer]');
	function announce(message: string): void {
		announcer.textContent = '';
		window.setTimeout(() => (announcer.textContent = message), 30);
	}

	// ---------------------------------------------------------------- Tableau de bord
	function setBar(name: string, ratio: number): void {
		const bar = root!.querySelector<HTMLElement>(`[data-bar="${name}"]`);
		if (!bar) return;
		const pct = Math.max(0, Math.min(100, Math.round(ratio * 100)));
		bar.style.setProperty('--value', `${pct}%`);
		(bar.firstElementChild as HTMLElement | null)?.style.setProperty('--value', `${pct}%`);
		if (bar.getAttribute('role') === 'progressbar') bar.setAttribute('aria-valuenow', String(pct));
	}

	function setStat(name: string, value: string): void {
		root!.querySelectorAll<HTMLElement>(`[data-stat="${name}"]`).forEach((n) => (n.textContent = value));
	}

	function renderDashboard(): void {
		const day = today();
		const stats = deckStats(cardIds, state.cards, day);
		setStat('total', String(stats.total));
		setStat('due', String(stats.dueToday));
		setStat('new', String(stats.newCount));
		setStat('mastered', String(stats.mastered));
		setStat('progress', `${Math.round(stats.progress * 100)} %`);
		setBar('progress', stats.progress);

		// Les barres sont à l'échelle de la boîte la plus remplie ; les cartes nouvelles sont comptées à part.
		const max = Math.max(1, ...BOXES.map((b) => stats.boxes[b]));
		const newLine = root!.querySelector<HTMLElement>('.lb-dist-new-line');
		if (newLine) {
			newLine.replaceChildren(
				el('strong', { text: String(stats.newCount) }),
				` ${stats.newCount > 1 ? 'cartes pas encore découvertes' : 'carte pas encore découverte'}, hors des boîtes.`,
			);
		}
		BOXES.forEach((b) => {
			const n = stats.boxes[b];
			const count = root!.querySelector<HTMLElement>(`[data-dist="${b}"]`);
			if (!count) return;
			count.textContent = String(n);
			const col = count.closest('li')!;
			col.setAttribute('aria-label', `Boîte ${b} : ${plural(n, 'carte')}`);
			col.querySelector<HTMLElement>('.lb-dist-fill')?.style.setProperty('--value', `${(n / max) * 100}%`);
		});

		const done = reviewsOn(cardIds, state.cards, day);
		const goal = state.settings.dailyGoal;
		$(root!, '[data-goal-text]').replaceChildren(
			el('strong', { text: plural(done, 'carte évaluée', 'cartes évaluées') }),
			` sur un objectif de ${goal}.`,
		);
		setBar('goal', done / goal);
		const goalMessage = $(root!, '[data-goal-message]');
		goalMessage.textContent =
			done >= goal
				? 'Objectif du jour atteint. Vous pouvez vous arrêter là : la régularité compte plus que la quantité.'
				: done > 0
					? `Encore ${plural(goal - done, 'carte')} pour atteindre votre objectif, si vous en avez le temps.`
					: 'L’objectif est un repère, pas une obligation : mieux vaut un peu chaque jour que beaucoup une fois.';

		const history = $(root!, '[data-history]');
		history.replaceChildren();
		const activity = dailyActivity(cardIds, state.cards, day, 14);
		const peak = Math.max(1, ...activity.map((a) => a.known + a.forgotten));
		for (const a of activity) {
			const label = `${shortDate.format(dayKeyToDate(a.day))} : ${a.known} je savais, ${a.forgotten} à revoir`;
			const li = el('li', { attrs: { title: label } }, [el('span', { className: 'sr-only', text: label })]);
			const known = el('span', { className: 'lb-h-known' });
			known.style.height = `${(a.known / peak) * 100}%`;
			const forgotten = el('span', { className: 'lb-h-forgotten' });
			forgotten.style.height = `${(a.forgotten / peak) * 100}%`;
			li.append(known, forgotten);
			history.append(li);
		}

		const attention = cardsNeedingAttention(cardIds, state.cards);
		const attentionWrap = $(root!, '[data-attention]');
		const list = $(root!, '[data-attention-list]');
		list.replaceChildren();
		attentionWrap.hidden = attention.length === 0;
		for (const id of attention) {
			const card = byId.get(id)!;
			const p = state.cards[id]!;
			const button = el('button', { text: card.question, attrs: { type: 'button' } });
			button.addEventListener('click', () => showInBrowse(id));
			list.append(
				el('li', {}, [button, el('span', { className: 'lb-help', text: ` (oubliée ${plural(p.failureCount, 'fois', 'fois')}, boîte ${p.box})` })]),
			);
		}

		const due = stats.dueToday;
		$(root!, '[data-tab-meta="revision"]').textContent = due > 0 ? `${plural(due, 'carte')} à revoir` : 'rien à revoir';
		$(root!, '[data-tab-meta="decouverte"]').textContent =
			stats.newCount > 0 ? `${plural(stats.newCount, 'nouvelle carte', 'nouvelles cartes')}` : 'tout est découvert';
	}

	// ---------------------------------------------------------------- Onglets
	const tablist = $(root, '[data-tablist]');
	const tabs = [...tablist.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
	const sessionView = $(root, '[data-session]');

	function selectTab(tab: HTMLButtonElement, focus = false): void {
		for (const t of tabs) {
			const selected = t === tab;
			t.setAttribute('aria-selected', String(selected));
			t.tabIndex = selected ? 0 : -1;
			const panel = document.getElementById(t.getAttribute('aria-controls')!);
			if (panel) panel.hidden = !selected;
		}
		if (focus) tab.focus();
		renderModeStarts();
	}

	tabs.forEach((tab, i) => {
		tab.addEventListener('click', () => selectTab(tab));
		tab.addEventListener('keydown', (e) => {
			let next: number | null = null;
			if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % tabs.length;
			if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + tabs.length) % tabs.length;
			if (e.key === 'Home') next = 0;
			if (e.key === 'End') next = tabs.length - 1;
			if (next !== null) {
				e.preventDefault();
				selectTab(tabs[next], true);
			}
		});
	});

	function showStudyArea(inSession: boolean): void {
		tablist.hidden = inSession;
		for (const t of tabs) {
			const panel = document.getElementById(t.getAttribute('aria-controls')!);
			if (panel) panel.hidden = inSession || t.getAttribute('aria-selected') !== 'true';
		}
		sessionView.hidden = !inSession;
	}

	// ---------------------------------------------------------------- Écrans de démarrage
	function startBlock(message: string, actions: { label: string; primary?: boolean; onClick: () => void }[]): HTMLElement {
		const buttons = actions.map((a) => {
			const b = el('button', {
				className: `lb-btn ${a.primary ? 'lb-btn--primary' : 'lb-btn--ghost'}`,
				text: a.label,
				attrs: { type: 'button' },
			});
			b.addEventListener('click', a.onClick);
			return b;
		});
		return el('div', { className: 'lb-start' }, [el('p', { text: message }), el('div', { className: 'lb-start-actions' }, buttons)]);
	}

	function discoveryQueue(): string[] {
		const day = today();
		const category = (document.getElementById('discover-category') as HTMLSelectElement | null)?.value as LeitnerCategory | '';
		const allowance = Math.max(0, state.settings.newPerDay + extraNewToday - introducedOn(cardIds, state.cards, day));
		return introductionOrder(newCardIds(cardIds, state.cards), category ?? '').slice(0, allowance);
	}

	function renderModeStarts(): void {
		const day = today();
		const due = dueCardIds(cardIds, state.cards, day);
		const reviewStart = $(root!, '[data-mode-start="revision"]');
		const started = Object.keys(state.cards).some((id) => byId.has(id));
		if (due.length > 0) {
			reviewStart.replaceChildren(
				startBlock(`${plural(due.length, 'carte')} à revoir aujourd’hui. Comptez environ ${Math.max(1, Math.round(due.length * 0.75))} min.`, [
					{ label: 'Commencer la révision', primary: true, onClick: () => startSession('revision', due) },
				]),
			);
		} else {
			const next = nextDueDay(cardIds, state.cards, day);
			const nextCount = next ? dueCardIds(cardIds, state.cards, next).length : 0;
			const message = !started
				? 'Aucune carte à revoir : vous n’avez pas encore commencé. Passez par la Découverte pour faire entrer vos premières cartes dans la boîte 1.'
				: next
					? `Rien à réviser aujourd’hui : toutes vos cartes sont à jour. Prochaine révision ${longDate.format(dayKeyToDate(next))} (${plural(nextCount, 'carte')}). Vous pouvez découvrir de nouvelles cartes ou vous entraîner librement.`
					: 'Rien à réviser aujourd’hui. Vous pouvez découvrir de nouvelles cartes ou vous entraîner librement.';
			reviewStart.replaceChildren(
				startBlock(message, [
					{ label: 'Découvrir de nouvelles cartes', primary: !started, onClick: () => selectTab(tabs[1], true) },
					{ label: 'S’entraîner librement', onClick: () => selectTab(tabs[2], true) },
				]),
			);
		}

		const discoverStart = $(root!, '[data-mode-start="decouverte"]');
		const remaining = newCardIds(cardIds, state.cards).length;
		const introducedToday = introducedOn(cardIds, state.cards, day);
		const queue = discoveryQueue();
		if (remaining === 0) {
			discoverStart.replaceChildren(
				startBlock('Vous avez découvert toutes les cartes. Bravo ! Continuez la révision quotidienne pour les faire progresser jusqu’à la boîte 5.', [
					{ label: 'Aller à la révision', primary: true, onClick: () => selectTab(tabs[0], true) },
				]),
			);
		} else if (queue.length === 0) {
			const categoryEmpty = newCardIds(cardIds, state.cards).length > 0 && introductionOrder(newCardIds(cardIds, state.cards), ((document.getElementById('discover-category') as HTMLSelectElement | null)?.value ?? '') as LeitnerCategory | '').length === 0;
			discoverStart.replaceChildren(
				categoryEmpty
					? startBlock('Toutes les cartes de cette catégorie ont déjà été découvertes. Choisissez-en une autre.', [])
					: startBlock(
							`Vous avez découvert ${plural(introducedToday, 'carte')} aujourd’hui, comme prévu dans vos réglages. Il est conseillé d’en rester là pour ne pas surcharger les révisions des jours suivants.`,
							[
								{
									label: 'Ajouter 5 cartes quand même',
									onClick: () => {
										extraNewToday += 5;
										renderModeStarts();
									},
								},
							],
						),
			);
		} else {
			discoverStart.replaceChildren(
				startBlock(
					`${plural(queue.length, 'nouvelle carte', 'nouvelles cartes')} à découvrir aujourd’hui (${plural(remaining, 'carte')} encore jamais vue${remaining > 1 ? 's' : ''} au total).`,
					[{ label: 'Découvrir ces cartes', primary: true, onClick: () => startSession('decouverte', discoveryQueue()) }],
				),
			);
		}
		updatePracticeCount();
	}

	$(root, '#discover-category').addEventListener('change', renderModeStarts);

	// ---------------------------------------------------------------- Entraînement
	const practiceForm = $(root, '[data-practice-form]') as HTMLFormElement;
	function practiceSelection(): string[] {
		const data = new FormData(practiceForm);
		const category = String(data.get('category') ?? '');
		const difficulty = String(data.get('difficulty') ?? '');
		const skill = String(data.get('skill') ?? '');
		return cards
			.filter((c) => (!category || c.category === category) && (!difficulty || c.difficulty === difficulty) && (!skill || c.skill === skill))
			.map((c) => c.id);
	}
	function updatePracticeCount(): void {
		const n = practiceSelection().length;
		$(root!, '[data-practice-count]').textContent =
			n === 0 ? 'Aucune carte ne correspond à cette sélection.' : `${plural(n, 'carte correspond', 'cartes correspondent')} à cette sélection.`;
	}
	practiceForm.addEventListener('change', updatePracticeCount);
	practiceForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const selection = shuffle(practiceSelection());
		const size = Number(new FormData(practiceForm).get('size') ?? 10);
		if (selection.length === 0) return;
		startSession('entrainement', size > 0 ? selection.slice(0, size) : selection);
	});
	$(root, '[data-practice-preset="interpretation"]').addEventListener('click', () => {
		(practiceForm.elements.namedItem('category') as HTMLSelectElement).value = '';
		(practiceForm.elements.namedItem('difficulty') as HTMLSelectElement).value = 'avance';
		(practiceForm.elements.namedItem('skill') as HTMLSelectElement).value = 'comprendre';
		updatePracticeCount();
		practiceForm.requestSubmit();
	});

	// ---------------------------------------------------------------- Séance
	const questionEl = $(root, '[data-study-question]');
	const chipsEl = $(root, '[data-study-chips]');
	const hintWrap = $(root, '[data-study-hint-wrap]') as HTMLDetailsElement;
	const attempt = $(root, '[data-study-attempt]') as HTMLTextAreaElement;
	const revealRow = $(root, '[data-reveal-row]');
	const revealButton = $(root, '[data-reveal]') as HTMLButtonElement;
	const answerEl = $(root, '[data-answer]');
	const cardEl = $(root, '[data-study-card]');
	const summaryEl = $(root, '[data-summary]');

	function startSession(mode: Mode, queue: string[]): void {
		if (queue.length === 0) return;
		session = { mode, queue: [...queue], index: 0, requeued: new Set(), results: [], revealed: false };
		$(root!, '[data-session-title]').textContent = modeTitles[mode];
		showStudyArea(true);
		cardEl.hidden = false;
		summaryEl.hidden = true;
		renderCard();
		sessionView.scrollIntoView({ block: 'start', behavior: 'smooth' });
	}

	function currentCard(): LeitnerCard | null {
		if (!session || session.index >= session.queue.length) return null;
		return byId.get(session.queue[session.index]) ?? null;
	}

	function chip(text: string, className: string): HTMLElement {
		return el('span', { className: `lb-chip ${className}`, text });
	}

	function renderCard(): void {
		const card = currentCard();
		if (!session || !card) return finishSession();
		session.revealed = false;
		const p = state.cards[card.id];

		$(root!, '[data-session-progress]').textContent = `Carte ${session.index + 1} sur ${session.queue.length}`;
		setBar('session', session.index / session.queue.length);

		chipsEl.replaceChildren(
			chip(categoryShortLabels[card.category], `lb-chip--cat lb-cat-${card.category}`),
			chip(difficultyLabels[card.difficulty], `lb-chip--diff lb-diff-${card.difficulty}`),
			chip(skillLabels[card.skill], `lb-chip--skill-${card.skill}`),
			session.mode === 'entrainement'
				? chip('Entraînement : sans effet sur vos boîtes', 'lb-chip--practice')
				: chip(p ? `Boîte ${p.box}` : 'Nouvelle carte', 'lb-chip--box'),
		);
		chipsEl.setAttribute('aria-label', `${categoryLabels[card.category]}, niveau ${difficultyLabels[card.difficulty].toLowerCase()}`);

		questionEl.textContent = card.question;
		hintWrap.open = false;
		hintWrap.hidden = !card.hint;
		$(hintWrap, '[data-study-hint]').textContent = card.hint ?? '';
		attempt.value = '';
		revealRow.hidden = false;
		answerEl.hidden = true;

		// Réponse (préparée, mais masquée jusqu'au clic)
		$(answerEl, '[data-answer-text]').textContent = card.answer;
		const explanation = $(answerEl, '[data-answer-explanation]');
		explanation.textContent = card.explanation ?? '';
		explanation.hidden = !card.explanation;
		const quote = $(answerEl, '[data-answer-quote]');
		quote.hidden = !card.quotation;
		if (card.quotation) {
			$(quote, '[data-answer-quote-text]').textContent = `« ${card.quotation.text} »`;
			$(quote, '[data-answer-quote-cite]').textContent = `${card.quotation.speaker}, ch. ${card.quotation.chapter}`;
		}
		const meta = $(answerEl, '[data-answer-meta]');
		meta.replaceChildren();
		if (card.focus?.length) meta.append(el('div', {}, [el('dt', { text: 'Personnages / thèmes' }), el('dd', { text: card.focus.join(' · ') })]));
		if (card.reference) meta.append(el('div', {}, [el('dt', { text: 'Dans le roman' }), el('dd', { text: card.reference })]));
		meta.hidden = meta.childElementCount === 0;

		$(answerEl, '[data-assess-hint]').textContent =
			card.skill === 'comprendre'
				? 'Question de compréhension : choisissez « Je savais » seulement si vous avez su expliquer le sens, pas seulement donner un fait.'
				: 'Question de connaissance : « Je savais » si l’essentiel de votre réponse était juste.';

		if (session.mode === 'entrainement') {
			$(answerEl, '[data-assess-effect="known"]').textContent = 'pour le bilan de la séance';
			$(answerEl, '[data-assess-effect="forgotten"]').textContent = 'pour le bilan de la séance';
		} else {
			const from: BoxNumber = p?.box ?? 1;
			const up = nextBox(from, 'known');
			$(answerEl, '[data-assess-effect="known"]').textContent =
				up === from ? `reste en boîte ${up}, revue ${whenLabel(BOX_INTERVAL_DAYS[up])}` : `→ boîte ${up}, revue ${whenLabel(BOX_INTERVAL_DAYS[up])}`;
			$(answerEl, '[data-assess-effect="forgotten"]').textContent = '→ boîte 1, revue à la prochaine séance';
		}

		questionEl.focus({ preventScroll: true });
	}

	function reveal(): void {
		if (!session || session.revealed) return;
		session.revealed = true;
		revealRow.hidden = true;
		answerEl.hidden = false;
		$(answerEl, '[data-answer-title]').focus({ preventScroll: false });
	}
	revealButton.addEventListener('click', reveal);

	function assess(result: ReviewResult): void {
		const card = currentCard();
		if (!session || !card || !session.revealed) return;
		session.results.push({ id: card.id, result });

		if (session.mode !== 'entrainement') {
			const day = today();
			const before = state.cards[card.id] ?? createProgress(day);
			const after = reviewCard(before, result, day);
			state = { ...state, cards: { ...state.cards, [card.id]: after } };
			persist();
			announce(
				result === 'known'
					? `Carte placée en boîte ${after.box}, revue ${whenLabel(daysBetween(day, after.nextReview))}.`
					: 'Carte replacée en boîte 1.',
			);
			// Une carte oubliée revient une fois en fin de séance.
			if (result === 'forgotten' && !session.requeued.has(card.id)) {
				session.requeued.add(card.id);
				session.queue.push(card.id);
			}
			renderDashboard();
			refreshBrowseBadges();
		} else {
			announce(result === 'known' ? 'Noté : je savais.' : 'Noté : à revoir.');
		}

		session.index++;
		renderCard();
	}

	root.querySelectorAll<HTMLButtonElement>('[data-assess]').forEach((b) =>
		b.addEventListener('click', () => assess(b.dataset.assess as ReviewResult)),
	);

	function finishSession(): void {
		if (!session) return;
		const s = session;
		const known = s.results.filter((r) => r.result === 'known').length;
		const forgotten = s.results.length - known;
		cardEl.hidden = true;
		summaryEl.hidden = false;
		setBar('session', 1);
		$(root!, '[data-session-progress]').textContent = `${plural(s.results.length, 'carte évaluée', 'cartes évaluées')}`;
		$(summaryEl, '[data-summary-known]').textContent = String(known);
		$(summaryEl, '[data-summary-forgotten]').textContent = String(forgotten);

		const message = $(summaryEl, '[data-summary-message]');
		if (s.results.length === 0) message.textContent = 'Aucune carte évaluée pendant cette séance.';
		else if (forgotten === 0) message.textContent = 'Tout était su. Ces cartes reviendront plus tard, à intervalles de plus en plus longs.';
		else if (known >= forgotten)
			message.textContent = 'Bonne séance. Les cartes à revoir sont normales : c’est en les retrouvant souvent qu’elles finiront par se fixer.';
		else
			message.textContent =
				'Séance utile : chercher une réponse, même sans la trouver, aide à la retenir. Relisez les cartes ci-dessous avant de passer à autre chose.';

		const forgottenIds = [...new Set(s.results.filter((r) => r.result === 'forgotten').map((r) => r.id))];
		const list = $(summaryEl, '[data-summary-list]');
		list.replaceChildren(
			...forgottenIds.map((id) => {
				const b = el('button', { className: 'lb-linklike', text: byId.get(id)!.question, attrs: { type: 'button' } });
				b.addEventListener('click', () => {
					endSession();
					showInBrowse(id);
				});
				return el('li', {}, [b]);
			}),
		);
		$(summaryEl, '[data-summary-review-wrap]').hidden = forgottenIds.length === 0;

		const next = $(summaryEl, '[data-summary-next]');
		if (s.mode === 'entrainement') {
			next.textContent = 'Rappel : l’entraînement n’a pas modifié vos boîtes.';
		} else {
			const day = today();
			const dueLeft = dueCardIds(cardIds, state.cards, day).length;
			const nextDay = nextDueDay(cardIds, state.cards, day);
			next.textContent =
				dueLeft > 0
					? `Il reste ${plural(dueLeft, 'carte')} à revoir aujourd’hui (dont les cartes à revoir de cette séance).`
					: nextDay
						? `Prochaine révision ${longDate.format(dayKeyToDate(nextDay))}.`
						: '';
		}
		session = null;
		$(summaryEl, '#lb-summary-title').focus();
	}

	function endSession(): void {
		session = null;
		showStudyArea(false);
		renderModeStarts();
	}

	$(root, '[data-session-quit]').addEventListener('click', () => {
		if (session && session.results.length > 0) finishSession();
		else {
			endSession();
			tabs.find((t) => t.getAttribute('aria-selected') === 'true')?.focus();
		}
	});
	$(root, '[data-summary-back]').addEventListener('click', () => {
		endSession();
		tabs.find((t) => t.getAttribute('aria-selected') === 'true')?.focus();
	});

	// Raccourcis clavier : R (à revoir) et S (je savais) une fois la réponse affichée.
	document.addEventListener('keydown', (e) => {
		if (!session || !session.revealed || e.altKey || e.ctrlKey || e.metaKey) return;
		const target = e.target as HTMLElement | null;
		if (target && (target.closest('textarea, input, select') || target.isContentEditable)) return;
		const key = e.key.toLowerCase();
		if (key === 's') {
			e.preventDefault();
			assess('known');
		} else if (key === 'r') {
			e.preventDefault();
			assess('forgotten');
		}
	});

	// ---------------------------------------------------------------- Parcourir (lecture seule)
	const browseForm = $(root, '[data-browse-form]') as HTMLFormElement;
	const browseItems = [...root.querySelectorAll<HTMLLIElement>('[data-browse-list] > li')];
	const searchIndex = new Map(
		browseItems.map((li) => {
			const c = byId.get(li.dataset.cardId!)!;
			const text = [c.question, c.answer, c.explanation, c.hint, c.focus?.join(' '), c.quotation?.text].join(' ');
			return [li, normalize(text)];
		}),
	);

	function normalize(s: string): string {
		return s
			.toLowerCase()
			.normalize('NFD')
			.replace(/\p{Diacritic}/gu, '')
			.replace(/[’']/g, ' ');
	}

	function refreshBrowseBadges(): void {
		for (const li of browseItems) {
			const p = state.cards[li.dataset.cardId!];
			li.dataset.box = p ? String(p.box) : '0';
			li.dataset.status = cardStatus(p);
			const badge = li.querySelector<HTMLElement>('[data-box-chip]');
			if (badge) badge.textContent = p ? (p.box === 5 ? 'Boîte 5 · maîtrisée' : `Boîte ${p.box}`) : 'Nouvelle';
		}
		applyBrowseFilters();
	}

	function applyBrowseFilters(): void {
		const data = new FormData(browseForm);
		const f = (k: string) => String(data.get(k) ?? '');
		const words = normalize(f('search')).split(/\s+/).filter(Boolean);
		let shown = 0;
		for (const li of browseItems) {
			const visible =
				(!f('category') || li.dataset.category === f('category')) &&
				(!f('difficulty') || li.dataset.difficulty === f('difficulty')) &&
				(!f('box') || li.dataset.box === f('box')) &&
				(!f('status') || li.dataset.status === f('status')) &&
				words.every((w) => searchIndex.get(li)!.includes(w));
			li.hidden = !visible;
			if (visible) shown++;
		}
		$(root!, '[data-browse-count]').textContent = `${plural(shown, 'carte affichée', 'cartes affichées')} sur ${cards.length}`;
		$(root!, '[data-browse-empty]').hidden = shown > 0;
	}

	browseForm.addEventListener('input', applyBrowseFilters);
	browseForm.addEventListener('change', applyBrowseFilters);
	browseForm.addEventListener('reset', () => window.setTimeout(applyBrowseFilters, 0));
	browseForm.addEventListener('submit', (e) => e.preventDefault());

	function showInBrowse(id: string): void {
		browseForm.reset();
		applyBrowseFilters();
		selectTab(tabs[3]);
		const li = document.getElementById(`carte-${id}`);
		if (!li) return;
		const details = li.querySelector('details');
		if (details) details.open = true;
		li.classList.add('is-highlighted');
		window.setTimeout(() => li.classList.remove('is-highlighted'), 2500);
		li.scrollIntoView({ block: 'center' });
		li.querySelector<HTMLElement>('summary')?.focus({ preventScroll: true });
	}

	// ---------------------------------------------------------------- Réglages et réinitialisation
	root.querySelectorAll<HTMLSelectElement>('[data-setting]').forEach((select) => {
		const key = select.dataset.setting as keyof LeitnerSettings;
		select.value = String(state.settings[key]);
		if (select.value !== String(state.settings[key])) {
			select.append(el('option', { text: String(state.settings[key]), attrs: { value: String(state.settings[key]) } }));
			select.value = String(state.settings[key]);
		}
		select.addEventListener('change', () => {
			state = { ...state, settings: { ...state.settings, [key]: Number(select.value) } };
			persist();
			renderDashboard();
			renderModeStarts();
		});
	});

	const dialog = $(root, '[data-reset-dialog]') as HTMLDialogElement;
	function doReset(): void {
		state = resetState(store, STORAGE_KEY, state.settings);
		extraNewToday = 0;
		session = null;
		showStudyArea(false);
		renderAll();
		announce('Votre progression a été effacée.');
	}
	$(root, '[data-reset-open]').addEventListener('click', () => {
		if (typeof dialog.showModal === 'function') {
			dialog.returnValue = '';
			dialog.showModal();
		} else if (window.confirm('Effacer toute votre progression ? Cette action est définitive.')) {
			doReset();
		}
	});
	// Le bouton de confirmation efface tout de suite ; le formulaire (method="dialog") ferme ensuite la fenêtre.
	$(dialog, '[data-reset-confirm]').addEventListener('click', doReset);
	dialog.addEventListener('close', () => ($(root!, '[data-reset-open]') as HTMLButtonElement).focus());

	// Synchronisation entre onglets du navigateur.
	window.addEventListener('storage', (e) => {
		if (e.key !== STORAGE_KEY || session) return;
		state = loadState(store, STORAGE_KEY).state;
		renderAll();
	});

	// Si la page reste ouverte après minuit, les cartes du jour changent.
	let lastDay = today();
	document.addEventListener('visibilitychange', () => {
		if (document.visibilityState === 'visible' && today() !== lastDay && !session) {
			lastDay = today();
			extraNewToday = 0;
			renderAll();
		}
	});

	function renderAll(): void {
		renderDashboard();
		renderModeStarts();
		refreshBrowseBadges();
	}

	renderAll();
	root.dataset.ready = 'true';
}
