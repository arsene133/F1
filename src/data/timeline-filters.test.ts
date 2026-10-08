import { describe, expect, test } from 'vitest';
import { timelineItems } from './timeline';
import { compactEntryParts, matchesTimelineFilter, timelineFilters } from './timeline-filters';

const count = (filterId: string) => timelineItems.filter((item) => matchesTimelineFilter(item.type, filterId)).length;
const titlesFor = (filterId: string) =>
	timelineItems.filter((item) => matchesTimelineFilter(item.type, filterId)).map((item) => item.title);

describe('filtres de la frise', () => {
	test('les filtres sont ceux des catégories existantes', () => {
		expect(timelineFilters.map((f) => f.label)).toEqual([
			'Tout',
			'Histoire',
			'Littérature',
			'Sciences',
			'Industrie',
			'Peinture',
			'Musique',
		]);
	});

	test('« Tout » retient chaque repère', () => {
		expect(count('all')).toBe(timelineItems.length);
	});

	test('Littérature : les cinq œuvres, dont Pot-Bouille et Au Bonheur des Dames', () => {
		expect(count('literature')).toBe(5);
		expect(titlesFor('literature')).toEqual(
			expect.arrayContaining(['Pot-Bouille', 'Au Bonheur des Dames', 'Le Père Goriot', 'Cahiers de Douai', "On ne badine pas avec l'amour"]),
		);
	});

	test('Sciences : dix repères scientifiques', () => {
		expect(count('science')).toBe(10);
	});

	test('chaque repère relève d’exactement une catégorie filtrable', () => {
		const categories = timelineFilters.filter((f) => f.id !== 'all').map((f) => f.id);
		for (const item of timelineItems) {
			expect(categories.filter((id) => matchesTimelineFilter(item.type, id)), item.id).toHaveLength(1);
		}
		expect(categories.reduce((sum, id) => sum + count(id), 0)).toBe(timelineItems.length);
	});

	test('Histoire regroupe régimes, révolutions, guerres et événements', () => {
		for (const type of ['history', 'political-regime', 'revolution', 'war']) {
			expect(matchesTimelineFilter(type, 'history')).toBe(true);
		}
		expect(matchesTimelineFilter('literature', 'history')).toBe(false);
	});
});

describe('ligne compacte', () => {
	const parts = (id: string) => {
		const item = timelineItems.find((it) => it.id === id);
		if (!item) throw new Error(`repère inconnu : ${id}`);
		return compactEntryParts(item);
	};

	test('date courte, titre et précision lisible', () => {
		expect(parts('machine-vapeur-watt')).toEqual({ date: '1769', title: 'Machine à vapeur de Watt', detail: 'James Watt' });
		expect(parts('alessandro-volta')).toEqual({ date: '1800', title: 'Alessandro Volta', detail: 'La pile électrique' });
		expect(parts('pot-bouille')).toEqual({ date: '1882', title: 'Pot-Bouille', detail: 'Émile Zola' });
	});

	test('une période affiche ses bornes, sans répéter la date en précision', () => {
		expect(parts('revolution-francaise')).toEqual({ date: '1789–1799', title: 'Révolution française', detail: undefined });
		expect(parts('revolution-1848').detail).toBeUndefined();
	});

	test('chaque repère a une ligne compacte non vide', () => {
		for (const item of timelineItems) {
			const p = compactEntryParts(item);
			expect(p.date, item.id).toMatch(/^\d{4}(–\d{4})?$/);
			expect(p.title.length, item.id).toBeGreaterThan(0);
		}
	});
});
