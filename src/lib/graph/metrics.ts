import type {
	DirectedGraph,
	GraphEdge,
	GraphNode,
	NetworkMetricsReport,
	NodeCategory,
	NodeCentrality,
	NodeFilter,
	SimpleGraph,
	UndirectedPair,
} from './types';

// ==========================================================================
// Moteur de calcul de théorie des graphes pour réseaux littéraires
// Fonctions pures, typées et sans dépendance externe.
// ==========================================================================

/**
 * Filtre les nœuds selon les critères ontologiques demandés.
 */
export function filterNodes(nodes: GraphNode[], filter?: NodeFilter): GraphNode[] {
	if (!filter) return [...nodes];

	const { includeCategories, excludeCategories } = filter;

	return nodes.filter((n) => {
		if (includeCategories && includeCategories.length > 0) {
			if (!includeCategories.includes(n.category)) return false;
		}
		if (excludeCategories && excludeCategories.length > 0) {
			if (excludeCategories.includes(n.category)) return false;
		}
		return true;
	});
}

/**
 * Filtre les arêtes pour ne retenir que celles reliant deux sommets autorisés.
 */
export function filterEdgesForNodes(edges: GraphEdge[], validNodeIds: Set<string>): GraphEdge[] {
	return edges.filter((e) => validNodeIds.has(e.source) && validNodeIds.has(e.target));
}

/**
 * Construit un graphe simple non orienté à partir des nœuds et des arêtes.
 * - Ignore les boucles éventuelles (u === v).
 * - Fusionne les multiarêtes : deux nœuds reliés par plusieurs relations ne comptent qu'une seule fois.
 * - Inclut tous les sommets admissibles, y compris les sommets isolés.
 */
export function buildSimpleGraph(nodeIds: Iterable<string>, edges: GraphEdge[]): SimpleGraph {
	const nodes = new Set<string>(nodeIds);
	const adjacency = new Map<string, Set<string>>();

	for (const id of nodes) {
		adjacency.set(id, new Set<string>());
	}

	for (const edge of edges) {
		const { source, target } = edge;
		if (source === target) continue; // pas de boucle dans le graphe simple
		if (!nodes.has(source) || !nodes.has(target)) continue;

		adjacency.get(source)!.add(target);
		adjacency.get(target)!.add(source);
	}

	return { nodes, adjacency };
}

/**
 * Répertorie toutes les paires distinctes {u, v} reliées dans le graphe simple,
 * avec la liste des relations typées qui les unissent.
 */
export function getConnectedPairs(nodeIds: Iterable<string>, edges: GraphEdge[]): UndirectedPair[] {
	const validNodes = new Set(nodeIds);
	const pairMap = new Map<string, { u: string; v: string; edgeIds: string[]; natures: string[] }>();

	for (const edge of edges) {
		const { source, target, id, nature } = edge;
		if (source === target) continue;
		if (!validNodes.has(source) || !validNodes.has(target)) continue;

		const [u, v] = source < target ? [source, target] : [target, source];
		const key = `${u}:::${v}`;

		let entry = pairMap.get(key);
		if (!entry) {
			entry = { u, v, edgeIds: [], natures: [] };
			pairMap.set(key, entry);
		}
		entry.edgeIds.push(id);
		entry.natures.push(nature);
	}

	return Array.from(pairMap.values());
}

/**
 * Construit un digraphe orienté conservant les directions exactes des relations.
 * Si une relation est symétrique (directed === false), elle est modélisée par un arc aller-retour (u -> v et v -> u).
 */
export function buildDirectedGraph(nodeIds: Iterable<string>, edges: GraphEdge[]): DirectedGraph {
	const nodes = new Set<string>(nodeIds);
	const outNeighbors = new Map<string, Set<string>>();
	const inNeighbors = new Map<string, Set<string>>();

	for (const id of nodes) {
		outNeighbors.set(id, new Set<string>());
		inNeighbors.set(id, new Set<string>());
	}

	for (const edge of edges) {
		const { source, target, directed } = edge;
		if (source === target) continue;
		if (!nodes.has(source) || !nodes.has(target)) continue;

		// Arc direct : source -> target
		outNeighbors.get(source)!.add(target);
		inNeighbors.get(target)!.add(source);

		// Si le lien est symétrique au sens du domaine, l'arc réciproque existe aussi
		if (!directed) {
			outNeighbors.get(target)!.add(source);
			inNeighbors.get(source)!.add(target);
		}
	}

	return { nodes, outNeighbors, inNeighbors };
}

/**
 * Calcule le degré moyen d'un graphe simple non orienté.
 * Formule : d̄ = 2E / V.
 * Convention pour V = 0 : 0.
 */
export function calculateAverageDegree(nodeCount: number, edgeCount: number): number {
	if (nodeCount === 0) return 0;
	return (2 * edgeCount) / nodeCount;
}

/**
 * Calcule la densité d'un graphe simple non orienté.
 * Formule : D = 2E / (V * (V - 1)).
 * Convention pour V < 2 : 0 (aucune paire de sommets ne peut être reliée).
 */
export function calculateDensity(nodeCount: number, edgeCount: number): number {
	if (nodeCount < 2) return 0;
	return (2 * edgeCount) / (nodeCount * (nodeCount - 1));
}

/**
 * Identifie les composantes connexes d'un graphe simple non orienté (parcours en largeur).
 * Retourne les listes de sommets ordonnées par taille décroissante.
 */
export function findConnectedComponents(graph: SimpleGraph): string[][] {
	const visited = new Set<string>();
	const components: string[][] = [];

	// Tri des sommets pour garantir la reproductibilité déterministe
	const sortedNodes = Array.from(graph.nodes).sort();

	for (const startNode of sortedNodes) {
		if (visited.has(startNode)) continue;

		const component: string[] = [];
		const queue: string[] = [startNode];
		visited.add(startNode);

		while (queue.length > 0) {
			const current = queue.shift()!;
			component.push(current);

			const neighbors = graph.adjacency.get(current);
			if (neighbors) {
				const sortedNeighbors = Array.from(neighbors).sort();
				for (const neighbor of sortedNeighbors) {
					if (!visited.has(neighbor)) {
						visited.add(neighbor);
						queue.push(neighbor);
					}
				}
			}
		}

		components.push(component);
	}

	// Tri par taille décroissante
	components.sort((a, b) => b.length - a.length);
	return components;
}

/**
 * Calcule toutes les distances géodésiques (plus courts chemins non pondérés) depuis un sommet source.
 */
export function computeShortestDistancesFrom(source: string, graph: SimpleGraph): Map<string, number> {
	const distances = new Map<string, number>();
	for (const node of graph.nodes) {
		distances.set(node, Infinity);
	}

	distances.set(source, 0);
	const queue: string[] = [source];

	while (queue.length > 0) {
		const current = queue.shift()!;
		const currentDist = distances.get(current)!;

		const neighbors = graph.adjacency.get(current);
		if (neighbors) {
			for (const neighbor of neighbors) {
				if (distances.get(neighbor) === Infinity) {
					distances.set(neighbor, currentDist + 1);
					queue.push(neighbor);
				}
			}
		}
	}

	return distances;
}

/**
 * Calcule la matrice complète des distances géodésiques d(u, v) pour tous u, v dans V.
 */
export function computeAllShortestDistances(graph: SimpleGraph): Map<string, Map<string, number>> {
	const allDistances = new Map<string, Map<string, number>>();
	for (const node of graph.nodes) {
		allDistances.set(node, computeShortestDistancesFrom(node, graph));
	}
	return allDistances;
}

/**
 * Calcule le diamètre de chaque composante connexe, ainsi que le diamètre global (si connexe).
 */
export function calculateDiameters(
	graph: SimpleGraph,
	components: string[][],
	allDistances: Map<string, Map<string, number>>
): {
	byComponent: Array<{ componentIndex: number; size: number; diameter: number }>;
	globalDiameter: number | null;
} {
	const byComponent: Array<{ componentIndex: number; size: number; diameter: number }> = [];

	for (let i = 0; i < components.length; i++) {
		const comp = components[i];
		if (comp.length <= 1) {
			byComponent.push({ componentIndex: i, size: comp.length, diameter: 0 });
			continue;
		}

		let maxDist = 0;
		for (const u of comp) {
			const uDist = allDistances.get(u)!;
			for (const v of comp) {
				const d = uDist.get(v)!;
				if (d !== Infinity && d > maxDist) {
					maxDist = d;
				}
			}
		}

		byComponent.push({ componentIndex: i, size: comp.length, diameter: maxDist });
	}

	// Diamètre global : uniquement si le graphe comporte au plus 1 composante connexe
	let globalDiameter: number | null = null;
	if (graph.nodes.size === 0) {
		globalDiameter = 0;
	} else if (components.length === 1) {
		globalDiameter = byComponent[0]?.diameter ?? 0;
	} else {
		// Graphe déconnecté : la distance maximale entre deux sommets de composantes distinctes est infinie
		globalDiameter = null;
	}

	return { byComponent, globalDiameter };
}

/**
 * Algorithme de Brandes pour le calcul de l'intermédiarité (Betweenness Centrality).
 * Complexité : O(V * E) pour un graphe non pondéré.
 *
 * Normalisation pour graphe non orienté :
 * C'_B(v) = 2 * C_B(v) / ((V - 1) * (V - 2)) lorsque V >= 3.
 * Si V < 3, C'_B(v) = 0.
 */
export function computeBetweennessCentrality(graph: SimpleGraph): {
	raw: Map<string, number>;
	normalized: Map<string, number>;
} {
	const raw = new Map<string, number>();
	const normalized = new Map<string, number>();

	for (const v of graph.nodes) {
		raw.set(v, 0);
		normalized.set(v, 0);
	}

	const n = graph.nodes.size;
	if (n < 3) {
		// Pas de sommet intermédiaire possible entre deux autres sommets distincts
		return { raw, normalized };
	}

	for (const s of graph.nodes) {
		const stack: string[] = [];
		const predecessors = new Map<string, string[]>();
		const sigma = new Map<string, number>();
		const dist = new Map<string, number>();

		for (const w of graph.nodes) {
			predecessors.set(w, []);
			sigma.set(w, 0);
			dist.set(w, -1);
		}

		sigma.set(s, 1);
		dist.set(s, 0);

		const queue: string[] = [s];

		while (queue.length > 0) {
			const v = queue.shift()!;
			stack.push(v);

			const neighbors = graph.adjacency.get(v);
			if (neighbors) {
				for (const w of neighbors) {
					// Chemin découvert pour la première fois ?
					if (dist.get(w)! < 0) {
						dist.set(w, dist.get(v)! + 1);
						queue.push(w);
					}
					// Plus court chemin passant par v ?
					if (dist.get(w)! === dist.get(v)! + 1) {
						sigma.set(w, sigma.get(w)! + sigma.get(v)!);
						predecessors.get(w)!.push(v);
					}
				}
			}
		}

		const delta = new Map<string, number>();
		for (const w of graph.nodes) {
			delta.set(w, 0);
		}

		// Rétropropagation des dépendances
		while (stack.length > 0) {
			const w = stack.pop()!;
			const preds = predecessors.get(w)!;
			const sigmaW = sigma.get(w)!;
			const deltaW = delta.get(w)!;

			for (const v of preds) {
				const sigmaV = sigma.get(v)!;
				const c = (sigmaV / sigmaW) * (1 + deltaW);
				delta.set(v, delta.get(v)! + c);
			}

			if (w !== s) {
				raw.set(w, raw.get(w)! + deltaW);
			}
		}
	}

	// Dans un graphe non orienté, chaque paire non ordonnée {s, t} est comptée deux fois (s->t et t->s)
	// On divise donc par 2 pour obtenir la valeur standard non orientée.
	const normFactor = ((n - 1) * (n - 2)) / 2;

	for (const v of graph.nodes) {
		const unorientedRaw = raw.get(v)! / 2;
		raw.set(v, unorientedRaw);
		normalized.set(v, normFactor > 0 ? unorientedRaw / normFactor : 0);
	}

	return { raw, normalized };
}

/**
 * Calcule la proximité harmonique (Harmonic Closeness Centrality).
 * C_H(u) = (1 / (V - 1)) * Σ_{v != u} (1 / d(u, v))
 *
 * Propriété majeure : gère naturellement les graphes déconnectés (1 / ∞ = 0).
 * Valeur normalisée dans [0, 1].
 * Si V <= 1, C_H(u) = 0.
 */
export function computeHarmonicCloseness(
	graph: SimpleGraph,
	allDistances: Map<string, Map<string, number>>
): Map<string, number> {
	const closeness = new Map<string, number>();
	const n = graph.nodes.size;

	if (n <= 1) {
		for (const node of graph.nodes) {
			closeness.set(node, 0);
		}
		return closeness;
	}

	const denominator = n - 1;

	for (const u of graph.nodes) {
		const distances = allDistances.get(u)!;
		let sum = 0;

		for (const v of graph.nodes) {
			if (u === v) continue;
			const d = distances.get(v)!;
			if (d !== Infinity && d > 0) {
				sum += 1 / d;
			}
		}

		closeness.set(u, sum / denominator);
	}

	return closeness;
}

/**
 * Identifie les points d'articulation (points de coupure) et les ponts (bridges)
 * à l'aide de l'algorithme DFS de Tarjan / Hopcroft.
 * Complexité : O(V + E).
 */
export function findBiconnectedProperties(graph: SimpleGraph): {
	articulationPoints: string[];
	bridges: Array<[string, string]>;
} {
	const tin = new Map<string, number>();
	const low = new Map<string, number>();
	const visited = new Set<string>();
	const articulationSet = new Set<string>();
	const bridges: Array<[string, string]> = [];
	let timer = 0;

	// Tri pour reproductibilité déterministe
	const sortedNodes = Array.from(graph.nodes).sort();

	function dfs(u: string, parent: string | null) {
		visited.add(u);
		timer++;
		tin.set(u, timer);
		low.set(u, timer);
		let children = 0;

		const neighbors = graph.adjacency.get(u);
		if (neighbors) {
			for (const v of neighbors) {
				if (v === parent) continue;

				if (visited.has(v)) {
					// Arête arrière (back-edge)
					low.set(u, Math.min(low.get(u)!, tin.get(v)!));
				} else {
					// Arête d'arbre (tree-edge)
					children++;
					dfs(v, u);
					low.set(u, Math.min(low.get(u)!, low.get(v)!));

					// Condition pour point d'articulation (sommet non racine)
					if (parent !== null && low.get(v)! >= tin.get(u)!) {
						articulationSet.add(u);
					}

					// Condition pour pont
					if (low.get(v)! > tin.get(u)!) {
						const [b1, b2] = u < v ? [u, v] : [v, u];
						bridges.push([b1, b2]);
					}
				}
			}
		}

		// Condition pour point d'articulation (sommet racine)
		if (parent === null && children > 1) {
			articulationSet.add(u);
		}
	}

	for (const node of sortedNodes) {
		if (!visited.has(node)) {
			dfs(node, null);
		}
	}

	// Tri pour reproductibilité
	const articulationPoints = Array.from(articulationSet).sort();
	bridges.sort((a, b) => (a[0] === b[0] ? a[1].localeCompare(b[1]) : a[0].localeCompare(b[0])));

	return { articulationPoints, bridges };
}

/**
 * Calcule l'ensemble complet des métriques pour un ensemble de sommets et de relations,
 * en appliquant le filtre ontologique optionnel.
 */
export function analyzeCharacterNetwork(
	rawNodes: GraphNode[],
	rawEdges: GraphEdge[],
	filter?: NodeFilter
): NetworkMetricsReport {
	// 1. Filtrage ontologique des sommets
	const eligibleNodes = filterNodes(rawNodes, filter);
	const eligibleNodeIds = new Set(eligibleNodes.map((n) => n.id));
	const allNodeIds = new Set(rawNodes.map((n) => n.id));
	const excludedNodeIds = Array.from(allNodeIds).filter((id) => !eligibleNodeIds.has(id)).sort();

	// 2. Filtrage des relations
	const eligibleEdges = filterEdgesForNodes(rawEdges, eligibleNodeIds);

	// 3. Modélisation en graphe simple et digraphe
	const simpleGraph = buildSimpleGraph(eligibleNodeIds, eligibleEdges);
	const directedGraph = buildDirectedGraph(eligibleNodeIds, eligibleEdges);
	const connectedPairs = getConnectedPairs(eligibleNodeIds, eligibleEdges);

	// 4. Métriques structurelles
	const nodeCount = simpleGraph.nodes.size;
	const typedEdgeCount = eligibleEdges.length;
	const connectedPairCount = connectedPairs.length;
	const averageDegree = calculateAverageDegree(nodeCount, connectedPairCount);
	const density = calculateDensity(nodeCount, connectedPairCount);

	// 5. Composantes connexes, distances et diamètres
	const connectedComponents = findConnectedComponents(simpleGraph);
	const isolatedNodes = Array.from(simpleGraph.nodes)
		.filter((n) => simpleGraph.adjacency.get(n)?.size === 0)
		.sort();

	const allDistances = computeAllShortestDistances(simpleGraph);
	const { byComponent: diameterByComponent, globalDiameter } = calculateDiameters(
		simpleGraph,
		connectedComponents,
		allDistances
	);

	// 6. Centralités
	const { raw: betweennessRaw, normalized: betweennessNormalized } = computeBetweennessCentrality(simpleGraph);
	const harmonicCloseness = computeHarmonicCloseness(simpleGraph, allDistances);
	const { articulationPoints, bridges } = findBiconnectedProperties(simpleGraph);

	// 7. Consolidation des métriques par sommet
	const nodesReport: Record<string, NodeCentrality> = {};
	for (const id of simpleGraph.nodes) {
		const deg = simpleGraph.adjacency.get(id)?.size ?? 0;
		const outDeg = directedGraph.outNeighbors.get(id)?.size ?? 0;
		const inDeg = directedGraph.inNeighbors.get(id)?.size ?? 0;

		nodesReport[id] = {
			degree: deg,
			inDegree: inDeg,
			outDegree: outDeg,
			betweenness: betweennessRaw.get(id) ?? 0,
			betweennessNormalized: betweennessNormalized.get(id) ?? 0,
			harmonicCloseness: harmonicCloseness.get(id) ?? 0,
		};
	}

	// 8. Métadonnées du filtre appliqué
	const allKnownCategories: NodeCategory[] = [
		'individual',
		'collective',
		'symbolic_object',
		'deceased_memory',
		'historical_concept',
	];

	const includedCategories = filter?.includeCategories
		? [...filter.includeCategories]
		: allKnownCategories.filter((c) => !filter?.excludeCategories?.includes(c));

	const excludedCategories = filter?.excludeCategories ? [...filter.excludeCategories] : [];

	return {
		nodeCount,
		typedEdgeCount,
		connectedPairCount,
		averageDegree,
		density,
		connectedComponents,
		connectedComponentCount: connectedComponents.length,
		isolatedNodes,
		diameterByComponent,
		globalDiameter,
		articulationPoints,
		bridges,
		nodes: nodesReport,
		filterApplied: {
			includedCategories,
			excludedCategories,
			excludedNodeIds,
		},
	};
}
