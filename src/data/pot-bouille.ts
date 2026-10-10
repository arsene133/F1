import type { EdgeType, MapNode, MapRelationship } from '../components/relationship-map/types';

// ==========================================================================
// Données de la page Pot-Bouille d'Émile Zola (/pot-bouille)
// Roman des mœurs bourgeoises et des coulisses du 28, rue de Choiseul (1882).
// Les coordonnées sont définies pour le bureau (layout 900 × 560)
// et pour le mobile (mobileLayout 360 × 740).
// ==========================================================================

export const potBouilleCharacters: MapNode[] = [
	// --- CENTRE : OCTAVE MOURET ---
	{
		id: 'mouret',
		label: 'Octave Mouret',
		caption: '22 ans · commis ambitieux',
		eyebrow: 'L’ambitieux provincial · conquête par les femmes',
		meta: ['22 ans', 'originaire de Plassans', 'commis puis directeur associé'],
		description:
			"Jeune provincial séduisant et calculateur débarquant à Paris. Logé au quatrième étage du 28, rue de Choiseul, il travaille au magasin de nouveautés « Au Bonheur des Dames ». Résolu à réussir, il fait des femmes de l'immeuble l'instrument privilégié de son apprentissage social avant de conquérir le grand commerce.",
		points: [
			'S’installe à Paris grâce à l’appui de son compatriote Campardon (ch. I)',
			'Séduit successivement Marie Pichon (ch. IV), Valérie Vabre (ch. IX) et Berthe (ch. XII)',
			'Découvert en flagrant délit par Auguste Vabre aidé de Rachel (ch. XIV), déclenchant le grand scandale de l’immeuble (ch. XV)',
			'Épouse finalement Mme Hédouin pour prendre la tête du magasin (ch. XVIII)',
		],
		color: '#1d4ed8',
		tier: 'major',
		x: 450,
		y: 250,
		mx: 180,
		my: 210,
	},

	// --- FOYER JOSSERAND (Quatrième étage sur rue) ---
	{
		id: 'berthe',
		label: 'Berthe Josserand',
		caption: 'épouse d’Auguste Vabre',
		eyebrow: 'Éduquée pour le mariage d’apparence · maîtresse d’Octave',
		meta: ['fille cadette des Josserand', 'mariée à Auguste Vabre'],
		description:
			"Dressée par sa mère au quatrième étage pour capturer un mari bourgeois fortuné, elle épouse Auguste Vabre sans amour et s'installe à l'entresol. Confrontée à l’avarice de son mari et à l’absence de la dot promise, elle se laisse séduire par Octave Mouret avant que le scandale n’éclate.",
		points: [
			'Chasse au mari orchestrée par sa mère lors des soirées du mardi (ch. III)',
			'Épouse Auguste avec la promesse mensongère d’une dot de 50 000 francs (ch. VIII)',
			'Cède aux avances d’Octave et devient sa maîtresse au quatrième étage (ch. XII–XIII)',
			'Surprise en flagrant délit au quatrième étage et chassée en chemise (ch. XIV), au cœur du scandale (ch. XV), puis réconciliée avec Auguste pour sauver les apparences (ch. XVIII)',
		],
		color: '#be185d',
		tier: 'major',
		x: 260,
		y: 220,
		mx: 76,
		my: 290,
	},
	{
		id: 'mme-josserand',
		label: 'Mme Josserand',
		caption: 'Éléonore · mère impérieuse',
		eyebrow: 'Matriarche acharnée · culte des apparences',
		meta: ['née Bachelard', 'épouse de M. Josserand'],
		description:
			"Mère tyrannique obsédée par le rang social et les apparences de respectabilité. Elle mène une chasse impitoyable aux gendres pour caser ses filles Berthe et Hortense, tout en méprisant son mari qu'elle accable de reproches incessants.",
		points: [
			'Organise des réceptions mondaines ruineuses pour séduire les prétendants (ch. III)',
			'Négocie le mariage de Berthe en promettant une dot fictive de 50 000 francs (ch. VI–VIII)',
			'Pousse sa fille à la coquetterie et ferme les yeux sur ses dépenses inconsidérées (ch. X)',
			'Refuse d’accueillir Berthe après le scandale sans calcul d’honneur, puis arrange la réconciliation (ch. XV–XVIII)',
		],
		color: '#9f1239',
		tier: 'standard',
		x: 105,
		y: 130,
		mx: 76,
		my: 380,
	},
	{
		id: 'm-josserand',
		label: 'M. Josserand',
		caption: 'caissier · père épuisé',
		eyebrow: 'Employé honnête · victime du luxe familial',
		meta: ['caissier à la cristallerie Saint-Joseph', 'père de Berthe'],
		description:
			"Homme doux, honnête et travailleur, caissier à la cristallerie Saint-Joseph, écrasé par la tyrannie de sa femme Éléonore. Pour payer les toilettes de ses filles et maintenir le train bourgeois du ménage, il passe ses nuits à copier des bandes d’adresses en secret. Il voue un amour paternel sincère et émouvant à Berthe.",
		points: [
			'Passe ses nuits à copier des bandes d’adresses pour subvenir au ménage (ch. II)',
			'Seul soutien affectif sincère de Berthe dans la tourmente et le rejet maternel (ch. X, XV, XVI)',
			'Conscient de la ruine morale et financière provoquée par son épouse (ch. XI)',
			'Meurt d’épuisement physique et moral entouré des siens au chapitre XVII',
		],
		color: '#78350f',
		tier: 'standard',
		x: 105,
		y: 290,
		mx: 76,
		my: 470,
	},
	{
		id: 'saturnin',
		label: 'Saturnin Josserand',
		caption: 'frère déséquilibré de Berthe',
		eyebrow: 'Frère nerveux · attachement violent et exclusif',
		meta: ['fils cadet des Josserand', 'instable nerveux'],
		description:
			"Fils maladif et détraqué, tenu à l’écart des mondanités par sa mère. Il nourrit pour sa sœur Berthe une dévotion passionnée et jalouse, prêt à tuer quiconque lui fait du tort.",
		points: [
			'N’obéit qu’à Berthe, qui seule sait calmer ses crises (ch. II)',
			'Défend Berthe avec fureur contre les reproches de son mari Auguste (ch. XI)',
			'Tente d’étrangler Auguste lorsqu’il apprend le scandale (ch. XV)',
			'Interné à l’asile des Moulineaux (ch. XVI–XVII), puis en sort au chapitre XVIII',
		],
		color: '#581c87',
		tier: 'minor',
		x: 105,
		y: 410,
		mx: 76,
		my: 560,
	},

	// --- FAMILLE VABRE (Propriétaire, entresol et premier étage) ---
	{
		id: 'auguste-vabre',
		label: 'Auguste Vabre',
		caption: 'commerçant · mari de Berthe',
		eyebrow: 'Fils aîné Vabre · névrosé hypocondriaque et avare',
		meta: ['33 ans', 'magasin de soieries au rez-de-chaussée', 'époux de Berthe'],
		description:
			"Fils aîné du propriétaire de l'immeuble, il tient le magasin de soieries au rez-de-chaussée et loge à l'entresol. Chétif, souffrant d'incessantes migraines névralgiques, il épouse Berthe dans l'espoir d'une dot. Son avarice maladive précipite l'échec de son mariage.",
		points: [
			'Épouse Berthe dans un calcul d’intérêts commerciaux et matrimoniaux (ch. VIII)',
			'Exige avec acharnement le versement de la dot impayée des Josserand (ch. X–XI)',
			'Contrôle mesquinement chaque dépense du foyer (ch. XIII)',
			'Surprend la liaison de Berthe et Octave et chasse son épouse (ch. XIV–XV), avant de la reprendre pour convenance bourgeoise (ch. XVIII)',
		],
		color: '#b45309',
		tier: 'major',
		x: 640,
		y: 220,
		mx: 284,
		my: 290,
	},
	{
		id: 'vieux-vabre',
		label: 'Le vieux Vabre',
		caption: 'ancien notaire · propriétaire',
		eyebrow: 'Propriétaire de l’immeuble · patriarche avare',
		meta: ['ancien notaire de Versailles', 'père d’Auguste, Théophile et Clotilde'],
		description:
			"Propriétaire imposant de l'immeuble du 28, rue de Choiseul. Il refuse d'aider ses enfants de son vivant et consacre ses journées à un illusoire travail de compilation statistique. Frappé d'une attaque d'apoplexie au chapitre X, sa mort brutale révèle l'absence de testament et déchire ses héritiers.",
		points: [
			'Incarne la figure tutélaire de l’ordre et de la propriété bourgeoise (ch. I)',
			'Refuse d’aider financièrement ses fils malgré leurs supplications (ch. X)',
			'Meurt subitement d’une attaque d’apoplexie au terme du chapitre X',
			'L’ouverture de son secrétaire au chapitre XI révèle l’absence de testament, ne laissant que ses biens ordinaires à partager',
		],
		color: '#713f12',
		tier: 'standard',
		x: 795,
		y: 130,
		mx: 284,
		my: 560,
	},
	{
		id: 'valerie-vabre',
		label: 'Valérie Vabre',
		caption: 'épouse de Théophile Vabre',
		eyebrow: 'Bourgeoise hystérique · adultère désinhibée',
		meta: ['née Louhette', 'épouse de Théophile', 'loge au premier étage sur cour'],
		description:
			"Épouse nerveuse et exaltée de Théophile Vabre. Elle méprise son mari maladif et mène des aventures extraconjugales audacieuses, cédant notamment un après-midi aux avances empressées d’Octave Mouret avant de le congédier.",
		points: [
			'Multiplie les scènes violentes avec son époux au premier étage (ch. V)',
			'Cède aux désirs d’Octave dans son salon avant de le repousser vivement (ch. IX)',
			'Nargue son mari sur la paternité de son fils Camille pour le blesser (ch. XI)',
			'Fait semblant d’une dévotion outrée auprès de l’abbé Mauduit pour sauver les apparences (ch. XVII)',
		],
		color: '#c026d3',
		tier: 'standard',
		x: 640,
		y: 340,
		mx: 284,
		my: 380,
	},
	{
		id: 'theophile-vabre',
		label: 'Théophile Vabre',
		caption: 'fils cadet Vabre · mari bafoué',
		eyebrow: 'Fils cadet maladif · jalousie impuissante',
		meta: ['fils cadet du propriétaire', 'loge au premier sur cour'],
		description:
			"Deuxième fils du vieux Vabre, poitrinaire et sans profession stable. Obsédé par la jalousie et l’inconduite de sa femme Valérie, il emplit l’immeuble du fracas de leurs disputes conjugales incessantes.",
		points: [
			'Soupçonne continuellement sa femme d’infidélités notoires (ch. V)',
			'Espionne les allées et venues devant son appartement (ch. IX)',
			'Se dispute la succession de son père contre son frère Auguste et sa sœur Clotilde (ch. XI)',
		],
		color: '#475569',
		tier: 'minor',
		x: 795,
		y: 340,
		mx: 284,
		my: 470,
	},

	// --- PREMIER ET DEUXIÈME ÉTAGE : DUVEYRIER ET CAMPARDON ---
	{
		id: 'duveyrier',
		label: 'M. Duveyrier',
		caption: 'Alphonse · conseiller à la cour',
		eyebrow: 'Magistrat austère · hypocrisie des plaisirs cachés',
		meta: ['conseiller à la cour d’appel', 'époux de Clotilde Vabre'],
		description:
			"Magistrat représentant officiel de la loi, de la morale et de la respectabilité bourgeoise. Fuyant le salon glacial et les gammes obsessionnelles de sa femme Clotilde, il entretient discrètement une maîtresse, Clarisse Bocquet, qu’il installe d'abord rue de la Cerisaie.",
		points: [
			'Incarne la gravité solennelle de la magistrature au premier étage (ch. I, V)',
			'Fuit le foyer familial pour rejoindre sa maîtresse Clarisse Bocquet (ch. X)',
			'Tente de se suicider en se tirant un coup de pistolet dans la mâchoire (ch. XIV)',
			'S’efforce d’étouffer le scandale de Berthe au nom de la dignité de la maison (ch. XV)',
		],
		color: '#0f766e',
		tier: 'standard',
		x: 640,
		y: 80,
		mx: 284,
		my: 130,
	},
	{
		id: 'clotilde-duveyrier',
		label: 'Clotilde Duveyrier',
		caption: 'épouse de M. Duveyrier',
		eyebrow: 'Fille Vabre · pianiste froide et virtuose',
		meta: ['née Vabre', 'fille du vieux notaire', 'mère de Gustave'],
		description:
			"Fille du vieux Vabre et sœur d’Auguste et Théophile. Froide, distante et dédaigneuse des devoirs conjugaux, elle noie l'ennui de son mariage dans l'exécution quotidienne et mécanique de morceaux de piano virtuoses.",
		points: [
			'Anime les soirées de l’immeuble avec des exécutions martiales de Chopin (ch. V)',
			'Refuse toute intimité chaleureuse à son mari Duveyrier (ch. X)',
			'Partage avec ses frères l’héritage paternel après la mort subite du notaire (ch. XI)',
			'Organise le grand dîner de convenance hivernal où les familles réconciliées sauvent la face (ch. XVIII)',
		],
		color: '#334155',
		tier: 'minor',
		x: 795,
		y: 50,
		mx: 284,
		my: 40,
	},
	{
		id: 'campardon',
		label: 'Achille Campardon',
		caption: 'architecte diocésain',
		eyebrow: 'Ami protecteur · inventeur du ménage à trois',
		meta: ['architecte des édifices religieux', 'compatriote d’Octave Mouret'],
		description:
			"Architecte jovial travaillant pour les édifices religieux, logé au deuxième étage. Compatriote provençal d'Octave, il lui trouve son logement. Prétextant la maladie de sa femme Rose (née Domergue), il fait entrer la cousine de celle-ci, Gasparine, devenue sa maîtresse, au domicile conjugal dans une harmonie bourgeoise cynique.",
		points: [
			'Accueille Octave et lui loue sa chambre au 28, rue de Choiseul (ch. I)',
			'Gère les travaux d’églises tout en affichant une dévotion de façade (ch. IV)',
			'Installe sa maîtresse Gasparine sous le toit conjugal aux côtés de son épouse Rose (ch. VII)',
			'Fait l’éloge de la paix domestique retrouvée grâce à cette cohabitation (ch. VIII, XII)',
		],
		color: '#0284c7',
		tier: 'standard',
		x: 280,
		y: 80,
		mx: 76,
		my: 130,
	},
	{
		id: 'gasparine',
		label: 'Gasparine',
		caption: 'maîtresse de Campardon',
		eyebrow: 'Cousine de Rose · maîtresse de maison installée',
		meta: ['cousine de Rose Campardon', 'ancienne demoiselle de magasin'],
		description:
			"Cousine de Rose Campardon et maîtresse d'Achille Campardon. Introduite au deuxième étage à la demande de Rose pour soulager l'épouse souffrante, elle partage la couche de l'architecte tout en prenant la direction autoritaire des dépenses et de la domesticité du foyer.",
		points: [
			'Rejoint le ménage Campardon avec l’accord chaleureux de l’épouse Rose (ch. VII)',
			'Devient la véritable intendante et administratrice du foyer (ch. VIII)',
			'Maintient l’ordre domestique et fait trembler les bonnes sous couvert de dévouement (ch. XII)',
		],
		color: '#4338ca',
		tier: 'minor',
		x: 105,
		y: 40,
		mx: 76,
		my: 40,
	},

	// --- COMMERCE ET MODERNITÉ : MADAME HÉDOUIN ---
	{
		id: 'caroline-hedouin',
		label: 'Caroline Hédouin',
		caption: 'patronne du Bonheur des Dames',
		eyebrow: 'Commerçante moderne · froideur rationnelle',
		meta: ['née Deleuze', 'épouse de Charles Hédouin puis d’Octave Mouret'],
		description:
			"Femme d'affaires lucide et active à la tête du magasin de nouveautés « Au Bonheur des Dames ». Insensible aux entreprises de séduction précipitées d'Octave, elle privilégie la stricte rentabilité commerciale avant d'accepter de l'épouser une fois devenue veuve.",
		points: [
			'Embauche Octave au rayon des soieries du Bonheur des Dames (ch. I)',
			'Repousse posément les avances galantes d’Octave au nom du travail (ch. VI)',
			'Reconnaît les compétences commerciales et le sens des affaires d’Octave (ch. XIV)',
			'L’épouse à la fin du roman après le décès de son premier mari Charles (ch. XVIII)',
		],
		color: '#059669',
		tier: 'standard',
		x: 450,
		y: 80,
		mx: 180,
		my: 70,
	},

	// --- QUATRIÈME ÉTAGE : MARIE PICHON ---
	{
		id: 'marie-pichon',
		label: 'Marie Pichon',
		caption: 'voisine d’Octave · rêveuse délaissée',
		eyebrow: 'Jeune épouse modeste · tendresse romanesque',
		meta: ['née Vuillaume', 'épouse de Jules Pichon', 'quatrième étage'],
		description:
			"Voisine de palier d'Octave au quatrième étage. Élevée dans une stricte obéissance par des parents étroits, mariée à un commis médiocre et terne, elle trompe sa solitude par des rêveries sentimentales et devient la première conquête parisienne d’Octave.",
		points: [
			'Vit avec son mari Jules un quotidien morne et étriqué (ch. I, IV)',
			'Cède timidement à Octave un soir de solitude romanesque (ch. IV)',
			'Garde pour Octave une fidélité attendrie sans jamais lui faire de scènes (ch. VII, XVIII)',
			'Assiste en spectatrice mélancolique aux drames passionnels de l’immeuble (ch. XV)',
		],
		color: '#16a34a',
		tier: 'standard',
		x: 450,
		y: 390,
		mx: 180,
		my: 590,
	},

	// --- COULISSES DOMESTIQUES : GOURD ET RACHEL ---
	{
		id: 'gourd',
		label: 'M. Gourd',
		caption: 'concierge de l’immeuble',
		eyebrow: 'Gardien de la respectabilité · mépris des humbles',
		meta: ['ancien valet de chambre du duc de Vaugelade', 'loge du rez-de-chaussée'],
		description:
			"Ancien valet enrichi devenu concierge de l'immeuble avec son épouse. Gardien intransigeant des apparences bourgeoises du 28, rue de Choiseul, il traque sans pitié les infractions au règlement, déteste les ouvriers et méprise férocement les gens de service.",
		points: [
			'Interdit formellement les bruits, malles et désordres dans l’escalier (ch. I)',
			'Vénère la façade de respectabilité tout en méprisant les locataires pauvres (ch. IV)',
			'Surveille avec effroi le ventre de la locataire ouvrière et exige son départ avant l’accouchement (ch. XI, XII)',
		],
		color: '#52525b',
		tier: 'minor',
		x: 320,
		y: 490,
		mx: 76,
		my: 670,
	},
	{
		id: 'rachel',
		label: 'Rachel',
		caption: 'domestique des Vabre',
		eyebrow: 'Servante lucide · dénonciatrice de l’adultère',
		meta: ['25 ans', 'bonne de Berthe et Auguste Vabre'],
		description:
			"Femme de chambre intelligente, froide et observatrice de Berthe et Auguste. Témoin au quotidien des turpitudes, des mesquineries financières et de l'adultère de ses maîtres, elle détient le secret de la maison et fait éclater la vérité quand on menace ses intérêts.",
		points: [
			'Subit les humiliations et les économies de bout de chandelle du couple (ch. X)',
			'Surveille la liaison clandestine nouée entre Octave et Berthe (ch. XIII)',
			'Complice d’Auguste, elle lui signale le départ de Berthe et verrouille la porte de cuisine lors du piège (ch. XIV)',
			'Révèle aux maîtres les secrets d’alcôve et illustre la guerre souterraine des cours et mansardes (ch. XVII–XVIII)',
		],
		color: '#4b5563',
		tier: 'minor',
		x: 580,
		y: 490,
		mx: 284,
		my: 670,
	},
];

// ==========================================================================
// Types de relations
// ==========================================================================
export const potBouilleEdgeTypes: Record<string, EdgeType> = {
	marriage: {
		legend: 'Mariage / couple bourgeois',
		stroke: '#b45309',
		activeStroke: '#78350f',
		width: 2.2,
		activeWidth: 3.2,
	},
	adultery: {
		legend: 'Liaison amoureuse / adultère',
		stroke: '#be185d',
		activeStroke: '#831843',
		width: 2.6,
		activeWidth: 3.6,
		dash: '6 4',
		arrow: 'both',
	},
	family: {
		legend: 'Lien familial / filiation',
		stroke: '#71717a',
		activeStroke: '#27272a',
		width: 1.8,
		activeWidth: 2.6,
		arrow: 'end',
	},
	financial: {
		legend: 'Intérêt financier / dot',
		stroke: '#ea580c',
		activeStroke: '#9a3412',
		width: 2,
		activeWidth: 2.8,
		dash: '4 3',
		arrow: 'end',
	},
	business: {
		legend: 'Ambition & alliance commerciale',
		stroke: '#059669',
		activeStroke: '#047857',
		width: 2.2,
		activeWidth: 3,
		arrow: 'end',
	},
	social: {
		legend: 'Relation sociale / appui',
		stroke: '#0284c7',
		activeStroke: '#0369a1',
		width: 1.6,
		activeWidth: 2.4,
		dash: '5 3',
		arrow: 'end',
	},
	domestic: {
		legend: 'Rapport domestique / contrôle',
		stroke: '#64748b',
		activeStroke: '#334155',
		width: 1.5,
		activeWidth: 2.2,
		dash: '2 3',
		arrow: 'end',
	},
};

// ==========================================================================
// Relations explicites
// ==========================================================================
export const potBouilleRelationships: MapRelationship[] = [
	// 1. Auguste & Berthe (Mariage d'intérêt)
	{
		source: 'auguste-vabre',
		target: 'berthe',
		type: 'marriage',
		label: 'mariage d’intérêt',
		description:
			"Auguste Vabre épouse Berthe Josserand au chapitre VIII, alléché par la fausse promesse d'une dot de 50 000 francs. Leur union, sans amour, s'envenime rapidement autour de l'avarice maladive d'Auguste et du non-paiement de la dot (ch. X–XI). Après la crise de l’adultère, ils reprennent la vie commune pour sauver les convenances (ch. XVIII).",
		labelDy: -12,
		mLabelDy: -12,
		mobileLabel: true,
	},

	// 2. Octave & Berthe (Liaison adultère centrale)
	{
		source: 'mouret',
		target: 'berthe',
		type: 'adultery',
		label: 'liaison adultère',
		description:
			"Octave Mouret entreprend la conquête de Berthe une fois celle-ci mariée. Elle devient sa maîtresse au chapitre XII. Leur liaison passionnée et clandestine dans la chambre du quatrième étage est surprise par Auguste alerté par Rachel à la fin de la nuit (ch. XIV), déclenchant le grand scandale de l'immeuble (ch. XV).",
		labelDy: 16,
		mLabelDy: 16,
		mobileLabel: true,
	},

	// 3. Octave & Marie Pichon (Première conquête)
	{
		source: 'mouret',
		target: 'marie-pichon',
		type: 'adultery',
		label: 'initiation amoureuse',
		description:
			"Marie Pichon, voisine de palier délaissée par son mari commis Jules, cède à Octave au chapitre IV. Cette première conquête parisienne, douce et sans tapage, sert de marchepied sentimental au jeune homme sans perturber la quiétude de l'étage.",
		labelDx: 14,
		labelDy: 0,
		mLabelDx: 14,
		mLabelDy: 0,
		mobileLabel: true,
	},

	// 4. Octave & Valérie Vabre (Aventure passagère)
	{
		source: 'mouret',
		target: 'valerie-vabre',
		type: 'adultery',
		label: 'liaison passagère',
		description:
			"Au chapitre IX, Octave séduit la nerveuse Valérie Vabre au premier étage de l'immeuble. L'aventure tourne court : Valérie, après avoir cédé, le congédie avec humeur pour préserver sa liberté et ses amants extérieurs.",
		labelDx: 12,
		labelDy: 14,
		mLabelDx: 12,
		mLabelDy: 14,
		mobileLabel: true,
	},

	// 5. Octave & Caroline Hédouin (Ambition commerciale et mariage futur)
	{
		source: 'mouret',
		target: 'caroline-hedouin',
		type: 'business',
		label: 'alliance commerciale → mariage',
		description:
			"Octave tente d'abord de séduire Mme Hédouin, sa patronne au Bonheur des Dames, qui l'éconduit calmement pour préserver les affaires (ch. VI). Après le décès de son mari Charles, elle accepte d'épouser Octave (ch. XVIII), couronnant son ascension par le contrôle du grand magasin.",
		labelDx: -18,
		labelDy: 0,
		mLabelDx: -18,
		mLabelDy: 0,
		mobileLabel: true,
	},

	// 6. Campardon → Octave (Protecteur provincial)
	{
		source: 'campardon',
		target: 'mouret',
		type: 'social',
		label: 'protecteur provincial',
		description:
			"Compatriote de Plassans, l'architecte Campardon accueille Octave Mouret à Paris, lui déniche sa chambre meublée au 28, rue de Choiseul et le fait engager chez les Hédouin (ch. I).",
		labelDx: 0,
		labelDy: -12,
		mLabelDx: 0,
		mLabelDy: -12,
	},

	// 7. Campardon & Gasparine (Ménage à trois)
	{
		source: 'campardon',
		target: 'gasparine',
		type: 'adultery',
		label: 'maîtresse installée au foyer',
		description:
			"Au chapitre VII, Campardon installe Gasparine, cousine de son épouse Rose et sa propre maîtresse, au domicile conjugal sous le prétexte commode de soigner Rose. Le trio vit dans une harmonie bourgeoise exemplaire, Gasparine régissant l'appartement (ch. VIII, XII).",
		labelDx: -8,
		labelDy: -12,
		mLabelDx: -8,
		mLabelDy: -12,
	},

	// 8. Duveyrier & Clotilde (Désaccord conjugal)
	{
		source: 'duveyrier',
		target: 'clotilde-duveyrier',
		type: 'marriage',
		label: 'désaccord conjugal & froideur',
		description:
			"Mariage d'apparat du premier étage. Le magistrat Duveyrier étouffe face à la rigidité et aux concerts de piano obsessionnels de sa femme Clotilde (ch. V), ce qui le pousse à entretenir en secret Clarisse Bocquet (ch. X).",
		labelDx: 0,
		labelDy: -12,
		mLabelDx: 0,
		mLabelDy: -12,
	},

	// 9. Théophile & Valérie (Ménage déchiré)
	{
		source: 'theophile-vabre',
		target: 'valerie-vabre',
		type: 'marriage',
		label: 'ménage déchiré & jalousie',
		description:
			"Union de discorde permanente au premier étage sur cour. Théophile soupçonne sans cesse sa femme d'adultère tandis que Valérie le nargue et le tyrannise dans des scènes domestiques furieuses (ch. V, XI).",
		labelDx: 0,
		labelDy: -14,
		mLabelDx: 0,
		mLabelDy: -14,
	},

	// 10. M. Josserand & Mme Josserand (Couple mal assorti)
	{
		source: 'm-josserand',
		target: 'mme-josserand',
		type: 'marriage',
		label: 'tyrannie conjugale',
		description:
			"M. Josserand subit depuis trente ans la domination acariâtre de son épouse Éléonore, qui le méprise pour son absence d'ambition tout en exigeant un train de vie mondain ruineux (ch. II, XVI).",
		labelDx: -16,
		labelDy: 0,
		mLabelDx: -16,
		mLabelDy: 0,
	},

	// 11. Mme Josserand → Berthe (Chasse au mari)
	{
		source: 'mme-josserand',
		target: 'berthe',
		type: 'family',
		label: 'dressage au mariage',
		description:
			"Mme Josserand élève et manipule Berthe comme une marchandise de luxe sur le marché matrimonial parisien, l'entraînant aux manœuvres de séduction pour ferrer Auguste Vabre (ch. III, VI).",
		labelDx: -14,
		labelDy: -10,
		mLabelDx: -14,
		mLabelDy: -10,
	},

	// 12. M. Josserand → Berthe (Tendresse paternelle)
	{
		source: 'm-josserand',
		target: 'berthe',
		type: 'family',
		label: 'tendresse paternelle sincère',
		description:
			"M. Josserand aime tendrement sa fille cadette. Il souffre en silence de voir son bonheur sacrifié aux vanités maternelles et reste son seul refuge affectif (ch. X, XV, XVI).",
		labelDx: -14,
		labelDy: 10,
		mLabelDx: -14,
		mLabelDy: 10,
	},

	// 13. Saturnin → Berthe (Dévotion exclusive)
	{
		source: 'saturnin',
		target: 'berthe',
		type: 'family',
		label: 'attachement passionné & protection',
		description:
			"Frère déséquilibré de Berthe, Saturnin lui voue un dévouement féroce. Dès qu'Auguste contrarie sa sœur, Saturnin entre dans des rages destructrices et tente de l'étrangler (ch. XI, XV).",
		labelDx: 14,
		labelDy: 10,
		mLabelDx: 14,
		mLabelDy: 10,
	},

	// 14. Mme Josserand → Auguste Vabre (Fausses promesses de dot)
	{
		source: 'mme-josserand',
		target: 'auguste-vabre',
		type: 'financial',
		label: 'promesse mensongère de 50 000 F',
		description:
			"Pour emporter l'accord d'Auguste Vabre, Mme Josserand promet par contrat une dot de cinquante mille francs qu'elle sait pertinemment inexistante, semant les germes de la discorde financière du ménage (ch. VI, X).",
		labelDx: 0,
		labelDy: -18,
		mLabelDx: 0,
		mLabelDy: -18,
		mobileLabel: true,
	},

	// 15. Le vieux Vabre → Auguste Vabre (Filiation)
	{
		source: 'vieux-vabre',
		target: 'auguste-vabre',
		type: 'family',
		label: 'père → fils aîné',
		description:
			"L'ancien notaire loge son fils commerçant à l'entresol mais lui refuse toute avance financière de son vivant (ch. I, X), avant de mourir subitement sans testament (ch. XI).",
		labelDx: 16,
		labelDy: -12,
		mLabelDx: 16,
		mLabelDy: -12,
	},

	// 16. Le vieux Vabre → Théophile Vabre (Filiation)
	{
		source: 'vieux-vabre',
		target: 'theophile-vabre',
		type: 'family',
		label: 'père → fils cadet',
		description:
			"Le vieux Vabre loge Théophile au premier étage sur cour tout en traitant avec défiance ce fils malade et dépensier (ch. I, X).",
		labelDx: 16,
		labelDy: 0,
		mLabelDx: 16,
		mLabelDy: 0,
	},

	// 17. Le vieux Vabre → Clotilde Duveyrier (Filiation)
	{
		source: 'vieux-vabre',
		target: 'clotilde-duveyrier',
		type: 'family',
		label: 'père → fille',
		description:
			"Le patriarche loge chez sa fille Clotilde et son gendre Duveyrier au premier étage sur rue, où il rédige ses interminables feuillets statistiques jusqu’à son attaque mortelle (ch. I, X).",
		labelDx: 16,
		labelDy: -10,
		mLabelDx: 16,
		mLabelDy: -10,
	},

	// 18. Rachel → Berthe (Dénonciation de l'adultère)
	{
		source: 'rachel',
		target: 'berthe',
		type: 'domestic',
		label: 'espionne → piège du flagrant délit',
		description:
			"Témoin direct de l'intimité du foyer, la domestique Rachel découvre la liaison secrète de Berthe avec Octave. Complice d’Auguste, elle lui révèle le départ nocturne de sa maîtresse et verrouille la porte de cuisine pour empêcher toute fuite (ch. XIV).",
		labelDx: 0,
		labelDy: 14,
		mLabelDx: 0,
		mLabelDy: 14,
	},

	// 19. Gourd → Octave Mouret (Surveillance de l'immeuble)
	{
		source: 'gourd',
		target: 'mouret',
		type: 'domestic',
		label: 'surveillance & discipline bourgeoise',
		description:
			"Le concierge Gourd surveille jalousement les montées d'Octave au quatrième étage, incarnant la police des mœurs et l'obsession de la respectabilité dans la maison (ch. I, IV).",
		labelDx: 0,
		labelDy: 14,
		mLabelDx: 0,
		mLabelDy: 14,
	},
];

// ==========================================================================
// Tableau de synthèse : Qui anime l'immeuble du 28, rue de Choiseul ?
// ==========================================================================
export const potBouilleFunctions: Record<string, string> = {
	mouret: 'Moteur de l’intrigue · conquérant',
	berthe: 'Cœur du drame · victime de son éducation',
	'auguste-vabre': 'Mari berné · avarice bourgeoise',
	'mme-josserand': 'Manipulatrice · culte des apparences',
	'm-josserand': 'Victime morale du paraître',
	saturnin: 'Pulsion protectrice instinctive',
	'vieux-vabre': 'Autorité patriarcale · obsession de l’or',
	'valerie-vabre': 'Hypocrisie dévote et désirs cachés',
	'theophile-vabre': 'Névrose et jalousie impuissante',
	duveyrier: 'Double morale de la magistrature',
	'clotilde-duveyrier': 'Respectabilité glaciale',
	campardon: 'Cynisme et compromis domestique',
	gasparine: 'Gestionnaire du ménage à trois',
	'caroline-hedouin': 'Raison marchande et avenir moderne',
	'marie-pichon': 'Sentimentalisme candide délaissé',
	gourd: 'Police des apparences',
	rachel: 'Révélatrice des turpitudes bourgeoises',
};

// ==========================================================================
// Étapes du mécanisme dramatique de Pot-Bouille
// ==========================================================================
export const potBouilleMechanism = [
	{
		step: 'Façade',
		text: 'Au 28, rue de Choiseul, un immeuble haussmannien feint la plus stricte respectabilité bourgeoise.',
	},
	{
		step: 'Mariage',
		text: 'Berthe est mariée à Auguste Vabre sur la promesse mensongère d’une dot de 50 000 francs.',
	},
	{
		step: 'Conquête',
		text: 'Octave Mouret utilise la séduction des résidentes pour assouvir ses ambitions parisiennes.',
	},
	{
		step: 'Crise',
		text: 'L’adultère éclate au grand jour ; les faux-semblants s’effondrent dans le scandale et la ruine morale.',
	},
	{
		step: 'Convenance',
		text: 'L’immeuble étouffe le désordre derrière ses portes closes pour sauver l’apparence sociale.',
	},
];
