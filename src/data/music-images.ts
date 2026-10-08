import type { TimelineItemImage } from './timeline';

// --------------------------------------------------------------------------
// Iconographie des jalons musicaux
// Fichiers servis localement depuis public/images/timeline/music/
// (aucun lien distant vers Wikimedia Commons à l'exécution).
// Licences vérifiées sur les pages sources le 2026-10-08.
// Documents de l'œuvre en priorité (manuscrits autographes, affiches, décors) ;
// portraits des compositeurs en vignette secondaire ou, à défaut de document, en image principale.
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
		src: `${DIR}/beethoven-symphonie-9-autographe.jpg`,
		srcset: `${DIR}/beethoven-symphonie-9-autographe-480.webp 480w, ${DIR}/beethoven-symphonie-9-autographe-960.webp 960w`,
		width: 1600,
		height: 1160,
		fit: 'contain',
		alt: 'Page de la partition autographe de la Neuvième Symphonie de Beethoven : portées d’orchestre couvertes d’une écriture rapide, ratures et taches d’encre',
		caption: 'Passage du manuscrit autographe de la Symphonie n° 9 (Staatsbibliothek zu Berlin), photographie de 1927, Spaarnestad Photo',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Duitse_componist_Ludwig_van_Beethoven_(1770-1827)_foto_van_passage_uit_de_Negende_Symfonie_in,_SFA022000180.jpg',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Duitse_componist_Ludwig_van_Beethoven_%281770-1827%29_foto_van_passage_uit_de_Negende_Symfonie_in%2C_SFA022000180.jpg',
			author: 'Ludwig van Beethoven (photographie anonyme, 1927)',
			license: 'Domaine public',
			attributionRequired: false,
			description: 'Photographie (1927) d’un passage du manuscrit autographe de la Neuvième Symphonie conservé à la Staatsbibliothek de Berlin. Spaarnestad Photo, SFA022000180 (PD-anon-70-EU, PD-US).',
		},
	},

	berliozSymphonieFantastique: {
		src: `${DIR}/berlioz-symphonie-fantastique-manuscrit.jpg`,
		srcset: `${DIR}/berlioz-symphonie-fantastique-manuscrit-480.webp 480w, ${DIR}/berlioz-symphonie-fantastique-manuscrit-960.webp 960w`,
		width: 1176,
		height: 1600,
		fit: 'contain',
		alt: 'Page de titre manuscrite de Berlioz : « Épisode de la vie d’un artiste, Symphonie fantastique en 5 parties », avec en marge des vers de Victor Hugo et la signature « par Hector Berlioz »',
		caption: 'Hector Berlioz, page de titre de la partition autographe de la Symphonie fantastique (1830), BnF Gallica',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Symphonie_fantastique_Titre.jpg',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Symphonie_fantastique_Titre.jpg',
			author: 'Hector Berlioz',
			license: 'Domaine public',
			attributionRequired: false,
			description: 'Page de titre de la partition manuscrite de la Symphonie fantastique, 1830. Source : Gallica btv1b55007824r, f. 19 (fonds Charles Malherbe).',
		},
	},

	chopinOeuvresPiano: {
		src: `${DIR}/chopin-prelude-op28-4-autographe.jpg`,
		srcset: `${DIR}/chopin-prelude-op28-4-autographe-480.webp 480w, ${DIR}/chopin-prelude-op28-4-autographe-960.webp 960w`,
		width: 1600,
		height: 1236,
		fit: 'contain',
		alt: 'Manuscrit autographe de Chopin : page à l’encre brune où commence le Prélude en mi mineur op. 28 n° 4, indiqué « Largo », avec ses accords répétés à la main gauche',
		caption: 'Frédéric Chopin, Prélude en mi mineur op. 28 n° 4, manuscrit autographe (1838–1839), Biblioteka Narodowa, Varsovie',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Chopin_%E2%80%93_Prelude_Op._28_No._4_(Autograph_Manuscript).png',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Chopin_%E2%80%93_Prelude_Op._28_No._4_%28Autograph_Manuscript%29.png',
			author: 'Frédéric Chopin',
			license: 'Domaine public',
			attributionRequired: false,
			description: 'Preludium e-moll op. 28 nr 4 (autograf), Biblioteka Narodowa, Mus.93 Cim. Reproduction via IMSLP.',
		},
	},

	beethovenPortraitStieler: {
		src: `${DIR}/beethoven-portrait-stieler.jpg`,
		srcset: `${DIR}/beethoven-portrait-stieler-480.webp 480w, ${DIR}/beethoven-portrait-stieler-960.webp 960w`,
		width: 1285,
		height: 1600,
		fit: 'cover',
		position: 'center 22%',
		alt: 'Portrait de Beethoven à cinquante ans, cheveux gris en désordre, écharpe rouge, crayon à la main au-dessus d’une partition',
		caption: 'Joseph Karl Stieler, Beethoven avec le manuscrit de la Missa solemnis (1820)',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Joseph_Karl_Stieler%27s_Beethoven_mit_dem_Manuskript_der_Missa_solemnis.jpg',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Joseph_Karl_Stieler%27s_Beethoven_mit_dem_Manuskript_der_Missa_solemnis.jpg',
			author: 'Joseph Karl Stieler',
			license: 'Domaine public',
			attributionRequired: false,
			description: 'Beethoven mit dem Manuskript der Missa solemnis, Joseph Karl Stieler, 1820 (PD-Art).',
		},
	},

	berliozPortrait: {
		src: `${DIR}/berlioz-portrait-signol.jpg`,
		srcset: `${DIR}/berlioz-portrait-signol-480.webp 430w`,
		width: 430,
		height: 548,
		fit: 'cover',
		position: 'center 25%',
		alt: 'Portrait d’Hector Berlioz jeune, chevelure rousse abondante, cravate rouge, peint à la villa Médicis',
		caption: 'Émile Signol, Hector Berlioz (1832), peint à la villa Médicis',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Berlioz_young.jpg',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Berlioz_young.jpg',
			author: 'Émile Signol',
			license: 'Domaine public',
			attributionRequired: false,
			description: 'Portrait d’Hector Berlioz peint par Émile Signol, 1832 (PD-old).',
		},
	},

	chopinPortrait: {
		src: `${DIR}/chopin-portrait-delacroix.jpg`,
		srcset: `${DIR}/chopin-portrait-delacroix-480.webp 480w, ${DIR}/chopin-portrait-delacroix-960.webp 960w`,
		width: 1197,
		height: 1600,
		fit: 'cover',
		position: 'center 25%',
		alt: 'Portrait de Frédéric Chopin par Delacroix, visage tourné de trois quarts, touches de peinture vives sur fond sombre',
		caption: 'Eugène Delacroix, Frédéric Chopin (1838), musée du Louvre — fragment d’un double portrait avec George Sand',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Eug%C3%A8ne_Ferdinand_Victor_Delacroix_043.jpg',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Eug%C3%A8ne_Ferdinand_Victor_Delacroix_043.jpg',
			author: 'Eugène Delacroix',
			license: 'Domaine public',
			attributionRequired: false,
			description: 'Portrait of Frédéric Chopin by Eugène Delacroix, 1838, originally part of a larger painting showing both Chopin and George Sand. The Yorck Project (2002).',
		},
	},

	offenbachOrphee: {
		src: `${DIR}/offenbach-orphee-aux-enfers.jpg`,
		srcset: `${DIR}/offenbach-orphee-aux-enfers-480.webp 480w, ${DIR}/offenbach-orphee-aux-enfers-960.webp 960w`,
		width: 1600,
		height: 1214,
		fit: 'contain',
		alt: 'Affiche lithographique de Toulouse-Lautrec : quatre danseuses de cancan en jupons blancs et chapeaux à plumes lèvent la jambe sur fond jaune',
		caption: 'Le cancan, popularisé par le « galop infernal » d’Orphée aux Enfers : Troupe de Mlle Églantine, affiche d’Henri de Toulouse-Lautrec (1896)',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Lautrec_la_troupe_de_mlle_eglantine_(poster)_1895-6.jpg',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Lautrec_la_troupe_de_mlle_eglantine_%28poster%29_1895-6.jpg',
			author: 'Henri de Toulouse-Lautrec',
			license: 'Domaine public',
			attributionRequired: false,
			description: 'La Troupe de Mlle Églantine (Églantine, Jane Avril, Cléopâtre, Gazelle), lithographie en couleurs, 1896.',
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
