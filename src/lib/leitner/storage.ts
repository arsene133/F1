// ==========================================================================
// Boîte de Leitner : persistance locale versionnée (localStorage).
//
// Tout accès au stockage passe par une interface minimale (`KeyValueStore`)
// pour pouvoir être testé hors navigateur, et chaque appel est protégé :
// navigation privée, stockage désactivé ou quota plein ne doivent jamais
// casser la page. Les données lues sont validées champ par champ.
// ==========================================================================

import {
	HISTORY_LIMIT,
	isBoxNumber,
	isValidDayKey,
	type CardProgress,
	type ReviewEvent,
} from './scheduler';

export const STORAGE_VERSION = 1;

export interface LeitnerSettings {
	/** Objectif quotidien de cartes évaluées (révision + découverte). */
	dailyGoal: number;
	/** Nombre de nouvelles cartes proposées par jour en mode Découverte. */
	newPerDay: number;
}

export const DEFAULT_SETTINGS: Readonly<LeitnerSettings> = { dailyGoal: 20, newPerDay: 8 };

export const DAILY_GOAL_OPTIONS = [10, 15, 20, 30, 40] as const;
export const NEW_PER_DAY_OPTIONS = [5, 8, 10, 15, 20] as const;

export interface LeitnerState {
	version: typeof STORAGE_VERSION;
	cards: Record<string, CardProgress>;
	settings: LeitnerSettings;
}

/** Interface minimale de stockage (sous-ensemble de `Storage`). */
export interface KeyValueStore {
	getItem(key: string): string | null;
	setItem(key: string, value: string): void;
	removeItem(key: string): void;
}

export type LoadStatus = 'empty' | 'ok' | 'repaired' | 'reset-malformed' | 'reset-unsupported-version' | 'unavailable';

export interface LoadResult {
	state: LeitnerState;
	status: LoadStatus;
}

export function createEmptyState(settings: LeitnerSettings = DEFAULT_SETTINGS): LeitnerState {
	return { version: STORAGE_VERSION, cards: {}, settings: { ...settings } };
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isCount(value: unknown): value is number {
	return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}

function parseEvent(raw: unknown): ReviewEvent | null {
	if (!isRecord(raw)) return null;
	const { day, result, fromBox, toBox } = raw;
	if (!isValidDayKey(day) || (result !== 'known' && result !== 'forgotten')) return null;
	if (!isBoxNumber(fromBox) || !isBoxNumber(toBox)) return null;
	return { day, result, fromBox, toBox };
}

/** Valide la progression d'une carte ; renvoie `null` si elle est inutilisable. */
export function parseCardProgress(raw: unknown): CardProgress | null {
	if (!isRecord(raw)) return null;
	const { box, introducedOn, lastReviewed, nextReview, successCount, failureCount, history } = raw;
	if (!isBoxNumber(box) || !isValidDayKey(nextReview)) return null;
	if (lastReviewed !== null && lastReviewed !== undefined && !isValidDayKey(lastReviewed)) return null;
	const events = Array.isArray(history)
		? history.map(parseEvent).filter((e): e is ReviewEvent => e !== null).slice(-HISTORY_LIMIT)
		: [];
	return {
		box,
		introducedOn: isValidDayKey(introducedOn) ? introducedOn : (events[0]?.day ?? nextReview),
		lastReviewed: isValidDayKey(lastReviewed) ? lastReviewed : null,
		nextReview,
		successCount: isCount(successCount) ? successCount : events.filter((e) => e.result === 'known').length,
		failureCount: isCount(failureCount) ? failureCount : events.filter((e) => e.result === 'forgotten').length,
		history: events,
	};
}

function parseSettings(raw: unknown): LeitnerSettings {
	const out: LeitnerSettings = { ...DEFAULT_SETTINGS };
	if (!isRecord(raw)) return out;
	if (isCount(raw.dailyGoal) && raw.dailyGoal >= 1 && raw.dailyGoal <= 500) out.dailyGoal = raw.dailyGoal;
	if (isCount(raw.newPerDay) && raw.newPerDay >= 1 && raw.newPerDay <= 200) out.newPerDay = raw.newPerDay;
	return out;
}

/**
 * Transforme le texte stocké en état utilisable.
 * - texte absent : état vide ;
 * - JSON invalide ou structure inattendue : état vide (`reset-malformed`) ;
 * - version future inconnue : état vide (`reset-unsupported-version`) ;
 * - cartes individuelles invalides : ignorées (`repaired`).
 */
export function parseState(text: string | null): LoadResult {
	if (text === null || text === '') return { state: createEmptyState(), status: 'empty' };
	let raw: unknown;
	try {
		raw = JSON.parse(text);
	} catch {
		return { state: createEmptyState(), status: 'reset-malformed' };
	}
	if (!isRecord(raw)) return { state: createEmptyState(), status: 'reset-malformed' };
	const migrated = migrate(raw);
	if (migrated === null) return { state: createEmptyState(), status: 'reset-unsupported-version' };
	if (!isRecord(migrated.cards)) return { state: createEmptyState(parseSettings(migrated.settings)), status: 'reset-malformed' };

	const cards: Record<string, CardProgress> = {};
	let dropped = 0;
	for (const [id, value] of Object.entries(migrated.cards)) {
		const parsed = parseCardProgress(value);
		if (parsed) cards[id] = parsed;
		else dropped++;
	}
	return {
		state: { version: STORAGE_VERSION, cards, settings: parseSettings(migrated.settings) },
		status: dropped > 0 ? 'repaired' : 'ok',
	};
}

/**
 * Migrations entre versions du format. La version 1 est la première ;
 * une donnée sans numéro de version est traitée comme une version 1.
 * Ajouter ici les conversions futures (v1 → v2, etc.).
 */
function migrate(raw: Record<string, unknown>): Record<string, unknown> | null {
	const version = raw.version ?? 1;
	if (version === STORAGE_VERSION) return raw;
	return null;
}

export function serializeState(state: LeitnerState): string {
	return JSON.stringify(state);
}

/** Accès au localStorage du navigateur, ou `null` s'il est indisponible (rendu serveur, stockage bloqué). */
export function getBrowserStore(): KeyValueStore | null {
	try {
		if (typeof window === 'undefined' || !window.localStorage) return null;
		const probe = '__leitner_probe__';
		window.localStorage.setItem(probe, '1');
		window.localStorage.removeItem(probe);
		return window.localStorage;
	} catch {
		return null;
	}
}

export function loadState(store: KeyValueStore | null, key: string): LoadResult {
	if (!store) return { state: createEmptyState(), status: 'unavailable' };
	let text: string | null;
	try {
		text = store.getItem(key);
	} catch {
		return { state: createEmptyState(), status: 'unavailable' };
	}
	const result = parseState(text);
	if (result.status === 'reset-malformed' || result.status === 'reset-unsupported-version') {
		// On garde une copie de la donnée illisible plutôt que de l'écraser sans trace.
		try {
			store.setItem(`${key}:sauvegarde-illisible`, text ?? '');
		} catch {
			// stockage plein : tant pis pour la copie
		}
	}
	return result;
}

/** Enregistre l'état ; renvoie `false` si l'écriture a échoué (quota, stockage bloqué). */
export function saveState(store: KeyValueStore | null, key: string, state: LeitnerState): boolean {
	if (!store) return false;
	try {
		store.setItem(key, serializeState(state));
		return true;
	} catch {
		return false;
	}
}

/** Efface toute la progression, en conservant les réglages. */
export function resetState(store: KeyValueStore | null, key: string, keepSettings?: LeitnerSettings): LeitnerState {
	const fresh = createEmptyState(keepSettings ?? DEFAULT_SETTINGS);
	if (store) {
		try {
			store.removeItem(key);
			store.setItem(key, serializeState(fresh));
		} catch {
			// rien d'autre à faire : l'état en mémoire est tout de même réinitialisé
		}
	}
	return fresh;
}
