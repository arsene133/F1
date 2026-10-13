// ==========================================================================
// Types fondamentaux pour le moteur de théorie des graphes
// Indépendants de tout moteur de rendu graphique (SVG, CSS, Astro, canvas).
// ==========================================================================

/**
 * Catégorie ontologique d'un sommet dans une œuvre littéraire ou critique.
 */
export type NodeCategory =
	| 'individual'          // Personnage individuel agissant
	| 'collective'          // Entité ou groupe de personnages (paysans, soldats, choeur)
	| 'symbolic_object'     // Objet narratif ou symbolique (Graal, lance, relique)
	| 'deceased_memory'     // Figure défunte évoquée (père et frères)
	| 'historical_concept'; // Figure historique extra-diégétique ou concept (Marx, Société)

/**
 * Statut épistémologique ou degré de certitude de la relation.
 */
export type EpistemicCertainty =
	| 'textual_fact'         // Fait narratif explicite attesté dans le texte
	| 'grounded_inference'   // Déduction solide ou fait historique/critique consensuel
	| 'critical_reading'     // Interprétation critique ouverte
	| 'pedagogical_summary'; // Simplification didactique pour l'enseignement

/**
 * Sommet abstrait du graphe littéraire.
 */
export interface GraphNode {
	id: string;
	label: string;
	category: NodeCategory;
	description?: string;
	meta?: Record<string, unknown>;
}

/**
 * Relation typée conservant l'orientation et la nature littéraire du lien.
 */
export interface GraphEdge {
	id: string;
	source: string;
	target: string;
	nature: string;
	directed: boolean; // true si l'action va de source vers target ; false si symétrique/réciproque
	label?: string;
	description?: string;
	certainty?: EpistemicCertainty;
	meta?: Record<string, unknown>;
}

/**
 * Paire non orientée de sommets distincts.
 */
export interface UndirectedPair {
	u: string;
	v: string;
	edgeIds: string[];
	natures: string[];
}

/**
 * Graphe simple non orienté (au plus une arête entre deux sommets distincts, sans boucle).
 */
export interface SimpleGraph {
	nodes: Set<string>;
	adjacency: Map<string, Set<string>>;
}

/**
 * Digraphe orienté (conserve les flèches u -> v).
 */
export interface DirectedGraph {
	nodes: Set<string>;
	outNeighbors: Map<string, Set<string>>;
	inNeighbors: Map<string, Set<string>>;
}

/**
 * Filtre de sélection ontologique pour les calculs.
 */
export interface NodeFilter {
	includeCategories?: NodeCategory[];
	excludeCategories?: NodeCategory[];
}

/**
 * Centralités d'un sommet.
 */
export interface NodeCentrality {
	degree: number; // degré dans le graphe simple non orienté
	inDegree?: number; // degré entrant dans le digraphe
	outDegree?: number; // degré sortant dans le digraphe
	betweenness: number; // intermédiarité de Brandes (brute)
	betweennessNormalized: number; // intermédiarité normalisée dans [0, 1]
	harmonicCloseness: number; // proximité harmonique normalisée dans [0, 1]
}

/**
 * Rapport complet des métriques calculées pour un graphe.
 */
export interface NetworkMetricsReport {
	// Structure générale
	nodeCount: number; // |V|
	typedEdgeCount: number; // nombre total de relations typées admises
	connectedPairCount: number; // nombre de paires distinctes reliées (arêtes du graphe simple)
	averageDegree: number; // 2 * connectedPairCount / nodeCount (ou 0 si nodeCount == 0)
	density: number; // 2 * connectedPairCount / (nodeCount * (nodeCount - 1)) (ou 0 si nodeCount < 2)

	// Composantes connexes et distances
	connectedComponents: string[][];
	connectedComponentCount: number;
	isolatedNodes: string[];
	diameterByComponent: Array<{
		componentIndex: number;
		size: number;
		diameter: number;
	}>;
	globalDiameter: number | null; // diamètre si le graphe est connexe (|V| >= 1), null sinon

	// Propriétés structurales
	articulationPoints: string[];
	bridges: Array<[string, string]>;

	// Métriques par sommet
	nodes: Record<string, NodeCentrality>;

	// Métadonnées du calcul
	filterApplied: {
		includedCategories: NodeCategory[];
		excludedCategories: NodeCategory[];
		excludedNodeIds: string[];
	};
}
