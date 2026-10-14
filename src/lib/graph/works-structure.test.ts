import { describe, it } from 'vitest';
import { percevalCharacters, percevalRelationships, percevalEdgeTypes } from '../../data/perceval';
import { adaptPercevalCorpus } from './adapters/perceval';
import { analyzeNetworkStructure } from './structure';
import { goriotCharacters, goriotRelationships } from '../../data/goriot-relationships';
import { domJuanCharacters, domJuanRelationships, domJuanEdgeTypes } from '../../data/dom-juan';
import { graffignyCharacters, graffignyRelationships, graffignyEdgeTypes } from '../../data/graffigny';
import { potBouilleCharacters, potBouilleRelationships, potBouilleEdgeTypes } from '../../data/pot-bouille';
import { nodes as brNodes, relationships as brRels } from '../../data/balzac-rimbaud';
import {
	adaptGoriotCorpus,
	adaptDomJuanCorpus,
	adaptGraffignyCorpus,
	adaptPotBouilleCorpus,
	adaptBalzacRimbaudCorpus,
	adaptMussetCorpus,
} from './adapters/other-works';
import { buildSimpleGraph } from './metrics';

function inspectGraph(name: string, corpus: { nodes: any[]; edges: any[] }) {
	const nodeIds = new Set(corpus.nodes.map((n) => n.id));
	const g = buildSimpleGraph(nodeIds, corpus.edges);
	const pairs: string[] = [];
	const degrees: Record<string, number> = {};
	for (const [u, neighbors] of g.adjacency) {
		degrees[u] = neighbors.size;
		for (const v of neighbors) {
			if (u < v) pairs.push(`${u} <-> ${v}`);
		}
	}
	const sortedDegs = Object.entries(degrees).sort((a, b) => b[1] - a[1]);
	const report = analyzeNetworkStructure(corpus.nodes, corpus.edges);
	console.log(`\n=================== ${name} ===================`);
	console.log(`V = ${g.nodes.size}, E_simple = ${pairs.length}, E_typed = ${corpus.edges.length}`);
	console.log('Degrés complets:', sortedDegs);
	console.log('Arêtes simples:', pairs);
	console.log('Exact Shapes:', report.exactShapes);
	console.log('Descriptive Profiles:', report.descriptiveProfiles);
	console.log('Dominant Hubs:', report.roles.dominantHubs);
	console.log('Cycles count estimate:', report.metrics.cycles.cycleCountEstimate);
}

describe('Audit factuel et exhaustif des 7 œuvres', () => {
	it('Perceval', () => {
		inspectGraph('Perceval', adaptPercevalCorpus(percevalCharacters, percevalRelationships, percevalEdgeTypes));
	});

	it('Dom Juan', () => {
		inspectGraph('Dom Juan', adaptDomJuanCorpus(domJuanCharacters, domJuanRelationships, domJuanEdgeTypes));
	});

	it('Goriot', () => {
		inspectGraph('Le Père Goriot', adaptGoriotCorpus(goriotCharacters, goriotRelationships));
	});

	it('Graffigny', () => {
		inspectGraph('Lettres d’une Péruvienne', adaptGraffignyCorpus(graffignyCharacters, graffignyRelationships, graffignyEdgeTypes));
	});

	it('Pot-Bouille', () => {
		inspectGraph('Pot-Bouille', adaptPotBouilleCorpus(potBouilleCharacters, potBouilleRelationships, potBouilleEdgeTypes));
	});

	it('On ne badine pas avec l’amour', () => {
		const mussetCharacters = [
			{ id: 'perdican', label: 'Perdican' },
			{ id: 'camille', label: 'Camille' },
			{ id: 'rosette', label: 'Rosette' },
			{ id: 'baron', label: 'Le Baron' },
			{ id: 'dame-pluche', label: 'Dame Pluche' },
			{ id: 'blazius', label: 'Maître Blazius' },
			{ id: 'bridaine', label: 'Maître Bridaine' },
			{ id: 'choeur', label: 'Le Chœur' },
		] as any[];

		const mussetRels = [
			{ source: 'perdican', target: 'camille', type: 'love' },
			{ source: 'perdican', target: 'rosette', type: 'manipulation' },
			{ source: 'camille', target: 'rosette', type: 'family' },
			{ source: 'baron', target: ['perdican', 'camille'], type: 'marriage' },
			{ source: 'baron', target: 'perdican', type: 'family' },
			{ source: 'baron', target: 'camille', type: 'family' },
			{ source: 'baron', target: 'bridaine', type: 'friendship' },
			{ source: 'dame-pluche', target: 'camille', type: 'influence' },
			{ source: 'blazius', target: 'perdican', type: 'education' },
			{ source: 'blazius', target: 'bridaine', type: 'rivalry' },
			{ source: 'choeur', target: 'rosette', type: 'collective-observation' },
		] as any[];

		const mussetEdgeTypes = {
			love: { arrow: 'both' },
			manipulation: { arrow: 'end' },
			family: { arrow: 'none' },
			marriage: { arrow: 'end' },
			friendship: { arrow: 'none' },
			influence: { arrow: 'end' },
			education: { arrow: 'end' },
			rivalry: { arrow: 'none' },
			'collective-observation': { arrow: 'none' },
		} as any;

		inspectGraph('On ne badine pas avec l’amour', adaptMussetCorpus(mussetCharacters, mussetRels, mussetEdgeTypes));
	});

	it('Balzac-Rimbaud', () => {
		inspectGraph('Balzac-Rimbaud', adaptBalzacRimbaudCorpus(brNodes, brRels));
	});
});
