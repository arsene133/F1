import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { keyFacts } from './graffigny';
import { timelineItems, timelinePeriods } from './timeline';
import { compactEntryParts, matchesTimelineFilter } from './timeline-filters';

// Françoise de Graffigny et les Lettres d'une Péruvienne dans la frise (/chronologie) :
// l'autrice (1695–1758) et deux jalons éditoriaux d'une même œuvre (1747, 1752), reliés entre eux et à /graffigny.

const PAGES_DIR = fileURLToPath(new URL('../pages', import.meta.url));
const item = (id: string) => {
	const found = timelineItems.find((it) => it.id === id);
	if (!found) throw new Error(`repère inconnu : ${id}`);
	return found;
};

const author = item('francoise-de-graffigny');
const firstEdition = item('lettres-d-une-peruvienne');
const augmented = item('lettres-d-une-peruvienne-1752');
const graffignyItems = [author, firstEdition, augmented];

describe('frise : Françoise de Graffigny et les Lettres d’une Péruvienne', () => {
	test('l’autrice est présente, de 1695 à 1758', () => {
		expect(author.title).toBe('Françoise de Graffigny');
		expect(author.year).toBe(1695);
		expect(author.endYear).toBe(1758);
		expect(author.description).toContain('Nancy');
		expect(author.description).toContain('Paris');
		expect(compactEntryParts(author).date).toBe('1695–1758');
	});

	test('l’œuvre est présente : première publication en 1747, édition augmentée en 1752', () => {
		expect(firstEdition.title).toBe('Lettres d’une Péruvienne');
		expect(firstEdition.year).toBe(1747);
		expect(firstEdition.endYear).toBeUndefined();
		expect(firstEdition.subtitle).toMatch(/première publication, anonyme/);
		expect(augmented.title).toContain('Lettres d’une Péruvienne');
		expect(augmented.year).toBe(1752);
		expect(augmented.endYear).toBeUndefined();
		expect(augmented.subtitle).toMatch(/édition augmentée, signée/);
		for (const edition of [firstEdition, augmented]) {
			expect(edition.author, edition.id).toBe('Françoise de Graffigny');
			expect(edition.authorDates, edition.id).toBe('1695–1758');
			expect(edition.dateType, edition.id).toBe('publication');
			expect(edition.tagLabel, edition.id).toBe('Roman épistolaire · Lumières');
		}
	});

	test('chaque date est portée par le bon repère, et par lui seul', () => {
		const graffignyIds = new Set(graffignyItems.map((it) => it.id));
		const byDate = (year: number) =>
			timelineItems.filter((it) => graffignyIds.has(it.id) && (it.year === year || it.endYear === year)).map((it) => it.id);
		expect(byDate(1695)).toEqual(['francoise-de-graffigny']);
		expect(byDate(1758)).toEqual(['francoise-de-graffigny']);
		expect(byDate(1747)).toEqual(['lettres-d-une-peruvienne']);
		expect(byDate(1752)).toEqual(['lettres-d-une-peruvienne-1752']);
	});

	test('les dates concordent avec celles de la page /graffigny', () => {
		const fact = (label: string) => keyFacts.find((f) => f.label === label)?.value ?? '';
		expect(fact('Autrice')).toContain(`${author.year}-${author.endYear}`);
		expect(fact('Publication')).toContain(String(firstEdition.year));
		expect(fact('Publication')).toContain(String(augmented.year));
		expect(fact('Mouvement')).toContain('Lumières');
		// 38 lettres en 1747, 41 dans l'édition augmentée de 1752
		expect(fact('Genre')).toContain('38 lettres en 1747, 41 en 1752');
		expect(augmented.description).toContain('de 38 à 41 lettres');
	});

	test('catégorie Littérature, sans nouvelle catégorie : visibles avec le filtre « Littérature »', () => {
		for (const it of graffignyItems) {
			expect(it.type, it.id).toBe('literature');
			expect(it.category, it.id).toBe('novel');
			expect(matchesTimelineFilter(it.type, 'literature'), it.id).toBe(true);
			expect(matchesTimelineFilter(it.type, 'history'), it.id).toBe(false);
		}
	});

	test('les publications relèvent du règne de Louis XV (Lumières), pas d’une période antérieure', () => {
		const louisXV = timelinePeriods.find((p) => p.id === 'regne-louis-xv')!;
		expect(louisXV).toBeDefined();
		for (const edition of [firstEdition, augmented]) {
			expect(edition.periodId, edition.id).toBe('regne-louis-xv');
			expect(edition.year).toBeGreaterThanOrEqual(louisXV.startYear);
			expect(edition.year).toBeLessThanOrEqual(louisXV.endYear);
		}
		expect(author.periodLabel).toContain('Lumières');
	});

	test('relations : autrice → 1747, 1747 ↔ 1752, chacun renvoyant à l’autre', () => {
		expect(author.relatedTo).toEqual(expect.arrayContaining([firstEdition.id, augmented.id]));
		expect(firstEdition.relatedTo).toEqual(expect.arrayContaining([author.id, augmented.id]));
		expect(augmented.relatedTo).toEqual(expect.arrayContaining([firstEdition.id, author.id]));
		// Chaque relation a un libellé explicite (lisible même si un filtre réduit le repère cible en ligne compacte)
		for (const it of graffignyItems) {
			for (const relId of it.relatedTo) {
				expect(it.relatedLinks?.find((l) => l.id === relId)?.label, `${it.id} → ${relId}`).toBeTruthy();
			}
		}
	});

	test('les trois repères ouvrent la page /graffigny, qui existe', () => {
		expect(existsSync(`${PAGES_DIR}/graffigny.astro`)).toBe(true);
		for (const it of graffignyItems) {
			expect(it.pageLink?.url, it.id).toBe('/graffigny');
			expect(it.pageLink?.label.length, it.id).toBeGreaterThan(0);
		}
	});

	test('aucune illustration ajoutée pour remplir la carte', () => {
		for (const it of graffignyItems) {
			expect(it.image, it.id).toBeUndefined();
			expect(it.secondaryImage, it.id).toBeUndefined();
		}
	});
});

describe('cohérence globale de la frise', () => {
	test('aucun identifiant dupliqué', () => {
		const ids = timelineItems.map((it) => it.id);
		expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
		const periodIds = timelinePeriods.map((p) => p.id);
		expect(periodIds.filter((id, i) => periodIds.indexOf(id) !== i)).toEqual([]);
	});

	test('chaque repère se rattache à une période existante', () => {
		const periodIds = new Set(timelinePeriods.map((p) => p.id));
		for (const it of timelineItems) expect(periodIds.has(it.periodId), it.id).toBe(true);
	});

	test('chaque repère tombe dans les bornes de sa période politique', () => {
		const periods = new Map(timelinePeriods.map((p) => [p.id, p]));
		const outside = timelineItems
			.filter((it) => {
				const p = periods.get(it.periodId)!;
				return it.year < p.startYear || it.year > p.endYear;
			})
			.map((it) => `${it.id} (${it.year}) → ${it.periodId}`);
		expect(outside).toEqual([]);
	});

	test('la machine de Watt (1769) relève du règne de Louis XV, non de la Révolution française', () => {
		const watt = item('machine-vapeur-watt');
		expect(watt.year).toBe(1769);
		expect(watt.periodId).toBe('regne-louis-xv');
		expect(watt.periodId).not.toBe('revolution-francaise-regime');
	});

	test('périodes politiques ordonnées, sans chevauchement (bornes partagées : année de transition)', () => {
		const sorted = [...timelinePeriods].sort((a, b) => a.startYear - b.startYear);
		expect(sorted.map((p) => p.id)).toEqual(timelinePeriods.map((p) => p.id));
		for (let i = 1; i < sorted.length; i++) {
			expect(sorted[i].startYear, sorted[i].id).toBeGreaterThanOrEqual(sorted[i - 1].endYear);
		}
		// Seule lacune connue : le règne de Louis XVI (1774–1789), sans repère dans la frise
		const gaps = sorted.slice(1).filter((p, i) => p.startYear > sorted[i].endYear).map((p) => p.id);
		expect(gaps).toEqual(['revolution-francaise-regime']);
		const gapStart = sorted.find((p) => p.id === 'regne-louis-xv')!.endYear;
		expect(timelineItems.filter((it) => it.year > gapStart && it.year < 1789).map((it) => it.id)).toEqual([]);
	});

	test('Graffigny : naissance (1695) sous Louis XIV, publications (1747, 1752) sous Louis XV', () => {
		const period = (id: string) => timelinePeriods.find((p) => p.id === id)!;
		const louisXIV = period('regne-louis-xiv');
		expect(author.periodId).toBe('regne-louis-xiv');
		expect(author.year).toBeGreaterThanOrEqual(louisXIV.startYear);
		expect(author.year).toBeLessThanOrEqual(louisXIV.endYear);
		expect(period('regne-louis-xv')).toMatchObject({ startYear: 1715, endYear: 1774, displayDates: '1715–1774' });
	});

	test('les relations Graffigny visent des repères existants', () => {
		const ids = new Set(timelineItems.map((it) => it.id));
		for (const it of graffignyItems) {
			for (const relId of it.relatedTo) expect(ids.has(relId), `${it.id} → ${relId}`).toBe(true);
		}
	});
});
