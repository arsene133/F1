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
