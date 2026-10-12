import { describe, expect, test } from 'vitest';
import { goriotPlaces } from './goriot-places';
import { goriotCharacters, goriotRelationships } from './goriot-relationships';
import { goriotThemes, type GoriotTheme } from './goriot-themes';

describe('Modèle de données du tableau de bord thématique du Père Goriot (src/data/goriot-themes.ts)', () => {
	test('contient exactement les 8 thèmes majeurs du roman avec identifiants stables et uniques', () => {
		const ids = goriotThemes.map((t) => t.id);
		const uniqueIds = new Set(ids);
		expect(ids.length).toBe(uniqueIds.size);
		expect(ids.length).toBe(8);

		expect(ids).toContain('paternite-sacrifice');
		expect(ids).toContain('argent-dettes');
		expect(ids).toContain('ambition-ascension');
		expect(ids).toContain('amour-interets');
		expect(ids).toContain('apparences-reputation');
		expect(ids).toContain('inegalites-pouvoir');
		expect(ids).toContain('manipulation-corruption');
		expect(ids).toContain('solitude-abandon');
	});

	test('chaque thème possède des champs textuels complets, accessibles et étayés', () => {
		goriotThemes.forEach((t) => {
			expect(t.title.trim().length).toBeGreaterThan(5);
			expect(t.subtitle.trim().length).toBeGreaterThan(10);
			expect(t.tagline.trim().length).toBeGreaterThan(15);
			expect(t.centralQuestion.trim().length).toBeGreaterThan(20);
			expect(t.studentExplanation.trim().length).toBeGreaterThan(50);
			expect(t.literarySignificance.trim().length).toBeGreaterThan(30);
			expect(t.keyObservations.length).toBeGreaterThanOrEqual(3);
			expect(t.verificationNotes.trim().length).toBeGreaterThan(10);
			expect(t.accentColor).toMatch(/^#[0-9a-f]{6}$/i);
			expect(t.badgeLabel.trim().length).toBeGreaterThan(2);
		});
	});

	test('toutes les références de personnages existent dans goriotCharacters', () => {
		const characterIds = new Set(goriotCharacters.map((c) => c.id));
		goriotThemes.forEach((t) => {
			expect(t.characterIds.length).toBeGreaterThanOrEqual(3);
			t.characterIds.forEach((cid) => {
				expect(characterIds.has(cid), `Personnage inconnu dans le thème ${t.id} : ${cid}`).toBe(true);
			});
		});
	});

	test('toutes les références de lieux existent dans goriotPlaces', () => {
		const placeIds = new Set(goriotPlaces.map((p) => p.id));
		goriotThemes.forEach((t) => {
			expect(t.locationIds.length).toBeGreaterThanOrEqual(2);
			t.locationIds.forEach((lid) => {
				expect(placeIds.has(lid), `Lieu inconnu dans le thème ${t.id} : ${lid}`).toBe(true);
			});
		});
	});

	test('toutes les relations associées existent dans goriotRelationships', () => {
		const relIds = new Set(goriotRelationships.map((r) => r.id));
		goriotThemes.forEach((t) => {
			if (t.relationshipIds) {
				t.relationshipIds.forEach((rid) => {
					expect(relIds.has(rid), `Relation inconnue dans le thème ${t.id} : ${rid}`).toBe(true);
				});
			}
		});
	});

	test('chaque thème comprend au moins deux scènes clés concrètes avec étapes narratives vérifiées', () => {
		const validStages = new Set(['stage-1', 'stage-2', 'stage-3', 'stage-4']);
		const placeIds = new Set(goriotPlaces.map((p) => p.id));
		const characterIds = new Set(goriotCharacters.map((c) => c.id));

		goriotThemes.forEach((t) => {
			expect(t.scenes.length).toBeGreaterThanOrEqual(2);
			t.scenes.forEach((scene) => {
				expect(scene.title.trim().length).toBeGreaterThan(5);
				expect(validStages.has(scene.stageId)).toBe(true);
				expect(scene.summary.trim().length).toBeGreaterThan(20);
				expect(scene.literarySignificance.trim().length).toBeGreaterThan(20);
				if (scene.locationId) {
					expect(placeIds.has(scene.locationId), `Lieu de scène inconnu : ${scene.locationId}`).toBe(true);
				}
				scene.characterIds.forEach((cid) => {
					expect(characterIds.has(cid), `Personnage de scène inconnu : ${cid}`).toBe(true);
				});
			});
		});
	});

	test('chaque thème comprend des citations vérifiées avec locuteur et référence textuelle', () => {
		goriotThemes.forEach((t) => {
			expect(t.quotations.length).toBeGreaterThanOrEqual(2);
			t.quotations.forEach((q) => {
				expect(q.text.trim().length).toBeGreaterThan(15);
				expect(q.reference.trim().length).toBeGreaterThan(5);
				expect(q.explanation.trim().length).toBeGreaterThan(15);
			});
		});
	});

	test('tous les renvois croisés de thèmes pointent vers des thèmes existants sans autoréférence', () => {
		const themeIds = new Set(goriotThemes.map((t) => t.id));
		goriotThemes.forEach((t) => {
			expect(t.relatedThemeIds.length).toBeGreaterThanOrEqual(2);
			t.relatedThemeIds.forEach((relId) => {
				expect(themeIds.has(relId), `Renvoi vers thème inexistant : ${relId}`).toBe(true);
				expect(relId).not.toBe(t.id);
			});
		});
	});
});
