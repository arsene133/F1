import type { MapNode, MapRelationship } from './types';

type Point = { x: number; y: number };
export type Box = Point & { hw: number; hh: number };

// Gabarits approximatifs des nœuds, par niveau. Simple estimation pour le
// rendu serveur : le client mesure ensuite les nœuds réels (fitEdges).
const TIERS = {
	major: { title: 10, caption: 5.6, hh: 30 },
	standard: { title: 8.4, caption: 5.2, hh: 25 },
	minor: { title: 7.4, caption: 4.8, hh: 21 },
} as const;

const GAP = 6;

function nodeBox(node: MapNode, mobile: boolean): Box {
	const tier = TIERS[node.tier ?? 'standard'];
	const text = Math.max(node.label.length * tier.title, node.caption.length * tier.caption);
	return {
		x: mobile ? node.mx ?? node.x : node.x,
		y: mobile ? node.my ?? node.y : node.y,
		hw: mobile ? Math.min(text + 24, 150) / 2 : (text + 40) / 2.2,
		hh: mobile ? tier.hh * 1.15 : tier.hh / 1.1,
	};
}

// Point où le segment centre → `toward` sort du rectangle du nœud.
function exitPoint(box: Box, toward: Point): Point {
	const dx = toward.x - box.x;
	const dy = toward.y - box.y;
	const len = Math.hypot(dx, dy) || 1;
	const t = Math.min(
		dx === 0 ? Infinity : box.hw / Math.abs(dx),
		dy === 0 ? Infinity : box.hh / Math.abs(dy),
	);
	return { x: box.x + dx * t + (dx / len) * GAP, y: box.y + dy * t + (dy / len) * GAP };
}

/** Segment visible d'une arête entre les bords des nœuds (partagé serveur / client). */
export function segment(src: Box, targets: Box[]): { start: Point; end: Point; center: Point } {
	if (targets.length === 1) {
		const tgt = targets[0];
		return { start: exitPoint(src, tgt), end: exitPoint(tgt, src), center: tgt };
	}
	// Cible collective : milieu du groupe, l'arête s'arrête juste avant.
	const center = {
		x: targets.reduce((s, b) => s + b.x, 0) / targets.length,
		y: targets.reduce((s, b) => s + b.y, 0) / targets.length,
	};
	const start = exitPoint(src, center);
	const dx = start.x - center.x;
	const dy = start.y - center.y;
	const len = Math.hypot(dx, dy) || 1;
	return { start, end: { x: center.x + (dx / len) * 12, y: center.y + (dy / len) * 12 }, center };
}

export interface EdgeGeometry {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	lx: number;
	ly: number;
}

export function targetsOf(rel: MapRelationship): string[] {
	return Array.isArray(rel.target) ? rel.target : [rel.target];
}

export function edgeGeometry(
	rel: MapRelationship,
	nodesById: Map<string, MapNode>,
	mobile: boolean,
): EdgeGeometry {
	const src = nodeBox(nodesById.get(rel.source)!, mobile);
	const targets = targetsOf(rel).map((id) => nodeBox(nodesById.get(id)!, mobile));

	const { start, end, center } = segment(src, targets);

	const t = (mobile ? rel.mLabelT : undefined) ?? rel.labelT ?? 0.5;
	const dx = (mobile ? rel.mLabelDx : undefined) ?? rel.labelDx ?? 0;
	const dy = (mobile ? rel.mLabelDy : undefined) ?? rel.labelDy ?? -10;
	return {
		x1: round(start.x),
		y1: round(start.y),
		x2: round(end.x),
		y2: round(end.y),
		lx: round(src.x + (center.x - src.x) * t + dx),
		ly: round(src.y + (center.y - src.y) * t + dy),
	};
}

const round = (n: number) => Math.round(n * 10) / 10;
