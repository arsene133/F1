import { describe, expect, test } from 'vitest';
import {
	dissertationTakeaway,
	domJuanCharacters,
	domJuanEdgeTypes,
	domJuanFunctions,
	domJuanMechanism,
	domJuanRelationships,
	mainThemes,
	secondaryThemes,
} from './dom-juan';

describe('Modèle de données de Dom Juan (src/data/dom-juan.ts)', () => {
	test('tous les personnages ont des identifiants uniques et non vides', () => {
		const ids = domJuanCharacters.map((c) => c.id);
		const uniqueIds = new Set(ids);
		expect(ids.length).toBe(uniqueIds.size);
		expect(ids.length).toBeGreaterThanOrEqual(8);
		ids.forEach((id) => {
			expect(id.trim()).not.toBe('');
		});
	});

	test('toutes les relations référencent des personnages existants', () => {
		const characterIds = new Set(domJuanCharacters.map((c) => c.id));
		domJuanRelationships.forEach((r) => {
			expect(characterIds.has(r.source), `Source inconnue : ${r.source}`).toBe(true);
			const targets = Array.isArray(r.target) ? r.target : [r.target];
			targets.forEach((targetId) => {
				expect(characterIds.has(targetId), `Cible inconnue : ${targetId}`).toBe(true);
			});
		});
	});

	test('chaque relation utilise un type d’arête défini dans domJuanEdgeTypes', () => {
		const edgeTypeKeys = new Set(Object.keys(domJuanEdgeTypes));
		domJuanRelationships.forEach((r) => {
			expect(edgeTypeKeys.has(r.type), `Type d'arête non défini : ${r.type}`).toBe(true);
			expect(domJuanEdgeTypes[r.type].legend, `Légende manquante pour le type : ${r.type}`).toBeDefined();
		});
	});

	test('tous les personnages ont une fonction définie dans domJuanFunctions', () => {
		domJuanCharacters.forEach((c) => {
			expect(domJuanFunctions[c.id], `Fonction manquante pour ${c.id}`).toBeDefined();
			expect(domJuanFunctions[c.id].length).toBeGreaterThan(5);
		});
	});

	test('contient exactement les 6 thèmes principaux requis avec questions didactiques', () => {
		expect(mainThemes.length).toBe(6);
		const ids = mainThemes.map((t) => t.id);
		expect(ids).toEqual([
			'seduction-inconstance',
			'hypocrisie-religieuse',
			'religion-chatiment-divin',
			'maitre-valet',
			'critique-noblesse',
			'liberte-transgression',
		]);
		mainThemes.forEach((t) => {
			expect(t.title).toBeTruthy();
			expect(t.definitionQuestion).toBe('Qu’est-ce que ce thème ?');
			expect(t.illustrationQuestion).toBe('Comment la pièce l’illustre-t-elle ?');
			expect(t.summary).toBeTruthy();
			expect(t.analysis).toBeTruthy();
			expect(t.quote).toBeDefined();
			expect(t.quote?.text).toBeTruthy();
			expect(t.quote?.speaker).toBeTruthy();
			expect(t.quote?.ref).toBeTruthy();
		});
	});

	test('les citations correspondent à l’acte et à la scène exacts', () => {
		const quotes = mainThemes.map((t) => t.quote!);
		expect(quotes[0].ref).toBe('Acte I, scène 2');
		expect(quotes[0].speaker).toBe('Dom Juan');
		expect(quotes[0].text).toContain('Quoi ! tu veux qu’on se lie');
		expect(quotes[0].text).toContain('comme Alexandre');

		expect(quotes[1].ref).toBe('Acte V, scène 2');
		expect(quotes[1].speaker).toBe('Dom Juan');
		expect(quotes[1].text).toContain('l’hypocrisie est un vice à la mode');

		expect(quotes[2].ref).toBe('Acte V, scène 5');
		expect(quotes[2].speaker).toBe('Dom Juan');
		expect(quotes[2].text).toContain('Non, non, il ne sera pas dit, quoi qu’il arrive, que je sois capable de me repentir.');

		expect(quotes[3].ref).toBe('Acte III, scène 1');
		expect(quotes[3].speaker).toBe('Sganarelle');
		expect(quotes[3].text).toContain('mon petit sens, mon petit jugement');
		expect(quotes[3].text).toContain('champignon');

		expect(quotes[4].ref).toBe('Acte IV, scène 4');
		expect(quotes[4].speaker).toBe('Dom Louis');
		expect(quotes[4].text).toContain('un gentilhomme qui vit mal est un monstre dans la nature');
		expect(quotes[4].text).toContain('la vertu est le premier titre de noblesse');

		expect(quotes[5].ref).toBe('Acte III, scène 2');
		expect(quotes[5].speaker).toBe('Dom Juan');
		expect(quotes[5].text).toContain('pour l’amour de l’humanité');
		expect(quotes[5].text).toContain('La partie est trop inégale');
	});

	test('contient exactement les 5 thèmes secondaires requis', () => {
		expect(secondaryThemes.length).toBe(5);
		const titles = secondaryThemes.map((t) => t.title);
		expect(titles).toContain('Le mensonge et la manipulation');
		expect(titles).toContain('L’honneur et la fidélité');
		expect(titles).toContain('Le comique et la satire sociale');
		expect(titles).toContain('La mort et la justice');
		expect(titles).toContain('La condition féminine');
	});

	test('le mécanisme en 5 étapes est complet et correspond à la trajectoire de la pièce', () => {
		expect(domJuanMechanism.length).toBe(5);
		expect(domJuanMechanism.map((m) => m.step)).toEqual(['Défi', 'Conquêtes', 'Provocation', 'Masque', 'Foudre']);
	});

	test('le takeaway de dissertation est conforme au texte demandé', () => {
		expect(dissertationTakeaway).toContain('Dom Juan met en scène le conflit entre la liberté individuelle et les règles morales.');
		expect(dissertationTakeaway).toContain('La pièce dénonce également l’hypocrisie religieuse, les abus de pouvoir et l’inconstance amoureuse.');
	});
});
