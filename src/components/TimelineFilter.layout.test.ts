// Filtrage de la frise sur /chronologie, dans un vrai navigateur (Chromium) : bureau et mobile partagent la même
// hiérarchie (cartes complètes pour la catégorie choisie, lignes compactes non estompées pour les autres),
// avec « Littérature » actif à l'ouverture.
// S'exécute sur le site construit : `pnpm build` d'abord, sinon la suite est ignorée.
import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { chromium, devices, type Browser, type Page } from 'playwright';
import { timelineItems } from '../data/timeline';
import { matchesTimelineFilter, timelineFilters } from '../data/timeline-filters';

const BUILT = existsSync('dist/chronologie/index.html');
const PORT = 4392;
const BASE = `http://localhost:${PORT}`;
const CATEGORIES = ['history', 'literature', 'science', 'industry', 'painting', 'music'];

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

async function openPage(width: number, height: number, mobile: boolean): Promise<Page> {
	const context = await browser.newContext(
		mobile ? { ...devices['Pixel 7'], viewport: { width, height } } : { viewport: { width, height } },
	);
	const page = await context.newPage();
	await page.goto(`${BASE}/chronologie/`);
	return page;
}

// Relevé de chaque étape : forme rendue (carte / ligne), estompage, alignement sur l'axe
function snapshot(page: Page) {
	return page.evaluate(() => {
		const spine = document.querySelector('.vertical-spine-line')!.getBoundingClientRect();
		const spineX = spine.left + spine.width / 2;
		const steps = [...document.querySelectorAll<HTMLElement>('.timeline-step')].map((step) => {
			const btn = step.querySelector<HTMLElement>('.timeline-entry-button')!;
			const line = step.querySelector<HTMLElement>('.entry-compact-line')!;
			const title = step.querySelector<HTMLElement>('.entry-title')!;
			const node = step.querySelector<HTMLElement>('.spine-marker-dot')!.getBoundingClientRect();
			const b = btn.getBoundingClientRect();
			const style = getComputedStyle(step);
			const lineHeight = parseFloat(getComputedStyle(line).lineHeight);
			return {
				id: step.dataset.itemId!,
				type: step.dataset.itemType!,
				side: step.classList.contains('align-left') ? 'left' : 'right',
				compactShown: getComputedStyle(line).display !== 'none',
				titleShown: getComputedStyle(title).display !== 'none',
				compactSingleLine: line.getBoundingClientRect().height <= lineHeight * 1.5,
				opacity: Number(style.opacity) * Number(getComputedStyle(btn).opacity),
				filter: style.filter,
				inert: step.inert,
				pointerEvents: getComputedStyle(btn).pointerEvents,
				label: btn.getAttribute('aria-label') ?? '',
				btn: { left: b.left, right: b.right, top: b.top, bottom: b.bottom, height: b.height },
				nodeY: node.top + node.height / 2,
			};
		});
		return { spineX, steps, scrollWidth: document.documentElement.scrollWidth, viewport: window.innerWidth };
	});
}

type Snapshot = Awaited<ReturnType<typeof snapshot>>;

const expectedOrder = (s: Snapshot) => s.steps.map((st) => st.id);

function expectPresentation(s: Snapshot, filterId: string, desktop: boolean, width: number) {
	expect(s.steps).toHaveLength(timelineItems.length);
	expect(s.scrollWidth, 'défilement horizontal').toBeLessThanOrEqual(s.viewport);
	for (const st of s.steps) {
		const matches = matchesTimelineFilter(st.type, filterId);
		// Jamais estompé, grisé ni désactivé
		expect(st.opacity, st.id).toBe(1);
		expect(st.filter, st.id).toBe('none');
		expect(st.inert, st.id).toBe(false);
		expect(st.pointerEvents, st.id).not.toBe('none');
		// Le nom accessible identifie l'événement, sous ses deux formes
		const item = timelineItems.find((it) => it.id === st.id)!;
		expect(st.label.startsWith(item.title), st.id).toBe(true);

		if (matches) {
			expect(st.titleShown, `${filterId} · ${st.id} : carte complète`).toBe(true);
			expect(st.compactShown, `${filterId} · ${st.id}`).toBe(false);
			continue;
		}
		expect(st.compactShown, `${filterId} · ${st.id} : ligne compacte`).toBe(true);
		expect(st.titleShown, `${filterId} · ${st.id}`).toBe(false);
		expect(st.compactSingleLine, `${st.id} : une seule ligne`).toBe(true);
		expect(st.btn.height, `${st.id} : hauteur de ligne`).toBeLessThanOrEqual(desktop ? 40 : 46);
		expect(st.btn.right, st.id).toBeLessThanOrEqual(width + 0.5);
		expect(st.btn.left, st.id).toBeGreaterThanOrEqual(-0.5);
		// Le nœud de l'axe reste à hauteur de la ligne
		expect(st.nodeY, st.id).toBeGreaterThanOrEqual(st.btn.top - 1);
		expect(st.nodeY, st.id).toBeLessThanOrEqual(st.btn.bottom + 1);
		if (desktop) {
			// Bureau : la ligne garde son côté de l'axe central, sans le chevaucher
			if (st.side === 'left') expect(st.btn.right, st.id).toBeLessThan(s.spineX);
			else expect(st.btn.left, st.id).toBeGreaterThan(s.spineX);
		} else {
			expect(st.btn.left, st.id).toBeGreaterThan(s.spineX);
		}
	}
}

async function applyFilter(page: Page, filterId: string) {
	await page.click(`[data-filter="${filterId}"]`);
	await expect.poll(() => page.getAttribute(`[data-filter="${filterId}"]`, 'aria-pressed')).toBe('true');
}

const widths: Array<[string, number, number, boolean]> = [
	['bureau', 960, 900, true],
	['bureau', 1024, 768, true],
	['bureau', 1280, 800, true],
	['bureau', 1440, 900, true],
	['mobile', 320, 640, false],
	['mobile', 375, 812, false],
	['mobile', 430, 932, false],
];

describe.skipIf(!BUILT)('Filtrage de la frise : cartes complètes et lignes compactes', () => {
	beforeAll(async () => {
		server = spawn('pnpm', ['astro', 'preview', '--port', String(PORT)], { stdio: 'ignore' });
		await waitForServer(`${BASE}/chronologie/`);
		browser = await chromium.launch();
	}, 30_000);

	afterAll(async () => {
		await browser?.close();
		server?.kill();
	});

	test.each(widths)('%s %i×%i : « Littérature » par défaut, chaque catégorie, puis « Tout »', async (_label, width, height, desktop) => {
		const page = await openPage(width, height, !desktop);
		// Chargement sans filtre explicite : « Littérature » est actif, rendu tel quel par le serveur
		const pressed = await page.$$eval('.timeline-filter-btn', (btns) =>
			btns.map((b) => [b.getAttribute('data-filter'), b.getAttribute('aria-pressed'), b.classList.contains('active')]),
		);
		expect(pressed).toEqual(timelineFilters.map(({ id }) => [id, id === 'literature' ? 'true' : 'false', id === 'literature']));
		const initial = await snapshot(page);
		const order = expectedOrder(initial);
		// Ordre chronologique du rendu : celui des données triées, inchangé par le filtrage
		expect(order).toHaveLength(timelineItems.length);
		expectPresentation(initial, 'literature', desktop, width);
		const status = page.locator('#timeline-filter-status');
		expect(await status.isHidden()).toBe(false);
		expect(await status.textContent()).toContain('Littérature · 9 événements');

		// Passage d'une catégorie à l'autre sans repasser par « Tout », puis retour à « Littérature »
		for (const filterId of [...CATEGORIES.filter((id) => id !== 'literature'), 'literature']) {
			await applyFilter(page, filterId);
			const s = await snapshot(page);
			expect(expectedOrder(s)).toEqual(order);
			expectPresentation(s, filterId, desktop, width);
			expect(await status.isHidden()).toBe(false);
		}
		// De retour sur « Littérature » : même disposition qu'au chargement
		const back = await snapshot(page);
		back.steps.forEach((st, i) => expect(Math.abs(st.btn.height - initial.steps[i].btn.height), st.id).toBeLessThan(1));

		await applyFilter(page, 'all');
		const all = await snapshot(page);
		expect(expectedOrder(all)).toEqual(order);
		expectPresentation(all, 'all', desktop, width);
		expect(await status.isHidden()).toBe(true);
		await page.context().close();
	});

	test.each(widths.filter(([, , , desktop]) => desktop))(
		'%s %i px : une ligne compacte activée redevient une carte et remplit le panneau latéral',
		async (_label, width, height) => {
			const page = await openPage(width, height, false);
			await applyFilter(page, 'literature');
			// Le Père Goriot (présélectionné, littéraire) reste une carte complète
			expect(await page.locator('#step-pere-goriot .entry-title').isVisible()).toBe(true);

			const step = page.locator('#step-music-beethoven-symphonie-3');
			const btn = step.locator('.timeline-entry-button');
			await btn.click();
			await expect.poll(() => step.evaluate((el) => el.classList.contains('selected'))).toBe(true);
			expect(await step.locator('.entry-title').isVisible()).toBe(true);
			expect(await step.locator('.entry-compact-line').isVisible()).toBe(false);
			expect(await btn.getAttribute('aria-pressed')).toBe('true');
			expect(await page.locator('#timeline-panel .details-title').textContent()).toContain('Héroïque');
			expect(await page.locator('.timeline-sticky-panel-wrapper #timeline-panel audio').count()).toBe(1);

			// Au clavier : une autre ligne compacte, puis Entrée
			const other = page.locator('#step-alessandro-volta');
			await other.locator('.timeline-entry-button').focus();
			await page.keyboard.press('Enter');
			await expect.poll(() => other.evaluate((el) => el.classList.contains('selected'))).toBe(true);
			expect(await page.locator('#timeline-panel .details-title').textContent()).toContain('Volta');
			// L'événement précédent, hors filtre, reprend sa ligne compacte
			expect(await step.locator('.entry-compact-line').isVisible()).toBe(true);
			expect(await btn.getAttribute('aria-pressed')).toBe('false');

			// Changement de filtre : la sélection hors filtre se replie en ligne (son contexte reste dans le panneau)
			await applyFilter(page, 'music');
			expect(await other.locator('.entry-compact-line').isVisible()).toBe(true);
			expect(await other.locator('.timeline-entry-button').getAttribute('aria-pressed')).toBe('true');
			expect(await page.locator('#timeline-panel .details-title').textContent()).toContain('Volta');
			await page.context().close();
		},
	);

	test.each(widths.filter(([, , , desktop]) => !desktop))(
		'%s %i px : une ligne compacte touchée se déplie en carte avec son contexte',
		async (_label, width, height) => {
			const page = await openPage(width, height, true);
			await applyFilter(page, 'literature');
			const step = page.locator('#step-music-beethoven-symphonie-3');
			const btn = step.locator('.timeline-entry-button');
			await btn.tap();
			await expect.poll(() => btn.getAttribute('aria-expanded')).toBe('true');
			expect(await step.locator('.entry-title').isVisible()).toBe(true);
			expect(await step.locator('#timeline-panel audio').count()).toBe(1);
			// Toucher de nouveau replie et rend la ligne compacte
			await btn.tap();
			await expect.poll(() => btn.getAttribute('aria-expanded')).toBe('false');
			expect(await step.locator('.entry-compact-line').isVisible()).toBe(true);
			await page.context().close();
		},
	);

	test('bandeaux politiques et nom accessible de la frise', async () => {
		const page = await openPage(1280, 800, false);
		const years = timelineItems.flatMap((it) => [it.year, it.endYear ?? it.year]);
		const name = `Frise chronologique verticale de ${Math.min(...years)} à ${Math.max(...years)}`;
		expect(name).toBe('Frise chronologique verticale de 1661 à 1883');
		// Région nommée, unique, qui contient la liste ordonnée des repères
		const region = page.getByRole('region', { name, exact: true });
		expect(await region.count()).toBe(1);
		expect(await region.getAttribute('id')).toBe('vertical-timeline');
		expect(await region.locator('ol.timeline-ordered-list > li.timeline-step').count()).toBe(timelineItems.length);
		expect(await page.getByRole('region', { name: /^Frise chronologique/ }).count()).toBe(1);
		// Chaque repère est rangé sous le bandeau de sa propre période
		const rows = await page.$$eval('.timeline-step', (steps) =>
			steps.map((s) => {
				const el = s as HTMLElement;
				const banner = document.getElementById(el.dataset.bannerId!);
				return [el.dataset.itemId, el.dataset.periodId, banner?.dataset.periodId];
			}),
		);
		for (const [id, periodId, bannerPeriod] of rows) expect(bannerPeriod, id).toBe(periodId);
		const bannerOf = (id: string) => rows.find(([itemId]) => itemId === id)?.[2];
		expect(bannerOf('francoise-de-graffigny')).toBe('regne-louis-xiv');
		expect(bannerOf('lettres-d-une-peruvienne')).toBe('regne-louis-xv');
		expect(bannerOf('lettres-d-une-peruvienne-1752')).toBe('regne-louis-xv');
		expect(bannerOf('machine-vapeur-watt')).toBe('regne-louis-xv');
		expect(bannerOf('revolution-francaise')).toBe('revolution-francaise-regime');
		await page.context().close();
	});

	// Graffigny : l'autrice (1695–1758) et les deux jalons éditoriaux (1747, 1752), cartes complètes sous « Littérature »
	const GRAFFIGNY_IDS = ['francoise-de-graffigny', 'lettres-d-une-peruvienne', 'lettres-d-une-peruvienne-1752'];

	test.each(widths)('%s %i×%i : Graffigny à sa place, lisible et reliée à /graffigny', async (_label, width, height, desktop) => {
		const page = await openPage(width, height, !desktop);
		const errors: string[] = [];
		page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()));
		page.on('pageerror', (err) => errors.push(err.message));
		await page.reload();

		// Ordre chronologique : après Lully (1670), avant Watt (1769)
		const order = await page.$$eval('.timeline-step', (steps) => steps.map((s) => (s as HTMLElement).dataset.itemId!));
		const at = (id: string) => order.indexOf(id);
		expect(at('lully-musique-de-cour')).toBeLessThan(at('francoise-de-graffigny'));
		expect(at('francoise-de-graffigny')).toBeLessThan(at('lettres-d-une-peruvienne'));
		expect(at('lettres-d-une-peruvienne')).toBeLessThan(at('lettres-d-une-peruvienne-1752'));
		expect(at('lettres-d-une-peruvienne-1752')).toBeLessThan(at('machine-vapeur-watt'));

		// Cartes complètes, sans chevauchement ni débordement
		const boxes = [];
		for (const id of GRAFFIGNY_IDS) {
			const btn = page.locator(`#step-${id} .timeline-entry-button`);
			expect(await page.locator(`#step-${id} .entry-title`).isVisible(), id).toBe(true);
			const box = (await btn.boundingBox())!;
			expect(box.x, id).toBeGreaterThanOrEqual(-0.5);
			expect(box.x + box.width, id).toBeLessThanOrEqual(width + 0.5);
			boxes.push(box);
		}
		for (let i = 1; i < boxes.length; i++) {
			const sameSide = Math.abs(boxes[i].x - boxes[i - 1].x) < 1;
			if (sameSide || !desktop) expect(boxes[i].y, GRAFFIGNY_IDS[i]).toBeGreaterThanOrEqual(boxes[i - 1].y + boxes[i - 1].height);
		}
		expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);

		// La carte de 1747 ouvre son contexte, qui renvoie à /graffigny et à l'édition de 1752
		const btn1747 = page.locator('#step-lettres-d-une-peruvienne .timeline-entry-button');
		if (desktop) await btn1747.click();
		else await btn1747.tap();
		const link = page.locator('#timeline-panel a.details-page-link');
		await expect.poll(() => link.getAttribute('href')).toBe('/graffigny');
		expect(await page.locator('#timeline-panel .details-title').textContent()).toBe('Lettres d’une Péruvienne');
		expect(await page.locator('#timeline-panel [data-target-id="lettres-d-une-peruvienne-1752"]').count()).toBe(1);
		expect(await page.locator('#timeline-panel [data-target-id="francoise-de-graffigny"]').count()).toBe(1);
		expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);

		await Promise.all([page.waitForURL(/\/graffigny\/?$/), link.click()]);
		expect(await page.locator('h1#page-title').textContent()).toContain('Lettres d’une Péruvienne');
		expect(errors).toEqual([]);
		await page.context().close();
	});
});
