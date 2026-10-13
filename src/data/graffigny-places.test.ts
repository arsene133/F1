import { describe, expect, test } from 'vitest';
import {
	GRAFFIGNY_MAP_CONFIG,
	GRAFFIGNY_PLACE_CATEGORIES,
	graffignyPlaces,
	type GraffignyDocumentaryStatus,
	type GraffignyLocationPrecision,
	type GraffignyPlaceCategory,
} from './graffigny-places';
import {
	crossLinkIndex,
	graffignyCharacters,
	graffignyRelationships,
	graffignyThemes,
	narrativeSteps,
} from './graffigny';

const characterIds = new Set(graffignyCharacters.map((c) => c.id));
const stepIds = new Set(narrativeSteps.map((s) => s.id));
const themeIds = new Set(graffignyThemes.map((t) => t.id));
const placeIds = new Set(graffignyPlaces.map((p) => p.id));

describe('Lettres d’une Péruvienne — géographie du récit (src/data/graffigny-places.ts)', () => {
	test('tous les lieux ont un identifiant unique et des champs obligatoires complets', () => {
		expect(placeIds.size).toBe(graffignyPlaces.length);
		for (const p of graffignyPlaces) {
			expect(p.id.length, p.id).toBeGreaterThan(2);
			expect(p.name.length, p.id).toBeGreaterThan(3);
			expect(p.subtitle.length, p.id).toBeGreaterThan(5);
			expect(p.pedagogicalSummary.length, p.id).toBeGreaterThan(60);
			expect(p.narrativeRole.length, p.id).toBeGreaterThan(40);
			expect(p.literaryAnalysis.length, p.id).toBeGreaterThan(60);
		}
	});

	test('les catégories et statuts documentaires sont valides et légendés', () => {
		const validCats: GraffignyPlaceCategory[] = ['recit', 'historique', 'trajet', 'incertain'];
		const validPrecisions: GraffignyLocationPrecision[] = ['exact', 'ville', 'region', 'trajectoire', 'symbolique', 'incertain'];
		const validStatuses: GraffignyDocumentaryStatus[] = ['atteste', 'contextuel', 'incertain'];

		for (const p of graffignyPlaces) {
			expect(validCats).toContain(p.category);
			expect(validPrecisions).toContain(p.precision);
			expect(validStatuses).toContain(p.status);
			expect(GRAFFIGNY_PLACE_CATEGORIES[p.category]).toBeDefined();
		}

		// Chaque catégorie définie possède une couleur, un symbole et une description
		for (const [key, meta] of Object.entries(GRAFFIGNY_PLACE_CATEGORIES)) {
			expect(meta.id).toBe(key);
			expect(meta.label.length).toBeGreaterThan(3);
			expect(meta.color).toMatch(/^#[0-9a-f]{6}$/i);
			expect(meta.symbol.length).toBeGreaterThan(0);
			expect(meta.description.length).toBeGreaterThan(15);
		}
	});

	test('les coordonnées sont valides, dans les bornes du globe terrestre', () => {
		for (const p of graffignyPlaces) {
			if (p.coordinates) {
				const [lat, lng] = p.coordinates;
				expect(lat, `${p.id} lat`).toBeGreaterThanOrEqual(-90);
				expect(lat, `${p.id} lat`).toBeLessThanOrEqual(90);
				expect(lng, `${p.id} lng`).toBeGreaterThanOrEqual(-180);
				expect(lng, `${p.id} lng`).toBeLessThanOrEqual(180);
			}
			if (p.trajectoryCoordinates) {
				expect(p.trajectoryCoordinates.length).toBeGreaterThanOrEqual(2);
				for (const [lat, lng] of p.trajectoryCoordinates) {
					expect(lat).toBeGreaterThanOrEqual(-90);
					expect(lat).toBeLessThanOrEqual(90);
					expect(lng).toBeGreaterThanOrEqual(-180);
					expect(lng).toBeLessThanOrEqual(180);
				}
			}
		}
	});

	test('les relations vers les personnages, étapes et thèmes référencent des entités réelles', () => {
		for (const p of graffignyPlaces) {
			expect(p.characters.length, `${p.id} characters`).toBeGreaterThan(0);
			expect(p.steps.length, `${p.id} steps`).toBeGreaterThan(0);
			expect(p.themes.length, `${p.id} themes`).toBeGreaterThan(0);

			for (const c of p.characters) {
				expect(characterIds.has(c), `${p.id} → personnage ${c}`).toBe(true);
			}
			for (const s of p.steps) {
				expect(stepIds.has(s), `${p.id} → étape ${s}`).toBe(true);
			}
			for (const t of p.themes) {
				expect(themeIds.has(t), `${p.id} → thème ${t}`).toBe(true);
			}
		}
	});

	test('distinction rigoureuse : lieux attestés vs repères historiques contextuels et incertains', () => {
		const temple = graffignyPlaces.find((p) => p.id === 'temple-du-soleil')!;
		expect(temple.category).toBe('recit');
		expect(temple.status).toBe('atteste');
		expect(temple.precision).toBe('symbolique');
		expect(temple.quotationReference).toBe('lettre I');

		const empire = graffignyPlaces.find((p) => p.id === 'empire-inca')!;
		expect(empire.category).toBe('historique');
		expect(empire.status).toBe('contextuel');
		expect(empire.precision).toBe('region');

		const trajet = graffignyPlaces.find((p) => p.id === 'traversee-atlantique')!;
		expect(trajet.category).toBe('trajet');
		expect(trajet.precision).toBe('trajectoire');
		expect(trajet.trajectoryCoordinates).toBeDefined();

		const paris = graffignyPlaces.find((p) => p.id === 'paris')!;
		expect(paris.category).toBe('recit');
		expect(paris.status).toBe('atteste');
		expect(paris.quotationReference).toBe('lettre XIII');

		const domaine = graffignyPlaces.find((p) => p.id === 'domaine-campagne')!;
		expect(domaine.category).toBe('recit');
		expect(domaine.precision).toBe('incertain');
	});

	test('crossLinkIndex contient l’index bidirectionnel complet des lieux', () => {
		expect(Object.keys(crossLinkIndex.places)).toEqual([...placeIds]);
		expect(crossLinkIndex.names.place).toBeDefined();
		expect(Object.keys(crossLinkIndex.names.place)).toEqual([...placeIds]);

		for (const p of graffignyPlaces) {
			const linked = crossLinkIndex.places[p.id];
			expect(linked).toBeDefined();
			expect(linked.places).toEqual([p.id]);
			expect(linked.steps).toEqual(p.steps);
			expect(linked.themes).toEqual(p.themes);
			for (const c of p.characters) {
				expect(linked.characters).toContain(c);
				// Réciprocité : le personnage contient ce lieu dans son index
				expect(crossLinkIndex.nodes[c].places, `${c} → ${p.id}`).toContain(p.id);
			}
			for (const s of p.steps) {
				expect(crossLinkIndex.steps[s].places, `étape ${s} → ${p.id}`).toContain(p.id);
			}
			for (const t of p.themes) {
				expect(crossLinkIndex.themes[t].places, `thème ${t} → ${p.id}`).toContain(p.id);
			}
		}
	});

	test('la configuration cartographique Leaflet est valide', () => {
		expect(GRAFFIGNY_MAP_CONFIG.tileUrl).toContain('openstreetmap.org');
		expect(GRAFFIGNY_MAP_CONFIG.attribution).toContain('OpenStreetMap');
		expect(GRAFFIGNY_MAP_CONFIG.minZoom).toBeGreaterThanOrEqual(1);
		expect(GRAFFIGNY_MAP_CONFIG.maxZoom).toBeLessThanOrEqual(20);
	});
});
