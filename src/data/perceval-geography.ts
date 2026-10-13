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
	PercevalSpatialCategory,
	{ label: string; color: string; description: string; badgeClass: string }
> = {
	reel: {
		label: 'Lieu réel ou repère breton',
		color: '#235284',
		description: 'Ville ou forteresse réelle de l’espace arthurien (Carduel/Carlion, pays de Galles).',
		badgeClass: 'status-real',
	},
	fictionnel: {
		label: 'Lieu fictionnel du roman',
		color: '#8b572a',
		description: 'Château ou domaine créé pour le récit, sans localisation géographique réelle établie.',
		badgeClass: 'status-fictional',
	},
	espace_naturel: {
		label: 'Espace sauvage ou frontière',
		color: '#5f6b2f',
		description: 'Forêt déserte, rivière ou lande servant de cadre aux épreuves initiatiques.',
		badgeClass: 'status-natural',
	},
	continuation: {
		label: 'Lieu issu des continuations',
		color: '#6a4c93',
		description: 'Étape ou domaine inventé par un auteur postérieur pour poursuivre le roman inachevé.',
		badgeClass: 'status-continuation',
	},
};

export const percevalSpatialStages: PercevalSpatialStage[] = [
	{
		id: 'gaste-foret',
		order: 1,
		name: 'La Gaste Forêt (Manoir maternel)',
		category: 'espace_naturel',
		categoryLabel: 'Espace sauvage ou frontière',
		categoryBadgeClass: 'status-natural',
		verses: 'vers 69–634',
		cycle: 'perceval',
		summary:
			'Forêt sauvage et isolée au pays de Galles où la Veuve Dame élève Perceval en secret pour lui cacher l’existence des chevaliers. C’est là qu’il croise des cavaliers étincelants et décide de partir.',
		characters: ['Perceval', 'La mère de Perceval'],
		spatialRole: 'Point de départ · lieu de l’enfance naïve et de l’ignorance absolue du monde.',
		geographicStatus: 'Espace imaginaire général (forêt sauvage, sans coordonnées géographiques réelles).',
		didacticExplanation:
			'Le mot médiéval « gaste » signifie déserte ou inculte. Cette forêt n’est pas un bois précis sur une carte actuelle : elle symbolise l’isolement total du jeune Perceval avant son entrée dans la société des hommes.',
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
		verses: 'vers 865–1304',
		cycle: 'perceval',
		summary:
			'Château et cité où réside le roi Arthur au début du roman. Perceval y fait irruption à cheval, réclame l’armure du Chevalier Vermeil, abat ce dernier d’un coup de javelot et s’empare de ses armes.',
		characters: ['Le roi Arthur', 'Keu', 'Perceval', 'Le Chevalier Vermeil'],
		spatialRole: 'Entrée dans le monde féodal · premier contact burlesque puis victorieux avec la cour.',
		geographicStatus: 'Repère géographique réel (assimilé à Carlisle, Cumbria, au nord de l’Angleterre).',
		didacticExplanation:
			'Carduel est l’une des capitales arthuriennes traditionnelles, identifiée à Carlisle près de la frontière écossaise. Mais chez Chrétien, la ville est dite assise au bord de la mer, ce qui montre que l’auteur adapte librement la géographie réelle.',
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
		categoryLabel: 'Lieu fictionnel du roman',
		categoryBadgeClass: 'status-fictional',
		verses: 'vers 1357–1698',
		cycle: 'perceval',
		summary:
			'Forteresse située près d’un fleuve où le vieux seigneur Gornemant accueille Perceval. En une journée, il lui enseigne le maniement de l’épée, la courtoisie, l’adoubement et la règle de réserve dans les paroles.',
		characters: ['Gornemant de Goort', 'Perceval'],
		spatialRole: 'Lieu d’apprentissage · métamorphose de l’adolescent naïf en véritable chevalier adoubé.',
		geographicStatus: 'Lieu fictionnel du roman (localisation inconnue, aucun site historique réel).',
		didacticExplanation:
			'Ce château n’existe sur aucune carte. Il est placé sur la route de Perceval pour matérialiser son éducation accélérée : en franchissant les portes de cette forteresse, le jeune Gallois apprend les codes de la noblesse.',
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
		categoryLabel: 'Lieu fictionnel du roman',
		categoryBadgeClass: 'status-fictional',
		verses: 'vers 1699–2975',
		cycle: 'perceval',
		summary:
			'Château au bord de la mer, assiégé et affamé par Clamadeu et son sénéchal Anguingueron. Perceval y livre ses premiers grands combats chevaleresques, délivre Blanchefleur et découvre l’amour courtois.',
		characters: ['Blanchefleur', 'Perceval', 'Clamadeu des Îles'],
		spatialRole: 'Épreuve guerrière et sentimentale · première victoire militaire et serment courtois.',
		geographicStatus: 'Lieu fictionnel du récit (nom poétique signifiant « beau séjour », sans localisation réelle).',
		didacticExplanation:
			'Beaurepaire est un château créé par l’imagination du poète. Le nom est paradoxal : le lieu est ravagé par la famine avant que Perceval ne le sauve. Cela montre que les noms chez Chrétien ont une valeur poétique et symbolique.',
		x: 470,
		y: 110,
		labelDx: 0,
		labelDy: -28,
	},
	{
		id: 'chateau-roi-pecheur',
		order: 5,
		name: 'Le château secret du Roi Pêcheur',
		category: 'fictionnel',
		categoryLabel: 'Lieu fictionnel du roman',
		categoryBadgeClass: 'status-fictional',
		verses: 'vers 2976–3421',
		cycle: 'perceval',
		summary:
			'Château magique qui apparaît au fond d’une vallée rocheuse après les indications d’un pêcheur en barque. Perceval y assiste au passage de la lance qui saigne et du Graal. Au matin, le château s’est vidé de tout habitant.',
		characters: ['Le Roi Pêcheur', 'Perceval', 'Le Graal', 'La lance qui saigne'],
		spatialRole: 'Centre mystique et dramatique du roman · épreuve suprême de la question manquée.',
		geographicStatus: 'Lieu mystérieux et magique (localisation inaccessible, lieu enchanté du merveilleux chrétien).',
		didacticExplanation:
			'Ne cherchez pas le château du Graal sur une carte ! Il apparaît et disparaît comme par enchantement. Le texte précise qu’il est invisible depuis la crête rocheuse avant de se révéler subitement : c’est un espace spirituel et merveilleux.',
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
		categoryLabel: 'Espace sauvage ou frontière',
		categoryBadgeClass: 'status-natural',
		verses: 'vers 4144–4602',
		cycle: 'perceval',
		summary:
			'Plaine enneigée où une oie sauvage blessée laisse trois gouttes de sang vermeil dans la neige blanche. Frappé par ces couleurs qui lui rappellent le teint de Blanchefleur, Perceval entre dans une profonde rêverie amoureuse.',
		characters: ['Perceval', 'Gauvain', 'Keu', 'Le roi Arthur'],
		spatialRole: 'Espace de contemplation poétique · réconciliation et triomphe devant toute l’armée d’Arthur.',
		geographicStatus: 'Espace naturel du récit (lande anonyme couverte de neige, cadre poétique).',
		didacticExplanation:
			'Cette scène célèbre montre comment Chrétien utilise la nature : la neige blanche et le sang rouge ne forment pas un lieu géographique précis, mais un tableau poétique qui plonge Perceval dans le souvenir de celle qu’il aime.',
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
		categoryLabel: 'Espace sauvage ou frontière',
		categoryBadgeClass: 'status-natural',
		verses: 'vers 6217–6518',
		cycle: 'perceval',
		summary:
			'Cabane isolée dans les bois profonds où vit un saint ermite. Perceval s’y rend le Vendredi saint après cinq ans d’errance. L’ermite, qui est son oncle, lui révèle le secret de son péché, le confesse et le réconcilie avec Dieu.',
		characters: ['L’oncle ermite', 'Perceval'],
		spatialRole: 'Aboutissement spirituel · conversion religieuse et fin du cycle d’apprentissage du héros.',
		geographicStatus: 'Lieu de retraite spirituelle (espace sauvage secret, sans localisation sur une carte).',
		didacticExplanation:
			'Dans les romans médiévaux, l’ermitage est toujours caché dans une forêt profonde, loin des châteaux et des villes. C’est le lieu du silence, de la prière et de la vérité intérieure, en opposition avec le bruit des tournois et des cours royales.',
		x: 820,
		y: 250,
		labelDx: 0,
		labelDy: 30,
	},
];
