import type { EdgeType, MapNode, MapRelationship } from '../../components/relationship-map/types';
import type { EpistemicCertainty, GraphEdge, GraphNode, NodeCategory } from './types';

// ==========================================================================
// Adaptateur pour Le Conte du Graal (/perceval)
// Convertit le modèle graphique existant en modèle formel de calcul.
// ==========================================================================

/**
 * Détermine la catégorie ontologique d'un nœud dans la carte de Perceval.
 * - Le Graal et la lance sont des objets narratifs symboliques.
 * - Le père et les frères forment une entité mémorielle défunte.
 * - Tous les autres sont des personnages individuels agissants.
 */
export function getPercevalNodeCategory(nodeId: string): NodeCategory {
	switch (nodeId) {
		case 'graal':
		case 'lance-qui-saigne':
			return 'symbolic_object';
		case 'pere-et-freres':
			return 'deceased_memory';
		default:
			return 'individual';
	}
}

/**
 * Détermine si une relation de Perceval est intrinsèquement dirigée (asymétrique).
 *
 * Règle d'orientation documentée :
 * - `direction === 'both'` : relation symétrique / réciproque explicite (ex: amitié, amour).
 * - `direction === 'none'` : arête sans flèche graphique.
 *   - Si type === 'familial', la parenté est mathématiquement symétrique (cousin, frère, oncle/neveu).
 *   - Si type === 'mystique' et relie deux objets/gardien (roi-pecheur -> graal), relation fonctionnelle symétrique.
 * - Sinon (`direction === 'end'` ou hérite de `EdgeType.arrow === 'end'`) : relation orientée.
 *   - Gornemant enseigne à Perceval (source -> target).
 *   - Perceval demande à Arthur (source -> target).
 *   - L'ermite confesse et absout Perceval (source -> target).
 *   - La demoiselle hideuse accuse Perceval (source -> target).
 */
export function isPercevalRelationshipDirected(
	rel: MapRelationship,
	edgeTypes: Record<string, EdgeType>
): boolean {
	if (rel.direction === 'both') {
		return false;
	}

	if (rel.direction === 'none') {
		// Parenté familiale = symétrique au sens du graphe
		if (rel.type === 'familial') {
			return false;
		}
		// Rôle rituel/fonctionnel (nourrit son père au Graal)
		if (rel.type === 'mystique') {
			return false;
		}
	}

	const typeDef = edgeTypes[rel.type];
	if (typeDef?.arrow === 'both') {
		return false;
	}

	// Par défaut, l'arête porte une direction narrative
	return true;
}

/**
 * Convertit un MapNode de Perceval en GraphNode.
 */
export function toPercevalGraphNode(node: MapNode): GraphNode {
	return {
		id: node.id,
		label: node.label,
		category: getPercevalNodeCategory(node.id),
		description: node.description,
		meta: {
			caption: node.caption,
			eyebrow: node.eyebrow,
			tier: node.tier,
		},
	};
}

/**
 * Convertit une MapRelationship de Perceval en GraphEdge.
 * Note : gère le cas où target est un tableau en éclatant en plusieurs arêtes.
 */
export function toPercevalGraphEdges(
	rel: MapRelationship,
	edgeTypes: Record<string, EdgeType>
): GraphEdge[] {
	const targets = Array.isArray(rel.target) ? rel.target : [rel.target];
	const isDirected = isPercevalRelationshipDirected(rel, edgeTypes);

	return targets.map((target, idx) => ({
		id: rel.id ? (targets.length > 1 ? `${rel.id}-${idx}` : rel.id) : `${rel.source}-${target}-${rel.type}`,
		source: rel.source,
		target,
		nature: rel.type,
		directed: isDirected,
		label: rel.label,
		description: rel.description,
		certainty: 'textual_fact' as EpistemicCertainty,
		meta: {
			declaredDirection: rel.direction,
			edgeTypeArrow: edgeTypes[rel.type]?.arrow,
		},
	}));
}

/**
 * Adapte l'intégralité du corpus de Perceval en structures prêtes pour le moteur de calcul.
 */
export function adaptPercevalCorpus(
	characters: MapNode[],
	relationships: MapRelationship[],
	edgeTypes: Record<string, EdgeType>
): {
	nodes: GraphNode[];
	edges: GraphEdge[];
} {
	const nodes = characters.map(toPercevalGraphNode);
	const edges = relationships.flatMap((r) => toPercevalGraphEdges(r, edgeTypes));

	return { nodes, edges };
}
