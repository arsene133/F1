import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { goriotPlaces } from '../../data/goriot-places';
import { goriotCharacters, goriotRelationships } from '../../data/goriot-relationships';
import { goriotThemes } from '../../data/goriot-themes';
import {
	EUROS_2026_PER_FRANC_1900,
	EURO_GLOSS_PATTERN,
	MONEY_PERIODS,
	eur,
	formatEuroRange,
	roundSignificant,
	splitEuroGloss,
	wrapEuroGlossHtml,
} from './historical-money';

const NNBSP = ' '; // séparateur de milliers fr-FR
const NBSP = ' '; // avant « € »
const norm = (s: string) => s.replaceAll(NNBSP, ' ').replaceAll(NBSP, ' ');

describe('coefficients', () => {
	test('un franc de 1900 vaut environ 4,85 € de 2026 (calcul refait à la main)', () => {
		// 2 406,11 anciens francs de 2009 → euros de 2009 → euros de 2025 (INSEE) → 2026 (+1,9 %)
		const expected = ((2406.11 / 100 / 6.55957) * (100 / 77.13)) * 1.019;
		expect(EUROS_2026_PER_FRANC_1900).toBeCloseTo(expected, 10);
		expect(EUROS_2026_PER_FRANC_1900).toBeCloseTo(4.846, 3);
	});

	test('bornes par période, d’après les indices de prix (1900 = 1)', () => {
		const k = EUROS_2026_PER_FRANC_1900;
		expect(MONEY_PERIODS['goriot-1819'].eurosPerFranc).toEqual([k / 0.84, k / 0.74]);
		expect(MONEY_PERIODS['pot-bouille-1861'].eurosPerFranc).toEqual([k / 1.01, k / 0.97]);
		expect(MONEY_PERIODS['charpentier-1882'].eurosPerFranc).toEqual([k / 1.09, k / 1.09]);
	});
});

describe('formatage', () => {
	test('arrondi à deux chiffres significatifs', () => {
		expect(roundSignificant(6923)).toBe(6900);
		expect(roundSignificant(15.56)).toBe(16);
		expect(roundSignificant(244_805)).toBe(240_000);
	});

	test('typographie française', () => {
		expect(formatEuroRange(6923, 7859)).toBe(`6${NNBSP}900 à 7${NNBSP}900${NBSP}€`);
		expect(formatEuroRange(1_153_800, 1_309_800)).toBe(`1,2 à 1,3${NBSP}million d’euros`);
		expect(formatEuroRange(5_769_000, 6_549_000)).toBe(`5,8 à 6,5${NBSP}millions d’euros`);
	});

	test('valeurs affichées sur les pages', () => {
		const cases: [Parameters<typeof eur>[0], Parameters<typeof eur>[1], string][] = [
			[1200, 'goriot-1819', '(soit environ 6 900 à 7 900 € de 2026)'],
			[100, 'goriot-1819', '(soit environ 580 à 650 € de 2026)'],
			[7000, 'goriot-1819', '(soit environ 40 000 à 46 000 € de 2026)'],
			[3000, 'goriot-1819', '(soit environ 17 000 à 20 000 € de 2026)'],
			[800_000, 'goriot-1819', '(soit environ 4,6 à 5,2 millions d’euros de 2026)'],
			[1_000_000, 'goriot-1819', '(soit environ 5,8 à 6,5 millions d’euros de 2026)'],
			[50_000, 'pot-bouille-1861', '(soit environ 240 000 € de 2026)'],
			[[600_000, 700_000], 'pot-bouille-1861', '(soit environ 2,9 à 3,5 millions d’euros de 2026)'],
			[130, 'pot-bouille-1861', '(soit environ 640 € de 2026)'],
			[3.5, 'charpentier-1882', '(soit environ 16 € de 2026)'],
		];
		for (const [francs, period, expected] of cases) expect(norm(eur(francs, period))).toBe(expected);
		expect(norm(eur(3000, 'goriot-1819', { inFrancs: '3 000 francs' }))).toBe(
			'(3 000 francs, soit environ 17 000 à 20 000 € de 2026)',
		);
	});
});

describe('repérage des gloses', () => {
	test('découpe et balisage', () => {
		const text = `cent francs ${eur(100, 'goriot-1819')} et mille écus ${eur(3000, 'goriot-1819', { inFrancs: '3 000 francs' })}.`;
		const segs = splitEuroGloss(text);
		expect(segs.filter((s) => s.gloss)).toHaveLength(2);
		expect(segs.map((s) => s.text).join('')).toBe(text);
		expect(wrapEuroGlossHtml(text).match(/class="eur-eq"/g)).toHaveLength(2);
		expect(splitEuroGloss('(ch. VIII) sans glose')).toEqual([{ text: '(ch. VIII) sans glose', gloss: false }]);
	});
});

describe('commission de Vautrin : 20 % d’une dot d’un million = 200 000 francs', () => {
	// « si je vous procure une dot d’un million, me donnerez-vous deux cent mille francs ? »
	const gloss = eur(200_000, 'goriot-1819');

	test('la citation source reste celle de Balzac', () => {
		const goriot = readFileSync('src/pages/goriot.astro', 'utf8');
		expect(goriot).toContain('si je vous procure une dot d’un million, me donnerez-vous deux cent mille francs ? Vingt pour cent de commission');
	});

	test('relation Vautrin → Rastignac et scène du jardin : montant et équivalent', () => {
		const pacte = goriotRelationships.find((r) => r.id === 'vautrin-rastignac');
		expect(pacte?.description).toContain(`tribut de 200 000 francs ${gloss}`);
		const scene = goriotThemes.flatMap((t) => t.scenes).find((s) => s.title === 'Le pacte du jardin de la pension');
		expect(scene?.summary).toContain(`commission de 200 000 francs ${gloss}`);
		expect(norm(gloss)).toBe('(soit environ 1,2 à 1,3 million d’euros de 2026)');
	});

	test('plus aucune commission à 100 000 francs dans les données Goriot', () => {
		const texts = [
			...goriotRelationships.map((r) => r.description),
			...goriotCharacters.flatMap((c) => [c.description, c.socialRole, ...c.keyFacts]),
			...goriotThemes.flatMap((t) => [t.studentExplanation, ...t.keyObservations, ...t.scenes.flatMap((s) => [s.summary, s.literarySignificance])]),
			...goriotPlaces.flatMap((p) => [p.narrativeRole, p.literaryAnalysis, p.narrativeStepExplanation]),
		];
		for (const t of texts) expect(t).not.toMatch(/100 000 francs|(?<!(?:deux|trois|quatre|cinq|six|sept|huit|neuf) )cent mille francs/i);
	});
});

describe('les citations restent intactes', () => {
	const hasGloss = (s: string | undefined) => !!s && new RegExp(EURO_GLOSS_PATTERN.source).test(s);

	test('aucune glose dans les citations des données', () => {
		for (const p of goriotPlaces) expect(hasGloss(p.quotation), p.id).toBe(false);
		for (const c of goriotCharacters) expect(hasGloss(c.quote?.text), c.id).toBe(false);
		for (const r of goriotRelationships) expect(hasGloss(r.textualQuote?.text), r.id).toBe(false);
		for (const t of goriotThemes) for (const q of t.quotations) expect(hasGloss(q.text), t.id).toBe(false);
	});

	test('aucune glose à l’intérieur des blockquote des pages', () => {
		for (const page of ['src/pages/goriot.astro', 'src/pages/pot-bouille.astro']) {
			const src = readFileSync(page, 'utf8');
			for (const [, inner] of src.matchAll(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/g)) {
				expect(inner, page).not.toContain('EuroEquivalent');
			}
		}
	});

	test('les sommes d’origine sont toujours présentes', () => {
		const goriot = readFileSync('src/pages/goriot.astro', 'utf8');
		for (const s of ['douze cents francs', '« près de huit cent mille francs »', 'mille écus', 'vingt sous', 'Cent francs', 'Sept mille francs', 'il y a cent francs', 'rapportez-moi six mille francs', 'me donnerez-vous deux cent mille francs ?']) {
			expect(goriot).toContain(s);
		}
		const potBouille = readFileSync('src/pages/pot-bouille.astro', 'utf8');
		expect(potBouille).toContain('3 fr. 50');
		expect(potBouille).toContain('dot de cinquante mille\n\t\t\t\t\t\t\tfrancs');
	});
});
