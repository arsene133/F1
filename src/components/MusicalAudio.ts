import type { TimelineItemAudio, TimelineItemAudioEmbedded, TimelineItemAudioExternal, TimelineItemListenLink } from '../data/timeline';

export interface MusicalAudioProps {
	title: string;
	author?: string;
	audio?: TimelineItemAudio;
	listenLink?: TimelineItemListenLink;
}

export function formatDuration(duration: string): string {
	const [min, sec] = duration.split(':');
	return `${Number(min)} min ${sec}`;
}

export function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

export function escapeAttr(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

/**
 * Composant MusicalAudio unifié :
 * - Mode 'embedded' : lecteur audio HTML5 natif (preload="none", playsinline, aucun autoplay, métadonnées complètes),
 *   message de repli (masqué) révélé par la frise si aucune source ne répond
 * - Mode 'external' : lien externe accessible (target="_blank", rel="noopener noreferrer", sans balise <audio>)
 * - Aucun média : chaîne vide
 */
export function renderMusicalAudio(props: MusicalAudioProps): string {
	const audio = props.audio;
	const listenLink = props.listenLink;

	// 1. Ressource audio intégrée
	if (audio?.type === 'embedded') {
		const embedded = audio as TimelineItemAudioEmbedded;
		const label = `Écouter : ${escapeHtml(embedded.title)}`;
		const durationHtml = embedded.duration
			? ` <span class="details-listen-duration">(${escapeHtml(formatDuration(embedded.duration))})</span>`
			: '';
		const ariaLabel = `${props.title}${props.author ? `, ${props.author}` : ''} — ${embedded.title}`;
		const workLine = `${escapeHtml(props.title)}${props.author ? `, ${escapeHtml(props.author)}` : ''}${embedded.excerpt ? ` — ${escapeHtml(embedded.excerpt)}` : ''}`;

		// Source principale puis encodages de secours : le navigateur passe au suivant si l'un échoue
		const sources = [{ url: embedded.url, mimeType: embedded.mimeType }, ...(embedded.fallbackSources ?? [])]
			.map((s) => `<source src="${escapeAttr(s.url)}" type="${escapeAttr(s.mimeType)}" />`)
			.join('\n\t\t');

		const creditParts: string[] = [];
		if (embedded.performer) {
			const dateStr = embedded.recordingDate ? ` (${escapeHtml(embedded.recordingDate)})` : '';
			creditParts.push(`${escapeHtml(embedded.performer)}${dateStr}`);
		}
		creditParts.push(
			`Source : <a href="${escapeAttr(embedded.sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(embedded.source)}</a>`
		);
		if (embedded.licenseUrl) {
			creditParts.push(
				`<a href="${escapeAttr(embedded.licenseUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(embedded.license)}</a>`
			);
		} else {
			creditParts.push(escapeHtml(embedded.license));
		}

		return `
<div class="details-listen is-embedded">
	<p class="details-listen-label">
		<span aria-hidden="true">▶</span> ${label}${durationHtml}
	</p>
	<audio controls preload="none" playsinline aria-label="${escapeAttr(ariaLabel)}">
		${sources}
		<a href="${escapeAttr(embedded.sourceUrl)}" target="_blank" rel="noopener noreferrer">Écouter l’extrait sur ${escapeHtml(embedded.source)}</a>
	</audio>
	<p class="details-listen-unavailable" role="status" hidden>
		Extrait momentanément indisponible ici · <a href="${escapeAttr(embedded.sourceUrl)}" target="_blank" rel="noopener noreferrer">l’écouter sur ${escapeHtml(embedded.source)}<span class="sr-only"> (nouvel onglet)</span></a>
	</p>
	<small class="details-listen-work">${workLine}</small>
	<small class="details-listen-credit">${creditParts.filter(Boolean).join(' · ')}</small>
	<small class="details-listen-note">Extrait de l’œuvre citée dans la frise.</small>
</div>`.trim();
	}

	// 2. Ressource d'écoute externe (audio type 'external' ou ancien listenLink)
	const externalResource: TimelineItemAudioExternal | undefined =
		audio?.type === 'external' ? (audio as TimelineItemAudioExternal) : listenLink;

	if (externalResource) {
		const linkTitle = externalResource.title || 'Écouter l’œuvre';
		const noteSuffix = externalResource.note ? ` — ${escapeHtml(externalResource.note)}` : '';
		return `
<div class="details-listen is-external">
	<a class="details-listen-link" href="${escapeAttr(externalResource.url)}" target="_blank" rel="noopener noreferrer">
		<span aria-hidden="true">↗</span> ${escapeHtml(linkTitle)}<span class="sr-only"> (${escapeHtml(externalResource.source)}, nouvel onglet)</span>
	</a>
	<small class="details-listen-credit">Écoute externe · ${escapeHtml(externalResource.source)}${noteSuffix}</small>
</div>`.trim();
	}

	// 3. Pas de ressource audio
	return '';
}
