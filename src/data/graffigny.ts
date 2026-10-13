import type { EdgeType, MapLink, MapNode, MapRelationship } from '../components/relationship-map/types';

// ==========================================================================
// Données de la page Lettres d'une Péruvienne de Françoise de Graffigny (/graffigny)
//
// Texte de référence : édition originale de 1747 (38 lettres), transcription
// validée de Wikisource. Les numéros de lettres sont ceux de 1747 ; quand
// l'édition augmentée de 1752 (41 lettres) les décale, les deux sont donnés
// (voir `letterRef`). Les citations reproduisent l'orthographe de 1747 ; les
// appels de notes de l'édition sont omis. Les passages propres à 1752
// (lettres XXIX et XXXIV, ajouts de la lettre XXVIII) sont résumés, non cités.
// ==========================================================================

/** Chiffres romains (lettres I à XLI). */
export function roman(n: number): string {
	const table: [number, string][] = [
		[40, 'XL'],
		[10, 'X'],
		[9, 'IX'],
		[5, 'V'],
		[4, 'IV'],
		[1, 'I'],
	];
	let out = '';
	for (const [value, symbol] of table) {
		while (n >= value) {
			out += symbol;
			n -= value;
		}
	}
	return out;
}

/**
 * Numéro 1752 d'une lettre de 1747. Jusqu'à XXVII, la numérotation est la
 * même ; la lettre XXVIII de 1747 est scindée et augmentée (XXVIII et XXX en
 * 1752), une lettre XXIX nouvelle s'intercale, puis une lettre XXXIV nouvelle.
 */
export function letter1752(n1747: number): number[] {
	if (n1747 <= 27) return [n1747];
	if (n1747 === 28) return [28, 30];
	if (n1747 <= 30) return [n1747 + 2];
	return [n1747 + 3];
}

/** Référence lisible : « lettre XII » ou « lettre XXXV (1752 : XXXVIII) ». */
export function letterRef(n1747: number): string {
	const later = letter1752(n1747);
	if (later.length === 1 && later[0] === n1747) return `lettre ${roman(n1747)}`;
	return `lettre ${roman(n1747)} (1752 : ${later.map(roman).join(' et ')})`;
}

export interface Quote {
	text: string;
	/** Numéro de la lettre dans l'édition de 1747 ; 0 : Avertissement. */
	letter: number;
	/** Locuteur, si ce n'est pas Zilia qui écrit. */
	speaker?: string;
}

export const quoteRef = (q: Quote) =>
	(q.letter === 0 ? 'Avertissement' : letterRef(q.letter)) + (q.speaker ? `, ${q.speaker}` : '');

// --------------------------------------------------------------------------
// Repères et citations
// --------------------------------------------------------------------------

export const keyFacts = [
	{ label: 'Autrice', value: 'Françoise de Graffigny (1695-1758)' },
	{ label: 'Publication', value: '1747, anonyme ; édition augmentée en 1752' },
	{ label: 'Genre', value: 'Roman épistolaire (38 lettres en 1747, 41 en 1752)' },
	{ label: 'Mouvement', value: 'Les Lumières' },
	{ label: 'Parcours', value: '« Un nouvel univers s’est offert à mes yeux »' },
];

/** Citations exactes (texte de 1747), contrôlées sur la transcription Wikisource. */
export const quotes = {
	templeSaccage: {
		text: 'Les pavés du Temple ensanglantés ; l’image du Soleil foulée aux pieds ; nos Vierges éperduës, fuyant devant une troupe de soldats furieux qui massacroient tout ce qui s’opposoit à leur passage',
		letter: 1,
	},
	larcin: { text: 'Je jugeai que le larcin étoit le motif de leur barbarie', letter: 1 },
	neant: { text: 'Si tu étois un homme ordinaire, je serois restée dans le néant, où mon sexe est condamné.', letter: 2 },
	noeuds: {
		text: 'ces nœuds qui frappent mes sens, semblent donner plus de réalité à mes pensées',
		letter: 4,
	},
	ameLangues: { text: 'L’intelligence des Langues seroit-elle celle de l’ame ?', letter: 9 },
	nomCacique: {
		text: 'Je sçais que le nom du Cacique est Déterville, celui de notre maison flottante vaisseau, & celui de la terre où nous allons, France.',
		letter: 9,
	},
	miroir: { text: 'elle me fit approcher de cette ingénieuse machine qui double les objets', letter: 12 },
	affectation: {
		text: 'en général je soupçonne cette nation de n’être point telle qu’elle paroît ; l’affectation me paroît son caractère dominant.',
		letter: 16,
	},
	derniersNoeuds: { text: 'je vois la fin de mes cordons, j’en touche les derniers fils, j’en noue les derniers nœuds', letter: 17 },
	langageHumain: {
		text: 'Le langage humain est sans doute de l’invention des hommes, puisqu’il differe suivant les differentes nations.',
		letter: 17,
	},
	nouvelUnivers: {
		text: 'À mesure que j’en ai acquis l’intelligence, un nouvel univers s’est offert à mes yeux. Les objets ont pris une autre forme, chaque éclaircissement m’a découvert un nouveau malheur.',
		letter: 18,
	},
	cupidite: {
		text: 'si la cupidité des Espagnols ne leur avoit fait surmonter des dangers affreux pour pénétrer jusqu’à nous',
		letter: 18,
	},
	terreOr: {
		text: 'Sans avoir de l’or, il est impossible d’acquérir une portion de cette terre que la nature a donnée à tous les hommes.',
		letter: 20,
	},
	politesse: {
		text: 'Les meubles que je croiois d’or, n’en ont que la superficie, leur véritable substance est de bois ; de même ce qu’ils appellent politesse a tous les dehors de la vertu, & cache légèrement leurs défauts',
		letter: 20,
	},
	soifOr: { text: 'la soif de l’or étoit la seule cause de leur cruauté', letter: 21 },
	mepris: {
		text: 'si les loix de l’humanité défendent de frapper son semblable, parce que c’est lui faire un mal, à plus forte raison ne doit-on pas blesser son ame par le mépris de ses opinions.',
		letter: 21,
	},
	vendrePensees: {
		text: 'des hommes, sans contredit au-dessus des autres, par les lumières de leur esprit, fussent réduits à la triste nécessité de vendre leurs pensées',
		letter: 22,
	},
	incompatible: { text: 'il osa me dire que mon amour pour toi étoit incompatible avec la vertu', letter: 22 },
	presqueAutant: {
		text: 'je vous aime presqu’autant que j’aime Aza, mais je ne puis jamais vous aimer comme lui.',
		letter: 29,
	},
	censure: {
		text: 'La censure est le goût dominant des François, comme l’inconséquence est le caractère de la nation.',
		letter: 30,
	},
	respectMepris: { text: 'Ils les respectent, mon cher Aza, & en même-temps ils les méprisent avec un égal excès.', letter: 31 },
	vieIndependante: {
		text: 'ne pourriez-vous nous pardonner de vous avoir procuré (à tout événement) une demeure telle que vous avez paru l’aimer, & de vous avoir assuré une vie indépendante ?',
		letter: 32,
		speaker: 'Céline à Zilia',
	},
	infidele: {
		text: 'c’est la bonne foi violée, c’est l’amour méprisé qui déchire mon ame. Aza est infidéle.',
		letter: 35,
	},
	liberte: { text: 'L’avouerai-je, les douceurs de la liberté se présentent quelquefois à mon imagination, je les écoute', letter: 37 },
	decence: {
		text: 'la véritable décence est dans mon cœur. Ce n’est point au simulacre de la vertu que je rends hommage, c’est à la vertu même.',
		letter: 37,
	},
	fidelleAMoi: {
		text: 'mais quand je l’oublierois, fidelle à moi-même, je ne serai point parjure.',
		letter: 38,
	},
	plaisirEtre: {
		text: 'Le plaisir d’être ; ce plaisir oublié, ignoré même de tant d’aveugles humains ; cette pensée si douce, ce bonheur si pur, je suis, je vis, j’existe, pourroit seul rendre heureux, si l’on s’en souvenoit, si l’on en jouissoit, si l’on en connoissoit le prix.',
		letter: 38,
	},
	dedommager: {
		text: 'vous trouverez dans mon cœur, dans mon amitié, dans mes sentimens tout ce qui peut vous dédommager de l’amour.',
		letter: 38,
	},
} satisfies Record<string, Quote>;

// --------------------------------------------------------------------------
// Étapes du récit
// --------------------------------------------------------------------------

export interface NarrativeStep {
	id: string;
	number: number;
	title: string;
	/** Lettres concernées (numérotation 1747, et 1752 si elle diffère). */
	letters: string;
	/** État de Zilia, en quelques mots (affiché sur le parcours). */
	zilia: string;
	/** Évolution de Zilia, en une ou deux phrases (fiche). */
	ziliaDetail: string;
	summary: string;
	characters: string[];
	relationships: string[];
	themes: string[];
	places?: string[];
	quote?: { text: string; ref: string };
}

const q = (quote: Quote) => ({ text: quote.text, ref: quoteRef(quote) });

export const narrativeSteps: NarrativeStep[] = [
	{
		id: 'arrachement',
		number: 1,
		title: 'L’arrachement au Pérou',
		letters: 'Lettres I-II',
		zilia: 'captive, liée à Aza par les quipos',
		ziliaDetail:
			'Prisonnière, Zilia n’a encore qu’un seul repère : Aza. Ses quipos, confiés à un messager, lui parviennent et il lui répond.',
		summary:
			'Le jour prévu pour ses noces avec Aza, des soldats espagnols saccagent le Temple du Soleil où Zilia vivait parmi les Vierges. Arrachée au Temple, elle est enfermée dans une prison obscure. Elle a sauvé ses quipos, ces cordons noués qui servent d’écriture, et peut ainsi correspondre avec Aza, lui aussi retenu par les Espagnols.',
		characters: ['zilia', 'aza', 'espagnols'],
		relationships: ['espagnols-zilia', 'espagnols-aza', 'zilia-aza-amour', 'zilia-aza-lettres'],
		themes: ['cultures', 'amour', 'langue'],
		quote: q(quotes.templeSaccage),
	},
	{
		id: 'traversee',
		number: 2,
		title: 'La traversée',
		letters: 'Lettres III-VIII',
		zilia: 'seule, sans langue commune',
		ziliaDetail:
			'Coupée d’Aza, Zilia continue à nouer des quipos pour lui sans savoir s’il les recevra. Désespérée, elle veut mourir, puis se résigne à vivre pour lui.',
		summary:
			'Emmenée de nuit sur un navire, Zilia assiste à un combat sanglant et se réveille parmi d’autres « Sauvages », qui ne sont plus les Espagnols. Elle ne comprend ni leur langue ni leurs gestes, découvre qu’elle est en mer et tente de se jeter à l’eau. Un homme qu’elle prend pour un « Cacique », un chef, veille sur elle avec respect.',
		characters: ['zilia', 'deterville', 'espagnols', 'aza'],
		relationships: ['deterville-zilia-protection', 'zilia-aza-lettres', 'deterville-zilia-amour'],
		themes: ['regard', 'langue', 'cultures'],
		quote: q(quotes.noeuds),
	},
	{
		id: 'rencontre',
		number: 3,
		title: 'La rencontre avec la France',
		letters: 'Lettres IX-XV',
		zilia: 'elle observe sans comprendre',
		ziliaDetail:
			'Zilia interprète tout avec les mots et les croyances de son monde : elle se trompe souvent, mais ses erreurs révèlent l’étrangeté des usages français.',
		summary:
			'Zilia apprend que le Cacique s’appelle Déterville et qu’on l’emmène en France. Le miroir, le carrosse, les visites mondaines et les cadeaux deviennent des énigmes qu’elle décrit avec ses propres mots. À Paris, la mère de Déterville l’accueille froidement, tandis que Céline, sa sœur, se montre bienveillante.',
		characters: ['zilia', 'deterville', 'china', 'celine', 'mere', 'aine'],
		relationships: ['deterville-zilia-protection', 'china-zilia-savoir', 'celine-zilia-amitie', 'deterville-celine-parente', 'aine-deterville-parente'],
		themes: ['regard', 'langue', 'critique'],
		quote: q(quotes.miroir),
	},
	{
		id: 'apprentissage',
		number: 4,
		title: 'L’apprentissage de l’écriture',
		letters: 'Lettres XVI-XX',
		zilia: 'elle lit, écrit… et comprend son exil',
		ziliaDetail:
			'Savoir lire et écrire donne à Zilia une voix nouvelle, mais aussi une lucidité douloureuse : elle comprend qu’elle est très loin du Pérou.',
		summary:
			'Un maître lui enseigne l’écriture ; ses quipos s’épuisent et elle noue les derniers. Après six mois de silence, la lettre XVIII est la première écrite en français. Pendant que Déterville est à la guerre, sa mère enferme Zilia et Céline dans un couvent ; Zilia y poursuit ses leçons et découvre les livres.',
		characters: ['zilia', 'maitre', 'deterville', 'celine', 'mere', 'china', 'aza'],
		relationships: ['maitre-zilia-savoir', 'mere-celine-conflit', 'mere-deterville-conflit', 'celine-zilia-amitie', 'zilia-aza-lettres'],
		themes: ['langue', 'lumieres', 'regard', 'femmes'],
		quote: q(quotes.nouvelUnivers),
	},
	{
		id: 'observation',
		number: 5,
		title: 'L’observation critique',
		letters: 'Surtout XVI-XXII et XXVI-XXXI ; en 1752, aussi XXIX et XXXIV',
		zilia: 'elle juge par elle-même',
		ziliaDetail:
			'Zilia ne se contente plus de décrire : elle compare, raisonne et juge. Cette réflexion ne forme pas un bloc séparé, elle accompagne l’intrigue d’une lettre à l’autre.',
		summary:
			'Zilia analyse ce qu’elle voit : l’affectation des Français, le pouvoir de l’argent, la politesse qui imite la vertu, la religion que lui présente un religieux, le sort des gens de lettres, le goût de la médisance, le mépris dans lequel on tient les femmes. L’édition de 1752 ajoute une lettre sur le luxe (XXIX) et une sur l’éducation des filles et le mariage (XXXIV).',
		characters: ['zilia', 'religieux', 'celine'],
		relationships: ['religieux-zilia-savoir'],
		themes: ['critique', 'femmes', 'lumieres', 'regard'],
		quote: q(quotes.politesse),
	},
	{
		id: 'attente',
		number: 6,
		title: 'L’attente et la désillusion',
		letters: 'Lettres XXIII-XXXIV (1752 : XXIII-XXXVII)',
		zilia: 'fidèle à Aza, aimée de Déterville',
		ziliaDetail:
			'Zilia refuse de dépendre de l’argent de Déterville et choisit d’attendre Aza. Elle reçoit les trésors du Temple, puis un domaine : son indépendance matérielle précède la trahison.',
		summary:
			'Déterville déclare son amour ; Zilia lui répond qu’elle aime Aza. On apprend qu’Aza, libre à la cour d’Espagne, a changé de religion. Céline retrouve ses biens et épouse celui qu’elle aime. Déterville rend à Zilia les ornements du Temple et lui achète une maison et des terres. Aza arrive enfin, mais il est froid et distant.',
		characters: ['zilia', 'deterville', 'celine', 'aza', 'mere', 'aine', 'amant'],
		relationships: [
			'deterville-zilia-amour',
			'zilia-deterville-amitie',
			'deterville-zilia-protection',
			'amant-celine-amour',
			'mere-aine-parente',
			'zilia-aza-amour',
			'zilia-deterville-lettres',
		],
		themes: ['amour', 'femmes', 'critique'],
		quote: q(quotes.vieIndependante),
	},
	{
		id: 'denouement',
		number: 7,
		title: 'Le dénouement : une femme libre',
		letters: 'Lettres XXXV-XXXVIII (1752 : XXXVIII-XLI)',
		zilia: 'indépendante, maîtresse de sa vie',
		ziliaDetail:
			'Trahie, Zilia ne cherche pas un autre protecteur. Elle refuse l’amour de Déterville, lui offre son amitié et choisit une vie d’étude dans sa propre maison.',
		summary:
			'Aza annonce qu’il va épouser une jeune Espagnole et repart. Zilia, malade de douleur, se retire dans sa maison de campagne. Quand Déterville revient de Malte et lui redit sa passion, elle refuse de nouvelles « chaînes » mais lui propose une amitié sincère, l’étude et le « plaisir d’être ». Les dernières lettres ne s’adressent plus à Aza, mais à Déterville.',
		characters: ['zilia', 'aza', 'deterville', 'celine', 'espagnole'],
		relationships: ['aza-zilia-trahison', 'aza-espagnole-amour', 'zilia-deterville-lettres', 'zilia-deterville-amitie', 'deterville-zilia-amour', 'celine-zilia-amitie'],
		themes: ['amour', 'femmes', 'lumieres'],
		quote: q(quotes.plaisirEtre),
	},
];

// --------------------------------------------------------------------------
// Thèmes (carte des idées)
// --------------------------------------------------------------------------

export interface ThemeExample {
	text: string;
	/** true : citation exacte (affichée entre guillemets). */
	quote?: boolean;
	ref?: string;
}

export interface GraffignyTheme {
	id: string;
	title: string;
	caption: string;
	/** Symbole typographique neutre, doublant la couleur. */
	symbol: string;
	color: string;
	question: string;
	explanation: string;
	examples: ThemeExample[];
	studentQuestions: string[];
	characters: string[];
	relationships: string[];
	/** Étapes liées : déduites des étapes (voir `stepsOfTheme`). */
	steps: string[];
	places?: string[];
}

const ex = (quote: Quote): ThemeExample => ({ text: quote.text, quote: true, ref: quoteRef(quote) });

type ThemeInput = Omit<GraffignyTheme, 'steps' | 'places'>;

const themeInputs: ThemeInput[] = [
	{
		id: 'regard',
		title: 'Le regard étranger',
		caption: 'rendre étrange l’ordinaire',
		symbol: '◎',
		color: '#8b572a',
		question: 'Comment la découverte de la France rend-elle étranges des habitudes que les Français trouvent normales ?',
		explanation:
			'Zilia ne connaît ni les objets ni les codes de la société française. Elle les décrit donc avec ses propres mots : le navire est une « maison flotante », le miroir une « machine qui double les objets », le carrosse une « cabane roulante ». Ce décalage oblige le lecteur à regarder autrement ce qui lui semblait évident. Le procédé rappelle les Lettres persanes de Montesquieu (1721), que l’Avertissement du roman évoque.',
		examples: [
			ex(quotes.miroir),
			ex(quotes.nomCacique),
			{ text: 'L’Avertissement reprend la formule des Lettres persanes : « Comment peut-on être Persan. »', ref: 'Avertissement' },
		],
		studentQuestions: [
			'Pourquoi l’autrice fait-elle décrire le miroir ou le carrosse sans les nommer ? Qu’est-ce que le lecteur découvre alors sur lui-même ?',
			'Les erreurs de Zilia sont-elles seulement comiques, ou révèlent-elles quelque chose de vrai ?',
		],
		characters: ['zilia', 'deterville', 'china'],
		relationships: ['deterville-zilia-protection', 'china-zilia-savoir'],
	},
	{
		id: 'critique',
		title: 'La critique de la société',
		caption: 'apparences, argent, hiérarchies',
		symbol: '≠',
		color: '#a2312b',
		question: 'Qu’est-ce que Zilia reproche aux Français : leurs actes, leurs discours, ou l’écart entre les deux ?',
		explanation:
			'Plus Zilia comprend la langue, plus elle voit les contradictions : la politesse imite la vertu sans l’être, l’argent décide de tout, même du droit à la terre, les gens d’esprit doivent vendre leurs pensées, la famille Déterville sacrifie les cadets à l’aîné. En 1752, Graffigny renforce cette critique avec une lettre nouvelle sur le luxe et le « superflu » (lettre XXIX).',
		examples: [ex(quotes.affectation), ex(quotes.politesse), ex(quotes.terreOr), ex(quotes.censure)],
		studentQuestions: [
			'Le jugement de Zilia sur les Français est-il seulement négatif ? Cherchez ce qu’elle admire aussi.',
			'Pourquoi une critique faite par une étrangère peut-elle être plus forte qu’une critique faite par un Français ?',
		],
		characters: ['zilia', 'mere', 'aine', 'deterville', 'celine', 'religieux'],
		relationships: ['mere-aine-parente', 'mere-deterville-conflit', 'mere-celine-conflit'],
	},
	{
		id: 'femmes',
		title: 'La condition des femmes',
		caption: 'éducation, mariage, dépendance',
		symbol: '♀',
		color: '#7a2f6f',
		question: 'Quelles contraintes pèsent sur les femmes, et comment Zilia parvient-elle à y échapper ?',
		explanation:
			'Les femmes du roman dépendent des décisions familiales et de l’argent : Madame Déterville veut faire de Céline une religieuse pour enrichir son fils aîné, et enferme les deux jeunes femmes au couvent. Zilia observe que les Français respectent et méprisent à la fois les femmes. La lettre XXXIV, ajoutée en 1752, critique l’éducation des filles, mariées dans l’ignorance. À la fin, Zilia vit dans sa propre maison, sans mari ni protecteur.',
		examples: [
			ex(quotes.neant),
			ex(quotes.respectMepris),
			ex(quotes.vieIndependante),
			{ text: 'La lettre XXXIV (ajoutée en 1752) montre des filles élevées dans l’ignorance puis mariées très jeunes, et un mariage qui n’oblige vraiment que les femmes.', ref: 'lettre XXXIV, édition de 1752 (résumé)' },
		],
		studentQuestions: [
			'Pourquoi l’indépendance de Zilia passe-t-elle d’abord par une maison et des biens à elle ?',
			'Céline et Zilia vivent-elles les mêmes contraintes ? Qu’est-ce qui les rapproche, qu’est-ce qui les distingue ?',
		],
		characters: ['zilia', 'celine', 'mere'],
		relationships: ['mere-celine-conflit', 'celine-zilia-amitie'],
	},
	{
		id: 'langue',
		title: 'La langue et la connaissance',
		caption: 'des quipos à l’écriture',
		symbol: '✎',
		color: '#235284',
		question: 'Que change pour Zilia le passage des quipos à l’écriture en français ?',
		explanation:
			'Au début, Zilia écrit avec des quipos, des cordons dont les nœuds portent un sens. Ils s’épuisent à la lettre XVII. Elle apprend le français avec la China, avec Déterville, puis avec un maître d’écriture ; la lettre XVIII est la première écrite en français. Comprendre la langue lui ouvre « un nouvel univers », mais lui révèle aussi la vérité de sa situation.',
		examples: [ex(quotes.noeuds), ex(quotes.ameLangues), ex(quotes.derniersNoeuds), ex(quotes.nouvelUnivers)],
		studentQuestions: [
			'Pourquoi la connaissance de la langue est-elle à la fois un gain et une perte pour Zilia ?',
			'Que signifie, pour une femme du XVIIIe siècle, le fait d’écrire ses propres lettres ?',
		],
		characters: ['zilia', 'china', 'maitre', 'deterville', 'aza'],
		relationships: ['china-zilia-savoir', 'maitre-zilia-savoir', 'zilia-aza-lettres', 'zilia-deterville-lettres'],
	},
	{
		id: 'cultures',
		title: 'La rencontre des cultures',
		caption: 'conquête et violence coloniale',
		symbol: '⇄',
		color: '#4d5b66',
		question: 'Qui sont vraiment les « barbares » dans le roman ?',
		explanation:
			'Le roman commence par la destruction du Temple du Soleil par les conquérants espagnols. Zilia les appelle « Sauvages », retournant le mot que les Européens appliquaient aux peuples d’Amérique. Le religieux lui-même reconnaît que la soif de l’or explique leur cruauté. L’Avertissement souligne que les Européens accordent à peine une âme pensante aux « Indiens » : le roman met en cause cette prétendue supériorité.',
		examples: [ex(quotes.templeSaccage), ex(quotes.larcin), ex(quotes.soifOr), ex(quotes.cupidite)],
		studentQuestions: [
			'Que produit l’emploi du mot « Sauvages » pour désigner les Européens ?',
			'La conversion d’Aza au christianisme est-elle présentée comme un progrès ou comme une perte ?',
		],
		characters: ['zilia', 'espagnols', 'aza', 'religieux'],
		relationships: ['espagnols-zilia', 'espagnols-aza', 'religieux-zilia-savoir'],
	},
	{
		id: 'amour',
		title: 'L’amour, la fidélité, la liberté',
		caption: 'aimer sans se soumettre',
		symbol: '♡',
		color: '#b4502f',
		question: 'Pourquoi Zilia refuse-t-elle de faire de l’amour la seule réponse à son avenir ?',
		explanation:
			'Zilia reste fidèle à Aza jusqu’à sa trahison, et même après, elle se veut fidèle à elle-même. Déterville l’aime sans être aimé en retour ; il est d’ailleurs lié par des vœux. Zilia ne le rejette pas pour autant : elle lui offre une amitié sincère. Le dénouement refuse la fin attendue du roman sentimental, le mariage, au profit de la liberté.',
		examples: [ex(quotes.presqueAutant), ex(quotes.infidele), ex(quotes.fidelleAMoi), ex(quotes.dedommager)],
		studentQuestions: [
			'Le dénouement est-il malheureux ou heureux ? Justifiez à partir de la dernière lettre.',
			'Pourquoi l’amitié offerte à Déterville peut-elle être lue comme un choix libre et non comme un pis-aller ?',
		],
		characters: ['zilia', 'aza', 'deterville', 'espagnole', 'celine', 'amant'],
		relationships: [
			'zilia-aza-amour',
			'aza-zilia-trahison',
			'deterville-zilia-amour',
			'zilia-deterville-amitie',
			'aza-espagnole-amour',
			'amant-celine-amour',
		],
	},
	{
		id: 'lumieres',
		title: 'Les Lumières et l’émancipation',
		caption: 'observer, comparer, penser',
		symbol: '✦',
		color: '#5f6b2f',
		question: 'En quoi Zilia pense-t-elle comme une philosophe des Lumières ?',
		explanation:
			'Zilia part de l’expérience : elle observe, compare le Pérou et la France, doute et révise ses jugements. Elle défend une morale fondée sur la nature et la tolérance, se nourrit de livres et finit par trouver le bonheur dans la conscience d’exister. Son émancipation est d’abord intellectuelle.',
		examples: [ex(quotes.mepris), ex(quotes.vendrePensees), ex(quotes.decence), ex(quotes.plaisirEtre)],
		studentQuestions: [
			'Comment la méthode de Zilia (observer, comparer, juger) ressemble-t-elle à celle des philosophes des Lumières ?',
			'« Le plaisir d’être » : en quoi cette idée finale est-elle une forme de liberté ?',
		],
		characters: ['zilia', 'religieux', 'maitre', 'deterville'],
		relationships: ['religieux-zilia-savoir', 'maitre-zilia-savoir', 'zilia-deterville-amitie'],
	},
];

// --------------------------------------------------------------------------
// Personnages et relations
// --------------------------------------------------------------------------

export const graffignyEdgeTypes: Record<string, EdgeType> = {
	amour: { legend: 'Amour (la flèche indique qui aime)', stroke: '#c98a84', activeStroke: '#a2312b', width: 2, dash: 'none', arrow: 'end' },
	amitie: { legend: 'Amitié et solidarité', stroke: '#8fb9a3', activeStroke: '#2f7d5b', width: 1.9, dash: '8 4', arrow: 'end' },
	parente: { legend: 'Parenté', stroke: '#a9a39a', activeStroke: '#5e5850', width: 2, dash: '1.5 4' },
	protection: { legend: 'Protection ou dépendance', stroke: '#c9ab8d', activeStroke: '#8b572a', width: 1.9, dash: '14 4 3 4', arrow: 'end' },
	epistolaire: { legend: 'Relation épistolaire (lettres)', stroke: '#93acc8', activeStroke: '#235284', width: 1.9, dash: '3 3 10 3', arrow: 'end' },
	conflit: { legend: 'Conflit, contrainte ou trahison', stroke: '#8c6a6a', activeStroke: '#4a1d1d', width: 2.3, dash: '4 3', arrow: 'end' },
	savoir: { legend: 'Transmission du savoir', stroke: '#b3a3c9', activeStroke: '#6a4c93', width: 1.9, dash: '10 2 2 2', arrow: 'end' },
};

type CharacterInput = Omit<MapNode, 'links'>;

const characterInputs: CharacterInput[] = [
	{
		id: 'zilia',
		label: 'Zilia',
		caption: 'narratrice, Vierge du Soleil',
		eyebrow: 'Narratrice · seule voix du roman',
		meta: ['princesse inca', 'Vierge du Soleil', 'promise à Aza'],
		description:
			'Jeune Inca élevée au Temple du Soleil et promise à Aza, Zilia est la seule à écrire : tout le roman passe par son regard. Arrachée à son pays, captive puis recueillie en France, elle apprend la langue, observe la société française et la juge. Trahie par Aza, elle choisit l’indépendance et l’étude.',
		points: [
			'Noue des quipos pour Aza, puis écrit en français à partir de la lettre XVIII',
			'Juge les mœurs françaises : affectation, argent, condition des femmes (XVI-XXXI)',
			'Reçoit les trésors du Temple (XXVII) et un domaine (lettre XXXII, 1752 : XXXV)',
			'Refuse l’amour de Déterville mais lui offre son amitié (lettre XXXVIII, 1752 : XLI)',
		],
		color: '#8b572a',
		tier: 'major',
		x: 440,
		y: 320,
		mx: 180,
		my: 330,
	},
	{
		id: 'aza',
		label: 'Aza',
		caption: 'fiancé, héritier inca',
		eyebrow: 'L’amour espéré · puis la désillusion',
		meta: ['fils du Capa-Inca', 'destinataire des lettres I à XXXIII'],
		description:
			'Héritier de l’Empire inca et fiancé de Zilia, Aza est le destinataire de presque toutes les lettres, mais il est absent pendant tout le roman. Retenu par les Espagnols, il devient libre à la cour d’Espagne et adopte leur religion. Arrivé enfin en France, il annonce qu’il va épouser une jeune Espagnole.',
		points: [
			'Répond une fois à Zilia grâce à un messager (II)',
			'Libre à la cour d’Espagne, il a changé de religion (XXV)',
			'Arrive froid et distant (lettre XXXIV, 1752 : XXXVII)',
			'Rompt sa promesse pour une Espagnole (lettre XXXV, 1752 : XXXVIII)',
		],
		color: '#b4502f',
		tier: 'major',
		x: 190,
		y: 165,
		mx: 85,
		my: 120,
	},
	{
		id: 'deterville',
		label: 'Déterville',
		caption: 'officier français',
		eyebrow: 'Le libérateur · un amour sans retour',
		meta: ['« le Cacique » pour Zilia', 'le Chevalier Déterville', 'cadet de famille'],
		description:
			'Officier français, Déterville s’empare du navire espagnol qui transportait Zilia. Zilia le prend d’abord pour un « Cacique ». Il la protège, lui apprend ses premiers mots de français et l’emmène à Paris. Il l’aime sans être aimé, et sa mère l’a contraint à prononcer des vœux. Il lui rend ses trésors et lui offre une maison, sans rien exiger.',
		points: [
			'Veille sur Zilia à bord et lui apprend ses premiers mots (IV-IX)',
			'Déclare son amour au parloir du couvent (XXIII)',
			'Fait venir Aza, puis part pour Malte à son arrivée (XXVI, XXXIV)',
			'Reçoit les dernières lettres de Zilia (lettres XXXIV-XXXVIII, 1752 : XXXVII-XLI)',
		],
		color: '#235284',
		tier: 'major',
		x: 680,
		y: 160,
		mx: 95,
		my: 560,
	},
	{
		id: 'celine',
		label: 'Céline',
		caption: 'sœur de Déterville, amie',
		eyebrow: 'L’amie · une jeune femme sous contrainte',
		meta: ['sœur de Déterville', 'amie de Zilia'],
		description:
			'Sœur de Déterville, Céline accueille Zilia avec bonté et partage avec elle la réclusion du couvent. Sa mère veut la faire religieuse pour enrichir le fils aîné, mais elle aime un jeune homme qu’elle épouse quand ses biens lui sont rendus. Elle reproche un temps à Zilia de faire souffrir son frère, puis organise la surprise du domaine et la soigne.',
		points: [
			'Accueille Zilia à Paris (XIII, XV)',
			'Enfermée au couvent avec elle par sa mère (XIX)',
			'Retrouve ses biens et se marie (XXVII-XXVIII)',
			'Révèle à Zilia que le domaine lui appartient (lettre XXXII, 1752 : XXXV)',
		],
		color: '#2f7d5b',
		tier: 'standard',
		x: 690,
		y: 450,
		mx: 265,
		my: 700,
	},
	{
		id: 'mere',
		label: 'Madame Déterville',
		caption: 'la mère',
		eyebrow: 'L’intérêt de la famille avant les sentiments',
		meta: ['mère de Déterville et de Céline', '« Madame » pour Zilia'],
		description:
			'Le texte la nomme « Madame » ou « Madame Déterville ». Froide envers son fils et envers Zilia, elle sacrifie ses cadets au fils aîné : elle impose des vœux à Déterville, veut faire de Céline une religieuse et enferme les deux jeunes femmes au couvent. À sa mort, elle laisse tous ses biens à l’aîné.',
		points: [
			'Accueille froidement son fils et Zilia (XIII)',
			'Enferme Zilia et Céline au couvent (XIX)',
			'Meurt en déshéritant Céline au profit de l’aîné (XXIV)',
		],
		color: '#5e5850',
		tier: 'standard',
		x: 815,
		y: 300,
		mx: 95,
		my: 870,
	},
	{
		id: 'aine',
		label: 'Le frère aîné',
		caption: 'héritier de la famille',
		eyebrow: 'Le privilège de l’aîné',
		meta: ['fils aîné, marié', 'sans nom dans le texte'],
		description:
			'Frère aîné de Déterville et de Céline, il n’est jamais nommé. Sa mère veut l’enrichir aux dépens de ses cadets et lui laisse tous ses biens. Il incarne le droit d’aînesse, que Zilia découvre avec étonnement.',
		points: ['Présenté à Zilia avec son épouse (XIII)', 'Héritier de tous les biens de sa mère (XIX, XXIV)'],
		color: '#5e5850',
		tier: 'minor',
		x: 815,
		y: 55,
		mx: 270,
		my: 545,
	},
	{
		id: 'amant',
		label: 'L’amant de Céline',
		caption: 'puis son mari',
		eyebrow: 'Un amour contrarié puis permis',
		meta: ['« jeune François »', 'sans nom dans le texte'],
		description:
			'Jeune homme jamais nommé, il glisse un billet à Céline au spectacle. La mère de Céline s’oppose à leur amour ; il épouse Céline quand elle retrouve ses biens. Zilia vit ensuite chez le couple.',
		points: ['Glisse un billet à Céline (XVII)', 'L’épouse à la campagne (XXVII-XXVIII)'],
		color: '#2f7d5b',
		tier: 'minor',
		x: 830,
		y: 560,
		mx: 270,
		my: 880,
	},
	{
		id: 'china',
		label: 'La China',
		caption: 'jeune servante',
		eyebrow: 'Premiers mots de français',
		meta: ['« Servante ou femme de chambre » (note de l’édition)'],
		description:
			'Déterville donne à Zilia une jeune servante, « une China » : une note de l’édition explique ce mot par « Servante ou femme de chambre ». Zilia reconnaît ne pas lui connaître d’autre nom. Elle lui apprend les noms des objets, la console, puis l’exhorte à oublier Aza.',
		points: [
			'Donnée à Zilia par Déterville (X)',
			'Lui apprend les noms des choses (XI)',
			'L’exhorte à oublier Aza (XIX)',
		],
		color: '#6a4c93',
		tier: 'minor',
		x: 175,
		y: 470,
		mx: 70,
		my: 225,
	},
	{
		id: 'maitre',
		label: 'Le maître d’écriture',
		caption: 'enseigne à écrire',
		eyebrow: 'L’accès à l’écriture',
		meta: ['amené par Déterville'],
		description:
			'Déterville amène à Zilia un maître qui lui enseigne les lettres de l’alphabet. Il continue ses leçons au parloir du couvent. Grâce à lui, Zilia peut écrire sa première lettre en français.',
		points: ['Premières leçons d’écriture (XVI)', 'Leçons au parloir du couvent (XIX)'],
		color: '#6a4c93',
		tier: 'minor',
		x: 365,
		y: 565,
		mx: 90,
		my: 440,
	},
	{
		id: 'religieux',
		label: 'Le Religieux',
		caption: 'instruit Zilia',
		eyebrow: 'Un savoir qui juge',
		meta: ['« un Cusipata que l’on nomme ici Religieux »'],
		description:
			'Ce religieux, que Zilia compare à un prêtre du Soleil, lui enseigne la religion chrétienne et l’histoire de la conquête. Il lui explique comment Déterville l’a prise sur un navire espagnol. À sa seconde visite, il déclare que son amour pour Aza est « incompatible avec la vertu » : Zilia rompt avec lui.',
		points: [
			'Lui apprend que la soif de l’or explique la cruauté espagnole (XXI)',
			'Méprise le culte du Soleil, ce que Zilia lui reproche (XXI)',
			'Condamne son amour pour Aza (XXII)',
		],
		color: '#6a4c93',
		tier: 'minor',
		x: 560,
		y: 575,
		mx: 285,
		my: 440,
	},
	{
		id: 'espagnols',
		label: 'Les Espagnols',
		caption: 'conquérants du Pérou',
		eyebrow: 'Personnage collectif · la conquête',
		meta: ['jamais nommés individuellement'],
		description:
			'Les conquérants espagnols n’ont pas de nom : Zilia les appelle « Sauvages », « Nation barbare ». Ils saccagent le Temple, enlèvent Zilia et retiennent Aza. Leur cupidité est désignée comme la cause de la conquête.',
		points: [
			'Saccagent le Temple du Soleil (I)',
			'Retiennent Aza en lui rendant des honneurs (II)',
			'Emmènent Zilia sur un navire (III)',
		],
		color: '#4d5b66',
		tier: 'standard',
		x: 120,
		y: 330,
		mx: 270,
		my: 200,
	},
	{
		id: 'espagnole',
		label: 'Une jeune Espagnole',
		caption: 'que va épouser Aza',
		eyebrow: 'La rivale absente',
		meta: ['jamais nommée, jamais présente'],
		description:
			'Zilia n’en connaît que l’existence : Aza, séduit par « une jeune Espagnole », veut l’épouser. Elle n’apparaît jamais dans le roman, mais elle cause la rupture.',
		points: ['Aza veut l’épouser (lettre XXXV, 1752 : XXXVIII)', 'Aza repart en Espagne pour se marier (lettre XXXVI, 1752 : XXXIX)'],
		color: '#b4502f',
		tier: 'minor',
		x: 150,
		y: 45,
		mx: 260,
		my: 40,
	},
];

export const graffignyRelationships: MapRelationship[] = [
	{
		id: 'zilia-aza-amour',
		source: 'zilia',
		target: 'aza',
		type: 'amour',
		label: 'l’aime, lui reste fidèle',
		offset: -12,
		labelT: 0.62,
		labelDy: -16,
		description:
			'Zilia aime Aza depuis leur rencontre au Temple ; ils devaient se marier le jour de l’attaque (I-II). Elle lui reste fidèle pendant tout le roman et refuse d’oublier ses serments, même après sa trahison : « fidelle à moi-même, je ne serai point parjure » (lettre XXXVIII, 1752 : XLI).',
	},
	{
		id: 'zilia-aza-lettres',
		source: 'zilia',
		target: 'aza',
		type: 'epistolaire',
		label: 'lui écrit',
		labelT: 0.32,
		labelDx: 18,
		labelDy: 8,
		description:
			'Les lettres I à XXXIII (1752 : I à XXXVI) sont adressées à Aza. Il ne répond qu’une fois, au début, par un messager (II). Ensuite, Zilia écrit sans savoir s’il la lira ; Déterville fait envoyer ses lettres (XXVI), et Aza les lui rendra (XXXVII).',
	},
	{
		id: 'aza-zilia-trahison',
		source: 'aza',
		target: 'zilia',
		type: 'conflit',
		label: 'la trahit',
		offset: -12,
		labelT: 0.4,
		labelDx: 22,
		labelDy: 14,
		description:
			'Devenu chrétien, Aza ne peut plus épouser une parente, et il est séduit par une jeune Espagnole. Il n’est venu que pour se dégager de sa promesse : « Aza est infidéle » (lettre XXXV, 1752 : XXXVIII). Il repart en Espagne (XXXVI).',
	},
	{
		id: 'deterville-zilia-amour',
		source: 'deterville',
		target: 'zilia',
		type: 'amour',
		label: 'l’aime sans retour',
		offset: -18,
		labelT: 0.38,
		labelDy: -16,
		mLabelT: 0.22,
		mLabelDx: 0,
		mobileLabel: true,
		description:
			'Dès la traversée, Déterville fait répéter à Zilia « oui, je vous aime » sans qu’elle comprenne (IX). Il lui déclare son amour au parloir (XXIII), puis le lui redit à son retour de Malte (lettre XXXVIII, 1752 : XLI). Zilia ne le partage pas : l’amour de Déterville n’est pas réciproque.',
	},
	{
		id: 'deterville-zilia-protection',
		source: 'deterville',
		target: 'zilia',
		type: 'protection',
		label: 'la recueille, la protège',
		offset: -6,
		labelT: 0.52,
		labelDx: 10,
		labelDy: 12,
		description:
			'Déterville s’empare du navire espagnol qui transportait Zilia, comme le lui explique le Religieux (XXI). Il la soigne, l’emmène en France, lui donne une servante et un maître d’écriture. Il lui rend les trésors du Temple (XXVII) et lui achète une maison et des terres (lettre XXXII, 1752 : XXXV). Zilia refuse pourtant de dépendre de son argent (XXVI).',
	},
	{
		id: 'zilia-deterville-amitie',
		source: 'zilia',
		target: 'deterville',
		type: 'amitie',
		label: 'lui offre son amitié',
		offset: -6,
		labelT: 0.35,
		labelDx: 14,
		labelDy: 14,
		description:
			'Zilia ne peut aimer Déterville comme Aza, mais lui offre une amitié véritable : « je vous aime presqu’autant que j’aime Aza, mais je ne puis jamais vous aimer comme lui » (lettre XXIX, 1752 : XXXI). Dans la dernière lettre, elle lui propose confiance, étude et amitié pour remplacer l’amour.',
	},
	{
		id: 'zilia-deterville-lettres',
		source: 'zilia',
		target: 'deterville',
		type: 'epistolaire',
		label: 'lui écrit à la fin',
		offset: -18,
		labelT: 0.68,
		labelDx: 16,
		labelDy: 14,
		description:
			'Les cinq dernières lettres, XXXIV à XXXVIII (1752 : XXXVII à XLI), sont adressées « Au Chevalier Déterville », à Malte puis à Paris. Ce changement de destinataire marque la fin de l’attente d’Aza.',
	},
	{
		id: 'celine-zilia-amitie',
		source: 'celine',
		target: 'zilia',
		type: 'amitie',
		label: 'amies',
		labelT: 0.5,
		mobileLabel: true,
		description:
			'Céline se montre bonne envers Zilia dès son arrivée (XV) et partage sa réclusion au couvent (XIX). L’amitié traverse une crise quand Céline reproche à Zilia de faire souffrir son frère (XXIII-XXIV). Elle organise ensuite la surprise du domaine (lettre XXXII, 1752 : XXXV) et soigne Zilia après la trahison d’Aza.',
	},
	{
		id: 'deterville-celine-parente',
		source: 'deterville',
		target: 'celine',
		type: 'parente',
		label: 'frère et sœur',
		labelT: 0.4,
		labelDx: 30,
		description: 'Le soir de l’arrivée à Paris, Zilia apprend que la jeune fille qui l’accueille s’appelle Céline et qu’elle est la sœur de Déterville (XIII).',
	},
	{
		id: 'aine-deterville-parente',
		source: 'aine',
		target: 'deterville',
		type: 'parente',
		label: 'frère aîné',
		labelT: 0.5,
		labelDy: -12,
		description: 'Le « grand homme » vu chez la mère est le frère aîné de Déterville, marié (XIII). Tout l’héritage lui revient.',
	},
	{
		id: 'mere-aine-parente',
		source: 'mere',
		target: 'aine',
		type: 'parente',
		label: 'favorise l’aîné',
		labelT: 0.5,
		labelDx: 38,
		description:
			'Madame Déterville veut enrichir son fils aîné aux dépens de ses cadets (XIX). À sa mort, elle lui laisse tous ses biens ; Zilia la juge « mere dénaturée » (XXIV), et un procès rend ensuite ses biens à Céline (XXVII).',
	},
	{
		id: 'mere-deterville-conflit',
		source: 'mere',
		target: 'deterville',
		type: 'conflit',
		label: 'lui impose des vœux',
		labelT: 0.5,
		labelDy: 12,
		description:
			'Sa mère a contraint Déterville « à choisir un certain Ordre » dont il ne pourra plus sortir après ses vœux (XIX). Il ne peut donc pas épouser Zilia ; son départ pour Malte suggère l’ordre de Malte, que le texte ne nomme pas.',
	},
	{
		id: 'mere-celine-conflit',
		source: 'mere',
		target: 'celine',
		type: 'conflit',
		label: 'veut la faire religieuse',
		labelT: 0.45,
		labelDx: 46,
		description:
			'Pour enrichir son fils aîné, Madame Déterville veut faire de Céline une religieuse malgré l’amour de sa fille pour un jeune homme ; elle l’enferme au couvent avec Zilia (XIX).',
	},
	{
		id: 'amant-celine-amour',
		source: 'amant',
		target: 'celine',
		type: 'amour',
		direction: 'both',
		label: 'amour partagé',
		labelT: 0.5,
		labelDx: 30,
		description:
			'Un jeune homme glisse un billet à Céline au spectacle (XVII) ; c’est son amant (XIX). Leur amour, d’abord contrarié par la mère, aboutit au mariage quand Céline retrouve ses biens (XXVII-XXVIII).',
	},
	{
		id: 'china-zilia-savoir',
		source: 'china',
		target: 'zilia',
		type: 'savoir',
		label: 'lui apprend des mots',
		labelT: 0.45,
		labelDy: -12,
		description:
			'Donnée à Zilia par Déterville (X), la jeune servante lui apprend les noms des objets (XI). Elle la console à son arrivée à Paris (XIII), puis l’exhorte à oublier Aza (XIX).',
	},
	{
		id: 'maitre-zilia-savoir',
		source: 'maitre',
		target: 'zilia',
		type: 'savoir',
		label: 'lui apprend à écrire',
		labelT: 0.45,
		labelDx: -50,
		description:
			'Amené par Déterville, ce maître enseigne l’écriture à Zilia (XVI) et continue au parloir du couvent (XIX). La lettre XVIII est la première qu’elle écrit en français.',
	},
	{
		id: 'religieux-zilia-savoir',
		source: 'religieux',
		target: 'zilia',
		type: 'savoir',
		label: 'l’instruit puis la condamne',
		labelT: 0.25,
		labelDx: 75,
		description:
			'Le Religieux instruit Zilia de la religion chrétienne, de la conquête et de sa propre capture (XXI). Mais il méprise le culte du Soleil, puis juge son amour pour Aza « incompatible avec la vertu » : Zilia rompt avec lui (XXII).',
	},
	{
		id: 'espagnols-zilia',
		source: 'espagnols',
		target: 'zilia',
		type: 'conflit',
		label: 'l’arrachent au Temple',
		labelT: 0.5,
		labelDy: 14,
		mobileLabel: true,
		description:
			'Les soldats espagnols saccagent le Temple du Soleil le jour des noces, enlèvent Zilia et l’enferment (I), puis l’emmènent sur un navire (III). Zilia juge que « le larcin » est le motif de leur barbarie (I).',
	},
	{
		id: 'espagnols-aza',
		source: 'espagnols',
		target: 'aza',
		type: 'conflit',
		label: 'le retiennent',
		labelT: 0.5,
		labelDx: -38,
		description:
			'Les Espagnols retiennent Aza tout en lui rendant des honneurs (II). Plus tard, libre à la cour d’Espagne, il adopte leur religion (XXV) : la conquête lui a fait perdre son monde.',
	},
	{
		id: 'aza-espagnole-amour',
		source: 'aza',
		target: 'espagnole',
		type: 'amour',
		label: 'veut l’épouser',
		labelT: 0.5,
		labelDx: 44,
		description:
			'Séduit par une jeune Espagnole, Aza veut s’unir à elle (lettre XXXV, 1752 : XXXVIII) et repart en Espagne pour l’épouser (lettre XXXVI, 1752 : XXXIX).',
	},
];

// --------------------------------------------------------------------------
import { graffignyPlaces, type GraffignyPlace } from './graffigny-places';

export * from './graffigny-places';

// Correspondances entre les vues
// --------------------------------------------------------------------------

/** Étapes liées à un thème : celles qui le mentionnent (source unique : les étapes). */
export const stepsOfTheme = (themeId: string) => narrativeSteps.filter((s) => s.themes.includes(themeId)).map((s) => s.id);

export const placesOfStep = (id: string) => graffignyPlaces.filter((p) => p.steps.includes(id)).map((p) => p.id);
export const placesOfTheme = (id: string) => graffignyPlaces.filter((p) => p.themes.includes(id)).map((p) => p.id);
export const placesOfCharacter = (id: string) => graffignyPlaces.filter((p) => p.characters.includes(id)).map((p) => p.id);

for (const s of narrativeSteps) {
	s.places = placesOfStep(s.id);
}

export const graffignyThemes: GraffignyTheme[] = themeInputs.map((t) => ({
	...t,
	steps: stepsOfTheme(t.id),
	places: placesOfTheme(t.id),
}));

const stepsOfCharacter = (id: string) => narrativeSteps.filter((s) => s.characters.includes(id));
const themesOfCharacter = (id: string) => graffignyThemes.filter((t) => t.characters.includes(id));
const endsOf = (r: MapRelationship) => [r.source, ...(Array.isArray(r.target) ? r.target : [r.target])];

const stepLink = (s: NarrativeStep): MapLink => ({ href: `#etape-${s.id}`, label: `Étape ${s.number} : ${s.title}` });
const themeLink = (t: GraffignyTheme): MapLink => ({ href: `#theme-${t.id}`, label: `Thème : ${t.title}` });
const placeLink = (p: GraffignyPlace): MapLink => ({ href: `#lieu-${p.id}`, label: `Lieu : ${p.name}` });

export const graffignyCharacters: MapNode[] = characterInputs.map((c) => ({
	...c,
	links: [
		...stepsOfCharacter(c.id).map(stepLink),
		...themesOfCharacter(c.id).map(themeLink),
		...graffignyPlaces.filter((p) => p.characters.includes(c.id)).map(placeLink),
	],
}));

for (const r of graffignyRelationships) {
	const steps = narrativeSteps.filter((s) => s.relationships.includes(r.id!));
	const themes = graffignyThemes.filter((t) => t.relationships.includes(r.id!));
	const ends = endsOf(r);
	const places = graffignyPlaces.filter((p) => ends.some((c) => p.characters.includes(c)));
	r.links = [...steps.map(stepLink), ...themes.map(themeLink), ...places.map(placeLink)];
}

export interface LinkedElements {
	characters: string[];
	relationships: string[];
	steps: string[];
	themes: string[];
	places: string[];
}

/** Index transmis au script de la page : ce que chaque élément met en évidence ailleurs. */
export const crossLinkIndex = {
	names: {
		node: Object.fromEntries(characterInputs.map((c) => [c.id, c.label])),
		edge: Object.fromEntries(
			graffignyRelationships.map((r) => {
				const label = (id: string) => characterInputs.find((c) => c.id === id)!.label;
				return [r.id!, `${endsOf(r).map(label).join(' / ')} (${r.label})`];
			}),
		),
		step: Object.fromEntries(narrativeSteps.map((s) => [s.id, `${s.number}. ${s.title}`])),
		theme: Object.fromEntries(graffignyThemes.map((t) => [t.id, t.title])),
		place: Object.fromEntries(graffignyPlaces.map((p) => [p.id, p.name])),
	},
	nodes: Object.fromEntries(
		characterInputs.map((c): [string, LinkedElements] => [
			c.id,
			{
				characters: [c.id],
				relationships: graffignyRelationships.filter((r) => endsOf(r).includes(c.id)).map((r) => r.id!),
				steps: stepsOfCharacter(c.id).map((s) => s.id),
				themes: themesOfCharacter(c.id).map((t) => t.id),
				places: placesOfCharacter(c.id),
			},
		]),
	),
	edges: Object.fromEntries(
		graffignyRelationships.map((r): [string, LinkedElements] => {
			const ends = endsOf(r);
			const linkedPlaces = Array.from(new Set(ends.flatMap(placesOfCharacter)));
			return [
				r.id!,
				{
					characters: ends,
					relationships: [r.id!],
					steps: narrativeSteps.filter((s) => s.relationships.includes(r.id!)).map((s) => s.id),
					themes: graffignyThemes.filter((t) => t.relationships.includes(r.id!)).map((t) => t.id),
					places: linkedPlaces,
				},
			];
		}),
	),
	steps: Object.fromEntries(
		narrativeSteps.map((s): [string, LinkedElements] => [
			s.id,
			{ characters: s.characters, relationships: s.relationships, steps: [s.id], themes: s.themes, places: placesOfStep(s.id) },
		]),
	),
	themes: Object.fromEntries(
		graffignyThemes.map((t): [string, LinkedElements] => [
			t.id,
			{ characters: t.characters, relationships: t.relationships, steps: t.steps, themes: [t.id], places: placesOfTheme(t.id) },
		]),
	),
	places: Object.fromEntries(
		graffignyPlaces.map((p): [string, LinkedElements] => [
			p.id,
			{
				characters: p.characters,
				relationships: graffignyRelationships
					.filter((r) => endsOf(r).some((c) => p.characters.includes(c)))
					.map((r) => r.id!),
				steps: p.steps,
				themes: p.themes,
				places: [p.id],
			},
		]),
	),
};

// --------------------------------------------------------------------------
// Synthèse, révision, sources
// --------------------------------------------------------------------------

export const ziliaEvolution = [
	{
		from: 'Captive',
		to: 'propriétaire de sa maison',
		text: 'Enlevée et transportée de force, Zilia finit par vivre chez elle, dans le domaine acheté avec les trésors du Temple.',
	},
	{
		from: 'Sans langue',
		to: 'autrice de ses lettres',
		text: 'Des quipos aux lettres en français, elle conquiert le moyen de dire et de juger ce qu’elle voit.',
	},
	{
		from: 'Spectatrice étonnée',
		to: 'observatrice critique',
		text: 'Ses premières erreurs d’interprétation laissent place à une analyse lucide des mœurs françaises.',
	},
	{
		from: 'Promise à Aza',
		to: 'libre de son avenir',
		text: 'Trahie, elle ne cherche pas d’autre mari : elle choisit l’amitié, l’étude et le « plaisir d’être ».',
	},
];

export const revisionQuestions = [
	{
		question: 'Pourquoi le roman prend-il la forme de lettres, et pourquoi presque toutes sont-elles adressées à un absent ?',
		hint: 'Pensez à la sincérité de la confidence, à l’attente d’une réponse qui ne vient pas, et au changement de destinataire à la fin.',
	},
	{
		question: 'Relevez trois objets ou usages que Zilia décrit sans les nommer. Quel effet ce procédé produit-il ?',
		hint: 'Le miroir, le navire, le carrosse, la lunette : le lecteur reconnaît l’objet et découvre en même temps le regard neuf de Zilia.',
	},
	{
		question: 'Que signifie la phrase « un nouvel univers s’est offert à mes yeux » (lettre XVIII) dans son contexte ?',
		hint: 'La phrase est suivie de « chaque éclaircissement m’a découvert un nouveau malheur » : comprendre, c’est aussi perdre ses illusions.',
	},
	{
		question: 'Quels éléments de la société française Zilia critique-t-elle ? Classez-les.',
		hint: 'Apparences et politesse, argent et propriété, hiérarchies familiales, condition des femmes, sort des gens de lettres.',
	},
	{
		question: 'En quoi le dénouement s’écarte-t-il de la fin attendue d’un roman d’amour ?',
		hint: 'Zilia ne se marie pas : elle refuse de nouvelles « chaînes », offre son amitié à Déterville et revendique une vie libre.',
	},
	{
		question: 'Qu’ajoute l’édition de 1752 à celle de 1747 ?',
		hint: 'Une Introduction historique sur les Incas et trois lettres : une lettre XXVIII augmentée, une lettre sur le luxe (XXIX) et une lettre sur l’éducation des filles et le mariage (XXXIV).',
	},
	{
		question: 'Comment le regard d’un personnage étranger permet-il à Montesquieu et à Graffigny de critiquer la société française de leur temps ? Qu’apporte le point de vue de Zilia à cette tradition ?',
		hint: 'Montesquieu (1721) démultiplie les regards masculins de voyageurs libres (Usbek et Rica) sur les mœurs, le pouvoir et la religion ; Graffigny (1747, 1752) donne la parole à une femme captive et exilée, dont l’apprentissage de la langue devient un chemin d’émancipation personnelle.',
	},
];

export interface LiteraryComparisonRow {
	aspect: string;
	montesquieu: string;
	graffigny: string;
}

export const montesquieuComparison = {
	id: 'regard-etranger-montesquieu',
	sectionEyebrow: 'Histoire littéraire · Les Lumières',
	title: 'De Montesquieu à Graffigny : le regard étranger',
	lead: 'En 1721, Montesquieu publie anonymement les Lettres persanes à Amsterdam : deux Persans, Usbek et Rica, découvrent la France de la fin du règne de Louis XIV et de la Régence. En 1747 (puis dans l’édition augmentée de 1752), Françoise de Graffigny reprend ce dispositif romanesque et philosophique en donnant la parole à Zilia, une jeune princesse inca. Pour des élèves de seconde, confronter ces deux chefs-d’œuvre permet de comprendre comment le roman épistolaire use du regard étranger pour dénaturaliser les préjugés, tout en mesurant la singularité féministe et intime de Graffigny.',
	commonDevice: {
		title: 'Un procédé commun : découvrir la France par les yeux d’un étranger',
		paragraphs: [
			'Dans les Lettres persanes (1721), Usbek et Rica, deux Persans en voyage en Europe, observent la société française. Leur regard extérieur permet à Montesquieu de questionner les mœurs, la religion, les institutions politiques et les faux-semblants du pouvoir monarchique. La célèbre interrogation des Parisiens rapportée par Rica dans la lettre XXX (« Comment peut-on être Persan ? ») illustre avec ironie l’étroitesse d’esprit d’une société convaincue d’incarner l’unique norme universelle.',
			'Dans les Lettres d’une Péruvienne (1747), Zilia, jeune femme inca arrachée à son pays et à son Temple, découvre à son tour la société française. Dès l’Avertissement, Graffigny fait explicitement écho à Montesquieu en reprenant cette même formule (dans l’orthographe et la ponctuation de 1747 : « Comment peut-on être Persan. Nous méprisons les Indiens »). Ses lettres confrontent sans concession les valeurs de pureté et de vérité qu’elle a reçues au Pérou aux pratiques européennes.',
			'Le mécanisme critique repose sur le même principe de défamiliarisation : ce qui paraît ordinaire, naturel et respectable aux habitants d’une société devient étrange, contradictoire ou absurde lorsqu’un observateur venu d’ailleurs en fait l’expérience sans en partager les automatismes culturels.',
		],
	},
	tableRows: [
		{
			aspect: 'Regard étranger',
			montesquieu: 'Usbek et Rica observent la France en voyageurs libres et curieux.',
			graffigny: 'Zilia découvre la France après son enlèvement et son exil forcé.',
		},
		{
			aspect: 'Forme épistolaire',
			montesquieu: 'Polyphonie : plusieurs correspondants et points de vue croisés (Persans à Paris, eunuques et épouses à Ispahan).',
			graffigny: 'Une voix centrale et intime : les lettres de Zilia suivent pas à pas l’évolution intérieure d’une seule conscience.',
		},
		{
			aspect: 'Critique sociale',
			montesquieu: 'Satire des mœurs, du pape, de la monarchie absolue, des querelles religieuses et des institutions.',
			graffigny: 'Dénonciation de la mondanité superficielle, du culte de l’argent, de l’inégalité d’éducation et de la condition féminine.',
		},
		{
			aspect: 'Parcours du personnage',
			montesquieu: 'Le voyage révèle les contradictions de l’Occident, mais Usbek reste un despote dans son sérail, qui sombre dans la tragédie.',
			graffigny: 'L’épreuve de l’exil devient une conquête d’autonomie intellectuelle, matérielle et affective, couronnée par le « plaisir d’être ».',
		},
	] as LiteraryComparisonRow[],
	tableCaveat:
		'Ces oppositions synthétiques n’ont rien d’absolu : les deux œuvres croisent de multiples registres (ironie, émotion, réflexion philosophique) et présentent des architectures romanesques plus riches et nuancées que ce résumé scolaire.',
	singularity: {
		title: 'L’originalité de Françoise de Graffigny',
		paragraphs: [
			'Loin d’être une simple réécriture des Lettres persanes, les Lettres d’une Péruvienne renouvellent en profondeur la tradition du regard étranger en lui donnant une voix féminine inédite au siècle des Lumières :',
		],
		points: [
			'Une perspective féminine située : Zilia n’est pas un voyageur cosmopolite détaché, mais une femme dont la vulnérabilité sociale et corporelle conditionne chaque instant de son séjour en France.',
			'Le drame intime de l’arrachement : la rupture avec le Pérou et la séparation douloureuse d’avec Aza confèrent au roman une intensité pathétique et lyrique absente du regard distancié de Rica.',
			'L’accès au savoir et à l’écriture : l’abandon forcé des quipos au profit de la langue et de l’alphabet français matérialise une difficile émancipation intellectuelle par les Lumières.',
			'Un dénouement résolument moderne : refusant le mariage d’intérêt comme l’illusion d’une nouvelle soumission, Zilia choisit de vivre dans sa propre demeure, indépendante, entourée de ses livres et fidèle à son amitié choisie.',
		],
		conclusion:
			'Les deux chefs-d’œuvre s’inscrivent ainsi dans une même tradition épistolaire et philosophique des Lumières, mais Graffigny en déplace le centre de gravité : la critique des mœurs y sert l’émancipation d’une femme maîtresse de son destin.',
	},
	synthesisQuestion: {
		question:
			'Comment le regard d’un personnage étranger permet-il à Montesquieu et à Graffigny de critiquer la société française de leur temps ? Qu’apporte le point de vue de Zilia à cette tradition ?',
		hints: [
			'Sur le procédé commun : expliquez comment l’étonnement feint d’un étranger révèle les contradictions de la politesse, des cultes ou du pouvoir (défamiliarisation).',
			'Sur la singularité de Graffigny : analysez le rôle du statut de femme captive, l’importance de l’apprentissage de la langue et le refus du mariage au dénouement.',
		],
	},
};

export const graffignySources = {
	editionNote:
		'Édition suivie : le texte original de 1747 (38 lettres), transcription validée de Wikisource ; les citations en conservent l’orthographe (« François » pour « Français », « connoissance », etc.). L’édition augmentée de 1752 (41 lettres), au programme avec l’Introduction historique et les lettres XXVIII, XXIX, XXX et XXXIV, a été consultée sur le fac-similé numérisé : après la lettre XXVII, sa numérotation est décalée, et les deux numéros sont alors indiqués. Les ajouts de 1752 sont résumés, non cités.',
	references: [
		{
			title: 'Lettres d’une Péruvienne (1747), texte intégral — Wikisource',
			url: 'https://fr.wikisource.org/wiki/Lettres_d%E2%80%99une_P%C3%A9ruvienne',
			note: 'texte de référence de cette page (édition originale, « A Peine », 1747)',
		},
		{
			title: 'Lettres d’une Péruvienne, Paris, Duchesne, 1752, tome I — Internet Archive',
			url: 'https://archive.org/details/g1752lettresdun01graf',
			note: 'édition augmentée : Introduction historique, lettres I à XXVII',
		},
		{
			title: 'Lettres d’une Péruvienne, Paris, Duchesne, 1752, tome II — Internet Archive',
			url: 'https://archive.org/details/g1752lettresdun02graf',
			note: 'lettres XXVIII à XLI, dont les lettres nouvelles XXIX et XXXIV',
		},
		{
			title: 'Montesquieu, Lettres persanes (1721), lettre XXX — Wikisource',
			url: 'https://fr.wikisource.org/wiki/Lettres_persanes/Lettre_30',
			note: 'texte de référence pour le regard étranger et la formule de Rica (« Comment peut-on être Persan ? »)',
		},
		{
			title: 'Eduscol — Lettres d’une Péruvienne de Françoise de Graffigny : l’œuvre, le parcours (2024)',
			url: 'https://eduscol.education.fr/document/64078/download',
			note: 'ressource institutionnelle pour la classe de première',
		},
		{
			title: 'Voltaire Foundation — The Correspondence of Françoise de Graffigny',
			url: 'https://www.voltaire.ox.ac.uk/graffigny-correspondence/',
			note: 'édition savante de la correspondance (Université de Toronto, Voltaire Foundation)',
		},
	],
	internal: [
		{
			title: 'Frise chronologique',
			url: '/chronologie',
			note: 'repères littéraires et historiques du XVIIe au XIXe siècle, dont les Lettres d’une Péruvienne (1747, édition augmentée en 1752)',
		},
		{
			title: 'Molière, Dom Juan',
			url: '/don-juan',
			note: 'une autre carte des personnages ; satire des apparences et de l’hypocrisie au siècle précédent',
		},
	],
};

// ==========================================================================
// Parcours iconographique et documentaire (/graffigny)
// Documents authentifiés pour éclairer la lecture en classe de seconde :
// édition originale, autrice, quipos incas, sociabilité des salons et éducation
// ==========================================================================

export interface IconographyDocument {
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
	analysis: {
		whatItShows: string;
		textualLink: string;
		criticalLimitation: string;
	};
	questions: [string, string];
}

export const graffignyIconography: IconographyDocument[] = [
	{
		id: 'doc-edition-originale-1747',
		title: 'L’acte de publication anonyme : page de titre de l’édition originale (1747)',
		badge: 'Document contemporain (1747) · Édition originale',
		badgeClass: 'status-original',
		image: {
			src: '/images/graffigny/graffigny-edition-originale-1747.jpg',
			alt: 'Page de titre imprimée de la première édition des Lettres d’une Péruvienne portant la fausse adresse A Peine sans nom d’auteur (1747)',
			caption: 'Françoise de Graffigny, Lettres d’une Péruvienne, « A Peine » [Paris, 1747], in-12. Exemplaire de la Bibliothèque nationale de France.',
			width: 1280,
			height: 2205,
		},
		meta: {
			title: 'Lettres d’une Péruvienne (première édition, in-12)',
			author: 'Françoise de Graffigny (publié anonymement)',
			date: '1747 (achevé d’imprimer à la fin de 1747)',
			institution: 'Bibliothèque nationale de France (BnF, Réserve des livres rares)',
			identifier: 'BnF Gallica ark:/12148/bpt6k9812017x',
			identifierUrl: 'https://gallica.bnf.fr/ark:/12148/bpt6k9812017x',
			license: 'Domaine public (BnF Gallica)',
		},
		analysis: {
			whatItShows:
				'La page de titre imprimée de la véritable édition originale de 1747. Le livre ne mentionne ni nom d’auteur ni imprimeur officiel, mais affiche une adresse fictive (« A Peine ») et un fleuron typographique centré évoquant des rayons solaires.',
			textualLink:
				'Cette publication anonyme concrétise la feinte éditoriale de l’« Avertissement » : le livre s’y présente comme une authentique liasse de lettres rédigées d’abord en quipos puis traduites en espagnol et en français, protégeant l’autrice tout en piquant la curiosité du lecteur.',
			criticalLimitation:
				'L’image de la page de titre n’indique pas par elle-même l’identité de l’autrice : l’attribution à Mme de Graffigny a été établie par la critique contemporaine et les catalogues de bibliographes (comme Barbier). Elle se distingue aussi de l’édition augmentée de 1752 (41 lettres chez Duchesne).',
		},
		questions: [
			'Quelles mentions habituelles d’un livre imprimé (nom de l’auteur, privilège royal, nom d’éditeur) sont absentes de cette page de titre ?',
			'En quoi le motif solaire ornant le centre de la page peut-il rappeler le culte inca auquel Zilia était vouée à Cuzco ?',
		],
	},
	{
		id: 'doc-portrait-graffigny-1771',
		title: 'L’autrice et salonnière : Françoise de Graffigny gravée par Levesque (1771)',
		badge: 'Portrait d’autrice (XVIIIe siècle) · Source patrimoniale',
		badgeClass: 'status-auteur',
		image: {
			src: '/images/graffigny/portrait-francoise-de-graffigny-1771.jpg',
			alt: 'Gravure en buste de Françoise de Graffigny de trois quarts dans un médaillon ovale portant l’inscription Mme de Grafigni (1771)',
			caption: 'Pierre-Charles Levesque, Mme de Grafigni (1771), burin et eau-forte pour la Galerie française de J.-J. Restout. Musée Carnavalet — Histoire de Paris.',
			width: 2136,
			height: 3000,
		},
		meta: {
			title: 'Françoise d’Issembourg d’Happoncourt, dame de Grafigny (1695-1758), Femme de lettres',
			author: 'Pierre-Charles Levesque (1736–1812), graveur d’après modèle antérieur',
			date: '1771 (publication dans la Galerie française de Restout)',
			institution: 'Musée Carnavalet — Histoire de Paris (Paris Musées)',
			identifier: 'Musée Carnavalet 2022.0.1429',
			identifierUrl: 'https://www.parismuseescollections.paris.fr/fr/musee-carnavalet/oeuvres/francoise-d-issembourg-d-happoncourt-dame-de-grafigny-1695-1758-femme-de',
			license: 'Domaine public (Paris Musées CC0)',
		},
		analysis: {
			whatItShows:
				'Un portrait gravé en buste de Françoise de Graffigny, coiffée d’un bonnet de dentelle sobre et vêtue d’une mante fermée. Le visage mature et serein est encadré d’un médaillon suspendu au-dessus d’un cartouche gravé « Mme DE GRAFIGNI ».',
			textualLink:
				'Graffigny anima à Paris un salon littéraire influent rue d’Enfer où se réunissaient Turgot, Diderot, Duclos et d’Alembert. Cette posture intellectuelle résonne avec le dénouement des Lettres d’une Péruvienne, où Zilia refuse le mariage pour fonder son indépendance sur la lecture, l’écriture et l’amitié.',
			criticalLimitation:
				'Cette gravure a été exécutée en 1771, soit treize ans après la mort de l’autrice (1758). Elle relève de la consécration rétrospective des grands écrivains français et ne permet pas à elle seule de documenter la vie matérielle ou les ressources financières de l’autrice, connues par sa correspondance.',
		},
		questions: [
			'Comment la mise en scène (médaillon suspendu, cartouche gravé, sobriété du vêtement) met-elle en valeur le statut de femme de lettres ?',
			'La date de gravure (1771) étant postérieure à la mort de l’autrice (1758), quel était le rôle de ce type d’estampe dans la mémoire littéraire du XVIIIe siècle ?',
		],
	},
	{
		id: 'doc-quipu-brooklyn-museum',
		title: 'L’écriture des cordons : quipu inca authentique en fibres nouées',
		badge: 'Témoignage archéologique · Civilisation inca',
		badgeClass: 'status-perou',
		image: {
			src: '/images/graffigny/quipu-inca-brooklyn-museum.jpg',
			alt: 'Quipu inca en cordelettes de coton tressées avec des nœuds de différentes couleurs fixés à une corde principale horizontale',
			caption: 'Quipu inca en fibres de coton teintes et nouées (v. XVe siècle), cordons noués. Brooklyn Museum, New York.',
			width: 1536,
			height: 1152,
		},
		meta: {
			title: 'Inca Quipu (Record system using strings and knots)',
			author: 'Créateur inca anonyme (quipucamayoc / Empire inca)',
			date: 'XVe siècle (période inca précolombienne)',
			institution: 'Brooklyn Museum (New York, Arts of the Americas)',
			identifier: 'Brooklyn Museum (Fonds précolombien, via Wikimedia Commons)',
			identifierUrl: 'https://commons.wikimedia.org/wiki/File:Inca._Quipu.jpg',
			license: 'Domaine public / No known copyright restrictions (Brooklyn Museum)',
		},
		analysis: {
			whatItShows:
				'Un quipu andin composé d’une corde principale horizontale soutenant des dizaines de cordelettes de coton descendantes. Des nœuds simples et complexes ainsi que des variations de teintes y sont distinctement visibles.',
			textualLink:
				'Dans les lettres I à XVII, Zilia utilise ses quipos pour exprimer ses pensées et son amour à Aza : « ces nœuds qui frappent mes sens, semblent donner plus de réalité à mes pensées » (Lettre IV). Les cordons constituent le support matériel de la première moitié du roman.',
			criticalLimitation:
				'Les quipos précolombiens servaient dans l’Empire inca à la comptabilité démographique, fiscale, agricole et calendaire. Leur emploi comme support d’une correspondance amoureuse intime est une transposition poétique et fictionnelle propre à Françoise de Graffigny.',
		},
		questions: [
			'D’après la notice et l’image, de quels éléments matériels (corde, nœuds, couleurs) un quipu est-il constitué ?',
			'En quoi l’usage de ces cordons par Zilia dans le roman diffère-t-il de leur fonction administrative réelle dans l’Empire inca ?',
		],
	},
	{
		id: 'doc-quipucamayoc-guaman-poma',
		title: 'L’administrateur inca des quipos : le quipucamayoc par Guaman Poma (1615)',
		badge: 'Source historique indigène (1615) · Mémoire andine',
		badgeClass: 'status-perou',
		image: {
			src: '/images/graffigny/guaman-poma-quipucamayoc.jpg',
			alt: 'Dessin à la plume de Felipe Guaman Poma de Ayala représentant un administrateur inca tenant un quipu déplié au-dessus d’une table de calcul yupana',
			caption: 'Felipe Guaman Poma de Ayala, « Contador mayor y tesorero » tenant un quipu (1615), El primer nueva corónica y buen gobierno. Bibliothèque royale de Copenhague.',
			width: 385,
			height: 549,
		},
		meta: {
			title: 'El primer nueva corónica y buen gobierno : Contador mayor y tesorero (p. 360)',
			author: 'Felipe Guaman Poma de Ayala (chroniqueur d’ascendance inca, v. 1535–1616)',
			date: '1615 (manuscrit original achevé adressé à Philippe III)',
			institution: 'Bibliothèque royale du Danemark (Det Kongelige Bibliotek, Copenhague)',
			identifier: 'Copenhague GKS 2232 4°, p. 360 [362]',
			identifierUrl: 'https://www.kb.dk/permalink/2006/poma/360/es/text/',
			license: 'Domaine public (Det Kongelige Bibliotek)',
		},
		analysis: {
			whatItShows:
				'Un dessin à la plume montrant un haut dignitaire inca debout, tenant à deux mains un faisceau de quipos dépliés. Au coin inférieur gauche figure une yupana (table à compartiments utilisée pour les calculs).',
			textualLink:
				'Ce document constitue un repère pour comprendre l’« Introduction historique » ajoutée en 1752 : Graffigny y résume le système des quipos d’après Garcilaso de la Vega pour convaincre son lectorat que les Incas possédaient une méthode rigoureuse de conservation de la mémoire.',
			criticalLimitation:
				'Il s’agit d’un rapprochement documentaire moderne : le manuscrit de Guaman Poma, demeuré inédit jusqu’au XXe siècle à Copenhague, n’était pas connu de Graffigny au XVIIIe siècle (celle-ci s’appuyait sur l’Histoire des Incas de Garcilaso de la Vega).',
		},
		questions: [
			'Quels sont les deux instruments représentés sur le dessin (dans les mains du dignitaire et au sol à gauche) servant à compter et mémoriser ?',
			'Pourquoi la notice précise-t-elle que ce dessin est un rapprochement historique documentaire et non une source directe consultée par Graffigny en 1752 ?',
		],
	},
	{
		id: 'doc-chardin-institutrice',
		title: 'L’éducation des filles au XVIIIe siècle : La Jeune Maîtresse d’école de Chardin (v. 1737)',
		badge: 'Représentation contemporaine (v. 1737) · Histoire sociale',
		badgeClass: 'status-societe',
		image: {
			src: '/images/graffigny/chardin-jeune-institutrice-1737.jpg',
			alt: 'Tableau de Jean Siméon Chardin montrant une jeune fille bien mise enseignant patiemment la lecture à une fillette à l’aide d’un abécédaire et d’un pointeur',
			caption: 'Jean Siméon Chardin, La Jeune Maîtresse d’école (vers 1736–1737), huile sur toile, 61,6 × 66,7 cm. National Gallery, Londres.',
			width: 800,
			height: 743,
		},
		meta: {
			title: 'The Young Schoolmistress (La Jeune Maîtresse d’école)',
			author: 'Jean-Baptiste-Siméon Chardin (1699–1779)',
			date: 'Vers 1736–1737 (Salon de 1740)',
			institution: 'The National Gallery, Londres',
			identifier: 'National Gallery NG4077',
			identifierUrl: 'https://www.nationalgallery.org.uk/paintings/jean-simeon-chardin-the-young-schoolmistress',
			license: 'Domaine public (Open Access National Gallery)',
		},
		analysis: {
			whatItShows:
				'Une jeune fille vêtue d’une robe soignée et coiffée d’un bonnet blanc désignant une lettre de l’alphabet sur une feuille de papier avec une aiguille ou un pointeur, devant une petite fille attentive accoudée à une table de bois.',
			textualLink:
				'Cette scène illustre l’apprentissage des rudiments de lecture dans la bourgeoisie urbaine. Elle offre un contrepoint visuel à la critique formulée par Zilia au couvent puis dans la lettre XXXIV (1752), où elle dénonce une éducation mondaine superficielle qui apprend aux filles les grâces et la dissimulation plutôt que l’exercice de la raison.',
			criticalLimitation:
				'Le tableau de Chardin ne résume pas à lui seul l’ensemble des pratiques éducatives du XVIIIe siècle : c’est une scène de genre intimiste et idéalisée, centrée sur la douceur domestique, à distinguer de la claustration des pensionnats conventuels évoquée dans le roman.',
		},
		questions: [
			'Quels détails du tableau (geste de la main, regard de l’enfant, objet tenu) montrent la méthode d’apprentissage de la lecture ?',
			'En quoi cette image paisible de transmission contraste-t-elle avec la critique sévère de l’éducation des filles formulée par Zilia dans le roman ?',
		],
	},
	{
		id: 'doc-salon-geoffrin-lemonnier',
		title: 'La sociabilité des Lumières et le pouvoir des salonnières : le salon de Mme Geoffrin (Lemonnier)',
		badge: 'Représentation rétrospective · Débat des Lumières',
		badgeClass: 'status-lumieres',
		image: {
			src: '/images/graffigny/salon-madame-geoffrin-lemonnier.jpg',
			alt: 'Tableau monumental d’Anicet Charles Gabriel Lemonnier représentant la lecture d’une pièce de Voltaire dans le grand salon de Madame Geoffrin entourée des philosophes des Lumières',
			caption: 'Anicet Charles Gabriel Lemonnier, Une soirée chez Madame Geoffrin en 1755 (1812), huile sur toile. Musée des Beaux-Arts de Rouen.',
			width: 1179,
			height: 776,
		},
		meta: {
			title: 'Lecture de la tragédie « L’Orphelin de la Chine » de Voltaire dans le salon de Madame Geoffrin en 1755',
			author: 'Anicet Charles Gabriel Lemonnier (1743–1824), peintre d’histoire',
			date: '1812 (peint sous le Premier Empire, commandé par Joséphine de Beauharnais)',
			institution: 'Musée des Beaux-Arts de Rouen (Notice Histoire par l’image / RMN)',
			identifier: 'Musée des Beaux-Arts de Rouen 831.33 / RMN',
			identifierUrl: 'https://histoire-image.org/etudes/salons-xviiie-siecle',
			license: 'Domaine public (Musée des Beaux-Arts de Rouen / Wikimedia Commons)',
		},
		analysis: {
			whatItShows:
				'Une vaste assemblée mondaine dans un salon néoclassique orné de tableaux : l’acteur Lekain lit une pièce de Voltaire (dont le buste trône au fond) sous l’autorité de la maîtresse de maison, Madame Geoffrin, entourée de savants, d’encyclopédistes et de femmes de lettres.',
			textualLink:
				'Cette toile célèbre le rôle central des femmes dans la régulation des conversations philosophiques et la diffusion des Lumières, univers mondain dont Graffigny était l’une des actrices et que Zilia découvre avec un œil à la fois fasciné et critique dans ses lettres.',
			criticalLimitation:
				'Il s’agit d’une reconstitution rétrospective peinte en 1812, soit près de soixante ans après la scène fictivement située en 1755. Lemonnier réunit anachroniquement des figures qui ne se sont jamais côtoyées au même instant (Montesquieu est mort en février 1755 avant la première de la pièce) : c’est un hommage symbolique au siècle, non un reportage pris sur le vif.',
		},
		questions: [
			'D’après la notice (date de l’œuvre : 1812 ; scène représentée : 1755), pourquoi ne peut-on pas considérer cette toile comme un témoignage direct pris sur le vif ?',
			'Quelle place la maîtresse de maison (Mme Geoffrin, assise à droite) occupe-t-elle dans cette assemblée d’hommes de lettres et de savants ?',
		],
	},
];

