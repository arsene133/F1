// ==========================================================================
// Données architecturales de l'immeuble du 28, rue de Choiseul (Pot-Bouille)
// Coupe architecturale narrative conforme au texte d'Émile Zola (1882)
// ==========================================================================

export interface BuildingRoom {
	id: string;
	title: string;
	subtitle?: string;
	orientation: 'rue' | 'cour' | 'communs' | 'commerce';
	characterIds: string[];
	description: string;
	quote?: {
		text: string;
		source: string;
	};
	secrets?: string[];
}

export interface BuildingFloor {
	id: string;
	level: number; // 5 = combles, 4 = 4e, 3 = 3e, 2 = 2e, 1 = 1er, 0 = entresol, -1 = rdc
	name: string;
	subtitle: string;
	carpet: string;
	facadeFeature?: string;
	rooms: BuildingRoom[];
	circulationNote: string;
}

export const potBouilleBuildingFloors: BuildingFloor[] = [
	{
		id: 'combles',
		level: 5,
		name: 'Combles & Mansardes',
		subtitle: '5ᵉ étage sous le zinc · chambres de service',
		carpet: 'Couloir jaune nu, sol brut · froid glacial du zinc',
		facadeFeature: 'Toit de zinc pentu, lucarnes et tuyaux de cheminée',
		circulationNote: 'Desservi exclusivement par l’escalier de service et les portes dérobées.',
		rooms: [
			{
				id: 'mansardes-bonnes',
				title: 'Chambres des domestiques',
				subtitle: 'Adèle, Rachel, Louise · corridor d’hôpital',
				orientation: 'communs',
				characterIds: ['rachel'],
				description:
					'Corridor peint en jaune clair, froid glacial sous le toit de zinc. Cloisons de papier où tout s’entend : les bonnes s’y réfugient la nuit et y déversent la vérité crue sur leurs maîtres.',
				quote: {
					text: 'Un long couloir se coupait deux fois à angle droit, peint en jaune clair [...], les portes des chambres de domestique, également jaunes, s’espaçaient, régulières et uniformes.',
					source: 'Chapitre VI',
				},
				secrets: [
					'Rachel y observe avec mépris les faiblesses intimes de Berthe et Auguste',
					'Adèle y subit la faim et y accouche dans la solitude et l’angoisse',
					'Trublot y rôde la nuit pour retrouver les soubrettes',
				],
			},
			{
				id: 'cabinet-piqueuse',
				title: 'Cabinet de la piqueuse de bottines',
				subtitle: 'L’ouvrière enceinte traquée par la concierge',
				orientation: 'cour',
				characterIds: [],
				description:
					'Étroit réduit loué 130 francs par le vieux Vabre à une ouvrière misérable. Son ventre de femme enceinte terrifie M. Gourd qui la chasse impitoyablement avant qu’elle n’accouche.',
				quote: {
					text: 'La malheureuse, toute seule, agonisait sous les toits, dans un de ces cabinets de misère, où il n’y avait même plus de place pour son ventre.',
					source: 'Chapitre XIII',
				},
				secrets: [
					'Scandale de la grossesse ouvrière incompatible avec la « respectabilité » de la maison',
					'Expulsion brutale ordonnée le jour du terme par M. Gourd',
				],
			},
		],
	},
	{
		id: 'etage-4',
		level: 4,
		name: 'Quatrième étage',
		subtitle: 'Tapis gris · petits fonctionnaires & mariages aux abois',
		carpet: 'Toile grise modeste remplaçant le velours rouge',
		facadeFeature: 'Fenêtres sobres sous la corniche',
		circulationNote: 'Charnière entre l’escalier d’honneur et la porte de communication de service.',
		rooms: [
			{
				id: 'foyer-josserand',
				title: 'Foyer Josserand',
				subtitle: 'Sur la rue · le théâtre de la chasse aux maris',
				orientation: 'rue',
				characterIds: ['mme-josserand', 'm-josserand', 'saturnin', 'berthe'],
				description:
					'Grand appartement meublé à crédit où Mme Josserand organise les mardis mondains pour caser ses filles. La nuit, le père épuisé y copie des bandes d’adresses pour payer les robes.',
				quote: {
					text: 'Sur la rue, les Josserand, toute une famille, le père caissier à la cristallerie Saint-Joseph, deux filles à marier.',
					source: 'Chapitre I',
				},
				secrets: [
					'Promesse frauduleuse d’une dot fictive de 50 000 francs pour marier Berthe',
					'Travail nocturne clandestin du père caissier pour dissimuler la faillite',
					'Crises furieuses et dévotion possessive de Saturnin enfermé dans sa chambre',
				],
			},
			{
				id: 'chambre-octave',
				title: 'Chambre d’Octave Mouret',
				subtitle: 'Sur la cour · le laboratoire de la séduction',
				orientation: 'cour',
				characterIds: ['mouret'],
				description:
					'Chambre carrée meublée sobrement d’un papier gris à fleurs bleues avec cabinet de toilette. Sa porte dérobée sur l’escalier de service permet les allées et venues discrètes.',
				quote: {
					text: 'Enfin, nous voici chez vous. La chambre, carrée, assez grande, tapissée d’un papier gris à fleurs bleues, était meublée très simplement.',
					source: 'Chapitre I',
				},
				secrets: [
					'C’est ici qu’Octave séduit d’abord sa voisine Marie Pichon',
					'C’est également ici que Berthe le rejoint et qu’ils sont surpris au petit matin par Auguste et Rachel',
					'Passage direct vers l’escalier de service pour échapper aux regards',
				],
			},
			{
				id: 'foyer-pichon',
				title: 'Foyer Pichon',
				subtitle: 'Sur la cour · ménage étriqué et rêverie délaissée',
				orientation: 'cour',
				characterIds: ['marie-pichon'],
				description:
					'Petit logement d’employé sans fortune. Jules y passe ses soirées à classer ses papiers, tandis que Marie berce l’enfant en rêvant à des amours romanesques.',
				quote: {
					text: 'Près de vous, un petit ménage d’employé, les Pichon, des gens qui ne roulent pas sur l’or, mais d’une éducation parfaite...',
					source: 'Chapitre I',
				},
				secrets: [
					'Marie y cède à Octave sans résistance ni calcul, par pur besoin de tendresse',
					'Fidélité discrète et silencieuse de Marie lors des drames ultérieurs',
				],
			},
		],
	},
	{
		id: 'etage-3',
		level: 3,
		name: 'Troisième étage',
		subtitle: 'Fin du tapis rouge · l’architecte pieux & le ménage à trois',
		carpet: 'Tapis rouge moelleux retenu par des tringles de cuivre',
		facadeFeature: 'Balcon intermédiaire sobre en pierre',
		circulationNote: 'Dernier palier honoré par le tapis rouge et le calorifère.',
		rooms: [
			{
				id: 'foyer-campardon',
				title: 'Appartement Campardon',
				subtitle: 'Sur la rue · le cynisme du ménage à trois',
				orientation: 'rue',
				characterIds: ['campardon', 'gasparine'],
				description:
					'Vaste appartement richement plâtré avec grand salon blanc et or. L’architecte des églises y installe ouvertement sa maîtresse Gasparine avec la bénédiction de sa femme Rose qui feint d’en être soulagée.',
				quote: {
					text: 'Ici, nous sommes chez moi... L’appartement sur la cour était divisé en deux : il y avait là madame Juzeur... et un monsieur très distingué.',
					source: 'Chapitre I',
				},
				secrets: [
					'Le salon blanc et or cache des lézardes hâtivement bouchées au plâtre',
					'Ménage à trois officialisé au nom de la santé de Rose et de la paix du foyer',
					'Gasparine y prend les rênes financières et tyrannise la domesticité',
				],
			},
			{
				id: 'logement-juzeur',
				title: 'Logement de Mme Juzeur & garçonnière',
				subtitle: 'Sur la cour · confidences mielleuses et garçonnière discrète',
				orientation: 'cour',
				characterIds: [],
				description:
					'Appartement sur cour scindé en deux : le boudoir capitonné de Mme Juzeur, femme abandonnée aux caresses tièdes, et la chambre louée par un « monsieur distingué » pour ses affaires hebdomadaires.',
				quote: {
					text: 'Une petite femme bien malheureuse, et un monsieur très distingué, qui avait loué une chambre, où il venait une fois par semaine, pour des affaires.',
					source: 'Chapitre I',
				},
				secrets: [
					'Mme Juzeur y joue les confidentes intimes de tous les hommes du bâtiment',
					'La garçonnière anonyme illustre la complicité marchande de la bourgeoisie',
				],
			},
		],
	},
	{
		id: 'etage-2',
		level: 2,
		name: 'Deuxième étage',
		subtitle: 'L’écrivain mystérieux & le jeune ménage Auguste-Berthe',
		carpet: 'Tapis rouge d’honneur · silence recueilli',
		facadeFeature: 'Étages nobles avec corniches sculptées',
		circulationNote: 'Banquette de velours sous la verrière bordée d’une grecque.',
		rooms: [
			{
				id: 'appartement-auguste-berthe',
				title: 'Appartement du couple Auguste & Berthe',
				subtitle: 'Sur la cour · l’enfer du ménage d’avarice',
				orientation: 'cour',
				characterIds: ['auguste-vabre', 'berthe', 'rachel'],
				description:
					'Appartement loué par Auguste après son mariage au chapitre VIII. Cinq mille francs de meubles en thuya et soie bleue qui déçoivent Berthe. Théâtre des crises de névralgie d’Auguste et des récriminations d’avarice.',
				quote: {
					text: 'Son ancien logement de l’entresol ne pouvant suffire, il avait pris l’appartement du second, sur la cour, où il croyait avoir fait des folies...',
					source: 'Chapitre XII',
				},
				secrets: [
					'Auguste y compte chaque sou et pèse les morceaux de sucre',
					'Rachel y espionne les désaccords et aide son maître à tendre le piège de l’adultère',
					'Berthe s’en échappe en peignoir la nuit pour monter au quatrième chez Octave',
				],
			},
			{
				id: 'appartement-ecrivain',
				title: 'L’appartement de l’écrivain solitaire',
				subtitle: 'Sur la rue · « des gens qu’on ne voit jamais »',
				orientation: 'rue',
				characterIds: [],
				description:
					'Grand appartement mystérieux habité par un intellectuel reclus que personne ne fréquente. Méprisé par Campardon et M. Gourd car il ne participe pas à la parade bourgeoise.',
				quote: {
					text: 'Des gens qu’on ne voit pas, que personne ne connaît... Le monsieur fait des livres, je crois.',
					source: 'Chapitre I',
				},
				secrets: [
					'Zola s’y met malicieusement en abyme : le romancier observant en silence les hypocrisies de l’immeuble',
					'Considéré comme une « tache » par les bourgeois parce qu’il vit sans parade',
				],
			},
		],
	},
	{
		id: 'etage-1',
		level: 1,
		name: 'Premier étage',
		subtitle: 'Étage noble · grand balcon de fonte, magistrature & faux dévots',
		carpet: 'Tapis rouge somptueux · calorifère et chaleur de serre',
		facadeFeature: 'Grand balcon en fonte ouvragée soutenu par des cariatides',
		circulationNote: 'Cœur névralgique du pouvoir de propriété et de la magistrature.',
		rooms: [
			{
				id: 'appartement-duveyrier',
				title: 'Foyer Duveyrier & Le vieux Vabre',
				subtitle: 'Sur la rue · magistrature glaciale & testament introuvable',
				orientation: 'rue',
				characterIds: ['duveyrier', 'clotilde-duveyrier', 'vieux-vabre'],
				description:
					'Le plus vaste appartement de l’immeuble. Le conseiller Duveyrier y vit dans l’austérité glacée des gammes de Clotilde. Le vieux Vabre y compile ses fiches statistiques avant d’y mourir subitement sans testament.',
				quote: {
					text: 'Sur la rue, le propriétaire lui-même, un ancien notaire de Versailles, qui logeait du reste chez son gendre, M. Duveyrier, conseiller à la cour d’appel.',
					source: 'Chapitre I',
				},
				secrets: [
					'Duveyrier fuit ce foyer austère pour entretenir une maîtresse et manque son suicide d’un coup de pistolet',
					'Clotilde noie son dégoût conjugal dans des attaques de piano virtuoses',
					'Mort brutale du vieux Vabre et pillage fébrile de son secrétaire par ses trois enfants',
				],
			},
			{
				id: 'appartement-theophile-valerie',
				title: 'Foyer Théophile & Valérie Vabre',
				subtitle: 'Sur la cour · jalousie maladive et adultère tapageur',
				orientation: 'cour',
				characterIds: ['theophile-vabre', 'valerie-vabre'],
				description:
					'Théâtre d’incessantes querelles conjugales violentes qui scandalisent l’escalier. Valérie y trompe son mari poitrinaire avec désinvolture et y reçoit Octave un après-midi.',
				quote: {
					text: 'Au premier, sur la cour, l’autre fils du propriétaire, M. Théophile Vabre, avec sa dame...',
					source: 'Chapitre I',
				},
				secrets: [
					'Valérie nargue Théophile sur la paternité de son fils Camille',
					'Liaison fugitive avec Octave Mouret dans le salon conjugal',
					'Crises de nerfs simulées et recours mielleux à l’abbé Mauduit pour préserver l’honneur',
				],
			},
		],
	},
	{
		id: 'entresol',
		level: 0,
		name: 'Entresol',
		subtitle: 'Plafonds bas · garçonnière initiale d’Auguste Vabre',
		carpet: 'Tapis rouge d’honneur et descente vers le magasin',
		facadeFeature: 'Petites baies cintrées surmontant les arcades du magasin',
		circulationNote: 'Accès direct à la mezzanine du magasin de soieries.',
		rooms: [
			{
				id: 'entresol-auguste',
				title: 'Logement initial d’Auguste Vabre',
				subtitle: 'La vie de célibataire maniaque avant le mariage',
				orientation: 'commerce',
				characterIds: ['auguste-vabre'],
				description:
					'Appartement bas de plafond communicant avec le magasin de soieries du rez-de-chaussée. Auguste y vivait en célibataire souffreteux avant d’épouser Berthe et de monter au deuxième.',
				quote: {
					text: 'Il avait pris, au printemps, le magasin de soierie du rez-de-chaussée, et occupait également tout l’entresol.',
					source: 'Chapitre I',
				},
				secrets: [
					'Auguste y soigne ses migraines névralgiques au milieu des échantillons d’étoffes',
					'Bureaux commerciaux où se trament les négociations financières du mariage',
				],
			},
		],
	},
	{
		id: 'rdc',
		level: -1,
		name: 'Rez-de-chaussée & Cour',
		subtitle: 'Vestibule d’honneur, loge du concierge, magasin de soieries et cour de service',
		carpet: 'Panneaux de faux marbre blanc à bordures roses · Napolitaine dorée aux 3 becs de gaz',
		facadeFeature: 'Grande porte cochère en chêne sculpté, vitrines de soieries et cariatide dorée',
		circulationNote: 'Séparation étanche entre l’escalier d’honneur feutré et le boyau de service puant.',
		rooms: [
			{
				id: 'magasin-soieries',
				title: 'Magasin de soieries d’Auguste Vabre',
				subtitle: 'Commerce bourgeois menacé par les grands magasins',
				orientation: 'rue',
				characterIds: ['auguste-vabre'],
				description:
					'Boutique traditionnelle aux comptoirs d’acajou. Auguste y lutte contre la concurrence féroce du Bonheur des Dames, tout en exigeant la dot promise par les Josserand.',
				quote: {
					text: 'Au rez-de-chaussée, le magasin de soierie de M. Auguste Vabre...',
					source: 'Chapitre I',
				},
				secrets: [
					'Difficultés financières masquées derrière l’opulence apparente des coupons de velours',
					'Avarice commerciale qui précipitera la ruine de son couple',
				],
			},
			{
				id: 'vestibule-honneur',
				title: 'Vestibule d’honneur & Escalier',
				subtitle: 'Le sanctuaire chauffé des apparences bourgeoises',
				orientation: 'communs',
				characterIds: [],
				description:
					'Faux marbres, cariatide napolitaine dorée portant une amphore à gaz, rampe d’acajou et vieil argent, chaleur de serre soufflée par le calorifère. Silence de mort où toute indiscrétion est proscrite.',
				quote: {
					text: 'Le vestibule et l’escalier étaient d’un luxe violent. En bas, une figure de femme, une sorte de Napolitaine toute dorée, portait sur la tête une amphore, d’où sortaient trois becs de gaz.',
					source: 'Chapitre I',
				},
				secrets: [
					'Calorifère moderne et tapis rouge servant à étouffer le moindre bruit de la vie réelle',
					'Les portes d’acajou poli dressent une muraille morale d’hypocrisie',
				],
			},
			{
				id: 'loge-gourd',
				title: 'Loge des concierges Gourd',
				subtitle: 'Petit salon palissandre · police féroce de l’immeuble',
				orientation: 'communs',
				characterIds: ['gourd'],
				description:
					'Salon cossu meublé de palissandre, moquette à fleurs rouges et glaces claires. M. Gourd y lit le Moniteur en calotte de velours et y fait régner une terreur impitoyable contre les ouvriers et les pauvres.',
				quote: {
					text: 'Cette loge était un petit salon, aux glaces claires, garni d’une moquette à fleurs rouges et meublé de palissandre...',
					source: 'Chapitre I',
				},
				secrets: [
					'Gourd méprise férocement la piétaille et vénère la richesse des propriétaires',
					'Traque obsessionnelle des odeurs de cuisine, des malles et des ventres de femmes enceintes',
				],
			},
			{
				id: 'cour-service',
				title: 'Cour intérieure & Escalier de service',
				subtitle: 'La marmite fangeuse · boyaux des odeurs et cancans',
				orientation: 'cour',
				characterIds: ['rachel'],
				description:
					'Puits d’ombre glacial pavé de ciment où le soleil ne descend jamais. L’escalier de service y plonge : c’est par là que montent les nourritures, les ordures et les confidences vengeresses des servantes.',
				quote: {
					text: 'La cour, au fond, pavée et cimentée, avait un grand air de propreté froide... Jamais le soleil ne devait descendre là.',
					source: 'Chapitre I',
				},
				secrets: [
					'Les domestiques y déversent les épluchures et déchirent la réputation de leurs patrons',
					'C’est la véritable « marmite » du roman (le pot-bouille moral)',
				],
			},
		],
	},
];

// Espace extérieur contigu : Le Bonheur des Dames (Caroline Hédouin)
export const potBouilleExteriorSpace: BuildingRoom = {
	id: 'bonheur-des-dames',
	title: 'Au Bonheur des Dames (Espace extérieur)',
	subtitle: 'Angle rue Neuve-Saint-Augustin / rue de la Michodière',
	orientation: 'commerce',
	characterIds: ['caroline-hedouin'],
	description:
		'Grand magasin de nouveautés dirigé par Caroline Hédouin où Octave Mouret commence comme commis. Symbole du capitalisme moderne et du triomphe commercial qui balaiera le vieux commerce sédentaire de la rue de Choiseul.',
	quote: {
		text: 'Elle était née au Bonheur des Dames, fondé par son père et son oncle, elle aimait la maison, elle la voyait s’élargir, dévorer les maisons voisines, étaler une façade royale...',
		source: 'Chapitre IX',
	},
	secrets: [
		'Caroline Hédouin refuse les avances précipitées d’Octave pour préserver les comptes',
		'Octave l’épousera après le veuvage pour devenir le maître tout-puissant du grand magasin',
	],
};
