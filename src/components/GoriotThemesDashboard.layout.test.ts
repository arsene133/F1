import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import { chromium, type Browser, type Page } from 'playwright';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { goriotThemes } from '../data/goriot-themes';

const BUILT = existsSync('dist/goriot/index.html');
const PORT = 4399;
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
	await page.waitForSelector('#goriot-themes');
	return page;
}

describe.skipIf(!BUILT)('Tableau de bord thématique du Père Goriot (/goriot) — E2E & Interactions', () => {
	beforeAll(async () => {
		server = spawn('pnpm', ['astro', 'preview', '--port', String(PORT)], { stdio: 'ignore' });
		await waitForServer(`${BASE}/goriot/`);
		browser = await chromium.launch();
	}, 30_000);

	afterAll(async () => {
		await browser?.close();
		server?.kill();
	});

	test('la page intègre la section thématique avec son en-tête et son lien d’ancrage', async () => {
		const page = await openPage();
		try {
			const themesSection = page.locator('#section-themes-roman');
			expect(await themesSection.count()).toBe(1);

			// Vérifier la présence du bouton dans la nav supérieure
			const navBtn = page.locator('.goriot-visualizations-nav a[href="#section-themes-roman"]');
			expect(await navBtn.count()).toBe(1);
			expect(await navBtn.textContent()).toContain('Tableau de bord thématique');

			// Vérifier le titre de section
			const sectionTitle = page.locator('#themes-dashboard-title');
			expect(await sectionTitle.textContent()).toContain('Tableau de bord thématique du roman');
		} finally {
			await page.close();
		}
	});

	test('toutes les 8 cartes de thèmes sont rendues avec badges, titres et indicateurs', async () => {
		const page = await openPage();
		try {
			const cards = page.locator('#goriot-themes .theme-card-btn');
			expect(await cards.count()).toBe(goriotThemes.length);

			// Première carte active par défaut (Paternité et sacrifice)
			const firstCard = cards.first();
			expect(await firstCard.getAttribute('class')).toContain('is-active');
			expect(await firstCard.getAttribute('aria-selected')).toBe('true');
			expect(await firstCard.textContent()).toContain('Paternité et sacrifice');

			// Vérifier la présence des autres thèmes majeurs
			const cardTitles = await cards.locator('.theme-card-title').allTextContents();
			expect(cardTitles).toContain('Argent et dettes');
			expect(cardTitles).toContain('Ambition et ascension sociale');
			expect(cardTitles).toContain('Manipulation et corruption morale');
			expect(cardTitles).toContain('Solitude et abandon');
		} finally {
			await page.close();
		}
	});

	test('le panneau affiche initialement les détails complets du premier thème (Paternité)', async () => {
		const page = await openPage();
		try {
			const title = await page.locator('#goriot-themes [data-theme-title]').textContent();
			expect(title).toContain('Paternité et sacrifice');

			const question = await page.locator('#goriot-themes [data-theme-question]').textContent();
			expect(question).toContain('générosité sublime ou une passion pathologique');

			// Repères élèves
			const desc = await page.locator('#goriot-themes [data-theme-student-desc]').textContent();
			expect(desc).toContain('monomanie');

			// Scènes
			const scenes = page.locator('#goriot-themes [data-theme-scenes] .theme-scene-card');
			expect(await scenes.count()).toBeGreaterThanOrEqual(2);
			const firstSceneTitle = await scenes.first().locator('.scene-card-title').textContent();
			expect(firstSceneTitle).toContain('écuelle d’argent');

			// Citations vérifiées
			const quotes = page.locator('#goriot-themes [data-theme-quotes] .theme-quote-card');
			expect(await quotes.count()).toBeGreaterThanOrEqual(2);
			const firstQuoteText = await quotes.first().locator('.quote-text').textContent();
			expect(firstQuoteText).toContain('mon vice à moi');

			// Puces de personnages avec liens
			const charChips = page.locator('#goriot-themes [data-theme-characters] a');
			expect(await charChips.count()).toBeGreaterThanOrEqual(3);

			// Puces de lieux avec liens
			const placeChips = page.locator('#goriot-themes [data-theme-places] a');
			expect(await placeChips.count()).toBeGreaterThanOrEqual(2);
		} finally {
			await page.close();
		}
	});

	test('clic sur un autre thème (ex: Argent et dettes) : met à jour le panneau de manière réactive', async () => {
		const page = await openPage();
		try {
			// Clic sur "Argent et dettes"
			const argentCard = page.locator('#goriot-themes button[data-theme-id="argent-dettes"]');
			await argentCard.click();

			expect(await argentCard.getAttribute('class')).toContain('is-active');
			expect(await argentCard.getAttribute('aria-selected')).toBe('true');

			// Titre mis à jour
			const updatedTitle = await page.locator('#goriot-themes [data-theme-title]').textContent();
			expect(updatedTitle).toContain('Argent et dettes');

			// Question mise à jour
			const updatedQuestion = await page.locator('#goriot-themes [data-theme-question]').textContent();
			expect(updatedQuestion).toContain('marchandises et en rapports de force');

			// Scène mise à jour (Palais-Royal)
			const scenesText = await page.locator('#goriot-themes [data-theme-scenes]').textContent();
			expect(scenesText).toContain('Palais-Royal');
			expect(scenesText).toContain('roulette');

			// Citation mise à jour
			const quotesText = await page.locator('#goriot-themes [data-theme-quotes]').textContent();
			expect(quotesText).toContain('L’argent, c’est la vie');
		} finally {
			await page.close();
		}
	});

	test('navigation clavier au sein des onglets de thèmes (flèches et pattern WAI-ARIA)', async () => {
		const page = await openPage();
		try {
			const firstTab = page.locator('#goriot-themes button[data-theme-id="paternite-sacrifice"]');
			await firstTab.focus();

			// Flèche droite -> passe au deuxième thème (Argent et dettes)
			await page.keyboard.press('ArrowRight');
			const secondTab = page.locator('#goriot-themes button[data-theme-id="argent-dettes"]');
			expect(await secondTab.getAttribute('class')).toContain('is-active');
			expect(await page.locator('#goriot-themes [data-theme-title]').textContent()).toContain('Argent et dettes');

			// Flèche bas -> passe au troisième thème (Ambition et ascension sociale)
			await page.keyboard.press('ArrowDown');
			const thirdTab = page.locator('#goriot-themes button[data-theme-id="ambition-ascension"]');
			expect(await thirdTab.getAttribute('class')).toContain('is-active');
			expect(await page.locator('#goriot-themes [data-theme-title]').textContent()).toContain('Ambition et ascension sociale');

			// Touche End -> passe au dernier thème (Solitude et abandon)
			await page.keyboard.press('End');
			const lastTab = page.locator('#goriot-themes button[data-theme-id="solitude-abandon"]');
			expect(await lastTab.getAttribute('class')).toContain('is-active');
			expect(await page.locator('#goriot-themes [data-theme-title]').textContent()).toContain('Solitude et abandon');
		} finally {
			await page.close();
		}
	});

	test('bouton de renvoi croisé dans le pied de panneau : active le thème cible', async () => {
		const page = await openPage();
		try {
			// Sélectionner d'abord Vautrin / Manipulation
			const manipCard = page.locator('#goriot-themes button[data-theme-id="manipulation-corruption"]');
			await manipCard.click();

			expect(await page.locator('#goriot-themes [data-theme-title]').textContent()).toContain('Manipulation et corruption');

			// Cliquer sur le renvoi vers "Ambition et ascension sociale"
			const relatedBtn = page.locator('#goriot-themes [data-theme-related] button[data-goto-theme="ambition-ascension"]');
			expect(await relatedBtn.count()).toBe(1);
			await relatedBtn.click();

			// Le thème actif doit être devenu Ambition
			expect(await page.locator('#goriot-themes [data-theme-title]').textContent()).toContain('Ambition et ascension sociale');
			const ambitionTab = page.locator('#goriot-themes button[data-theme-id="ambition-ascension"]');
			expect(await ambitionTab.getAttribute('class')).toContain('is-active');
		} finally {
			await page.close();
		}
	});

	test('adaptation responsive sur mobile (375x812)', async () => {
		const page = await openPage(375, 812);
		try {
			const dashboard = page.locator('#goriot-themes');
			expect(await dashboard.isVisible()).toBe(true);

			// Les cartes thématiques sont visibles et cliquables
			const cards = page.locator('#goriot-themes .theme-card-btn');
			expect(await cards.count()).toBe(8);
			expect(await cards.first().isVisible()).toBe(true);

			// Le panneau de détail est lisible
			const panel = page.locator('#goriot-themes [data-theme-panel]');
			expect(await panel.isVisible()).toBe(true);
		} finally {
			await page.close();
		}
	});
});
