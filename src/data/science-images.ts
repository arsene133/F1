import type { TimelineItemImage } from './timeline';

// --------------------------------------------------------------------------
// Iconographie des jalons scientifiques
// Fichiers servis localement depuis public/images/timeline/science/
// (aucun lien direct vers Wikimedia Commons à l'exécution).
// Licences vérifiées sur les pages Commons le 2026-10-08.
// Variantes : <nom>-480.webp / <nom>-960.webp + fichier de repli au nom d'origine.
// --------------------------------------------------------------------------

const DIR = '/images/timeline/science';
const COMMONS = 'Wikimedia Commons';

export const scienceImages = {
	volta: {
		src: `${DIR}/voltaic-pile.jpg`,
		srcset: `${DIR}/voltaic-pile-480.webp 480w, ${DIR}/voltaic-pile-960.webp 960w`,
		width: 1067,
		height: 1600,
		fit: 'contain',
		alt: 'Pile voltaïque : colonne de disques métalliques empilés dans une vitrine de musée, l’une des premières batteries électriques associées à Alessandro Volta',
		caption: 'Pile de Volta (1800–1824), Museu da Ciência da Universidade de Coimbra',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Volta_battery,_1800-1824_-_Museu_da_Ci%C3%AAncia_da_Universidade_de_Coimbra_-_University_of_Coimbra_-_Coimbra,_Portugal_-_DSC09067.jpg',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Volta_battery%2C_1800-1824_-_Museu_da_Ci%C3%AAncia_da_Universidade_de_Coimbra_-_University_of_Coimbra_-_Coimbra%2C_Portugal_-_DSC09067.jpg',
			author: 'Daderot',
			license: 'CC0',
			attributionRequired: false,
			description: 'Volta battery, 1800–1824, Museu da Ciência da Universidade de Coimbra.',
		},
	},

	lamarck: {
		src: `${DIR}/lamarck.jpg`,
		srcset: `${DIR}/lamarck-480.webp 480w, ${DIR}/lamarck-960.webp 856w`,
		width: 856,
		height: 1040,
		fit: 'cover',
		position: 'center 30%',
		alt: 'Portrait gravé de Jean-Baptiste Lamarck âgé, en habit de membre de l’Institut',
		caption: 'Jean-Baptiste Lamarck, gravure d’Ambroise Tardieu (1824)',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Jean-Baptiste_Lamarck.jpg',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/37/Jean-Baptiste_Lamarck.jpg',
			author: 'Ambroise Tardieu',
			license: 'Domaine public',
			attributionRequired: false,
			description: 'Portrait of Lamarck, old and blind, in the costume of a member of the Institut, engraved in 1824 by Ambroise Tardieu (PD-old).',
		},
	},

	carnot: {
		src: `${DIR}/carnot-cycle.jpg`,
		srcset: `${DIR}/carnot-cycle-480.webp 480w, ${DIR}/carnot-cycle-960.webp 960w`,
		width: 1600,
		height: 1010,
		fit: 'contain',
		alt: 'Diagramme du cycle de Carnot : courbes de détente et de compression formant un cycle fermé dans un plan pression-volume',
		caption: 'Le cycle de Carnot mis en diagramme par Émile Clapeyron (1834)',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Carnot_cycle_Clapeyron.jpg',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Carnot_cycle_Clapeyron.jpg',
			author: 'Émile Clapeyron',
			license: 'CC0',
			attributionRequired: false,
			description: 'First illustration of the Carnot cycle in a PV diagram, by Émile Clapeyron, 1834.',
		},
	},

	faraday: {
		src: `${DIR}/faraday-induction.png`,
		srcset: `${DIR}/faraday-induction-480.webp 480w, ${DIR}/faraday-induction-960.webp 826w`,
		width: 826,
		height: 625,
		fit: 'contain',
		alt: 'Gravure de l’expérience d’induction électromagnétique de Faraday : une bobine plongée dans une autre bobine, reliée à une pile et à un galvanomètre',
		caption: 'L’expérience d’induction de Faraday (1831), gravure de J. Lambert (1892)',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Induction_experiment.png',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Induction_experiment.png',
			author: 'J. Lambert, in A. W. Poyser, Magnetism and Electricity (1892)',
			license: 'Domaine public',
			attributionRequired: false,
			description: "Drawing of Michael Faraday's 1831 experiment showing electromagnetic induction between coils of wire, from an 1892 textbook.",
		},
	},

	galois: {
		src: `${DIR}/galois-manuscript.jpg`,
		srcset: `${DIR}/galois-manuscript-480.webp 480w, ${DIR}/galois-manuscript-960.webp 960w`,
		width: 1030,
		height: 1600,
		fit: 'contain',
		alt: 'Page des manuscrits d’Évariste Galois : théorèmes sur les groupes de substitutions et les équations algébriques, dont « Aucune équation algébrique de degré supérieur à 4 ne saurait se résoudre »',
		caption: 'Manuscrits d’Évariste Galois, éd. Jules Tannery (1908), p. 40 — transcription des papiers inédits',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Galois_-_Manuscrits,_%C3%A9dition_Tannery,_1908.djvu',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Galois_-_Manuscrits%2C_%C3%A9dition_Tannery%2C_1908.djvu',
			author: 'Évariste Galois (éd. Jules Tannery)',
			license: 'Domaine public',
			attributionRequired: false,
			description: 'Manuscrits de Évariste Galois, publiés par Jules Tannery, Gauthier-Villars, 1908 (DjVu page 47, printed page 40). Digitised by Google Books.',
		},
	},

	galoisPortrait: {
		src: `${DIR}/galois-portrait.jpg`,
		srcset: `${DIR}/galois-portrait-480.webp 480w, ${DIR}/galois-portrait.jpg 601w`,
		width: 601,
		height: 857,
		fit: 'cover',
		alt: 'Portrait dessiné d’Évariste Galois jeune, cheveux bouclés, en redingote',
		caption: 'Évariste Galois, par son frère Alfred Galois (Magasin pittoresque, 1848)',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Galois-1848.jpg',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Galois-1848.jpg',
			author: 'Alfred Galois',
			license: 'Domaine public',
			attributionRequired: false,
			description: 'Portrait of Évariste Galois by his younger brother Alfred, published in Magasin pittoresque in 1848.',
		},
	},

	foucault: {
		src: `${DIR}/foucault-pendulum.jpg`,
		srcset: `${DIR}/foucault-pendulum-480.webp 480w, ${DIR}/foucault-pendulum-960.webp 960w`,
		width: 1280,
		height: 960,
		fit: 'cover',
		position: 'center 18%',
		alt: 'Le pendule de Foucault au Panthéon de Paris : la sphère oscille au-dessus d’un cadran gradué posé au sol',
		caption: 'Le pendule de Foucault au Panthéon de Paris (photographie, 2023)',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Foucault_pendulum_at_Panth%C3%A9on_de_Paris,_August_2023.JPG',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/66/Foucault_pendulum_at_Panth%C3%A9on_de_Paris%2C_August_2023.JPG',
			author: 'Benoît Prieur',
			license: 'CC0',
			attributionRequired: false,
			description: 'Foucault pendulum at Panthéon de Paris, August 2023.',
		},
	},

	darwin: {
		src: `${DIR}/darwin-tree.jpg`,
		srcset: `${DIR}/darwin-tree-480.webp 480w, ${DIR}/darwin-tree-960.webp 960w`,
		width: 1600,
		height: 1247,
		fit: 'contain',
		alt: 'Diagramme ramifié de Charles Darwin : des lignées issues d’ancêtres communs divergent et se ramifient au fil des générations',
		caption: 'L’unique figure de L’Origine des espèces (1re éd., 1859), pp. 116–117',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:On_the_Origin_of_Species_diagram.PNG',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/On_the_Origin_of_Species_diagram.PNG',
			author: 'Charles Darwin',
			license: 'Domaine public',
			attributionRequired: false,
			description: "The only illustration in Charles Darwin's 1859 On the Origin of Species, showing the divergence of species.",
		},
	},

	mendel: {
		src: `${DIR}/mendel-peas.png`,
		srcset: `${DIR}/mendel-peas-480.webp 480w, ${DIR}/mendel-peas.png 905w`,
		width: 905,
		height: 373,
		fit: 'contain',
		alt: 'Tableau illustré des sept caractères du pois étudiés par Mendel : forme et couleur de la graine, couleur de la fleur, forme et couleur de la gousse, position des fleurs, taille de la tige',
		caption: 'Les caractères du pois étudiés par Mendel (illustration moderne, 2015)',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Mendels_peas.png',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Mendels_peas.png',
			author: 'Mariana Ruiz (LadyofHats)',
			license: 'CC0',
			attributionRequired: false,
			description: 'The characteristics of the pea plants studied by Gregor Mendel.',
		},
	},

	mendelPaper: {
		src: `${DIR}/mendel-paper.jpg`,
		srcset: `${DIR}/mendel-paper-480.webp 480w, ${DIR}/mendel-paper-960.webp 800w`,
		width: 800,
		height: 1274,
		fit: 'contain',
		alt: 'Première page imprimée de l’article de Gregor Mendel « Versuche über Pflanzen-Hybriden » (1865)',
		caption: '« Versuche über Pflanzen-Hybriden », Verhandlungen des naturforschenden Vereines in Brünn, 1865',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Mendel_paper.jpg',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Mendel_paper.jpg',
			author: 'Gregor Mendel',
			license: 'Domaine public',
			attributionRequired: false,
			description: 'First text page of Mendel\'s "Versuche über Pflanzen-Hybriden", Verhandlungen des naturforschenden Vereines in Brünn, Band IV (1865).',
		},
	},

	mendeleev: {
		// PNG palette (32 Ko en pleine résolution) : plus léger que toute variante WebP
		src: `${DIR}/mendeleev-periodic-table.png`,
		width: 1067,
		height: 1312,
		fit: 'contain',
		alt: 'Tableau périodique de Mendeleïev de 1869, en russe : les éléments sont rangés en colonnes par masse atomique, avec des points d’interrogation pour les éléments prédits',
		caption: 'Опыт системы элементов — le tableau périodique de Mendeleïev (1869)',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Mendeleev%27s_1869_periodic_table.png',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Mendeleev%27s_1869_periodic_table.png',
			author: 'Dmitri Mendeleïev',
			license: 'Domaine public',
			attributionRequired: false,
			description: "Facsimile of Mendeleev's 1869 periodic table of the elements.",
		},
	},

	maxwell: {
		src: `${DIR}/maxwell-electromagnetic-fields.jpg`,
		srcset: `${DIR}/maxwell-electromagnetic-fields-480.webp 464w`,
		width: 464,
		height: 727,
		fit: 'contain',
		alt: 'Planche du Traité de Maxwell : lignes de force et surfaces équipotentielles autour d’une sphère électrisée',
		caption: 'A Treatise on Electricity and Magnetism (1873), fig. V',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Treatise_on_Electricity_and_Magnetism_Fig_05.jpg',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Treatise_on_Electricity_and_Magnetism_Fig_05.jpg',
			author: 'James Clerk Maxwell',
			license: 'Domaine public',
			attributionRequired: false,
			description: 'Lines of force and equipotential surfaces in a diametral section of a spherical surface in which the superficial density is a harmonic of the first degree.',
		},
	},
} satisfies Record<string, TimelineItemImage>;
