import type { TimelineItemImage } from './timeline';

// --------------------------------------------------------------------------
// Iconographie des œuvres littéraires : documents liés à l’œuvre en priorité
// (édition, manuscrit, illustration), portraits des auteurs en vignette secondaire
// Fichiers servis localement depuis public/images/timeline/literature/
// (aucun lien direct vers Wikimedia Commons à l'exécution).
// Licences vérifiées sur les pages Commons le 2026-10-08.
// Variantes : <nom>-480.webp / <nom>-960.webp + fichier de repli <nom>.jpg (≤ 1600 px).
// --------------------------------------------------------------------------

const DIR = '/images/timeline/literature';
const COMMONS = 'Wikimedia Commons';

export const literatureImages = {
	musset: {
		src: `${DIR}/musset-portrait-landelle.jpg`,
		srcset: `${DIR}/musset-portrait-landelle-480.webp 480w, ${DIR}/musset-portrait-landelle-960.webp 960w`,
		width: 1021,
		height: 1302,
		fit: 'cover',
		position: 'center 30%',
		alt: 'Portrait d’Alfred de Musset de trois quarts, cheveux longs et barbe, sur fond sombre',
		caption: 'Charles Landelle, Alfred de Musset (1878, d’après le pastel de 1854), château de Versailles',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Alfred_de_Musset.jpg',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Alfred_de_Musset.jpg',
			author: 'Charles Landelle',
			license: 'Domaine public',
			attributionRequired: false,
			description: 'Portrait d’Alfred de Musset par Charles Landelle, 1878, d’après une œuvre de 1854 conservée au musée d’Orsay. Château de Versailles.',
		},
	},

	balzac: {
		src: `${DIR}/balzac-daguerreotype-bisson.jpg`,
		srcset: `${DIR}/balzac-daguerreotype-bisson-480.webp 480w, ${DIR}/balzac-daguerreotype-bisson-960.webp 960w`,
		width: 1328,
		height: 1600,
		fit: 'cover',
		position: 'center 35%',
		alt: 'Daguerréotype d’Honoré de Balzac en chemise ouverte, la main posée sur la poitrine',
		caption: 'Honoré de Balzac (1842), daguerréotype de Louis-Auguste Bisson, Paris Musées',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Balzac_by_Bisson_daguerrotype_original.jpg',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Balzac_by_Bisson_daguerrotype_original.jpg',
			author: 'Louis-Auguste Bisson',
			license: 'Domaine public',
			attributionRequired: false,
			description: 'The original daguerreotype of Honoré de Balzac by Louis-Auguste Bisson, 1842 (Paris Musées).',
		},
	},

	rimbaud: {
		src: `${DIR}/rimbaud-carjat.jpg`,
		srcset: `${DIR}/rimbaud-carjat-480.webp 480w, ${DIR}/rimbaud-carjat-960.webp 960w`,
		width: 1225,
		height: 1600,
		fit: 'cover',
		position: 'center 35%',
		alt: 'Photographie en médaillon d’Arthur Rimbaud adolescent, cheveux en bataille, regard clair',
		caption: 'Arthur Rimbaud à 17 ans, photographie d’Étienne Carjat (1872), musée Arthur-Rimbaud',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Arthur_Rimbaud_by_Carjat_-_Mus%C3%A9e_Arthur_Rimbaud.jpg',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Arthur_Rimbaud_by_Carjat_-_Mus%C3%A9e_Arthur_Rimbaud.jpg',
			author: 'Étienne Carjat',
			license: 'Domaine public',
			attributionRequired: false,
			description: 'Portrait of Arthur Rimbaud at the age of seventeen, by Étienne Carjat, c. 1872. Musée Arthur Rimbaud.',
		},
	},

	zola: {
		src: `${DIR}/zola-nadar.jpg`,
		srcset: `${DIR}/zola-nadar-480.webp 480w, ${DIR}/zola-nadar-960.webp 960w`,
		width: 1202,
		height: 1600,
		fit: 'cover',
		position: 'center 45%',
		alt: 'Photographie d’Émile Zola en buste, barbe et pince-nez, vers 1875',
		caption: 'Émile Zola, photographie de Nadar (vers 1875), BnF',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:%C3%89mile_Zola,_par_Nadar,_btv1b53144583n_f1.jpg',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/%C3%89mile_Zola%2C_par_Nadar%2C_btv1b53144583n_f1.jpg',
			author: 'Nadar',
			license: 'Domaine public',
			attributionRequired: false,
			description: 'Émile Zola, par Nadar, vers 1875. Bibliothèque nationale de France, Gallica btv1b53144583n.',
		},
	},

	potBouille: {
		src: `${DIR}/pot-bouille-gill-nouvelle-lune.jpg`,
		srcset: `${DIR}/pot-bouille-gill-nouvelle-lune-480.webp 480w, ${DIR}/pot-bouille-gill-nouvelle-lune-960.webp 960w`,
		width: 1124,
		height: 1600,
		fit: 'contain',
		alt: 'Caricature en une de La Nouvelle Lune : Zola, grosse tête barbue et lorgnon, en tablier de cuisinier, soulève le couvercle d’une marmite fumante d’où sortent des mouches, une immense plume à la main ; légende « Ce que ça sent bon !!! »',
		caption: 'André Gill, « Le Pot-Bouille à Zola », une de La Nouvelle Lune, 23 avril 1882 (musée Carnavalet)',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:La_nouvelle_lune._Troisi%C3%A8me_ann%C3%A9e._N%C2%B017._Le_pot-bouille_%C3%A0_Zola,_par_Andr%C3%A9_Gill,_Paris_Mus%C3%A9es_20231008200529.jpg',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/La_nouvelle_lune._Troisi%C3%A8me_ann%C3%A9e._N%C2%B017._Le_pot-bouille_%C3%A0_Zola%2C_par_Andr%C3%A9_Gill%2C_Paris_Mus%C3%A9es_20231008200529.jpg',
			author: 'André Gill',
			license: 'CC0',
			attributionRequired: false,
			description: 'La Nouvelle Lune, 3e année, n° 17 (23 avril 1882) : « Le Pot-Bouille à Zola », par André Gill. Musée Carnavalet, Paris Musées.',
		},
	},

	auBonheurDesDames: {
		src: `${DIR}/bon-marche-facade.jpg`,
		srcset: `${DIR}/bon-marche-facade-480.webp 480w, ${DIR}/bon-marche-facade-960.webp 960w`,
		width: 1600,
		height: 1067,
		fit: 'cover',
		alt: 'Façade d’angle arrondie du Bon Marché à Paris : pierre de taille sculptée, grandes baies vitrées, inscription « Au Bon Marché » et marquise ouvragée au-dessus des vitrines',
		caption: 'Le Bon Marché, rue de Sèvres à Paris, grand magasin d’Aristide Boucicaut qui inspira à Zola le Bonheur des Dames',
		credit: {
			source: 'Flickr',
			sourceUrl: 'https://www.flickr.com/photos/129231073@N06/31885711304/',
			fileUrl: 'https://live.staticflickr.com/337/31885711304_ad254e81dd_h.jpg',
			author: 'Fred Romero',
			license: 'CC BY 2.0',
			attributionRequired: true,
			description: 'Paris - Le Bon Marché, photographie de Fred Romero (11 décembre 2016).',
		},
	},

	pereGoriot: {
		src: `${DIR}/pere-goriot-daumier-1842.jpg`,
		srcset: `${DIR}/pere-goriot-daumier-1842-480.webp 480w, ${DIR}/pere-goriot-daumier-1842-960.webp 960w`,
		width: 1098,
		height: 1600,
		fit: 'contain',
		alt: 'Gravure en noir et blanc : le père Goriot, vieillard voûté en longue redingote, assis de profil sur une chaise de paille, les mains jointes sur le genou, une chaussure défaite',
		caption: 'Le père Goriot, gravure sur bois d’après Honoré Daumier (1842), gravée par Baulant',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Father_Goriot_by_H._Daumier_(1842).JPG',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Father_Goriot_by_H._Daumier_%281842%29.JPG',
			author: 'Honoré Daumier',
			license: 'Domaine public',
			attributionRequired: false,
			description: 'Le père Goriot, illustration de H. Daumier (1842), gravure sur bois (PD-old).',
		},
	},

	onNeBadinePas: {
		src: `${DIR}/on-ne-badine-pas-lami.jpg`,
		srcset: `${DIR}/on-ne-badine-pas-lami-480.webp 480w, ${DIR}/on-ne-badine-pas-lami.jpg 591w`,
		width: 591,
		height: 639,
		fit: 'contain',
		alt: 'Gravure d’Eugène Lami pour On ne badine pas avec l’amour : un jeune homme en tricorne et habit du XVIIIe siècle face à une paysanne portant un panier, près d’une palissade',
		caption: 'Eugène Lami (dessin) et Adolphe Lalauze (gravure), illustration pour On ne badine pas avec l’amour (1884), BnF Gallica',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Musset_-_On_ne_badine_pas_avec_l%27amour.jpg',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Musset_-_On_ne_badine_pas_avec_l%27amour.jpg',
			author: 'Eugène Lami, gravé par Adolphe Lalauze',
			license: 'Domaine public',
			attributionRequired: false,
			description: 'Illustration d’Eugène Lami pour On ne badine pas avec l’amour, 1884. Source : Gallica btv1b22002305, f. 38.',
		},
	},

	cahiersDouai: {
		src: `${DIR}/rimbaud-sensation-manuscrit.jpg`,
		srcset: `${DIR}/rimbaud-sensation-manuscrit-480.webp 480w, ${DIR}/rimbaud-sensation-manuscrit.jpg 668w`,
		width: 668,
		height: 546,
		fit: 'contain',
		alt: 'Manuscrit autographe du poème « Sensation » d’Arthur Rimbaud, daté « Mars 1870 » et signé : « Par les soirs bleus d’été, j’irai dans les sentiers… »',
		caption: 'Arthur Rimbaud, « Sensation », manuscrit autographe daté de mars 1870 — l’un des poèmes réunis dans le Cahier de Douai',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Rimbaud_sensation.jpg',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Rimbaud_sensation.jpg',
			author: 'Arthur Rimbaud',
			license: 'Domaine public',
			attributionRequired: false,
			description: 'Manuscrit autographe du poème Sensation (mars 1870), reproduit d’après Arthur Rimbaud, Œuvres complètes, t. IV, Fac-similés, éd. Steve Murphy, Honoré Champion, 2002.',
		},
	},
} satisfies Record<string, TimelineItemImage>;
