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

	test('fidélité au dénouement : aucune motivation inventée ni mort « sans personne »', () => {
		const all = goriotThemes
			.flatMap((t) => [t.studentExplanation, t.literarySignificance, ...t.keyObservations])
			.join('\n');
		expect(all).not.toMatch(/maquillage|froisser leur toilette/);
		expect(all).not.toMatch(/sans que personne ne vienne tenir sa main/);
		expect(all).not.toMatch(/préférant danser/);
		expect(all).not.toMatch(/Rastignac et Bianchon\) et le domestique Christophe accompagnent/);
		const scenes = JSON.stringify(goriotThemes);
		expect(scenes).not.toMatch(/quelques instants avant le dernier souffle/);
		expect(scenes).not.toMatch(/assisté uniquement par les deux étudiants/);
		// Sépulture : terrain acheté pour cinq ans (livre IV), pas de fosse commune ni de pluie au convoi
		expect(scenes).not.toMatch(/fosse commune|fosse des pauvres|sous la pluie/);
		// Bianchon est « l’interne de l’hôpital Cochin » dans ce roman
		expect(scenes).not.toMatch(/externe en médecine/);
	});

	describe('citations conformes au fac-similé imprimé de 1910 (éd. Calmann-Lévy)', () => {
		const corpus = JSON.stringify([goriotThemes, goriotCharacters, goriotRelationships, goriotPlaces]);

		test('aucune réplique inventée ou empruntée à une autre édition', () => {
			const interdits = [
				'Une fortune rapide ou le génie',
				'Pas de mandarin',
				'je ne veux pas tuer le mandarin',
				'Vous me paierez cher cette trahison',
				'Mon Eugène, si vous saviez',
				'Vous êtes mon seul espoir',
				'J’ai vendu le dernier morceau d’argent',
				'Je lui ai causé tant de maux',
				'un marché que personne ne refuserait',
				'Victorine Taillefer qui aura des millions',
				'Est mon voisin de pension',
				'regard d’intelligence',
				'Ne voyez dans les hommes',
				'Il revint à pied rue d’Artois',
				'L’on donnait hier aux Italiens',
				'Où as-tu pris cet air grave',
				'« visiteuses »',
				'« courut au numéro 9 »',
			];
			for (const s of interdits) expect(corpus, s).not.toContain(s);
		});

		test('les leçons de l’imprimé sont conservées là où la transcription en ligne diverge', () => {
			// p. 95 : « comme il le mérite » et « comme des chevaux de poste » (la transcription donne d’autres leçons)
			expect(corpus).toContain('traitez ce monde comme il le mérite');
			expect(corpus).toContain('que comme des chevaux de poste');
			// p. 169 : « des stucs, des paliers » ; p. 76 : « ni madame ni moi n’y serons »
			expect(corpus).toContain('recherches coûteuses, des stucs, des paliers');
			expect(corpus).toContain('ni madame ni moi n’y serons');
			expect(corpus).toContain('D’où te vient cet air grave ?');
			expect(corpus).toContain('madame de Nucingen laperait-elle toute la boue');
			expect(corpus).toContain('Et, pour premier acte du défi');
		});
	});
});
