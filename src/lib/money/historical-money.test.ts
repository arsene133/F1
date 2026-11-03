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
	euroEquivalentBounds,
	euroRoundingStep,
	formatEuroAmount,
	formatEuroRange,
	formatFrenchNumber,
	roundEuroAmount,
	withFrenchThousands,
	splitEuroGloss,
	wrapEuroGlossHtml,
} from './historical-money';

const NNBSP = '\u202f'; // espace fine insécable : séparateur de milliers
const NBSP = '\u00a0'; // espace insécable : avant l’unité (€, francs, million d’euros)
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

describe('arrondi d’affichage', () => {
	test('moins de 10 € : au demi-euro', () => {
		expect(roundEuroAmount(4.9)).toBe(5);
		expect(roundEuroAmount(4.4)).toBe(4.5);
		expect(roundEuroAmount(4.24)).toBe(4);
		expect(roundEuroAmount(4.25)).toBe(4.5);
		expect(roundEuroAmount(0.2)).toBe(0);
		expect(roundEuroAmount(5.77)).toBe(6);
		expect(roundEuroAmount(6.55)).toBe(6.5);
	});

	test('de 10 à 99,99 € : à l’euro', () => {
		expect(roundEuroAmount(16.4)).toBe(16);
		expect(roundEuroAmount(16.7)).toBe(17);
		expect(roundEuroAmount(15.56)).toBe(16);
		expect(roundEuroAmount(99.4)).toBe(99);
	});

	test('100 € et plus : à la dizaine d’euros', () => {
		expect(roundEuroAmount(640)).toBe(640);
		expect(roundEuroAmount(645)).toBe(650);
		expect(roundEuroAmount(1234)).toBe(1230);
		expect(roundEuroAmount(1236)).toBe(1240);
		expect(roundEuroAmount(12_345)).toBe(12_350);
		expect(roundEuroAmount(580_000)).toBe(580_000);
		expect(roundEuroAmount(244_801.69)).toBe(244_800);
	});

	test('seuils : juste en dessous, au seuil, juste au-dessus', () => {
		expect([9.99, 10, 10.01].map(euroRoundingStep)).toEqual([0.5, 1, 1]);
		expect([99.99, 100, 100.01].map(euroRoundingStep)).toEqual([1, 10, 10]);
		expect([999_999, 1_000_000, 1_000_001].map(euroRoundingStep)).toEqual([10, 100_000, 100_000]);
		expect(roundEuroAmount(9.74)).toBe(9.5);
		expect(roundEuroAmount(9.99)).toBe(10);
		expect(roundEuroAmount(10)).toBe(10);
		expect(roundEuroAmount(10.4)).toBe(10);
		expect(roundEuroAmount(99.99)).toBe(100);
		expect(roundEuroAmount(100)).toBe(100);
		expect(roundEuroAmount(104)).toBe(100);
		expect(roundEuroAmount(105)).toBe(110);
	});

	test('millions : au dixième de million, sans zéro superflu', () => {
		expect(roundEuroAmount(1_260_000)).toBe(1_300_000);
		expect(roundEuroAmount(1_200_000)).toBe(1_200_000);
		expect(formatEuroAmount(1_260_000)).toBe(`1,3${NBSP}million d’euros`);
		expect(formatEuroAmount(1_200_000)).toBe(`1,2${NBSP}million d’euros`);
		expect(formatEuroAmount(2_000_000)).toBe(`2${NBSP}millions d’euros`);
		expect(formatEuroAmount(5_040_000)).toBe(`5${NBSP}millions d’euros`);
		expect(formatEuroAmount(999_996)).toBe(`1${NBSP}million d’euros`);
	});

	test('montants simples affichés', () => {
		const cases: [number, string][] = [
			[4.9, '5 €'],
			[4.4, '4,5 €'],
			[16.7, '17 €'],
			[640, '640 €'],
			[645, '650 €'],
			[1234, '1 230 €'],
			[12_345, '12 350 €'],
			[580_000, '580 000 €'],
			[5, '5 €'],
		];
		for (const [v, expected] of cases) expect(norm(formatEuroAmount(v))).toBe(expected);
	});
});

describe('fourchettes', () => {
	test('chaque borne est arrondie indépendamment', () => {
		expect(formatEuroRange(5.77, 6.55)).toBe(`6 à 6,5${NBSP}€`);
		expect(formatEuroRange(6922.98, 7858.51)).toBe(`6${NNBSP}920 à 7${NNBSP}860${NBSP}€`);
		expect(formatEuroRange(17_307.44, 19_646.29)).toBe(`17${NNBSP}310 à 19${NNBSP}650${NBSP}€`);
	});

	test('fourchettes en millions', () => {
		expect(formatEuroRange(1_153_800, 1_309_800)).toBe(`1,2 à 1,3${NBSP}million d’euros`);
		expect(formatEuroRange(5_769_000, 6_549_000)).toBe(`5,8 à 6,5${NBSP}millions d’euros`);
		expect(formatEuroRange(1_150_000, 2_040_000)).toBe(`1,2 à 2${NBSP}millions d’euros`);
	});

	test('une fourchette n’est jamais réduite à une valeur par le seul arrondi', () => {
		// 5,26 et 5,74 tombent tous deux sur 5,5 : on arrondit vers l’extérieur.
		expect(formatEuroRange(5.26, 5.74)).toBe(`5 à 6${NBSP}€`);
		expect(formatEuroRange(641, 644)).toBe(`640 à 650${NBSP}€`);
		expect(formatEuroRange(1_210_000, 1_240_000)).toBe(`1,2 à 1,3${NBSP}million d’euros`);
		// Bornes identiques en entrée : valeur unique.
		expect(formatEuroRange(636.48, 636.48)).toBe(`640${NBSP}€`);
	});

	test('l’incertitude historique décide seule de la fourchette (1819-1820 : oui ; 1861-1863 : non)', () => {
		const [lo, hi] = euroEquivalentBounds(1, 'goriot-1819');
		expect(lo).toBeLessThan(hi);
		const [plo, phi] = euroEquivalentBounds(1, 'pot-bouille-1861');
		expect(plo).toBe(phi);
	});
});

describe('typographie française', () => {
	const spaces = (t: string) => [...t].filter((c) => /\s/.test(c)).map((c) => c.codePointAt(0)!.toString(16));

	test('virgule décimale, jamais de point', () => {
		expect(formatFrenchNumber(4.5)).toBe('4,5');
		expect(formatFrenchNumber(1.5)).toBe('1,5');
		expect(formatEuroAmount(4.4)).not.toContain('.');
		expect(formatEuroRange(1_153_800, 1_309_800)).not.toContain('.');
	});

	test('séparateur de milliers : espace fine insécable U+202F', () => {
		expect(formatFrenchNumber(1230)).toBe(`1${NNBSP}230`);
		expect(formatFrenchNumber(50_000)).toBe(`50${NNBSP}000`);
		expect(formatFrenchNumber(1_200_000)).toBe(`1${NNBSP}200${NNBSP}000`);
		expect(spaces(formatFrenchNumber(1_200_000))).toEqual(['202f', '202f']);
		expect(formatFrenchNumber(999)).toBe('999');
	});

	test('espace insécable U+00A0 avant le symbole €', () => {
		expect(formatEuroAmount(5)).toBe(`5${NBSP}€`);
		expect(formatEuroAmount(1234)).toBe(`1${NNBSP}230${NBSP}€`);
		expect(spaces(formatEuroAmount(580_000))).toEqual(['202f', 'a0']);
	});

	test('gloses complètes : ni virgule ni point ni espace ordinaire entre milliers', () => {
		const glosses = [
			eur(1, 'goriot-1819'),
			eur(1200, 'goriot-1819'),
			eur(3000, 'goriot-1819', { inFrancs: '3 000 francs' }),
			eur(200_000, 'goriot-1819'),
			eur(50_000, 'pot-bouille-1861'),
			eur(5000, 'pot-bouille-1861'),
			eur([600_000, 700_000], 'pot-bouille-1861'),
		];
		for (const g of glosses) {
			expect(g).not.toMatch(/\d[ ,. ]\d{3}(?!\d)/);
			expect(g).not.toMatch(/\d[  ]€/);
			expect(g).not.toMatch(/\d\.\d/);
		}
		expect(eur(3000, 'goriot-1819', { inFrancs: '3 000 francs' })).toBe(
			`(3${NNBSP}000${NBSP}francs, soit environ 17${NNBSP}310 à 19${NNBSP}650${NBSP}€ de 2026)`,
		);
	});

	test('withFrenchThousands ne touche qu’aux séparateurs de milliers', () => {
		expect(withFrenchThousands('dot de 50 000 francs, 1 200 000 F, ch. 5 et 12 ans')).toBe(
			`dot de 50${NNBSP}000 francs, 1${NNBSP}200${NNBSP}000 F, ch. 5 et 12 ans`,
		);
		expect(withFrenchThousands('les 21 et 2026')).toBe('les 21 et 2026');
	});

	test('valeurs affichées sur les pages', () => {
		const cases: [Parameters<typeof eur>[0], Parameters<typeof eur>[1], string][] = [
			[1, 'goriot-1819', '(soit environ 6 à 6,5 € de 2026)'],
			[1, 'pot-bouille-1861', '(soit environ 5 € de 2026)'],
			[1, 'charpentier-1882', '(soit environ 4,5 € de 2026)'],
			[70, 'goriot-1819', '(soit environ 400 à 460 € de 2026)'],
			[100, 'goriot-1819', '(soit environ 580 à 650 € de 2026)'],
			[1200, 'goriot-1819', '(soit environ 6 920 à 7 860 € de 2026)'],
			[3000, 'goriot-1819', '(soit environ 17 310 à 19 650 € de 2026)'],
			[7000, 'goriot-1819', '(soit environ 40 380 à 45 840 € de 2026)'],
			[7200, 'goriot-1819', '(soit environ 41 540 à 47 150 € de 2026)'],
			[12_000, 'goriot-1819', '(soit environ 69 230 à 78 590 € de 2026)'],
			[200_000, 'goriot-1819', '(soit environ 1,2 à 1,3 million d’euros de 2026)'],
			[800_000, 'goriot-1819', '(soit environ 4,6 à 5,2 millions d’euros de 2026)'],
			[1_000_000, 'goriot-1819', '(soit environ 5,8 à 6,5 millions d’euros de 2026)'],
			[3.5, 'charpentier-1882', '(soit environ 16 € de 2026)'],
			[130, 'pot-bouille-1861', '(soit environ 640 € de 2026)'],
			[5000, 'pot-bouille-1861', '(soit environ 24 480 € de 2026)'],
			[50_000, 'pot-bouille-1861', '(soit environ 244 800 € de 2026)'],
			[[600_000, 700_000], 'pot-bouille-1861', '(soit environ 2,9 à 3,5 millions d’euros de 2026)'],
		];
		for (const [francs, period, expected] of cases) expect(norm(eur(francs, period))).toBe(expected);
	});
});

describe('non-régression : la conversion n’est pas arrondie', () => {
	test('les bornes gardent leur pleine précision (arrondi au seul affichage)', () => {
		const k = EUROS_2026_PER_FRANC_1900;
		expect(euroEquivalentBounds(1200, 'goriot-1819')).toEqual([1200 * (k / 0.84), 1200 * (k / 0.74)]);
		const [c] = euroEquivalentBounds(50_000, 'pot-bouille-1861');
		expect(c).toBeCloseTo(Math.sqrt(((50_000 * k) / 1.01) * ((50_000 * k) / 0.97)), 6);
		expect(c).not.toBe(Math.round(c));
	});

	test('toutes les sommes des pages passent par l’utilitaire central', () => {
		const sources = [
			'src/pages/goriot.astro',
			'src/pages/pot-bouille.astro',
			'src/data/goriot-places.ts',
			'src/data/goriot-relationships.ts',
			'src/data/goriot-themes.ts',
			'src/data/pot-bouille.ts',
			'src/data/pot-bouille-building.ts',
		];
		for (const f of sources) {
			const src = readFileSync(f, 'utf8');
			// Aucun équivalent rédigé à la main : « soit environ … de 2026 » n’apparaît que via eur().
			expect(src, f).not.toMatch(/soit environ[^<`$]*de 2026/);
		}
		// Les composants interactifs balisent les gloses avec les fonctions partagées.
		for (const c of ['BuildingCutaway', 'GoriotMap', 'GoriotThemesDashboard', 'GoriotRelationshipsMap', 'RelationshipMap']) {
			expect(readFileSync(`src/components/${c}.astro`, 'utf8'), c).toContain('lib/money/historical-money');
		}
	});

	test('la note méthodologique décrit l’arrondi appliqué', () => {
		const note = readFileSync('src/components/money/MoneyConversionNote.astro', 'utf8');
		expect(note).not.toContain('deux chiffres significatifs');
		expect(note).toContain('au demi-euro');
		expect(note).toContain('à la dizaine d’euros');
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
		expect(pacte?.description).toContain(`tribut de 200\u202f000 francs ${gloss}`);
		const scene = goriotThemes.flatMap((t) => t.scenes).find((s) => s.title === 'Le pacte du jardin de la pension');
		expect(scene?.summary).toContain(`commission de 200\u202f000 francs ${gloss}`);
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

describe('données Goriot et Pot-Bouille : milliers en espace fine insécable', () => {
	test('aucune espace ordinaire ni insécable U+00A0 entre groupes de milliers dans les textes affichés', () => {
		const files = [
			'src/data/goriot-places.ts',
			'src/data/goriot-relationships.ts',
			'src/data/goriot-themes.ts',
			'src/data/pot-bouille.ts',
			'src/data/pot-bouille-building.ts',
		];
		for (const f of files) {
			const lines = readFileSync(f, 'utf8').split('\n');
			lines.forEach((l, i) => {
				if (/^\s*(\/\/|\*|\/\*)/.test(l)) return;
				expect(l, `${f}:${i + 1}`).not.toMatch(/\d[ \u202f]\d{3}(?!\d)/);
			});
		}
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
