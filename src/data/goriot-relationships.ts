// Modèle de données pour les relations entre les personnages du Père Goriot d’Honoré de Balzac (1835)
// Destiné aux lycéens (classe de seconde) : rigueur philologique, citations vérifiées,
// distinction explicite entre faits narratifs avérés et interprétations critiques.

export type GoriotRelationshipCategory =
	| 'family'
	| 'love'
	| 'financial'
	| 'influence'
	| 'solidarity'
	| 'conflict'
	| 'domestic';

export interface GoriotCategoryMeta {
	id: GoriotRelationshipCategory;
	label: string;
	description: string;
	color: string;
	dash?: string;
	arrow?: 'end' | 'both';
}

export const goriotRelCategories: Record<GoriotRelationshipCategory, GoriotCategoryMeta> = {
	family: {
		id: 'family',
		label: 'Famille et filiation',
		description: 'Paternité passionnée, filiation ingrate, mariages d’intérêt et parenté aristocratique.',
		color: '#8b5a2b',
		arrow: 'end',
	},
	love: {
		id: 'love',
		label: 'Amour et séduction',
		description: 'Liaisons mondaines, passion adultère, calcul sentimental et prédation galante.',
		color: '#be185d',
		arrow: 'both',
	},
	financial: {
		id: 'financial',
		label: 'Argent et dépendance',
		description: 'Dettes de jeu, spoliation de dot, sacrifices financiers extrêmes et usure.',
		color: '#b45309',
		dash: '4 3',
		arrow: 'end',
	},
	influence: {
		id: 'influence',
		label: 'Société et influence',
		description: 'Parrainage aristocratique, code d’initiation cynique et ambition d’ascension.',
		color: '#1e4b88',
		dash: '5 3',
		arrow: 'end',
	},
	solidarity: {
		id: 'solidarity',
		label: 'Amitié et solidarité',
		description: 'Soutien moral, fraternité d’étudiants, assistance médicale et fidélité désintéressée.',
		color: '#15803d',
		arrow: 'both',
	},
	conflict: {
		id: 'conflict',
		label: 'Conflit et manipulation',
		description: 'Tentations machiavéliques, rivalités, police secrète, chantage et trahison.',
		color: '#7f1d1d',
		dash: '6 4',
		arrow: 'end',
	},
	domestic: {
		id: 'domestic',
		label: 'Logement et quotidien',
		description: 'Cohabitation à la pension Vauquer, gestion de pensionnat et service domestique.',
		color: '#52525b',
		dash: '2 3',
		arrow: 'end',
	},
};

export interface GoriotClusterZone {
	x: number;
	y: number;
	w: number;
	h: number;
	rx?: number;
}

export interface GoriotStructuralCluster {
	id: string;
	type: 'core' | 'satellite' | 'peripheral';
	label: string;
	subtitle: string;
	tag: string;
	description: string;
	nodeIds: string[];
	attachmentPointNodeIds: string[];
	attachmentEdgeIds: string[];
	dRect: GoriotClusterZone;
	mRect: GoriotClusterZone;
}

export interface GoriotCharacterData {
	id: string;
	label: string;
	usageName: string;
	caption: string;
	eyebrow: string;
	meta: string[];
	socialRole: string;
	description: string;
	keyFacts: string[];
	quote?: {
		text: string;
		context: string;
		reference: string;
	};
	color: string;
	tier: 'major' | 'standard' | 'minor';
	// Classification relationnelle objective dans le réseau
	clusterId: 'core' | 'satellite-restaud' | 'satellite-taillefer' | 'satellite-delateurs' | 'satellite-domesticite' | 'peripheral-nucingen';
	structuralRole: string;
	// Centre de la carte dans les canevas bureau (x, y) et mobile (mx, my) : voir goriotMapLayout
	x: number;
	y: number;
	mx: number;
	my: number;
}

export type NarrativeStage = 'stage-1' | 'stage-2' | 'stage-3' | 'stage-4';

export interface NarrativeStageMeta {
	id: NarrativeStage;
	num: number;
	title: string;
	partName: string;
	synopsis: string;
}

export const goriotNarrativeStages: NarrativeStageMeta[] = [
	{
		id: 'stage-1',
		num: 1,
		title: '1. Une pension bourgeoise',
		partName: 'Novembre 1819',
		synopsis: 'Présentation de la pension Vauquer, découverte du mystère de Goriot et premiers pas timides de Rastignac dans les salons.',
	},
	{
		id: 'stage-2',
		num: 2,
		title: '2. L’Entrée dans le monde',
		partName: 'Décembre 1819',
		synopsis: 'Leçons de cynisme de Mme de Beauséant, pacte criminel proposé par Vautrin et conquête de Delphine de Nucingen.',
	},
	{
		id: 'stage-3',
		num: 3,
		title: '3. Trompe-la-Mort',
		partName: 'Janvier 1820',
		synopsis: 'Duel de Taillefer arrangé par Vautrin, arrestation du bagnard par la police et installation de Rastignac rue d’Artois.',
	},
	{
		id: 'stage-4',
		num: 4,
		title: '4. La Mort du père',
		partName: 'Février 1820',
		synopsis: 'Crise financière des filles, agonie solitaire de Goriot, obsèques délaissées et défi final lancé à Paris.',
	},
];

export interface GoriotRelationshipData {
	id: string;
	source: string;
	target: string;
	category: GoriotRelationshipCategory;
	label: string;
	shortSummary: string;
	description: string;
	asymmetric: boolean;
	directionLabel?: string; // ex. "Goriot sacrifie tout pour ses filles"
	firstEstablishedStage: NarrativeStage; // Étape d'introduction dans le récit
	certainty: 'certitude_historique' | 'deduction_solide' | 'interpretation_critique';
	textualQuote?: {
		text: string;
		speaker?: string;
		reference: string;
	};
	narrativeContext: string;
	// Rendu SVG : courbure de l'arête (écart du milieu, à gauche du sens
	// source → cible ; mBend pour le mobile) et position préférée de
	// l'étiquette (0 → source, 1 → cible). L'étiquette est ensuite placée
	// automatiquement sans chevauchement.
	bend?: number;
	mBend?: number;
	labelT?: number;
}

/** Dimensions des canevas bureau et mobile (unités des coordonnées x/y et mx/my). */
export const goriotMapLayout = {
	desktop: { width: 1040, height: 1062 },
	mobile: { width: 690, height: 1385 },
	/** Cartouche « L’Échiquier social balzacien » (bureau uniquement). */
	anchor: { x: 870, y: 762 },
} as const;

export const goriotStructuralClusters: GoriotStructuralCluster[] = [
	{
		id: 'core',
		type: 'core',
		label: 'Noyau relationnel central',
		subtitle: 'Rastignac, Goriot, Delphine, Vautrin et leurs appuis directs',
		tag: 'Noyau',
		description:
			'Le centre névralgique du drame : Rastignac et Goriot au cœur des passions et des sacrifices, rejoints par Delphine et Vautrin comme tentations et moteurs d’ascension, et entourés de leurs confidents directs (Horace Bianchon, Mme de Beauséant et Mme Vauquer).',
		nodeIds: ['rastignac', 'goriot', 'delphine', 'vautrin', 'bianchon', 'mme-vauquer', 'mme-de-beauseant'],
		attachmentPointNodeIds: [],
		attachmentEdgeIds: [],
		dRect: { x: 16, y: 248, w: 1008, h: 574, rx: 16 },
		mRect: { x: 10, y: 344, w: 667, h: 681, rx: 10 },
	},
	{
		id: 'satellite-restaud',
		type: 'satellite',
		label: 'Satellite Restaud',
		subtitle: 'Faubourg Saint-Germain · Aristocratie déchue',
		tag: 'Satellite',
		description:
			'Ménage aristocratique uni par un mariage de dot et déchiré par les dettes de jeu de l’amant d’Anastasie, Maxime de Trailles, pour lequel elle engage les biens du foyer. Ce satellite se rattache au noyau par le sacrifice paternel et les dons financiers extrêmes de Jean-Joachim Goriot.',
		nodeIds: ['anastasie', 'comte-restaud'],
		attachmentPointNodeIds: ['goriot'],
		attachmentEdgeIds: ['goriot-anastasie', 'goriot-daughters-financial'],
		dRect: { x: 16, y: 16, w: 432, h: 218, rx: 10 },
		mRect: { x: 248, y: 18, w: 204, h: 251, rx: 10 },
	},
	{
		id: 'satellite-domesticite',
		type: 'satellite',
		label: 'Satellite Domesticité',
		subtitle: 'Pension Vauquer · Le service humble',
		tag: 'Satellite',
		description:
			'Les deux serviteurs de la pension Vauquer, unis par le travail domestique quotidien et les rumeurs de la table d’hôte. Bien qu’employés par Mme Vauquer, ils se rattachent au drame central du noyau par la compassion désintéressée et la présence fidèle de Christophe au convoi funèbre de Goriot.',
		nodeIds: ['christophe', 'sylvie'],
		attachmentPointNodeIds: ['goriot'],
		attachmentEdgeIds: ['christophe-goriot-loyalty'],
		dRect: { x: 462, y: 16, w: 288, h: 218, rx: 10 },
		mRect: { x: 27, y: 19, w: 204, h: 218, rx: 10 },
	},
	{
		id: 'satellite-taillefer',
		type: 'satellite',
		label: 'Satellite Taillefer',
		subtitle: 'Chaussée-d’Antin · L’héritage spolié',
		tag: 'Satellite',
		description:
			'Père et fille séparés par le déshéritement de Victorine au profit de son frère. Ce groupe s’articule au noyau par deux points pivots distincts : l’affection candide de Victorine pour Eugène de Rastignac à la pension, et l’attentat en duel commandité par Vautrin contre le frère pour contraindre le père à faire de Victorine son héritière.',
		nodeIds: ['victorine', 'm-taillefer'],
		attachmentPointNodeIds: ['rastignac', 'vautrin'],
		attachmentEdgeIds: ['victorine-rastignac', 'vautrin-taillefer-crime'],
		dRect: { x: 360, y: 836, w: 664, h: 210, rx: 10 },
		mRect: { x: 241, y: 1109, w: 406, h: 223, rx: 10 },
	},
	{
		id: 'satellite-delateurs',
		type: 'satellite',
		label: 'Satellite Délateurs',
		subtitle: 'Pension Vauquer · Le complot policier',
		tag: 'Satellite',
		description:
			'Duo de pensionnaires impliqué dans l’arrestation de Jacques Collin : Mlle Michonneau négocie la prime de 3 000 francs et administre le narcotique, secondée passivement par Poiret. Ce satellite se rattache au noyau par la délation policière ciblant Vautrin.',
		nodeIds: ['michonneau', 'poiret'],
		attachmentPointNodeIds: ['vautrin'],
		attachmentEdgeIds: ['michonneau-vautrin-police'],
		dRect: { x: 16, y: 836, w: 330, h: 210, rx: 10 },
		mRect: { x: 10, y: 1132, w: 204, h: 230, rx: 10 },
	},
	{
		id: 'peripheral-nucingen',
		type: 'peripheral',
		label: 'Périphérie Nucingen',
		subtitle: 'Haute finance · Baron de Nucingen',
		tag: 'Périphérie',
		description:
			'Grand banquier d’affaires qui engage la dot de Delphine dans des opérations financières risquées, tout en limitant les sommes dont elle peut disposer personnellement. Dans le réseau du roman, il forme un sommet périphérique (degré 1) rattaché uniquement à Delphine de Nucingen, ses manœuvres s’exerçant à distance du drame de la pension.',
		nodeIds: ['baron-nucingen'],
		attachmentPointNodeIds: ['delphine'],
		attachmentEdgeIds: ['delphine-baron-nucingen'],
		dRect: { x: 764, y: 16, w: 260, h: 218, rx: 10 },
		mRect: { x: 473, y: 77, w: 204, h: 110, rx: 10 },
	},
];

export const goriotCharacters: GoriotCharacterData[] = [
	// 1. Eugène de Rastignac (Nœud central)
	{
		id: 'rastignac',
		label: 'Eugène de Rastignac',
		usageName: 'Eugène de Rastignac',
		caption: '21 ans · étudiant ambitieux',
		eyebrow: 'L’ambitieux provincial · apprentissage du monde',
		meta: ['21 ans', 'gentilhomme charentais', 'étudiant en droit'],
		socialRole: 'Noble provincial pauvre monté à Paris pour réussir. Il sert de fil conducteur et d’observateur du drame social.',
		description:
			'Venu de sa province charentaise pour faire son droit, Eugène découvre que le travail universitaire ne mène à rien sans protecteurs ni argent. Écartelé entre la voix morale de Bianchon, les leçons de cynisme aristocratique de Mme de Beauséant et les tentations criminelles de Vautrin, il choisit d’entrer dans la bataille en devenant l’amant de Delphine de Nucingen tout en restant, jusqu’à la fosse de Goriot, le seul cœur compatissant.',
		keyFacts: [
			'S’installe à la pension Vauquer en 1819 pour y vivre à moindres frais pendant ses études de droit (Partie 1).',
			'Commis un premier faux pas mondain chez la comtesse de Restaud en évoquant le père Goriot (Partie 1).',
			'Initié aux lois féroces du grand monde par sa cousine la vicomtesse de Beauséant (Partie 1).',
			'Refuse de s’associer au meurtre planifié par Vautrin mais emprunte de l’argent à sa famille pour conquérir Paris (Parties 2 et 3).',
			'Veille Goriot mourant avec Bianchon et paye ses obsèques au Père-Lachaise avant de défier Paris (Partie 4).',
		],
		quote: {
			text: 'À nous deux maintenant !',
			context: 'Défie la haute société parisienne depuis les hauteurs du Père-Lachaise après l’inhumation de Goriot.',
			reference: 'Conclusion du Père Goriot',
		},
		color: '#1d4ed8',
		tier: 'major',
		clusterId: 'core',
		structuralRole: 'Noyau relationnel central (7 relations directes)',
		x: 380,
		y: 632,
		mx: 226,
		my: 800,
	},

	// 2. Jean-Joachim Goriot (Père Goriot - Nœud central)
	{
		id: 'goriot',
		label: 'Jean-Joachim Goriot',
		usageName: 'Le père Goriot',
		caption: '69 ans · ancien vermicellier',
		eyebrow: 'Le « Christ de la paternité » · martyr filial',
		meta: ['69 ans', 'ancien commerçant en blé enrichi sous la Révolution', 'veuf'],
		socialRole: 'Ancien artisan enrichi par le commerce du blé pendant la disette révolutionnaire, dépouillé par la passion de ses filles.',
		description:
			'Ancien maître vermicellier et président de section sous la Révolution, il a amassé une immense fortune consacrée entièrement à l’établissement de ses deux filles dans l’aristocratie et la haute banque. Rejeté par ses gendres dès qu’il a cessé de payer, il descend d’étage en étage à la pension Vauquer, vendant son argenterie et ses dernières rentes pour subvenir aux folies financières de ses enfants, jusqu’à mourir dans un dénuement absolu.',
		keyFacts: [
			'Dote magnifiquement ses deux filles, Anastasie et Delphine, en leur transmettant l’essentiel de sa fortune de négociant (Parties 1 et 3).',
			'Descend de la pension Vauquer du 1er étage (appartement bourgeois) au 3e étage (chambre d’indigent).',
			'Vend clandestinement son couvert d’argent et ses rentes viagères pour solder les dettes de ses filles (Partie 1).',
			'Aménage la garçonnière de la rue d’Artois pour réunir Eugène et Delphine (Partie 3).',
			'Agonise dans l’abandon sans qu’aucune de ses deux filles ne vienne avant son dernier souffle (Partie 4).',
		],
		quote: {
			text: 'Mes filles, c’était mon vice à moi ; elles étaient mes maîtresses, enfin tout !',
			context: 'Confession fiévreuse sur son lit de mort devant Eugène et Bianchon.',
			reference: 'Quatrième partie (« La Mort du père »)',
		},
		color: '#8b5a2b',
		tier: 'major',
		clusterId: 'core',
		structuralRole: 'Noyau relationnel central (6 relations directes)',
		x: 390,
		y: 327,
		mx: 236,
		my: 410,
	},

	// 3. Anastasie de Restaud
	{
		id: 'anastasie',
		label: 'Anastasie de Restaud',
		usageName: 'La comtesse de Restaud',
		caption: 'comtesse · fille aînée de Goriot',
		eyebrow: 'Fille aînée de Goriot · noblesse d’Empire et dettes amoureuses',
		meta: ['fille aînée de Jean-Joachim Goriot', 'épouse du comte de Restaud'],
		socialRole: 'Femme du monde titrée entrée dans la haute noblesse grâce à sa dot, déchirée par la passion ruineuse d’un dandy.',
		description:
			'Fille aînée de Goriot, fière et ambitieuse, elle épouse le comte de Restaud pour s’agréger à l’aristocratie. Passionnément éprise du dandy Maxime de Trailles, elle engloutit la fortune du ménage et engage les diamants de la famille pour payer les dettes de son amant. Elle n’arrive au chevet de son père que quelques instants après sa mort, anéantie par le remords.',
		keyFacts: [
			'Éconduit brutalement Rastignac après qu’il a mentionné le nom de Goriot dans son salon (Partie 1).',
			'Engage les diamants du comte pour payer les dettes de jeu de Maxime de Trailles (Partie 4).',
			'Vient arracher à son père mourant les douze mille francs exigés par Gobseck (Partie 4).',
			'Arrive trop tard auprès du corps de Goriot pour obtenir son pardon vivant (Partie 4).',
		],
		color: '#be185d',
		tier: 'standard',
		clusterId: 'satellite-restaud',
		structuralRole: 'Satellite Restaud (rattaché au père Goriot)',
		x: 205,
		y: 196,
		mx: 350,
		my: 215,
	},

	// 4. Delphine de Nucingen
	{
		id: 'delphine',
		label: 'Delphine de Nucingen',
		usageName: 'La baronne de Nucingen',
		caption: 'baronne · fille cadette de Goriot',
		eyebrow: 'Fille cadette de Goriot · haute finance et soif du grand monde',
		meta: ['fille cadette de Jean-Joachim Goriot', 'épouse du baron de Nucingen'],
		socialRole: 'Épouse d’un puissant banquier alsacien, prisonnière d’un mariage d’affaires et avide d’être reçue dans le faubourg Saint-Germain.',
		description:
			'Fille cadette de Goriot mariée au riche banquier alsacien baron de Nucingen, Delphine souffre d’être recluse dans la bourgeoisie de la Chaussée-d’Antin sans pouvoir franchir les portes du faubourg Saint-Germain. Délaissée par son mari qui engage sa dot dans des opérations financières risquées et limite ses ressources personnelles, elle prend Eugène de Rastignac pour amant et s’appuie sur son père pour aménager leur intimité.',
		keyFacts: [
			'Rencontre Eugène au Théâtre des Italiens dans sa loge (Partie 2).',
			'Envoie Eugène risquer ses derniers 100 francs à la roulette du Palais-Royal (Partie 2).',
			'Se dispute violemment avec sa sœur Anastasie devant leur père épuisé au sujet de leurs dettes (Partie 4).',
			'Préfère aller danser au bal de Mme de Beauséant plutôt que de veiller son père agonisant (Partie 4).',
		],
		color: '#be185d',
		tier: 'major',
		clusterId: 'core',
		structuralRole: 'Noyau relationnel central (4 relations directes)',
		x: 870,
		y: 327,
		mx: 575,
		my: 590,
	},

	// 5. Vautrin (Jacques Collin)
	{
		id: 'vautrin',
		label: 'Vautrin (Jacques Collin)',
		usageName: 'Vautrin',
		caption: '40 ans · forçat évadé',
		eyebrow: 'Le tentateur diabolique · génie criminel',
		meta: ['40 ans', 'dit Trompe-la-Mort', 'ancien bagnard évadé'],
		socialRole: 'Pensionnaire mystérieux et jovial de Mme Vauquer, dissimulant sous son masque le chef du bagne et un redoutable analyste social.',
		description:
			'Bagnard évadé d’une prodigieuse force intellectuelle et physique, Vautrin observe la société avec un cynisme absolu : la loi n’est pour lui qu’une convention hypocrite au service des riches. Voyant en Rastignac un jeune homme doué mais freiné par des scrupules, il tente de le persuader d’accepter un pacte criminel : faire tuer le jeune Frédéric Taillefer en duel par un tiers pour que Victorine hérite, Eugène s’engageant en retour à lui reverser une part de la dot.',
		keyFacts: [
			'Dispense à Eugène dans le jardin de la pension sa théorie fameuse des deux routes vers la fortune (Partie 2).',
			'Tente de convaincre Eugène de s’associer au meurtre arrangé de Frédéric Taillefer, puis le drogue pour l’empêcher d’avertir la famille (Parties 2 et 3).',
			'Fait exécuter le meurtre en duel près de Clignancourt par son affidé le colonel Franchessini sans le consentement d’Eugène (Partie 3).',
			'Démasqué et trahi par Mlle Michonneau (secondée passivement par Poiret) après avoir été drogué au narcotique (Partie 3).',
			'Arrêté spectaculairement par la police de Gondureau dans la salle à manger de la pension (Partie 3).',
		],
		quote: {
			text: 'Savez-vous ce qu’il faut à Paris ? Une fortune rapide ou le génie. […] Il faut entrer dans cette masse d’hommes comme un boulet de canon, ou s’y glisser comme une peste.',
			context: 'Leçon dispensée à Rastignac dans le jardin de la pension Vauquer.',
			reference: 'Deuxième partie (« L’Entrée dans le monde »)',
		},
		color: '#7f1d1d',
		tier: 'major',
		clusterId: 'core',
		structuralRole: 'Noyau relationnel central (3 relations directes)',
		x: 185,
		y: 757,
		mx: 112,
		my: 975,
	},

	// 6. Victorine Taillefer
	{
		id: 'victorine',
		label: 'Victorine Taillefer',
		usageName: 'Victorine Taillefer',
		caption: 'fille déshéritée · pensionnaire',
		eyebrow: 'La jeune fille rejetée · victime innocente des calculs',
		meta: ['fille naturelle ou répudiée de M. Taillefer', 'loge à la pension Vauquer'],
		socialRole: 'Jeune fille innocente et pieuse spoliée de son héritage légitime par son père banquier au profit de son frère.',
		description:
			'Rejetée impitoyablement par son père milliardaire qui refuse de la reconnaître pour concentrer sa fortune sur son fils légitime, Victorine vit pauvrement à la pension Vauquer sous la garde de sa cousine Mme Couture. Elle s’éprend secrètement d’Eugène, devenant sans le savoir l’enjeu de la conspiration criminelle échafaudée par Vautrin.',
		keyFacts: [
			'Repoussée chaque année lorsqu’elle supplie son père de la recevoir (Partie 1).',
			'Nourrit des sentiments discrets et reconnaissants envers Rastignac (Partie 2).',
			'Rappelée d’urgence par son père devenu brutalement orphelin après la mort de son fils en duel (Partie 3).',
		],
		color: '#a16207',
		tier: 'standard',
		clusterId: 'satellite-taillefer',
		structuralRole: 'Satellite Taillefer (rattaché à Rastignac et Taillefer)',
		x: 860,
		y: 932,
		mx: 545,
		my: 1170,
	},

	// 7. Madame Vauquer
	{
		id: 'mme-vauquer',
		label: 'Madame Vauquer',
		usageName: 'Mme Vauquer',
		caption: 'née de Conflans · tenancière',
		eyebrow: 'Tenancière vénale · incarnation de la pension',
		meta: ['environ 50 ans', 'veuve', 'propriétaire de la pension bourgeoise'],
		socialRole: 'Petite-bourgeoise mesquine exploitant la misère de ses pensionnaires et calculant sans cesse son profit.',
		description:
			'Tenancière de la pension bourgeoise de la rue Neuve-Sainte-Geneviève, elle mesure sa bienveillance à l’épaisseur du portefeuille de ses locataires. Après avoir vainement espéré épouser le père Goriot à son arrivée lorsqu’il était encore aisé, elle se venge de son désintérêt en propageant les pires calomnies sur son compte dès qu’il s’appauvrit.',
		keyFacts: [
			'Flatte d’abord Goriot dans l’espoir de l’épouser, le croyant richissime (Partie 1).',
			'Accable Goriot de mépris et de mesquineries domestiques dès qu’il descend aux étages supérieurs (Partie 1).',
			'Perd ses pensionnaires après l’arrestation de Vautrin et le départ d’Eugène (Parties 3 et 4).',
			'Refuse de prêter un linceul propre pour le corps de Goriot sans paiement d’avance (Partie 4).',
		],
		color: '#78350f',
		tier: 'standard',
		clusterId: 'core',
		structuralRole: 'Noyau relationnel · Témoin direct (Rastignac et Goriot)',
		x: 545,
		y: 442,
		mx: 375,
		my: 540,
	},

	// 8. Sylvie
	{
		id: 'sylvie',
		label: 'Sylvie',
		usageName: 'Sylvie',
		caption: 'cuisinière de la pension',
		eyebrow: 'Domesticité rude · regard terre-à-terre de la cuisine',
		meta: ['cuisinière de la pension Vauquer', 'témoin domestique'],
		socialRole: 'Cuisinière de condition modeste, complice des potins et des jugements sommaires de la table d’hôte.',
		description:
			'Grosse cuisinière de Mme Vauquer, elle prépare la nourriture médiocre servie aux pensionnaires et relaie les bruits de couloir sur les visites nocturnes des filles de Goriot, qu’elle prend au départ pour des maîtresses entretenues.',
		keyFacts: [
			'Partage les préjugés de sa maîtresse sur Goriot et ses « visiteuses » (Partie 1).',
			'Gère le service ordinaire de la pension aux côtés de Christophe (Partie 1).',
		],
		color: '#52525b',
		tier: 'minor',
		clusterId: 'satellite-domesticite',
		structuralRole: 'Satellite Domesticité (rattaché à Christophe)',
		x: 655,
		y: 66,
		mx: 112,
		my: 72,
	},

	// 9. Christophe
	{
		id: 'christophe',
		label: 'Christophe',
		usageName: 'Christophe',
		caption: 'garçon de peine',
		eyebrow: 'Garçon de peine · fidélité populaire sincère',
		meta: ['frotteur et garçon de peine', 'origine campagnarde'],
		socialRole: 'Domestique subalterne de la pension, seul avec Rastignac à manifester une pitié désintéressée pour Goriot.',
		description:
			'Garçon de peine et homme à tout faire de Mme Vauquer. Bien que rudoyé au quotidien, il témoigne d’une humanité spontanée et accompagne fidèlement le cercueil de Goriot jusqu’à la fosse commune du Père-Lachaise avec Rastignac.',
		keyFacts: [
			'Porte les commissions secrètes de Goriot chez les orfèvres et usuriers (Parties 1 et 2).',
			'Aide à porter et veiller le corps du vieillard dans sa chambre mansardée (Partie 4).',
			'Assiste au convoi funèbre à l’église Saint-Étienne-du-Mont et au cimetière (Partie 4).',
		],
		color: '#52525b',
		tier: 'minor',
		clusterId: 'satellite-domesticite',
		structuralRole: 'Satellite Domesticité (rattaché au père Goriot)',
		x: 540,
		y: 182,
		mx: 112,
		my: 200,
	},

	// 10. Horace Bianchon (noté aussi Bianchon, une seule entité)
	{
		id: 'bianchon',
		label: 'Horace Bianchon',
		usageName: 'Horace Bianchon',
		caption: 'étudiant en médecine · probité laborieuse',
		eyebrow: 'L’ami fidèle · éthique de la science et probité',
		meta: ['étudiant en médecine à l’Hôtel-Dieu', 'ami d’Eugène'],
		socialRole: 'Futur grand médecin de La Comédie humaine, il incarne l’honnêteté, le travail scientifique régulier et le bon sens moral.',
		description:
			'Camarade d’études d’Eugène, externe à l’Hôtel-Dieu, Bianchon représente la voie du labeur et de la probité morale à l’opposé des raccourcis cyniques de Vautrin. Toujours prêt à rendre service, c’est lui qui pose le diagnostic médical de l’apoplexie séreuse de Goriot, veille le mourant et aide Eugène à régler les frais médicaux.',
		keyFacts: [
			'Prend ses repas à la pension Vauquer tout en poursuivant ses études hospitalières (Partie 1).',
			'Discute au Luxembourg avec Eugène du paradoxe moral du mandarin de Rousseau/Chateaubriand (Partie 2).',
			'Soigne Goriot avec dévouement durant sa longue agonie (Partie 4).',
		],
		quote: {
			text: 'Eh bien ! je ne veux pas tuer le mandarin. […] Pas de mandarin !',
			context: 'Refus catégorique du crime commis par simple volonté lors de la promenade au Luxembourg.',
			reference: 'Deuxième partie (« L’Entrée dans le monde »)',
		},
		color: '#15803d',
		tier: 'major',
		clusterId: 'core',
		structuralRole: 'Noyau relationnel · Appui direct (Rastignac et Goriot)',
		x: 170,
		y: 492,
		mx: 112,
		my: 575,
	},

	// 11. La vicomtesse de Beauséant
	{
		id: 'mme-de-beauseant',
		label: 'Mme de Beauséant',
		usageName: 'La vicomtesse de Beauséant',
		caption: 'cousine d’Eugène · reine du faubourg',
		eyebrow: 'L’arbitre du grand monde · école du cynisme aristocratique',
		meta: ['Claire de Bourgogne', 'vicomtesse', 'parente de Rastignac'],
		socialRole: 'Souveraine des salons les plus fermés du faubourg Saint-Germain, elle ouvre à Rastignac les portes de la haute société.',
		description:
			'Cousine d’Eugène par la branche des Marcillac, Mme de Beauséant règne sans partage sur l’aristocratie légitimiste. Blessée à mort par la trahison de son amant le marquis d’Ajuda-Pinto qui l’abandonne pour épouser Mlle de Rochefide, elle donne à Eugène le mode d’emploi impitoyable du Paris mondain avant de quitter la capitale pour la solitude de la Normandie.',
		keyFacts: [
			'Ouvre son hôtel de la rue de Grenelle à Rastignac et lui donne ses conseils d’ascension (Partie 1).',
			'Lui conseille de séduire Delphine de Nucingen pour exciter la jalousie des femmes (Partie 1).',
			'Subit stoïquement l’humiliation de son abandon au cours de son grand bal d’adieu (Partie 4).',
		],
		quote: {
			text: 'Plus froidement vous calculerez, plus avant vous irez. Frappez sans pitié, vous serez craint. Ne voyez dans les hommes et dans les femmes que des chevaux de poste que vous laisserez crever à chaque relais.',
			context: 'Leçon dispensée à Eugène rue de Grenelle après son échec chez Mme de Restaud.',
			reference: 'Première partie (« Une pension bourgeoise »)',
		},
		color: '#1e4b88',
		tier: 'major',
		clusterId: 'core',
		structuralRole: 'Noyau relationnel · Parrainage direct (Rastignac et Delphine)',
		x: 870,
		y: 642,
		mx: 563,
		my: 970,
	},

	// 12. Le baron de Nucingen
	{
		id: 'baron-nucingen',
		label: 'Le baron de Nucingen',
		usageName: 'Le baron de Nucingen',
		caption: 'grand banquier d’affaires',
		eyebrow: 'La haute banque · spéculation et pouvoir financier',
		meta: ['Delphine est son épouse', 'originaire d’Alsace', 'pair de France ultérieur'],
		socialRole: 'Grand banquier de la Chaussée-d’Antin représentant la puissance moderne de l’argent et du capitalisme émergent.',
		description:
			'Grand banquier d’origine alsacienne, le baron de Nucingen a épousé Delphine pour sa dot. Expert en manœuvres de haute banque, il engage la dot de son épouse dans des opérations financières risquées, tout en limitant les sommes dont elle peut disposer personnellement.',
		keyFacts: [
			'Engage la dot de Delphine dans des opérations risquées et restreint ses dépenses personnelles (Parties 2 et 4).',
			'Accepte avec cynisme la liaison de Delphine et Rastignac tant qu’elle ne nuit pas à ses affaires (Partie 3).',
			'Refuse de payer les frais de secours de son beau-père agonisant (Partie 4).',
		],
		color: '#b45309',
		tier: 'standard',
		clusterId: 'peripheral-nucingen',
		structuralRole: 'Personnage périphérique (rattaché à Delphine)',
		x: 894,
		y: 125,
		mx: 575,
		my: 140,
	},

	// 13. Le comte de Restaud
	{
		id: 'comte-restaud',
		label: 'Le comte de Restaud',
		usageName: 'Le comte de Restaud',
		caption: 'grand seigneur d’Empire',
		eyebrow: 'Aristocrate rigide · sauvegarde du patrimoine familial',
		meta: ['époux d’Anastasie de Restaud', 'noble d’Empire'],
		socialRole: 'Gentilhomme autoritaire attaché à son rang et à la transmission de son nom, découvrant la ruine morale de son foyer.',
		description:
			'Aristocrate fier et distant, il a accepté d’épouser la roturière Anastasie Goriot pour sa dot colossale. Découvrant que son épouse le trompe avec Maxime de Trailles et a vendu les diamants de la famille, il prend des mesures notariales draconiennes pour sauver la part successorale de son fils aîné, seul enfant légitime avéré à ses yeux.',
		keyFacts: [
			'Ferme la porte de son hôtel particulier à Eugène après la mention inconvenante de Goriot (Partie 1).',
			'Découvre avec effroi l’engagement des diamants auprès de Gobseck (Partie 4).',
			'Contraint Anastasie à lui céder le contrôle absolu de ses biens par testament (Partie 4).',
		],
		color: '#475569',
		tier: 'standard',
		clusterId: 'satellite-restaud',
		structuralRole: 'Satellite Restaud (rattaché à Anastasie)',
		x: 138,
		y: 64,
		mx: 350,
		my: 72,
	},

	// 14. Monsieur Taillefer
	{
		id: 'm-taillefer',
		label: 'Monsieur Taillefer',
		usageName: 'M. Taillefer',
		caption: 'riche banquier sans pitié',
		eyebrow: 'Père indigne · capitaliste coupable',
		meta: ['banquier', 'ancien complice de meurtre (selon Vautrin)', 'père de Victorine'],
		socialRole: 'Banquier millionnaire de la Chaussée-d’Antin, coupable d’un crime impuni sous la Révolution et père dénaturé.',
		description:
			'Ancien fournisseur aux armées enrichi, il refuse obstinément de doter ou de voir sa fille Victorine pour concentrer toute sa succession sur son fils unique Frédéric. Son obstination aveugle en fait la cible indirecte du complot de Vautrin : la mort de son fils en duel le laisse sans héritier masculin et l’oblige à rappeler Victorine.',
		keyFacts: [
			'Rejette sans pitié les visites et lettres de sa fille Victorine (Partie 1).',
			'Perd son fils unique tué en duel par le colonel Franchessini (Partie 3).',
			'Rappelle Victorine au sein de son hôtel particulier pour en faire son unique héritière (Partie 3).',
		],
		color: '#475569',
		tier: 'minor',
		clusterId: 'satellite-taillefer',
		structuralRole: 'Satellite Taillefer (rattaché à Vautrin et Victorine)',
		x: 500,
		y: 932,
		mx: 335,
		my: 1295,
	},

	// 15. Poiret
	{
		id: 'poiret',
		label: 'Poiret',
		usageName: 'Poiret',
		caption: 'ancien employé mécanique',
		eyebrow: 'L’automate administratif · obéissance servile',
		meta: ['retraité de l’administration', 'pensionnaire'],
		socialRole: 'Ancien employé de bureau terne et machinal, dénué d’initiative propre, complice passif et suiveur de Mlle Michonneau.',
		description:
			'Vieil homme sans volonté propre dont l’esprit a été vidé par quarante ans de routine bureaucratique, il répète servilement les propos d’autrui. Entraîné par Mlle Michonneau au Jardin des Plantes, il assiste aux tractations avec l’agent Gondureau, aide matériellement à déboutonner et retourner Vautrin endormi sans avoir pris l’initiative du complot.',
		keyFacts: [
			'Prend ses repas à la pension Vauquer dans une passivité et une neutralité absolues (Partie 1).',
			'Accompagne Mlle Michonneau au Jardin des Plantes et acquiesce machinalement aux propositions de la police (Partie 3).',
			'Aide Michonneau à manipuler le corps de Vautrin drogué pour vérifier la marque d’infamie (Partie 3).',
			'Chassé de la pension aux côtés de Michonneau sous les huées collectives des pensionnaires (Partie 3).',
		],
		color: '#64748b',
		tier: 'minor',
		clusterId: 'satellite-delateurs',
		structuralRole: 'Satellite Délateurs (rattaché à Michonneau)',
		x: 150,
		y: 1012,
		mx: 112,
		my: 1325,
	},

	// 16. Mademoiselle Michonneau
	{
		id: 'michonneau',
		label: 'Mademoiselle Michonneau',
		usageName: 'Mlle Michonneau',
		caption: 'vieille fille intrigante',
		eyebrow: 'La délatrice vénale · indicatrice de police',
		meta: ['vieille fille austère', 'pensionnaire'],
		socialRole: 'Pensionnaire aigrie et vénale, actrice principale de la délation de Vautrin auprès de la police secrète pour mille écus.',
		description:
			'Vieille fille au regard froid hébergée au troisième étage de la pension Vauquer. Contactée par la police secrète (Gondureau / Bibi-Lupin), c’est elle qui mène les pourparlers, exige et obtient la prime de 3 000 francs (mille écus), verse elle-même le breuvage narcotique dans la tasse de Vautrin et lui applique la gifle révélatrice sur l’épaule.',
		keyFacts: [
			'Négocie fermement avec le chef de police Gondureau la prime de 3 000 francs pour livrer Jacques Collin (Partie 3).',
			'Verse le narcotique dans la tasse de café de Vautrin à la table de la pension (Partie 3).',
			'Assène le coup sur l’épaule de Vautrin inanimé pour faire réapparaître les lettres « T.F. » du bagne (Partie 3).',
			'Exclue violemment de la table d’hôte sous les insultes et l’indignation des pensionnaires (Partie 3).',
		],
		color: '#7f1d1d',
		tier: 'standard',
		clusterId: 'satellite-delateurs',
		structuralRole: 'Satellite Délateurs (rattaché à Vautrin)',
		x: 150,
		y: 892,
		mx: 112,
		my: 1195,
	},
];

export const goriotRelationships: GoriotRelationshipData[] = [
	// --- FAMILLE ET FILIATION ---
	{
		id: 'goriot-anastasie',
		source: 'goriot',
		target: 'anastasie',
		category: 'family',
		label: 'amour paternel sacrificiel',
		shortSummary: 'Goriot se dépouille pour sa fille aînée qui ne vient qu’après sa mort.',
		description:
			'Goriot idolâtre sa fille aînée Anastasie, à qui il a constitué une dot pour soutenir ses ambitions aristocratiques et son entrée dans la haute noblesse par son mariage avec le comte de Restaud. Devenue comtesse, Anastasie a honte des manières populaires de son père et ne vient le voir en cachette que pour lui réclamer de l’argent destiné à couvrir les dettes de jeu de son amant Maxime de Trailles. Elle n’arrive au chevet de Goriot que quelques instants après son dernier soupir.',
		asymmetric: true,
		directionLabel: 'Goriot idolâtre → Anastasie l’exploite puis s’en repent trop tard',
		firstEstablishedStage: 'stage-1',
		certainty: 'certitude_historique',
		textualQuote: {
			text: 'Mon père avait tout donné. Je lui ai causé tant de maux ! […] J’ai vendu le dernier morceau d’argent de mon père, et il a dû mourir en pensant que je ne l’aimais pas !',
			speaker: 'Anastasie de Restaud',
			reference: 'Quatrième partie (« La Mort du père »)',
		},
		narrativeContext: 'Révélé dès la première partie et confirmé par la scène déchirante de l’agonie au chapitre final.',
		bend: 15,
		mBend: -20,
	},
	{
		id: 'goriot-delphine',
		source: 'goriot',
		target: 'delphine',
		category: 'family',
		label: 'passion paternelle absolue',
		shortSummary: 'Goriot meuble le nid d’amour de sa cadette qui lui préfère un bal.',
		description:
			'Père fasciné par la beauté de Delphine, Goriot épuise ses dernières rentes viagères pour lui louer et meubler la garçonnière de la rue d’Artois, rêvant d’habiter la mansarde au-dessus pour veiller sur son bonheur avec Rastignac. Alors qu’il agonise, Delphine choisit de danser au bal de Mme de Beauséant plutôt que de rester à son chevet.',
		asymmetric: true,
		directionLabel: 'Goriot se sacrifie → Delphine accepte ses sacrifices mais danse pendant son agonie',
		firstEstablishedStage: 'stage-1',
		certainty: 'certitude_historique',
		textualQuote: {
			text: 'Ah ! c’est moi qui suis l’auteur de ta joie, comme je suis l’auteur de tes jours.',
			speaker: 'Jean-Joachim Goriot',
			reference: 'Troisième partie (« Trompe-la-Mort »)',
		},
		narrativeContext: 'Établi tout au long du récit, depuis la vente des couverts jusqu’à la garçonnière de la rue d’Artois.',
		mBend: 50,
	},
	{
		id: 'anastasie-comte-restaud',
		source: 'comte-restaud',
		target: 'anastasie',
		category: 'family',
		label: 'mariage d’alliance & crise',
		shortSummary: 'Mariage nobiliaire brisé par les dettes d’amant et le mensonge.',
		description:
			'Courtisée pour sa beauté par le comte de Restaud, grand seigneur d’Empire, Anastasie a été dotée par son père pour satisfaire ses penchants aristocratiques. Le couple se déchire lorsque le comte découvre sa liaison avec Maxime de Trailles et la vente clandestine des diamants de famille, obligeant Restaud à dicter des conditions impitoyables pour préserver son nom.',
		asymmetric: false,
		firstEstablishedStage: 'stage-1',
		certainty: 'certitude_historique',
		textualQuote: {
			text: 'Vous me paierez cher cette trahison, madame ! s’écria le comte.',
			speaker: 'Le comte de Restaud',
			reference: 'Quatrième partie (« La Mort du père »)',
		},
		narrativeContext: 'Exposé dès la visite d’Eugène à l’hôtel de la rue du Helder, puis révélé lors de la spoliation finale des diamants.',
	},
	{
		id: 'delphine-baron-nucingen',
		source: 'baron-nucingen',
		target: 'delphine',
		category: 'family',
		label: 'mariage & dépendance financière',
		shortSummary: 'Le banquier engage la dot de Delphine dans ses affaires et limite ses ressources.',
		description:
			'Mariage et dépendance financière. Le baron de Nucingen engage la dot de Delphine dans des opérations financières risquées, tout en limitant les sommes dont elle peut disposer personnellement par une pension étroite, ce qui pousse sa femme à chercher des secours auprès de son père et d’Eugène.',
		asymmetric: true,
		directionLabel: 'Nucingen restreint les ressources de sa femme → Delphine cherche ailleurs l’affection et l’appui que son mariage ne lui apporte pas',
		firstEstablishedStage: 'stage-2',
		certainty: 'certitude_historique',
		narrativeContext: 'Détaillé par Delphine à Eugène lors de leurs confidences au Palais-Royal et rue Saint-Lazare.',
	},
	{
		id: 'rastignac-beauseant-family',
		source: 'mme-de-beauseant',
		target: 'rastignac',
		category: 'family',
		label: 'cousine aristocratique',
		shortSummary: 'Parenté noble charentaise ouvrant à Rastignac les salons de Grenelle.',
		description:
			'Par la famille de sa tante Marcillac, Eugène est cousin au second degré de Claire de Bourgogne, vicomtesse de Beauséant. Ce lien du sang est le précieux sésame qui permet au provincial pauvre d’être reçu dans le plus illustre salon du faubourg Saint-Germain.',
		asymmetric: false,
		firstEstablishedStage: 'stage-1',
		certainty: 'certitude_historique',
		narrativeContext: 'Motif initial qui décide Eugène à écrire à sa famille pour obtenir sa lettre de recommandation.',
		bend: 22,
	},
	{
		id: 'm-taillefer-victorine',
		source: 'm-taillefer',
		target: 'victorine',
		category: 'family',
		label: 'paternité indigne & déshéritement',
		shortSummary: 'Le père millionnaire déshérite sa fille au profit exclusif de son fils.',
		description:
			'M. Taillefer refuse de reconnaître et d’aider sa fille Victorine, l’abandonnant à la pauvreté de la pension Vauquer pour réserver l’intégralité de sa fortune à son fils unique Frédéric, jusqu’à ce que le meurtre de ce dernier en duel le contraigne à la rappeler.',
		asymmetric: true,
		directionLabel: 'Le père rejette durement → Victorine pleure et pardonne',
		firstEstablishedStage: 'stage-1',
		certainty: 'certitude_historique',
		narrativeContext: 'Présenté dès l’ouverture du roman comme l’injustice sociale révoltante de la pension.',
	},

	// --- AMOUR ET SÉDUCTION ---
	{
		id: 'rastignac-delphine',
		source: 'rastignac',
		target: 'delphine',
		category: 'love',
		label: 'liaison mondaine & passion partagée',
		shortSummary: 'D’abord calculée, leur liaison devient un amour passionné et réciproque.',
		description:
			'Sur le conseil de Mme de Beauséant et avec la complicité de Goriot, Eugène aborde Delphine par ambition mondaine (« passion de commande »). Toutefois, le roman montre que cette conquête se mue rapidement en un attachement sincère et une véritable passion sensuelle : Eugène est comblé par les dévouements et les voluptés de la baronne, tandis que Delphine trouve en lui le protecteur généreux et l’amant attentif qui lui manquait face au mépris de son époux.',
		asymmetric: false,
		firstEstablishedStage: 'stage-2',
		certainty: 'certitude_historique',
		textualQuote: {
			text: 'Mon Eugène, si vous saviez ce que j’ai souffert ! […] Vous êtes mon seul espoir.',
			speaker: 'Delphine de Nucingen',
			reference: 'Deuxième partie (« L’Entrée dans le monde »)',
		},
		narrativeContext: 'Commence au Théâtre des Italiens, s’affirme rue Saint-Lazare et se concrétise rue d’Artois.',
		bend: -25,
	},
	{
		id: 'victorine-rastignac',
		source: 'victorine',
		target: 'rastignac',
		category: 'love',
		label: 'amour secret & candide',
		shortSummary: 'Victorine aime Eugène en secret, qui ne voit en elle qu’une amie.',
		description:
			'Victorine Taillefer s’éprend silencieusement d’Eugène de Rastignac, touchée par ses égards et son élégance. Bien qu’Eugène ait pitié d’elle, il repousse les projets de mariage criminel suggérés par Vautrin et n’éprouve pour la jeune fille qu’une fraternelle compassion sans désir amoureux.',
		asymmetric: true,
		directionLabel: 'Victorine aime sincèrement → Eugène compatit sans retour amoureux',
		firstEstablishedStage: 'stage-2',
		certainty: 'certitude_historique',
		narrativeContext: 'Développé au fil des dîners de la pension Vauquer et des confidences dans le salon.',
	},

	// --- ARGENT ET DÉPENDANCE ---
	{
		id: 'goriot-rastignac-money',
		source: 'goriot',
		target: 'rastignac',
		category: 'financial',
		label: 'soutien & appartement d’Artois',
		shortSummary: 'Goriot finance l’installation d’Eugène pour le bonheur de sa fille.',
		description:
			'Goriot achète les meubles et paie le bail de la garçonnière d’Eugène rue d’Artois afin de faciliter ses rencontres avec Delphine. En retour, Eugène emprunte de l’argent pour payer les médicaments, le médecin et les funérailles de Goriot abandonné par ses gendres.',
		asymmetric: true,
		directionLabel: 'Goriot meuble la garçonnière → Eugène paye l’agonie et les obsèques',
		firstEstablishedStage: 'stage-3',
		certainty: 'certitude_historique',
		narrativeContext: 'Aménagement de la garçonnière au chapitre III, puis dépenses de la maladie au chapitre IV.',
	},
	{
		id: 'rastignac-delphine-money',
		source: 'delphine',
		target: 'rastignac',
		category: 'financial',
		label: 'dépendance & roulette (Palais-Royal)',
		shortSummary: 'Eugène gagne 7 000 F net au jeu pour délivrer Delphine de ses dettes.',
		description:
			'Dépourvue d’argent liquide par son mari, Delphine confie ses derniers 100 francs à Eugène pour tenter la roulette au n° 9 du Palais-Royal. Eugène mise sur le 21 (son âge) puis sur le rouge, accumulant 7 200 francs. Après avoir laissé 10 louis (200 francs) de pourboire, il remet 7 000 francs net à Delphine : celle-ci en garde 6 000 francs pour rembourser de Marsay et remet les 1 000 francs restants à Eugène.',
		asymmetric: false,
		firstEstablishedStage: 'stage-2',
		certainty: 'certitude_historique',
		textualQuote: {
			text: 'Risquez les cent francs à un jeu qu’on nomme la roulette, et perdez tout, ou rapportez-moi six mille francs.',
			speaker: 'Delphine de Nucingen',
			reference: 'Deuxième partie (« L’Entrée dans le monde »)',
		},
		narrativeContext: 'Scène clé de la seconde partie où Eugène découvre le lien sordide entre luxe et faillite privée.',
		bend: 40,
	},
	{
		id: 'goriot-daughters-financial',
		source: 'goriot',
		target: 'anastasie',
		category: 'financial',
		label: 'ruine complète & argenterie tordue',
		shortSummary: 'Goriot vend son dernier métal précieux pour payer Gobseck.',
		description:
			'Pour sauver Anastasie poursuivie par l’usurier Gobseck pour les dettes de Maxime de Trailles, Goriot va jusqu’à tordre lui-même son écuelle d’argent la nuit à la pension pour en vendre le lingot, puis engage ses dernières rentes viagères.',
		asymmetric: true,
		directionLabel: 'Goriot sacrifie ses dernières rentes → Anastasie engloutit l’argent chez Gobseck',
		firstEstablishedStage: 'stage-1',
		certainty: 'certitude_historique',
		narrativeContext: 'Surpris par Eugène au début du roman roulant son argenterie en pâte d’argent vermeil.',
		bend: -65,
		mBend: -35,
	},

	// --- SOCIÉTÉ ET INFLUENCE ---
	{
		id: 'beauseant-rastignac-cynisme',
		source: 'mme-de-beauseant',
		target: 'rastignac',
		category: 'influence',
		label: 'initiation & code du cynisme',
		shortSummary: 'La vicomtesse enseigne à Eugène comment frapper sans pitié.',
		description:
			'Mme de Beauséant dispense à Rastignac une redoutable éducation mondaine : elle lui révèle le drame des filles de Goriot et lui ordonne de traiter les femmes comme des chevaux de poste à crever à chaque relais pour parvenir au sommet.',
		asymmetric: true,
		directionLabel: 'Mme de Beauséant instruit et parraine → Eugène écoute et applique',
		firstEstablishedStage: 'stage-1',
		certainty: 'certitude_historique',
		textualQuote: {
			text: 'Traitez ce monde comme il le mérite. Vous voulez parvenir, je vous aiderai.',
			speaker: 'La vicomtesse de Beauséant',
			reference: 'Première partie (« Une pension bourgeoise »)',
		},
		narrativeContext: 'Entretien décisif à l’hôtel de Beauséant après la gaffe commise chez Mme de Restaud.',
		bend: -22,
		mBend: -32,
	},
	{
		id: 'beauseant-delphine-snobisme',
		source: 'mme-de-beauseant',
		target: 'delphine',
		category: 'influence',
		label: 'mépris aristocratique & invitation',
		shortSummary: 'Delphine prête à tout pour entrer dans le salon de Beauséant.',
		description:
			'Mme de Beauséant méprise la bourgeoisie financière incarnée par Mme de Nucingen. Rastignac réussit pourtant le tour de force d’obtenir pour Delphine une invitation au bal d’adieu de la vicomtesse, réalisant le rêve suprême de la baronne au prix d’une défaite humaine déchirante.',
		asymmetric: true,
		directionLabel: 'Beauséant méprise puis condescend à inviter → Delphine idolâtre le salon',
		firstEstablishedStage: 'stage-1',
		certainty: 'certitude_historique',
		textualQuote: {
			text: 'Madame de Nucingen laperait toute la boue qu’il y a entre la rue Saint-Lazare et la rue de Grenelle pour entrer dans mon salon.',
			speaker: 'La vicomtesse de Beauséant',
			reference: 'Première partie (« Une pension bourgeoise »)',
		},
		narrativeContext: 'Motivation maîtresse qui pousse Delphine à se lier à Eugène pour forcer le verrou du noble faubourg.',
	},

	// --- AMITIÉ ET SOLIDARITÉ ---
	{
		id: 'rastignac-bianchon',
		source: 'rastignac',
		target: 'bianchon',
		category: 'solidarity',
		label: 'amitié d’étudiants & contrepoint moral',
		shortSummary: 'Bianchon incarne la probité et soigne Goriot avec Eugène.',
		description:
			'Horace Bianchon est l’ami fraternel et loyal d’Eugène. Il écoute ses cas de conscience (le mandarin), veille Goriot jusqu’à son dernier souffle, pose le diagnostic médical et prête ses propres économies pour aider Eugène à ensevelir le vieillard.',
		asymmetric: false,
		firstEstablishedStage: 'stage-1',
		certainty: 'certitude_historique',
		narrativeContext: 'Présent dès la table d’hôte de la pension, au Luxembourg pour le mandarin et au chevet de mort de Goriot.',
	},
	{
		id: 'bianchon-goriot-care',
		source: 'bianchon',
		target: 'goriot',
		category: 'solidarity',
		label: 'soins médicaux dévoués',
		shortSummary: 'L’externe en médecine soigne gratuitement le vieillard à l’agonie.',
		description:
			'Bien qu’il n’ait aucun lien familial avec Goriot, l’étudiant en médecine Bianchon prodigue des soins constants, applique des cataplasmes et veille le malade à l’agonie par pure déontologie humaine et amitié pour Eugène.',
		asymmetric: true,
		directionLabel: 'Bianchon soigne et veille → Goriot reçoit ses soins avec gratitude',
		firstEstablishedStage: 'stage-4',
		certainty: 'certitude_historique',
		narrativeContext: 'Quatrième partie entière lors de la crise d’apoplexie séreuse.',
	},
	{
		id: 'christophe-goriot-loyalty',
		source: 'christophe',
		target: 'goriot',
		category: 'solidarity',
		label: 'pitié & convoi funèbre',
		shortSummary: 'Le garçon de peine est le seul avec Eugène à suivre le cercueil.',
		description:
			'Le pauvre garçon de peine Christophe accomplit avec cœur les besognes du mourant, aide à le laver et l’accompagne jusqu’au cimetière du Père-Lachaise, offrant une leçon d’humanité humble face à la désertion des filles riches.',
		asymmetric: false,
		firstEstablishedStage: 'stage-1',
		certainty: 'certitude_historique',
		narrativeContext: 'Courses de commission puis enterrement à Saint-Étienne-du-Mont et au Père-Lachaise.',
	},

	// --- CONFLIT ET MANIPULATION ---
	{
		id: 'vautrin-rastignac',
		source: 'vautrin',
		target: 'rastignac',
		category: 'conflict',
		label: 'tentation machiavélique & pacte',
		shortSummary: 'Vautrin propose à Eugène un pacte criminel qu’il refuse d’accomplir.',
		description:
			'Vautrin tente d’enrôler Eugène dans un pacte diabolique et criminel : faire éliminer Frédéric Taillefer par un spadassin pour que Victorine recueille l’héritage, en échange d’un tribut de 100 000 francs prélevé sur la dot. Si Eugène refuse catégoriquement d’assassiner et veut avertir le père Taillefer, Vautrin le narcotise au vin de Bordeaux pour exécuter le plan sans son consentement.',
		asymmetric: true,
		directionLabel: 'Vautrin tente et manipule → Eugène refuse le crime mais est neutralisé',
		firstEstablishedStage: 'stage-2',
		certainty: 'certitude_historique',
		textualQuote: {
			text: 'Mon petit, je vous propose un marché que personne ne refuserait. […] Vous m’épouserez mademoiselle Victorine Taillefer qui aura des millions.',
			speaker: 'Vautrin (Jacques Collin)',
			reference: 'Deuxième partie (« L’Entrée dans le monde »)',
		},
		narrativeContext: 'La grande scène de tentation dans le jardinet de la pension Vauquer.',
	},
	{
		id: 'vautrin-taillefer-crime',
		source: 'vautrin',
		target: 'm-taillefer',
		category: 'conflict',
		label: 'meurtre du fils en duel',
		shortSummary: 'Vautrin fait tuer Frédéric Taillefer en duel par le colonel Franchessini.',
		description:
			'Passant outre les scrupules d’Eugène qu’il a préalablement endormi, Vautrin fait exécuter son projet : son affidé le colonel Franchessini provoque en duel le fils unique Frédéric Taillefer et le blesse mortellement au front près de Clignancourt, réalisant l’attentat planifié.',
		asymmetric: true,
		directionLabel: 'Vautrin fait assassiner le fils → M. Taillefer est frappé par le meurtre',
		firstEstablishedStage: 'stage-3',
		certainty: 'certitude_historique',
		narrativeContext: 'Exécution du meurtre au début de la troisième partie.',
	},
	{
		id: 'michonneau-vautrin-police',
		source: 'michonneau',
		target: 'vautrin',
		category: 'conflict',
		label: 'délation vénale à la police',
		shortSummary: 'Mlle Michonneau drogue et livre Trompe-la-Mort pour 3 000 francs.',
		description:
			'Pour toucher la prime promise de 3 000 francs (mille écus), Mlle Michonneau administre un narcotique à Vautrin à son insu, puis lui frappe l’épaule pour faire rougir la marque « T.F. » du bagne, avant de signaler la présence du forçat aux policiers embusqués.',
		asymmetric: true,
		directionLabel: 'Michonneau négocie, drogue et dénonce → Vautrin est arrêté',
		firstEstablishedStage: 'stage-3',
		certainty: 'certitude_historique',
		narrativeContext: 'Négociations au Jardin des Plantes et scène d’empoisonnement à la pension.',
	},
	{
		id: 'michonneau-poiret-complicity',
		source: 'michonneau',
		target: 'poiret',
		category: 'conflict',
		label: 'manipulation & complicité policière',
		shortSummary: 'Michonneau instrumentalise le docile Poiret pour couvrir sa délation.',
		description:
			'Mlle Michonneau utilise la naïveté et la servilité bureaucratique de Poiret pour l’associer aux entrevues policières et le faire participer au retournement de Vautrin endormi. Poiret obéit sans initiative propre, devenant solidaire de la déchéance morale de sa compagne.',
		asymmetric: true,
		directionLabel: 'Michonneau mène le complot → Poiret obéit machinalement',
		firstEstablishedStage: 'stage-3',
		certainty: 'certitude_historique',
		narrativeContext: 'Scène du Jardin des Plantes et départ forcé de la pension.',
	},

	// --- LOGEMENT ET QUOTIDIEN ---
	{
		id: 'vauquer-goriot-pension',
		source: 'mme-vauquer',
		target: 'goriot',
		category: 'domestic',
		label: 'séduction déçue & calomnies',
		shortSummary: 'Mme Vauquer flirte avec Goriot puis le calomnie dès qu’il s’appauvrit.',
		description:
			'À l’arrivée de Goriot en 1813, Mme Vauquer tente de le séduire dans l’espoir d’un mariage bourgeois doré. Rebutée par l’indifférence du vieillard obsédé par ses filles, elle se venge avec acrimonie en le rabaissant dès qu’il décline financièrement.',
		asymmetric: true,
		directionLabel: 'Mme Vauquer convoite puis méprise → Goriot endure stoïquement',
		firstEstablishedStage: 'stage-1',
		certainty: 'certitude_historique',
		narrativeContext: 'Genèse de la pension exposée dans la première partie.',
	},
	{
		id: 'vauquer-pensionnaires-housing',
		source: 'mme-vauquer',
		target: 'rastignac',
		category: 'domestic',
		label: 'pensionnaire logé à l’étage',
		shortSummary: 'Rastignac loue une chambre pauvre au troisième étage de la pension.',
		description:
			'Mme Vauquer loge Rastignac dans une chambre modeste sous les combles pour quarante-cinq francs par mois, observant avec méfiance ses rentrées tardives et son linge mondain.',
		asymmetric: true,
		directionLabel: 'Vauquer loge et surveille → Rastignac loge pour économiser',
		firstEstablishedStage: 'stage-1',
		certainty: 'certitude_historique',
		narrativeContext: 'Cadre de vie quotidien du faubourg Saint-Marceau.',
	},
	{
		id: 'sylvie-christophe-service',
		source: 'sylvie',
		target: 'christophe',
		category: 'domestic',
		label: 'domesticité ordinaire de la pension',
		shortSummary: 'Cuisinière et garçon de peine assurant le service d’en bas.',
		description:
			'Sylvie et Christophe constituent le binôme de service de la pension Vauquer : elle règne sur la cuisine et les cancans, lui fait le feu, cire les bottes et porte les fardeaux.',
		asymmetric: false,
		firstEstablishedStage: 'stage-1',
		certainty: 'certitude_historique',
		narrativeContext: 'Tableaux de la vie quotidienne de la pension Vauquer.',
	},
];

// --------------------------------------------------------------------------
// Parcours guidés prédéfinis pour le lycéen
// --------------------------------------------------------------------------
export interface GuidedTrack {
	id: string;
	title: string;
	subtitle: string;
	description: string;
	focusNodeIds: string[];
	highlightRelIds: string[];
}

export const goriotGuidedTracks: GuidedTrack[] = [
	{
		id: 'famille-goriot',
		title: '1. La famille Goriot',
		subtitle: 'Le martyre du père et la vanité des deux filles',
		description:
			'Observez comment Jean-Joachim Goriot sacrifie ses rentes, son argenterie et sa santé pour élever ses filles dans la noblesse (Anastasie de Restaud) et la haute banque (Delphine de Nucingen), jusqu’à mourir dans un dénuement complet.',
		focusNodeIds: ['goriot', 'anastasie', 'delphine', 'comte-restaud', 'baron-nucingen'],
		highlightRelIds: ['goriot-anastasie', 'goriot-delphine', 'anastasie-comte-restaud', 'delphine-baron-nucingen', 'goriot-daughters-financial'],
	},
	{
		id: 'ascension-rastignac',
		title: '2. L’ascension de Rastignac',
		subtitle: 'Les tentations, les initiateurs et l’apprentissage du monde',
		description:
			'Suivez le jeune étudiant provincial pris entre trois modèles : la probité du travail médical avec Bianchon, le cynisme élégant de sa cousine Mme de Beauséant et la révolte criminelle de Vautrin, avant son défi final sur la tombe de Goriot.',
		focusNodeIds: ['rastignac', 'mme-de-beauseant', 'vautrin', 'bianchon', 'delphine'],
		highlightRelIds: ['beauseant-rastignac-cynisme', 'vautrin-rastignac', 'rastignac-bianchon', 'rastignac-delphine', 'rastignac-beauseant-family'],
	},
	{
		id: 'argent-dependances',
		title: '3. L’argent et les dépendances',
		subtitle: 'Dettes d’amants, dots captées et sacrifices extrêmes',
		description:
			'Explorez la mécanique financière du roman : pourquoi l’argent détruit les liens familiaux, comment les diamants des Restaud et la dot des Nucingen deviennent des instruments de chantage, et comment la roulette du Palais-Royal sauve provisoirement un ménage.',
		focusNodeIds: ['goriot', 'anastasie', 'delphine', 'baron-nucingen', 'rastignac'],
		highlightRelIds: ['goriot-daughters-financial', 'rastignac-delphine-money', 'delphine-baron-nucingen', 'goriot-rastignac-money', 'anastasie-comte-restaud'],
	},
	{
		id: 'pension-vauquer',
		title: '4. La pension Vauquer',
		subtitle: 'Le microcosme des déclassés et la trahison de Vautrin',
		description:
			'Découvrez les secrets et les rancœurs de la pension de la rue Neuve-Sainte-Geneviève : la cupidité de Mme Vauquer, l’idylle secrète de Victorine, la machination policière contre Vautrin et l’ultime fidélité du garçon de peine Christophe.',
		focusNodeIds: ['mme-vauquer', 'vautrin', 'victorine', 'michonneau', 'poiret', 'christophe', 'sylvie'],
		highlightRelIds: ['vauquer-goriot-pension', 'michonneau-vautrin-police', 'michonneau-poiret-complicity', 'vautrin-taillefer-crime', 'christophe-goriot-loyalty', 'sylvie-christophe-service'],
	},
];
