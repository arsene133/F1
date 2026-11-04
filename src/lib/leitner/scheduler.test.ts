import { describe, expect, test } from 'vitest';
import {
	BOX_INTERVAL_DAYS,
	addDays,
	cardStatus,
	cardsNeedingAttention,
	createProgress,
	dailyActivity,
	daysBetween,
	deckStats,
	dueCardIds,
	introducedOn,
	isDue,
	isMastered,
	isValidDayKey,
	newCardIds,
	nextBox,
	nextDueDay,
	reviewCard,
	reviewsOn,
	toDayKey,
	type BoxNumber,
	type CardProgress,
} from './scheduler';

const TODAY = '2026-11-04';

function inBox(box: BoxNumber, nextReview = TODAY): CardProgress {
	return { ...createProgress('2026-10-01'), box, nextReview, lastReviewed: '2026-10-20' };
}

describe('Dates calendaires', () => {
	test('toDayKey utilise la date locale, pas l’UTC', () => {
		expect(toDayKey(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
		expect(toDayKey(new Date(2026, 0, 5, 0, 1))).toBe('2026-01-05');
	});

	test('addDays franchit les fins de mois et d’année, et les changements d’heure', () => {
		expect(addDays('2026-01-31', 1)).toBe('2026-02-01');
		expect(addDays('2026-12-25', 14)).toBe('2027-01-08');
		expect(addDays('2028-02-28', 1)).toBe('2028-02-29');
		expect(addDays('2026-03-28', 3)).toBe('2026-03-31'); // passage à l'heure d'été
		expect(addDays('2026-10-24', 7)).toBe('2026-10-31'); // passage à l'heure d'hiver
	});

	test('daysBetween et validation des jours', () => {
		expect(daysBetween('2026-11-01', '2026-11-04')).toBe(3);
		expect(daysBetween('2026-11-04', '2026-11-01')).toBe(-3);
		expect(isValidDayKey('2026-02-29')).toBe(false);
		expect(isValidDayKey('2028-02-29')).toBe(true);
		expect(isValidDayKey('04/11/2026')).toBe(false);
		expect(isValidDayKey(20261104)).toBe(false);
	});
});

describe('Planification de Leitner', () => {
	test('une nouvelle carte entre dans la boîte 1 et peut être révisée le jour même', () => {
		const p = createProgress(TODAY);
		expect(p.box).toBe(1);
		expect(p.nextReview).toBe(TODAY);
		expect(p.lastReviewed).toBeNull();
		expect(p.successCount + p.failureCount).toBe(0);
		expect(isDue(p, TODAY)).toBe(true);
	});

	test('chaque boîte a l’intervalle prévu : séance, 1, 3, 7 et 14 jours', () => {
		expect(BOX_INTERVAL_DAYS).toEqual({ 1: 0, 2: 1, 3: 3, 4: 7, 5: 14 });
	});

	test('« Je savais » fait monter la carte d’une boîte et la planifie selon sa nouvelle boîte', () => {
		const expected: Record<number, string> = { 1: '2026-11-05', 2: '2026-11-07', 3: '2026-11-11', 4: '2026-11-18' };
		for (const box of [1, 2, 3, 4] as BoxNumber[]) {
			const after = reviewCard(inBox(box), 'known', TODAY);
			expect(after.box).toBe(box + 1);
			expect(after.nextReview).toBe(expected[box]);
			expect(after.lastReviewed).toBe(TODAY);
		}
	});

	test('« Je savais » en boîte 5 laisse la carte en boîte 5, revue dans 14 jours', () => {
		const after = reviewCard(inBox(5), 'known', TODAY);
		expect(after.box).toBe(5);
		expect(after.nextReview).toBe('2026-11-18');
		expect(nextBox(5, 'known')).toBe(5);
	});

	test('« À revoir » renvoie la carte en boîte 1, à revoir dès la prochaine séance', () => {
		for (const box of [1, 2, 3, 4, 5] as BoxNumber[]) {
			const after = reviewCard(inBox(box), 'forgotten', TODAY);
			expect(after.box).toBe(1);
			expect(after.nextReview).toBe(TODAY);
		}
	});

	test('une évaluation met à jour les compteurs et l’historique sans modifier l’objet initial', () => {
		const start = inBox(3);
		const ok = reviewCard(start, 'known', TODAY);
		const ko = reviewCard(ok, 'forgotten', '2026-11-11');
		expect(start.history).toHaveLength(0);
		expect(start.box).toBe(3);
		expect(ok.successCount).toBe(1);
		expect(ko.failureCount).toBe(1);
		expect(ko.history).toEqual([
			{ day: TODAY, result: 'known', fromBox: 3, toBox: 4 },
			{ day: '2026-11-11', result: 'forgotten', fromBox: 4, toBox: 1 },
		]);
	});

	test('l’historique est plafonné', () => {
		let p = createProgress(TODAY);
		for (let i = 0; i < 100; i++) p = reviewCard(p, i % 2 ? 'known' : 'forgotten', TODAY);
		expect(p.history.length).toBe(60);
		expect(p.successCount + p.failureCount).toBe(100);
	});

	test('seules les cartes arrivées à échéance sont à revoir ; les cartes futures ne sont pas présentées', () => {
		const progress = {
			a: inBox(2, '2026-11-03'), // en retard
			b: inBox(3, TODAY), // aujourd'hui
			c: inBox(4, '2026-11-05'), // demain
			d: inBox(1, TODAY),
		};
		const due = dueCardIds(['a', 'b', 'c', 'd', 'e'], progress, TODAY);
		expect(due).toEqual(['a', 'd', 'b']); // le retard d'abord, puis les boîtes basses
		expect(due).not.toContain('c');
		expect(due).not.toContain('e'); // jamais introduite : nouvelle, pas « à revoir »
		expect(dueCardIds(['c'], progress, '2026-11-05')).toEqual(['c']);
	});

	test('une carte revue avec succès n’est plus à revoir le même jour', () => {
		const after = reviewCard(createProgress(TODAY), 'known', TODAY);
		expect(isDue(after, TODAY)).toBe(false);
		expect(isDue(after, '2026-11-05')).toBe(true);
	});

	test('cartes nouvelles, introductions et révisions du jour', () => {
		const progress = { a: reviewCard(createProgress(TODAY), 'known', TODAY), b: inBox(2) };
		expect(newCardIds(['a', 'b', 'c'], progress)).toEqual(['c']);
		expect(introducedOn(['a', 'b', 'c'], progress, TODAY)).toBe(1);
		expect(reviewsOn(['a', 'b'], progress, TODAY)).toBe(1);
	});

	test('une carte n’est jamais maîtrisée parce qu’elle a seulement été vue', () => {
		const seen = createProgress(TODAY);
		expect(isMastered(seen)).toBe(false);
		expect(cardStatus(undefined)).toBe('new');
		expect(cardStatus(seen)).toBe('learning');
		let p = seen;
		for (let i = 0; i < 3; i++) p = reviewCard(p, 'known', TODAY);
		expect(isMastered(p)).toBe(false); // boîte 4
		p = reviewCard(p, 'known', TODAY);
		expect(isMastered(p)).toBe(true);
		expect(cardStatus(p)).toBe('mastered');
	});

	test('statistiques du paquet', () => {
		const progress = { a: inBox(1), b: inBox(5, '2026-11-10'), c: inBox(3, '2026-11-02') };
		const s = deckStats(['a', 'b', 'c', 'd'], progress, TODAY);
		expect(s).toMatchObject({ total: 4, newCount: 1, dueToday: 2, mastered: 1 });
		expect(s.boxes).toEqual({ 1: 1, 2: 0, 3: 1, 4: 0, 5: 1 });
		expect(s.progress).toBeCloseTo((0 + 1 + 0.5) / 4);
		expect(deckStats([], {}, TODAY).progress).toBe(0);
	});

	test('prochaine échéance, activité et cartes fragiles', () => {
		const shaky = reviewCard(reviewCard(createProgress('2026-11-03'), 'forgotten', '2026-11-03'), 'forgotten', TODAY);
		const progress = { a: inBox(4, '2026-11-09'), b: inBox(2, '2026-11-06'), s: shaky };
		expect(nextDueDay(['a', 'b'], progress, TODAY)).toBe('2026-11-06');
		expect(nextDueDay(['s'], progress, TODAY)).toBeNull();
		const activity = dailyActivity(['s'], progress, TODAY, 3);
		expect(activity.map((d) => d.day)).toEqual(['2026-11-02', '2026-11-03', TODAY]);
		expect(activity[1]).toMatchObject({ known: 0, forgotten: 1 });
		expect(cardsNeedingAttention(['a', 'b', 's'], progress)).toEqual(['s']);
	});
});
