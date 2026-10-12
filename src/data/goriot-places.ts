export type PlaceCategory =
	| 'pension'
	| 'aristocratie'
	| 'bourgeoisie'
	| 'sociabilite'
	| 'denouement';

export type LocationPrecision = 'exact' | 'approximate' | 'district';

export interface HistoricalMapPoint {
	pixelOrig: [number, number]; // [X, Y] sur le scan original haute résolution (9760 × 7480 px)
	pixel3200: [number, number]; // [X, Y] sur le dérivé optimisé WebP (3200 × 2452 px)
	percent: [number, number]; // [X%, Y%] depuis le coin supérieur gauche
	leafletCoords: [number, number]; // [Y, X] en CRS.Simple Leaflet (Y = 2452 - Y_pixel, X = X_pixel)
}

export interface GoriotPlace {
	id: string;
	name: string;
	subtitle: string;
	category: PlaceCategory;
	coordinates: [number, number]; // [lat, lng] géographique moderne (WGS84 conservé pour référence)
	historicalCoordinates: HistoricalMapPoint; // Coordonnées vérifiées sur le plan Maire de 1821
	locationPrecision: LocationPrecision;
	historicalAddress: string;
	modernLocation: string;
	characters: string[];
	narrativeRole: string;
	literaryAnalysis: string;
	observationPoint?: string;
	eventOrder: number; // 1 to N pour le parcours narratif
	narrativeStepTitle: string;
	narrativeStepExplanation: string;
	quotation: string;
	quotationReference: string;
	relatedSection?: string;
}

export const HISTORICAL_MAP_CONFIG = {
	title: 'Plan lavé topographiquement de la ville de Paris',
	author: 'N. M. Maire',
	publicationYear: 1821,
	sourceWork: 'Atlas administratif de la ville de Paris (1821)',
	collection: 'David Rumsey Historical Map Collection',
	attribution: 'Plan lavé topographiquement de Paris, N. M. Maire, 1821 — David Rumsey Historical Map Collection',
	altText:
		'Plan historique lavé topographiquement de la ville de Paris par N. M. Maire (1821), représentant les douze anciens arrondissements, les rues, monuments, cours de la Seine et le mur des Fermiers généraux sous la Restauration.',
	imageSrc: '/images/plan-maire-paris-1821.webp',
	width: 3200,
	height: 2452,
	originalWidth: 9760,
	originalHeight: 7480,
};

export interface CategoryMetadata {
	id: PlaceCategory;
	label: string;
	color: string;
	description: string;
}

export const goriotCategories: Record<PlaceCategory, CategoryMetadata> = {
	pension: {
		id: 'pension',
		label: 'Pension et vie quotidienne',
		color: '#8b5a2b', // Teinte terre / bistre évoquant la pension bourgeoise
		description: 'Le foyer modeste et décrépit du faubourg Saint-Marceau, antre de misère et point de départ de l’intrigue.',
	},
	aristocratie: {
		id: 'aristocratie',
		label: 'Aristocratie',
		color: '#1e4b88', // Bleu nuit noble / faubourg Saint-Germain
		description: 'Les salons exclusifs du faubourg Saint-Germain, réservés à l’ancienne noblesse et aux titres immémoriaux.',
	},
	bourgeoisie: {
		id: 'bourgeoisie',
		label: 'Bourgeoisie et argent',
		color: '#9e6200', // Or / bronze pour la haute finance de la Chaussée-d’Antin
		description: 'Les hôtels opulents de la Chaussée-d’Antin, où triomphent la banque, les spéculateurs et les parvenus.',
	},
	sociabilite: {
		id: 'sociabilite',
		label: 'Déplacements et sociabilité',
		color: '#2d7a56', // Vert sombre pour les théâtres, jardins, études et jeux
		description: 'Théâtres, maisons de jeu, universités et carrefours parisiens où se croisent toutes les classes sociales.',
	},
	denouement: {
		id: 'denouement',
		label: 'Dénouement',
		color: '#7a2233', // Pourpre / grenat funèbre pour les adieux et le défi
		description: 'L’office méprisé et la tombe solitaire dominant Paris, où s’achève l’apprentissage de Rastignac.',
	},
};

export const goriotPlaces: GoriotPlace[] = [
	{
		id: 'pension-vauquer',
		name: 'La pension Vauquer',
		subtitle: 'Le creuset de la misère et le point de départ de Rastignac',
		category: 'pension',
		coordinates: [48.8427, 2.3486],
		historicalCoordinates: {
			pixelOrig: [5195, 5690],
			pixel3200: [1703.3, 1865.2],
			percent: [53.23, 76.07],
			leafletCoords: [586.8, 1703.3],
		},
		locationPrecision: 'approximate',
		historicalAddress: 'Bas de la rue Neuve-Sainte-Geneviève (secteur en pente vers la rue de l’Arbalète ; n° 24 présumé par la tradition critique)',
		modernLocation: 'Rue Tournefort (vers les n° 22-26), 5e arrondissement',
		characters: ['Eugène de Rastignac', 'Le père Goriot', 'Vautrin (Jacques Collin)', 'Mme Vauquer', 'Victorine Taillefer', 'Mlle Michonneau', 'Poiret', 'Horace Bianchon'],
		narrativeRole: 'Résidence collective où cohabitent les pensionnaires déchus ou débutants. C’est le point d’observation initial d’Eugène et le théâtre de la déchéance de Goriot.',
		literaryAnalysis: 'Balzac consacre un long préambule à la description minutieuse de la pension, dont l’odeur de renfermé et la crasse symbolisent le monde des déclassés. Le texte n’indique aucun numéro d’immeuble, mais situe la maison dans le bas de la rue Neuve-Sainte-Geneviève (actuelle rue Tournefort). L’attribution au n° 24 provient d’une tradition critique et photographique (notamment Eugène Atget en 1912, qui immortalise la cour intérieure) ; le point cartographique constitue une position indicative dans cette pente.',
		observationPoint: 'La distance sociale et morale infranchissable qui sépare cet antre misérable des salons dorés que Rastignac s’obstine à conquérir.',
		eventOrder: 1,
		narrativeStepTitle: '1. Le point de départ : la pension Vauquer',
		narrativeStepExplanation: 'C’est dans cette pension du bas de la rue Neuve-Sainte-Geneviève que le jeune étudiant provincial découvre le père Goriot, écoute les tentations criminelles de Vautrin et mesure l’urgence d’échapper à la médiocrité.',
		quotation: 'La maison où s’exploite la pension bourgeoise appartient à madame Vauquer. Elle est située dans le bas de la rue Neuve-Sainte-Geneviève, à l’endroit où le terrain s’abaisse vers la rue de l’Arbalète par une pente si brusque et si rude que les chevaux la montent ou la descendent rarement.',
		quotationReference: 'Le Père Goriot, première partie (« Une pension bourgeoise »)',
	},
	{
		id: 'ecole-de-droit',
		name: 'L’École de droit',
		subtitle: 'L’alibi universitaire et la vertu laborieuse délaissée',
		category: 'sociabilite',
		coordinates: [48.8465, 2.3444],
		historicalCoordinates: {
			pixelOrig: [4880, 5045],
			pixel3200: [1600.0, 1653.8],
			percent: [50.0, 67.45],
			leafletCoords: [798.2, 1600.0],
		},
		locationPrecision: 'exact',
		historicalAddress: 'Place du Panthéon (bâtiment édifié par Soufflot)',
		modernLocation: '12, place du Panthéon, Faculté de droit de Paris (Paris-Panthéon-Assas), 5e arrondissement',
		characters: ['Eugène de Rastignac', 'Horace Bianchon'],
		narrativeRole: 'Lieu d’études officielles de Rastignac, vite relégué au second plan au profit de l’apprentissage de la société mondaine.',
		literaryAnalysis: 'L’École de droit incarne la voie méritocratique classique, longue et incertaine, défendue avec probité par Bianchon. Rastignac la délaisse très vite lorsqu’il comprend qu’un salon féminin procure une ascension cent fois plus rapide que dix ans d’efforts juridiques.',
		observationPoint: 'Le renoncement progressif au travail honnête au profit de la séduction et du cynisme mondain.',
		eventOrder: 2,
		narrativeStepTitle: '2. L’abandon des bancs du Droit',
		narrativeStepExplanation: 'Envoyé à Paris par sa famille pour obtenir sa licence, Rastignac ne prend que le strict minimum d’inscriptions nécessaires avant de déserter les amphithéâtres pour les boudoirs aristocratiques.',
		quotation: 'Pendant sa première année de séjour à Paris, le peu de travail que veulent les premiers grades à prendre dans la Faculté l’avait laissé libre de goûter les délices visibles du Paris matériel.',
		quotationReference: 'Le Père Goriot, première partie (« Une pension bourgeoise »)',
	},
	{
		id: 'hotel-de-restaud',
		name: 'L’hôtel de la comtesse de Restaud',
		subtitle: 'Le premier faux pas mondain de Rastignac',
		category: 'bourgeoisie',
		coordinates: [48.8715, 2.3342],
		historicalCoordinates: {
			pixelOrig: [4090, 2000],
			pixel3200: [1341.0, 655.6],
			percent: [41.91, 26.74],
			leafletCoords: [1796.4, 1341.0],
		},
		locationPrecision: 'district',
		historicalAddress: 'Rue du Helder (numéro non précisé par Balzac)',
		modernLocation: 'Rue du Helder (secteur Opéra / boulevard des Italiens), 9e arrondissement',
		characters: ['Anastasie de Restaud', 'Comte de Restaud', 'Maxime de Trailles', 'Eugène de Rastignac', 'Le père Goriot'],
		narrativeRole: 'Première incursion mondaine de Rastignac dans un ménage opulent mais déchiré par les dettes et les liaisons clandestines.',
		literaryAnalysis: 'Anastasie, fille aînée de Goriot, a épousé un titre aristocratique mais ruine le ménage pour entretenir son amant Maxime de Trailles. Eugène, qui a surpris le père Goriot sortant discrètement par la cour par un escalier dérobé, commet l’impair fatal de prononcer son nom au salon, découvrant la honte brutale des filles envers leur père.',
		observationPoint: 'L’ingratitude filiale et le gouffre financier creusé par les apparences aristocratiques dans la noblesse d’Empire.',
		eventOrder: 3,
		narrativeStepTitle: '3. La gaffe chez la comtesse de Restaud',
		narrativeStepExplanation: 'Rastignac tente d’approcher Anastasie rue du Helder. En mentionnant naïvement le père Goriot aperçu dans la cour, il provoque la réprobation du comte et se fait immédiatement fermer les portes du logis.',
		quotation: '— Mais, monsieur, dit le comte en arrêtant Eugène par un geste, vous pouvez ignorer que monsieur Goriot… — Est mon voisin de pension, interrompit Eugène. […] Madame de Restaud jeta sur son mari un regard d’intelligence et se leva.',
		quotationReference: 'Le Père Goriot, première partie (« Une pension bourgeoise »)',
	},
	{
		id: 'hotel-de-beauseant',
		name: 'L’hôtel de la vicomtesse de Beauséant',
		subtitle: 'Le sanctuaire du grand monde et l’école du cynisme',
		category: 'aristocratie',
		coordinates: [48.8562, 2.3195],
		historicalCoordinates: {
			pixelOrig: [3380, 4070],
			pixel3200: [1108.2, 1334.2],
			percent: [34.63, 54.41],
			leafletCoords: [1117.8, 1108.2],
		},
		locationPrecision: 'district',
		historicalAddress: 'Rue de Grenelle, faubourg Saint-Germain (numéro non précisé par Balzac)',
		modernLocation: 'Rue de Grenelle, 7e arrondissement',
		characters: ['Vicomtesse de Beauséant', 'Marquis d’Ajuda-Pinto', 'Duchesse de Langeais', 'Eugène de Rastignac'],
		narrativeRole: 'Le salon le plus fermé et le plus illustre de Paris. Madame de Beauséant, cousine d’Eugène, lui enseigne les règles impitoyables de la société.',
		literaryAnalysis: 'Dans cet hôtel majestueux du faubourg Saint-Germain s’exprime l’aristocratie légitimiste la plus exclusive. Madame de Beauséant y dispense sa leçon fameuse : traiter le monde comme une réunion de dupes et de fripons, et frapper sans pitié pour parvenir.',
		observationPoint: 'Le fossé infranchissable tracé par la noblesse de sang contre la finance bourgeoise, illustré par le mépris affiché envers Delphine de Nucingen.',
		eventOrder: 4,
		narrativeStepTitle: '4. L’initiation au faubourg Saint-Germain',
		narrativeStepExplanation: 'Reçu par sa cousine rue de Grenelle, Eugène reçoit la clé du Paris mondain : attaquer la société par les femmes et viser la seconde fille de Goriot, Delphine de Nucingen, prête à tout pour franchir les portes de ce salon.',
		quotation: 'Aussi, madame de Nucingen laperait-elle toute la boue qu’il y a entre la rue Saint-Lazare et la rue de Grenelle pour entrer dans mon salon.',
		quotationReference: 'Le Père Goriot, première partie (« Une pension bourgeoise »)',
	},
	{
		id: 'theatre-des-italiens',
		name: 'Le Théâtre des Italiens (Salle Favart)',
		subtitle: 'La vitrine de l’élégance et la rencontre avec Delphine',
		category: 'sociabilite',
		coordinates: [48.8708, 2.3375],
		historicalCoordinates: {
			pixelOrig: [4350, 2050],
			pixel3200: [1426.2, 672.0],
			percent: [44.57, 27.41],
			leafletCoords: [1780.0, 1426.2],
		},
		locationPrecision: 'approximate',
		historicalAddress: 'Place Boieldieu / Salle Favart (résidence du Théâtre-Italien en 1819 déduite du contexte historique)',
		modernLocation: 'Opéra-Comique, place Boieldieu, 2e arrondissement',
		characters: ['Delphine de Nucingen', 'Eugène de Rastignac', 'Le père Goriot'],
		narrativeRole: 'Lieu de représentation mondaine où Rastignac goûte la musique de Rossini et aborde pour la première fois Delphine dans sa loge.',
		literaryAnalysis: 'Balzac mentionne « les Italiens » sans préciser l’adresse de la salle. En 1819, la troupe royale italienne (les « Bouffons ») jouait à la salle Favart (place Boieldieu), avant son incendie de 1838 et son transfert ultérieur à la salle Ventadour. L’emplacement cartographique correspond à cette réalité institutionnelle de 1819, reconstituée par l’histoire des théâtres.',
		observationPoint: 'L’usage stratégique du spectacle lyrique comme marché public des réputations et des ambitions amoureuses.',
		eventOrder: 5,
		narrativeStepTitle: '5. L’ivresse des loges aux Italiens',
		narrativeStepExplanation: 'Au Théâtre des Italiens, Eugène entend Le Barbier de Séville et s’introduit dans la loge de Delphine de Nucingen. Le lendemain, ses confidences à la pension alertent Goriot.',
		quotation: '— L’on donnait hier aux Italiens le Barbier de Séville de Rossini. Je n’avais jamais entendu de si délicieuse musique, dit-il. Mon Dieu ! est-on heureux d’avoir une loge aux Italiens. Le père Goriot saisit cette parole au vol comme un chien saisit un mouvement de son maître.',
		quotationReference: 'Le Père Goriot, deuxième partie (« L’Entrée dans le monde »)',
	},
	{
		id: 'palais-royal',
		name: 'Le Palais-Royal et ses maisons de jeu',
		subtitle: 'Le gouffre du hasard et la roulette initiatique',
		category: 'sociabilite',
		coordinates: [48.8638, 2.337],
		historicalCoordinates: {
			pixelOrig: [4400, 2830],
			pixel3200: [1442.6, 927.7],
			percent: [45.08, 37.83],
			leafletCoords: [1524.3, 1442.6],
		},
		locationPrecision: 'exact',
		historicalAddress: 'Galeries du Palais-Royal, maison de jeu au n° 9 (mention textuelle explicite)',
		modernLocation: 'Domaine du Palais-Royal (galerie de Valois n° 9), 1er arrondissement',
		characters: ['Delphine de Nucingen', 'Eugène de Rastignac'],
		narrativeRole: 'Lieu des plaisirs et des tripots où Delphine envoie Rastignac jouer à la roulette ses derniers cent francs.',
		literaryAnalysis: 'Delphine confie cent francs à Rastignac pour jouer au numéro 9 du Palais-Royal (« Il courut au numéro 9 »). Sous la Restauration, les tripots officiels des arcades du Palais-Royal étaient rigoureusement numérotés, et le n° 9 abritait l’un des cercles de roulette les plus fréquentés. Rastignac y empoche 7 000 francs nets (7 200 francs moins le pourboire au vieil habitué).',
		observationPoint: 'Le contraste entre les galeries scintillantes du Palais-Royal et la détresse financière d’une baronne prisonnière de son régime matrimonial.',
		eventOrder: 6,
		narrativeStepTitle: '6. Le coup de roulette salvateur',
		narrativeStepExplanation: 'Delphine mandate Eugène pour jouer à la roulette au n° 9 du Palais-Royal. Grâce à son audace sur le numéro 21, il en rapporte sept mille francs et lie son sort à la baronne.',
		quotation: 'Risquez les cent francs à un jeu qu’on nomme la roulette, et perdez tout, ou rapportez-moi six mille francs. Je vous dirai mes chagrins à votre retour.',
		quotationReference: 'Le Père Goriot, deuxième partie (« L’Entrée dans le monde »)',
	},
	{
		id: 'hotel-de-nucingen',
		name: 'L’hôtel de Delphine et du baron de Nucingen',
		subtitle: 'Le palais de la haute banque et du faux luxe',
		category: 'bourgeoisie',
		coordinates: [48.8756, 2.3315],
		historicalCoordinates: {
			pixelOrig: [4050, 1370],
			pixel3200: [1327.9, 449.1],
			percent: [41.5, 18.32],
			leafletCoords: [2002.9, 1327.9],
		},
		locationPrecision: 'district',
		historicalAddress: 'Rue Saint-Lazare (numéro non précisé par Balzac)',
		modernLocation: 'Rue Saint-Lazare (secteur Trinité / Chaussée-d’Antin), 9e arrondissement',
		characters: ['Delphine de Nucingen', 'Baron de Nucingen', 'Eugène de Rastignac', 'Le père Goriot'],
		narrativeRole: 'Hôtel particulier des Nucingen où s’exercent le chantage financier du baron et les souffrances matérielles de Delphine.',
		literaryAnalysis: 'Balzac décrit une demeure aux colonnes minces et aux stucs prétentieux, symbole de l’architecture des banquiers de la Chaussée-d’Antin. Le baron y manipule les fonds de son épouse pour ses spéculations boursières, tandis que Goriot n’est toléré que par les dégagements.',
		observationPoint: 'La puissance destructrice de la spéculation financière moderne face aux liens familiaux.',
		eventOrder: 7,
		narrativeStepTitle: '7. L’hôtel de la finance rue Saint-Lazare',
		narrativeStepExplanation: 'Eugène découvre chez les Nucingen le quotidien d’une femme de banquier : le faste extérieur des stucs masque une spoliation de dot et un isolement total.',
		quotation: 'Rastignac arriva rue Saint-Lazare, dans une de ces maisons légères, à colonnes minces, à portiques mesquins, qui constituent le joli à Paris, une véritable maison de banquier, pleine de recherches coûteuses, des stucs, des paliers d’escalier en mosaïque de marbre.',
		quotationReference: 'Le Père Goriot, deuxième partie (« L’Entrée dans le monde »)',
	},
	{
		id: 'jardin-du-luxembourg',
		name: 'Le Jardin du Luxembourg',
		subtitle: 'L’asile des confidences et des cas de conscience',
		category: 'sociabilite',
		coordinates: [48.8462, 2.3371],
		historicalCoordinates: {
			pixelOrig: [4300, 5020],
			pixel3200: [1409.8, 1645.6],
			percent: [44.06, 67.11],
			leafletCoords: [806.4, 1409.8],
		},
		locationPrecision: 'approximate',
		historicalAddress: 'Jardin du Luxembourg (allées devant le palais ; emplacement romanesque indicatif)',
		modernLocation: 'Jardin du Luxembourg, 6e arrondissement',
		characters: ['Eugène de Rastignac', 'Horace Bianchon'],
		narrativeRole: 'Espace de promenade où Rastignac confie ses tourments intérieurs et ses tentations criminelles à Bianchon.',
		literaryAnalysis: 'En se promenant « devant le palais » du Luxembourg, Eugène expose à Bianchon le paradoxe moral du mandarin : faire mourir par pure volonté un vieux dignitaire en Chine pour hériter de sa fortune sans être découvert. Si le jardin et le palais sont des repères réels parfaits, le marqueur cartographique place un point représentatif dans les allées. Dans le roman, Rastignac attribue ce dilemme à Rousseau ; la critique littéraire a cependant montré que Rousseau n’en est pas l’auteur et que l’image provient en réalité du « Génie du christianisme » (1802) de Chateaubriand (« tuer un homme à la Chine »).',
		observationPoint: 'La tension entre l’éthique humaniste de la science défendue par Bianchon et le cynisme meurtrier proposé à Rastignac par Vautrin.',
		eventOrder: 8,
		narrativeStepTitle: '8. Le dilemme du mandarin au Luxembourg',
		narrativeStepExplanation: 'Ébranlé par les propositions criminelles de Vautrin, Eugène prend le bras de Bianchon devant le palais du Luxembourg et teste sur lui le fameux cas de conscience du mandarin.',
		quotation: '— Où as-tu pris cet air grave ? lui dit l’étudiant en médecine en lui prenant le bras pour se promener devant le palais. — Je suis tourmenté par de mauvaises idées. […] — Tu ris sans savoir ce dont il s’agit. As-tu lu Rousseau ? — Oui. — Te souviens-tu de ce passage où il demande à son lecteur ce qu’il ferait au cas où il pourrait s’enrichir en tuant à la Chine par sa seule volonté un vieux mandarin, sans bouger de Paris ?',
		quotationReference: 'Le Père Goriot, deuxième partie (« L’Entrée dans le monde »)',
	},
	{
		id: 'garconniere-rue-d-artois',
		name: 'La garçonnière de Rastignac (rue d’Artois / Laffitte)',
		subtitle: 'Le pied-à-terre meublé par le sacrifice ultime de Goriot',
		category: 'bourgeoisie',
		coordinates: [48.8745, 2.3388],
		historicalCoordinates: {
			pixelOrig: [4240, 1870],
			pixel3200: [1390.2, 613.0],
			percent: [43.44, 25.0],
			leafletCoords: [1839.0, 1390.2],
		},
		locationPrecision: 'approximate',
		historicalAddress: 'Rue d’Artois (actuelle rue Laffitte, appartement au 3e étage sur cour)',
		modernLocation: 'Rue Laffitte, 9e arrondissement',
		characters: ['Le père Goriot', 'Eugène de Rastignac', 'Delphine de Nucingen'],
		narrativeRole: 'Logement meublé par Goriot pour abriter les rendez-vous de Delphine et Rastignac, le vieillard prévoyant d’habiter la mansarde au-dessus.',
		literaryAnalysis: 'Cet appartement matérialise la paternité passionnée et sacrificielle de Goriot, qui vide ses dernières rentes pour créer ce cadre intime. Toponymiquement, l’ancienne rue d’Artois fut rebaptisée rue Laffitte en juillet 1830 : elle situe Eugène au cœur de la finance libérale montante.',
		observationPoint: 'L’illusion d’une liberté amoureuse achetée au prix de la ruine consentie et de l’effacement d’un père.',
		eventOrder: 9,
		narrativeStepTitle: '9. L’installation rue d’Artois',
		narrativeStepExplanation: 'Goriot et Delphine introduisent Eugène au 3e étage d’une maison neuve de la rue d’Artois. Goriot s’y réserve une chambre de bonne au-dessus, heureux de vivre en serviteur discret auprès d’eux.',
		quotation: '— Ah ! voilà ce que je voulais. Vous ne ferez pas attention à moi, n’est-ce pas ? J’irai, je viendrai comme un bon esprit qui est partout, et qu’on sait être là sans le voir. Eh bien ! Delphinette, Ninette, Dedel ! n’ai-je pas eu raison de te dire : « Il y a un joli appartement rue d’Artois, meublons-le pour lui ! » Tu ne voulais pas. Ah ! c’est moi qui suis l’auteur de ta joie, comme je suis l’auteur de tes jours.',
		quotationReference: 'Le Père Goriot, troisième partie (« Trompe-la-Mort »)',
	},
	{
		id: 'eglise-saint-etienne-du-mont',
		name: 'L’église Saint-Étienne-du-Mont',
		subtitle: 'L’office funèbre des indigents',
		category: 'denouement',
		coordinates: [48.8465, 2.3481],
		historicalCoordinates: {
			pixelOrig: [5240, 5130],
			pixel3200: [1718.0, 1681.7],
			percent: [53.69, 68.58],
			leafletCoords: [770.3, 1718.0],
		},
		locationPrecision: 'exact',
		historicalAddress: 'Paroisse de Saint-Étienne-du-Mont (place Sainte-Geneviève)',
		modernLocation: 'Place Sainte-Geneviève, 5e arrondissement',
		characters: ['Eugène de Rastignac', 'Christophe (garçon de peine)', 'Le père Goriot (défunt)'],
		narrativeRole: 'Paroisse de quartier où sont célébrées les obsèques réduites du père Goriot, en l’absence de ses deux filles.',
		literaryAnalysis: 'Balzac dépeint une cérémonie religieuse expédiée par un clergé mercenaire, payée soixante-dix francs empruntés par Rastignac. L’édifice paroissial est précisément identifié place Sainte-Geneviève ; seuls le jeune étudiant et un garçon de peine accompagnent la bière dans une chapelle basse et sombre.',
		observationPoint: 'La solitude absolue du mourant indigent face à la tarification du culte et à la défection des héritières.',
		eventOrder: 10,
		narrativeStepTitle: '10. L’office méprisé à Saint-Étienne-du-Mont',
		narrativeStepExplanation: 'Faute d’argent, le corps du vieillard n’a droit qu’aux vêpres expédiées pour soixante-dix francs. Seuls Eugène et Christophe veillent le cercueil dans l’église paroissiale.',
		quotation: 'Les deux prêtres, l’enfant de chœur et le bedeau vinrent et donnèrent tout ce qu’on peut avoir pour soixante-dix francs dans une époque où la religion n’est pas assez riche pour prier gratis.',
		quotationReference: 'Le Père Goriot, quatrième partie (« La Mort du père »)',
	},
	{
		id: 'cimetiere-pere-lachaise',
		name: 'Le cimetière du Père-Lachaise',
		subtitle: 'La tombe solitaire et le défi à la Société',
		category: 'denouement',
		coordinates: [48.8615, 2.394],
		historicalCoordinates: {
			pixelOrig: [8750, 3370],
			pixel3200: [2868.9, 1104.7],
			percent: [89.65, 45.05],
			leafletCoords: [1347.3, 2868.9],
		},
		locationPrecision: 'approximate',
		historicalAddress: 'Cimetière de l’Est (Père-Lachaise, secteur sommital vers le belvédère dominant Paris)',
		modernLocation: 'Cimetière du Père-Lachaise, 20e arrondissement',
		characters: ['Eugène de Rastignac', 'Le père Goriot (inhumé)'],
		narrativeRole: 'Point culminant du roman : Rastignac ensevelit ses dernières illusions d’enfant provincial et lance son défi historique à Paris.',
		literaryAnalysis: 'Balzac situe l’ultime scène dans le cimetière de l’Est (ouvert en 1804). Après la mise en terre de Goriot dans une fosse payée grâce à une concession temporaire, Eugène fait quelques pas « vers le haut du cimetière » d’où la vue embrasse la capitale entre la colonne Vendôme et les Invalides. Le cimetière est un lieu réel certain, mais le point précis de la fosse et du regard reste une localisation représentative sur cette hauteur.',
		observationPoint: 'La vision panoramique de Paris comme ruche et champ de bataille : la topographie urbaine devient la métaphore de la lutte des classes.',
		eventOrder: 11,
		narrativeStepTitle: '11. L’apothéose finale au Père-Lachaise',
		narrativeStepExplanation: 'Après l’inhumation, les voitures de parade vides s’éloignent. Seul sur les hauteurs du cimetière, Rastignac contemple la ruche bourdonnante et prononce son cri historique : « À nous deux maintenant ! »',
		quotation: 'Rastignac, resté seul, fit quelques pas vers le haut du cimetière et vit Paris tortueusement couché le long des deux rives de la Seine où commençaient à briller les lumières. Ses yeux s’attachèrent presque avidement entre la colonne de la place Vendôme et le dôme des Invalides, là où vivait ce beau monde dans lequel il avait voulu pénétrer. Il lança sur cette ruche bourdonnante un regard qui semblait par avance en pomper le miel, et dit ces mots grandioses : — À nous deux maintenant !',
		quotationReference: 'Le Père Goriot, excipit (conclusion)',
	},
];

export const precisionLabels: Record<LocationPrecision, { label: string; description: string }> = {
	exact: {
		label: 'Édifice historique ou adresse textuelle identifiée',
		description: 'Le bâtiment public ou l’adresse est attesté historiquement ou désigné avec un repère précis dans le roman.',
	},
	approximate: {
		label: 'Position indicative reconstituée',
		description: 'La rue est attestée dans le roman ; le point cartographique correspond à une tradition documentaire ou à un secteur présumé sans certitude absolue.',
	},
	district: {
		label: 'Secteur de quartier ou rue sans numéro',
		description: 'Balzac nomme la rue ou le faubourg sans fixer de numéro d’immeuble ; le marqueur situe le secteur général.',
	},
};
