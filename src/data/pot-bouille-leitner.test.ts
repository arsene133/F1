import { describe, expect, test } from 'vitest';
import {
	categoryLabels,
	categoryOrder,
	nonQuotationGuillemets,
	potBouilleLeitnerCards as cards,
	potBouilleQuotations,
	type LeitnerCategory,
} from './pot-bouille-leitner';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII'];
const verifiedTexts = Object.values(potBouilleQuotations).map((q) => q.text);
const norm = (s: string) => s.replace(/[\s  ]+/g, ' ').trim();

describe('Contenu de la boîte de Leitner de Pot-Bouille', () => {
	test('une centaine de cartes, réparties selon le plan pédagogique', () => {
		expect(cards.length).toBe(100);
		const count = (c: LeitnerCategory) => cards.filter((card) => card.category === c).length;
		expect({
			oeuvre: count('oeuvre'),
			personnages: count('personnages'),
			themes: count('themes'),
			ecriture: count('ecriture'),
			interpreter: count('interpreter'),
			bac: count('bac'),
		}).toEqual({ oeuvre: 15, personnages: 20, themes: 20, ecriture: 20, interpreter: 15, bac: 10 });
		expect(categoryOrder).toEqual(Object.keys(categoryLabels));
	});

	test('identifiants uniques et stables, questions non redondantes', () => {
		const ids = cards.map((c) => c.id);
		expect(new Set(ids).size).toBe(ids.length);
		ids.forEach((id) => expect(id).toMatch(/^[a-z0-9-]+$/));
		const questions = cards.map((c) => norm(c.question).toLowerCase());
		expect(new Set(questions).size).toBe(questions.length);
	});

	test('chaque carte a une question et une réponse substantielles', () => {
		for (const c of cards) {
			expect(c.question.trim().length, c.id).toBeGreaterThan(15);
			expect(c.answer.trim().length, c.id).toBeGreaterThan(20);
			expect(c.question.trim(), c.id).toMatch(/[?.:]$/);
		}
	});

	test('les trois niveaux sont représentés, et l’interprétation est plus exigeante que les faits', () => {
		for (const level of ['facile', 'intermediaire', 'avance'] as const) {
			expect(cards.some((c) => c.difficulty === level), level).toBe(true);
		}
		expect(cards.filter((c) => c.category === 'interpreter').every((c) => c.difficulty === 'avance')).toBe(true);
		expect(cards.filter((c) => c.category === 'oeuvre').some((c) => c.difficulty === 'avance')).toBe(false);
	});

	test('les références de chapitres sont des chiffres romains entre I et XVIII', () => {
		for (const c of cards) {
			if (!c.reference) continue;
			const numerals = c.reference.match(/\b[IVX]+\b/g) ?? [];
			expect(numerals.length, c.id).toBeGreaterThan(0);
			numerals.forEach((n) => expect(ROMAN, `${c.id} : ${n}`).toContain(n));
		}
		for (const q of Object.values(potBouilleQuotations)) expect(ROMAN).toContain(q.chapter);
	});

	test('les cartes n’utilisent que des citations vérifiées', () => {
		for (const c of cards) {
			if (c.quotation) expect(verifiedTexts, c.id).toContain(c.quotation.text);
		}
	});

	test('tout texte entre guillemets provient d’une citation vérifiée (ou est un titre, un intitulé, un mot étudié)', () => {
		const corpus = verifiedTexts.map(norm);
		const allowed = new Set(nonQuotationGuillemets.map(norm));
		for (const c of cards) {
			const fields = [c.question, c.hint ?? '', c.answer, c.explanation ?? ''];
			for (const field of fields) {
				for (const m of field.matchAll(/«\s*([^»]+?)\s*»/g)) {
					const inner = norm(m[1]);
					const ok = allowed.has(inner) || corpus.some((t) => t.includes(inner));
					expect(ok, `${c.id} : « ${inner} » n’est pas une citation vérifiée`).toBe(true);
				}
			}
		}
	});

	test('le programme de première n’est pas présenté comme une exigence de seconde', () => {
		const parcours = cards.find((c) => c.id === 'bac-parcours')!;
		expect(parcours.question).toContain('première');
		expect(parcours.answer).toContain('Dévoiler les rouages de la société');
		expect(parcours.explanation).toContain('pas la classe de seconde');
	});

	test('l’adresse de l’immeuble ne comporte pas de numéro absent du roman', () => {
		for (const c of cards) expect(JSON.stringify(c), c.id).not.toMatch(/\b28,? rue de Choiseul/);
	});
});
