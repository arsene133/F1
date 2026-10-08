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
		description: 'Régimes politiques, révolutions, guerres et contextes historiques du XIXe siècle.',
	},
	{
		id: 'literature',
		label: 'Littérature',
		description: 'Les œuvres de Musset, Balzac, Rimbaud et Zola dans leur époque.',
	},
	{
		id: 'science',
		label: 'Sciences',
		description: 'Découvertes et théories majeures : électricité, évolution, thermodynamique, algèbre, chimie.',
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
		description: 'De la transition beethovénienne au romantisme français, à l’opéra moderne et au drame wagnérien.',
	},
];

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
