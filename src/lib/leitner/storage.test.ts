import { describe, expect, test } from 'vitest';
import { createProgress, reviewCard } from './scheduler';
import {
	DEFAULT_SETTINGS,
	STORAGE_VERSION,
	createEmptyState,
	loadState,
	parseState,
	resetState,
	saveState,
	type KeyValueStore,
} from './storage';

const KEY = 'test:leitner';
const TODAY = '2026-11-04';

class MemoryStore implements KeyValueStore {
	data = new Map<string, string>();
	getItem(key: string) {
		return this.data.has(key) ? this.data.get(key)! : null;
	}
	setItem(key: string, value: string) {
		this.data.set(key, value);
	}
	removeItem(key: string) {
		this.data.delete(key);
	}
}

class BrokenStore implements KeyValueStore {
	getItem(): string | null {
		throw new Error('SecurityError');
	}
	setItem(): void {
		throw new Error('QuotaExceededError');
	}
	removeItem(): void {
		throw new Error('SecurityError');
	}
}

describe('Persistance de la boîte de Leitner', () => {
	test('sans donnée stockée, l’état est vide et versionné', () => {
		const { state, status } = loadState(new MemoryStore(), KEY);
		expect(status).toBe('empty');
		expect(state).toEqual({ version: STORAGE_VERSION, cards: {}, settings: DEFAULT_SETTINGS });
	});

	test('la progression survit à un rechargement (écriture puis nouvelle lecture)', () => {
		const store = new MemoryStore();
		const state = createEmptyState();
		state.cards['oeuvre-cycle'] = reviewCard(createProgress(TODAY), 'known', TODAY);
		state.settings.dailyGoal = 30;
		expect(saveState(store, KEY, state)).toBe(true);

		const reloaded = loadState(store, KEY);
		expect(reloaded.status).toBe('ok');
		expect(reloaded.state).toEqual(state);
		expect(reloaded.state.cards['oeuvre-cycle'].box).toBe(2);
		expect(reloaded.state.cards['oeuvre-cycle'].nextReview).toBe('2026-11-05');
	});

	test('un JSON illisible est remplacé par un état vide, avec une copie de sauvegarde', () => {
		const store = new MemoryStore();
		store.setItem(KEY, '{ceci n’est pas du JSON');
		const { state, status } = loadState(store, KEY);
		expect(status).toBe('reset-malformed');
		expect(state.cards).toEqual({});
		expect(store.getItem(`${KEY}:sauvegarde-illisible`)).toBe('{ceci n’est pas du JSON');
	});

	test('des structures inattendues sont rejetées sans erreur', () => {
		for (const text of ['42', '"texte"', '[]', 'null', '{"version":1,"cards":[]}', '{"version":1,"cards":"x"}']) {
			const { state, status } = parseState(text);
			expect(status, text).toBe('reset-malformed');
			expect(state.cards).toEqual({});
		}
	});

	test('une version future inconnue n’est pas interprétée', () => {
		const { status } = parseState(JSON.stringify({ version: 99, cards: {} }));
		expect(status).toBe('reset-unsupported-version');
	});

	test('une donnée sans numéro de version (ancien format) est lue comme une version 1', () => {
		const { status, state } = parseState(JSON.stringify({ cards: { a: createProgress(TODAY) } }));
		expect(status).toBe('ok');
		expect(state.cards.a.box).toBe(1);
	});

	test('les cartes corrompues sont écartées une à une, les autres conservées', () => {
		const good = reviewCard(createProgress(TODAY), 'known', TODAY);
		const text = JSON.stringify({
			version: 1,
			cards: {
				good,
				badBox: { ...good, box: 9 },
				badDate: { ...good, nextReview: '2026-02-30' },
				notAnObject: 'boîte 3',
				oddHistory: { ...good, history: [{ day: 'hier', result: 'known', fromBox: 1, toBox: 2 }, good.history[0]] },
				noCounters: { box: 3, nextReview: TODAY, history: good.history },
			},
			settings: { dailyGoal: -4, newPerDay: 10 },
		});
		const { state, status } = parseState(text);
		expect(status).toBe('repaired');
		expect(Object.keys(state.cards).sort()).toEqual(['good', 'noCounters', 'oddHistory']);
		expect(state.cards.oddHistory.history).toHaveLength(1);
		expect(state.cards.noCounters.successCount).toBe(1);
		expect(state.cards.noCounters.lastReviewed).toBeNull();
		expect(state.settings).toEqual({ dailyGoal: DEFAULT_SETTINGS.dailyGoal, newPerDay: 10 });
	});

	test('la réinitialisation efface la progression mais garde les réglages', () => {
		const store = new MemoryStore();
		const state = createEmptyState({ dailyGoal: 40, newPerDay: 5 });
		state.cards.a = createProgress(TODAY);
		saveState(store, KEY, state);
		const fresh = resetState(store, KEY, state.settings);
		expect(fresh.cards).toEqual({});
		expect(fresh.settings).toEqual({ dailyGoal: 40, newPerDay: 5 });
		expect(loadState(store, KEY).state.cards).toEqual({});
	});

	test('un stockage indisponible ou défaillant ne provoque jamais d’erreur', () => {
		expect(loadState(null, KEY).status).toBe('unavailable');
		expect(loadState(new BrokenStore(), KEY).status).toBe('unavailable');
		expect(saveState(new BrokenStore(), KEY, createEmptyState())).toBe(false);
		expect(saveState(null, KEY, createEmptyState())).toBe(false);
		expect(() => resetState(new BrokenStore(), KEY)).not.toThrow();
	});
});
