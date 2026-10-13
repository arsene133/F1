import { describe, expect, test } from 'vitest';
import {
	crossLinkIndex,
	graffignyCharacters,
	graffignyEdgeTypes,
	graffignyRelationships,
	graffignyThemes,
	letter1752,
	letterRef,
	narrativeSteps,
	quotes,
	roman,
} from './graffigny';

const characterIds = new Set(graffignyCharacters.map((c) => c.id));
const relationshipIds = new Set(graffignyRelationships.map((r) => r.id!));
const stepIds = new Set(narrativeSteps.map((s) => s.id));
const themeIds = new Set(graffignyThemes.map((t) => t.id));
const rel = (id: string) => graffignyRelationships.find((r) => r.id === id)!;
const targets = (id: string) => [rel(id).target].flat();

describe('Lettres d’une Péruvienne — modèle de données (src/data/graffigny.ts)', () => {
	test('les personnages principaux et secondaires attestés par le texte sont présents', () => {
		expect([...characterIds]).toEqual(
			expect.arrayContaining(['zilia', 'aza', 'deterville', 'celine', 'mere', 'china', 'religieux', 'maitre', 'espagnols']),
		);
		// Le texte dit « Madame Déterville », jamais « Madame de Déterville ».
		expect(graffignyCharacters.find((c) => c.id === 'mere')!.label).toBe('Madame Déterville');
		expect(characterIds.size).toBe(graffignyCharacters.length);
	});

	test('chaque relation relie des personnages existants, avec un type légendé et un identifiant unique', () => {
		expect(relationshipIds.size).toBe(graffignyRelationships.length);
		for (const r of graffignyRelationships) {
			expect(characterIds.has(r.source), r.id).toBe(true);
			for (const t of [r.target].flat()) expect(characterIds.has(t), r.id).toBe(true);
			expect(graffignyEdgeTypes[r.type]?.legend, r.id).toBeTruthy();
			expect(r.description.length, r.id).toBeGreaterThan(60);
		}
	});

	test('les sept types de liens demandés sont représentés', () => {
		const used = new Set(graffignyRelationships.map((r) => r.type));
		expect([...used].sort()).toEqual(['amitie', 'amour', 'conflit', 'epistolaire', 'parente', 'protection', 'savoir']);
	});

	test('les types se distinguent aussi par le trait, pas seulement par la couleur', () => {
		const dashes = Object.values(graffignyEdgeTypes).map((t) => t.dash ?? 'none');
		expect(new Set(dashes).size).toBe(dashes.length);
	});

	test('l’amour de Déterville pour Zilia est orienté et non réciproque', () => {
		const love = rel('deterville-zilia-amour');
		expect(love.source).toBe('deterville');
		expect(targets('deterville-zilia-amour')).toEqual(['zilia']);
		expect(graffignyEdgeTypes.amour.arrow).toBe('end');
		expect(love.direction).toBeUndefined();
		// Aucune relation d'amour de Zilia vers Déterville.
		expect(
			graffignyRelationships.some((r) => r.type === 'amour' && r.source === 'zilia' && targets(r.id!).includes('deterville')),
		).toBe(false);
	});

	test('la trahison d’Aza et le changement de destinataire des lettres sont représentés', () => {
		expect(rel('aza-zilia-trahison').type).toBe('conflit');
		expect(rel('zilia-aza-lettres').type).toBe('epistolaire');
		expect(rel('zilia-deterville-lettres').type).toBe('epistolaire');
		expect(rel('zilia-deterville-lettres').description).toContain('Au Chevalier Déterville');
	});

	test('sept étapes ordonnées, chacune avec résumé, personnages, thèmes et lettres', () => {
		expect(narrativeSteps.map((s) => s.number)).toEqual([1, 2, 3, 4, 5, 6, 7]);
		for (const s of narrativeSteps) {
			expect(s.summary.length, s.id).toBeGreaterThan(120);
			expect(s.letters, s.id).toMatch(/[IVXL]/);
			expect(s.characters.length, s.id).toBeGreaterThan(0);
			expect(s.themes.length, s.id).toBeGreaterThan(0);
			s.characters.forEach((c) => expect(characterIds.has(c), `${s.id} → ${c}`).toBe(true));
			s.relationships.forEach((r) => expect(relationshipIds.has(r), `${s.id} → ${r}`).toBe(true));
			s.themes.forEach((t) => expect(themeIds.has(t), `${s.id} → ${t}`).toBe(true));
			// Les personnages d'une relation mise en évidence font partie de l'étape.
			for (const r of s.relationships) {
				for (const end of [rel(r).source, ...targets(r)]) expect(s.characters, `${s.id} / ${r}`).toContain(end);
			}
		}
	});

	test('sept thèmes, chacun relié à des personnages, des relations, des étapes, avec exemples et questions', () => {
		expect(graffignyThemes.map((t) => t.id)).toEqual(['regard', 'critique', 'femmes', 'langue', 'cultures', 'amour', 'lumieres']);
		for (const t of graffignyThemes) {
			expect(t.characters.length, t.id).toBeGreaterThan(0);
			expect(t.steps.length, t.id).toBeGreaterThan(0);
			expect(t.examples.length, t.id).toBeGreaterThanOrEqual(2);
			expect(t.studentQuestions.length, t.id).toBeGreaterThanOrEqual(1);
			expect(t.studentQuestions.length, t.id).toBeLessThanOrEqual(2);
			t.characters.forEach((c) => expect(characterIds.has(c), `${t.id} → ${c}`).toBe(true));
			t.relationships.forEach((r) => expect(relationshipIds.has(r), `${t.id} → ${r}`).toBe(true));
			for (const r of t.relationships) {
				for (const end of [rel(r).source, ...targets(r)]) expect(t.characters, `${t.id} / ${r}`).toContain(end);
			}
		}
	});

	test('les liens étape ↔ thème sont symétriques', () => {
		for (const t of graffignyThemes) {
			for (const s of narrativeSteps) {
				expect(t.steps.includes(s.id), `${t.id} / ${s.id}`).toBe(s.themes.includes(t.id));
			}
		}
	});

	test('Zilia est reliée à toutes les étapes et à tous les thèmes', () => {
		expect(crossLinkIndex.nodes.zilia.steps).toEqual([...stepIds]);
		expect(crossLinkIndex.nodes.zilia.themes.sort()).toEqual([...themeIds].sort());
	});

	test('l’index des correspondances couvre chaque élément de chaque vue', () => {
		expect(Object.keys(crossLinkIndex.nodes).sort()).toEqual([...characterIds].sort());
		expect(Object.keys(crossLinkIndex.edges).sort()).toEqual([...relationshipIds].sort());
		expect(Object.keys(crossLinkIndex.steps)).toEqual([...stepIds]);
		expect(Object.keys(crossLinkIndex.themes)).toEqual([...themeIds]);
		// Chaque personnage a des renvois vers les autres vues dans sa fiche.
		for (const c of graffignyCharacters) {
			expect(c.links?.length, c.id).toBeGreaterThan(0);
			for (const l of c.links!) expect(l.href).toMatch(/^#(etape|theme)-/);
		}
	});

	test('numérotation des lettres : 1747 et décalage de l’édition de 1752', () => {
		expect(roman(18)).toBe('XVIII');
		expect(roman(38)).toBe('XXXVIII');
		expect(roman(41)).toBe('XLI');
		expect(letter1752(27)).toEqual([27]);
		expect(letter1752(28)).toEqual([28, 30]);
		expect(letter1752(29)).toEqual([31]);
		expect(letter1752(32)).toEqual([35]);
		expect(letter1752(38)).toEqual([41]);
		expect(letterRef(18)).toBe('lettre XVIII');
		expect(letterRef(35)).toBe('lettre XXXV (1752 : XXXVIII)');
	});

	test('citations : orthographe de 1747 conservée et lettres valides', () => {
		for (const [key, quote] of Object.entries(quotes)) {
			expect(quote.letter, key).toBeGreaterThanOrEqual(0);
			expect(quote.letter, key).toBeLessThanOrEqual(38);
			// Aucun appel de note de l'édition dans le texte cité.
			expect(quote.text, key).not.toMatch(/\[\d+\]/);
		}
		expect(quotes.nouvelUnivers.letter).toBe(18);
		expect(quotes.nouvelUnivers.text).toContain('un nouvel univers s’est offert à mes yeux');
		expect(quotes.infidele.text).toContain('Aza est infidéle.');
		expect(quotes.plaisirEtre.letter).toBe(38);
	});
});
