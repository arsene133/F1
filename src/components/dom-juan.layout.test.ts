// Dom Juan (/don-juan) :
// tests de rendu des notes contextuelles historiques et interactions dans un vrai navigateur (Chromium).
// S'exécute sur le site construit : `pnpm build` d'abord, sinon la suite est ignorée.
import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { chromium, type Browser, type Page } from 'playwright';

const BUILT = existsSync('dist/don-juan/index.html');
const PORT = 4395;
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
	await page.goto(`${BASE}/don-juan/`);
	await page.waitForSelector('.dom-juan-page');
	return page;
}

describe.skipIf(!BUILT)('Page Dom Juan (/don-juan) — notes historiques et interactions', () => {
	beforeAll(async () => {
		server = spawn('pnpm', ['astro', 'preview', '--port', String(PORT)], { stdio: 'ignore' });
		await waitForServer(`${BASE}/don-juan/`);
		browser = await chromium.launch();
	}, 30_000);

	afterAll(async () => {
		await browser?.close();
		server?.kill();
	});

	test('bureau (1200×900) : présence, état initial replié et libellés uniques des 7 notes historiques', async () => {
		const page = await openPage(1200, 900);
		try {
			// 1. Note contextuelle générale sur la création de 1665
			const creationNote = page.locator('details.creation-context-note');
			expect(await creationNote.count()).toBe(1);
			expect(await creationNote.getAttribute('open')).toBeNull();

			const creationSummary = creationNote.locator('summary');
			const creationTitle = await creationNote.locator('#creation-context-title').textContent();
			expect(creationTitle).toBe('Pourquoi Molière écrit-il cette pièce en 1665 ?');

			const creationContent = await creationNote.locator('.creation-context-content p').textContent();
			expect(creationContent).toContain('février 1665');
			expect(creationContent).toContain('Tartuffe');

			// 2. Notes historiques sur chacun des 6 thèmes majeurs
			const themeNotes = page.locator('details.theme-historical-note');
			expect(await themeNotes.count()).toBe(6);

			const titles: string[] = [];
			for (let i = 0; i < 6; i++) {
				const note = themeNotes.nth(i);
				// Toutes fermées par défaut
				expect(await note.getAttribute('open')).toBeNull();

				const titleEl = note.locator('.theme-historical-title');
				const titleText = (await titleEl.textContent())?.trim() ?? '';
				expect(titleText).toBeTruthy();
				expect(titleText).toContain('contexte historique');
				titles.push(titleText);

				const contentEl = note.locator('.theme-historical-content p');
				const contentText = (await contentEl.textContent())?.trim() ?? '';
				expect(contentText.length).toBeGreaterThan(100);
			}

			// Tous les libellés de summary sont uniques
			const uniqueTitles = new Set(titles);
			expect(uniqueTitles.size).toBe(6);
		} finally {
			await page.close();
		}
	});

	test('interactions : ouverture/fermeture par clic et au clavier sur les notes', async () => {
		const page = await openPage(1200, 900);
		try {
			// 1. Clic sur la note générale
			const creationNote = page.locator('details.creation-context-note');
			const creationSummary = creationNote.locator('summary');

			await creationSummary.click();
			expect(await creationNote.getAttribute('open')).not.toBeNull();
			expect(await creationNote.locator('.creation-context-content').isVisible()).toBe(true);

			await creationSummary.click();
			expect(await creationNote.getAttribute('open')).toBeNull();

			// 2. Clic sur la première note de thème (La séduction)
			const firstThemeNote = page.locator('details.theme-historical-note').first();
			const firstSummary = firstThemeNote.locator('summary');

			await firstSummary.click();
			expect(await firstThemeNote.getAttribute('open')).not.toBeNull();
			expect(await firstThemeNote.locator('.theme-historical-content').isVisible()).toBe(true);

			await firstSummary.click();
			expect(await firstThemeNote.getAttribute('open')).toBeNull();

			// 3. Interaction clavier : focus et touche Enter
			await firstSummary.focus();
			await page.keyboard.press('Enter');
			expect(await firstThemeNote.getAttribute('open')).not.toBeNull();

			await page.keyboard.press('Space');
			expect(await firstThemeNote.getAttribute('open')).toBeNull();
		} finally {
			await page.close();
		}
	});

	test('mobile (375×812) : rendu réactif et lisibilité des notes dépliées', async () => {
		const page = await openPage(375, 812);
		try {
			const creationNote = page.locator('details.creation-context-note');
			expect(await creationNote.getAttribute('open')).toBeNull();

			const creationSummary = creationNote.locator('summary');
			await creationSummary.click();
			expect(await creationNote.getAttribute('open')).not.toBeNull();

			// Vérifier que le texte ne déborde pas de la vue
			const contentBox = await creationNote.locator('.creation-context-content').boundingBox();
			expect(contentBox).not.toBeNull();
			expect(contentBox!.width).toBeLessThanOrEqual(375);

			// Ouvrir une note de thème en vue mobile
			const themeNote = page.locator('details.theme-historical-note').first();
			await themeNote.locator('summary').click();
			expect(await themeNote.getAttribute('open')).not.toBeNull();

			const themeBox = await themeNote.locator('.theme-historical-content').boundingBox();
			expect(themeBox).not.toBeNull();
			expect(themeBox!.width).toBeLessThanOrEqual(375);
		} finally {
			await page.close();
		}
	});

	test('intégrité des contenus existants : navigation, citations, carte et index', async () => {
		const page = await openPage(1200, 900);
		try {
			// Navigation rapide présente
			const navAnchors = page.locator('.pedagogical-anchors-nav .nav-anchor');
			expect(await navAnchors.count()).toBe(4);

			// 6 cartes de thèmes majeurs avec citation
			const cards = page.locator('.theme-card');
			expect(await cards.count()).toBe(6);
			const quotes = page.locator('.theme-quote');
			expect(await quotes.count()).toBe(6);

			// Thèmes secondaires
			const secondaryCards = page.locator('.secondary-theme-card');
			expect(await secondaryCards.count()).toBe(5);

			// Question d'interprétation et takeaway dissertation
			expect(await page.locator('#question-interpretative').isVisible()).toBe(true);
			expect(await page.locator('#a-retenir-dissertation').isVisible()).toBe(true);

			// Éléments dépliables existants (.rm-index) toujours fonctionnels
			const rmIndex = page.locator('.rm-index');
			if (await rmIndex.count() > 0) {
				expect(await rmIndex.getAttribute('open')).toBeNull();
				await rmIndex.locator('summary').click();
				expect(await rmIndex.getAttribute('open')).not.toBeNull();
			}
		} finally {
			await page.close();
		}
	});
});
