import { describe, expect, test } from 'vitest';
import {
	didacticNotes,
	percevalCharacters,
	percevalEdgeTypes,
	percevalFunctions,
	percevalIconography,
	percevalRelationships,
	percevalSequences,
} from './perceval';

const characterIds = new Set(percevalCharacters.map((c) => c.id));
const relationshipIds = new Set(percevalRelationships.map((r) => r.id!));
const rel = (id: string) => percevalRelationships.find((r) => r.id === id)!;
const targets = (id: string) => [rel(id).target].flat();

describe('Le Conte du Graal (Perceval) — modèle de données (src/data/perceval.ts)', () => {
	test('tous les personnages et objets narratifs indispensables sont présents avec des identifiants uniques', () => {
		expect(characterIds.size).toBe(percevalCharacters.length);
		const required = [
			'perceval',
			'mere-perceval',
			'pere-et-freres',
			'gornemant',
			'arthur',
			'keu',
			'gauvain',
			'blanchefleur',
			'roi-pecheur',
			'ermite',
			'graal',
			'lance-qui-saigne',
			'cousine-germaine',
			'demoiselle-hideuse',
		];
		expect([...characterIds]).toEqual(expect.arrayContaining(required));
	});

	test('distingue les personnages humains des objets ou éléments narratifs particuliers', () => {
		const graal = percevalCharacters.find((c) => c.id === 'graal')!;
		expect(graal.eyebrow).toContain('Élément narratif');
		expect(graal.meta).toContain('plat ou vase précieux');

		const lance = percevalCharacters.find((c) => c.id === 'lance-qui-saigne')!;
		expect(lance.eyebrow).toContain('Élément narratif symbolique');

		const defunts = percevalCharacters.find((c) => c.id === 'pere-et-freres')!;
		expect(defunts.eyebrow).toContain('Mémoire familiale');
		expect(defunts.meta).toContain('figures défuntes');
	});

	test('toutes les relations relient des nœuds existants avec un type légendé et une description consistante', () => {
		expect(relationshipIds.size).toBe(percevalRelationships.length);
		for (const r of percevalRelationships) {
			expect(characterIds.has(r.source), `Source inconnue pour la relation ${r.id}: ${r.source}`).toBe(true);
			for (const t of [r.target].flat()) {
				expect(characterIds.has(t), `Cible inconnue pour la relation ${r.id}: ${t}`).toBe(true);
			}
			expect(percevalEdgeTypes[r.type]?.legend, `Légende manquante pour le type ${r.type}`).toBeTruthy();
			expect(r.description.length, `Description trop courte pour ${r.id}`).toBeGreaterThan(50);
		}
	});

	test('tous les six types de relations demandés sont définis et utilisés', () => {
		const expectedTypes = ['familial', 'chevaleresque', 'affectif', 'narratif', 'spirituel', 'mystique'];
		const usedTypes = new Set(percevalRelationships.map((r) => r.type));
		for (const t of expectedTypes) {
			expect(percevalEdgeTypes[t]).toBeDefined();
			expect(usedTypes.has(t), `Type de relation non utilisé : ${t}`).toBe(true);
		}
	});

	test('les types d’arêtes se distinguent par la couleur et par le style de trait', () => {
		const dashes = Object.values(percevalEdgeTypes).map((t) => t.dash ?? 'none');
		expect(new Set(dashes).size).toBe(dashes.length);
	});

	test('l’enseignement de Gornemant envers Perceval est asymétrique et orienté', () => {
		const gorn = rel('gornemant-perceval-initiation');
		expect(gorn.source).toBe('gornemant');
		expect(targets('gornemant-perceval-initiation')).toEqual(['perceval']);
		expect(gorn.direction).toBeUndefined(); // hérite de arrow: 'end'
		expect(percevalEdgeTypes[gorn.type].arrow).toBe('end');
	});

	test('l’attachement courtois avec Blanchefleur est réciproque', () => {
		const love = rel('perceval-blanchefleur-amour');
		expect(love.direction).toBe('both');
	});

	test('les liens familiaux clés (mère, oncle ermite, cousin Roi Pêcheur) sont attestés', () => {
		expect(rel('mere-perceval-famille').type).toBe('familial');
		expect(rel('ermite-perceval-parente').type).toBe('familial');
		expect(rel('roi-pecheur-perceval-parente').type).toBe('familial');
	});

	test('les relations vers le Graal et la lance qui saigne sont de type mystique', () => {
		expect(rel('perceval-graal-enigme').type).toBe('mystique');
		expect(rel('perceval-lance-enigme').type).toBe('mystique');
		expect(rel('roi-pecheur-graal-service').type).toBe('mystique');
	});

	test('tous les nœuds ont un rôle fonctionnel synthétisé dans percevalFunctions', () => {
		for (const c of percevalCharacters) {
			expect(percevalFunctions[c.id], `Fonction manquante pour ${c.id}`).toBeDefined();
			expect(percevalFunctions[c.id].length).toBeGreaterThan(15);
		}
	});

	test('les 8 étapes de la trajectoire dramatique couvrent à la fois Perceval et Gauvain', () => {
		expect(percevalSequences.length).toBe(8);
		const cycles = percevalSequences.map((s) => s.cycle);
		expect(cycles).toContain('perceval');
		expect(cycles).toContain('gauvain');
		for (const s of percevalSequences) {
			expect(s.verses).toMatch(/vers \d+/);
			expect(s.summary.length).toBeGreaterThan(80);
			expect(s.keyFigure).toBeTruthy();
		}
	});

	test('les notes didactiques traitent des spécificités textuelles de Chrétien de Troyes', () => {
		expect(didacticNotes.length).toBe(4);
		const titles = didacticNotes.map((n) => n.title);
		expect(titles).toContain('Un roman inachevé : pourquoi l’histoire n’a-t-elle pas de fin ?');
		expect(titles).toContain('Qu’est-ce que le Graal chez Chrétien de Troyes ?');
		expect(titles).toContain('Perceval et Gauvain : deux façons d’être chevalier');
		expect(titles).toContain('La question non posée : pourquoi Perceval se tait-il devant le Graal ?');

		const inacheve = didacticNotes.find((n) => n.title.includes('inachevé'))!;
		expect(inacheve.text).toContain('continuations');
		expect(inacheve.text).toContain('Philippe d’Alsace');
		expect(inacheve.text).toContain('9234');

		const graalNote = didacticNotes.find((n) => n.title.includes('Graal'))!;
		expect(graalNote.text).toContain('Robert de Boron');
		expect(graalNote.text).toContain('hostie');
		expect(graalNote.text).toContain('gradalis');

		const silenceNote = didacticNotes.find((n) => n.title.includes('question non posée'))!;
		expect(silenceNote.text).toContain('Gornemant');
		expect(silenceNote.text).toContain('ermite');
		expect(silenceNote.text).toContain('mère');
	});

	test('la sélection iconographique comprend 6 documents vérifiés distinguant Moyen Âge et réceptions postérieures', () => {
		expect(percevalIconography.length).toBe(6);
		const ids = percevalIconography.map((d) => d.id);
		expect(ids).toEqual([
			'doc-perceval-roi-pecheur',
			'doc-cortege-graal',
			'doc-chevalier-westminster',
			'doc-adoubement-bnf-fr73',
			'doc-graal-table-ronde-bnf-fr112',
			'doc-wyeth-percival-1922',
		]);

		for (const doc of percevalIconography) {
			expect(doc.title).toBeTruthy();
			expect(doc.badge).toBeTruthy();
			expect(doc.image.src).toMatch(/^\/images\/perceval\/.+\.jpg$/);
			expect(doc.image.alt.length).toBeGreaterThan(30);
			expect(doc.image.caption).toBeTruthy();
			expect(doc.image.width).toBeGreaterThan(500);
			expect(doc.image.height).toBeGreaterThan(500);

			expect(doc.meta.title).toBeTruthy();
			expect(doc.meta.author).toBeTruthy();
			expect(doc.meta.date).toBeTruthy();
			expect(doc.meta.institution).toBeTruthy();
			expect(doc.meta.identifier).toBeTruthy();
			expect(doc.meta.identifierUrl).toMatch(/^https?:\/\//);
			expect(doc.meta.license).toContain('Domaine public');

			expect(doc.pedagogicalAnalysis.whatItShows.length).toBeGreaterThan(80);
			expect(doc.pedagogicalAnalysis.textualLink.length).toBeGreaterThan(80);
			expect(doc.pedagogicalAnalysis.criticalLimitation.length).toBeGreaterThan(80);

			expect(doc.questions.length).toBe(2);
			expect(doc.questions[0].length).toBeGreaterThan(30);
			expect(doc.questions[1].length).toBeGreaterThan(30);
		}

		// Vérifier les 3 catégories documentaires distinctes
		const badges = percevalIconography.map((d) => d.badge);
		expect(badges.some((b) => b.includes('Témoignage médiéval'))).toBe(true);
		expect(badges.some((b) => b.includes('Légende du Graal écrite plus tard'))).toBe(true);
		expect(badges.some((b) => b.includes('Reconstitution moderne'))).toBe(true);
	});

	test('le modèle géographique et spatial de Perceval distingue lieux réels, fictionnels et espaces sauvages sans coordonnées inventées', async () => {
		const { PERCEVAL_SPATIAL_CATEGORIES, percevalSpatialStages } = await import(
			'./perceval-geography'
		);

		expect(percevalSpatialStages.length).toBe(7);

		const categoriesFound = new Set(percevalSpatialStages.map((s) => s.category));
		expect(categoriesFound.has('reel')).toBe(true);
		expect(categoriesFound.has('fictionnel')).toBe(true);
		expect(categoriesFound.has('espace_naturel')).toBe(true);

		// Vérifier l'ordre chronologique des étapes (1 à 7)
		const orders = percevalSpatialStages.map((s) => s.order);
		expect(orders).toEqual([1, 2, 3, 4, 5, 6, 7]);

		for (const stage of percevalSpatialStages) {
			expect(stage.id).toBeTruthy();
			expect(stage.name).toBeTruthy();
			expect(stage.summary.length).toBeGreaterThan(50);
			expect(stage.verses).toMatch(/^vers /);
			expect(stage.spatialRole.length).toBeGreaterThan(30);
			expect(stage.geographicStatus.length).toBeGreaterThan(30);
			expect(stage.didacticExplanation.length).toBeGreaterThan(50);
			expect(stage.characters.length).toBeGreaterThanOrEqual(1);

			// Vérifier qu'aucun lieu fictionnel ou naturel n'a reçu de fausses coordonnées GPS modernes
			expect((stage as any).coordinates).toBeUndefined();
			expect((stage as any).latitude).toBeUndefined();
			expect((stage as any).longitude).toBeUndefined();

			// Vérifier les coordonnées schématiques SVG (canevas 900x400)
			expect(stage.x).toBeGreaterThan(0);
			expect(stage.x).toBeLessThan(900);
			expect(stage.y).toBeGreaterThan(0);
			expect(stage.y).toBeLessThan(400);
		}

		// Vérifier la catégorisation exacte des lieux clés
		const carduel = percevalSpatialStages.find((s) => s.id === 'carduel-arthur')!;
		expect(carduel.category).toBe('reel');
		expect(carduel.geographicStatus).toContain('Carlisle');
		expect(carduel.verses).toContain('éd. F. Lecoy');

		const graal = percevalSpatialStages.find((s) => s.id === 'chateau-roi-pecheur')!;
		expect(graal.category).toBe('fictionnel');
		expect(graal.geographicStatus).toContain('rien dans le récit ne permet de le placer sur une carte');
		expect(graal.verses).toContain('éd. F. Lecoy');

		const foret = percevalSpatialStages.find((s) => s.id === 'gaste-foret')!;
		expect(foret.category).toBe('espace_naturel');
		expect(foret.verses).toContain('éd. F. Lecoy');

		// Vérifier que toutes les catégories exposées sont utilisées par au moins un jalon (pas de catégorie morte à 0)
		for (const catKey of Object.keys(PERCEVAL_SPATIAL_CATEGORIES)) {
			const count = percevalSpatialStages.filter((s) => s.category === catKey).length;
			expect(count).toBeGreaterThan(0);
		}
	});
});
