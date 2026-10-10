// Carte relationnelle de Pot-Bouille (/pot-bouille) :
// tests de rendu, données et interactions dans un vrai navigateur (Chromium).
// S'exécute sur le site construit : `pnpm build` d'abord, sinon la suite est ignorée.
import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { chromium, type Browser, type Page } from 'playwright';

const BUILT = existsSync('dist/pot-bouille/index.html');
const PORT = 4394;
const BASE = `http://localhost:${PORT}`;

let server: ChildProcess | undefined;
let browser: Browser;

async function waitForServer(url: string, timeoutMs = 20_000) {
	const start = Date.now();
	while (Date.now() - start < timeoutMs) {
		try {
			if ((await fetch(url)).ok) return;
		} catch {
			// serveur pas encore prêt
		}
		await new Promise((r) => setTimeout(r, 200));
	}
	throw new Error(`Serveur de prévisualisation injoignable : ${url}`);
}

async function openPage(width = 1200, height = 900): Promise<Page> {
	const page = await browser.newPage({ viewport: { width, height } });
	await page.goto(`${BASE}/pot-bouille/`);
	await page.waitForSelector('.rm-canvas');
	return page;
}

describe.skipIf(!BUILT)('Carte relationnelle de Pot-Bouille (/pot-bouille) — rendu et interactions', () => {
	beforeAll(async () => {
		server = spawn('pnpm', ['astro', 'preview', '--port', String(PORT)], { stdio: 'ignore' });
		await waitForServer(`${BASE}/pot-bouille/`);
		browser = await chromium.launch();
	}, 30_000);

	afterAll(async () => {
		await browser?.close();
		server?.kill();
	});

	test('données JSON : les personnages majeurs et les relations d’adultère/mariage existent', async () => {
		const page = await openPage();
		try {
			const data = await page.evaluate(() => {
				const script = document.querySelector('[data-map-data]');
				return script ? JSON.parse(script.textContent || '{}') : null;
			});

			expect(data).toBeTruthy();
			expect(data.nodes.length).toBeGreaterThanOrEqual(15);

			// Vérifier la présence d'Octave Mouret, Berthe et Auguste
			const mouret = data.nodes.find((n: any) => n.id === 'mouret');
			expect(mouret).toBeDefined();
			expect(mouret.label).toBe('Octave Mouret');

			const berthe = data.nodes.find((n: any) => n.id === 'berthe');
			expect(berthe).toBeDefined();
			expect(berthe.label).toBe('Berthe Josserand');

			const auguste = data.nodes.find((n: any) => n.id === 'auguste-vabre');
			expect(auguste).toBeDefined();
			expect(auguste.label).toBe('Auguste Vabre');

			// Vérifier la relation adultère centrale
			const mouretBerthe = data.relationships.find(
				(r: any) => r.source === 'mouret' && r.targets.includes('berthe'),
			);
			expect(mouretBerthe).toBeDefined();
			expect(mouretBerthe.label).toBe('liaison adultère');
			expect(mouretBerthe.typeLabel).toBe('Liaison amoureuse / adultère');
			expect(mouretBerthe.description).toContain('Rachel');
		} finally {
			await page.close();
		}
	});

	test('rendu visuel : le canevas SVG, l’ancre de l’immeuble et la légende sont rendus', async () => {
		const page = await openPage();
		try {
			// Ancre de l'adresse de l'immeuble
			const anchor = page.locator('.rm-anchor');
			expect(await anchor.count()).toBe(1);
			expect(await anchor.textContent()).toContain('28, rue de Choiseul');

			// Nœuds rendus
			const nodes = page.locator('.rm-node');
			expect(await nodes.count()).toBeGreaterThanOrEqual(15);

			// Arêtes de type adultère et mariage
			const adulteryEdges = page.locator('.rm-lines--desktop .rm-edge--adultery');
			expect(await adulteryEdges.count()).toBeGreaterThanOrEqual(3);

			// Légende
			const legendText = await page.locator('.rm-legend').textContent();
			expect(legendText).toContain('Liaison amoureuse / adultère');
			expect(legendText).toContain('Mariage / couple bourgeois');
			expect(legendText).toContain('Intérêt financier / dot');

			// Index textuel
			const indexText = await page.locator('.rm-index').textContent();
			expect(indexText).toContain('Octave Mouret');
			expect(indexText).toContain('Berthe Josserand');
		} finally {
			await page.close();
		}
	});

	test('sélection d’Octave Mouret : active le panneau avec ses conquêtes et son rôle', async () => {
		const page = await openPage();
		try {
			await page.click('button[data-node-id="mouret"]');

			const title = await page.locator('.rm-panel [data-detail-title]').textContent();
			expect(title).toBe('Octave Mouret');

			const eyebrow = await page.locator('.rm-panel [data-detail-eyebrow]').textContent();
			expect(eyebrow).toContain('ambitieux');

			const relations = await page.locator('[data-detail-relations] li').allTextContents();
			// Vérifier qu'Octave affiche ses conquêtes féminines
			expect(relations.some((r) => r.includes('Berthe Josserand'))).toBe(true);
			expect(relations.some((r) => r.includes('Marie Pichon'))).toBe(true);
			expect(relations.some((r) => r.includes('Valérie Vabre'))).toBe(true);
			expect(relations.some((r) => r.includes('Caroline Hédouin'))).toBe(true);

			// Surbrillance du nœud Berthe et de l'arête d'adultère
			const bertheClass = await page.locator('button[data-node-id="berthe"]').getAttribute('class');
			expect(bertheClass).toContain('is-related');
		} finally {
			await page.close();
		}
	});

	test('sélection d’une relation (étiquette) : affiche le panneau contextuel', async () => {
		const page = await openPage();
		try {
			const labelBtn = page.locator('button.rm-label--adultery').first();
			await labelBtn.click();

			const eyebrow = await page.locator('[data-detail-eyebrow]').textContent();
			expect(eyebrow).toContain('Liaison amoureuse / adultère');

			const desc = await page.locator('[data-detail-description]').textContent();
			expect(desc).toBeDefined();
			expect(desc?.length).toBeGreaterThan(20);

			expect(await labelBtn.getAttribute('aria-pressed')).toBe('true');
		} finally {
			await page.close();
		}
	});

	test('navigation clavier et réinitialisation (Échap)', async () => {
		const page = await openPage();
		try {
			await page.click('button[data-node-id="berthe"]');
			const isHiddenBefore = await page.locator('[data-panel-detail]').getAttribute('hidden');
			expect(isHiddenBefore).toBeNull();

			await page.keyboard.press('Escape');
			const isHiddenAfter = await page.locator('[data-panel-detail]').getAttribute('hidden');
			expect(isHiddenAfter).not.toBeNull();
		} finally {
			await page.close();
		}
	});

	test('version mobile (375×812) : graphe mobile et sélection opérationnels', async () => {
		const page = await openPage(375, 812);
		try {
			const mobileLines = page.locator('.rm-lines--mobile');
			expect(await mobileLines.count()).toBe(1);

			await page.click('button[data-node-id="mouret"]');
			const title = await page.locator('.rm-panel [data-detail-title]').textContent();
			expect(title).toBe('Octave Mouret');
		} finally {
			await page.close();
		}
	});

	test('coupe architecturale de l’immeuble : rendu des étages, pièces et sélection interactive', async () => {
		const page = await openPage();
		try {
			// Vérifier la présence de la section coupe
			const cutaway = page.locator('[data-building-cutaway]');
			expect(await cutaway.count()).toBe(1);

			// Vérifier les étages rendus
			const floors = page.locator('.building-floor');
			expect(await floors.count()).toBe(7);

			// Vérifier la présence de pièces clés
			const foyerJosserand = page.locator('.room-cell[data-room-id="foyer-josserand"]');
			expect(await foyerJosserand.count()).toBe(1);

			const chambreOctave = page.locator('.room-cell[data-room-id="chambre-octave"]');
			expect(await chambreOctave.count()).toBe(1);

			// Clic sur la chambre d'Octave
			await chambreOctave.click();

			// Vérifier que le panneau latéral s'actualise
			const detailTitle = await page.locator('#cutaway-detail-panel [data-detail-title]').textContent();
			expect(detailTitle).toContain('Chambre d’Octave Mouret');

			const detailBadge = await page.locator('#cutaway-detail-panel [data-detail-badge]').textContent();
			expect(detailBadge).toContain('Quatrième étage');

			// Vérifier que le filtre fonctionne
			const filterCourBtn = page.locator('.ctrl-btn[data-filter="cour"]');
			await filterCourBtn.click();
			expect(await filterCourBtn.getAttribute('aria-pressed')).toBe('true');

			const dimmedRue = await page.locator('.room-cell[data-room-id="foyer-josserand"]').getAttribute('class');
			expect(dimmedRue).toContain('is-dimmed');

			// Réinitialisation de la sélection
			const resetBtn = page.locator('[data-detail-reset]');
			await resetBtn.click();
			const isPlaceholderVisible = await page.locator('[data-detail-placeholder]').isVisible();
			expect(isPlaceholderVisible).toBe(true);
		} finally {
			await page.close();
		}
	});
});

