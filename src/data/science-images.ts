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
	revuesScientifiques: {
		src: `${DIR}/philosophical-transactions-1665.jpg`,
		srcset: `${DIR}/philosophical-transactions-1665-480.webp 480w, ${DIR}/philosophical-transactions-1665-960.webp 960w`,
		width: 1200,
		height: 1659,
		fit: 'contain',
		alt: 'Page de titre imprimée du premier volume des Philosophical Transactions (1665) de la Royal Society de Londres',
		caption: 'Page de titre du premier volume des Philosophical Transactions (1665), Royal Society de Londres',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Philosophical_Transactions_of_the_Royal_Society_cover.jpg',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Philosophical_Transactions_of_the_Royal_Society_cover.jpg',
			author: 'Royal Society of London',
			license: 'Domaine public',
			attributionRequired: false,
			description: 'Title page of the first volume of the Philosophical Transactions of the Royal Society, published in London in 1665.',
		},
	},

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

	lamarckGirafes: {
		src: `${DIR}/lamarck-girafes.jpg`,
		srcset: `${DIR}/lamarck-girafes-480.webp 480w, ${DIR}/lamarck-girafes.jpg 600w`,
		width: 600,
		height: 278,
		fit: 'contain',
		alt: 'Dessin explicatif de l’exemple lamarckien de la girafe : quatre girafes successives tendent le cou vers des feuilles de plus en plus hautes, des flèches indiquant l’allongement progressif du cou',
		caption: 'L’exemple de la girafe selon Lamarck : l’usage répété allongerait le cou, caractère transmis à la descendance (dessin explicatif moderne, 2015)',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Dibujo_explicativo.jpg',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Dibujo_explicativo.jpg',
			author: 'Sandritaverooka',
			license: 'CC BY-SA 4.0',
			licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
			attributionRequired: true,
			attribution: 'Sandritaverooka',
			description: 'Dibujo explicativo (illustration of Lamarckian inheritance with giraffes), own work by Sandritaverooka, 2015-06-10, CC BY-SA 4.0.',
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
		src: `${DIR}/faraday-cage.jpg`,
		srcset: `${DIR}/faraday-cage-480.webp 480w, ${DIR}/faraday-cage-960.webp 960w`,
		width: 1044,
		height: 1280,
		fit: 'contain',
		alt: 'Dans la pénombre, un arc électrique bleu jaillit d’une tige métallique vers la main d’une femme debout à l’intérieur d’une cage grillagée cylindrique, qui la protège de la décharge',
		caption: 'Une cage de Faraday en démonstration : les occupantes restent protégées d’un arc de bobine Tesla de plusieurs centaines de milliers de volts',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Cage_de_Faraday.jpg',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Cage_de_Faraday.jpg',
			author: 'Antoine Taveneaux',
			license: 'CC BY-SA 3.0',
			attributionRequired: true,
			description: 'A Faraday cage in operation. The arc from a Tesla coil at hundreds of thousands of volts.',
		},
	},

	galois: {
		src: `${DIR}/rubik-cube.jpg`,
		srcset: `${DIR}/rubik-cube-480.webp 480w, ${DIR}/rubik-cube-960.webp 960w`,
		width: 960,
		height: 1000,
		fit: 'contain',
		alt: 'Rubik’s Cube aux faces colorées : ses mouvements forment un groupe de permutations, structure algébrique issue de la théorie de Galois',
		caption: 'Le Rubik’s Cube, exemple moderne de groupe de permutations (illustration vectorielle, 2006)',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Rubik%27s_cube.svg',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Rubik%27s_cube.svg',
			author: 'Booyabazooka',
			license: 'CC BY-SA 3.0',
			licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
			attributionRequired: true,
			attribution: 'Booyabazooka',
			description: 'Rubik’s Cube, illustration vectorielle par Booyabazooka (2006-11-30), d’après File:Rubiks cube.jpg. CC BY-SA 3.0 (relicence GFDL). Rendu PNG 960 px.',
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

	darwinHornet: {
		src: `${DIR}/darwin-hornet-1871.jpg`,
		srcset: `${DIR}/darwin-hornet-1871-480.webp 480w, ${DIR}/darwin-hornet-1871-960.webp 960w`,
		width: 1189,
		height: 1600,
		fit: 'contain',
		alt: 'Caricature de Charles Darwin, tête de vieillard à longue barbe blanche posée sur un corps de singe, accroupi sur une branche devant un feuillage',
		caption: '« A Venerable Orang-outang », caricature de Darwin parue dans The Hornet (22 mars 1871)',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Editorial_cartoon_depicting_Charles_Darwin_as_an_ape_(1871).jpg',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Editorial_cartoon_depicting_Charles_Darwin_as_an_ape_%281871%29.jpg',
			author: 'Anonyme (The Hornet)',
			license: 'Domaine public',
			attributionRequired: false,
			description: '« A Venerable Orang-outang », caricature de Charles Darwin en singe publiée dans le magazine satirique The Hornet, 22 mars 1871 (University College London Digital Collections).',
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

	mendeleevTableauModerne: {
		src: `${DIR}/periodic-table-fr.png`,
		srcset: `${DIR}/periodic-table-fr-480.webp 480w, ${DIR}/periodic-table-fr-960.webp 960w`,
		width: 1600,
		height: 1024,
		fit: 'contain',
		alt: 'Tableau périodique moderne en français : les 118 éléments répartis en 18 groupes et 7 périodes, colorés par famille (alcalins, métaux de transition, halogènes, gaz nobles…), lanthanides et actinides sous le tableau',
		caption: 'Le tableau périodique des éléments aujourd’hui : 118 éléments, héritiers de la classification de Mendeleïev',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Tableau_p%C3%A9riodique_des_%C3%A9l%C3%A9ments.svg',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Tableau_p%C3%A9riodique_des_%C3%A9l%C3%A9ments.svg',
			author: 'Scaler, Michka B',
			license: 'CC BY-SA 3.0',
			attributionRequired: true,
			description: 'Tableau périodique des éléments (avec liens vers Wikipédia en français).',
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
