// ==========================================================================
// Boîte de Leitner : libellés des compartiments, partagés entre la page
// (rendu statique) et l'interface (navigateur). Ils sont dérivés des
// intervalles réels du planificateur : aucun rythme n'est défini ici.
// ==========================================================================

import { BOX_INTERVAL_DAYS, type BoxNumber } from './scheduler';

/** « à chaque séance », « après 1 jour », « après 3 jours »… */
export function intervalLabel(days: number): string {
	return days === 0 ? 'à chaque séance' : days === 1 ? 'après 1 jour' : `après ${days} jours`;
}

/** Version courte, pour la façade d'un compartiment : « chaque séance », « 1 jour », « 14 jours ». */
export function intervalShort(days: number): string {
	return days === 0 ? 'chaque séance' : days === 1 ? '1 jour' : `${days} jours`;
}

export function boxIntervalLabel(box: BoxNumber): string {
	return intervalLabel(BOX_INTERVAL_DAYS[box]);
}

export const boxPurpose: Readonly<Record<BoxNumber, string>> = {
	1: 'Questions nouvelles ou difficiles',
	2: 'Première consolidation',
	3: 'Renforcement',
	4: 'Mémoire à long terme',
	5: 'Entretien',
};
