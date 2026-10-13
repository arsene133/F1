export type PlaceCategory =
	| 'atteste' // Nom propre ou indication géographique explicite dans le texte poétique
	| 'biographique' // Lieu de vie ou de fugue documenté en 1870
	| 'interprete' // Paysage ou décor poétique rattaché par une tradition critique solide
	| 'imaginaire'; // Espace purement imaginaire, métaphorique ou mythique (hors géolocalisation)

export type LocationPrecision =
	| 'exact' // Bâtiment, adresse ou carrefour précis documenté
	| 'commune' // Ville ou commune identifiée
	| 'vallee' // Vallée, forêt, cours d'eau ou région naturelle
	| 'symbolique'; // Non localisable dans l'espace physique

export type EpistemologicalStatus =
	| 'atteste_texte' // Attesté par le texte (toponyme ou indication directe)
	| 'source_historique' // Établi par une source historique (archives, procès-verbaux, correspondance)
	| 'hypothese_argumentee' // Hypothèse interprétative argumentée (tradition critique, motifs paysagers)
	| 'espace_symbolique'; // Espace symbolique ou imaginaire

export interface CategoryMetadata {
	id: PlaceCategory;
	label: string;
	color: string;
	symbol: string;
	description: string;
}

export const PLACE_CATEGORY_LABELS: Record<PlaceCategory, CategoryMetadata> = {
	atteste: {
		id: 'atteste',
		label: 'Lieu nommé dans le poème',
		color: '#b91c1c', // Rouge carmin
		symbol: '📍',
		description: 'Lieu expressément désigné par un toponyme dans les vers ou le sous-titre autographe de Rimbaud.',
	},
	biographique: {
		id: 'biographique',
		label: 'Lieu biographique (1870)',
		color: '#1d4ed8', // Bleu roi
		symbol: '🏛️',
		description: 'Lieu réel où Rimbaud a vécu, voyagé ou séjourné durant l’année 1870.',
	},
	interprete: {
		id: 'interprete',
		label: 'Paysage poétique interprété',
		color: '#047857', // Vert émeraude
		symbol: '🌲',
		description: 'Cadre naturel ou décor poétique rattaché aux Ardennes ou à la région par la critique littéraire.',
	},
	imaginaire: {
		id: 'imaginaire',
		label: 'Espace symbolique ou imaginaire',
		color: '#7c3aed', // Violet améthyste
		symbol: '✨',
		description: 'Espace purement poétique, allégorique ou mythique qui refuse la fixation cartographique.',
	},
};

export const LOCATION_PRECISION_LABELS: Record<LocationPrecision, { label: string; description: string }> = {
	exact: {
		label: 'Localisation exacte',
		description: 'Coordonnées précises au bâtiment ou au square historique identifié.',
	},
	commune: {
		label: 'Échelle communale',
		description: 'Localisation centrée sur la commune ou l’agglomération.',
	},
	vallee: {
		label: 'Échelle régionale ou naturelle',
		description: 'Espace géographique élargi (forêt, vallée, plateau frontalier).',
	},
	symbolique: {
		label: 'Espace poétique hors carte',
		description: 'Non projetable sur une grille de coordonnées terrestres.',
	},
};

export const EPISTEMOLOGICAL_STATUS_LABELS: Record<EpistemologicalStatus, { label: string; badgeClass: string; description: string }> = {
	atteste_texte: {
		label: 'Attesté par le texte',
		badgeClass: 'status-atteste',
		description: 'Toponyme textuel explicite présent dans les vers ou le sous-titre manuscrit.',
	},
	source_historique: {
		label: 'Établi par une source historique',
		badgeClass: 'status-historique',
		description: 'Fait biographique prouvé par documents d’archives, registres ou correspondance autographe.',
	},
	hypothese_argumentee: {
		label: 'Hypothèse interprétative argumentée',
		badgeClass: 'status-hypothese',
		description: 'Rapprochement critique solide fondé sur les motifs textuels et le contexte régional.',
	},
	espace_symbolique: {
		label: 'Espace symbolique (hors géolocalisation)',
		badgeClass: 'status-symbolique',
		description: 'Création poétique, mythologique ou allégorique affranchie de toute attache terrestre.',
	},
};

export interface RimbaudPoem {
	id: string;
	title: string;
	cahier: 1 | 2;
	order: number;
	dateWritten: string;
	form: string;
	theme: string;
	placesSummary: string;
}

export const CAHIERS_DE_DOUAI_POEMS: RimbaudPoem[] = [
	// Premier Cahier (15 poèmes remis à Paul Demeny le 26 septembre 1870 sur papier écolier)
	{
		id: 'premiere-soiree',
		title: 'Première soirée',
		cahier: 1,
		order: 1,
		dateWritten: 'Été 1870 (titre primitif : Trois baisers / Comédie en trois baisers)',
		form: 'Huitains d’octosyllabes',
		theme: 'Éveil sensuel, intimité d’une chambre où pénètrent les rayons et les arbres',
		placesSummary: 'Chambre intime, alcôve domestique provinciale.',
	},
	{
		id: 'sensation',
		title: 'Sensation',
		cahier: 1,
		order: 2,
		dateWritten: 'Mars 1870',
		form: 'Deux quatrains d’alexandrins à rimes croisées',
		theme: 'Marche vagabonde dans la nature, communion cosmique amoureuse',
		placesSummary: 'Sentiers ardennais, blés piquants, horizons d’été.',
	},
	{
		id: 'le-forgeron',
		title: 'Le Forgeron',
		cahier: 1,
		order: 3,
		dateWritten: 'Printemps 1870 (sous-titré « Palais des Tuileries, vers le 10 août 1792 »)',
		form: 'Poème narratif en alexandrins',
		theme: 'Révolution française, confrontation populaire aux Tuileries contre Louis XVI',
		placesSummary: 'Palais des Tuileries (Paris).',
	},
	{
		id: 'soleil-et-chair',
		title: 'Soleil et chair',
		cahier: 1,
		order: 4,
		dateWritten: 'Mai 1870 (titre autographe primitif : Credo in unam...)',
		form: 'Quatre sections en alexandrins',
		theme: 'Paganisme solaire antique, hymne à Vénus contre le christianisme mortifère',
		placesSummary: 'Grèce antique mythique, Cypris, mont Olympe.',
	},
	{
		id: 'ophelie',
		title: 'Ophélie',
		cahier: 1,
		order: 5,
		dateWritten: '15 mai 1870',
		form: 'Trois sections en alexandrins',
		theme: 'Figure shakespearienne voguant sur l’onde noire, rêve et quête d’âpre liberté',
		placesSummary: 'Fleuve sombre mythique, monts de Norvège.',
	},
	{
		id: 'bal-des-pendus',
		title: 'Bal des pendus',
		cahier: 1,
		order: 6,
		dateWritten: 'Mai 1870',
		form: 'Sizains d’octosyllabes',
		theme: 'Danse macabre médiévale burlesque inspirée de François Villon',
		placesSummary: 'Gibet noir allégorique sous les rafales d’hiver.',
	},
	{
		id: 'le-chatiment-de-tartufe',
		title: 'Le Châtiment de Tartufe',
		cahier: 1,
		order: 7,
		dateWritten: 'Printemps 1870',
		form: 'Sonnet en alexandrins',
		theme: 'Démystification féroce de l’hypocrisie dévote et du clergé complice',
		placesSummary: 'Espace ecclésiastique et moral satirique.',
	},
	{
		id: 'venus-anadyomene',
		title: 'Vénus anadyomène',
		cahier: 1,
		order: 8,
		dateWritten: '27 juillet 1870',
		form: 'Sonnet en alexandrins',
		theme: 'Parodie grotesque de la beauté mythologique, laideur et trivialité du corps déchu',
		placesSummary: 'Vieille baignoire de fer-blanc d’un garni urbain.',
	},
	{
		id: 'les-reparties-de-nina',
		title: 'Les Reparties de Nina',
		cahier: 1,
		order: 9,
		dateWritten: 'Août 1870 (titre primitif : Ce qui retient Nina)',
		form: 'Quintils et quatrains d’octosyllabes dialogués',
		theme: 'Lyrisme bucolique et amoureux rompu par l’ironie terre-à-terre finale de l’employée',
		placesSummary: 'Campagne idyllique rêvée et bureau urbain réel.',
	},
	{
		id: 'a-la-musique',
		title: 'À la musique',
		cahier: 1,
		order: 10,
		dateWritten: 'Été 1870 (sous-titré « Place de la Gare, à Charleville »)',
		form: 'Neuf quatrains d’alexandrins',
		theme: 'Satire féroce des bourgeois de province écoutant l’orchestre militaire et éveil adolescent',
		placesSummary: 'Place et square de la Gare à Charleville.',
	},
	{
		id: 'les-effares',
		title: 'Les Effarés',
		cahier: 1,
		order: 11,
		dateWritten: '20 septembre 1870',
		form: 'Quintils d’octosyllabes',
		theme: 'Pauvreté enfantine, fascination pour le pain chaud du boulanger dans le froid',
		placesSummary: 'Grand soupirail d’une boulangerie urbaine.',
	},
	{
		id: 'roman',
		title: 'Roman',
		cahier: 1,
		order: 12,
		dateWritten: '29 septembre 1870',
		form: 'Quatre sections en alexandrins',
		theme: 'Émois amoureux à dix-sept ans, promenades sous les tilleuls, cafés et liberté',
		placesSummary: 'Promenades et cafés de Charleville.',
	},
	{
		id: 'morts-de-quatre-vingt-douze',
		title: '« Morts de Quatre-vingt-douze... »',
		cahier: 1,
		order: 13,
		dateWritten: '3 septembre 1870 (signé « Fait à Mazas, 3 septembre 1870 »)',
		form: 'Sonnet en alexandrins',
		theme: 'Hommage vibrant aux soldats républicains de Valmy et Fleurus opposés au militarisme bonapartiste',
		placesSummary: 'Valmy, Fleurus, plaines de Champagne de 1792.',
	},
	{
		id: 'le-mal',
		title: 'Le Mal',
		cahier: 1,
		order: 14,
		dateWritten: 'Septembre 1870',
		form: 'Sonnet en alexandrins',
		theme: 'Condamnation féroce du carnage guerrier et de l’indifférence du Dieu d’argent',
		placesSummary: 'Champs de bataille de 1870, églises opulentes.',
	},
	{
		id: 'rages-de-cesars',
		title: 'Rages de Césars',
		cahier: 1,
		order: 15,
		dateWritten: 'Automne 1870 (après le 2 septembre 1870)',
		form: 'Sonnet en alexandrins',
		theme: 'Satire cinglante de Napoléon III captif à Wilhelmshöhe méditant sur sa déchéance',
		placesSummary: 'Château de Wilhelmshöhe (Cassel, Allemagne), Saint-Cloud, Tuileries.',
	},

	// Second Cahier (7 poèmes remis en octobre 1870 sur papier à lettres)
	{
		id: 'reve-pour-l-hiver',
		title: 'Rêvé pour l’hiver',
		cahier: 2,
		order: 16,
		dateWritten: '7 octobre 1870 (sous-titré « En wagon »)',
		form: 'Sonnet en alexandrins',
		theme: 'Fantaisie amoureuse et coquette dans l’intimité d’un compartiment de train',
		placesSummary: 'Petit wagon rose d’une rame de chemin de fer.',
	},
	{
		id: 'le-dormeur-du-val',
		title: 'Le Dormeur du val',
		cahier: 2,
		order: 17,
		dateWritten: 'Octobre 1870',
		form: 'Sonnet en alexandrins',
		theme: 'Tableau bucolique trompeur révélant la mort violente d’un jeune soldat abattu',
		placesSummary: 'Trou de verdure, val traversé par une rivière encaissée.',
	},
	{
		id: 'au-cabaret-vert',
		title: 'Au Cabaret-Vert, cinq heures du soir',
		cahier: 2,
		order: 18,
		dateWritten: 'Octobre 1870 (daté « Charleroi, octobre 70 »)',
		form: 'Sonnet en alexandrins',
		theme: 'Halte jubilatoire du marcheur affamé, tartines de beurre, jambon rose et bière mousseuse',
		placesSummary: 'Cabaret-Vert (auberge À la Maison verte), place Buisset à Charleroi.',
	},
	{
		id: 'la-maline',
		title: 'La Maline',
		cahier: 2,
		order: 19,
		dateWritten: 'Octobre 1870 (daté « Charleroi, octobre 70 »)',
		form: 'Sonnet en alexandrins',
		theme: 'Séduction gourmande dans une auberge avec une servante espiègle apportant un plat belge',
		placesSummary: 'Salle à manger d’une auberge de Charleroi.',
	},
	{
		id: 'l-eclatante-victoire-de-sarrebruck',
		title: 'L’Éclatante Victoire de Sarrebrück',
		cahier: 2,
		order: 20,
		dateWritten: 'Octobre 1870 (sous-titré « Gravure belge brillamment coloriée, se vend à Charleroi, 35 centimes »)',
		form: 'Sonnet en alexandrins avec dislocation métrique',
		theme: 'Caricature bouffonne de la propagande impériale et d’une gravure populaire vendue à Charleroi',
		placesSummary: 'Sarrebrück (frontière prussienne) et Charleroi (lieu d’achat de la gravure).',
	},
	{
		id: 'le-buffet',
		title: 'Le Buffet',
		cahier: 2,
		order: 21,
		dateWritten: 'Octobre 1870',
		form: 'Sonnet en alexandrins',
		theme: 'Poésie des objets familiers, mémoire intime des générations dans le vieux chêne sombre',
		placesSummary: 'Salle commune familiale provinciale.',
	},
	{
		id: 'ma-boheme',
		title: 'Ma Bohème (Fantaisie)',
		cahier: 2,
		order: 22,
		dateWritten: 'Octobre 1870',
		form: 'Sonnet en alexandrins',
		theme: 'Manifeste du poète vagabond et affranchi rimant sous le ciel étoilé de la Grande-Ourse',
		placesSummary: 'Bord des routes, auberge métaphorique de la Grande-Ourse.',
	},
];

export interface PoemPlaceRelation {
	poemId: string;
	placeId: string;
	status: EpistemologicalStatus;
	explanation: string;
}

export interface RimbaudPlace {
	id: string;
	name: string;
	historicName1870?: string;
	category: PlaceCategory;
	precision: LocationPrecision;
	epistemologicalStatus: EpistemologicalStatus;
	coordinates: [number, number] | null; // null si symbolique / imaginaire
	shortDescription: string;
	literaryAnalysis: string;
	historicalDistinction: string;
	quotation: string;
	quotationReference: string;
	documentarySources: string;
	poems: string[]; // ids des poèmes associés
	scale: 'local' | 'regional' | 'elargi';
}

export const RIMBAUD_PLACES: RimbaudPlace[] = [
	{
		id: 'charleville-square-gare',
		name: 'Charleville — Square de la Gare (« À la musique »)',
		historicName1870: 'Place et Square de la Gare de Charleville',
		category: 'atteste',
		precision: 'exact',
		epistemologicalStatus: 'atteste_texte',
		coordinates: [49.7694, 4.7252],
		shortDescription: 'Lieu explicitement nommé en sous-titre autographe : « Place de la Gare, à Charleville ».',
		literaryAnalysis:
			'Dans « À la musique », Rimbaud livre une satire féroce et jubilatoire des mœurs provinciales. Le square de la gare (aménagé à partir de 1866) devient le théâtre comique où parade la bourgeoisie locale (notaires, rentiers, épiciers) écoutant un orchestre militaire. Le poète adolescent s’y décrit débraillé, défiant les convenances et observant le corps désirable des jeunes filles.',
		historicalDistinction:
			'Lieu attesté dans le texte : sous-titre autographe « Place de la Gare, à Charleville ». Précision historique : le kiosque à musique en dur ne sera construit qu’en 1878-1879 ; en 1870, la musique militaire jouait sur une estrade provisoire au centre du square.',
		quotation: 'Sur la place taillée en mesquines pelouses, / Square où tout est correct, les arbres et les fleurs, / Tous les bourgeois poussifs qu’étranglent les chaleurs / Portent, les jeudis soirs, leurs bêtises jalouses.',
		quotationReference: '« À la musique », sous-titré « Place de la Gare, à Charleville » (été 1870)',
		documentarySources: 'British Library, Zweig MS 181 ; Archives municipales de Charleville-Mézières (délibération du square de 1866) ; Steve Murphy, Le Premier Rimbaud.',
		poems: ['a-la-musique'],
		scale: 'local',
	},
	{
		id: 'charleville-college',
		name: 'Charleville — Collège municipal et promenades bourgeoises',
		historicName1870: 'Collège de Charleville (actuel collège Sévigné) & Promenades',
		category: 'biographique',
		precision: 'exact',
		epistemologicalStatus: 'source_historique',
		coordinates: [49.7736, 4.7196],
		shortDescription: 'Cadre de formation intellectuelle de Rimbaud, de ses premiers triomphes scolaires et du décor provincial de « Roman ».',
		literaryAnalysis:
			'Élève brillantissime au collège de Charleville sous la houlette de Georges Izambard, Rimbaud y subit le carcan académique tout en s’initiant à la poésie contemporaine. Les « tilleuls verts de la promenade » de « Roman » transposent les allées de Charleville et les bords de Meuse où s’ébroue la jeunesse désireuse de rompre avec le sérieux bourgeois.',
		historicalDistinction:
			'Fait historique établi : scolarité de Rimbaud au collège municipal en 1869-1870. Distinction littéraire : « Roman » est une fiction poétique de l’adolescence (« On n’est pas sérieux, quand on a dix-sept ans »), non le procès-verbal biographique d’un jour précis.',
		quotation: 'On n’est pas sérieux, quand on a dix-sept ans. / — Un beau soir, foin des bocks et de la limonade, / Des cafés tapageurs aux lustres éclatants ! / On va sous les tilleuls verts de la promenade.',
		quotationReference: '« Roman », daté du 29 septembre 1870',
		documentarySources: 'Palmarès du collège de Charleville (1870) ; Jean-Luc Steinmetz, Arthur Rimbaud (Fayard) ; André Guyaux, Œuvres complètes (Pléiade, 2009, p. 812-815).',
		poems: ['roman'],
		scale: 'local',
	},
	{
		id: 'charleville-gare',
		name: 'Charleville — Gare ferroviaire (départ des fugues)',
		historicName1870: 'Gare de Charleville (Compagnie des chemins de fer de l’Est)',
		category: 'biographique',
		precision: 'exact',
		epistemologicalStatus: 'source_historique',
		coordinates: [49.7689, 4.7258],
		shortDescription: 'Lieu historique de rupture : départ de la première fugue vers Paris le 29 août 1870 en pleine invasion prussienne.',
		literaryAnalysis:
			'Vendant ses livres de prix scolaires pour payer une fraction de son billet, Rimbaud franchit le quai de la gare de Charleville pour s’évader vers la capitale. La machine ferroviaire matérialise l’impulsion moderne d’évasion, réenchantée sur le mode fantaisiste et intime dans « Rêvé pour l’hiver » (« En wagon »).',
		historicalDistinction:
			'Fait historique : départ le 29 août 1870 dans le train de Paris sans billet complet, attesté par les interrogatoires de police. Rapport littéraire : le train passe de l’instrument de détresse réelle au rêve de cocon amoureux (« petit wagon rose »).',
		quotation: 'L’hiver, nous irons dans un petit wagon rose / Avec des coussins bleus. / Nous serons bien. Un nid de baisers fous repose / Dans chaque coin moelleux.',
		quotationReference: '« Rêvé pour l’hiver », 7 octobre 1870 (mention autographe « En wagon »)',
		documentarySources: 'Procès-verbal de police de la Gare du Nord (31 août 1870) ; Steve Murphy, Rimbaud et la Commune (Classiques Garnier) ; Pierre Brunel, Rimbaud (LGF).',
		poems: ['reve-pour-l-hiver'],
		scale: 'local',
	},
	{
		id: 'charleville-quai-madeleine',
		name: 'Charleville — Domicile familial et décor des « Effarés »',
		historicName1870: 'Quai de la Madeleine (n° 5 ou 7, actuel quai Rimbaud)',
		category: 'interprete',
		precision: 'exact',
		epistemologicalStatus: 'hypothese_argumentee',
		coordinates: [49.7748, 4.7212],
		shortDescription: 'Domicile de la famille Rimbaud au bord de la Meuse et cadre urbain associé au soupirail des « Effarés » et au meuble du « Buffet ».',
		literaryAnalysis:
			'La maison maternelle du quai de la Madeleine, où Vitalie Rimbaud élève durement ses enfants, concentre l’atmosphère domestique que le poète fuit. La critique (Steve Murphy, Jean-Luc Steinmetz) associe le décor du poème « Les Effarés » (cinq enfants pauvres fascinés par le pain chaud au soupirail d’une boulangerie) et « Le Buffet » à l’environnement urbain immédiat de ce quartier populaire.',
		historicalDistinction:
			'Fait historique : résidence de la famille Rimbaud attestée au quai de la Madeleine. Hypothèse littéraire argumentée : le soupirail de boulangerie des « Effarés » ne porte aucun nom de rue dans le poème ; il s’agit d’une scène de misère urbaine observée, non d’une adresse documentaire certifiée.',
		quotation: 'Noirs dans la neige et dans la brume, / Au grand soupirail qui s’allume, / Leurs culs en rond, / À genoux, cinq petits, — misère ! — / Regardent le Boulanger faire / Le lourd pain blond...',
		quotationReference: '« Les Effarés », autographe daté du 20 septembre 1870',
		documentarySources: 'Lettre de Rimbaud du 5 septembre 1870 (« Quai de la Madeleine, 5 ») ; Steve Murphy, « Les Effarés : chromo ou caricature ? », dans Stratégies de Rimbaud (Champion) ; Maison des Ailleurs.',
		poems: ['les-effares', 'le-buffet'],
		scale: 'local',
	},
	{
		id: 'douai-maison-demeny',
		name: 'Douai — Maison des demoiselles Gindre et Paul Demeny',
		historicName1870: 'Douai, rue de Paris (demeure de la famille Demeny / Gindre)',
		category: 'biographique',
		precision: 'exact',
		epistemologicalStatus: 'source_historique',
		coordinates: [50.3678, 3.0782],
		shortDescription: 'Havre des deux séjours de Rimbaud (septembre et octobre 1870) et lieu matériel de remise des deux liasses des Cahiers.',
		literaryAnalysis:
			'Libéré de Mazas grâce à Izambard, Rimbaud est hébergé à Douai chez les tantes de ce dernier, les demoiselles Gindre. C’est dans cette maison bourgeoise et accueillante qu’il recopie avec soin ses poèmes sur papier d’écolier puis sur papier à lettres, et les remet à Paul Demeny en vue d’une publication parisienne chez Lemerre. Demeny conservera ces manuscrits précieux malgré l’ordre ultérieur de Rimbaud de les brûler.',
		historicalDistinction:
			'Fait historique prouvé : deux séjours documentés en septembre puis octobre 1870. Distinction capitale : Douai est le lieu de conservation et de matérialisation éditoriale des Cahiers, mais aucun des poèmes n’a Douai pour sujet ou décor textuel.',
		quotation: 'Monsieur Demeny, brûlez, je le veux, et je crois que vous respecterez ma volonté comme celle d’un mort, brûlez tous les vers que je fus assez bête pour vous donner lors de mon séjour à Douai.',
		quotationReference: 'Lettre d’Arthur Rimbaud à Paul Demeny, 10 juin 1871',
		documentarySources: 'British Library, Stefan Zweig Collection, Zweig MS 181 ; Georges Izambard, À Douai et à Charleville (Kra, 1927) ; Pierre Brunel, Rimbaud (Fayard).',
		poems: ['premiere-soiree', 'sensation', 'les-reparties-de-nina'],
		scale: 'local',
	},
	{
		id: 'paris-mazas',
		name: 'Paris — Prison de Mazas et Gare du Nord',
		historicName1870: 'Maison d’arrêt cellulaire de Mazas (12e arr.)',
		category: 'biographique',
		precision: 'exact',
		epistemologicalStatus: 'source_historique',
		coordinates: [48.8475, 2.3712],
		shortDescription: 'Incarcération cellulaire d’Arthur Rimbaud du 31 août au 4 septembre 1870, à l’origine du manuscrit de « Morts de Quatre-vingt-douze ».',
		literaryAnalysis:
			'Arrivé sans argent à la gare du Nord le 31 août, Rimbaud est arrêté et écroué à Mazas. Cette détention de cinq jours dans une cellule individuelle terrifie l’adolescent, qui écrit sa lettre de détresse à Izambard (« j’attends mon jugement à Mazas ! oh ! »). C’est là qu’il compose et signe « Fait à Mazas, 3 septembre 1870 » son sonnet républicain répliquant à la propagande bonapartiste.',
		historicalDistinction:
			'Fait historique prouvé : registre d’écrou de Mazas et lettre autographe du 5 septembre 1870. Rapport textuel direct : le poème « Morts de Quatre-vingt-douze » porte expressément la mention autographe de rédaction « Fait à Mazas ».',
		quotation: 'Arrêté en descendant de wagon pour n’avoir pas un sou et devoir treize francs de chemin de fer, je fus conduit à la préfecture, et, aujourd’hui, j’attends mon jugement à Mazas ! oh !',
		quotationReference: 'Lettre autographe d’Arthur Rimbaud à Georges Izambard, Mazas, 5 septembre 1870',
		documentarySources: 'Registre d’écrou de la prison de Mazas (Archives de la Préfecture de Police) ; Manuscrit autographe Zweig MS 181 (f. 5v, sous le titre « Un français de soixante-dix ») ; André Guyaux, Rimbaud (Gallimard).',
		poems: ['morts-de-quatre-vingt-douze'],
		scale: 'elargi',
	},
	{
		id: 'charleroi-cabaret-vert',
		name: 'Charleroi — Auberge « À la Maison verte » (Le Cabaret-Vert)',
		historicName1870: 'Auberge À la Maison verte, place Buisset à Charleroi (Belgique)',
		category: 'atteste',
		precision: 'exact',
		epistemologicalStatus: 'atteste_texte',
		coordinates: [50.4075, 4.4417],
		shortDescription: 'Lieu nommé en titre et daté à Charleroi : halte gourmande de la seconde fugue en octobre 1870.',
		literaryAnalysis:
			'Après une semaine de marche depuis Charleville, Rimbaud entre à Charleroi et s’attable à l’auberge. Les sonnets « Au Cabaret-Vert » et « La Maline » transfigurent cette halte en apothéose sensorielle : le repos des jambes lasses, le contact du pain et du jambon tiède, la bière mousseuse dorée et le sourire complice de la servante belge consacrent la libération physique.',
		historicalDistinction:
			'Lieu attesté dans le poème (« J’entrais à Charleroi. / — Au Cabaret-Vert »). Précision historique : l’enseigne réelle était « À la Maison verte », auberge de rouliers située place Buisset (démolie en 2013). Rimbaud venait chercher sans succès un emploi de journaliste auprès de Bufquin des Essarts au Journal de Charleroi.',
		quotation: 'Depuis huit jours, j’avais déchiré mes bottines / Aux cailloux des chemins. J’entrais à Charleroi. / — Au Cabaret-Vert : je demandai des tartines / De beurre et du jambon qui fût à moitié froid.',
		quotationReference: '« Au Cabaret-Vert, cinq heures du soir », daté « Charleroi, octobre 70 »',
		documentarySources: 'Manuscrit autographe Zweig MS 181 ; Robert Goffin, Rimbaud vivant ; Société royale d’Archéologie de Charleroi ; Steve Murphy, Stratégies de Rimbaud.',
		poems: ['au-cabaret-vert', 'la-maline', 'l-eclatante-victoire-de-sarrebruck'],
		scale: 'regional',
	},
	{
		id: 'val-ardennes-dormeur',
		name: 'Vallée ardennaise — Le cadre du « Dormeur du val »',
		historicName1870: 'Gorges et vallons encaissés de la Meuse ardennaise',
		category: 'interprete',
		precision: 'vallee',
		epistemologicalStatus: 'hypothese_argumentee',
		coordinates: [49.885, 4.708],
		shortDescription: 'Paysage interprété : vallon verdoyant ardennais servant d’écrin au sonnet de dénonciation de la guerre.',
		literaryAnalysis:
			'Le poème construit un piège pastoral : une nature lumineuse et maternelle (la rivière chantante, les rayons, le cresson bleu) qui semble bercer un soldat endormi, jusqu’à la révélation finale brutale (« Il a deux trous rouges au côté droit »). La critique unanime (Guyaux, Murphy, Steinmetz) rattache ce tableau aux vallons forestiers encaissés de la Meuse ardennaise, marqués par les escarmouches de 1870.',
		historicalDistinction:
			'Hypothèse critique argumentée : aucun toponyme n’apparaît dans le texte (« C’est un trou de verdure »). Ce paysage est une composition poétique universelle du *locus amoenus* tragiquement renversé, impossible à fixer sur une coordonnée GPS exclusive sans trahir la démarche de Rimbaud.',
		quotation: 'C’est un trou de verdure où chante une rivière, / Accrochant follement aux herbes des haillons / D’argent ; où le soleil, de la montagne fière, / Luit : c’est un petit val qui mousse de rayons.',
		quotationReference: '« Le Dormeur du val », autographe daté d’octobre 1870',
		documentarySources: 'British Library, Zweig MS 181 ; André Guyaux, Notes critiques (Pléiade, 2009, p. 825) ; Steve Murphy, Logiques du dernier vers.',
		poems: ['le-dormeur-du-val'],
		scale: 'regional',
	},
	{
		id: 'sedan-bataille',
		name: 'Sedan — Champ de bataille et capitulation impériale',
		historicName1870: 'Place forte de Sedan (Bazeilles, Floing)',
		category: 'biographique',
		precision: 'commune',
		epistemologicalStatus: 'source_historique',
		coordinates: [49.7022, 4.9438],
		shortDescription: 'À 20 km de Charleville, théâtre du désastre militaire du 2 septembre 1870 qui anéantit le Second Empire et radicalise Rimbaud.',
		literaryAnalysis:
			'La bataille de Sedan est le séisme politique et militaire immédiat qui bouleverse l’adolescence de Rimbaud. Le canon s’entend depuis Charleville ; les régiments prussiens occupent les Ardennes. Cette débâcle sanglante inspire directement l’indignation du sonnet « Le Mal » contre les rois bellicistes et « Le Dormeur du val ».',
		historicalDistinction:
			'Fait historique majeur : capitulation de Napoléon III et de 80 000 soldats le 2 septembre 1870. Présence poétique : Sedan forme le référent historique direct de l’indignation antimilitariste des poèmes d’automne, sans être expressément nommé dans les vers du « Mal ».',
		quotation: 'Tandis que les crachats rouges de la mitraille / Sifflent tout le jour par l’infini du ciel bleu ; / Qu’écarlates ou verts, près du Roi qui les raille, / Croulent les bataillons en masse dans le feu...',
		quotationReference: '« Le Mal », autographe de septembre 1870',
		documentarySources: 'Rapports militaires de la guerre de 1870 ; Jean-Luc Steinmetz, éd. Poésies (GF Flammarion) ; Steve Murphy, Le Premier Rimbaud.',
		poems: ['le-mal', 'le-dormeur-du-val'],
		scale: 'regional',
	},
	{
		id: 'valmy-champ-bataille',
		name: 'Valmy — Les plaines héroïques de 1792',
		historicName1870: 'Valmy (plaines de Champagne et d’Argonne)',
		category: 'atteste',
		precision: 'commune',
		epistemologicalStatus: 'atteste_texte',
		coordinates: [49.0833, 4.7725],
		shortDescription: 'Lieu nommé dans le texte : « Morts de Valmy, Morts de Fleurus, Morts d’Italie ».',
		literaryAnalysis:
			'En pleine débâcle impériale de septembre 1870, le polémiste bonapartiste Paul de Cassagnac exhorte les conscrits à mourir comme leurs aïeux de 1792. Rimbaud riposte par un sonnet vengeur : il réhabilite les soldats républicains de Valmy qui brisaient le joug des despotes, et flétrit le cynisme du régime impérial déchu qui ose invoquer leur mémoire.',
		historicalDistinction:
			'Lieu attesté dans le poème : toponyme explicite au vers 10. Valmy est ici le symbole historique et sacré de la souveraineté populaire républicaine brandi contre la monarchie et l’Empire.',
		quotation: 'Morts de Quatre-vingt-douze et de Quatre-vingt-treize, / Qui, pâles du baiser fort de la liberté, / Calmes, sous vos sabots, brisiez le joug qui pèse / Sur l’âme et sur le front de toute humanité !',
		quotationReference: '« Morts de Quatre-vingt-douze... », daté du 3 septembre 1870',
		documentarySources: 'British Library, Zweig MS 181 (f. 5v) ; Le Pays (journal bonapartiste de Paul de Cassagnac) ; Claude Jeancolas, Dictionnaire Rimbaud.',
		poems: ['morts-de-quatre-vingt-douze'],
		scale: 'regional',
	},
	{
		id: 'sarrebruck-frontiere',
		name: 'Sarrebrück — Le champ de foire patriotique',
		historicName1870: 'Saarbrücken (frontière sarroise)',
		category: 'atteste',
		precision: 'commune',
		epistemologicalStatus: 'atteste_texte',
		coordinates: [49.2333, 6.9833],
		shortDescription: 'Toponyme au titre d’un des sonnets satiriques les plus corrosifs des Cahiers.',
		literaryAnalysis:
			'Le 2 août 1870, une escarmouche frontalière permet aux Français d’occuper brièvement Sarrebrück, aussitôt magnifiée en « victoire éclatante » par la propagande. Rimbaud pastiche une gravure populaire patriotique vendue 35 centimes à Charleroi pour ridiculiser l’empereur sur son dada flamboyant et les soldats naïfs, désamorçant l’héroïsme militaire en farce carnavalesque.',
		historicalDistinction:
			'Toponyme explicite dans le titre du poème. Rimbaud n’a jamais été à Sarrebrück : le poème décrit et parodie un objet matériel (une lithographie achetée à Charleroi), transformant le champ de bataille en grotesque scène de théâtre.',
		quotation: 'Au milieu, l’Empereur, dans une apothéose / Bleue et jaune, s’en va, raide, sur son dada / Flamboyant ; très heureux, — car il voit tout en rose, / Féroce comme Zeus et doux comme un papa...',
		quotationReference: '« L’Éclatante Victoire de Sarrebrück », sous-titré « Gravure belge... se vend à Charleroi » (octobre 1870)',
		documentarySources: 'British Library, Zweig MS 181 ; Steve Murphy, Stratégies de Rimbaud (Champion) ; Collections de gravures populaires d’Épinal de 1870.',
		poems: ['l-eclatante-victoire-de-sarrebruck'],
		scale: 'elargi',
	},
	{
		id: 'wilhelmshoehe-cassel',
		name: 'Wilhelmshöhe (Cassel) — La captivité de l’Empereur déchu',
		historicName1870: 'Château de Wilhelmshöhe près de Cassel (Hesse-Nassau, Allemagne)',
		category: 'atteste',
		precision: 'exact',
		epistemologicalStatus: 'atteste_texte',
		coordinates: [51.3158, 9.4161],
		shortDescription: 'Lieu de captivité dorée de Napoléon III après Sedan, évoqué dans « Rages de Césars ».',
		literaryAnalysis:
			'Après sa reddition du 2 septembre 1870, Napoléon III est assigné à résidence au château de Wilhelmshöhe près de Cassel. Dans « Rages de Césars », Rimbaud dépeint l’empereur déchu marchant sur les pelouses allemandes, le cigare aux dents, rongé par le remords d’avoir voulu étouffer la Liberté et songeant aux fastes perdus de Saint-Cloud et des Tuileries.',
		historicalDistinction:
			'Lieu historique contemporain et toponymes textuels associés (Tuileries, Saint-Cloud). Rimbaud reconstitue la scène d’après les gravures et reportages de la presse internationale relatant la captivité impériale.',
		quotation: 'L’Homme pâle, le long des pelouses fleuries, / Chemine, en habit noir, et le cigare aux dents : / L’Homme pâle repense aux fleurs des Tuileries — / Et parfois son œil terne a des regards ardents...',
		quotationReference: '« Rages de Césars », autographe de l’automne 1870',
		documentarySources: 'British Library, Zweig MS 181 (f. 15) ; Dépêches de guerre de septembre 1870 ; André Guyaux, Poésies (Gallimard Folio).',
		poems: ['rages-de-cesars'],
		scale: 'elargi',
	},
	{
		id: 'paris-tuileries',
		name: 'Paris — Le Palais des Tuileries du « Forgeron »',
		historicName1870: 'Palais des Tuileries (détruit lors de la Commune de 1871)',
		category: 'atteste',
		precision: 'exact',
		epistemologicalStatus: 'atteste_texte',
		coordinates: [48.8638, 2.3278],
		shortDescription: 'Théâtre historique de l’assaut populaire du 10 août 1792 nommé en sous-titre du « Forgeron ».',
		literaryAnalysis:
			'Sous-titré « Palais des Tuileries, vers le 10 août 1792 », ce long poème épique met en scène un artisan forgeron apostrophant Louis XVI au nom du peuple affamé. À travers ce drame révolutionnaire de 1792, Rimbaud vise le Second Empire agonisant du printemps 1870 et prophétise le soulèvement démocratique.',
		historicalDistinction:
			'Lieu nommé en sous-titre textuel. Le poème est une reconstitution historique et politique inspirée des lectures révolutionnaires de Rimbaud (Jules Michelet), non un séjour biographique à cette date.',
		quotation: 'Le bras sur un marteau gigantesque, effrayant / D’ivresse et de grandeur, le front vaste, riant / Comme un clairon d’airain, avec toute sa bouche, / Et prenant ce gros-là dans son regard farouche, / Le Forgeron parlait à Louis Seize...',
		quotationReference: '« Le Forgeron », sous-titré « Palais des Tuileries, vers le 10 août 1792 » (printemps 1870)',
		documentarySources: 'British Library, Zweig MS 181 ; Jules Michelet, Histoire de la Révolution française ; Steve Murphy, Le Premier Rimbaud.',
		poems: ['le-forgeron', 'rages-de-cesars'],
		scale: 'elargi',
	},
	{
		id: 'routes-ardennes-boheme',
		name: 'Sentiers et routes du vagabondage poétique',
		historicName1870: 'Réseau routier et sentiers des Ardennes franco-belges',
		category: 'interprete',
		precision: 'vallee',
		epistemologicalStatus: 'hypothese_argumentee',
		coordinates: [49.95, 4.65],
		shortDescription: 'Les routes parcourues à pied par Rimbaud, matrice rythmique de « Sensation » et « Ma Bohème ».',
		literaryAnalysis:
			'Chez Rimbaud, la marche à pied n’est pas une simple péripétie : c’est l’expérience corporelle fondatrice du rythme poétique. Arpentant les sentiers entre Charleville, Fumay, Givet et la frontière belge, le poète scande ses alexandrins en foulant les cailloux (« Petit-Poucet rêveur »), faisant de la route le lieu de la communion cosmique avec la nuit et les étoiles.',
		historicalDistinction:
			'Hypothèse critique argumentée : si les fugues pédestres sont historiquement avérées par les lettres et témoignages, « Ma Bohème » et « Sensation » élèvent l’errance au rang de mythe personnel d’émancipation affranchi de tout itinéraire balisé.',
		quotation: 'Je m’en allais, les poings dans mes poches crevées ; / Mon paletot aussi devenait idéal ; / J’allais sous le ciel, Muse ! et j’étais ton féal ; / Oh ! là ! là ! que d’amours splendides j’ai rêvées !',
		quotationReference: '« Ma Bohème (Fantaisie) », autographe d’octobre 1870',
		documentarySources: 'British Library, Zweig MS 181 ; Alain Borer, Rimbaud d’Ardenne (Arthaud) ; René Guitton, Sur les pas de Rimbaud.',
		poems: ['ma-boheme', 'sensation'],
		scale: 'regional',
	},
	{
		id: 'espace-mythique-antiquite',
		name: 'Espace antique et païen — Grèce mythologique',
		category: 'imaginaire',
		precision: 'symbolique',
		epistemologicalStatus: 'espace_symbolique',
		coordinates: null,
		shortDescription: 'L’Olympe, Cypris et la nature païenne régénérée dans « Soleil et chair » et « Ophélie ».',
		literaryAnalysis:
			'Dans « Soleil et chair », Rimbaud ressuscite le monde gréco-latin préchrétien où l’humanité vivait en symbiose charnelle et sacrée avec le cosmos. Cet espace est une utopie philosophique et sensuelle : il incarne le refus absolu du dogme chrétien de la faute et célèbre la beauté première de la chair réconciliée avec le soleil.',
		historicalDistinction:
			'Espace purement imaginaire et poétique : aucune localisation terrestre ne saurait borner l’Olympe ou le rivage sacré d’Aphrodite. Doit demeurer rigoureusement hors géolocalisation.',
		quotation: 'Je regrette les temps de l’antique jeunesse, / Des satyres lascifs, des faunes animaux, / Dieux qui mordaient d’amour l’écorce des rameaux / Et dans les nénufars baisaient la Nymphe blonde !',
		quotationReference: '« Soleil et chair », daté de mai 1870 (titre primitif Credo in unam...)',
		documentarySources: 'British Library, Zweig MS 181 ; Lettre de Rimbaud à Théodore de Banville (24 mai 1870) ; André Guyaux, Poésies (Folio).',
		poems: ['soleil-et-chair', 'ophelie', 'venus-anadyomene'],
		scale: 'elargi',
	},
	{
		id: 'espace-nocturne-gibet',
		name: 'Espace macabre et carnavalesque — Le gibet sous la lune',
		category: 'imaginaire',
		precision: 'symbolique',
		epistemologicalStatus: 'espace_symbolique',
		coordinates: null,
		shortDescription: 'La potence noire et la sarabande des pendus dans « Bal des pendus ».',
		literaryAnalysis:
			'Réécrivant avec une verve truculente la « Ballade des pendus » de François Villon, Rimbaud compose une danse macabre où les squelettes de paladins s’agitent sous les bourrasques hivernales. Le gibet n’est pas un lieu de supplice réel géolocalisable, mais un tréteau carnavalesque où l’humour noir subvertit l’effroi de la mort.',
		historicalDistinction:
			'Espace poétique non localisable : allégorie littéraire et hommage intertextuel à Villon, affranchi de toute coordonnée géographique.',
		quotation: 'Au gibet noir, manchot aimable, / Dansent, dansent les paladins, / Les maigres paladins du diable, / Les squelettes de Saladins.',
		quotationReference: '« Bal des pendus », autographe de mai 1870',
		documentarySources: 'British Library, Zweig MS 181 (f. 9) ; Steve Murphy, Le Premier Rimbaud (Champion) ; François Villon, Ballade des pendus.',
		poems: ['bal-des-pendus', 'le-chatiment-de-tartufe'],
		scale: 'elargi',
	},
];

export interface ReadingPath {
	id: string;
	title: string;
	subtitle: string;
	description: string;
	focus: string;
	placeIds: string[];
}

export const READING_PATHS: ReadingPath[] = [
	{
		id: 'ardennes',
		title: 'Parcours A — Le Rimbaud des Ardennes',
		subtitle: 'Territoire natal, collège, famille et révolte contre la province',
		description:
			'Explorez les racines ardennaises du jeune Arthur : son collège de Charleville, le square de la gare d’« À la musique », le quai de la Madeleine et les promenades où l’adolescence refuse le conformisme bourgeois.',
		focus: 'L’ancrage provincial et la naissance de la contestation.',
		placeIds: ['charleville-square-gare', 'charleville-college', 'charleville-quai-madeleine', 'charleville-gare'],
	},
	{
		id: 'fugues',
		title: 'Parcours B — Marcher, partir, s’évader',
		subtitle: 'L’expérience de la fugue, les routes, la Belgique et les étapes de la liberté',
		description:
			'Suivez les pas du marcheur infatigable à la fin de l’été et à l’automne 1870 : de la gare de Charleville aux cachots de Mazas, puis sur les sentiers transfrontaliers jusqu’à Charleroi et au havre de Douai.',
		focus: 'La géographie physique de la marche et l’éveil sensoriel du vagabondage.',
		placeIds: ['charleville-gare', 'paris-mazas', 'charleroi-cabaret-vert', 'douai-maison-demeny', 'routes-ardennes-boheme'],
	},
	{
		id: 'guerre',
		title: 'Parcours C — L’année terrible : guerre et débâcle de 1870',
		subtitle: 'L’invasion prussienne, le désastre de Sedan et la satire antimilitariste',
		description:
			'Mesurez comment le fracas de la guerre franco-prussienne bouleverse l’adolescence de Rimbaud : le canon de Sedan, le carnage du Dormeur du val, la parodie de Sarrebrück, le sacrifice républicain de Valmy et l’empereur captif à Wilhelmshöhe.',
		focus: 'L’Histoire en direct et la violence dénoncée par l’ironie féroce.',
		placeIds: ['sedan-bataille', 'val-ardennes-dormeur', 'sarrebruck-frontiere', 'wilhelmshoehe-cassel', 'valmy-champ-bataille'],
	},
	{
		id: 'emancipation',
		title: 'Parcours D — Émancipation poétique : du réel à l’imaginaire',
		subtitle: 'La métamorphose du monde quotidien en vision poétique',
		description:
			'Comprenez comment Rimbaud passe du décor quotidien tangible (le buffet familial, le soupirail de boulangerie) aux horizons mythiques d’une antiquité païenne et aux danses macabres libératrices.',
		focus: 'La fabrique poétique et le refus de borner l’art au document géographique.',
		placeIds: ['charleville-square-gare', 'douai-maison-demeny', 'espace-mythique-antiquite', 'espace-nocturne-gibet'],
	},
];

export const RIMBAUD_MAP_CONFIG = {
	tileUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
	attribution:
		'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributeurs',
	defaultCenter: [49.95, 4.25] as [number, number],
	defaultZoom: 6,
	minZoom: 5,
	maxZoom: 18,
	bounds: [
		[48.0, 1.5],
		[51.8, 9.8],
	] as [[number, number], [number, number]],
};
