// Calcul du tracé des arêtes et de la position des étiquettes de la carte
// relationnelle du Père Goriot. Fonction pure : le serveur l'appelle avec des
// tailles estimées, le client avec les tailles mesurées dans le navigateur.
import type { Box } from './geometry';
import { placeLabels, rectOfBox, routeEdge, type Pt, type Rect, type RoutedEdge } from './label-placement';

export interface LayoutRel {
	id: string;
	source: string;
	target: string;
	bend?: number;
	mBend?: number;
	labelT?: number;
}

type Zone = { x: number; y: number; w: number; h: number };

export interface LayoutCluster {
	tag: string;
	label: string;
	dRect: Zone;
	mRect: Zone;
}

export interface LayoutNode {
	label: string;
	caption: string;
	tier: 'major' | 'standard' | 'minor';
	x: number;
	y: number;
	mx: number;
	my: number;
}

export type Size = { w: number; h: number };

// Gabarits mesurés dans le navigateur (styles de GoriotRelationshipsMap.astro) :
// largeur moyenne d'un caractère du titre et de la légende, hauteur d'une
// carte sur une ligne de titre et une de légende, hauteur de chaque ligne
// supplémentaire. Sur mobile, la puce disparaît et les titres passent à la ligne.
const TIERS = {
	major: { title: 9.2, caption: 5.4, pad: 50, h: 57, titleLine: 19.6, line: 15, mh: 52.4 },
	standard: { title: 8.1, caption: 5.1, pad: 44, h: 50, titleLine: 17.5, line: 14, mh: 48 },
	minor: { title: 7.6, caption: 5, pad: 36, h: 44, titleLine: 16.4, line: 13.6, mh: 46 },
} as const;

/** Largeur maximale des cartes (px), cohérente avec le CSS du composant. */
export const NODE_MAX_W = { desktop: 250, mobile: 176 } as const;
/** Largeur maximale des étiquettes (px), cohérente avec le CSS du composant. */
export const LABEL_MAX_W = 132;

export function estimateNodeBox(n: LayoutNode, mobile: boolean): Box {
	const t = TIERS[n.tier];
	const pad = mobile ? 23 : t.pad;
	const maxW = mobile ? NODE_MAX_W.mobile : NODE_MAX_W.desktop;
	const title = n.label.length * t.title;
	const caption = n.caption.length * t.caption;
	// Sur bureau, le titre ne passe jamais à la ligne.
	const w = mobile ? Math.min(Math.max(title, caption) + pad, maxW) : Math.max(title + pad, Math.min(caption + pad, maxW));
	const lines = (text: number) => Math.max(1, Math.ceil(text / (w - pad) - 0.02));
	const h = (mobile ? t.mh + (lines(title) - 1) * t.titleLine : t.h) + (lines(caption) - 1) * t.line;
	return { x: mobile ? n.mx : n.x, y: mobile ? n.my : n.y, hw: w / 2, hh: h / 2 };
}

/** Taille d'une étiquette en italique 11px, retour à la ligne à LABEL_MAX_W. */
export function estimateLabelSize(text: string): Size {
	const char = 5.05;
	const inner = LABEL_MAX_W - 17;
	let lines = 1;
	let line = 0;
	let widest = 0;
	for (const word of text.split(' ')) {
		const w = word.length * char;
		const next = line ? line + char + w : w;
		if (line && next > inner) {
			widest = Math.max(widest, line);
			lines++;
			line = w;
		} else line = next;
	}
	widest = Math.max(widest, line);
	// Sur plusieurs lignes, la boîte occupe toute la largeur maximale.
	return { w: lines > 1 ? LABEL_MAX_W : Math.min(widest, inner) + 17, h: 6.5 + lines * 14.2 };
}

/** Emprise du titre d'une zone (« SATELLITE · Satellite Restaud »). */
export function clusterTitleRect(c: LayoutCluster, mobile: boolean): Rect {
	const r = mobile ? c.mRect : c.dRect;
	const nameX = r.x + 10 + c.tag.length * 6.5 + 8;
	return { l: r.x + 6, t: r.y + 3, r: nameX + (c.label.length + 2) * 5.2, b: r.y + 19 };
}

export interface MapLayoutResult {
	edges: Record<string, RoutedEdge>;
	labels: Record<string, Pt>;
}

export function layoutGoriotMap(opts: {
	rels: LayoutRel[];
	clusters: LayoutCluster[];
	mobile: boolean;
	size: { width: number; height: number };
	boxes: Map<string, Box>;
	labelSizes: Map<string, Size>;
	obstacles?: Rect[];
}): MapLayoutResult {
	const { rels, boxes } = opts;
	const edges = Object.fromEntries(
		rels.map((r) => [r.id, routeEdge(boxes.get(r.source)!, boxes.get(r.target)!, (opts.mobile ? r.mBend : undefined) ?? r.bend ?? 0)]),
	);
	const labels = placeLabels(
		rels.map((r) => ({ id: r.id, edge: edges[r.id], ...opts.labelSizes.get(r.id)!, preferredT: r.labelT })),
		{
			bounds: { l: 0, t: 0, r: opts.size.width, b: opts.size.height },
			nodes: [...boxes.values()].map((b) => rectOfBox(b)),
			obstacles: [...opts.clusters.map((c) => clusterTitleRect(c, opts.mobile)), ...(opts.obstacles ?? [])],
		},
	);
	return { edges, labels };
}
