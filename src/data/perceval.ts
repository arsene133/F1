import type { EdgeType, MapLink, MapNode, MapRelationship } from '../components/relationship-map/types';

// ==========================================================================
// Données pour Le Conte du Graal de Chrétien de Troyes (/perceval)
// Roman en vers (octosyllabes à rimes plates) composé vers 1181–1190,
// dédié au comte Philippe de Flandre et laissé inachevé par la mort du poète.
// Référence textuelle : manuscrit BnF fr. 794 (copie de Guiot) et éditions
// critiques de référence (Félix Lecoy, Champion ; Daniel Poirion, Pléiade ;
// Charles Méla, Livre de Poche « Lettres gothiques »).
// ==========================================================================

export interface NarrativeSequence {
	id: string;
	title: string;
	cycle: 'perceval' | 'gauvain';
	summary: string;
	verses: string;
	keyFigure: string;
}

export interface DidacticNote {
	title: string;
	text: string;
}

export interface PercevalIconographyDocument {
	id: string;
	title: string;
	badge: string;
	badgeClass: string;
	image: {
		src: string;
		alt: string;
		caption: string;
		width: number;
		height: number;
	};
	meta: {
		title: string;
		author: string;
		date: string;
		institution: string;
		identifier: string;
		identifierUrl: string;
		license: string;
	};
	pedagogicalAnalysis: {
		whatItShows: string;
		textualLink: string;
		criticalLimitation: string;
	};
	questions: [string, string];
}

export const percevalSequences: NarrativeSequence[] = [
	{
		id: 'enfance-foret',
		title: '1. L’enfance dans la « Gaste Forêt » (la forêt déserte)',
		cycle: 'perceval',
		summary:
			'Perceval grandit avec sa mère dans une forêt isolée, sans rien savoir du monde ni des chevaliers. Un jour, il croise des chevaliers en armure et les prend pour des anges de Dieu. Il décide aussitôt de partir à la cour du roi Arthur, malgré les larmes de sa mère qui tente de le retenir.',
		verses: 'vers 69–634',
		keyFigure: 'La mère de Perceval',
	},
	{
		id: 'chevalier-vermeil',
		title: '2. L’arrivée chez le roi Arthur et le Chevalier Vermeil',
		cycle: 'perceval',
		summary:
			'Perceval arrive à la cour du roi Arthur habillé comme un paysan. Il réclame l’armure rouge du Chevalier Vermeil, un ennemi qui vient d’insulter le roi. Perceval ne sait pas encore se battre comme un chevalier : il tue pourtant son adversaire avec un javelot de chasse et prend son armure.',
		verses: 'vers 865–1304',
		keyFigure: 'Le Chevalier Vermeil & le roi Arthur',
	},
	{
		id: 'apprentissage-gornemant',
		title: '3. L’apprentissage des armes chez Gornemant de Goort',
		cycle: 'perceval',
		summary:
			'Un noble seigneur, Gornemant de Goort, accueille Perceval dans son château. En une journée, il lui apprend à monter à cheval, à manier l’épée et à respecter les règles des chevaliers : épargner un ennemi vaincu qui demande grâce, protéger les dames et ne pas trop parler. Puis il l’adoube : au cours d’une cérémonie, il le fait chevalier.',
		verses: 'vers 1357–1698',
		keyFigure: 'Gornemant de Goort',
	},
	{
		id: 'beaurepaire-blanchefleur',
		title: '4. La défense de Blanchefleur au château de Beaurepaire',
		cycle: 'perceval',
		summary:
			'Perceval arrive au château de Beaurepaire. Une armée ennemie l’encercle pour obliger ses habitants à se rendre : le château est assiégé. La jeune dame du château, Blanchefleur, demande l’aide de Perceval. Il bat ses ennemis, sauve le château de la famine et tombe amoureux de Blanchefleur. Puis il repart pour revoir sa mère.',
		verses: 'vers 1699–2975',
		keyFigure: 'Blanchefleur',
	},
	{
		id: 'chateau-graal',
		title: '5. La scène du cortège au château du Roi Pêcheur',
		cycle: 'perceval',
		summary:
			'Perceval est reçu par le Roi Pêcheur, un seigneur blessé qui ne peut plus marcher. Pendant le repas du soir, il voit passer une lance blanche qui saigne, puis un plat précieux en or brillant appelé « un graal ». Par peur de paraître impoli, il n’ose poser aucune question. Le lendemain matin, le château est vide.',
		verses: 'vers 2976–3421',
		keyFigure: 'Le Roi Pêcheur & le Graal',
	},
	{
		id: 'reproches-cousine-demoiselle',
		title: '6. Les reproches de la cousine et de la Demoiselle hideuse',
		cycle: 'perceval',
		summary:
			'Dans la forêt, une cousine en larmes lui apprend que sa mère est morte de chagrin au moment de son départ. Elle lui reproche son silence au château. Plus tard, à la cour d’Arthur, une messagère très laide (la « Demoiselle hideuse ») accuse Perceval devant tout le monde : sa question aurait pu guérir le roi. Perceval jure alors de partir à la recherche du Graal : c’est le début de sa quête.',
		verses: 'vers 3422–4746',
		keyFigure: 'La cousine germaine & la Demoiselle hideuse',
	},
	{
		id: 'aventures-gauvain',
		title: '7. Pendant ce temps : les aventures de Monseigneur Gauvain',
		cycle: 'gauvain',
		summary:
			'Pendant que Perceval cherche le Graal, le roman raconte les aventures de Gauvain, le chevalier le plus célèbre de la cour d’Arthur. Un seigneur l’accuse d’avoir tué son maître par trahison : Gauvain part pour se défendre. En chemin, il combat dans des tournois, réussit des épreuves magiques et montre son courage et sa politesse.',
		verses: 'vers 4747–6216 & 6519–9234',
		keyFigure: 'Gauvain',
	},
	{
		id: 'vendredi-saint-ermite',
		title: '8. La rencontre avec l’ermite le Vendredi saint',
		cycle: 'perceval',
		summary:
			'Pendant cinq ans, Perceval va d’aventure en aventure et oublie Dieu. Le Vendredi saint (le jour où les chrétiens se souviennent de la mort du Christ), des pèlerins le conduisent chez un ermite, un homme qui vit seul dans les bois pour prier. Cet ermite est son oncle. Il lui explique qu’un péché, c’est-à-dire une faute envers Dieu, l’a empêché de parler devant le Graal : son départ a fait mourir sa mère de chagrin. Perceval se confesse et se réconcilie avec Dieu.',
		verses: 'vers 6217–6518',
		keyFigure: 'L’oncle ermite',
	},
];

export const percevalCharacters: MapNode[] = [
	{
		id: 'perceval',
		label: 'Perceval le Gallois',
		caption: 'le héros · jeune homme naïf devenu chevalier',
		eyebrow: 'Personnage principal · apprentissage et quête du Graal',
		meta: ['fils de la Veuve Dame', 'neveu de l’ermite · cousin du Roi Pêcheur', 'adoubé par Gornemant'],
		description:
			'Héros du roman. Son père et ses deux frères, tous chevaliers, sont morts. Pour le protéger, sa mère l’élève dans une forêt sauvage, sans lui parler des chevaliers. Très naïf au départ, il apprend le métier des armes auprès de Gornemant, puis libère le château de Blanchefleur. Chez le Roi Pêcheur, il voit passer la lance qui saigne et le Graal, mais n’ose poser aucune question : il a peur de paraître impoli. Plus tard, l’ermite lui explique que ce silence vient d’une faute : son départ a fait mourir sa mère de chagrin.',
		points: [
			'Quitte sa mère évanouie de douleur pour devenir chevalier auprès du roi Arthur (vers 620–634)',
			'Tue le Chevalier Vermeil avec son javelot et prend son armure (vers 1110–1135)',
			'Apprend à manier les armes avec Gornemant de Goort, qui lui conseille de ne pas trop parler (vers 1640–1655)',
			'Défend et libère Blanchefleur assiégée dans son château (vers 2150–2600)',
			'Voit passer le Graal chez le Roi Pêcheur mais garde le silence (vers 3200–3300)',
			'Reçoit de violents reproches de sa cousine et de la Demoiselle hideuse pour son silence (vers 3580–3600 & 4650–4715)',
			'Se confesse auprès de son oncle ermite le jour du Vendredi saint (vers 6330–6518)',
		],
		color: '#235284',
		tier: 'major',
		x: 450,
		y: 280,
		mx: 180,
		my: 290,
	},
	{
		id: 'mere-perceval',
		label: 'La mère de Perceval',
		caption: 'la Veuve Dame · mère aimante et protectrice',
		eyebrow: 'Famille de Perceval · tente de protéger son fils',
		meta: ['noble dame veuve', 'sœur de l’ermite et du père du Roi Pêcheur', 'morte de chagrin'],
		description:
			'Son mari, un chevalier courageux, et ses deux fils aînés sont morts. Elle élève donc Perceval loin de tous les dangers. Avant son départ, elle lui donne des conseils pour bien se conduire. Quand Perceval s’éloigne au galop sans se retourner, elle s’effondre de chagrin et en meurt. Plus tard, l’ermite explique que cette faute envers sa mère a empêché Perceval de parler devant le Graal.',
		points: [
			'Raconte la mort tragique du père et des deux frères aînés (vers 400–488)',
			'Donne à Perceval ses derniers conseils de conduite avant son départ (vers 527–590)',
			'S’effondre au pont du manoir quand Perceval part sans se retourner (vers 620–634)',
			'Sa mort de chagrin est confirmée par la cousine puis par l’ermite (vers 3590 & 6390)',
		],
		color: '#8b572a',
		tier: 'standard',
		x: 230,
		y: 110,
		mx: 80,
		my: 130,
	},
	{
		id: 'pere-et-freres',
		label: 'Le père et les frères',
		caption: 'la famille disparue · morts avant le début du roman',
		eyebrow: 'Mémoire familiale · la mort des chevaliers de la famille',
		meta: ['figures défuntes', 'morts à la guerre', 'sans nom dans le texte'],
		description:
			'Le roman ne leur donne pas de nom. Le père, un chevalier très courageux, a été blessé aux jambes pendant des guerres entre seigneurs et a perdu ses terres. Les deux frères aînés de Perceval sont devenus chevaliers, puis ont été tués au combat le même jour. Le père en est mort de chagrin. Voilà pourquoi la mère a voulu cacher Perceval dans les bois.',
		points: [
			'Le père est blessé aux jambes et se réfugie dans la forêt (vers 416–434)',
			'Les deux frères aînés meurent les armes à la main le même jour (vers 459–478)',
			'Leur souvenir explique pourquoi la mère a tout fait pour éloigner Perceval des armes',
		],
		color: '#5e5850',
		tier: 'minor',
		x: 80,
		y: 80,
		mx: 80,
		my: 20,
	},
	{
		id: 'gornemant',
		label: 'Gornemant de Goort',
		caption: 'le maître d’armes · enseigne le métier de chevalier',
		eyebrow: 'Apprentissage · montre les règles et les combats',
		meta: ['seigneur de Goort', 'oncle de Blanchefleur', 'maître de Perceval'],
		description:
			'Seigneur âgé et expérimenté. Il accueille Perceval et voit vite que le jeune homme est très fort, mais ne sait pas se battre. En une seule journée, il lui apprend à monter à cheval, à tenir son bouclier et à manier l’épée. Puis il le fait chevalier au cours d’une cérémonie : c’est l’adoubement. Il lui donne aussi des conseils de conduite : épargner un ennemi vaincu qui demande grâce, secourir les dames en danger et ne pas parler à tort et à travers.',
		points: [
			'Enseigne à Perceval le combat à cheval et le maniement de l’épée (vers 1420–1530)',
			'Adoube Perceval en lui attachant son éperon et en lui remettant son épée (vers 1630–1640)',
			'Lui conseille de ne pas trop parler : « gardez-vous de trop parler » (vers 1648–1656)',
			'Propose à Perceval d’épouser sa nièce Blanchefleur (vers 1880–1900)',
		],
		color: '#3f6b3a',
		tier: 'standard',
		x: 230,
		y: 430,
		mx: 80,
		my: 460,
	},
	{
		id: 'arthur',
		label: 'Le roi Arthur',
		caption: 'le grand roi · chef respecté des chevaliers',
		eyebrow: 'Cour royale · le roi des chevaliers',
		meta: ['roi des Bretons', 'cour de Carduel', 'accueille les chevaliers'],
		description:
			'Roi légendaire entouré des meilleurs chevaliers. Quand Perceval arrive à la cour, Arthur est triste et pensif : le Chevalier Vermeil vient de l’insulter en renversant une coupe de vin sur la reine. Malgré les habits de paysan de Perceval, Arthur devine sa valeur et le traite avec gentillesse. Plus tard, impressionné par ses exploits, Arthur part avec toute sa cour à sa recherche.',
		points: [
			'Reçoit Perceval avec bienveillance à la cour de Carduel (vers 910–960)',
			'Reproche à Keu de s’être moqué du jeune homme et d’avoir giflé une servante (vers 1010–1040)',
			'Part avec les seigneurs de sa cour à la recherche de Perceval, dans la neige (vers 4140–4450)',
			'Reçoit la Demoiselle hideuse devant toute sa cour réunie (vers 4610–4750)',
		],
		color: '#8b572a',
		tier: 'standard',
		x: 450,
		y: 80,
		mx: 180,
		my: 20,
	},
	{
		id: 'keu',
		label: 'Keu le sénéchal',
		caption: 'officier du roi Arthur · moqueur et agressif',
		eyebrow: 'Cour royale · le chevalier provocateur',
		meta: ['sénéchal d’Arthur', 'langue méchante', 'détesté des autres'],
		description:
			'Keu est le sénéchal du roi Arthur : il dirige le service du palais. Il est connu pour son caractère agressif et ses moqueries. Il se moque de la naïveté de Perceval et l’envoie affronter le Chevalier Vermeil en espérant qu’il se fasse tuer. Plus tard, Keu attaque Perceval, plongé dans ses pensées devant des gouttes de sang sur la neige. Perceval le fait tomber et lui casse le bras : c’est sa revanche sur les moqueries passées.',
		points: [
			'Se moque de l’allure paysanne de Perceval à son arrivée (vers 1000–1015)',
			'Gifle une jeune fille qui avait annoncé que Perceval deviendrait un grand chevalier (vers 1035–1060)',
			'Attaque Perceval absorbé dans ses pensées et se fait casser le bras (vers 4270–4330)',
		],
		color: '#8c6a6a',
		tier: 'minor',
		x: 340,
		y: 20,
		mx: 280,
		my: 20,
	},
	{
		id: 'gauvain',
		label: 'Monseigneur Gauvain',
		caption: 'neveu du roi Arthur · modèle du chevalier parfait',
		eyebrow: 'Le deuxième héros · les exploits du chevalier courtois',
		meta: ['neveu d’Arthur', 'héros de la seconde moitié du roman', 'chevalier modèle'],
		description:
			'Neveu du roi Arthur. C’est le chevalier le plus courtois de la Table ronde : il est poli, loyal et respectueux envers les dames. Ces qualités forment ce qu’on appelle la courtoisie. Keu attaque Perceval avec violence ; Gauvain, lui, vient lui parler avec douceur. Chrétien de Troyes consacre une grande partie de la seconde moitié du livre à Gauvain. Accusé d’avoir tué un seigneur par trahison, il part se défendre et accomplit de nombreux exploits dans des tournois et des châteaux enchantés. Ses aventures montrent la gloire des chevaliers dans le monde, alors que celles de Perceval prennent un sens plus religieux.',
		points: [
			'Parle avec politesse à Perceval lors de la scène des gouttes de sang sur la neige (vers 4430–4550)',
			'Accusé publiquement de trahison, il part défendre son honneur (vers 4750–4790)',
			'Multiplie les combats d’armes et les exploits au fil de ses voyages',
			'Réussit l’épreuve du Lit de la Merveille, un lit magique, dans le Château des Reines',
		],
		color: '#5b347b',
		tier: 'major',
		x: 750,
		y: 110,
		mx: 280,
		my: 150,
	},
	{
		id: 'blanchefleur',
		label: 'Blanchefleur',
		caption: 'dame de Beaurepaire · aimée de Perceval',
		eyebrow: 'Lien amoureux · la jeune dame secourue',
		meta: ['dame de Beaurepaire', 'nièce de Gornemant', 'amour de Perceval'],
		description:
			'Jeune dame du château de Beaurepaire, encerclé par des chevaliers ennemis. En larmes, elle vient demander secours à Perceval pendant la nuit. Perceval accepte, combat ses ennemis un par un et délivre le château. Un amour sincère naît entre eux. Plus tard, devant trois gouttes de sang rouge tombées sur la neige blanche, Perceval reste immobile : il pense au visage de Blanchefleur, blanc et rose.',
		points: [
			'Vient en larmes demander l’aide de Perceval dans sa chambre (vers 1960–2050)',
			'Délivrée de ses ennemis par les victoires de Perceval en combat (vers 2240–2600)',
			'Perceval lui promet de revenir après être allé voir comment va sa mère (vers 2910–2935)',
			'Son visage est rappelé par les trois gouttes de sang sur la neige (vers 4195–4215)',
		],
		color: '#c98a84',
		tier: 'standard',
		x: 150,
		y: 280,
		mx: 80,
		my: 320,
	},
	{
		id: 'roi-pecheur',
		label: 'Le Roi Pêcheur',
		caption: 'seigneur blessé · gardien du château mystérieux',
		eyebrow: 'Le mystère du Graal · le roi qui attend sa guérison',
		meta: ['cousin de Perceval', 'blessé aux hanches', 'maître du château du Graal'],
		description:
			'Seigneur mystérieux. Perceval le rencontre d’abord sur une rivière, en train de pêcher depuis une barque. Une blessure aux hanches l’empêche de monter à cheval : la pêche est le seul plaisir qui lui reste, d’où son nom de « Roi Pêcheur ». Il invite Perceval dans son riche château, lui offre une épée magnifique et partage avec lui le repas du soir. Pendant ce repas défile un cortège, c’est-à-dire une procession de personnes qui portent des objets : la lance qui saigne, puis un plat précieux (« un graal »). Selon la cousine de Perceval, si le héros avait posé des questions sur ce cortège, le roi aurait été guéri.',
		points: [
			'Indique à Perceval le chemin de son château depuis sa barque (vers 3000–3060)',
			'Accueille le jeune homme allongé près d’un grand feu et lui fait cadeau d’une épée (vers 3080–3180)',
			'Regarde passer le cortège sans que Perceval ne pose la moindre question (vers 3190–3310)',
			'Son père, qui ne quitte plus sa chambre, est nourri d’une hostie (le pain de la messe) apportée dans le Graal (vers 6420–6430)',
		],
		color: '#4d5b66',
		tier: 'major',
		x: 450,
		y: 470,
		mx: 180,
		my: 460,
	},
	{
		id: 'ermite',
		label: 'L’oncle ermite',
		caption: 'frère de la mère · guide religieux dans les bois',
		eyebrow: 'Pardon et foi · explique le secret du silence',
		meta: ['oncle maternel de Perceval', 'homme saint vivant en ermite', 'frère de la mère'],
		description:
			'Un ermite est un homme qui vit seul, loin du monde, pour prier Dieu. Celui-ci est le frère de la mère de Perceval. Après cinq ans loin de Dieu, Perceval vient le voir le jour du Vendredi saint. L’ermite lui révèle la vérité : son péché, c’est-à-dire sa faute envers Dieu, est d’avoir causé la mort de sa mère. C’est ce péché qui l’a empêché de parler devant le Graal. L’ermite écoute sa confession, lui enseigne une prière et le réconcilie avec Dieu.',
		points: [
			'Accueille Perceval conduit par des pèlerins le Vendredi saint (vers 6330–6370)',
			'Révèle à Perceval qu’il est son oncle et que le Roi Pêcheur est son cousin (vers 6415–6434)',
			'Explique que la faute envers sa mère est la cause religieuse de son silence au château (vers 6392–6414)',
			'Lui donne des conseils chrétiens et lui fait faire pénitence, c’est-à-dire des actions pour réparer sa faute (vers 6480–6515)',
		],
		color: '#5f6b2f',
		tier: 'standard',
		x: 670,
		y: 450,
		mx: 280,
		my: 590,
	},
	{
		id: 'graal',
		label: 'Le Graal',
		caption: 'plat ou vase précieux · éclat d’or et de pierres précieuses',
		eyebrow: 'Élément narratif mystérieux · l’objet de la question que Perceval ne pose pas',
		meta: ['plat ou vase précieux', 'en or fin · porte une hostie', 'clarté éblouissante'],
		description:
			'Chez Chrétien de Troyes, « graal » est d’abord un nom commun : c’est un plat large ou un vase en or pur, orné de pierres précieuses. Une jeune fille le porte pendant le repas chez le Roi Pêcheur. Il brille si fort que la lumière des bougies semble pâlir. Il sert à apporter une hostie (le pain de la messe) au père du Roi Pêcheur. La question que Perceval ne pose pas (« À qui sert-on le Graal ? ») est l’épreuve principale de son aventure.',
		points: [
			'Apparaît dans le repas avec une lumière extraordinaire (vers 3220–3240)',
			'Fait d’or pur et orné de joyaux très rares (vers 3232–3239)',
			'Contient une hostie qui nourrit le vieux roi depuis douze ans (vers 6422–6428)',
			'Chrétien écrit « un graal », comme on dirait « un plat » : ce sont des auteurs venus après lui qui en feront une coupe sacrée unique',
		],
		color: '#b4502f',
		tier: 'major',
		x: 330,
		y: 560,
		mx: 80,
		my: 720,
	},
	{
		id: 'lance-qui-saigne',
		label: 'La lance qui saigne',
		caption: 'arme mystérieuse · une goutte de sang coule de son fer',
		eyebrow: 'Élément narratif symbolique · signe de douleur et de mystère',
		meta: ['lance blanche étincelante', 'goutte de sang vermeil au fer', 'portée par un valet'],
		description:
			'Arme portée par un jeune serviteur (un valet) au début du cortège chez le Roi Pêcheur. Une goutte de sang rouge coule sans arrêt de sa pointe en fer blanc jusqu’à la main du porteur. Perceval est fasciné, mais il garde le silence et n’ose pas demander pourquoi cette arme saigne.',
		points: [
			'Ouvre la marche du cortège, portée par les deux mains d’un valet (vers 3190–3200)',
			'Une goutte de sang rouge coule en continu de la pointe blanche (vers 3198–3205)',
			'Étonne Perceval, qui n’ose pas questionner son hôte car il se souvient du conseil de Gornemant (vers 3206–3215)',
			'Dans des récits écrits plus tard, elle deviendra la lance du soldat romain qui a blessé le Christ sur la croix',
		],
		color: '#8a1f1a',
		tier: 'minor',
		x: 570,
		y: 560,
		mx: 280,
		my: 720,
	},
	{
		id: 'cousine-germaine',
		label: 'La cousine germaine',
		caption: 'jeune fille rencontrée sous un chêne · annonce la mort de la mère',
		eyebrow: 'Rencontre dans la forêt · premiers reproches sur le silence',
		meta: ['cousine de Perceval', 'pleure son ami mort', 'élevée avec lui chez sa mère'],
		description:
			'Perceval la rencontre dans les bois le lendemain de sa visite au château du Graal. Elle pleure son ami chevalier qui vient d’être tué. Quand elle lui demande son nom, Perceval, qui ne le connaissait pas, le devine : « Perceval le Gallois ». Elle lui annonce la mort de sa mère. Elle apprend qu’il a vu le cortège sans poser de question : elle lui reproche très sévèrement son silence et lui annonce que de grands malheurs en viendront.',
		points: [
			'Lui demande son nom : Perceval devine alors qu’il s’appelle « Perceval le Gallois » (vers 3570–3575)',
			'Lui apprend que sa mère est morte de chagrin au moment de son départ (vers 3590–3595)',
			'Lui reproche d’avoir gardé le silence devant le Graal et la lance (vers 3583–3589)',
			'Met en garde Perceval contre l’épée donnée par le roi, qui risque de se briser au combat (vers 3650–3685)',
		],
		color: '#6a4c93',
		tier: 'minor',
		x: 230,
		y: 200,
		mx: 80,
		my: 200,
	},
	{
		id: 'demoiselle-hideuse',
		label: 'La Demoiselle hideuse',
		caption: 'messagère au visage effrayant · maudit le silence de Perceval',
		eyebrow: 'Annonce publique · relance la quête de tous les chevaliers',
		meta: ['messagère sur une mule', 'visage très laid', 'venue à la cour d’Arthur'],
		description:
			'Messagère au visage effrayant, qui arrive à la cour du roi Arthur sur une mule. Devant tous les chevaliers réunis, elle reproche durement son silence à Perceval : s’il avait posé les questions au château, le Roi Pêcheur aurait été guéri et son pays serait resté en paix. Ses reproches lancent Perceval dans une longue quête pour retrouver le Graal.',
		points: [
			'Arrive brusquement devant le roi Arthur et ses chevaliers (vers 4610–4645)',
			'Accuse publiquement Perceval de n’avoir posé aucune question au Roi Pêcheur (vers 4650–4715)',
			'Annonce que le silence de Perceval causera la guerre et la désolation (vers 4675–4690)',
			'Pousse Perceval et les autres chevaliers à repartir en quête d’aventures (vers 4725–4746)',
		],
		color: '#4d5b66',
		tier: 'minor',
		x: 670,
		y: 280,
		mx: 280,
		my: 360,
	},
];

export const percevalEdgeTypes: Record<string, EdgeType> = {
	familial: {
		legend: 'Lien de famille',
		stroke: '#8b572a',
		activeStroke: '#5a3517',
		width: 2.2,
		dash: '1.5 4',
		arrow: 'end',
	},
	chevaleresque: {
		legend: 'Lien de chevalerie (combat, adoubement, cour du roi)',
		stroke: '#235284',
		activeStroke: '#172b3a',
		width: 2.2,
		dash: 'none',
		arrow: 'end',
	},
	affectif: {
		legend: 'Lien d’amour',
		stroke: '#c98a84',
		activeStroke: '#a2312b',
		width: 2.2,
		dash: '8 4',
		arrow: 'end',
	},
	narratif: {
		legend: 'Rencontre importante (moquerie, épreuve, reproche)',
		stroke: '#6a4c93',
		activeStroke: '#462b66',
		width: 2,
		dash: '4 3',
		arrow: 'end',
	},
	spirituel: {
		legend: 'Lien religieux (confession, pardon)',
		stroke: '#5f6b2f',
		activeStroke: '#3a441a',
		width: 2.4,
		dash: '10 2 2 2',
		arrow: 'end',
	},
	mystique: {
		legend: 'Lien avec les objets mystérieux (Graal, lance)',
		stroke: '#b4502f',
		activeStroke: '#7a3118',
		width: 2.4,
		dash: '14 4 3 4',
		arrow: 'end',
	},
};

export const percevalRelationships: MapRelationship[] = [
	// Famille de Perceval
	{
		id: 'mere-perceval-famille',
		source: 'mere-perceval',
		target: 'perceval',
		type: 'familial',
		label: 'mère → fils (protection & départ)',
		description:
			'La mère élève Perceval seul dans la forêt pour le protéger des dangers de la chevalerie, qui ont déjà tué son mari et ses deux autres fils. Quand Perceval part pour devenir chevalier, elle s’effondre de chagrin. Plus tard, l’ermite explique que cette peine causée à sa mère a pesé sur Perceval et l’a empêché de poser des questions chez le Roi Pêcheur.',
		labelDx: -45,
		labelDy: 15,
		mLabelDx: -25,
		mLabelDy: 10,
		mobileLabel: true,
	},
	{
		id: 'pere-freres-mere',
		source: 'pere-et-freres',
		target: 'mere-perceval',
		type: 'familial',
		label: 'mari & fils disparus',
		direction: 'none',
		description:
			'Son mari a été blessé à la guerre, puis il est mort de chagrin. Ses deux fils aînés ont été tués le même jour, juste après être devenus chevaliers. Ce malheur explique pourquoi la mère a voulu cacher Perceval dans une forêt isolée.',
		labelDx: 0,
		labelDy: -15,
		mLabelDx: 0,
		mLabelDy: -10,
	},
	{
		id: 'pere-freres-perceval',
		source: 'pere-et-freres',
		target: 'perceval',
		type: 'familial',
		label: 'famille de vaillants chevaliers',
		description:
			'Sans le savoir, Perceval est le fils et le frère de grands chevaliers. Sa mère lui a caché cette origine pour le sauver, mais son envie de devenir chevalier se réveille dès qu’il aperçoit des cavaliers en armure.',
		labelDx: -50,
		labelDy: 20,
	},
	{
		id: 'cousine-perceval-parente',
		source: 'cousine-germaine',
		target: 'perceval',
		type: 'familial',
		label: 'cousine germaine',
		direction: 'none',
		description:
			'Elle est la cousine germaine de Perceval et a été élevée un temps avec lui, chez sa mère. Elle le reconnaît dans la forêt et lui annonce la mort de sa mère.',
		labelDx: -45,
		labelDy: -15,
	},
	{
		id: 'ermite-perceval-parente',
		source: 'ermite',
		target: 'perceval',
		type: 'familial',
		label: 'oncle maternel',
		direction: 'none',
		description:
			'L’ermite est le frère de la mère de Perceval. Il accueille son neveu avec douceur, écoute sa confession et l’aide à obtenir le pardon de Dieu.',
		labelDx: 40,
		labelDy: -20,
		mLabelDx: 20,
		mLabelDy: -15,
	},
	{
		id: 'roi-pecheur-perceval-parente',
		source: 'roi-pecheur',
		target: 'perceval',
		type: 'familial',
		label: 'cousin germain',
		direction: 'none',
		description:
			'L’ermite révèle que le Roi Pêcheur est le cousin germain de Perceval. Le père du Roi Pêcheur est en effet le frère de la mère de Perceval et de l’ermite. Perceval ignorait complètement ce lien quand il était au château.',
		labelDx: 0,
		labelDy: 20,
		mLabelDx: 0,
		mLabelDy: 15,
		mobileLabel: true,
	},

	// Chevalerie et cour d’Arthur
	{
		id: 'perceval-arthur-cour',
		source: 'perceval',
		target: 'arthur',
		type: 'chevaleresque',
		label: 'veut devenir chevalier',
		description:
			'Perceval va jusqu’à Carduel pour demander au roi Arthur de le faire chevalier. Malgré ses habits de paysan naïf, le roi devine son courage et regrette que son sénéchal Keu se moque de lui.',
		labelDx: -35,
		labelDy: -20,
		mLabelDx: -20,
		mLabelDy: -15,
		mobileLabel: true,
	},
	{
		id: 'keu-arthur-service',
		source: 'keu',
		target: 'arthur',
		type: 'chevaleresque',
		label: 'sénéchal du roi Arthur',
		description:
			'Keu est un officier important du roi Arthur : il dirige le service du palais. Mais il est violent et désagréable : il blesse les invités avec ses paroles méchantes et provoque des disputes à la cour.',
		labelDx: 25,
		labelDy: -15,
	},
	{
		id: 'keu-perceval-raillerie',
		source: 'keu',
		target: 'perceval',
		type: 'narratif',
		label: 'se moque & le provoque',
		description:
			'Keu se rit de la naïveté de Perceval et l’envoie affronter le dangereux Chevalier Vermeil pour s’amuser. Plus tard, Perceval le fait tomber de cheval et lui casse le bras, le punissant de ses méchancetés.',
		labelDx: 25,
		labelDy: 15,
	},
	{
		id: 'gornemant-perceval-initiation',
		source: 'gornemant',
		target: 'perceval',
		type: 'chevaleresque',
		label: 'lui apprend le métier des armes',
		description:
			'Gornemant apprend à Perceval comment se battre à cheval et manier l’épée. Il le fait officiellement chevalier et lui conseille de ne pas être trop bavard (« gardez-vous de trop parler »). Chez le Roi Pêcheur, Perceval suivra ce conseil trop à la lettre.',
		labelDx: -50,
		labelDy: -20,
		mLabelDx: -30,
		mLabelDy: -15,
		mobileLabel: true,
	},
	{
		id: 'gauvain-arthur-service',
		source: 'gauvain',
		target: 'arthur',
		type: 'chevaleresque',
		label: 'neveu & meilleur chevalier',
		direction: 'none',
		description:
			'Fils du roi Lot et neveu d’Arthur, Gauvain est le chevalier le plus réputé et le plus loyal de la Table ronde. Il met toujours son épée au service du roi et de la justice.',
		labelDx: 40,
		labelDy: -15,
	},
	{
		id: 'gauvain-perceval-fraternite',
		source: 'gauvain',
		target: 'perceval',
		type: 'chevaleresque',
		label: 'amitié & aventures côte à côte',
		direction: 'both',
		description:
			'Gauvain parle à Perceval avec beaucoup de politesse et le ramène en ami auprès du roi Arthur. Chrétien de Troyes raconte ensuite les aventures des deux héros l’une après l’autre : Perceval cherche le sens du Graal, tandis que Gauvain accomplit de brillants exploits de chevalier.',
		labelDx: 45,
		labelDy: 15,
		mLabelDx: 30,
		mLabelDy: 10,
		mobileLabel: true,
	},

	// Blanchefleur et Beaurepaire
	{
		id: 'perceval-blanchefleur-amour',
		source: 'perceval',
		target: 'blanchefleur',
		type: 'affectif',
		label: 'la délivre & l’aime tendrement',
		direction: 'both',
		description:
			'Perceval combat les ennemis qui assiègent le château de Blanchefleur et la sauve de la ruine. Un amour sincère naît entre eux. Perceval reste fidèle à son souvenir, comme le montre la scène où il rêve devant trois gouttes de sang sur la neige blanche.',
		labelDx: -45,
		labelDy: 0,
		mLabelDx: -25,
		mLabelDy: 0,
		mobileLabel: true,
	},
	{
		id: 'gornemant-blanchefleur-parente',
		source: 'gornemant',
		target: 'blanchefleur',
		type: 'familial',
		label: 'oncle de Blanchefleur',
		direction: 'none',
		description:
			'Gornemant est l’oncle de Blanchefleur. Il souhaitait voir Perceval épouser sa nièce, mais le jeune chevalier a préféré repartir pour retrouver d’abord sa mère.',
		labelDx: -35,
		labelDy: 15,
	},

	// Le château du Graal et les objets mystiques
	{
		id: 'roi-pecheur-perceval-accueil',
		source: 'roi-pecheur',
		target: 'perceval',
		type: 'narratif',
		label: 'l’accueille & lui offre une épée',
		description:
			'Le Roi Pêcheur reçoit Perceval avec de grands honneurs dans son château mystérieux. Il l’installe près du feu et lui offre une épée précieuse avant le début du cortège.',
		labelDx: 15,
		labelDy: -25,
	},
	{
		id: 'perceval-roi-pecheur-silence',
		source: 'perceval',
		target: 'roi-pecheur',
		type: 'narratif',
		label: 'se tait au passage du Graal',
		description:
			'Par peur de paraître impoli et parce qu’il se souvient du conseil de Gornemant (« ne parlez pas trop »), Perceval ne demande rien sur la lance qui saigne ni sur le Graal. À cause de ce silence, le roi n’est pas guéri : la cousine et la Demoiselle hideuse le lui reprocheront très durement.',
		labelDx: -45,
		labelDy: 25,
		mLabelDx: -25,
		mLabelDy: 20,
		mobileLabel: true,
	},
	{
		id: 'roi-pecheur-graal-service',
		source: 'roi-pecheur',
		target: 'graal',
		type: 'mystique',
		label: 'nourrit son vieux père au Graal',
		direction: 'none',
		description:
			'Pendant le repas, le Graal passe pour porter une hostie (le pain de la messe) au père du Roi Pêcheur. Ce vieux roi ne quitte plus sa chambre depuis douze ans : cette hostie suffit à le maintenir en vie.',
		labelDx: -35,
		labelDy: 20,
	},
	{
		id: 'perceval-graal-enigme',
		source: 'perceval',
		target: 'graal',
		type: 'mystique',
		label: 'la question non posée',
		description:
			'Perceval regarde passer le plat précieux en or brillant appelé « un graal », mais il n’ose pas demander : « À qui sert-on le Graal ? ». C’est l’erreur principale de son parcours.',
		labelDx: -25,
		labelDy: 35,
		mLabelDx: -15,
		mLabelDy: 25,
		mobileLabel: true,
	},
	{
		id: 'perceval-lance-enigme',
		source: 'perceval',
		target: 'lance-qui-saigne',
		type: 'mystique',
		label: 'regarde la lance sans poser de question',
		description:
			'Perceval voit un valet porter une lance blanche dont la pointe laisse couler une goutte de sang rouge. Il n’ose pas demander pourquoi cette arme saigne.',
		labelDx: 35,
		labelDy: 30,
	},

	// Crises, malédictions et conversion spirituelle
	{
		id: 'cousine-perceval-reproche',
		source: 'cousine-germaine',
		target: 'perceval',
		type: 'narratif',
		label: 'lui reproche son silence',
		description:
			'La cousine annonce à Perceval la mort de sa mère. Elle lui reproche durement d’être resté muet au château du Graal et lui annonce de grands malheurs.',
		labelDx: -25,
		labelDy: -20,
	},
	{
		id: 'demoiselle-perceval-malediction',
		source: 'demoiselle-hideuse',
		target: 'perceval',
		type: 'narratif',
		label: 'l’accuse devant toute la cour',
		description:
			'Devant tous les chevaliers d’Arthur, la Demoiselle hideuse crie que Perceval a commis une grave faute en ne posant pas de question : le Roi Pêcheur reste blessé et le pays connaîtra la guerre.',
		labelDx: 40,
		labelDy: 15,
		mLabelDx: 20,
		mLabelDy: 10,
		mobileLabel: true,
	},
	{
		id: 'ermite-perceval-pardon',
		source: 'ermite',
		target: 'perceval',
		type: 'spirituel',
		label: 'le confesse & lui pardonne',
		description:
			'Le jour du Vendredi saint, l’ermite explique à Perceval pourquoi il n’a pas pu parler : le péché d’avoir causé la mort de sa mère l’a empêché de parler au château. L’ermite écoute sa confession, lui apprend une prière et le réconcilie avec Dieu.',
		labelDx: 35,
		labelDy: -15,
		mLabelDx: 20,
		mLabelDy: -10,
		mobileLabel: true,
	},
];

export const percevalFunctions: Record<string, string> = {
	perceval: 'Héros de l’histoire · jeune homme naïf qui devient chevalier puis cherche le pardon de Dieu',
	'mere-perceval': 'Mère aimante et protectrice · tente de cacher le monde à son fils et meurt de douleur à son départ',
	'pere-et-freres': 'Mémoire de la famille · vaillants chevaliers tués à la guerre avant le début de l’histoire',
	gornemant: 'Maître d’armes · apprend à Perceval à manier l’épée et lui conseille de ne pas trop parler',
	arthur: 'Le grand roi légendaire · accueille Perceval avec bienveillance et maintient l’honneur de la cour',
	keu: 'Provocateur de la cour · officier moqueur qui insulte Perceval avant d’être puni en combat',
	gauvain: 'Chevalier modèle · neveu d’Arthur dont les aventures sont racontées après celles de Perceval',
	blanchefleur: 'Amie et amour de Perceval · jeune châtelaine secourue dont le souvenir inspire le héros',
	'roi-pecheur': 'Seigneur blessé · maître du château mystérieux qui attend d’être guéri par une question',
	ermite: 'Guide religieux dans les bois · oncle qui explique pourquoi Perceval s’est tu et le réconcilie avec Dieu',
	graal: 'Objet précieux et mystérieux · plat d’or brillant portant une hostie, au cœur de la question non posée',
	'lance-qui-saigne': 'Arme extraordinaire · lance blanche dont le fer laisse couler une goutte de sang sans s’arrêter',
	'cousine-germaine': 'Jeune fille sous un chêne · annonce à Perceval la mort de sa mère et lui reproche son silence au château',
	'demoiselle-hideuse': 'Messagère à la cour · accuse publiquement Perceval devant les chevaliers et relance la quête',
};

export const didacticNotes: DidacticNote[] = [
	{
		title: 'Un roman inachevé : pourquoi l’histoire n’a-t-elle pas de fin ?',
		text: 'Chrétien de Troyes écrit ce roman à la fin du XIIᵉ siècle, sans doute entre 1181 et 1190 : la date exacte n’est pas connue. Il l’écrit pour son protecteur, Philippe d’Alsace, comte de Flandre. Le texte s’arrête brusquement au vers 9234, au milieu d’une aventure de Gauvain. Chrétien est probablement mort avant de pouvoir le terminer. Il n’a donc jamais raconté la fin des aventures de Perceval, ni la guérison du Roi Pêcheur. Après sa mort, d’autres écrivains ont imaginé la suite : on appelle ces suites les continuations. Elles ne sont pas de Chrétien. Son roman est aussi le plus ancien texte connu qui parle du Graal.',
	},
	{
		title: 'Qu’est-ce que le Graal chez Chrétien de Troyes ?',
		text: 'Chez Chrétien, « graal » est d’abord un nom commun : il écrit « un graal », comme on dirait « un plat ». C’est un plat large ou un récipient précieux en or pur, orné de pierres brillantes, porté par une jeune fille. Le mot vient très probablement du latin du Moyen Âge gradalis, qui désignait un plat pour servir des mets raffinés. Le graal sert à porter une hostie (le pain de la messe) au père du Roi Pêcheur : il a donc un sens religieux. Mais Chrétien n’explique jamais complètement ce mystère. Vers 1200, un autre écrivain, Robert de Boron, fera du Graal le récipient utilisé par le Christ lors de son dernier repas avec ses disciples (la Cène). Chez Chrétien, ce n’est pas encore le cas : le Graal reste un objet mystérieux.',
	},
	{
		title: 'Perceval et Gauvain : deux façons d’être chevalier',
		text: 'Le roman suit deux héros très différents. Perceval part de zéro : il ne sait rien, fait des erreurs et connaît le doute. Peu à peu, il apprend ce que signifient la foi en Dieu et le mystère du Graal. Gauvain, lui, est déjà un chevalier admiré à la cour. Il accomplit de brillants exploits, combat dans des tournois et secourt des dames, mais il affronte lui aussi des accusations et des épreuves difficiles. Il promet même de chercher la lance qui saigne. Pourtant, dans la partie écrite par Chrétien, ses aventures restent surtout liées au monde des chevaliers et ne le conduisent pas au secret religieux du Graal.',
	},
	{
		title: 'La question non posée : pourquoi Perceval se tait-il devant le Graal ?',
		text: 'Le récit donne deux explications, à deux moments différents. D’abord, pendant le repas, Perceval se souvient du conseil de Gornemant : « gardez-vous de trop parler ». Il a peur d’être impoli en posant des questions. Bien plus tard, le Vendredi saint, son oncle l’ermite lui donne une explication religieuse : en partant, Perceval a fait mourir sa mère de chagrin, et cette faute l’a empêché de parler. Chrétien mêle donc une erreur de politesse et une faute morale, qui n’est révélée qu’après coup.',
	},
];

export const percevalIconography: PercevalIconographyDocument[] = [
	{
		id: 'doc-perceval-roi-pecheur',
		title: 'Perceval reçu au château du Roi Pêcheur (manuscrit copié vers 1330)',
		badge: 'Témoignage médiéval · Manuscrit du Conte du Graal (vers 1330)',
		badgeClass: 'status-medieval',
		image: {
			src: '/images/perceval/perceval-roi-pecheur-bnf-fr12577.jpg',
			alt: 'Peinture de manuscrit en deux scènes : à gauche, Perceval à cheval devant la porte du château ; à droite, Perceval assis à table avec le Roi Pêcheur',
			caption: 'Perceval arrivant au château et reçu à table par le Roi Pêcheur. Manuscrit du Conte du Graal et ses continuations, vers 1330. BnF, Français 12577, folio 18 verso.',
			width: 1640,
			height: 2507,
		},
		meta: {
			title: 'Le Conte du Graal avec continuations (BnF Français 12577, fol. 18v)',
			author: 'Enlumineur anonyme parisien (texte de Chrétien de Troyes)',
			date: 'Vers 1330 (première moitié du XIVᵉ siècle)',
			institution: 'Bibliothèque nationale de France (BnF, Département des Manuscrits)',
			identifier: 'BnF Français 12577, fol. 18v / Gallica ark:/12148/btv1b10549434x',
			identifierUrl: 'https://gallica.bnf.fr/ark:/12148/btv1b10549434x/f42.item',
			license: 'Domaine public (BnF Gallica / Wikimedia Commons)',
		},
		pedagogicalAnalysis: {
			whatItShows:
				'En haut de cette page de manuscrit, le texte est écrit en deux colonnes. En dessous, une peinture est divisée en deux scènes. À gauche, un chevalier en armure arrive à cheval devant une tour ; un personnage lui tend une épée. À droite, le chevalier mange avec un seigneur couronné, devant un grand feu, pendant qu’une servante apporte de la vaisselle.',
			textualLink:
				'Cette petite peinture (on dit une miniature) illustre un passage du roman de Chrétien de Troyes (vers 3080–3180). Perceval est accueilli au château par le Roi Pêcheur. Blessé, le roi ne peut pas se lever. Le repas mystérieux va bientôt commencer.',
			criticalLimitation:
				'Cette enluminure a été peinte vers 1330, environ 140 ans après l’écriture du roman (vers 1181–1190). Le peintre habille les personnages et décore la salle à la mode de son époque, le XIVᵉ siècle, et non comme au temps de Chrétien de Troyes.',
		},
		questions: [
			'Observe les deux scènes de la peinture : que fait Perceval à gauche, sur son cheval ? Et à droite, à table avec le roi ?',
			'Observe le texte au-dessus de l’image : comment est-il disposé sur la page ? À ton avis, pourquoi a-t-il été écrit à la main ? (Indice : l’imprimerie n’existe pas encore en Europe.)',
		],
	},
	{
		id: 'doc-cortege-graal',
		title: 'Le cortège du Graal raconté par une continuation (manuscrit copié vers 1330)',
		badge: 'Témoignage médiéval · Cortège mystérieux (vers 1330)',
		badgeClass: 'status-medieval',
		image: {
			src: '/images/perceval/cortege-graal-bnf-fr12577.jpg',
			alt: 'Peinture de manuscrit montrant le cortège du Graal : quatre porteurs avec un brancard funéraire sur lequel repose une épée brisée, un jeune homme avec la lance et une jeune fille avec le Graal',
			caption: 'Le repas chez le Roi Pêcheur et le défilé du Graal, dans la Première Continuation (une suite du Conte du Graal). Manuscrit copié vers 1330. BnF, Français 12577, folio 74 verso.',
			width: 2463,
			height: 1354,
		},
		meta: {
			title: 'Cortège du Graal dans la Première Continuation (BnF Français 12577, fol. 74v)',
			author: 'Enlumineur anonyme parisien (Première Continuation)',
			date: 'Vers 1330 (première moitié du XIVᵉ siècle)',
			institution: 'Bibliothèque nationale de France (BnF, Département des Manuscrits)',
			identifier: 'BnF Français 12577, fol. 74v / Gallica ark:/12148/btv1b10549434x',
			identifierUrl: 'https://gallica.bnf.fr/ark:/12148/btv1b10549434x/f154.item',
			license: 'Domaine public (BnF Gallica / Wikimedia Commons)',
		},
		pedagogicalAnalysis: {
			whatItShows:
				'La peinture montre deux groupes de personnages. À gauche, quatre serviteurs portent sur leurs épaules un brancard funéraire (une bière), couvert de tissu rouge, sur lequel repose une épée brisée. Au centre et à droite, un jeune homme tient une lance dressée et une jeune fille lève un vase doré à couvercle. Des invités sont assis à table, les mains jointes.',
			textualLink:
				'Cette image aide à imaginer la célèbre scène du cortège vue par Perceval (vers 3190–3310). Chez Chrétien, le héros regarde passer un objet appelé « un graal », porté par une jeune fille. Par timidité, il n’ose pas demander à qui on le sert.',
			criticalLimitation:
				'Attention : cette page n’illustre pas le texte de Chrétien de Troyes, mais la « Première Continuation », une suite écrite après sa mort par un auteur resté inconnu. C’est cette suite qui ajoute au cortège le brancard funéraire et l’épée brisée. Chez Chrétien, le cortège comprend des chandeliers, la lance qui saigne, un graal précieux et un tailloir d’argent (un plateau pour couper la viande), mais pas de brancard funéraire.',
		},
		questions: [
			'Quels objets sont transportés dans ce défilé ? Que vois-tu sur le brancard, à gauche, et dans les mains des jeunes gens ?',
			'Observe les invités assis à table : que font-ils avec leurs mains ? Que montre ce geste sur les objets qui passent devant eux ?',
		],
	},
	{
		id: 'doc-chevalier-westminster',
		title: 'L’équipement d’un chevalier au XIIIᵉ siècle (Psautier de Westminster)',
		badge: 'Témoignage médiéval · Équipement du chevalier (vers 1250)',
		badgeClass: 'status-medieval',
		image: {
			src: '/images/perceval/chevalier-psautier-westminster.jpg',
			alt: 'Dessin médiéval d’un chevalier en cotte de mailles, agenouillé devant son cheval ; en haut, depuis les créneaux d’une tour, un écuyer tient son casque',
			caption: 'Chevalier en cotte de mailles, à genoux pour promettre fidélité à son seigneur. Psautier de Westminster, Angleterre, vers 1250. British Library, Royal MS 2 A XXII, folio 220 recto.',
			width: 977,
			height: 1500,
		},
		meta: {
			title: 'Kneeling knight rendering homage (Westminster Psalter, fol. 220r)',
			author: 'Artiste anonyme de l’abbaye de Westminster (Angleterre)',
			date: 'Vers 1250 (milieu du XIIIᵉ siècle)',
			institution: 'British Library, Londres (Royaume-Uni)',
			identifier: 'British Library Royal MS 2 A XXII, f. 220r',
			identifierUrl: 'https://www.bl.uk/manuscripts/Viewer.aspx?ref=royal_ms_2_a_xxii_fs001r',
			license: 'Domaine public (British Library / CC0 Wikimedia Commons)',
		},
		pedagogicalAnalysis: {
			whatItShows:
				'On voit un chevalier à genoux, les mains tendues en avant. Il porte un haubert : une cotte de mailles, c’est-à-dire un vêtement fait de petits anneaux de fer, qui protège son corps et sa tête. Il a aussi une tunique ornée de croix, une épée et des éperons pointus. Son cheval se tient derrière lui. En haut à droite, depuis les créneaux d’une tour, un écuyer (le jeune serviteur d’un chevalier) lui tend son heaume, un grand casque de métal. D’après la British Library, qui conserve ce document, le chevalier rend hommage à un roi peint sur la page précédente : il lui promet sa fidélité.',
			textualLink:
				'Cette image ne représente pas Perceval. Elle permet de comparer le roman avec l’équipement réel des chevaliers du Moyen Âge. Quand Perceval voit des chevaliers pour la première fois dans la forêt (vers 110–180), leurs armes et leurs casques brillent tellement qu’il les prend pour des anges de Dieu.',
			criticalLimitation:
				'Ce dessin vient d’un livre de prières anglais (un psautier, qui rassemble les psaumes de la Bible). Il montre un chevalier qui promet fidélité à un roi, et non une scène du roman. Réalisé plus de 60 ans après le roman de Chrétien, il donne une idée concrète de l’équipement des chevaliers, sans raconter l’histoire de Perceval.',
		},
		questions: [
			'Retrouve sur l’image l’équipement du chevalier : le haubert (la cotte de mailles), l’épée, les éperons et le heaume tenu par l’écuyer.',
			'Observe la position du chevalier : il est à genoux, les mains tendues en avant. Que montre ce geste envers son seigneur ?',
		],
	},
	{
		id: 'doc-adoubement-bnf-fr73',
		title: 'Comment devient-on chevalier ? Une cérémonie d’adoubement (début du XVᵉ siècle)',
		badge: 'Témoignage médiéval · Cérémonie de chevalerie (vers 1400–1405)',
		badgeClass: 'status-medieval',
		image: {
			src: '/images/perceval/adoubement-chevaliers-bnf-fr73.jpg',
			alt: 'Peinture de manuscrit montrant le roi Jean II le Bon qui fait chevaliers des jeunes hommes agenouillés en les touchant de son épée (la colée)',
			caption: 'Le roi de France Jean II le Bon adoubant des chevaliers avec son épée. Grandes Chroniques de France, vers 1400–1405. BnF, Français 73, folio 386.',
			width: 2048,
			height: 2479,
		},
		meta: {
			title: 'Jean II le Bon adoubant des chevaliers (Grandes Chroniques de France, fol. 386)',
			author: 'Atelier parisien de miniaturistes (début du XVᵉ siècle)',
			date: 'Vers 1400–1405 (début du XVᵉ siècle)',
			institution: 'Bibliothèque nationale de France (BnF, Département des Manuscrits)',
			identifier: 'BnF Français 73, fol. 386 / Gallica ark:/12148/btv1b8100014c',
			identifierUrl: 'https://gallica.bnf.fr/ark:/12148/btv1b8100014c/f786.item',
			license: 'Domaine public (BnF Gallica / Wikimedia Commons)',
		},
		pedagogicalAnalysis: {
			whatItShows:
				'Cette peinture vient des Grandes Chroniques de France, un livre qui raconte l’histoire des rois de France. Elle montre le roi Jean II le Bon le jour de son sacre, en 1350. Il porte un manteau bleu couvert de fleurs de lys dorées. Il lève son épée pour donner un coup symbolique (la colée) sur l’épaule de trois nouveaux chevaliers, agenouillés devant lui en robe bleue.',
			textualLink:
				'Cette image aide à comprendre l’adoubement, la cérémonie qui fait d’un jeune homme un chevalier. Perceval la reçoit de son maître Gornemant de Goort (vers 1630–1645). Gornemant lui attache l’éperon, lui attache l’épée à la ceinture et lui conseille d’épargner un ennemi vaincu qui demande grâce.',
			criticalLimitation:
				'Cette scène ne représente pas Perceval. C’est une cérémonie à la cour des rois de France, peinte plus de deux siècles après le roman de Chrétien de Troyes. À cette époque, l’adoubement royal est devenu une grande fête politique, bien plus riche que l’adoubement simple raconté dans le roman.',
		},
		questions: [
			'Quel geste le roi fait-il avec son épée au-dessus des jeunes hommes agenouillés devant lui ?',
			'Relis la fiche de Gornemant : quels gestes fait-il pour adouber Perceval ? Lesquels retrouves-tu, ou non, sur cette image ?',
		],
	},
	{
		id: 'doc-graal-table-ronde-bnf-fr112',
		title: 'Le Graal apparaît à la Table ronde : une version de la légende écrite plus tard (image de 1470)',
		badge: 'Légende du Graal écrite plus tard · Table ronde (1470)',
		badgeClass: 'status-tardif',
		image: {
			src: '/images/perceval/graal-table-ronde-bnf-fr112.jpg',
			alt: 'Grande peinture de manuscrit de 1470 : les chevaliers de la Table ronde, réunis autour du roi Arthur, voient apparaître le Graal, un vase doré porté par deux anges',
			caption: 'Apparition du Saint Graal aux compagnons de la Table ronde. Enluminure d’Évrard d’Espinques, 1470. BnF, Français 112, tome III, folio 5 recto.',
			width: 4996,
			height: 7138,
		},
		meta: {
			title: 'Apparition du Saint Graal à la Table ronde (La Queste del Saint-Graal, BnF Fr. 112, t. III, fol. 5r)',
			author: 'Évrard d’Espinques (enlumineur pour Jacques d’Armagnac)',
			date: '1470 (fin du XVᵉ siècle)',
			institution: 'Bibliothèque nationale de France (BnF, Département des Manuscrits)',
			identifier: 'BnF Français 112 (3), fol. 5r / Gallica ark:/12148/btv1b8527589h',
			identifierUrl: 'https://gallica.bnf.fr/ark:/12148/btv1b8527589h/f13.item',
			license: 'Domaine public (BnF Gallica / Wikimedia Commons)',
		},
		pedagogicalAnalysis: {
			whatItShows:
				'On voit le roi Arthur et ses chevaliers assis autour d’une grande table ronde couverte d’une nappe blanche. Le nom de chaque chevalier est peint au-dessus de sa place. Au centre, entourés de rayons d’or, deux anges portent un vase d’or couvert d’un voile blanc. Selon la BnF, qui conserve ce manuscrit, cette page montre le Graal qui apparaît aux chevaliers le jour de la Pentecôte, une fête chrétienne.',
			textualLink:
				'Cette image illustre un autre roman, écrit plus tard : la Quête du Saint Graal, en prose (vers 1225–1230). Dans ce roman, tous les compagnons d’Arthur jurent de partir à la recherche du Graal. La quête personnelle de Perceval devient alors une mission religieuse partagée par tous les chevaliers.',
			criticalLimitation:
				'Attention : cette scène n’existe pas dans le roman de Chrétien de Troyes. Chez lui, le Graal n’apparaît jamais à la cour d’Arthur et n’est pas porté par des anges. C’est un objet mystérieux, porté par une jeune fille dans le château du Roi Pêcheur, et Chrétien n’explique pas complètement son sens religieux.',
		},
		questions: [
			'Regarde le centre de la table : qui porte l’objet sacré ? Comment le peintre montre-t-il que cet objet est extraordinaire ?',
			'Compare avec le cortège raconté par Chrétien : qui porte le Graal, et où la scène se passe-t-elle dans chaque cas ?',
		],
	},
	{
		id: 'doc-wyeth-percival-1922',
		title: 'Perceval imaginé au XXᵉ siècle par N. C. Wyeth (peint en 1917, publié en 1922)',
		badge: 'Reconstitution moderne · Illustration du XXᵉ siècle (1922)',
		badgeClass: 'status-moderne',
		image: {
			src: '/images/perceval/wyeth-percival-1922.jpg',
			alt: 'Peinture de N. C. Wyeth : un chevalier en armure d’argent, sur un cheval noir, lève le bras vers le ciel au bord d’une mer agitée, sous un ciel étoilé',
			caption: 'Sir Percival levant le bras au bord d’une mer agitée, sous un ciel d’orage étoilé. Peinture à l’huile de N. C. Wyeth (1917, publiée en 1922).',
			width: 1580,
			height: 2004,
		},
		meta: {
			title: 'When Sir Percival came nigh unto the brim (The Boy’s King Arthur, p. 214)',
			author: 'Newell Convers Wyeth (1882–1945), peintre et illustrateur américain',
			date: '1917 (création) / 1922 (édition Charles Scribner’s Sons)',
			institution: 'Collection Scribner’s Illustrated Classics / Musée Brandywine / Wikimedia Commons',
			identifier: 'The Boy’s King Arthur (New York, Charles Scribner’s Sons, 1922, p. 214)',
			identifierUrl: 'https://commons.wikimedia.org/wiki/File:Boys_King_Arthur_-_N._C._Wyeth_-_p214.jpg',
			license: 'Domaine public (publié aux États-Unis avant 1929)',
		},
		pedagogicalAnalysis: {
			whatItShows:
				'Cette peinture américaine montre un chevalier en armure d’acier brillante et en cape rouge. Monté sur un cheval noir, il se tient au bord de rochers battus par les vagues. Il lève le bras vers un ciel de nuit, plein d’étoiles et de nuages menaçants.',
			textualLink:
				'Cette image n’illustre pas le roman de Chrétien, mais une version anglaise de la légende du roi Arthur, inspirée du livre de Thomas Malory (XVᵉ siècle). Elle fait ressentir la solitude de Perceval quand il erre dans des régions inconnues et affronte ses doutes.',
			criticalLimitation:
				'Cette peinture a été réalisée en 1917 pour un livre destiné aux jeunes lecteurs. C’est une reconstitution moderne : le peintre imagine le Moyen Âge. L’armure faite de plaques d’acier qui couvrent tout le corps date de la fin du Moyen Âge ; au temps de Chrétien, les chevaliers portaient le haubert de mailles. Le décor spectaculaire vient du goût des XIXᵉ et XXᵉ siècles pour les grandes aventures, et non du roman du XIIᵉ siècle.',
		},
		questions: [
			'Compare cette peinture avec l’enluminure du manuscrit de 1330 (image 1) : couleurs, décor, armure… Qu’est-ce qui rend cette scène plus spectaculaire ?',
			'D’après la fiche, pour quels lecteurs cette image a-t-elle été peinte, et en quelle année ? Que montre-t-elle sur la célébrité de Perceval au XXᵉ siècle ?',
		],
	},
];
