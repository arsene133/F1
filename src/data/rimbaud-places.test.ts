import { describe, expect, it } from 'vitest';
import {
	CAHIERS_DE_DOUAI_POEMS,
	LOCATION_PRECISION_LABELS,
	PLACE_CATEGORY_LABELS,
	RIMBAUD_MAP_CONFIG,
	RIMBAUD_PLACES,
	READING_PATHS,
	type RimbaudPlace,
} from './rimbaud-places';

describe('Philologie et géographie des Cahiers de Douai (/rimbaud)', () => {
	it('contient exactement les 22 poèmes canoniques des deux liasses Demeny', () => {
		expect(CAHIERS_DE_DOUAI_POEMS).toHaveLength(22);

		const firstCahier = CAHIERS_DE_DOUAI_POEMS.filter((p) => p.cahier === 1);
		const secondCahier = CAHIERS_DE_DOUAI_POEMS.filter((p) => p.cahier === 2);

		expect(firstCahier).toHaveLength(15);
		expect(secondCahier).toHaveLength(7);

		const titles = CAHIERS_DE_DOUAI_POEMS.map((p) => p.title);
		expect(titles).toContain('Première soirée');
		expect(titles).toContain('Sensation');
		expect(titles).toContain('Le Forgeron');
		expect(titles).toContain('Soleil et chair');
		expect(titles).toContain('Ophélie');
		expect(titles).toContain('Bal des pendus');
		expect(titles).toContain('Le Châtiment de Tartufe');
		expect(titles).toContain('Vénus anadyomène');
		expect(titles).toContain('Les Reparties de Nina');
		expect(titles).toContain('À la musique');
		expect(titles).toContain('Les Effarés');
		expect(titles).toContain('Roman');
		expect(titles).toContain('« Morts de Quatre-vingt-douze... »');
		expect(titles).toContain('Le Mal');
		expect(titles).toContain('Rages de Césars');
		expect(titles).toContain('Rêvé pour l’hiver');
		expect(titles).toContain('Le Dormeur du val');
		expect(titles).toContain('Au Cabaret-Vert, cinq heures du soir');
		expect(titles).toContain('La Maline');
		expect(titles).toContain('L’Éclatante Victoire de Sarrebrück');
		expect(titles).toContain('Le Buffet');
		expect(titles).toContain('Ma Bohème (Fantaisie)');
	});

	it('distingue rigoureusement les catégories géographiques et poétiques', () => {
		const categories = Object.keys(PLACE_CATEGORY_LABELS);
		expect(categories).toContain('atteste');
		expect(categories).toContain('biographique');
		expect(categories).toContain('interprete');
		expect(categories).toContain('imaginaire');

		for (const place of RIMBAUD_PLACES) {
			expect(categories).toContain(place.category);
			expect(Object.keys(LOCATION_PRECISION_LABELS)).toContain(place.precision);
		}
	});

	it('vérifie que les lieux géolocalisés possèdent des coordonnées valides en Europe du Nord-Est', () => {
		const geoPlaces = RIMBAUD_PLACES.filter((p) => p.category !== 'imaginaire');
		expect(geoPlaces.length).toBeGreaterThanOrEqual(10);

		for (const place of geoPlaces) {
			expect(place.coordinates).toBeDefined();
			if (place.coordinates) {
				const [lat, lng] = place.coordinates;
				// Nord de la France, Belgique, Allemagne : 48.0 < lat < 52.0 et 1.5 < lng < 10.0
				expect(lat).toBeGreaterThan(48.0);
				expect(lat).toBeLessThan(52.0);
				expect(lng).toBeGreaterThan(1.5);
				expect(lng).toBeLessThan(10.0);
			}
		}
	});

	it('vérifie que les espaces imaginaires et symboliques sont explicitement non géolocalisés', () => {
		const imaginairePlaces = RIMBAUD_PLACES.filter((p) => p.category === 'imaginaire');
		expect(imaginairePlaces.length).toBeGreaterThanOrEqual(2);

		for (const place of imaginairePlaces) {
			expect(place.coordinates).toBeNull();
			expect(place.precision).toBe('symbolique');
		}
	});

	it('comporte des citations vérifiées, des analyses et des distinctions fait/interprétation', () => {
		for (const place of RIMBAUD_PLACES) {
			expect(place.id).toBeTruthy();
			expect(place.name).toBeTruthy();
			expect(place.shortDescription.length).toBeGreaterThan(20);
			expect(place.literaryAnalysis.length).toBeGreaterThan(40);
			expect(place.historicalDistinction.length).toBeGreaterThan(30);
			expect(place.quotation.length).toBeGreaterThan(15);
			expect(place.quotationReference).toBeTruthy();
			expect(place.poems.length).toBeGreaterThanOrEqual(1);
		}
	});

	it('propose des parcours de lecture thématiques couvrant le corpus', () => {
		expect(READING_PATHS.length).toBeGreaterThanOrEqual(4);
		const pathIds = READING_PATHS.map((p) => p.id);
		expect(pathIds).toContain('ardennes');
		expect(pathIds).toContain('fugues');
		expect(pathIds).toContain('guerre');
		expect(pathIds).toContain('emancipation');

		for (const path of READING_PATHS) {
			expect(path.placeIds.length).toBeGreaterThanOrEqual(3);
			for (const pid of path.placeIds) {
				const found = RIMBAUD_PLACES.some((p) => p.id === pid);
				expect(found).toBe(true);
			}
		}
	});

	it('configure correctement le centre et les tuiles de la carte', () => {
		expect(RIMBAUD_MAP_CONFIG.defaultCenter[0]).toBeGreaterThan(49.0);
		expect(RIMBAUD_MAP_CONFIG.defaultCenter[0]).toBeLessThan(51.0);
		expect(RIMBAUD_MAP_CONFIG.defaultCenter[1]).toBeGreaterThan(3.5);
		expect(RIMBAUD_MAP_CONFIG.defaultCenter[1]).toBeLessThan(5.0);
		expect(RIMBAUD_MAP_CONFIG.defaultZoom).toBeGreaterThanOrEqual(7);
	});

	it('prévient les régressions philologiques critiques sur les 22 poèmes et leurs mentions', () => {
		const poemIds = new Set(CAHIERS_DE_DOUAI_POEMS.map((p) => p.id));
		expect(poemIds.size).toBe(22); // Strictement 22 poèmes uniques sans doublon
		expect(poemIds.has('les-effares-cahier2')).toBe(false);
		expect(poemIds.has('morts-de-quatre-vingt-douze-cahier2')).toBe(false);

		// Vérifier la présence impérative de « À la musique » et « Les Reparties de Nina »
		expect(poemIds.has('a-la-musique')).toBe(true);
		expect(poemIds.has('les-reparties-de-nina')).toBe(true);

		// Vérifier que chaque lieu ne référence que des poèmes existants dans les 22
		for (const place of RIMBAUD_PLACES) {
			for (const pid of place.poems) {
				expect(poemIds.has(pid)).toBe(true);
			}
		}

		// Vérifier que les citations sensibles ne contiennent pas d'inventions apocryphes
		const dormeur = RIMBAUD_PLACES.find((p) => p.id === 'val-ardennes-dormeur');
		expect(dormeur?.quotation).toContain('trou de verdure');
		expect(dormeur?.epistemologicalStatus).toBe('hypothese_argumentee');

		const mazas = RIMBAUD_PLACES.find((p) => p.id === 'paris-mazas');
		expect(mazas?.quotation).toContain('Mazas');
		expect(mazas?.quotation).not.toContain('Ce n’était pas la fête');
		expect(mazas?.epistemologicalStatus).toBe('source_historique');

		const cabaret = RIMBAUD_PLACES.find((p) => p.id === 'charleroi-cabaret-vert');
		expect(cabaret?.quotation).toContain('Au Cabaret-Vert');
		expect(cabaret?.historicalDistinction).toContain('Maison verte');
		expect(cabaret?.epistemologicalStatus).toBe('atteste_texte');
	});
});
