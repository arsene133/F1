import type { EdgeType, MapNode, MapRelationship } from '../components/relationship-map/types';

// ==========================================================================
// Données pour la pièce Dom Juan de Molière (/don-juan)
// Comédie en cinq actes et en prose créée en 1665.
// ==========================================================================

export interface MainTheme {
	id: string;
	title: string;
	tag: string;
	summary: string;
	analysis: string;
	quote?: {
		text: string;
		speaker: string;
		ref: string;
	};
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
			"Noble séducteur, Dom Juan revendique une liberté absolue sans égard pour la morale, l’honneur ni la religion. Il abandonne Elvire après l’avoir arrachée au couvent et multiplie les conquêtes jusqu’à son châtiment.",
		points: [
			'Revendique l’inconstance comme un hommage à toutes les beautés (I, 2)',
			'Défie l’autorité morale de son père Dom Louis (IV, 4)',
			'Adopte l’hypocrisie religieuse comme suprême armure sociale (V, 2)',
			'Périt foudroyé par la statue du Commandeur sans s’être repenti (V, 6)',
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
		eyebrow: 'Conscience craintive · bon sens populaire',
		meta: ['valet de chambre', 'voix comique et morale'],
		description:
			"Serviteur dévoué et effrayé, Sganarelle tente de ramener son maître à la raison par des raisonnements naïfs ou superstitieux, tout en subissant sa domination et en redoutant le châtiment divin.",
		points: [
			'Fait l’éloge du tabac et dresse le portrait effrayant de son maître (I, 1)',
			'Tente de prouver l’existence de Dieu avec son raisonnement maladroit (III, 1)',
			'Sert d’intermédiaire comique face aux créanciers et aux paysans (II et IV)',
			'Clôt la pièce sur sa plainte matérielle : « Mes gages ! mes gages ! » (V, 6)',
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
		eyebrow: 'Passion outragée puis charité désintéressée',
		meta: ['épouse de Dom Juan', 'arrachée au couvent'],
		description:
			"Arrachée à son couvent par Dom Juan qui l’a épousée puis abandonnée, Elvire passe de la fureur de la femme trahie à un amour pur et chrétien cherchant à sauver Dom Juan de la damnation.",
		points: [
			'Rattrape Dom Juan pour lui réclamer la vérité sur sa fuite (I, 3)',
			'Revient sous le voile pour le supplier de se repentir avant qu’il ne soit trop tard (IV, 6)',
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
		eyebrow: 'Justice divine et surnaturel',
		meta: ['mort assassiné par Dom Juan', 'statue animée'],
		description:
			"Ancien ennemi tué par Dom Juan, le Commandeur réapparaît sous la forme d’une statue funéraire miraculeusement vivante pour incarner la justice transcendante et exécuter le châtiment suprême.",
		points: [
			'Accepte d’un signe de tête l’invitation à souper lancée par bravade (III, 5)',
			'Rend visite à Dom Juan et lui tend la main fatale qui l’engloutit dans les flammes (V, 6)',
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
			"Père courroucé, il rappelle à son fils que la véritable noblesse réside dans la vertu et l’intégrité des actes, et non dans la simple naissance ou les privilèges hérités.",
		points: [
			'Assène que « la naissance n’est rien où la vertu n’est pas » (IV, 4)',
			'Espère brièvement une conversion avant d’être trompé par l’hypocrisie de son fils (V, 1)',
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
		eyebrow: 'Code de l’honneur et reconnaissance',
		meta: ['gentilhomme', 'défenseur de l’honneur familial'],
		description:
			"Frère d’Elvire en quête de vengeance, il est sauvé par Dom Juan attaqué par des brigands et se retrouve partagé entre le devoir de reconnaissance et l’exigence rigide du code de l’honneur.",
		points: [
			'Secouru par Dom Juan dans la forêt (III, 2)',
			'Accorde un sursis à Dom Juan malgré l’impatience de son frère Dom Alonse (III, 4)',
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
		eyebrow: 'Victime comique de la manipulation',
		meta: ['commerçant', 'créancier crédule'],
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
		eyebrow: 'Comique de paysannerie et double séduction',
		meta: ['paysans de la côte', 'naïveté populaire'],
		description:
			"Pierrot sauve Dom Juan du naufrage mais se fait voler sa fiancée. Dom Juan promet le mariage simultanément à Charlotte et Mathurine dans une scène de virtuosité manipulatrice.",
		points: [
			'Pierrot raconte le sauvetage en patois savoureux (II, 1)',
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
			"Le duo comique et philosophique central. Dom Juan impose son autorité et ridiculise les superstitions de son valet ; Sganarelle, terrorisé mais lucide, tente de faire entendre la voix de la morale et du bon sens avant de réclamer ses gages.",
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
			"Dom Juan l’a séduite et épousée pour triompher de ses vœux religieux, puis s’en lasse aussitôt. Elvire passe du reproche douloureux au sublime pardon chrétien lorsqu’elle vient l’avertir du péril céleste.",
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
			"Le Commandeur, assassiné par Dom Juan, revient sous la forme d’une statue de pierre animée pour faire entendre la justice transcendante et sceller le destin tragique du scélérat qui a refusé le repentir.",
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
			"Le père fait la leçon au fils sur la noblesse du cœur et la dégénérescence des privilèges. Dom Juan écoute avec un mépris ironique puis simule une conversion trompeuse pour se débarrasser des reproches paternels.",
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
			"Dom Juan dédaigne la reconnaissance due à Pierrot qui l’a sauvé de la noyade et promet le mariage aux deux paysannes Charlotte et Mathurine dans le même élan.",
		labelDx: 40,
		labelDy: 30,
	},
];

export const domJuanMechanism = [
	{ step: 'Défi', text: 'Dom Juan rompt ses promesses et s’enfuit après avoir délaissé Elvire.' },
	{ step: 'Conquêtes', text: 'Il multiplie les séductions auprès des paysannes et nargue les créanciers.' },
	{ step: 'Provocation', text: 'Il invite par bravade la statue funéraire du Commandeur à souper.' },
	{ step: 'Masque', text: 'Il prend l’habit du dévot pour désarmer toute critique de son entourage.' },
	{ step: 'Foudre', text: 'La statue de pierre l’entraîne dans les abîmes de la terre.' },
];

export const domJuanFunctions: Record<string, string> = {
	'dom-juan': 'Protagoniste provocateur · moteur de l’action',
	sganarelle: 'Valet critique · contrepoint moral et comique',
	'done-elvire': 'Victime passionnée · voix de la rédemption',
	commandeur: 'Instrument surnaturel du châtiment divin',
	'dom-louis': 'Garant de la morale aristocratique et paternelle',
	'dom-carlos': 'Défenseur de l’honneur chevaleresque',
	'monsieur-dimanche': 'Victime bourgeoise de l’éloquence courtisane',
	paysans: 'Comique de mœurs populaires · proies de séduction',
};

// --------------------------------------------------------------------------
// Sections thématiques pédagogiques pour le lycée (classe de seconde)
// --------------------------------------------------------------------------

export const mainThemes: MainTheme[] = [
	{
		id: 'seduction-inconstance',
		title: '1. La séduction et l’inconstance amoureuse',
		tag: 'Thème majeur',
		summary:
			'Dom Juan multiplie les conquêtes et refuse de rester fidèle à une seule femme. Il conçoit la séduction comme un plaisir sans cesse renouvelé et justifie son comportement par son appétit de nouveauté.',
		analysis:
			'Pour Dom Juan, aimer une seule femme reviendrait à faire une injustice à toutes les autres beautés de la Terre. L’amour n’est pas chez lui un engagement moral durable ni un don de soi, mais une entreprise guerrière où seule compte la conquête : dès que le cœur d’une amante est conquis, tout le charme s’évanouit et le désir d’un nouveau triomphe renaît. Il compare explicitement son ambition amoureuse à celle d’Alexandre le Grand désirant d’autres mondes à soumettre.',
		quote: {
			text: 'Quoi ? tu veux qu’on se lie à demeurer au premier objet qui nous prend, qu’on renonce au monde pour lui, et qu’on n’ait plus d’yeux pour personne ? […] La beauté me ravit partout où je la trouve, et je cède facilement à cette douce violence dont elle nous entraîne.',
			speaker: 'Dom Juan',
			ref: 'Acte I, scène 2',
		},
	},
	{
		id: 'hypocrisie-religieuse',
		title: '2. L’hypocrisie religieuse',
		tag: 'Critique sociale',
		summary:
			'Dom Juan utilise la religion comme un masque protecteur pour dissimuler ses vices et tromper son entourage. Molière fustige l’écart entre la dévotion affichée et la conduite réelle.',
		analysis:
			'À l’acte V, acculé par les plaintes de ses victimes et les reproches paternels, Dom Juan ne change pas de nature mais change d’armure : il décide de feindre une conversion soudaine. Il comprend que dans la société de son temps, l’hypocrisie est un vice à la mode qui jouit d’une impunité totale et fait taire tous les censeurs. Il convient d’insister sur un point fondamental : Molière ne s’en prend pas ici à la foi sincère ni aux croyants véritables, mais dénonce violemment les faux dévots (comme les membres de la Compagnie du Saint-Sacrement qui avaient fait interdire son Tartuffe en 1664) qui exploitent les apparences sacrées à des fins de pouvoir et de tromperie.',
		quote: {
			text: 'L’hypocrisie est un vice à la mode, et tous les vices à la mode passent pour vertus. Le personnage d’homme de bien est le meilleur de tous les personnages qu’on puisse jouer aujourd’hui.',
			speaker: 'Dom Juan',
			ref: 'Acte V, scène 2',
		},
	},
	{
		id: 'religion-chatiment-divin',
		title: '3. La religion et le châtiment divin',
		tag: 'Métaphysique & fantastique',
		summary:
			'Dom Juan conteste les croyances religieuses et brave ouvertement la puissance divine. La statue du Commandeur fait surgir le surnaturel et pose la question de la justice céleste.',
		analysis:
			'Dom Juan incarne le libertinage intellectuel : interrogé par Sganarelle sur ce en quoi il croit, il répond avec insolence : « Je crois que deux et deux sont quatre, Sganarelle, et que quatre et quatre sont huit » (acte III, scène 1), réduisant l’univers aux seules certitudes matérielles et arithmétiques. Il pousse la provocation jusqu’à tenter d’acheter le blasphème d’un Pauvre rencontré dans la forêt pour un louis d’or. Pourtant, le surnaturel fait irruption par le biais de la statue funéraire du Commandeur. Malgré les multiples avertissements d’Elvire, de son père et du spectre, Dom Juan refuse d’abdiquer jusqu’à la dernière seconde, préférant périr dans les flammes plutôt que de plier le genou.',
		quote: {
			text: 'Non, non, il ne sera pas dit, quoi qu’il arrive, que je sois capable de me repentir. Allons, suis-moi.',
			speaker: 'Dom Juan',
			ref: 'Acte V, scène 5',
		},
	},
	{
		id: 'maitre-valet',
		title: '4. Le maître et le valet',
		tag: 'Dramaturgie & comique',
		summary:
			'Les dialogues entre Dom Juan et Sganarelle opposent les raisonnements provocateurs du maître aux angoisses, au bon sens populaire et aux objections morales du serviteur.',
		analysis:
			'Héritier de la tradition théâtrale de la commedia dell’arte et de Plaute, le couple maître-valet forme le pilier comique et dramaturgique de la pièce. Dom Juan manie une rhétorique raffinée et des syllogismes tranchants ; Sganarelle tente de lui répondre par des arguments naïfs, des peurs superstitieuses et des analogies maladroites (comme sa comparaison de l’homme avec une montre ou une machine qui se dérègle à l’acte III, scène 1, où il finit par tomber par terre). Cette dynamique engendre un comique permanent de contraste et de geste, tout en permettant au valet d’être le porte-parole d’une morale populaire face au cynisme aristocratique.',
		quote: {
			text: 'Je n’ai point étudié comme vous, grâce à Dieu, et personne ne saurait se vanter de m’avoir jamais rien appris ; mais avec mon petit sens, mon petit jugement, je vois les choses mieux que tous les livres.',
			speaker: 'Sganarelle',
			ref: 'Acte III, scène 1',
		},
	},
	{
		id: 'critique-noblesse',
		title: '5. La critique de la noblesse et des privilèges',
		tag: 'Critique politique et sociale',
		summary:
			'Dom Juan abuse de son rang et de son statut social pour imposer sa volonté et échapper à ses devoirs. Son attitude met en scène les dérives d’un aristocrate qui se croit au-dessus des lois communes.',
		analysis:
			'Par sa naissance, Dom Juan bénéficie d’un statut privilégié dans la société d’Ancien Régime : il porte l’épée, commande les respects et intimide ses inférieurs. Cependant, il trahit l’idéal chevaleresque en foulant aux pieds sa parole donnée, en refusant d’honorer ses dettes auprès du bourgeois Monsieur Dimanche et en menaçant les paysans sans vergogne. Molière donne voix à cette critique réquisitoire par le personnage de Dom Louis : le vieil aristocrate rappelle à son fils que le nom de famille et les titres ne confèrent aucune valeur réelle s’ils ne s’accompagnent pas de vertus morales.',
		quote: {
			text: 'Apprenez enfin qu’un gentilhomme qui vit mal est un monstre dans la nature, que la vertu est le premier titre de la noblesse, que je regarde bien moins au nom qu’on signe qu’aux actions qu’on fait […].',
			speaker: 'Dom Louis',
			ref: 'Acte IV, scène 4',
		},
	},
	{
		id: 'liberte-transgression',
		title: '6. La liberté individuelle et la transgression',
		tag: 'Philosophie & portrait moral',
		summary:
			'Dom Juan repousse les conventions sociales, morales et religieuses. Si son indépendance d’esprit témoigne d’une indéniable audace, elle lui sert aussi à tromper, dominer et écraser autrui.',
		analysis:
			'Dom Juan refuse tout cadre normatif qui viendrait contraindre son bon plaisir ou sa volonté. Cette soif d’autonomie intellectuelle peut séduire le spectateur : il ne craint rien, fait preuve d’un courage physique indéniable face aux voleurs et refuse les préjugés confortables de son époque. Toutefois, cette revendication de liberté tourne au solipsisme destructeur : affranchi de toute loi morale, Dom Juan considère les autres êtres humains comme de simples objets ou des jouets destinés à flatter son orgueil. Sa transgression n’est pas une quête de justice universelle, mais l’affirmation d’une toute-puissance égoïste.',
		quote: {
			text: 'Tout le plaisir de l’amour est dans le changement. On goûte une douceur extrême à réduire, par cent hommages, le cœur d’une jeune beauté […].',
			speaker: 'Dom Juan',
			ref: 'Acte I, scène 2',
		},
	},
];

export const secondaryThemes: SecondaryTheme[] = [
	{
		title: 'Le mensonge et la manipulation',
		description:
			'Dom Juan manipule par le verbe ses amantes, ses créanciers (Monsieur Dimanche) et son propre père, usant de fausses promesses de mariage et de courbettes affectées pour asseoir son pouvoir.',
	},
	{
		title: 'L’honneur et la fidélité',
		description:
			'Les valeurs traditionnelles portées par Dom Louis, Done Elvire et Dom Carlos mettent en relief, par contraste, le vide moral et la lâcheté de Dom Juan face aux engagements d’honneur.',
	},
	{
		title: 'Le comique et la satire sociale',
		description:
			'Des scènes truculentes avec Sganarelle, la jalousie rustique de Pierrot ou le défilé confus des deux paysannes Charlotte et Mathurine révèlent avec humour les travers des différentes classes sociales.',
	},
	{
		title: 'La mort et la justice',
		description:
			'L’ombre de la mort plane à travers le tombeau du Commandeur jusqu’au dénouement fantastique où Dom Juan est confronté aux conséquences inéluctables de ses actes.',
	},
	{
		title: 'La condition féminine',
		description:
			'Done Elvire, Charlotte et Mathurine subissent la domination masculine et le déshonneur social dans une époque où les femmes, dépendantes du mariage ou du cloître, disposent de peu de recours contre la séduction prédatrice.',
	},
];

export const dissertationTakeaway =
	'Dom Juan met en scène le conflit entre la liberté individuelle et les règles morales. La pièce dénonce également l’hypocrisie religieuse, les abus de pouvoir et l’inconstance amoureuse.';
