import { describe, expect, test } from 'vitest';
import {
	goriotCharacters,
	goriotGuidedTracks,
	goriotNarrativeStages,
	goriotRelCategories,
	goriotRelationships,
	goriotStructuralClusters,
	type GoriotRelationshipCategory,
	type NarrativeStage,
} from './goriot-relationships';

describe('Modèle de données des relations du Père Goriot (src/data/goriot-relationships.ts)', () => {
	test('tous les personnages ont des identifiants uniques et non vides', () => {
		const ids = goriotCharacters.map((c) => c.id);
		const uniqueIds = new Set(ids);
		expect(ids.length).toBe(uniqueIds.size);
		expect(ids.length).toBe(16); // 16 personnages essentiels
		ids.forEach((id) => {
			expect(id.trim()).not.toBe('');
		});
	});

	test('contient exactement la liste des personnages obligatoires sans doublon Bianchon', () => {
		const ids = goriotCharacters.map((c) => c.id);
		expect(ids).toContain('rastignac');
		expect(ids).toContain('goriot');
		expect(ids).toContain('anastasie');
		expect(ids).toContain('delphine');
		expect(ids).toContain('vautrin');
		expect(ids).toContain('victorine');
		expect(ids).toContain('mme-vauquer');
		expect(ids).toContain('sylvie');
		expect(ids).toContain('christophe');
		expect(ids).toContain('bianchon'); // Horace Bianchon unifié
		expect(ids).toContain('mme-de-beauseant');
		expect(ids).toContain('baron-nucingen');
		expect(ids).toContain('comte-restaud');
		expect(ids).toContain('m-taillefer');
		expect(ids).toContain('poiret');
		expect(ids).toContain('michonneau');
	});

	test('toutes les relations référencent des personnages existants aux deux extrémités', () => {
		const characterIds = new Set(goriotCharacters.map((c) => c.id));
		goriotRelationships.forEach((r) => {
			expect(characterIds.has(r.source), `Source inconnue : ${r.source}`).toBe(true);
			expect(characterIds.has(r.target), `Cible inconnue : ${r.target}`).toBe(true);
			expect(r.source).not.toBe(r.target); // pas d'auto-relation
		});
	});

	test('tous les identifiants de relations sont uniques', () => {
		const relIds = goriotRelationships.map((r) => r.id);
		const uniqueRelIds = new Set(relIds);
		expect(relIds.length).toBe(uniqueRelIds.size);
	});

	test('chaque relation appartient à une catégorie valide de goriotRelCategories', () => {
		const validCategories = Object.keys(goriotRelCategories) as GoriotRelationshipCategory[];
		expect(validCategories).toEqual([
			'family',
			'love',
			'financial',
			'influence',
			'solidarity',
			'conflict',
			'domestic',
		]);

		goriotRelationships.forEach((r) => {
			expect(validCategories).toContain(r.category);
		});
	});

	test('chaque catégorie possède au moins une relation concrète', () => {
		const validCategories = Object.keys(goriotRelCategories) as GoriotRelationshipCategory[];
		validCategories.forEach((cat) => {
			const relsInCat = goriotRelationships.filter((r) => r.category === cat);
			expect(relsInCat.length, `Catégorie sans relation : ${cat}`).toBeGreaterThanOrEqual(2);
		});
	});

	test('chaque relation possède une description, un résumé court et un contexte narratif', () => {
		goriotRelationships.forEach((r) => {
			expect(r.shortSummary.trim().length).toBeGreaterThan(10);
			expect(r.description.trim().length).toBeGreaterThan(25);
			expect(r.narrativeContext.trim().length).toBeGreaterThan(10);
			expect(['certitude_historique', 'deduction_solide', 'interpretation_critique']).toContain(r.certainty);
		});
	});

	test('les citations de personnages et relations sont vérifiées et non vides', () => {
		const charactersWithQuotes = goriotCharacters.filter((c) => c.quote);
		expect(charactersWithQuotes.length).toBeGreaterThanOrEqual(4);
		charactersWithQuotes.forEach((c) => {
			expect(c.quote!.text.length).toBeGreaterThan(5);
			expect(c.quote!.reference.length).toBeGreaterThan(5);
		});

		const relsWithQuotes = goriotRelationships.filter((r) => r.textualQuote);
		expect(relsWithQuotes.length).toBeGreaterThanOrEqual(5);
		relsWithQuotes.forEach((r) => {
			expect(r.textualQuote!.text.length).toBeGreaterThan(10);
			expect(r.textualQuote!.reference.length).toBeGreaterThan(5);
		});
	});

	test('les 4 étapes narratives sont ordonnées de la 1 à la 4', () => {
		expect(goriotNarrativeStages.length).toBe(4);
		expect(goriotNarrativeStages.map((s) => s.num)).toEqual([1, 2, 3, 4]);

		const stageIds = goriotNarrativeStages.map((s) => s.id) as NarrativeStage[];
		goriotRelationships.forEach((r) => {
			expect(stageIds).toContain(r.firstEstablishedStage);
		});
	});

	test('les parcours guidés référencent des personnages et relations existants', () => {
		const characterIds = new Set(goriotCharacters.map((c) => c.id));
		const relIds = new Set(goriotRelationships.map((r) => r.id));

		expect(goriotGuidedTracks.length).toBe(4);
		goriotGuidedTracks.forEach((track) => {
			expect(track.focusNodeIds.length).toBeGreaterThanOrEqual(4);
			track.focusNodeIds.forEach((nid) => {
				// Note: attention à vauquer vs mme-vauquer
				expect(characterIds.has(nid), `Nœud inconnu dans le parcours ${track.id} : ${nid}`).toBe(true);
			});
			track.highlightRelIds.forEach((rid) => {
				expect(relIds.has(rid), `Relation inconnue dans le parcours ${track.id} : ${rid}`).toBe(true);
			});
		});
	});

	test('chaque personnage est connecté au réseau par au moins une relation', () => {
		const connected = new Set<string>();
		goriotRelationships.forEach((r) => {
			connected.add(r.source);
			connected.add(r.target);
		});
		goriotCharacters.forEach((c) => {
			expect(connected.has(c.id), `Personnage orphelin : ${c.id}`).toBe(true);
		});
	});

	describe('Structure en noyau relationnel, satellites et périphérie', () => {
		test('définit exactement 1 noyau, 4 satellites et 1 groupe périphérique', () => {
			expect(goriotStructuralClusters.length).toBe(6);
			const cores = goriotStructuralClusters.filter((c) => c.type === 'core');
			const satellites = goriotStructuralClusters.filter((c) => c.type === 'satellite');
			const peripherals = goriotStructuralClusters.filter((c) => c.type === 'peripheral');

			expect(cores.length).toBe(1);
			expect(satellites.length).toBe(4);
			expect(peripherals.length).toBe(1);

			expect(satellites.map((s) => s.id)).toEqual([
				'satellite-restaud',
				'satellite-domesticite',
				'satellite-taillefer',
				'satellite-delateurs',
			]);
		});

		test('tous les 16 personnages sont partitionnés sans doublon dans les clusters', () => {
			const allClusterNodeIds = goriotStructuralClusters.flatMap((c) => c.nodeIds);
			expect(allClusterNodeIds.length).toBe(16);
			expect(new Set(allClusterNodeIds).size).toBe(16);

			const characterIds = new Set(goriotCharacters.map((c) => c.id));
			allClusterNodeIds.forEach((id) => {
				expect(characterIds.has(id)).toBe(true);
			});

			goriotCharacters.forEach((char) => {
				const cluster = goriotStructuralClusters.find((c) => c.nodeIds.includes(char.id));
				expect(cluster, `Personnage sans cluster : ${char.id}`).toBeDefined();
				expect(char.clusterId).toBe(cluster!.id);
			});
		});

		test('chaque satellite a des points de rattachement valides situés dans le noyau', () => {
			const coreCluster = goriotStructuralClusters.find((c) => c.type === 'core')!;
			const coreNodeSet = new Set(coreCluster.nodeIds);

			const satellites = goriotStructuralClusters.filter((c) => c.type === 'satellite');
			satellites.forEach((sat) => {
				expect(sat.attachmentPointNodeIds.length, `Satellite sans point de rattachement : ${sat.id}`).toBeGreaterThanOrEqual(1);
				sat.attachmentPointNodeIds.forEach((pivotId) => {
					expect(coreNodeSet.has(pivotId), `Point pivot ${pivotId} hors du noyau pour ${sat.id}`).toBe(true);
				});

				// Les liens de rattachement existent réellement dans les données
				sat.attachmentEdgeIds.forEach((edgeId) => {
					const rel = goriotRelationships.find((r) => r.id === edgeId);
					expect(rel, `Lien de rattachement inexistant : ${edgeId}`).toBeDefined();
					// L'un des bouts est dans le satellite et l'autre est un pivot du noyau
					const isConnecting =
						(sat.nodeIds.includes(rel!.source) && sat.attachmentPointNodeIds.includes(rel!.target)) ||
						(sat.nodeIds.includes(rel!.target) && sat.attachmentPointNodeIds.includes(rel!.source));
					expect(isConnecting, `Le lien ${edgeId} ne relie pas ${sat.id} à ses points pivots`).toBe(true);
				});
			});
		});

		test('tous les nœuds sont inscrits dans les limites du canevas bureau (900x560) et mobile (360x860)', () => {
			goriotCharacters.forEach((c) => {
				// Canvases: bureau [50, 850] x [25, 535], mobile [30, 330] x [30, 830]
				expect(c.x).toBeGreaterThanOrEqual(40);
				expect(c.x).toBeLessThanOrEqual(860);
				expect(c.y).toBeGreaterThanOrEqual(25);
				expect(c.y).toBeLessThanOrEqual(535);

				expect(c.mx).toBeGreaterThanOrEqual(30);
				expect(c.mx).toBeLessThanOrEqual(330);
				expect(c.my).toBeGreaterThanOrEqual(30);
				expect(c.my).toBeLessThanOrEqual(830);
			});
		});

		test('la disposition du réseau ne présente aucun croisement de liens (0 croisement bureau et mobile)', () => {
			const nodeMap = new Map(goriotCharacters.map((c) => [c.id, c]));

			// Récupération des paires d'arêtes sans sommet commun
			const edgePairs: [typeof goriotRelationships[0], typeof goriotRelationships[0]][] = [];
			for (let i = 0; i < goriotRelationships.length; i++) {
				for (let j = i + 1; j < goriotRelationships.length; j++) {
					const e1 = goriotRelationships[i];
					const e2 = goriotRelationships[j];
					const endpoints1 = new Set([e1.source, e1.target]);
					if (!endpoints1.has(e2.source) && !endpoints1.has(e2.target)) {
						edgePairs.push([e1, e2]);
					}
				}
			}

			function ccw(p1: { x: number; y: number }, p2: { x: number; y: number }, p3: { x: number; y: number }) {
				return (p3.y - p1.y) * (p2.x - p1.x) > (p2.y - p1.y) * (p3.x - p1.x);
			}

			function intersect(
				p1: { x: number; y: number },
				p2: { x: number; y: number },
				p3: { x: number; y: number },
				p4: { x: number; y: number }
			) {
				return ccw(p1, p3, p4) !== ccw(p2, p3, p4) && ccw(p1, p2, p3) !== ccw(p1, p2, p4);
			}

			// Vérification Bureau (900x560)
			const desktopCrossings: string[] = [];
			edgePairs.forEach(([e1, e2]) => {
				const n1 = nodeMap.get(e1.source)!;
				const n2 = nodeMap.get(e1.target)!;
				const n3 = nodeMap.get(e2.source)!;
				const n4 = nodeMap.get(e2.target)!;
				if (intersect({ x: n1.x, y: n1.y }, { x: n2.x, y: n2.y }, { x: n3.x, y: n3.y }, { x: n4.x, y: n4.y })) {
					desktopCrossings.push(`${e1.id} x ${e2.id}`);
				}
			});
			expect(desktopCrossings, `Croisements bureau détectés : ${desktopCrossings.join(', ')}`).toEqual([]);

			// Vérification Mobile (360x860)
			const mobileCrossings: string[] = [];
			edgePairs.forEach(([e1, e2]) => {
				const n1 = nodeMap.get(e1.source)!;
				const n2 = nodeMap.get(e1.target)!;
				const n3 = nodeMap.get(e2.source)!;
				const n4 = nodeMap.get(e2.target)!;
				if (intersect({ x: n1.mx, y: n1.my }, { x: n2.mx, y: n2.my }, { x: n3.mx, y: n3.my }, { x: n4.mx, y: n4.my })) {
					mobileCrossings.push(`${e1.id} x ${e2.id}`);
				}
			});
			expect(mobileCrossings, `Croisements mobile détectés : ${mobileCrossings.join(', ')}`).toEqual([]);
		});

		test('les descriptions de satellites et périphérie respectent rigoureusement les faits littéraires', () => {
			const restaud = goriotStructuralClusters.find((c) => c.id === 'satellite-restaud')!;
			expect(restaud.description).toContain('Maxime de Trailles');
			expect(restaud.description).toContain('sacrifice paternel');

			const domesticite = goriotStructuralClusters.find((c) => c.id === 'satellite-domesticite')!;
			expect(domesticite.description).toContain('Mme Vauquer');
			expect(domesticite.description).toContain('Christophe');

			const taillefer = goriotStructuralClusters.find((c) => c.id === 'satellite-taillefer')!;
			expect(taillefer.description).toContain('Victorine');
			expect(taillefer.description).toContain('Rastignac');
			expect(taillefer.description).toContain('Vautrin');

			const delateurs = goriotStructuralClusters.find((c) => c.id === 'satellite-delateurs')!;
			expect(delateurs.description).toContain('Michonneau');
			expect(delateurs.description).toContain('Poiret');
			expect(delateurs.description).toContain('3 000 francs');

			const nucingen = goriotStructuralClusters.find((c) => c.id === 'peripheral-nucingen')!;
			expect(nucingen.description).toContain('Delphine de Nucingen');
		});
	});
});
