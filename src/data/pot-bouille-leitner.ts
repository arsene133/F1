// ==========================================================================
// Contenu de la boîte de Leitner de Pot-Bouille (/pot-bouille-leitner).
//
// Le contenu est séparé de la présentation et de la planification.
// Règle des citations : toute phrase de Zola figure dans `potBouilleQuotations`,
// vérifiée mot pour mot sur le texte de l'édition G. Charpentier (1883),
// transcrite et relue sur Wikisource (fr.wikisource.org/wiki/Pot-Bouille).
// Les cartes n'utilisent que ces citations (champ `quotation`, ou extraits
// entre guillemets dans les réponses) ; les tests le contrôlent.
// Quand aucune citation vérifiée n'est disponible, la carte décrit la scène.
// ==========================================================================

export type LeitnerCategory = 'oeuvre' | 'personnages' | 'themes' | 'ecriture' | 'interpreter' | 'bac';
export type LeitnerDifficulty = 'facile' | 'intermediaire' | 'avance';
/** « Connaître » : un fait à retenir. « Comprendre » : un sens à expliquer. */
export type LeitnerSkill = 'connaitre' | 'comprendre';

export interface Quotation {
	text: string;
	/** Qui parle (ou « le narrateur »). */
	speaker: string;
	/** Chapitre en chiffres romains. */
	chapter: string;
}

export interface LeitnerCard {
	id: string;
	category: LeitnerCategory;
	difficulty: LeitnerDifficulty;
	skill: LeitnerSkill;
	question: string;
	hint?: string;
	/** Réponse courte, à comparer avec sa propre réponse. */
	answer: string;
	/** Explication ou mise en perspective. */
	explanation?: string;
	/** Personnages ou thèmes concernés. */
	focus?: string[];
	/** Repère dans le roman (chapitres). */
	reference?: string;
	quotation?: Quotation;
}

export const categoryLabels: Record<LeitnerCategory, string> = {
	oeuvre: 'Connaître l’œuvre',
	personnages: 'Comprendre les personnages',
	themes: 'Identifier les grands thèmes',
	ecriture: 'Analyser l’écriture de Zola',
	interpreter: 'Savoir interpréter',
	bac: 'Se préparer au bac de français',
};

export const categoryShortLabels: Record<LeitnerCategory, string> = {
	oeuvre: 'Œuvre',
	personnages: 'Personnages',
	themes: 'Thèmes',
	ecriture: 'Écriture',
	interpreter: 'Interpréter',
	bac: 'Bac',
};

export const categoryOrder: readonly LeitnerCategory[] = ['oeuvre', 'personnages', 'themes', 'ecriture', 'interpreter', 'bac'];

export const difficultyLabels: Record<LeitnerDifficulty, string> = {
	facile: 'Facile',
	intermediaire: 'Intermédiaire',
	avance: 'Avancé',
};

export const skillLabels: Record<LeitnerSkill, string> = {
	connaitre: 'Connaître un fait',
	comprendre: 'Comprendre le sens',
};

// --------------------------------------------------------------------------
// Citations vérifiées (édition Charpentier, 1883 ; texte de Wikisource)
// --------------------------------------------------------------------------
export const potBouilleQuotations = {
	batiPourEffet: {
		text: 'Vous comprenez, ces maisons-là, c’est bâti pour faire de l’effet… Seulement, il ne faudrait pas trop fouiller les murs.',
		speaker: 'Campardon, faisant visiter l’immeuble à Octave',
		chapter: 'I',
	},
	abimesHonnetete: {
		text: 'Derrière les belles portes d’acajou luisant, il y avait comme des abîmes d’honnêteté.',
		speaker: 'le narrateur',
		chapter: 'I',
	},
	chaleurDeSerre: {
		text: 'Mais ce qui frappa surtout Octave, ce fut, en entrant, une chaleur de serre, une haleine tiède qu’une bouche lui soufflait au visage.',
		speaker: 'le narrateur',
		chapter: 'I',
	},
	eauEtGaz: {
		text: 'Eau et gaz à tous les étages.',
		speaker: 'Campardon',
		chapter: 'I',
	},
	pasDouzeAns: {
		text: 'Ça n’a pas douze ans et ça part déjà…',
		speaker: 'Campardon, à propos de l’immeuble',
		chapter: 'I',
	},
	tapisRouge: {
		text: 'À partir du troisième, le tapis rouge cessait et était remplacé par une simple toile grise.',
		speaker: 'le narrateur',
		chapter: 'I',
	},
	faitDesLivres: {
		text: 'Le monsieur fait des livres, je crois.',
		speaker: 'Campardon, à propos du locataire du deuxième étage',
		chapter: 'I',
	},
	gensQuOnNeVoitPas: {
		text: 'des gens qu’on ne voit pas, que personne ne connaît…',
		speaker: 'Campardon, à propos des locataires du deuxième étage',
		chapter: 'I',
	},
	valetDeChambre: {
		text: 'Vous savez, c’est l’ancien valet de chambre du duc de Vaugelade.',
		speaker: 'Campardon, à propos du concierge M. Gourd',
		chapter: 'I',
	},
	hysteriqueInepte: {
		text: 'Pourquoi Campardon la disait-il hystérique ? c’était inepte, de l’avoir trompé, en lui contant cette farce',
		speaker: 'le narrateur, à travers les pensées d’Octave repoussé par Valérie',
		chapter: 'IV',
	},
	faireEnvie: {
		text: 'Moi, lorsque j’ai eu vingt sous, j’ai toujours dit que j’en avais quarante ; car toute la sagesse est là, il vaut mieux faire envie que pitié…',
		speaker: 'Mme Josserand, devant son mari et ses filles',
		chapter: 'II',
	},
	pommesDeTerre: {
		text: 'Mangez des pommes de terre, mais ayez un poulet, quand vous avez du monde à dîner…',
		speaker: 'Mme Josserand',
		chapter: 'II',
	},
	garderIgnorance: {
		text: 'veille sur ta fille, écarte d’elle le mauvais air, tâche qu’elle garde son ignorance…',
		speaker: 'Mme Vuillaume, à sa fille Marie Pichon',
		chapter: 'IV',
	},
	manteauReligion: {
		text: 'en maître de cérémonie jetant sur cette bourgeoisie gâtée le manteau de la religion',
		speaker: 'le narrateur, à propos de l’abbé Mauduit',
		chapter: 'V',
	},
	arriverParLesFemmes: {
		text: 'sa volonté d’arriver par les femmes',
		speaker: 'le narrateur, à propos d’Octave',
		chapter: 'XII',
	},
	carrureJosserand: {
		text: 'Berthe prenait, dans le mariage, la carrure de madame Josserand.',
		speaker: 'le narrateur',
		chapter: 'XII',
	},
	bertheFaireEnvie: {
		text: 'J’aime mieux faire envie que pitié… L’argent est l’argent, et lorsque j’ai eu vingt sous, j’ai toujours dit que j’en avais quarante.',
		speaker: 'Berthe, à son mari Auguste',
		chapter: 'XII',
	},
	chapelleBourgeoise: {
		text: 'L’escalier retrouvait son recueillement de chapelle bourgeoise',
		speaker: 'le narrateur, après la mort du vieux Vabre',
		chapter: 'XII',
	},
	duPeupleChezSoi: {
		text: 'Quand on a du peuple chez soi, monsieur, voilà ce qui vous pend au bout du nez !',
		speaker: 'M. Gourd, montrant l’ouvrière enceinte',
		chapter: 'XIII',
	},
	fillesSavaientTout: {
		text: 'Ces filles savaient tout, sans que personne eût parlé.',
		speaker: 'le narrateur, à propos des bonnes',
		chapter: 'XIII',
	},
	agonisaitSousLesToits: {
		text: 'Est-ce qu’elle accouchait ? La malheureuse, toute seule, agonisait sous les toits',
		speaker: 'le narrateur, à travers les pensées d’Octave',
		chapter: 'XIII',
	},
	femmesPasEues: {
		text: 'Décidément, on n’aime bien que les femmes qu’on n’a pas eues.',
		speaker: 'Octave, à Valérie',
		chapter: 'XV',
	},
	coursDeProstitution: {
		text: 'tout un cours de prostitution décente et permise',
		speaker: 'le narrateur, résumant le récit de Berthe',
		chapter: 'XVI',
	},
	pasUnMarche: {
		text: 'Comprenez bien que ce n’est pas un marché…',
		speaker: 'Clotilde Duveyrier, à l’abbé Mauduit',
		chapter: 'XVII',
	},
	abimesDeVertus: {
		text: 'D’ailleurs, la maison avait retrouvé le train de son honnêteté bourgeoise. Derrière les portes d’acajou, de nouveaux abîmes de vertus se creusaient',
		speaker: 'le narrateur',
		chapter: 'XVII',
	},
	egoutDeLaMaison: {
		text: 'toutes les décompositions cachées des étages semblaient fondre et s’exhaler par cet égout de la maison',
		speaker: 'le narrateur, à propos de la cour intérieure',
		chapter: 'XVIII',
	},
	cochonEtCompagnie: {
		text: 'Mon Dieu ! mademoiselle, celle-ci ou celle-là, toutes les baraques se ressemblent. Au jour d’aujourd’hui, qui a fait l’une a fait l’autre. C’est cochon et compagnie.',
		speaker: 'Julie, la cuisinière des Duveyrier (dernière réplique du roman)',
		chapter: 'XVIII',
	},
} as const satisfies Record<string, Quotation>;

const Q = potBouilleQuotations;

/**
 * Textes entre guillemets autorisés dans les réponses alors qu'ils ne sont
 * pas des citations du roman (titres, intitulés officiels, mots étudiés).
 */
export const nonQuotationGuillemets: readonly string[] = [
	'Dévoiler les rouages de la société',
	'Le roman et le récit du Moyen Âge au XXIᵉ siècle',
	'Histoire naturelle et sociale d’une famille sous le Second Empire',
	'pot-bouille',
	'Le Pot-Bouille à Zola',
	'faire pot-bouille',
	'abîmes',
	'honnêteté',
	'comme',
	'je savais',
	'Au Bonheur des Dames',
	'naturel',
	'social',
	'naturelle',
	'sociale',
	'Faire pot-bouille',
	'il pensa que',
	'on peut y voir…',
	'sacré',
	'respectabilité',
	'morale',
	'galerie',
];

// ==========================================================================
// Les cartes
// ==========================================================================
export const potBouilleLeitnerCards: LeitnerCard[] = [
	// ------------------------------------------------------------------
	// A. CONNAÎTRE L'ŒUVRE (15)
	// ------------------------------------------------------------------
	{
		id: 'oeuvre-auteur-date',
		category: 'oeuvre',
		difficulty: 'facile',
		skill: 'connaitre',
		question: 'Qui a écrit Pot-Bouille, et en quelle année le roman paraît-il ?',
		answer: 'Émile Zola (1840-1902). Le roman paraît en 1882.',
		explanation:
			'Il est d’abord publié en feuilleton dans le journal Le Gaulois, au début de 1882, puis en volume chez l’éditeur Georges Charpentier la même année.',
		focus: ['Émile Zola'],
	},
	{
		id: 'oeuvre-cycle',
		category: 'oeuvre',
		difficulty: 'facile',
		skill: 'connaitre',
		question: 'Dans quel grand ensemble romanesque Pot-Bouille prend-il place ?',
		hint: 'Une famille, vingt romans.',
		answer: 'Dans Les Rougon-Macquart, cycle de vingt romans publiés de 1871 à 1893. Pot-Bouille en est le dixième volume.',
		explanation:
			'Chaque roman suit un ou plusieurs membres d’une même famille dans un milieu différent : la mine, les halles, le grand magasin, la bourgeoisie parisienne…',
		focus: ['Les Rougon-Macquart'],
	},
	{
		id: 'oeuvre-sous-titre',
		category: 'oeuvre',
		difficulty: 'intermediaire',
		skill: 'comprendre',
		question: 'Quel est le sous-titre des Rougon-Macquart, et que nous apprend-il sur le projet de Zola ?',
		answer:
			'« Histoire naturelle et sociale d’une famille sous le Second Empire ». Zola veut étudier à la fois l’hérédité (le côté « naturel ») et l’influence des milieux sociaux (le côté « social »).',
		explanation:
			'Le mot « naturelle » montre l’ambition scientifique du naturalisme ; « sociale » annonce une peinture de toutes les classes de la société.',
		focus: ['Les Rougon-Macquart', 'Naturalisme'],
	},
	{
		id: 'oeuvre-epoque',
		category: 'oeuvre',
		difficulty: 'facile',
		skill: 'connaitre',
		question: 'À quelle époque se déroule l’action de Pot-Bouille ?',
		hint: 'Le régime politique est celui de Napoléon III.',
		answer: 'Sous le Second Empire (1852-1870), au début des années 1860.',
		explanation:
			'Zola écrit en 1882, sous la Troisième République : il porte donc un regard en arrière sur une société qu’il juge déjà avec du recul.',
		focus: ['Second Empire'],
	},
	{
		id: 'oeuvre-lieu',
		category: 'oeuvre',
		difficulty: 'facile',
		skill: 'connaitre',
		question: 'Où se déroule l’essentiel du roman ?',
		answer: 'Dans un immeuble bourgeois neuf de la rue de Choiseul, à Paris, près des grands boulevards.',
		explanation:
			'Le roman se passe presque entièrement entre les murs de cet immeuble : appartements, escalier d’honneur, escalier de service, cour intérieure et chambres de bonnes.',
		focus: ['L’immeuble'],
		reference: 'ch. I',
	},
	{
		id: 'oeuvre-octave-arrivee',
		category: 'oeuvre',
		difficulty: 'facile',
		skill: 'connaitre',
		question: 'Qui est Octave Mouret au début du roman ?',
		answer:
			'Un jeune homme de vingt-deux ans, venu de Plassans (en Provence), qui arrive à Paris pour faire fortune. Il devient commis au magasin de nouveautés Au Bonheur des Dames.',
		focus: ['Octave Mouret'],
		reference: 'ch. I',
	},
	{
		id: 'oeuvre-octave-famille',
		category: 'oeuvre',
		difficulty: 'intermediaire',
		skill: 'connaitre',
		question: 'Comment Octave Mouret relie-t-il Pot-Bouille aux autres romans du cycle ?',
		answer:
			'Il est le fils de François Mouret et de Marthe Rougon, personnages de La Conquête de Plassans. On le retrouve dans le roman suivant, Au Bonheur des Dames (1883), où il dirige un grand magasin.',
		explanation: 'Pot-Bouille raconte donc l’apprentissage parisien d’un personnage dont Zola montre ensuite la réussite.',
		focus: ['Octave Mouret', 'Les Rougon-Macquart'],
	},
	{
		id: 'oeuvre-titre-sens-propre',
		category: 'oeuvre',
		difficulty: 'facile',
		skill: 'connaitre',
		question: 'Que désigne, au sens propre, le mot « pot-bouille » ?',
		answer: 'Un mot familier pour la cuisine ordinaire d’un ménage, le plat du quotidien qui mijote dans la marmite.',
		explanation:
			'« Faire pot-bouille » avec quelqu’un, c’était partager son ordinaire. Le mot n’apparaît pas dans le récit : c’est le titre qui donne la clé de lecture.',
		focus: ['Titre'],
	},
	{
		id: 'oeuvre-naturalisme-definition',
		category: 'oeuvre',
		difficulty: 'facile',
		skill: 'connaitre',
		question: 'Qu’est-ce que le naturalisme ?',
		answer:
			'Un mouvement littéraire de la fin du XIXᵉ siècle, dont Zola est le chef de file. Il prolonge le réalisme en s’inspirant des sciences : le romancier observe et décrit l’influence de l’hérédité et du milieu sur les personnages.',
		explanation: 'Zola expose sa théorie dans Le Roman expérimental (1880), où il compare le romancier à un savant qui observe et expérimente.',
		focus: ['Naturalisme'],
	},
	{
		id: 'oeuvre-immeuble-etages',
		category: 'oeuvre',
		difficulty: 'intermediaire',
		skill: 'connaitre',
		question: 'Qui habite à chaque étage de l’immeuble, d’après la visite du premier chapitre ?',
		hint: 'Du magasin de soieries aux chambres de bonnes.',
		answer:
			'Rez-de-chaussée et entresol : Auguste Vabre et son magasin de soieries. 1ᵉʳ : les Duveyrier et le vieux Vabre (sur rue), Théophile et Valérie Vabre (sur cour). 2ᵉ : un écrivain que personne ne fréquente. 3ᵉ : les Campardon (sur rue), Mme Juzeur (sur cour). 4ᵉ : les Josserand (sur rue), les Pichon et la chambre d’Octave. Tout en haut : les chambres des domestiques.',
		explanation: 'Plus on monte, plus les locataires sont modestes : la verticalité de l’immeuble reproduit la hiérarchie sociale.',
		focus: ['L’immeuble'],
		reference: 'ch. I',
	},
	{
		id: 'oeuvre-incipit',
		category: 'oeuvre',
		difficulty: 'facile',
		skill: 'connaitre',
		question: 'Comment s’ouvre le roman ?',
		answer:
			'Par l’arrivée d’Octave en fiacre, avec trois malles, un après-midi de novembre. L’architecte Campardon lui fait ensuite visiter l’immeuble, étage par étage.',
		explanation: 'Cette visite est une scène d’exposition : le lecteur découvre les lieux et les habitants en même temps qu’Octave.',
		focus: ['Octave Mouret', 'Campardon'],
		reference: 'ch. I',
	},
	{
		id: 'oeuvre-scandale',
		category: 'oeuvre',
		difficulty: 'intermediaire',
		skill: 'connaitre',
		question: 'Quel événement provoque le grand scandale de l’immeuble ?',
		answer:
			'Auguste Vabre surprend la nuit sa femme Berthe avec Octave, dans la chambre de celui-ci. Berthe s’enfuit en chemise par l’escalier ; on parle ensuite d’un duel, qui n’aura pas lieu.',
		focus: ['Berthe', 'Octave Mouret', 'Auguste Vabre'],
		reference: 'ch. XIV-XV',
	},
	{
		id: 'oeuvre-denouement',
		category: 'oeuvre',
		difficulty: 'intermediaire',
		skill: 'connaitre',
		question: 'Comment le roman se termine-t-il ?',
		answer:
			'Octave a épousé Mme Hédouin, devenue veuve, et dirige avec elle Au Bonheur des Dames. Berthe et Auguste ont repris la vie commune. L’immeuble a retrouvé sa façade de respectabilité, et la dernière réplique revient à une cuisinière.',
		explanation: 'Rien n’a changé au fond : le scandale est étouffé et chacun reprend sa place.',
		focus: ['Octave Mouret', 'Caroline Hédouin', 'Berthe'],
		reference: 'ch. XVII-XVIII',
	},
	{
		id: 'oeuvre-structure',
		category: 'oeuvre',
		difficulty: 'intermediaire',
		skill: 'comprendre',
		question: 'Quelles grandes étapes structurent les dix-huit chapitres du roman ?',
		answer:
			'1. Installation d’Octave et découverte de l’immeuble (I-VII). 2. Le mariage de Berthe et Auguste (VIII), puis la mort du vieux Vabre et la querelle d’héritage (X-XI). 3. La liaison d’Octave et Berthe et le scandale (XII-XV). 4. Le retour à l’ordre et aux apparences (XVI-XVIII).',
		explanation: 'Le roman avance par tableaux successifs de la vie des différents ménages, reliés par le parcours d’Octave.',
		focus: ['Structure'],
	},
	{
		id: 'oeuvre-reception',
		category: 'oeuvre',
		difficulty: 'intermediaire',
		skill: 'connaitre',
		question: 'Comment Pot-Bouille est-il reçu à sa parution en 1882 ?',
		answer:
			'Il fait scandale : une partie de la presse accuse Zola de calomnier les familles bourgeoises et de se complaire dans l’ordure. Des caricaturistes s’en moquent, comme André Gill avec « Le Pot-Bouille à Zola ».',
		explanation: 'Cette indignation montre que la satire a touché juste : les lecteurs bourgeois se sont reconnus.',
		focus: ['Réception'],
	},

	// ------------------------------------------------------------------
	// B. COMPRENDRE LES PERSONNAGES (20)
	// ------------------------------------------------------------------
	{
		id: 'perso-octave-projet',
		category: 'personnages',
		difficulty: 'facile',
		skill: 'connaitre',
		question: 'Quelle est l’ambition d’Octave Mouret, et sur quoi compte-t-il pour réussir ?',
		answer: 'Il veut faire fortune à Paris, et il compte sur les femmes pour s’élever socialement.',
		explanation: 'Le narrateur résume ce calcul en quelques mots. Mais ses plans échouent souvent, ce qui le rend aussi un peu ridicule.',
		focus: ['Octave Mouret'],
		quotation: Q.arriverParLesFemmes,
		reference: 'ch. XII',
	},
	{
		id: 'perso-campardon',
		category: 'personnages',
		difficulty: 'facile',
		skill: 'connaitre',
		question: 'Qui est Achille Campardon, et quel est son rôle auprès d’Octave ?',
		answer:
			'Un architecte qu’Octave a connu à Plassans, nommé architecte diocésain (chargé d’édifices religieux). Il a loué et meublé la chambre d’Octave, et lui fait visiter l’immeuble.',
		explanation: 'Campardon sert de guide au lecteur dans le premier chapitre : c’est par ses commentaires que l’on découvre les habitants.',
		focus: ['Campardon', 'Octave Mouret'],
		reference: 'ch. I',
	},
	{
		id: 'perso-campardon-menage',
		category: 'personnages',
		difficulty: 'intermediaire',
		skill: 'comprendre',
		question: 'Quelle situation familiale surprenante vivent les Campardon ?',
		answer:
			'Gasparine, cousine de Rose Campardon et maîtresse d’Achille, s’installe au foyer conjugal, à la demande de Rose elle-même, souffrante. Elle dirige bientôt toute la maison.',
		explanation: 'Ce ménage à trois vit dans une parfaite apparence de respectabilité : l’arrangement est immoral, mais il reste discret, donc accepté.',
		focus: ['Campardon', 'Gasparine', 'Rose Campardon'],
		reference: 'ch. IX',
	},
	{
		id: 'perso-mme-josserand',
		category: 'personnages',
		difficulty: 'facile',
		skill: 'connaitre',
		question: 'Quel est le but obsessionnel de Mme Josserand ?',
		answer:
			'Marier ses deux filles, Hortense et Berthe, à des hommes fortunés, tout en faisant croire que la famille est plus riche qu’elle ne l’est.',
		explanation: 'Elle organise des soirées qui ruinent le ménage et méprise son mari, jugé trop honnête pour réussir.',
		focus: ['Mme Josserand'],
		quotation: Q.faireEnvie,
		reference: 'ch. II-III',
	},
	{
		id: 'perso-m-josserand',
		category: 'personnages',
		difficulty: 'facile',
		skill: 'connaitre',
		question: 'Comment M. Josserand fait-il face aux dépenses de sa famille ?',
		answer:
			'Caissier dans une cristallerie, il passe ses nuits à copier en secret des bandes d’adresses pour gagner un peu plus. Honnête et épuisé, il meurt au chapitre XVII.',
		explanation: 'Il est l’un des rares personnages sincères du roman, et l’honnêteté ne lui apporte rien.',
		focus: ['M. Josserand'],
		reference: 'ch. II, XVII',
	},
	{
		id: 'perso-berthe-mariage',
		category: 'personnages',
		difficulty: 'facile',
		skill: 'connaitre',
		question: 'Comment se fait le mariage de Berthe Josserand ?',
		answer:
			'Après des années de chasse au mari menée par sa mère, Berthe épouse Auguste Vabre. Mme Josserand a promis une dot de cinquante mille francs qu’elle ne peut pas payer.',
		explanation: 'Le mariage est conclu comme une affaire, et cette dette jamais réglée empoisonne ensuite le ménage.',
		focus: ['Berthe', 'Auguste Vabre', 'Mme Josserand'],
		reference: 'ch. V, VIII',
	},
	{
		id: 'perso-berthe-heritage',
		category: 'personnages',
		difficulty: 'avance',
		skill: 'comprendre',
		question: 'Que montre le fait que Berthe, une fois mariée, reprenne les phrases de sa mère ?',
		answer:
			'Que l’éducation reçue se reproduit : Berthe applique dans son propre ménage les règles de paraître que sa mère lui a apprises.',
		explanation:
			'Le narrateur souligne qu’elle prend « la carrure de madame Josserand ». Pour un naturaliste, le milieu et l’éducation façonnent les individus.',
		focus: ['Berthe', 'Mme Josserand'],
		quotation: Q.bertheFaireEnvie,
		reference: 'ch. II et XII',
	},
	{
		id: 'perso-saturnin',
		category: 'personnages',
		difficulty: 'intermediaire',
		skill: 'connaitre',
		question: 'Qui est Saturnin Josserand ?',
		answer:
			'Le frère de Berthe, atteint de troubles nerveux. Il voue à sa sœur un attachement exclusif et devient violent contre ceux qui lui font du tort. Ses parents le font interner à l’asile des Moulineaux.',
		explanation: 'La famille le cache : il est une tache dans l’image de respectabilité que veut donner Mme Josserand.',
		focus: ['Saturnin', 'Berthe'],
		reference: 'ch. VII, XII, XV',
	},
	{
		id: 'perso-hortense-verdier',
		category: 'personnages',
		difficulty: 'intermediaire',
		skill: 'comprendre',
		question: 'Pourquoi le projet de mariage d’Hortense avec l’avocat Verdier est-il révélateur ?',
		answer:
			'Hortense veut épouser Verdier, jugé promis à une belle carrière, alors qu’il vit depuis quinze ans avec une maîtresse. Elle attend froidement qu’il s’en sépare.',
		explanation: 'Pour Hortense aussi, le mariage est un calcul : l’ambition compte davantage que l’amour ou la morale.',
		focus: ['Hortense Josserand', 'Verdier'],
		reference: 'ch. II-III',
	},
	{
		id: 'perso-bachelard',
		category: 'personnages',
		difficulty: 'intermediaire',
		skill: 'connaitre',
		question: 'Qui est l’oncle Bachelard, et pourquoi les Josserand le ménagent-ils ?',
		answer:
			'C’est le frère de Mme Josserand, un riche commissionnaire, grossier et noceur. Il a promis de doter Berthe : la famille l’invite et le flatte pour qu’il tienne parole. Lui entretient en secret une jeune fille, Fifi.',
		explanation: 'Bachelard illustre la double vie de nombreux bourgeois du roman : générosité promise en public, plaisirs cachés en privé.',
		focus: ['Bachelard', 'Mme Josserand'],
		reference: 'ch. II, VII',
	},
	{
		id: 'perso-vieux-vabre',
		category: 'personnages',
		difficulty: 'intermediaire',
		skill: 'connaitre',
		question: 'Que se passe-t-il à la mort du vieux Vabre, le propriétaire ?',
		answer:
			'Ses enfants s’attendaient à un gros héritage. Mais il ne laisse ni testament ni fortune, et Auguste, Théophile et Clotilde se déchirent pour la succession.',
		explanation: 'Autour du lit de mort, l’argent passe avant le deuil : la scène montre la cupidité de la famille Vabre.',
		focus: ['Le vieux Vabre', 'Famille Vabre'],
		reference: 'ch. X-XI',
	},
	{
		id: 'perso-auguste',
		category: 'personnages',
		difficulty: 'facile',
		skill: 'connaitre',
		question: 'Quel genre d’homme et de mari est Auguste Vabre ?',
		answer:
			'Un marchand de soieries maladif, sujet à de terribles migraines, et avare. Il épouse Berthe pour sa dot et surveille ensuite chacune de ses dépenses.',
		focus: ['Auguste Vabre'],
		reference: 'ch. I, VIII, XII',
	},
	{
		id: 'perso-duveyrier',
		category: 'personnages',
		difficulty: 'intermediaire',
		skill: 'comprendre',
		question: 'Quelle contradiction le personnage de Duveyrier incarne-t-il ?',
		answer:
			'Conseiller à la cour d’appel, il représente la loi et la morale. Pourtant, il fuit son foyer pour entretenir une maîtresse, Clarisse.',
		explanation:
			'Le juge qui condamne les autres ne respecte pas lui-même la morale qu’il défend. Abandonné par Clarisse, il tente même de se suicider (ch. XVII).',
		focus: ['Duveyrier', 'Clotilde Duveyrier'],
		reference: 'ch. VII, X, XVII',
	},
	{
		id: 'perso-clotilde',
		category: 'personnages',
		difficulty: 'intermediaire',
		skill: 'connaitre',
		question: 'Comment Clotilde Duveyrier se comporte-t-elle avec son mari et dans l’immeuble ?',
		answer:
			'Fille du vieux Vabre, elle est froide avec son mari et se réfugie dans le piano. Elle tient salon et veille aux apparences : c’est elle qui fait négocier la réconciliation de Berthe et d’Auguste par l’abbé Mauduit.',
		focus: ['Clotilde Duveyrier', 'Duveyrier'],
		reference: 'ch. V, XVII',
	},
	{
		id: 'perso-valerie',
		category: 'personnages',
		difficulty: 'intermediaire',
		skill: 'comprendre',
		question: 'Pourquoi la relation entre Octave et Valérie Vabre est-elle originale dans le roman ?',
		answer:
			'Croyant les ragots de Campardon, qui la disait « hystérique », Octave tente sa chance auprès de Valérie, qui le repousse (ch. IV). Plus tard, elle lui avoue tromper son mari sans plaisir, et ils deviennent amis (ch. XV).',
		explanation: 'C’est la seule relation d’Octave avec une femme de l’immeuble qui échappe au calcul et à la séduction.',
		focus: ['Valérie Vabre', 'Octave Mouret', 'Théophile Vabre'],
		quotation: Q.femmesPasEues,
		reference: 'ch. IV, XV',
	},
	{
		id: 'perso-marie-pichon',
		category: 'personnages',
		difficulty: 'intermediaire',
		skill: 'comprendre',
		question: 'Comment l’éducation de Marie Pichon explique-t-elle qu’elle cède facilement à Octave ?',
		answer:
			'Ses parents, les Vuillaume, l’ont élevée dans l’ignorance, et sa seule lecture avant le mariage a été un roman sentimental de George Sand. Mariée à un petit employé, elle s’ennuie et devient la première conquête d’Octave.',
		explanation: 'Zola montre qu’une éducation fondée sur l’ignorance ne protège pas les jeunes filles : elle les rend au contraire vulnérables.',
		focus: ['Marie Pichon', 'Les Vuillaume'],
		quotation: Q.garderIgnorance,
		reference: 'ch. IV',
	},
	{
		id: 'perso-hedouin',
		category: 'personnages',
		difficulty: 'intermediaire',
		skill: 'connaitre',
		question: 'Quel rôle Caroline Hédouin joue-t-elle dans le parcours d’Octave ?',
		answer:
			'Patronne du Bonheur des Dames, elle repousse calmement les avances d’Octave, qui quitte alors le magasin (ch. IX). Devenue veuve, elle finit par l’épouser (ch. XVIII).',
		explanation: 'Femme d’affaires raisonnable, elle permet à Octave d’accéder enfin à la réussite, par le mariage et le commerce.',
		focus: ['Caroline Hédouin', 'Octave Mouret'],
		reference: 'ch. IX, XVIII',
	},
	{
		id: 'perso-gourd',
		category: 'personnages',
		difficulty: 'facile',
		skill: 'connaitre',
		question: 'Qui est M. Gourd, et quel rôle joue-t-il dans l’immeuble ?',
		answer:
			'Le concierge, ancien valet de chambre d’un duc. Il surveille tout, impose le silence et l’ordre, et méprise les ouvriers et les domestiques.',
		explanation: 'Ancien serviteur, il se montre plus intransigeant que les bourgeois eux-mêmes : il est le gardien des apparences.',
		focus: ['M. Gourd'],
		quotation: Q.valetDeChambre,
		reference: 'ch. I',
	},
	{
		id: 'perso-rachel',
		category: 'personnages',
		difficulty: 'intermediaire',
		skill: 'connaitre',
		question: 'Quelle place tient Rachel, la bonne de Berthe, dans le drame de l’adultère ?',
		answer:
			'Témoin de la vie du couple, elle connaît la liaison de Berthe. Berthe la soupçonne d’avoir renseigné Auguste avant qu’il ne les surprenne. Plus tard, renvoyée, Rachel crie les secrets de sa maîtresse dans l’escalier de service.',
		focus: ['Rachel', 'Berthe'],
		reference: 'ch. XIV, XVII',
	},
	{
		id: 'perso-adele',
		category: 'personnages',
		difficulty: 'intermediaire',
		skill: 'connaitre',
		question: 'Qui est Adèle, et que lui arrive-t-il à la fin du roman ?',
		answer:
			'La bonne des Josserand, mal nourrie et méprisée. Enceinte, elle accouche seule, la nuit, dans sa chambre glacée sous les toits, puis va déposer l’enfant dans le passage Choiseul.',
		explanation: 'Personne dans l’immeuble ne veut voir sa grossesse : la scène révèle la violence de la condition des servantes.',
		focus: ['Adèle', 'Les domestiques'],
		reference: 'ch. XVIII',
	},

	// ------------------------------------------------------------------
	// C. IDENTIFIER LES GRANDS THÈMES (20)
	// ------------------------------------------------------------------
	{
		id: 'theme-hypocrisie',
		category: 'themes',
		difficulty: 'facile',
		skill: 'comprendre',
		question: 'Qu’est-ce que l’hypocrisie bourgeoise dénoncée dans Pot-Bouille ? Donnez un exemple.',
		answer:
			'C’est le fait d’afficher une morale stricte en public tout en la trahissant en privé. Exemple : Duveyrier, magistrat sévère, entretient une maîtresse.',
		focus: ['Hypocrisie bourgeoise', 'Duveyrier'],
	},
	{
		id: 'theme-apparences-facade',
		category: 'themes',
		difficulty: 'facile',
		skill: 'comprendre',
		question: 'Que révèle Campardon, dès le premier chapitre, sur la façade de l’immeuble ?',
		answer: 'Que l’immeuble est construit pour impressionner, mais qu’il vaut mieux ne pas regarder ce qu’il y a derrière.',
		explanation: 'Cette remarque sur les murs annonce tout le roman : derrière les belles façades, les familles cachent leurs défauts.',
		focus: ['Apparences et réalité', 'L’immeuble'],
		quotation: Q.batiPourEffet,
		reference: 'ch. I',
	},
	{
		id: 'theme-faire-envie',
		category: 'themes',
		difficulty: 'intermediaire',
		skill: 'comprendre',
		question: 'Que révèle la règle de vie de Mme Josserand sur les dîners et les apparences ?',
		answer:
			'Qu’il faut sacrifier le quotidien pour briller devant les invités : on se prive en secret pour paraître riche en public.',
		explanation: 'Pour Mme Josserand, la valeur sociale dépend de ce que les autres voient, et non de ce que l’on est.',
		focus: ['Apparences et réalité', 'Mme Josserand'],
		quotation: Q.pommesDeTerre,
		reference: 'ch. II',
	},
	{
		id: 'theme-argent-ascension',
		category: 'themes',
		difficulty: 'intermediaire',
		skill: 'comprendre',
		question: 'Comment Octave passe-t-il de simple commis à patron ?',
		answer:
			'Il est d’abord commis au Bonheur des Dames, puis chez Auguste Vabre. Ses séductions échouent ou le compromettent ; c’est finalement son mariage avec Mme Hédouin, veuve, qui lui donne la direction du magasin.',
		explanation: 'L’ascension sociale passe par le mariage et par l’argent, plus que par le mérite.',
		focus: ['Argent et ascension sociale', 'Octave Mouret'],
		reference: 'ch. I, IX, XVIII',
	},
	{
		id: 'theme-dot',
		category: 'themes',
		difficulty: 'facile',
		skill: 'connaitre',
		question: 'Qu’est-ce qu’une dot, et quel rôle joue-t-elle dans le mariage de Berthe ?',
		answer:
			'La somme apportée par la famille de l’épouse au moment du mariage. Mme Josserand promet cinquante mille francs à Auguste, mais ne les verse jamais : la dot devient la source des disputes du couple.',
		focus: ['Mariage et intérêts économiques', 'Berthe', 'Auguste Vabre'],
		reference: 'ch. V, VIII, XII',
	},
	{
		id: 'theme-mariage-marche',
		category: 'themes',
		difficulty: 'avance',
		skill: 'comprendre',
		question: 'Par quelle formule très dure le narrateur résume-t-il l’éducation que les mères donnent aux filles sans fortune ?',
		answer:
			'Il parle de « tout un cours de prostitution décente et permise » : on apprend aux filles à se vendre au meilleur parti, sous des dehors convenables.',
		explanation:
			'Attention : ce n’est pas une réplique de Berthe, mais la voix du narrateur qui résume ce qu’elle raconte à ses parents. La formule condamne un système, pas une personne.',
		focus: ['Mariage et intérêts économiques', 'Condition féminine', 'Berthe'],
		quotation: Q.coursDeProstitution,
		reference: 'ch. XVI',
	},
	{
		id: 'theme-adultere',
		category: 'themes',
		difficulty: 'intermediaire',
		skill: 'comprendre',
		question: 'Pourquoi l’adultère est-il toléré dans l’immeuble tant qu’il reste caché ?',
		answer:
			'Parce que ce qui compte pour ces bourgeois n’est pas la morale réelle, mais la réputation. Campardon, Duveyrier ou Valérie trompent leur conjoint sans scandale ; l’affaire de Berthe ne devient grave que lorsqu’elle éclate au grand jour.',
		focus: ['Adultère et morale'],
		reference: 'ch. IX, XIV-XV',
	},
	{
		id: 'theme-condition-feminine',
		category: 'themes',
		difficulty: 'intermediaire',
		skill: 'comprendre',
		question: 'Pourquoi peut-on dire que les femmes de Pot-Bouille dépendent du mariage ?',
		answer:
			'Elles n’ont guère de métier ni de fortune propre : le mariage décide de leur place dans la société. Le Code civil impose aussi l’obéissance au mari, et le divorce n’existe pas à l’époque (il est rétabli en 1884).',
		explanation: 'D’où la chasse au mari des Josserand et la difficulté, pour Berthe, de quitter Auguste.',
		focus: ['Condition féminine'],
	},
	{
		id: 'theme-education-ignorance',
		category: 'themes',
		difficulty: 'intermediaire',
		skill: 'comprendre',
		question: 'Quelle contradiction Zola montre-t-il dans l’éducation des jeunes filles bourgeoises ?',
		answer:
			'On les maintient dans l’ignorance du corps et du désir, mais on leur apprend en même temps à plaire et à séduire pour trouver un mari.',
		focus: ['Condition féminine', 'Marie Pichon', 'Berthe'],
		quotation: Q.garderIgnorance,
		reference: 'ch. III-IV',
	},
	{
		id: 'theme-domestiques-savoir',
		category: 'themes',
		difficulty: 'intermediaire',
		skill: 'comprendre',
		question: 'Que savent les domestiques de la vie privée de leurs maîtres ?',
		answer:
			'Tout : depuis les cuisines qui donnent sur la cour, les bonnes commentent les liaisons, les disputes et les secrets que les maîtres croient cachés.',
		explanation: 'Au chapitre XIII, Octave et Berthe entendent les bonnes parler de leur liaison.',
		focus: ['Maîtres et domestiques'],
		quotation: Q.fillesSavaientTout,
		reference: 'ch. XIII',
	},
	{
		id: 'theme-domestiques-traitement',
		category: 'themes',
		difficulty: 'facile',
		skill: 'connaitre',
		question: 'Comment les domestiques sont-ils logés et traités dans l’immeuble ?',
		answer:
			'Ils dorment dans d’étroites chambres sous les toits et circulent par l’escalier de service. Ils sont souvent mal payés et mal nourris : Adèle a faim chez les Josserand.',
		focus: ['Maîtres et domestiques', 'Adèle'],
		reference: 'ch. I, XVI, XVIII',
	},
	{
		id: 'theme-ouvriere',
		category: 'themes',
		difficulty: 'intermediaire',
		skill: 'comprendre',
		question: 'Que révèle la façon dont M. Gourd traite la piqueuse de bottines enceinte ?',
		answer:
			'Que la « respectabilité » de l’immeuble est une affaire de classe sociale : le concierge chasse l’ouvrière pauvre, alors qu’il ferme les yeux sur les fautes des bourgeois.',
		focus: ['Domination sociale', 'M. Gourd'],
		quotation: Q.duPeupleChezSoi,
		reference: 'ch. XI, XIII',
	},
	{
		id: 'theme-religion',
		category: 'themes',
		difficulty: 'intermediaire',
		skill: 'comprendre',
		question: 'Quel rôle l’abbé Mauduit joue-t-il auprès des familles de l’immeuble ?',
		answer:
			'Il connaît leurs fautes, mais se contente de préserver les apparences : la religion sert à couvrir les désordres plutôt qu’à les corriger.',
		focus: ['Religion et respectabilité', 'Abbé Mauduit'],
		quotation: Q.manteauReligion,
		reference: 'ch. V',
	},
	{
		id: 'theme-religion-argent',
		category: 'themes',
		difficulty: 'avance',
		skill: 'comprendre',
		question: 'À quelle condition la réconciliation de Berthe et d’Auguste est-elle négociée, et par qui ?',
		answer:
			'Auguste accepte de reprendre Berthe à condition que les Josserand paient enfin la dot. C’est l’abbé Mauduit qui est chargé de porter ces conditions.',
		explanation:
			'Clotilde assure que « ce n’est pas un marché », alors que c’en est un : la religion sert de paravent à une transaction d’argent.',
		focus: ['Religion et respectabilité', 'Mariage et intérêts économiques'],
		quotation: Q.pasUnMarche,
		reference: 'ch. XVII',
	},
	{
		id: 'theme-scandale-etouffe',
		category: 'themes',
		difficulty: 'intermediaire',
		skill: 'comprendre',
		question: 'Que devient l’immeuble après le scandale ?',
		answer: 'Il retrouve vite son calme et sa façade de vertu : rien n’a changé, les secrets continuent derrière les portes.',
		explanation: 'Le narrateur reprend, avec ironie, les mots du premier chapitre : les « abîmes » de vertu sont toujours là.',
		focus: ['Vie privée et conventions sociales'],
		quotation: Q.abimesDeVertus,
		reference: 'ch. XVII',
	},
	{
		id: 'theme-heritage',
		category: 'themes',
		difficulty: 'facile',
		skill: 'connaitre',
		question: 'Quel épisode montre le mieux la cupidité de la famille Vabre ?',
		answer:
			'La mort du vieux Vabre : avant même qu’il soit mort, ses enfants s’inquiètent de sa fortune et du testament, puis se disputent un héritage qui se révèle presque inexistant.',
		focus: ['Argent', 'Famille Vabre'],
		reference: 'ch. X-XI',
	},
	{
		id: 'theme-commerce-moderne',
		category: 'themes',
		difficulty: 'avance',
		skill: 'comprendre',
		question: 'Comment le roman oppose-t-il le petit commerce d’Auguste au grand magasin d’Octave ?',
		answer:
			'À la fin, le Bonheur des Dames ouvre un rayon de soieries et écrase la boutique d’Auguste. Le grand commerce moderne triomphe du petit commerçant.',
		explanation: 'Ce conflit annonce le sujet du roman suivant, Au Bonheur des Dames (1883).',
		focus: ['Argent et ascension sociale', 'Auguste Vabre', 'Octave Mouret'],
		reference: 'ch. IX, XVIII',
	},
	{
		id: 'theme-rumeurs',
		category: 'themes',
		difficulty: 'intermediaire',
		skill: 'comprendre',
		question: 'Pourquoi faut-il se méfier de ce que les personnages disent les uns des autres ?',
		answer:
			'Parce que l’immeuble vit de ragots. Par exemple, Campardon présente Valérie comme une malade des nerfs, prête à céder ; Octave le croit, mais elle le repousse, et il juge alors ce bavardage « inepte ».',
		explanation: 'Le roman distingue ce que disent les bavardages et ce que montre le récit : il faut toujours se demander qui parle.',
		focus: ['Vie privée et conventions sociales', 'Valérie Vabre'],
		quotation: Q.hysteriqueInepte,
		reference: 'ch. IV',
	},
	{
		id: 'theme-naissances',
		category: 'themes',
		difficulty: 'avance',
		skill: 'comprendre',
		question: 'Que montre le contraste entre l’accouchement de Marie Pichon et celui d’Adèle ?',
		answer:
			'Marie, locataire, accouche assistée par le docteur Juillerat ; Adèle, servante, accouche seule et en secret sous les toits. Même devant la naissance, les classes sociales ne sont pas égales.',
		focus: ['Domination sociale et inégalités', 'Adèle', 'Marie Pichon'],
		reference: 'ch. XVII, XVIII',
	},
	{
		id: 'theme-vie-privee',
		category: 'themes',
		difficulty: 'intermediaire',
		skill: 'comprendre',
		question: 'Pourquoi les portes fermées de l’immeuble ne protègent-elles pas vraiment la vie privée ?',
		answer:
			'Parce que les murs sont minces, que les domestiques voient tout, et que la cour et l’escalier de service font circuler les secrets. La vie privée n’est protégée qu’en apparence.',
		focus: ['Vie privée et conventions sociales', 'L’immeuble'],
		reference: 'ch. XIII, XVIII',
	},

	// ------------------------------------------------------------------
	// D. ANALYSER L'ÉCRITURE DE ZOLA (20)
	// ------------------------------------------------------------------
	{
		id: 'ecriture-naturalisme-procedes',
		category: 'ecriture',
		difficulty: 'intermediaire',
		skill: 'comprendre',
		question: 'Citez trois marques du naturalisme dans Pot-Bouille.',
		answer:
			'1. Un milieu précisément observé (l’immeuble bourgeois du Second Empire). 2. L’influence de l’éducation et du milieu sur les personnages (Berthe formée par sa mère). 3. Une description sans pudeur du corps et de la maladie (migraines d’Auguste, accouchement d’Adèle).',
		focus: ['Naturalisme'],
	},
	{
		id: 'ecriture-realisme-naturalisme',
		category: 'ecriture',
		difficulty: 'intermediaire',
		skill: 'comprendre',
		question: 'Quelle différence peut-on faire entre réalisme et naturalisme ?',
		answer:
			'Le réalisme (Balzac, Flaubert) cherche à représenter fidèlement la réalité sociale. Le naturalisme (Zola) va plus loin : il veut l’étudier comme une science, en montrant l’effet de l’hérédité et du milieu, sans rien cacher des aspects jugés laids.',
		focus: ['Réalisme', 'Naturalisme'],
	},
	{
		id: 'ecriture-satire',
		category: 'ecriture',
		difficulty: 'facile',
		skill: 'connaitre',
		question: 'Qu’est-ce qu’une satire ?',
		answer: 'Une œuvre qui se moque d’un groupe social ou de ses défauts pour les critiquer. Ici, Zola ridiculise la bourgeoisie parisienne.',
		explanation: 'La satire utilise l’exagération, l’ironie et le comique pour faire réfléchir le lecteur.',
		focus: ['Satire'],
	},
	{
		id: 'ecriture-ironie-abimes',
		category: 'ecriture',
		difficulty: 'intermediaire',
		skill: 'comprendre',
		question: 'Pourquoi l’expression « des abîmes d’honnêteté » est-elle ironique ?',
		answer:
			'Le mot « abîmes » évoque d’habitude des profondeurs inquiétantes, pas la vertu. L’expression laisse entendre que cette honnêteté cache autre chose : le narrateur dit le contraire de ce qu’il pense.',
		explanation: 'L’ironie consiste à faire entendre le contraire de ce que l’on dit ; le lecteur doit comprendre le double sens.',
		focus: ['Ironie', 'L’immeuble'],
		quotation: Q.abimesHonnetete,
		reference: 'ch. I',
	},
	{
		id: 'ecriture-echo-final',
		category: 'ecriture',
		difficulty: 'avance',
		skill: 'comprendre',
		question: 'Quel effet produit la reprise, au chapitre XVII, de l’image des portes d’acajou et des « abîmes » du chapitre I ?',
		answer:
			'Un effet de boucle : le roman revient à son point de départ. Après le scandale, la façade de vertu se reforme exactement comme avant, ce qui souligne que rien n’a changé.',
		explanation: 'Cette construction circulaire renforce la satire : la bourgeoisie ne tire aucune leçon de ses fautes.',
		focus: ['Ironie', 'Structure'],
		quotation: Q.abimesDeVertus,
		reference: 'ch. I et XVII',
	},
	{
		id: 'ecriture-effet-de-reel',
		category: 'ecriture',
		difficulty: 'intermediaire',
		skill: 'comprendre',
		question: 'Qu’est-ce qu’un effet de réel ? Donnez un exemple tiré du premier chapitre.',
		answer:
			'Un détail précis, parfois sans importance pour l’intrigue, qui donne au lecteur l’impression d’un monde vrai. Exemple : l’escalier chauffé, ou Campardon qui répète fièrement « Eau et gaz à tous les étages. »',
		focus: ['Description et effet de réel'],
		quotation: Q.eauEtGaz,
		reference: 'ch. I',
	},
	{
		id: 'ecriture-faux-luxe',
		category: 'ecriture',
		difficulty: 'intermediaire',
		skill: 'comprendre',
		question: 'Pourquoi la description du vestibule insiste-t-elle sur les matériaux d’imitation (faux marbre, rampe imitant l’argent) ?',
		answer:
			'Parce que le décor annonce les personnages : comme les matériaux, la respectabilité des habitants est une imitation. Le luxe est un trompe-l’œil.',
		focus: ['Description', 'Apparences et réalité'],
		reference: 'ch. I',
	},
	{
		id: 'ecriture-focalisation-interne',
		category: 'ecriture',
		difficulty: 'intermediaire',
		skill: 'comprendre',
		question: 'Par quel point de vue le lecteur découvre-t-il l’immeuble au premier chapitre, et avec quel effet ?',
		answer:
			'En focalisation interne, à travers le regard d’Octave. Le lecteur partage son impression d’admiration avant de découvrir, peu à peu, ce que cache le décor.',
		explanation: 'Le nouvel arrivant est un regard idéal : il ne sait rien, comme le lecteur.',
		focus: ['Focalisation et point de vue', 'Octave Mouret'],
		quotation: Q.chaleurDeSerre,
		reference: 'ch. I',
	},
	{
		id: 'ecriture-narrateur-omniscient',
		category: 'ecriture',
		difficulty: 'intermediaire',
		skill: 'comprendre',
		question: 'Pourquoi un narrateur qui passe d’un appartement à l’autre convient-il à ce roman ?',
		answer:
			'Parce qu’il permet de montrer ce que chaque famille cache aux autres. Le lecteur en sait plus que chaque personnage et mesure l’écart entre l’apparence et la réalité.',
		focus: ['Focalisation et point de vue'],
	},
	{
		id: 'ecriture-discours-indirect-libre',
		category: 'ecriture',
		difficulty: 'avance',
		skill: 'comprendre',
		question: 'Qu’est-ce que le discours indirect libre ? Montrez-le dans la phrase où Octave entend la piqueuse de bottines gémir.',
		answer:
			'C’est la technique qui fait entendre les pensées d’un personnage dans la voix du narrateur, sans « il pensa que ». Ici, la question « Est-ce qu’elle accouchait ? » est celle qu’Octave se pose, intégrée au récit.',
		explanation: 'Ce procédé rapproche le lecteur de la conscience du personnage.',
		focus: ['Focalisation et point de vue'],
		quotation: Q.agonisaitSousLesToits,
		reference: 'ch. XIII',
	},
	{
		id: 'ecriture-portrait-detail',
		category: 'ecriture',
		difficulty: 'facile',
		skill: 'comprendre',
		question: 'Comment Zola caractérise-t-il M. Gourd dès sa première apparition ?',
		answer:
			'Par quelques détails concrets : sa calotte de velours noir, ses pantoufles bleu ciel, sa loge décorée comme un petit salon. Ces détails montrent un domestique qui joue au bourgeois.',
		focus: ['Portraits et caractérisation', 'M. Gourd'],
		reference: 'ch. I',
	},
	{
		id: 'ecriture-caracterisation-parole',
		category: 'ecriture',
		difficulty: 'intermediaire',
		skill: 'comprendre',
		question: 'Comment la répétition d’une même phrase caractérise-t-elle Mme Josserand ?',
		answer:
			'Elle répète à plusieurs reprises sa règle des vingt sous et des quarante sous. Cette formule toute faite résume sa philosophie : paraître plus riche qu’on ne l’est.',
		explanation: 'Une phrase répétée qui caractérise un personnage s’appelle un leitmotiv.',
		focus: ['Portraits et caractérisation', 'Mme Josserand'],
		quotation: Q.faireEnvie,
		reference: 'ch. II, XII, XIV, XVI',
	},
	{
		id: 'ecriture-leitmotiv',
		category: 'ecriture',
		difficulty: 'facile',
		skill: 'connaitre',
		question: 'Qu’est-ce qu’un leitmotiv ? Donnez un exemple dans Pot-Bouille.',
		answer:
			'Une formule ou une image qui revient plusieurs fois dans l’œuvre. Exemples : les portes d’acajou de l’escalier, ou la phrase de Mme Josserand sur les vingt sous.',
		focus: ['Leitmotiv'],
	},
	{
		id: 'ecriture-symbole-immeuble',
		category: 'ecriture',
		difficulty: 'intermediaire',
		skill: 'comprendre',
		question: 'Que symbolisent les deux escaliers de l’immeuble ?',
		answer:
			'L’escalier d’honneur, chauffé et silencieux, représente la façade respectable. L’escalier de service, avec la cour, représente l’envers du décor : les domestiques, les odeurs, les secrets.',
		focus: ['Symbolisme de l’immeuble'],
		reference: 'ch. I, XIII',
	},
	{
		id: 'ecriture-hierarchie-tapis',
		category: 'ecriture',
		difficulty: 'facile',
		skill: 'comprendre',
		question: 'Quel détail de l’escalier montre que le prestige diminue à mesure qu’on monte ?',
		answer: 'Le tapis rouge s’arrête au troisième étage : au-dessus, il est remplacé par une simple toile grise.',
		explanation: 'Octave, qui loge au quatrième, en est vexé : l’espace traduit directement la hiérarchie sociale.',
		focus: ['Organisation spatiale et hiérarchie sociale'],
		quotation: Q.tapisRouge,
		reference: 'ch. I',
	},
	{
		id: 'ecriture-cour-egout',
		category: 'ecriture',
		difficulty: 'avance',
		skill: 'comprendre',
		question: 'À quoi la cour intérieure est-elle comparée à la fin du roman, et pourquoi ?',
		answer:
			'À un égout : par la cour s’échappent les eaux sales et les insultes des bonnes, mais aussi, symboliquement, toutes les fautes cachées des étages.',
		explanation: 'L’image oppose l’espace public propre (l’escalier) à l’espace caché et sale (la cour).',
		focus: ['Contraste entre espaces publics et privés'],
		quotation: Q.egoutDeLaMaison,
		reference: 'ch. XVIII',
	},
	{
		id: 'ecriture-chapelle',
		category: 'ecriture',
		difficulty: 'avance',
		skill: 'comprendre',
		question: 'Pourquoi le narrateur compare-t-il l’escalier à une chapelle ?',
		answer:
			'Pour souligner ironiquement le culte que les bourgeois vouent aux apparences : l’escalier est « sacré » non par sa vertu réelle, mais par le silence et la dignité qu’on y affiche.',
		focus: ['Symbolisme de l’immeuble', 'Religion et respectabilité', 'Ironie'],
		quotation: Q.chapelleBourgeoise,
		reference: 'ch. XII',
	},
	{
		id: 'ecriture-bonnes-choeur',
		category: 'ecriture',
		difficulty: 'avance',
		skill: 'comprendre',
		question: 'Quelle fonction les conversations des bonnes à travers la cour ont-elles dans le récit ?',
		answer:
			'Elles jouent le rôle d’un chœur, comme au théâtre antique : elles commentent l’action, révèlent ce que les maîtres cachent et en donnent une version crue.',
		focus: ['Fonction des personnages secondaires', 'Maîtres et domestiques'],
		reference: 'ch. XIII, XVIII',
	},
	{
		id: 'ecriture-roman-choral',
		category: 'ecriture',
		difficulty: 'intermediaire',
		skill: 'comprendre',
		question: 'Pourquoi peut-on parler de « galerie » de ménages dans Pot-Bouille ?',
		answer:
			'Parce que chaque foyer (Josserand, Vabre, Duveyrier, Campardon, Pichon) présente une variante du mariage bourgeois raté. Additionnés, ces portraits composent une image d’ensemble de la bourgeoisie.',
		focus: ['Fonction des personnages secondaires'],
	},
	{
		id: 'ecriture-ecrivain-deuxieme',
		category: 'ecriture',
		difficulty: 'avance',
		skill: 'comprendre',
		question: 'Comment Campardon parle-t-il du locataire du deuxième étage, et quelle lecture peut-on en proposer ?',
		answer:
			'Avec mépris : ce sont des gens « qu’on ne voit pas », et l’homme écrit des livres. Piste d’interprétation : Zola glisse peut-être un clin d’œil sur la place de l’écrivain, observateur tenu à l’écart par la bourgeoisie.',
		explanation: 'Il s’agit d’une interprétation et non d’une affirmation du texte : à présenter avec prudence (« on peut y voir… »).',
		focus: ['Fonction des personnages secondaires'],
		quotation: Q.faitDesLivres,
		reference: 'ch. I',
	},

	// ------------------------------------------------------------------
	// E. SAVOIR INTERPRÉTER (15)
	// ------------------------------------------------------------------
	{
		id: 'interp-immeuble-societe',
		category: 'interpreter',
		difficulty: 'avance',
		skill: 'comprendre',
		question: 'Pourquoi l’immeuble peut-il être lu comme une société en miniature ?',
		hint: 'Pensez aux étages, aux deux escaliers et à la loge.',
		answer:
			'Parce qu’il rassemble les classes sociales et les range dans l’espace : commerçants en bas, notables aux premiers étages, petits employés plus haut, domestiques sous les toits. Il a même sa police (le concierge) et son prêtre (l’abbé Mauduit).',
		explanation: 'En étudiant un seul immeuble, Zola peut donc parler de toute la société du Second Empire.',
		focus: ['L’immeuble', 'Domination sociale'],
	},
	{
		id: 'interp-respectabilite',
		category: 'interpreter',
		difficulty: 'avance',
		skill: 'comprendre',
		question: 'Comment Zola dévoile-t-il les contradictions de la respectabilité bourgeoise ?',
		answer:
			'En montrant systématiquement l’envers de chaque façade : le magistrat a une maîtresse, la mère vertueuse vend sa fille, le prêtre couvre les fautes, le concierge chasse les pauvres mais pas les riches. L’ironie du narrateur souligne l’écart.',
		focus: ['Hypocrisie bourgeoise'],
	},
	{
		id: 'interp-regard-domestiques',
		category: 'interpreter',
		difficulty: 'avance',
		skill: 'comprendre',
		question: 'Pourquoi les domestiques offrent-ils un regard différent sur leurs maîtres ?',
		answer:
			'Ils vivent dans l’intimité des familles sans en faire partie. Ils voient ce qui est caché (linge, disputes, liaisons) et n’ont aucune raison de l’embellir : leur parole crue démasque le discours poli des maîtres.',
		explanation: 'Ce n’est pas un hasard si la dernière réplique du roman est donnée à une cuisinière.',
		focus: ['Maîtres et domestiques'],
		quotation: Q.fillesSavaientTout,
	},
	{
		id: 'interp-mariage-argent',
		category: 'interpreter',
		difficulty: 'avance',
		skill: 'comprendre',
		question: 'Comment le mariage et l’argent déterminent-ils les relations entre les personnages ?',
		answer:
			'Les mariages se négocient comme des contrats (dot promise de Berthe), les liens familiaux se mesurent à l’héritage (mort du vieux Vabre) et même la réconciliation finale dépend du paiement de la dot.',
		focus: ['Mariage et intérêts économiques', 'Argent'],
		reference: 'ch. VIII, XI, XVII',
	},
	{
		id: 'interp-octave-ascension',
		category: 'interpreter',
		difficulty: 'avance',
		skill: 'comprendre',
		question: 'Que révèle le parcours d’Octave sur les mécanismes de l’ascension sociale ?',
		answer:
			'Que la réussite passe par les relations, le mariage et l’argent plutôt que par le mérite. Octave apprend les codes de la bourgeoisie dans l’immeuble, puis réussit grâce à son mariage avec Mme Hédouin.',
		explanation: 'Ironiquement, ses tentatives de séduction calculée échouent souvent : c’est une alliance d’affaires qui le fait réussir.',
		focus: ['Octave Mouret', 'Argent et ascension sociale'],
	},
	{
		id: 'interp-naturalisme-satire',
		category: 'interpreter',
		difficulty: 'avance',
		skill: 'comprendre',
		question: 'Pourquoi Pot-Bouille est-il à la fois un roman naturaliste et une satire ?',
		answer:
			'Naturaliste, parce qu’il observe précisément un milieu et montre l’effet de l’éducation et des conditions de vie. Satirique, parce qu’il grossit les défauts de ce milieu et s’en moque par l’ironie pour le critiquer.',
		explanation: 'L’observation donne de la force à la critique : le lecteur ne peut pas la rejeter comme pure invention.',
		focus: ['Naturalisme', 'Satire'],
	},
	{
		id: 'interp-portrait-collectif',
		category: 'interpreter',
		difficulty: 'avance',
		skill: 'comprendre',
		question: 'Comment les histoires individuelles composent-elles un portrait collectif ?',
		answer:
			'Chaque foyer illustre un vice (avarice, ambition, hypocrisie, adultère) ; en les juxtaposant, Zola montre qu’il ne s’agit pas d’exceptions mais d’un système partagé par toute une classe sociale.',
		focus: ['Portrait collectif'],
	},
	{
		id: 'interp-derniere-replique',
		category: 'interpreter',
		difficulty: 'avance',
		skill: 'comprendre',
		question: 'Comment interpréter la dernière réplique du roman, prononcée par la cuisinière Julie ?',
		answer:
			'Elle généralise : toutes les maisons bourgeoises se valent. La conclusion du roman est confiée à une domestique, dans une langue populaire, ce qui renverse la hiérarchie : c’est le regard d’en bas qui juge.',
		focus: ['Maîtres et domestiques', 'Dénouement'],
		quotation: Q.cochonEtCompagnie,
		reference: 'ch. XVIII',
	},
	{
		id: 'interp-scandale-etouffe',
		category: 'interpreter',
		difficulty: 'avance',
		skill: 'comprendre',
		question: 'Pourquoi le scandale de Berthe est-il étouffé plutôt que réellement sanctionné ?',
		answer:
			'Parce que ce que redoute la bourgeoisie, c’est le bruit, pas la faute. Une fois la réputation sauvée et la question de la dot réglée, chacun a intérêt à faire comme si rien ne s’était passé.',
		focus: ['Vie privée et conventions sociales', 'Berthe'],
		reference: 'ch. XVII',
	},
	{
		id: 'interp-octave-heros',
		category: 'interpreter',
		difficulty: 'avance',
		skill: 'comprendre',
		question: 'Octave Mouret est-il un héros ? Justifiez.',
		answer:
			'Pas au sens d’un modèle : c’est un ambitieux calculateur, souvent ridicule dans ses échecs. Mais il est le fil conducteur du récit et le regard qui nous fait entrer dans l’immeuble ; on peut le voir comme un anti-héros.',
		focus: ['Octave Mouret'],
	},
	{
		id: 'interp-femmes-victimes',
		category: 'interpreter',
		difficulty: 'avance',
		skill: 'comprendre',
		question: 'Les femmes de Pot-Bouille sont-elles seulement des victimes ?',
		answer:
			'Pas seulement. Elles subissent un système qui ne leur laisse que le mariage (Berthe, Marie), mais certaines le perpétuent activement, comme Mme Josserand qui l’enseigne à ses filles. Zola critique le système plus que les individus.',
		focus: ['Condition féminine', 'Mme Josserand', 'Berthe'],
	},
	{
		id: 'interp-morale-de-classe',
		category: 'interpreter',
		difficulty: 'avance',
		skill: 'comprendre',
		question: 'Que montre le fait que l’ouvrière enceinte soit chassée, alors que les adultères bourgeois sont tolérés ?',
		answer:
			'Que la « morale » de l’immeuble n’est pas une vertu, mais un instrument de classe : on punit la pauvreté visible, pas les fautes cachées des riches.',
		focus: ['Domination sociale et inégalités', 'M. Gourd'],
		quotation: Q.duPeupleChezSoi,
		reference: 'ch. XIII',
	},
	{
		id: 'interp-immeuble-neuf',
		category: 'interpreter',
		difficulty: 'avance',
		skill: 'comprendre',
		question: 'Que suggère le fait que l’immeuble soit neuf, mais déjà abîmé ?',
		answer:
			'Que la modernité du Second Empire est une façade : derrière le confort et le luxe affichés, la construction, comme la société, est déjà fissurée.',
		focus: ['L’immeuble', 'Apparences et réalité'],
		quotation: Q.pasDouzeAns,
		reference: 'ch. I',
	},
	{
		id: 'interp-vers-bonheur',
		category: 'interpreter',
		difficulty: 'avance',
		skill: 'comprendre',
		question: 'En quoi Pot-Bouille prépare-t-il Au Bonheur des Dames ?',
		answer:
			'Il raconte l’apprentissage d’Octave à Paris et se termine par son mariage avec Mme Hédouin, qui lui donne le grand magasin. La ruine de la boutique d’Auguste annonce le combat du grand commerce contre le petit.',
		focus: ['Octave Mouret', 'Les Rougon-Macquart'],
		reference: 'ch. XVIII',
	},
	{
		id: 'interp-valerie-sans-joie',
		category: 'interpreter',
		difficulty: 'avance',
		skill: 'comprendre',
		question: 'Que suggère l’aveu de Valérie, qui trompe son mari sans y trouver de plaisir ?',
		answer:
			'Que l’adultère n’est pas, chez ces bourgeois, une passion libératrice : c’est une habitude triste, une autre forme de l’ennui conjugal. Zola refuse d’en faire un sujet romanesque.',
		focus: ['Adultère et morale', 'Valérie Vabre'],
		reference: 'ch. XV',
	},

	// ------------------------------------------------------------------
	// F. SE PRÉPARER AU BAC DE FRANÇAIS (10)
	// ------------------------------------------------------------------
	{
		id: 'bac-presenter',
		category: 'bac',
		difficulty: 'intermediaire',
		skill: 'comprendre',
		question: 'Présentez Pot-Bouille en deux ou trois minutes : quelles informations ne faut-il pas oublier ?',
		hint: 'Auteur, contexte, sujet, personnages, enjeux, avis personnel.',
		answer:
			'1. Zola, 1882, dixième roman des Rougon-Macquart, naturalisme. 2. L’action : un immeuble bourgeois de la rue de Choiseul, sous le Second Empire, vu par Octave Mouret. 3. Les intrigues : mariages d’argent, adultères, héritage, domestiques. 4. L’enjeu : une satire de l’hypocrisie bourgeoise. 5. Une phrase personnelle sur ce qui vous a frappé.',
		explanation: 'Entraînez-vous à voix haute, en chronométrant : une présentation claire vaut mieux qu’une liste exhaustive.',
		focus: ['Oral'],
	},
	{
		id: 'bac-titre',
		category: 'bac',
		difficulty: 'avance',
		skill: 'comprendre',
		question: 'Expliquez la portée du titre Pot-Bouille en quelques phrases.',
		answer:
			'Le « pot-bouille » désigne la cuisine ordinaire d’un ménage. Le titre invite donc à regarder le quotidien des familles bourgeoises, ce qui mijote derrière les portes ; il suggère aussi, avec ironie, que cette cuisine intime est peu ragoûtante.',
		explanation: 'Un bon développement relie le sens propre du mot au projet du roman (dévoiler la vie privée) et à son ton (la satire).',
		focus: ['Titre'],
	},
	{
		id: 'bac-role-immeuble',
		category: 'bac',
		difficulty: 'avance',
		skill: 'comprendre',
		question: 'Rédigez en trois idées le rôle de l’immeuble dans le roman.',
		answer:
			'1. Un cadre réaliste précis, qui unifie les intrigues. 2. Une image de la hiérarchie sociale (étages, deux escaliers). 3. Un symbole de l’hypocrisie : façade luxueuse, envers sordide (la cour).',
		focus: ['L’immeuble'],
	},
	{
		id: 'bac-dimension-naturaliste',
		category: 'bac',
		difficulty: 'avance',
		skill: 'comprendre',
		question: 'Comment expliquer, à l’oral, la dimension naturaliste du roman ?',
		answer:
			'En partant de la définition (observer le réel comme un savant, montrer l’influence du milieu et de l’hérédité), puis en donnant deux exemples précis : Berthe formée par sa mère, l’accouchement d’Adèle décrit sans pudeur.',
		explanation: 'Une définition sans exemple ne prouve rien ; un exemple sans définition n’explique rien.',
		focus: ['Naturalisme'],
	},
	{
		id: 'bac-critique-sociale',
		category: 'bac',
		difficulty: 'avance',
		skill: 'comprendre',
		question: 'Quelles sont les principales cibles de la critique sociale de Zola dans Pot-Bouille ?',
		answer:
			'Le mariage d’argent, l’hypocrisie morale (adultères cachés), le pouvoir de l’argent dans les familles, le mépris des domestiques et des ouvriers, et une religion réduite à préserver les apparences.',
		focus: ['Critique sociale'],
	},
	{
		id: 'bac-parcours',
		category: 'bac',
		difficulty: 'avance',
		skill: 'comprendre',
		question: 'En classe de première, à quel parcours Pot-Bouille est-il associé pour la session 2027, et comment le roman s’y rattache-t-il ?',
		answer:
			'Au parcours « Dévoiler les rouages de la société ». Le roman démonte les mécanismes cachés de la bourgeoisie : l’argent, le mariage, la réputation, la domination des plus pauvres.',
		explanation:
			'Ce programme concerne l’épreuve anticipée de français en première, pas la classe de seconde : en seconde, on s’y prépare. On peut rapprocher Zola de Balzac (La Comédie humaine), qui voulait déjà peindre toute la société. Vérifiez toujours la liste officielle avec votre professeur.',
		focus: ['Programme de première', 'Contexte littéraire'],
	},
	{
		id: 'bac-paragraphe-methode',
		category: 'bac',
		difficulty: 'intermediaire',
		skill: 'connaitre',
		question: 'Quelles sont les trois étapes d’un paragraphe argumenté ?',
		answer:
			'1. L’assertion : l’idée que l’on défend. 2. L’explication : pourquoi cette idée est juste. 3. L’exemple (ou la preuve) : une scène précise ou une citation exacte, puis son analyse.',
		explanation: 'Un exemple doit toujours être commenté : expliquez ce qu’il prouve, ne vous contentez pas de le citer.',
		focus: ['Méthode'],
	},
	{
		id: 'bac-paragraphe-exercice',
		category: 'bac',
		difficulty: 'avance',
		skill: 'comprendre',
		question:
			'Exercice : rédigez un paragraphe argumenté qui démontre que la façade de l’immeuble cache une réalité moins glorieuse.',
		hint: 'Choisissez une citation du premier chapitre.',
		answer:
			'Assertion : dans Pot-Bouille, l’immeuble est un décor trompeur. Explication : son luxe est destiné à impressionner, non à refléter la vertu des habitants. Exemple : Campardon avoue à Octave que ces maisons, « c’est bâti pour faire de l’effet », et qu’il « ne faudrait pas trop fouiller les murs » (ch. I). Analyse : l’architecte lui-même reconnaît que la beauté de la façade dissimule des défauts, ce qui annonce les secrets des familles.',
		explanation: 'Comparez votre paragraphe au modèle : avez-vous les trois étapes, et votre exemple est-il analysé ?',
		focus: ['Méthode', 'L’immeuble'],
		quotation: Q.batiPourEffet,
		reference: 'ch. I',
	},
	{
		id: 'bac-commenter-citation',
		category: 'bac',
		difficulty: 'avance',
		skill: 'comprendre',
		question: 'Comment commenter la phrase « Derrière les belles portes d’acajou luisant, il y avait comme des abîmes d’honnêteté » ?',
		answer:
			'Relever les procédés : la description valorisante (« belles », « luisant »), la comparaison introduite par « comme », et l’association surprenante de « abîmes » et « honnêteté ». Interpréter : l’ironie du narrateur suggère que cette honnêteté est un gouffre qui cache le contraire.',
		explanation: 'Méthode du commentaire : repérer un procédé, le nommer, puis dire quel effet il produit sur le lecteur.',
		focus: ['Méthode', 'Ironie'],
		quotation: Q.abimesHonnetete,
		reference: 'ch. I',
	},
	{
		id: 'bac-dissertation',
		category: 'bac',
		difficulty: 'avance',
		skill: 'comprendre',
		question: 'Pour une dissertation sur le roman et la société, quels arguments Pot-Bouille permet-il de défendre ?',
		answer:
			'1. Le roman peut représenter fidèlement une société (description précise de l’immeuble et des milieux). 2. Il peut la critiquer (satire, ironie). 3. Il peut faire réfléchir en montrant ce qui est caché (domestiques, ouvrière, mariage d’argent). Chaque argument doit être appuyé par une scène précise.',
		explanation: 'Préparez pour chaque argument un exemple daté (chapitre) et, si possible, une citation exacte.',
		focus: ['Méthode', 'Critique sociale'],
	},
];
