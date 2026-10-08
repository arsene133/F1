export type TimelineItemType = 'history' | 'political-regime' | 'revolution' | 'war' | 'literature';

export type LiteratureCategory = 'novel' | 'theatre' | 'poetry';
export type HistoryCategory = 'revolution' | 'regime' | 'war' | 'event' | 'uprising' | 'coup';

export interface TimelinePeriod {
	id: string;
	title: string;
	startYear: number;
	endYear: number;
	displayDates: string;
	description: string;
	colorTheme: string;
	fadeEnd?: boolean;
}

export interface TimelineItemImage {
	src: string;
	alt: string;
	caption?: string;
}

export interface TimelineItem {
	id: string;
	year: number;
	endYear?: number;
	datePrecise?: string;
	type: TimelineItemType;
	category: LiteratureCategory | HistoryCategory;
	title: string;
	subtitle?: string;
	author?: string;
	authorDates?: string;
	tagLabel?: string;
	description: string;
	historicalContext: string;
	periodId: string;
	relatedTo: string[];
	quote?: string;
	importance?: 'major' | 'standard';
	image?: TimelineItemImage;
}

export const TIMELINE_START_YEAR = 1785;
export const TIMELINE_END_YEAR = 1890;

export const timelinePeriods: TimelinePeriod[] = [
	{
		id: 'revolution-francaise-regime',
		title: 'Révolution française',
		startYear: 1789,
		endYear: 1799,
		displayDates: '1789–1799',
		description: 'Période de rupture radicale avec l’Ancien Régime : souveraineté nationale, république, Terreur et transformations politiques profondes.',
		colorTheme: 'revolution',
	},
	{
		id: 'consulat',
		title: 'Consulat (Bonaparte)',
		startYear: 1799,
		endYear: 1804,
		displayDates: '1799–1804',
		description: 'Régime autoritaire issu du 18 Brumaire préparant la concentration du pouvoir personnel avant la proclamation impériale.',
		colorTheme: 'consulat',
	},
	{
		id: 'premier-empire',
		title: 'Premier Empire',
		startYear: 1804,
		endYear: 1815,
		displayDates: '1804–1815',
		description: 'Règne de Napoléon Ier : expansion européenne, centralisation administrative, Code civil, jusqu’à la défaite de Waterloo.',
		colorTheme: 'empire',
	},
	{
		id: 'restauration',
		title: 'Restauration',
		startYear: 1815,
		endYear: 1830,
		displayDates: '1815–1830',
		description: 'Retour des Bourbons (Louis XVIII puis Charles X). Tensions vives entre fidélité à l’Ancien Régime, acquis révolutionnaires et montée des aspirations libérales.',
		colorTheme: 'restauration',
	},
	{
		id: 'monarchie-juillet',
		title: 'Monarchie de Juillet',
		startYear: 1830,
		endYear: 1848,
		displayDates: '1830–1848',
		description: 'Louis-Philippe · monarchie constitutionnelle · essor de la bourgeoisie · transformations sociales et économiques · enrichissement et affairisme.',
		colorTheme: 'monarchie-juillet',
	},
	{
		id: 'deuxieme-republique',
		title: 'Deuxième République',
		startYear: 1848,
		endYear: 1852,
		displayDates: '1848–1852',
		description: 'Période brève mais décisive : suffrage universel masculin, abolition de l’esclavage, espoirs démocratiques brisés par les journées de Juin puis le coup d’État.',
		colorTheme: 'deuxieme-republique',
	},
	{
		id: 'second-empire',
		title: 'Second Empire',
		startYear: 1852,
		endYear: 1870,
		displayDates: '1852–1870',
		description: 'Louis-Napoléon Bonaparte / Napoléon III · industrialisation · transformation de Paris par Haussmann · capitalisme triomphant · autoritarisme puis libéralisation.',
		colorTheme: 'second-empire',
	},
	{
		id: 'troisieme-republique',
		title: 'Troisième République',
		startYear: 1870,
		endYear: 1890, // Pour la frise XIXe, visualisée jusqu'à 1890 avec fondu
		displayDates: '1870–1940 (focus XIXe s.)',
		description: 'Régime républicain durable né dans la défaite et l’épreuve de la Commune. Installation progressive des institutions laïques, scolaires et démocratiques.',
		colorTheme: 'troisieme-republique',
		fadeEnd: true,
	},
];

export const timelineItems: TimelineItem[] = [
	// 1789 - Révolution française
	{
		id: 'revolution-francaise',
		year: 1789,
		endYear: 1799,
		datePrecise: '1789–1799',
		type: 'revolution',
		category: 'revolution',
		title: 'Révolution française',
		subtitle: '1789–1799',
		description: 'Prise de la Bastille (1789), proclamation de la République (1792), Terreur (1793–1794), coup d’État du 18 Brumaire (1799). Rupture inaugurale de la modernité politique.',
		historicalContext: 'La Révolution détruit l’ordre féodal et invente la nation politique moderne. Elle constitue la matrice de toutes les secousses du XIXe siècle.',
		periodId: 'revolution-francaise-regime',
		relatedTo: ['bonaparte-consulat', 'premier-empire', 'restauration'],
		importance: 'major',
	},

	// 1799 - Bonaparte / Consulat
	{
		id: 'bonaparte-consulat',
		year: 1799,
		endYear: 1804,
		datePrecise: '1799–1804',
		type: 'political-regime',
		category: 'regime',
		title: 'Bonaparte / Consulat',
		subtitle: '1799–1804',
		description: 'Coup d’État du 18 Brumaire an VIII (novembre 1799). Napoléon Bonaparte réorganise l’État (préfets, Banque de France, Code civil) avant d’être proclamé empereur en 1804.',
		historicalContext: 'Le Consulat stabilise l’héritage bourgeois de la Révolution tout en instaurant un régime personnel et centralisé.',
		periodId: 'consulat',
		relatedTo: ['revolution-francaise', 'premier-empire'],
		importance: 'standard',
	},

	// 1804 - Premier Empire
	{
		id: 'premier-empire-event',
		year: 1804,
		endYear: 1815,
		datePrecise: '1804–1815',
		type: 'political-regime',
		category: 'regime',
		title: 'Premier Empire',
		subtitle: '1804–1815',
		description: 'Proclamation de l’Empire et sacre de Napoléon Ier en 1804. Épopée militaire à travers l’Europe, blocus continental et effondrement à Waterloo en 1815.',
		historicalContext: 'L’épopée napoléonienne laisse dans la jeunesse romantique (le « mal du siècle » décrit par Musset) la nostalgie d’une gloire héroïque impossible dans le siècle marchand.',
		periodId: 'premier-empire',
		relatedTo: ['bonaparte-consulat', 'restauration', 'on-ne-badine-pas'],
		importance: 'major',
	},

	// 1815 - Restauration
	{
		id: 'restauration-event',
		year: 1815,
		endYear: 1830,
		datePrecise: '1815–1830',
		type: 'political-regime',
		category: 'regime',
		title: 'Restauration monarchique',
		subtitle: '1815–1830',
		description: 'Retour des Bourbons (Louis XVIII, puis Charles X). Tensions politiques entre royalistes ultra, libéraux et transformations sociales d’une France en mutation.',
		historicalContext: 'Le retour de la monarchie et le sacre de Charles X créent un climat de censure et d’inquiétude qui nourrit la contestation libérale et la sensibilité romantique.',
		periodId: 'restauration',
		relatedTo: ['premier-empire-event', 'revolution-juillet-1830'],
		importance: 'standard',
	},

	// 1830 - Les Trois Glorieuses
	{
		id: 'revolution-juillet-1830',
		year: 1830,
		datePrecise: '27, 28 et 29 juillet 1830',
		type: 'revolution',
		category: 'revolution',
		title: 'Révolution de Juillet (Les Trois Glorieuses)',
		subtitle: '27, 28 et 29 juillet 1830',
		description: 'Soulèvement du peuple de Paris contre les ordonnances liberticides de Charles X. Chute des Bourbons de la branche aînée et avènement de la Monarchie de Juillet.',
		historicalContext: 'La révolution est confisquée au profit de la haute bourgeoisie financière : Louis-Philippe monte sur le trône sous l’étiquette de « roi des Français ».',
		periodId: 'monarchie-juillet',
		relatedTo: ['restauration-event', 'on-ne-badine-pas', 'pere-goriot'],
		importance: 'major',
	},

	// 1834 - On ne badine pas avec l'amour (Alfred de Musset)
	{
		id: 'on-ne-badine-pas',
		year: 1834,
		type: 'literature',
		category: 'theatre',
		title: "On ne badine pas avec l'amour",
		subtitle: '1834 · Alfred de Musset',
		author: 'Alfred de Musset',
		authorDates: '1810–1857',
		tagLabel: 'Théâtre · proverbe dramatique',
		description: "Proverbe dramatique où l'amour se heurte à l'orgueil, à la méfiance et au jeu de la séduction. Publié pour la première fois dans la Revue des Deux Mondes en 1834.",
		historicalContext: "Composée sous la Monarchie de Juillet après l’échec sentimental de Venise avec George Sand, la pièce traduit le désenchantement d’une jeunesse romantique née des cendres de l’Empire, privée d'idéal héroïque dans une société dominée par l’utilité et la raison bourgeoise.",
		periodId: 'monarchie-juillet',
		relatedTo: ['monarchie-juillet', 'revolution-juillet-1830', 'pere-goriot'],
		quote: '« On est souvent trompé en amour, souvent blessé et souvent malheureux ; mais on aime, et quand on est sur le bord de sa tombe, on se retourne pour regarder en arrière, et on se dit : j’ai souffert souvent, je me suis trompé quelquefois, mais j’ai aimé. »',
		importance: 'major',
	},

	// 1835 - Le Père Goriot (Honoré de Balzac)
	{
		id: 'pere-goriot',
		year: 1835,
		type: 'literature',
		category: 'novel',
		title: 'Le Père Goriot',
		subtitle: '1835 · Honoré de Balzac',
		author: 'Honoré de Balzac',
		authorDates: '1799–1850',
		tagLabel: 'Roman · La Comédie humaine',
		description: 'Paris, argent, ambition sociale et mécanismes de la société bourgeoise. Paru d’abord en feuilleton (1834–1835) puis en volume en 1835.',
		historicalContext: 'Le Père Goriot paraît en pleine Monarchie de Juillet, période dans laquelle Balzac observe les mécanismes de l’ascension sociale, de l’argent et du pouvoir à Paris.',
		periodId: 'monarchie-juillet',
		relatedTo: ['monarchie-juillet', 'revolution-juillet-1830', 'on-ne-badine-pas', 'pot-bouille'],
		quote: '« À nous deux maintenant ! » — Défi final de Rastignac lancé à Paris du haut du Père-Lachaise.',
		importance: 'major',
		image: {
			src: '/_astro/honore-de-balzac-1842.CQNqqlaG_dhsx7.webp',
			alt: 'Portrait d’Honoré de Balzac en 1842 par Louis-Auguste Bisson',
			caption: 'Honoré de Balzac (1842), daguerréotype de Louis-Auguste Bisson',
		},
	},

	// 1848 - Révolution de 1848
	{
		id: 'revolution-1848',
		year: 1848,
		datePrecise: '22–24 février 1848',
		type: 'revolution',
		category: 'revolution',
		title: 'Révolution de 1848',
		subtitle: 'Février 1848',
		description: 'Chute de la Monarchie de Juillet · proclamation de la Deuxième République · rupture brutale mettant fin au règne de Louis-Philippe.',
		historicalContext: 'Insurrection parisienne unissant ouvriers et intellectuels pour chasser la monarchie censitaire, suivie en juin d’affrontements sanglants révélant la fracture de classe.',
		periodId: 'deuxieme-republique',
		relatedTo: ['pere-goriot', 'deuxieme-republique-event', 'coup-etat-1851'],
		importance: 'major',
	},

	// 1848 - Deuxième République
	{
		id: 'deuxieme-republique-event',
		year: 1848,
		endYear: 1852,
		datePrecise: '1848–1852',
		type: 'political-regime',
		category: 'regime',
		title: 'Deuxième République',
		subtitle: '1848–1852',
		description: 'Expérience républicaine d’abord fraternelle (abolition de l’esclavage, suffrage universel), puis conservatrice après la répression des journées de Juin.',
		historicalContext: 'Louis-Napoléon Bonaparte est élu président au suffrage universel en décembre 1848, prélude à la confiscation autoritaire du pouvoir républicain.',
		periodId: 'deuxieme-republique',
		relatedTo: ['revolution-1848', 'coup-etat-1851'],
		importance: 'standard',
	},

	// 1851 - Coup d'État de Louis-Napoléon Bonaparte
	{
		id: 'coup-etat-1851',
		year: 1851,
		datePrecise: '2 décembre 1851',
		type: 'history',
		category: 'coup',
		title: 'Coup d’État de Louis-Napoléon Bonaparte',
		subtitle: '2 décembre 1851',
		description: 'Dissolution illégale de l’Assemblée nationale par le président, arrestation des opposants républicains et rétablissement du plébiscite.',
		historicalContext: 'Le 2 décembre (date anniversaire du sacre d’Austerlitz) brise l’ordre constitutionnel républicain et prépare le rétablissement immédiat de l’Empire.',
		periodId: 'deuxieme-republique',
		relatedTo: ['deuxieme-republique-event', 'second-empire-event'],
		importance: 'major',
	},

	// 1852 - Second Empire
	{
		id: 'second-empire-event',
		year: 1852,
		endYear: 1870,
		datePrecise: '1852–1870',
		type: 'political-regime',
		category: 'regime',
		title: 'Second Empire',
		subtitle: '1852–1870 (Napoléon III)',
		description: 'Louis-Napoléon Bonaparte / Napoléon III · industrialisation · grands magasins · transformation de Paris par Haussmann · autoritarisme puis libéralisation.',
		historicalContext: 'Prospérité économique sans précédent pour la grande bourgeoisie, spéculation immobilière et modernisation industrielle qui inspireront l’architecture des Rougon-Macquart de Zola.',
		periodId: 'second-empire',
		relatedTo: ['coup-etat-1851', 'guerre-franco-prussienne', 'cahiers-douai', 'pot-bouille'],
		importance: 'major',
	},

	// 1870 - Guerre franco-prussienne
	{
		id: 'guerre-franco-prussienne',
		year: 1870,
		endYear: 1871,
		datePrecise: 'Juillet 1870 – Janvier 1871',
		type: 'war',
		category: 'war',
		title: 'Guerre franco-prussienne',
		subtitle: '1870–1871',
		description: 'Conflit déclenché par la France contre la Prusse et les États allemands coalisés. Catastrophe militaire française rapide entraînant l’effondrement du régime.',
		historicalContext: 'Cette guerre forme le contexte immédiat des fugues de Rimbaud, de ses poèmes contre la guerre (Le Dormeur du val) et de la chute brutale de Napoléon III.',
		periodId: 'second-empire',
		relatedTo: ['cahiers-douai', 'bataille-sedan', 'proclamation-troisieme-republique'],
		importance: 'major',
	},

	// 1870 - Cahiers de Douai (Arthur Rimbaud)
	{
		id: 'cahiers-douai',
		year: 1870,
		datePrecise: 'Septembre – Octobre 1870',
		type: 'literature',
		category: 'poetry',
		title: 'Cahiers de Douai',
		subtitle: '1870 · Arthur Rimbaud',
		author: 'Arthur Rimbaud',
		authorDates: '1854–1891',
		tagLabel: 'Poésie · 15–16 ans',
		description: 'Vingt-deux poèmes écrits en 1870, entre fugues, liberté, révolte, découverte du monde et renouvellement de la poésie. Confiés au poète Paul Demeny à Douai.',
		historicalContext: 'Écrits à l’âge de 15–16 ans pendant l’invasion prussienne et la débâcle impériale. Rimbaud fuit Charleville en état de siège, s’insurge contre l’ordre bourgeois, l’Église et le militarisme (Morts de Quatre-vingt-douze, Le Dormeur du val, Rages de Césars).',
		periodId: 'second-empire',
		relatedTo: ['guerre-franco-prussienne', 'bataille-sedan', 'proclamation-troisieme-republique', 'second-empire', 'commune-paris'],
		quote: '« Un soldat jeune, bouche ouverte, tête nue, / Et la nuque baignant dans le frais cresson bleu, / Dort ; il est étendu dans l’herbe, sous la nue... » — Le Dormeur du val (octobre 1870)',
		importance: 'major',
		image: {
			src: '/_astro/arthur-rimbaud.XNJ406zq_Zzz5Ag.webp',
			alt: 'Portrait d’Arthur Rimbaud adolescent par Étienne Carjat',
			caption: 'Arthur Rimbaud à 17 ans, photographie d’Étienne Carjat',
		},
	},

	// 1870 - Bataille de Sedan
	{
		id: 'bataille-sedan',
		year: 1870,
		datePrecise: '2 septembre 1870',
		type: 'war',
		category: 'war',
		title: 'Bataille de Sedan',
		subtitle: '2 septembre 1870',
		description: 'Défaite française face à la Prusse · encerclement de l’armée impériale et capture de l’empereur Napoléon III avec 80 000 soldats.',
		historicalContext: 'La capitulation de Sedan scelle le sort militaire et politique du régime impérial et provoque la stupeur de l’opinion française.',
		periodId: 'second-empire',
		relatedTo: ['guerre-franco-prussienne', 'cahiers-douai', 'proclamation-troisieme-republique'],
		importance: 'major',
	},

	// 1870 - Chute du Second Empire / Proclamation de la IIIe République
	{
		id: 'proclamation-troisieme-republique',
		year: 1870,
		datePrecise: '4 septembre 1870',
		type: 'political-regime',
		category: 'regime',
		title: 'Chute du Second Empire & Proclamation de la République',
		subtitle: '4 septembre 1870',
		description: 'Invasion du Corps législatif par les Parisiens, déchéance officielle de Napoléon III et proclamation de la Troisième République à l’Hôtel de Ville.',
		historicalContext: 'Directement liée au désastre de Sedan, cette journée fonde le régime républicain sous un gouvernement de Défense nationale en pleine guerre étrangère.',
		periodId: 'troisieme-republique',
		relatedTo: ['bataille-sedan', 'cahiers-douai', 'commune-paris'],
		importance: 'major',
	},

	// 1871 - Commune de Paris
	{
		id: 'commune-paris',
		year: 1871,
		datePrecise: '18 mars – 28 mai 1871',
		type: 'revolution',
		category: 'uprising',
		title: 'Commune de Paris',
		subtitle: 'Mars–mai 1871',
		description: 'Insurrection et expérience politique révolutionnaire à Paris refusant la capitulation et le gouvernement conservateur de Thiers · Semaine sanglante et répression massive.',
		historicalContext: 'Événement majeur de l’histoire sociale européenne, marquant profondément la mémoire ouvrière, les débats socialistes (Marx) et l’imaginaire poétique (Rimbaud, Verlaine).',
		periodId: 'troisieme-republique',
		relatedTo: ['cahiers-douai', 'proclamation-troisieme-republique', 'pot-bouille'],
		importance: 'major',
		image: {
			src: '/_astro/commune-barricade-1871.CHMdUWQq_ZIX0W3.webp',
			alt: 'Barricade de la Commune de Paris en 1871 par Bruno Braquehais',
			caption: 'Barricade à l’angle des boulevards Voltaire et Richard-Lenoir, 1871 (Bruno Braquehais)',
		},
	},

	// 1882 - Pot-Bouille (Émile Zola)
	{
		id: 'pot-bouille',
		year: 1882,
		type: 'literature',
		category: 'novel',
		title: 'Pot-Bouille',
		subtitle: '1882 · Émile Zola',
		author: 'Émile Zola',
		authorDates: '1840–1902',
		tagLabel: 'Roman · Les Rougon-Macquart (t. X)',
		description: 'La bourgeoisie parisienne derrière les façades respectables : argent, mariage, adultère, ambition sociale et hypocrisie dans un immeuble de la rue de Choiseul.',
		historicalContext: 'Bien que l’intrigue soit située sous le Second Empire (1862–1863), le roman paraît en 1882 sous la Troisième République triomphante. Zola offre une anatomie au scalpel des mœurs bourgeoises et de la respectabilité de façade qui perdure d’un régime à l’autre.',
		periodId: 'troisieme-republique',
		relatedTo: ['troisieme-republique', 'second-empire', 'pere-goriot'],
		quote: '« C’est la cuisine de la bourgeoisie, le pot-bouille où tout mijote sans bruit derrière les portes d’acajou. »',
		importance: 'major',
	},
];
