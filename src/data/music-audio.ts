import type { TimelineItemAudioEmbedded, TimelineItemAudioExternal } from './timeline';

// --------------------------------------------------------------------------
// Extraits audio des jalons musicaux
// Lecture à la demande depuis Wikimedia Commons (preload="none" côté lecteur) :
// aucun fichier audio n'est copié dans le dépôt.
// `url` pointe vers le transcodage MP3 généré par Commons (lisible par tous les
// navigateurs) ; `fileUrl` conserve le fichier original déposé.
// Licences vérifiées sur les pages sources (modèles de licence de Commons) le 2026-10-08.
// Toutes les compositions sont dans le domaine public (compositeurs morts avant 1884) ;
// les droits indiqués ci-dessous portent sur l'enregistrement et l'interprétation.
// --------------------------------------------------------------------------

const COMMONS = 'Wikimedia Commons';
const CC0_URL = 'https://creativecommons.org/publicdomain/zero/1.0/deed.fr';
const CC_BY_SA_4_URL = 'https://creativecommons.org/licenses/by-sa/4.0/deed.fr';

export const musicAudio = {
	beethovenSymphonie1: {
		type: 'embedded',
		title: 'Ier mouvement — Adagio molto, Allegro con brio',
		excerpt: 'Ier mouvement (ouverture sur l’accord de septième dissonant)',
		url: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/f/f4/Symphony_No._1_in_C_-_I._Adagio_molto%2C_Allegro_con_brio_-_Chamber_Orchestra_-_United_States_Marine_Band.opus/Symphony_No._1_in_C_-_I._Adagio_molto%2C_Allegro_con_brio_-_Chamber_Orchestra_-_United_States_Marine_Band.opus.mp3',
		mimeType: 'audio/mpeg',
		fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Symphony_No._1_in_C_-_I._Adagio_molto%2C_Allegro_con_brio_-_Chamber_Orchestra_-_United_States_Marine_Band.opus',
		source: COMMONS,
		sourceUrl: 'https://commons.wikimedia.org/wiki/File:Symphony_No._1_in_C_-_I._Adagio_molto,_Allegro_con_brio_-_Chamber_Orchestra_-_United_States_Marine_Band.opus',
		license: 'Domaine public',
		performer: 'Marine Chamber Orchestra (United States Marine Band), dir. Ryan J. Nowlin',
		recordingDate: '2019',
		duration: '9:41',
		attributionRequired: false,
		rightsNote: 'Interprétation et enregistrement par une formation militaire fédérale américaine : œuvre du gouvernement des États-Unis (PD-USGov-Military-Marines).',
	},

	beethovenSymphonie3: {
		type: 'embedded',
		title: 'Ier mouvement — Allegro con brio',
		excerpt: 'Ier mouvement (deux accords de mi bémol majeur en ouverture)',
		url: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/9/99/Beethoven_-_Symphony_No._3_in_E_flat_major%2C_Op._55_%27Eroica%27_-_I._Allegro_con_brio_%28Musopen_Symphony%29.flac/Beethoven_-_Symphony_No._3_in_E_flat_major%2C_Op._55_%27Eroica%27_-_I._Allegro_con_brio_%28Musopen_Symphony%29.flac.mp3',
		mimeType: 'audio/mpeg',
		fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Beethoven_-_Symphony_No._3_in_E_flat_major%2C_Op._55_%27Eroica%27_-_I._Allegro_con_brio_%28Musopen_Symphony%29.flac',
		source: COMMONS,
		sourceUrl: "https://commons.wikimedia.org/wiki/File:Beethoven_-_Symphony_No._3_in_E_flat_major,_Op._55_'Eroica'_-_I._Allegro_con_brio_(Musopen_Symphony).flac",
		license: 'Domaine public',
		performer: 'Orchestre symphonique national tchèque (« Musopen Symphony »)',
		recordingDate: '2012',
		duration: '15:11',
		attributionRequired: false,
		rightsNote: 'Enregistrement placé dans le domaine public par Musopen (PD-author).',
	},

	berliozSymphonieFantastique: {
		type: 'embedded',
		title: 'IIe mouvement, « Un bal » (extrait)',
		excerpt: 'IIe mouvement, « Un bal » (valse)',
		url: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Hector_Berlioz_Symphonie_fantastique_2nd_movement_excerpt.mp3',
		mimeType: 'audio/mpeg',
		fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Hector_Berlioz_Symphonie_fantastique_2nd_movement_excerpt.mp3',
		source: COMMONS,
		sourceUrl: 'https://commons.wikimedia.org/wiki/File:Hector_Berlioz_Symphonie_fantastique_2nd_movement_excerpt.mp3',
		license: 'CC BY-SA 4.0',
		licenseUrl: CC_BY_SA_4_URL,
		performer: 'hr-Sinfonieorchester (Frankfurt Radio Symphony), dir. Hugh Wolff',
		recordingDate: '15 septembre 2000',
		duration: '3:02',
		attributionRequired: true,
		attribution: 'hr-Sinfonieorchester, dir. Hugh Wolff — Hessischer Rundfunk',
		rightsNote: 'Enregistrement publié sous CC BY-SA 4.0 par le Hessischer Rundfunk (autorisation VRT n° 2020111210010443).',
	},

	chopinOeuvresPiano: {
		type: 'embedded',
		title: 'un exemple, le Nocturne en mi bémol majeur, op. 9 n° 2',
		excerpt: 'Exemple représentatif : Nocturne op. 9 n° 2 (publié en 1832)',
		url: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/8/89/Chopin_-_Nocturne_No._2_in_E-flat_major%2C_Op._9_No._2_%28Frank_Levy%29.flac/Chopin_-_Nocturne_No._2_in_E-flat_major%2C_Op._9_No._2_%28Frank_Levy%29.flac.mp3',
		mimeType: 'audio/mpeg',
		fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Chopin_-_Nocturne_No._2_in_E-flat_major%2C_Op._9_No._2_%28Frank_Levy%29.flac',
		source: COMMONS,
		sourceUrl: 'https://commons.wikimedia.org/wiki/File:Chopin_-_Nocturne_No._2_in_E-flat_major,_Op._9_No._2_(Frank_Levy).flac',
		license: 'Domaine public',
		performer: 'Frank Lévy (piano) — projet Musopen « Set Chopin Free »',
		recordingDate: 'vers 2014',
		duration: '4:31',
		attributionRequired: false,
		rightsNote: 'Enregistrement placé dans le domaine public par Musopen (PD-author).',
	},

	offenbachOrphee: {
		type: 'embedded',
		title: 'Ouverture — section finale du « Galop infernal » (cancan)',
		excerpt: 'Ouverture, section du cancan',
		url: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/6/63/Offenbach_-_Orpheus_in_the_Underworld_-_Overture%2C_Can_Can_section.ogg/Offenbach_-_Orpheus_in_the_Underworld_-_Overture%2C_Can_Can_section.ogg.mp3',
		mimeType: 'audio/mpeg',
		fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Offenbach_-_Orpheus_in_the_Underworld_-_Overture%2C_Can_Can_section.ogg',
		source: COMMONS,
		sourceUrl: 'https://commons.wikimedia.org/wiki/File:Offenbach_-_Orpheus_in_the_Underworld_-_Overture,_Can_Can_section.ogg',
		license: 'Domaine public',
		performer: 'Musopen',
		duration: '1:47',
		attributionRequired: false,
		rightsNote: 'Enregistrement Musopen versé au domaine public (Cc-pd). L’ouverture complète, du même enregistrement, est publiée sous CC0.',
	},

	wagnerTristan: {
		type: 'embedded',
		title: 'Prélude (Vorspiel) — « accord de Tristan » dès les premières mesures',
		excerpt: 'Prélude de l’acte I',
		url: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/7/73/Richard_Wagner_-_Tristan_und_Isolde_-_Vorspiel.ogg/Richard_Wagner_-_Tristan_und_Isolde_-_Vorspiel.ogg.mp3',
		mimeType: 'audio/mpeg',
		fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Richard_Wagner_-_Tristan_und_Isolde_-_Vorspiel.ogg',
		source: COMMONS,
		sourceUrl: 'https://commons.wikimedia.org/wiki/File:Richard_Wagner_-_Tristan_und_Isolde_-_Vorspiel.ogg',
		license: 'EFF Open Audio License 1.0',
		licenseUrl: 'https://web.archive.org/web/20070208085151/http://www.eff.org/IP/Open_licenses/20010421_eff_oal_1.0.html',
		performer: 'Fulda Symphonic Orchestra, dir. Simon Schindler',
		recordingDate: '9 mars 2004',
		duration: '11:09',
		attributionRequired: true,
		attribution: 'Fulda Symphonic Orchestra, dir. Simon Schindler',
		rightsNote: 'Enregistrement diffusé sous licence libre EFF Open Audio License 1.0 (attribution et partage à l’identique).',
	},

	bizetCarmen: {
		type: 'embedded',
		title: 'Prélude de l’acte I',
		excerpt: 'Prélude de l’acte I',
		url: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/9/9f/Carmen_-_Prelude_to_Act_1.ogg/Carmen_-_Prelude_to_Act_1.ogg.mp3',
		mimeType: 'audio/mpeg',
		fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Carmen_-_Prelude_to_Act_1.ogg',
		source: COMMONS,
		sourceUrl: 'https://commons.wikimedia.org/wiki/File:Carmen_-_Prelude_to_Act_1.ogg',
		license: 'CC0',
		licenseUrl: CC0_URL,
		performer: 'Musopen',
		duration: '2:05',
		attributionRequired: false,
		rightsNote: 'Enregistrement Musopen dédié au domaine public (CC0).',
	},

	wagnerParsifal: {
		type: 'embedded',
		title: 'Acte I — récit de Gurnemanz « Titurel, der fromme Held » (extrait)',
		excerpt: 'Acte I, récit de Gurnemanz',
		url: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Richard_Wagner_Parsifal_Titurel%2C_der_fromme_Held_excerpt.mp3',
		mimeType: 'audio/mpeg',
		fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Richard_Wagner_Parsifal_Titurel%2C_der_fromme_Held_excerpt.mp3',
		source: COMMONS,
		sourceUrl: 'https://commons.wikimedia.org/wiki/File:Richard_Wagner_Parsifal_Titurel,_der_fromme_Held_excerpt.mp3',
		license: 'CC BY-SA 4.0',
		licenseUrl: CC_BY_SA_4_URL,
		performer: 'Orchestre du Reichssender Frankfurt, Hellmut Schwebs (basse), dir. Otto Frickhoeffer',
		recordingDate: '1942',
		duration: '3:16',
		attributionRequired: true,
		attribution: 'Hellmut Schwebs, dir. Otto Frickhoeffer — Hessischer Rundfunk',
		rightsNote: 'Archive publiée sous CC BY-SA 4.0 par le Hessischer Rundfunk (autorisation VRT n° 2020111210010443) ; enregistrement également dans le domaine public dans l’UE (PD-EU-audio).',
	},
} satisfies Record<string, TimelineItemAudioEmbedded>;

// Écoute externe : aucun enregistrement libre et représentatif n'a pu être intégré.
export const musicListenLinks = {
	beethovenSymphonie9: {
		type: 'external',
		title: 'Écouter l’œuvre',
		url: 'https://imslp.org/wiki/Symphony_No.9,_Op.125_(Beethoven,_Ludwig_van)',
		source: 'IMSLP — Petrucci Music Library',
		note: 'Enregistrements historiques intégraux (dont Furtwängler, Bayreuth 1951) écoutables sur IMSLP, onglet « Recordings ».',
	},
} satisfies Record<string, TimelineItemAudioExternal>;
