export interface FilterOption {
	id: string;
	label: string;
	description: string;
	count?: number;
}

export const timelineFilters: FilterOption[] = [
	{
		id: 'all',
		label: 'Tout',
		description: 'Vue d’ensemble des régimes, révolutions, guerres, sciences, industrie, littérature, peinture et musique.',
	},
	{
		id: 'history',
		label: 'Histoire',
		description: 'Monarchie absolue, régimes politiques, révolutions, guerres et contextes historiques.',
	},
	{
		id: 'literature',
		label: 'Littérature',
		description: 'Les œuvres de Molière, Musset, Balzac, Rimbaud et Zola dans leur époque.',
	},
	{
		id: 'science',
		label: 'Sciences',
		description: 'Revues savantes, théories et découvertes majeures : de 1665 à l’électricité, l’évolution et la chimie.',
	},
	{
		id: 'industry',
		label: 'Industrie',
		description: 'Transformation du système productif : vapeur, chemin de fer, acier, électricité, moteur.',
	},
	{
		id: 'painting',
		label: 'Peinture',
		description: 'Des toiles révolutionnaires de David au réalisme de Courbet et à l’émergence de l’impressionnisme.',
	},
	{
		id: 'music',
		label: 'Musique',
		description: 'De la musique de cour et comédie-ballet (Lully) au romantisme, à l’opéra moderne et au drame wagnérien.',
	},
];

/** Filtre actif à l'ouverture de la frise : la littérature en détail, le reste en bref. */
export const DEFAULT_TIMELINE_FILTER = 'literature';

/** Rappel de la hiérarchie sous la barre de filtres (vide pour « Tout ») */
export function timelineFilterStatusHtml(filterId: string, label: string, matchCount: number): string {
	if (filterId === 'all') return '';
	return `<strong>${label} · ${matchCount} ${matchCount > 1 ? 'événements' : 'événement'}</strong> en détail ; les autres restent dans la chronologie, en bref.`;
}

/** Catégories qui ont leur propre filtre : tout le reste (régimes, révolutions, guerres, événements) relève de l'Histoire. */
const CATEGORY_FILTERS = new Set(['literature', 'science', 'industry', 'painting', 'music']);

/** Un repère de type `type` correspond-il au filtre `filterId` ? (« Tout » : toujours) */
export function matchesTimelineFilter(type: string, filterId: string): boolean {
	if (filterId === 'all') return true;
	if (filterId === 'history') return !CATEGORY_FILTERS.has(type);
	return type === filterId;
}

/** Contenu de la ligne compacte d'un repère (mobile, filtre actif) : « DATE · TITRE — PRÉCISION » */
export interface CompactEntryParts {
	date: string;
	title: string;
	detail?: string;
}

export function compactEntryParts(item: {
	year: number;
	endYear?: number;
	title: string;
	author?: string;
	subtitle?: string;
}): CompactEntryParts {
	const date = item.endYear && item.endYear > item.year ? `${item.year}–${item.endYear}` : String(item.year);
	// Précision : l'auteur d'une œuvre, sinon le sous-titre débarrassé de sa date (« 1769 · James Watt » → « James Watt »).
	// Un sous-titre qui n'est qu'une date (« 1789–1799 », « Février 1848 ») n'apporte rien sur une ligne déjà datée.
	let detail = item.author;
	if (!detail && item.subtitle) {
		const afterDate = item.subtitle.includes('·') ? item.subtitle.split('·').slice(1).join('·').trim() : item.subtitle.trim();
		if (afterDate && !/\d/.test(afterDate)) detail = afterDate;
	}
	return { date, title: item.title, detail };
}
