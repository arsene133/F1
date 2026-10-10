import type { EdgeType, MapNode, MapRelationship } from '../components/relationship-map/types';

// ==========================================================================
// Données pour la pièce Dom Juan de Molière (/don-juan)
// Comédie en cinq actes et en prose créée en 1665 au théâtre du Palais-Royal.
// Les citations ont été contrôlées d'après le texte établi de Molière.
// ==========================================================================

export interface ThemeHistoricalContext {
	title: string;
	text: string;
}

export interface CreationContextNote {
	title: string;
	text: string;
}

export interface MainTheme {
	id: string;
	title: string;
	tag: string;
	definitionQuestion: string;
	illustrationQuestion: string;
	summary: string;
	analysis: string;
	quote?: {
		text: string;
		speaker: string;
		ref: string;
	};
	historicalContext: ThemeHistoricalContext;
}

export interface SecondaryTheme {
	title: string;
	description: string;
}

export const domJuanCharacters: MapNode[] = [
	{
		id: 'dom-juan',
		label: 'Dom Juan',
		caption: 'grand seigneur libertin',
		eyebrow: 'Séducteur impénitent · défiant ciel et terre',
		meta: ['grand seigneur', 'fils de Dom Louis', 'libertin'],
		description:
			"Noble séducteur, Dom Juan revendique une liberté absolue sans égard pour la morale, l’honneur ni la foi. Il abandonne Elvire après l’avoir arrachée au cloître et multiplie les conquêtes jusqu’à son châtiment surnaturel.",
		points: [
			'Revendique l’inconstance comme un droit de jouissance et compare ses conquêtes à Alexandre (I, 2)',
			'Défie l’autorité morale et les leçons de vertu de son père Dom Louis (IV, 4)',
			'Adopte l’hypocrisie religieuse comme suprême armure sociale (V, 2)',
			'Refuse obstinément le repentir (V, 5) et périt foudroyé par la statue du Commandeur (V, 6)',
		],
		color: '#8a1f1a',
		tier: 'major',
		x: 450,
		y: 220,
		mx: 180,
		my: 180,
	},
	{
		id: 'sganarelle',
		label: 'Sganarelle',
		caption: 'valet de Dom Juan',
		eyebrow: 'Conscience craintive · bon sens et superstitions',
		meta: ['valet de chambre', 'voix comique et morale populaire'],
		description:
			"Serviteur tiraillé entre la crainte et l’intérêt matériel, Sganarelle tente d’opposer à son maître des croyances naïves et un bon sens populaire, tout en subissant sa domination et en redoutant le châtiment céleste.",
		points: [
			'Fait l’éloge du tabac et dresse le portrait effrayant de son maître à Gusman (I, 1)',
			'Tente de prouver l’existence de Dieu avec son raisonnement sur la « machine » humaine (III, 1)',
			'Sert d’intermédiaire comique face aux créanciers et aux paysannes (II et IV)',
			'Clôt la pièce sur sa plainte matérielle : « Mes gages, mes gages, mes gages ! » (V, 6)',
		],
		color: '#235284',
		tier: 'major',
		x: 230,
		y: 350,
		mx: 80,
		my: 360,
	},
	{
		id: 'done-elvire',
		label: 'Done Elvire',
		caption: 'épouse délaissée',
		eyebrow: 'Passion trahie puis charité désintéressée',
		meta: ['épouse de Dom Juan', 'arrachée au couvent'],
		description:
			"Arrachée à son couvent par Dom Juan qui l’a épousée puis abandonnée, Elvire passe de la fureur outragée de l’amante trahie à une charité chrétienne désintéressée, venant supplier Dom Juan d’échapper à la damnation.",
		points: [
			'Rattrape Dom Juan pour lui réclamer la vérité sur sa fuite et son parjure (I, 3)',
			'Revient sous le voile pour le supplier avec larmes de se repentir avant qu’il ne soit trop tard (IV, 6)',
		],
		color: '#7a2f4f',
		tier: 'major',
		x: 670,
		y: 220,
		mx: 280,
		my: 180,
	},
	{
		id: 'commandeur',
		label: 'Le Commandeur',
		caption: 'la statue de pierre',
		eyebrow: 'Justice transcendante et surnaturel dramatique',
		meta: ['mort assassiné par Dom Juan', 'statue animée'],
		description:
			"Ancien ennemi tué en duel par Dom Juan, le Commandeur réapparaît sous la forme d’une statue funéraire miraculeusement vivante pour incarner la justice transcendante et exécuter le châtiment suprême.",
		points: [
			'Accepte d’un signe de tête l’invitation à souper lancée par bravade devant son tombeau (III, 5)',
			'Rend visite à Dom Juan à la fin du souper (IV, 8) puis l’entraîne dans le brasier vengeur (V, 6)',
		],
		color: '#4d5b66',
		tier: 'standard',
		x: 450,
		y: 70,
		mx: 180,
		my: 40,
	},
	{
		id: 'dom-louis',
		label: 'Dom Louis',
		caption: 'père de Dom Juan',
		eyebrow: 'Honneur aristocratique et vertu bafouée',
		meta: ['grand seigneur', 'père vertueux'],
		description:
			"Père courroucé, il rappelle à son fils que la véritable noblesse réside dans la vertu et l’intégrité morale, et non dans la simple naissance ou les privilèges hérités.",
		points: [
			'Assène que « la vertu est le premier titre de noblesse » (IV, 4)',
			'Espère brièvement une conversion avant d’être trompé par l’hypocrisie feinte de son fils (V, 1)',
		],
		color: '#8b572a',
		tier: 'standard',
		x: 230,
		y: 100,
		mx: 80,
		my: 490,
	},
	{
		id: 'dom-carlos',
		label: 'Dom Carlos',
		caption: 'frère d’Elvire',
		eyebrow: 'Code de l’honneur et reconnaissance chevaleresque',
		meta: ['gentilhomme', 'défenseur de l’honneur familial'],
		description:
			"Frère d’Elvire en quête de vengeance, il est sauvé par Dom Juan attaqué par des voleurs et se retrouve déchiré entre le devoir de reconnaissance et l’exigence rigide du code de l’honneur.",
		points: [
			'Secouru par Dom Juan dans la forêt contre trois voleurs (III, 2-3)',
			'Accorde un délai de grâce à Dom Juan malgré l’impatience vindicative de son frère Dom Alonse (III, 4)',
		],
		color: '#5b347b',
		tier: 'minor',
		x: 670,
		y: 370,
		mx: 280,
		my: 490,
	},
	{
		id: 'monsieur-dimanche',
		label: 'M. Dimanche',
		caption: 'créancier marchand',
		eyebrow: 'Victime comique de la manipulation verbale',
		meta: ['marchand bourgeois', 'créancier crédule'],
		description:
			"Marchand créancier venu réclamer son argent, il est totalement désarmé par les politesses obséquieuses et le bagout aristocratique de Dom Juan sans pouvoir placer un mot sur sa dette.",
		points: [
			'Subit le flot de compliments et d’éloges de Dom Juan jusqu’à devoir s’en aller sans son dû (IV, 3)',
		],
		color: '#6b5a3e',
		tier: 'minor',
		x: 230,
		y: 490,
		mx: 80,
		my: 610,
	},
	{
		id: 'paysans',
		label: 'Pierrot & les paysannes',
		caption: 'Charlotte & Mathurine',
		eyebrow: 'Comique de mœurs rustiques et prédation sociale',
		meta: ['paysans de la côte', 'naïveté populaire'],
		description:
			"Pierrot sauve Dom Juan de la noyade mais se fait voler sa promise. Dom Juan promet ensuite simultanément le mariage à Charlotte et Mathurine dans un numéro de virtuosité manipulatrice.",
		points: [
			'Pierrot raconte le sauvetage en patois avant de subir les coups du gentilhomme (II, 1-3)',
			'Dom Juan promet le mariage aux deux paysannes à la fois en les flattant tour à tour (II, 4)',
		],
		color: '#7a7366',
		tier: 'minor',
		x: 670,
		y: 490,
		mx: 280,
		my: 610,
	},
];

export const domJuanEdgeTypes: Record<string, EdgeType> = {
	master: { legend: 'Maître & valet (débat comique)', stroke: '#235284', activeStroke: '#172b3a', width: 3, activeWidth: 4 },
	seduced: { legend: 'Séduction / trahison', stroke: '#8a1f1a', activeStroke: '#63100d', width: 2.5, activeWidth: 3.5, arrow: 'end' },
	divine: { legend: 'Défi / châtiment surnaturel', stroke: '#4d5b66', activeStroke: '#1e2830', width: 2.5, activeWidth: 3.5, dash: '6 4', arrow: 'end' },
	family: { legend: 'Filiation / réprobation morale', stroke: '#8b572a', activeStroke: '#5a3517', width: 2, activeWidth: 2.8, arrow: 'end' },
	honor: { legend: 'Honneur familial vs gratitude', stroke: '#5b347b', activeStroke: '#3c1f54', width: 1.8, activeWidth: 2.5, dash: '4 4' },
	manipulation: { legend: 'Manipulation sociale / dette éludée', stroke: '#6b5a3e', activeStroke: '#3f3422', width: 1.8, activeWidth: 2.5, dash: '6 3', arrow: 'end' },
};

export const domJuanRelationships: MapRelationship[] = [
	{
		source: 'dom-juan',
		target: 'sganarelle',
		type: 'master',
		label: 'domine ↔ conteste avec effroi',
		description:
			"Le duo comique et dramaturgique central. Dom Juan impose son autorité et ridiculise les superstitions de son valet ; Sganarelle, terrorisé mais lucide, tente d'opposer son bon sens et sa morale populaire avant de réclamer ses gages à la chute de son maître.",
		labelDx: -45,
		labelDy: 20,
		mobileLabel: true,
	},
	{
		source: 'dom-juan',
		target: 'done-elvire',
		type: 'seduced',
		label: 'arrache au couvent → abandonne',
		description:
			"Dom Juan l’a séduite et épousée pour triompher de ses vœux religieux, puis l'abandonne aussitôt. Elvire passe du reproche passionné au sublime pardon chrétien lorsqu’elle vient l’avertir du péril céleste.",
		labelDx: 40,
		labelDy: -15,
		mobileLabel: true,
	},
	{
		source: 'commandeur',
		target: 'dom-juan',
		type: 'divine',
		label: 'châtie le blasphème',
		description:
			"Le Commandeur, tué par Dom Juan, revient sous la forme d’une statue de pierre animée pour faire entendre la justice transcendante et sceller le destin tragique du libertin impénitent.",
		labelDx: 15,
		labelDy: -20,
		mobileLabel: true,
	},
	{
		source: 'dom-louis',
		target: 'dom-juan',
		type: 'family',
		label: 'condamne l’indignité',
		description:
			"Le père fait la leçon au fils sur la noblesse du cœur et la déchéance des privilèges sans vertu. Dom Juan écoute avec un mépris sarcastique puis simule une fausse conversion pour neutraliser ses reproches.",
		labelDx: -40,
		labelDy: -15,
		mobileLabel: true,
	},
	{
		source: 'dom-carlos',
		target: 'dom-juan',
		type: 'honor',
		label: 'dette de vie vs honneur d’Elvire',
		description:
			"Frère d’Elvire, Dom Carlos doit venger l’honneur de sa sœur mais se heurte au devoir de reconnaissance après que Dom Juan l’a tiré des mains des voleurs.",
		labelDx: 40,
		labelDy: 15,
		mobileLabel: true,
	},
	{
		source: 'dom-juan',
		target: 'monsieur-dimanche',
		type: 'manipulation',
		label: 'esquive la dette par l’éloge',
		description:
			"Dom Juan noie son créancier sous un déluge de politesses mondaines et de sollicitude affectée, l’empêchant matériellement de réclamer son argent.",
		labelDx: -40,
		labelDy: 30,
	},
	{
		source: 'dom-juan',
		target: 'paysans',
		type: 'seduced',
		label: 'berne les cœurs rustiques',
		description:
			"Dom Juan bafoue la dette contractée envers Pierrot qui l’a sauvé de la noyade et promet le mariage aux deux paysannes Charlotte et Mathurine dans le même élan.",
		labelDx: 40,
		labelDy: 30,
	},
];

export const domJuanMechanism = [
	{ step: 'Défi', text: 'Dom Juan rompt ses vœux de mariage et s’enfuit après avoir délaissé Elvire (acte I).' },
	{ step: 'Conquêtes', text: 'Il berne les paysannes et esquive ses dettes par l’éloquence courtisane (actes II et IV).' },
	{ step: 'Provocation', text: 'Il brave l’ordre sacré en invitant à souper la statue funéraire du Commandeur (acte III).' },
	{ step: 'Masque', text: 'Il adopte l’hypocrisie dévote pour désarmer ses accusateurs et jouir de l’impunité (acte V).' },
	{ step: 'Foudre', text: 'Refusant obstinément le repentir, il est foudroyé et englouti dans les flammes (acte V).' },
];

export const domJuanFunctions: Record<string, string> = {
	'dom-juan': 'Protagoniste provocateur · moteur de l’action et libertin impénitent',
	sganarelle: 'Valet critique · contrepoint moral, comique et contradicteur naïf',
	'done-elvire': 'Victime passionnée · voix du sublime pardon chrétien',
	commandeur: 'Instrument surnaturel de la justice transcendante',
	'dom-louis': 'Garant de la morale aristocratique et de l’autorité paternelle',
	'dom-carlos': 'Défenseur de l’honneur chevaleresque pris entre dette et vengeance',
	'monsieur-dimanche': 'Victime bourgeoise de l’éloquence courtisane manipulatrice',
	paysans: 'Comique de mœurs rustiques · proies de la prédation sociale',
};

// --------------------------------------------------------------------------
// Sections thématiques pédagogiques pour le lycée (classe de seconde)
// --------------------------------------------------------------------------

export const creationContext: CreationContextNote = {
	title: 'Pourquoi Molière écrit-il cette pièce en 1665 ?',
	text: 'Créé en février 1665, Dom Juan est joué dans un climat tendu, quelques mois après l’interdiction publique de Tartuffe. Molière choisit un sujet à grand spectacle alors très populaire, tout en abordant des questions sensibles : la fausse dévotion, l’honneur des familles, les abus des grands seigneurs et les limites de la liberté. Même si l’affaire de Tartuffe a marqué la troupe, il ne faut pas réduire cette création à une seule cause : les intentions réelles de Molière restent discutées.',
};

export const mainThemes: MainTheme[] = [
	{
		id: 'seduction-inconstance',
		title: '1. La séduction et l’inconstance amoureuse',
		tag: 'Thème majeur',
		definitionQuestion: 'Qu’est-ce que ce thème ?',
		illustrationQuestion: 'Comment la pièce l’illustre-t-elle ?',
		summary:
			'Dom Juan multiplie les conquêtes et refuse de rester fidèle à une seule femme. Il conçoit la séduction comme un plaisir sans cesse renouvelé et justifie son comportement par son appétit de nouveauté.',
		analysis:
			'Dans sa grande tirade de l’acte I, scène 2, Dom Juan élabore une véritable théorie de l’inconstance : limiter son désir à une seule amante reviendrait, selon lui, à commettre une injustice envers toutes les autres beautés de la Terre. L’amour n’est pas un sentiment partagé ni un engagement durable, mais une campagne militaire : dès que le cœur d’une femme capitule, le charme retombe et l’ennui s’installe. Dom Juan compare explicitement son ambition amoureuse à celle d’Alexandre le Grand, aspirant à d’autres mondes à conquérir. Toutefois, ce discours masque une prédation cruelle : pour satisfaire sa vanité, il arrache Done Elvire à son couvent, dupe Charlotte et Mathurine en leur promettant le mariage simultanément (acte II, scène 4), abandonnant ses victimes au déshonneur social sans le moindre remords.',
		quote: {
			text: 'Quoi ! tu veux qu’on se lie à demeurer au premier objet qui nous prend, qu’on renonce au monde pour lui, et qu’on n’ait plus d’yeux pour personne ? […] Pour moi, la beauté me ravit partout où je la trouve, et je cède facilement à cette douce violence dont elle nous entraîne. […] et, comme Alexandre, je souhaiterais qu’il y eût d’autres mondes, pour y pouvoir étendre mes conquêtes amoureuses.',
			speaker: 'Dom Juan',
			ref: 'Acte I, scène 2',
		},
		historicalContext: {
			title: 'Le contexte historique : mariage et honneur féminin',
			text: 'Au XVIIᵉ siècle, le mariage engage d’abord l’honneur et la situation matérielle des familles. Pour une femme, la réputation est capitale : être séduite puis délaissée entraîne un déshonneur durable, et selon les décisions familiales, un retrait contraint au couvent pour étouffer le scandale. Alors que Dom Juan jouit d’une relative impunité en multipliant les conquêtes, les femmes qu’il trompe, de la noble Elvire à la paysanne Charlotte, subissent des conséquences sociales bien plus lourdes et inégales.',
		},
	},
	{
		id: 'hypocrisie-religieuse',
		title: '2. L’hypocrisie religieuse',
		tag: 'Critique sociale',
		definitionQuestion: 'Qu’est-ce que ce thème ?',
		illustrationQuestion: 'Comment la pièce l’illustre-t-elle ?',
		summary:
			'Dom Juan utilise la religion comme un masque protecteur pour dissimuler ses vices et tromper son entourage. Molière fustige l’écart entre la dévotion affichée et la conduite réelle.',
		analysis:
			'À l’acte V, alors que ses créanciers, les frères d’Elvire et la justice le cernent de toutes parts, Dom Juan ne change nullement de cœur mais choisit un nouveau déguisement tactique : la fausse dévotion. À la scène 2, il explique cyniquement à Sganarelle que l’hypocrisie est un « vice à la mode » qui permet de s’abriter derrière les apparences de la piété pour jouir d’une totale impunité. Le masque religieux devient une arme redoutable pour tromper son père Dom Louis (V, 1) et désarmer Dom Carlos (V, 3). Il importe d’insister sur une distinction essentielle pour un lycéen : Molière n’attaque pas la foi des croyants sincères, mais fustige les imposteurs qui instrumentalisent le sacré à des fins d’ambition et de dissimulation — écho direct aux dévots rigoristes qui venaient de faire censurer son Tartuffe en 1664.',
		quote: {
			text: 'Il n’y a plus de honte maintenant à cela ; l’hypocrisie est un vice à la mode, et tous les vices à la mode passent pour vertus. Le personnage d’homme de bien est le meilleur de tous les personnages qu’on puisse jouer. […] mais l’hypocrisie est un vice privilégié, qui, de sa main, ferme la bouche à tout le monde, et jouit en repos d’une impunité souveraine.',
			speaker: 'Dom Juan',
			ref: 'Acte V, scène 2',
		},
		historicalContext: {
			title: 'Le contexte historique : l’Église et la fausse dévotion',
			text: 'Dans la France de Louis XIV, la religion catholique joue un rôle central dans la vie publique et politique. La piété est valorisée et les personnes très dévotes exercent une grande autorité morale. L’interdiction de Tartuffe en 1664 montre à quel point critiquer les faux dévots est alors explosif. À l’acte V, scène 2, Dom Juan choisit d’ailleurs ce masque pour désarmer ses adversaires. Molière s’attaque ainsi à ceux qui détournent la religion par calcul, sans condamner pour autant la foi chrétienne sincère.',
		},
	},
	{
		id: 'religion-chatiment-divin',
		title: '3. La religion et le châtiment divin',
		tag: 'Métaphysique & dramaturgie',
		definitionQuestion: 'Qu’est-ce que ce thème ?',
		illustrationQuestion: 'Comment la pièce l’illustre-t-elle ?',
		summary:
			'Dom Juan conteste les croyances religieuses et brave ouvertement la puissance divine. La statue du Commandeur fait surgir le surnaturel et pose la question de la justice céleste.',
		analysis:
			'Face aux convictions religieuses, Dom Juan affiche un scepticisme insolent. Interrogé par Sganarelle sur sa foi, il affirme ne croire qu’au calcul arithmétique : « Je crois que deux et deux sont quatre, Sganarelle, et que quatre et quatre sont huit » (acte III, scène 1). Ce matérialisme n’est pas un système philosophique complet, mais une provocation permanente : dans la scène du Pauvre (III, 2), il tente d’acheter un blasphème pour un louis d’or avant de le donner « pour l’amour de l’humanité ». Pour répondre à cette insolence, Molière fait intervenir un ressort spectaculaire propre à la tradition théâtrale espagnole et baroque : la statue funéraire du Commandeur s’anime (acte III, scène 5), rend visite au libertin (IV, 8) et l’engloutit dans le feu infernal (V, 6). Dom Juan refuse le repentir jusqu’au dernier instant, conférant à sa fin une dimension tragique et métaphysique.',
		quote: {
			text: 'Non, non, il ne sera pas dit, quoi qu’il arrive, que je sois capable de me repentir. Allons, suis-moi.',
			speaker: 'Dom Juan',
			ref: 'Acte V, scène 5',
		},
		historicalContext: {
			title: 'Le contexte historique : foi religieuse et tradition théâtrale',
			text: 'Au XVIIᵉ siècle, la foi chrétienne donne une place centrale au salut de l’âme, au péché et au jugement après la mort. En faisant bouger la statue du Commandeur, Molière utilise une tradition théâtrale où le surnaturel punit le pécheur. Cependant, si cette fin met en scène la justice divine, le cri final de Sganarelle réclamant ses gages crée une chute comique inattendue. Ce contraste rappelle que la pièce ne se réduit pas à un simple sermon religieux.',
		},
	},
	{
		id: 'maitre-valet',
		title: '4. Le maître et le valet',
		tag: 'Comédie & dramaturgie',
		definitionQuestion: 'Qu’est-ce que ce thème ?',
		illustrationQuestion: 'Comment la pièce l’illustre-t-elle ?',
		summary:
			'Les dialogues entre Dom Juan et Sganarelle opposent les raisonnements provocateurs du maître aux angoisses, au bon sens populaire et aux objections morales du serviteur.',
		analysis:
			'Hérité de la comédie antique et de la commedia dell’arte, le couple maître-valet forme l’armature dramatique de la pièce. Dom Juan manie une rhétorique virtuose, l’ironie et la logique sophistiquée pour désarmer son interlocuteur ; Sganarelle tente de lui opposer un mélange de bon sens populaire, de vérités morales et de superstitions naïves (le loup-garou, le moine bourru). Sganarelle n’est pas un sage cohérent : sa pensée est hésitante, sa démonstration sur l’agencement de l’homme s’achève par une chute burlesque (III, 1), et sa terreur le rend souvent complice des méfaits de son maître. Ce contraste produit un comique de geste et de parole savoureux, tout en offrant au public un témoin permanent des transgressions de Dom Juan.',
		quote: {
			text: 'Pour moi, monsieur, je n’ai point étudié comme vous, Dieu merci, et personne ne saurait se vanter de m’avoir jamais rien appris ; mais, avec mon petit sens, mon petit jugement, je vois les choses mieux que tous les livres, et je comprends fort bien que ce monde que nous voyons n’est pas un champignon qui soit venu tout seul en une nuit.',
			speaker: 'Sganarelle',
			ref: 'Acte III, scène 1',
		},
		historicalContext: {
			title: 'Le contexte historique : la relation maître-valet au XVIIᵉ siècle',
			text: 'Au XVIIᵉ siècle, la relation entre un maître et son valet repose sur une obéissance très stricte : le serviteur dépend entièrement de son maître. Au théâtre, Molière accorde pourtant à Sganarelle une liberté de parole pour commenter les actes du noble. Leurs échanges font rire tout en révélant des tensions sociales réelles. Mais Sganarelle n’est pas un modèle de sagesse : ses peurs superstitieuses, son intérêt personnel et ses arguments maladroits le rendent lui-même très contradictoire.',
		},
	},
	{
		id: 'critique-noblesse',
		title: '5. La critique de la noblesse et des privilèges',
		tag: 'Satire sociale & politique',
		definitionQuestion: 'Qu’est-ce que ce thème ?',
		illustrationQuestion: 'Comment la pièce l’illustre-t-elle ?',
		summary:
			'Dom Juan abuse de son rang et de son statut social pour imposer sa volonté et échapper à ses devoirs. Son attitude met en scène les dérives d’un aristocrate qui se croit au-dessus des lois communes.',
		analysis:
			'Dans la société d’Ancien Régime, la naissance noble confère des prérogatives considérables : le port de l’épée, la faveur du prince et l’immunité de fait face aux roturiers. Dom Juan use sans scrupule de cette position pour se soustraire à la loi commune : il bafoue sa parole, brutalise les paysans (II, 3) et congédie avec une politesse hautaine son créancier Monsieur Dimanche (IV, 3). Mais la pièce ne valide nullement ces privilèges corrompus. Par la bouche de Dom Louis (acte IV, scène 4), Molière oppose l’éthique nobiliaire authentique à l’arrogance de caste : le père rappelle avec sévérité que les titres sans conduite morale sont un déshonneur et que le mérite personnel prime sur le nom que l’on porte.',
		quote: {
			text: 'Apprenez enfin qu’un gentilhomme qui vit mal est un monstre dans la nature ; que la vertu est le premier titre de noblesse ; que je regarde bien moins au nom qu’on signe, qu’aux actions qu’on fait […].',
			speaker: 'Dom Louis',
			ref: 'Acte IV, scène 4',
		},
		historicalContext: {
			title: 'Le contexte historique : rang noble et devoir moral',
			text: 'Au XVIIᵉ siècle, la société française est divisée en ordres inégaux (clergé, noblesse, tiers état). En tant que grand seigneur, Dom Juan s’appuie sur son rang pour intimider ses créanciers et maltraiter les paysans. Face à lui, son père Dom Louis rappelle que la noblesse ne vaut rien sans la vertu. La pièce met ainsi en scène une tension centrale de l’époque : le conflit entre les privilèges liés à la naissance et l’exigence de responsabilité morale.',
		},
	},
	{
		id: 'liberte-transgression',
		title: '6. La liberté individuelle et la transgression',
		tag: 'Philosophie morale',
		definitionQuestion: 'Qu’est-ce que ce thème ?',
		illustrationQuestion: 'Comment la pièce l’illustre-t-elle ?',
		summary:
			'Dom Juan repousse les conventions sociales, morales et religieuses. Si son indépendance d’esprit témoigne d’une indéniable audace, elle lui sert aussi à tromper, dominer et écraser autrui.',
		analysis:
			'Dom Juan pousse l’exigence de souveraineté individuelle jusqu’à son terme le plus radical : il n’obéit qu’à son désir, rejette les interdits de la tradition et refuse toute soumission spirituelle ou familiale. Cette indépendance présente des traits séduisants pour le spectateur du XVIIe siècle comme pour un lecteur moderne : l’homme est brillant, d’un courage physique indéniable face aux brigands (III, 2) et refuse les faux-fuyants hypocrites ordinaires. Pourtant, Molière montre que cette liberté dégénère en tyrannie pure lorsqu’elle s’affranchit de toute responsabilité éthique : être libre, pour Dom Juan, consiste à asservir la volonté des autres et à détruire ce qui résiste à son ego. Sa liberté ne fonde aucun projet émancipateur pour autrui, elle n’est qu’une volonté de toute-puissance solitaire.',
		quote: {
			text: 'Va, va, je te le donne pour l’amour de l’humanité. Mais que vois-je là ? Un homme attaqué par trois autres ? La partie est trop inégale, et je ne dois pas souffrir cette lâcheté.',
			speaker: 'Dom Juan',
			ref: 'Acte III, scène 2',
		},
		historicalContext: {
			title: 'Le contexte historique : liberté libertine et autorité royale',
			text: 'Au XVIIᵉ siècle, il faut distinguer les libertins d’esprit historiques, qui interrogent philosophiquement la religion, du personnage théâtral de Dom Juan. Le héros de Molière n’est pas un penseur : il détourne le scepticisme pour justifier sa conduite immorale et son mépris des règles. Cette provocation n’a donc rien à voir avec nos droits individuels d’aujourd’hui : sa liberté ne cherche pas l’émancipation d’autrui, mais sert uniquement son propre plaisir.',
		},
	},
];

export const secondaryThemes: SecondaryTheme[] = [
	{
		title: 'Le mensonge et la manipulation',
		description:
			'Dom Juan orchestre ses relations par le verbe : fausses promesses matrimoniales faites aux femmes (Elvire, Charlotte, Mathurine), flatteries obséquieuses pour neutraliser Monsieur Dimanche (IV, 3) et simulation de piété envers son père (V, 1).',
	},
	{
		title: 'L’honneur et la fidélité',
		description:
			'Les devoirs moraux défendus par Dom Louis, Done Elvire et les frères Dom Carlos et Dom Alonse révèlent par contraste le cynisme de Dom Juan, incapable de tenir une parole donnée dès qu’elle exige fidélité ou sacrifice.',
	},
	{
		title: 'Le comique et la satire sociale',
		description:
			'Le rire de Molière côtoie constamment les enjeux dramatiques graves : verve populaire et patois savoureux de Pierrot (II, 1), scène de double séduction simultanée (II, 4), querelles de Sganarelle et déroute comique de Monsieur Dimanche (IV, 3).',
	},
	{
		title: 'La mort et la justice',
		description:
			'La mort plane sur toute la seconde moitié de l’œuvre : tombeau monumental du Commandeur, apparition spectrale du Temps à la faux (V, 5) et engloutissement final qui rétablit une justice transcendante après l’échec des lois humaines.',
	},
	{
		title: 'La condition féminine',
		description:
			'Done Elvire recluse au cloître puis trahie, comme Charlotte et Mathurine séduites par le mirage d’une promotion sociale, illustrent la vulnérabilité des femmes dans une société où leur statut dépend du rang et de la protection des hommes.',
	},
];

export const dissertationTakeaway =
	'Dom Juan met en scène le conflit entre la liberté individuelle et les règles morales. La pièce dénonce également l’hypocrisie religieuse, les abus de pouvoir et l’inconstance amoureuse.';
