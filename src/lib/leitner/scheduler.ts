// ==========================================================================
// Boîte de Leitner : logique de planification (fonctions pures, testables).
//
// Les dates sont des « jours calendaires » locaux au format AAAA-MM-JJ :
// une carte prévue pour le 12 est à revoir dès minuit le 12, quelle que soit
// l'heure de la révision précédente. Aucune fonction ne lit l'horloge :
// la date du jour est toujours passée en paramètre.
// ==========================================================================

export type BoxNumber = 1 | 2 | 3 | 4 | 5;

export const BOXES: readonly BoxNumber[] = [1, 2, 3, 4, 5];

/** Intervalle (en jours) avant la prochaine révision d'une carte placée dans chaque boîte. */
export const BOX_INTERVAL_DAYS: Readonly<Record<BoxNumber, number>> = {
	1: 0, // à chaque séance
	2: 1,
	3: 3,
	4: 7,
	5: 14,
};

export const MAX_BOX: BoxNumber = 5;

/** Une carte est « maîtrisée » lorsqu'elle a atteint la boîte 5 (au moins quatre rappels réussis, espacés). */
export const MASTERED_BOX: BoxNumber = 5;

export type ReviewResult = 'known' | 'forgotten';

/** Jour calendaire local, au format AAAA-MM-JJ. */
export type DayKey = string;

export interface ReviewEvent {
	/** Jour calendaire de la révision. */
	day: DayKey;
	result: ReviewResult;
	fromBox: BoxNumber;
	toBox: BoxNumber;
}

export interface CardProgress {
	box: BoxNumber;
	/** Jour où la carte est entrée dans la boîte 1. */
	introducedOn: DayKey;
	lastReviewed: DayKey | null;
	nextReview: DayKey;
	successCount: number;
	failureCount: number;
	history: ReviewEvent[];
}

/** Nombre maximal d'événements conservés par carte (les plus anciens sont oubliés). */
export const HISTORY_LIMIT = 60;

const DAY_KEY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

function pad(n: number): string {
	return String(n).padStart(2, '0');
}

/** Convertit une date en jour calendaire local (AAAA-MM-JJ). */
export function toDayKey(date: Date): DayKey {
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Vérifie qu'une chaîne est un jour calendaire réel (pas de 31 février). */
export function isValidDayKey(value: unknown): value is DayKey {
	if (typeof value !== 'string') return false;
	const m = DAY_KEY_PATTERN.exec(value);
	if (!m) return false;
	const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
	const utc = new Date(Date.UTC(y, mo - 1, d));
	return utc.getUTCFullYear() === y && utc.getUTCMonth() === mo - 1 && utc.getUTCDate() === d;
}

function dayKeyToUtc(day: DayKey): number {
	const m = DAY_KEY_PATTERN.exec(day);
	if (!m) throw new Error(`Jour calendaire invalide : ${day}`);
	return Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

/** Ajoute un nombre de jours calendaires (calcul en UTC : insensible aux changements d'heure). */
export function addDays(day: DayKey, days: number): DayKey {
	const d = new Date(dayKeyToUtc(day) + days * 86_400_000);
	return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

/** Nombre de jours de `from` à `to` (négatif si `to` est antérieur). */
export function daysBetween(from: DayKey, to: DayKey): number {
	return Math.round((dayKeyToUtc(to) - dayKeyToUtc(from)) / 86_400_000);
}

export function isBoxNumber(value: unknown): value is BoxNumber {
	return value === 1 || value === 2 || value === 3 || value === 4 || value === 5;
}

/** Une nouvelle carte entre dans la boîte 1 et peut être révisée le jour même. */
export function createProgress(today: DayKey): CardProgress {
	return {
		box: 1,
		introducedOn: today,
		lastReviewed: null,
		nextReview: today,
		successCount: 0,
		failureCount: 0,
		history: [],
	};
}

/** Boîte de destination après une évaluation. */
export function nextBox(box: BoxNumber, result: ReviewResult): BoxNumber {
	if (result === 'forgotten') return 1;
	return box >= MAX_BOX ? MAX_BOX : ((box + 1) as BoxNumber);
}

/**
 * Applique une évaluation à une carte (sans modifier l'objet reçu).
 * « Je savais » : la carte monte d'une boîte (la boîte 5 est un plafond).
 * « À revoir » : la carte retourne dans la boîte 1.
 * La prochaine date dépend de la boîte d'arrivée.
 */
export function reviewCard(progress: CardProgress, result: ReviewResult, today: DayKey): CardProgress {
	const toBox = nextBox(progress.box, result);
	const event: ReviewEvent = { day: today, result, fromBox: progress.box, toBox };
	const history = [...progress.history, event].slice(-HISTORY_LIMIT);
	return {
		...progress,
		box: toBox,
		lastReviewed: today,
		nextReview: addDays(today, BOX_INTERVAL_DAYS[toBox]),
		successCount: progress.successCount + (result === 'known' ? 1 : 0),
		failureCount: progress.failureCount + (result === 'forgotten' ? 1 : 0),
		history,
	};
}

/** Une carte est à revoir si sa date prévue est aujourd'hui ou déjà passée. */
export function isDue(progress: CardProgress, today: DayKey): boolean {
	return daysBetween(progress.nextReview, today) >= 0;
}

export function isMastered(progress: CardProgress | undefined): boolean {
	return progress !== undefined && progress.box >= MASTERED_BOX;
}

export type ProgressMap = Readonly<Record<string, CardProgress | undefined>>;

export type CardStatus = 'new' | 'learning' | 'mastered';

export function cardStatus(progress: CardProgress | undefined): CardStatus {
	if (!progress) return 'new';
	return isMastered(progress) ? 'mastered' : 'learning';
}

/**
 * Identifiants des cartes à revoir aujourd'hui, dans l'ordre de révision :
 * d'abord les plus en retard, puis les boîtes basses (cartes fragiles),
 * enfin l'ordre du paquet.
 */
export function dueCardIds(cardIds: readonly string[], progress: ProgressMap, today: DayKey): string[] {
	const order = new Map(cardIds.map((id, i) => [id, i]));
	return cardIds
		.filter((id) => {
			const p = progress[id];
			return p !== undefined && isDue(p, today);
		})
		.sort((a, b) => {
			const pa = progress[a]!;
			const pb = progress[b]!;
			return (
				daysBetween(pb.nextReview, today) - daysBetween(pa.nextReview, today) ||
				pa.box - pb.box ||
				order.get(a)! - order.get(b)!
			);
		});
}

/** Identifiants des cartes jamais introduites, dans l'ordre du paquet. */
export function newCardIds(cardIds: readonly string[], progress: ProgressMap): string[] {
	return cardIds.filter((id) => progress[id] === undefined);
}

/** Nombre de cartes introduites (entrées en boîte 1) un jour donné. */
export function introducedOn(cardIds: readonly string[], progress: ProgressMap, day: DayKey): number {
	return cardIds.filter((id) => progress[id]?.introducedOn === day).length;
}

/** Nombre d'évaluations « planifiées » réalisées un jour donné (révisions et découvertes). */
export function reviewsOn(cardIds: readonly string[], progress: ProgressMap, day: DayKey): number {
	let n = 0;
	for (const id of cardIds) {
		for (const e of progress[id]?.history ?? []) if (e.day === day) n++;
	}
	return n;
}

/** Prochaine date de révision prévue après aujourd'hui (pour l'état « rien à revoir »). */
export function nextDueDay(cardIds: readonly string[], progress: ProgressMap, today: DayKey): DayKey | null {
	let best: DayKey | null = null;
	for (const id of cardIds) {
		const p = progress[id];
		if (!p || isDue(p, today)) continue;
		if (best === null || daysBetween(p.nextReview, best) > 0) best = p.nextReview;
	}
	return best;
}

export interface DeckStats {
	total: number;
	newCount: number;
	dueToday: number;
	mastered: number;
	/** Nombre de cartes introduites par boîte. */
	boxes: Record<BoxNumber, number>;
	/**
	 * Progression globale entre 0 et 1 : chemin parcouru par l'ensemble des
	 * cartes vers la boîte 5 (une carte nouvelle compte 0, une carte en boîte 5 compte 1).
	 */
	progress: number;
}

export function deckStats(cardIds: readonly string[], progress: ProgressMap, today: DayKey): DeckStats {
	const boxes: Record<BoxNumber, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
	let newCount = 0;
	let dueToday = 0;
	let steps = 0;
	for (const id of cardIds) {
		const p = progress[id];
		if (!p) {
			newCount++;
			continue;
		}
		boxes[p.box]++;
		steps += (p.box - 1) / (MAX_BOX - 1);
		if (isDue(p, today)) dueToday++;
	}
	return {
		total: cardIds.length,
		newCount,
		dueToday,
		mastered: boxes[MASTERED_BOX],
		boxes,
		progress: cardIds.length === 0 ? 0 : steps / cardIds.length,
	};
}

export interface DailyActivity {
	day: DayKey;
	known: number;
	forgotten: number;
}

/** Activité des `days` derniers jours (le dernier élément est aujourd'hui). */
export function dailyActivity(
	cardIds: readonly string[],
	progress: ProgressMap,
	today: DayKey,
	days: number,
): DailyActivity[] {
	const out: DailyActivity[] = [];
	const index = new Map<DayKey, DailyActivity>();
	for (let i = days - 1; i >= 0; i--) {
		const entry = { day: addDays(today, -i), known: 0, forgotten: 0 };
		out.push(entry);
		index.set(entry.day, entry);
	}
	for (const id of cardIds) {
		for (const e of progress[id]?.history ?? []) {
			const entry = index.get(e.day);
			if (entry) entry[e.result]++;
		}
	}
	return out;
}

/**
 * Cartes qui demandent de l'attention : déjà oubliées au moins deux fois,
 * ou dont la dernière évaluation était « À revoir ». Les plus fragiles d'abord.
 */
export function cardsNeedingAttention(cardIds: readonly string[], progress: ProgressMap, limit = 5): string[] {
	return cardIds
		.filter((id) => {
			const p = progress[id];
			if (!p) return false;
			const last = p.history[p.history.length - 1];
			return p.failureCount >= 2 || last?.result === 'forgotten';
		})
		.sort((a, b) => {
			const pa = progress[a]!;
			const pb = progress[b]!;
			return pb.failureCount - pb.successCount - (pa.failureCount - pa.successCount) || pa.box - pb.box;
		})
		.slice(0, limit);
}
