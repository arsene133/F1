import { describe, expect, test } from 'vitest';
import {
	goriotCharacters,
	goriotMapLayout,
	goriotRelationships,
	goriotStructuralClusters,
} from '../../data/goriot-relationships';
import { clusterTitleRect, estimateLabelSize, estimateNodeBox, layoutGoriotMap } from './goriot-layout';
import { overlapArea, placeLabels, rectOfBox, routeEdge, sampleEdge, type Pt, type Rect } from './label-placement';

const inside = (r: Rect, p: Pt) => p.x > r.l && p.x < r.r && p.y > r.t && p.y < r.b;
const gapTo = (r: Rect, p: Pt) => Math.hypot(Math.max(r.l - p.x, 0, p.x - r.r), Math.max(r.t - p.y, 0, p.y - r.b));

// Tracé calculé à partir des tailles estimées, mises à l'échelle `scale` pour
// simuler un canevas plus étroit (bureau à 1024px : ×1,06) ou plus large
// (mobile sur tablette : ×0,91) que la largeur de référence.
function computeLayout(mobile: boolean, scale: number) {
	const size = mobile ? goriotMapLayout.mobile : goriotMapLayout.desktop;
	const boxes = new Map(
		goriotCharacters.map((c) => {
			const b = estimateNodeBox(c, mobile);
			return [c.id, { ...b, hw: b.hw * scale, hh: b.hh * scale }];
		}),
	);
	const labelSizes = new Map(
		goriotRelationships.map((r) => {
			const s = estimateLabelSize(r.label);
			return [r.id, { w: s.w * scale, h: s.h * scale }];
		}),
	);
	const { x, y } = goriotMapLayout.anchor;
	const anchor = { l: x - 150, t: y - 34, r: x + 150, b: y + 34 };
	const { edges, labels } = layoutGoriotMap({
		rels: goriotRelationships,
		clusters: goriotStructuralClusters,
		mobile,
		size,
		boxes,
		labelSizes,
		obstacles: mobile ? [] : [anchor],
	});
	const nodes = [...boxes].map(([id, b]) => ({ id, ...rectOfBox(b) }));
	const labelRects = goriotRelationships.map((r) => {
		const p = labels[r.id];
		const s = labelSizes.get(r.id)!;
		return { id: r.id, l: p.x - s.w / 2, t: p.y - s.h / 2, r: p.x + s.w / 2, b: p.y + s.h / 2 };
	});
	const paths = new Map(goriotRelationships.map((r) => [r.id, sampleEdge(edges[r.id], 3)]));
	return { size, nodes, labelRects, paths, edges, anchor };
}

const cases = [
	{ name: 'bureau', mobile: false, scale: 1 },
	{ name: 'bureau étroit (1024px)', mobile: false, scale: 1.06 },
	{ name: 'mobile', mobile: true, scale: 1 },
	{ name: 'mobile sur tablette', mobile: true, scale: 0.91 },
];

describe.each(cases)('Carte du Père Goriot — tracé calculé ($name)', ({ mobile, scale }) => {
	const { size, nodes, labelRects, paths, anchor } = computeLayout(mobile, scale);

	test('les 16 cartes restent dans le canevas et ne se chevauchent pas', () => {
		expect(nodes).toHaveLength(16);
		for (const n of nodes) {
			expect(n.l, n.id).toBeGreaterThanOrEqual(0);
			expect(n.t, n.id).toBeGreaterThanOrEqual(0);
			expect(n.r, n.id).toBeLessThanOrEqual(size.width);
			expect(n.b, n.id).toBeLessThanOrEqual(size.height);
		}
		const overlaps = nodes.flatMap((a, i) =>
			nodes.slice(i + 1).filter((b) => overlapArea(a, b) > 0).map((b) => `${a.id}/${b.id}`),
		);
		expect(overlaps).toEqual([]);
	});

	test('les 23 étiquettes ne recouvrent ni cartes, ni autres étiquettes, ni titres de zones', () => {
		expect(labelRects).toHaveLength(23);
		const titles = goriotStructuralClusters.map((c) => ({ id: c.id, ...clusterTitleRect(c, mobile) }));
		const obstacles = mobile ? titles : [...titles, { id: 'cartouche', ...anchor }];
		const issues: string[] = [];
		labelRects.forEach((l, i) => {
			if (l.l < 0 || l.t < 0 || l.r > size.width || l.b > size.height) issues.push(`hors canevas ${l.id}`);
			for (const n of nodes) if (overlapArea(l, n) > 0) issues.push(`${l.id} sur ${n.id}`);
			for (const o of obstacles) if (overlapArea(l, o) > 0) issues.push(`${l.id} sur ${o.id}`);
			for (const o of labelRects.slice(i + 1)) if (overlapArea(l, o) > 0) issues.push(`${l.id} sur ${o.id}`);
		});
		expect(issues).toEqual([]);
	});

	test('chaque étiquette est contre son arête et plus proche d’elle que de toute autre', () => {
		const issues: string[] = [];
		for (const l of labelRects) {
			const own = Math.min(...paths.get(l.id)!.map((p) => gapTo(l, p)));
			if (own > 40) issues.push(`${l.id} à ${own.toFixed(0)} de son arête`);
			for (const [id, pts] of paths) {
				if (id === l.id) continue;
				const other = Math.min(...pts.map((p) => gapTo(l, p)));
				if (other < own) issues.push(`${l.id} plus proche de ${id}`);
			}
		}
		expect(issues).toEqual([]);
	});

	test('les arêtes ne traversent ni cartes ni étiquettes et leurs pointes restent visibles', () => {
		const issues: string[] = [];
		for (const r of goriotRelationships) {
			const pts = paths.get(r.id)!;
			for (const n of nodes) if (pts.some((p) => inside(n, p))) issues.push(`${r.id} traverse ${n.id}`);
			for (const l of labelRects) {
				if (l.id !== r.id && pts.some((p) => inside(l, p))) issues.push(`${r.id} passe sous ${l.id}`);
			}
			// Pointe de flèche : dernier tronçon (≈ 10 unités) dégagé de toute étiquette.
			const tip = pts.filter((_, i) => (pts.length - 1 - i) * 3 < 10);
			for (const l of labelRects) if (tip.some((p) => inside(l, p))) issues.push(`pointe de ${r.id} sous ${l.id}`);
			// Elle aboutit contre la carte cible.
			const target = nodes.find((n) => n.id === r.target)!;
			const end = pts[pts.length - 1];
			const gap = gapTo(target, end);
			if (gap < 1 || gap > 12) issues.push(`pointe de ${r.id} à ${gap.toFixed(1)} de ${r.target}`);
		}
		expect(issues).toEqual([]);
	});

	test('les étiquettes des relations internes à un satellite restent dans sa zone', () => {
		const issues: string[] = [];
		for (const c of goriotStructuralClusters) {
			if (c.type === 'core') continue;
			const z = mobile ? c.mRect : c.dRect;
			for (const r of goriotRelationships) {
				if (!c.nodeIds.includes(r.source) || !c.nodeIds.includes(r.target)) continue;
				const l = labelRects.find((x) => x.id === r.id)!;
				if (l.l < z.x || l.r > z.x + z.w || l.t < z.y || l.b > z.y + z.h) issues.push(r.id);
			}
		}
		expect(issues).toEqual([]);
	});
});

describe('Placement des étiquettes (label-placement)', () => {
	const box = (x: number, y: number) => ({ x, y, hw: 50, hh: 20 });

	test('une courbe (bend) s’écarte de la ligne droite et ses bouts quittent les cartes', () => {
		const src = box(100, 100);
		const tgt = box(500, 100);
		const straight = routeEdge(src, tgt);
		const curved = routeEdge(src, tgt, 40);
		expect(straight.start.x).toBeGreaterThan(150);
		expect(straight.end.x).toBeLessThan(450);
		const mid = sampleEdge(curved, 4).reduce((a, p) => (Math.abs(p.t - 0.5) < Math.abs(a.t - 0.5) ? p : a));
		expect(mid.y).toBeCloseTo(60, 0); // apex à gauche du sens source → cible (vers le haut)
	});

	test('deux étiquettes d’arêtes parallèles proches ne se superposent pas', () => {
		const a = routeEdge(box(100, 100), box(500, 100));
		const b = routeEdge(box(100, 160), box(500, 160));
		const size = { w: 130, h: 34 };
		const pos = placeLabels(
			[
				{ id: 'a', edge: a, ...size },
				{ id: 'b', edge: b, ...size },
			],
			{
				bounds: { l: 0, t: 0, r: 600, b: 300 },
				nodes: [box(100, 100), box(500, 100), box(100, 160), box(500, 160)].map((n) => rectOfBox(n)),
			},
		);
		const rect = (p: Pt) => ({ l: p.x - 65, t: p.y - 17, r: p.x + 65, b: p.y + 17 });
		expect(overlapArea(rect(pos.a), rect(pos.b))).toBe(0);
	});
});
