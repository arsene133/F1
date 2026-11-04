// Boîte de Leitner de Pot-Bouille (/pot-bouille-leitner) :
// tests d'interface dans un vrai navigateur (Chromium).
// S'exécute sur le site construit : `pnpm build` d'abord, sinon la suite est ignorée.
import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';
import { intervalLabel, intervalShort } from '../lib/leitner/labels';
import { BOX_INTERVAL_DAYS, BOXES } from '../lib/leitner/scheduler';

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

const line = (page: Page, name: string) => page.locator(`[data-line="${name}"]`).innerText();
const stat = (page: Page, name: string) => page.locator(`.lb-stats [data-stat="${name}"]`).textContent();
const progress = (page: Page) => page.locator('[data-session-progress]').innerText();
const slotCount = (page: Page, slot: string | number) =>
	page.locator(`[data-compartment="${slot}"] [data-slot-count]`).textContent();
const stored = (page: Page) => page.evaluate((k) => JSON.parse(localStorage.getItem(k) || 'null'), KEY);

/** Rend échues les fiches indiquées (passage du temps simulé), éventuellement dans une autre boîte, puis recharge. */
async function makeDue(page: Page, changes: { index: number; box?: number }[]) {
	await page.evaluate(
		({ k, changes }) => {
			const s = JSON.parse(localStorage.getItem(k)!);
			const ids = Object.keys(s.cards);
			for (const c of changes) {
				s.cards[ids[c.index]].nextReview = '2020-01-01';
				if (c.box) s.cards[ids[c.index]].box = c.box;
			}
			localStorage.setItem(k, JSON.stringify(s));
		},
		{ k: KEY, changes },
	);
	await page.reload();
	await page.waitForSelector('#leitner-app[data-ready="true"]');
}

/** Découvre `n` questions en répondant toujours `result`, puis revient à l'accueil. */
async function discover(page: Page, n: number, result: 'known' | 'forgotten') {
	await page.click('[data-choice="decouverte"]');
	for (let i = 0; i < n; i++) {
		await page.click('[data-reveal]');
		await page.click(`[data-assess="${result}"]`);
	}
	await page.click('[data-session-quit]');
	await page.click('[data-summary-back]');
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

	test('accueil : titre, une action principale, trois informations, le reste replié', async () => {
		const { context, page, errors } = await open();
		try {
			expect(await page.locator('h1').innerText()).toBe('Réviser Pot-Bouille');
			expect(await page.locator('.lb-subtitle').innerText()).toBe(
				'Quelques questions pour mieux connaître et comprendre le roman de Zola.',
			);
			expect(await page.locator('[data-start]').innerText()).toBe('Commencer ma révision');
			expect(await page.locator('.lb-home .lb-btn--primary:visible').count()).toBe(1);
			expect(await line(page, 'due')).toBe('Aucune question à revoir pour l’instant');
			expect(await line(page, 'new')).toBe('8 nouvelles questions disponibles');
			expect(await line(page, 'mastered')).toBe('0 question maîtrisée');
			// Trois choix simples ; la zone d’action reste sans vocabulaire technique
			// (la boîte elle-même est affichée au-dessus, voir les tests « boîte »).
			expect(await page.locator('[data-choice]').count()).toBe(3);
			expect(await page.locator('.lb-home').innerText()).not.toMatch(/[Bb]oîte/);
			// Statistiques, liste complète, réglages et méthode : repliés dans « Voir ma progression ».
			expect(await page.locator('#progression h2').innerText()).toBe('Voir ma progression');
			expect(await page.locator('.lb-fold[open]').count()).toBe(0);
			expect(await page.locator('.lb-dist').isVisible()).toBe(false);
			expect(await page.locator('[data-browse-list]').isVisible()).toBe(false);
			expect(await stat(page, 'total')).toBe('100');
			expect(errors).toEqual([]);
		} finally {
			await context.close();
		}
	});

	test('séance : question seule, réponse révélée, retour immédiat, persistance après rechargement', async () => {
		const { context, page, errors } = await open();
		try {
			await page.click('[data-start]'); // premier usage : découverte
			expect(await page.locator('[data-home]').isVisible()).toBe(false);
			expect(await page.locator('#progression').isVisible()).toBe(false);
			expect(await page.locator('[data-study-question]').innerText()).not.toBe('');
			expect(await page.locator('[data-study-eyebrow]').innerText()).not.toBe('');
			expect(await progress(page)).toMatch(/^Question 1 sur 8 · /);
			expect(await page.locator('[data-answer]').isVisible()).toBe(false);
			expect(await page.locator('[data-assess="known"]').isVisible()).toBe(false);
			expect(await page.locator('[data-reveal]').innerText()).toBe('Voir la réponse');

			await page.click('[data-reveal]');
			expect(await page.locator('[data-answer-title]').innerText()).toBe('Réponse');
			expect(await page.locator('[data-answer-text]').innerText()).not.toBe('');
			expect(await page.locator('#lb-assess-title').innerText()).toContain('Réponds honnêtement');
			// Aucun vocabulaire technique pendant la révision.
			expect(await page.locator('[data-session]').innerText()).not.toMatch(/[Bb]oîte|intervalle/);

			await page.click('[data-assess="known"]');
			expect(await page.locator('[data-feedback]').innerText()).toBe('Bien joué. Cette question reviendra plus tard.');
			expect(await progress(page)).toMatch(/^Question 2 sur 8/);

			await page.click('[data-reveal]');
			await page.click('[data-assess="forgotten"]');
			expect(await page.locator('[data-feedback]').innerText()).toBe('Pas grave. Tu la retrouveras en fin de séance.');
			expect(await progress(page)).toMatch(/^Question 3 sur 9/); // la question oubliée revient en fin de séance

			const stored = await page.evaluate((k) => JSON.parse(localStorage.getItem(k) || 'null'), KEY);
			expect(stored.version).toBe(1);
			const entries = Object.values(stored.cards) as { box: number; history: unknown[] }[];
			expect(entries.map((e) => e.box).sort()).toEqual([1, 2]);
			expect(entries.every((e) => e.history.length === 1)).toBe(true);

			await page.reload();
			await page.waitForSelector('#leitner-app[data-ready="true"]');
			expect(await line(page, 'due')).toBe('1 question à revoir aujourd’hui');
			expect(await line(page, 'new')).toBe('6 nouvelles questions disponibles');
			expect(await stat(page, 'new')).toBe('98');
			expect(await page.locator('[data-dist="1"]').textContent()).toBe('1');
			expect(await page.locator('[data-dist="2"]').textContent()).toBe('1');
			expect(errors).toEqual([]);
		} finally {
			await context.close();
		}
	});

	test('question « comprendre » : le rappel sur l’explication du sens apparaît', async () => {
		const { context, page } = await open();
		try {
			await page.click('[data-choice="entrainement"]');
			await page.click('[data-practice-preset="interpretation"]');
			await page.click('[data-reveal]');
			expect(await page.locator('[data-assess-hint]').isVisible()).toBe(true);
			expect(await page.locator('[data-assess-hint]').innerText()).toContain('expliquer le sens');
		} finally {
			await context.close();
		}
	});

	test('révision : seules les questions échues sont proposées ; sinon état vide avec découverte ou entraînement', async () => {
		const { context, page } = await open();
		try {
			await discover(page, 3, 'known'); // 3 questions à revoir demain
			expect(await line(page, 'due')).toMatch(/^Rien à revoir aujourd’hui · prochaine révision /);
			expect(await page.locator('[data-start]').innerText()).toBe('Découvrir de nouvelles questions');
			await page.click('[data-choice="revision"]');
			expect(await page.locator('[data-home-message]').innerText()).toContain('Rien à revoir aujourd’hui');
			expect(await page.locator('[data-home-message] button').count()).toBe(2);
			expect(await page.locator('[data-session]').isVisible()).toBe(false);

			// Passage du temps simulé : deux questions deviennent échues.
			await page.evaluate((k) => {
				const s = JSON.parse(localStorage.getItem(k)!);
				const ids = Object.keys(s.cards);
				s.cards[ids[0]].nextReview = '2020-01-01';
				s.cards[ids[1]].nextReview = '2020-01-02';
				localStorage.setItem(k, JSON.stringify(s));
			}, KEY);
			await page.reload();
			await page.waitForSelector('#leitner-app[data-ready="true"]');
			expect(await line(page, 'due')).toBe('2 questions à revoir aujourd’hui');
			expect(await page.locator('[data-start]').innerText()).toBe('Commencer ma révision');
			await page.click('[data-start]');
			expect(await page.locator('[data-session-title]').innerText()).toBe('Révision du jour');
			expect(await progress(page)).toMatch(/^Question 1 sur 2/);
		} finally {
			await context.close();
		}
	});

	test('fin de séance : bilan en trois chiffres, « Terminer » et « Continuer à réviser »', async () => {
		const { context, page } = await open();
		try {
			await page.click('[data-start]');
			for (let i = 0; i < 9; i++) {
				// 8 nouvelles questions ; la première oubliée revient une fois (9 au total).
				await page.click('[data-reveal]');
				await page.click(i === 0 ? '[data-assess="forgotten"]' : '[data-assess="known"]');
			}
			expect(await page.locator('#lb-summary-title').innerText()).toBe('Séance terminée !');
			expect(await page.locator('[data-summary-total]').innerText()).toBe('9');
			expect(await page.locator('[data-summary-known]').innerText()).toBe('8');
			expect(await page.locator('[data-summary-forgotten]').innerText()).toBe('1');
			expect(await page.locator('[data-summary-back]').innerText()).toBe('Terminer');

			// Limite quotidienne atteinte et rien d’échu : le travail du jour est terminé.
			expect(await page.locator('[data-summary-message]').innerText()).toBe(
				'Tu as terminé les questions prévues pour aujourd’hui. Tu peux continuer à t’entraîner librement si tu le souhaites.',
			);
			expect(await page.locator('[data-summary-continue]').innerText()).toBe('Continuer à m’entraîner');
			expect(await page.locator('[data-summary-saved]').innerText()).toContain('Ta progression est enregistrée');
			await page.click('[data-summary-back]');
			expect(await page.locator('[data-home]').isVisible()).toBe(true);
			expect(await line(page, 'new')).toBe('Nouvelles questions : c’est fait pour aujourd’hui');

			// La limite quotidienne de découverte est respectée, avec possibilité de la dépasser.
			await page.click('[data-choice="decouverte"]');
			expect(await page.locator('[data-home-message]').innerText()).toContain('8 nouvelles questions');
			await page.click('[data-home-message] .lb-btn');
			expect(await progress(page)).toMatch(/^Question 1 sur 5/);
		} finally {
			await context.close();
		}
	});

	test('fin de séance, journée terminée : « Terminer » garde la progression, l’entraînement reste facultatif', async () => {
		const { context, page } = await open();
		try {
			// Séance interrompue alors qu’il reste des nouvelles questions : la suite naturelle est la découverte.
			await page.click('[data-start]');
			await page.click('[data-reveal]');
			await page.click('[data-assess="known"]');
			await page.click('[data-session-quit]');
			expect(await page.locator('[data-summary-continue]').innerText()).toBe('Découvrir de nouvelles questions');
			expect(await page.locator('[data-summary-message]').innerText()).not.toContain('Tu as terminé');

			// Reprise, puis fin des 7 questions restantes : le travail du jour est terminé.
			await page.click('[data-summary-continue]');
			for (let i = 0; i < 7; i++) {
				await page.click('[data-reveal]');
				await page.click('[data-assess="known"]');
			}
			expect(await page.locator('[data-summary-message]').innerText()).toContain('Tu as terminé les questions prévues pour aujourd’hui');
			expect(await page.locator('[data-summary-message]').innerText()).toContain('si tu le souhaites');
			const before = await page.evaluate((k) => localStorage.getItem(k), KEY);

			// « Continuer à m’entraîner » lance directement un entraînement, sans rien changer à la progression.
			await page.click('[data-summary-continue]');
			expect(await page.locator('[data-session-title]').innerText()).toBe('Entraînement libre');
			expect(await page.locator('[data-practice-note]').isVisible()).toBe(true);
			for (let i = 0; i < 2; i++) {
				await page.click('[data-reveal]');
				await page.click(i ? '[data-assess="forgotten"]' : '[data-assess="known"]');
			}
			expect(await page.evaluate((k) => localStorage.getItem(k), KEY)).toBe(before);
			await page.click('[data-session-quit]');
			expect(await page.locator('[data-summary-saved]').innerText()).toBe('L’entraînement n’a pas modifié ta progression.');
			expect(await page.locator('[data-summary-continue]').innerText()).toBe('Continuer à m’entraîner');

			// « Terminer » revient à l’accueil ; la progression est intacte après rechargement.
			await page.click('[data-summary-back]');
			expect(await page.locator('[data-home]').isVisible()).toBe(true);
			expect(await page.evaluate((k) => localStorage.getItem(k), KEY)).toBe(before);
			await page.reload();
			await page.waitForSelector('#leitner-app[data-ready="true"]');
			expect(await stat(page, 'new')).toBe('92');
			expect(await line(page, 'due')).toMatch(/^Rien à revoir aujourd’hui/);
			expect(await line(page, 'new')).toBe('Nouvelles questions : c’est fait pour aujourd’hui');
		} finally {
			await context.close();
		}
	});

	test('en-tête compact sur cette page seulement : mobile allégé, desktop et autres pages inchangés', async () => {
		const context = await browser.newContext({ viewport: { width: 375, height: 667 } });
		const page = await context.newPage();
		const measure = (path: string) =>
			page.goto(`${BASE}${path}`).then(() =>
				page.evaluate(() => {
					const header = document.querySelector('body > header')!;
					const targets = [...header.querySelectorAll('h2 a, .internal-links > a, .dropdown-toggle')].map((e) => {
						const r = e.getBoundingClientRect();
						return { text: e.textContent!.trim(), h: r.height, w: r.width, right: r.right, visible: r.width > 0 };
					});
					return {
						height: header.getBoundingClientRect().height,
						targets,
						overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
					};
				}),
			);
		try {
			const leitner = await measure('/pot-bouille-leitner/');
			const potBouille = await measure('/pot-bouille/');
			const homePage = await measure('/');
			// Autres pages : en-tête d’origine, identique d’une page à l’autre.
			expect(potBouille.height).toBe(homePage.height);
			expect(potBouille.height).toBeGreaterThan(150);
			// Page Leitner : nettement plus compact, sans débordement (titre + deux lignes de
			// liens depuis l’ajout du menu « Boîtes de Leitner »).
			expect(leitner.height).toBeLessThanOrEqual(140);
			expect(leitner.height).toBeLessThan(potBouille.height * 0.55);
			expect(leitner.overflow).toBe(false);
			// La navigation essentielle reste complète, avec des cibles tactiles de 44 px.
			expect(leitner.targets.map((t) => t.text.replace(/\s+/g, ' '))).toEqual(
				potBouille.targets.map((t) => t.text.replace(/\s+/g, ' ')),
			);
			expect(leitner.targets).toHaveLength(6);
			leitner.targets.forEach((t) => {
				expect(t.visible, t.text).toBe(true);
				expect(t.h, t.text).toBeGreaterThanOrEqual(44);
				expect(t.w, t.text).toBeGreaterThanOrEqual(44);
				expect(t.right, t.text).toBeLessThanOrEqual(375);
			});

			// Clavier : le menu « Œuvres & auteurs » s’ouvre et reste utilisable.
			await page.goto(URL);
			await page.focus('#works-dropdown > summary');
			await page.keyboard.press('Enter');
			expect(await page.locator('#works-dropdown .dropdown-menu').isVisible()).toBe(true);
			expect(await page.locator('#works-dropdown .dropdown-item').count()).toBe(8);
			await page.keyboard.press('Tab');
			const outline = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle);
			expect(outline).not.toBe('none');

			// Bureau : en-tête identique sur la page Leitner et sur les autres pages.
			await page.setViewportSize({ width: 1280, height: 800 });
			const desktopLeitner = await measure('/pot-bouille-leitner/');
			const desktopOther = await measure('/pot-bouille/');
			expect(desktopLeitner.height).toBe(desktopOther.height);
		} finally {
			await context.close();
		}
	});

	test('en-tête compact en mode sombre : couleurs du thème conservées', async () => {
		const context = await browser.newContext({ viewport: { width: 375, height: 667 }, colorScheme: 'dark' });
		const page = await context.newPage();
		try {
			await page.goto(URL);
			const colors = await page.evaluate(() => {
				const header = document.querySelector('body > header')!;
				return {
					bg: getComputedStyle(header).backgroundColor,
					link: getComputedStyle(header.querySelector('h2 a')!).color,
					height: header.getBoundingClientRect().height,
				};
			});
			expect(colors.bg).toBe('rgb(19, 21, 26)');
			expect(colors.link).toBe('rgb(240, 242, 247)');
			expect(colors.height).toBeLessThanOrEqual(140);
		} finally {
			await context.close();
		}
	});

	test('clavier : choix accessibles, révélation au clavier, raccourcis R et S, focus visible', async () => {
		const { context, page } = await open();
		try {
			await page.focus('[data-start]');
			await page.keyboard.press('Enter');
			expect(await page.locator('[data-session]').isVisible()).toBe(true);
			expect(await page.evaluate(() => document.activeElement?.id)).toBe('study-question');

			await page.focus('[data-reveal]');
			await page.keyboard.press('Enter');
			expect(await page.locator('[data-answer]').isVisible()).toBe(true);
			await page.keyboard.press('s');
			expect(await progress(page)).toMatch(/^Question 2 sur 8/);

			// Taper dans la zone de réponse ne déclenche pas de raccourci.
			await page.click('.lb-attempt summary');
			await page.fill('[data-study-attempt]', 'Zola, sous le Second Empire');
			await page.focus('[data-reveal]');
			await page.keyboard.press('Space');
			await page.focus('[data-study-attempt]');
			await page.keyboard.press('s');
			expect(await progress(page)).toMatch(/^Question 2 sur 8/);
			await page.focus('[data-answer-title]');
			await page.keyboard.press('r');
			expect(await progress(page)).toMatch(/^Question 3 sur 9/);

			await page.click('[data-session-quit]');
			expect(await page.locator('[data-summary]').isVisible()).toBe(true);
			await page.keyboard.press('Tab');
			const outline = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle);
			expect(outline).not.toBe('none');
		} finally {
			await context.close();
		}
	});

	test('entraînement : choix libre, sans aucun effet sur la progression', async () => {
		const { context, page } = await open();
		try {
			expect(await page.locator('[data-practice-form]').isVisible()).toBe(false);
			await page.click('[data-choice="entrainement"]');
			expect(await page.locator('[data-choice="entrainement"]').getAttribute('aria-expanded')).toBe('true');
			await page.selectOption('#practice-category', 'interpreter');
			expect(await page.locator('[data-practice-count]').innerText()).toContain('15 questions');
			await page.click('[data-practice-form] button[type="submit"]');
			expect(await page.locator('[data-session-title]').innerText()).toBe('Entraînement libre');
			expect(await page.locator('[data-practice-note]').isVisible()).toBe(true);
			expect(await progress(page)).toMatch(/^Question 1 sur 10/);
			expect(await page.locator('[data-study-eyebrow]').textContent()).toMatch(/^Interpréter · /);
			await page.click('[data-reveal]');
			await page.click('[data-assess="known"]');
			expect(await page.locator('[data-feedback]').innerText()).toBe('Bien joué.');
			await page.click('[data-reveal]');
			await page.click('[data-assess="forgotten"]');
			expect(await progress(page)).toMatch(/^Question 3 sur 10/);
			expect(await page.evaluate((k) => localStorage.getItem(k), KEY)).toBeNull();
			await page.click('[data-session-quit]');
			await page.click('[data-summary-back]');
			expect(await stat(page, 'new')).toBe('100');
		} finally {
			await context.close();
		}
	});

	test('toutes les questions : filtres, recherche, état vide, sans modifier la progression', async () => {
		const { context, page } = await open();
		try {
			await discover(page, 2, 'known');
			const before = await page.evaluate((k) => localStorage.getItem(k), KEY);

			await page.click('[data-fold="browse"] > summary');
			const visible = () => page.locator('[data-browse-list] > li:not([hidden])').count();
			expect(await visible()).toBe(100);
			await page.selectOption('#browse-category', 'personnages');
			expect(await visible()).toBe(20);
			await page.selectOption('#browse-difficulty', 'facile');
			const easy = await visible();
			expect(easy).toBeGreaterThan(0);
			expect(easy).toBeLessThan(20);
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

			const items = page.locator('[data-browse-list] > li summary');
			for (let i = 0; i < 5; i++) await items.nth(i).click();
			expect(await page.locator('[data-browse-list] > li').first().locator('.lb-answer-text').isVisible()).toBe(true);
			expect(await page.evaluate((k) => localStorage.getItem(k), KEY)).toBe(before);
		} finally {
			await context.close();
		}
	});

	test('statistiques détaillées et questions à surveiller, dans « Voir ma progression »', async () => {
		const { context, page } = await open();
		try {
			await discover(page, 2, 'forgotten');
			await page.click('[data-fold="stats"] > summary');
			expect(await page.locator('.lb-dist').isVisible()).toBe(true);
			expect(await page.locator('[data-history] li').count()).toBe(14);
			expect(await page.locator('[data-attention-list] li').count()).toBe(2);
			await page.locator('[data-attention-list] button').first().click();
			expect(await page.locator('[data-fold="browse"]').getAttribute('open')).not.toBeNull();
			expect(await page.locator('.lb-browse-item.is-highlighted details[open]').count()).toBe(1);
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

	test('réinitialisation : confirmation explicite, puis progression effacée', async () => {
		const { context, page } = await open();
		try {
			await discover(page, 1, 'known');
			expect(await stat(page, 'new')).toBe('99');
			await page.click('[data-fold="settings"] > summary');

			await page.click('[data-reset-open]');
			expect(await page.locator('[data-reset-dialog]').isVisible()).toBe(true);
			await page.click('[data-reset-dialog] button[value="cancel"]');
			expect(await stat(page, 'new')).toBe('99');

			await page.click('[data-reset-open]');
			await page.click('[data-reset-confirm]');
			expect(await page.locator('[data-reset-dialog]').isVisible()).toBe(false);
			expect(await stat(page, 'new')).toBe('100');
			expect(await line(page, 'due')).toBe('Aucune question à revoir pour l’instant');
			const stored = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)!), KEY);
			expect(stored.cards).toEqual({});
		} finally {
			await context.close();
		}
	});

	test('mobile (375 px) : action visible d’emblée, question et bouton sans défilement, grands boutons', async () => {
		const { context, page, errors } = await open(375, 667);
		try {
			const noOverflow = () => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
			expect(await noOverflow()).toBe(true);
			const start = await page.locator('[data-start]').boundingBox();
			expect(start!.y + start!.height).toBeLessThan(667);
			expect(start!.height).toBeGreaterThanOrEqual(44);

			await page.click('[data-start]');
			const reveal = await page.locator('[data-reveal]').boundingBox();
			const scrollY = await page.evaluate(() => scrollY);
			expect(reveal!.y + reveal!.height - scrollY).toBeLessThan(667); // question et bouton dans le premier écran
			await page.click('[data-reveal]');
			const buttons = await page.locator('.lb-assess-buttons .lb-btn').evaluateAll((els) =>
				els.map((e) => {
					const r = e.getBoundingClientRect();
					return { h: r.height, w: r.width, right: r.right };
				}),
			);
			buttons.forEach((b) => {
				expect(b.h).toBeGreaterThanOrEqual(48);
				expect(b.w).toBeGreaterThanOrEqual(120);
				expect(b.right).toBeLessThanOrEqual(375);
			});
			expect(await noOverflow()).toBe(true);
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
			const colors = await page.evaluate(() => ({
				choice: getComputedStyle(document.querySelector('.lb-choice')!).backgroundColor,
				ink: getComputedStyle(document.querySelector('.leitner-page')!).color,
				body: getComputedStyle(document.body).backgroundColor,
			}));
			expect(colors.choice).toBe('rgb(28, 31, 39)');
			expect(colors.ink).toBe('rgb(227, 230, 236)');
			// Le fond sombre couvre toute la page, pas seulement le haut (texte clair lisible partout).
			expect(colors.body).toBe('rgb(19, 21, 26)');
		} finally {
			await context.close();
		}
	});

	// ------------------------------------------------------------------ Boîte physique

	test('boîte : bac des nouvelles et cinq compartiments, intervalles réels, comptes et piles', async () => {
		const { context, page, errors } = await open();
		try {
			expect(await page.locator('[data-compartment]').count()).toBe(6);
			expect(await page.locator('.lb-compartments [data-compartment]').count()).toBe(5);
			for (const b of BOXES) {
				const slot = page.locator(`[data-compartment="${b}"]`);
				expect(await slot.locator('.lb-slot-num').innerText()).toBe(String(b));
				expect(await slot.locator('.lb-slot-interval').innerText()).toBe(intervalShort(BOX_INTERVAL_DAYS[b]));
				expect(await slot.getAttribute('aria-label')).toBe(
					`Compartiment ${b}, révision ${intervalLabel(BOX_INTERVAL_DAYS[b])} : 0 fiche`,
				);
				expect(await slotCount(page, b)).toBe('0 fiche');
				expect(await slot.locator('[data-slot-flag]').isVisible()).toBe(false);
			}
			expect(await slotCount(page, 'new')).toBe('100 fiches');
			expect(await page.locator('[data-compartment="new"] [data-slot-flag]').innerText()).toBe('8 à découvrir');
			expect(await page.locator('.lb-box-rule').innerText()).toContain('retour au compartiment 1');

			// 3 fiches sues, 1 oubliée : 3 au compartiment 2, 1 au compartiment 1 (à revoir aujourd’hui).
			await page.click('[data-choice="decouverte"]');
			for (const result of ['known', 'known', 'known', 'forgotten']) {
				await page.click('[data-reveal]');
				await page.click(`[data-assess="${result}"]`);
			}
			await page.click('[data-session-quit]');
			await page.click('[data-summary-back]');
			const check = async () => {
				expect(await slotCount(page, 'new')).toBe('96 fiches');
				expect(await slotCount(page, 1)).toBe('1 fiche');
				expect(await slotCount(page, 2)).toBe('3 fiches');
				expect(await slotCount(page, 3)).toBe('0 fiche');
				expect(await page.locator('[data-compartment="2"] .lb-sheet').count()).toBe(3);
				expect(await page.locator('[data-compartment="2"] .lb-sheet.is-due').count()).toBe(0);
				expect(await page.locator('[data-compartment="1"] .lb-sheet.is-due').count()).toBe(1);
				// Échéance signalée par un texte, pas seulement par une couleur.
				expect(await page.locator('[data-compartment="1"] [data-slot-flag]').textContent()).toBe('1 à revoir');
				expect(await page.locator('[data-compartment="1"]').getAttribute('aria-label')).toContain('dont 1 à revoir aujourd’hui');
				expect(await page.locator('[data-compartment="2"] [data-slot-flag]').isVisible()).toBe(false);
			};
			await check();
			await page.reload();
			await page.waitForSelector('#leitner-app[data-ready="true"]');
			await check(); // persistance après rechargement
			expect(errors).toEqual([]);
		} finally {
			await context.close();
		}
	});

	test('compartiment choisi : ses fiches et leur état, au clavier, sans modifier la progression', async () => {
		const { context, page } = await open();
		try {
			await discover(page, 3, 'known');
			await makeDue(page, [{ index: 1 }]);
			const before = await page.evaluate((k) => localStorage.getItem(k), KEY);
			const drawer = page.locator('[data-drawer]');
			expect(await drawer.isVisible()).toBe(false);

			await page.focus('[data-compartment="2"]');
			await page.keyboard.press('Enter');
			expect(await page.locator('[data-compartment="2"]').getAttribute('aria-expanded')).toBe('true');
			expect(await page.locator('[data-compartment="3"]').getAttribute('aria-expanded')).toBe('false');
			expect(await drawer.isVisible()).toBe(true);
			expect(await page.locator('[data-drawer-title]').innerText()).toBe('Compartiment 2 · révision après 1 jour');
			expect(await page.locator('[data-drawer-summary]').innerText()).toMatch(/^3 fiches, dont 1 à revoir aujourd’hui\./);
			const items = page.locator('[data-drawer-list] > li');
			expect(await items.count()).toBe(3);
			// Les fiches échues d’abord, signalées par un texte et un repère.
			expect(await items.first().getAttribute('data-due')).toBe('true');
			expect(await items.first().locator('.lb-drawer-status').innerText()).toContain('À revoir aujourd’hui');
			expect(await items.nth(1).locator('.lb-drawer-status').innerText()).toContain('Prochaine révision : demain');
			expect(await page.locator('[data-drawer-list] > li[data-due="true"]').count()).toBe(1);

			// Espace sur un autre compartiment : le tiroir change.
			await page.focus('[data-compartment="3"]');
			await page.keyboard.press('Space');
			expect(await page.locator('[data-drawer-title]').innerText()).toBe('Compartiment 3 · révision après 3 jours');
			expect(await page.locator('[data-drawer-summary]').innerText()).toContain('vide');
			expect(await page.locator('[data-compartment="2"]').getAttribute('aria-expanded')).toBe('false');
			// Échap referme et rend le focus au compartiment.
			await page.focus('[data-drawer-close]');
			await page.keyboard.press('Escape');
			expect(await drawer.isVisible()).toBe(false);
			expect(await page.evaluate(() => (document.activeElement as HTMLElement).dataset.compartment)).toBe('3');
			const outline = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle);
			expect(outline).not.toBe('none');

			// Bac des nouvelles : les prochaines fiches à découvrir aujourd’hui.
			await page.click('[data-compartment="new"]');
			expect(await page.locator('[data-drawer-title]').innerText()).toBe('Nouvelles fiches');
			expect(await items.count()).toBe(5);
			// Un second clic referme.
			await page.click('[data-compartment="new"]');
			expect(await drawer.isVisible()).toBe(false);

			// Inspecter une fiche : elle s’ouvre dans « Toutes les questions ».
			await page.click('[data-compartment="2"]');
			const id = await items.first().getAttribute('data-card-id');
			await items.first().locator('button').click();
			expect(await page.locator('[data-fold="browse"]').getAttribute('open')).not.toBeNull();
			expect(await page.locator(`#carte-${id} details`).getAttribute('open')).not.toBeNull();
			expect(await page.locator(`#carte-${id} [data-box-chip]`).innerText()).toBe('Compartiment 2');
			expect(await page.evaluate((k) => localStorage.getItem(k), KEY)).toBe(before);
		} finally {
			await context.close();
		}
	});

	test('mouvement : « Je savais » range la fiche au compartiment suivant, « À revoir » la renvoie au 1', async () => {
		const { context, page, errors } = await open();
		try {
			await discover(page, 3, 'known'); // 3 fiches au compartiment 2
			await makeDue(page, [{ index: 0 }, { index: 1 }, { index: 2, box: 5 }]);
			const ids = Object.keys((await stored(page)).cards);
			expect(await slotCount(page, 5)).toBe('1 fiche');
			await page.click('[data-start]');
			expect(await page.locator('#leitner-app').getAttribute('data-view')).toBe('session');
			// La boîte reste visible pendant la séance, sans consultation possible.
			expect(await page.locator('[data-box-section]').isVisible()).toBe(true);
			expect(await page.locator('[data-compartment="2"]').isDisabled()).toBe(true);

			// Ordre de révision : compartiments bas d’abord. Fiche 1 : compartiment 2 → 3.
			expect(await page.locator('[data-card-origin]').innerText()).toBe('Compartiment 2');
			expect(await page.locator('[data-compartment="2"]').getAttribute('class')).toContain('is-source');
			await page.click('[data-reveal]');
			expect(await page.locator('[data-assess-dest="known"]').innerText()).toBe('→ compartiment 3');
			expect(await page.locator('[data-assess-dest="forgotten"]').innerText()).toBe('→ compartiment 1');
			const boxesOf = async () => {
				const cards = (await stored(page)).cards;
				return [cards[ids[0]].box, cards[ids[1]].box].sort();
			};
			await page.click('[data-assess="known"]');
			expect(await page.locator('.lb-ghost').count()).toBeGreaterThanOrEqual(1); // la fiche vole vers sa place
			expect(await page.locator('[data-movement]').innerText()).toBe('Fiche rangée dans le compartiment 3 : elle reviendra dans 3 jours.');
			expect(await slotCount(page, 2)).toBe('1 fiche'); // comptes mis à jour immédiatement
			expect(await slotCount(page, 3)).toBe('1 fiche');
			expect(await boxesOf()).toEqual([2, 3]); // état enregistré = mouvement affiché
			await page.waitForFunction(() => document.querySelectorAll('.lb-ghost').length === 0);

			// Fiche 2 : oubliée, elle retourne au compartiment 1, avec la raison.
			expect(await page.locator('[data-card-origin]').innerText()).toBe('Compartiment 2');
			await page.click('[data-reveal]');
			await page.click('[data-assess="forgotten"]');
			expect(await page.locator('[data-movement]').innerText()).toBe(
				'Fiche replacée dans le compartiment 1 : une question oubliée recommence au début, pour revenir plus souvent.',
			);
			expect(await page.locator('[data-feedback]').innerText()).toBe('Pas grave. Tu la retrouveras en fin de séance.');
			expect(await slotCount(page, 1)).toBe('1 fiche');
			expect(await slotCount(page, 2)).toBe('0 fiche');
			expect(await boxesOf()).toEqual([1, 3]);

			// Fiche 3 : déjà au compartiment 5 (cas particulier : plafond).
			expect(await page.locator('[data-card-origin]').innerText()).toBe('Compartiment 5');
			await page.click('[data-reveal]');
			expect(await page.locator('[data-assess-dest="known"]').innerText()).toBe('reste au compartiment 5');
			await page.click('[data-assess="known"]');
			expect(await page.locator('[data-movement]').innerText()).toBe(
				'Fiche laissée dans le compartiment 5, le dernier : elle reviendra dans 14 jours.',
			);
			expect(await slotCount(page, 5)).toBe('1 fiche');

			// La fiche oubliée revient en fin de séance, depuis le compartiment 1.
			expect(await page.locator('[data-card-origin]').innerText()).toBe('Compartiment 1');
			await page.click('[data-reveal]');
			expect(await page.locator('[data-assess-dest="forgotten"]').innerText()).toBe('reste au compartiment 1');
			await page.click('[data-assess="known"]');

			// Bilan : ce qui a bougé dans la boîte.
			expect(await page.locator('#lb-summary-title').innerText()).toBe('Séance terminée !');
			expect(await page.locator('[data-summary-moves]').innerText()).toBe(
				'Dans ta boîte : 2 fiches ont avancé, 1 est rangée au compartiment 1, 1 reste au compartiment 5.',
			);
			await page.click('[data-summary-back]');
			expect(await page.locator('[data-compartment="2"]').isDisabled()).toBe(false);
			await page.reload();
			await page.waitForSelector('#leitner-app[data-ready="true"]');
			expect(await slotCount(page, 1)).toBe('0 fiche');
			expect(await slotCount(page, 2)).toBe('1 fiche');
			expect(await slotCount(page, 3)).toBe('1 fiche');
			expect(await slotCount(page, 5)).toBe('1 fiche');
			expect(errors).toEqual([]);
		} finally {
			await context.close();
		}
	});

	test('entraînement : la boîte ne bouge pas et le dit', async () => {
		const { context, page } = await open();
		try {
			await discover(page, 2, 'known');
			await page.waitForFunction(() => document.querySelectorAll('.lb-ghost').length === 0);
			const counts = () => page.locator('[data-slot-count]').allTextContents();
			const before = { counts: await counts(), store: await page.evaluate((k) => localStorage.getItem(k), KEY) };
			await page.click('[data-choice="entrainement"]');
			await page.click('[data-practice-form] button[type="submit"]');
			await page.click('[data-reveal]');
			expect(await page.locator('[data-assess-dest="known"]').isVisible()).toBe(false);
			await page.click('[data-assess="known"]');
			expect(await page.locator('.lb-ghost').count()).toBe(0);
			expect(await page.locator('[data-movement]').innerText()).toBe('Entraînement libre : la fiche reste dans son compartiment.');
			await page.click('[data-reveal]');
			await page.click('[data-assess="forgotten"]');
			expect(await counts()).toEqual(before.counts);
			expect(await page.evaluate((k) => localStorage.getItem(k), KEY)).toBe(before.store);
			await page.click('[data-session-quit]');
			expect(await page.locator('[data-summary-moves]').isVisible()).toBe(false);
		} finally {
			await context.close();
		}
	});

	test('fiche : recto puis verso, le brouillon reste visible ; animations réduites respectées', async () => {
		for (const reducedMotion of ['no-preference', 'reduce'] as const) {
			const context = await browser.newContext({ reducedMotion });
			const page = await context.newPage();
			try {
				await page.goto(URL);
				await page.waitForSelector('#leitner-app[data-ready="true"]');
				await page.click('[data-start]');
				expect(await page.locator('[data-face-front]').isVisible()).toBe(true);
				expect(await page.locator('[data-index-card]').getAttribute('data-side')).toBe('front');
				await page.click('.lb-attempt summary');
				await page.fill('[data-study-attempt]', 'Zola');
				await page.click('[data-reveal]');
				// Verso : la question est rappelée, le recto est masqué, le brouillon reste à côté.
				expect(await page.locator('[data-index-card]').getAttribute('data-side')).toBe('back');
				expect(await page.locator('[data-face-front]').isVisible()).toBe(false);
				expect(await page.locator('[data-answer-question]').innerText()).toBe(
					await page.locator('[data-study-question]').textContent(),
				);
				expect(await page.locator('[data-study-attempt]').inputValue()).toBe('Zola');
				expect(await page.locator('[data-study-attempt]').isVisible()).toBe(true);
				const turning = await page.evaluate(() =>
					document.querySelector('[data-index-card]')!.getAnimations().length,
				);
				await page.click('[data-assess="known"]');
				const ghosts = await page.locator('.lb-ghost').count();
				if (reducedMotion === 'reduce') {
					expect(turning).toBe(0);
					expect(ghosts).toBe(0);
				} else {
					expect(turning).toBeGreaterThan(0);
					expect(ghosts).toBeGreaterThan(0);
				}
				// Dans les deux cas, la fiche est rangée et le compartiment d’arrivée est signalé.
				expect(await page.locator('[data-compartment="2"]').getAttribute('class')).toContain('is-receiving');
				expect(await page.locator('[data-movement]').innerText()).toContain('compartiment 2');
			} finally {
				await context.close();
			}
		}
	});

	test('largeurs 375, 390, 768, 1024, 1440 : boîte complète, réglette en séance, sans débordement', async () => {
		for (const width of [375, 390, 768, 1024, 1440]) {
			const height = width < 500 ? 700 : 900;
			const { context, page, errors } = await open(width, height);
			try {
				const noOverflow = () => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
				expect(await noOverflow(), `${width}`).toBe(true);
				const slots = await page.locator('[data-compartment]').evaluateAll((els) =>
					els.map((e) => {
						const r = e.getBoundingClientRect();
						const front = e.querySelector('.lb-slot-front')!;
						return { left: r.left, right: r.right, top: r.top, w: r.width, h: r.height, clipped: front.scrollWidth > front.clientWidth + 1 };
					}),
				);
				expect(slots).toHaveLength(6);
				for (const s of slots) {
					expect(s.left, `${width}`).toBeGreaterThanOrEqual(0);
					expect(s.right, `${width}`).toBeLessThanOrEqual(width);
					expect(s.w, `${width}`).toBeGreaterThanOrEqual(44);
					expect(s.h, `${width}`).toBeGreaterThanOrEqual(44);
					expect(s.clipped, `${width}`).toBe(false);
				}
				// Les cinq compartiments sur une même rangée, sans défilement.
				const tops = new Set(slots.slice(1).map((s) => Math.round(s.top)));
				expect(tops.size, `${width}`).toBe(1);

				await page.click('[data-compartment="1"]');
				expect(await page.locator('[data-drawer]').isVisible()).toBe(true);
				expect(await noOverflow(), `${width}`).toBe(true);

				await page.click('[data-start]');
				await page.click('[data-reveal]');
				await page.locator('[data-assess="known"]').scrollIntoViewIfNeeded();
				// Réglette collée en haut de l’écran : la fiche y est rangée sous les yeux.
				const rail = await page.locator('[data-box-section]').boundingBox();
				expect(rail!.y, `${width}`).toBeGreaterThanOrEqual(-1);
				expect(rail!.y + rail!.height, `${width}`).toBeLessThan(height * 0.3);
				const assess = await page.locator('[data-assess="known"]').boundingBox();
				expect(assess!.y + assess!.height, `${width}`).toBeLessThanOrEqual(height);
				expect(await noOverflow(), `${width}`).toBe(true);
				await page.click('[data-assess="known"]');
				await page.click('[data-session-quit]');
				expect(await page.locator('[data-summary]').isVisible()).toBe(true);
				expect(await noOverflow(), `${width}`).toBe(true);
				expect(errors).toEqual([]);
			} finally {
				await context.close();
			}
		}
	});

	test('navigation : /pot-bouille renvoie vers la boîte de Leitner, et inversement', async () => {
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
