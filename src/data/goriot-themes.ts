// Modèle de données pour le tableau de bord thématique du Père Goriot d'Honoré de Balzac (1835)
// Conçu pour un élève de seconde : rigueur philologique, citations vérifiées avec références,
// articulation entre observations concrètes, questions d'interprétation littéraire, personnages et lieux parisiens.

export interface ThematicQuotation {
	text: string;
	speaker?: string;
	reference: string; // Ex: Première partie (« Une pension bourgeoise »)
	explanation: string; // Explication concise du lien avec le thème
}

export interface ThematicScene {
	title: string;
	stageId: 'stage-1' | 'stage-2' | 'stage-3' | 'stage-4';
	stageLabel: string;
	locationId?: string; // id dans goriotPlaces
	locationName?: string;
	characterIds: string[]; // ids dans goriotCharacters
	summary: string;
	literarySignificance: string;
}

export interface GoriotTheme {
	id: string;
	title: string;
	subtitle: string;
	tagline: string; // Explication en une phrase
	centralQuestion: string; // Question centrale invitant à l'analyse littéraire
	studentExplanation: string; // Comprendre le thème (accessible classe de seconde)
	literarySignificance: string; // Pourquoi Balzac en fait un pivot de La Comédie humaine
	keyObservations: string[]; // Observations clés dans le texte
	characterIds: string[]; // Liens avec goriotCharacters (id)
	locationIds: string[]; // Liens avec goriotPlaces (id)
	relationshipIds?: string[]; // Liens avec goriotRelationships (id)
	scenes: ThematicScene[];
	quotations: ThematicQuotation[];
	relatedThemeIds: string[]; // Renvois vers d'autres thèmes du tableau de bord
	verificationNotes: string; // Notes philologiques et éditoriales d'étayage
	accentColor: string;
	badgeLabel: string;
}

export const goriotThemes: GoriotTheme[] = [
	// 1. Paternité et sacrifice
	{
		id: 'paternite-sacrifice',
		title: 'Paternité et sacrifice',
		subtitle: 'Le « Christ de la paternité » et l’ingratitude filiale',
		tagline: 'L’amour absolu et monomaniaque d’un père qui s’anéantit pour le bonheur et le luxe de ses deux filles.',
		centralQuestion: 'L’amour paternel de Goriot est-il un modèle de générosité sublime ou une passion pathologique et destructrice ?',
		studentExplanation:
			'Pour Goriot, être père n’est pas un simple devoir moral, mais une passion exclusive qui tourne à l’obsession (une « monomanie » au sens balzacien). Il a amassé une fortune sous la Révolution pour marier ses filles dans l’aristocratie et la haute banque. Rejeté par ses gendres dès qu’il n’a plus d’argent, il vend tout jusqu’à son argenterie et meurt seul, illustrant le gouffre entre le sacrifice d’un vieillard et la cruauté du grand monde.',
		literarySignificance:
			'Balzac pousse les sentiments humains à leur paroxysme : Goriot est surnommé par Vautrin le « Christ de la paternité ». Le roman critique une société où les liens du sang sont étouffés par la vanité et où l’institution familiale s’effondre dès lors qu’elle cesse d’être rentable.',
		keyObservations: [
			'Goriot se dépouille progressivement, descendant du premier au troisième étage de la pension Vauquer à mesure qu’il vend ses rentes.',
			'Il tord lui-même la nuit son écuelle en vermeil (dernier souvenir de son épouse) pour payer une dette d’amant de sa fille aînée.',
			'Ses filles ne viennent pas à son chevet agonisant, préférant danser au bal de Mme de Beauséant ou disputer des créances.',
			'Le vieillard délire d’amour et de douleur lucide sur son lit de mort, confessant que ses filles étaient son « vice » et sa perte.',
		],
		characterIds: ['goriot', 'anastasie', 'delphine', 'rastignac', 'bianchon'],
		locationIds: ['pension-vauquer', 'hotel-de-restaud', 'hotel-de-nucingen', 'garconniere-rue-d-artois', 'cimetiere-pere-lachaise'],
		relationshipIds: ['goriot-anastasie', 'goriot-delphine', 'goriot-daughters-financial', 'goriot-rastignac-money', 'bianchon-goriot-care'],
		scenes: [
			{
				title: 'L’écuelle d’argent tordue dans la nuit',
				stageId: 'stage-1',
				stageLabel: 'Première partie (Novembre 1819)',
				locationId: 'pension-vauquer',
				locationName: 'La pension Vauquer',
				characterIds: ['goriot', 'rastignac'],
				summary: 'Rastignac surprend nuitamment le père Goriot en train de comprimer et rouler son argenterie de vermeil en lingot pour payer les traites de sa fille chez Gobseck.',
				literarySignificance: 'Première révélation concrète du martyr secret de Goriot, détruisant la fable colportée par Mme Vauquer sur un vieillard libertin.',
			},
			{
				title: 'L’emménagement de la garçonnière rue d’Artois',
				stageId: 'stage-3',
				stageLabel: 'Troisième partie (Janvier 1820)',
				locationId: 'garconniere-rue-d-artois',
				locationName: 'La garçonnière de la rue d’Artois',
				characterIds: ['goriot', 'rastignac', 'delphine'],
				summary: 'Goriot meuble avec ses dernières économies le nid d’amour d’Eugène et Delphine, se contentant pour lui-même d’une chambre de bonne sous les combles pour entendre les pas de sa fille.',
				literarySignificance: 'Apogée de l’abnégation et du voyeurisme affectif : Goriot devient le facilitateur bienveillant de la liaison de sa fille pour capter un regard d’elle.',
			},
			{
				title: 'L’agonie solitaire et les funérailles sans héritières',
				stageId: 'stage-4',
				stageLabel: 'Quatrième partie (Février 1820)',
				locationId: 'cimetiere-pere-lachaise',
				locationName: 'Le cimetière du Père-Lachaise',
				characterIds: ['goriot', 'rastignac', 'bianchon', 'christophe'],
				summary: 'Goriot meurt dans un galetas froid assisté uniquement par les deux étudiants pauvres ; seules deux voitures armoriées mais vides suivent son convoi funèbre.',
				literarySignificance: 'Condamnation radicale de l’ingratitude filiale et du luxe stérile : la haute société se contente de faire figurer ses armoiries sur la tombe de celui qu’elle a ruiné.',
			},
		],
		quotations: [
			{
				text: 'Mes filles, c’était mon vice à moi ; elles étaient mes maîtresses, enfin tout !',
				speaker: 'Jean-Joachim Goriot',
				reference: 'Quatrième partie (« La Mort du père »)',
				explanation: 'Goriot analyse lui-même sur son lit de mort sa paternité comme une passion dévorante assimilable à une addiction sensuelle.',
			},
			{
				text: 'J’ai soif, j’ai faim, le cœur me brûle, elles ne viendront pas rafraîchir mon agonie, car je meurs, je le sens. […] Ah ! si j’étais riche, si j’avais gardé ma fortune, si je ne la leur avais pas donnée, elles seraient là !',
				speaker: 'Jean-Joachim Goriot',
				reference: 'Quatrième partie (« La Mort du père »)',
				explanation: 'La clairvoyance tragique du vieillard dénonce la loi fondamentale de la société parisienne : l’amour n’y subsiste que s’il est garanti par l’argent.',
			},
			{
				text: 'Pardonnez-moi, mon père ! […] votre bénédiction est la seule que je puisse recevoir ici-bas désormais. […] Je l’ai méconnu, je l’ai repoussé, je lui ai fait mille maux, infâme que je suis !',
				speaker: 'Anastasie de Restaud',
				reference: 'Quatrième partie (« La Mort du père »)',
				explanation: 'L’aveu déchirant et tardif d’Anastasie arrivant quelques instants avant le dernier souffle de son père : le remords éclate mais le drame de la désertion est consommé.',
			},
		],
		relatedThemeIds: ['argent-dettes', 'solitude-abandon', 'amour-interets'],
		verificationNotes: 'Thème central structurant la composition romanesque, appuyé sur le parallèle explicite balzacien avec le Roi Lear de Shakespeare.',
		accentColor: '#8b5a2b',
		badgeLabel: 'Paternité',
	},

	// 2. Argent et dettes
	{
		id: 'argent-dettes',
		title: 'Argent et dettes',
		subtitle: 'Le roi tout-puissant du XIXe siècle : spoliation, crédit et survie',
		tagline: 'Le moteur occulte de toutes les actions : l’or remplace la morale, mesure les sentiments et détermine la survie sociale.',
		centralQuestion: 'Comment l’argent transforme-t-il les sentiments intimes en marchandises et en rapports de force ?',
		studentExplanation:
			'Dans l’univers du roman, rien n’est gratuit et tout a un prix : une dot de huit cent mille francs ouvre les portes du mariage nobiliaire, cent francs risqués à la roulette permettent de repousser la honte d’un découvert bancaire, et trois mille francs achètent la trahison d’un forçat. L’argent n’est pas seulement un moyen matériel, c’est le filtre à travers lequel chaque personnage évalue autrui.',
		literarySignificance:
			'Balzac est le premier grand romancier du réalisme économique : il chiffre au franc près les dots, les rentes viagères, les loyers et les dettes usuraires chez Gobseck. L’argent est un flux vital qui gouverne la modernité capitaliste de la Restauration.',
		keyObservations: [
			'Les deux gendres (Restaud et Nucingen) ont épousé les filles pour leur dot colossale (800 000 F chacune) avant de chasser le père artisan.',
			'Le baron de Nucingen séquestre la dot de Delphine dans des spéculations boursières pour la maintenir dans une dépendance absolue.',
			'Anastasie est contrainte de vendre les diamants du comte pour sauver son amant Maxime de Trailles de la prison pour dettes.',
			'Eugène comprend que ses études de droit ne lui rapporteront presque rien comparé aux millions nécessaires pour briller à Paris.',
		],
		characterIds: ['goriot', 'anastasie', 'delphine', 'baron-nucingen', 'comte-restaud', 'rastignac'],
		locationIds: ['palais-royal', 'hotel-de-restaud', 'hotel-de-nucingen', 'pension-vauquer'],
		relationshipIds: ['goriot-daughters-financial', 'rastignac-delphine-money', 'delphine-baron-nucingen', 'anastasie-comte-restaud', 'goriot-rastignac-money'],
		scenes: [
			{
				title: 'Le coup de roulette au n° 9 du Palais-Royal',
				stageId: 'stage-2',
				stageLabel: 'Deuxième partie (Décembre 1819)',
				locationId: 'palais-royal',
				locationName: 'Le Palais-Royal et ses tripots',
				characterIds: ['rastignac', 'delphine'],
				summary: 'Delphine charge Eugène de jouer ses 100 derniers francs à la roulette : il gagne 7 000 francs net qui la sauvent temporairement de ses engagements financiers.',
				literarySignificance: 'Révélation brutale pour Rastignac : la détresse financière ronge les salons dorés tout autant que la misère ordinaire de la pension Vauquer.',
			},
			{
				title: 'La crise des diamants et la visite d’Anastasie',
				stageId: 'stage-4',
				stageLabel: 'Quatrième partie (Février 1820)',
				locationId: 'pension-vauquer',
				locationName: 'La chambre mansardée de Goriot',
				characterIds: ['goriot', 'anastasie', 'delphine', 'rastignac'],
				summary: 'Anastasie et Delphine s’affrontent devant leur père mourant pour des questions de sommes exigées par Gobseck et Nucingen, provoquant la crise d’apoplexie finale.',
				literarySignificance: 'Scène de paroxysme dramatique où la querelle de l’or tue littéralement le père au moment où ses poches sont vides.',
			},
		],
		quotations: [
			{
				text: 'L’argent, c’est la vie. Monnaie fait tout.',
				speaker: 'Jean-Joachim Goriot',
				reference: 'Troisième partie (« Trompe-la-Mort »)',
				explanation: 'La formule résume la métaphysique financière du roman : la privation d’or équivaut à une mort sociale immédiate.',
			},
			{
				text: 'Risquez les cent francs à un jeu qu’on nomme la roulette, et perdez tout, ou rapportez-moi six mille francs.',
				speaker: 'Delphine de Nucingen',
				reference: 'Deuxième partie (« L’Entrée dans le monde »)',
				explanation: 'Illustration de l’urgence financière et de la soumission de la baronne de Nucingen, réduite au hasard du tripot pour solder ses dettes privées.',
			},
		],
		relatedThemeIds: ['paternite-sacrifice', 'ambition-ascension', 'amour-interets', 'inegalites-pouvoir'],
		verificationNotes: 'Détails des chiffres rigoureusement attestés dans l’étude économique balzacienne : dots, rentes viagères, billets à ordre et usure de Gobseck.',
		accentColor: '#b45309',
		badgeLabel: 'Argent',
	},

	// 3. Ambition et ascension sociale
	{
		id: 'ambition-ascension',
		title: 'Ambition et ascension sociale',
		subtitle: 'L’apprentissage du monde par Rastignac et la conquête de Paris',
		tagline: 'Du jeune provincial naïf au conquérant impitoyable : comment Eugène apprend les règles féroces du grand monde.',
		centralQuestion: 'L’ascension sociale exige-t-elle inévitablement l’abandon des scrupules moraux ?',
		studentExplanation:
			'Eugène de Rastignac arrive à Paris avec l’illusion qu’un travail assidu à la faculté de droit suffira à faire sa gloire. Très vite, la vue du luxe insultant et de la misère de la pension lui montre que le mérite intellectuel est impuissant sans relations mondaines et sans argent. Confronté aux conseils cyniques de sa cousine Mme de Beauséant et au pacte de Vautrin, il choisit d’entrer dans l’arène mondaine en exploitant ses charmes.',
		literarySignificance:
			'Rastignac est le prototype de l’ambitieux de la modernité balzacienne. Le roman retrace son roman d’apprentissage (Bildungsroman) : il perd ses illusions provinciales mais conserve, à la différence de Vautrin, une ultime étincelle de piété filiale pour Goriot.',
		keyObservations: [
			'Rastignac commet d’abord un faux pas ridicule chez Anastasie de Restaud en prononçant le nom du père Goriot sans connaître les convenances.',
			'Il demande à sa mère et ses sœurs leurs modestes économies (1 200 F) pour s’acheter les habits élégants indispensables au faubourg.',
			'Il hésite constamment entre le travail honnête prôné par Horace Bianchon et la tentation de la fortune rapide.',
			'La scène finale sur la colline du Père-Lachaise scelle son passage du statut de spectateur à celui de combattant résolu.',
		],
		characterIds: ['rastignac', 'mme-de-beauseant', 'vautrin', 'bianchon', 'delphine'],
		locationIds: ['ecole-de-droit', 'hotel-de-beauseant', 'pension-vauquer', 'garconniere-rue-d-artois', 'cimetiere-pere-lachaise'],
		relationshipIds: ['beauseant-rastignac-cynisme', 'vautrin-rastignac', 'rastignac-bianchon', 'rastignac-delphine', 'rastignac-beauseant-family'],
		scenes: [
			{
				title: 'La leçon des « chevaux de poste » rue de Grenelle',
				stageId: 'stage-1',
				stageLabel: 'Première partie (Novembre 1819)',
				locationId: 'hotel-de-beauseant',
				locationName: 'L’hôtel de la vicomtesse de Beauséant',
				characterIds: ['rastignac', 'mme-de-beauseant'],
				summary: 'Blessée par l’abandon de son amant d’Ajuda-Pinto, la vicomtesse apprend à Eugène comment manoeuvrer à Paris : calculer froidement et frapper sans pitié.',
				literarySignificance: 'Initiation aristocratique au cynisme : les femmes du monde et les hommes ne doivent être traités que comme des relais éphémères.',
			},
			{
				title: 'Le défi suprême lancé à Paris depuis le Père-Lachaise',
				stageId: 'stage-4',
				stageLabel: 'Quatrième partie (Février 1820)',
				locationId: 'cimetiere-pere-lachaise',
				locationName: 'Les hauteurs du Père-Lachaise',
				characterIds: ['rastignac'],
				summary: 'Après avoir enterré Goriot de ses propres deniers, Eugène contemple Paris qui s’allume entre la colonne Vendôme et les Invalides, et jette son cri de guerre avant d’aller dîner chez Mme de Nucingen.',
				literarySignificance: 'Apostrophe finale célèbre qui clôt l’apprentissage et inaugure la trajectoire du Rastignac arriviste qui traversera toute La Comédie humaine.',
			},
		],
		quotations: [
			{
				text: 'Plus froidement vous calculerez, plus avant vous irez. Frappez sans pitié, vous serez craint. N’acceptez les hommes et les femmes que comme des chevaux de poste que vous laisserez crever à chaque relais, vous arriverez ainsi au faîte de vos désirs.',
				speaker: 'La vicomtesse de Beauséant',
				reference: 'Première partie (« Une pension bourgeoise »)',
				explanation: 'La charte cynique dispensée par l’aristocrate déçue, qui théorise l’exploitation humaine comme condition de l’ascension.',
			},
			{
				text: 'Il lança sur cette ruche bourdonnante un regard qui semblait par avance en pomper le miel, et dit ces mots grandioses : — À nous deux maintenant ! Il revint à pied rue d’Artois, et alla dîner chez madame de Nucingen.',
				speaker: 'Honoré de Balzac (narrateur)',
				reference: 'Conclusion du Père Goriot',
				explanation: 'La phrase culte du roman : l’ambitieux accepte les lois corrompues de la jungle parisienne et passe immédiatement à l’offensive.',
			},
		],
		relatedThemeIds: ['apparences-reputation', 'manipulation-corruption', 'inegalites-pouvoir', 'argent-dettes'],
		verificationNotes: 'Figure matricielle de Rastignac, liée aux théories de la volonté et de l’énergie développées dans La Comédie humaine.',
		accentColor: '#1d4ed8',
		badgeLabel: 'Ambition',
	},

	// 4. Amour et intérêts
	{
		id: 'amour-interets',
		title: 'Amour et intérêts',
		subtitle: 'Liaisons mondaines, vanité et transactions sentimentales',
		tagline: 'Entre séduction tactique, prédation et sincérité naissante : quand la passion se négocie au prix fort.',
		centralQuestion: 'Une passion pure et désintéressée est-elle possible au sein de la société parisienne ?',
		studentExplanation:
			'Dans les salons de la Restauration, l’amour n’échappe presque jamais au calcul d’intérêt : avoir pour maîtresse une femme titrée ou l’épouse d’un riche banquier est une marque de crédit mondain. Anastasie se ruine pour le dandy parasite Maxime de Trailles ; Delphine cherche chez Eugène un passeport pour le faubourg Saint-Germain. Pourtant, le génie de Balzac est de montrer que de cette stratégie naît parfois un attachement sincère et une véritable passion sensuelle.',
		literarySignificance:
			'Balzac analyse le sentiment amoureux comme une force contradictoire : l’amour est à la fois instrumentalisé comme arme sociale et capable de dévotion inattendue, comme le montre le couple Eugène-Delphine qui déjoue en partie le cynisme ambiant.',
		keyObservations: [
			'Anastasie aliène tout son patrimoine pour couvrir les dettes de jeu et le train de vie de son amant Maxime de Trailles.',
			'Eugène aborde Delphine sur l’injonction stratégique de Mme de Beauséant (« Si vous avez un sentiment vrai, cachez-le »).',
			'Le lien entre Eugène et Delphine transcende le simple calcul pour devenir une passion sensuelle mutuelle et une confiance intime.',
			'Victorine Taillefer offre le contre-modèle d’un amour virginal et désintéressé, mais son sentiment reste impuissant et invisible pour Rastignac.',
		],
		characterIds: ['rastignac', 'delphine', 'anastasie', 'mme-de-beauseant', 'victorine'],
		locationIds: ['theatre-des-italiens', 'hotel-de-nucingen', 'garconniere-rue-d-artois', 'pension-vauquer'],
		relationshipIds: ['rastignac-delphine', 'victorine-rastignac', 'anastasie-comte-restaud', 'delphine-baron-nucingen', 'rastignac-delphine-money'],
		scenes: [
			{
				title: 'La loge au Théâtre des Italiens',
				stageId: 'stage-2',
				stageLabel: 'Deuxième partie (Décembre 1819)',
				locationId: 'theatre-des-italiens',
				locationName: 'Le Théâtre des Italiens (Salle Favart)',
				characterIds: ['rastignac', 'delphine', 'mme-de-beauseant'],
				summary: 'Eugène se présente dans la loge de Delphine sous le patronage bienveillant de la vicomtesse, inaugurant leur parade amoureuse sous le regard du Tout-Paris.',
				literarySignificance: 'Mise en scène théâtrale de la séduction mondaine : l’intimité amoureuse se conquiert sous les lorgnettes du public.',
			},
			{
				title: 'Le bal d’adieu de Mme de Beauséant',
				stageId: 'stage-4',
				stageLabel: 'Quatrième partie (Février 1820)',
				locationId: 'hotel-de-beauseant',
				locationName: 'L’hôtel de la vicomtesse de Beauséant',
				characterIds: ['mme-de-beauseant', 'delphine', 'rastignac'],
				summary: 'Delphine réalise son rêve d’entrer dans le salon le plus huppé de Paris le soir même où la maîtresse de maison, brisée par la trahison de son amant, quitte le monde à jamais.',
				literarySignificance: 'Contraste saisissant entre le triomphe vaniteux de la parvenue et la tragédie intime de l’abandon sentimental.',
			},
		],
		quotations: [
			{
				text: 'Leur passion bien préparée avait grandi par ce qui tue les passions, par la jouissance. […] il adorait cette femme pour les voluptés qu’il lui avait apportées en dot, et pour toutes celles qu’il en avait reçues.',
				speaker: 'Honoré de Balzac (narrateur)',
				reference: 'Troisième partie (« Trompe-la-Mort »)',
				explanation: 'Balzac souligne la solidité sensuelle et affective qui finit par unir Eugène et Delphine au-delà du pur opportunisme.',
			},
			{
				text: 'Mais si vous avez un sentiment vrai, cachez-le comme un trésor ; ne le laissez jamais soupçonner, vous seriez perdu. Vous ne seriez plus le bourreau, vous deviendriez la victime.',
				speaker: 'La vicomtesse de Beauséant',
				reference: 'Première partie (« Une pension bourgeoise »)',
				explanation: 'Le précepte aristocratique : manifester une sincérité affective expose immédiatement à la cruauté des rivaux.',
			},
		],
		relatedThemeIds: ['paternite-sacrifice', 'argent-dettes', 'ambition-ascension', 'apparences-reputation'],
		verificationNotes: 'Nuance fondamentale établie dans l’audit philologique contre la tentation de réduire la liaison Rastignac-Delphine à un contrat vénal.',
		accentColor: '#be185d',
		badgeLabel: 'Amour & Intérêt',
	},

	// 5. Apparences et réputation
	{
		id: 'apparences-reputation',
		title: 'Apparences et réputation',
		subtitle: 'Le code du paraître, l’habit d’emprunt et la comédie mondaine',
		tagline: 'Dans le grand monde parisien, exister socialement c’est avant tout soigner l’illusion d’une richesse immaculée.',
		centralQuestion: 'En quoi la société balzacienne fonctionne-t-elle comme un théâtre où la forme prime sur la vérité humaine ?',
		studentExplanation:
			'À Paris, nul ne demande d’où vient l’argent, pourvu qu’on ait un carrosse aux armes impeccables, des gants frais et un habit bien coupé. Eugène l’apprend à ses dépens : bien qu’il soit d’une noblesse charentaise authentique, ses bottes crottées et son habit râpé lui interdisent d’abord la considération des valets de Mme de Restaud. De même, les hôtels particuliers dorés masquent des faillites personnelles et des drames sordides.',
		literarySignificance:
			'Balzac décrypte la sémiologie des apparences : les vêtements, le maintien, le mobilier et les quartiers racontent l’hypocrisie de la Restauration, où la respectabilité bourgeoise et la dignité noble ne sont que des décors de théâtre.',
		keyObservations: [
			'Eugène se rend à pied chez Mme de Restaud et gâche sa tenue dans la boue parisienne, subissant le mépris silencieux des gens de maison.',
			'Pour franchir le seuil des salons, Eugène doit sacrifier les économies de sa famille afin d’acquérir l’attirail du dandy.',
			'Delphine ne va pas voir son père mourant pour ne pas compromettre sa parure et son maquillage avant le grand bal de Mme de Beauséant.',
			'À l’enterrement de Goriot, les deux gendres envoient leurs voitures armoriées vides pour sauver la décence extérieure tout en refusant de payer la fosse.',
		],
		characterIds: ['rastignac', 'delphine', 'anastasie', 'mme-de-beauseant', 'mme-vauquer'],
		locationIds: ['hotel-de-restaud', 'hotel-de-beauseant', 'theatre-des-italiens', 'pension-vauquer', 'cimetiere-pere-lachaise'],
		relationshipIds: ['beauseant-delphine-snobisme', 'anastasie-comte-restaud', 'vauquer-pensionnaires-housing'],
		scenes: [
			{
				title: 'Le premier faux pas d’Eugène rue du Helder',
				stageId: 'stage-1',
				stageLabel: 'Première partie (Novembre 1819)',
				locationId: 'hotel-de-restaud',
				locationName: 'L’hôtel de la comtesse de Restaud',
				characterIds: ['rastignac', 'anastasie', 'comte-restaud'],
				summary: 'Ignorant les convenances, Eugène débarque crotté et mentionne naïvement le père Goriot, déclenchant l’hostilité immédiate du couple comtal et se faisant fermer la porte.',
				literarySignificance: 'Échec initiatique fondateur : une maladresse de vocabulaire dans l’univers du paraître détruit instantanément un réseau social naissant.',
			},
			{
				title: 'Le deuil par procuration des voitures vides',
				stageId: 'stage-4',
				stageLabel: 'Quatrième partie (Février 1820)',
				locationId: 'cimetiere-pere-lachaise',
				locationName: 'Le cimetière du Père-Lachaise',
				characterIds: ['rastignac', 'comte-restaud', 'baron-nucingen'],
				summary: 'Les comtes de Restaud et barons de Nucingen se font représenter au convoi de Goriot par leurs cochers et leurs calèches blasonnées, refusant d’assister en personne à l’inhumation.',
				literarySignificance: 'Image saisissante de l’hypocrisie sociale : le paraître aristocratique se donne en spectacle jusque sur la terre de la fosse commune.',
			},
		],
		quotations: [
			{
				text: 'Aussi, madame de Nucingen laperait-elle toute la boue qu’il y a entre la rue Saint-Lazare et la rue de Grenelle pour entrer dans mon salon.',
				speaker: 'La vicomtesse de Beauséant',
				reference: 'Première partie (« Une pension bourgeoise »)',
				explanation: 'La cruauté du constat résume la tyrannie du paraître : le prestige d’un nom aristocratique vaut toutes les humiliations de la bourgeoisie dorée.',
			},
			{
				text: 'À six heures, le corps du père Goriot fut descendu dans sa fosse, autour de laquelle étaient les gens de ses filles, qui disparurent avec le clergé aussitôt que fut dite la courte prière due au bonhomme pour l’argent de l’étudiant.',
				speaker: 'Honoré de Balzac (narrateur)',
				reference: 'Quatrième partie (« La Mort du père »)',
				explanation: 'L’ultime comédie des apparences se disperse dès que la cérémonie payée s’achève, laissant le cadavre à l’oubli.',
			},
		],
		relatedThemeIds: ['ambition-ascension', 'amour-interets', 'inegalites-pouvoir', 'solitude-abandon'],
		verificationNotes: 'Détaillé dans les analyses matérielles de Balzac sur le dandysme et le rôle décisif du tailleur de Rastignac.',
		accentColor: '#1e4b88',
		badgeLabel: 'Apparences',
	},

	// 6. Inégalités sociales et pouvoir
	{
		id: 'inegalites-pouvoir',
		title: 'Inégalités sociales et pouvoir',
		subtitle: 'La topographie des fractures : du taudis Saint-Marceau aux palais de Grenelle',
		tagline: 'Paris comme condensé violent de la lutte des classes : comment l’espace urbain cristallise la domination des puissants.',
		centralQuestion: 'Comment Balzac utilise-t-il la géographie parisienne pour révéler les mécanismes de l’injustice sociale ?',
		studentExplanation:
			'La pension Vauquer, nichée dans le faubourg Saint-Marceau au sud de la Seine, est un cloaque puant où s’entassent les naufragés de la société (vieillards ruinés, jeunes filles déshéritées, étudiants pauvres). À l’opposé, les hôtels particuliers du faubourg Saint-Germain et de la Chaussée-d’Antin concentrent les privilèges et la puissance politique. Chaque traversée de la Seine par Rastignac matérialise le fossé vertigineux qui sépare les nantis des exclus.',
		literarySignificance:
			'Balzac théorise la « sociologie de l’espace » : l’habitat détermine les corps, les esprits et les destins. La géographie urbaine n’est pas un décor neutre, c’est le champ de bataille impitoyable où se jouent l’exploitation économique et la hiérarchie des ordres.',
		keyObservations: [
			'La description inaugurale de la pension Vauquer établit une correspondance étroite entre la pourriture des murs et la dégradation morale des pensionnaires.',
			'Victorine Taillefer vit dans le dénuement alors que son père banquier habite un luxueux hôtel particulier à quelques kilomètres de là.',
			'Les serviteurs de la pension (Sylvie et Christophe) effectuent les corvées les plus rudes pour des gages dérisoires tout en faisant preuve d’une humanité inconnue des aristocrates.',
			'L’étudiant en droit et l’externe en médecine découvrent que la justice et la médecine sont au service de ceux qui peuvent payer.',
		],
		characterIds: ['mme-vauquer', 'm-taillefer', 'victorine', 'christophe', 'sylvie', 'comte-restaud'],
		locationIds: ['pension-vauquer', 'hotel-de-beauseant', 'hotel-de-restaud', 'hotel-de-nucingen'],
		relationshipIds: ['m-taillefer-victorine', 'vauquer-goriot-pension', 'sylvie-christophe-service'],
		scenes: [
			{
				title: 'Le tableau initial de la pension Vauquer',
				stageId: 'stage-1',
				stageLabel: 'Première partie (Novembre 1819)',
				locationId: 'pension-vauquer',
				locationName: 'La pension bourgeoise de la rue Neuve-Sainte-Geneviève',
				characterIds: ['mme-vauquer', 'goriot', 'vautrin', 'sylvie', 'christophe'],
				summary: 'Balzac consacre de longues pages à décrire minutieusement la crasse, l’odeur de renfermé (« odeur de pension ») et le mobilier lépreux du faubourg Saint-Marceau.',
				literarySignificance: 'Manifeste du réalisme balzacien : le milieu façonne l’individu, et la misère matérielle est le reflet de l’injustice globale de l’ordre social.',
			},
			{
				title: 'Le refus hautain du père Taillefer à sa fille',
				stageId: 'stage-1',
				stageLabel: 'Première partie (Novembre 1819)',
				locationId: 'pension-vauquer',
				locationName: 'La pension Vauquer',
				characterIds: ['victorine', 'm-taillefer'],
				summary: 'Victorine revient en larmes de son audience annuelle avec son père : le banquier a refusé de lui ouvrir sa porte et de lui verser le moindre secours.',
				literarySignificance: 'Illustration cruelle de l’arbitraire patriarcal et capitaliste, qui déshérite une fille innocente sans qu’aucun recours légal n’existe.',
			},
		],
		quotations: [
			{
				text: 'Cette première pièce exhale une odeur sans nom dans la langue, et qu’il faudrait appeler l’odeur de pension. Elle sent le renfermé, le moisi, le rance ; elle donne froid, elle est humide au nez, elle pénètre les vêtements ; elle a le goût d’une salle où l’on a dîné ; elle pue le service, l’office, l’hospice.',
				speaker: 'Honoré de Balzac (narrateur)',
				reference: 'Première partie (« Une pension bourgeoise »)',
				explanation: 'Évocation sensorielle saisissante du monde des déclassés, antithèse absolue des parfums et des glaces des boudoirs de la noblesse.',
			},
			{
				text: 'Paris est donc un bourbier. — Et un drôle de bourbier, reprit Vautrin. Ceux qui s’y crottent en voiture sont d’honnêtes gens, ceux qui s’y crottent à pied sont des fripons. Ayez le malheur d’y décrocher n’importe quoi, vous êtes montré sur la place du Palais-de-Justice comme une curiosité. Volez un million, vous êtes marqué dans les salons comme une vertu.',
				speaker: 'Vautrin (Jacques Collin)',
				reference: 'Première partie (« Une pension bourgeoise »)',
				explanation: 'L’inégalité radicale devant la loi : la richesse immunise contre l’opprobre judiciaire, tandis que la misère est criminelle par nature.',
			},
		],
		relatedThemeIds: ['argent-dettes', 'ambition-ascension', 'manipulation-corruption', 'solitude-abandon'],
		verificationNotes: 'Structure spatiale opposant rigoureusement la rive gauche pauvre (Montagne Sainte-Geneviève) et la rive droite fortunée (Chaussée-d’Antin, Faubourg Saint-Germain).',
		accentColor: '#475569',
		badgeLabel: 'Inégalités',
	},

	// 7. Manipulation et corruption morale
	{
		id: 'manipulation-corruption',
		title: 'Manipulation et corruption morale',
		subtitle: 'Les tentations de Vautrin, la délation policière et la perte d’innocence',
		tagline: 'Quand les lois deviennent hypocrites : pacte criminel, poison discret et délation vénale au cœur de la pension.',
		centralQuestion: 'La société civile n’est-elle qu’un bagne déguisé où triomphent les plus habiles manipulateurs ?',
		studentExplanation:
			'La pension Vauquer abrite sous un masque jovial Jacques Collin, dit Trompe-la-Mort, forçat évadé d’une prodigieuse intelligence. Vautrin déchire le voile des hypocrisies sociales en expliquant à Rastignac que le meurtre discret et les mariages de convenance sont les véritables moteurs de la réussite. Face à lui, la police de Gondureau n’hésite pas à acheter la délation vénale de Mlle Michonneau, montrant que les défenseurs de l’ordre usent des mêmes méthodes sordides que les criminels.',
		literarySignificance:
			'Vautrin incarne la tentation machiavélique et la révolte métaphysique contre l’hypocrisie de la civilisation bourgeoise. Par son dialogue avec Rastignac, Balzac pose un dilemme moral majeur qui hante tout le roman : le paradoxe du « mandarin » de Rousseau/Chateaubriand.',
		keyObservations: [
			'Vautrin propose à Eugène de faire assassiner Frédéric Taillefer par le colonel Franchessini pour capter la succession de Victorine.',
			'Rastignac débat avec Horace Bianchon au jardin du Luxembourg du cas de conscience : tuerait-on un vieux mandarin en Chine d’un simple souhait pour devenir millionnaire ?',
			'Mlle Michonneau marchande la capture de Vautrin pour 3 000 francs et le drogue avec un soporifique dans son café.',
			'L’arrestation spectaculaire de Vautrin dévoile son identité de bagnard sans amoindrir la force implacable de son analyse politique.',
		],
		characterIds: ['vautrin', 'rastignac', 'michonneau', 'poiret', 'bianchon', 'm-taillefer'],
		locationIds: ['pension-vauquer', 'jardin-du-luxembourg'],
		relationshipIds: ['vautrin-rastignac', 'vautrin-taillefer-crime', 'michonneau-vautrin-police', 'michonneau-poiret-complicity', 'rastignac-bianchon'],
		scenes: [
			{
				title: 'Le pacte du jardin de la pension',
				stageId: 'stage-2',
				stageLabel: 'Deuxième partie (Décembre 1819)',
				locationId: 'pension-vauquer',
				locationName: 'Le jardin de la pension Vauquer',
				characterIds: ['vautrin', 'rastignac'],
				summary: 'Vautrin isole Eugène parmi les tilleuls et lui expose son plan diabolique : épouser Victorine après le meurtre de son frère en duel, moyennant une commission de 100 000 francs.',
				literarySignificance: 'Scène de tentation faustienne majeure : le tentateur dénonce la pourriture du Code civil et propose une alliance d’énergie criminelle.',
			},
			{
				title: 'Le débat du mandarin au Luxembourg',
				stageId: 'stage-2',
				stageLabel: 'Deuxième partie (Décembre 1819)',
				locationId: 'jardin-du-luxembourg',
				locationName: 'Les allées du Jardin du Luxembourg',
				characterIds: ['rastignac', 'bianchon'],
				summary: 'Eugène soumet à son ami étudiant en médecine le problème philosophique : tuer un mandarin lointain par un simple acte de volonté en échange de la fortune.',
				literarySignificance: 'Confrontation morale décisive : Bianchon refuse énergiquement le crime imaginaire au nom de l’éthique médicale et de la paix de l’âme.',
			},
			{
				title: 'L’arrestation de Trompe-la-Mort',
				stageId: 'stage-3',
				stageLabel: 'Troisième partie (Janvier 1820)',
				locationId: 'pension-vauquer',
				locationName: 'La salle à manger de la pension Vauquer',
				characterIds: ['vautrin', 'michonneau', 'poiret', 'mme-vauquer'],
				summary: 'Trompe-la-Mort, trahi par le narcotique de Michonneau, est cerné par les gendarmes de Gondureau. Face aux fusils, il assume fièrement sa stature de bagnard héroïque et méprise les délateurs.',
				literarySignificance: 'Renversement moral saisissant : le forçat fait figure de colosse lucide face à la lâcheté mesquine des bourgeois qui l’ont vendu pour mille écus.',
			},
		],
		quotations: [
			{
				text: 'Savez-vous comment on fait son chemin ici ? par l’éclat du génie ou par l’adresse de la corruption. Il faut entrer dans cette masse d’hommes comme un boulet de canon, ou s’y glisser comme une peste. L’honnêteté ne sert à rien.',
				speaker: 'Vautrin (Jacques Collin)',
				reference: 'Deuxième partie (« L’Entrée dans le monde »)',
				explanation: 'La formule résume la vision subversive de Vautrin : dans un monde dominé par la force brutale, l’honnêteté ordinaire est une condamnation à la médiocrité.',
			},
			{
				text: 'Notre bonheur, mon cher, tiendra toujours entre la plante de nos pieds et notre occiput ; et, qu’il coûte un million par an ou cent louis, la perception intrinsèque en est la même au dedans de nous. Je conclus à la vie du Chinois.',
				speaker: 'Horace Bianchon',
				reference: 'Deuxième partie (« L’Entrée dans le monde »)',
				explanation: 'La voix de la conscience honnête incarnée par l’étudiant en médecine, contrepoint éthique nécessaire face au nihilisme de Vautrin.',
			},
		],
		relatedThemeIds: ['ambition-ascension', 'inegalites-pouvoir', 'argent-dettes'],
		verificationNotes: 'Distingue avec rigueur le projet machiavélique de Vautrin du refus catégorique d’Eugène, neutralisé par un vin drogué lors du meurtre effectif.',
		accentColor: '#7f1d1d',
		badgeLabel: 'Corruption',
	},

	// 8. Solitude et abandon
	{
		id: 'solitude-abandon',
		title: 'Solitude et abandon',
		subtitle: 'L’indifférence du monde et la mort nue dans un galetas',
		tagline: 'L’envers terrifiant du faste parisien : mourir sans un regard d’amour quand les coffres sont vides.',
		centralQuestion: 'Pourquoi la société moderne produit-elle un tel isolement individuel au cœur même de la foule ?',
		studentExplanation:
			'Paris est une ruche bouillonnante où des milliers d’individus se côtoient sans jamais se soucier du voisin. Le père Goriot illustre cette atroce solitude : après avoir été choyé tant qu’il régalait ses filles et ses créanciers, il expire sur un grabat crasseux sans que personne ne vienne tenir sa main, hormis deux étudiants désargentés et un garçon de peine. Mme de Beauséant, reine des salons, fait la même expérience cruelle : abandonnée par l’homme qu’elle aimait, elle doit s’exiler dans la solitude de la campagne normande.',
		literarySignificance:
			'Balzac montre que la fête mondaine est un masque jetable : derrière les lustres et les sourires de courtoisie règne une désertion affective absolue. La mort de Goriot et la retraite de Mme de Beauséant dressent le constat mélancolique d’une société qui broie les cœurs sincères.',
		keyObservations: [
			'Goriot agonise pendant plusieurs jours dans une chambre sans feu, enveloppé d’un drap douteux refusé d’abord par Mme Vauquer faute d’argent liquide.',
			'Delphine et Anastasie prétextent la fatigue, les exigences de leurs époux ou la peur de froisser leur toilette pour différer leur venue.',
			'Seuls deux étudiants (Rastignac et Bianchon) et le domestique Christophe accompagnent la dépouille du vieillard jusqu’à la fosse des pauvres.',
			'Mme de Beauséant quitte son hôtel de la rue de Grenelle en pleine nuit pour fuir le regard indiscret de ses pairs.',
		],
		characterIds: ['goriot', 'rastignac', 'bianchon', 'christophe', 'mme-de-beauseant', 'mme-vauquer'],
		locationIds: ['pension-vauquer', 'hotel-de-beauseant', 'eglise-saint-etienne-du-mont', 'cimetiere-pere-lachaise'],
		relationshipIds: ['goriot-anastasie', 'goriot-delphine', 'christophe-goriot-loyalty', 'bianchon-goriot-care'],
		scenes: [
			{
				title: 'L’agonie solitaire sous les combles',
				stageId: 'stage-4',
				stageLabel: 'Quatrième partie (Février 1820)',
				locationId: 'pension-vauquer',
				locationName: 'La mansarde du troisième étage de la pension Vauquer',
				characterIds: ['goriot', 'rastignac', 'bianchon'],
				summary: 'Goriot délire en appelant ses « anges » ; Bianchon constate l’irréversibilité de l’apoplexie séreuse tandis qu’Eugène guette en vain le bruit d’une voiture.',
				literarySignificance: 'Apogée pathétique du roman où l’isolement total du mourant contraste avec l’agitation frivole de la ville qui l’ignore.',
			},
			{
				title: 'Le convoi sous la pluie à Saint-Étienne-du-Mont et au Père-Lachaise',
				stageId: 'stage-4',
				stageLabel: 'Quatrième partie (Février 1820)',
				locationId: 'eglise-saint-etienne-du-mont',
				locationName: 'L’église Saint-Étienne-du-Mont et le Père-Lachaise',
				characterIds: ['rastignac', 'christophe'],
				summary: 'Une messe expédiée à la hâte en quelques minutes faute d’argent pour payer le clergé, suivie d’une marche sous la pluie d’hiver jusqu’à la fosse commune.',
				literarySignificance: 'La misère matérielle de la finitude : le convoi n’a pour escorte que la fidélité populaire de Christophe et la révolte naissante d’Eugène.',
			},
		],
		quotations: [
			{
				text: 'Comprenez-vous que je vais mourir sans les voir, mes filles ? Avoir soif toujours, et ne jamais boire, voilà comment j’ai vécu depuis dix ans... […] Ne pas les voir, voilà l’agonie !',
				speaker: 'Jean-Joachim Goriot',
				reference: 'Quatrième partie (« La Mort du père »)',
				explanation: 'Le désespoir absolu de l’abandon au seuil de la mort, bien plus cruel que les souffrances physiques de la maladie.',
			},
			{
				text: 'Rastignac, resté seul, fit quelques pas vers le haut du cimetière et vit Paris tortueusement couché le long des deux rives de la Seine, où commençaient à briller les lumières.',
				speaker: 'Honoré de Balzac (narrateur)',
				reference: 'Conclusion du Père Goriot',
				explanation: 'L’isolement d’Eugène sur la tombe fraîche devient le tremplin de sa résolution : seul face au monstre urbain.',
			},
		],
		relatedThemeIds: ['paternite-sacrifice', 'apparences-reputation', 'inegalites-pouvoir'],
		verificationNotes: 'Dénouement tragique symétrique : retrait solitaire de Beauséant en Normandie et fosse commune de Goriot au Père-Lachaise.',
		accentColor: '#52525b',
		badgeLabel: 'Solitude',
	},
];
