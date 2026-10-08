import type { ImageMetadata } from 'astro';
import balzacPortrait from '../assets/honore-de-balzac-1842.jpg';
import marxPortrait from '../assets/karl-marx.jpg';
import goriotIllustration from '../assets/pere-goriot-illustration.jpg';
import communePhoto from '../assets/commune-barricade-1871.jpg';
import rimbaudPortrait from '../assets/arthur-rimbaud.jpg';

// --------------------------------------------------------------------------
// Cartographie relationnelle /balzac-rimbaud : figures, relations et
// présentation (positions bureau, ordre de la chaîne mobile).
// --------------------------------------------------------------------------

export interface MapNodeImage {
	asset: ImageMetadata;
	alt: string;
	creditPrefix: string;
	sourceLabel: string;
	sourceUrl: string | null;
	creditSuffix: string;
	orientation: 'portrait' | 'landscape';
	position: string;
}

export interface MapNode {
	id: string;
	label: string;
	dates: string;
	role: string;
	work: string;
	posture: string;
	description: string;
	points: string[];
	image: MapNodeImage;
	href: string;
	x: number;
	y: number;
}

export type RelationshipType = 'direct' | 'comparison' | 'contrast';

export interface Relationship {
	id: string;
	source: string;
	target: string;
	label: string;
	explanation: string;
	type: RelationshipType;
}

// Modèle de données explicite des nœuds
export const nodes: MapNode[] = [
	{
		id: "balzac",
		label: "Honoré de Balzac",
		dates: "1799–1850",
		role: "Écrivain",
		work: "La Comédie humaine",
		posture: "Observe",
		description: "Observe et décrit méticuleusement la société bourgeoise émergente, montrant la toute-puissance de l'argent et de la propriété, et faisant de Paris un vaste théâtre social.",
		points: [
			"Observe et décrit la société bourgeoise",
			"Montre la puissance de l’argent et de la propriété",
			"Fait de Paris un théâtre social",
		],
		image: {
			asset: balzacPortrait,
			alt: "Portrait photographique d'Honoré de Balzac en 1842, par Louis-Auguste Bisson.",
			creditPrefix: "Honoré de Balzac, 1842 — Louis-Auguste Bisson, daguerréotype · ",
			sourceLabel: "Wikimedia Commons",
			sourceUrl: "https://commons.wikimedia.org/wiki/File:Honor%C3%A9_de_Balzac_(1842)_Detail.jpg",
			creditSuffix: " · domaine public",
			orientation: "portrait",
			position: "50% 20%",
		},
		// Coordonnées relatives sur le canvas (x, y) dans l'espace 900 x 520
		href: "#node-balzac",
		x: 450,
		y: 80,
	},
	{
		id: "rastignac",
		label: "Rastignac",
		dates: "Personnage de Balzac",
		role: "Personnage de fiction",
		work: "Le Père Goriot",
		posture: "S’adapte et conquiert",
		description: "Jeune provincial ambitieux découvrant les codes cyniques du monde parisien ; il choisit d'accepter les règles du jeu pour conquérir le système social.",
		points: [
			"Jeune provincial ambitieux",
			"Découvre les règles du monde parisien",
			"S’adapte au système pour réussir",
			"Incarnation de la conquête sociale",
		],
		image: {
			asset: goriotIllustration,
			alt: "Illustration de Le Père Goriot, œuvre de Honoré de Balzac.",
			creditPrefix: "Illustration de Le Père Goriot — ",
			sourceLabel: "Wikimedia Commons",
			sourceUrl: "https://commons.wikimedia.org/wiki/File:BalzacOldGoriot02.jpg",
			creditSuffix: " · domaine public",
			orientation: "portrait",
			position: "50% 30%",
		},
		href: "#node-rastignac",
		x: 710,
		y: 220,
	},
	{
		id: "marx",
		label: "Karl Marx",
		dates: "1818–1883",
		role: "Philosophe & économiste",
		work: "Le Capital · Manifeste du parti communiste",
		posture: "Analyse et théorise",
		description: "Démonte scientifiquement les ressorts du capitalisme et théorise la lutte des classes comme moteur de l'histoire, montrant comment l'accumulation de la richesse produit l'exploitation.",
		points: [
			"Analyse le fonctionnement du capitalisme",
			"Théorise la lutte des classes",
			"Montre comment la richesse produit l’exploitation",
		],
		image: {
			asset: marxPortrait,
			alt: "Portrait photographique de Karl Marx.",
			creditPrefix: "Karl Marx — ",
			sourceLabel: "Image source fournie par l'auteur du site",
			sourceUrl: null,
			creditSuffix: "",
			orientation: "portrait",
			position: "50% 20%",
		},
		href: "#node-marx",
		x: 190,
		y: 220,
	},
	{
		id: "commune",
		label: "La Commune de Paris",
		dates: "1871",
		role: "Insurrection & expérience politique",
		work: "Insurrection populaire",
		posture: "Se révolte",
		description: "Soulèvement révolutionnaire du peuple parisien refusant l'ordre bourgeois établi ; expérimentation fulgurante d'une démocratie populaire conclue par une répression sanglante.",
		points: [
			"Insurrection populaire",
			"Refus de l’ordre bourgeois",
			"Expérimentation d’une autre société",
			"Répression sanglante",
		],
		image: {
			asset: communePhoto,
			alt: "Barricade à l'angle des boulevards Voltaire et Richard-Lenoir pendant la Commune de Paris, 1871.",
			creditPrefix: "Barricade à l'angle des boulevards Voltaire et Richard-Lenoir, 1871 — Bruno Braquehais · ",
			sourceLabel: "Wikimedia Commons",
			sourceUrl: "https://commons.wikimedia.org/wiki/File:Barricade_Voltaire_Lenoir_Commune_Paris_1871.jpg",
			creditSuffix: " · domaine public",
			orientation: "landscape",
			position: "50% 50%",
		},
		href: "#node-commune",
		x: 630,
		y: 440,
	},
	{
		id: "rimbaud",
		label: "Arthur Rimbaud",
		dates: "1854–1891",
		role: "Poète",
		work: "Poèmes de 1871",
		posture: "Refuse et transforme",
		description: "Présent à Paris pendant les événements de la Commune, il refuse catégoriquement le monde bourgeois et transmue la révolte sociale en rupture poétique radicale.",
		points: [
			"Arrive à Paris pendant la Commune",
			"Dénonce la bourgeoisie et la répression",
			"Transforme la révolte sociale en langage poétique",
			"Refuse le monde et ses règles",
		],
		image: {
			asset: rimbaudPortrait,
			alt: "Portrait d'Arthur Rimbaud jeune.",
			creditPrefix: "Arthur Rimbaud — ",
			sourceLabel: "Image source fournie par l'auteur du site",
			sourceUrl: null,
			creditSuffix: "",
			orientation: "portrait",
			position: "50% 25%",
		},
		href: "#node-rimbaud",
		x: 270,
		y: 440,
	},
];

// Nœud central conceptuel
export const societyCenter = {
	x: 450,
	y: 260,
	label: "SOCIÉTÉ DU XIXe SIÈCLE",
	sub: "Paris · argent · pouvoir · révolte",
};

// Relations conceptuelles et visuelles
export const relationships: Relationship[] = [
	{
		id: "balzac-rastignac",
		source: "balzac",
		target: "rastignac",
		label: "observe → s’adapte",
		explanation: "Balzac observe la structure sociale ; Rastignac apprend à y circuler et cherche à la conquérir.",
		type: "direct",
	},
	{
		id: "balzac-marx",
		source: "balzac",
		target: "marx",
		label: "décrire ↔ analyser",
		explanation: "Balzac montre le monde social ; Marx cherche à en expliquer les mécanismes.",
		type: "comparison",
	},
	{
		id: "commune-marx",
		source: "commune",
		target: "marx",
		label: "expérience révolutionnaire",
		explanation: "Marx voit dans la Commune une expérience révolutionnaire et un moment de la lutte des classes.",
		type: "direct",
	},
	{
		id: "commune-rimbaud",
		source: "commune",
		target: "rimbaud",
		label: "révolte → poésie",
		explanation: "Rimbaud transforme la révolte sociale en langage poétique.",
		type: "direct",
	},
	{
		id: "rastignac-rimbaud",
		source: "rastignac",
		target: "rimbaud",
		label: "accepter le jeu ↔ tout renverser",
		explanation: "Rastignac accepte le jeu. Rimbaud représente une rupture radicale avec le monde que Rastignac accepte : là où Rastignac veut réussir, Rimbaud veut tout renverser.",
		type: "contrast",
	},
];

// --------------------------------------------------------------------------
// Chaîne mobile : les cinq relations forment un cycle
// (Balzac – Rastignac – Rimbaud – Commune – Marx – Balzac). Sur petit écran,
// les figures sont empilées dans cet ordre : chaque relation relie deux
// figures voisines, sauf la dernière, qui referme la boucle par une rambarde
// latérale. Aucune ligne ne se croise, aucune relation n'est ajoutée.
// --------------------------------------------------------------------------

export const mobileChainOrder = ['balzac', 'rastignac', 'rimbaud', 'commune', 'marx'];

export interface ChainLink {
	relationship: Relationship;
	/** Sens de lecture de la flèche dans la colonne (relations orientées uniquement). */
	arrow: 'down' | 'up' | null;
}

export interface MobileChain {
	/** Relations entre figures consécutives, links[i] relie order[i] et order[i + 1]. */
	links: ChainLink[];
	/** Relation qui relie la dernière figure à la première (rambarde de bouclage). */
	loop: ChainLink | null;
}

function findRelationship(rels: Relationship[], a: string, b: string): Relationship | undefined {
	return rels.find((r) => (r.source === a && r.target === b) || (r.source === b && r.target === a));
}

function arrowFor(rel: Relationship, upper: string): ChainLink['arrow'] {
	if (rel.type !== 'direct') return null;
	return rel.source === upper ? 'down' : 'up';
}

export function buildMobileChain(order: string[], rels: Relationship[]): MobileChain {
	const links: ChainLink[] = [];
	for (let i = 0; i < order.length - 1; i++) {
		const rel = findRelationship(rels, order[i], order[i + 1]);
		if (!rel) throw new Error(`Aucune relation entre ${order[i]} et ${order[i + 1]}`);
		links.push({ relationship: rel, arrow: arrowFor(rel, order[i]) });
	}
	const first = order[0];
	const last = order[order.length - 1];
	const loopRel = findRelationship(rels, last, first);
	const loop = loopRel ? { relationship: loopRel, arrow: arrowFor(loopRel, last) } : null;

	const drawn = new Set([...links, ...(loop ? [loop] : [])].map((l) => l.relationship.id));
	const missing = rels.filter((r) => !drawn.has(r.id));
	if (missing.length) throw new Error(`Relations non représentées : ${missing.map((r) => r.id).join(', ')}`);

	return { links, loop };
}

export const mobileChain = buildMobileChain(mobileChainOrder, relationships);
