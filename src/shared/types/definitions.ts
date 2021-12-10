export interface JishoExternalLink {
	text: string;
	url: string;
}

export interface JapaneseForm {
	word: string;
	reading: string;
}

export interface Meaning {
	preInfo: string;
	definition: string;
	seeAlso: string[];
	links: JishoExternalLink[];
	info: string;
}

export interface Definition extends JapaneseForm {
	// string for the 'word' page for this specific result
	href: string;
	tags: string[];
	alternateForms: JapaneseForm[];
	meanings: Meaning[];
}

export interface SearchResults {
	href: string;
	definitions: Definition[];
}
