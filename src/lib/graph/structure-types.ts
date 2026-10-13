// ==========================================================================
// Types pour la caractérisation et classification structurelle des réseaux
// ==========================================================================

import type { NodeCategory } from './types';

/**
 * Formes topologiques exactes (critères mathématiques stricts nécessaires et suffisants).
 */
export type ExactTopologicalShape =
	| 'empty'                  // V = 0
	| 'isolated_single_node'   // V = 1, E = 0
	| 'edgeless'               // V >= 2, E = 0 (tous isolés)
	| 'complete'               // V >= 1, E = V*(V-1)/2
	| 'star'                   // V >= 4, connexe, arbre, 1 centre de degré V-1, autres feuilles deg 1 (pour V=1..3 subsumé)
	| 'chain'                  // connexe, V sommets ordonnables en chaîne (V>=1; V=1: deg 0; V=2: deux deg 1; V>=3: deux deg 1 et V-2 deg 2)
	| 'cycle'                  // connexe, V >= 3, tous les sommets de degré 2
	| 'tree'                   // connexe, sans cycle (E = V - 1, V >= 1)
	| 'forest'                 // sans cycle, composantes >= 1 (E = V - k, V >= 1)
	| 'bipartite'              // 2-coloriable (aucun cycle impair, V >= 1)
	| 'complete_bipartite'     // biparti connexe avec partitions V1, V2 et E = |V1| * |V2|
	| 'regular';               // tous les sommets ont le même degré k (V >= 1)

/**
 * Profils structurels descriptifs (règles heuristiques et typologies sociologiques/littéraires).
 */
export type DescriptiveStructuralProfile =
	| 'highly_centralized'     // Centralisation globale forte (Freeman degree > 0.5 ou star-like)
	| 'single_hub_dominated'   // Un seul sommet domine nettement le réseau par son degré ou son intermédiarité
	| 'core_periphery'         // Noyau densement interconnecté + périphérie de faible degré
	| 'distributed'            // Réseau étalé, décentralisé sans sommet hégémonique
	| 'fragmented'             // Réseau éclaté en plusieurs composantes connexes disjointes
	| 'branched_tree'          // Arbre ramifié (non réduit à une simple étoile ni à une simple chaîne)
	| 'dense'                  // Densité >= 0.5 (configurable)
	| 'sparse';                // Densité < 0.25 (configurable)

/**
 * Statistiques de distribution des degrés.
 */
export interface DegreeDistributionStats {
	min: number;
	max: number;
	mean: number;
	median: number;
	histogram: Record<number, number>; // degré -> nombre de sommets
	degreeOneRatio: number;            // proportion de feuilles (deg = 1)
	maxDegreeRatio: number;            // max / (V - 1) (pour V >= 2)
}

/**
 * Métriques de centralisation globale du réseau (indice de Freeman).
 */
export interface CentralizationStats {
	/**
	 * Indice de centralisation de degré de Freeman :
	 * C_D = sum(max_d - d(v)) / ((V - 1) * (V - 2)) pour V >= 3.
	 * Vaut 1 pour une étoile pure, 0 pour un graphe régulier ou complet.
	 */
	degreeCentralization: number;

	/**
	 * Indice de centralisation d'intermédiarité de Freeman :
	 * C_B_net = sum(max_b - b(v)) / (V - 1) sur intermédiarités normalisées dans [0, 1].
	 */
	betweennessCentralization: number;
}

/**
 * Analyse détaillée des cycles dans le graphe simple.
 */
export interface CycleAnalysis {
	hasCycles: boolean;
	cycleCountEstimate: number; // nombre cyclomatique E - V + k (nombre de cycles indépendants)
	isBipartite: boolean;       // vrai ssi aucun cycle impair
	bipartitePartitions?: [string[], string[]];
}

/**
 * Profil noyau-périphérie détecté.
 */
export interface CorePeripheryAnalysis {
	detected: boolean;
	coreNodes: string[];
	peripheryNodes: string[];
	coreDensity: number;
	peripheryDensity: number;
}

/**
 * Rapport complet de structure du réseau.
 */
export interface NetworkStructureReport {
	// 1. Identifiants et effectifs
	analyzedNodes: string[];
	analyzedNodeCount: number;
	analyzedEdgeCount: number;
	connectedPairCount: number;

	// 2. Filtres appliqués
	filterApplied: {
		includedCategories: NodeCategory[];
		excludedCategories: NodeCategory[];
		excludedNodeIds: string[];
	};

	// 3. Propriétés topologiques exactes
	exactShapes: ExactTopologicalShape[];

	// 4. Profils descriptifs (heuristiques)
	descriptiveProfiles: DescriptiveStructuralProfile[];

	// 5. Métriques justificatives détaillées
	metrics: {
		degrees: DegreeDistributionStats;
		centralization: CentralizationStats;
		cycles: CycleAnalysis;
		corePeriphery: CorePeripheryAnalysis;
		connectedComponentCount: number;
		componentSizes: number[];
		isolatedNodeCount: number;
		density: number;
		articulationPointCount: number;
		bridgeCount: number;
		dominantNodeId: string | null;
	};

	// 6. Rôles structuraux identifiés
	roles: {
		dominantHubs: string[];
		bridgeNodes: string[];
		leaves: string[];
		isolated: string[];
	};

	// 7. Restitution didactique et pédagogique
	pedagogicalSynthesis: {
		shapeTitle: string;
		description: string;
		literaryQuestion: string;
		pedagogicalAdvice: string;
		criticalLimitation: string;
	};
}
