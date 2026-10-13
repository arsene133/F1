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

export const percevalSequences: NarrativeSequence[] = [
	{
		id: 'enfance-foret',
		title: '1. L’enfance dans la « Gaste Forêt »',
		cycle: 'perceval',
		summary:
			'Perceval grandit seul dans la forêt avec sa mère, sans rien connaître du monde ni des chevaliers. Un jour, il croise des chevaliers en armure et les prend pour des anges de Dieu. Il décide aussitôt de partir vers la cour du roi Arthur, malgré les larmes de sa mère qui tente de le retenir.',
		verses: 'vers 69–634',
		keyFigure: 'La mère de Perceval',
	},
	{
		id: 'chevalier-vermeil',
		title: '2. L’arrivée chez le roi Arthur et le Chevalier Vermeil',
		cycle: 'perceval',
		summary:
			'Perceval arrive à la cour du roi Arthur habillé comme un paysan naïf. Il réclame l’armure rouge du Chevalier Vermeil, un ennemi qui vient d’insulter le roi. Sans connaître le combat des chevaliers, Perceval tue son adversaire avec un javelot de chasse et enfile ses armes de fer.',
		verses: 'vers 865–1304',
		keyFigure: 'Le Chevalier Vermeil & le roi Arthur',
	},
	{
		id: 'apprentissage-gornemant',
		title: '3. L’apprentissage des armes chez Gornemant de Goort',
		cycle: 'perceval',
		summary:
			'Un noble seigneur, Gornemant de Goort, accueille Perceval dans son château. En une journée, il lui apprend à monter à cheval, manier l’épée et respecter les règles des chevaliers : épargner un ennemi vaincu, protéger les femmes et ne pas trop parler. Il l’adoube chevalier.',
		verses: 'vers 1357–1698',
		keyFigure: 'Gornemant de Goort',
	},
	{
		id: 'beaurepaire-blanchefleur',
		title: '4. La défense de Blanchefleur au château de Beaurepaire',
		cycle: 'perceval',
		summary:
			'Perceval arrive au château de Beaurepaire, assiégé par des ennemis. La jeune châtelaine, Blanchefleur, lui demande son aide. Perceval combat ses agresseurs, sauve le domaine de la famine et s’attache tendrement à la jeune femme avant de repartir pour revoir sa mère.',
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
			'Dans la forêt, une cousine en larmes lui apprend que sa mère est morte de chagrin au moment de son départ, et lui reproche son silence au château. Plus tard, à la cour d’Arthur, une messagère au visage très laid maudit publiquement Perceval : sa question aurait pu guérir le roi. Perceval jure alors de retrouver le Graal.',
		verses: 'vers 3422–4746',
		keyFigure: 'La cousine germaine & la Demoiselle hideuse',
	},
	{
		id: 'aventures-gauvain',
		title: '7. Les aventures parallèles de Monseigneur Gauvain',
		cycle: 'gauvain',
		summary:
			'Pendant que Perceval cherche le Graal, le roman raconte les aventures de Gauvain, le meilleur chevalier d’Arthur. Accusé à tort de trahison, Gauvain voyage pour prouver son honneur : il combat dans des tournois, surmonte des épreuves magiques et montre son courage dans le monde des nobles.',
		verses: 'vers 4747–6216 & 6519–9234',
		keyFigure: 'Gauvain',
	},
	{
		id: 'vendredi-saint-ermite',
		title: '8. La rencontre avec l’ermite le Vendredi saint',
		cycle: 'perceval',
		summary:
			'Après cinq années d’errance sans prier Dieu, Perceval rencontre des pèlerins qui le conduisent chez un ermite dans les bois. Cet homme saint est son oncle maternel : il lui explique que son péché d’avoir causé la mort de sa mère lui a fermé la bouche devant le Graal. L’ermite lui pardonne et le réconcilie avec Dieu.',
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
			'Héros du roman. Sa mère l’a élevé seul dans une forêt sauvage pour lui cacher l’existence des chevaliers, après la mort au combat de son père et de ses deux frères. Très naïf au départ, il apprend le métier des armes auprès de Gornemant et libère le château de Blanchefleur. Invité chez le Roi Pêcheur, il voit passer le Graal et la lance qui saigne mais n’ose poser aucune question, car il craint de paraître impoli. L’ermite lui apprendra plus tard que son silence est lié à la faute d’avoir causé la mort de sa mère.',
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
			'Veuve d’un vaillant chevalier et endeuillée par la mort de ses deux fils aînés à la guerre, elle élève Perceval à l’écart de tous les dangers. Elle lui donne des conseils de sagesse avant son départ. Quand Perceval s’éloigne au galop sans se retourner, elle s’effondre de chagrin et meurt. L’ermite explique plus tard que cette douleur causée à sa mère a pesé sur Perceval et l’a empêché de parler devant le Graal.',
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
			'Le roman ne leur donne aucun prénom. Le père, un très vaillant chevalier, a été blessé aux jambes pendant des guerres féodales, a perdu ses biens et est mort de douleur dans la forêt. Les deux frères aînés de Perceval ont été armés chevaliers puis ont été tués au combat le même jour. Cette disparition tragique explique pourquoi la mère a voulu cacher Perceval dans les bois.',
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
			'Noble seigneur expérimenté, il accueille Perceval et comprend vite que le jeune homme possède une force extraordinaire mais ne sait pas se battre. En une seule journée, il lui montre comment monter à cheval, tenir son bouclier et manier l’épée. Il le fait officiellement chevalier (adoubement) et lui donne des conseils moraux : faire grâce à un ennemi qui demande pardon, secourir les dames en danger et ne pas parler à tort et à travers.',
		points: [
			'Enseigne à Perceval le combat à cheval et l’escrime médiévale (vers 1420–1530)',
			'Adoube Perceval en lui attachant son éperon et en lui remettant son épée (vers 1630–1640)',
			'Lui donne le conseil de modération : « gardez-vous de trop parler » (vers 1648–1656)',
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
		eyebrow: 'Cour royale · modèle de la royauté chevaleresque',
		meta: ['roi des Bretons', 'cour de Carduel', 'accueille les chevaliers'],
		description:
			'Souverain légendaire autour duquel se réunissent les meilleurs chevaliers. Quand Perceval arrive à la cour, Arthur est attristé par l’insolence du Chevalier Vermeil qui a renversé une coupe de vin sur la reine. Malgré les habits de paysan de Perceval, Arthur devine sa valeur et le traite avec gentillesse. Plus tard, admiratif des exploits de Perceval, Arthur fait lever toute sa cour pour partir à sa recherche.',
		points: [
			'Reçoit Perceval avec bienveillance à la cour de Carduel (vers 910–960)',
			'Reproche à Keu de s’être moqué du jeune homme et d’avoir giflé une servante (vers 1010–1040)',
			'Part avec ses barons à la recherche de Perceval dans la neige (vers 4140–4450)',
			'Accueille la Demoiselle hideuse lors de la grande fête de la Pentecôte (vers 4610–4750)',
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
			'Sénéchal du roi Arthur (chargé de l’intendance du château), connu pour son caractère agressif et ses moqueries. Il se rit de la naïveté de Perceval et l’envoie affronter le Chevalier Vermeil en espérant qu’il s’y fasse tuer. Plus tard, Perceval le combat lors d’un tournoi improvisé sur la neige et lui brise le bras, vengeant ainsi les moqueries passées.',
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
		eyebrow: 'Parcours parallèle · les exploits du héros courtois',
		meta: ['neveu d’Arthur', 'héros de la seconde moitié du roman', 'champion exemplaire'],
		description:
			'Neveu d’Arthur et champion le plus courtois de la Table ronde. Alors que Keu se bat avec violence contre Perceval, Gauvain use de douceur et de diplomatie pour lui parler. Chrétien de Troyes accorde une très grande place aux aventures de Gauvain dans la seconde moitié du livre : accusé à tort de trahison, Gauvain accomplit de nombreux exploits dans les tournois et les châteaux enchantés. Son parcours montre la gloire des chevaliers dans le monde, en contraste avec la quête plus spirituelle et religieuse de Perceval.',
		points: [
			'Parle avec politesse à Perceval lors de la scène des gouttes de sang sur la neige (vers 4430–4550)',
			'Accusé publiquement de trahison, il part défendre son honneur (vers 4750–4790)',
			'Multiplie les combats d’armes et les exploits au fil de ses voyages',
			'Triomphe des épreuves du Château des Reines (le Lit de la Merveille)',
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
			'Jeune dame assiégée dans sa forteresse de Beaurepaire par des chevaliers ennemis. En larmes, elle vient demander secours à Perceval pendant la nuit. Perceval relève le défi, combat ses ennemis un par un et délivre le château. Un amour sincère et délicat naît entre eux. Plus tard, en voyant trois gouttes de sang rouge tombées sur la neige blanche, Perceval reste immobile à penser au visage éclatant de Blanchefleur.',
		points: [
			'Vient implorer en larmes l’aide de Perceval dans sa chambre (vers 1960–2050)',
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
			'Mystérieux seigneur que Perceval rencontre d’abord sur une rivière, en train de pêcher depuis une barque parce qu’une blessure entre les cuisses l’empêche de monter à cheval. Il invite Perceval dans son riche château, lui offre une épée magnifique et préside le repas du soir. Pendant ce repas défile le cortège avec la lance qui saigne et le plat précieux (« un graal »). Si Perceval avait posé la question sur ce cortège, le roi aurait été guéri.',
		points: [
			'Indique à Perceval le chemin de son château depuis sa barque (vers 3000–3060)',
			'Accueille le jeune homme allongé près d’un grand feu et lui fait cadeau d’une épée (vers 3080–3180)',
			'Regarde passer le cortège sans que Perceval ne pose la moindre question (vers 3190–3310)',
			'Son père, retiré dans une pièce voisine, est nourri grâce à une hostie apportée dans le Graal (vers 6420–6430)',
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
		caption: 'frère de la mère · guide spirituel dans les bois',
		eyebrow: 'Pardon et foi · explique le secret du silence',
		meta: ['oncle maternel de Perceval', 'homme saint vivant en ermite', 'frère de la mère'],
		description:
			'Homme saint qui vit retiré dans les bois pour prier Dieu. C’est le frère de la mère de Perceval. Quand Perceval, après cinq années passées loin de la foi, vient le voir le jour du Vendredi saint, l’ermite lui révèle la vérité : c’est le péché d’avoir causé la mort de sa mère qui l’a empêché de parler devant le Graal. L’ermite confesse Perceval, lui enseigne des prières et le réconcilie avec Dieu.',
		points: [
			'Accueille Perceval conduit par des pèlerins le Vendredi saint (vers 6330–6370)',
			'Révèle à Perceval qu’il est son oncle et que le Roi Pêcheur est son cousin (vers 6415–6434)',
			'Explique que la faute envers sa mère est la cause religieuse de son silence au château (vers 6392–6414)',
			'Lui donne des conseils chrétiens et lui fait faire pénitence (vers 6480–6515)',
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
		eyebrow: 'Élément narratif mystérieux · l’objet de la question non posée',
		meta: ['plat ou vase précieux', 'en or fin · porte une hostie', 'clarté éblouissante'],
		description:
			'Dans le roman de Chrétien de Troyes, le mot désigne un plat large ou un vase en or pur, orné de pierres précieuses éclatantes. Porté par une jeune fille lors du repas chez le Roi Pêcheur, il brille tellement qu’il efface la lumière des bougies. Il sert à porter une hostie (le pain consacré lors de la messe) au père du Roi Pêcheur. La question que Perceval ne pose pas (« À qui sert-on le Graal ? ») est l’épreuve principale de son aventure.',
		points: [
			'Apparaît dans le repas avec une lumière extraordinaire (vers 3220–3240)',
			'Fait d’or pur et orné de joyaux très rares (vers 3232–3239)',
			'Contient une hostie qui nourrit le vieux roi depuis douze ans (vers 6422–6428)',
			'Dans le texte de Chrétien, on dit d’abord « un graal » avant que les légendes tardives n’en fassent une coupe unique',
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
			'Arme portée par un jeune valet au début du cortège chez le Roi Pêcheur. Une goutte de sang rouge coule sans interruption de sa pointe en fer blanc jusqu’à la main du porteur. Perceval est fasciné par ce spectacle, mais il garde le silence et n’ose pas demander pourquoi cette arme saigne.',
		points: [
			'Ouvre la marche du cortège, portée par les deux mains d’un valet (vers 3190–3200)',
			'Une goutte de sang rouge coule en continu de la pointe blanche (vers 3198–3205)',
			'Étonne Perceval, qui s’abstient d’interroger son hôte par respect des consignes (vers 3206–3215)',
			'Deviendra dans des récits plus tardifs la lance du centurion ayant blessé le Christ',
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
		caption: 'jeune fille rencontrée sous un chêne · révèle le nom de Perceval',
		eyebrow: 'Rencontre dans la forêt · premiers reproches sur le silence',
		meta: ['cousine de Perceval', 'pleure son ami mort', 'lui dit son vrai nom'],
		description:
			'Perceval la rencontre dans les bois le lendemain de sa visite au château du Graal. Elle pleure son ami chevalier qui vient d’être tué. Elle devine le nom de Perceval (« Perceval le Gallois ») et lui annonce la mort de sa mère. Quand elle découvre que Perceval a vu le cortège sans poser de question, elle lui reproche très sévèrement son silence et annonce de grands malheurs pour le royaume.',
		points: [
			'Révèle à Perceval son véritable nom : « Perceval le Gallois » (vers 3570–3575)',
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
			'Messagère au visage monstrueux qui surgit à la cour du roi Arthur montée sur une mule. Devant tous les chevaliers réunis, elle accuse Perceval de lâcheté : s’il avait posé les questions au château, le Roi Pêcheur aurait retrouvé sa santé et ses terres la prospérité. Ses reproches relancent Perceval dans une longue quête pour retrouver le Graal.',
		points: [
			'Fait irruption devant le roi Arthur et ses chevaliers (vers 4610–4645)',
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
		legend: 'Lien familial (parenté)',
		stroke: '#8b572a',
		activeStroke: '#5a3517',
		width: 2.2,
		dash: '1.5 4',
		arrow: 'end',
	},
	chevaleresque: {
		legend: 'Lien chevaleresque (armes, adoubement, cour)',
		stroke: '#235284',
		activeStroke: '#172b3a',
		width: 2.2,
		dash: 'none',
		arrow: 'end',
	},
	affectif: {
		legend: 'Lien affectif (amour courtois)',
		stroke: '#c98a84',
		activeStroke: '#a2312b',
		width: 2.2,
		dash: '8 4',
		arrow: 'end',
	},
	narratif: {
		legend: 'Rencontre narrative (épreuve, crise, reproche)',
		stroke: '#6a4c93',
		activeStroke: '#462b66',
		width: 2,
		dash: '4 3',
		arrow: 'end',
	},
	spirituel: {
		legend: 'Lien spirituel ou initiatique (confession, révélation)',
		stroke: '#5f6b2f',
		activeStroke: '#3a441a',
		width: 2.4,
		dash: '10 2 2 2',
		arrow: 'end',
	},
	mystique: {
		legend: 'Lien à un élément ou objet sacré (Graal, lance)',
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
			'Le mari blessé à la guerre et mort de douleur, et les deux fils aînés tués le même jour après être devenus chevaliers. Ce drame familial explique pourquoi la mère a voulu cacher Perceval dans une forêt isolée.',
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
			'Elle est la fille du frère de la mère de Perceval. Ils ont grandi un temps ensemble. Elle le reconnaît dans la forêt, lui apprend son vrai nom (« Perceval le Gallois ») et lui annonce la mort de sa mère.',
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
			'L’ermite est le frère de la mère de Perceval. Cette parenté familiale lui permet d’accueillir son neveu avec douceur, d’écouter sa confession et de lui accorder le pardon de Dieu.',
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
			'Keu est un officier important du roi Arthur chargé du service du palais. Mais il est violent et désagréable : il blesse les invités avec ses paroles méchantes et provoque des disputes à la cour.',
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
			'Gornemant apprend à Perceval comment se battre à cheval et manier l’épée. Il le fait officiellement chevalier et lui conseille de ne pas être trop bavard (« gardez-vous de trop parler »). Perceval appliquera ce conseil sans nuance chez le Roi Pêcheur.',
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
		label: 'amitié & aventures en miroir',
		direction: 'both',
		description:
			'Gauvain parle à Perceval avec beaucoup de politesse et le ramène en ami auprès du roi Arthur. Chrétien de Troyes raconte ensuite les aventures des deux héros côte à côte : Perceval cherche le sens du Graal tandis que Gauvain accomplit de brillants exploits de chevalier.',
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
			'Par peur de paraître impoli et parce qu’il se souvient du conseil de Gornemant (« ne parlez pas trop »), Perceval ne demande rien sur la lance qui saigne ni sur le Graal. Ce silence laisse le roi infirme, ce que la cousine et la Demoiselle hideuse lui reprocheront ensuite très durement.',
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
			'Pendant le repas, le Graal passe pour porter une hostie (pain consacré) au père du Roi Pêcheur, qui vit retiré dans une pièce voisine depuis douze ans. Cet aliment le maintient en vie.',
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
			'Perceval voit un valet porter une lance blanche dont la pointe laisse couler une goutte de sang rouge. Trop timide, il n’ose pas demander pourquoi cette arme saigne.',
		labelDx: 35,
		labelDy: 30,
	},

	// Crises, malédictions et conversion spirituelle
	{
		id: 'cousine-perceval-reproche',
		source: 'cousine-germaine',
		target: 'perceval',
		type: 'narratif',
		label: 'lui dit son nom & le dispute',
		description:
			'La cousine apprend à Perceval son véritable nom et lui annonce la mort de sa mère. Elle lui reproche amèrement d’être resté muet au château du Graal, lui prédisant de grands malheurs.',
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
			'Devant tous les chevaliers d’Arthur, la Demoiselle hideuse crie que Perceval a commis une faute impardonnable en ne posant pas de question : le Roi Pêcheur reste malade et le pays connaîtra la guerre.',
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
			'Le jour du Vendredi saint, l’ermite explique à Perceval pourquoi il n’a pas pu parler : le péché d’avoir causé la mort de sa mère l’a paralysé au château. L’ermite le confesse, lui apprend à prier et lui redonne la paix avec Dieu.',
		labelDx: 35,
		labelDy: -15,
		mLabelDx: 20,
		mLabelDy: -10,
		mobileLabel: true,
	},
];

export const percevalFunctions: Record<string, string> = {
	perceval: 'Héros de l’histoire · jeune homme ignorant qui devient chevalier puis cherche le pardon de Dieu',
	'mere-perceval': 'Mère aimante et protectrice · tente de cacher le monde à son fils et meurt de douleur à son départ',
	'pere-et-freres': 'Mémoire de la famille · vaillants chevaliers tués à la guerre avant le début de l’histoire',
	gornemant: 'Maître d’armes · apprend à Perceval à manier l’épée et lui conseille de ne pas trop parler',
	arthur: 'Le grand roi légendaire · accueille Perceval avec bienveillance et maintient l’honneur de la cour',
	keu: 'Provocateur de la cour · officier moqueur qui insulte Perceval avant d’être puni en combat',
	gauvain: 'Chevalier modèle · neveu d’Arthur dont les exploits brillants complètent le parcours de Perceval',
	blanchefleur: 'Amie et amour de Perceval · jeune châtelaine secourue dont le souvenir inspire le héros',
	'roi-pecheur': 'Seigneur blessé · maître du château mystérieux qui attend d’être guéri par une question',
	ermite: 'Guide spirituel dans les bois · oncle qui explique la cause religieuse du silence et réconcilie Perceval avec Dieu',
	graal: 'Objet précieux et mystérieux · plat d’or brillant portant une hostie, au cœur de la question non posée',
	'lance-qui-saigne': 'Arme extraordinaire · lance blanche dont le fer laisse couler une goutte de sang sans s’arrêter',
	'cousine-germaine': 'Jeune fille sous un chêne · révèle à Perceval son vrai nom et lui reproche son silence au château',
	'demoiselle-hideuse': 'Messagère à la cour · accuse publiquement Perceval devant les chevaliers et relance la quête',
};

export const didacticNotes: DidacticNote[] = [
	{
		title: 'Un roman inachevé et une œuvre pionnière',
		text: 'Chrétien de Troyes a composé ce roman à la fin du XIIᵉ siècle (les spécialistes proposent vers 1181–1190, sans certitude absolue), pour son protecteur Philippe d’Alsace, comte de Flandre. Le texte s’arrête brusquement au vers 9234 en plein milieu d’une aventure de Gauvain, probablement parce que l’auteur est mort avant d’avoir pu le terminer. Chrétien n’a donc jamais écrit la fin des aventures de Perceval ni la guérison du Roi Pêcheur. D’autres écrivains du XIIIᵉ siècle ont imaginé la suite de l’histoire : ce sont les continuations, écrites après sa mort.',
	},
	{
		title: 'Nature du Graal chez Chrétien de Troyes',
		text: 'Dans ce livre, le mot « graal » est d’abord un nom ordinaire : Chrétien écrit « un graal ». Il s’agit d’un plat large ou d’un vase précieux en or pur, orné de pierres brillantes, qui sert à porter une hostie (le pain de la messe) au père du Roi Pêcheur. Le mot vient très probablement du latin médiéval gradalis (un plat de table pour les mets précieux), sans que cette origine soit certaine à 100 %. Ce n’est que plus tard, vers 1200, qu’un autre écrivain, Robert de Boron, transformera le Graal en coupe sainte du Christ (le calice de la Cène). Chez Chrétien, la scène mélange merveilleux et religion sans explication complète.',
	},
	{
		title: 'La dialectique des deux héros : Perceval et Gauvain',
		text: 'Le roman met en scène deux héros très différents. D’un côté, Perceval part de l’ignorance complète : il fait des erreurs, traverse le doute et apprend peu à peu ce que signifient la foi en Dieu et le mystère du Graal. De l’autre côté, Monseigneur Gauvain est déjà le chevalier parfait de la cour : il accomplit de brillants exploits, gagne des tournois et délivre des dames, mais son aventure reste liée au monde des chevaliers sans atteindre le secret religieux du Graal.',
	},
	{
		title: 'La question non posée : conseil de courtoisie et interprétation spirituelle',
		text: 'Pourquoi Perceval garde-t-il le silence au château du Roi Pêcheur ? Le récit donne deux explications successives. Pendant le repas, Perceval se souvient simplement du conseil de Gornemant (« gardez-vous de trop parler ») et craint de paraître impoli en posant des questions indiscrètes. Bien plus tard, le jour du Vendredi saint, son oncle l’ermite lui donne une explication religieuse : sa faute d’avoir fait mourir sa mère de chagrin en partant a pesé sur son cœur et l’a empêché de parler. Chrétien associe ainsi une maladresse de politesse et une faute morale révélée après coup.',
	},
];
