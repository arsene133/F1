import type { TimelineItemImage } from './timeline';

// --------------------------------------------------------------------------
// Iconographie des jalons de peinture
// Fichiers servis localement depuis public/images/timeline/painting/
// (aucun lien distant vers Wikimedia Commons à l'exécution).
// Licences vérifiées sur les pages sources le 2026-10-08.
// Toutes les œuvres et reproductions sont en Domaine Public (art. L123-1 CPI / PD-Art / PD-old-70).
// --------------------------------------------------------------------------

const DIR = '/images/timeline/painting';
const COMMONS = 'Wikimedia Commons';

export const paintingImages = {
	davidSerment: {
		src: `${DIR}/david-serment-jeu-paume.jpg`,
		srcset: `${DIR}/david-serment-jeu-paume-480.webp 480w, ${DIR}/david-serment-jeu-paume-960.webp 960w`,
		width: 1600,
		height: 1046,
		fit: 'contain',
		alt: 'Le Serment du Jeu de paume par Jacques-Louis David, 1791 : les députés du tiers état et leurs alliés prêtent serment bras levés dans la salle du Jeu de paume à Versailles',
		caption: 'Jacques-Louis David, Le Serment du Jeu de paume (1791, esquisse), Musée du Château de Versailles',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Le_Serment_du_Jeu_de_paume.jpg',
			author: 'Jacques-Louis David',
			license: 'Domaine public',
			attributionRequired: false,
			attribution: 'Jacques-Louis David, Le Serment du Jeu de paume, 1791',
			description: 'Esquisse à la plume et au lavis conservée au Musée national des châteaux de Versailles et de Trianon.',
		},
	},

	davidMarat: {
		src: `${DIR}/david-mort-marat.jpg`,
		srcset: `${DIR}/david-mort-marat-480.webp 480w, ${DIR}/david-mort-marat-960.webp 960w`,
		width: 1243,
		height: 1600,
		fit: 'contain',
		alt: 'La Mort de Marat par Jacques-Louis David, 1793 : Jean-Paul Marat assassiné dans sa baignoire tenant une plume et une lettre de Charlotte Corday',
		caption: 'Jacques-Louis David, La Mort de Marat (1793), Musées royaux des Beaux-Arts de Belgique',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Death_of_Marat_by_David.jpg',
			author: 'Jacques-Louis David',
			license: 'Domaine public',
			attributionRequired: false,
			attribution: 'Jacques-Louis David, La Mort de Marat, 1793',
			description: 'Huile sur toile, Musées royaux des Beaux-Arts de Belgique (Bruxelles).',
		},
	},

	gericaultMeduse: {
		src: `${DIR}/gericault-radeau-meduse.jpg`,
		srcset: `${DIR}/gericault-radeau-meduse-480.webp 480w, ${DIR}/gericault-radeau-meduse-960.webp 960w`,
		width: 1600,
		height: 1092,
		fit: 'contain',
		alt: 'Le Radeau de la Méduse par Théodore Géricault, 1819 : rescapés épuisés et agonisants amassés sur un radeau de fortune apercevant un navire à l’horizon',
		caption: 'Théodore Géricault, Le Radeau de la Méduse (1819), Musée du Louvre',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:JEAN_LOUIS_TH%C3%89ODORE_G%C3%89RICAULT_-_La_Balsa_de_la_Medusa_(Museo_del_Louvre,_1818-19).jpg',
			author: 'Théodore Géricault',
			license: 'Domaine public',
			attributionRequired: false,
			attribution: 'Théodore Géricault, Le Radeau de la Méduse, 1819',
			description: 'Huile sur toile monumentale (491 × 716 cm), Musée du Louvre, Paris.',
		},
	},

	delacroixLiberte: {
		src: `${DIR}/delacroix-liberte-guidant-peuple.jpg`,
		srcset: `${DIR}/delacroix-liberte-guidant-peuple-480.webp 480w, ${DIR}/delacroix-liberte-guidant-peuple-960.webp 960w`,
		width: 1600,
		height: 1284,
		fit: 'contain',
		alt: 'La Liberté guidant le peuple par Eugène Delacroix, 1830 : figure allégorique coiffée du bonnet phrygien brandissant le drapeau tricolore sur une barricade parisienne',
		caption: 'Eugène Delacroix, Le 28 Juillet. La Liberté guidant le peuple (1830), Musée du Louvre',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Eug%C3%A8ne_Delacroix_-_Le_28_Juillet._La_Libert%C3%A9_guidant_le_peuple.jpg',
			author: 'Eugène Delacroix',
			license: 'Domaine public',
			attributionRequired: false,
			attribution: 'Eugène Delacroix, La Liberté guidant le peuple, 1830',
			description: 'Huile sur toile, Musée du Louvre, Paris. Reproduction certifiée Domaine public.',
		},
	},

	courbetOrnans: {
		src: `${DIR}/courbet-enterrement-ornans.jpg`,
		srcset: `${DIR}/courbet-enterrement-ornans-480.webp 480w, ${DIR}/courbet-enterrement-ornans-960.webp 960w`,
		width: 1600,
		height: 735,
		fit: 'contain',
		alt: 'Un enterrement à Ornans par Gustave Courbet, 1850 : fresque austère d’habitants d’un village franc-comtois rassemblés autour d’une fosse ouverte',
		caption: 'Gustave Courbet, Un enterrement à Ornans (1849–1850), Musée d’Orsay',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Gustave_Courbet_-_A_Burial_at_Ornans_-_Google_Art_Project.jpg',
			author: 'Gustave Courbet',
			license: 'Domaine public',
			attributionRequired: false,
			attribution: 'Gustave Courbet, Un enterrement à Ornans, 1849–1850',
			description: 'Huile sur toile monumentale (315 × 668 cm), Musée d’Orsay, Paris.',
		},
	},

	milletGlaneuses: {
		src: `${DIR}/millet-glaneuses.jpg`,
		srcset: `${DIR}/millet-glaneuses-480.webp 480w, ${DIR}/millet-glaneuses-960.webp 960w`,
		width: 1600,
		height: 1197,
		fit: 'contain',
		alt: 'Des glaneuses par Jean-François Millet, 1857 : trois paysannes courbées dans un champ moissonné ramassant les épis de blé tombés à terre',
		caption: 'Jean-François Millet, Des glaneuses (1857), Musée d’Orsay',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Jean-Fran%C3%A7ois_Millet_-_Gleaners_-_Google_Art_Project_2.jpg',
			author: 'Jean-François Millet',
			license: 'Domaine public',
			attributionRequired: false,
			attribution: 'Jean-François Millet, Des glaneuses, 1857',
			description: 'Huile sur toile, Musée d’Orsay, Paris.',
		},
	},

	manetDejeuner: {
		src: `${DIR}/manet-dejeuner-herbe.jpg`,
		srcset: `${DIR}/manet-dejeuner-herbe-480.webp 480w, ${DIR}/manet-dejeuner-herbe-960.webp 960w`,
		width: 1600,
		height: 1243,
		fit: 'contain',
		alt: 'Le Déjeuner sur l’herbe par Édouard Manet, 1863 : femme nue assise en compagnie de deux hommes habillés en tenue de ville moderne dans un sous-bois',
		caption: 'Édouard Manet, Le Déjeuner sur l’herbe (1863), Musée d’Orsay',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Edouard_Manet_-_Luncheon_on_the_Grass_-_Google_Art_Project.jpg',
			author: 'Édouard Manet',
			license: 'Domaine public',
			attributionRequired: false,
			attribution: 'Édouard Manet, Le Déjeuner sur l’herbe, 1863',
			description: 'Huile sur toile présentée au Salon des refusés de 1863, Musée d’Orsay, Paris.',
		},
	},

	monetImpression: {
		src: `${DIR}/monet-impression-soleil-levant.jpg`,
		srcset: `${DIR}/monet-impression-soleil-levant-480.webp 480w, ${DIR}/monet-impression-soleil-levant-960.webp 960w`,
		width: 1600,
		height: 1245,
		fit: 'contain',
		alt: 'Impression, soleil levant par Claude Monet, 1872 : soleil orange perçant les brumes bleutées du port du Havre au lever du jour',
		caption: 'Claude Monet, Impression, soleil levant (1872), Musée Marmottan Monet',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Claude_Monet,_Impression,_soleil_levant.jpg',
			author: 'Claude Monet',
			license: 'Domaine public',
			attributionRequired: false,
			attribution: 'Claude Monet, Impression, soleil levant, 1872',
			description: 'Huile sur toile, Musée Marmottan Monet, Paris. Peinture fondatrice de l’Impressionnisme.',
		},
	},

	monetMeule: {
		src: `${DIR}/monet-meule-soleil-couchant-1891.jpg`,
		srcset: `${DIR}/monet-meule-soleil-couchant-1891-480.webp 480w, ${DIR}/monet-meule-soleil-couchant-1891-960.webp 960w`,
		width: 1600,
		height: 1259,
		fit: 'contain',
		alt: 'Meule, soleil couchant par Claude Monet, 1891 : une meule de blé embrasée de rouge et d’orangé se détache sur un ciel jaune et rose au soleil couchant, au-dessus d’une campagne noyée de lumière',
		caption: 'Claude Monet, Meule, soleil couchant (1891), Museum of Fine Arts, Boston',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Graystaks_I.JPG',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Claude_Monet_-_Graystaks_I.JPG',
			author: 'Claude Monet',
			license: 'Domaine public',
			attributionRequired: false,
			attribution: 'Claude Monet, Meule, soleil couchant, 1891',
			description: 'Huile sur toile (Wildenstein 1289), Museum of Fine Arts, Boston, Juliana Cheney Edwards Collection. Série des Meules (1890–1891), postérieure à l’exposition de 1874 (PD-Art, PD-old).',
		},
	},

	expositionImpressionniste: {
		src: `${DIR}/premiere-exposition-impressionniste-1874.jpg`,
		srcset: `${DIR}/premiere-exposition-impressionniste-1874-480.webp 480w, ${DIR}/premiere-exposition-impressionniste-1874-960.webp 960w`,
		width: 983,
		height: 1474,
		fit: 'contain',
		alt: 'Catalogue original de la Première exposition de la Société anonyme des artistes peintres, sculpteurs, graveurs (1874) au 35 boulevard des Capucines',
		caption: 'Catalogue de la 1re exposition de la Société anonyme des artistes (1874), imprimerie Alcan-Lévy (BnF Gallica)',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Premi%C3%A8re_Exposition_1874,_35_Boulevard_des_Capucines_Catalogue.jpg',
			author: 'Société anonyme des artistes / Alcan-Lévy',
			license: 'Domaine public',
			attributionRequired: false,
			attribution: 'Catalogue de la Première exposition, 1874 — BnF Gallica',
			description: 'Couverture du livret de la première exposition impressionniste tenue dans les anciens ateliers de Nadar à Paris.',
		},
	},
} satisfies Record<string, TimelineItemImage>;
