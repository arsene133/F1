// Filtrage de la frise sur /chronologie, dans un vrai navigateur (Chromium) : bureau et mobile partagent la même
// hiérarchie (cartes complètes pour la catégorie choisie, lignes compactes non estompées pour les autres).
// S'exécute sur le site construit : `pnpm build` d'abord, sinon la suite est ignorée.
import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { chromium, devices, type Browser, type Page } from 'playwright';
import { timelineItems } from '../data/timeline';
import { matchesTimelineFilter } from '../data/timeline-filters';

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

	test.each(widths)('%s %i×%i : chaque catégorie, puis retour à « Tout »', async (_label, width, height, desktop) => {
		const page = await openPage(width, height, !desktop);
		const initial = await snapshot(page);
		const order = expectedOrder(initial);
		// Ordre chronologique du rendu : celui des données triées, inchangé par le filtrage
		expect(order).toHaveLength(timelineItems.length);
		expectPresentation(initial, 'all', desktop, width);
		const statusHidden = () => page.locator('#timeline-filter-status').isHidden();
		expect(await statusHidden()).toBe(true);

		// Passage d'une catégorie à l'autre sans repasser par « Tout »
		for (const filterId of CATEGORIES) {
			await applyFilter(page, filterId);
			const s = await snapshot(page);
			expect(expectedOrder(s)).toEqual(order);
			expectPresentation(s, filterId, desktop, width);
			expect(await statusHidden()).toBe(false);
		}

		await applyFilter(page, 'all');
		const restored = await snapshot(page);
		expect(expectedOrder(restored)).toEqual(order);
		expectPresentation(restored, 'all', desktop, width);
		// Disposition d'origine : mêmes cartes, aux mêmes dimensions qu'au chargement
		restored.steps.forEach((st, i) => expect(Math.abs(st.btn.height - initial.steps[i].btn.height), st.id).toBeLessThan(1));
		expect(await statusHidden()).toBe(true);
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
});
