import { describe, expect, test } from 'vitest';
import { renderMusicalAudio } from './MusicalAudio';
import { timelineItems, type TimelineItem } from '../data/timeline';

describe('MusicalAudio - Rendu des ressources musicales', () => {
	const dummyEmbeddedItem: TimelineItem = {
		id: 'test-embedded',
		year: 1830,
		type: 'music',
		category: 'symphony',
		title: 'Symphonie test',
		author: 'Compositeur Test',
		description: 'Description test',
		historicalContext: 'Contexte test',
		periodId: 'restauration',
		relatedTo: [],
		audio: {
			type: 'embedded',
			title: 'Ier mouvement (allegro)',
			url: 'https://example.org/audio/test.mp3',
			mimeType: 'audio/mpeg',
			source: 'Wikimedia Commons',
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Test.mp3',
			license: 'CC BY-SA 4.0',
			licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
			performer: 'Orchestre Test, dir. Maestro',
			recordingDate: '2020',
			duration: '3:45',
			attributionRequired: true,
		},
	};

	const dummyExternalItem: TimelineItem = {
		id: 'test-external',
		year: 1824,
		type: 'music',
		category: 'symphony',
		title: 'Symphonie externe',
		author: 'Compositeur Externe',
		description: 'Description externe',
		historicalContext: 'Contexte externe',
		periodId: 'restauration',
		relatedTo: [],
		audio: {
			type: 'external',
			title: 'Écouter l’œuvre',
			url: 'https://imslp.org/wiki/Test_Work',
			source: 'IMSLP — Petrucci Music Library',
			note: 'Enregistrements historiques en écoute libre sur IMSLP.',
		},
	};

	const dummyNoAudioItem: TimelineItem = {
		id: 'test-no-audio',
		year: 1850,
		type: 'music',
		category: 'opera',
		title: 'Opéra sans enregistrement',
		description: 'Pas d’audio',
		historicalContext: 'Contexte',
		periodId: 'deuxieme-republique',
		relatedTo: [],
	};

	test('1. Une ressource embedded génère bien <audio controls preload="none">', () => {
		const html = renderMusicalAudio(dummyEmbeddedItem);
		expect(html).toContain('<audio controls preload="none"');
		expect(html).toContain('<source src="https://example.org/audio/test.mp3" type="audio/mpeg" />');
		expect(html).toContain('is-embedded');
		expect(html).toContain('▶');
		expect(html).toContain('Écouter : Ier mouvement (allegro)');
		expect(html).toContain('(3 min 45)');
	});

	test('2. Une ressource external génère bien un lien et aucun <audio>', () => {
		const html = renderMusicalAudio(dummyExternalItem);
		expect(html).not.toContain('<audio');
		expect(html).not.toContain('<source');
		expect(html).toContain('is-external');
		expect(html).toContain('href="https://imslp.org/wiki/Test_Work"');
		expect(html).toContain('Écouter l’œuvre');
		expect(html).toContain('Écoute externe · IMSLP — Petrucci Music Library');
	});

	test('3. Les liens externes utilisent target="_blank" et rel="noopener noreferrer"', () => {
		const html = renderMusicalAudio(dummyExternalItem);
		expect(html).toContain('target="_blank"');
		expect(html).toContain('rel="noopener noreferrer"');
		expect(html).toContain('sr-only');
		expect(html).toContain('nouvel onglet');
	});

	test('4. Aucun autoplay n’est présent dans le balisage', () => {
		const embeddedHtml = renderMusicalAudio(dummyEmbeddedItem);
		const externalHtml = renderMusicalAudio(dummyExternalItem);
		expect(embeddedHtml.toLowerCase()).not.toContain('autoplay');
		expect(externalHtml.toLowerCase()).not.toContain('autoplay');
	});

	test('5. Aucune URL de page web n’est utilisée comme source audio directe', () => {
		const embeddedHtml = renderMusicalAudio(dummyEmbeddedItem);
		const audioSources = [...embeddedHtml.matchAll(/<source[^>]+src="([^">]+)"/g)].map((m) => m[1]);
		expect(audioSources.length).toBeGreaterThan(0);
		for (const src of audioSources) {
			expect(src).not.toMatch(/imslp\.org\/wiki/);
			expect(src).not.toMatch(/\.html?$/);
			expect(src).toMatch(/\.(mp3|ogg|opus|wav|flac|m4a|aac)(\?.*)?$/i);
		}
	});

	test('6. Les métadonnées de licence, source, interprète et durée sont affichées pour les fichiers intégrés', () => {
		const html = renderMusicalAudio(dummyEmbeddedItem);
		expect(html).toContain('CC BY-SA 4.0');
		expect(html).toContain('https://creativecommons.org/licenses/by-sa/4.0/');
		expect(html).toContain('Wikimedia Commons');
		expect(html).toContain('Orchestre Test, dir. Maestro');
		expect(html).toContain('(2020)');
		expect(html).toContain('3 min 45');
		expect(html).toContain('Symphonie test, Compositeur Test');
	});

	test('7. Les œuvres sans audio ne génèrent pas de lecteur vide', () => {
		const html = renderMusicalAudio(dummyNoAudioItem);
		expect(html).toBe('');
	});

	test('8. Cas spécifique Beethoven — Symphonie n°9 : écoute externe sans lecteur inline', () => {
		const b9Item = timelineItems.find((item) => item.id === 'music-beethoven-symphonie-9');
		expect(b9Item).toBeDefined();
		expect(b9Item?.audio?.type).toBe('external');

		const html = renderMusicalAudio(b9Item!);
		expect(html).not.toContain('<audio');
		expect(html).toContain('is-external');
		expect(html).toContain('href="https://imslp.org/wiki/Symphony_No.9,_Op.125_(Beethoven,_Ludwig_van)"');
		expect(html).toContain('target="_blank"');
		expect(html).toContain('rel="noopener noreferrer"');
		expect(html).toContain('Écoute externe · IMSLP — Petrucci Music Library');
	});

	test('9. Cas spécifique Berlioz — Symphonie fantastique : lecteur audio inline complet', () => {
		const berliozItem = timelineItems.find((item) => item.id === 'music-berlioz-symphonie-fantastique');
		expect(berliozItem).toBeDefined();
		expect(berliozItem?.audio?.type).toBe('embedded');

		const html = renderMusicalAudio(berliozItem!);
		expect(html).toContain('<audio controls preload="none"');
		expect(html).toContain('is-embedded');
		expect(html).toContain('Hector_Berlioz_Symphonie_fantastique_2nd_movement_excerpt.mp3');
		expect(html).toContain('hr-Sinfonieorchester (Frankfurt Radio Symphony), dir. Hugh Wolff');
		expect(html).toContain('CC BY-SA 4.0');
		expect(html).toContain('Wikimedia Commons');
		expect(html).not.toContain('autoplay');
	});

	test('10. Audit exhaustif de tous les jalons de type music de la timeline', () => {
		const musicItems = timelineItems.filter((item) => item.type === 'music');
		expect(musicItems.length).toBe(9);

		for (const item of musicItems) {
			const html = renderMusicalAudio(item);
			expect(item.audio, `Jalon musical ${item.id} sans ressource audio`).toBeDefined();

			if (item.audio?.type === 'embedded') {
				expect(html).toContain('<audio controls preload="none"');
				expect(html).not.toContain('autoplay');
				expect(html).toContain(item.audio.source);
				expect(html).toContain(item.audio.license);
				// Vérifier que l'URL audio pointe vers un flux/fichier audio, pas une page wiki
				expect(item.audio.url).toMatch(/\.(mp3|ogg|opus)(\?.*)?$/i);
				expect(item.audio.url).not.toContain('/wiki/File:');
				expect(item.audio.url).not.toContain('imslp.org');
			} else if (item.audio?.type === 'external') {
				expect(html).not.toContain('<audio');
				expect(html).toContain('is-external');
				expect(html).toContain('target="_blank"');
				expect(html).toContain('rel="noopener noreferrer"');
				expect(html).toContain('Écoute externe');
			}
		}
	});

	test('11. Rétrocompatibilité : prise en compte de listenLink si audio est absent', () => {
		const itemWithOnlyListenLink: TimelineItem = {
			id: 'test-legacy-listen-link',
			year: 1820,
			type: 'music',
			category: 'symphony',
			title: 'Œuvre legacy',
			description: 'Description',
			historicalContext: 'Contexte',
			periodId: 'restauration',
			relatedTo: [],
			listenLink: {
				url: 'https://imslp.org/wiki/Legacy',
				source: 'IMSLP',
				type: 'external',
			},
		};
		const html = renderMusicalAudio(itemWithOnlyListenLink);
		expect(html).not.toContain('<audio');
		expect(html).toContain('is-external');
		expect(html).toContain('href="https://imslp.org/wiki/Legacy"');
	});
});
