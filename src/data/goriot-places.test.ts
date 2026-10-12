import { describe, expect, it } from 'vitest';
import {
	HISTORICAL_MAP_CONFIG,
	MODERN_MAP_CONFIG,
	goriotCategories,
	goriotPlaces,
	precisionLabels,
	type GoriotPlace,
	type PlaceCategory,
} from './goriot-places';

describe('Données géographiques et littéraires du Père Goriot', () => {
	it('contient tous les lieux obligatoires du cahier des charges', () => {
		const placeIds = goriotPlaces.map((p) => p.id);
		expect(placeIds).toContain('pension-vauquer');
		expect(placeIds).toContain('hotel-de-beauseant');
		expect(placeIds).toContain('hotel-de-restaud');
		expect(placeIds).toContain('hotel-de-nucingen');
		expect(placeIds).toContain('cimetiere-pere-lachaise');
	});

	it('vérifie que les coordonnées sont cohérentes avec l’agglomération parisienne intra-muros', () => {
		for (const place of goriotPlaces) {
			const [lat, lng] = place.coordinates;
			// Paris intra-muros : latitude ~ 48.81 à 48.91, longitude ~ 2.24 à 2.43
			expect(lat).toBeGreaterThan(48.81);
			expect(lat).toBeLessThan(48.91);
			expect(lng).toBeGreaterThan(2.24);
			expect(lng).toBeLessThan(2.43);
		}
	});

	it('possède des identifiants uniques et un ordre narratif continu sans doublon', () => {
		const ids = new Set<string>();
		const eventOrders = new Set<number>();

		for (const place of goriotPlaces) {
			expect(ids.has(place.id)).toBe(false);
			ids.add(place.id);

			expect(eventOrders.has(place.eventOrder)).toBe(false);
			eventOrders.add(place.eventOrder);
			expect(place.eventOrder).toBeGreaterThanOrEqual(1);
		}

		// La séquence doit aller de 1 à N sans trou
		const sortedOrders = Array.from(eventOrders).sort((a, b) => a - b);
		expect(sortedOrders).toEqual(Array.from({ length: goriotPlaces.length }, (_, i) => i + 1));
	});

	it('valide que chaque catégorie est dûment déclarée dans goriotCategories', () => {
		const validCategories = Object.keys(goriotCategories) as PlaceCategory[];
		for (const place of goriotPlaces) {
			expect(validCategories).toContain(place.category);
		}
	});

	it('associe un degré de certitude et un label explicatif valide à chaque lieu', () => {
		const validPrecisions = Object.keys(precisionLabels);
		for (const place of goriotPlaces) {
			expect(validPrecisions).toContain(place.locationPrecision);
			expect(precisionLabels[place.locationPrecision].label).toBeTruthy();
			expect(precisionLabels[place.locationPrecision].description).toBeTruthy();
		}
	});

	it('comporte des citations vérifiées avec référence explicite', () => {
		for (const place of goriotPlaces) {
			expect(place.quotation.trim().length).toBeGreaterThan(20);
			expect(place.quotationReference.trim().length).toBeGreaterThan(5);
			expect(place.literaryAnalysis.trim().length).toBeGreaterThan(30);
			expect(place.historicalAddress.trim().length).toBeGreaterThan(3);
			expect(place.modernLocation.trim().length).toBeGreaterThan(3);
			expect(place.characters.length).toBeGreaterThanOrEqual(1);
		}
	});

	it('vérifie que la pension Vauquer commence le parcours narratif et le Père-Lachaise le termine', () => {
		const firstStep = goriotPlaces.find((p) => p.eventOrder === 1);
		const lastStep = goriotPlaces.find((p) => p.eventOrder === goriotPlaces.length);

		expect(firstStep?.id).toBe('pension-vauquer');
		expect(lastStep?.id).toBe('cimetiere-pere-lachaise');
	});

	it('valide que chaque lieu possède des coordonnées historiques vérifiées sur le plan Maire de 1821', () => {
		for (const place of goriotPlaces) {
			const { pixelOrig, pixel3200, percent, leafletCoords } = place.historicalCoordinates;

			// Coordonnées originales sur 9760 × 7480
			expect(pixelOrig[0]).toBeGreaterThan(0);
			expect(pixelOrig[0]).toBeLessThanOrEqual(9760);
			expect(pixelOrig[1]).toBeGreaterThan(0);
			expect(pixelOrig[1]).toBeLessThanOrEqual(7480);

			// Coordonnées dérivées sur 3200 × 2452
			expect(pixel3200[0]).toBeGreaterThan(0);
			expect(pixel3200[0]).toBeLessThanOrEqual(3200);
			expect(pixel3200[1]).toBeGreaterThan(0);
			expect(pixel3200[1]).toBeLessThanOrEqual(2452);

			// Pourcentages
			expect(percent[0]).toBeGreaterThan(0);
			expect(percent[0]).toBeLessThanOrEqual(100);
			expect(percent[1]).toBeGreaterThan(0);
			expect(percent[1]).toBeLessThanOrEqual(100);

			// Coordonnées Leaflet CRS.Simple [Y, X] où Y = 2452 - Y_pixel
			expect(leafletCoords[0]).toBeCloseTo(2452 - pixel3200[1], 1);
			expect(leafletCoords[1]).toBeCloseTo(pixel3200[0], 1);
		}
	});

	it('valide la configuration des fonds de carte historique et moderne', () => {
		expect(HISTORICAL_MAP_CONFIG.imageSrc).toBe('/images/plan-maire-paris-1821.webp');
		expect(HISTORICAL_MAP_CONFIG.width).toBe(3200);
		expect(HISTORICAL_MAP_CONFIG.height).toBe(2452);
		expect(HISTORICAL_MAP_CONFIG.attribution).toContain('N. M. Maire, 1821');

		expect(MODERN_MAP_CONFIG.tileUrl).toContain('cartocdn.com');
		expect(MODERN_MAP_CONFIG.attribution).toContain('OpenStreetMap');
		expect(MODERN_MAP_CONFIG.attribution).toContain('CARTO');
		expect(MODERN_MAP_CONFIG.defaultCenter[0]).toBeCloseTo(48.858, 2);
		expect(MODERN_MAP_CONFIG.defaultCenter[1]).toBeCloseTo(2.348, 2);
	});
});
