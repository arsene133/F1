// Tests E2E et de rendu pour la page On ne badine pas avec l’amour (/on-ne-badine-pas-avec-l-amour) :
// Carte des relations, sections didactiques (Shakespeare, 3 unités) et section iconographique patrimoniale.
import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { chromium, type Browser, type Page } from 'playwright';

const BUILT = existsSync('dist/on-ne-badine-pas-avec-l-amour/index.html');
const PORT = 4385;
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
	await page.goto(`${BASE}/on-ne-badine-pas-avec-l-amour/`);
	await page.waitForSelector('.musset-page');
	return page;
}

describe.skipIf(!BUILT)('Page Musset (/on-ne-badine-pas-avec-l-amour) — structure et section iconographique', () => {
	beforeAll(async () => {
		server = spawn('pnpm', ['astro', 'preview', '--port', String(PORT)], { stdio: 'ignore' });
		await waitForServer(`${BASE}/on-ne-badine-pas-avec-l-amour/`);
		browser = await chromium.launch();
	}, 30_000);

	afterAll(async () => {
		await browser?.close();
		server?.kill();
	});

	test('chargement général : titre, carte des personnages, navigation rapide vers l’iconographie', async () => {
		const page = await openPage();
		try {
			// Titre principal
			const h1 = page.locator('#page-title');
			expect(await h1.textContent()).toContain('On ne badine pas avec l’amour');

			// Quicklink vers les documents iconographiques
			const quicklink = page.locator('a.nav-anchor[href="#sources-iconographiques"]');
			expect(await quicklink.count()).toBe(1);
			expect(await quicklink.textContent()).toContain('Documents iconographiques');

			// Présence de la section iconographique
			const iconSec = page.locator('#sources-iconographiques');
			expect(await iconSec.count()).toBe(1);
			expect(await iconSec.locator('#iconography-section-title').textContent()).toContain(
				'Documents iconographiques — Musset, le drame romantique et l’épreuve de la scène',
			);
		} finally {
			await page.close();
		}
	});

	test('section iconographique : statuts méthodologiques, 8 fiches et métadonnées rigoureuses', async () => {
		const page = await openPage();
		try {
			// Bannière méthodologique des statuts
			const banner = page.locator('.iconography-method-banner');
			expect(await banner.count()).toBe(1);
			expect(await banner.locator('.status-badge').count()).toBeGreaterThanOrEqual(4);

			// Grille des cartes documentaires : 8 fiches
			const cards = page.locator('.musset-iconography-section .iconography-card');
			expect(await cards.count()).toBe(8);

			// Fiche 1 : Musset en page par Devéria
			const card1 = page.locator('#doc-musset-deveria');
			expect(await card1.locator('h3').textContent()).toContain('Achille Devéria');
			expect(await card1.locator('img').getAttribute('src')).toBe('/images/musset/musset-deveria-1830.jpg');

			// Fiche 2 : Portrait par Landelle
			const card2 = page.locator('#doc-musset-landelle');
			expect(await card2.locator('h3').textContent()).toContain('Charles Landelle');
			expect(await card2.locator('img').getAttribute('src')).toBe('/images/musset/musset-landelle-1854.jpg');

			// Fiche 3 : Édition princeps de 1834 (notice didactique Gallica)
			const card3 = page.locator('#doc-publication-1834');
			expect(await card3.locator('h3').textContent()).toContain('Revue des Deux Mondes');
			expect(await card3.locator('.meta-permalink').getAttribute('href')).toContain('ark:/12148/bpt6k433605');

			// Fiche 4 : Gravure d’Eugène Lami
			const card4 = page.locator('#doc-lami-fontaine');
			expect(await card4.locator('h3').textContent()).toContain('Eugène Lami');
			expect(await card4.locator('img').getAttribute('src')).toBe('/images/musset/musset-lami-fontaine-1884.jpg');

			// Fiche 5 : Delaunay en Perdican par Chartran
			const card5 = page.locator('#doc-chartran-delaunay');
			expect(await card5.locator('h3').textContent()).toContain('Louis Delaunay');
			expect(await card5.locator('img').getAttribute('src')).toBe('/images/musset/delaunay-perdican-chartran.jpg');

			// Fiche 6 : Madeleine Brohan créatrice de Camille
			const card6 = page.locator('#doc-brohan-camille');
			expect(await card6.locator('h3').textContent()).toContain('Madeleine Brohan');
			expect(await card6.locator('img').getAttribute('src')).toBe('/images/musset/madeleine-brohan-camille.jpg');

			// Fiche 7 : Couvent des Oiseaux
			const card7 = page.locator('#doc-couvent-oiseaux');
			expect(await card7.locator('h3').textContent()).toContain('couvent des Oiseaux');
			expect(await card7.locator('img').getAttribute('src')).toBe('/images/musset/couvent-des-oiseaux-paris.jpg');

			// Fiche 8 : Dénouement et sacrifice de Rosette
			const card8 = page.locator('#doc-denouement-rosette');
			expect(await card8.locator('h3').textContent()).toContain('mort de Rosette');

			// Vérifier que chaque fiche possède des questions d'observation pour les élèves
			const questionBoxes = page.locator('.musset-iconography-section .iconography-question-box');
			expect(await questionBoxes.count()).toBe(8);

			// Synthèse finale
			const synth = page.locator('.musset-iconography-section .iconography-synthesis-box');
			expect(await synth.count()).toBe(1);
		} finally {
			await page.close();
		}
	});

	test('lightbox universelle opérationnelle sur les images de Musset', async () => {
		const page = await openPage();
		try {
			const lightbox = page.locator('#image-lightbox');
			expect(await lightbox.count()).toBe(1);

			// Clic sur l'image de Devéria
			const deveriaImg = page.locator('#doc-musset-deveria img');
			expect(await deveriaImg.getAttribute('data-zoomable')).toBe('true');

			await deveriaImg.click();
			expect(await lightbox.getAttribute('open')).not.toBeNull();

			// Vérifier affichage et légende
			const caption = lightbox.locator('[data-lightbox-caption]');
			expect(await caption.isVisible()).toBe(true);
			expect(await caption.textContent()).toContain('Achille Devéria');

			// Fermeture avec Échap
			await page.keyboard.press('Escape');
			expect(await lightbox.getAttribute('open')).toBeNull();
		} finally {
			await page.close();
		}
	});
});
