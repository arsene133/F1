import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import { chromium, type Browser, type Page } from 'playwright';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import {
	goriotCharacters,
	goriotGuidedTracks,
	goriotNarrativeStages,
	goriotRelCategories,
	goriotRelationships,
} from '../data/goriot-relationships';

const BUILT = existsSync('dist/goriot/index.html');
const PORT = 4398;
const BASE = `http://localhost:${PORT}`;

let server: ChildProcess | undefined;
let browser: Browser;

async function waitForServer(url: string, timeoutMs = 20_000) {
	const start = Date.now();
	while (Date.now() - start < timeoutMs) {
		try {
			if ((await fetch(url)).ok) return;
		} catch {
			// Attente du démarrage de preview
		}
		await new Promise((r) => setTimeout(r, 200));
	}
	throw new Error(`Serveur de prévisualisation injoignable : ${url}`);
}

async function openPage(width = 1200, height = 900): Promise<Page> {
	const page = await browser.newPage({ viewport: { width, height } });
	await page.goto(`${BASE}/goriot/`);
	await page.waitForSelector('#goriot-relationships');
	return page;
}

// Mesure, dans le navigateur, tout ce qui conditionne la lisibilité de la carte :
// emprise des cartes et des étiquettes, tracé réel des arêtes (échantillonné
// le long du chemin SVG), pointes de flèche et débordements.
async function measureMap(page: Page) {
	return page.evaluate(() => {
		type R = { id: string; l: number; t: number; r: number; b: number };
		type P = { x: number; y: number; d: number };
		const app = document.querySelector('#goriot-relationships')!;
		const canvas = app.querySelector('[data-map-canvas]')!.getBoundingClientRect();
		const rel = (id: string, r: DOMRect): R => ({ id, l: r.left - canvas.left, t: r.top - canvas.top, r: r.right - canvas.left, b: r.bottom - canvas.top });
		const shown = (e: Element) => getComputedStyle(e).display !== 'none';
		const nodes = [...app.querySelectorAll<HTMLElement>('.rm-node')].filter(shown).map((n) => rel(n.dataset.nodeId!, n.getBoundingClientRect()));
		const labels = [...app.querySelectorAll<HTMLElement>('.rm-label')].filter(shown).map((n) => rel(n.dataset.edgeId!, n.getBoundingClientRect()));
		const svg = [...app.querySelectorAll<SVGSVGElement>('.rm-lines')].find((s) => s.getBoundingClientRect().width)!;
		const k = svg.viewBox.baseVal.width / svg.getBoundingClientRect().width;
		const edges = [...svg.querySelectorAll<SVGGElement>('.rm-edge')].filter(shown).map((g) => {
			const path = g.querySelector('path')!;
			const len = path.getTotalLength();
			const pts: P[] = [];
			for (let d = 0; d <= len; d += 2) {
				const q = path.getPointAtLength(d);
				pts.push({ x: q.x / k, y: q.y / k, d: d / k });
			}
			const style = getComputedStyle(path);
			const [source, target] = g.dataset.ends!.split(' ');
			return { id: g.dataset.edgeId!, source, target, pts, len: len / k, markerEnd: style.markerEnd, markerStart: style.markerStart };
		});
		return {
			canvas: { w: canvas.width, h: canvas.height },
			pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
			nodes,
			labels,
			edges,
		};
	});
}

const SIZES: Array<[number, number]> = [
	[1440, 1000],
	[1280, 900],
	[1024, 800],
	[900, 800],
	[768, 1024],
	[390, 844],
	[360, 740],
];

describe.skipIf(!BUILT)('Réseau interactif des relations du Père Goriot (/goriot) — E2E & Interactions', () => {
	beforeAll(async () => {
		server = spawn('pnpm', ['astro', 'preview', '--port', String(PORT)], { stdio: 'ignore' });
		await waitForServer(`${BASE}/goriot/`);
		browser = await chromium.launch();
	}, 30_000);

	afterAll(async () => {
		await browser?.close();
		server?.kill();
	});

	test('la page intègre les deux visualisations (lieux et réseau) avec navigation par ancres', async () => {
		const page = await openPage();
		try {
			// Présence des deux sections identifiées
			const relSection = page.locator('#section-reseau-personnages');
			const geoSection = page.locator('#section-carte-lieux');
			expect(await relSection.count()).toBe(1);
			expect(await geoSection.count()).toBe(1);

			// Liens d'ancrage dans l'en-tête (réseau des personnages, lieux de Paris et thèmes)
			const navLinks = page.locator('.goriot-visualizations-nav a');
			expect(await navLinks.count()).toBeGreaterThanOrEqual(2);
			const hrefs = await navLinks.evaluateAll((links) => links.map((a) => a.getAttribute('href')));
			expect(hrefs).toContain('#section-reseau-personnages');
			expect(hrefs).toContain('#section-carte-lieux');

			// La carte géographique Leaflet reste parfaitement fonctionnelle
			expect(await page.locator('#balzac-paris-map').isVisible()).toBe(true);
		} finally {
			await page.close();
		}
	});

	test('tous les 16 personnages sont rendus sous forme de nœuds sur le canevas', async () => {
		const page = await openPage();
		try {
			const nodeButtons = page.locator('#goriot-relationships .rm-node');
			expect(await nodeButtons.count()).toBe(goriotCharacters.length);

			// Vérifier que Rastignac est central (nœud major)
			const rastignacBtn = page.locator('#goriot-relationships button[data-node-id="rastignac"]');
			expect(await rastignacBtn.count()).toBe(1);
			expect(await rastignacBtn.getAttribute('class')).toContain('rm-node--major');
			expect(await rastignacBtn.textContent()).toContain('Eugène de Rastignac');

			// Vérifier la présence du père Goriot
			const goriotBtn = page.locator('#goriot-relationships button[data-node-id="goriot"]');
			expect(await goriotBtn.count()).toBe(1);
			expect(await goriotBtn.textContent()).toContain('Jean-Joachim Goriot');

			// Vérifier la présence de Bianchon (Horace Bianchon unifié)
			const bianchonBtn = page.locator('#goriot-relationships button[data-node-id="bianchon"]');
			expect(await bianchonBtn.count()).toBe(1);
			expect(await bianchonBtn.textContent()).toContain('Horace Bianchon');
		} finally {
			await page.close();
		}
	});

	test('sélection d’un personnage : affiche sa fiche, son rôle, sa citation et ses relations directes', async () => {
		const page = await openPage();
		try {
			// Clic sur Rastignac
			await page.click('#goriot-relationships button[data-node-id="rastignac"]');

			const title = await page.locator('#goriot-relationships [data-detail-title]').textContent();
			expect(title).toBe('Eugène de Rastignac');

			const role = await page.locator('#goriot-relationships [data-detail-role]').textContent();
			expect(role).toContain('Rôle :');
			expect(role).toContain('Noble provincial');

			const quote = await page.locator('#goriot-relationships [data-detail-quote-text]').textContent();
			expect(quote).toContain('À nous deux maintenant !');

			// Relations directes affichées dans la liste
			const rels = await page.locator('#goriot-relationships [data-detail-relations] li').allTextContents();
			expect(rels.some((r) => r.includes('Delphine de Nucingen'))).toBe(true);
			expect(rels.some((r) => r.includes('Mme de Beauséant'))).toBe(true);
			expect(rels.some((r) => r.includes('Vautrin'))).toBe(true);
			expect(rels.some((r) => r.includes('Horace Bianchon'))).toBe(true);

			// Les nœuds voisins sont en surbrillance (.is-related)
			const delphineClass = await page.locator('#goriot-relationships button[data-node-id="delphine"]').getAttribute('class');
			expect(delphineClass).toContain('is-related');
		} finally {
			await page.close();
		}
	});

	test('sélection d’une relation : affiche le contexte narratif et la citation textuelle', async () => {
		const page = await openPage();
		try {
			// Clic sur l'étiquette de tentation Vautrin -> Rastignac
			const labelBtn = page.locator('#goriot-relationships button.rm-label[data-edge-id="vautrin-rastignac"]');
			await labelBtn.click();

			const title = await page.locator('#goriot-relationships [data-detail-title]').textContent();
			expect(title).toContain('Vautrin');
			expect(title).toContain('Eugène de Rastignac');

			const eyebrow = await page.locator('#goriot-relationships [data-detail-eyebrow]').textContent();
			expect(eyebrow).toContain('Conflit et manipulation');

			const desc = await page.locator('#goriot-relationships [data-detail-description]').textContent();
			expect(desc).toContain('pacte diabolique');
			expect(desc).toContain('Taillefer');

			const quote = await page.locator('#goriot-relationships [data-detail-quote-text]').textContent();
			expect(quote).toContain('Mon petit, je vous propose un marché');
		} finally {
			await page.close();
		}
	});

	test('filtrage par catégorie : active/désactive réellement les arêtes et actualise le compteur', async () => {
		const page = await openPage();
		try {
			// Initialement toutes les relations sont visibles (23)
			const statsInitial = await page.locator('#goriot-relationships [data-stats-count]').textContent();
			expect(statsInitial).toContain(`${goriotRelationships.length} relations`);

			// Désactiver la catégorie "Famille et filiation"
			const familyChip = page.locator('#goriot-relationships button[data-cat-filter="family"]');
			await familyChip.click();

			// Arêtes de la catégorie masquées
			const familyEdge = page.locator('#goriot-relationships .rm-lines--desktop .rm-edge--family').first();
			expect(await familyEdge.getAttribute('style')).toContain('display: none');

			const statsAfter = await page.locator('#goriot-relationships [data-stats-count]').textContent();
			expect(statsAfter).not.toContain(`${goriotRelationships.length} relations`);

			// Réactiver "Famille et filiation"
			await familyChip.click();
			expect(await familyEdge.getAttribute('style')).not.toContain('display: none');
		} finally {
			await page.close();
		}
	});

	test('parcours guidés : active la mise en valeur des protagonistes et affiche le bandeau descriptif', async () => {
		const page = await openPage();
		try {
			// Clic sur le parcours "La famille Goriot"
			const trackBtn = page.locator('#goriot-relationships button[data-track-id="famille-goriot"]');
			await trackBtn.click();

			const banner = page.locator('#goriot-relationships [data-track-banner]');
			expect(await banner.isVisible()).toBe(true);
			expect(await banner.textContent()).toContain('La famille Goriot');
			expect(await banner.textContent()).toContain('martyre du père');

			// Goriot et ses filles sont mis en valeur (is-active)
			const goriotClass = await page.locator('#goriot-relationships button[data-node-id="goriot"]').getAttribute('class');
			expect(goriotClass).toContain('is-active');

			// Fermeture du bandeau
			await page.click('#goriot-relationships [data-close-track]');
			expect(await banner.isVisible()).toBe(false);
		} finally {
			await page.close();
		}
	});

	test('évolution chronologique par étape : masque les relations ultérieures non encore établies', async () => {
		const page = await openPage();
		try {
			const stageSelect = page.locator('#goriot-relationships [data-stage-select]');

			// Sélectionner l'étape 1 (Une pension bourgeoise)
			await stageSelect.selectOption('stage-1');

			// Une relation de l'étape 3 (comme le meurtre Taillefer ou la délation de Michonneau) doit être masquée
			const crimeEdge = page.locator('#goriot-relationships .rm-lines--desktop .rm-edge[data-edge-id="vautrin-taillefer-crime"]');
			expect(await crimeEdge.getAttribute('style')).toContain('display: none');

			// Revenir à "Roman entier"
			await stageSelect.selectOption('all');
			expect(await crimeEdge.getAttribute('style')).not.toContain('display: none');
		} finally {
			await page.close();
		}
	});

	test('recherche de personnage et table textuelle accessible synchronisée', async () => {
		const page = await openPage();
		try {
			// Ouvrir le details de la table accessible
			await page.click('#goriot-relationships details[data-accessible-table] summary');

			const searchInput = page.locator('#goriot-relationships [data-search-input]');
			await searchInput.fill('Vautrin');

			// Nœuds filtrés : Vautrin visible
			const stats = await page.locator('#goriot-relationships [data-stats-count]').textContent();
			expect(stats).toContain('personnage');

			// Table accessible : bouton de sélection pour Vautrin visible
			const accBtn = page.locator('#goriot-relationships button[data-acc-select-id="vautrin"]');
			expect(await accBtn.isVisible()).toBe(true);
			await accBtn.click();

			// La fiche affiche bien Vautrin
			const title = await page.locator('#goriot-relationships [data-detail-title]').textContent();
			expect(title).toContain('Vautrin');

			// Bouton réinitialiser
			await page.click('#goriot-relationships [data-btn-reset]');
			expect(await searchInput.inputValue()).toBe('');
		} finally {
			await page.close();
		}
	});

	test('accessibilité clavier : navigation fléchée et touche Échap', async () => {
		const page = await openPage();
		try {
			// Sélectionner Rastignac
			await page.click('#goriot-relationships button[data-node-id="rastignac"]');
			expect(await page.locator('#goriot-relationships [data-panel-detail]').isVisible()).toBe(true);

			// Appuyer sur Échap
			await page.keyboard.press('Escape');
			expect(await page.locator('#goriot-relationships [data-panel-detail]').isVisible()).toBe(false);
			expect(await page.locator('#goriot-relationships [data-panel-hint]').isVisible()).toBe(true);
		} finally {
			await page.close();
		}
	});

	test('comportement responsive mobile (viewport 375×812)', async () => {
		const page = await openPage(375, 812);
		try {
			// SVG mobile visible
			const mobileSvg = page.locator('#goriot-relationships .rm-lines--mobile');
			expect(await mobileSvg.isVisible()).toBe(true);

			// Clic sur Rastignac sur mobile
			const rastignacBtn = page.locator('#goriot-relationships button[data-node-id="rastignac"]');
			await rastignacBtn.click();

			const title = await page.locator('#goriot-relationships [data-detail-title]').textContent();
			expect(title).toBe('Eugène de Rastignac');
		} finally {
			await page.close();
		}
	});

	test('repérage visuel des satellites du noyau : guide pédagogique et surbrillance des points de rattachement', async () => {
		const page = await openPage();
		try {
			// Le bandeau guide pédagogique est présent avec les puces de cluster
			const guideBar = page.locator('#goriot-relationships .network-structure-guide');
			expect(await guideBar.count()).toBe(1);

			const chips = page.locator('#goriot-relationships button.cluster-chip');
			expect(await chips.count()).toBe(6); // 1 noyau + 4 satellites + 1 périphérie

			// Clic sur le chip du satellite Restaud
			const restaudChip = page.locator('#goriot-relationships button[data-cluster-filter="satellite-restaud"]');
			expect(await restaudChip.count()).toBe(1);
			await restaudChip.click();
			expect(await restaudChip.getAttribute('aria-pressed')).toBe('true');

			// Les membres du satellite (Anastasie, Restaud) sont actifs
			const anastasieBtn = page.locator('#goriot-relationships button[data-node-id="anastasie"]');
			expect(await anastasieBtn.getAttribute('class')).toContain('is-active');

			// Le point pivot de rattachement dans le noyau (Goriot) est mis en surbrillance (.is-pivot)
			const goriotBtn = page.locator('#goriot-relationships button[data-node-id="goriot"]');
			expect(await goriotBtn.getAttribute('class')).toContain('is-pivot');

			// Le panneau de détail affiche l'explication du satellite et son point de rattachement
			const detailTitle = await page.locator('#goriot-relationships [data-detail-title]').textContent();
			expect(detailTitle).toBe('Satellite Restaud');
			const detailDesc = await page.locator('#goriot-relationships [data-detail-description]').textContent();
			expect(detailDesc).toContain('sacrifice paternel');

			// Sélection directe d'un personnage d'un satellite (Anastasie)
			await anastasieBtn.click();
			const badge = await page.locator('#goriot-relationships [data-detail-cluster]').textContent();
			expect(badge).toContain('Satellite Restaud');
			expect(badge).toContain('Jean-Joachim Goriot');
		} finally {
			await page.close();
		}
	});
	describe.each(SIZES)('lisibilité du rendu réel à %i×%i', (width, height) => {
		const area = (a: { l: number; t: number; r: number; b: number }, b: typeof a) =>
			Math.max(0, Math.min(a.r, b.r) - Math.max(a.l, b.l)) * Math.max(0, Math.min(a.b, b.b) - Math.max(a.t, b.t));
		const inside = (r: { l: number; t: number; r: number; b: number }, p: { x: number; y: number }) =>
			p.x > r.l && p.x < r.r && p.y > r.t && p.y < r.b;
		const gapTo = (r: { l: number; t: number; r: number; b: number }, p: { x: number; y: number }) =>
			Math.hypot(Math.max(r.l - p.x, 0, p.x - r.r), Math.max(r.t - p.y, 0, p.y - r.b));
		let m: Awaited<ReturnType<typeof measureMap>>;

		beforeAll(async () => {
			const page = await openPage(width, height);
			await page.evaluate(() => document.fonts.ready);
			await page.waitForTimeout(200);
			m = await measureMap(page);
			await page.close();
		});

		test('16 personnages, 23 relations et 23 étiquettes affichés, sans débordement de page', () => {
			expect(m.nodes).toHaveLength(goriotCharacters.length);
			expect(m.edges).toHaveLength(goriotRelationships.length);
			expect(m.labels).toHaveLength(goriotRelationships.length);
			expect(m.pageOverflow).toBeLessThanOrEqual(0);
		});

		test('aucune carte ni étiquette coupée par les bords du canevas', () => {
			const cut = [...m.nodes, ...m.labels].filter((e) => e.l < 0 || e.t < 0 || e.r > m.canvas.w || e.b > m.canvas.h);
			expect(cut.map((e) => e.id)).toEqual([]);
		});

		test('aucun chevauchement entre cartes, entre étiquettes, ni entre étiquette et carte', () => {
			const issues: string[] = [];
			m.nodes.forEach((a, i) => m.nodes.slice(i + 1).forEach((b) => area(a, b) > 0 && issues.push(`${a.id}/${b.id}`)));
			m.labels.forEach((a, i) => m.labels.slice(i + 1).forEach((b) => area(a, b) > 1 && issues.push(`${a.id}/${b.id}`)));
			m.labels.forEach((l) => m.nodes.forEach((n) => area(l, n) > 0 && issues.push(`${l.id}/${n.id}`)));
			expect(issues).toEqual([]);
		});

		test('chaque étiquette touche presque son arête et en est plus proche que de toute autre', () => {
			const issues: string[] = [];
			for (const l of m.labels) {
				const own = Math.min(...m.edges.find((e) => e.id === l.id)!.pts.map((p) => gapTo(l, p)));
				if (own > 40) issues.push(`${l.id} à ${own.toFixed(0)}px`);
				for (const e of m.edges) {
					if (e.id !== l.id && Math.min(...e.pts.map((p) => gapTo(l, p))) < own) issues.push(`${l.id} ~ ${e.id}`);
				}
			}
			expect(issues).toEqual([]);
		});

		test('les arêtes ne traversent ni cartes ni étiquettes voisines', () => {
			const issues: string[] = [];
			for (const e of m.edges) {
				for (const n of m.nodes) if (e.pts.some((p) => inside(n, p))) issues.push(`${e.id} × ${n.id}`);
				for (const l of m.labels) if (l.id !== e.id && e.pts.some((p) => inside(l, p))) issues.push(`${e.id} × ${l.id}`);
			}
			expect(issues).toEqual([]);
		});

		test('les pointes de flèche sont présentes, dégagées et orientées vers le bon personnage', () => {
			const issues: string[] = [];
			for (const e of m.edges) {
				const cat = goriotRelCategories[goriotRelationships.find((r) => r.id === e.id)!.category];
				if (!e.markerEnd.includes('url(')) issues.push(`${e.id} sans pointe`);
				if (cat.arrow === 'both' && !e.markerStart.includes('url(')) issues.push(`${e.id} sans pointe de départ`);
				const tip = e.pts.filter((p) => e.len - p.d < 10 || (cat.arrow === 'both' && p.d < 10));
				for (const l of m.labels) if (tip.some((p) => inside(l, p))) issues.push(`pointe de ${e.id} sous ${l.id}`);
				const end = e.pts[e.pts.length - 1];
				const target = m.nodes.find((n) => n.id === e.target)!;
				const source = m.nodes.find((n) => n.id === e.source)!;
				if (gapTo(target, end) > 12) issues.push(`${e.id} n’atteint pas ${e.target}`);
				if (gapTo(target, end) >= gapTo(source, end)) issues.push(`${e.id} pointe vers ${e.source}`);
			}
			expect(issues).toEqual([]);
		});
	});
});
