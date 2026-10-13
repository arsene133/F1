import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import { chromium, type Browser, type Page } from 'playwright';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { CAHIERS_DE_DOUAI_POEMS, RIMBAUD_PLACES } from '../data/rimbaud-places';

const BUILT = existsSync('dist/rimbaud/index.html');
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
			// Attente du serveur preview
		}
		await new Promise((r) => setTimeout(r, 200));
	}
	throw new Error(`Serveur de prévisualisation injoignable : ${url}`);
}

async function openPage(width = 1200, height = 900): Promise<Page> {
	const page = await browser.newPage({ viewport: { width, height } });
	await page.goto(`${BASE}/rimbaud/`);
	await page.waitForSelector('#rimbaud-leaflet-map');
	return page;
}

describe.skipIf(!BUILT)('Cartographie littéraire des Cahiers de Douai (/rimbaud) — E2E & Interactions', () => {
	beforeAll(async () => {
		server = spawn('pnpm', ['astro', 'preview', '--port', String(PORT)], { stdio: 'ignore' });
		await waitForServer(`${BASE}/rimbaud/`);
		browser = await chromium.launch();
	}, 30_000);

	afterAll(async () => {
		await browser?.close();
		server?.kill();
	});

	test('la page charge avec succès le titre, le corpus et la fiche initiale', async () => {
		const page = await openPage();
		try {
			const title = await page.locator('h1').textContent();
			expect(title).toContain('Cahiers de Douai');

			// Vérifier les données injectées
			const jsonText = await page.locator('#rimbaud-places-data').textContent();
			expect(jsonText).toBeTruthy();
			const data = JSON.parse(jsonText || '{}');
			expect(data.places.length).toBe(RIMBAUD_PLACES.length);
			expect(data.poems.length).toBe(CAHIERS_DE_DOUAI_POEMS.length);

			// Fiche initiale (Charleville - Collège)
			const cardName = await page.locator('#card-place-name').textContent();
			expect(cardName).toContain('Charleville');
		} finally {
			await page.close();
		}
	});

	test('les marqueurs géographiques sont présents sur la carte Leaflet', async () => {
		const page = await openPage();
		try {
			// Attendre le montage des marqueurs Leaflet
			await page.waitForSelector('.rimbaud-pin-wrapper');
			const geoCount = RIMBAUD_PLACES.filter((p) => p.category !== 'imaginaire').length;
			const markers = await page.locator('.rimbaud-pin-wrapper').count();
			expect(markers).toBe(geoCount);
		} finally {
			await page.close();
		}
	});

	test('le filtrage par parcours de lecture met à jour le bandeau et filtre les lieux', async () => {
		const page = await openPage();
		try {
			// Clic sur le parcours B (fugues)
			const fuguesBtn = page.locator('button[data-path-id="fugues"]');
			await fuguesBtn.click();

			const bannerTitle = await page.locator('#active-path-title').textContent();
			expect(bannerTitle).toContain('Parcours B');

			const liveCounter = await page.locator('#map-live-counter').textContent();
			expect(liveCounter).toContain('Affichage de 5 lieux');
		} finally {
			await page.close();
		}
	});

	test('le filtrage par catégorie affiche les lieux correspondants', async () => {
		const page = await openPage();
		try {
			const attesteBtn = page.locator('button[data-category-filter="atteste"]');
			await attesteBtn.click();

			const liveCounter = await page.locator('#map-live-counter').textContent();
			const countAtteste = RIMBAUD_PLACES.filter((p) => p.category === 'atteste').length;
			expect(liveCounter).toContain(`Affichage de ${countAtteste} lieux`);
		} finally {
			await page.close();
		}
	});

	test('le filtrage par poème isole les lieux associés', async () => {
		const page = await openPage();
		try {
			const select = page.locator('#poem-dropdown');
			await select.selectOption('au-cabaret-vert');

			const liveCounter = await page.locator('#map-live-counter').textContent();
			expect(liveCounter).toContain('Affichage de 1 lieu');

			// La fiche de Charleroi doit pouvoir être inspectée
			const marker = page.locator('[data-marker-place-id="charleroi-cabaret-vert"]');
			await marker.click();

			const placeName = await page.locator('#card-place-name').textContent();
			expect(placeName).toContain('Charleroi');

			const quote = await page.locator('#card-quote-text').textContent();
			expect(quote).toContain('Au Cabaret-Vert');
		} finally {
			await page.close();
		}
	});

	test('les espaces imaginaires hors carte peuvent être inspectés et mettent à jour la fiche', async () => {
		const page = await openPage();
		try {
			const imaginaryCard = page.locator('#imaginary-item-espace-mythique-antiquite');
			await imaginaryCard.click();

			const placeName = await page.locator('#card-place-name').textContent();
			expect(placeName).toContain('Espace antique et païen');

			const distinction = await page.locator('#card-distinction-text').textContent();
			expect(distinction).toContain('Espace purement imaginaire');
		} finally {
			await page.close();
		}
	});

	test('l’inventaire accessible permet de sélectionner un lieu depuis la table', async () => {
		const page = await openPage();
		try {
			const details = page.locator('.inventory-details');
			await details.locator('summary').click();

			const btn = page.locator('button[data-select-place="sedan-bataille"]');
			await btn.click();

			const placeName = await page.locator('#card-place-name').textContent();
			expect(placeName).toContain('Sedan');
		} finally {
			await page.close();
		}
	});

	test('la mise en page reste adaptée sur écran mobile (375x812)', async () => {
		const page = await openPage(375, 812);
		try {
			const mapEl = page.locator('#rimbaud-leaflet-map');
			const box = await mapEl.boundingBox();
			expect(box).not.toBeNull();
			expect(box!.width).toBeLessThanOrEqual(375);
			expect(box!.height).toBeGreaterThanOrEqual(400);

			// Le sélecteur de parcours reste accessible
			const pathPills = page.locator('.paths-pills');
			expect(await pathPills.isVisible()).toBe(true);
		} finally {
			await page.close();
		}
	});
});
