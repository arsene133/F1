import type { TimelineItemImage } from './timeline';

// --------------------------------------------------------------------------
// Iconographie des jalons industriels : la machine, le procédé ou l’événement plutôt que l’inventeur
// Fichiers servis localement depuis public/images/timeline/industry/
// (aucun lien direct vers Wikimedia Commons à l'exécution).
// Licences vérifiées sur les pages Commons le 2026-10-08.
// Variantes : <nom>-480.webp / <nom>-960.webp + fichier de repli <nom>.jpg (≤ 1600 px).
// --------------------------------------------------------------------------

const DIR = '/images/timeline/industry';
const COMMONS = 'Wikimedia Commons';

export const industryImages = {
	watt: {
		src: `${DIR}/watt-steam-engine.jpg`,
		srcset: `${DIR}/watt-steam-engine-480.webp 480w, ${DIR}/watt-steam-engine-960.webp 960w`,
		width: 1600,
		height: 1125,
		fit: 'contain',
		alt: 'Maquette d’une machine à vapeur de Watt : balancier noir, colonnes, cylindres et condenseur en verre, régulateur à boules et grand volant',
		caption: 'Maquette de la machine à vapeur à double effet de James Watt',
		credit: {
			source: 'Lelivrescolaire.fr',
			sourceUrl: 'https://assets.lls.fr/pages/6614408/SES.1re.2.VER.machine.a.vapeur-retouche.jpg',
			fileUrl: 'https://assets.lls.fr/pages/6614408/SES.1re.2.VER.machine.a.vapeur-retouche.jpg',
			author: 'Inconnu',
			license: 'Droits réservés',
			attributionRequired: true,
			description: 'Photographie d’une maquette de machine à vapeur de Watt (manuel SES 1re, Lelivrescolaire.fr).',
		},
	},

	stockton: {
		src: `${DIR}/stockton-darlington-opening.jpg`,
		srcset: `${DIR}/stockton-darlington-opening-480.webp 480w, ${DIR}/stockton-darlington-opening-960.webp 960w`,
		width: 1600,
		height: 788,
		fit: 'contain',
		alt: 'Gravure de l’inauguration de la ligne Stockton–Darlington : la locomotive et son convoi franchissent le pont sur la Skerne devant une foule',
		caption: 'Inauguration du chemin de fer de Stockton à Darlington, 1825 — gravure, Popular Science Monthly, vol. 12 (1877–1878)',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:PSM_V12_D282_Opening_of_the_darlington_and_stockton_railroad_1825.jpg',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/PSM_V12_D282_Opening_of_the_darlington_and_stockton_railroad_1825.jpg',
			author: 'Anonyme, Popular Science Monthly',
			license: 'Domaine public',
			attributionRequired: false,
			description: 'Opening of the Darlington and Stockton railroad 1825. Popular Science Monthly, volume 12 (1877–1878).',
		},
	},

	liverpool: {
		src: `${DIR}/liverpool-manchester-opening.jpg`,
		srcset: `${DIR}/liverpool-manchester-opening-480.webp 480w, ${DIR}/liverpool-manchester-opening-960.webp 960w`,
		width: 1600,
		height: 1161,
		fit: 'contain',
		alt: 'Gravure de l’ouverture de la ligne Liverpool–Manchester : locomotive et voitures chargées de voyageurs sous l’arche mauresque d’Edge Hill, devant la foule',
		caption: 'Isaac Shaw, Opening of the Liverpool and Manchester Railway (1830), Yale Center for British Art',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Isaac_Shaw_-_Opening_of_the_Liverpool_and_Manchester_Railway_-_B1981.25.2698_-_Yale_Center_for_British_Art.jpg',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/db/Isaac_Shaw_-_Opening_of_the_Liverpool_and_Manchester_Railway_-_B1981.25.2698_-_Yale_Center_for_British_Art.jpg',
			author: 'Isaac Shaw',
			license: 'CC0',
			attributionRequired: false,
			description: 'Isaac Shaw, Opening of the Liverpool and Manchester Railway, 1830. Yale Center for British Art, Paul Mellon Collection, B1981.25.2698.',
		},
	},

	parisSaintGermain: {
		src: `${DIR}/paris-saint-germain-embarcadere.jpg`,
		srcset: `${DIR}/paris-saint-germain-embarcadere-480.webp 480w, ${DIR}/paris-saint-germain-embarcadere-960.webp 960w`,
		width: 1153,
		height: 971,
		fit: 'contain',
		alt: 'Lithographie de l’embarcadère du chemin de fer de Paris à Saint-Germain près de la place de l’Europe : tranchée, tunnels et convoi de voyageurs',
		caption: 'Jean-Baptiste Arnout, Vue du chemin de fer de Paris à Saint-Germain — point de départ, place de l’Europe (vers 1837), BnF',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:CFParisSaintGermainPointdeD%C3%A9partPlacedeEurope.jpg',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/62/CFParisSaintGermainPointdeD%C3%A9partPlacedeEurope.jpg',
			author: 'Jean-Baptiste Arnout',
			license: 'Domaine public',
			attributionRequired: false,
			description: 'Vue du chemin de fer de Paris à St Germain, point de départ place de l’Europe. Estampe dessinée par Jean-Baptiste Arnout, imprimée par Lemercier, vers 1837. Gallica btv1b8456668z.',
		},
	},

	crystalPalace: {
		src: `${DIR}/crystal-palace-1851.jpg`,
		srcset: `${DIR}/crystal-palace-1851-480.webp 480w, ${DIR}/crystal-palace-1851-960.webp 960w`,
		width: 1600,
		height: 865,
		fit: 'contain',
		alt: 'Chromolithographie du Crystal Palace dans Hyde Park, immense nef de fer et de verre vue depuis le nord-est, avec promeneurs sur la pelouse',
		caption: 'Le Crystal Palace vu du nord-est, Dickinson’s Comprehensive Pictures of the Great Exhibition of 1851 (1852–1854)',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Crystal_Palace_from_the_northeast_from_Dickinson%27s_Comprehensive_Pictures_of_the_Great_Exhibition_of_1851._1854.jpg',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Crystal_Palace_from_the_northeast_from_Dickinson%27s_Comprehensive_Pictures_of_the_Great_Exhibition_of_1851._1854.jpg',
			author: 'Dickinson Brothers',
			license: 'Domaine public',
			attributionRequired: false,
			description: 'The Crystal Palace from the northeast during the Great Exhibition of 1851. Dickinsons’ Comprehensive Pictures of the Great Exhibition of 1851.',
		},
	},

	bessemer: {
		src: `${DIR}/bessemer-converter.jpg`,
		srcset: `${DIR}/bessemer-converter-480.webp 480w, ${DIR}/bessemer-converter-960.webp 960w`,
		width: 1600,
		height: 1517,
		fit: 'contain',
		alt: 'Dessin technique en coupe d’un convertisseur Bessemer : cornue d’acier basculante sur pivots, avec soufflerie et mécanisme d’inclinaison',
		caption: 'Convertisseur Bessemer (« Bessemerbirne »), planche du Meyers Konversations-Lexikon (6e éd., 1902–1908)',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bessemerbirne.jpg',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Bessemerbirne.jpg',
			author: 'Meyers Konversations-Lexikon',
			license: 'Domaine public',
			attributionRequired: false,
			description: 'Bessemerbirne, Meyers Konversations-Lexikon, 6. Auflage (1902–1908).',
		},
	},

	gramme: {
		src: `${DIR}/gramme-dynamo.jpg`,
		srcset: `${DIR}/gramme-dynamo-480.webp 480w`,
		width: 658,
		height: 656,
		fit: 'contain',
		alt: 'Gravure d’une machine de Gramme : anneau induit monté entre les pôles d’un grand aimant, entraîné par une manivelle et un volant',
		caption: 'Machine magnéto-électrique de Gramme, gravure parue dans H. Fontaine, Electric Lighting (1878)',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Gramme_dynamo.png',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Gramme_dynamo.png',
			author: 'Hippolyte Fontaine (1878)',
			license: 'Domaine public',
			attributionRequired: false,
			description: 'Drawing of a Gramme dynamo, from Hippolyte Fontaine (1878) Electric Lighting: A Practical Treatise, p. 86, fig. 30.',
		},
	},

	grammePhoto: {
		src: `${DIR}/gramme-machine-photo.jpg`,
		srcset: `${DIR}/gramme-machine-photo-480.webp 480w, ${DIR}/gramme-machine-photo-960.webp 960w`,
		width: 1067,
		height: 1600,
		fit: 'contain',
		alt: 'Photographie d’une machine de Gramme conservée en musée : aimant en fer à cheval, anneau induit et manivelle',
		caption: 'Machine de Gramme conservée (photographie, 2007)',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:GrammeMachine.jpg',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/84/GrammeMachine.jpg',
			author: 'Tamorlan',
			license: 'Domaine public',
			attributionRequired: false,
			description: 'The Gramme machine or Gramme dynamo, electrical generator designed by Zénobe Gramme in 1871. Photograph released into the public domain by its author.',
		},
	},

	otto: {
		src: `${DIR}/otto-gas-engine.jpg`,
		srcset: `${DIR}/otto-gas-engine-480.webp 480w, ${DIR}/otto-gas-engine-960.webp 960w`,
		width: 1600,
		height: 1118,
		fit: 'contain',
		alt: 'Gravure d’un moteur à gaz Otto horizontal à quatre temps : cylindre couché, distribution latérale et grand volant',
		caption: 'Moteur à gaz Otto à quatre temps (construction américaine sous licence), Popular Science Monthly, vol. 18 (1880–1881)',
		credit: {
			source: COMMONS,
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:PSM_V18_D500_An_american_internal_combustion_otto_engine.jpg',
			fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/PSM_V18_D500_An_american_internal_combustion_otto_engine.jpg',
			author: 'Anonyme, Popular Science Monthly',
			license: 'Domaine public',
			attributionRequired: false,
			description: 'An American internal combustion Otto engine. Popular Science Monthly, volume 18 (1880–1881).',
		},
	},
} satisfies Record<string, TimelineItemImage>;
