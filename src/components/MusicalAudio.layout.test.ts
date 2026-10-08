// Géométrie rendue du lecteur d'extrait sur /chronologie, dans un vrai navigateur (Chromium, émulation tactile).
// S'exécute sur le site construit : `pnpm build` d'abord, sinon la suite est ignorée.
import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { chromium, devices, type Browser, type Page } from 'playwright';

const BUILT = existsSync('dist/chronologie/index.html');
const PORT = 4391;
const BASE = `http://localhost:${PORT}`;
const STEP = '#step-music-beethoven-symphonie-3';

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

// Extrait de substitution : 30 s de silence en WAV, servi à la place de Wikimedia pour tester lecture et déplacement
function silentWav(seconds = 30, rate = 8000): Buffer {
	const n = seconds * rate;
	const buf = Buffer.alloc(44 + n, 0x80);
	buf.write('RIFF', 0);
	buf.writeUInt32LE(36 + n, 4);
	buf.write('WAVEfmt ', 8);
	buf.writeUInt32LE(16, 16);
	buf.writeUInt16LE(1, 20); // PCM
	buf.writeUInt16LE(1, 22); // mono
	buf.writeUInt32LE(rate, 24);
	buf.writeUInt32LE(rate, 28);
	buf.writeUInt16LE(1, 32);
	buf.writeUInt16LE(8, 34);
	buf.write('data', 36);
	buf.writeUInt32LE(n, 40);
	return buf;
}

// État d'échec observé sur Android (bande étroite et verticale, sans barre de progression) : jamais toléré
function expectNotCollapsed(audio: { width: number; height: number }, containerWidth: number) {
	expect(audio.width, 'lecteur réduit à une bande étroite').toBeGreaterThan(100);
	expect(audio.height, 'lecteur plus haut que large').toBeLessThan(audio.width);
	expect(audio.width / containerWidth, 'lecteur étroit par rapport à son panneau').toBeGreaterThan(0.75);
}

// Filtre « Musique », puis sélection de la Symphonie n° 3 : état de la capture Android
async function openEroica(page: Page) {
	await page.goto(`${BASE}/chronologie/`);
	await page.click('[data-filter="music"]');
	await page.locator(`${STEP} .timeline-entry-button`).click();
	await page.locator('#timeline-panel audio').waitFor();
}

describe.skipIf(!BUILT)('Lecteur d’extrait : géométrie rendue', () => {
	beforeAll(async () => {
		server = spawn('pnpm', ['astro', 'preview', '--port', String(PORT)], { stdio: 'ignore' });
		await waitForServer(`${BASE}/chronologie/`);
		browser = await chromium.launch();
	}, 30_000);

	afterAll(async () => {
		await browser?.close();
		server?.kill();
	});

	const mobile: Array<[number, number]> = [
		[320, 640],
		[320, 844],
		[360, 800],
		[375, 812],
		[390, 844],
		[430, 932],
	];

	test.each(mobile)('mobile %i×%i : lecteur horizontal sur toute la largeur du panneau', async (width, height) => {
		const context = await browser.newContext({
			...devices['Pixel 7'],
			viewport: { width, height },
		});
		const page = await context.newPage();
		await openEroica(page);

		const g = await page.evaluate((step) => {
			const audio = document.querySelector<HTMLElement>(`${step} #timeline-panel audio`)!;
			const listen = audio.closest<HTMLElement>('.details-listen')!;
			const panel = document.getElementById('timeline-panel')!;
			const rect = (el: Element) => el.getBoundingClientRect();
			const a = rect(audio);
			const l = rect(listen);
			const p = rect(panel);
			const ps = getComputedStyle(panel);
			return {
				audio: { left: a.left, right: a.right, width: a.width, height: a.height },
				listen: { left: l.left, right: l.right, width: l.width },
				// bords intérieurs du panneau (carte) : le lecteur ne doit jamais les franchir
				panelInner: {
					left: p.left + parseFloat(ps.borderLeftWidth),
					right: p.right - parseFloat(ps.borderRightWidth),
				},
				scrollWidth: document.documentElement.scrollWidth,
				viewport: window.innerWidth,
			};
		}, STEP);

		expectNotCollapsed(g.audio, g.panelInner.right - g.panelInner.left);
		// Une vraie barre de lecture, pas une commande de quelques dizaines de pixels
		expect(g.audio.width).toBeGreaterThan(200);
		// Horizontal : bien plus large que haut, à hauteur tactile
		expect(g.audio.height).toBeGreaterThanOrEqual(44);
		expect(g.audio.width).toBeGreaterThan(g.audio.height * 4);
		// Contenu dans le cadre d'écoute, qui l'est lui-même dans la carte
		expect(g.audio.width).toBeLessThanOrEqual(g.listen.width);
		expect(g.audio.left).toBeGreaterThanOrEqual(g.listen.left - 0.5);
		expect(g.audio.right).toBeLessThanOrEqual(g.listen.right + 0.5);
		expect(g.listen.left).toBeGreaterThanOrEqual(g.panelInner.left - 0.5);
		expect(g.listen.right).toBeLessThanOrEqual(g.panelInner.right + 0.5);
		// Le lecteur occupe la largeur intérieure du panneau (à la bordure d'accent près)
		expect(g.audio.width).toBeGreaterThan(g.panelInner.right - g.panelInner.left - 8);
		// Aucun défilement horizontal de la page
		expect(g.scrollWidth).toBeLessThanOrEqual(g.viewport);

		// Toucher le lecteur ne change pas la sélection
		const box = (await page.locator('#timeline-panel audio').boundingBox())!;
		await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
		await expect
			.poll(() => page.evaluate(() => document.querySelector('.timeline-entry-button.selected')?.getAttribute('data-item-id')))
			.toBe('music-beethoven-symphonie-3');

		await context.close();
	});

	// Android « version pour ordinateur » (ou tablette) : mise en page bureau à 980 px, réduite à l'écran, au doigt.
	// C'est l'état de la capture : panneau latéral, menu « ⋮ » et haut-parleur, barre de progression écrasée.
	test('téléphone en « version pour ordinateur » (980 px sur un écran de 412) : sans « ⋮ », lecture et déplacement', async () => {
		const context = await browser.newContext({
			viewport: { width: 980, height: 2180 },
			screen: { width: 412, height: 915 },
			isMobile: true,
			hasTouch: true,
		});
		// Requêtes par plages (206), comme Commons : sans elles, Chrome ne sait pas déplacer la lecture
		const wav = silentWav();
		await context.route('https://upload.wikimedia.org/**', (route) => {
			const [, from = '0', to] = /bytes=(\d+)-(\d*)/.exec(route.request().headers().range ?? '') ?? [];
			const start = Number(from);
			const end = to ? Number(to) : wav.length - 1;
			return route.fulfill({
				status: 206,
				headers: {
					'Content-Type': 'audio/wav',
					'Accept-Ranges': 'bytes',
					'Content-Range': `bytes ${start}-${end}/${wav.length}`,
				},
				body: wav.subarray(start, end + 1),
			});
		});
		const page = await context.newPage();
		await openEroica(page);
		const g = await page.evaluate(() => {
			const audio = document.querySelector<HTMLElement>('#timeline-panel audio')!;
			const panel = document.getElementById('timeline-panel')!;
			const a = audio.getBoundingClientRect();
			const p = panel.getBoundingClientRect();
			const ps = getComputedStyle(panel);
			return {
				coarse: matchMedia('(pointer: coarse)').matches,
				inAside: !!audio.closest('.timeline-sticky-panel-wrapper'),
				controlslist: audio.getAttribute('controlslist'),
				audio: { left: a.left, right: a.right, width: a.width, height: a.height },
				panelInner: { left: p.left + parseFloat(ps.borderLeftWidth), right: p.right - parseFloat(ps.borderRightWidth) },
				scrollWidth: document.documentElement.scrollWidth,
				panelOverflowX: panel.scrollWidth > panel.clientWidth,
			};
		});
		expect(g.coarse).toBe(true);
		expect(g.inAside).toBe(true);
		expect(g.controlslist).toBe('nodownload noplaybackrate');
		expectNotCollapsed(g.audio, g.panelInner.right - g.panelInner.left);
		expect(g.audio.width).toBeGreaterThan(g.panelInner.right - g.panelInner.left - 8);
		expect(g.audio.height).toBeGreaterThanOrEqual(44);
		expect(g.audio.left).toBeGreaterThanOrEqual(g.panelInner.left - 0.5);
		expect(g.audio.right).toBeLessThanOrEqual(g.panelInner.right + 0.5);
		expect(g.panelOverflowX).toBe(false);
		expect(g.scrollWidth).toBeLessThanOrEqual(980);

		// Lecture puis déplacement, au doigt, sur les commandes natives
		const audio = page.locator('#timeline-panel audio');
		await audio.scrollIntoViewIfNeeded();
		const box = (await audio.boundingBox())!;
		await page.touchscreen.tap(box.x + 22, box.y + box.height / 2);
		await expect.poll(() => audio.evaluate((el: HTMLAudioElement) => !el.paused && el.currentTime > 0)).toBe(true);
		const before = await audio.evaluate((el: HTMLAudioElement) => el.currentTime);
		await page.touchscreen.tap(box.x + box.width * 0.7, box.y + box.height / 2);
		await expect.poll(() => audio.evaluate((el: HTMLAudioElement) => el.currentTime)).toBeGreaterThan(before + 5);
		expect(await page.evaluate(() => document.querySelector('.timeline-entry-button.selected')?.getAttribute('data-item-id'))).toBe(
			'music-beethoven-symphonie-3',
		);
		await context.close();
	});

	// Grande tablette tactile en mise en page bureau : écran assez large, aucune raison de retirer le menu natif
	test('grande tablette tactile (1280 px) : menu « ⋮ » conservé, cadre d’écoute inchangé', async () => {
		const context = await browser.newContext({
			viewport: { width: 1280, height: 800 },
			screen: { width: 1280, height: 800 },
			isMobile: true,
			hasTouch: true,
		});
		const page = await context.newPage();
		await openEroica(page);
		const g = await page.evaluate(() => {
			const audio = document.querySelector<HTMLElement>('#timeline-panel audio')!;
			return {
				coarse: matchMedia('(pointer: coarse)').matches,
				controlslist: audio.getAttribute('controlslist'),
				listenMargin: getComputedStyle(audio.closest('.details-listen')!).marginLeft,
				width: audio.getBoundingClientRect().width,
			};
		});
		expect(g.coarse).toBe(true);
		expect(g.controlslist).toBeNull();
		expect(g.listenMargin).toBe('0px');
		expect(g.width).toBeGreaterThan(240);
		await context.close();
	});

	// Dimensions relevées avant les correctifs mobiles : à la souris, le lecteur du panneau latéral ne bouge pas
	test.each([
		[960, 800, 250, 44],
		[1024, 768, 250, 44],
		[1200, 800, 282, 44],
		[1280, 800, 278.8, 36],
		[1440, 900, 280.4, 36],
	])('bureau %i×%i à la souris : lecteur du panneau latéral inchangé', async (width, height, audioWidth, audioHeight) => {
		const page = await browser.newPage({ viewport: { width, height } });
		await openEroica(page);
		const g = await page.evaluate(() => {
			const audio = document.querySelector<HTMLElement>('#timeline-panel audio')!;
			const listen = audio.closest<HTMLElement>('.details-listen')!;
			return {
				inAside: !!audio.closest('.timeline-sticky-panel-wrapper'),
				listenMargin: getComputedStyle(listen).marginLeft,
				controlslist: audio.getAttribute('controlslist'),
				width: audio.getBoundingClientRect().width,
				height: audio.getBoundingClientRect().height,
				scrollWidth: document.documentElement.scrollWidth,
			};
		});
		expect(g.inAside).toBe(true);
		expect(g.listenMargin).toBe('0px');
		// À la souris, le menu « ⋮ » (téléchargement, vitesse) reste disponible
		expect(g.controlslist).toBeNull();
		expect(Math.abs(g.width - audioWidth)).toBeLessThan(1);
		expect(g.height).toBe(audioHeight);
		expect(g.scrollWidth).toBeLessThanOrEqual(width);
		await page.close();
	});
});
