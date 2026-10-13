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
	analyzeNetworkStructure,
} from './index';

describe('Audit structurel de Perceval et comparaison typologique multi-œuvres', () => {
	// ==========================================================================
	// 1. Audit structurel approfondi de Perceval (/perceval)
	// ==========================================================================
	describe('Perceval (/perceval) — Audit de forme', () => {
		const { nodes, edges } = adaptPercevalCorpus(
			percevalCharacters,
			percevalRelationships,
			percevalEdgeTypes
		);

		test('le graphe complet n’est PAS une étoile stricte mais un réseau fortement centré', () => {
			const report = analyzeNetworkStructure(nodes, edges);

			// 1. Formes exactes
			expect(report.exactShapes).not.toContain('star'); // Pas une étoile stricte car 5 arêtes relient d'autres nœuds !
			expect(report.exactShapes).not.toContain('tree'); // Contient des cycles (nombre cyclomatique = 18 - 14 + 1 = 5)
			expect(report.exactShapes).not.toContain('bipartite'); // Contient des triangles ({perceval, arthur, keu}, etc.)
			expect(report.metrics.cycles.hasCycles).toBe(true);
			expect(report.metrics.cycles.cycleCountEstimate).toBe(5);

			// 2. Profils descriptifs
			expect(report.descriptiveProfiles).toContain('highly_centralized');
			expect(report.descriptiveProfiles).toContain('single_hub_dominated');
			expect(report.descriptiveProfiles).toContain('sparse'); // Densité 0.198 < 0.25

			// 3. Centralisation de Freeman et domination de Perceval
			expect(report.metrics.centralization.degreeCentralization).toBeGreaterThan(0.8);
			expect(report.roles.dominantHubs).toEqual(['perceval']);
			expect(report.roles.leaves).toEqual([
				'ermite',
				'lance-qui-saigne',
				'cousine-germaine',
				'demoiselle-hideuse',
			]);

			// 4. Synthèse pédagogique
			expect(report.pedagogicalSynthesis.shapeTitle).toContain('étoile avec ramifications');
			expect(report.pedagogicalSynthesis.description.toLowerCase()).toContain('perceval');
		});

		test('impact de l’exclusion du Graal et de la lance (réseau humain, V=12)', () => {
			const report = analyzeNetworkStructure(nodes, edges, {
				excludeCategories: ['symbolic_object'],
			});

			expect(report.analyzedNodeCount).toBe(12);
			expect(report.filterApplied.excludedNodeIds).toEqual(['graal', 'lance-qui-saigne']);
			expect(report.exactShapes).not.toContain('star');
			expect(report.descriptiveProfiles).toContain('single_hub_dominated');

			// Le Roi Pêcheur devient une feuille (degré 1) connectée uniquement à Perceval
			expect(report.roles.leaves).toContain('roi-pecheur');
		});

		test('impact de l’exclusion des défunts (père et frères) : vivants (V=11)', () => {
			const report = analyzeNetworkStructure(nodes, edges, {
				excludeCategories: ['symbolic_object', 'deceased_memory'],
			});

			expect(report.analyzedNodeCount).toBe(11);
			expect(report.filterApplied.excludedNodeIds).toEqual([
				'graal',
				'lance-qui-saigne',
				'pere-et-freres',
			]);

			// La mère devient une feuille (degré 1)
			expect(report.roles.leaves).toContain('mere-perceval');
			expect(report.roles.dominantHubs).toEqual(['perceval']);
		});
	});

	// ==========================================================================
	// 2. Comparaison structurelle avec les autres œuvres du site
	// ==========================================================================
	describe('Comparaison structurelle des corpus existants', () => {
		// A. Balzac - Le Père Goriot
		test('Le Père Goriot (/goriot) : réseau distribué bourgeois, noyau Rastignac-Goriot-Pension', () => {
			const { nodes, edges } = adaptGoriotCorpus(goriotCharacters, goriotRelationships);
			const report = analyzeNetworkStructure(nodes, edges);

			expect(report.analyzedNodeCount).toBe(16);
			expect(report.analyzedEdgeCount).toBe(23);
			// Goriot n'est PAS centré sur un seul sommet exclusif :
			// Rastignac et Goriot se partagent la centralité avec Vautrin et Mme de Beauséant
			expect(report.exactShapes).not.toContain('star');
			expect(report.descriptiveProfiles).toContain('core_periphery');
			expect(report.metrics.cycles.hasCycles).toBe(true);
		});

		// B. Molière - Dom Juan
		test('Dom Juan (/don-juan) : étoile quasi-pure centrée sur le séducteur libertin', () => {
			const { nodes, edges } = adaptDomJuanCorpus(
				domJuanCharacters,
				domJuanRelationships,
				domJuanEdgeTypes
			);
			const report = analyzeNetworkStructure(nodes, edges);

			expect(report.analyzedNodeCount).toBe(8);
			expect(report.analyzedEdgeCount).toBe(7);
			// Dom Juan est relié aux 7 autres personnages, et AUCUN personnage secondaire ne se parle !
			// C'est donc mathématiquement une ÉTOILE STRICTE S_8 !
			expect(report.exactShapes).toContain('star');
			expect(report.exactShapes).toContain('tree');
			expect(report.exactShapes).toContain('bipartite');
			expect(report.roles.dominantHubs).toEqual(['dom-juan']);
			expect(report.roles.leaves.length).toBe(7);
		});

		// C. Graffigny - Lettres d'une Péruvienne
		test('Graffigny (/graffigny) : réseau épistolaire bipolaire (Zilia & Déterville)', () => {
			const { nodes, edges } = adaptGraffignyCorpus(
				graffignyCharacters,
				graffignyRelationships,
				graffignyEdgeTypes
			);
			const report = analyzeNetworkStructure(nodes, edges);

			expect(report.analyzedNodeCount).toBe(12);
			expect(report.analyzedEdgeCount).toBe(20);
			// Bipolaire : Zilia au centre de l'écriture, Déterville au centre de la famille française
			expect(report.exactShapes).not.toContain('star');
			expect(report.descriptiveProfiles).toContain('core_periphery');
		});

		// D. Zola - Pot-Bouille
		test('Pot-Bouille (/pot-bouille) : structure en grappes familiales et adultérines dans l’immeuble', () => {
			const { nodes, edges } = adaptPotBouilleCorpus(
				potBouilleCharacters,
				potBouilleRelationships,
				potBouilleEdgeTypes
			);
			const report = analyzeNetworkStructure(nodes, edges);

			expect(report.analyzedNodeCount).toBe(17);
			expect(report.analyzedEdgeCount).toBe(19);
			// Réseau naturaliste complexe avec cycles familiaux (Josserand, Vabre, Campardon)
			expect(report.exactShapes).not.toContain('star');
			expect(report.metrics.cycles.hasCycles).toBe(true);
		});

		// E. Musset - On ne badine pas avec l'amour
		test('Musset (/on-ne-badine-pas-avec-l-amour) : triangle dramatique et sous-groupes comiques', () => {
			// On reconstitue les nœuds et relations depuis la page Musset
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
			const report = analyzeNetworkStructure(nodes, edges);

			expect(report.analyzedNodeCount).toBe(8);
			// Perdican, Camille et Rosette forment le triangle central
			expect(report.metrics.cycles.hasCycles).toBe(true);
		});

		// F. Balzac / Rimbaud - Réseau conceptuel et historique
		test('Balzac/Rimbaud (/balzac-rimbaud) : cycle strict C_5 (réseau d’idées, non réseau de personnages)', () => {
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
			const report = analyzeNetworkStructure(nodes, edges);

			// V = 5, E = 5, régulier deg 2, connexe : C'est exactement un CYCLE TOPOLOGIQUE C_5 !
			expect(report.analyzedNodeCount).toBe(5);
			expect(report.connectedPairCount).toBe(5);
			expect(report.exactShapes).toContain('cycle');
			expect(report.exactShapes).toContain('regular');
			expect(report.pedagogicalSynthesis.shapeTitle).toContain('boucle');
		});
	});
});
