// Lettres d'une Péruvienne (/graffigny) :
// rendu, cohérence des trois vues reliées, filtres, clavier et téléphone dans un vrai navigateur (Chromium).
// S'exécute sur le site construit : `pnpm build` d'abord, sinon la suite est ignorée.
import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { chromium, type Browser, type Page } from 'playwright';
import { graffignyCharacters, graffignyRelationships, graffignySources, placesOfCharacter } from '../data/graffigny';

const BUILT = existsSync('dist/graffigny/index.html');
const PORT = 4397;
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

async function openPage(width = 1280, height = 900): Promise<{ page: Page; errors: string[] }> {
	const page = await browser.newPage({ viewport: { width, height }, hasTouch: width < 700, isMobile: width < 700 });
	const errors: string[] = [];
	page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
	page.on('pageerror', (e) => errors.push(String(e)));
	await page.goto(`${BASE}/graffigny/`);
	await page.waitForSelector('.graffigny-page .rm-canvas');
	return { page, errors };
}

const node = (page: Page, id: string) => page.locator(`.rm-node[data-node-id="${id}"]`);
const step = (page: Page, id: string) => page.locator(`[data-step-id="${id}"]`);
const theme = (page: Page, id: string) => page.locator(`[data-theme-id="${id}"]`);
const pressed = (page: Page, sel: string) =>
	page.$$eval(`${sel}[aria-pressed="true"]`, (els) => els.map((e) => (e as HTMLElement).dataset.nodeId ?? (e as HTMLElement).dataset.stepId ?? (e as HTMLElement).dataset.themeId));
const linked = (page: Page, sel: string, attr: string) =>
	page.$$eval(`${sel}.is-linked`, (els, a) => els.map((e) => e.getAttribute(a)), attr);
const related = (page: Page) =>
	page.$$eval('.rm-node.is-related, .rm-node.is-active', (els) => els.map((e) => (e as HTMLElement).dataset.nodeId).sort());

describe.skipIf(!BUILT)('Page Graffigny (/graffigny) — cartographie interactive', () => {
	beforeAll(async () => {
		server = spawn('pnpm', ['astro', 'preview', '--port', String(PORT)], { stdio: 'ignore' });
		await waitForServer(`${BASE}/graffigny/`);
		browser = await chromium.launch();
	}, 30_000);

	afterAll(async () => {
		await browser?.close();
		server?.kill();
	});

	test('rendu : titre, métadonnées, un seul H1 et hiérarchie des titres sans saut', async () => {
		const { page, errors } = await openPage();
		try {
			expect(await page.title()).toContain('Graffigny');
			expect(await page.locator('meta[name="description"]').getAttribute('content')).toContain('Lettres d’une Péruvienne');
			expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toMatch(/\/graffigny\/?$/);

			const h1 = page.locator('h1');
			expect(await h1.count()).toBe(1);
			expect((await h1.textContent())!.replace(/\s+/g, ' ').trim()).toBe('Françoise de Graffigny — Lettres d’une Péruvienne');

			// Titres visibles dans l'ordre du document : jamais de saut de niveau.
			const levels = await page.$$eval('main h1, main h2, main h3, main h4', (els) =>
				els.filter((e) => !e.closest('[hidden]')).map((e) => Number(e.tagName[1])),
			);
			expect(levels[0]).toBe(1);
			for (let i = 1; i < levels.length; i++) expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);

			// Repères essentiels et vues annoncées
			const facts = await page.locator('.key-facts dt').allTextContents();
			expect(facts).toEqual(['Autrice', 'Publication', 'Genre', 'Mouvement', 'Parcours']);
			for (const id of ['vue-personnages', 'vue-parcours', 'vue-idees', 'vue-geographie', 'evolution-zilia', 'regard-etranger-montesquieu', 'revision', 'sources']) {
				expect(await page.locator(`#${id}`).count(), id).toBe(1);
			}
			expect(errors).toEqual([]);
		} finally {
			await page.close();
		}
	});

	test('carte : un nœud par personnage, une arête et une étiquette par relation, sens explicite', async () => {
		const { page } = await openPage();
		try {
			expect(await page.locator('.rm-node').count()).toBe(graffignyCharacters.length);
			expect(await page.locator('.rm-lines--desktop .rm-edge').count()).toBe(graffignyRelationships.length);
			expect(await page.locator('.rm-label').count()).toBe(graffignyRelationships.length);

			const data = await page.evaluate(() => JSON.parse(document.querySelector('[data-map-data]')!.textContent!));
			const love = data.relationships.find((r: any) => r.id === 'deterville-zilia-amour');
			expect(love.title).toBe('Déterville → Zilia');
			const mutual = data.relationships.find((r: any) => r.id === 'amant-celine-amour');
			expect(mutual.title).toContain('↔');
			// Chaque arête orientée porte une flèche.
			const marker = await page.locator('.rm-lines--desktop [data-edge-id="deterville-zilia-amour"]').getAttribute('style');
			expect(marker).toContain('--m-end');
		} finally {
			await page.close();
		}
	});

	test('sélectionner Zilia met en évidence ses étapes et ses thèmes ; fermer la fiche réinitialise', async () => {
		const { page, errors } = await openPage();
		try {
			await node(page, 'zilia').click();
			expect(await node(page, 'zilia').getAttribute('aria-pressed')).toBe('true');
			expect(await page.locator('[data-detail-title]').textContent()).toBe('Zilia');
			expect((await linked(page, '[data-step-id]', 'data-step-id')).length).toBe(7);
			expect((await linked(page, '[data-theme-id]', 'data-theme-id')).length).toBe(7);
			expect(await page.locator('[data-selection-status]').textContent()).toContain('Zilia');
			expect(await page.locator('[data-global-reset]').isEnabled()).toBe(true);

			// Renvois de la fiche vers les autres vues : ses 7 étapes, ses 7 thèmes et ses lieux (carte géographique),
			// chacun une seule fois et vers une ancre présente dans la page
			const hrefs = await page.$$eval('.rm-detail-links a', (as) => as.map((a) => a.getAttribute('href')!));
			expect(hrefs).toEqual(graffignyCharacters.find((c) => c.id === 'zilia')!.links!.map((l) => l.href));
			expect(new Set(hrefs).size, 'aucun doublon').toBe(hrefs.length);
			expect(hrefs.filter((h) => h.startsWith('#etape-'))).toHaveLength(7);
			expect(hrefs.filter((h) => h.startsWith('#theme-'))).toHaveLength(7);
			expect(hrefs.filter((h) => h.startsWith('#lieu-'))).toEqual(placesOfCharacter('zilia').map((id) => `#lieu-${id}`));
			expect(hrefs).toHaveLength(14 + placesOfCharacter('zilia').length);
			for (const href of hrefs) expect(await page.locator(href).count(), href).toBe(1);

			await page.locator('[data-panel-reset]').click();
			expect(await pressed(page, '.rm-node')).toEqual([]);
			expect(await linked(page, '[data-step-id]', 'data-step-id')).toEqual([]);
			expect(await page.locator('[data-global-reset]').isEnabled()).toBe(false);
			expect(errors).toEqual([]);
		} finally {
			await page.close();
		}
	});

	test('une relation sélectionnée s’explique et éclaire les étapes et thèmes correspondants', async () => {
		const { page } = await openPage();
		try {
			await page.locator('.rm-label[data-edge-id="aza-zilia-trahison"]').click();
			expect(await page.locator('[data-detail-title]').textContent()).toBe('Aza → Zilia');
			expect(await page.locator('[data-detail-description]').textContent()).toContain('Aza est infidéle');
			expect(await linked(page, '[data-step-id]', 'data-step-id')).toEqual(['denouement']);
			expect(await linked(page, '[data-theme-id]', 'data-theme-id')).toEqual(['amour']);
		} finally {
			await page.close();
		}
	});

	test('sélectionner une étape fait ressortir ses personnages ; Échap ferme la fiche', async () => {
		const { page } = await openPage();
		try {
			await step(page, 'rencontre').click();
			expect(await step(page, 'rencontre').getAttribute('aria-pressed')).toBe('true');
			expect(await page.locator('#etape-rencontre').isVisible()).toBe(true);
			expect(await related(page)).toEqual(['aine', 'celine', 'china', 'deterville', 'mere', 'zilia']);
			expect(await page.locator('.relationship-map').getAttribute('data-active')).not.toBeNull();
			expect((await linked(page, '[data-theme-id]', 'data-theme-id')).sort()).toEqual(['critique', 'langue', 'regard']);

			await page.keyboard.press('Escape');
			expect(await page.locator('#etape-rencontre').isHidden()).toBe(true);
			expect(await related(page)).toEqual([]);
			// Le focus revient sur l'étape d'origine.
			expect(await page.evaluate(() => (document.activeElement as HTMLElement).dataset.stepId)).toBe('rencontre');
		} finally {
			await page.close();
		}
	});

	test('sélectionner un thème révèle relations et passages ; une pastille ramène au personnage', async () => {
		const { page } = await openPage();
		try {
			await theme(page, 'amour').click();
			expect(await page.locator('#theme-amour').isVisible()).toBe(true);
			expect(await page.locator('#theme-amour .ideas-questions li').count()).toBeGreaterThanOrEqual(1);
			const edges = await page.$$eval('.rm-lines--desktop .rm-edge.is-related', (els) => els.map((e) => (e as HTMLElement).dataset.edgeId));
			expect(edges).toEqual(expect.arrayContaining(['aza-zilia-trahison', 'deterville-zilia-amour', 'zilia-deterville-amitie']));
			expect((await linked(page, '[data-step-id]', 'data-step-id')).sort()).toEqual(['arrachement', 'attente', 'denouement']);

			// Passage d'une vue à l'autre : la sélection reste unique et cohérente.
			await page.locator('#theme-amour [data-goto-node="aza"]').click();
			expect(await node(page, 'aza').getAttribute('aria-pressed')).toBe('true');
			expect(await page.locator('#theme-amour').isHidden()).toBe(true);
			expect(await pressed(page, '[data-theme-id]')).toEqual([]);
			expect(await page.locator('[data-detail-title]').textContent()).toBe('Aza');

			// Renvoi de la fiche du personnage vers une étape
			await page.locator('.rm-detail-links a[href="#etape-denouement"]').click();
			expect(await page.locator('#etape-denouement').isVisible()).toBe(true);
			expect(await pressed(page, '.rm-node')).toEqual([]);
			expect(await page.locator('[data-panel-detail]').isHidden()).toBe(true);
		} finally {
			await page.close();
		}
	});

	test('filtres par type de relation, puis « Tout afficher » rétablit la vue initiale', async () => {
		const { page } = await openPage();
		try {
			const filters = page.locator('[data-filter-type]');
			expect(await filters.count()).toBe(7);
			for (const label of await filters.allTextContents()) expect(label.trim().length).toBeGreaterThan(3);

			const amour = page.locator('[data-filter-type="amour"]');
			await amour.click();
			expect(await amour.getAttribute('aria-pressed')).toBe('false');
			const hidden = page.locator('.rm-lines--desktop .rm-edge--amour');
			for (let i = 0; i < (await hidden.count()); i++) expect(await hidden.nth(i).isHidden()).toBe(true);
			expect(await page.locator('.rm-label--amour').first().isHidden()).toBe(true);
			expect(await page.locator('.rm-edge--savoir').first().isVisible()).toBe(true);

			await page.locator('[data-filter-reset]').click();
			expect(await amour.getAttribute('aria-pressed')).toBe('true');
			expect(await page.locator('.rm-label--amour').first().isVisible()).toBe(true);

			// Réinitialisation globale : sélection, mise en évidence et filtres
			await page.locator('[data-filter-type="parente"]').click();
			await theme(page, 'femmes').click();
			await page.locator('[data-global-reset]').click();
			expect(await page.locator('[data-filter-type="parente"]').getAttribute('aria-pressed')).toBe('true');
			expect(await pressed(page, '[data-theme-id]')).toEqual([]);
			expect(await related(page)).toEqual([]);
			expect(await page.locator('.relationship-map').getAttribute('data-active')).toBeNull();
			expect(await page.locator('[data-theme-detail]:not([hidden]), [data-step-detail]:not([hidden])').count()).toBe(0);
		} finally {
			await page.close();
		}
	});

	test('clavier : flèches entre étapes et entre thèmes, Entrée ouvre, libellés accessibles', async () => {
		const { page } = await openPage();
		try {
			await step(page, 'arrachement').focus();
			await page.keyboard.press('ArrowRight');
			expect(await page.evaluate(() => (document.activeElement as HTMLElement).dataset.stepId)).toBe('traversee');
			await page.keyboard.press('Enter');
			expect(await page.locator('#etape-traversee').isVisible()).toBe(true);

			await theme(page, 'lumieres').focus();
			await page.keyboard.press('ArrowRight');
			expect(await page.evaluate(() => (document.activeElement as HTMLElement).dataset.themeId)).toBe('regard');

			// Tous les boutons ont un nom accessible.
			const unnamed = await page.$$eval('main button', (els) =>
				els.filter((b) => !(b.getAttribute('aria-label') || b.textContent || '').trim()).length,
			);
			expect(unnamed).toBe(0);
		} finally {
			await page.close();
		}
	});

	test.each([320, 375])('téléphone (%ipx) : pas de débordement, fiches amenées à l’écran et refermables', async (width) => {
		const { page, errors } = await openPage(width, 740);
		try {
			const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
			expect(overflow).toBe(0);

			// Disposition mobile de la carte : tous les nœuds restent dans le canevas.
			const outside = await page.$$eval('.rm-node', (els) => {
				const c = document.querySelector('.rm-canvas')!.getBoundingClientRect();
				return els.filter((e) => {
					const r = e.getBoundingClientRect();
					return r.left < c.left - 1 || r.right > c.right + 1 || r.top < c.top - 1 || r.bottom > c.bottom + 1;
				}).length;
			});
			expect(outside).toBe(0);

			// Toucher un personnage : la fiche est amenée à l'écran.
			await node(page, 'deterville').tap();
			await page.waitForTimeout(700);
			const panel = await page.locator('.rm-panel').boundingBox();
			expect(panel!.y).toBeLessThan(740);
			expect(await page.locator('[data-panel-reset]').isVisible()).toBe(true);

			// Une étape choisie depuis la fiche s'ouvre à l'écran, avec son bouton de fermeture.
			await page.locator('.rm-detail-links a[href="#etape-attente"]').tap();
			await page.waitForTimeout(700);
			const close = page.locator('#etape-attente [data-view-close]');
			const box = await close.boundingBox();
			expect(box!.y).toBeGreaterThanOrEqual(0);
			expect(box!.y + box!.height).toBeLessThanOrEqual(740);
			await close.tap();
			expect(await page.locator('#etape-attente').isHidden()).toBe(true);

			// La carte des idées devient une liste lisible.
			const ideaWidth = (await theme(page, 'regard').boundingBox())!.width;
			expect(ideaWidth).toBeGreaterThan(width * 0.7);
			expect(errors).toEqual([]);
		} finally {
			await page.close();
		}
	});

	test('quatrième vue : présence de la carte Leaflet, des filtres, des boutons de vue et de la légende', async () => {
		const { page, errors } = await openPage();
		try {
			expect(await page.locator('#vue-geographie').isVisible()).toBe(true);
			expect(await page.locator('#graffigny-leaflet-map').isVisible()).toBe(true);
			expect(await page.locator('.geo-filter-btn').count()).toBe(5); // all + 4 categories
			expect(await page.locator('#btn-recenter-geo').isVisible()).toBe(true);
			expect(await page.locator('#btn-view-transatlantique').isVisible()).toBe(true);
			expect(await page.locator('.geo-legend-item').count()).toBe(4);
			expect(await page.locator('.geo-alt-item').count()).toBe(9);
			expect(errors).toEqual([]);
		} finally {
			await page.close();
		}
	});

	test('géographie : sélection d’un lieu, mise à jour de la fiche, synchronisation globale et fermeture', async () => {
		const { page, errors } = await openPage();
		try {
			// Déplier la liste accessible si fermée
			await page.locator('.geo-alt-summary').click();
			// Clic sur le marqueur dans la liste textuelle accessible
			await page.locator('[data-select-place-btn="temple-du-soleil"]').click();
			expect(await page.locator('#geo-card-title').textContent()).toContain('Le Temple du Soleil');
			expect(await page.locator('#geo-card-badge-status').textContent()).toContain('Lieu attesté');
			expect(await page.locator('[data-selection-status]').textContent()).toContain('Le Temple du Soleil');
			expect(await page.locator('[data-global-reset]').isEnabled()).toBe(true);

			// Synchronisation vers les autres vues : étape 'arrachement' et thème 'cultures' mis en évidence
			expect((await linked(page, '[data-step-id]', 'data-step-id'))).toContain('arrachement');
			expect((await linked(page, '[data-theme-id]', 'data-theme-id'))).toContain('cultures');

			// Fermer la fiche depuis le bouton fermer
			await page.locator('#geo-card-close-btn').click();
			expect(await page.locator('[data-global-reset]').isEnabled()).toBe(false);
			expect(errors).toEqual([]);
		} finally {
			await page.close();
		}
	});

	test('géographie : filtrage par catégorie masque et affiche les marqueurs', async () => {
		const { page } = await openPage();
		try {
			const trajetBtn = page.locator('[data-geo-filter="trajet"]');
			await trajetBtn.click();
			expect(await trajetBtn.getAttribute('aria-pressed')).toBe('true');
			expect(await page.locator('[data-geo-filter="all"]').getAttribute('aria-pressed')).toBe('false');

			// Réinitialisation par 'all'
			await page.locator('[data-geo-filter="all"]').click();
			expect(await page.locator('[data-geo-filter="all"]').getAttribute('aria-pressed')).toBe('true');
		} finally {
			await page.close();
		}
	});

	test('synchronisation bidirectionnelle : sélectionner un thème ou une étape met en valeur ses lieux géographiques', async () => {
		const { page } = await openPage();
		try {
			await step(page, 'arrachement').click();
			expect(await page.locator('[data-selection-status]').textContent()).toContain('L’arrachement au Pérou');
			// Vérifier que le statut mentionne les lieux liés
			expect(await page.locator('[data-selection-status]').textContent()).toContain('lieu');

			// « Tout afficher » réinitialise l'ensemble des 4 vues
			await page.locator('[data-global-reset]').click();
			expect(await page.locator('[data-global-reset]').isEnabled()).toBe(false);
			expect(await page.locator('[data-selection-status]').textContent()).toContain('Rien n’est sélectionné');
		} finally {
			await page.close();
		}
	});

	test('section comparative : Montesquieu, dates 1721 et 1747/1752, tableau et question de synthèse', async () => {
		const { page, errors } = await openPage();
		try {
			const section = page.locator('#regard-etranger-montesquieu');
			expect(await section.count()).toBe(1);

			// Titre et contenu
			const title = await section.locator('h2').textContent();
			expect(title).toContain('Montesquieu');
			expect(title).toContain('Graffigny');
			expect(title).toContain('regard étranger');

			const text = await section.textContent();
			// Dates exigées
			expect(text).toContain('1721');
			expect(text).toContain('1747');
			expect(text).toContain('1752');

			// Les deux auteurs et œuvres
			expect(text).toContain('Montesquieu');
			expect(text).toContain('Lettres persanes');
			expect(text).toContain('Françoise de Graffigny');
			expect(text).toContain('Lettres d’une Péruvienne');

			// Tableau comparatif : colonnes et lignes
			const headers = await section.locator('.comparison-table thead th').allTextContents();
			expect(headers[0]).toContain('Aspect');
			expect(headers[1]).toContain('Montesquieu');
			expect(headers[2]).toContain('Graffigny');
			expect(await section.locator('.comparison-table tbody tr').count()).toBe(4);

			// Question de synthèse
			const synth = section.locator('.synthesis-prompt');
			expect(await synth.count()).toBe(1);
			const synthText = await synth.textContent();
			expect(synthText).toContain('Comment le regard d’un personnage étranger');
			expect(synthText).toContain('Montesquieu');
			expect(synthText).toContain('Graffigny');
			expect(synthText).toContain('Zilia');

			expect(errors).toEqual([]);
		} finally {
			await page.close();
		}
	});

	test.each([320, 375, 768, 960, 1280])('absence de débordement horizontal pour la largeur %ipx', async (width) => {
		const { page, errors } = await openPage(width, 800);
		try {
			const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
			expect(overflow).toBe(0);

			// Vérifier spécifiquement la section comparative
			const sectionOverflow = await page.evaluate(() => {
				const s = document.getElementById('regard-etranger-montesquieu');
				if (!s) return -1;
				return s.scrollWidth - s.clientWidth;
			});
			expect(sectionOverflow).toBe(0);

			expect(errors).toEqual([]);
		} finally {
			await page.close();
		}
	});

	test('liens internes existants et références externes en https', async () => {
		const { page } = await openPage();
		try {
			expect(await page.locator('header a[href="/graffigny"]').count()).toBe(1);
			for (const r of graffignySources.internal) {
				expect((await fetch(`${BASE}${r.url}/`)).status, r.url).toBe(200);
			}
			for (const r of graffignySources.references) expect(r.url).toMatch(/^https:\/\//);
			const home = await (await fetch(`${BASE}/`)).text();
			expect(home).toContain('href="/graffigny"');
		} finally {
			await page.close();
		}
	});

	test('parcours iconographique : rendu des 6 fiches documentaires, métadonnées, images et questions', async () => {
		const { page, errors } = await openPage();
		try {
			const section = page.locator('#sources-iconographiques');
			expect(await section.count()).toBe(1);

			// Titre et bannière
			const title = await section.locator('#iconography-section-title').textContent();
			expect(title).toContain('Lettres d’une Péruvienne');

			// 6 cartes documentaires
			const cards = section.locator('.iconography-card');
			expect(await cards.count()).toBe(6);

			// 6 images valides avec dimensions et alt
			const images = section.locator('.iconography-img');
			expect(await images.count()).toBe(6);
			for (let i = 0; i < 6; i++) {
				const img = images.nth(i);
				const src = await img.getAttribute('src');
				const alt = await img.getAttribute('alt');
				expect(src).toMatch(/^\/images\/graffigny\/.+\.jpg$/);
				expect(alt).toBeTruthy();
				expect(alt!.length).toBeGreaterThan(20);
			}

			// Boîtes d'analyse critique et questions
			expect(await section.locator('.iconography-evaluation-box').count()).toBe(6);
			expect(await section.locator('.iconography-question-box').count()).toBe(6);

			// Bilan méthodologique
			const synthesis = section.locator('.iconography-synthesis-box');
			expect(await synthesis.count()).toBe(1);
			const synthText = await synthesis.textContent();
			expect(synthText).toContain('Bilan méthodologique');
			expect(synthText).toContain('Identifier le statut du document');

			expect(errors).toEqual([]);
		} finally {
			await page.close();
		}
	});

	test('note pédagogique repliée sur les connaissances de Graffigny concernant le Pérou', async () => {
		const { page, errors } = await openPage();
		try {
			const note = page.locator('details.peru-knowledge-note');
			expect(await note.count()).toBe(1);

			// Titre et badge
			const title = page.locator('#peru-knowledge-title');
			expect(await title.textContent()).toBe('Que savait vraiment Graffigny du Pérou ?');

			// Repliée par défaut
			const isOpenByDefault = await note.evaluate((el: HTMLDetailsElement) => el.open);
			expect(isOpenByDefault).toBe(false);

			const content = note.locator('.peru-knowledge-content');
			expect(await content.isVisible()).toBe(false);

			// Ouverture au clic sur le summary
			const summary = note.locator('summary.peru-knowledge-summary');
			await summary.click();

			const isOpenAfterClick = await note.evaluate((el: HTMLDetailsElement) => el.open);
			expect(isOpenAfterClick).toBe(true);
			expect(await content.isVisible()).toBe(true);

			// Vérification des 3 niveaux de contenu + pourquoi est-ce important
			const text = await content.textContent();
			expect(text).toContain('Des connaissances historiques');
			expect(text).toContain('Une connaissance indirecte');
			expect(text).toContain('Une transformation romanesque');
			expect(text).toContain('Pourquoi est-ce important ?');

			// Vérification des éléments textuels clés
			expect(text).toContain('culte du Soleil');
			expect(text).toContain('quipos');
			expect(text).toContain('Garcilaso de la Vega');
			expect(text).toContain('Aza');

			// Fermeture au second clic
			await summary.click();
			const isOpenAfterSecondClick = await note.evaluate((el: HTMLDetailsElement) => el.open);
			expect(isOpenAfterSecondClick).toBe(false);
			expect(await content.isVisible()).toBe(false);

			expect(errors).toEqual([]);
		} finally {
			await page.close();
		}
	});
});
