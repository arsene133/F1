import { historyImages } from './history-images';
import { industryImages } from './industry-images';
import { literatureImages } from './literature-images';
import { scienceImages } from './science-images';
import { paintingImages } from './painting-images';
import { musicImages } from './music-images';
import { musicAudio, musicListenLinks } from './music-audio';

export type TimelineItemType = 'history' | 'political-regime' | 'revolution' | 'war' | 'literature' | 'industry' | 'science' | 'painting' | 'music';

export type LiteratureCategory = 'novel' | 'theatre' | 'poetry';
export type HistoryCategory = 'revolution' | 'regime' | 'war' | 'event' | 'uprising' | 'coup';
export type IndustryCategory = 'energy' | 'railways' | 'industrial-culture' | 'steel' | 'electricity' | 'internal-combustion';
export type ScienceCategory = 'physics' | 'biology' | 'thermodynamics' | 'electromagnetism' | 'mathematics' | 'chemistry';
export type PaintingCategory = 'history-painting' | 'romanticism' | 'realism' | 'modernity' | 'impressionism' | 'artistic-movement';
export type MusicCategory = 'symphony' | 'piano' | 'operetta' | 'opera' | 'musical-drama';

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

export interface TimelineImageCredit {
	source: string;
	sourceUrl: string;
	fileUrl?: string;
	author?: string;
	license: string;
	attributionRequired: boolean;
	attribution?: string;
	description?: string;
}

export interface TimelineItemImage {
	src: string;
	alt: string;
	caption?: string;
	srcset?: string;
	width?: number;
	height?: number;
	fit?: 'contain' | 'cover';
	/** Point focal (object-position) pour les recadrages en mode cover */
	position?: string;
	credit?: TimelineImageCredit;
}

/** Extrait audio intégré, dont les droits sur l'enregistrement ont été vérifiés */
export interface TimelineItemAudio {
	/** Nom du mouvement / de l'extrait, affiché « Écouter : … » */
	title: string;
	/** Fichier lu par le lecteur HTML5 */
	url: string;
	mimeType: string;
	/** Fichier original déposé sur la source */
	fileUrl?: string;
	source: string;
	/** Page de la source où la licence a été vérifiée */
	sourceUrl: string;
	license: string;
	licenseUrl?: string;
	performer?: string;
	recordingDate?: string;
	/** Durée au format m:ss */
	duration?: string;
	excerpt?: string;
	attributionRequired: boolean;
	attribution?: string;
	/** Statut des droits sur l'enregistrement et l'interprétation */
	rightsNote?: string;
}

/** Écoute externe, sans intégration ni téléchargement du fichier */
export interface TimelineItemListenLink {
	url: string;
	source: string;
	note?: string;
}

export interface TimelineItem {
	id: string;
	year: number;
	endYear?: number;
	datePrecise?: string;
	type: TimelineItemType;
	category: LiteratureCategory | HistoryCategory | IndustryCategory | ScienceCategory | PaintingCategory | MusicCategory;
	subCategory?: string;
	title: string;
	subtitle?: string;
	author?: string;
	authorDates?: string;
	dateType?: 'premiere' | 'composition' | 'publication' | 'exhibition';
	tagLabel?: string;
	description: string;
	historicalContext: string;
	contextSectionTitle?: string;
	periodId: string;
	relatedTo: string[];
	quote?: string;
	importance?: 'exceptional' | 'major' | 'medium' | 'standard';
	image?: TimelineItemImage;
	secondaryImage?: TimelineItemImage;
	audio?: TimelineItemAudio;
	listenLink?: TimelineItemListenLink;
	featured?: boolean;
}

export const TIMELINE_START_YEAR = 1765;
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
		image: historyImages.revolutionFrancaise,
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
		image: historyImages.consulat,
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
		image: historyImages.premierEmpire,
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
		image: historyImages.restauration,
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
		relatedTo: ['restauration-event', 'on-ne-badine-pas', 'pere-goriot', 'e-galois'],
		importance: 'major',
		image: historyImages.juillet1830,
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
		image: literatureImages.musset,
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
		image: literatureImages.balzac,
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
		image: historyImages.revolution1848,
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
		image: historyImages.deuxiemeRepublique,
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
		image: historyImages.coup1851,
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
		image: historyImages.secondEmpire,
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
		image: historyImages.guerre1870,
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
		image: literatureImages.rimbaud,
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
		image: historyImages.sedan,
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
		image: historyImages.quatreSeptembre,
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
		image: historyImages.commune,
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
		image: literatureImages.zola,
	},

	// --------------------------------------------------------------------------
	// JALONS INDUSTRIELS (Catégorie Industrie)
	// --------------------------------------------------------------------------

	// 1. 1769 — Machine à vapeur de Watt
	{
		id: 'machine-vapeur-watt',
		year: 1769,
		datePrecise: '1769',
		type: 'industry',
		category: 'energy',
		subCategory: 'energy',
		title: 'Machine à vapeur de Watt',
		subtitle: '1769 · James Watt',
		tagLabel: 'Industrie · Énergie / Vapeur',
		description: "James Watt perfectionne la machine à vapeur et dépose en 1769 un brevet pour son amélioration. La vapeur devient progressivement une source majeure d'énergie mécanique pour l'industrie.",
		historicalContext: "Perfectionnement décisif des machines antérieures (Newcomen), la condensation séparée de Watt démultiplie l'efficacité énergétique et amorce la première révolution industrielle en affranchissant les manufactures des cours d'eau.",
		periodId: 'revolution-francaise-regime',
		relatedTo: ['chemin-de-fer-stockton', 'liverpool-manchester'],
		importance: 'major',
		image: industryImages.watt,
	},

	// 2. 1825 — Premier chemin de fer public à vapeur
	{
		id: 'chemin-de-fer-stockton',
		year: 1825,
		datePrecise: '27 septembre 1825',
		type: 'industry',
		category: 'railways',
		subCategory: 'railways',
		title: 'Premier chemin de fer public à vapeur',
		subtitle: '1825 · Stockton–Darlington',
		tagLabel: 'Industrie · Chemin de fer',
		description: "La ligne Stockton–Darlington ouvre un service ferroviaire public utilisant la traction à vapeur. Le chemin de fer devient progressivement une infrastructure majeure de l'industrialisation.",
		historicalContext: "Conçue par George Stephenson, cette ligne démontre la viabilité du rail à vapeur pour le transport lourd de marchandises et ouvre l'ère de l'intégration des réseaux de transport.",
		periodId: 'restauration',
		relatedTo: ['machine-vapeur-watt', 'liverpool-manchester', 'paris-saint-germain'],
		importance: 'major',
		image: industryImages.stockton,
	},

	// 3. 1830 — Liverpool–Manchester
	{
		id: 'liverpool-manchester',
		year: 1830,
		datePrecise: '15 septembre 1830',
		type: 'industry',
		category: 'railways',
		subCategory: 'railways',
		title: 'Liverpool–Manchester',
		subtitle: '1830 · Ligne interurbaine',
		tagLabel: 'Industrie · Chemin de fer',
		description: "L'ouverture de la ligne Liverpool–Manchester marque une étape majeure dans l'essor du chemin de fer à vapeur et dans la transformation des transports industriels.",
		historicalContext: "Première ligne ferroviaire moderne reliant deux grands centres urbains avec horaires réguliers et double voie, elle accélère le transport du coton et des passagers en pleine expansion manufacturière.",
		periodId: 'monarchie-juillet',
		relatedTo: ['chemin-de-fer-stockton', 'paris-saint-germain', 'procede-bessemer'],
		importance: 'major',
		image: industryImages.liverpool,
	},

	// 4. 1837 — Paris–Saint-Germain
	{
		id: 'paris-saint-germain',
		year: 1837,
		datePrecise: '26 août 1837',
		type: 'industry',
		category: 'railways',
		subCategory: 'railways',
		title: 'Paris–Saint-Germain',
		subtitle: '1837 · Première ligne voyageurs en France',
		tagLabel: 'Industrie · Chemin de fer',
		description: "La première ligne française destinée au transport de voyageurs est inaugurée entre Paris et Saint-Germain-en-Laye. Le chemin de fer commence à transformer les mobilités et les échanges en France.",
		historicalContext: "Soutenue par les frères Pereire sous la Monarchie de Juillet, cette ligne de démonstration déclenche l'engouement du public parisien et préfigure le réseau en étoile qui irriguera la France.",
		periodId: 'monarchie-juillet',
		relatedTo: ['liverpool-manchester', 'pere-goriot', 'on-ne-badine-pas'],
		importance: 'medium',
		image: industryImages.parisSaintGermain,
	},

	// 5. 1851 — Exposition universelle de Londres
	{
		id: 'exposition-universelle-londres',
		year: 1851,
		datePrecise: 'Mai – Octobre 1851',
		type: 'industry',
		category: 'industrial-culture',
		subCategory: 'industrial-culture',
		title: 'Exposition universelle de Londres',
		subtitle: '1851 · Le Crystal Palace',
		tagLabel: 'Industrie · Culture industrielle',
		description: "Le Crystal Palace accueille la première grande Exposition universelle. Machines, produits manufacturés, métallurgie et innovations deviennent les vitrines du progrès industriel.",
		historicalContext: "Apothéose de l'hégémonie manufacturière britannique victorienne, l'Exposition réunit les nations autour du culte du machinisme et de l'architecture novatrice de fonte et de verre de Joseph Paxton.",
		periodId: 'deuxieme-republique',
		relatedTo: ['procede-bessemer', 'coup-etat-1851', 'second-empire-event'],
		importance: 'major',
		image: industryImages.crystalPalace,
	},

	// 6. 1855 — Procédé Bessemer
	{
		id: 'procede-bessemer',
		year: 1855,
		datePrecise: '1855',
		type: 'industry',
		category: 'steel',
		subCategory: 'steel',
		title: 'Procédé Bessemer',
		subtitle: '1855 · Henry Bessemer',
		tagLabel: 'Industrie · Sidérurgie / Acier',
		description: "Le convertisseur Bessemer permet de produire de grandes quantités d'acier à moindre coût. La sidérurgie devient un moteur essentiel de l'industrialisation et du développement ferroviaire.",
		historicalContext: "En soufflant de l'air à travers la fonte en fusion pour décarburer le métal, Bessemer transforme l'acier, jusqu'alors rare et coûteux, en matériau roi des rails, ponts, coques de navires et poutrelles du Second Empire.",
		periodId: 'second-empire',
		relatedTo: ['exposition-universelle-londres', 'dynamo-gramme', 'second-empire-event'],
		importance: 'major',
		image: industryImages.bessemer,
	},

	// 7. 1871 — Dynamo de Gramme
	{
		id: 'dynamo-gramme',
		year: 1871,
		datePrecise: '1871',
		type: 'industry',
		category: 'electricity',
		subCategory: 'electricity',
		title: 'Dynamo de Gramme',
		subtitle: '1871 · Zénobe Gramme',
		tagLabel: 'Industrie · Électricité',
		description: "Zénobe Gramme met au point une dynamo capable de produire un courant électrique continu de manière efficace. L'électricité entre progressivement dans le domaine de la production industrielle.",
		historicalContext: "Présentée à l'Académie des sciences, la machine magnéto-électrique de Gramme jette les bases de l'industrie électrique et annonce la seconde révolution industrielle en résolvant la production continue d'énergie.",
		periodId: 'troisieme-republique',
		relatedTo: ['moteur-explosion-otto', 'commune-paris'],
		importance: 'major',
		image: industryImages.gramme,
		secondaryImage: industryImages.grammePhoto,
	},

	// 8. 1876 — Moteur à explosion
	{
		id: 'moteur-explosion-otto',
		year: 1876,
		datePrecise: '1876',
		type: 'industry',
		category: 'internal-combustion',
		subCategory: 'internal-combustion',
		title: 'Moteur à explosion',
		subtitle: '1876 · Nikolaus Otto',
		tagLabel: 'Industrie · Moteur thermique',
		description: "Le moteur à quatre temps développé par Nikolaus Otto constitue un jalon majeur du moteur à combustion interne et prépare les transformations industrielles et automobiles de la fin du XIXe siècle.",
		historicalContext: "Le cycle à quatre temps (admission, compression, combustion-détente, échappement) offre un rendement énergétique inédit, rendant possible les futures motorisations compactes et mobiles de l'ère industrielle contemporaine.",
		periodId: 'troisieme-republique',
		relatedTo: ['dynamo-gramme', 'pot-bouille'],
		importance: 'major',
		image: industryImages.otto,
	},

	// --------------------------------------------------------------------------
	// JALONS SCIENTIFIQUES (Catégorie Sciences)
	// --------------------------------------------------------------------------

	// 1. 1800 — Alessandro Volta
	{
		id: 'alessandro-volta',
		year: 1800,
		datePrecise: '1800',
		type: 'science',
		category: 'physics',
		subCategory: 'physics',
		title: 'Alessandro Volta',
		subtitle: 'La pile électrique',
		authorDates: '1745–1827',
		tagLabel: 'Sciences · Physique / Électricité',
		description: 'Volta met au point la première source continue de courant électrique avec sa pile voltaïque, ouvrant une nouvelle ère dans l’électricité expérimentale.',
		historicalContext: "En empilant disques de zinc, de cuivre et feutres imbibés d'eau salée, Volta crée la première source continue d'électricité, ouvrant la voie à l'électrochimie et aux découvertes ultérieures de l'électromagnétisme.",
		periodId: 'consulat',
		relatedTo: ['michael-faraday'],
		importance: 'major',
		image: scienceImages.volta,
	},

	// 2. 1809 — Jean-Baptiste Lamarck
	{
		id: 'jean-baptiste-lamarck',
		year: 1809,
		datePrecise: '1809',
		type: 'science',
		category: 'biology',
		subCategory: 'biology',
		title: 'Jean-Baptiste Lamarck',
		subtitle: 'Une théorie de la transformation des espèces',
		authorDates: '1744–1829',
		tagLabel: 'Sciences · Biologie / Évolution',
		description: 'Lamarck formule une première théorie systématique de la transformation des espèces vivantes, jalon essentiel de la pensée évolutionniste au XIXe siècle.',
		historicalContext: "Dans sa Philosophie zoologique (1809), Lamarck formule la première théorie cohérente du transformisme biologique, rompant avec le fixisme traditionnel et ouvrant la voie aux débats du siècle sur l'histoire du vivant.",
		periodId: 'premier-empire',
		relatedTo: ['charles-darwin'],
		importance: 'medium',
		image: scienceImages.lamarck,
	},

	// 3. 1824 — Sadi Carnot
	{
		id: 'sadi-carnot',
		year: 1824,
		datePrecise: '1824',
		type: 'science',
		category: 'thermodynamics',
		subCategory: 'thermodynamics',
		title: 'Sadi Carnot',
		subtitle: 'Les fondements de la thermodynamique',
		authorDates: '1796–1832',
		tagLabel: 'Sciences · Thermodynamique',
		description: 'Dans son étude des machines thermiques, Carnot pose les principes fondamentaux liant chaleur, travail mécanique et rendement, fondant la thermodynamique moderne.',
		historicalContext: "Dans Réflexions sur la puissance motrice du feu (1824), Carnot théorise le rendement maximal des machines thermiques et le cycle idéal, fournissant l'armature conceptuelle indispensable au développement de la physique industrielle.",
		periodId: 'restauration',
		relatedTo: ['machine-vapeur-watt', 'chemin-de-fer-stockton'],
		importance: 'major',
		image: scienceImages.carnot,
	},

	// 4. 1831 — Michael Faraday
	{
		id: 'michael-faraday',
		year: 1831,
		datePrecise: '1831',
		type: 'science',
		category: 'electromagnetism',
		subCategory: 'electromagnetism',
		title: 'Michael Faraday',
		subtitle: 'Induction électromagnétique',
		authorDates: '1791–1867',
		tagLabel: 'Sciences · Électromagnétisme',
		description: 'Faraday découvre l’induction électromagnétique, établissant qu’un champ magnétique variable engendre un courant électrique. Une découverte fondamentale pour l’industrie électrique.',
		historicalContext: "En montrant qu'un champ magnétique variable induit une tension électrique, Faraday unit magnétisme et électricité en laboratoire, posant le principe du générateur et du transformateur moderne.",
		periodId: 'monarchie-juillet',
		relatedTo: ['alessandro-volta', 'james-clerk-maxwell', 'dynamo-gramme'],
		importance: 'major',
		image: scienceImages.faraday,
	},

	// 5. 1832 — Évariste Galois (Jalon scientifique d'exception)
	{
		id: 'e-galois',
		year: 1832,
		datePrecise: '1832',
		type: 'science',
		category: 'mathematics',
		subCategory: 'mathematics',
		title: 'Évariste Galois',
		subtitle: 'Équations, groupes et algèbre moderne',
		authorDates: '1811–1832',
		tagLabel: 'Sciences · Mathématiques / Algèbre',
		description: "À vingt ans, Galois développe une nouvelle manière d'étudier les équations algébriques à travers les structures de symétrie que l'on associera ensuite à la théorie des groupes. Ses travaux, dont plusieurs sont publiés après sa mort, deviennent fondamentaux pour l'algèbre moderne.",
		historicalContext: "Galois grandit durant les secousses politiques de la Restauration et de la Révolution de 1830, s'engageant ardemment comme jeune républicain sous la Monarchie de Juillet. Ses recherches mathématiques d'avant-garde et sa trajectoire politique tumultueuse appartiennent à la même génération révoltée, sans qu'un lien de causalité direct ne réduise son œuvre à sa posture politique.",
		contextSectionTitle: 'Un mathématicien dans une époque révolutionnaire',
		periodId: 'monarchie-juillet',
		relatedTo: ['revolution-juillet-1830', 'on-ne-badine-pas'],
		importance: 'exceptional',
		featured: true,
		image: scienceImages.galois,
		secondaryImage: scienceImages.galoisPortrait,
	},

	// 6. 1851 — Léon Foucault
	{
		id: 'leon-foucault',
		year: 1851,
		datePrecise: '1851',
		type: 'science',
		category: 'physics',
		subCategory: 'physics',
		title: 'Léon Foucault',
		subtitle: 'Le pendule de Foucault',
		authorDates: '1819–1868',
		tagLabel: 'Sciences · Physique / Mécanique',
		description: 'Foucault démontre la rotation de la Terre grâce à un pendule géant suspendu au dôme du Panthéon, dont le plan d’oscillation tourne par rapport au sol.',
		historicalContext: "Suspendu à la coupole du Panthéon de Paris en 1851, le pendule de 67 mètres offre une preuve visuelle et spectaculaire de la rotation terrestre à l'ensemble du public contemporain.",
		periodId: 'deuxieme-republique',
		relatedTo: ['coup-etat-1851', 'exposition-universelle-londres'],
		importance: 'major',
		image: scienceImages.foucault,
	},

	// 7. 1859 — Charles Darwin
	{
		id: 'charles-darwin',
		year: 1859,
		datePrecise: '24 novembre 1859',
		type: 'science',
		category: 'biology',
		subCategory: 'biology',
		title: 'Charles Darwin',
		subtitle: "L'évolution par sélection naturelle",
		authorDates: '1809–1882',
		tagLabel: 'Sciences · Biologie / Évolution',
		description: 'Darwin publie L’Origine des espèces, établissant la sélection naturelle comme mécanisme explicatif de l’évolution et de la diversification du monde vivant.',
		historicalContext: "La publication de L'Origine des espèces en 1859 révolutionne les sciences naturelles en établissant la sélection naturelle comme moteur de la divergence des espèces, bouleversant la philosophie et l'histoire des idées au XIXe siècle.",
		periodId: 'second-empire',
		relatedTo: ['jean-baptiste-lamarck'],
		importance: 'major',
		image: scienceImages.darwin,
	},

	// 8. 1865 — Gregor Mendel
	{
		id: 'gregor-mendel',
		year: 1865,
		datePrecise: '1865',
		type: 'science',
		category: 'biology',
		subCategory: 'biology',
		title: 'Gregor Mendel',
		subtitle: "Les lois de l'hérédité",
		authorDates: '1822–1884',
		tagLabel: 'Sciences · Biologie / Hérédité',
		description: 'Mendel présente ses expériences d’hybridation sur les pois qui mettent en évidence les règles statistiques de la transmission des caractères héréditaires, fondement de la génétique.',
		historicalContext: "Dans ses communications à la Société des sciences naturelles de Brünn en 1865, Mendel démontre la transmission statistique de facteurs héréditaires discrets chez le pois. Ses travaux, largement ignorés à l'époque, ne seront redécouverts et reconnus comme fondateurs de la génétique qu'au début du XXe siècle.",
		periodId: 'second-empire',
		relatedTo: ['charles-darwin'],
		importance: 'major',
		image: scienceImages.mendel,
		secondaryImage: scienceImages.mendelPaper,
	},

	// 9. 1869 — Dmitri Mendeleïev
	{
		id: 'dmitri-mendeleiev',
		year: 1869,
		datePrecise: 'Mars 1869',
		type: 'science',
		category: 'chemistry',
		subCategory: 'chemistry',
		title: 'Dmitri Mendeleïev',
		subtitle: 'La classification périodique',
		authorDates: '1834–1907',
		tagLabel: 'Sciences · Chimie',
		description: 'Mendeleïev ordonne les éléments chimiques dans un tableau périodique selon leur masse atomique et prédit l’existence d’éléments encore inconnus, créant un puissant outil théorique et prédictif.',
		historicalContext: "En classant les 63 éléments chimiques connus par masse atomique croissante et propriétés périodiques, Mendeleïev prédit avec une remarquable exactitude l'existence et les propriétés d'éléments encore inconnus comme le gallium ou le germanium.",
		periodId: 'second-empire',
		relatedTo: ['second-empire-event'],
		importance: 'major',
		image: scienceImages.mendeleev,
	},

	// 10. 1873 — James Clerk Maxwell
	{
		id: 'james-clerk-maxwell',
		year: 1873,
		datePrecise: '1873',
		type: 'science',
		category: 'physics',
		subCategory: 'electromagnetism',
		title: 'James Clerk Maxwell',
		subtitle: 'La théorie électromagnétique',
		authorDates: '1831–1879',
		tagLabel: 'Sciences · Physique / Électromagnétisme',
		description: 'Maxwell unifie l’électricité, le magnétisme et la lumière dans un cadre mathématique commun d’équations différentielles, monument de la physique du XIXe siècle.',
		historicalContext: "Dans son Traité d'électricité et de magnétisme (1873), Maxwell unifie l'électricité, le magnétisme et l'optique sous quatre équations fondamentales, révélant que la lumière est elle-même une onde électromagnétique.",
		periodId: 'troisieme-republique',
		relatedTo: ['michael-faraday'],
		importance: 'major',
		image: scienceImages.maxwell,
	},

	// --------------------------------------------------------------------------
	// JALONS DE PEINTURE (Catégorie Peinture)
	// --------------------------------------------------------------------------

	// 1. 1789 — Jacques-Louis David : Le Serment du Jeu de paume
	{
		id: 'painting-david-serment-jeu-paume',
		year: 1789,
		datePrecise: '1789 (dessin 1791)',
		type: 'painting',
		category: 'history-painting',
		subCategory: 'revolutionary-painting',
		title: 'Le Serment du Jeu de paume',
		subtitle: '1789 · Jacques-Louis David',
		author: 'Jacques-Louis David',
		authorDates: '1748–1825',
		dateType: 'composition',
		tagLabel: 'Peinture · Peinture d’histoire',
		description: 'Le moment politique révolutionnaire entre dans la peinture d’histoire monumentale : David transforme l’événement politique contemporain en une puissante image civique et collective.',
		historicalContext: 'Contexte historique : Révolution française. En représentant le serment du 20 juin 1789, David rompt avec l’hagiographie royale et invente une peinture d’histoire civique où la souveraineté émane de la nation assemblée.',
		periodId: 'revolution-francaise-regime',
		relatedTo: ['revolution-francaise', 'painting-david-mort-marat'],
		importance: 'standard',
		image: paintingImages.davidSerment,
	},

	// 2. 1793 — Jacques-Louis David : La Mort de Marat
	{
		id: 'painting-david-mort-marat',
		year: 1793,
		datePrecise: '1793',
		type: 'painting',
		category: 'history-painting',
		subCategory: 'political-martyr',
		title: 'La Mort de Marat',
		subtitle: '1793 · Jacques-Louis David',
		author: 'Jacques-Louis David',
		authorDates: '1748–1825',
		dateType: 'composition',
		tagLabel: 'Peinture · Image politique',
		description: 'L’une des images les plus saisissantes de la Révolution française : David métamorphose un chef de file révolutionnaire assassiné en martyr politique républicain.',
		historicalContext: 'Contexte historique : violence politique révolutionnaire et Terreur (1793). David mobilise une composition sobre inspirée de la piéta chrétienne pour sacraliser l’engagement civique de la République jacobine.',
		periodId: 'revolution-francaise-regime',
		relatedTo: ['revolution-francaise', 'painting-david-serment-jeu-paume'],
		importance: 'standard',
		image: paintingImages.davidMarat,
	},

	// 3. 1819 — Théodore Géricault : Le Radeau de la Méduse
	{
		id: 'painting-gericault-radeau-meduse',
		year: 1819,
		datePrecise: '1819',
		type: 'painting',
		category: 'romanticism',
		subCategory: 'romanticism',
		title: 'Le Radeau de la Méduse',
		subtitle: '1819 · Théodore Géricault',
		author: 'Théodore Géricault',
		authorDates: '1791–1824',
		dateType: 'composition',
		tagLabel: 'Peinture · Romantisme',
		description: 'Traitement romantique monumental d’une tragédie maritime contemporaine. Géricault substitue aux héros classiques la souffrance collective, l’abandon politique et la réalité brute.',
		historicalContext: 'Contexte historique : Restauration et France post-napoléonienne. Le naufrage de la frégate La Méduse en 1816, imputé à l’incompétence d’un capitaine royaliste d’Ancien Régime, devient un violent réquisitoire contre l’État restauré.',
		periodId: 'restauration',
		relatedTo: ['restauration-event', 'painting-delacroix-liberte', 'music-beethoven-symphonie-9'],
		importance: 'major',
		image: paintingImages.gericaultMeduse,
	},

	// 4. 1830 — Eugène Delacroix : La Liberté guidant le peuple
	{
		id: 'painting-delacroix-liberte',
		year: 1830,
		datePrecise: '1830',
		type: 'painting',
		category: 'romanticism',
		subCategory: 'romanticism',
		title: 'La Liberté guidant le peuple',
		subtitle: '1830 · Eugène Delacroix',
		author: 'Eugène Delacroix',
		authorDates: '1798–1863',
		dateType: 'composition',
		tagLabel: 'Peinture · Romantisme politique',
		description: 'La Révolution de Juillet devient une image emblématique de l’insurrection populaire et de la liberté politique, unissant le gamin de Paris, l’ouvrier et le jeune bourgeois dans un même élan.',
		historicalContext: 'Contexte historique : Révolution de Juillet 1830 (Les Trois Glorieuses). Delacroix synthétise l’allégorie classique et le réalisme moderne des combats de rue, fixant pour l’Europe l’icône de la barricade républicaine.',
		periodId: 'monarchie-juillet',
		relatedTo: ['revolution-juillet-1830', 'painting-gericault-radeau-meduse', 'music-berlioz-symphonie-fantastique', 'e-galois'],
		importance: 'major',
		image: paintingImages.delacroixLiberte,
	},

	// 5. 1850 — Gustave Courbet : Un enterrement à Ornans
	{
		id: 'painting-courbet-enterrement-ornans',
		year: 1850,
		datePrecise: '1849–1850 (Salon de 1850)',
		type: 'painting',
		category: 'realism',
		subCategory: 'realism',
		title: 'Un enterrement à Ornans',
		subtitle: '1850 · Gustave Courbet',
		author: 'Gustave Courbet',
		authorDates: '1819–1877',
		dateType: 'composition',
		tagLabel: 'Peinture · Réalisme',
		description: 'Courbet confère à un enterrement provincial ordinaire l’échelle monumentale traditionnellement réservée aux sujets historiques ou héroïques : un jalon majeur du réalisme français.',
		historicalContext: 'Contexte historique : Deuxième République et réalisme social au lendemain des journées de 1848. En refusant l’idéalisation académique et en exposant sans fard la société rurale, Courbet provoque un scandale esthétique et politique.',
		periodId: 'deuxieme-republique',
		relatedTo: ['revolution-1848', 'deuxieme-republique-event', 'painting-millet-glaneuses', 'painting-manet-dejeuner'],
		importance: 'major',
		image: paintingImages.courbetOrnans,
	},

	// 6. 1857 — Jean-François Millet : Des glaneuses
	{
		id: 'painting-millet-glaneuses',
		year: 1857,
		datePrecise: '1857',
		type: 'painting',
		category: 'realism',
		subCategory: 'realism',
		title: 'Des glaneuses',
		subtitle: '1857 · Jean-François Millet',
		author: 'Jean-François Millet',
		authorDates: '1814–1875',
		dateType: 'composition',
		tagLabel: 'Peinture · Réalisme paysan',
		description: 'Trois paysannes courbées ramassant les épis oubliés deviennent les figures monumentales du tableau. La dignité et la visibilité des travailleurs ordinaires deviennent des questions artistiques centrales.',
		historicalContext: 'Contexte historique : industrialisation et transformations sociales du Second Empire. Tandis que les campagnes se vident vers les manufactures urbaines, Millet confère une grandeur biblique et universelle à la survie paysanne la plus humble.',
		periodId: 'second-empire',
		relatedTo: ['second-empire-event', 'procede-bessemer', 'painting-courbet-enterrement-ornans'],
		importance: 'standard',
		image: paintingImages.milletGlaneuses,
	},

	// 7. 1863 — Édouard Manet : Le Déjeuner sur l’herbe
	{
		id: 'painting-manet-dejeuner',
		year: 1863,
		datePrecise: '1863',
		type: 'painting',
		category: 'modernity',
		subCategory: 'modernity',
		title: 'Le Déjeuner sur l’herbe',
		subtitle: '1863 · Édouard Manet',
		author: 'Édouard Manet',
		authorDates: '1832–1883',
		dateType: 'composition',
		tagLabel: 'Peinture · Rupture moderne',
		description: 'Manet bouscule les conventions académiques du sujet, de la composition et de la touche picturale. Un jalon capital dans l’émergence de la peinture moderne exposé au Salon des refusés.',
		historicalContext: 'Contexte historique : Second Empire et modernité parisienne haussmannienne. En transposant le nu classique dans un contexte contemporain sans prétexte mythologique, Manet démasque l’hypocrisie du regard bourgeois.',
		periodId: 'second-empire',
		relatedTo: ['second-empire-event', 'music-offenbach-orphee', 'music-wagner-tristan', 'painting-monet-impression'],
		importance: 'major',
		image: paintingImages.manetDejeuner,
	},

	// 8. 1872 — Claude Monet : Impression, soleil levant
	{
		id: 'painting-monet-impression',
		year: 1872,
		datePrecise: '1872',
		type: 'painting',
		category: 'impressionism',
		subCategory: 'impressionism',
		title: 'Impression, soleil levant',
		subtitle: '1872 · Claude Monet',
		author: 'Claude Monet',
		authorDates: '1840–1926',
		dateType: 'composition',
		tagLabel: 'Peinture · Impressionnisme',
		description: 'Une représentation radicalement atmosphérique du port moderne du Havre. La toile donne son nom à l’impressionnisme et consacre la primauté de la lumière, de la sensation et de l’instant fugitif.',
		historicalContext: 'Contexte historique : débuts de la Troisième République et monde urbain et industriel en pleine expansion. La touche fragmentée de Monet saisit le dynamisme d’un port d’usines et de cheminées industrielles.',
		periodId: 'troisieme-republique',
		relatedTo: ['dynamo-gramme', 'painting-exposition-impressionniste-1874', 'proclamation-troisieme-republique'],
		importance: 'major',
		image: paintingImages.monetImpression,
	},

	// 9. 1874 — Première exposition impressionniste
	{
		id: 'painting-exposition-impressionniste-1874',
		year: 1874,
		datePrecise: '15 avril – 15 mai 1874',
		type: 'painting',
		category: 'artistic-movement',
		subCategory: 'artistic-movement',
		title: 'Première exposition impressionniste',
		subtitle: '1874 · Société anonyme des artistes',
		author: 'Monet, Renoir, Degas, Pissarro, Cézanne, Morisot',
		authorDates: 'Atelier Nadar, Paris',
		dateType: 'exhibition',
		tagLabel: 'Peinture · Événement artistique',
		description: 'Des artistes indépendants s’unissent pour exposer hors du Salon officiel de l’Académie, dans les ateliers du photographe Nadar. L’événement symbolise l’émergence d’un nouveau rapport entre artistes, critique et public.',
		historicalContext: 'Contexte historique : Troisième République et modernité parisienne d’après-Commune. En fondant la « Société anonyme coopérative d’artistes peintres, sculpteurs, graveurs », le groupe crée la première grande dissidence institutionnelle de l’art moderne.',
		periodId: 'troisieme-republique',
		relatedTo: ['painting-monet-impression', 'music-bizet-carmen', 'proclamation-troisieme-republique'],
		importance: 'standard',
		image: paintingImages.expositionImpressionniste,
	},

	// --------------------------------------------------------------------------
	// JALONS DE MUSIQUE (Catégorie Musique)
	// --------------------------------------------------------------------------

	// 1. 1800 — Ludwig van Beethoven : Symphonie n°1
	{
		id: 'music-beethoven-symphonie-1',
		year: 1800,
		datePrecise: '2 avril 1800 (création à Vienne)',
		type: 'music',
		category: 'symphony',
		subCategory: 'classicism-romanticism',
		title: 'Symphonie n°1 en do majeur',
		subtitle: '1800 · Ludwig van Beethoven',
		author: 'Ludwig van Beethoven',
		authorDates: '1770–1827',
		dateType: 'premiere',
		tagLabel: 'Musique · Symphonie',
		description: 'Beethoven s’empare de la tradition symphonique classique de Haydn et Mozart pour amorcer le langage dramatique, dynamique et expressif du romantisme.',
		historicalContext: 'Contexte historique : Consulat et transition entre classicisme et premier romantisme européen. L’ouverture inattendue sur un accord de septième dissonant annonce l’audace formelle d’une nouvelle ère esthétique.',
		periodId: 'consulat',
		relatedTo: ['bonaparte-consulat', 'music-beethoven-symphonie-9', 'alessandro-volta'],
		importance: 'standard',
		image: musicImages.beethovenSymphonie1,
		audio: musicAudio.beethovenSymphonie1,
	},

	// 2. 1824 — Ludwig van Beethoven : Symphonie n°9
	{
		id: 'music-beethoven-symphonie-9',
		year: 1824,
		datePrecise: '7 mai 1824 (création à Vienne)',
		type: 'music',
		category: 'symphony',
		subCategory: 'romanticism',
		title: 'Symphonie n°9 avec chœur (« Hymne à la joie »)',
		subtitle: '1824 · Ludwig van Beethoven',
		author: 'Ludwig van Beethoven',
		authorDates: '1770–1827',
		dateType: 'premiere',
		tagLabel: 'Musique · Romantisme monumental',
		description: 'Synthèse monumentale de la musique symphonique et vocale : l’intégration de l’Ode à la joie de Schiller dans le finale confère à la symphonie une portée humaniste et fraternelle sans précédent.',
		historicalContext: 'Contexte historique : Restauration et romantisme européen. Face à l’ordre conservateur de la Sainte-Alliance, l’affirmation symphonique de la fraternité universelle constitue un manifeste spirituel et politique majeur.',
		periodId: 'restauration',
		relatedTo: ['restauration-event', 'sadi-carnot', 'music-beethoven-symphonie-1', 'music-berlioz-symphonie-fantastique', 'painting-gericault-radeau-meduse'],
		importance: 'major',
		image: musicImages.beethovenSymphonie9,
		listenLink: musicListenLinks.beethovenSymphonie9,
	},

	// 3. 1830 — Hector Berlioz : Symphonie fantastique
	{
		id: 'music-berlioz-symphonie-fantastique',
		year: 1830,
		datePrecise: '5 décembre 1830 (création à Paris)',
		type: 'music',
		category: 'symphony',
		subCategory: 'french-romanticism',
		title: 'Symphonie fantastique',
		subtitle: '1830 · Hector Berlioz',
		author: 'Hector Berlioz',
		authorDates: '1803–1869',
		dateType: 'premiere',
		tagLabel: 'Musique · Romantisme français',
		description: 'Jalon décisif du romantisme français. Berlioz utilise un programme autobiographique, une idée fixe musicale récurrente et un orchestre élargi pour renouveler de fond en comble la forme symphonique.',
		historicalContext: 'Contexte historique : Révolution de Juillet 1830 et éclosion du grand romantisme français. Composée au Conservatoire de Paris dans l’effervescence des Trois Glorieuses, la symphonie fait écho à la « bataille d’Hernani » dans le domaine orchestral.',
		periodId: 'monarchie-juillet',
		relatedTo: ['revolution-juillet-1830', 'painting-delacroix-liberte', 'music-chopin-oeuvres-piano', 'on-ne-badine-pas'],
		importance: 'major',
		image: musicImages.berliozSymphonieFantastique,
		audio: musicAudio.berliozSymphonieFantastique,
	},

	// 4. 1835 — Frédéric Chopin : Nocturnes, Ballades et œuvres pour piano
	{
		id: 'music-chopin-oeuvres-piano',
		year: 1835,
		datePrecise: 'Années 1830 (repère 1835)',
		type: 'music',
		category: 'piano',
		subCategory: 'piano-expression',
		title: 'Nocturnes, Ballades et œuvres pour piano',
		subtitle: 'Années 1830 · Frédéric Chopin',
		author: 'Frédéric Chopin',
		authorDates: '1810–1849',
		dateType: 'composition',
		tagLabel: 'Musique · Poésie pianistique',
		description: 'Chopin métamorphose le piano moderne en un instrument d’expression intime, poétique et hautement individuelle, alliant virtuosité transcendante et mélancolie romantique.',
		historicalContext: 'Contexte historique : Monarchie de Juillet et exil parisien après l’insurrection polonaise de 1830. Dans les salons parisiens où se croisent Balzac, George Sand et Delacroix, Chopin crée un univers sonore singulier affranchi des formes académiques.',
		periodId: 'monarchie-juillet',
		relatedTo: ['pere-goriot', 'on-ne-badine-pas', 'music-berlioz-symphonie-fantastique', 'painting-delacroix-liberte'],
		importance: 'standard',
		image: musicImages.chopinOeuvresPiano,
		audio: musicAudio.chopinOeuvresPiano,
	},

	// 5. 1858 — Jacques Offenbach : Orphée aux Enfers
	{
		id: 'music-offenbach-orphee',
		year: 1858,
		datePrecise: '21 octobre 1858 (création à Paris)',
		type: 'music',
		category: 'operetta',
		subCategory: 'operetta',
		title: 'Orphée aux Enfers',
		subtitle: '1858 · Jacques Offenbach',
		author: 'Jacques Offenbach',
		authorDates: '1819–1880',
		dateType: 'premiere',
		tagLabel: 'Musique · Opéra-bouffe',
		description: 'Offenbach détourne la mythologie classique en une satire brillante de la société bourgeoise et impériale. L’œuvre devient un emblème de l’opérette française et de la vie culturelle parisienne.',
		historicalContext: 'Contexte historique : Second Empire et fête impériale parisienne. Avec son célèbre « Galop infernal », le Théâtre des Bouffes-Parisiens parodie avec insolence l’hypocrisie et les fastes de la cour de Napoléon III.',
		periodId: 'second-empire',
		relatedTo: ['second-empire-event', 'painting-manet-dejeuner', 'exposition-universelle-londres'],
		importance: 'standard',
		image: musicImages.offenbachOrphee,
		audio: musicAudio.offenbachOrphee,
	},

	// 6. 1865 — Richard Wagner : Tristan und Isolde
	{
		id: 'music-wagner-tristan',
		year: 1865,
		datePrecise: '10 juin 1865 (création à Munich)',
		type: 'music',
		category: 'musical-drama',
		subCategory: 'chromatic-modernity',
		title: 'Tristan und Isolde',
		subtitle: '1865 · Richard Wagner',
		author: 'Richard Wagner',
		authorDates: '1813–1883',
		dateType: 'premiere',
		tagLabel: 'Musique · Drame musical',
		description: 'Wagner pousse l’harmonie romantique, le chromatisme et la tension musicale vers des audaces inouïes (le célèbre « accord de Tristan »), posant un jalon fondamental vers la modernité musicale du XXe siècle.',
		historicalContext: 'Contexte historique : romantisme européen tardif et émergence du drame musical total (Gesamtkunstwerk). Achevé en 1859 mais créé en 1865 à Munich sous l’égide de Louis II de Bavière, l’opéra dissout les résolutions tonales classiques.',
		periodId: 'second-empire',
		relatedTo: ['painting-manet-dejeuner', 'gregor-mendel', 'music-wagner-parsifal'],
		importance: 'major',
		image: musicImages.wagnerTristan,
		audio: musicAudio.wagnerTristan,
	},

	// 7. 1875 — Georges Bizet : Carmen
	{
		id: 'music-bizet-carmen',
		year: 1875,
		datePrecise: '3 mars 1875 (création à l’Opéra-Comique)',
		type: 'music',
		category: 'opera',
		subCategory: 'realist-opera',
		title: 'Carmen',
		subtitle: '1875 · Georges Bizet',
		author: 'Georges Bizet',
		authorDates: '1838–1875',
		dateType: 'premiere',
		tagLabel: 'Musique · Opéra réaliste',
		description: 'Bizet introduit un monde populaire et contemporain sur la scène lyrique française, associant réalisme dramatique, formes musicales populaires et une tension tragique d’une force universelle.',
		historicalContext: 'Contexte historique : débuts de la Troisième République (1875). D’abord accueillie avec tiédeur par le public bourgeois de l’Opéra-Comique pour son réalisme sans concession (cigarières, contrebandiers, meurtre passionnel), l’œuvre triomphe ensuite mondialement.',
		periodId: 'troisieme-republique',
		relatedTo: ['proclamation-troisieme-republique', 'painting-exposition-impressionniste-1874', 'moteur-explosion-otto'],
		importance: 'standard',
		image: musicImages.bizetCarmen,
		audio: musicAudio.bizetCarmen,
	},

	// 8. 1882 — Richard Wagner : Parsifal
	{
		id: 'music-wagner-parsifal',
		year: 1882,
		datePrecise: '26 juillet 1882 (création à Bayreuth)',
		type: 'music',
		category: 'musical-drama',
		subCategory: 'late-romanticism',
		title: 'Parsifal',
		subtitle: '1882 · Richard Wagner',
		author: 'Richard Wagner',
		authorDates: '1813–1883',
		dateType: 'premiere',
		tagLabel: 'Musique · Drame sacré',
		description: '« Festival scénique sacré » marquant le point culminant du drame musical wagnérien et du romantisme fin-de-siècle, conçu spécifiquement pour l’acoustique mystique du Festspielhaus de Bayreuth.',
		historicalContext: 'Contexte historique : romantisme européen tardif des années 1880. Créé quelques mois avant la mort de Wagner, Parsifal explore le renoncement, la rédemption et la transcendance orchestrale au moment où l’Europe bascule dans le naturalisme et la seconde industrialisation.',
		periodId: 'troisieme-republique',
		relatedTo: ['pot-bouille', 'music-wagner-tristan'],
		importance: 'standard',
		image: musicImages.wagnerParsifal,
		audio: musicAudio.wagnerParsifal,
	},
];
