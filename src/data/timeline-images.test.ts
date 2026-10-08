import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { timelineItems, type TimelineItemImage } from './timeline';

// Audit de l'iconographie de la frise : chaque image doit être servie localement,
// documentée (source, licence) et décrite par un texte alternatif significatif.
// `AUDIT=1 pnpm test` affiche en plus le tableau d'audit complet.

const PUBLIC_DIR = fileURLToPath(new URL('../../public', import.meta.url));

/** Repères volontairement sans illustration (périodes abstraites, transitions conceptuelles). */
const INTENTIONALLY_WITHOUT_IMAGE: string[] = [];

function imageFiles(image: TimelineItemImage): string[] {
	const fromSrcset = (image.srcset ?? '')
		.split(',')
		.map((candidate) => candidate.trim().split(/\s+/)[0])
		.filter(Boolean);
	return [image.src, ...fromSrcset];
}

const images = timelineItems.flatMap((item) =>
	[item.image, item.secondaryImage]
		.filter((image): image is TimelineItemImage => Boolean(image))
		.map((image) => ({ item, image })),
);

if (process.env.AUDIT) {
	const rows = timelineItems.map((item) => {
		const image = item.image;
		const local = image ? imageFiles(image).every((file) => existsSync(PUBLIC_DIR + file)) : false;
		return [
			item.id,
			item.year,
			item.type,
			image ? image.src.split('/').pop() : '—',
			image?.credit?.license ?? '—',
			image ? (local ? 'local' : 'MANQUANT') : '—',
			item.secondaryImage ? `+ ${item.secondaryImage.src.split('/').pop()}` : '',
		].join(' | ');
	});
	process.stdout.write(['ID | Année | Catégorie | Image | Licence | Local | Secondaire', ...rows].join('\n') + '\n');
}

describe('iconographie de la frise', () => {
	test('chaque repère illustrable a une image principale', () => {
		const missing = timelineItems
			.filter((item) => !item.image && !INTENTIONALLY_WITHOUT_IMAGE.includes(item.id))
			.map((item) => item.id);
		expect(missing).toEqual([]);
	});

	test.each(images.map(({ item, image }) => [item.id, image.src, image] as const))(
		'%s → %s : fichiers locaux présents',
		(_id, _src, image) => {
			for (const file of imageFiles(image)) {
				expect(file, 'aucun lien externe en production').toMatch(/^\/images\/timeline\//);
				expect(existsSync(PUBLIC_DIR + file), `${file} introuvable`).toBe(true);
			}
		},
	);

	test.each(images.map(({ item, image }) => [item.id, image.src, image] as const))(
		'%s → %s : alt, dimensions et provenance documentés',
		(_id, _src, image) => {
			expect(image.alt.trim().length).toBeGreaterThan(25);
			expect(image.alt).not.toMatch(/^(image|photo|illustration)\b/i);
			expect(image.width).toBeGreaterThan(0);
			expect(image.height).toBeGreaterThan(0);
			expect(image.credit?.sourceUrl).toMatch(/^https:\/\//);
			expect(image.credit?.license).toBeTruthy();
			if (image.credit?.attributionRequired) {
				expect(image.credit.attribution || image.credit.author).toBeTruthy();
			}
		},
	);
});
