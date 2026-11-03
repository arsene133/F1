/**
 * Équivalents en euros de 2026 des sommes en francs du XIXᵉ siècle.
 *
 * Méthode (pouvoir d'achat à la consommation, pas teneur en métal) :
 *
 *   1 franc de l'année t = (P₁₉₀₀ / Pₜ) × (valeur en € 2009 d'un franc de 1900)
 *                          × (IPC 2025 / IPC 2009) × (IPC 2026 / IPC 2025)
 *
 * - Pₜ : indice des prix à la consommation, base 1900 = 1,00, Piketty (2010),
 *   Data Appendix, Table A20, col. 1 (INSEE-SGF à partir de 1891 ; série de
 *   Friggit pour 1800-1890). Le même tableau donne P₂₀₀₉ = 2 406,11, soit
 *   2 406,11 anciens francs = 24,0611 francs = 3,6681 € de 2009 pour un franc de 1900.
 * - IPC 2009 → 2025 : coefficients de transformation de l'INSEE, base 2025
 *   (série 011813530, celle du convertisseur franc-euro) : 77,13 → 100.
 * - 2025 → 2026 : la moyenne annuelle 2026 n'est pas encore publiée ; on applique
 *   le glissement annuel moyen de l'IPC de janvier à septembre 2026 (+1,9 %,
 *   septembre provisoire), INSEE, Informations rapides, 30 septembre 2026.
 */

export const TARGET_YEAR = 2026;

const EUROS_2009_PER_FRANC_1900 = 2406.11 / 100 / 6.55957; // ≈ 3,6681 €
const INSEE_COEFF_2009 = 77.13;
const INSEE_COEFF_2025 = 100;
const CPI_2026_OVER_2025 = 1.019;

/** Valeur, en euros de 2026, d'un franc de 1900. ≈ 4,85 €. */
export const EUROS_2026_PER_FRANC_1900 =
	EUROS_2009_PER_FRANC_1900 * (INSEE_COEFF_2025 / INSEE_COEFF_2009) * CPI_2026_OVER_2025;

/** Indice des prix à la consommation, 1900 = 1,00 (Piketty 2010, Table A20, col. 1). */
export const CPI_1900_BASE: Readonly<Record<number, number>> = {
	1819: 0.84,
	1820: 0.74,
	1861: 1.01,
	1862: 0.98,
	1863: 0.97,
	1882: 1.09,
};

export type MoneyPeriodId = 'goriot-1819' | 'pot-bouille-1861' | 'charpentier-1882';

export interface MoneyPeriod {
	id: MoneyPeriodId;
	label: string;
	/** Années dont les indices de prix bornent l'estimation. */
	years: readonly number[];
	/** Euros de 2026 pour un franc de la période : [bas, haut]. */
	eurosPerFranc: readonly [number, number];
	/** Commentaire sur la fiabilité de l'estimation. */
	reliability: string;
}

function periodRange(years: readonly number[]): [number, number] {
	const values = years.map((y) => EUROS_2026_PER_FRANC_1900 / CPI_1900_BASE[y]);
	return [Math.min(...values), Math.max(...values)];
}

function definePeriod(p: Omit<MoneyPeriod, 'eurosPerFranc'>): MoneyPeriod {
	return { ...p, eurosPerFranc: periodRange(p.years) };
}

export const MONEY_PERIODS: Readonly<Record<MoneyPeriodId, MoneyPeriod>> = {
	'goriot-1819': definePeriod({
		id: 'goriot-1819',
		label: 'Paris, novembre 1819 – février 1820 (action du Père Goriot)',
		years: [1819, 1820],
		reliability:
			'Estimation incertaine : les prix baissent d’environ 12 % entre 1819 et 1820, au sortir de la crise de 1816-1817, et les séries de prix de la Restauration sont moins solides que celles de la fin du siècle. On donne donc une fourchette.',
	}),
	'pot-bouille-1861': definePeriod({
		id: 'pot-bouille-1861',
		label: 'Paris, 1861-1863 (action de Pot-Bouille)',
		years: [1861, 1862, 1863],
		reliability:
			'Estimation plus sûre : les prix varient peu de 1861 à 1863 (indice de 0,97 à 1,01, base 1900 = 1).',
	}),
	'charpentier-1882': definePeriod({
		id: 'charpentier-1882',
		label: '1882 (publication de Pot-Bouille)',
		years: [1882],
		reliability: 'Prix éditorial de l’année de publication, converti avec l’indice de 1882.',
	}),
};

/* ------------------------------------------------------------------ */
/* Formatage                                                           */
/* ------------------------------------------------------------------ */

const NBSP = ' ';
// Intl fr-FR sépare les milliers par une espace fine insécable (U+202F).
const frNumber = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 });

/** Arrondit à deux chiffres significatifs : une estimation, pas un compte. */
export function roundSignificant(value: number, digits = 2): number {
	if (value === 0) return 0;
	const magnitude = Math.floor(Math.log10(Math.abs(value)));
	const factor = 10 ** (magnitude - digits + 1);
	return Math.round(value / factor) * factor;
}

function formatMillions(value: number): string {
	return frNumber.format(roundSignificant(value) / 1_000_000);
}

/** « 6 900 à 7 900 € », « 240 000 € », « 5,8 à 6,5 millions d’euros ». */
export function formatEuroRange(low: number, high: number): string {
	const lo = roundSignificant(low);
	const hi = roundSignificant(high);
	const single = lo === hi;
	if (lo >= 1_000_000) {
		// Accord français : « million » ne prend la marque du pluriel qu'à partir de deux.
		const unit = hi >= 2_000_000 ? 'millions d’euros' : 'million d’euros';
		return single
			? `${formatMillions(lo)}${NBSP}${unit}`
			: `${formatMillions(lo)} à ${formatMillions(hi)}${NBSP}${unit}`;
	}
	return single ? `${frNumber.format(lo)}${NBSP}€` : `${frNumber.format(lo)} à ${frNumber.format(hi)}${NBSP}€`;
}

/**
 * Au-delà de cet écart relatif entre bornes, on affiche une fourchette ;
 * en deçà, une valeur centrale (moyenne géométrique des bornes).
 */
const RANGE_THRESHOLD = 0.08;

export interface EuroEquivalentOptions {
	/** Conversion préalable d'une autre dénomination, ex. « 3 000 francs » pour « mille écus ». */
	inFrancs?: string;
}

/** Bornes basse et haute, en euros de 2026, d'une somme en francs. */
export function euroEquivalentBounds(francs: number | readonly [number, number], periodId: MoneyPeriodId): [number, number] {
	const [fLow, fHigh] = typeof francs === 'number' ? [francs, francs] : francs;
	const [kLow, kHigh] = MONEY_PERIODS[periodId].eurosPerFranc;
	const low = fLow * kLow;
	const high = fHigh * kHigh;
	if ((high - low) / ((high + low) / 2) <= RANGE_THRESHOLD) {
		const central = Math.sqrt(low * high);
		return [central, central];
	}
	return [low, high];
}

/** Texte de l'équivalent, sans parenthèses : « soit environ 6 900 à 7 900 € de 2026 ». */
export function euroEquivalentText(
	francs: number | readonly [number, number],
	periodId: MoneyPeriodId,
	options: EuroEquivalentOptions = {},
): string {
	const [low, high] = euroEquivalentBounds(francs, periodId);
	const core = `soit environ ${formatEuroRange(low, high)} de ${TARGET_YEAR}`;
	if (!options.inFrancs) return core;
	// Espaces insécables : séparateur de milliers fin (« 3 000 ») et avant l'unité (« 3 000 francs »).
	const inFrancs = options.inFrancs.replace(/(\d) (?=\d{3}\b)/g, '$1 ').replace(/(\d) (?=francs?\b)/g, '$1 ');
	return `${inFrancs}, ${core}`;
}

/** Glose parenthétique à insérer dans un texte : « (soit environ … de 2026) ». */
export function eur(
	francs: number | readonly [number, number],
	periodId: MoneyPeriodId,
	options: EuroEquivalentOptions = {},
): string {
	return `(${euroEquivalentText(francs, periodId, options)})`;
}

/* ------------------------------------------------------------------ */
/* Repérage des gloses dans les textes de données                      */
/* ------------------------------------------------------------------ */

/** Reconnaît exactement les gloses produites par `eur()`. */
export const EURO_GLOSS_PATTERN = new RegExp(`\\((?:[^()]*?, )?soit environ [^()]*? de ${TARGET_YEAR}\\)`, 'g');

export interface TextSegment {
	text: string;
	gloss: boolean;
}

/** Découpe un texte en segments ordinaires et gloses d'équivalent en euros. */
export function splitEuroGloss(text: string): TextSegment[] {
	const segments: TextSegment[] = [];
	let last = 0;
	for (const match of text.matchAll(EURO_GLOSS_PATTERN)) {
		const start = match.index ?? 0;
		if (start > last) segments.push({ text: text.slice(last, start), gloss: false });
		segments.push({ text: match[0], gloss: true });
		last = start + match[0].length;
	}
	if (last < text.length) segments.push({ text: text.slice(last), gloss: false });
	return segments;
}

export const EURO_GLOSS_CLASS = 'eur-eq';

/** Rendu DOM (scripts clients) : remplace le contenu de `el` par le texte, gloses balisées. */
export function setTextWithEuroGloss(el: Element, text: string): void {
	el.textContent = '';
	appendTextWithEuroGloss(el, text);
}

/** Rendu DOM (scripts clients) : ajoute le texte à la fin de `el`, gloses balisées. */
export function appendTextWithEuroGloss(el: Element, text: string): void {
	for (const seg of splitEuroGloss(text)) {
		if (!seg.gloss) {
			el.append(seg.text);
			continue;
		}
		const span = document.createElement('span');
		span.className = EURO_GLOSS_CLASS;
		span.textContent = seg.text;
		el.append(span);
	}
}

/**
 * Variante pour les gabarits `innerHTML` existants (données internes de
 * confiance) : balise les gloses sans rien changer au reste du texte.
 */
export function wrapEuroGlossHtml(text: string): string {
	return text.replace(EURO_GLOSS_PATTERN, (m) => `<span class="${EURO_GLOSS_CLASS}">${m}</span>`);
}

/* ------------------------------------------------------------------ */
/* Sources citées dans la note méthodologique                          */
/* ------------------------------------------------------------------ */

export interface MoneySource {
	label: string;
	detail: string;
	href: string;
}

export const MONEY_SOURCES: readonly MoneySource[] = [
	{
		label: 'Thomas Piketty, « On the Long-Run Evolution of Inheritance: France 1820-2050 », annexe de données, 2010',
		detail:
			'Table A20, col. 1 : indice des prix à la consommation 1800-2009 (INSEE-SGF depuis 1891, série de Friggit avant) ; Table A2 : revenu national par adulte.',
		href: 'http://piketty.pse.ens.fr/files/Piketty2010DataAppendixPart2.pdf',
	},
	{
		label: 'INSEE, coefficient de transformation de l’euro ou du franc d’une année en euro ou franc d’une autre année (base 2025)',
		detail: 'Série 011813530, qui alimente le convertisseur franc-euro (disponible à partir de 1901).',
		href: 'https://www.insee.fr/fr/statistiques/serie/011813530',
	},
	{
		label: 'INSEE, convertisseur franc-euro : pouvoir d’achat de l’euro et du franc',
		detail: 'Méthode : indice des prix à la consommation, moyenne annuelle.',
		href: 'https://www.insee.fr/fr/information/2417794',
	},
	{
		label: 'INSEE, Informations rapides, « Indice des prix à la consommation – septembre 2026 »',
		detail: 'Glissements annuels mensuels de 2026, utilisés pour passer des euros de 2025 aux euros de 2026.',
		href: 'https://www.insee.fr/fr/statistiques/9056956',
	},
];

/**
 * Revenu national par adulte (Piketty 2010, Table A2, euros de 2009) :
 * sert à rappeler qu'une somme pesait beaucoup plus lourd, rapportée aux revenus
 * de l'époque, que ne le dit sa seule conversion en pouvoir d'achat.
 */
export const NATIONAL_INCOME_PER_ADULT_2009_EUROS = {
	1820: 2991,
	1860: 4061,
	2009: 35380,
} as const;
