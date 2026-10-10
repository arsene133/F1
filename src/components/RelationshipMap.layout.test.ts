// Carte relationnelle d'On ne badine pas avec l'amour (/on-ne-badine-pas-avec-l-amour) :
// tests de rendu, données et interactions dans un vrai navigateur (Chromium).
// S'exécute sur le site construit : `pnpm build` d'abord, sinon la suite est ignorée.
import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { chromium, type Browser, type Page } from 'playwright';

const BUILT = existsSync('dist/on-ne-badine-pas-avec-l-amour/index.html');
const PORT = 4393;
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
	await page.waitForSelector('.rm-canvas');
	return page;
}

describe.skipIf(!BUILT)('Carte relationnelle — Amitié Baron–Bridaine et interactions', () => {
	beforeAll(async () => {
		server = spawn('pnpm', ['astro', 'preview', '--port', String(PORT)], { stdio: 'ignore' });
		await waitForServer(`${BASE}/on-ne-badine-pas-avec-l-amour/`);
		browser = await chromium.launch();
	}, 30_000);

	afterAll(async () => {
		await browser?.close();
		server?.kill();
	});

	test('données JSON : l’amitié Baron–Bridaine existe avec direction bidirectionnelle et texte de Musset', async () => {
		const page = await openPage();
		try {
			const data = await page.evaluate(() => {
				const script = document.querySelector('[data-map-data]');
				return script ? JSON.parse(script.textContent || '{}') : null;
			});

			expect(data).toBeTruthy();
			const friendship = data.relationships.find(
				(r: any) =>
					(r.source === 'baron' && r.targets.includes('bridaine')) ||
					(r.source === 'bridaine' && r.targets.includes('baron')),
			);
			expect(friendship, 'relation Baron-Bridaine présente').toBeDefined();
			expect(friendship.label).toBe('amis');
			expect(friendship.typeLabel).toBe('Amitié');
			expect(friendship.title).toContain('Le Baron');
			expect(friendship.title).toContain('Maître Bridaine');
			expect(friendship.title).toContain('↔');
			expect(friendship.description).toContain('acte I, scène 2');
			expect(friendship.description).toContain('Maître Bridaine, vous êtes mon ami');
			expect(friendship.description).toContain('Curé de la paroisse');
			expect(friendship.description).toContain('marier Perdican et Camille');

			// Préservation de la rivalité comique Blazius–Bridaine
			const rivalry = data.relationships.find(
				(r: any) =>
					(r.source === 'blazius' && r.targets.includes('bridaine')) ||
					(r.source === 'bridaine' && r.targets.includes('blazius')),
			);
			expect(rivalry, 'rivalité Blazius-Bridaine préservée').toBeDefined();
			expect(rivalry.label).toBe('rivalité comique');
			expect(rivalry.typeLabel).toBe('Rivalité comique');
		} finally {
			await page.close();
		}
	});

	test('rendu visuel : arête SVG, étiquette « amis », légende et index textuel', async () => {
		const page = await openPage();
		try {
			// Arête SVG présente
			const edge = page.locator('.rm-lines--desktop .rm-edge--friendship');
			expect(await edge.count()).toBe(1);
			expect(await edge.getAttribute('data-ends')).toBe('baron bridaine');

			// Bouton étiquette interactif sur le canevas
			const labelBtn = page.locator('button.rm-label--friendship');
			expect(await labelBtn.count()).toBe(1);
			expect(await labelBtn.textContent()).toContain('amis');
			expect(await labelBtn.getAttribute('aria-label')).toContain('Le Baron ↔ Maître Bridaine');

			// Légende
			const legendText = await page.locator('.rm-legend').textContent();
			expect(legendText).toContain('Amitié');
			expect(legendText).toContain('Rivalité comique');

			// Index textuel complet
			const indexText = await page.locator('.rm-index').textContent();
			expect(indexText).toContain('Le Baron ↔ Maître Bridaine');
			expect(indexText).toContain('amis');
			expect(indexText).toContain('amitié');
			expect(indexText).toContain('Maître Blazius ↔ Maître Bridaine');
		} finally {
			await page.close();
		}
	});

	test('sélection du Baron : affiche ses relations dont l’amitié avec Bridaine', async () => {
		const page = await openPage();
		try {
			await page.click('button[data-node-id="baron"]');

			const title = await page.locator('[data-detail-title]').textContent();
			expect(title).toBe('Le Baron');

			const relations = await page.locator('[data-detail-relations] li').allTextContents();
			expect(relations.some((r) => r.includes('amis · amitié') && r.includes('Maître Bridaine'))).toBe(true);
			expect(relations.some((r) => r.includes('veut les marier') && r.includes('Perdican et Camille'))).toBe(true);
			expect(relations.some((r) => r.includes('père → fils') && r.includes('Perdican'))).toBe(true);
			expect(relations.some((r) => r.includes('oncle → nièce') && r.includes('Camille'))).toBe(true);

			// Surbrillance du nœud Bridaine et de l'arête d'amitié
			const bridaineBtnClass = await page.locator('button[data-node-id="bridaine"]').getAttribute('class');
			expect(bridaineBtnClass).toContain('is-related');
			const friendshipEdgeClass = await page.locator('.rm-lines--desktop .rm-edge--friendship').getAttribute('class');
			expect(friendshipEdgeClass).toContain('is-related');
		} finally {
			await page.close();
		}
	});

	test('sélection de Maître Bridaine : distingue l’amitié avec le Baron et la rivalité avec Blazius', async () => {
		const page = await openPage();
		try {
			await page.click('button[data-node-id="bridaine"]');

			const title = await page.locator('[data-detail-title]').textContent();
			expect(title).toBe('Maître Bridaine');

			const relations = await page.locator('[data-detail-relations] li').allTextContents();
			expect(relations).toHaveLength(2);
			expect(relations.some((r) => r.includes('amis · amitié') && r.includes('Le Baron'))).toBe(true);
			expect(relations.some((r) => r.includes('rivalité comique') && r.includes('Maître Blazius'))).toBe(true);

			// Surbrillance des deux partenaires distincts
			const baronClass = await page.locator('button[data-node-id="baron"]').getAttribute('class');
			const blaziusClass = await page.locator('button[data-node-id="blazius"]').getAttribute('class');
			const friendshipEdgeClass = await page.locator('.rm-lines--desktop .rm-edge--friendship').getAttribute('class');
			const rivalryEdgeClass = await page.locator('.rm-lines--desktop .rm-edge--rivalry').getAttribute('class');

			expect(baronClass).toContain('is-related');
			expect(blaziusClass).toContain('is-related');
			expect(friendshipEdgeClass).toContain('is-related');
			expect(rivalryEdgeClass).toContain('is-related');
		} finally {
			await page.close();
		}
	});

	test('clic sur l’étiquette « amis » : ouvre le panneau contextuel de la relation', async () => {
		const page = await openPage();
		try {
			const labelBtn = page.locator('button.rm-label--friendship');
			await labelBtn.click();

			const eyebrow = await page.locator('[data-detail-eyebrow]').textContent();
			expect(eyebrow).toBe('Relation · Amitié');

			const title = await page.locator('[data-detail-title]').textContent();
			expect(title).toBe('Le Baron ↔ Maître Bridaine');

			const desc = await page.locator('[data-detail-description]').textContent();
			expect(desc).toContain('Maître Bridaine, vous êtes mon ami');

			const baronClass = await page.locator('button[data-node-id="baron"]').getAttribute('class');
			const bridaineClass = await page.locator('button[data-node-id="bridaine"]').getAttribute('class');
			expect(baronClass).toContain('is-related');
			expect(bridaineClass).toContain('is-related');
			expect(await labelBtn.getAttribute('aria-pressed')).toBe('true');
		} finally {
			await page.close();
		}
	});

	test('interactions clavier et navigation entre nœuds', async () => {
		const page = await openPage();
		try {
			// Sélectionner un nœud puis appuyer sur Échap le réinitialise
			await page.click('button[data-node-id="baron"]');
			const isHiddenBefore = await page.locator('[data-panel-detail]').getAttribute('hidden');
			expect(isHiddenBefore).toBeNull();

			await page.keyboard.press('Escape');
			const isHiddenAfter = await page.locator('[data-panel-detail]').getAttribute('hidden');
			expect(isHiddenAfter).not.toBeNull();
			const isHintHidden = await page.locator('[data-panel-hint]').getAttribute('hidden');
			expect(isHintHidden).toBeNull();

			// Liens relationnels dans le panneau : passer du Baron à Bridaine par clic de lien
			await page.click('button[data-node-id="baron"]');
			const bridaineLink = page.locator('.rm-detail-relations button.rm-rel-link:has-text("Maître Bridaine")');
			await bridaineLink.click();

			const activeTitle = await page.locator('[data-detail-title]').textContent();
			expect(activeTitle).toBe('Maître Bridaine');
		} finally {
			await page.close();
		}
	});

	test('version mobile (375×812) : ligne tracée et sélection fonctionnelle', async () => {
		const page = await openPage(375, 812);
		try {
			// Ligne mobile présente
			const mobileEdge = page.locator('.rm-lines--mobile .rm-edge--friendship');
			expect(await mobileEdge.count()).toBe(1);

			// Sélection de Bridaine sur mobile
			await page.click('button[data-node-id="bridaine"]');
			const title = await page.locator('[data-detail-title]').textContent();
			expect(title).toBe('Maître Bridaine');

			const relations = await page.locator('[data-detail-relations] li').allTextContents();
			expect(relations.some((r) => r.includes('amis · amitié') && r.includes('Le Baron'))).toBe(true);
		} finally {
			await page.close();
		}
	});
});
