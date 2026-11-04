// ==========================================================================
// Boîte de Leitner de Pot-Bouille : interface (navigateur uniquement).
//
// La page est rendue statiquement par Astro ; ce module lit la progression
// locale, remplit l'écran d'accueil et la section « Voir ma progression »,
// et pilote les séances. Rien n'est hydraté : les valeurs qui dépendent de
// la progression sont affichées « – » au rendu, puis complétées ici.
//
// Principe d'interface : une seule action principale par écran, autour
// d'une boîte de fiches visible en permanence (bac des nouvelles + cinq
// compartiments). Pendant une séance, la boîte se réduit à une réglette et
// chaque évaluation y range la fiche : le mouvement affiché est toujours
// celui qui vient d'être enregistré.
// ==========================================================================

import {
	categoryShortLabels,
	difficultyLabels,
	potBouilleLeitnerCards,
	type LeitnerCard,
	type LeitnerCategory,
	type LeitnerDifficulty,
} from '../../data/pot-bouille-leitner';
import { boxIntervalLabel, boxPurpose } from './labels';
import {
	BOX_INTERVAL_DAYS,
	BOXES,
	cardStatus,
	cardsNeedingAttention,
	createProgress,
	dailyActivity,
	daysBetween,
	deckStats,
	dueCardIds,
	introducedOn,
	isDue,
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
	/** Questions oubliées déjà remises en fin de file pendant cette séance. */
	requeued: Set<string>;
	results: { id: string; result: ReviewResult }[];
	/** Déplacements réellement enregistrés pendant la séance (vide en entraînement). */
	moves: { from: Slot; to: BoxNumber }[];
	revealed: boolean;
}

/** Emplacement d'une fiche dans la boîte : le bac des nouvelles ou un compartiment. */
type Slot = 'new' | BoxNumber;

/**
 * Nombre de feuilles dessinées pour une pile de `n` fiches : une par fiche
 * jusqu'à 10, puis une croissance lente (la pile reste lisible à 100).
 */
export function sheetCount(n: number): number {
	if (n <= 0) return 0;
	if (n <= 10) return n;
	return Math.min(18, 10 + Math.round(Math.log2(n / 10) * 2.5));
}

function prefersReducedMotion(): boolean {
	return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const cards = potBouilleLeitnerCards;
const cardIds = cards.map((c) => c.id);
const byId = new Map(cards.map((c) => [c.id, c]));
const difficultyRank: Record<LeitnerDifficulty, number> = { facile: 0, intermediaire: 1, avance: 2 };

const modeTitles: Record<Mode, string> = {
	revision: 'Révision du jour',
	decouverte: 'Nouvelles questions',
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

/** « 1 question », « 3 questions » (0 et 1 au singulier, comme en français). */
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
	const out: string[] = [];
	for (const rank of [0, 1, 2]) {
		const byCat = new Map<string, LeitnerCard[]>();
		for (const c of pool) {
			if (difficultyRank[c.difficulty] !== rank) continue;
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
	const R = root;

	const store = getBrowserStore();
	const loaded = loadState(store, STORAGE_KEY);
	let state: LeitnerState = loaded.state;
	let session: Session | null = null;
	let extraNewToday = 0;

	const warning = $(R, '#lb-storage-warning');
	if (loaded.status === 'unavailable') {
		warning.hidden = false;
		warning.textContent =
			'Ce navigateur ne permet pas d’enregistrer ta progression (navigation privée ou stockage bloqué). Tu peux réviser, mais rien ne sera conservé après la fermeture de la page.';
	} else if (loaded.status === 'reset-malformed' || loaded.status === 'reset-unsupported-version') {
		warning.hidden = false;
		warning.textContent =
			'Ta progression enregistrée était illisible : une nouvelle progression a commencé (une copie de l’ancienne a été conservée dans le navigateur).';
	}

	function persist(): void {
		if (store && !saveState(store, STORAGE_KEY, state)) {
			warning.hidden = false;
			warning.textContent =
				'Impossible d’enregistrer ta progression (stockage plein ou bloqué). Ta séance continue, mais elle risque de ne pas être conservée.';
		}
	}

	const announcer = $(R, '[data-announcer]');
	function announce(message: string): void {
		announcer.textContent = '';
		window.setTimeout(() => (announcer.textContent = message), 30);
	}

	const home = $(R, '[data-home]');
	const secondary = $(R, '[data-secondary]');
	const sessionView = $(R, '[data-session]');
	const startButton = $(R, '[data-start]') as HTMLButtonElement;
	const homeMessage = $(R, '[data-home-message]');
	const practiceForm = $(R, '[data-practice-form]') as HTMLFormElement;
	const practiceChoice = $(R, '[data-choice="entrainement"]');
	const discoverSelect = $(R, '#discover-category') as HTMLSelectElement;

	// ---------------------------------------------------------------- Files d'attente
	function discoveryAllowance(): number {
		return Math.max(0, state.settings.newPerDay + extraNewToday - introducedOn(cardIds, state.cards, today()));
	}
	function discoveryQueue(): string[] {
		const category = discoverSelect.value as LeitnerCategory | '';
		return introductionOrder(newCardIds(cardIds, state.cards), category).slice(0, discoveryAllowance());
	}
	function hasStarted(): boolean {
		return Object.keys(state.cards).some((id) => byId.has(id));
	}

	/**
	 * L'action principale du moment : réviser, sinon découvrir, sinon s'entraîner.
	 * `kind` vaut « entrainement » quand le travail prévu pour aujourd'hui est terminé.
	 */
	function primaryAction(): { kind: Mode; label: string; run: () => void } {
		const due = dueCardIds(cardIds, state.cards, today());
		if (due.length > 0) return { kind: 'revision', label: 'Commencer ma révision', run: () => startSession('revision', due) };
		const queue = discoveryQueue();
		if (queue.length > 0)
			return {
				kind: 'decouverte',
				label: hasStarted() ? 'Découvrir de nouvelles questions' : 'Commencer ma révision',
				run: () => startSession('decouverte', discoveryQueue()),
			};
		return { kind: 'entrainement', label: 'S’entraîner librement', run: () => openPractice(true) };
	}

	// ---------------------------------------------------------------- Accueil
	function setLine(name: string, parts: (string | Node)[]): void {
		$(R, `[data-line="${name}"]`).replaceChildren(...parts);
	}

	function renderHome(): void {
		const day = today();
		const due = dueCardIds(cardIds, state.cards, day).length;
		const remaining = newCardIds(cardIds, state.cards).length;
		const allowance = Math.min(discoveryAllowance(), remaining);
		const mastered = deckStats(cardIds, state.cards, day).mastered;

		if (due > 0) {
			setLine('due', [el('strong', { text: String(due) }), ` ${due > 1 ? 'questions' : 'question'} à revoir aujourd’hui`]);
		} else if (hasStarted()) {
			const next = nextDueDay(cardIds, state.cards, day);
			setLine('due', [
				next ? `Rien à revoir aujourd’hui · prochaine révision ${longDate.format(dayKeyToDate(next))}` : 'Rien à revoir aujourd’hui',
			]);
		} else {
			setLine('due', ['Aucune question à revoir pour l’instant']);
		}

		if (allowance > 0) {
			setLine('new', [
				el('strong', { text: String(allowance) }),
				` ${allowance > 1 ? 'nouvelles questions disponibles' : 'nouvelle question disponible'}`,
			]);
		} else if (remaining > 0) {
			setLine('new', ['Nouvelles questions : c’est fait pour aujourd’hui']);
		} else {
			setLine('new', ['Toutes les questions ont été découvertes']);
		}
		setLine('mastered', [el('strong', { text: String(mastered) }), ` ${mastered > 1 ? 'questions maîtrisées' : 'question maîtrisée'}`]);

		startButton.textContent = primaryAction().label;
		updatePracticeCount();
	}

	startButton.addEventListener('click', () => {
		hideMessage();
		primaryAction().run();
	});

	function showMessage(text: string, actions: { label: string; onClick: () => void }[] = []): void {
		const buttons = actions.map((a, i) => {
			const b = el('button', {
				className: i === 0 ? 'lb-btn lb-btn--secondary' : 'lb-linklike',
				text: a.label,
				attrs: { type: 'button' },
			});
			b.addEventListener('click', a.onClick);
			return b;
		});
		homeMessage.replaceChildren(el('p', { text }), el('div', { className: 'lb-message-actions' }, buttons));
		homeMessage.hidden = false;
	}
	function hideMessage(): void {
		homeMessage.hidden = true;
		homeMessage.replaceChildren();
	}

	function openPractice(open: boolean): void {
		practiceForm.hidden = !open;
		practiceChoice.setAttribute('aria-expanded', String(open));
		if (open) {
			hideMessage();
			updatePracticeCount();
			(practiceForm.querySelector('select') as HTMLSelectElement | null)?.focus();
		}
	}

	$(R, '[data-choice="revision"]').addEventListener('click', () => {
		openPractice(false);
		const due = dueCardIds(cardIds, state.cards, today());
		if (due.length > 0) return startSession('revision', due);
		const next = nextDueDay(cardIds, state.cards, today());
		showMessage(
			!hasStarted()
				? 'Aucune question à revoir pour l’instant : commence par découvrir quelques questions.'
				: next
					? `Rien à revoir aujourd’hui. Ta prochaine révision est prévue ${longDate.format(dayKeyToDate(next))}.`
					: 'Rien à revoir aujourd’hui.',
			[
				{ label: 'Découvrir de nouvelles questions', onClick: () => $(R, '[data-choice="decouverte"]').click() },
				{ label: 'ou s’entraîner librement', onClick: () => openPractice(true) },
			],
		);
	});

	$(R, '[data-choice="decouverte"]').addEventListener('click', () => {
		openPractice(false);
		const queue = discoveryQueue();
		if (queue.length > 0) return startSession('decouverte', queue);
		const remaining = newCardIds(cardIds, state.cards).length;
		if (remaining === 0) {
			showMessage('Tu as découvert toutes les questions. Continue à réviser chaque jour pour les retenir durablement.', [
				{ label: 'S’entraîner librement', onClick: () => openPractice(true) },
			]);
		} else if (introductionOrder(newCardIds(cardIds, state.cards), discoverSelect.value as LeitnerCategory | '').length === 0) {
			showMessage('Toutes les questions du thème choisi dans les réglages ont déjà été découvertes.', [
				{
					label: 'Découvrir tous les thèmes',
					onClick: () => {
						discoverSelect.value = '';
						$(R, '[data-choice="decouverte"]').click();
					},
				},
			]);
		} else {
			showMessage(
				`Tu as découvert ${plural(introducedOn(cardIds, state.cards, today()), 'nouvelle question', 'nouvelles questions')} aujourd’hui. C’est suffisant : en ajouter trop chargerait tes prochaines révisions.`,
				[
					{
						label: 'En ajouter 5 quand même',
						onClick: () => {
							extraNewToday += 5;
							hideMessage();
							renderHome();
							startSession('decouverte', discoveryQueue());
						},
					},
				],
			);
		}
	});

	practiceChoice.addEventListener('click', () => openPractice(practiceForm.hidden));

	// ---------------------------------------------------------------- La boîte
	const intro = $(R, '[data-intro]');
	const slotButtons = [...R.querySelectorAll<HTMLButtonElement>('[data-compartment]')];
	const slotEl = (slot: Slot) => $(R, `[data-compartment="${slot}"]`) as HTMLButtonElement;
	const drawer = $(R, '[data-drawer]');
	let selectedSlot: Slot | null = null;

	function slotOf(id: string): Slot {
		return state.cards[id]?.box ?? 'new';
	}

	/** Pile de feuilles d'un compartiment ; les fiches à revoir sont sur le dessus, avec un onglet. */
	function renderStack(stack: HTMLElement, total: number, due: number): void {
		const n = sheetCount(total);
		const d = due === 0 ? 0 : Math.min(n, Math.max(1, Math.round((n * due) / total)));
		stack.style.setProperty('--n', String(Math.max(1, n)));
		const sheets: HTMLElement[] = [];
		for (let i = 0; i < n; i++) {
			const sheet = el('span', { className: i >= n - d ? 'lb-sheet is-due' : 'lb-sheet' });
			sheet.style.setProperty('--i', String(i));
			sheets.push(sheet);
		}
		stack.replaceChildren(...sheets);
		stack.closest('.lb-slot')!.classList.toggle('is-empty', total === 0);
	}

	/** « 12 fiches », le mot dans un élément à part (masqué sur la réglette mobile). */
	function setCount(node: HTMLElement, n: number): void {
		node.replaceChildren(String(n), el('span', { className: 'lb-unit', text: n > 1 ? ' fiches' : ' fiche' }));
	}

	function renderBox(): void {
		const day = today();
		const total: Record<BoxNumber, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
		const due: Record<BoxNumber, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
		for (const id of cardIds) {
			const p = state.cards[id];
			if (!p) continue;
			total[p.box]++;
			if (isDue(p, day)) due[p.box]++;
		}

		const remaining = newCardIds(cardIds, state.cards).length;
		const allowance = Math.min(discoveryAllowance(), remaining);
		const intake = slotEl('new');
		renderStack($(intake, '[data-stack]'), remaining, allowance);
		setCount($(intake, '[data-slot-count]'), remaining);
		const intakeFlag = $(intake, '[data-slot-flag]');
		intakeFlag.hidden = allowance === 0;
		intakeFlag.textContent = `${allowance} à découvrir`;
		intake.dataset.due = String(allowance > 0);
		intake.setAttribute(
			'aria-label',
			`Nouvelles fiches, jamais vues : ${plural(remaining, 'fiche')}${allowance > 0 ? `, dont ${allowance} à découvrir aujourd’hui` : ''}`,
		);

		for (const b of BOXES) {
			const slot = slotEl(b);
			renderStack($(slot, '[data-stack]'), total[b], due[b]);
			setCount($(slot, '[data-slot-count]'), total[b]);
			const flag = $(slot, '[data-slot-flag]');
			flag.hidden = due[b] === 0;
			flag.replaceChildren(String(due[b]), el('span', { className: 'lb-flag-word', text: ' à revoir' }));
			slot.dataset.due = String(due[b] > 0);
			slot.setAttribute(
				'aria-label',
				`Compartiment ${b}, révision ${boxIntervalLabel(b)} : ${plural(total[b], 'fiche')}${due[b] > 0 ? `, dont ${due[b]} à revoir aujourd’hui` : ''}`,
			);
		}
		if (selectedSlot !== null && !drawer.hidden) renderDrawer();
	}

	function relativeDay(day: DayKey): string {
		const n = daysBetween(today(), day);
		if (n <= 0) return 'aujourd’hui';
		if (n === 1) return 'demain';
		return `${longDate.format(dayKeyToDate(day))} (dans ${n} jours)`;
	}

	function drawerItem(id: string, status: string, isDueNow: boolean): HTMLLIElement {
		const card = byId.get(id)!;
		const p = state.cards[id];
		const qId = `drawer-q-${id}`;
		const open = el('button', {
			className: 'lb-linklike',
			text: 'Voir la fiche complète',
			attrs: { type: 'button', 'aria-describedby': qId },
		});
		open.addEventListener('click', () => showInBrowse(id));
		const meta = p
			? `${categoryShortLabels[card.category]} · ${difficultyLabels[card.difficulty]} · sue ${plural(p.successCount, 'fois', 'fois')}, oubliée ${plural(p.failureCount, 'fois', 'fois')}`
			: `${categoryShortLabels[card.category]} · ${difficultyLabels[card.difficulty]}`;
		return el('li', { className: 'lb-drawer-card', attrs: { 'data-due': String(isDueNow), 'data-card-id': id } }, [
			el('p', { className: 'lb-drawer-status' }, [
				el('span', { className: 'lb-due-mark', text: isDueNow ? '⚑' : '◷', attrs: { 'aria-hidden': 'true' } }),
				` ${status}`,
			]),
			el('p', { className: 'lb-drawer-q', text: card.question, attrs: { id: qId } }),
			el('p', { className: 'lb-drawer-meta', text: meta }),
			open,
		]);
	}

	function renderDrawer(): void {
		const slot = selectedSlot;
		if (slot === null) return;
		const title = $(drawer, '[data-drawer-title]');
		const summary = $(drawer, '[data-drawer-summary]');
		const list = $(drawer, '[data-drawer-list]');
		const day = today();

		if (slot === 'new') {
			const remaining = newCardIds(cardIds, state.cards).length;
			const queue = discoveryQueue();
			title.textContent = 'Nouvelles fiches';
			summary.textContent =
				remaining === 0
					? 'Le bac est vide : tu as découvert toutes les questions.'
					: `${plural(remaining, 'fiche jamais vue', 'fiches jamais vues')}. ` +
						(queue.length > 0
							? `${queue.length > 1 ? `Les ${queue.length} prochaines` : 'La prochaine'} à découvrir aujourd’hui :`
							: 'Plus de nouvelle fiche prévue aujourd’hui : reviens demain.');
			list.replaceChildren(...queue.map((id) => drawerItem(id, 'À découvrir aujourd’hui', true)));
			return;
		}

		const ids = cardIds
			.filter((id) => state.cards[id]?.box === slot)
			.sort((a, b) => daysBetween(state.cards[b]!.nextReview, state.cards[a]!.nextReview));
		const dueCount = ids.filter((id) => isDue(state.cards[id]!, day)).length;
		title.textContent = `Compartiment ${slot} · révision ${boxIntervalLabel(slot)}`;
		summary.textContent =
			ids.length === 0
				? `Ce compartiment est vide pour l’instant. ${
						slot === 1
							? 'Les nouvelles fiches et les questions à revoir y arrivent.'
							: `Une fiche y arrive depuis le compartiment ${slot - 1} quand tu la sais.`
					}`
				: `${plural(ids.length, 'fiche')}, dont ${dueCount} à revoir aujourd’hui. ${boxPurpose[slot]}.`;
		list.replaceChildren(
			...ids.map((id) => {
				const p = state.cards[id]!;
				const dueNow = isDue(p, day);
				return drawerItem(id, dueNow ? 'À revoir aujourd’hui' : `Prochaine révision : ${relativeDay(p.nextReview)}`, dueNow);
			}),
		);
	}

	function selectSlot(slot: Slot | null): void {
		selectedSlot = slot;
		for (const b of slotButtons) b.setAttribute('aria-expanded', String(slot !== null && b.dataset.compartment === String(slot)));
		drawer.hidden = slot === null;
		if (slot !== null) renderDrawer();
	}

	for (const button of slotButtons) {
		button.addEventListener('click', () => {
			if (R.dataset.view === 'session') return;
			const slot: Slot = button.dataset.compartment === 'new' ? 'new' : (Number(button.dataset.compartment) as BoxNumber);
			selectSlot(selectedSlot === slot ? null : slot);
		});
	}
	$(drawer, '[data-drawer-close]').addEventListener('click', () => {
		const previous = selectedSlot;
		selectSlot(null);
		if (previous !== null) slotEl(previous).focus();
	});
	drawer.addEventListener('keydown', (e) => {
		if (e.key !== 'Escape' || selectedSlot === null) return;
		const previous = selectedSlot;
		selectSlot(null);
		slotEl(previous).focus();
	});

	/** Fiche qui vole de la carte vers son compartiment d'arrivée (rien si l'utilisateur limite les animations). */
	function flyToSlot(from: DOMRect, to: Slot): void {
		const target = slotEl(to);
		target.classList.remove('is-receiving');
		void target.offsetWidth; // relance l'animation si la même cible reçoit deux fiches de suite
		target.classList.add('is-receiving');
		window.setTimeout(() => target.classList.remove('is-receiving'), 900);
		if (prefersReducedMotion() || typeof document.body.animate !== 'function' || from.width === 0) return;

		const well = target.querySelector('.lb-slot-well')!.getBoundingClientRect();
		const w = Math.min(150, from.width * 0.45);
		const h = w * 0.62;
		const sx = from.left + from.width / 2;
		const sy = Math.min(Math.max(from.top + h, h), window.innerHeight - h);
		const ex = well.left + well.width / 2;
		const ey = well.top + well.height / 2;
		const ghost = el('div', { className: 'lb-ghost', attrs: { 'aria-hidden': 'true' } });
		Object.assign(ghost.style, { left: `${sx - w / 2}px`, top: `${sy - h / 2}px`, width: `${w}px`, height: `${h}px` });
		document.body.append(ghost);
		const animation = ghost.animate(
			[
				{ transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1 },
				{ transform: `translate(${(ex - sx) * 0.6}px, ${(ey - sy) * 0.6 - 24}px) scale(0.55) rotate(-3deg)`, opacity: 1, offset: 0.6 },
				{ transform: `translate(${ex - sx}px, ${ey - sy}px) scale(0.22) rotate(-6deg)`, opacity: 0 },
			],
			{ duration: 480, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
		);
		animation.onfinish = animation.oncancel = () => ghost.remove();
	}

	// ---------------------------------------------------------------- Entraînement
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
		$(R, '[data-practice-count]').textContent =
			n === 0 ? 'Aucune question ne correspond à ce choix.' : `${plural(n, 'question correspond', 'questions correspondent')} à ce choix.`;
	}
	practiceForm.addEventListener('change', updatePracticeCount);
	/** Lance un entraînement libre avec les choix du formulaire (par défaut : 10 questions, tous thèmes). */
	function startPractice(): void {
		const selection = shuffle(practiceSelection());
		const size = Number(new FormData(practiceForm).get('size') ?? 10);
		if (selection.length === 0) return;
		startSession('entrainement', size > 0 ? selection.slice(0, size) : selection);
	}
	practiceForm.addEventListener('submit', (e) => {
		e.preventDefault();
		startPractice();
	});
	$(R, '[data-practice-preset="interpretation"]').addEventListener('click', () => {
		(practiceForm.elements.namedItem('category') as HTMLSelectElement).value = '';
		(practiceForm.elements.namedItem('difficulty') as HTMLSelectElement).value = 'avance';
		(practiceForm.elements.namedItem('skill') as HTMLSelectElement).value = 'comprendre';
		updatePracticeCount();
		practiceForm.requestSubmit();
	});

	// ---------------------------------------------------------------- Séance
	const questionEl = $(R, '[data-study-question]');
	const hintWrap = $(R, '[data-study-hint-wrap]') as HTMLDetailsElement;
	const attempt = $(R, '[data-study-attempt]') as HTMLTextAreaElement;
	const attemptWrap = attempt.closest('details') as HTMLDetailsElement;
	const revealRow = $(R, '[data-reveal-row]');
	const revealButton = $(R, '[data-reveal]') as HTMLButtonElement;
	const answerEl = $(R, '[data-answer]');
	const assessGroup = $(R, '[data-assess-group]');
	const cardEl = $(R, '[data-study-card]');
	const indexCard = $(R, '[data-index-card]');
	const frontFace = $(R, '[data-face-front]');
	const summaryEl = $(R, '[data-summary]');
	const feedback = $(R, '[data-feedback]');
	const movement = $(R, '[data-movement]');
	const boxSection = $(R, '[data-box-section]');

	/** Relance une animation CSS décorative (sans effet si les animations sont réduites, voir la feuille de style). */
	function replayClass(node: HTMLElement, className: string): void {
		node.classList.remove(className);
		void node.offsetWidth;
		node.classList.add(className);
	}
	indexCard.addEventListener('animationend', () => indexCard.classList.remove('is-turning', 'is-drawn'));

	/** « à la prochaine séance », « demain », « dans 3 jours » : quand reviendra une fiche rangée aujourd'hui. */
	function returnsIn(box: BoxNumber): string {
		const days = BOX_INTERVAL_DAYS[box];
		return days === 0 ? 'à la prochaine séance' : days === 1 ? 'demain' : `dans ${days} jours`;
	}

	/** Phrase qui décrit le déplacement réellement enregistré. */
	function movementText(from: Slot, to: BoxNumber, result: ReviewResult): string {
		if (result === 'known') {
			return from === to
				? `Fiche laissée dans le compartiment ${to}, le dernier : elle reviendra ${returnsIn(to)}.`
				: `Fiche rangée dans le compartiment ${to} : elle reviendra ${returnsIn(to)}.`;
		}
		if (from === 'new') return 'Fiche rangée dans le compartiment 1, celui des questions qui reviennent à chaque séance.';
		if (from === 1) return 'La fiche reste dans le compartiment 1 : elle reviendra à chaque séance jusqu’à ce que tu la saches.';
		return `Fiche replacée dans le compartiment 1 : une question oubliée recommence au début, pour revenir plus souvent.`;
	}

	function setBar(name: string, ratio: number): void {
		const bar = R.querySelector<HTMLElement>(`[data-bar="${name}"]`);
		if (!bar) return;
		const pct = Math.max(0, Math.min(100, Math.round(ratio * 100)));
		bar.style.setProperty('--value', `${pct}%`);
		if (bar.getAttribute('role') === 'progressbar') bar.setAttribute('aria-valuenow', String(pct));
	}

	function setFeedback(text: string, tone: ReviewResult | '' = ''): void {
		feedback.textContent = text;
		if (tone) feedback.dataset.tone = tone;
		else delete feedback.dataset.tone;
	}

	/**
	 * Accueil ou séance. Pendant la séance, la boîte reste affichée, réduite à
	 * une réglette (consultation désactivée) : on y voit les fiches se ranger.
	 */
	function showSessionView(inSession: boolean): void {
		R.dataset.view = inSession ? 'session' : 'home';
		intro.hidden = inSession;
		home.hidden = inSession;
		secondary.hidden = inSession;
		sessionView.hidden = !inSession;
		if (inSession) selectSlot(null);
		for (const b of slotButtons) {
			b.disabled = inSession;
			if (!inSession) b.classList.remove('is-source');
		}
	}

	function setSourceSlot(slot: Slot | null): void {
		for (const b of slotButtons) b.classList.toggle('is-source', slot !== null && b.dataset.compartment === String(slot));
	}

	function startSession(mode: Mode, queue: string[]): void {
		if (queue.length === 0) return;
		session = { mode, queue: [...queue], index: 0, requeued: new Set(), results: [], moves: [], revealed: false };
		$(R, '[data-session-title]').textContent = modeTitles[mode];
		$(R, '[data-practice-note]').hidden = mode !== 'entrainement';
		hideMessage();
		setFeedback('');
		movement.textContent = '';
		showSessionView(true);
		cardEl.hidden = false;
		summaryEl.hidden = true;
		renderCard();
		boxSection.scrollIntoView({ block: 'start' });
	}

	function currentCard(): LeitnerCard | null {
		if (!session || session.index >= session.queue.length) return null;
		return byId.get(session.queue[session.index]) ?? null;
	}

	function renderCard(): void {
		const card = currentCard();
		if (!session || !card) return finishSession();
		session.revealed = false;

		const topic = card.focus?.[0];
		$(R, '[data-study-eyebrow]').textContent = topic
			? `${categoryShortLabels[card.category]} · ${topic}`
			: categoryShortLabels[card.category];
		$(R, '[data-session-progress]').textContent =
			`Question ${session.index + 1} sur ${session.queue.length} · ${difficultyLabels[card.difficulty]}`;
		setBar('session', session.index / session.queue.length);

		// D'où vient la fiche : le bac des nouvelles ou un compartiment (repéré aussi sur la réglette).
		const from = slotOf(card.id);
		setSourceSlot(from);
		$(R, '[data-card-origin]').textContent = from === 'new' ? 'Nouvelle fiche' : `Compartiment ${from}`;
		const fromBox: BoxNumber = from === 'new' ? 1 : from;
		const scheduled = session.mode !== 'entrainement';
		const destKnown = nextBox(fromBox, 'known');
		$(R, '[data-assess-dest="known"]').textContent = !scheduled
			? ''
			: destKnown === from
				? `reste au compartiment ${destKnown}`
				: `→ compartiment ${destKnown}`;
		$(R, '[data-assess-dest="forgotten"]').textContent = !scheduled ? '' : from === 1 ? 'reste au compartiment 1' : '→ compartiment 1';

		questionEl.textContent = card.question;
		hintWrap.open = false;
		hintWrap.hidden = !card.hint;
		$(hintWrap, '[data-study-hint]').textContent = card.hint ?? '';
		attempt.value = '';
		attemptWrap.open = false;
		revealRow.hidden = false;
		frontFace.hidden = false;
		answerEl.hidden = true;
		assessGroup.hidden = true;
		indexCard.dataset.side = 'front';
		replayClass(indexCard, 'is-drawn');

		// Verso préparé, masqué jusqu'au clic.
		$(answerEl, '[data-answer-question]').textContent = card.question;
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
		const reference = $(answerEl, '[data-answer-reference]');
		reference.textContent = card.reference ? `Dans le roman : ${card.reference}` : '';
		reference.hidden = !card.reference;
		$(assessGroup, '[data-assess-hint]').hidden = card.skill !== 'comprendre';

		questionEl.focus({ preventScroll: true });
	}

	/** Retourne la fiche : le verso (réponse) remplace le recto ; l'animation est purement visuelle. */
	function reveal(): void {
		if (!session || session.revealed) return;
		session.revealed = true;
		revealRow.hidden = true;
		frontFace.hidden = true;
		answerEl.hidden = false;
		assessGroup.hidden = false;
		indexCard.dataset.side = 'back';
		indexCard.classList.remove('is-drawn');
		replayClass(indexCard, 'is-turning');
		$(answerEl, '[data-answer-title]').focus({ preventScroll: false });
	}
	revealButton.addEventListener('click', reveal);

	function assess(result: ReviewResult): void {
		const card = currentCard();
		if (!session || !card || !session.revealed) return;
		session.results.push({ id: card.id, result });
		const cardRect = indexCard.getBoundingClientRect();

		if (session.mode === 'entrainement') {
			setFeedback(result === 'known' ? 'Bien joué.' : 'Pas grave. Relis bien la réponse, elle finira par rentrer.', result);
			movement.textContent = 'Entraînement libre : la fiche reste dans son compartiment.';
		} else {
			const day = today();
			const from = slotOf(card.id);
			const before = state.cards[card.id] ?? createProgress(day);
			const after = reviewCard(before, result, day);
			state = { ...state, cards: { ...state.cards, [card.id]: after } };
			persist();
			// Le mouvement affiché est lu dans l'état enregistré, jamais supposé.
			const to = after.box;
			session.moves.push({ from, to });
			movement.textContent = movementText(from, to, result);
			if (result === 'known') {
				setFeedback('Bien joué. Cette question reviendra plus tard.', 'known');
			} else if (!session.requeued.has(card.id)) {
				// Une question oubliée revient une fois en fin de séance.
				session.requeued.add(card.id);
				session.queue.push(card.id);
				setFeedback('Pas grave. Tu la retrouveras en fin de séance.', 'forgotten');
			} else {
				setFeedback('Pas grave. Elle reviendra à ta prochaine révision.', 'forgotten');
			}
			renderAll();
			flyToSlot(cardRect, to);
		}

		session.index++;
		renderCard();
	}

	R.querySelectorAll<HTMLButtonElement>('[data-assess]').forEach((b) =>
		b.addEventListener('click', () => assess(b.dataset.assess as ReviewResult)),
	);

	function finishSession(): void {
		if (!session) return;
		const s = session;
		const known = s.results.filter((r) => r.result === 'known').length;
		const forgotten = s.results.length - known;
		cardEl.hidden = true;
		summaryEl.hidden = false;
		setFeedback('');
		movement.textContent = '';
		setSourceSlot(null);
		setBar('session', 1);

		// Ce que la séance a changé dans la boîte (déplacements enregistrés uniquement).
		const advanced = s.moves.filter((m) => m.from === 'new' ? m.to > 1 : m.to > m.from).length;
		const back = s.moves.filter((m) => m.to === 1).length;
		const kept = s.moves.filter((m) => m.from === 5 && m.to === 5).length;
		const parts = [
			advanced > 0 ? plural(advanced, 'fiche a avancé', 'fiches ont avancé') : '',
			back > 0 ? `${back} ${back > 1 ? 'sont rangées' : 'est rangée'} au compartiment 1` : '',
			kept > 0 ? `${kept} ${kept > 1 ? 'restent' : 'reste'} au compartiment 5` : '',
		].filter(Boolean);
		const movesEl = $(summaryEl, '[data-summary-moves]');
		movesEl.hidden = parts.length === 0;
		movesEl.textContent = parts.length ? `Dans ta boîte : ${parts.join(', ')}.` : '';
		$(R, '[data-session-progress]').textContent = '';
		$(summaryEl, '[data-summary-total]').textContent = String(s.results.length);
		$(summaryEl, '[data-summary-known]').textContent = String(known);
		$(summaryEl, '[data-summary-forgotten]').textContent = String(forgotten);

		const next = primaryAction();
		const dayComplete = next.kind === 'entrainement';

		let message: string;
		if (dayComplete)
			message = 'Tu as terminé les questions prévues pour aujourd’hui. Tu peux continuer à t’entraîner librement si tu le souhaites.';
		else if (s.results.length === 0) message = 'Aucune question révisée cette fois-ci.';
		else if (forgotten === 0) message = 'Tout était su. Ces questions reviendront plus tard, de plus en plus espacées.';
		else if (known >= forgotten) message = 'Bonne séance. Les questions à revoir reviendront vite : c’est comme ça qu’on les retient.';
		else message = 'Séance utile : chercher une réponse, même sans la trouver, aide à la retenir.';
		$(summaryEl, '[data-summary-message]').textContent = message;
		$(summaryEl, '[data-summary-saved]').textContent =
			s.mode === 'entrainement'
				? 'L’entraînement n’a pas modifié ta progression.'
				: 'Ta progression est enregistrée : tu peux t’arrêter quand tu veux.';

		const continueButton = $(summaryEl, '[data-summary-continue]');
		continueButton.textContent =
			next.kind === 'revision' ? 'Continuer à réviser' : dayComplete ? 'Continuer à m’entraîner' : next.label;
		continueButton.dataset.next = next.kind;

		session = null;
		$(summaryEl, '#lb-summary-title').focus();
	}

	function endSession(): void {
		session = null;
		showSessionView(false);
		renderAll();
		startButton.focus({ preventScroll: true });
		home.scrollIntoView({ block: 'start' });
	}

	$(R, '[data-session-quit]').addEventListener('click', () => {
		if (session && session.results.length > 0) finishSession();
		else endSession();
	});
	$(R, '[data-summary-back]').addEventListener('click', endSession);
	$(R, '[data-summary-continue]').addEventListener('click', () => {
		const next = primaryAction();
		// Travail du jour terminé : entraînement libre immédiat, sans effet sur la progression.
		if (next.kind === 'entrainement') return startPractice();
		showSessionView(false);
		renderAll();
		next.run();
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

	// ---------------------------------------------------------------- Statistiques (section secondaire)
	function setStat(name: string, value: string): void {
		R.querySelectorAll<HTMLElement>(`[data-stat="${name}"]`).forEach((n) => (n.textContent = value));
	}

	function renderStats(): void {
		const day = today();
		const stats = deckStats(cardIds, state.cards, day);
		setStat('total', String(stats.total));
		setStat('due', String(stats.dueToday));
		setStat('new', String(stats.newCount));
		setStat('mastered', String(stats.mastered));
		setStat('progress', `${Math.round(stats.progress * 100)} %`);
		setBar('progress', stats.progress);

		// Barres à l'échelle de la boîte la plus remplie ; les questions jamais vues sont comptées à part.
		const max = Math.max(1, ...BOXES.map((b) => stats.boxes[b]));
		$(R, '.lb-dist-new-line').replaceChildren(
			el('strong', { text: String(stats.newCount) }),
			` ${stats.newCount > 1 ? 'questions jamais vues' : 'question jamais vue'}, dans le bac des nouvelles.`,
		);
		BOXES.forEach((b) => {
			const n = stats.boxes[b];
			const count = R.querySelector<HTMLElement>(`[data-dist="${b}"]`);
			if (!count) return;
			count.textContent = String(n);
			const col = count.closest('li')!;
			col.setAttribute('aria-label', `Compartiment ${b} : ${plural(n, 'question')}`);
			col.querySelector<HTMLElement>('.lb-dist-fill')?.style.setProperty('--value', `${(n / max) * 100}%`);
		});

		const done = reviewsOn(cardIds, state.cards, day);
		const goal = state.settings.dailyGoal;
		$(R, '[data-goal-text]').replaceChildren(
			el('strong', { text: plural(done, 'question évaluée', 'questions évaluées') }),
			` aujourd’hui, sur un objectif de ${goal}.`,
		);
		setBar('goal', done / goal);
		$(R, '[data-goal-message]').textContent =
			done >= goal
				? 'Objectif du jour atteint. Tu peux t’arrêter là : la régularité compte plus que la quantité.'
				: 'L’objectif est un repère, pas une obligation : mieux vaut un peu chaque jour que beaucoup une fois.';

		const history = $(R, '[data-history]');
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
		$(R, '[data-attention]').hidden = attention.length === 0;
		$(R, '[data-attention-list]').replaceChildren(
			...attention.map((id) => {
				const button = el('button', { className: 'lb-linklike', text: byId.get(id)!.question, attrs: { type: 'button' } });
				button.addEventListener('click', () => showInBrowse(id));
				return el('li', {}, [button]);
			}),
		);
	}

	// ---------------------------------------------------------------- Toutes les questions (lecture seule)
	const browseFold = $(R, '[data-fold="browse"]') as HTMLDetailsElement;
	const browseForm = $(R, '[data-browse-form]') as HTMLFormElement;
	const browseItems = [...R.querySelectorAll<HTMLLIElement>('[data-browse-list] > li')];
	const normalize = (s: string) =>
		s
			.toLowerCase()
			.normalize('NFD')
			.replace(/\p{Diacritic}/gu, '')
			.replace(/[’']/g, ' ');
	const searchIndex = new Map(
		browseItems.map((li) => {
			const c = byId.get(li.dataset.cardId!)!;
			return [li, normalize([c.question, c.answer, c.explanation, c.hint, c.focus?.join(' '), c.quotation?.text].join(' '))];
		}),
	);

	function refreshBrowseBadges(): void {
		for (const li of browseItems) {
			const p = state.cards[li.dataset.cardId!];
			li.dataset.box = p ? String(p.box) : '0';
			li.dataset.status = cardStatus(p);
			const badge = li.querySelector<HTMLElement>('[data-box-chip]');
			if (badge) badge.textContent = p ? (p.box === 5 ? 'Compartiment 5 · maîtrisée' : `Compartiment ${p.box}`) : 'Jamais vue';
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
		$(R, '[data-browse-count]').textContent = `${plural(shown, 'question affichée', 'questions affichées')} sur ${cards.length}`;
		$(R, '[data-browse-empty]').hidden = shown > 0;
	}

	browseForm.addEventListener('input', applyBrowseFilters);
	browseForm.addEventListener('change', applyBrowseFilters);
	browseForm.addEventListener('reset', () => window.setTimeout(applyBrowseFilters, 0));
	browseForm.addEventListener('submit', (e) => e.preventDefault());

	function showInBrowse(id: string): void {
		browseForm.reset();
		applyBrowseFilters();
		browseFold.open = true;
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
	R.querySelectorAll<HTMLSelectElement>('[data-setting]').forEach((select) => {
		const key = select.dataset.setting as keyof LeitnerSettings;
		const current = String(state.settings[key]);
		if (![...select.options].some((o) => o.value === current)) select.append(el('option', { text: current, attrs: { value: current } }));
		select.value = current;
		select.addEventListener('change', () => {
			state = { ...state, settings: { ...state.settings, [key]: Number(select.value) } };
			persist();
			renderAll();
		});
	});
	discoverSelect.addEventListener('change', renderHome);

	const dialog = $(R, '[data-reset-dialog]') as HTMLDialogElement;
	function doReset(): void {
		state = resetState(store, STORAGE_KEY, state.settings);
		extraNewToday = 0;
		session = null;
		showSessionView(false);
		hideMessage();
		renderAll();
		announce('Ta progression a été effacée.');
	}
	$(R, '[data-reset-open]').addEventListener('click', () => {
		if (typeof dialog.showModal === 'function') {
			dialog.returnValue = '';
			dialog.showModal();
		} else if (window.confirm('Effacer toute ta progression ? C’est définitif.')) {
			doReset();
		}
	});
	// Le bouton de confirmation efface tout de suite ; le formulaire (method="dialog") ferme ensuite la fenêtre.
	$(dialog, '[data-reset-confirm]').addEventListener('click', doReset);
	dialog.addEventListener('close', () => ($(R, '[data-reset-open]') as HTMLButtonElement).focus());

	// Synchronisation entre onglets du navigateur.
	window.addEventListener('storage', (e) => {
		if (e.key !== STORAGE_KEY || session) return;
		state = loadState(store, STORAGE_KEY).state;
		renderAll();
	});

	// Si la page reste ouverte après minuit, les questions du jour changent.
	let lastDay = today();
	document.addEventListener('visibilitychange', () => {
		if (document.visibilityState === 'visible' && today() !== lastDay && !session) {
			lastDay = today();
			extraNewToday = 0;
			renderAll();
		}
	});

	function renderAll(): void {
		renderHome();
		renderBox();
		renderStats();
		refreshBrowseBadges();
	}

	R.dataset.view = 'home';
	renderAll();
	R.dataset.ready = 'true';
}
