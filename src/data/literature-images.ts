import type { TimelineItemImage } from './timeline';

// --------------------------------------------------------------------------
// Portraits des auteurs des œuvres littéraires
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
} satisfies Record<string, TimelineItemImage>;
