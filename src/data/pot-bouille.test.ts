import { describe, expect, test } from 'vitest';
import {
	potBouilleCharacters,
	potBouilleEdgeTypes,
	potBouilleFunctions,
	potBouilleMechanism,
	potBouilleRelationships,
} from './pot-bouille';
import {
	potBouilleBuildingFloors,
	potBouilleExteriorSpace,
} from './pot-bouille-building';

describe('Modèle de données de Pot-Bouille (src/data/pot-bouille.ts)', () => {
	test('tous les personnages ont des identifiants uniques et non vides', () => {
		const ids = potBouilleCharacters.map((c) => c.id);
		const uniqueIds = new Set(ids);
		expect(ids.length).toBe(uniqueIds.size);
		expect(ids.length).toBeGreaterThanOrEqual(15);
		ids.forEach((id) => {
			expect(id.trim()).not.toBe('');
		});
	});

	test('toutes les relations référencent des personnages existants', () => {
		const characterIds = new Set(potBouilleCharacters.map((c) => c.id));
		potBouilleRelationships.forEach((r) => {
			expect(characterIds.has(r.source), `Source inconnue : ${r.source}`).toBe(true);
			const targets = Array.isArray(r.target) ? r.target : [r.target];
			targets.forEach((targetId) => {
				expect(characterIds.has(targetId), `Cible inconnue : ${targetId}`).toBe(true);
			});
		});
	});

	test('chaque relation utilise un type d’arête défini dans potBouilleEdgeTypes', () => {
		const edgeTypeKeys = new Set(Object.keys(potBouilleEdgeTypes));
		potBouilleRelationships.forEach((r) => {
			expect(edgeTypeKeys.has(r.type), `Type d'arête non défini : ${r.type}`).toBe(true);
			expect(potBouilleEdgeTypes[r.type].legend, `Légende manquante pour le type : ${r.type}`).toBeDefined();
		});
	});

	test('tous les personnages ont une entrée valide dans le dictionnaire de synthèse', () => {
		potBouilleCharacters.forEach((c) => {
			expect(potBouilleFunctions[c.id], `Fonction manquante pour ${c.id}`).toBeDefined();
			expect(potBouilleFunctions[c.id].length).toBeGreaterThan(5);
		});
	});

	test('les personnages majeurs sont bien identifiés et positionnés', () => {
		const majors = potBouilleCharacters.filter((c) => c.tier === 'major');
		const majorIds = majors.map((c) => c.id);
		expect(majorIds).toContain('mouret');
		expect(majorIds).toContain('berthe');
		expect(majorIds).toContain('auguste-vabre');

		majors.forEach((m) => {
			expect(m.points && m.points.length >= 3, `Points narratifs insuffisants pour ${m.id}`).toBe(true);
			expect(m.x).toBeGreaterThan(0);
			expect(m.y).toBeGreaterThan(0);
			expect(m.mx).toBeGreaterThan(0);
			expect(m.my).toBeGreaterThan(0);
		});
	});

	test('le mécanisme du roman compte 5 étapes structurées', () => {
		expect(potBouilleMechanism).toHaveLength(5);
		potBouilleMechanism.forEach((m) => {
			expect(m.step.length).toBeGreaterThan(2);
			expect(m.text.length).toBeGreaterThan(15);
		});
	});

	test('les relations majeures d’adultère et de mariage sont explicitement modélisées', () => {
		// Liaison Octave - Berthe
		const mouretBerthe = potBouilleRelationships.find(
			(r) => (r.source === 'mouret' && r.target === 'berthe') || (r.source === 'berthe' && r.target === 'mouret'),
		);
		expect(mouretBerthe).toBeDefined();
		expect(mouretBerthe?.type).toBe('adultery');
		expect(mouretBerthe?.label).toContain('adultère');

		// Mariage Auguste - Berthe
		const augusteBerthe = potBouilleRelationships.find(
			(r) =>
				(r.source === 'auguste-vabre' && r.target === 'berthe') ||
				(r.source === 'berthe' && r.target === 'auguste-vabre'),
		);
		expect(augusteBerthe).toBeDefined();
		expect(augusteBerthe?.type).toBe('marriage');

		// Promesse de dot Mme Josserand -> Auguste
		const dot = potBouilleRelationships.find(
			(r) => r.source === 'mme-josserand' && r.target === 'auguste-vabre',
		);
		expect(dot).toBeDefined();
		expect(dot?.type).toBe('financial');
		expect(dot?.label).toContain('50 000');
		expect(dot?.description).toContain('cinquante mille francs');
	});

	// --- TESTS D'EXACTITUDE LITTÉRAIRE ET CHRONOLOGIQUE ---
	test('exactitude littéraire : profession et liens de la famille Josserand', () => {
		const mJosserand = potBouilleCharacters.find((c) => c.id === 'm-josserand');
		expect(mJosserand).toBeDefined();
		expect(mJosserand?.caption).toContain('caissier');
		expect(mJosserand?.meta).toContain('caissier à la cristallerie Saint-Joseph');
		// Mort au chapitre XVII et non XVI
		expect(mJosserand?.points?.some((p) => p.includes('chapitre XVII'))).toBe(true);

		const mmeJosserand = potBouilleCharacters.find((c) => c.id === 'mme-josserand');
		expect(mmeJosserand).toBeDefined();
		// Nom de jeune fille : Bachelard (sœur de l'oncle Narcisse Bachelard)
		expect(mmeJosserand?.meta).toContain('née Bachelard');

		const saturnin = potBouilleCharacters.find((c) => c.id === 'saturnin');
		expect(saturnin).toBeDefined();
		// Asile des Moulineaux (et non Charenton)
		expect(saturnin?.points?.some((p) => p.includes('Moulineaux'))).toBe(true);
	});

	test('exactitude littéraire : famille Vabre, filiations, décès et testament', () => {
		const vieuxVabre = potBouilleCharacters.find((c) => c.id === 'vieux-vabre');
		expect(vieuxVabre).toBeDefined();
		expect(vieuxVabre?.meta).toContain('ancien notaire de Versailles');
		// Mort au chapitre X, absence de testament constatée au chapitre XI
		expect(vieuxVabre?.points?.some((p) => p.includes('chapitre X'))).toBe(true);
		expect(vieuxVabre?.points?.some((p) => p.includes('chapitre XI'))).toBe(true);

		// Filiation de Clotilde Duveyrier avec le vieux Vabre
		const clotilde = potBouilleCharacters.find((c) => c.id === 'clotilde-duveyrier');
		expect(clotilde).toBeDefined();
		expect(clotilde?.label).toBe('Clotilde Duveyrier');
		expect(clotilde?.meta).toContain('née Vabre');
		expect(clotilde?.description).toContain('Fille du vieux Vabre et sœur d’Auguste et Théophile');

		const relVieuxClotilde = potBouilleRelationships.find(
			(r) => r.source === 'vieux-vabre' && r.target === 'clotilde-duveyrier',
		);
		expect(relVieuxClotilde).toBeDefined();
		expect(relVieuxClotilde?.type).toBe('family');
		expect(relVieuxClotilde?.label).toContain('père → fille');

		const valerieVabre = potBouilleCharacters.find((c) => c.id === 'valerie-vabre');
		expect(valerieVabre).toBeDefined();
		expect(valerieVabre?.meta).toContain('née Louhette');
	});

	test('exactitude littéraire : ménage Campardon et rôle de Gasparine', () => {
		const campardon = potBouilleCharacters.find((c) => c.id === 'campardon');
		expect(campardon).toBeDefined();
		expect(campardon?.description).toContain('Rose (née Domergue)');

		const gasparine = potBouilleCharacters.find((c) => c.id === 'gasparine');
		expect(gasparine).toBeDefined();
		expect(gasparine?.eyebrow).toContain('Rose');
		expect(gasparine?.meta).toContain('cousine de Rose Campardon');
	});

	test('exactitude littéraire : dénonciation et piège de l’adultère (chapitres XIV et XV)', () => {
		const rachel = potBouilleCharacters.find((c) => c.id === 'rachel');
		expect(rachel).toBeDefined();
		expect(rachel?.points?.some((p) => p.includes('ch. XIV'))).toBe(true);

		const relRachelBerthe = potBouilleRelationships.find(
			(r) => r.source === 'rachel' && r.target === 'berthe',
		);
		expect(relRachelBerthe).toBeDefined();
		expect(relRachelBerthe?.description).toContain('ch. XIV');
		expect(relRachelBerthe?.description).toContain('verrouille');

		const relMouretBerthe = potBouilleRelationships.find(
			(r) => (r.source === 'mouret' && r.target === 'berthe') || (r.source === 'berthe' && r.target === 'mouret'),
		);
		expect(relMouretBerthe?.description).toContain('ch. XIV');
		expect(relMouretBerthe?.description).toContain('ch. XV');
	});

	test('cohérence du corpus : les 17 personnages forment un réseau relationnel fermé', () => {
		const characterIds = new Set(potBouilleCharacters.map((c) => c.id));
		expect(characterIds.size).toBe(17);

		// Chaque relation pointe strictement vers un personnage présent dans characterIds
		potBouilleRelationships.forEach((r) => {
			expect(characterIds.has(r.source)).toBe(true);
			const targets = Array.isArray(r.target) ? r.target : [r.target];
			targets.forEach((t) => expect(characterIds.has(t)).toBe(true));
		});

		// Chaque personnage du graphe participe à au moins une relation
		const connectedIds = new Set<string>();
		potBouilleRelationships.forEach((r) => {
			connectedIds.add(r.source);
			const targets = Array.isArray(r.target) ? r.target : [r.target];
			targets.forEach((t) => connectedIds.add(t));
		});
		expect(connectedIds.size).toBe(17);
	});
});

describe('Coupe architecturale du 28, rue de Choiseul (src/data/pot-bouille-building.ts)', () => {
	test('tous les étages sont définis du rez-de-chaussée aux combles', () => {
		const levels = potBouilleBuildingFloors.map((f: any) => f.level);
		expect(levels).toEqual([5, 4, 3, 2, 1, 0, -1]);
	});

	test('la répartition spatiale respecte le texte de Zola (Chapitre I)', () => {
		const floorMap = new Map(potBouilleBuildingFloors.map((f: any) => [f.id, f]));

		// 4e étage : Josserand sur rue, Pichon et chambre d'Octave sur cour
		const f4: any = floorMap.get('etage-4');
		expect(f4).toBeDefined();
		const f4Rooms = f4.rooms.map((r: any) => r.id);
		expect(f4Rooms).toContain('foyer-josserand');
		expect(f4Rooms).toContain('chambre-octave');
		expect(f4Rooms).toContain('foyer-pichon');

		// 3e étage : Campardon sur rue, Juzeur sur cour
		const f3: any = floorMap.get('etage-3');
		expect(f3).toBeDefined();
		const f3Rooms = f3.rooms.map((r: any) => r.id);
		expect(f3Rooms).toContain('foyer-campardon');
		expect(f3Rooms).toContain('logement-juzeur');

		// 1er étage : Duveyrier et vieux Vabre sur rue, Théophile et Valérie sur cour
		const f1: any = floorMap.get('etage-1');
		expect(f1).toBeDefined();
		const f1Rooms = f1.rooms.map((r: any) => r.id);
		expect(f1Rooms).toContain('appartement-duveyrier');
		expect(f1Rooms).toContain('appartement-theophile-valerie');

		// RDC : magasin de soieries, vestibule, loge Gourd et cour de service
		const rdc: any = floorMap.get('rdc');
		expect(rdc).toBeDefined();
		const rdcRooms = rdc.rooms.map((r: any) => r.id);
		expect(rdcRooms).toContain('magasin-soieries');
		expect(rdcRooms).toContain('vestibule-honneur');
		expect(rdcRooms).toContain('loge-gourd');
		expect(rdcRooms).toContain('cour-service');
	});

	test('tous les personnages associés aux pièces sont valides dans potBouilleCharacters', () => {
		const characterIds = new Set(potBouilleCharacters.map((c) => c.id));

		potBouilleBuildingFloors.forEach((floor: any) => {
			floor.rooms.forEach((room: any) => {
				room.characterIds.forEach((cid: string) => {
					expect(characterIds.has(cid), `Personnage inconnu dans ${room.id} : ${cid}`).toBe(true);
				});
			});
		});

		potBouilleExteriorSpace.characterIds.forEach((cid: string) => {
			expect(characterIds.has(cid), `Personnage inconnu dans l'espace extérieur : ${cid}`).toBe(true);
		});
	});
});
