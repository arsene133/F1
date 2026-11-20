import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

// Citations du dossier iconographique et de « Limites de l'expérience »,
// vérifiées sur le fac-similé imprimé de l'édition Calmann-Lévy de 1910.
const page = readFileSync('src/pages/goriot.astro', 'utf8');

describe('Citations de /goriot hors données : conformité au fac-similé de 1910', () => {
	test('aucune formulation introuvable ou retouchée ne revient', () => {
		const interdits = [
			'Il courut au numéro 9',
			'Il mit la roulette en feu',
			'ses déesses, son sang',
			'Il eût vendu son âme au diable',
			'un puits à roue, avec une margelle',
			'Le pavé gras et glissant',
			'Il dit ces mots grandioses',
			'« n’aura rien à lui refuser »',
			'« la maison de madame Vauquer »',
			'ni une fiction, ni un roman',
		];
		for (const s of interdits) expect(page, s).not.toContain(s);
	});

	test('les passages imprimés sont cités avec leurs mots et leur ponctuation', () => {
		// p. 2-3
		expect(page).toContain('ce drame n\'est ni une fiction ni un roman. All is true, il est si véritable, que chacun');
		// p. 5
		expect(page).toContain('Derrière le bâtiment est une cour large d\'environ vingt pieds');
		// p. 159
		expect(page).toContain('« Le père Goriot était sublime.');
		// p. 173
		expect(page).toContain('court au numéro 9, après s\'être fait indiquer');
		expect(page).toContain('« Elle se compromet avec moi, elle n’aura rien à me refuser. »');
		// p. 342-343
		expect(page).toContain('des deux rives de la Seine, où commençaient à briller les lumières. Ses yeux');
		expect(page).toContain('et dit ces mots grandioses : — À nous deux maintenant !');
		// Partie I (note Swedenborg) : « implique la personne », et non « sa personne »
		expect(page).toContain('« enfin toute sa personne explique la pension, comme la pension implique la personne. »');
		expect(page).not.toContain('comme la pension implique sa personne');
		// Avant-propos de La Comédie humaine, éd. Houssiaux 1855, t. I, p. 18 et 23
		expect(page).toContain('des écrivains mystiques qui se sont occupés des sciences dans leurs relations avec l’infini, tels que Swedenborg, Saint-Martin, etc.');
		expect(page).toContain('les rudiments de la belle loi du soi pour soi sur laquelle repose l’unité de composition.');
		expect(page).toContain('« comparaison entre l’Humanité et l’Animalité »');
		expect(page).toContain('« Espèces Sociales »');
		expect(page).toContain('« si la pensée, ou la passion, qui comprend la pensée et le sentiment, est l’élément social, elle en est aussi l’élément destructeur. »');
	});
});
