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

			// Les marqueurs restent lisibles et affichés à ce niveau de zoom
			const markers = await page.locator('.rimbaud-pin-wrapper').count();
			expect(markers).toBeGreaterThan(0);
		} finally {
			await page.close();
		}
	});

	test('le zoom initial de la carte Leaflet est réduit de deux niveaux (zoom 6)', async () => {
		const page = await openPage();
		try {
			const jsonText = await page.locator('#rimbaud-places-data').textContent();
			const data = JSON.parse(jsonText || '{}');
			expect(data.mapConfig.defaultZoom).toBe(6);

			// Vérifier que tous les marqueurs géographiques sont visibles avec la vue élargie
			await page.waitForSelector('.rimbaud-pin-wrapper');
			const geoCount = RIMBAUD_PLACES.filter((p) => p.category !== 'imaginaire').length;
			const markers = await page.locator('.rimbaud-pin-wrapper').count();
			expect(markers).toBe(geoCount);
		} finally {
			await page.close();
		}
	});

	test('la note repliée sur Rimbaud et Évariste Galois est fermée par défaut et s’ouvre au clic et au clavier', async () => {
		const page = await openPage();
		try {
			const noteDetails = page.locator('#note-rimbaud-galois');
			expect(await noteDetails.count()).toBe(1);

			// Vérification de l'état initial : fermé par défaut
			expect(await noteDetails.getAttribute('open')).toBeNull();

			const summary = noteDetails.locator('summary');
			const title = await summary.locator('.parallel-summary-title').textContent();
			expect(title).toContain('Rimbaud et Évariste Galois');

			// Le contenu est masqué tant que details est fermé
			const content = noteDetails.locator('.parallel-details-content');
			expect(await content.isVisible()).toBe(false);

			// Ouverture au clic
			await summary.click();
			expect(await noteDetails.getAttribute('open')).not.toBeNull();
			expect(await content.isVisible()).toBe(true);

			// Vérification du contenu et des précautions historiques
			const introText = await noteDetails.locator('.parallel-intro').textContent();
			expect(introText).toContain('aucune influence directe ni filiation personnelle');

			const datesText = await noteDetails.locator('.parallel-cards-grid').textContent();
			expect(datesText).toContain('1811–1832');
			expect(datesText).toContain('1854–1891');

			// Repliage au clavier (Touche Entrée sur le summary)
			await summary.focus();
			await page.keyboard.press('Enter');
			expect(await noteDetails.getAttribute('open')).toBeNull();
			expect(await content.isVisible()).toBe(false);
		} finally {
			await page.close();
		}
	});

	test('sur mobile (375x812), la note Rimbaud et Galois s’ouvre sans débordement horizontal', async () => {
		const page = await openPage(375, 812);
		try {
			const noteDetails = page.locator('#note-rimbaud-galois');
			const summary = noteDetails.locator('summary');
			await summary.click();

			const content = noteDetails.locator('.parallel-details-content');
			expect(await content.isVisible()).toBe(true);

			const box = await content.boundingBox();
			expect(box).not.toBeNull();
			expect(box!.width).toBeLessThanOrEqual(375);
		} finally {
			await page.close();
		}
	});

	test('la section pédagogique sur le style poétique révolutionnaire est affichée avec ses 5 axes et sa synthèse', async () => {
		const page = await openPage();
		try {
			const section = page.locator('#style-revolutionnaire');
			expect(await section.count()).toBe(1);

			// Vérifier le titre et les 5 axes
			const heading = await section.locator('#style-revolution-title').textContent();
			expect(heading).toContain('style poétique d’Arthur Rimbaud est révolutionnaire');

			const axes = section.locator('.transformation-card');
			expect(await axes.count()).toBe(5);

			// Vérifier la présence des 4 étapes méthodologiques dans chaque exemple
			const firstCase = section.locator('.analysis-case').first();
			const steps = firstCase.locator('.case-step');
			expect(await steps.count()).toBe(4);

			// Vérifier la boîte de synthèse finale
			const synthesis = section.locator('.stylistic-synthesis-box');
			expect(await synthesis.isVisible()).toBe(true);
			const coreStatement = await synthesis.locator('.synthesis-core-statement').textContent();
			expect(coreStatement).toContain('ne consiste pas, en 1870, à abolir toutes les règles');
		} finally {
			await page.close();
		}
	});

	test('sur mobile (375x812), la section du style poétique reste lisible sans débordement horizontal', async () => {
		const page = await openPage(375, 812);
		try {
			const section = page.locator('#style-revolutionnaire');
			expect(await section.isVisible()).toBe(true);

			const box = await section.boundingBox();
			expect(box).not.toBeNull();
			expect(box!.width).toBeLessThanOrEqual(375);

			// Vérifier qu'une carte d'analyse ne dépasse pas
			const cardBox = await section.locator('.transformation-card').first().boundingBox();
			expect(cardBox).not.toBeNull();
			expect(cardBox!.width).toBeLessThanOrEqual(375);
		} finally {
			await page.close();
		}
	});

	test('la section des sources iconographiques historiques est affichée avec ses 6 fiches d’archives et sa méthode critique', async () => {
		const page = await openPage();
		try {
			const section = page.locator('#sources-iconographiques');
			expect(await section.count()).toBe(1);

			// Vérifier le titre et le cadrage méthodologique
			const heading = await section.locator('#iconography-section-title').textContent();
			expect(heading).toContain('documents iconographiques et critique des sources');

			// Vérifier la présence des 6 documents iconographiques
			const cards = section.locator('.iconography-card');
			expect(await cards.count()).toBe(6);

			// Vérifier les statuts documentaires obligatoires
			const badges = section.locator('.status-badge');
			expect(await badges.count()).toBeGreaterThanOrEqual(6);

			// Vérifier la présence des métadonnées archivistiques (auteur, dates, institution, identifiant)
			const firstCard = cards.first();
			const metaList = firstCard.locator('.iconography-meta-list');
			expect(await metaList.isVisible()).toBe(true);
			const metaText = await metaList.textContent();
			expect(metaText).toContain('Institution conservatrice');

			// Vérifier la présence du questionnement pédagogique
			const observationBox = firstCard.locator('.iconography-question-box');
			expect(await observationBox.isVisible()).toBe(true);

			// Vérifier la boîte de synthèse méthodologique finale
			const synthesis = section.locator('.iconography-synthesis-box');
			expect(await synthesis.isVisible()).toBe(true);
			const synthesisText = await synthesis.textContent();
			expect(synthesisText).toContain('L’image comme document historique');
		} finally {
			await page.close();
		}
	});

	test('sur mobile (375x812), la section des sources iconographiques reste lisible sans débordement horizontal', async () => {
		const page = await openPage(375, 812);
		try {
			const section = page.locator('#sources-iconographiques');
			expect(await section.isVisible()).toBe(true);

			const box = await section.boundingBox();
			expect(box).not.toBeNull();
			expect(box!.width).toBeLessThanOrEqual(375);

			// Vérifier qu'une fiche iconographique ne déborde pas
			const cardBox = await section.locator('.iconography-card').first().boundingBox();
			expect(cardBox).not.toBeNull();
			expect(cardBox!.width).toBeLessThanOrEqual(375);
		} finally {
			await page.close();
		}
	});
});
