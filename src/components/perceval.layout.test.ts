// Tests E2E et d'intégration pour la page Le Conte du Graal (/perceval) :
// rendu, accessibilité, filtres, sélection, alternatives textuelles et responsive.
// S'exécute sur le site construit : `pnpm build` d'abord, sinon la suite est ignorée.
import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { chromium, type Browser, type Page } from 'playwright';
import {
	percevalCharacters,
	percevalEdgeTypes,
	percevalIconography,
	percevalRelationships,
} from '../data/perceval';

const BUILT = existsSync('dist/perceval/index.html');
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

async function openPage(width = 1280, height = 900): Promise<{ page: Page; errors: string[] }> {
	const page = await browser.newPage({
		viewport: { width, height },
		hasTouch: width < 700,
		isMobile: width < 700,
	});
	const errors: string[] = [];
	page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
	page.on('pageerror', (e) => errors.push(String(e)));
	await page.goto(`${BASE}/perceval/`);
	await page.waitForSelector('.perceval-page .rm-canvas');
	return { page, errors };
}

describe.skipIf(!BUILT)('Page Perceval (/perceval) — Réseau des personnages et de leurs relations', () => {
	beforeAll(async () => {
		server = spawn('pnpm', ['astro', 'preview', '--port', String(PORT)], { stdio: 'ignore' });
		await waitForServer(`${BASE}/perceval/`);
		browser = await chromium.launch();
	}, 30_000);

	afterAll(async () => {
		await browser?.close();
		server?.kill();
	});

	test('rendu initial : titre, méta, H1 unique et structure sans saut de titre', async () => {
		const { page, errors } = await openPage();
		try {
			expect(errors).toEqual([]);
			expect(await page.title()).toContain('Conte du Graal');
			expect(await page.title()).toContain('Perceval');

			const h1 = page.locator('h1');
			expect(await h1.count()).toBe(1);
			expect(await h1.textContent()).toContain('Le Conte du Graal');

			// Vérification hiérarchie des titres H1 -> H2 -> H3
			const levels = await page.$$eval('main h1, main h2, main h3, main h4', (els) =>
				els.filter((e) => !e.closest('[hidden]')).map((e) => Number(e.tagName[1])),
			);
			expect(levels[0]).toBe(1);
			for (let i = 1; i < levels.length; i++) {
				expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
			}

			// Nœuds et arêtes
			const nodeCount = await page.locator('.rm-node').count();
			expect(nodeCount).toBe(percevalCharacters.length);

			const edgeCount = await page.locator('.rm-lines--desktop .rm-edge').count();
			expect(edgeCount).toBe(percevalRelationships.length);
		} finally {
			await page.close();
		}
	});

	test('sélection d’un personnage : met en évidence le nœud et ses relations directes, affiche la fiche', async () => {
		const { page } = await openPage();
		try {
			const percevalBtn = page.locator('.rm-node[data-node-id="perceval"]');
			await percevalBtn.click();

			// Nœud actif
			expect(await percevalBtn.getAttribute('aria-pressed')).toBe('true');
			expect(await percevalBtn.getAttribute('class')).toContain('is-active');

			// Panneau de détails ouvert
			const panel = page.locator('#perceval-panel [data-panel-detail]');
			expect(await panel.isVisible()).toBe(true);

			const title = await page.locator('#perceval-panel [data-detail-title]').textContent();
			expect(title).toBe('Perceval le Gallois');

			// Description et relations directes listées
			const desc = await page.locator('#perceval-panel [data-detail-description]').textContent();
			expect(desc?.length).toBeGreaterThan(50);

			const relItems = await page.locator('#perceval-panel [data-detail-relations] li').count();
			expect(relItems).toBeGreaterThanOrEqual(8);

			// Fermer la fiche avec le bouton réinitialise
			const resetBtn = page.locator('#perceval-panel [data-panel-reset]');
			await resetBtn.click();
			expect(await panel.isVisible()).toBe(false);
			expect(await percevalBtn.getAttribute('aria-pressed')).toBe('false');
		} finally {
			await page.close();
		}
	});

	test('sélection d’une relation : affiche son explication et son contexte', async () => {
		const { page } = await openPage();
		try {
			// Bouton d'étiquette pour la relation Gornemant -> Perceval
			const labelBtn = page.locator('.rm-label[data-edge-id="gornemant-perceval-initiation"]');
			await labelBtn.click();

			expect(await labelBtn.getAttribute('aria-pressed')).toBe('true');

			const panel = page.locator('#perceval-panel [data-panel-detail]');
			expect(await panel.isVisible()).toBe(true);

			const eyebrow = await page.locator('#perceval-panel [data-detail-eyebrow]').textContent();
			expect(eyebrow).toBe('Relation · Lien chevaleresque (armes, adoubement, cour)');

			const title = await page.locator('#perceval-panel [data-detail-title]').textContent();
			expect(title).toContain('Gornemant de Goort');
			expect(title).toContain('Perceval');

			const desc = await page.locator('#perceval-panel [data-detail-description]').textContent();
			expect(desc).toContain('trop bavard');

			// Échap ferme la sélection
			await page.keyboard.press('Escape');
			expect(await panel.isVisible()).toBe(false);
		} finally {
			await page.close();
		}
	});

	test('sélection du Roi Pêcheur et du Graal : met en lumière la dimension mystique et le silence', async () => {
		const { page } = await openPage();
		try {
			const roiBtn = page.locator('.rm-node[data-node-id="roi-pecheur"]');
			await roiBtn.click();

			const title = await page.locator('#perceval-panel [data-detail-title]').textContent();
			expect(title).toBe('Le Roi Pêcheur');

			const relText = await page.locator('#perceval-panel [data-detail-relations]').innerText();
			expect(relText).toContain('Graal');
			expect(relText).toContain('cousin germain');

			// Sélectionner ensuite l'objet Graal
			const graalBtn = page.locator('.rm-node[data-node-id="graal"]');
			await graalBtn.click();

			const graalTitle = await page.locator('#perceval-panel [data-detail-title]').textContent();
			expect(graalTitle).toBe('Le Graal');
			const graalDesc = await page.locator('#perceval-panel [data-detail-description]').textContent();
			expect(graalDesc).toContain('hostie');
		} finally {
			await page.close();
		}
	});

	test('filtres par type de relation : masque/affiche les arêtes et réinitialisation', async () => {
		const { page } = await openPage();
		try {
			const filterBtns = page.locator('.rm-legend--filters .rm-filter');
			expect(await filterBtns.count()).toBe(Object.keys(percevalEdgeTypes).length);

			// Cliquer sur le filtre familial pour le désactiver
			const familialBtn = page.locator('.rm-filter[data-filter-type="familial"]');
			expect(await familialBtn.getAttribute('aria-pressed')).toBe('true');
			await familialBtn.click();
			expect(await familialBtn.getAttribute('aria-pressed')).toBe('false');

			// Les arêtes familiales reçoivent la classe .is-filtered
			const filteredEdges = page.locator('.rm-edge--familial.is-filtered');
			expect(await filteredEdges.count()).toBeGreaterThan(0);

			// Le bouton réinitialiser les filtres est actif
			const resetFiltersBtn = page.locator('.rm-filter-reset');
			expect(await resetFiltersBtn.isEnabled()).toBe(true);

			// Réinitialisation
			await resetFiltersBtn.click();
			expect(await familialBtn.getAttribute('aria-pressed')).toBe('true');
			expect(await resetFiltersBtn.isDisabled()).toBe(true);
		} finally {
			await page.close();
		}
	});

	test('alternative textuelle : liste accessible de toutes les relations dépliable', async () => {
		const { page } = await openPage();
		try {
			const detailsIndex = page.locator('details.rm-index');
			expect(await detailsIndex.count()).toBe(1);

			const summary = detailsIndex.locator('summary');
			expect(await summary.textContent()).toContain('Toutes les relations du roman, en texte');

			// Ouvrir le bloc
			await summary.click();
			expect(await detailsIndex.getAttribute('open')).not.toBeNull();

			// Contient les relations textuelles
			const items = detailsIndex.locator('li');
			expect(await items.count()).toBe(percevalRelationships.length);
			expect(await items.first().innerText()).toContain('La mère de Perceval');
		} finally {
			await page.close();
		}
	});

	test('responsive mobile (320px, 375px, 390px, 430px) : aucun débordement horizontal, canvas mobile actif', async () => {
		const viewports = [
			{ width: 320, height: 640 },
			{ width: 375, height: 812 },
			{ width: 390, height: 844 },
			{ width: 430, height: 932 },
		];

		for (const vp of viewports) {
			const { page } = await openPage(vp.width, vp.height);
			try {
				const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
				const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
				expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);

				// Canvas mobile présent
				const mobileSvg = page.locator('.rm-lines--mobile');
				expect(await mobileSvg.count()).toBe(1);

				// Clic tactile sur Perceval
				const percevalBtn = page.locator('.rm-node[data-node-id="perceval"]');
				await percevalBtn.click();

				const panel = page.locator('#perceval-panel [data-panel-detail]');
				expect(await panel.isVisible()).toBe(true);

				// Pas de débordement provoqué par le panneau
				const postScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
				expect(postScrollWidth).toBeLessThanOrEqual(clientWidth + 1);
			} finally {
				await page.close();
			}
		}
	});

	test('responsive tablette et bureau (768px, 1024px, 1280px, 1440px) : pas de débordement, intégrité du graphe', async () => {
		const widths = [768, 1024, 1280, 1440];

		for (const width of widths) {
			const { page } = await openPage(width, 900);
			try {
				const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
				const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
				expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);

				// Présence du graphe desktop
				const desktopSvg = page.locator('.rm-lines--desktop');
				expect(await desktopSvg.isVisible()).toBe(true);
			} finally {
				await page.close();
			}
		}
	});

	test('section iconographique : présence des 6 cartes documentaires, métadonnées, légendes et questions d’observation', async () => {
		const { page, errors } = await openPage();
		try {
			expect(errors).toEqual([]);

			const section = page.locator('#iconographie');
			expect(await section.count()).toBe(1);

			const title = section.locator('#iconography-title');
			expect(await title.textContent()).toContain('Images du Moyen Âge et légende du Graal');

			// Les 6 cartes sont présentes
			const cards = section.locator('.iconography-card');
			expect(await cards.count()).toBe(percevalIconography.length);

			for (let i = 0; i < percevalIconography.length; i++) {
				const card = cards.nth(i);
				const doc = percevalIconography[i];

				// Vérification de l'ID
				expect(await card.getAttribute('id')).toBe(doc.id);

				// Titre et badge de statut
				expect(await card.locator('.iconography-card-title').textContent()).toContain(doc.title);
				expect(await card.locator('.status-badge').textContent()).toBe(doc.badge);

				// Image avec attributs valides et texte alternatif détaillé
				const img = card.locator('.iconography-img');
				expect(await img.getAttribute('src')).toBe(doc.image.src);
				expect((await img.getAttribute('alt'))?.length).toBeGreaterThan(30);

				// Légende sous l'image
				expect(await card.locator('.iconography-caption').textContent()).toContain(doc.image.caption);

				// Métadonnées patrimoniales
				const metaText = await card.locator('.iconography-meta-box').innerText();
				expect(metaText).toContain(doc.meta.institution);
				expect(metaText).toContain(doc.meta.date);

				// Zone d'évaluation pour les élèves
				const evalText = await card.locator('.iconography-evaluation-box').innerText();
				expect(evalText.toUpperCase()).toContain('COMPRENDRE L’IMAGE & LE ROMAN');
				expect(evalText).toContain('Mise en garde historique :');

				// Questions d’observation
				const qText = await card.locator('.iconography-question-box').innerText();
				expect(qText.toUpperCase()).toContain('QUESTIONS D’OBSERVATION :');
				expect(qText).toContain(doc.questions[0]);
			}

			// Bilan méthodologique final pour les 5e
			const synthesis = section.locator('.iconography-synthesis-box');
			expect(await synthesis.count()).toBe(1);
			expect(await synthesis.locator('.iconography-synthesis-title').textContent()).toContain('Ce qu’il faut retenir de ces images');
		} finally {
			await page.close();
		}
	});

	test('lightbox universelle sur /perceval : zoom au clic, affichage de la légende, navigation clavier et fermeture Échap', async () => {
		const { page } = await openPage();
		try {
			const lightbox = page.locator('#image-lightbox');
			expect(await lightbox.count()).toBe(1);

			// Première image iconographique marquée comme zoomable
			const firstImg = page.locator('#doc-perceval-roi-pecheur .iconography-img');
			expect(await firstImg.getAttribute('data-zoomable')).toBe('true');
			expect(await firstImg.getAttribute('role')).toBe('button');

			// Clic pour ouvrir la lightbox
			await firstImg.click();
			expect(await lightbox.getAttribute('open')).not.toBeNull();

			const lightboxImg = lightbox.locator('[data-lightbox-img]');
			expect(await lightboxImg.getAttribute('src')).toContain('perceval-roi-pecheur-bnf-fr12577.jpg');

			// La légende de l'image est affichée dans la lightbox
			const caption = lightbox.locator('[data-lightbox-caption]');
			expect(await caption.isVisible()).toBe(true);
			expect(await caption.textContent()).toContain('Roi Pêcheur');

			// Le défilement de page est verrouillé
			const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
			expect(bodyOverflow).toBe('hidden');

			// Navigation vers l'image suivante avec Flèche Droite
			await page.keyboard.press('ArrowRight');
			expect(await lightboxImg.getAttribute('src')).toContain('cortege-graal-bnf-fr12577.jpg');

			// Navigation vers l'image précédente avec Flèche Gauche
			await page.keyboard.press('ArrowLeft');
			expect(await lightboxImg.getAttribute('src')).toContain('perceval-roi-pecheur-bnf-fr12577.jpg');

			// Fermeture avec la touche Échap
			await page.keyboard.press('Escape');
			expect(await lightbox.getAttribute('open')).toBeNull();

			// Défilement de page restauré
			const postBodyOverflow = await page.evaluate(() => document.body.style.overflow);
			expect(postBodyOverflow).toBe('');
		} finally {
			await page.close();
		}
	});

	test('carte narrative schématique : présence des 7 étapes, sélection d’étape, mise à jour de la fiche et accessibilité clavier', async () => {
		const { page } = await openPage();
		try {
			const geoSection = page.locator('.perceval-geography-section');
			expect(await geoSection.count()).toBe(1);

			// Titre H2 conforme
			const h2 = geoSection.locator('#geography-title');
			expect(await h2.textContent()).toContain('Les étapes du voyage de Perceval dans le roman');

			// 7 jalons SVG interactifs
			const markers = geoSection.locator('.geo-stage-marker');
			expect(await markers.count()).toBe(7);

			// Le premier jalon est actif par défaut
			const firstMarker = markers.first();
			expect(await firstMarker.getAttribute('class')).toContain('is-active');
			expect(await firstMarker.getAttribute('aria-pressed')).toBe('true');

			// Le panneau de détail affiche l'étape 1 (Gaste Forêt)
			const detailTitle = geoSection.locator('#detail-stage-title');
			expect(await detailTitle.textContent()).toContain('Gaste Forêt');

			const detailStatus = geoSection.locator('#detail-stage-status');
			expect(await detailStatus.textContent()).toContain('Espace sauvage du conte');

			// Clic sur l'étape 5 (Château du Roi Pêcheur)
			const grailMarker = geoSection.locator('.geo-stage-marker[data-stage-id="chateau-roi-pecheur"]');
			await grailMarker.click();

			expect(await grailMarker.getAttribute('class')).toContain('is-active');
			expect(await grailMarker.getAttribute('aria-pressed')).toBe('true');
			expect(await detailTitle.textContent()).toContain('Roi Pêcheur');
			expect(await detailStatus.textContent()).toContain('le récit ne permet pas de lui attribuer une position géographique moderne');

			// Filtre par catégorie : cliquer sur 'Lieu réel ou repère breton'
			const realFilter = geoSection.locator('.geo-filter-btn[data-geo-filter="reel"]');
			await realFilter.click();

			// L'étape réelle (Carduel) n'est pas estompée, les étapes fictionnelles le sont
			const carduelMarker = geoSection.locator('.geo-stage-marker[data-stage-id="carduel-arthur"]');
			expect(await carduelMarker.getAttribute('class')).not.toContain('is-dimmed');
			expect(await grailMarker.getAttribute('class')).toContain('is-dimmed');

			// Bouton étape suivante
			const nextBtn = geoSection.locator('#btn-next-stage');
			await nextBtn.click();
			// L'étape a avancé
			const orderText = await geoSection.locator('#detail-stage-order').textContent();
			expect(orderText).toMatch(/Étape \d sur 7/);

			// Tableau accessible dépliable
			const accessibleTable = geoSection.locator('.geo-accessible-table');
			expect(await accessibleTable.count()).toBe(1);
			const rows = accessibleTable.locator('tbody tr');
			expect(await rows.count()).toBe(7);
		} finally {
			await page.close();
		}
	});
});
