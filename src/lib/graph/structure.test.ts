import { describe, expect, test } from 'vitest';
import {
	analyzeNetworkStructure,
	computeDegreeDistributionStats,
	computeFreemanDegreeCentralization,
} from './structure';
import type { GraphEdge, GraphNode } from './types';

function makeNodes(ids: string[]): GraphNode[] {
	return ids.map((id) => ({
		id,
		label: id.toUpperCase(),
		category: 'individual',
	}));
}

function makeEdge(u: string, v: string, id?: string): GraphEdge {
	return {
		id: id ?? `${u}-${v}`,
		source: u,
		target: v,
		nature: 'test',
		directed: false,
	};
}

describe('Moteur de structure des graphes — Tests topologiques et heuristiques indépendants', () => {
	// 1. Graphe vide
	test('graphe vide (V=0) : forme exact "empty"', () => {
		const report = analyzeNetworkStructure([], []);
		expect(report.exactShapes).toContain('empty');
		expect(report.analyzedNodeCount).toBe(0);
		expect(report.pedagogicalSynthesis.shapeTitle).toContain('vide');
	});

	// 2. Sommet unique
	test('sommet unique (V=1) : forme exact "isolated_single_node", arbre, chaîne', () => {
		const nodes = makeNodes(['a']);
		const report = analyzeNetworkStructure(nodes, []);
		expect(report.exactShapes).toContain('isolated_single_node');
		expect(report.exactShapes).toContain('tree');
		expect(report.exactShapes).toContain('chain');
		expect(report.exactShapes).toContain('regular');
		expect(report.roles.isolated).toEqual(['a']);
	});

	// 3. Réseau sans arêtes (V=3, E=0)
	test('réseau sans arêtes (V=3, E=0) : "edgeless", "forest", régulier', () => {
		const nodes = makeNodes(['a', 'b', 'c']);
		const report = analyzeNetworkStructure(nodes, []);
		expect(report.exactShapes).toContain('edgeless');
		expect(report.exactShapes).toContain('forest');
		expect(report.exactShapes).toContain('regular');
		expect(report.descriptiveProfiles).toContain('fragmented');
		expect(report.roles.isolated.length).toBe(3);
	});

	// 4. Graphe complet K_4
	test('graphe complet K_4 : "complete", régulier, densité 1.0, non-biparti car triangles', () => {
		const nodes = makeNodes(['1', '2', '3', '4']);
		const edges = [
			makeEdge('1', '2'),
			makeEdge('1', '3'),
			makeEdge('1', '4'),
			makeEdge('2', '3'),
			makeEdge('2', '4'),
			makeEdge('3', '4'),
		];
		const report = analyzeNetworkStructure(nodes, edges);
		expect(report.exactShapes).toContain('complete');
		expect(report.exactShapes).toContain('regular');
		expect(report.exactShapes).not.toContain('bipartite');
		expect(report.descriptiveProfiles).toContain('dense');
	});

	// 5. Étoile stricte S_5 (centre c, feuilles 1, 2, 3, 4)
	test('étoile stricte S_5 : "star", "tree", "bipartite", "complete_bipartite", Freeman = 1.0', () => {
		const nodes = makeNodes(['c', '1', '2', '3', '4']);
		const edges = [
			makeEdge('c', '1'),
			makeEdge('c', '2'),
			makeEdge('c', '3'),
			makeEdge('c', '4'),
		];
		const report = analyzeNetworkStructure(nodes, edges);
		expect(report.exactShapes).toContain('star');
		expect(report.exactShapes).toContain('tree');
		expect(report.exactShapes).toContain('bipartite');
		expect(report.exactShapes).toContain('complete_bipartite');
		expect(report.descriptiveProfiles).toContain('highly_centralized');
		expect(report.descriptiveProfiles).toContain('single_hub_dominated');
		expect(report.metrics.centralization.degreeCentralization).toBe(1);
		expect(report.roles.dominantHubs).toEqual(['c']);
		expect(report.roles.leaves.length).toBe(4);
	});

	// 6. Chaîne P_4 (a - b - c - d)
	test('chaîne P_4 : "chain", "tree", "bipartite", pas étoile, pas cycle', () => {
		const nodes = makeNodes(['a', 'b', 'c', 'd']);
		const edges = [
			makeEdge('a', 'b'),
			makeEdge('b', 'c'),
			makeEdge('c', 'd'),
		];
		const report = analyzeNetworkStructure(nodes, edges);
		expect(report.exactShapes).toContain('chain');
		expect(report.exactShapes).toContain('tree');
		expect(report.exactShapes).toContain('bipartite');
		expect(report.exactShapes).not.toContain('star');
		expect(report.exactShapes).not.toContain('cycle');
		expect(report.metrics.cycles.hasCycles).toBe(false);
	});

	// 7. Cycle C_5 (a - b - c - d - e - a)
	test('cycle C_5 : "cycle", régulier (deg 2), non biparti (impair)', () => {
		const nodes = makeNodes(['a', 'b', 'c', 'd', 'e']);
		const edges = [
			makeEdge('a', 'b'),
			makeEdge('b', 'c'),
			makeEdge('c', 'd'),
			makeEdge('d', 'e'),
			makeEdge('e', 'a'),
		];
		const report = analyzeNetworkStructure(nodes, edges);
		expect(report.exactShapes).toContain('cycle');
		expect(report.exactShapes).toContain('regular');
		expect(report.exactShapes).not.toContain('bipartite'); // 5 impair
		expect(report.exactShapes).not.toContain('tree');
	});

	// 8. Cycle pair C_4 (a - b - c - d - a)
	test('cycle C_4 : "cycle", régulier, et biparti (pair)', () => {
		const nodes = makeNodes(['a', 'b', 'c', 'd']);
		const edges = [
			makeEdge('a', 'b'),
			makeEdge('b', 'c'),
			makeEdge('c', 'd'),
			makeEdge('d', 'a'),
		];
		const report = analyzeNetworkStructure(nodes, edges);
		expect(report.exactShapes).toContain('cycle');
		expect(report.exactShapes).toContain('bipartite');
	});

	// 9. Arbre ramifié (non étoile, non chaîne)
	test('arbre ramifié : "tree", "branched_tree", pas étoile, pas chaîne', () => {
		// r relié à a et b. a relié à c et d. b relié à e et f.
		const nodes = makeNodes(['r', 'a', 'b', 'c', 'd', 'e', 'f']);
		const edges = [
			makeEdge('r', 'a'),
			makeEdge('r', 'b'),
			makeEdge('a', 'c'),
			makeEdge('a', 'd'),
			makeEdge('b', 'e'),
			makeEdge('b', 'f'),
		];
		const report = analyzeNetworkStructure(nodes, edges);
		expect(report.exactShapes).toContain('tree');
		expect(report.exactShapes).not.toContain('star');
		expect(report.exactShapes).not.toContain('chain');
		expect(report.descriptiveProfiles).toContain('branched_tree');
	});

	// 10. Forêt (2 composantes d’arbres)
	test('forêt : "forest", pas tree, "fragmented"', () => {
		const nodes = makeNodes(['a', 'b', 'c', 'd']);
		const edges = [
			makeEdge('a', 'b'),
			makeEdge('c', 'd'),
		];
		const report = analyzeNetworkStructure(nodes, edges);
		expect(report.exactShapes).toContain('forest');
		expect(report.exactShapes).not.toContain('tree');
		expect(report.descriptiveProfiles).toContain('fragmented');
	});

	// 11. Biparti complet K_{2, 3}
	test('biparti complet K_{2, 3} : "complete_bipartite", "bipartite", contient des cycles', () => {
		const nodes = makeNodes(['u1', 'u2', 'v1', 'v2', 'v3']);
		const edges = [
			makeEdge('u1', 'v1'),
			makeEdge('u1', 'v2'),
			makeEdge('u1', 'v3'),
			makeEdge('u2', 'v1'),
			makeEdge('u2', 'v2'),
			makeEdge('u2', 'v3'),
		];
		const report = analyzeNetworkStructure(nodes, edges);
		expect(report.exactShapes).toContain('bipartite');
		expect(report.exactShapes).toContain('complete_bipartite');
		expect(report.metrics.cycles.hasCycles).toBe(true);
	});

	// 12. Noyau dense et périphérie (Core-Periphery)
	test('noyau dense et périphérie : "core_periphery" détecté', () => {
		// Noyau : triangle {c1, c2, c3}
		// Périphérie : p1 relié à c1, p2 relié à c2, p3 relié à c3, p4 relié à c1
		const nodes = makeNodes(['c1', 'c2', 'c3', 'p1', 'p2', 'p3', 'p4']);
		const edges = [
			makeEdge('c1', 'c2'),
			makeEdge('c2', 'c3'),
			makeEdge('c3', 'c1'),
			makeEdge('c1', 'p1'),
			makeEdge('c2', 'p2'),
			makeEdge('c3', 'p3'),
			makeEdge('c1', 'p4'),
		];
		const report = analyzeNetworkStructure(nodes, edges);
		expect(report.descriptiveProfiles).toContain('core_periphery');
		expect(report.metrics.corePeriphery.detected).toBe(true);
		expect(report.metrics.corePeriphery.coreNodes).toContain('c1');
	});

	// 13. Graphe distribué régulier C_6
	test('graphe distribué C_6 : "distributed", faible centralisation', () => {
		const nodes = makeNodes(['1', '2', '3', '4', '5', '6']);
		const edges = [
			makeEdge('1', '2'),
			makeEdge('2', '3'),
			makeEdge('3', '4'),
			makeEdge('4', '5'),
			makeEdge('5', '6'),
			makeEdge('6', '1'),
		];
		const report = analyzeNetworkStructure(nodes, edges);
		expect(report.descriptiveProfiles).toContain('distributed');
		expect(report.metrics.centralization.degreeCentralization).toBe(0);
	});
});
