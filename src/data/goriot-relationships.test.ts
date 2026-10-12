import { describe, expect, test } from 'vitest';
import {
	goriotCharacters,
	goriotGuidedTracks,
	goriotNarrativeStages,
	goriotRelCategories,
	goriotRelationships,
	type GoriotRelationshipCategory,
	type NarrativeStage,
} from './goriot-relationships';

describe('Modèle de données des relations du Père Goriot (src/data/goriot-relationships.ts)', () => {
	test('tous les personnages ont des identifiants uniques et non vides', () => {
		const ids = goriotCharacters.map((c) => c.id);
		const uniqueIds = new Set(ids);
		expect(ids.length).toBe(uniqueIds.size);
		expect(ids.length).toBe(16); // 16 personnages essentiels
		ids.forEach((id) => {
			expect(id.trim()).not.toBe('');
		});
	});

	test('contient exactement la liste des personnages obligatoires sans doublon Bianchon', () => {
		const ids = goriotCharacters.map((c) => c.id);
		expect(ids).toContain('rastignac');
		expect(ids).toContain('goriot');
		expect(ids).toContain('anastasie');
		expect(ids).toContain('delphine');
		expect(ids).toContain('vautrin');
		expect(ids).toContain('victorine');
		expect(ids).toContain('mme-vauquer');
		expect(ids).toContain('sylvie');
		expect(ids).toContain('christophe');
		expect(ids).toContain('bianchon'); // Horace Bianchon unifié
		expect(ids).toContain('mme-de-beauseant');
		expect(ids).toContain('baron-nucingen');
		expect(ids).toContain('comte-restaud');
		expect(ids).toContain('m-taillefer');
		expect(ids).toContain('poiret');
		expect(ids).toContain('michonneau');
	});

	test('toutes les relations référencent des personnages existants aux deux extrémités', () => {
		const characterIds = new Set(goriotCharacters.map((c) => c.id));
		goriotRelationships.forEach((r) => {
			expect(characterIds.has(r.source), `Source inconnue : ${r.source}`).toBe(true);
			expect(characterIds.has(r.target), `Cible inconnue : ${r.target}`).toBe(true);
			expect(r.source).not.toBe(r.target); // pas d'auto-relation
		});
	});

	test('tous les identifiants de relations sont uniques', () => {
		const relIds = goriotRelationships.map((r) => r.id);
		const uniqueRelIds = new Set(relIds);
		expect(relIds.length).toBe(uniqueRelIds.size);
	});

	test('chaque relation appartient à une catégorie valide de goriotRelCategories', () => {
		const validCategories = Object.keys(goriotRelCategories) as GoriotRelationshipCategory[];
		expect(validCategories).toEqual([
			'family',
			'love',
			'financial',
			'influence',
			'solidarity',
			'conflict',
			'domestic',
		]);

		goriotRelationships.forEach((r) => {
			expect(validCategories).toContain(r.category);
		});
	});

	test('chaque catégorie possède au moins une relation concrète', () => {
		const validCategories = Object.keys(goriotRelCategories) as GoriotRelationshipCategory[];
		validCategories.forEach((cat) => {
			const relsInCat = goriotRelationships.filter((r) => r.category === cat);
			expect(relsInCat.length, `Catégorie sans relation : ${cat}`).toBeGreaterThanOrEqual(2);
		});
	});

	test('chaque relation possède une description, un résumé court et un contexte narratif', () => {
		goriotRelationships.forEach((r) => {
			expect(r.shortSummary.trim().length).toBeGreaterThan(10);
			expect(r.description.trim().length).toBeGreaterThan(25);
			expect(r.narrativeContext.trim().length).toBeGreaterThan(10);
			expect(['certitude_historique', 'deduction_solide', 'interpretation_critique']).toContain(r.certainty);
		});
	});

	test('les citations de personnages et relations sont vérifiées et non vides', () => {
		const charactersWithQuotes = goriotCharacters.filter((c) => c.quote);
		expect(charactersWithQuotes.length).toBeGreaterThanOrEqual(4);
		charactersWithQuotes.forEach((c) => {
			expect(c.quote!.text.length).toBeGreaterThan(5);
			expect(c.quote!.reference.length).toBeGreaterThan(5);
		});

		const relsWithQuotes = goriotRelationships.filter((r) => r.textualQuote);
		expect(relsWithQuotes.length).toBeGreaterThanOrEqual(5);
		relsWithQuotes.forEach((r) => {
			expect(r.textualQuote!.text.length).toBeGreaterThan(10);
			expect(r.textualQuote!.reference.length).toBeGreaterThan(5);
		});
	});

	test('les 4 étapes narratives sont ordonnées de la 1 à la 4', () => {
		expect(goriotNarrativeStages.length).toBe(4);
		expect(goriotNarrativeStages.map((s) => s.num)).toEqual([1, 2, 3, 4]);

		const stageIds = goriotNarrativeStages.map((s) => s.id) as NarrativeStage[];
		goriotRelationships.forEach((r) => {
			expect(stageIds).toContain(r.firstEstablishedStage);
		});
	});

	test('les parcours guidés référencent des personnages et relations existants', () => {
		const characterIds = new Set(goriotCharacters.map((c) => c.id));
		const relIds = new Set(goriotRelationships.map((r) => r.id));

		expect(goriotGuidedTracks.length).toBe(4);
		goriotGuidedTracks.forEach((track) => {
			expect(track.focusNodeIds.length).toBeGreaterThanOrEqual(4);
			track.focusNodeIds.forEach((nid) => {
				// Note: attention à vauquer vs mme-vauquer
				expect(characterIds.has(nid), `Nœud inconnu dans le parcours ${track.id} : ${nid}`).toBe(true);
			});
			track.highlightRelIds.forEach((rid) => {
				expect(relIds.has(rid), `Relation inconnue dans le parcours ${track.id} : ${rid}`).toBe(true);
			});
		});
	});

	test('chaque personnage est connecté au réseau par au moins une relation', () => {
		const connected = new Set<string>();
		goriotRelationships.forEach((r) => {
			connected.add(r.source);
			connected.add(r.target);
		});
		goriotCharacters.forEach((c) => {
			expect(connected.has(c.id), `Personnage orphelin : ${c.id}`).toBe(true);
		});
	});
});
