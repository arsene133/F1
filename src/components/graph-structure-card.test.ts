import { readFileSync, existsSync } from 'node:fs';
import { describe, it, expect } from 'vitest';

describe('Audit factuel et éditorial approfondi de la rubrique « Type de graphe »', () => {
	const worksAudit = [
		{
			slug: 'perceval',
			title: 'Le Conte du Graal (Perceval)',
			expectedNature: 'Description de la structure',
			expectedShape: 'Réseau très centré sur un personnage',
			positiveAssertions: [
				'Perceval occupe le centre et se relie directement aux treize autres personnages ou objets',
				'cinq relations secondaires existent aussi entre d’autres éléments',
				'la mère avec le père et les frères',
				'Gornemant avec Blanchefleur',
				'Arthur avec Keu et Gauvain',
			],
			negativeAssertions: [
				// Aucune relation entre Roi Pêcheur et Lance ne doit être affirmée
				'Roi Pêcheur au Graal et à la lance',
				'Roi Pêcheur et la lance',
			],
		},
		{
			slug: 'don-juan',
			title: 'Dom Juan',
			expectedNature: 'Forme mathématique exacte',
			expectedShape: 'Étoile stricte',
			positiveAssertions: [
				'chaque trait part de Dom Juan vers l’une des sept autres figures',
				'sans qu’aucun trait ne relie les autres entre elles',
				'graphe forme mathématiquement une étoile stricte',
				'choix dramaturgique de la pièce',
			],
			negativeAssertions: [
				// Ne doit pas déduire un fait psychologique ou d'alliance absolue
				'sans que ses adversaires ne forment une coalition',
			],
		},
		{
			slug: 'goriot',
			title: 'Le Père Goriot',
			expectedNature: 'Description de la structure',
			expectedShape: 'Réseau à noyau et périphérie',
			positiveAssertions: [
				'Rastignac (sept liens)',
				'père Goriot (six liens)',
				'Delphine et Vautrin',
				'Poiret ou Sylvie restent en périphérie avec un seul lien',
				'passerelles entre le monde modeste de la pension Vauquer et les salons aristocratiques parisiens',
			],
			negativeAssertions: [],
		},
		{
			slug: 'graffigny',
			title: 'Lettres d’une Péruvienne',
			expectedNature: 'Description de la structure',
			expectedShape: 'Réseau centré sur une narratrice avec noyau relationnel',
			positiveAssertions: [
				'Zilia rassemble sept relations directes',
				'Déterville, sa sœur Céline et leur mère',
				'liens familiaux',
				'forme épistolaire',
			],
			negativeAssertions: [],
		},
		{
			slug: 'pot-bouille',
			title: 'Pot-Bouille',
			expectedNature: 'Description de la structure',
			expectedShape: 'Réseau distribué et multipolaire',
			positiveAssertions: [
				'centralité est partagée principalement entre Octave Mouret et Berthe Josserand, qui comptent chacun six liens',
				'familles Josserand et Vabre',
				'Le réseau n’est pas sans centre : il est multipolaire et distribué',
				'immeuble tout entier',
			],
			negativeAssertions: [
				'aucun personnage n’accapare l’ensemble des relations, et la centralisation',
			],
		},
		{
			slug: 'on-ne-badine-pas-avec-l-amour',
			title: 'On ne badine pas avec l’amour',
			expectedNature: 'Description de la structure',
			expectedShape: 'Réseau partagé à plusieurs pôles',
			positiveAssertions: [
				'deux figures principales à quatre liens (Perdican et Camille)',
				'Rosette et le Baron (trois liens chacun)',
				'trio amoureux (Perdican, Camille, Rosette)',
				'figures tutélaires du château',
			],
			negativeAssertions: [
				// Ne doit PAS affirmer que le baron a 4 liens
				'Perdican, Camille et le Baron en comptent chacun 4',
				'Perdican, Camille et le Baron comptent chacun 4',
			],
		},
		{
			slug: 'balzac-rimbaud',
			title: 'Balzac, Marx, Rimbaud',
			expectedNature: 'Forme mathématique exacte',
			expectedShape: 'Cycle fermé',
			positiveAssertions: [
				'cinq figures (Balzac, Rastignac, Rimbaud, la Commune et Marx)',
				'boucle fermée continue',
				'Chacune des cinq figures est reliée à exactement deux voisines',
				'cycle simple (C₅)',
				'sans affirmer une chaîne de causalité historique directe',
			],
			negativeAssertions: [
				'incarne les luttes analysées par Marx, Marx dialogue',
			],
		},
	];

	for (const work of worksAudit) {
		describe(`Vérification factuelle de ${work.title} (/${work.slug})`, () => {
			const htmlPath = `dist/${work.slug}/index.html`;

			it('le fichier de build existe', () => {
				expect(existsSync(htmlPath)).toBe(true);
			});

			it('la note est repliée par défaut et possède le libellé attendu', () => {
				const html = readFileSync(htmlPath, 'utf-8');
				const match = html.match(/<details[^>]*class="[^"]*graph-structure-note[^"]*"[^>]*>/);
				expect(match).not.toBeNull();
				expect(match![0]).not.toContain(' open');
				expect(html).toContain('Comprendre la forme du réseau');
			});

			it(`la catégorie (« ${work.expectedNature} ») et la forme (« ${work.expectedShape} ») sont conformes`, () => {
				const html = readFileSync(htmlPath, 'utf-8');
				expect(html).toContain(work.expectedNature);
				expect(html).toContain(work.expectedShape);
			});

			it('toutes les assertions factuelles positives sont vérifiées mot à mot', () => {
				const html = readFileSync(htmlPath, 'utf-8');
				for (const assertion of work.positiveAssertions) {
					expect(html, `${work.slug} must contain "${assertion}"`).toContain(assertion);
				}
			});

			if (work.negativeAssertions.length > 0) {
				it('aucune affirmation factuelle erronée ou non démontrée n’est présente', () => {
					const html = readFileSync(htmlPath, 'utf-8');
					for (const forbidden of work.negativeAssertions) {
						expect(html).not.toContain(forbidden);
					}
				});
			}

			it('la note ne contient aucun en-tête h1-h6 évitant tout saut de hiérarchie', () => {
				const html = readFileSync(htmlPath, 'utf-8');
				const noteRegex = /<details[^>]*class="[^"]*graph-structure-note[^"]*"[^>]*>([\s\S]*?)<\/details>/;
				const noteMatch = html.match(noteRegex);
				expect(noteMatch).not.toBeNull();
				expect(noteMatch![1]).not.toMatch(/<h[1-6][\s>]/i);
			});
		});
	}
});
