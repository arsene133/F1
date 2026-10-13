import type { EdgeType, MapNode, MapRelationship } from '../../../components/relationship-map/types';
import type { EpistemicCertainty, GraphEdge, GraphNode, NodeCategory } from '../types';

// ==========================================================================
// Adaptateurs universels pour les autres œuvres littéraires et historiques
// Permettent d'alimenter le moteur de structure sans altérer les sources.
// ==========================================================================

/**
 * Adaptateur pour Le Père Goriot (src/data/goriot-relationships.ts)
 */
export function adaptGoriotCorpus(
	characters: any[],
	relationships: any[]
): { nodes: GraphNode[]; edges: GraphEdge[] } {
	const nodes: GraphNode[] = characters.map((c) => ({
		id: c.id,
		label: c.label,
		category: 'individual' as NodeCategory,
		description: c.description,
	}));

	const edges: GraphEdge[] = relationships.map((r) => ({
		id: r.id,
		source: r.source,
		target: r.target,
		nature: r.category,
		directed: r.asymmetric ?? true,
		label: r.label,
		description: r.description,
		certainty: r.certainty as EpistemicCertainty,
	}));

	return { nodes, edges };
}

/**
 * Adaptateur pour Dom Juan (src/data/dom-juan.ts)
 */
export function adaptDomJuanCorpus(
	characters: MapNode[],
	relationships: MapRelationship[],
	edgeTypes: Record<string, EdgeType>
): { nodes: GraphNode[]; edges: GraphEdge[] } {
	const nodes: GraphNode[] = characters.map((c) => {
		let cat: NodeCategory = 'individual';
		if (c.id === 'commandeur') cat = 'symbolic_object'; // statue animée
		if (c.id === 'paysans') cat = 'collective'; // groupe paysan
		return {
			id: c.id,
			label: c.label,
			category: cat,
			description: c.description,
		};
	});

	const edges: GraphEdge[] = relationships.map((r) => {
		const isDirected = r.direction !== 'both' && edgeTypes[r.type]?.arrow !== 'both';
		return {
			id: r.id ?? `${r.source}-${r.target}-${r.type}`,
			source: r.source,
			target: r.target as string,
			nature: r.type,
			directed: isDirected,
			label: r.label,
			description: r.description,
			certainty: 'textual_fact',
		};
	});

	return { nodes, edges };
}

/**
 * Adaptateur pour Lettres d'une Péruvienne (src/data/graffigny.ts)
 */
export function adaptGraffignyCorpus(
	characters: MapNode[],
	relationships: MapRelationship[],
	edgeTypes: Record<string, EdgeType>
): { nodes: GraphNode[]; edges: GraphEdge[] } {
	const nodes: GraphNode[] = characters.map((c) => {
		let cat: NodeCategory = 'individual';
		if (c.id === 'espagnols') cat = 'collective';
		return {
			id: c.id,
			label: c.label,
			category: cat,
			description: c.description,
		};
	});

	const edges: GraphEdge[] = relationships.map((r) => {
		const isDirected = r.direction !== 'both' && edgeTypes[r.type]?.arrow !== 'both';
		return {
			id: r.id ?? `${r.source}-${r.target}-${r.type}`,
			source: r.source,
			target: r.target as string,
			nature: r.type,
			directed: isDirected,
			label: r.label,
			description: r.description,
			certainty: 'textual_fact',
		};
	});

	return { nodes, edges };
}

/**
 * Adaptateur pour Pot-Bouille (src/data/pot-bouille.ts)
 */
export function adaptPotBouilleCorpus(
	characters: MapNode[],
	relationships: MapRelationship[],
	edgeTypes: Record<string, EdgeType>
): { nodes: GraphNode[]; edges: GraphEdge[] } {
	const nodes: GraphNode[] = characters.map((c) => ({
		id: c.id,
		label: c.label,
		category: 'individual' as NodeCategory,
		description: c.description,
	}));

	const edges: GraphEdge[] = relationships.map((r) => {
		const isDirected = r.direction !== 'both' && edgeTypes[r.type]?.arrow !== 'both';
		return {
			id: r.id ?? `${r.source}-${r.target}-${r.type}`,
			source: r.source,
			target: r.target as string,
			nature: r.type,
			directed: isDirected,
			label: r.label,
			description: r.description,
			certainty: 'textual_fact',
		};
	});

	return { nodes, edges };
}

/**
 * Adaptateur pour On ne badine pas avec l'amour (src/pages/on-ne-badine-pas-avec-l-amour.astro)
 */
export function adaptMussetCorpus(
	characters: MapNode[],
	relationships: MapRelationship[],
	edgeTypes: Record<string, EdgeType>
): { nodes: GraphNode[]; edges: GraphEdge[] } {
	const nodes: GraphNode[] = characters.map((c) => {
		let cat: NodeCategory = 'individual';
		if (c.id === 'choeur') cat = 'collective';
		return {
			id: c.id,
			label: c.label,
			category: cat,
			description: c.description,
		};
	});

	const edges: GraphEdge[] = relationships.flatMap((r) => {
		const targets = Array.isArray(r.target) ? r.target : [r.target];
		const isDirected = r.direction !== 'both' && edgeTypes[r.type]?.arrow !== 'both';
		return targets.map((t, idx) => ({
			id: r.id ? (targets.length > 1 ? `${r.id}-${idx}` : r.id) : `${r.source}-${t}-${r.type}`,
			source: r.source,
			target: t,
			nature: r.type,
			directed: isDirected,
			label: r.label,
			description: r.description,
			certainty: 'textual_fact',
		}));
	});

	return { nodes, edges };
}

/**
 * Adaptateur pour Balzac/Rimbaud (src/data/balzac-rimbaud.ts)
 * Note capitale : réseau conceptuel et historique, non intra-diégétique !
 */
export function adaptBalzacRimbaudCorpus(
	figures: any[],
	relationships: any[]
): { nodes: GraphNode[]; edges: GraphEdge[] } {
	const nodes: GraphNode[] = figures.map((f) => ({
		id: f.id,
		label: f.label,
		category: (f.id === 'commune' ? 'historical_concept' : 'individual') as NodeCategory,
		description: f.description,
	}));

	const edges: GraphEdge[] = relationships.map((r) => ({
		id: r.id,
		source: r.source,
		target: r.target,
		nature: r.type,
		directed: r.type === 'direct',
		label: r.label,
		description: r.explanation,
		certainty: 'grounded_inference',
	}));

	return { nodes, edges };
}
