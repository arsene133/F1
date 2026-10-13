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

	test('affiche le fond de carte historique de 1821 et son attribution complète', async () => {
		const page = await openPage();
		try {
			// Vérifier que le calque image historique est présent dans Leaflet
			const overlayImg = page.locator('.leaflet-image-layer');
			expect(await overlayImg.count()).toBe(1);
			const imgSrc = await overlayImg.getAttribute('src');
			expect(imgSrc).toContain('plan-maire-paris-1821.webp');

			// Vérifier la présence de l'alternative textuelle sur l'image
			const imgAlt = await overlayImg.getAttribute('alt');
			expect(imgAlt).toContain('N. M. Maire');

			// Vérifier la notice historique et le bloc d'attribution
			const creditNotice = page.locator('#credit-historical-map');
			expect(await creditNotice.isVisible()).toBe(true);
			const creditText = await creditNotice.textContent();
			expect(creditText).toContain('N. M. Maire, 1821');
			expect(creditText).toContain('David Rumsey Historical Map Collection');
			expect(creditText).toContain('1819');
		} finally {
			await page.close();
		}
	});

	test('sélecteur de fond de carte : bascule fluide entre 1821 et carte moderne avec préservation d’état et accessibilité clavier', async () => {
		const page = await openPage();
		try {
			const consoleErrors: string[] = [];
			page.on('console', (msg) => {
				if (msg.type() === 'error') consoleErrors.push(msg.text());
			});
			page.on('pageerror', (err) => consoleErrors.push(err.message));

			const cartoTileResponses: number[] = [];
			page.on('response', (res) => {
				if (res.url().includes('cartocdn.com')) {
					cartoTileResponses.push(res.status());
				}
			});

			const btnHist = page.locator('#btn-layer-historical');
			const btnMod = page.locator('#btn-layer-modern');

			// 1. État par défaut : 1821 actif
			expect(await btnHist.getAttribute('aria-checked')).toBe('true');
			expect(await btnHist.getAttribute('tabindex')).toBe('0');
			expect(await btnMod.getAttribute('aria-checked')).toBe('false');
			expect(await btnMod.getAttribute('tabindex')).toBe('-1');
			expect(await page.locator('#credit-historical-map').isVisible()).toBe(true);
			expect(await page.locator('#credit-modern-map').isVisible()).toBe(false);

			// Vérifier le CRS initial (L.CRS.Simple)
			const initialIsSimpleCRS = await page.evaluate(() => {
				const mapEl = document.getElementById('balzac-paris-map');
				return mapEl?.getAttribute('aria-label')?.includes('1821');
			});
			expect(initialIsSimpleCRS).toBe(true);

			// Sélectionner un lieu particulier (ex: L’École de droit)
			const ecolePin = page.locator('.balzac-pin-wrapper[aria-label*="cole de droit"]');
			await ecolePin.click();
			expect(await page.locator('#card-place-title').textContent()).toContain('École de droit');

			// 2. Bascule vers la carte moderne au clavier (Touche ArrowRight)
			await btnHist.focus();
			await page.keyboard.press('ArrowRight');

			expect(await btnMod.getAttribute('aria-checked')).toBe('true');
			expect(await btnMod.getAttribute('tabindex')).toBe('0');
			expect(await btnHist.getAttribute('aria-checked')).toBe('false');
			expect(await btnHist.getAttribute('tabindex')).toBe('-1');

			// Vérifier que les tuiles modernes sont montées
			await page.waitForSelector('.leaflet-tile-pane', { state: 'attached' });
			expect(await page.locator('#credit-modern-map').isVisible()).toBe(true);
			expect(await page.locator('#credit-historical-map').isVisible()).toBe(false);

			// Vérifier l'attribution moderne OpenStreetMap
			const modernCredit = await page.locator('#credit-modern-map').textContent();
			expect(modernCredit).toContain('OpenStreetMap');

			// Tous les 11 marqueurs doivent rester disponibles et le lieu sélectionné conservé
			const modernPins = await page.locator('.balzac-pin-wrapper').all();
			expect(modernPins.length).toBe(goriotPlaces.length);
			expect(await page.locator('#card-place-title').textContent()).toContain('École de droit');

			// Vérifier le label d'accessibilité contemporain
			const modernAriaLabel = await page.locator('#balzac-paris-map').getAttribute('aria-label');
			expect(modernAriaLabel).toContain('contemporaine');

			// 3. Bascules répétées dans les deux sens
			for (let i = 0; i < 3; i++) {
				await btnHist.click();
				await page.waitForTimeout(50);
				await btnMod.click();
				await page.waitForTimeout(50);
			}

			// Toujours exactement 1 conteneur de map valide et 11 marqueurs
			const pinsAfterLoops = await page.locator('.balzac-pin-wrapper').all();
			expect(pinsAfterLoops.length).toBe(goriotPlaces.length);
			expect(await page.locator('#card-place-title').textContent()).toContain('École de droit');

			// 4. Bascule retour finale vers 1821 au clavier (Touche ArrowLeft)
			await btnMod.focus();
			await page.keyboard.press('ArrowLeft');
			expect(await btnHist.getAttribute('aria-checked')).toBe('true');
			expect(await btnHist.getAttribute('tabindex')).toBe('0');
			expect(await btnMod.getAttribute('aria-checked')).toBe('false');
			expect(await btnMod.getAttribute('tabindex')).toBe('-1');
			expect(await page.locator('#credit-historical-map').isVisible()).toBe(true);
			expect(await page.locator('#credit-modern-map').isVisible()).toBe(false);
			expect(await page.locator('#card-place-title').textContent()).toContain('École de droit');

			// Vérifier que le plan historique est remonté
			await page.waitForSelector('.leaflet-image-layer', { state: 'attached' });

			// Vérifier l'absence d'erreurs consoles JavaScript
			expect(consoleErrors).toEqual([]);
		} finally {
			await page.close();
		}
	}, 15_000);

	test('carte moderne : fonctionne parfaitement sur écran mobile 375 px sans débordement', async () => {
		const page = await openPage(375, 812);
		try {
			const btnMod = page.locator('#btn-layer-modern');
			await btnMod.click();
			expect(await btnMod.getAttribute('aria-checked')).toBe('true');

			// Vérifier l'absence de débordement horizontal
			const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
			const innerWidth = await page.evaluate(() => window.innerWidth);
			expect(scrollWidth).toBeLessThanOrEqual(innerWidth);

			// Tous les marqueurs sont présents et cliquables
			const pins = await page.locator('.balzac-pin-wrapper').all();
			expect(pins.length).toBe(goriotPlaces.length);
		} finally {
			await page.close();
		}
	}, 15_000);

	test('synchronisation d’échelle et de centre géographique entre les vues 1821 et moderne', async () => {
		const page = await openPage();
		try {
			// Ouvrir le bloc d'alternative textuelle pour rendre les boutons visibles
			await page.locator('.alt-summary').click();
			expect(await page.locator('.alt-content').isVisible()).toBe(true);

			// Sélectionner un lieu avec coordonnées vérifiées (ex: Saint-Étienne-du-Mont)
			const stEtienneBtn = page.locator('.btn-select-from-text[data-select-place-id="eglise-saint-etienne-du-mont"]');
			await stEtienneBtn.click();
			await page.waitForTimeout(100);

			// 1. Bascule vers la carte moderne
			const btnMod = page.locator('#btn-layer-modern');
			await btnMod.click();
			await page.waitForSelector('.leaflet-tile-pane', { state: 'attached' });

			// La fiche reste centrée sur Saint-Étienne-du-Mont
			expect(await page.locator('#card-place-title').textContent()).toContain('Saint-Étienne-du-Mont');

			// 2. Bascule retour vers le plan de 1821
			const btnHist = page.locator('#btn-layer-historical');
			await btnHist.click();
			await page.waitForSelector('.leaflet-image-layer', { state: 'attached' });

			// Vérifier que le lieu reste parfaitement sélectionné et affiché
			expect(await page.locator('#card-place-title').textContent()).toContain('Saint-Étienne-du-Mont');
		} finally {
			await page.close();
		}
	}, 15_000);

	test('la section des documents iconographiques est affichée avec ses 7 fiches, ses métadonnées et ses questions', async () => {
		const page = await openPage();
		try {
			const section = page.locator('#sources-iconographiques');
			expect(await section.count()).toBe(1);

			// Titre de la section
			const heading = await section.locator('#iconography-section-title').textContent();
			expect(heading).toContain('Documents iconographiques');
			expect(heading).toContain('Père Goriot');

			// Vérifier le lien de raccourci dans la navigation
			const quicklink = page.locator('a[href="#sources-iconographiques"]');
			expect(await quicklink.count()).toBe(1);

			// Vérifier les 7 fiches documentaires
			const cards = section.locator('.iconography-card');
			expect(await cards.count()).toBe(7);

			// Vérifier que chaque image possède un texte alternatif non vide
			const images = section.locator('.iconography-img');
			expect(await images.count()).toBe(7);
			for (let i = 0; i < 7; i++) {
				const alt = await images.nth(i).getAttribute('alt');
				expect(alt).toBeTruthy();
				expect(alt!.trim().length).toBeGreaterThan(10);
			}

			// Vérifier les métadonnées et liens pérennes
			const firstCard = cards.first();
			const metaList = firstCard.locator('.iconography-meta-list');
			expect(await metaList.isVisible()).toBe(true);
			const metaText = await metaList.textContent();
			expect(metaText).toContain('Institution de conservation');

			// Vérifier la présence des questions d'observation
			const questionBoxes = section.locator('.iconography-question-box');
			expect(await questionBoxes.count()).toBe(7);

			// Vérifier la synthèse finale
			const synthesis = section.locator('.iconography-synthesis-box');
			expect(await synthesis.isVisible()).toBe(true);
			const synthesisText = await synthesis.textContent();
			expect(synthesisText).toContain('lire le réalisme balzacien');
		} finally {
			await page.close();
		}
	}, 15_000);

	test('sur mobile (375x812), la section iconographique du Père Goriot reste lisible sans débordement horizontal', async () => {
		const page = await openPage(375, 812);
		try {
			const section = page.locator('#sources-iconographiques');
			expect(await section.isVisible()).toBe(true);

			const box = await section.boundingBox();
			expect(box).not.toBeNull();
			expect(box!.width).toBeLessThanOrEqual(375);

			// Vérifier qu'une carte iconographique ne déborde pas
			const cardBox = await section.locator('.iconography-card').first().boundingBox();
			expect(cardBox).not.toBeNull();
			expect(cardBox!.width).toBeLessThanOrEqual(375);
		} finally {
			await page.close();
		}
	}, 15_000);
});
