import { Definition, Meaning } from '../../shared/types/definitions';

export interface Card {
	id: string;
	word: string;
	reading: string;
	context: string;
	beforeNotes: string;
	afterNotes: string;
	wordHighlightRange?: [number, number];
	definition: Definition;
	source: string;
	cardStyle?: CardStyle;
}

interface MeaningPrecompiled extends Omit<Meaning, 'seeAlso'> {
	seeAlso: {
		word: string;
		href: string;
	}[];
}
interface DefinitionPrecompiled extends Omit<Definition, 'tags' | 'meanings'> {
	meanings: MeaningPrecompiled[];
	tags: { text: string; styles: string }[];
}

// the template engine used by the card generation has a pretty primitive API
// so we need to do a bunch of things to the card data so it can be compiled
export interface CardPrecompiled extends Omit<Card, 'definition'> {
	isFrontContext: boolean;
	frontBeforeHighlight: string;
	frontHighlight: string;
	frontAfterHighlight: string;
	contextHref: string;
	showOriginal: boolean;
	showReading: boolean;
	otherLinks: {
		siteName: string;
		href: string;
	}[];
	definition: DefinitionPrecompiled;
}

export type CardStyle = 'context' | 'word';
