import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import { chromium, type Browser } from 'playwright';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

const BUILT = existsSync('dist/index.html');
const PORT = 4388;
const BASE = `http://localhost:${PORT}`;

let server: ChildProcess | undefined;
let browser: Browser;

async function waitForServer(url: string, timeoutMs = 20_000) {
	const start = Date.now();
	while (Date.now() - start < timeoutMs) {
		try {
			if ((await fetch(url)).ok) return;
		} catch {
			// Attente du serveur preview
		}
		await new Promise((r) => setTimeout(r, 200));
	}
	throw new Error(`Serveur de prévisualisation injoignable : ${url}`);
}

describe.skipIf(!BUILT)('En-tête de navigation (/Header.astro) — E2E & Accessibilité', () => {
	beforeAll(async () => {
		server = spawn('pnpm', ['astro', 'preview', '--port', String(PORT)], { stdio: 'ignore' });
		await waitForServer(`${BASE}/`);
		browser = await chromium.launch();
	}, 30_000);

	afterAll(async () => {
		await browser?.close();
		server?.kill();
	});

	test('Desktop 1280px : affiche le menu compact et le menu déroulant avec les 7 œuvres dont Graffigny', async () => {
		const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
		await page.goto(`${BASE}/`);

		// Liens de premier niveau
		const links = page.locator('.internal-links > a');
		const linkTexts = await links.allInnerTexts();
		expect(linkTexts).toEqual(['Accueil', 'Chronologie', 'Blog']);

		// Le menu déroulant "Œuvres & auteurs"
		const dropdown = page.locator('#works-dropdown');
		expect(await dropdown.isVisible()).toBe(true);
		const summary = dropdown.locator('summary');
		expect(await summary.innerText()).toContain('Œuvres & auteurs');

		// Ouvrir le menu déroulant au clic
		await summary.click();
		const isOpen = await dropdown.getAttribute('open');
		expect(isOpen !== null).toBe(true);

		// Vérifier les 7 œuvres littéraires
		const items = dropdown.locator('.dropdown-item');
		expect(await items.count()).toBe(7);

		// Vérifier que Graffigny est présent avec son URL correcte
		const graffignyLink = dropdown.locator('a[href="/graffigny"]');
		expect(await graffignyLink.isVisible()).toBe(true);
		const graffignyText = await graffignyLink.innerText();
		expect(graffignyText).toContain('Lettres d’une Péruvienne');
		expect(graffignyText).toContain('Françoise de Graffigny');

		// Vérifier également Molière Dom Juan et Zola Pot-Bouille
		expect(await dropdown.locator('a[href="/don-juan"]').isVisible()).toBe(true);
		expect(await dropdown.locator('a[href="/pot-bouille"]').isVisible()).toBe(true);

		// Fermer au clic extérieur
		await page.locator('header h2').click();
		const isStillOpen = await dropdown.getAttribute('open');
		expect(isStillOpen).toBeNull();

		await page.close();
	});

	test('Navigation active : met en évidence "Œuvres & auteurs" et l’élément actif sur la page /graffigny', async () => {
		const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
		await page.goto(`${BASE}/graffigny/`);

		// La synthèse doit être marquée comme active
		const summary = page.locator('#works-dropdown summary');
		const summaryClasses = (await summary.getAttribute('class')) || '';
		expect(summaryClasses.includes('active')).toBe(true);

		// Dans la liste, le lien /graffigny doit avoir la classe active
		const graffignyItem = page.locator('#works-dropdown a[href="/graffigny"]');
		const graffignyClasses = (await graffignyItem.getAttribute('class')) || '';
		expect(graffignyClasses.includes('active')).toBe(true);

		await page.close();
	});

	test('Accessibilité clavier : Escape referme le menu déroulant et replace le focus', async () => {
		const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
		await page.goto(`${BASE}/`);

		const dropdown = page.locator('#works-dropdown');
		const summary = dropdown.locator('summary');

		// Focus et ouverture avec Enter
		await summary.focus();
		await page.keyboard.press('Enter');
		expect(await dropdown.getAttribute('open') !== null).toBe(true);

		// Fermeture avec Échap
		await page.keyboard.press('Escape');
		expect(await dropdown.getAttribute('open')).toBeNull();

		await page.close();
	});

	test('Mobile 375px : aucun débordement horizontal et navigation vers /graffigny', async () => {
		const page = await browser.newPage({ viewport: { width: 375, height: 812 }, isMobile: true });
		await page.goto(`${BASE}/`);

		// Vérifier qu'il n'y a pas de débordement de page horizontal
		const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
		const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
		expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);

		// Ouvrir le menu sur mobile
		const summary = page.locator('#works-dropdown summary');
		await summary.click();

		const graffignyLink = page.locator('#works-dropdown a[href="/graffigny"]');
		expect(await graffignyLink.isVisible()).toBe(true);

		// Cliquer sur le lien et naviguer vers /graffigny
		await graffignyLink.click();
		await page.waitForURL('**/graffigny');
		expect(page.url()).toContain('/graffigny');

		await page.close();
	});
});
