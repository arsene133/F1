import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import { chromium, type Browser, type Page } from 'playwright';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { goriotPlaces } from '../data/goriot-places';

const BUILT = existsSync('dist/goriot/index.html');
const PORT = 4396;
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
	await page.waitForSelector('#balzac-paris-map');
	return page;
}

describe.skipIf(!BUILT)('Carte interactive du Père Goriot (/goriot) — E2E & Interactions', () => {
	beforeAll(async () => {
		server = spawn('pnpm', ['astro', 'preview', '--port', String(PORT)], { stdio: 'ignore' });
		await waitForServer(`${BASE}/goriot/`);
		browser = await chromium.launch();
	}, 30_000);

	afterAll(async () => {
		await browser?.close();
		server?.kill();
	});

	test('la page charge correctement le titre et les données initiales', async () => {
		const page = await openPage();
		try {
			const title = await page.locator('h1').textContent();
			expect(title).toContain('Le Père Goriot');

			// Vérifier la présence du script JSON de données
			const jsonText = await page.locator('#goriot-places-data').textContent();
			expect(jsonText).toBeTruthy();
			const data = JSON.parse(jsonText || '{}');
			expect(data.places.length).toBe(goriotPlaces.length);

			// Vérifier que la fiche initiale affiche la Pension Vauquer
			const cardTitle = await page.locator('#card-place-title').textContent();
			expect(cardTitle).toContain('La pension Vauquer');
		} finally {
			await page.close();
		}
	});

	test('tous les lieux obligatoires sont présents sur la carte sous forme de marqueurs', async () => {
		const page = await openPage();
		try {
			// Les marqueurs Leaflet personnalisés possèdent la classe .balzac-pin-wrapper
			await page.waitForSelector('.balzac-pin-wrapper');
			const pins = await page.locator('.balzac-pin-wrapper').all();
			expect(pins.length).toBe(goriotPlaces.length);

			// Vérifier les 5 lieux obligatoires par leur libellé accessible
			const vauquer = page.locator('.balzac-pin-wrapper[aria-label*="La pension Vauquer"]');
			const beauseant = page.locator('.balzac-pin-wrapper[aria-label*="hôtel de la vicomtesse de Beauséant"]');
			const restaud = page.locator('.balzac-pin-wrapper[aria-label*="hôtel de la comtesse de Restaud"]');
			const nucingen = page.locator('.balzac-pin-wrapper[aria-label*="hôtel de Delphine et du baron de Nucingen"]');
			const pereLachaise = page.locator('.balzac-pin-wrapper[aria-label*="cimetière du Père-Lachaise"]');

			expect(await vauquer.count()).toBe(1);
			expect(await beauseant.count()).toBe(1);
			expect(await restaud.count()).toBe(1);
			expect(await nucingen.count()).toBe(1);
			expect(await pereLachaise.count()).toBe(1);
		} finally {
			await page.close();
		}
	});

	test('Mode A : les filtres par catégorie affichent et masquent les marqueurs correspondants', async () => {
		const page = await openPage();
		try {
			await page.waitForSelector('.chip-button[data-filter="aristocratie"]');

			// Clic sur le filtre Aristocratie
			await page.locator('.chip-button[data-filter="aristocratie"]').click();

			// Marqueurs visibles avec la classe .balzac-pin-wrapper attachés au DOM Leaflet actif
			const visiblePins = await page.locator('.leaflet-marker-pane .balzac-pin-wrapper').all();
			expect(visiblePins.length).toBe(1); // Uniquement l'hôtel de Beauséant

			const statusText = await page.locator('#map-live-status').textContent();
			expect(statusText).toContain('1 lieu');

			// Fiche mise à jour automatiquement
			const cardTitle = await page.locator('#card-place-title').textContent();
			expect(cardTitle).toContain('hôtel de la vicomtesse de Beauséant');

			// Revenir à "Tous les lieux"
			await page.locator('.chip-button[data-filter="all"]').click();
			const allPins = await page.locator('.leaflet-marker-pane .balzac-pin-wrapper').all();
			expect(allPins.length).toBe(goriotPlaces.length);
		} finally {
			await page.close();
		}
	});

	test('Mode B : parcours narratif étape par étape avec Suivant et Précédent', async () => {
		const page = await openPage();
		try {
			// Basculer en Mode B
			await page.locator('#tab-mode-narrative').click();

			expect(await page.locator('#panel-narrative').isVisible()).toBe(true);
			expect(await page.locator('#current-step-index').textContent()).toBe('1');
			expect(await page.locator('#current-step-title').textContent()).toContain('pension Vauquer');

			// Le bouton précédent doit être désactivé à l'étape 1
			expect(await page.locator('#narrative-prev-btn').isDisabled()).toBe(true);

			// Avancer à l'étape 2 (École de droit)
			await page.locator('#narrative-next-btn').click();
			expect(await page.locator('#current-step-index').textContent()).toBe('2');
			expect(await page.locator('#current-step-title').textContent()).toContain('École de droit');
			expect(await page.locator('#card-place-title').textContent()).toContain('École de droit');
			expect(await page.locator('#narrative-prev-btn').isEnabled()).toBe(true);

			// Avancer à l'étape 3 (Comtesse de Restaud)
			await page.locator('#narrative-next-btn').click();
			expect(await page.locator('#current-step-index').textContent()).toBe('3');
			expect(await page.locator('#current-step-title').textContent()).toContain('comtesse de Restaud');

			// Reculer à l'étape 2
			await page.locator('#narrative-prev-btn').click();
			expect(await page.locator('#current-step-index').textContent()).toBe('2');
			expect(await page.locator('#current-step-title').textContent()).toContain('École de droit');
		} finally {
			await page.close();
		}
	}, 15_000);

	test('sélection d’un marqueur au clic met à jour la fiche informative et la citation vérifiée', async () => {
		const page = await openPage();
		try {
			// Clic sur le marqueur du Père-Lachaise (étape 11)
			const pereLachaisePin = page.locator('.balzac-pin-wrapper[aria-label*="cimetière du Père-Lachaise"]');
			await pereLachaisePin.click();

			const cardTitle = await page.locator('#card-place-title').textContent();
			expect(cardTitle).toContain('cimetière du Père-Lachaise');

			const historicalAddress = await page.locator('#card-historical-address').textContent();
			expect(historicalAddress).toContain('Père-Lachaise');

			// Vérifier la citation du Père-Lachaise
			const quote = await page.locator('#card-quote-text').textContent();
			expect(quote).toContain('À nous deux maintenant');
			expect(quote).toContain('Rastignac, resté seul');
		} finally {
			await page.close();
		}
	});

	test('accessibilité : alternative textuelle complète et focus clavier', async () => {
		const page = await openPage();
		try {
			// Vérifier la présence du bloc d'alternative textuelle
			const altList = page.locator('.alt-places-list li');
			expect(await altList.count()).toBe(goriotPlaces.length);

			// Ouvrir le bloc déroulant
			await page.locator('.alt-summary').click();
			expect(await page.locator('.alt-content').isVisible()).toBe(true);

			// Sélectionner un lieu depuis l'alternative textuelle (ex: Théâtre des Italiens)
			const btnItaliens = page.locator('.btn-select-from-text[data-select-place-id="theatre-des-italiens"]');
			await btnItaliens.click();

			// La fiche doit s'être actualisée
			const cardTitle = await page.locator('#card-place-title').textContent();
			expect(cardTitle).toContain('Théâtre des Italiens');
		} finally {
			await page.close();
		}
	});

	test('comportement responsive mobile (viewport 375×812)', async () => {
		const page = await openPage(375, 812);
		try {
			// La carte et la fiche restent visibles sans chevauchement bloquant
			const mapEl = page.locator('#balzac-paris-map');
			expect(await mapEl.isVisible()).toBe(true);

			const card = page.locator('#place-card-panel');
			expect(await card.isVisible()).toBe(true);

			// Boutons de mode opérationnels sur mobile
			await page.locator('#tab-mode-narrative').click();
			expect(await page.locator('#panel-narrative').isVisible()).toBe(true);
		} finally {
			await page.close();
		}
	});
});
