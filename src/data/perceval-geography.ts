// Données géographiques et spatiales pour Le Conte du Graal de Chrétien de Troyes (/perceval)
// Conception pour élèves de 5e (12–13 ans) : distinction rigoureuse entre
// géographie littéraire/imaginaire, espaces réels mentionnés, espaces généraux et continuations.

export type PercevalSpatialCategory =
	| 'reel' // Lieu géographique réel ou traditionnellement identifiable dans la matière de Bretagne
	| 'fictionnel' // Lieu fictionnel du récit sans localisation réelle établie (château, manoir)
	| 'espace_naturel' // Espace géographique général ou symbolique (forêt, lande, cours d’eau)
	| 'continuation'; // Lieu issu des suites du roman inachevé (à distinguer du texte de Chrétien)

export interface PercevalSpatialStage {
	id: string;
	order: number;
	name: string;
	category: PercevalSpatialCategory;
	categoryLabel: string;
	categoryBadgeClass: string;
	verses: string;
	cycle: 'perceval' | 'gauvain';
	summary: string;
	characters: string[];
	spatialRole: string;
	geographicStatus: string;
	didacticExplanation: string;
	// Position schématique dans le canevas SVG narratif (width: 900, height: 420)
	x: number;
	y: number;
	// Décalage libellé desktop
	labelDx?: number;
	labelDy?: number;
}

export const PERCEVAL_SPATIAL_CATEGORIES: Record<
	Exclude<PercevalSpatialCategory, 'continuation'>,
	{ label: string; color: string; description: string; badgeClass: string }
> = {
	reel: {
		label: 'Lieu réel ou repère breton',
		color: '#235284',
		description: 'Ville ou forteresse réelle de l’espace arthurien (Carduel/Carlisle, pays de Galles).',
		badgeClass: 'status-real',
	},
	fictionnel: {
		label: 'Lieu inventé dans le roman',
		color: '#8b572a',
		description: 'Château ou forteresse créé pour l’histoire, sans emplacement réel sur une carte.',
		badgeClass: 'status-fictional',
	},
	espace_naturel: {
		label: 'Espace sauvage ou nature',
		color: '#5f6b2f',
		description: 'Forêt déserte, rivière ou lande qui sert de cadre aux épreuves de Perceval.',
		badgeClass: 'status-natural',
	},
};

export const percevalSpatialStages: PercevalSpatialStage[] = [
	{
		id: 'gaste-foret',
		order: 1,
		name: 'La Gaste Forêt (Manoir maternel)',
		category: 'espace_naturel',
		categoryLabel: 'Espace sauvage ou nature',
		categoryBadgeClass: 'status-natural',
		verses: 'vers 69–634 (éd. F. Lecoy)',
		cycle: 'perceval',
		summary:
			'Forêt sauvage et isolée au pays de Galles où sa mère élève Perceval à l’écart de tous les dangers. Elle lui cache l’existence des chevaliers pour le garder près d’elle. C’est là qu’il croise des cavaliers en armure et décide aussitôt de partir.',
		characters: ['Perceval', 'La mère de Perceval'],
		spatialRole: 'Point de départ · lieu de l’enfance naïve et de l’ignorance du monde.',
		geographicStatus: 'Espace sauvage du conte (forêt sans emplacement réel sur une carte moderne).',
		didacticExplanation:
			'En ancien français, « gaste » veut dire déserte ou inculte. Cette forêt n’est pas un bois précis que l’on pourrait visiter : elle représente l’isolement total du jeune Perceval avant qu’il ne découvre le monde des hommes.',
		x: 80,
		y: 190,
		labelDx: 0,
		labelDy: -28,
	},
	{
		id: 'carduel-arthur',
		order: 2,
		name: 'Carduel (Cour du roi Arthur)',
		category: 'reel',
		categoryLabel: 'Lieu réel ou repère breton',
		categoryBadgeClass: 'status-real',
		verses: 'vers 865–1304 (éd. F. Lecoy)',
		cycle: 'perceval',
		summary:
			'Château et ville où réside le roi Arthur au début du roman. Perceval y entre à cheval sans descendre de sa monture. Il réclame l’armure du Chevalier Vermeil, abat cet ennemi d’un coup de javelot et prend ses armes de fer.',
		characters: ['Le roi Arthur', 'Keu', 'Perceval', 'Le Chevalier Vermeil'],
		spatialRole: 'Entrée dans le monde des chevaliers · première arrivée maladroite puis victorieuse à la cour.',
		geographicStatus: 'Repère géographique traditionnel (souvent rattaché à Carlisle, Cumbria, au nord-ouest de l’Angleterre).',
		didacticExplanation:
			'Les récits du roi Arthur situent souvent Carduel à Carlisle, près de la frontière entre l’Angleterre et l’Écosse. Cependant, Chrétien dit que la ville se trouve au bord de la mer : l’auteur adapte librement la géographie pour son histoire.',
		x: 210,
		y: 90,
		labelDx: 0,
		labelDy: -28,
	},
	{
		id: 'chateau-gornemant',
		order: 3,
		name: 'Le château de Gornemant de Goort',
		category: 'fictionnel',
		categoryLabel: 'Lieu inventé dans le roman',
		categoryBadgeClass: 'status-fictional',
		verses: 'vers 1357–1698 (éd. F. Lecoy)',
		cycle: 'perceval',
		summary:
			'Château fort au bord d’un fleuve où le vieux seigneur Gornemant accueille Perceval. En une journée, il lui apprend à manier l’épée, lui enseigne la politesse des chevaliers, l’adoube et lui conseille de ne pas parler à tort et à travers.',
		characters: ['Gornemant de Goort', 'Perceval'],
		spatialRole: 'Lieu d’apprentissage · l’adolescent naïf devient un vrai chevalier adoubé.',
		geographicStatus: 'Lieu inventé dans le roman (le récit ne fournit aucun emplacement réel).',
		didacticExplanation:
			'Ce château n’a jamais existé. Chrétien l’imagine pour montrer l’éducation rapide de Perceval : en entrant dans cette demeure, le jeune Gallois apprend les règles d’honneur et de conduite de la noblesse.',
		x: 340,
		y: 220,
		labelDx: 0,
		labelDy: 30,
	},
	{
		id: 'beaurepaire-blanchefleur',
		order: 4,
		name: 'Le château de Beaurepaire (Belrepeire)',
		category: 'fictionnel',
		categoryLabel: 'Lieu inventé dans le roman',
		categoryBadgeClass: 'status-fictional',
		verses: 'vers 1699–2975 (éd. F. Lecoy)',
		cycle: 'perceval',
		summary:
			'Château fort au bord de la mer, assiégé et affamé par Clamadeu et son sénéchal Anguingueron. Perceval y mène ses premiers grands combats, délivre la forteresse, sauve Blanchefleur de la misère et tombe amoureux d’elle.',
		characters: ['Blanchefleur', 'Perceval', 'Clamadeu des Îles'],
		spatialRole: 'Épreuve du combat et de l’amour · première grande victoire militaire pour défendre une dame.',
		geographicStatus: 'Lieu inventé dans le roman (nom poétique signifiant « beau séjour », sans localisation réelle).',
		didacticExplanation:
			'Beaurepaire est un château créé par l’imagination du poète. Son nom est surprenant : le lieu est ravagé par la famine avant l’arrivée de Perceval. Chrétien utilise ce nom pour faire rêver ses lecteurs, non pour décrire un lieu réel.',
		x: 470,
		y: 110,
		labelDx: 0,
		labelDy: -28,
	},
	{
		id: 'chateau-roi-pecheur',
		order: 5,
		name: 'Le château du Roi Pêcheur',
		category: 'fictionnel',
		categoryLabel: 'Lieu inventé dans le roman',
		categoryBadgeClass: 'status-fictional',
		verses: 'vers 2976–3421 (éd. F. Lecoy)',
		cycle: 'perceval',
		summary:
			'Château mystérieux qui apparaît au fond d’une vallée rocheuse après les conseils d’un pêcheur en barque. Perceval y assiste au passage de la lance qui saigne et du Graal. Au petit matin, les habitants ont disparu et les portes sont closes.',
		characters: ['Le Roi Pêcheur', 'Perceval', 'Le Graal', 'La lance qui saigne'],
		spatialRole: 'Épreuve capitale du silence · Perceval n’ose pas poser la question qui aurait guéri le roi blessé.',
		geographicStatus: 'Lieu inventé et mystérieux (le récit ne permet pas de lui attribuer une position géographique moderne).',
		didacticExplanation:
			'Le château du Roi Pêcheur ne se trouve sur aucune carte moderne. Il apparaît soudainement au creux d’une vallée alors qu’on ne voyait rien d’en haut. C’est un lieu mystérieux créé pour tester le cœur et la compréhension du chevalier.',
		x: 600,
		y: 260,
		labelDx: 0,
		labelDy: 30,
	},
	{
		id: 'lande-gouttes-sang',
		order: 6,
		name: 'La lande aux trois gouttes de sang sur la neige',
		category: 'espace_naturel',
		categoryLabel: 'Espace sauvage ou nature',
		categoryBadgeClass: 'status-natural',
		verses: 'vers 4144–4602 (éd. F. Lecoy)',
		cycle: 'perceval',
		summary:
			'Plaine enneigée où une oie blessée par un faucon laisse trois gouttes de sang rouge sur la neige blanche. Ces couleurs rappellent à Perceval le visage de sa bien-aimée Blanchefleur. Il plonge dans une profonde rêverie amoureuse.',
		characters: ['Perceval', 'Gauvain', 'Keu', 'Le roi Arthur'],
		spatialRole: 'Étape de contemplation amoureuse · réconciliation pacifique avec le roi Arthur et son armée.',
		geographicStatus: 'Espace naturel du récit (grande plaine d’hiver sans nom précis).',
		didacticExplanation:
			'La neige blanche et le sang vermeil forment un tableau poétique marquant. Ce lieu n’a pas de nom de ville ou de village : Chrétien installe cette scène dans la nature pour mettre en valeur les sentiments de Perceval.',
		x: 710,
		y: 120,
		labelDx: 0,
		labelDy: -28,
	},
	{
		id: 'ermitage-foret',
		order: 7,
		name: 'L’ermitage dans la forêt (Vendredi saint)',
		category: 'espace_naturel',
		categoryLabel: 'Espace sauvage ou nature',
		categoryBadgeClass: 'status-natural',
		verses: 'vers 6217–6518 (éd. F. Lecoy)',
		cycle: 'perceval',
		summary:
			'Petite cabane cachée dans les bois où vit un saint ermite. Perceval s’y rend le Vendredi saint après cinq années d’errance sans prier. L’ermite est son oncle : il lui explique sa faute passée, le confesse et l’aide à se tourner de nouveau vers Dieu.',
		characters: ['L’oncle ermite', 'Perceval'],
		spatialRole: 'Étape spirituelle · Perceval reconnaît ses erreurs passées et se tourne de nouveau vers Dieu.',
		geographicStatus: 'Lieu de retraite spirituelle (cabane retirée dans les bois, sans repère géographique moderne).',
		didacticExplanation:
			'Au Moyen Âge, un ermite choisit de vivre seul dans la forêt profonde pour prier en paix, loin du tumulte des villes et des cours royales. C’est le lieu du pardon et de la réconciliation intérieure pour Perceval.',
		x: 820,
		y: 250,
		labelDx: 0,
		labelDy: 30,
	},
];
