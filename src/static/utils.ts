export function copyToClipboard(text: string) {
	const el = document.createElement('textarea');
	document.body.appendChild(el);
	el.textContent = text;
	el.select();
	document.execCommand('copy');
	el.remove();
}

export function splitHighlightedTextByRange(text: string, range: [number, number]) {
	if (!range) {
		return { before: text, highlight: '', after: '' };
	}
	return {
		before: text.substring(0, range[0]),
		highlight: text.substring(...range),
		after: text.substring(range[1]),
	};
}
