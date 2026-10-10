import { describe, expect, test } from 'vitest';
import {
	creationContext,
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

	test('contient exactement les 6 thèmes principaux requis avec questions didactiques et notes historiques', () => {
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

			// Note contextuelle historique sur chaque thème
			expect(t.historicalContext).toBeDefined();
			expect(t.historicalContext.title).toBeTruthy();
			expect(t.historicalContext.title).toContain('contexte historique');
			expect(t.historicalContext.text).toBeTruthy();

			// Volume textuel concis adapté à un lycéen (environ 50 à 90 mots)
			const words = t.historicalContext.text.trim().split(/\s+/).length;
			expect(words).toBeGreaterThanOrEqual(50);
			expect(words).toBeLessThanOrEqual(95);

			// Distinct de l'analyse littéraire principale et du résumé
			expect(t.historicalContext.text).not.toBe(t.analysis);
			expect(t.historicalContext.text).not.toBe(t.summary);
		});
	});

	test('chaque note historique thématise les enjeux historiques du XVIIe siècle requis', () => {
		// Thème 1 : mariage, honneur et réputation féminine
		const t1 = mainThemes.find((t) => t.id === 'seduction-inconstance')!;
		expect(t1.historicalContext.text).toContain('mariage');
		expect(t1.historicalContext.text).toContain('honneur');
		expect(t1.historicalContext.text).toContain('réputation');
		expect(t1.historicalContext.text).toContain('couvent');

		// Thème 2 : religion catholique, Louis XIV et controverse de Tartuffe
		const t2 = mainThemes.find((t) => t.id === 'hypocrisie-religieuse')!;
		expect(t2.historicalContext.text).toContain('Louis XIV');
		expect(t2.historicalContext.text).toContain('Tartuffe');
		expect(t2.historicalContext.text).toContain('catholique');
		expect(t2.historicalContext.text).toContain('foi chrétienne sincère');

		// Thème 3 : châtiment divin, statue du Commandeur et gages de Sganarelle
		const t3 = mainThemes.find((t) => t.id === 'religion-chatiment-divin')!;
		expect(t3.historicalContext.text).toContain('Commandeur');
		expect(t3.historicalContext.text).toContain('surnaturel');
		expect(t3.historicalContext.text).toContain('gages');

		// Thème 4 : maître et valet, liberté de parole et contradictions
		const t4 = mainThemes.find((t) => t.id === 'maitre-valet')!;
		expect(t4.historicalContext.text).toContain('valet');
		expect(t4.historicalContext.text).toContain('Sganarelle');
		expect(t4.historicalContext.text).toContain('peurs superstitieuses');

		// Thème 5 : société divisée en ordres, grand seigneur et vertu nobiliaire
		const t5 = mainThemes.find((t) => t.id === 'critique-noblesse')!;
		expect(t5.historicalContext.text).toContain('ordres');
		expect(t5.historicalContext.text).toContain('Dom Louis');
		expect(t5.historicalContext.text).toContain('noblesse');

		// Thème 6 : libertins d'esprit, limites sous monarchie et distinction avec droits modernes
		const t6 = mainThemes.find((t) => t.id === 'liberte-transgression')!;
		expect(t6.historicalContext.text).toContain('libertins');
		expect(t6.historicalContext.text).toContain('droits individuels');
	});

	test('les libellés des notes contextuelles de thème sont tous uniques', () => {
		const titles = mainThemes.map((t) => t.historicalContext.title);
		const uniqueTitles = new Set(titles);
		expect(uniqueTitles.size).toBe(mainThemes.length);
	});

	test('la note contextuelle générale sur la création en 1665 est complète et exacte', () => {
		expect(creationContext).toBeDefined();
		expect(creationContext.title).toBe('Pourquoi Molière écrit-il cette pièce en 1665 ?');
		expect(creationContext.text).toContain('février 1665');
		expect(creationContext.text).toContain('Tartuffe');
		expect(creationContext.text).toContain('liberté');
		expect(creationContext.text).toContain('discutées');

		const words = creationContext.text.trim().split(/\s+/).length;
		expect(words).toBeGreaterThanOrEqual(50);
		expect(words).toBeLessThanOrEqual(90);
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
