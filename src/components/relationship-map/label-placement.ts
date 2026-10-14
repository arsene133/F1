// Routage des arêtes (segments ou courbes quadratiques) et placement des
// étiquettes sans chevauchement. Partagé entre le rendu serveur (tailles
// estimées) et le client (tailles mesurées).
import type { Box } from './geometry';

export type Pt = { x: number; y: number };
export type Rect = { l: number; t: number; r: number; b: number };

/** Arête tracée comme une courbe quadratique (segment droit si `ctrl` est au milieu). */
export interface RoutedEdge {
	start: Pt;
	ctrl: Pt;
	end: Pt;
}

const GAP = 7;

export const rectOfBox = (b: Box, pad = 0): Rect => ({
	l: b.x - b.hw - pad,
	t: b.y - b.hh - pad,
	r: b.x + b.hw + pad,
	b: b.y + b.hh + pad,
});

const inflate = (r: Rect, d: number): Rect => ({ l: r.l - d, t: r.t - d, r: r.r + d, b: r.b + d });

export const overlapArea = (a: Rect, b: Rect) =>
	Math.max(0, Math.min(a.r, b.r) - Math.max(a.l, b.l)) * Math.max(0, Math.min(a.b, b.b) - Math.max(a.t, b.t));

const contains = (r: Rect, p: Pt) => p.x > r.l && p.x < r.r && p.y > r.t && p.y < r.b;

/** Distance entre le bord d'un rectangle et un point (0 à l'intérieur). */
const gapTo = (r: Rect, p: Pt) => Math.hypot(Math.max(r.l - p.x, 0, p.x - r.r), Math.max(r.t - p.y, 0, p.y - r.b));

// Point où la demi-droite centre → `toward` sort du rectangle, plus une marge.
function exitPoint(box: Box, toward: Pt): Pt {
	const dx = toward.x - box.x;
	const dy = toward.y - box.y;
	const len = Math.hypot(dx, dy) || 1;
	const t = Math.min(dx === 0 ? Infinity : box.hw / Math.abs(dx), dy === 0 ? Infinity : box.hh / Math.abs(dy));
	return { x: box.x + dx * t + (dx / len) * GAP, y: box.y + dy * t + (dy / len) * GAP };
}

/**
 * Trace l'arête entre deux cartes. `bend` (unités du layout) écarte le milieu
 * de la courbe vers la gauche du sens source → cible : deux relations entre
 * les mêmes personnages s'incurvent ainsi de part et d'autre.
 */
export function routeEdge(src: Box, tgt: Box, bend = 0): RoutedEdge {
	const dx = tgt.x - src.x;
	const dy = tgt.y - src.y;
	const len = Math.hypot(dx, dy) || 1;
	const apex = { x: (src.x + tgt.x) / 2 + (dy / len) * bend, y: (src.y + tgt.y) / 2 - (dx / len) * bend };
	// B(½) = S/4 + C/2 + E/4 : le contrôle fait passer la courbe par l'apex.
	const control = (s: Pt, e: Pt) => ({ x: 2 * apex.x - (s.x + e.x) / 2, y: 2 * apex.y - (s.y + e.y) / 2 });
	// Les bouts quittent les cartes dans la direction de la tangente.
	const toward = bend ? control(src, tgt) : null;
	const start = exitPoint(src, toward ?? tgt);
	const end = exitPoint(tgt, toward ?? src);
	const ctrl = bend ? control(start, end) : { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
	return { start, ctrl, end };
}

export function pointAt({ start: s, ctrl: c, end: e }: RoutedEdge, t: number): Pt {
	const u = 1 - t;
	return { x: u * u * s.x + 2 * u * t * c.x + t * t * e.x, y: u * u * s.y + 2 * u * t * c.y + t * t * e.y };
}

function tangentAt({ start: s, ctrl: c, end: e }: RoutedEdge, t: number): Pt {
	const x = 2 * (1 - t) * (c.x - s.x) + 2 * t * (e.x - c.x);
	const y = 2 * (1 - t) * (c.y - s.y) + 2 * t * (e.y - c.y);
	const len = Math.hypot(x, y) || 1;
	return { x: x / len, y: y / len };
}

export const edgeLength = (e: RoutedEdge) => {
	let len = 0;
	let prev = e.start;
	for (let i = 1; i <= 16; i++) {
		const p = pointAt(e, i / 16);
		len += Math.hypot(p.x - prev.x, p.y - prev.y);
		prev = p;
	}
	return len;
};

/** Échantillonne la courbe tous les ~`step` unités (bouts inclus). */
export function sampleEdge(e: RoutedEdge, step = 5): Array<Pt & { t: number }> {
	const n = Math.max(2, Math.ceil(edgeLength(e) / step));
	return Array.from({ length: n + 1 }, (_, i) => ({ ...pointAt(e, i / n), t: i / n }));
}

const f = (n: number) => n.toFixed(1);
export const edgePath = ({ start: s, ctrl: c, end: e }: RoutedEdge) =>
	`M${f(s.x)} ${f(s.y)} Q${f(c.x)} ${f(c.y)} ${f(e.x)} ${f(e.y)}`;

export interface LabelInput {
	id: string;
	edge: RoutedEdge;
	w: number;
	h: number;
	/** Position souhaitée le long de l'arête (0 → source, 1 → cible). */
	preferredT?: number;
}

export interface PlacementOptions {
	bounds: Rect;
	/** Cartes des personnages : jamais recouvertes, marge `clearance` comprise. */
	nodes: Rect[];
	/** Autres éléments à éviter (titres de zones, cartouche). */
	obstacles?: Rect[];
	clearance?: number;
	labelGap?: number;
}

const HARD = 1e6;
// Sur l'arête (0), contre elle de part et d'autre (±1), puis un peu plus loin.
const SLOTS = [[0, 0], [1, 0], [-1, 0], [1, 10], [-1, 10], [1, 22], [-1, 22], [1, 36], [-1, 36]] as const;

/**
 * Place chaque étiquette sur son arête (ou contre elle) en évitant cartes,
 * autres étiquettes, bords du canevas, pointes de flèche et arêtes voisines.
 * Glouton déterministe suivi de quelques passes d'amélioration.
 */
export function placeLabels(labels: LabelInput[], opts: PlacementOptions): Record<string, Pt> {
	const clearance = opts.clearance ?? 8;
	const labelGap = opts.labelGap ?? 5;
	const nodes = opts.nodes.map((r) => inflate(r, clearance));
	const obstacles = (opts.obstacles ?? []).map((r) => inflate(r, 4));
	const bounds = inflate(opts.bounds, -6);
	const samples = new Map(labels.map((l) => [l.id, sampleEdge(l.edge, 4)]));

	type Cand = { p: Pt; rect: Rect; base: number };
	const candidates = new Map<string, Cand[]>();
	for (const l of labels) {
		const list: Cand[] = [];
		const pref = l.preferredT ?? 0.5;
		const own = samples.get(l.id)!;
		const len = edgeLength(l.edge);
		for (let t = 0.1; t <= 0.901; t += 0.025) {
			const on = pointAt(l.edge, t);
			const u = tangentAt(l.edge, t);
			const n = { x: -u.y, y: u.x };
			const side = (l.w / 2) * Math.abs(n.x) + (l.h / 2) * Math.abs(n.y) + 3;
			for (const [k, extra] of SLOTS) {
				const d = k * (side + extra);
				const p = { x: on.x + n.x * d, y: on.y + n.y * d };
				const rect = { l: p.x - l.w / 2, t: p.y - l.h / 2, r: p.x + l.w / 2, b: p.y + l.h / 2 };
				let base = Math.abs(t - pref) * 40 + (k ? 25 + extra * 2 : 0);
				if (rect.l < bounds.l || rect.t < bounds.t || rect.r > bounds.r || rect.b > bounds.b) base += HARD;
				for (const o of nodes) base += overlapArea(rect, o) * HARD;
				for (const o of obstacles) base += overlapArea(rect, o) * 1e3;
				// Les deux bouts (pointes de flèche de 9 unités) restent dégagés.
				const ends = inflate(rect, 4);
				for (const s of own) if ((s.t * len < 11 || (1 - s.t) * len < 11) && contains(ends, s)) base += HARD;
				// Arêtes voisines : ne pas masquer leur tracé, et rester nettement
				// plus proche de sa propre arête que de toute autre (pas d'ambiguïté).
				let ownGap = Infinity;
				for (const s of own) ownGap = Math.min(ownGap, gapTo(rect, s));
				for (const o of labels) {
					if (o.id === l.id) continue;
					let gap = Infinity;
					for (const s of samples.get(o.id)!) {
						if (contains(inflate(rect, 2), s)) base += 2000;
						gap = Math.min(gap, gapTo(rect, s));
					}
					if (gap < ownGap + 8) base += 1500 + (ownGap + 8 - gap) * 100;
				}
				list.push({ p, rect, base });
			}
		}
		candidates.set(l.id, list);
	}

	const placed = new Map<string, Cand>();
	const cost = (id: string, c: Cand) => {
		let total = c.base;
		for (const [other, oc] of placed) if (other !== id) total += overlapArea(inflate(c.rect, labelGap), oc.rect) * HARD;
		return total;
	};
	const best = (id: string) => {
		let pick = candidates.get(id)![0];
		let min = Infinity;
		for (const c of candidates.get(id)!) {
			const v = cost(id, c);
			if (v < min) [min, pick] = [v, c];
		}
		return pick;
	};

	// Les arêtes les plus contraintes (peu de positions libres) d'abord.
	const freedom = (id: string) => candidates.get(id)!.filter((c) => c.base < 100).length;
	const order = [...labels].sort((a, b) => freedom(a.id) - freedom(b.id) || a.id.localeCompare(b.id));
	for (const l of order) placed.set(l.id, best(l.id));
	for (let pass = 0; pass < 4; pass++) {
		let changed = false;
		for (const l of order) {
			const next = best(l.id);
			if (next !== placed.get(l.id)) {
				placed.set(l.id, next);
				changed = true;
			}
		}
		if (!changed) break;
	}

	return Object.fromEntries([...placed].map(([id, c]) => [id, { x: Math.round(c.p.x * 10) / 10, y: Math.round(c.p.y * 10) / 10 }]));
}
