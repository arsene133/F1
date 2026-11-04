// Boîte de Leitner de Pot-Bouille (/pot-bouille-leitner) :
// tests d'interface dans un vrai navigateur (Chromium).
// S'exécute sur le site construit : `pnpm build` d'abord, sinon la suite est ignorée.
import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';

const BUILT = existsSync('dist/pot-bouille-leitner/index.html');
const PORT = 4401;
const BASE = `http://localhost:${PORT}`;
const URL = `${BASE}/pot-bouille-leitner/`;
const KEY = 'arsene-carrere:pot-bouille-leitner';

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

async function open(width = 1200, height = 900): Promise<{ context: BrowserContext; page: Page; errors: string[] }> {
	const context = await browser.newContext({ viewport: { width, height } });
	const page = await context.newPage();
	const errors: string[] = [];
	page.on('pageerror', (e) => errors.push(e.message));
	page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
	await page.goto(URL);
	await page.waitForSelector('#leitner-app[data-ready="true"]');
	return { context, page, errors };
}

const stat = (page: Page, name: string) => page.locator(`.lb-stats [data-stat="${name}"]`).innerText();

/** Découvre `n` cartes en répondant toujours `result`. */
async function discover(page: Page, n: number, result: 'known' | 'forgotten') {
	await page.click('#tab-decouverte');
	await page.click('[data-mode-start="decouverte"] .lb-btn--primary');
	for (let i = 0; i < n; i++) {
		await page.click('[data-reveal]');
		await page.click(`[data-assess="${result}"]`);
	}
}

describe.skipIf(!BUILT)('Boîte de Leitner de Pot-Bouille (/pot-bouille-leitner)', () => {
	beforeAll(async () => {
		server = spawn('pnpm', ['astro', 'preview', '--port', String(PORT)], { stdio: 'ignore' });
		await waitForServer(URL);
		browser = await chromium.launch();
	}, 30_000);

	afterAll(async () => {
		await browser?.close();
		server?.kill();
	});

	test('premier chargement : titre, tableau de bord vide, aucune erreur', async () => {
		const { context, page, errors } = await open();
		try {
			expect(await page.locator('h1').innerText()).toBe('Réviser Pot-Bouille');
			expect(await page.locator('.lb-subtitle').innerText()).toContain('Une boîte de Leitner pour comprendre');
			expect(await stat(page, 'total')).toBe('100');
			expect(await stat(page, 'new')).toBe('100');
			expect(await stat(page, 'due')).toBe('0');
			expect(await stat(page, 'mastered')).toBe('0');
			expect(await page.locator('.lb-boxes-strip li').count()).toBe(5);
			// État vide de la révision quotidienne : invite à la découverte.
			expect(await page.locator('[data-mode-start="revision"]').innerText()).toContain('pas encore commencé');
			expect(errors).toEqual([]);
		} finally {
			await context.close();
		}
	});

	test('séance de découverte : question seule, réponse révélée, évaluation, persistance après rechargement', async () => {
		const { context, page, errors } = await open();
		try {
			await page.click('#tab-decouverte');
			await page.click('[data-mode-start="decouverte"] .lb-btn--primary');
			expect(await page.locator('[data-session]').isVisible()).toBe(true);
			expect(await page.locator('[data-study-question]').innerText()).not.toBe('');
			// La réponse est cachée tant qu'on ne l'a pas demandée ; les boutons d'évaluation aussi.
			expect(await page.locator('[data-answer]').isVisible()).toBe(false);
			expect(await page.locator('[data-assess="known"]').isVisible()).toBe(false);
			expect(await page.locator('[data-session-progress]').innerText()).toBe('Carte 1 sur 8');

			await page.click('[data-reveal]');
			expect(await page.locator('[data-answer]').isVisible()).toBe(true);
			expect(await page.locator('[data-answer-text]').innerText()).not.toBe('');
			expect(await page.locator('[data-assess-effect="known"]').innerText()).toContain('boîte 2');
			await page.click('[data-assess="known"]');
			expect(await page.locator('[data-session-progress]').innerText()).toBe('Carte 2 sur 8');

			await page.click('[data-reveal]');
			await page.click('[data-assess="forgotten"]');
			// La carte oubliée revient en fin de séance : 9 cartes au lieu de 8.
			expect(await page.locator('[data-session-progress]').innerText()).toBe('Carte 3 sur 9');

			const stored = await page.evaluate((k) => JSON.parse(localStorage.getItem(k) || 'null'), KEY);
			expect(stored.version).toBe(1);
			const entries = Object.values(stored.cards) as { box: number; successCount: number; failureCount: number; history: unknown[] }[];
			expect(entries.map((e) => e.box).sort()).toEqual([1, 2]);
			expect(entries.every((e) => e.history.length === 1)).toBe(true);

			await page.reload();
			await page.waitForSelector('#leitner-app[data-ready="true"]');
			expect(await stat(page, 'new')).toBe('98');
			expect(await stat(page, 'due')).toBe('1'); // la carte oubliée, à revoir aujourd'hui
			expect(await page.locator('[data-dist="1"]').innerText()).toBe('1');
			expect(await page.locator('[data-dist="2"]').innerText()).toBe('1');
			expect(errors).toEqual([]);
		} finally {
			await context.close();
		}
	});

	test('révision quotidienne : seules les cartes échues sont proposées, puis état « rien à réviser »', async () => {
		const { context, page } = await open();
		try {
			await discover(page, 3, 'known'); // 3 cartes en boîte 2, à revoir demain
			await page.click('[data-session-quit]');
			await page.click('[data-summary-back]');
			await page.click('#tab-revision');
			expect(await stat(page, 'due')).toBe('0');
			expect(await page.locator('[data-mode-start="revision"]').innerText()).toContain('Rien à réviser aujourd’hui');
			expect(await page.locator('[data-mode-start="revision"]').innerText()).toContain('3 cartes');

			// On simule le passage du temps : deux cartes deviennent échues.
			await page.evaluate((k) => {
				const s = JSON.parse(localStorage.getItem(k)!);
				const ids = Object.keys(s.cards);
				s.cards[ids[0]].nextReview = '2020-01-01';
				s.cards[ids[1]].nextReview = '2020-01-02';
				localStorage.setItem(k, JSON.stringify(s));
			}, KEY);
			await page.reload();
			await page.waitForSelector('#leitner-app[data-ready="true"]');
			expect(await stat(page, 'due')).toBe('2');
			await page.click('[data-mode-start="revision"] .lb-btn--primary');
			expect(await page.locator('[data-session-progress]').innerText()).toBe('Carte 1 sur 2');
			expect(await page.locator('[data-study-chips]').innerText()).toContain('Boîte 2');
			await page.click('[data-reveal]');
			expect(await page.locator('[data-assess-effect="known"]').innerText()).toContain('boîte 3, revue dans 3 jours');
		} finally {
			await context.close();
		}
	});

	test('clavier : onglets aux flèches, révélation au clavier, raccourcis R et S, bilan de séance', async () => {
		const { context, page } = await open();
		try {
			await page.focus('#tab-revision');
			await page.keyboard.press('ArrowRight');
			expect(await page.evaluate(() => document.activeElement?.id)).toBe('tab-decouverte');
			expect(await page.locator('#panel-decouverte').isVisible()).toBe(true);
			await page.keyboard.press('End');
			expect(await page.evaluate(() => document.activeElement?.id)).toBe('tab-parcourir');
			await page.keyboard.press('Home');
			await page.keyboard.press('ArrowRight');

			await page.click('[data-mode-start="decouverte"] .lb-btn--primary');
			await page.focus('[data-reveal]');
			await page.keyboard.press('Enter');
			expect(await page.locator('[data-answer]').isVisible()).toBe(true);
			await page.keyboard.press('s');
			expect(await page.locator('[data-session-progress]').innerText()).toBe('Carte 2 sur 8');
			// Taper dans la zone de réponse ne déclenche pas de raccourci.
			await page.fill('[data-study-attempt]', 'Zola, sous le Second Empire');
			await page.focus('[data-reveal]');
			await page.keyboard.press('Space');
			await page.focus('[data-study-attempt]');
			await page.keyboard.press('s');
			expect(await page.locator('[data-session-progress]').innerText()).toBe('Carte 2 sur 8');
			await page.focus('[data-answer-title]');
			await page.keyboard.press('r');
			expect(await page.locator('[data-session-progress]').innerText()).toBe('Carte 3 sur 9');

			await page.click('[data-session-quit]');
			expect(await page.locator('[data-summary]').isVisible()).toBe(true);
			expect(await page.locator('[data-summary-known]').innerText()).toBe('1');
			expect(await page.locator('[data-summary-forgotten]').innerText()).toBe('1');
			expect(await page.locator('[data-summary-list] li').count()).toBe(1);

			// Focus visible sur les contrôles.
			await page.click('[data-summary-back]');
			await page.keyboard.press('Tab');
			const outline = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle);
			expect(outline).not.toBe('none');
		} finally {
			await context.close();
		}
	});

	test('entraînement : sélection libre, sans aucun effet sur les boîtes', async () => {
		const { context, page } = await open();
		try {
			await page.click('#tab-entrainement');
			await page.selectOption('#practice-category', 'interpreter');
			expect(await page.locator('[data-practice-count]').innerText()).toContain('15 cartes');
			await page.selectOption('#practice-size', '10');
			await page.click('[data-practice-form] button[type="submit"]');
			expect(await page.locator('[data-session-progress]').innerText()).toBe('Carte 1 sur 10');
			expect(await page.locator('[data-study-chips]').innerText()).toContain('sans effet sur vos boîtes');
			expect(await page.locator('[data-study-chips]').innerText()).toContain('Interpréter');
			await page.click('[data-reveal]');
			await page.click('[data-assess="known"]');
			await page.click('[data-reveal]');
			await page.click('[data-assess="forgotten"]');
			expect(await page.locator('[data-session-progress]').innerText()).toBe('Carte 3 sur 10');
			const stored = await page.evaluate((k) => localStorage.getItem(k), KEY);
			expect(stored).toBeNull();
			expect(await stat(page, 'new')).toBe('100');
		} finally {
			await context.close();
		}
	});

	test('parcourir : filtres, recherche, état vide, et aucune modification de la progression', async () => {
		const { context, page } = await open();
		try {
			await discover(page, 2, 'known');
			await page.click('[data-session-quit]');
			await page.click('[data-summary-back]');
			const before = await page.evaluate((k) => localStorage.getItem(k), KEY);

			await page.click('#tab-parcourir');
			const visible = () => page.locator('[data-browse-list] > li:not([hidden])').count();
			expect(await visible()).toBe(100);
			await page.selectOption('#browse-category', 'personnages');
			expect(await visible()).toBe(20);
			await page.selectOption('#browse-difficulty', 'facile');
			const easyCharacters = await visible();
			expect(easyCharacters).toBeGreaterThan(0);
			expect(easyCharacters).toBeLessThan(20);
			await page.click('[data-browse-form] button[type="reset"]');
			await page.waitForFunction(() => document.querySelectorAll('[data-browse-list] > li:not([hidden])').length === 100);

			await page.selectOption('#browse-box', '2');
			expect(await visible()).toBe(2);
			await page.selectOption('#browse-box', '');
			await page.selectOption('#browse-status', 'learning');
			expect(await visible()).toBe(2);
			await page.selectOption('#browse-status', 'mastered');
			expect(await visible()).toBe(0);
			expect(await page.locator('[data-browse-empty]').isVisible()).toBe(true);
			await page.selectOption('#browse-status', '');

			await page.fill('#browse-search', 'Gourd');
			expect(await visible()).toBeGreaterThan(0);
			await page.fill('#browse-search', 'xyzintrouvable');
			expect(await visible()).toBe(0);
			await page.fill('#browse-search', '');

			// Ouvrir des cartes en mode Parcourir ne change rien à la progression.
			const items = page.locator('[data-browse-list] > li summary');
			for (let i = 0; i < 5; i++) await items.nth(i).click();
			expect(await page.locator('[data-browse-list] > li').first().locator('.lb-answer-text').isVisible()).toBe(true);
			expect(await page.evaluate((k) => localStorage.getItem(k), KEY)).toBe(before);
		} finally {
			await context.close();
		}
	});

	test('données corrompues : la page reste utilisable et repart d’un état propre', async () => {
		const context = await browser.newContext();
		await context.addInitScript((k) => {
			if (!sessionStorage.getItem('seeded')) {
				localStorage.setItem(k, '{pas du json');
				sessionStorage.setItem('seeded', '1');
			}
		}, KEY);
		const page = await context.newPage();
		const errors: string[] = [];
		page.on('pageerror', (e) => errors.push(e.message));
		try {
			await page.goto(URL);
			await page.waitForSelector('#leitner-app[data-ready="true"]');
			expect(await page.locator('#lb-storage-warning').isVisible()).toBe(true);
			expect(await stat(page, 'new')).toBe('100');
			expect(await page.evaluate((k) => localStorage.getItem(`${k}:sauvegarde-illisible`), KEY)).toBe('{pas du json');
			expect(errors).toEqual([]);
		} finally {
			await context.close();
		}
	});

	test('réinitialisation : demande une confirmation explicite, puis efface la progression', async () => {
		const { context, page } = await open();
		try {
			await discover(page, 1, 'known');
			await page.click('[data-session-quit]');
			await page.click('[data-summary-back]');
			expect(await stat(page, 'new')).toBe('99');

			await page.click('[data-reset-open]');
			expect(await page.locator('[data-reset-dialog]').isVisible()).toBe(true);
			await page.click('[data-reset-dialog] button[value="cancel"]');
			expect(await stat(page, 'new')).toBe('99');

			await page.click('[data-reset-open]');
			await page.click('[data-reset-confirm]');
			expect(await page.locator('[data-reset-dialog]').isVisible()).toBe(false);
			expect(await stat(page, 'new')).toBe('100');
			const stored = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)!), KEY);
			expect(stored.cards).toEqual({});
		} finally {
			await context.close();
		}
	});

	test('mobile (375 px) : pas de défilement horizontal, onglets et boutons utilisables', async () => {
		const { context, page, errors } = await open(375, 800);
		try {
			const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
			expect(overflow).toBeLessThanOrEqual(0);
			const tabBoxes = await page.locator('[role="tab"]').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().width));
			tabBoxes.forEach((w) => expect(w).toBeGreaterThan(100));

			await discover(page, 1, 'known');
			await page.click('[data-reveal]');
			const buttons = await page.locator('.lb-assess-buttons .lb-btn').evaluateAll((els) =>
				els.map((e) => {
					const r = e.getBoundingClientRect();
					return { w: r.width, h: r.height, right: r.right };
				}),
			);
			buttons.forEach((b) => {
				expect(b.h).toBeGreaterThanOrEqual(44);
				expect(b.right).toBeLessThanOrEqual(375);
			});
			const overflowSession = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
			expect(overflowSession).toBeLessThanOrEqual(0);
			expect(errors).toEqual([]);
		} finally {
			await context.close();
		}
	});

	test('mode sombre : les couleurs de la page suivent le thème du système', async () => {
		const context = await browser.newContext({ colorScheme: 'dark' });
		const page = await context.newPage();
		try {
			await page.goto(URL);
			await page.waitForSelector('#leitner-app[data-ready="true"]');
			const colors = await page.evaluate(() => {
				const stat = document.querySelector('.lb-stat')!;
				return {
					bg: getComputedStyle(stat).backgroundColor,
					ink: getComputedStyle(document.querySelector('.leitner-page')!).color,
					body: getComputedStyle(document.body).backgroundColor,
				};
			});
			expect(colors.bg).toBe('rgb(28, 31, 39)');
			// Le fond sombre couvre toute la page, pas seulement le haut (texte clair lisible partout).
			expect(colors.body).toBe('rgb(19, 21, 26)');
			expect(colors.ink).toBe('rgb(227, 230, 236)');
		} finally {
			await context.close();
		}
	});

	test('navigation : la page /pot-bouille renvoie vers la boîte de Leitner, et inversement', async () => {
		const { context, page } = await open();
		try {
			expect(await page.locator('.lb-back-link a[href="/pot-bouille"]').count()).toBe(1);
			await page.goto(`${BASE}/pot-bouille/`);
			expect(await page.locator('.related-literary-links a[href="/pot-bouille-leitner"]').count()).toBe(1);
		} finally {
			await context.close();
		}
	});
});
