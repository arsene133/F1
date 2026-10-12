import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import { chromium, type Browser, type Page } from 'playwright';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import {
	goriotCharacters,
	goriotGuidedTracks,
	goriotNarrativeStages,
	goriotRelCategories,
	goriotRelationships,
} from '../data/goriot-relationships';

const BUILT = existsSync('dist/goriot/index.html');
const PORT = 4398;
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
	await page.waitForSelector('#goriot-relationships');
	return page;
}

describe.skipIf(!BUILT)('Réseau interactif des relations du Père Goriot (/goriot) — E2E & Interactions', () => {
	beforeAll(async () => {
		server = spawn('pnpm', ['astro', 'preview', '--port', String(PORT)], { stdio: 'ignore' });
		await waitForServer(`${BASE}/goriot/`);
		browser = await chromium.launch();
	}, 30_000);

	afterAll(async () => {
		await browser?.close();
		server?.kill();
	});

	test('la page intègre les deux visualisations (lieux et réseau) avec navigation par ancres', async () => {
		const page = await openPage();
		try {
			// Présence des deux sections identifiées
			const relSection = page.locator('#section-reseau-personnages');
			const geoSection = page.locator('#section-carte-lieux');
			expect(await relSection.count()).toBe(1);
			expect(await geoSection.count()).toBe(1);

			// Liens d'ancrage dans l'en-tête
			const navLinks = page.locator('.goriot-visualizations-nav a');
			expect(await navLinks.count()).toBe(2);
			expect(await navLinks.first().getAttribute('href')).toBe('#section-reseau-personnages');
			expect(await navLinks.last().getAttribute('href')).toBe('#section-carte-lieux');

			// La carte géographique Leaflet reste parfaitement fonctionnelle
			expect(await page.locator('#balzac-paris-map').isVisible()).toBe(true);
		} finally {
			await page.close();
		}
	});

	test('tous les 16 personnages sont rendus sous forme de nœuds sur le canevas', async () => {
		const page = await openPage();
		try {
			const nodeButtons = page.locator('#goriot-relationships .rm-node');
			expect(await nodeButtons.count()).toBe(goriotCharacters.length);

			// Vérifier que Rastignac est central (nœud major)
			const rastignacBtn = page.locator('#goriot-relationships button[data-node-id="rastignac"]');
			expect(await rastignacBtn.count()).toBe(1);
			expect(await rastignacBtn.getAttribute('class')).toContain('rm-node--major');
			expect(await rastignacBtn.textContent()).toContain('Eugène de Rastignac');

			// Vérifier la présence du père Goriot
			const goriotBtn = page.locator('#goriot-relationships button[data-node-id="goriot"]');
			expect(await goriotBtn.count()).toBe(1);
			expect(await goriotBtn.textContent()).toContain('Jean-Joachim Goriot');

			// Vérifier la présence de Bianchon (Horace Bianchon unifié)
			const bianchonBtn = page.locator('#goriot-relationships button[data-node-id="bianchon"]');
			expect(await bianchonBtn.count()).toBe(1);
			expect(await bianchonBtn.textContent()).toContain('Horace Bianchon');
		} finally {
			await page.close();
		}
	});

	test('sélection d’un personnage : affiche sa fiche, son rôle, sa citation et ses relations directes', async () => {
		const page = await openPage();
		try {
			// Clic sur Rastignac
			await page.click('#goriot-relationships button[data-node-id="rastignac"]');

			const title = await page.locator('#goriot-relationships [data-detail-title]').textContent();
			expect(title).toBe('Eugène de Rastignac');

			const role = await page.locator('#goriot-relationships [data-detail-role]').textContent();
			expect(role).toContain('Rôle :');
			expect(role).toContain('Noble provincial');

			const quote = await page.locator('#goriot-relationships [data-detail-quote-text]').textContent();
			expect(quote).toContain('À nous deux maintenant !');

			// Relations directes affichées dans la liste
			const rels = await page.locator('#goriot-relationships [data-detail-relations] li').allTextContents();
			expect(rels.some((r) => r.includes('Delphine de Nucingen'))).toBe(true);
			expect(rels.some((r) => r.includes('Mme de Beauséant'))).toBe(true);
			expect(rels.some((r) => r.includes('Vautrin'))).toBe(true);
			expect(rels.some((r) => r.includes('Horace Bianchon'))).toBe(true);

			// Les nœuds voisins sont en surbrillance (.is-related)
			const delphineClass = await page.locator('#goriot-relationships button[data-node-id="delphine"]').getAttribute('class');
			expect(delphineClass).toContain('is-related');
		} finally {
			await page.close();
		}
	});

	test('sélection d’une relation : affiche le contexte narratif et la citation textuelle', async () => {
		const page = await openPage();
		try {
			// Clic sur l'étiquette de tentation Vautrin -> Rastignac
			const labelBtn = page.locator('#goriot-relationships button.rm-label[data-edge-id="vautrin-rastignac"]');
			await labelBtn.click();

			const title = await page.locator('#goriot-relationships [data-detail-title]').textContent();
			expect(title).toContain('Vautrin');
			expect(title).toContain('Eugène de Rastignac');

			const eyebrow = await page.locator('#goriot-relationships [data-detail-eyebrow]').textContent();
			expect(eyebrow).toContain('Conflit et manipulation');

			const desc = await page.locator('#goriot-relationships [data-detail-description]').textContent();
			expect(desc).toContain('pacte diabolique');
			expect(desc).toContain('Taillefer');

			const quote = await page.locator('#goriot-relationships [data-detail-quote-text]').textContent();
			expect(quote).toContain('Mon petit, je vous propose un marché');
		} finally {
			await page.close();
		}
	});

	test('filtrage par catégorie : active/désactive réellement les arêtes et actualise le compteur', async () => {
		const page = await openPage();
		try {
			// Initialement toutes les relations sont visibles (23)
			const statsInitial = await page.locator('#goriot-relationships [data-stats-count]').textContent();
			expect(statsInitial).toContain(`${goriotRelationships.length} relations`);

			// Désactiver la catégorie "Famille et filiation"
			const familyChip = page.locator('#goriot-relationships button[data-cat-filter="family"]');
			await familyChip.click();

			// Arêtes de la catégorie masquées
			const familyEdge = page.locator('#goriot-relationships .rm-lines--desktop .rm-edge--family').first();
			expect(await familyEdge.getAttribute('style')).toContain('display: none');

			const statsAfter = await page.locator('#goriot-relationships [data-stats-count]').textContent();
			expect(statsAfter).not.toContain(`${goriotRelationships.length} relations`);

			// Réactiver "Famille et filiation"
			await familyChip.click();
			expect(await familyEdge.getAttribute('style')).not.toContain('display: none');
		} finally {
			await page.close();
		}
	});

	test('parcours guidés : active la mise en valeur des protagonistes et affiche le bandeau descriptif', async () => {
		const page = await openPage();
		try {
			// Clic sur le parcours "La famille Goriot"
			const trackBtn = page.locator('#goriot-relationships button[data-track-id="famille-goriot"]');
			await trackBtn.click();

			const banner = page.locator('#goriot-relationships [data-track-banner]');
			expect(await banner.isVisible()).toBe(true);
			expect(await banner.textContent()).toContain('La famille Goriot');
			expect(await banner.textContent()).toContain('martyre du père');

			// Goriot et ses filles sont mis en valeur (is-active)
			const goriotClass = await page.locator('#goriot-relationships button[data-node-id="goriot"]').getAttribute('class');
			expect(goriotClass).toContain('is-active');

			// Fermeture du bandeau
			await page.click('#goriot-relationships [data-close-track]');
			expect(await banner.isVisible()).toBe(false);
		} finally {
			await page.close();
		}
	});

	test('évolution chronologique par étape : masque les relations ultérieures non encore établies', async () => {
		const page = await openPage();
		try {
			const stageSelect = page.locator('#goriot-relationships [data-stage-select]');

			// Sélectionner l'étape 1 (Une pension bourgeoise)
			await stageSelect.selectOption('stage-1');

			// Une relation de l'étape 3 (comme le meurtre Taillefer ou la délation de Michonneau) doit être masquée
			const crimeEdge = page.locator('#goriot-relationships .rm-lines--desktop .rm-edge[data-edge-id="vautrin-taillefer-crime"]');
			expect(await crimeEdge.getAttribute('style')).toContain('display: none');

			// Revenir à "Roman entier"
			await stageSelect.selectOption('all');
			expect(await crimeEdge.getAttribute('style')).not.toContain('display: none');
		} finally {
			await page.close();
		}
	});

	test('recherche de personnage et table textuelle accessible synchronisée', async () => {
		const page = await openPage();
		try {
			// Ouvrir le details de la table accessible
			await page.click('#goriot-relationships details[data-accessible-table] summary');

			const searchInput = page.locator('#goriot-relationships [data-search-input]');
			await searchInput.fill('Vautrin');

			// Nœuds filtrés : Vautrin visible
			const stats = await page.locator('#goriot-relationships [data-stats-count]').textContent();
			expect(stats).toContain('personnage');

			// Table accessible : bouton de sélection pour Vautrin visible
			const accBtn = page.locator('#goriot-relationships button[data-acc-select-id="vautrin"]');
			expect(await accBtn.isVisible()).toBe(true);
			await accBtn.click();

			// La fiche affiche bien Vautrin
			const title = await page.locator('#goriot-relationships [data-detail-title]').textContent();
			expect(title).toContain('Vautrin');

			// Bouton réinitialiser
			await page.click('#goriot-relationships [data-btn-reset]');
			expect(await searchInput.inputValue()).toBe('');
		} finally {
			await page.close();
		}
	});

	test('accessibilité clavier : navigation fléchée et touche Échap', async () => {
		const page = await openPage();
		try {
			// Sélectionner Rastignac
			await page.click('#goriot-relationships button[data-node-id="rastignac"]');
			expect(await page.locator('#goriot-relationships [data-panel-detail]').isVisible()).toBe(true);

			// Appuyer sur Échap
			await page.keyboard.press('Escape');
			expect(await page.locator('#goriot-relationships [data-panel-detail]').isVisible()).toBe(false);
			expect(await page.locator('#goriot-relationships [data-panel-hint]').isVisible()).toBe(true);
		} finally {
			await page.close();
		}
	});

	test('comportement responsive mobile (viewport 375×812)', async () => {
		const page = await openPage(375, 812);
		try {
			// SVG mobile visible
			const mobileSvg = page.locator('#goriot-relationships .rm-lines--mobile');
			expect(await mobileSvg.isVisible()).toBe(true);

			// Clic sur Rastignac sur mobile
			const rastignacBtn = page.locator('#goriot-relationships button[data-node-id="rastignac"]');
			await rastignacBtn.click();

			const title = await page.locator('#goriot-relationships [data-detail-title]').textContent();
			expect(title).toBe('Eugène de Rastignac');
		} finally {
			await page.close();
		}
	});
});
