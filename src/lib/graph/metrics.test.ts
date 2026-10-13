import { describe, expect, test } from 'vitest';
import {
	analyzeCharacterNetwork,
	buildDirectedGraph,
	buildSimpleGraph,
	calculateAverageDegree,
	calculateDensity,
	computeBetweennessCentrality,
	computeHarmonicCloseness,
	findBiconnectedProperties,
	findConnectedComponents,
	getConnectedPairs,
} from './metrics';
import type { GraphEdge, GraphNode } from './types';

// Helper pour créer des nœuds rapidement
function makeNodes(ids: string[]): GraphNode[] {
	return ids.map((id) => ({
		id,
		label: id.toUpperCase(),
		category: 'individual',
	}));
}

// Helper pour créer des arêtes simples non orientées
function makeUndirectedEdge(id: string, u: string, v: string, nature = 'test'): GraphEdge {
	return {
		id,
		source: u,
		target: v,
		nature,
		directed: false,
	};
}

// Helper pour créer des arêtes orientées
function makeDirectedEdge(id: string, u: string, v: string, nature = 'test'): GraphEdge {
	return {
		id,
		source: u,
		target: v,
		nature,
		directed: true,
	};
}

describe('Moteur de théorie des graphes — Tests mathématiques indépendants des œuvres', () => {
	// --------------------------------------------------------------------------
	// 1. Graphe vide
	// --------------------------------------------------------------------------
	test('graphe vide (0 sommet, 0 arête) : métriques stables et sans erreur', () => {
		const report = analyzeCharacterNetwork([], []);
		expect(report.nodeCount).toBe(0);
		expect(report.typedEdgeCount).toBe(0);
		expect(report.connectedPairCount).toBe(0);
		expect(report.averageDegree).toBe(0);
		expect(report.density).toBe(0);
		expect(report.connectedComponentCount).toBe(0);
		expect(report.connectedComponents).toEqual([]);
		expect(report.isolatedNodes).toEqual([]);
		expect(report.globalDiameter).toBe(0);
		expect(report.articulationPoints).toEqual([]);
		expect(report.bridges).toEqual([]);
		expect(report.nodes).toEqual({});
	});

	// --------------------------------------------------------------------------
	// 2. Un sommet sans arête
	// --------------------------------------------------------------------------
	test('un sommet unique sans arête : isolé, densité nulle, diamètre nul', () => {
		const nodes = makeNodes(['a']);
		const report = analyzeCharacterNetwork(nodes, []);

		expect(report.nodeCount).toBe(1);
		expect(report.connectedPairCount).toBe(0);
		expect(report.averageDegree).toBe(0);
		expect(report.density).toBe(0); // V < 2 => convention 0
		expect(report.connectedComponentCount).toBe(1);
		expect(report.isolatedNodes).toEqual(['a']);
		expect(report.globalDiameter).toBe(0);
		expect(report.nodes['a']).toEqual({
			degree: 0,
			inDegree: 0,
			outDegree: 0,
			betweenness: 0,
			betweennessNormalized: 0,
			harmonicCloseness: 0,
		});
	});

	// --------------------------------------------------------------------------
	// 3. Deux sommets isolés
	// --------------------------------------------------------------------------
	test('deux sommets sans arête : deux composantes, sommets inaccessibles gérés sans NaN', () => {
		const nodes = makeNodes(['a', 'b']);
		const report = analyzeCharacterNetwork(nodes, []);

		expect(report.nodeCount).toBe(2);
		expect(report.connectedPairCount).toBe(0);
		expect(report.averageDegree).toBe(0);
		expect(report.density).toBe(0);
		expect(report.connectedComponentCount).toBe(2);
		expect(report.isolatedNodes).toEqual(['a', 'b']);
		expect(report.globalDiameter).toBeNull(); // déconnecté => null
		expect(report.nodes['a'].harmonicCloseness).toBe(0);
		expect(report.nodes['b'].harmonicCloseness).toBe(0);
	});

	// --------------------------------------------------------------------------
	// 4. Deux sommets reliés
	// --------------------------------------------------------------------------
	test('deux sommets reliés par une arête : densité 1.0, degré moyen 1.0, pont identifié', () => {
		const nodes = makeNodes(['a', 'b']);
		const edges = [makeUndirectedEdge('e1', 'a', 'b')];
		const report = analyzeCharacterNetwork(nodes, edges);

		expect(report.nodeCount).toBe(2);
		expect(report.connectedPairCount).toBe(1);
		expect(report.averageDegree).toBe(1);
		expect(report.density).toBe(1);
		expect(report.connectedComponentCount).toBe(1);
		expect(report.isolatedNodes).toEqual([]);
		expect(report.globalDiameter).toBe(1);
		expect(report.bridges).toEqual([['a', 'b']]);
		expect(report.articulationPoints).toEqual([]); // V=2 ne contient pas de point d'articulation
		expect(report.nodes['a'].harmonicCloseness).toBe(1);
		expect(report.nodes['b'].harmonicCloseness).toBe(1);
		expect(report.nodes['a'].betweenness).toBe(0);
		expect(report.nodes['b'].betweenness).toBe(0);
	});

	// --------------------------------------------------------------------------
	// 5. Graphe complet K_4
	// --------------------------------------------------------------------------
	test('graphe complet K_4 : densité exacte 1.0, degré régulier 3, diamètre 1, aucun pont', () => {
		const nodes = makeNodes(['1', '2', '3', '4']);
		const edges: GraphEdge[] = [
			makeUndirectedEdge('e12', '1', '2'),
			makeUndirectedEdge('e13', '1', '3'),
			makeUndirectedEdge('e14', '1', '4'),
			makeUndirectedEdge('e23', '2', '3'),
			makeUndirectedEdge('e24', '2', '4'),
			makeUndirectedEdge('e34', '3', '4'),
		];

		const report = analyzeCharacterNetwork(nodes, edges);

		expect(report.nodeCount).toBe(4);
		expect(report.connectedPairCount).toBe(6); // 4 * 3 / 2
		expect(report.averageDegree).toBe(3);
		expect(report.density).toBe(1);
		expect(report.globalDiameter).toBe(1);
		expect(report.articulationPoints).toEqual([]);
		expect(report.bridges).toEqual([]);

		for (const id of ['1', '2', '3', '4']) {
			expect(report.nodes[id].degree).toBe(3);
			expect(report.nodes[id].betweenness).toBe(0);
			expect(report.nodes[id].harmonicCloseness).toBe(1);
		}
	});

	// --------------------------------------------------------------------------
	// 6. Graphe en étoile S_5 (centre = c, feuilles = 1, 2, 3, 4)
	// --------------------------------------------------------------------------
	test('graphe en étoile S_5 : centre point d’articulation unique, betweenness maximale et closeness 1', () => {
		const nodes = makeNodes(['c', '1', '2', '3', '4']);
		const edges: GraphEdge[] = [
			makeUndirectedEdge('e1', 'c', '1'),
			makeUndirectedEdge('e2', 'c', '2'),
			makeUndirectedEdge('e3', 'c', '3'),
			makeUndirectedEdge('e4', 'c', '4'),
		];

		const report = analyzeCharacterNetwork(nodes, edges);

		expect(report.nodeCount).toBe(5);
		expect(report.connectedPairCount).toBe(4);
		expect(report.averageDegree).toBe(1.6); // 2 * 4 / 5 = 1.6
		expect(report.density).toBe(0.4); // 2 * 4 / (5 * 4) = 8 / 20 = 0.4
		expect(report.globalDiameter).toBe(2); // feuille à feuille = 2 pas

		// Centre 'c'
		const center = report.nodes['c'];
		expect(center.degree).toBe(4);
		// Dans S_5, il y a 6 paires de feuilles {i, j}. Tous les chemins passent par c.
		// Betweenness brute = 6. Normalisée = 6 / ((5-1)*(5-2)/2) = 6 / 6 = 1.0 !
		expect(center.betweenness).toBe(6);
		expect(center.betweennessNormalized).toBe(1);
		expect(center.harmonicCloseness).toBe(1);

		// Feuilles
		for (const leafId of ['1', '2', '3', '4']) {
			const leaf = report.nodes[leafId];
			expect(leaf.degree).toBe(1);
			expect(leaf.betweenness).toBe(0);
			expect(leaf.betweennessNormalized).toBe(0);
			// Closeness harmonique d'une feuille : 1/1 vers centre, et 1/2 vers les 3 autres feuilles
			// Somme = 1 + 3 * 0.5 = 2.5. Divisé par (5 - 1) = 4 => 2.5 / 4 = 0.625
			expect(leaf.harmonicCloseness).toBe(0.625);
		}

		expect(report.articulationPoints).toEqual(['c']);
		expect(report.bridges.length).toBe(4);
	});

	// --------------------------------------------------------------------------
	// 7. Chaîne de 4 sommets (P_4 : a - b - c - d)
	// --------------------------------------------------------------------------
	test('chaîne P_4 (a - b - c - d) : calcul exact des distances, du diamètre et de l’intermédiarité', () => {
		const nodes = makeNodes(['a', 'b', 'c', 'd']);
		const edges: GraphEdge[] = [
			makeUndirectedEdge('e1', 'a', 'b'),
			makeUndirectedEdge('e2', 'b', 'c'),
			makeUndirectedEdge('e3', 'c', 'd'),
		];

		const report = analyzeCharacterNetwork(nodes, edges);

		expect(report.nodeCount).toBe(4);
		expect(report.connectedPairCount).toBe(3);
		expect(report.globalDiameter).toBe(3);

		// Points d'articulation : b et c
		expect(report.articulationPoints).toEqual(['b', 'c']);
		expect(report.bridges.length).toBe(3);

		// Betweenness de b :
		// Paires possibles pour b : {a, c} -> passe par b (1), {a, d} -> passe par b (1). Total = 2.
		// Normalisée sur P_4 : 2 / ((4-1)*(4-2)/2) = 2 / 3 ≈ 0.6667
		expect(report.nodes['b'].betweenness).toBe(2);
		expect(report.nodes['b'].betweennessNormalized).toBeCloseTo(2 / 3, 5);

		// Betweenness de c : identique symétrique = 2
		expect(report.nodes['c'].betweenness).toBe(2);
		expect(report.nodes['c'].betweennessNormalized).toBeCloseTo(2 / 3, 5);

		// Betweenness des extrémités : 0
		expect(report.nodes['a'].betweenness).toBe(0);
		expect(report.nodes['d'].betweenness).toBe(0);

		// Proximité harmonique de b :
		// d(b, a) = 1, d(b, c) = 1, d(b, d) = 2
		// Somme = 1 + 1 + 1/2 = 2.5. Divisé par 3 = 2.5 / 3 = 5/6 ≈ 0.8333
		expect(report.nodes['b'].harmonicCloseness).toBeCloseTo(5 / 6, 5);

		// Proximité harmonique de a :
		// d(a, b) = 1, d(a, c) = 2, d(a, d) = 3
		// Somme = 1 + 1/2 + 1/3 = 11/6. Divisé par 3 = 11/18 ≈ 0.6111
		expect(report.nodes['a'].harmonicCloseness).toBeCloseTo(11 / 18, 5);
	});

	// --------------------------------------------------------------------------
	// 8. Triangle C_3 (a - b - c - a)
	// --------------------------------------------------------------------------
	test('triangle C_3 : diamètre 1, aucun point d’articulation ni pont, symétrie parfaite', () => {
		const nodes = makeNodes(['a', 'b', 'c']);
		const edges: GraphEdge[] = [
			makeUndirectedEdge('e1', 'a', 'b'),
			makeUndirectedEdge('e2', 'b', 'c'),
			makeUndirectedEdge('e3', 'c', 'a'),
		];

		const report = analyzeCharacterNetwork(nodes, edges);

		expect(report.nodeCount).toBe(3);
		expect(report.connectedPairCount).toBe(3);
		expect(report.averageDegree).toBe(2);
		expect(report.density).toBe(1);
		expect(report.globalDiameter).toBe(1);
		expect(report.articulationPoints).toEqual([]);
		expect(report.bridges).toEqual([]);

		for (const id of ['a', 'b', 'c']) {
			expect(report.nodes[id].degree).toBe(2);
			expect(report.nodes[id].betweenness).toBe(0);
			expect(report.nodes[id].harmonicCloseness).toBe(1);
		}
	});

	// --------------------------------------------------------------------------
	// 9. Graphe comportant plusieurs composantes
	// --------------------------------------------------------------------------
	test('graphe à 2 composantes distinctes : diamètre global null, closeness harmonique calculée', () => {
		// Composante 1 : a - b
		// Composante 2 : c - d - e (triangle)
		const nodes = makeNodes(['a', 'b', 'c', 'd', 'e']);
		const edges: GraphEdge[] = [
			makeUndirectedEdge('e1', 'a', 'b'),
			makeUndirectedEdge('e2', 'c', 'd'),
			makeUndirectedEdge('e3', 'd', 'e'),
			makeUndirectedEdge('e4', 'e', 'c'),
		];

		const report = analyzeCharacterNetwork(nodes, edges);

		expect(report.nodeCount).toBe(5);
		expect(report.connectedComponentCount).toBe(2);
		expect(report.connectedComponents[0].length).toBe(3); // {c, d, e}
		expect(report.connectedComponents[1].length).toBe(2); // {a, b}
		expect(report.globalDiameter).toBeNull(); // déconnecté

		// Diamètres locaux
		expect(report.diameterByComponent).toEqual([
			{ componentIndex: 0, size: 3, diameter: 1 },
			{ componentIndex: 1, size: 2, diameter: 1 },
		]);

		// Closeness harmonique pour 'a' :
		// Connecté à 'b' à distance 1. Sommets 'c', 'd', 'e' inaccessibles (1/∞ = 0).
		// Somme = 1. Divisé par (5 - 1) = 4 => 0.25 !
		expect(report.nodes['a'].harmonicCloseness).toBe(0.25);
		expect(report.nodes['b'].harmonicCloseness).toBe(0.25);

		// Closeness harmonique pour 'c' :
		// Connecté à 'd' (1) et 'e' (1). 'a' et 'b' inaccessibles (0).
		// Somme = 2. Divisé par 4 => 0.5 !
		expect(report.nodes['c'].harmonicCloseness).toBe(0.5);
	});

	// --------------------------------------------------------------------------
	// 10. Relations multiples entre une même paire
	// --------------------------------------------------------------------------
	test('relations multiples entre une même paire : 1 seule paire reliée, mais conservation des arêtes typées', () => {
		const nodes = makeNodes(['u', 'v']);
		const edges: GraphEdge[] = [
			makeUndirectedEdge('e_fam', 'u', 'v', 'familial'),
			makeUndirectedEdge('e_nar', 'u', 'v', 'narratif'),
			makeDirectedEdge('e_spi', 'u', 'v', 'spirituel'),
		];

		const pairs = getConnectedPairs(['u', 'v'], edges);
		expect(pairs.length).toBe(1);
		expect(pairs[0].edgeIds).toEqual(['e_fam', 'e_nar', 'e_spi']);
		expect(pairs[0].natures).toEqual(['familial', 'narratif', 'spirituel']);

		const report = analyzeCharacterNetwork(nodes, edges);
		expect(report.nodeCount).toBe(2);
		expect(report.typedEdgeCount).toBe(3); // 3 relations enregistrées
		expect(report.connectedPairCount).toBe(1); // 1 seule arête dans le graphe simple
		expect(report.averageDegree).toBe(1);
		expect(report.density).toBe(1);
	});

	// --------------------------------------------------------------------------
	// 11. Graphe orienté avec degrés entrants et sortants asymétriques
	// --------------------------------------------------------------------------
	test('graphe orienté (maître -> élève) : inDegree et outDegree fidèlement distincts', () => {
		const nodes = makeNodes(['maitre', 'eleve', 'observateur']);
		const edges: GraphEdge[] = [
			makeDirectedEdge('e1', 'maitre', 'eleve', 'enseignement'),
			makeDirectedEdge('e2', 'observateur', 'eleve', 'regard'),
		];

		const report = analyzeCharacterNetwork(nodes, edges);

		expect(report.nodes['maitre'].outDegree).toBe(1);
		expect(report.nodes['maitre'].inDegree).toBe(0);

		expect(report.nodes['eleve'].outDegree).toBe(0);
		expect(report.nodes['eleve'].inDegree).toBe(2);

		expect(report.nodes['observateur'].outDegree).toBe(1);
		expect(report.nodes['observateur'].inDegree).toBe(0);
	});

	// --------------------------------------------------------------------------
	// 12. Filtrage ontologique : exclusion des objets symboliques
	// --------------------------------------------------------------------------
	test('filtrage ontologique : exclusion propre des objets symboliques sans altérer le corpus initial', () => {
		const nodes: GraphNode[] = [
			{ id: 'chevalier', label: 'Chevalier', category: 'individual' },
			{ id: 'roi', label: 'Roi', category: 'individual' },
			{ id: 'graal', label: 'Graal', category: 'symbolic_object' },
		];

		const edges: GraphEdge[] = [
			makeUndirectedEdge('e1', 'chevalier', 'roi'),
			makeDirectedEdge('e2', 'chevalier', 'graal', 'mystique'),
			makeUndirectedEdge('e3', 'roi', 'graal', 'mystique'),
		];

		// Analyse brute (toutes catégories)
		const fullReport = analyzeCharacterNetwork(nodes, edges);
		expect(fullReport.nodeCount).toBe(3);
		expect(fullReport.connectedPairCount).toBe(3);
		expect(fullReport.filterApplied.excludedNodeIds).toEqual([]);

		// Analyse restreinte aux personnages humains
		const filteredReport = analyzeCharacterNetwork(nodes, edges, {
			excludeCategories: ['symbolic_object'],
		});

		expect(filteredReport.nodeCount).toBe(2);
		expect(filteredReport.connectedPairCount).toBe(1);
		expect(filteredReport.filterApplied.excludedNodeIds).toEqual(['graal']);
		expect(filteredReport.nodes['graal']).toBeUndefined();
		expect(filteredReport.nodes['chevalier'].degree).toBe(1);
		expect(filteredReport.nodes['roi'].degree).toBe(1);
	});
});
