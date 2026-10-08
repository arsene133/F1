import type { TimelineItemImage } from './timeline';

// --------------------------------------------------------------------------
// Iconographie des jalons musicaux
// Fichiers servis localement depuis public/images/timeline/music/
// (aucun lien distant vers Wikimedia Commons à l'exécution).
// Licences vérifiées sur les pages sources le 2026-10-08.
// Tous les documents sont en Domaine Public (manuscrits autographes, affiches d'époque, partitions et portraits historiques).
// --------------------------------------------------------------------------

const DIR = '/images/timeline/music';
const COMMONS = 'Wikimedia Commons';

export const musicImages = {
	beethovenSymphonie1: {
		src: `${DIR}/beethoven-symphonie-1.jpg`,
		srcset: `${DIR}/beethoven-symphonie-1-480.webp 480w, ${DIR}/beethoven-symphonie-1.jpg 800w`,
		width: 800,
		height: 912,
		fit: 'cover',
		position: 'center 20%',
		alt: 'Portrait au pastel de Ludwig van Beethoven jeune en médaillon par Christian Horneman (1802–1803)',
		caption: 'Ludwig van Beethoven (1802–1803), miniature au pastel de Christian Horneman',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Beethoven_Hornemann.jpg',
			author: 'Christian Horneman',
			license: 'Domaine public',
			attributionRequired: false,
			attribution: 'Christian Horneman, Portrait de Beethoven, c. 1802',
			description: 'Portrait miniature au pastel de Beethoven à l’époque des premières symphonies.',
		},
	},

	beethovenSymphonie9: {
		src: `${DIR}/beethoven-symphonie-9.png`,
		srcset: `${DIR}/beethoven-symphonie-9-480.webp 480w, ${DIR}/beethoven-symphonie-9-960.webp 960w`,
		width: 1600,
		height: 1263,
		fit: 'contain',
		alt: 'Manuscrit autographe de la Symphonie n°9 de Ludwig van Beethoven (1824), page 12 avec annotations de la main du compositeur',
		caption: 'Manuscrit autographe de la Neuvième Symphonie (1824), Staatsbibliothek zu Berlin',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ninth_Symphony_original.png',
			author: 'Ludwig van Beethoven',
			license: 'Domaine public',
			attributionRequired: false,
			attribution: 'Ludwig van Beethoven, manuscrit autographe de la 9e Symphonie, 1824',
			description: 'Page originale manuscrite conservée à la Bibliothèque d’État de Berlin (Preußischer Kulturbesitz).',
		},
	},

	berliozSymphonieFantastique: {
		src: `${DIR}/berlioz-symphonie-fantastique.jpg`,
		srcset: `${DIR}/berlioz-symphonie-fantastique-480.webp 480w, ${DIR}/berlioz-symphonie-fantastique-960.webp 960w`,
		width: 1176,
		height: 1600,
		fit: 'contain',
		alt: 'Page de titre autographe de la Symphonie fantastique d’Hector Berlioz (1830) conservée à la Bibliothèque nationale de France',
		caption: 'Page de titre autographe de la Symphonie fantastique (1830), BnF Gallica',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Symphonie_fantastique_Titre.jpg',
			author: 'Hector Berlioz',
			license: 'Domaine public',
			attributionRequired: false,
			attribution: 'Hector Berlioz, Symphonie fantastique (autographe, 1830) — BnF',
			description: 'Manuscrit autographe conservé au Département de la Musique de la Bibliothèque nationale de France.',
		},
	},

	chopinOeuvresPiano: {
		src: `${DIR}/chopin-oeuvres-piano.png`,
		srcset: `${DIR}/chopin-oeuvres-piano-480.webp 480w, ${DIR}/chopin-oeuvres-piano.png 775w`,
		width: 775,
		height: 625,
		fit: 'contain',
		alt: 'Manuscrit autographe de la première page de la Ballade n°1 en sol mineur op. 23 de Frédéric Chopin (c. 1835)',
		caption: 'Manuscrit autographe de la Ballade n°1 op. 23 en sol mineur de Frédéric Chopin (c. 1835)',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Chopin_Ballade_1.png',
			author: 'Frédéric Chopin',
			license: 'Domaine public',
			attributionRequired: false,
			attribution: 'Frédéric Chopin, manuscrit de la Ballade n°1 op. 23',
			description: 'Première page autographe de la Ballade op. 23 composée dans les années 1830 à Paris.',
		},
	},

	offenbachOrphee: {
		src: `${DIR}/offenbach-orphee-aux-enfers.jpg`,
		srcset: `${DIR}/offenbach-orphee-aux-enfers-480.webp 480w, ${DIR}/offenbach-orphee-aux-enfers-960.webp 960w`,
		width: 1600,
		height: 1294,
		fit: 'contain',
		alt: 'Affiche lithographique originale de Jules Chéret pour Orphée aux Enfers de Jacques Offenbach au Théâtre des Bouffes-Parisiens',
		caption: 'Orphée aux Enfers au Théâtre des Bouffes-Parisiens, affiche de Jules Chéret (BnF Gallica)',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Jules_Ch%C3%A9ret_-_Poster_for_Jacques_Offenbach%27s_Orph%C3%A9e_aux_enfers_at_the_Bouffes_Parisiens_-_Original.jpg',
			author: 'Jules Chéret',
			license: 'Domaine public',
			attributionRequired: false,
			attribution: 'Jules Chéret, affiche pour Orphée aux Enfers — BnF Gallica',
			description: 'Lithographie en couleurs pour la célèbre opérette bouffe de Jacques Offenbach, BnF.',
		},
	},

	wagnerTristan: {
		src: `${DIR}/wagner-tristan-und-isolde.jpg`,
		srcset: `${DIR}/wagner-tristan-und-isolde-480.webp 480w, ${DIR}/wagner-tristan-und-isolde-960.webp 960w`,
		width: 1600,
		height: 1166,
		fit: 'contain',
		alt: 'Maquette de décor scénique pour l’Acte I de Tristan und Isolde de Richard Wagner (création à Munich, 1865) par Angelo Quaglio',
		caption: 'Décor de l’Acte I de Tristan und Isolde pour la création munichoise (1865), Angelo Quaglio',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Angelo_Quaglio_-_B%C3%BChnenbild_Tristan_und_Isolde.jpg',
			author: 'Angelo Quaglio',
			license: 'Domaine public',
			attributionRequired: false,
			attribution: 'Angelo Quaglio, maquette de décor pour Tristan und Isolde (1865)',
			description: 'Scénographie de la première représentation mondiale au Hoftheater de Munich le 10 juin 1865.',
		},
	},

	bizetCarmen: {
		src: `${DIR}/bizet-carmen.jpg`,
		srcset: `${DIR}/bizet-carmen-480.webp 480w, ${DIR}/bizet-carmen-960.webp 960w`,
		width: 1169,
		height: 1600,
		fit: 'contain',
		alt: 'Affiche illustrée originale par Prudent-Louis Leray pour la création de Carmen de Georges Bizet à l’Opéra-Comique en 1875',
		caption: 'Affiche de la création de Carmen à l’Opéra-Comique (1875), Prudent-Louis Leray (BnF Gallica)',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Prudent-Louis_Leray_-_Poster_for_the_premi%C3%A8re_of_Georges_Bizet%27s_Carmen.jpg',
			author: 'Prudent-Louis Leray',
			license: 'Domaine public',
			attributionRequired: false,
			attribution: 'Prudent-Louis Leray, affiche de Carmen (1875) — BnF Gallica',
			description: 'Lithographie pour la création de Carmen au Théâtre national de l’Opéra-Comique, Paris, mars 1875.',
		},
	},

	wagnerParsifal: {
		src: `${DIR}/wagner-parsifal.jpg`,
		srcset: `${DIR}/wagner-parsifal-480.webp 480w, ${DIR}/wagner-parsifal.jpg 950w`,
		width: 950,
		height: 706,
		fit: 'contain',
		alt: 'Esquisse de décor pour le Temple du Graal de Parsifal au Festival de Bayreuth (1882) par Paul von Joukowsky',
		caption: 'Le Temple du Graal, décor original de Parsifal pour Bayreuth (1882), Paul von Joukowsky',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Paul_von_Joukowsky_-_B%C3%BChnenbild_Parsifal_-_Gralstempel.jpg',
			author: 'Paul von Joukowsky',
			license: 'Domaine public',
			attributionRequired: false,
			attribution: 'Paul von Joukowsky, Le Temple du Graal (Parsifal, 1882)',
			description: 'Scénographie conçue sous la direction directe de Wagner pour la création de Parsifal au Festspielhaus de Bayreuth en 1882.',
		},
	},
} satisfies Record<string, TimelineItemImage>;
