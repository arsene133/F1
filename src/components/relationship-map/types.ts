// Modèle de données de la carte relationnelle (voir RelationshipMap.astro).
// Coordonnées exprimées dans l'espace du `layout` (ex. 900 × 520), et
// facultativement dans celui du `mobileLayout` (mx, my).

export type MetaItem = string | { text: string; italic?: boolean };

export interface MapNode {
	id: string;
	label: string;
	/** Ligne courte affichée sous le nom dans le nœud. */
	caption: string;
	/** Surtitre du panneau (posture, rôle…). */
	eyebrow?: string;
	/** Ligne de métadonnées du panneau, éléments séparés par « · ». */
	meta?: MetaItem[];
	description: string;
	points?: string[];
	color?: string;
	/** major : nœud central · standard · minor : nœud périphérique. */
	tier?: 'major' | 'standard' | 'minor';
	x: number;
	y: number;
	mx?: number;
	my?: number;
}

export interface MapRelationship {
	id?: string;
	source: string;
	/** Plusieurs cibles : l'arête pointe vers le milieu du groupe (ex. un couple). */
	target: string | string[];
	type: string;
	label: string;
	description: string;
	/** Position de l'étiquette le long de l'arête (0 → source, 1 → cible). */
	labelT?: number;
	labelDx?: number;
	labelDy?: number;
	mLabelT?: number;
	mLabelDx?: number;
	mLabelDy?: number;
	/** Affiche l'étiquette dans le graphe sur mobile (sinon : panneau seulement). */
	mobileLabel?: boolean;
}

export interface EdgeType {
	/** Libellé de légende ; absent → type exclu de la légende. */
	legend?: string;
	stroke?: string;
	activeStroke?: string;
	width?: number;
	activeWidth?: number;
	dash?: string;
	arrow?: 'end' | 'both';
}

export interface MapLayout {
	width: number;
	height: number;
}
