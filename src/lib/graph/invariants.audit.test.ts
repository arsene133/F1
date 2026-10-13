import { describe, expect, test } from 'vitest';
import { balzacPortrait } from '../../data/balzac-rimbaud';
import { domJuanCharacters, domJuanEdgeTypes, domJuanRelationships } from '../../data/dom-juan';
import { goriotCharacters, goriotRelationships } from '../../data/goriot-relationships';
import { graffignyCharacters, graffignyEdgeTypes, graffignyRelationships } from '../../data/graffigny';
import { percevalCharacters, percevalEdgeTypes, percevalRelationships } from '../../data/perceval';
import { potBouilleCharacters, potBouilleEdgeTypes, potBouilleRelationships } from '../../data/pot-bouille';
import {
	adaptBalzacRimbaudCorpus,
	adaptDomJuanCorpus,
	adaptGoriotCorpus,
	adaptGraffignyCorpus,
	adaptMussetCorpus,
	adaptPercevalCorpus,
	adaptPotBouilleCorpus,
	analyzeCharacterNetwork,
	analyzeNetworkStructure,
} from './index';

/**
 * Helper de vérification d'invariants pour tout réseau analysé.
 */
function verifyGraphInvariants(
	workName: string,
	V: number,
	E_simple: number,
	k: number,
	degrees: Record<string, number>,
	density: number,
	cyclomatic: number,
	freemanCentralization: number
) {
	// Invariant 1 : Somme des degrés = 2 * E_simple
	const sumDeg = Object.values(degrees).reduce((a, b) => a + b, 0);
	expect(
		sumDeg,
		`[${workName}] Échec invariant somme(degrés) = 2E: attendu ${2 * E_simple}, reçu ${sumDeg}`
	).toBe(2 * E_simple);

	// Invariant 2 : Densité = 2E / (V * (V - 1)) pour V >= 2
	if (V >= 2) {
		const expectedDensity = (2 * E_simple) / (V * (V - 1));
		expect(
			density,
			`[${workName}] Échec invariant densité: attendu ${expectedDensity}, reçu ${density}`
		).toBeCloseTo(expectedDensity, 5);
	}

	// Invariant 3 : Nombre cyclomatique = E - V + k
	const expectedCyclomatic = Math.max(0, E_simple - V + k);
	expect(
		cyclomatic,
		`[${workName}] Échec invariant cyclomatique: attendu ${expectedCyclomatic}, reçu ${cyclomatic}`
	).toBe(expectedCyclomatic);

	// Invariant 4 : Centralisation de Freeman C_D = sum(max_d - d(v)) / ((V-1)*(V-2)) pour V >= 3
	if (V >= 3) {
		const maxD = Math.max(...Object.values(degrees));
		const diffSum = Object.values(degrees).reduce((acc, d) => acc + (maxD - d), 0);
		const expectedFreeman = diffSum / ((V - 1) * (V - 2));
		expect(
			freemanCentralization,
			`[${workName}] Échec invariant Freeman: attendu ${expectedFreeman}, reçu ${freemanCentralization}`
		).toBeCloseTo(expectedFreeman, 5);
	}
}

describe('Audit d’invariants et exactitude mathématique sur les 7 œuvres', () => {
	// ==========================================================================
	// 1. LE CONTE DU GRAAL (/perceval)
	// ==========================================================================
	test('Perceval : V=14, E_typé=22, E_simple=18, sum(deg)=36, Freeman=73/78 ≈ 0.935897', () => {
		const { nodes, edges } = adaptPercevalCorpus(
			percevalCharacters,
			percevalRelationships,
			percevalEdgeTypes
		);
		const netReport = analyzeCharacterNetwork(nodes, edges);
		const structReport = analyzeNetworkStructure(nodes, edges);

		const V = structReport.analyzedNodeCount;
		const E = structReport.connectedPairCount;
		expect(V).toBe(14);
		expect(edges.length).toBe(22);
		expect(E).toBe(18);

		const degs = Object.fromEntries(
			Object.entries(netReport.nodes).map(([id, n]) => [id, n.degree])
		);

		// Degrés exacts
		expect(degs['perceval']).toBe(13);
		expect(degs['arthur']).toBe(3);
		expect(degs['mere-perceval']).toBe(2);
		expect(degs['pere-et-freres']).toBe(2);
		expect(degs['gornemant']).toBe(2);
		expect(degs['blanchefleur']).toBe(2);
		expect(degs['keu']).toBe(2);
		expect(degs['gauvain']).toBe(2);
		expect(degs['roi-pecheur']).toBe(2);
		expect(degs['graal']).toBe(2);
		expect(degs['ermite']).toBe(1);
		expect(degs['lance-qui-saigne']).toBe(1);
		expect(degs['cousine-germaine']).toBe(1);
		expect(degs['demoiselle-hideuse']).toBe(1);

		// Histogramme : 1: 4, 2: 8, 3: 1, 13: 1 => 4*1 + 8*2 + 1*3 + 1*13 = 4 + 16 + 3 + 13 = 36 !
		expect(structReport.metrics.degrees.histogram).toEqual({
			1: 4,
			2: 8,
			3: 1,
			13: 1,
		});

		verifyGraphInvariants(
			'Perceval',
			V,
			E,
			structReport.metrics.connectedComponentCount,
			degs,
			structReport.metrics.density,
			structReport.metrics.cycles.cycleCountEstimate,
			structReport.metrics.centralization.degreeCentralization
		);

		expect(structReport.metrics.centralization.degreeCentralization).toBeCloseTo(146 / 156, 5);
	});

	// ==========================================================================
	// 2. LE PÈRE GORIOT (/goriot)
	// ==========================================================================
	test('Le Père Goriot : V=16, E_typé=23, E_simple=20, sum(deg)=40, Freeman=72/210 ≈ 0.342857', () => {
		const { nodes, edges } = adaptGoriotCorpus(goriotCharacters, goriotRelationships);
		const netReport = analyzeCharacterNetwork(nodes, edges);
		const structReport = analyzeNetworkStructure(nodes, edges);

		const V = structReport.analyzedNodeCount;
		const E = structReport.connectedPairCount;
		expect(V).toBe(16);
		expect(edges.length).toBe(23);
		expect(E).toBe(20); // 20 paires simples distinctes (3 multiarêtes)

		const degs = Object.fromEntries(
			Object.entries(netReport.nodes).map(([id, n]) => [id, n.degree])
		);

		expect(degs['rastignac']).toBe(7);
		expect(degs['goriot']).toBe(6);
		expect(degs['delphine']).toBe(4);
		expect(degs['vautrin']).toBe(3);
		expect(degs['anastasie']).toBe(2);
		expect(degs['bianchon']).toBe(2);
		expect(degs['christophe']).toBe(2);
		expect(degs['m-taillefer']).toBe(2);
		expect(degs['michonneau']).toBe(2);
		expect(degs['mme-de-beauseant']).toBe(2);
		expect(degs['mme-vauquer']).toBe(2);
		expect(degs['victorine']).toBe(2);
		expect(degs['baron-nucingen']).toBe(1);
		expect(degs['comte-restaud']).toBe(1);
		expect(degs['poiret']).toBe(1);
		expect(degs['sylvie']).toBe(1);

		// Histogramme : 1: 4, 2: 8, 3: 1, 4: 1, 6: 1, 7: 1 => 4 + 16 + 3 + 4 + 6 + 7 = 40 !
		expect(structReport.metrics.degrees.histogram).toEqual({
			1: 4,
			2: 8,
			3: 1,
			4: 1,
			6: 1,
			7: 1,
		});

		verifyGraphInvariants(
			'Goriot',
			V,
			E,
			structReport.metrics.connectedComponentCount,
			degs,
			structReport.metrics.density,
			structReport.metrics.cycles.cycleCountEstimate,
			structReport.metrics.centralization.degreeCentralization
		);

		expect(structReport.metrics.centralization.degreeCentralization).toBeCloseTo(72 / 210, 5);
	});

	// ==========================================================================
	// 3. DOM JUAN (/don-juan)
	// ==========================================================================
	test('Dom Juan : V=8, E_typé=7, E_simple=7, sum(deg)=14, Freeman=1.0 (étoile stricte)', () => {
		const { nodes, edges } = adaptDomJuanCorpus(
			domJuanCharacters,
			domJuanRelationships,
			domJuanEdgeTypes
		);
		const netReport = analyzeCharacterNetwork(nodes, edges);
		const structReport = analyzeNetworkStructure(nodes, edges);

		const V = structReport.analyzedNodeCount;
		const E = structReport.connectedPairCount;
		expect(V).toBe(8);
		expect(edges.length).toBe(7);
		expect(E).toBe(7);

		const degs = Object.fromEntries(
			Object.entries(netReport.nodes).map(([id, n]) => [id, n.degree])
		);

		expect(degs['dom-juan']).toBe(7);
		for (const id of [
			'sganarelle',
			'done-elvire',
			'commandeur',
			'dom-louis',
			'dom-carlos',
			'monsieur-dimanche',
			'paysans',
		]) {
			expect(degs[id]).toBe(1);
		}

		// Histogramme : 1: 7, 7: 1 => 7 + 7 = 14 !
		expect(structReport.metrics.degrees.histogram).toEqual({
			1: 7,
			7: 1,
		});

		verifyGraphInvariants(
			'Dom Juan',
			V,
			E,
			structReport.metrics.connectedComponentCount,
			degs,
			structReport.metrics.density,
			structReport.metrics.cycles.cycleCountEstimate,
			structReport.metrics.centralization.degreeCentralization
		);

		expect(structReport.metrics.centralization.degreeCentralization).toBe(1.0);
	});

	// ==========================================================================
	// 4. LETTRES D'UNE PÉRURIENNE (/graffigny)
	// ==========================================================================
	test('Graffigny : V=12, E_typé=20, E_simple=15, sum(deg)=30, Freeman=54/110 ≈ 0.490909', () => {
		const { nodes, edges } = adaptGraffignyCorpus(
			graffignyCharacters,
			graffignyRelationships,
			graffignyEdgeTypes
		);
		const netReport = analyzeCharacterNetwork(nodes, edges);
		const structReport = analyzeNetworkStructure(nodes, edges);

		const V = structReport.analyzedNodeCount;
		const E = structReport.connectedPairCount;
		expect(V).toBe(12);
		expect(edges.length).toBe(20);
		expect(E).toBe(15); // 15 paires simples distinctes (5 relations multiples fusionnées)

		const degs = Object.fromEntries(
			Object.entries(netReport.nodes).map(([id, n]) => [id, n.degree])
		);

		expect(degs['zilia']).toBe(7);
		expect(degs['deterville']).toBe(4);
		expect(degs['celine']).toBe(4);
		expect(degs['aza']).toBe(3);
		expect(degs['mere']).toBe(3);
		expect(degs['aine']).toBe(2);
		expect(degs['espagnols']).toBe(2);
		expect(degs['amant']).toBe(1);
		expect(degs['china']).toBe(1);
		expect(degs['espagnole']).toBe(1);
		expect(degs['maitre']).toBe(1);
		expect(degs['religieux']).toBe(1);

		// Histogramme : 1: 5, 2: 2, 3: 2, 4: 2, 7: 1 => 5*1 + 2*2 + 2*3 + 2*4 + 1*7 = 5 + 4 + 6 + 8 + 7 = 30 !
		expect(structReport.metrics.degrees.histogram).toEqual({
			1: 5,
			2: 2,
			3: 2,
			4: 2,
			7: 1,
		});

		verifyGraphInvariants(
			'Graffigny',
			V,
			E,
			structReport.metrics.connectedComponentCount,
			degs,
			structReport.metrics.density,
			structReport.metrics.cycles.cycleCountEstimate,
			structReport.metrics.centralization.degreeCentralization
		);

		expect(structReport.metrics.centralization.degreeCentralization).toBeCloseTo(54 / 110, 5);
	});

	// ==========================================================================
	// 5. POT-BOUILLE (/pot-bouille)
	// ==========================================================================
	test('Pot-Bouille : V=17, E_typé=19, E_simple=19, sum(deg)=38, Freeman=64/240 ≈ 0.266667', () => {
		const { nodes, edges } = adaptPotBouilleCorpus(
			potBouilleCharacters,
			potBouilleRelationships,
			potBouilleEdgeTypes
		);
		const netReport = analyzeCharacterNetwork(nodes, edges);
		const structReport = analyzeNetworkStructure(nodes, edges);

		const V = structReport.analyzedNodeCount;
		const E = structReport.connectedPairCount;
		expect(V).toBe(17);
		expect(edges.length).toBe(19);
		expect(E).toBe(19);

		const degs = Object.fromEntries(
			Object.entries(netReport.nodes).map(([id, n]) => [id, n.degree])
		);

		// Deux sommets au maximum : Mouret (6) et Berthe (6)
		expect(degs['mouret']).toBe(6);
		expect(degs['berthe']).toBe(6);
		expect(degs['mme-josserand']).toBe(3);
		expect(degs['auguste-vabre']).toBe(3);
		expect(degs['vieux-vabre']).toBe(3);
		expect(degs['campardon']).toBe(2);
		expect(degs['clotilde-duveyrier']).toBe(2);
		expect(degs['m-josserand']).toBe(2);
		expect(degs['theophile-vabre']).toBe(2);
		expect(degs['valerie-vabre']).toBe(2);
		expect(degs['caroline-hedouin']).toBe(1);
		expect(degs['duveyrier']).toBe(1);
		expect(degs['gasparine']).toBe(1);
		expect(degs['gourd']).toBe(1);
		expect(degs['marie-pichon']).toBe(1);
		expect(degs['rachel']).toBe(1);
		expect(degs['saturnin']).toBe(1);

		// Histogramme : 1: 7, 2: 5, 3: 3, 6: 2 => 7 + 10 + 9 + 12 = 38 !
		expect(structReport.metrics.degrees.histogram).toEqual({
			1: 7,
			2: 5,
			3: 3,
			6: 2,
		});

		verifyGraphInvariants(
			'Pot-Bouille',
			V,
			E,
			structReport.metrics.connectedComponentCount,
			degs,
			structReport.metrics.density,
			structReport.metrics.cycles.cycleCountEstimate,
			structReport.metrics.centralization.degreeCentralization
		);

		expect(structReport.metrics.centralization.degreeCentralization).toBeCloseTo(64 / 240, 5);
	});

	// ==========================================================================
	// 6. ON NE BADINE PAS AVEC L'AMOUR (/on-ne-badine-pas-avec-l-amour)
	// ==========================================================================
	test('Musset : V=8, E_typé=12, E_simple=10, sum(deg)=20, Freeman=12/42 ≈ 0.285714', () => {
		const mussetNodes = [
			{ id: 'perdican', label: 'Perdican', caption: '' },
			{ id: 'camille', label: 'Camille', caption: '' },
			{ id: 'rosette', label: 'Rosette', caption: '' },
			{ id: 'baron', label: 'Le Baron', caption: '' },
			{ id: 'dame-pluche', label: 'Dame Pluche', caption: '' },
			{ id: 'blazius', label: 'Maître Blazius', caption: '' },
			{ id: 'bridaine', label: 'Maître Bridaine', caption: '' },
			{ id: 'choeur', label: 'Le Chœur', caption: '' },
		] as any[];

		const mussetRels = [
			{ source: 'perdican', target: 'camille', type: 'love', label: '', description: '' },
			{ source: 'perdican', target: 'rosette', type: 'manipulation', label: '', description: '' },
			{ source: 'camille', target: 'rosette', type: 'family', label: '', description: '' },
			{ source: 'baron', target: ['perdican', 'camille'], type: 'marriage', label: '', description: '' },
			{ source: 'baron', target: 'perdican', type: 'family', label: '', description: '' },
			{ source: 'baron', target: 'camille', type: 'family', label: '', description: '' },
			{ source: 'baron', target: 'bridaine', type: 'friendship', label: '', description: '' },
			{ source: 'dame-pluche', target: 'camille', type: 'influence', label: '', description: '' },
			{ source: 'blazius', target: 'perdican', type: 'education', label: '', description: '' },
			{ source: 'blazius', target: 'bridaine', type: 'rivalry', label: '', description: '' },
			{ source: 'choeur', target: 'rosette', type: 'collective-observation', label: '', description: '' },
		] as any[];

		const { nodes, edges } = adaptMussetCorpus(mussetNodes, mussetRels, {});
		const netReport = analyzeCharacterNetwork(nodes, edges);
		const structReport = analyzeNetworkStructure(nodes, edges);

		const V = structReport.analyzedNodeCount;
		const E = structReport.connectedPairCount;
		expect(V).toBe(8);
		expect(edges.length).toBe(12); // 11 entrées dont 1 hyper-cible éclatée en 2 => 12 relations
		expect(E).toBe(10); // 10 paires simples après fusion de baron-perdican et baron-camille

		const degs = Object.fromEntries(
			Object.entries(netReport.nodes).map(([id, n]) => [id, n.degree])
		);

		// Les 8 sommets réels
		expect(degs['perdican']).toBe(4);
		expect(degs['camille']).toBe(4);
		expect(degs['baron']).toBe(3);
		expect(degs['rosette']).toBe(3);
		expect(degs['blazius']).toBe(2);
		expect(degs['bridaine']).toBe(2);
		expect(degs['dame-pluche']).toBe(1);
		expect(degs['choeur']).toBe(1);

		// Histogramme : 1: 2, 2: 2, 3: 2, 4: 2 => 2*1 + 2*2 + 2*3 + 2*4 = 2 + 4 + 6 + 8 = 20 !
		expect(structReport.metrics.degrees.histogram).toEqual({
			1: 2,
			2: 2,
			3: 2,
			4: 2,
		});

		verifyGraphInvariants(
			'Musset',
			V,
			E,
			structReport.metrics.connectedComponentCount,
			degs,
			structReport.metrics.density,
			structReport.metrics.cycles.cycleCountEstimate,
			structReport.metrics.centralization.degreeCentralization
		);

		expect(structReport.metrics.centralization.degreeCentralization).toBeCloseTo(12 / 42, 5);
	});

	// ==========================================================================
	// 7. BALZAC / RIMBAUD (/balzac-rimbaud)
	// ==========================================================================
	test('Balzac/Rimbaud : V=5, E_typé=5, E_simple=5, sum(deg)=10, Freeman=0.0 (cycle strict C_5)', () => {
		const figures = [
			{ id: 'balzac', label: 'Balzac' },
			{ id: 'rastignac', label: 'Rastignac' },
			{ id: 'rimbaud', label: 'Rimbaud' },
			{ id: 'commune', label: 'Commune' },
			{ id: 'marx', label: 'Marx' },
		];
		const rels = [
			{ id: '1', source: 'balzac', target: 'rastignac', type: 'direct', label: '', explanation: '' },
			{ id: '2', source: 'balzac', target: 'marx', type: 'comparison', label: '', explanation: '' },
			{ id: '3', source: 'commune', target: 'marx', type: 'direct', label: '', explanation: '' },
			{ id: '4', source: 'commune', target: 'rimbaud', type: 'direct', label: '', explanation: '' },
			{ id: '5', source: 'rastignac', target: 'rimbaud', type: 'contrast', label: '', explanation: '' },
		];

		const { nodes, edges } = adaptBalzacRimbaudCorpus(figures, rels);
		const netReport = analyzeCharacterNetwork(nodes, edges);
		const structReport = analyzeNetworkStructure(nodes, edges);

		const V = structReport.analyzedNodeCount;
		const E = structReport.connectedPairCount;
		expect(V).toBe(5);
		expect(edges.length).toBe(5);
		expect(E).toBe(5);

		const degs = Object.fromEntries(
			Object.entries(netReport.nodes).map(([id, n]) => [id, n.degree])
		);

		for (const id of ['balzac', 'rastignac', 'rimbaud', 'commune', 'marx']) {
			expect(degs[id]).toBe(2);
		}

		// Histogramme : 2: 5 => 5*2 = 10 !
		expect(structReport.metrics.degrees.histogram).toEqual({
			2: 5,
		});

		verifyGraphInvariants(
			'Balzac-Rimbaud',
			V,
			E,
			structReport.metrics.connectedComponentCount,
			degs,
			structReport.metrics.density,
			structReport.metrics.cycles.cycleCountEstimate,
			structReport.metrics.centralization.degreeCentralization
		);

		expect(structReport.metrics.centralization.degreeCentralization).toBe(0.0);
	});
});
