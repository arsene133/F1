export type GraffignyPlaceCategory =
	| 'recit' // Lieu du récit : expressément nommé ou décrit comme étape dans le texte
	| 'historique' // Repère historique : espace réel servant de contextualisation historique/géographique
	| 'trajet' // Trajet narratif : déplacement évoqué par le roman, sans itinéraire maritime exact garanti
	| 'incertain'; // Localisation incertaine : position indicative ou hypothétique non fixée par le texte

export type GraffignyLocationPrecision =
	| 'exact' // Lieu ponctuel ou bâtiment identifié
	| 'ville' // Échelle urbaine
	| 'region' // Échelle régionale / vaste province
	| 'trajectoire' // Trajet maritime indicatif entre deux mondes
	| 'symbolique' // Repère emblématique représentatif sans ancrage métrique
	| 'incertain'; // Localisation approximative ou hypothétique

export type GraffignyDocumentaryStatus =
	| 'atteste' // Formellement attesté dans le roman
	| 'contextuel' // Repère historique utile à la contextualisation du XVIIIe s. ou de l'Empire inca
	| 'incertain'; // Localisation indicative ou littéraire

export interface GraffignyPlace {
	id: string;
	name: string;
	subtitle: string;
	category: GraffignyPlaceCategory;
	status: GraffignyDocumentaryStatus;
	precision: GraffignyLocationPrecision;
	coordinates?: [number, number]; // [lat, lng] WGS84
	bounds?: [[number, number], [number, number]]; // Pour régions ou polygones si pertinent
	trajectoryCoordinates?: [number, number][]; // Points clés de la trajectoire pour tracé pointillé
	pedagogicalSummary: string;
	narrativeRole: string;
	literaryAnalysis: string;
	quotation?: string;
	quotationReference?: string;
	historicalSourceNote?: string;
	characters: string[];
	steps: string[];
	themes: string[];
}

export interface PlaceCategoryMeta {
	id: GraffignyPlaceCategory;
	label: string;
	color: string;
	symbol: string;
	description: string;
}

export const GRAFFIGNY_PLACE_CATEGORIES: Record<GraffignyPlaceCategory, PlaceCategoryMeta> = {
	recit: {
		id: 'recit',
		label: 'Lieu du récit',
		color: '#8b572a', // Terre / bistre du roman
		symbol: '📍',
		description: 'Lieu expressément attesté et nommé dans le roman ou constituant une étape directe de l’action.',
	},
	historique: {
		id: 'historique',
		label: 'Repère historique',
		color: '#235284', // Bleu navigation / repère historique
		symbol: '🏛️',
		description: 'Espace historique réel utile à la compréhension du contexte politique, colonial et intellectuel du XVIIIe siècle.',
	},
	trajet: {
		id: 'trajet',
		label: 'Trajet narratif',
		color: '#4d5b66', // Gris ardoise marin
		symbol: '〰️',
		description: 'Déplacement transatlantique raconté dans les lettres, figuré de façon indicative sans prétendre reconstituer une route nautique exacte.',
	},
	incertain: {
		id: 'incertain',
		label: 'Localisation incertaine',
		color: '#b4502f', // Ocre rouge d'alerte / nuance
		symbol: '❓',
		description: 'Position géographique indicative ou symbolique : le texte ne fournit pas de coordonnées topographiques rigides.',
	},
};

export const GRAFFIGNY_MAP_CONFIG = {
	tileUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
	minZoom: 2,
	maxZoom: 18,
	defaultCenter: [15, -35] as [number, number], // Vue transatlantique reliant Andes et Europe de l'Ouest
	defaultZoom: 3,
};

export const graffignyPlaces: GraffignyPlace[] = [
	{
		id: 'temple-du-soleil',
		name: 'Le Temple du Soleil (Cuzco / Pérou inca)',
		subtitle: 'Lieu du culte originel, lieu du rapt et de la profanation',
		category: 'recit',
		status: 'atteste',
		precision: 'symbolique',
		coordinates: [-13.518, -71.978], // Coricancha à Cuzco (repère symbolique)
		pedagogicalSummary:
			'Espace sacré où Zilia vivait recluse parmi les Vierges du Soleil et devait être unie au prince royal Aza. C’est là que son univers s’effondre lors de l’irruption violente des conquistadors espagnols.',
		narrativeRole:
			'Point de départ tragique du roman (lettre I). Sanctuaire de l’univers religieux et affectif de Zilia ; sa profanation déclenche l’exil forcé. La ville de Cuzco (« Cozco ») est nommée plus loin dans le roman (lettre XXI).',
		literaryAnalysis:
			'Graffigny oppose la pureté sacrée des Vierges du Soleil à la fureur prédatrice des envahisseurs espagnols. Dès l’incipit, la notion de « barbarie » est inversée : les véritables barbares sont ceux qui massacrent et profanent au nom de l’or.',
		quotation:
			'Les pavés du Temple ensanglantés ; l’image du Soleil foulée aux pieds ; nos Vierges éperduës, fuyant devant une troupe de soldats furieux qui massacroient tout ce qui s’opposoit à leur passage...',
		quotationReference: 'lettre I',
		historicalSourceNote:
			'Le Coricancha (« enclos d’or ») de Cuzco était le grand sanctuaire du Soleil de l’Empire inca (Tahuantinsuyo), décrit notamment par Garcilaso de la Vega dans ses Commentaires royaux (1609), source historique majeure de Françoise de Graffigny. Le point cartographique est un repère mémoriel et symbolique.',
		characters: ['zilia', 'aza', 'espagnols'],
		steps: ['arrachement'],
		themes: ['cultures', 'amour', 'langue'],
	},
	{
		id: 'empire-inca',
		name: 'L’Empire inca (Tahuantinsuyo)',
		subtitle: 'Espace d’origine et horizon perdu de la civilisation andine',
		category: 'historique',
		status: 'contextuel',
		precision: 'region',
		coordinates: [-12.046, -75.0], // Centre indicatif des hautes terres andines
		pedagogicalSummary:
			'Vaste confédération précolombienne s’étendant sur les Andes (Pérou, Équateur, Bolivie, Chili actuels). Il s’agit d’une entité historique distincte des frontières des États modernes. Zilia s’en souvient comme d’une terre d’harmonie ordonnée par les lois solaires.',
		narrativeRole:
			'Cadre de référence politique, moral et affectif permanent de Zilia tout au long de sa correspondance. Même captive en Europe, elle évalue les mœurs françaises à l’aune des valeurs incas.',
		literaryAnalysis:
			'L’Empire inca fonctionne comme un contre-modèle philosophique. Face aux inégalités criantes et à l’obsession mercantile de la France d’Ancien Régime, la société inca est idéalisée comme un monde ignorant la mendicité où les fruits de la terre appartiennent à la collectivité.',
		quotation:
			'Sans avoir de l’or, il est impossible d’acquérir une portion de cette terre que la nature a donnée à tous les hommes.',
		quotationReference: 'lettre XX (1747 & 1752)',
		historicalSourceNote:
			'Dans l’« Introduction historique » ajoutée à l’édition de 1752, Graffigny documente en détail la dynastie des Incas (Manco Cápac), les quipos et les lois agraires, s’appuyant sur les récits d’historiens espagnols et français du XVIIIe siècle.',
		characters: ['zilia', 'aza'],
		steps: ['arrachement', 'observation'],
		themes: ['cultures', 'critique', 'lumieres'],
	},
	{
		id: 'traversee-atlantique',
		name: 'La traversée de l’Atlantique',
		subtitle: 'De l’enfermement maritime à la capture par Déterville',
		category: 'trajet',
		status: 'atteste',
		precision: 'trajectoire',
		coordinates: [18.0, -42.0], // Point médian indicatif de l'Océan Atlantique
		trajectoryCoordinates: [
			[-12.05, -77.15], // Côte pacifique péruvienne (Callao)
			[-55.98, -67.27], // Passage par le Cap Horn (route maritime usuelle)
			[-20.0, -35.0], // Atlantique Sud
			[5.0, -32.0], // Atlantique équatorial
			[25.0, -38.0], // Atlantique Nord
			[48.38, -4.49], // Approche du littoral atlantique français
		],
		pedagogicalSummary:
			'Long périple maritime forcé emmenant Zilia d’Amérique du Sud en France. D’abord enfermée dans la cale obscure d’un vaisseau espagnol, elle est recueillie lors d’un combat naval par le capitaine français Déterville.',
		narrativeRole:
			'Sas narratif et épreuve existentielle (lettres III à VIII). Zilia y vit privée de repères spatiaux terrestres et sans langue commune pour communiquer avec ses ravisseurs puis ses sauveteurs.',
		literaryAnalysis:
			'La traversée concrétise la rupture spatiale et culturelle. Le navire est perçu comme une terrifiante « maison flotante » ; c’est néanmoins là que s’ébauche la communication avec Déterville et que débute l’apprentissage de la langue.',
		quotation:
			'Je sçais que le nom du Cacique est Déterville, celui de notre maison flottante vaisseau, & celui de la terre où nous allons, France.',
		quotationReference: 'lettre IX (1747 & 1752)',
		historicalSourceNote:
			'Cette ligne en pointillés visualise le déplacement narratif sans prétendre reconstituer une route nautique exacte : le texte de Graffigny reste volontairement imprécis sur les étapes maritimes précises de la navigation.',
		characters: ['zilia', 'deterville', 'espagnols'],
		steps: ['traversee'],
		themes: ['regard', 'langue', 'cultures'],
	},
	{
		id: 'port-debarquement',
		name: 'Port de débarquement (façade atlantique)',
		subtitle: 'Premier contact avec le sol européen et la curiosité des foules',
		category: 'recit',
		status: 'atteste',
		precision: 'region',
		coordinates: [48.383, -4.485], // Positionnement indicatif sur la façade bretonne (rade de Brest)
		pedagogicalSummary:
			'Ville portuaire où accoste le vaisseau de Déterville (lettre X). Zilia y foule pour la première fois le sol français et découvre avec stupeur la foule européenne, l’architecture des maisons en pierre et son propre visage dans un miroir.',
		narrativeRole:
			'Première confrontation physique de Zilia avec la société française (lettres X à XII). C’est le point de départ du convoi terrestre en carrosse vers la capitale.',
		literaryAnalysis:
			'L’arrivée au port amorce le procédé du regard étranger. Les objets et coutumes les plus familiers aux Français — les miroirs, les robes ajustées, la curiosité insistante des passants — deviennent étranges sous le regard naïf et lucide de la narratrice.',
		quotation:
			'À peine étions-nous sortis de la maison flotante, que nous sommes entrés dans une ville bâtie sur le rivage de la Mer. Le peuple qui nous suivoit en foule, me paroît être de la même Nation que le Cacique...',
		quotationReference: 'lettre X (1747 & 1752)',
		historicalSourceNote:
			'Le roman ne nomme aucun port précis (« une ville bâtie sur le rivage de la Mer »). Le positionnement vers Brest est une hypothèse cartographique et contextuelle (port d’attache majeur des vaisseaux de la Marine royale au XVIIIe s.), et non une certitude textuelle.',
		characters: ['zilia', 'deterville', 'china'],
		steps: ['rencontre'],
		themes: ['regard', 'langue', 'cultures'],
	},
	{
		id: 'paris',
		name: 'Paris',
		subtitle: 'Théâtre de la haute société, des préjugés mondains et de l’apprentissage',
		category: 'recit',
		status: 'atteste',
		precision: 'ville',
		coordinates: [48.8566, 2.3522],
		pedagogicalSummary:
			'Capitale du royaume et cadre majeur de l’action en France. Zilia y séjourne dans l’hôtel de la famille Déterville, y observe le spectacle du monde, puis y revient après ses séjours à la campagne.',
		narrativeRole:
			'Lieu central du roman (lettres XIII à XXXIV). Paris est à la fois le terme du grand voyage, le lieu où Zilia apprend la langue française et le miroir grossissant des contradictions des Lumières.',
		literaryAnalysis:
			'Pour Zilia, Paris ressemble à « un univers plûtôt qu’une habitation particuliere ». Elle y dissèque la tyrannie des apparences, l’inconséquence de la noblesse, la subordination juridique des femmes et le culte exclusif de l’argent.',
		quotation:
			'Me voici enfin, mon cher Aza, dans une ville nommée Paris, c’est le terme de notre voyage, mais selon les apparences, ce ne sera pas celui de mes chagrins.',
		quotationReference: 'lettre XIII',
		historicalSourceNote:
			'Paris des années 1740–1750, cœur intellectuel des Lumières où les salons mondains (dont celui tenu par Françoise de Graffigny rue d’Enfer) commentaient avec passion les récits de voyage et la critique des mœurs.',
		characters: ['zilia', 'deterville', 'celine', 'mere', 'aine', 'china', 'maitre', 'religieux'],
		steps: ['rencontre', 'apprentissage', 'observation', 'attente'],
		themes: ['regard', 'critique', 'femmes', 'langue', 'lumieres'],
	},
	{
		id: 'couvent-parisien',
		name: 'La maison religieuse (couvent parisien)',
		subtitle: 'Lieu de relégation familiale et espace d’étude philosophique',
		category: 'recit',
		status: 'atteste',
		precision: 'incertain',
		coordinates: [48.847, 2.342], // Quartier du faubourg Saint-Jacques / Montagne Sainte-Geneviève (indicatif)
		pedagogicalSummary:
			'Maison religieuse où Madame Déterville enferme autoritairement sa fille cadette Céline et Zilia. Loin d’y étouffer, Zilia y poursuit son instruction intellectuelle, apprend l’écriture avec un maître et découvre la bibliothèque.',
		narrativeRole:
			'Cadre de l’émancipation intellectuelle (lettres XIX à XXVII). C’est depuis ce lieu de réclusion et à travers les grilles du parloir que Zilia rédige sa première lettre en français et que Déterville lui avoue son amour.',
		literaryAnalysis:
			'Le lieu illustre la violence sociale des familles nobles d’Ancien Régime sacrifiant les cadets pour préserver la fortune de l’aîné. Paradoxalement, ce lieu d’enfermement devient pour Zilia une cellule d’émancipation où elle conquiert le savoir et l’autonomie de pensée.',
		quotation:
			'À mesure que j’en ai acquis l’intelligence, un nouvel univers s’est offert à mes yeux. Les objets ont pris une autre forme, chaque éclaircissement m’a découvert un nouveau malheur.',
		quotationReference: 'lettre XVIII (1747 & 1752)',
		historicalSourceNote:
			'Le mot « couvent » n’est pas employé par Graffigny, qui utilise les termes d’époque : « maison Religieuse », « cette retraite », « nos Vierges » ou « le parloir ». Aucune adresse parisienne n’étant spécifiée dans le texte, l’ancrage cartographique dans le quartier conventuel de la montagne Sainte-Geneviève reste purement indicatif.',
		characters: ['zilia', 'celine', 'mere', 'maitre', 'deterville', 'religieux'],
		steps: ['apprentissage', 'observation'],
		themes: ['femmes', 'langue', 'critique', 'lumieres'],
	},
	{
		id: 'domaine-campagne',
		name: 'La maison de campagne (domaine de Zilia)',
		subtitle: 'Sanctuaire de l’indépendance matérielle, du « plaisir d’être » et de la liberté',
		category: 'recit',
		status: 'atteste',
		precision: 'incertain',
		coordinates: [48.78, 2.25], // Environs immédiats de Paris (zone indicative sud-ouest)
		pedagogicalSummary:
			'Propriété champêtre acquise pour Zilia grâce à la vente des trésors d’or du Temple du Soleil que Déterville lui a fidèlement restitués (« la chaise de l’Inca s’est transformée en maison »). Elle s’y retire définitivement après la trahison d’Aza.',
		narrativeRole:
			'Lieu du dénouement et accomplissement moral (lettres XXXII à XXXVIII de 1747 ; XXXV à XLI de 1752). Le domaine offre à Zilia le statut de propriétaire indépendante lui permettant de refuser le mariage.',
		literaryAnalysis:
			'Ce lieu rompt avec le dénouement conventionnel du roman féminin du XVIIIe siècle : ni mariage forcé, ni mort, ni enfermement au couvent. Zilia y établit un espace de retraite philosophique fondé sur le « plaisir d’être », la bibliothèque et la libre pensée.',
		quotation:
			'Le plaisir d’être ; ce plaisir oublié, ignoré même de tant d’aveugles humains ; cette pensée si douce, ce bonheur si pur, je suis, je vis, j’existe, pourroit seul rendre heureux, si l’on s’en souvenoit, si l’on en jouissoit, si l’on en connoissoit le prix.',
		quotationReference: 'lettre XXXVIII (1747) / XLI (1752)',
		historicalSourceNote:
			'Située à une courte distance de Paris (« le voyage ne fut pas long » le matin en carrosse, lettre XXXII). Le domaine est acheté avec les fonds propres de Zilia (l’or du Temple vendu par Déterville). La localisation périurbaine est indicative, Graffigny ne désignant aucune commune précise.',
		characters: ['zilia', 'deterville', 'celine', 'aza'],
		steps: ['attente', 'denouement'],
		themes: ['amour', 'femmes', 'lumieres', 'critique'],
	},
	{
		id: 'espagne-cour',
		name: 'L’Espagne et la cour de Madrid',
		subtitle: 'Espace de l’assimilation d’Aza, du renoncement religieux et de la trahison',
		category: 'historique',
		status: 'contextuel',
		precision: 'ville',
		coordinates: [40.4168, -3.7038], // Madrid
		pedagogicalSummary:
			'Royaume européen des conquistadors où le prince royal Aza est transféré, reçu à la cour, converti au catholicisme et fiancé à une jeune aristocrate espagnole.',
		narrativeRole:
			'Horizon lointain d’où provient la nouvelle du reniement d’Aza (lettres XXV, XXXV, XXXVI). Aza repart en Espagne consommer son mariage, scellant la rupture avec Zilia.',
		literaryAnalysis:
			'L’Espagne représente dans le roman le triomphe de l’assimilation coloniale et de l’inconstance masculine. Alors que Zilia captive en France préserve son intégrité morale et sa fidélité à ses serments, Aza capitule devant les honneurs et les dogmes européens.',
		quotation:
			'c’est la bonne foi violée, c’est l’amour méprisé qui déchire mon ame. Aza est infidéle.',
		quotationReference: 'lettre XXXV (1752 : XXXVIII)',
		historicalSourceNote:
			'Métropole coloniale de l’Empire espagnol sous les Bourbons d’Espagne (Philippe V puis Ferdinand VI), détenant le monopole du commerce et de la conquête des Indes occidentales.',
		characters: ['aza', 'espagnole', 'espagnols'],
		steps: ['attente', 'denouement'],
		themes: ['amour', 'cultures'],
	},
	{
		id: 'malte-ile',
		name: 'L’île de Malte (Ordre de Malte)',
		subtitle: 'Refuge de l’exil chevaleresque de Déterville',
		category: 'recit',
		status: 'atteste',
		precision: 'region',
		coordinates: [35.8989, 14.5146], // La Valette / Malte
		pedagogicalSummary:
			'Île de Méditerranée où Déterville se retire pour fuir la douleur de son amour sans espoir pour Zilia lors de l’arrivée annoncée d’Aza.',
		narrativeRole:
			'Destintation des lettres XXXIV à XXXVII de Zilia (« À Malthe »). Déterville y attend le dénouement avant de revenir à Paris et auprès de Zilia.',
		literaryAnalysis:
			'L’ordre de Malte (auquel Déterville est destiné en tant que fils cadet par les vœux imposés par sa mère) est un symbole des contraintes familiales aristocratiques d’Ancien Régime qui brisent les désirs individuels au profit du patrimoine de l’aîné.',
		quotation:
			'Ne cherchez point, Monsieur, à surmonter les obstacles qui vous retiennent à Malthe, pour revenir ici.',
		quotationReference: 'lettre XXXVI (1752 : XXXIX)',
		historicalSourceNote:
			'L’Ordre souverain militaire hospitalier de Saint-Jean de Jérusalem (Chevaliers de Malte) était sous l’Ancien Régime le débouché traditionnel des cadets de la noblesse française.',
		characters: ['deterville', 'zilia'],
		steps: ['attente', 'denouement'],
		themes: ['amour', 'femmes'],
	},
];
