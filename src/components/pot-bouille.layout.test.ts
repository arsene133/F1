// Carte relationnelle de Pot-Bouille (/pot-bouille) :
// tests de rendu, données et interactions dans un vrai navigateur (Chromium).
// S'exécute sur le site construit : `pnpm build` d'abord, sinon la suite est ignorée.
import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { chromium, type Browser, type Page } from 'playwright';

const BUILT = existsSync('dist/pot-bouille/index.html');
const PORT = 4394;
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
	await page.goto(`${BASE}/pot-bouille/`);
	await page.waitForSelector('.rm-canvas');
	return page;
}

describe.skipIf(!BUILT)('Carte relationnelle de Pot-Bouille (/pot-bouille) — rendu et interactions', () => {
	beforeAll(async () => {
		server = spawn('pnpm', ['astro', 'preview', '--port', String(PORT)], { stdio: 'ignore' });
		await waitForServer(`${BASE}/pot-bouille/`);
		browser = await chromium.launch();
	}, 30_000);

	afterAll(async () => {
		await browser?.close();
		server?.kill();
	});

	test('données JSON : les personnages majeurs et les relations d’adultère/mariage existent', async () => {
		const page = await openPage();
		try {
			const data = await page.evaluate(() => {
				const script = document.querySelector('[data-map-data]');
				return script ? JSON.parse(script.textContent || '{}') : null;
			});

			expect(data).toBeTruthy();
			expect(data.nodes.length).toBeGreaterThanOrEqual(15);

			// Vérifier la présence d'Octave Mouret, Berthe et Auguste
			const mouret = data.nodes.find((n: any) => n.id === 'mouret');
			expect(mouret).toBeDefined();
			expect(mouret.label).toBe('Octave Mouret');

			const berthe = data.nodes.find((n: any) => n.id === 'berthe');
			expect(berthe).toBeDefined();
			expect(berthe.label).toBe('Berthe Josserand');

			const auguste = data.nodes.find((n: any) => n.id === 'auguste-vabre');
			expect(auguste).toBeDefined();
			expect(auguste.label).toBe('Auguste Vabre');

			// Vérifier la relation adultère centrale
			const mouretBerthe = data.relationships.find(
				(r: any) => r.source === 'mouret' && r.targets.includes('berthe'),
			);
			expect(mouretBerthe).toBeDefined();
			expect(mouretBerthe.label).toBe('liaison adultère');
			expect(mouretBerthe.typeLabel).toBe('Liaison amoureuse / adultère');
			expect(mouretBerthe.description).toContain('Rachel');
		} finally {
			await page.close();
		}
	});

	test('rendu visuel : le canevas SVG, l’ancre de l’immeuble et la légende sont rendus', async () => {
		const page = await openPage();
		try {
			// Ancre de l'adresse de l'immeuble
			const anchor = page.locator('.rm-anchor');
			expect(await anchor.count()).toBe(1);
			expect(await anchor.textContent()).toContain('28, rue de Choiseul');

			// Nœuds rendus
			const nodes = page.locator('.rm-node');
			expect(await nodes.count()).toBeGreaterThanOrEqual(15);

			// Arêtes de type adultère et mariage
			const adulteryEdges = page.locator('.rm-lines--desktop .rm-edge--adultery');
			expect(await adulteryEdges.count()).toBeGreaterThanOrEqual(3);

			// Légende
			const legendText = await page.locator('.rm-legend').textContent();
			expect(legendText).toContain('Liaison amoureuse / adultère');
			expect(legendText).toContain('Mariage / couple bourgeois');
			expect(legendText).toContain('Intérêt financier / dot');

			// Index textuel
			const indexText = await page.locator('.rm-index').textContent();
			expect(indexText).toContain('Octave Mouret');
			expect(indexText).toContain('Berthe Josserand');
		} finally {
			await page.close();
		}
	});

	test('sélection d’Octave Mouret : active le panneau avec ses conquêtes et son rôle', async () => {
		const page = await openPage();
		try {
			await page.click('button[data-node-id="mouret"]');

			const title = await page.locator('.rm-panel [data-detail-title]').textContent();
			expect(title).toBe('Octave Mouret');

			const eyebrow = await page.locator('.rm-panel [data-detail-eyebrow]').textContent();
			expect(eyebrow).toContain('ambitieux');

			const relations = await page.locator('[data-detail-relations] li').allTextContents();
			// Vérifier qu'Octave affiche ses conquêtes féminines
			expect(relations.some((r) => r.includes('Berthe Josserand'))).toBe(true);
			expect(relations.some((r) => r.includes('Marie Pichon'))).toBe(true);
			expect(relations.some((r) => r.includes('Valérie Vabre'))).toBe(true);
			expect(relations.some((r) => r.includes('Caroline Hédouin'))).toBe(true);

			// Surbrillance du nœud Berthe et de l'arête d'adultère
			const bertheClass = await page.locator('button[data-node-id="berthe"]').getAttribute('class');
			expect(bertheClass).toContain('is-related');
		} finally {
			await page.close();
		}
	});

	test('sélection d’une relation (étiquette) : affiche le panneau contextuel', async () => {
		const page = await openPage();
		try {
			const labelBtn = page.locator('button.rm-label--adultery').first();
			await labelBtn.click();

			const eyebrow = await page.locator('[data-detail-eyebrow]').textContent();
			expect(eyebrow).toContain('Liaison amoureuse / adultère');

			const desc = await page.locator('[data-detail-description]').textContent();
			expect(desc).toBeDefined();
			expect(desc?.length).toBeGreaterThan(20);

			expect(await labelBtn.getAttribute('aria-pressed')).toBe('true');
		} finally {
			await page.close();
		}
	});

	test('navigation clavier et réinitialisation (Échap)', async () => {
		const page = await openPage();
		try {
			await page.click('button[data-node-id="berthe"]');
			const isHiddenBefore = await page.locator('[data-panel-detail]').getAttribute('hidden');
			expect(isHiddenBefore).toBeNull();

			await page.keyboard.press('Escape');
			const isHiddenAfter = await page.locator('[data-panel-detail]').getAttribute('hidden');
			expect(isHiddenAfter).not.toBeNull();
		} finally {
			await page.close();
		}
	});

	test('version mobile (375×812) : graphe mobile et sélection opérationnels', async () => {
		const page = await openPage(375, 812);
		try {
			const mobileLines = page.locator('.rm-lines--mobile');
			expect(await mobileLines.count()).toBe(1);

			await page.click('button[data-node-id="mouret"]');
			const title = await page.locator('.rm-panel [data-detail-title]').textContent();
			expect(title).toBe('Octave Mouret');
		} finally {
			await page.close();
		}
	});

	test('coupe architecturale de l’immeuble : rendu des étages, pièces et sélection interactive', async () => {
		const page = await openPage();
		try {
			// Vérifier la présence de la section coupe
			const cutaway = page.locator('[data-building-cutaway]');
			expect(await cutaway.count()).toBe(1);

			// Vérifier les étages rendus
			const floors = page.locator('.building-floor');
			expect(await floors.count()).toBe(7);

			// Vérifier la présence de pièces clés
			const foyerJosserand = page.locator('.room-cell[data-room-id="foyer-josserand"]');
			expect(await foyerJosserand.count()).toBe(1);

			const chambreOctave = page.locator('.room-cell[data-room-id="chambre-octave"]');
			expect(await chambreOctave.count()).toBe(1);

			// Clic sur la chambre d'Octave
			await chambreOctave.click();

			// Vérifier que le panneau latéral s'actualise
			const detailTitle = await page.locator('#cutaway-detail-panel [data-detail-title]').textContent();
			expect(detailTitle).toContain('Chambre d’Octave Mouret');

			const detailBadge = await page.locator('#cutaway-detail-panel [data-detail-badge]').textContent();
			expect(detailBadge).toContain('Quatrième étage');

			// Vérifier que le filtre fonctionne
			const filterCourBtn = page.locator('.ctrl-btn[data-filter="cour"]');
			await filterCourBtn.click();
			expect(await filterCourBtn.getAttribute('aria-pressed')).toBe('true');

			const dimmedRue = await page.locator('.room-cell[data-room-id="foyer-josserand"]').getAttribute('class');
			expect(dimmedRue).toContain('is-dimmed');

			// Réinitialisation de la sélection
			const resetBtn = page.locator('[data-detail-reset]');
			await resetBtn.click();
			const isPlaceholderVisible = await page.locator('[data-detail-placeholder]').isVisible();
			expect(isPlaceholderVisible).toBe(true);
		} finally {
			await page.close();
		}
	});

	test('coupe architecturale : alignement spatial des appartements (Façade Rue à gauche, Sur Cour à droite)', async () => {
		const page = await openPage();
		try {
			// Vérifier les 2 appartements du 2e étage
			const ecrivain = page.locator('.floor-etage-2 .room-cell[data-room-id="appartement-ecrivain"]');
			const augusteBerthe = page.locator('.floor-etage-2 .room-cell[data-room-id="appartement-auguste-berthe"]');

			expect(await ecrivain.count()).toBe(1);
			expect(await augusteBerthe.count()).toBe(1);

			// Vérifier les étiquettes textuelles
			const ecrivainTag = await ecrivain.locator('.room-tag').textContent();
			expect(ecrivainTag).toContain('Façade Rue');

			const augusteBertheTag = await augusteBerthe.locator('.room-tag').textContent();
			expect(augusteBertheTag).toContain('Sur Cour');

			// Vérifier l'ordonnancement horizontal sur desktop (rue à gauche, cour à droite)
			const ecrivainBox = await ecrivain.boundingBox();
			const augusteBertheBox = await augusteBerthe.boundingBox();
			expect(ecrivainBox).not.toBeNull();
			expect(augusteBertheBox).not.toBeNull();
			expect(ecrivainBox!.x).toBeLessThan(augusteBertheBox!.x);

			// Vérifier également les étages 1, 3 et 4 pour la cohérence spatiale globale
			const duveyrier = page.locator('.floor-etage-1 .room-cell[data-room-id="appartement-duveyrier"]');
			const theophileValerie = page.locator('.floor-etage-1 .room-cell[data-room-id="appartement-theophile-valerie"]');
			const duveyrierBox = await duveyrier.boundingBox();
			const theophileBox = await theophileValerie.boundingBox();
			expect(duveyrierBox!.x).toBeLessThan(theophileBox!.x);

			const campardon = page.locator('.floor-etage-3 .room-cell[data-room-id="foyer-campardon"]');
			const juzeur = page.locator('.floor-etage-3 .room-cell[data-room-id="logement-juzeur"]');
			const campardonBox = await campardon.boundingBox();
			const juzeurBox = await juzeur.boundingBox();
			expect(campardonBox!.x).toBeLessThan(juzeurBox!.x);

			const josserand = page.locator('.floor-etage-4 .room-cell[data-room-id="foyer-josserand"]');
			const octave = page.locator('.floor-etage-4 .room-cell[data-room-id="chambre-octave"]');
			const josserandBox = await josserand.boundingBox();
			const octaveBox = await octave.boundingBox();
			expect(josserandBox!.x).toBeLessThan(octaveBox!.x);
		} finally {
			await page.close();
		}
	});

	test('coupe architecturale en mobile (375×812) : ordre dans le flux (Façade Rue avant Sur Cour)', async () => {
		const page = await openPage(375, 812);
		try {
			// Sur mobile (colonne unique), l'appartement sur rue doit apparaître avant l'appartement sur cour dans le DOM et visuellement (y plus faible)
			const ecrivain = page.locator('.floor-etage-2 .room-cell[data-room-id="appartement-ecrivain"]');
			const augusteBerthe = page.locator('.floor-etage-2 .room-cell[data-room-id="appartement-auguste-berthe"]');

			const ecrivainBox = await ecrivain.boundingBox();
			const augusteBertheBox = await augusteBerthe.boundingBox();
			expect(ecrivainBox).not.toBeNull();
			expect(augusteBertheBox).not.toBeNull();
			expect(ecrivainBox!.y).toBeLessThan(augusteBertheBox!.y);
		} finally {
			await page.close();
		}
	});

	test('notes éditoriales : repliées par défaut et ouvrables/fermables', async () => {
		const page = await openPage();
		try {
			const counterfactual = page.locator('details.counterfactual-note');
			const historyNote = page.locator('details.historical-context-note');
			const inhabitantsNote = page.locator('details.inhabitants-note');

			expect(await counterfactual.count()).toBe(1);
			expect(await historyNote.count()).toBe(1);
			expect(await inhabitantsNote.count()).toBe(1);

			// 1. Repliées par défaut au chargement
			expect(await counterfactual.getAttribute('open')).toBeNull();
			expect(await historyNote.getAttribute('open')).toBeNull();
			expect(await inhabitantsNote.getAttribute('open')).toBeNull();

			// 2. Dépliage de la note contrefactuelle au clic
			const cfSummary = counterfactual.locator('summary');
			await cfSummary.click();
			expect(await counterfactual.getAttribute('open')).not.toBeNull();

			// Repli au second clic
			await cfSummary.click();
			expect(await counterfactual.getAttribute('open')).toBeNull();

			// 3. Dépliage de la note historique
			const histSummary = historyNote.locator('summary');
			await histSummary.click();
			expect(await historyNote.getAttribute('open')).not.toBeNull();

			// Repli au second clic
			await histSummary.click();
			expect(await historyNote.getAttribute('open')).toBeNull();

			// 4. Dépliage de la note des habitants
			const inhSummary = inhabitantsNote.locator('summary');
			await inhSummary.click();
			expect(await inhabitantsNote.getAttribute('open')).not.toBeNull();

			// Repli au second clic
			await inhSummary.click();
			expect(await inhabitantsNote.getAttribute('open')).toBeNull();
		} finally {
			await page.close();
		}
	});

	test('dossier iconographique patrimonial : présence de la section, des 8 fiches et de leurs métadonnées', async () => {
		const page = await openPage();
		try {
			// Vérifier la présence des liens rapides en haut de page
			const quicklinks = page.locator('.page-quicklinks .quicklink-item');
			expect(await quicklinks.count()).toBe(4);
			const quicklinkTexts = await quicklinks.allTextContents();
			expect(quicklinkTexts.some((t) => t.includes('Documents iconographiques'))).toBe(true);

			// Vérifier la présence de la section iconographique
			const section = page.locator('#sources-iconographiques');
			expect(await section.count()).toBe(1);

			// Vérifier le titre et le chapeau méthodologique
			const heading = await section.locator('.iconography-heading').textContent();
			expect(heading).toContain('Documents iconographiques');

			const methodBanner = section.locator('.iconography-method-banner');
			expect(await methodBanner.count()).toBe(1);

			// Vérifier les 8 fiches documentaires
			const cards = section.locator('.iconography-card');
			expect(await cards.count()).toBe(8);

			// 7 images réelles + 1 notice d'estampe fallback (Robida)
			const images = section.locator('.iconography-img');
			expect(await images.count()).toBe(7);

			// Vérifier les attributs alt non vides et descriptifs
			for (let i = 0; i < 7; i++) {
				const alt = await images.nth(i).getAttribute('alt');
				expect(alt).toBeTruthy();
				expect(alt!.length).toBeGreaterThan(25);
			}

			// Vérifier la présence des documents majeurs
			const docBertall = section.locator('#doc-bertall-cinq-etages');
			expect(await docBertall.count()).toBe(1);
			expect(await docBertall.textContent()).toContain('Bertall');

			const docMarvilleRue = section.locator('#doc-marville-rue-choiseul');
			expect(await docMarvilleRue.count()).toBe(1);
			expect(await docMarvilleRue.textContent()).toContain('rue de Choiseul');

			const docMarvilleGaz = section.locator('#doc-marville-gaz');
			expect(await docMarvilleGaz.count()).toBe(1);
			expect(await docMarvilleGaz.textContent()).toContain('éclairage au gaz');

			const docZolaNadar = section.locator('#doc-zola-nadar');
			expect(await docZolaNadar.count()).toBe(1);
			expect(await docZolaNadar.textContent()).toContain('Nadar');

			const docGill = section.locator('#doc-gill-nouvelle-lune');
			expect(await docGill.count()).toBe(1);
			expect(await docGill.textContent()).toContain('André Gill');

			const docRobida = section.locator('#doc-robida-pot-bouille');
			expect(await docRobida.count()).toBe(1);
			expect(await docRobida.textContent()).toContain('Albert Robida');
			const robidaFallback = docRobida.locator('.iconography-notice-fallback');
			expect(await robidaFallback.count()).toBe(1);

			const docEO = section.locator('#doc-edition-originale');
			expect(await docEO.count()).toBe(1);
			expect(await docEO.textContent()).toContain('Charpentier');

			const docPassage = section.locator('#doc-passage-choiseul');
			expect(await docPassage.count()).toBe(1);
			expect(await docPassage.textContent()).toContain('Passage Choiseul');

			// Vérifier la présence des liens pérennes vers Gallica / Musées / Commons
			const permalinks = section.locator('.meta-permalink');
			expect(await permalinks.count()).toBeGreaterThanOrEqual(8);

			// Vérifier la synthèse pédagogique de fin de dossier
			const synthesis = section.locator('.iconography-synthesis-box');
			expect(await synthesis.count()).toBe(1);
			expect(await synthesis.textContent()).toContain('Bilan méthodologique · Seconde');
		} finally {
			await page.close();
		}
	});

	test('dossier iconographique en version mobile (375×812) : lisibilité et disposition', async () => {
		const page = await openPage(375, 812);
		try {
			const section = page.locator('#sources-iconographiques');
			expect(await section.isVisible()).toBe(true);

			const cards = section.locator('.iconography-card');
			expect(await cards.count()).toBe(8);

			// Vérifier qu'aucune carte ne déborde de la largeur de l'écran mobile
			const box = await cards.first().boundingBox();
			expect(box).toBeTruthy();
			expect(box!.width).toBeLessThanOrEqual(375);
		} finally {
			await page.close();
		}
	});

	test('lightbox universelle : zoom au clic, affichage de la légende, navigation clavier et fermeture Échap', async () => {
		const page = await openPage();
		try {
			// Vérifier que le dialogue de la lightbox est présent dans la page
			const lightbox = page.locator('#image-lightbox');
			expect(await lightbox.count()).toBe(1);

			// Vérifier qu'une image documentaire est marquée comme zoomable
			const bertallImg = page.locator('#doc-bertall-cinq-etages img');
			expect(await bertallImg.getAttribute('data-zoomable')).toBe('true');
			expect(await bertallImg.getAttribute('role')).toBe('button');

			// Clic sur l'image pour ouvrir la lightbox
			await bertallImg.click();

			// Vérifier que la lightbox est ouverte
			expect(await lightbox.getAttribute('open')).not.toBeNull();
			const lightboxImg = lightbox.locator('[data-lightbox-img]');
			expect(await lightboxImg.getAttribute('src')).toContain('bertall-cinq-etages-1845.jpg');

			// Vérifier que la légende est affichée
			const caption = lightbox.locator('[data-lightbox-caption]');
			expect(await caption.isVisible()).toBe(true);
			expect(await caption.textContent()).toContain('Bertall');

			// Vérifier que le défilement du corps est bloqué
			const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
			expect(bodyOverflow).toBe('hidden');

			// Navigation vers l'image suivante avec Flèche Droite
			await page.keyboard.press('ArrowRight');
			expect(await lightboxImg.getAttribute('src')).toContain('marville-rue-de-choiseul-1866.jpg');

			// Navigation vers l'image précédente avec Flèche Gauche
			await page.keyboard.press('ArrowLeft');
			expect(await lightboxImg.getAttribute('src')).toContain('bertall-cinq-etages-1845.jpg');

			// Fermeture avec la touche Échap
			await page.keyboard.press('Escape');
			expect(await lightbox.getAttribute('open')).toBeNull();

			// Vérifier que le défilement du corps est restauré
			const restoredOverflow = await page.evaluate(() => document.body.style.overflow);
			expect(restoredOverflow).toBe('');

			// Vérifier l'ouverture au clavier (touche Entrée)
			await bertallImg.focus();
			await page.keyboard.press('Enter');
			expect(await lightbox.getAttribute('open')).not.toBeNull();

			// Fermeture via le bouton de fermeture
			const closeBtn = lightbox.locator('[data-lightbox-close]');
			await closeBtn.click();
			expect(await lightbox.getAttribute('open')).toBeNull();
		} finally {
			await page.close();
		}
	});
});



