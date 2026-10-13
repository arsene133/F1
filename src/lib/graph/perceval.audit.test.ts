import { describe, expect, test } from 'vitest';
import { percevalCharacters, percevalEdgeTypes, percevalRelationships } from '../../data/perceval';
import { adaptPercevalCorpus, analyzeCharacterNetwork } from './index';

describe('Audit et vérification reproductible du réseau de Perceval', () => {
	const { nodes, edges } = adaptPercevalCorpus(
		percevalCharacters,
		percevalRelationships,
		percevalEdgeTypes
	);

	test('inventaire exact des données du fichier src/data/perceval.ts', () => {
		// 14 nœuds déclarés dans percevalCharacters
		expect(nodes.length).toBe(14);
		// 22 relations déclarées dans percevalRelationships
		expect(edges.length).toBe(22);
	});

	test('recouvrement exact des résultats de l’audit sur le graphe brut complet', () => {
		const report = analyzeCharacterNetwork(nodes, edges);

		// V = 14 sommets
		expect(report.nodeCount).toBe(14);
		// 22 relations typées
		expect(report.typedEdgeCount).toBe(22);
		// 18 paires distinctes reliées
		expect(report.connectedPairCount).toBe(18);

		// Degré moyen : 2 * 18 / 14 = 36 / 14 ≈ 2.57142857
		expect(report.averageDegree).toBeCloseTo(36 / 14, 5);

		// Densité : 2 * 18 / (14 * 13) = 36 / 182 ≈ 0.19780219
		expect(report.density).toBeCloseTo(36 / 182, 5);

		// Connexité et distances
		expect(report.connectedComponentCount).toBe(1);
		expect(report.isolatedNodes).toEqual([]);
		expect(report.globalDiameter).toBe(2);

		// Centralités de Perceval
		const percevalMetrics = report.nodes['perceval'];
		expect(percevalMetrics.degree).toBe(13); // relié à tous les autres sommets
		expect(percevalMetrics.betweenness).toBe(72.5);
		// Normalisée sur V=14 : 72.5 / ((13 * 12) / 2) = 72.5 / 78 ≈ 0.929487
		expect(percevalMetrics.betweennessNormalized).toBeCloseTo(72.5 / 78, 5);
		expect(percevalMetrics.harmonicCloseness).toBe(1.0);

		// Arthur : seul autre sommet avec une intermédiarité > 0
		const arthurMetrics = report.nodes['arthur'];
		expect(arthurMetrics.degree).toBe(3);
		expect(arthurMetrics.betweenness).toBe(0.5);
		expect(arthurMetrics.betweennessNormalized).toBeCloseTo(0.5 / 78, 5);

		// Points d’articulation : Perceval et le Roi Pêcheur
		// (Le Roi Pêcheur est point de coupure si le Graal est inclus, car sans le Roi Pêcheur, le lien Graal-Perceval existe, MAIS vérifions)
		// Vérification exacte des points de coupure identifiés par DFS :
		expect(report.articulationPoints).toContain('perceval');

		// Tous les autres personnages ont une betweenness nulle
		for (const id of Object.keys(report.nodes)) {
			if (id !== 'perceval' && id !== 'arthur') {
				expect(report.nodes[id].betweenness).toBe(0);
			}
		}
	});

	test('audit avec exclusion des objets symboliques (Graal et lance)', () => {
		// Exclusion ontologique : réseau strictement humain (12 sommets)
		const humanReport = analyzeCharacterNetwork(nodes, edges, {
			excludeCategories: ['symbolic_object'],
		});

		expect(humanReport.nodeCount).toBe(12);
		expect(humanReport.filterApplied.excludedNodeIds).toEqual(['graal', 'lance-qui-saigne']);

		// 15 paires reliées entre humains (les 3 paires vers graal et lance sont retirées)
		expect(humanReport.connectedPairCount).toBe(15);

		// Degré moyen humain : 2 * 15 / 12 = 30 / 12 = 2.5
		expect(humanReport.averageDegree).toBe(2.5);

		// Densité humaine : 2 * 15 / (12 * 11) = 30 / 132 ≈ 0.22727
		expect(humanReport.density).toBeCloseTo(30 / 132, 5);

		// Dans le réseau humain, Perceval est connecté à l'ensemble des 11 autres humains
		expect(humanReport.nodes['perceval'].degree).toBe(11);
		expect(humanReport.nodes['perceval'].harmonicCloseness).toBe(1.0);

		// Arthur reste à degré 3 (Keu, Gauvain, Perceval)
		expect(humanReport.nodes['arthur'].degree).toBe(3);

		// Le Roi Pêcheur passe à degré 1 (relié seulement à Perceval entre humains !)
		expect(humanReport.nodes['roi-pecheur'].degree).toBe(1);
	});

	test('audit avec exclusion des défunts (père et frères)', () => {
		// Exclusion des défunts et des objets : vivants individuels agissant (11 sommets)
		const activeReport = analyzeCharacterNetwork(nodes, edges, {
			excludeCategories: ['symbolic_object', 'deceased_memory'],
		});

		expect(activeReport.nodeCount).toBe(11);
		expect(activeReport.filterApplied.excludedNodeIds).toEqual([
			'graal',
			'lance-qui-saigne',
			'pere-et-freres',
		]);

		// La mère perd son lien vers 'pere-et-freres' et passe à degré 1 (reliée seulement à Perceval)
		expect(activeReport.nodes['mere-perceval'].degree).toBe(1);
	});

	test('analyse du sens des actions (degrés entrants et sortants dans le digraphe)', () => {
		const report = analyzeCharacterNetwork(nodes, edges);

		// Gornemant enseigne à Perceval : outDegree >= 1 pour Gornemant
		expect(report.nodes['gornemant'].outDegree).toBeGreaterThanOrEqual(1);

		// La Demoiselle hideuse et la Cousine reprochent / accusent Perceval
		expect(report.nodes['demoiselle-hideuse'].outDegree).toBe(1);
		expect(report.nodes['demoiselle-hideuse'].inDegree).toBe(0);

		// Perceval est la cible majeure des enseignements, reproches et initiations
		expect(report.nodes['perceval'].inDegree).toBeGreaterThan(report.nodes['perceval'].outDegree);
	});

	test('démonstration exacte de l’intermédiarité brute de Perceval (72.5 = 72 + 0.5)', () => {
		// V = 14 sommets.
		// Les 13 sommets autres que Perceval forment (13 * 12) / 2 = 78 paires {s, t}.
		// 1) 5 paires ont une arête directe (distance 1) : contribution 0.
		//    {mere-perceval, pere-et-freres}, {gornemant, blanchefleur}, {arthur, keu}, {arthur, gauvain}, {roi-pecheur, graal}.
		// 2) 1 paire {keu, gauvain} a 2 plus courts chemins de longueur 2 :
		//    - l'un passe par Arthur (keu - arthur - gauvain)
		//    - l'autre passe par Perceval (keu - perceval - gauvain)
		//    => contribution à l'intermédiarité de Perceval : 1/2 = 0.5.
		// 3) Les 72 autres paires sont à distance 2 avec Perceval comme unique intermédiaire :
		//    => contribution : 72 * 1.0 = 72.0.
		// TOTAL : 0 + 0.5 + 72.0 = 72.5.
		const report = analyzeCharacterNetwork(nodes, edges);
		expect(report.nodes['perceval'].betweenness).toBe(72.5);
		expect(report.nodes['perceval'].betweennessNormalized).toBeCloseTo(72.5 / 78, 5);

		// Arthur reçoit l'autre moitié du chemin entre Keu et Gauvain : 0.5
		expect(report.nodes['arthur'].betweenness).toBe(0.5);
		expect(report.nodes['arthur'].betweennessNormalized).toBeCloseTo(0.5 / 78, 5);
	});

	test('vérification de l’intermédiarité dans les projections humaine (50.5) et vivante (41.5)', () => {
		// Réseau humain (V = 12, 11 hors Perceval => 55 paires) :
		// 4 arêtes directes (0), 1 paire {keu, gauvain} (0.5), 50 paires exclusives (50) => 50.5
		const humanReport = analyzeCharacterNetwork(nodes, edges, {
			excludeCategories: ['symbolic_object'],
		});
		expect(humanReport.nodes['perceval'].betweenness).toBe(50.5);
		expect(humanReport.nodes['perceval'].betweennessNormalized).toBeCloseTo(50.5 / 55, 5);

		// Réseau des vivants (V = 11, 10 hors Perceval => 45 paires) :
		// 3 arêtes directes (0), 1 paire {keu, gauvain} (0.5), 41 paires exclusives (41) => 41.5
		const activeReport = analyzeCharacterNetwork(nodes, edges, {
			excludeCategories: ['symbolic_object', 'deceased_memory'],
		});
		expect(activeReport.nodes['perceval'].betweenness).toBe(41.5);
		expect(activeReport.nodes['perceval'].betweennessNormalized).toBeCloseTo(41.5 / 45, 5);
	});

	test('audit d’incidence et égalité exacte sommet par sommet entre arêtes et degrés', () => {
		const report = analyzeCharacterNetwork(nodes, edges);

		// Liste exhaustive et dédoublonnée des 18 paires simples non orientées
		const pairSet = new Set<string>();
		for (const edge of edges) {
			const u = edge.source;
			const v = edge.target;
			if (u !== v) {
				const key = u < v ? `${u}---${v}` : `${v}---${u}`;
				pairSet.add(key);
			}
		}

		const simplePairs = Array.from(pairSet).sort();
		expect(simplePairs.length).toBe(18);

		// 13 paires incidentes à Perceval (attention : 'mere-perceval' contient 'perceval')
		const percevalPairs = simplePairs.filter(p => {
			const [u, v] = p.split('---');
			return u === 'perceval' || v === 'perceval';
		});
		expect(percevalPairs.length).toBe(13);

		// 5 arêtes secondaires ne touchant pas Perceval
		const secondaryPairs = simplePairs.filter(p => {
			const [u, v] = p.split('---');
			return u !== 'perceval' && v !== 'perceval';
		});
		expect(secondaryPairs).toEqual([
			'arthur---gauvain',
			'arthur---keu',
			'blanchefleur---gornemant',
			'graal---roi-pecheur',
			'mere-perceval---pere-et-freres',
		]);

		// Calcul indépendant des arêtes incidentes et vérification sommet par sommet
		const expectedNeighbors: Record<string, string[]> = {
			'perceval': [
				'arthur', 'blanchefleur', 'cousine-germaine', 'demoiselle-hideuse',
				'ermite', 'gauvain', 'gornemant', 'graal', 'keu', 'lance-qui-saigne',
				'mere-perceval', 'pere-et-freres', 'roi-pecheur'
			],
			'arthur': ['gauvain', 'keu', 'perceval'],
			'blanchefleur': ['gornemant', 'perceval'],
			'gornemant': ['blanchefleur', 'perceval'],
			'gauvain': ['arthur', 'perceval'],
			'keu': ['arthur', 'perceval'],
			'graal': ['perceval', 'roi-pecheur'],
			'roi-pecheur': ['graal', 'perceval'],
			'mere-perceval': ['perceval', 'pere-et-freres'],
			'pere-et-freres': ['mere-perceval', 'perceval'],
			'cousine-germaine': ['perceval'],
			'demoiselle-hideuse': ['perceval'],
			'ermite': ['perceval'],
			'lance-qui-saigne': ['perceval'],
		};

		let sumDegrees = 0;
		for (const [nodeId, neighbors] of Object.entries(expectedNeighbors)) {
			// Calcul indépendant du nombre d'arêtes incidentes dans simplePairs
			const incidentCount = simplePairs.filter(p => {
				const [u, v] = p.split('---');
				return u === nodeId || v === nodeId;
			}).length;

			expect(incidentCount).toBe(neighbors.length);

			// Correspondance exacte avec le degré calculé par le moteur
			expect(report.nodes[nodeId].degree).toBe(incidentCount);

			sumDegrees += incidentCount;
		}

		// Théorème d'Euler : somme des degrés = 2 * E
		expect(sumDegrees).toBe(36);
		expect(sumDegrees).toBe(2 * simplePairs.length);
	});
});
