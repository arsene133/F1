// ==========================================================================
// Moteur de caractérisation structurelle des réseaux de personnages
// Fonctions pures, typées, sans dépendance externe.
// ==========================================================================

import { buildSimpleGraph, findConnectedComponents, getConnectedPairs } from './metrics';
import type {
	CorePeripheryAnalysis,
	CycleAnalysis,
	DegreeDistributionStats,
	DescriptiveStructuralProfile,
	ExactTopologicalShape,
	NetworkStructureReport,
} from './structure-types';
import type { GraphEdge, GraphNode, NodeFilter, SimpleGraph } from './types';

/**
 * Calcule les statistiques de distribution des degrés sur un graphe simple.
 */
export function computeDegreeDistributionStats(graph: SimpleGraph): DegreeDistributionStats {
	const n = graph.nodes.size;
	if (n === 0) {
		return {
			min: 0,
			max: 0,
			mean: 0,
			median: 0,
			histogram: {},
			degreeOneRatio: 0,
			maxDegreeRatio: 0,
		};
	}

	const degrees: number[] = [];
	const histogram: Record<number, number> = {};

	for (const u of graph.nodes) {
		const deg = graph.adjacency.get(u)?.size ?? 0;
		degrees.push(deg);
		histogram[deg] = (histogram[deg] ?? 0) + 1;
	}

	degrees.sort((a, b) => a - b);

	const min = degrees[0];
	const max = degrees[degrees.length - 1];
	const sum = degrees.reduce((acc, val) => acc + val, 0);
	const mean = sum / n;

	const mid = Math.floor(n / 2);
	const median = n % 2 !== 0 ? degrees[mid] : (degrees[mid - 1] + degrees[mid]) / 2;

	const degreeOneCount = histogram[1] ?? 0;
	const degreeOneRatio = degreeOneCount / n;
	const maxDegreeRatio = n >= 2 ? max / (n - 1) : 0;

	return {
		min,
		max,
		mean,
		median,
		histogram,
		degreeOneRatio,
		maxDegreeRatio,
	};
}

/**
 * Calcule l'indice de centralisation de degré de Freeman :
 * C_D = sum(max_d - d(v)) / ((V - 1) * (V - 2)) pour V >= 3.
 * Vaut 1 pour une étoile pure, 0 pour un graphe régulier ou complet.
 */
export function computeFreemanDegreeCentralization(graph: SimpleGraph, maxDegree: number): number {
	const n = graph.nodes.size;
	if (n < 3) return 0;

	let diffSum = 0;
	for (const u of graph.nodes) {
		const deg = graph.adjacency.get(u)?.size ?? 0;
		diffSum += maxDegree - deg;
	}

	const maxPossibleDiffSum = (n - 1) * (n - 2);
	return diffSum / maxPossibleDiffSum;
}

/**
 * Analyse la présence de cycles et la bipartite (2-coloriabilité) via BFS.
 */
export function analyzeCyclesAndBipartite(graph: SimpleGraph, components: string[][]): CycleAnalysis {
	const n = graph.nodes.size;
	if (n === 0) {
		return {
			hasCycles: false,
			cycleCountEstimate: 0,
			isBipartite: true,
			bipartitePartitions: [[], []],
		};
	}

	// 1. Nombre cyclomatique = E - V + k
	let edgeCount = 0;
	for (const [, neighbors] of graph.adjacency) {
		edgeCount += neighbors.size;
	}
	edgeCount = edgeCount / 2;

	const cyclomaticNumber = edgeCount - n + components.length;
	const hasCycles = cyclomaticNumber > 0;

	// 2. Test de 2-coloriabilité (bipartisme)
	const color = new Map<string, 0 | 1>();
	let isBipartite = true;
	const part0: string[] = [];
	const part1: string[] = [];

	for (const component of components) {
		if (!isBipartite) break;
		const startNode = component[0];
		color.set(startNode, 0);
		part0.push(startNode);
		const queue = [startNode];

		while (queue.length > 0) {
			const u = queue.shift()!;
			const uColor = color.get(u)!;
			const nextColor = (1 - uColor) as 0 | 1;

			const neighbors = graph.adjacency.get(u);
			if (neighbors) {
				for (const v of neighbors) {
					if (!color.has(v)) {
						color.set(v, nextColor);
						if (nextColor === 0) part0.push(v);
						else part1.push(v);
						queue.push(v);
					} else if (color.get(v) === uColor) {
						// Conflit de couleur => cycle impair détecté => non biparti
						isBipartite = false;
						break;
					}
				}
			}
			if (!isBipartite) break;
		}
	}

	return {
		hasCycles,
		cycleCountEstimate: Math.max(0, cyclomaticNumber),
		isBipartite,
		bipartitePartitions: isBipartite ? [part0.sort(), part1.sort()] : undefined,
	};
}

/**
 * Détecte les formes topologiques exactes d'un graphe simple.
 */
export function detectExactTopologicalShapes(
	graph: SimpleGraph,
	components: string[][],
	degStats: DegreeDistributionStats,
	cycleAnalysis: CycleAnalysis
): ExactTopologicalShape[] {
	const shapes: ExactTopologicalShape[] = [];
	const n = graph.nodes.size;

	// Graphe vide
	if (n === 0) {
		shapes.push('empty');
		return shapes;
	}

	// Sommet unique isolé
	if (n === 1) {
		shapes.push('isolated_single_node', 'tree', 'forest', 'bipartite', 'chain', 'regular', 'complete');
		return shapes;
	}

	let edgeCount = 0;
	for (const [, neighbors] of graph.adjacency) {
		edgeCount += neighbors.size;
	}
	edgeCount = edgeCount / 2;

	const isConnected = components.length === 1;

	// Réseau sans arêtes
	if (edgeCount === 0) {
		shapes.push('edgeless', 'forest', 'bipartite', 'regular');
		return shapes;
	}

	// Graphe complet : E = V * (V - 1) / 2
	if (edgeCount === (n * (n - 1)) / 2) {
		shapes.push('complete');
	}

	// Graphe régulier : tous les sommets ont le même degré
	if (degStats.min === degStats.max) {
		shapes.push('regular');
	}

	// Forêt : aucun cycle
	if (!cycleAnalysis.hasCycles) {
		shapes.push('forest');
		if (isConnected) {
			shapes.push('tree');
		}
	}

	// Étoile stricte : V >= 4, connexe, 1 centre de degré V - 1, V - 1 feuilles de degré 1
	// (Pour V=1, 2, 3 les étoiles sont aussi chaînes/complets, mais on les inclut si le motif est exact)
	if (isConnected && degStats.max === n - 1 && (degStats.histogram[1] ?? 0) === n - 1 && n >= 2) {
		shapes.push('star');
	}

	// Chaîne (Path graph P_n) : connexe, 2 sommets de degré 1, n - 2 sommets de degré 2 (pour n >= 2)
	if (isConnected) {
		if (n === 2 && edgeCount === 1) {
			shapes.push('chain');
		} else if (n >= 3 && degStats.histogram[1] === 2 && degStats.histogram[2] === n - 2) {
			shapes.push('chain');
		}
	}

	// Cycle (Cycle graph C_n) : connexe, n >= 3, tous les sommets de degré 2
	if (isConnected && n >= 3 && degStats.min === 2 && degStats.max === 2) {
		shapes.push('cycle');
	}

	// Graphe biparti
	if (cycleAnalysis.isBipartite) {
		shapes.push('bipartite');

		// Biparti complet K_{p, q} : connexe, biparti, p*q = E
		if (isConnected && cycleAnalysis.bipartitePartitions) {
			const [pPart, qPart] = cycleAnalysis.bipartitePartitions;
			if (pPart.length > 0 && qPart.length > 0 && edgeCount === pPart.length * qPart.length) {
				shapes.push('complete_bipartite');
			}
		}
	}

	return shapes;
}

/**
 * Détection heuristique d'un profil noyau-périphérie.
 * Un noyau est identifié si un sous-ensemble de sommets (au moins 2) possède des degrés nettement supérieurs
 * et une densité interne forte (>= 0.6), tandis que la périphérie est de faible degré.
 */
export function detectCorePeriphery(
	graph: SimpleGraph,
	degStats: DegreeDistributionStats
): CorePeripheryAnalysis {
	const n = graph.nodes.size;
	if (n < 4) {
		return {
			detected: false,
			coreNodes: [],
			peripheryNodes: [],
			coreDensity: 0,
			peripheryDensity: 0,
		};
	}

	// Tri des sommets par degré décroissant
	const sortedNodes = Array.from(graph.nodes).sort((a, b) => {
		const da = graph.adjacency.get(a)?.size ?? 0;
		const db = graph.adjacency.get(b)?.size ?? 0;
		return db - da;
	});

	// Seuil de degré pour appartenir au noyau : au-dessus de la moyenne + écart significatif
	const coreCandidates = sortedNodes.filter((u) => {
		const deg = graph.adjacency.get(u)?.size ?? 0;
		return deg >= degStats.mean && deg >= 2;
	});

	if (coreCandidates.length < 2 || coreCandidates.length > n * 0.6) {
		return {
			detected: false,
			coreNodes: [],
			peripheryNodes: [],
			coreDensity: 0,
			peripheryDensity: 0,
		};
	}

	const coreSet = new Set(coreCandidates);
	const peripheryNodes = sortedNodes.filter((u) => !coreSet.has(u));

	// Calcul de la densité interne du noyau
	let coreEdges = 0;
	for (const u of coreCandidates) {
		const neighbors = graph.adjacency.get(u);
		if (neighbors) {
			for (const v of neighbors) {
				if (coreSet.has(v)) coreEdges++;
			}
		}
	}
	coreEdges = coreEdges / 2;

	const coreSize = coreCandidates.length;
	const maxCoreEdges = (coreSize * (coreSize - 1)) / 2;
	const coreDensity = maxCoreEdges > 0 ? coreEdges / maxCoreEdges : 0;

	// Pour être un noyau au sens sociologique : densité interne forte (>= 0.6)
	// et périphérie clairsemée
	const detected = coreDensity >= 0.6 && peripheryNodes.length >= 2;

	return {
		detected,
		coreNodes: detected ? coreCandidates : [],
		peripheryNodes: detected ? peripheryNodes : [],
		coreDensity,
		peripheryDensity: 0,
	};
}

/**
 * Détecte les profils structurels descriptifs (heuristiques) d'un réseau.
 */
export function detectDescriptiveProfiles(
	graph: SimpleGraph,
	components: string[][],
	degStats: DegreeDistributionStats,
	freemanDegCentralization: number,
	exactShapes: ExactTopologicalShape[],
	corePeriphery: CorePeripheryAnalysis,
	density: number
): DescriptiveStructuralProfile[] {
	const profiles: DescriptiveStructuralProfile[] = [];
	const n = graph.nodes.size;

	if (n === 0) return profiles;

	// 1. Réseau fragmenté
	if (components.length > 1) {
		profiles.push('fragmented');
	}

	// 2. Très centralisé
	if (freemanDegCentralization >= 0.5 || exactShapes.includes('star')) {
		profiles.push('highly_centralized');
	}

	// 3. Centré sur un personnage (single_hub_dominated) :
	// Un sommet a un degré supérieur à au moins 70 % des sommets et dépasse nettement le second degré
	if (n >= 3) {
		const sortedDegs = Array.from(graph.nodes)
			.map((u) => graph.adjacency.get(u)?.size ?? 0)
			.sort((a, b) => b - a);

		const maxDeg = sortedDegs[0];
		const secondDeg = sortedDegs[1] ?? 0;

		// Si maxDeg touche au moins 70% de V-1 et a au moins 2 connexions de plus que le second
		if (maxDeg >= (n - 1) * 0.7 && maxDeg >= secondDeg + 2) {
			profiles.push('single_hub_dominated');
		}
	}

	// 4. Noyau-périphérie
	if (corePeriphery.detected) {
		profiles.push('core_periphery');
	}

	// 5. Arbre ramifié
	if (exactShapes.includes('tree') && !exactShapes.includes('star') && !exactShapes.includes('chain')) {
		profiles.push('branched_tree');
	}

	// 6. Réseau distribué : absence de hub dominant, faible centralisation (< 0.3), pas d'étoile
	if (
		n >= 4 &&
		components.length === 1 &&
		freemanDegCentralization < 0.3 &&
		!profiles.includes('single_hub_dominated')
	) {
		profiles.push('distributed');
	}

	// 7. Densité : dense (>= 0.5) vs clairsemé (< 0.25)
	if (n >= 3) {
		if (density >= 0.5) {
			profiles.push('dense');
		} else if (density < 0.25) {
			profiles.push('sparse');
		}
	}

	return profiles;
}

/**
 * Construit une synthèse didactique et pédagogique adaptée aux élèves de collège et lycée.
 */
export function buildPedagogicalSynthesis(
	exactShapes: ExactTopologicalShape[],
	descriptiveProfiles: DescriptiveStructuralProfile[],
	dominantNodeId: string | null,
	nodeCount: number
): {
	shapeTitle: string;
	description: string;
	literaryQuestion: string;
	pedagogicalAdvice: string;
	criticalLimitation: string;
} {
	if (nodeCount <= 1) {
		return {
			shapeTitle: 'Personnage isolé ou scène vide',
			description: 'Le réseau ne comporte qu’un seul personnage ou aucune interaction.',
			literaryQuestion: 'Ce personnage est-il dans un monologue intérieur ou en marge du monde ?',
			pedagogicalAdvice: 'Observer si cette solitude ouvre ou clôt le récit.',
			criticalLimitation: 'Les outils de réseaux ne mesurent pas la vie intérieure du personnage.',
		};
	}

	if (exactShapes.includes('star')) {
		return {
			shapeTitle: 'Réseau en étoile stricte',
			description: `Tout le réseau gravite autour d'un personnage central unique (${dominantNodeId ?? 'le centre'}), sans aucun échange direct entre les autres.`,
			literaryQuestion: 'Pourquoi les personnages secondaires ne se parlent-ils jamais entre eux ?',
			pedagogicalAdvice: 'Ce schéma est typique d’un parcours initiatique individuel ou d’un maître absolu.',
			criticalLimitation: 'Ce modèle reflète souvent un choix didactique d’enseignement centré sur le héros plutôt que l’ensemble du roman.',
		};
	}

	if (descriptiveProfiles.includes('single_hub_dominated')) {
		return {
			shapeTitle: 'Réseau fortement centré (étoile avec ramifications)',
			description: `Le réseau est largement dominé par ${dominantNodeId ?? 'un personnage phare'}, mais quelques liens secondaires existent entre certains personnages.`,
			literaryQuestion: 'Les relations entre personnages secondaires complotent-elles contre le héros ou l’aident-elles ?',
			pedagogicalAdvice: 'Identifier les triangles fermés pour voir quels personnages forment une alliance locale.',
			criticalLimitation: 'La centralité du héros sur la carte n’empêche pas des intrigues parallèles d’exister dans le texte.',
		};
	}

	if (exactShapes.includes('cycle')) {
		return {
			shapeTitle: 'Réseau en boucle (cycle fermé)',
			description: 'Chaque figure est reliée à exactement deux autres pour former un cercle continu.',
			literaryQuestion: 'L’action tourne-t-elle en rond ou s’agit-il d’un enchaînement d’influences mutuelles ?',
			pedagogicalAdvice: 'Parfait pour modéliser une chaîne causale ou un dialogue d’idées contrastées.',
			criticalLimitation: 'Une boucle fermée peut être un schéma théorique de commentaire plutôt qu’une pièce de théâtre.',
		};
	}

	if (exactShapes.includes('chain')) {
		return {
			shapeTitle: 'Réseau en chaîne (parcours linéaire)',
			description: 'Les personnages se rencontrent à la file indienne, d’une extrémité à l’autre.',
			literaryQuestion: 'S’agit-il d’un voyage étape par étape ou d’une transmission d’objet/lettre ?',
			pedagogicalAdvice: 'Suivre la chronologie du récit pour voir si le voyageur avance le long de cette chaîne.',
			criticalLimitation: 'Une chaîne écrase les retours en arrière et les rencontres simultanées.',
		};
	}

	if (descriptiveProfiles.includes('core_periphery')) {
		return {
			shapeTitle: 'Réseau à noyau et périphérie (monde clos et satellites)',
			description: 'Un groupe central de personnages est très soudé, tandis que d’autres personnages restent en marge.',
			literaryQuestion: 'Qui fait partie du salon fermé ou de la famille, et qui frappe à la porte de l’extérieur ?',
			pedagogicalAdvice: 'Opposer la sociabilité intense du noyau à l’isolement des témoins périphériques.',
			criticalLimitation: 'La position périphérique peut refléter un rôle d’observateur moral capital pour le lecteur.',
		};
	}

	if (descriptiveProfiles.includes('fragmented')) {
		return {
			shapeTitle: 'Réseau fragmenté (mondes séparés)',
			description: 'Le réseau est divisé en plusieurs groupes hermétiques qui ne communiquent pas entre eux.',
			literaryQuestion: 'Qu’est-ce qui empêche ces groupes de se rencontrer (barrière sociale, distance, intrigue double) ?',
			pedagogicalAdvice: 'Chercher si un personnage messager finira par créer un pont entre ces mondes.',
			criticalLimitation: 'Une coupure dans le graphe peut être provisoire avant le dénouement de la pièce.',
		};
	}

	return {
		shapeTitle: 'Réseau distribué et interconnecté',
		description: 'Les relations sont réparties entre de multiples personnages sans domination exclusive.',
		literaryQuestion: 'Comment le pouvoir et la parole circulent-ils au sein du groupe ?',
		pedagogicalAdvice: 'Observer les différents sous-groupes et rivalités équilibrées.',
		criticalLimitation: 'Un réseau équilibré graphiquement n’implique pas une égalité sociale entre les personnages.',
	};
}

/**
 * Analyse structurelle complète d'un réseau de personnages.
 */
export function analyzeNetworkStructure(
	rawNodes: GraphNode[],
	rawEdges: GraphEdge[],
	filter?: NodeFilter
): NetworkStructureReport {
	// 1. Filtrage ontologique
	const eligibleNodes = rawNodes.filter((n) => {
		if (filter?.includeCategories && !filter.includeCategories.includes(n.category)) return false;
		if (filter?.excludeCategories && filter.excludeCategories.includes(n.category)) return false;
		return true;
	});

	const eligibleNodeIds = new Set(eligibleNodes.map((n) => n.id));
	const allNodeIds = new Set(rawNodes.map((n) => n.id));
	const excludedNodeIds = Array.from(allNodeIds).filter((id) => !eligibleNodeIds.has(id)).sort();

	const eligibleEdges = rawEdges.filter((e) => eligibleNodeIds.has(e.source) && eligibleNodeIds.has(e.target));

	// 2. Modèle simple
	const simpleGraph = buildSimpleGraph(eligibleNodeIds, eligibleEdges);
	const connectedPairs = getConnectedPairs(eligibleNodeIds, eligibleEdges);
	const components = findConnectedComponents(simpleGraph);

	const nodeCount = simpleGraph.nodes.size;
	const pairCount = connectedPairs.length;
	const density = nodeCount >= 2 ? (2 * pairCount) / (nodeCount * (nodeCount - 1)) : 0;

	// 3. Distribution des degrés et Freeman
	const degStats = computeDegreeDistributionStats(simpleGraph);
	const freemanDegreeCentralization = computeFreemanDegreeCentralization(simpleGraph, degStats.max);

	// 4. Cycles et formes exactes
	const cycleAnalysis = analyzeCyclesAndBipartite(simpleGraph, components);
	const exactShapes = detectExactTopologicalShapes(simpleGraph, components, degStats, cycleAnalysis);

	// 5. Noyau-périphérie et profils descriptifs
	const corePeriphery = detectCorePeriphery(simpleGraph, degStats);
	const descriptiveProfiles = detectDescriptiveProfiles(
		simpleGraph,
		components,
		degStats,
		freemanDegreeCentralization,
		exactShapes,
		corePeriphery,
		density
	);

	// 6. Rôles structuraux
	// Sommet dominant : celui ayant le degré maximal s'il dépasse nettement
	let dominantNodeId: string | null = null;
	const sortedNodes = Array.from(simpleGraph.nodes).sort((a, b) => {
		const da = simpleGraph.adjacency.get(a)?.size ?? 0;
		const db = simpleGraph.adjacency.get(b)?.size ?? 0;
		return db - da;
	});

	if (sortedNodes.length > 0 && degStats.max > 0) {
		const top = sortedNodes[0];
		dominantNodeId = top;
	}

	const dominantHubs = sortedNodes.filter((u) => {
		const d = simpleGraph.adjacency.get(u)?.size ?? 0;
		return d === degStats.max && d >= 2;
	});

	const leaves = sortedNodes.filter((u) => (simpleGraph.adjacency.get(u)?.size ?? 0) === 1);
	const isolated = sortedNodes.filter((u) => (simpleGraph.adjacency.get(u)?.size ?? 0) === 0);

	// 7. Synthèse pédagogique
	const pedagogicalSynthesis = buildPedagogicalSynthesis(
		exactShapes,
		descriptiveProfiles,
		dominantNodeId,
		nodeCount
	);

	return {
		analyzedNodes: sortedNodes,
		analyzedNodeCount: nodeCount,
		analyzedEdgeCount: eligibleEdges.length,
		connectedPairCount: pairCount,
		filterApplied: {
			includedCategories: filter?.includeCategories ?? [],
			excludedCategories: filter?.excludeCategories ?? [],
			excludedNodeIds,
		},
		exactShapes,
		descriptiveProfiles,
		metrics: {
			degrees: degStats,
			centralization: {
				degreeCentralization: freemanDegreeCentralization,
				betweennessCentralization: 0,
			},
			cycles: cycleAnalysis,
			corePeriphery,
			connectedComponentCount: components.length,
			componentSizes: components.map((c) => c.length),
			isolatedNodeCount: isolated.length,
			density,
			articulationPointCount: 0,
			bridgeCount: 0,
			dominantNodeId,
		},
		roles: {
			dominantHubs,
			bridgeNodes: [],
			leaves,
			isolated,
		},
		pedagogicalSynthesis,
	};
}
