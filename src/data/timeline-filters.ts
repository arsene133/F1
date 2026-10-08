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
		description: 'Vue d’ensemble des régimes, révolutions, guerres et œuvres.',
	},
	{
		id: 'literature',
		label: 'Littérature',
		description: 'Les œuvres de Musset, Balzac, Rimbaud et Zola dans leur époque.',
	},
	{
		id: 'history',
		label: 'Histoire',
		description: 'Événements politiques, ruptures et contextes historiques.',
	},
	{
		id: 'regimes',
		label: 'Régimes politiques',
		description: 'Succession des monarchies, empires et républiques au XIXe siècle.',
	},
	{
		id: 'revolutions-wars',
		label: 'Révolutions & guerres',
		description: 'Les ruptures armées et populaires (1789, 1830, 1848, 1870, Sedan, 1871).',
	},
	{
		id: 'industry',
		label: 'Industrie',
		description: 'Transformation du système productif : vapeur, chemin de fer, acier, électricité, moteur.',
	},
];
