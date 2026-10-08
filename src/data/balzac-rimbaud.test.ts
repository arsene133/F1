import { describe, expect, test } from 'vitest';
import {
	buildMobileChain,
	mobileChain,
	mobileChainOrder,
	nodes,
	relationships,
} from './balzac-rimbaud';

describe('Carte Balzac–Rimbaud - données', () => {
	test('cinq figures, identifiants uniques et ancres canoniques', () => {
		const ids = nodes.map((n) => n.id);
		expect(ids).toEqual(['balzac', 'rastignac', 'marx', 'commune', 'rimbaud']);
		for (const n of nodes) expect(n.href).toBe(`#node-${n.id}`);
	});

	test('les relations existantes sont conservées à l’identique', () => {
		expect(relationships.map((r) => [r.id, r.source, r.target, r.type])).toEqual([
			['balzac-rastignac', 'balzac', 'rastignac', 'direct'],
			['balzac-marx', 'balzac', 'marx', 'comparison'],
			['commune-marx', 'commune', 'marx', 'direct'],
			['commune-rimbaud', 'commune', 'rimbaud', 'direct'],
			['rastignac-rimbaud', 'rastignac', 'rimbaud', 'contrast'],
		]);
	});

	test('chaque relation relie deux figures existantes', () => {
		const ids = new Set(nodes.map((n) => n.id));
		for (const r of relationships) {
			expect(ids.has(r.source)).toBe(true);
			expect(ids.has(r.target)).toBe(true);
		}
	});

	test('positions bureau dans le canevas 900 × 520', () => {
		for (const n of nodes) {
			expect(n.x).toBeGreaterThan(0);
			expect(n.x).toBeLessThan(900);
			expect(n.y).toBeGreaterThan(0);
			expect(n.y).toBeLessThan(520);
		}
	});
});

describe('Carte Balzac–Rimbaud - chaîne mobile', () => {
	test('l’ordre mobile contient chaque figure une seule fois', () => {
		expect([...mobileChainOrder].sort()).toEqual(nodes.map((n) => n.id).sort());
	});

	test('chaque relation est dessinée exactement une fois', () => {
		const drawn = [...mobileChain.links, mobileChain.loop].map((l) => l?.relationship.id);
		expect(drawn.sort()).toEqual(relationships.map((r) => r.id).sort());
	});

	test('les connecteurs relient des figures voisines dans la colonne', () => {
		mobileChain.links.forEach((link, i) => {
			const pair = [mobileChainOrder[i], mobileChainOrder[i + 1]].sort();
			expect([link.relationship.source, link.relationship.target].sort()).toEqual(pair);
		});
	});

	test('la boucle relie la dernière figure à la première', () => {
		const ends = [mobileChainOrder[0], mobileChainOrder[mobileChainOrder.length - 1]].sort();
		const loop = mobileChain.loop!.relationship;
		expect([loop.source, loop.target].sort()).toEqual(ends);
	});

	test('les flèches suivent le sens des relations orientées', () => {
		mobileChain.links.forEach((link, i) => {
			const rel = link.relationship;
			if (rel.type !== 'direct') {
				expect(link.arrow).toBeNull();
			} else {
				expect(link.arrow).toBe(rel.source === mobileChainOrder[i] ? 'down' : 'up');
			}
		});
	});

	test('refuse un ordre qui sépare deux figures sans relation', () => {
		expect(() => buildMobileChain(['balzac', 'rimbaud', 'rastignac', 'commune', 'marx'], relationships)).toThrow();
	});

	test('refuse un ordre qui laisserait une relation non représentée', () => {
		const extra = [...relationships, { ...relationships[0], id: 'balzac-commune', target: 'commune' }];
		expect(() => buildMobileChain(mobileChainOrder, extra)).toThrow(/non représentées/);
	});
});
