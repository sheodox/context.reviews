import Handlebars from 'handlebars';
import { analyzeTags } from '../definitions/process-tag';
import { createLinks } from '../definitions/other-dictionary-links';
import { splitHighlightedTextByRange } from '../utils';
import { Card, CardPrecompiled } from '../types/cards';
const cloneObject = (obj: any) => JSON.parse(JSON.stringify(obj));

export default class SRSConstructor {
	cards: Card[];

	constructor() {
		this.cards = [];
	}
	addCards(cards: Card[] = []) {
		this.cards = this.cards.concat(cards);
	}
	exportTextFile() {
		function ankiEscape(compiledCardSide: string) {
			const html = compiledCardSide
				//double double quotes are 'escaped' single double quotes to anki
				.replace(/"/g, '""')
				.replace(/\t/g, '')
				.replace(/\n/g, '');
			//quote return (not escaped quotes) so it allows newlines within the template
			return `"${html}"`;
		}

		const exported = this.cards
				.map((card) => {
					return compileAnkiCard(card).map(ankiEscape).join(';');
				})
				.join('\n'),
			blob = new Blob([exported], { type: 'text/plain' }),
			d = new Date();

		return {
			fileName: `context-reviews-anki-export-${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}.txt`,
			href: URL.createObjectURL(blob),
		};
	}
	exportAnkiConnect(deckName: string) {
		return this.cards.map((card) => {
			const [front, back] = compileAnkiCard(card);
			return {
				deckName,
				modelName: 'Basic',
				fields: {
					Front: front,
					Back: back,
				},
				tags: ['Context.Reviews'],
				options: {
					allowDuplicate: true,
				},
			};
		});
	}
}

// build the templates when used so they for sure have access to the css variables by then,
// if this runs as the file first runs the css won't have loaded and the background colors will be blank
function createTemplates() {
	const docStyles = getComputedStyle(document.documentElement),
		getCSSVar = (varName: string) => docStyles.getPropertyValue(`--${varName}`),
		ankiCommonStyles = `
			<style>
				.night_mode { }
				.card {
					background: ${getCSSVar('shdx-gray-700')} !important;
					color: white;
					max-width: 500px;
					margin: 0 auto;
					font-family: ${getCSSVar('jp-fonts')};
					font-size: 16px;
				}
				mark {
					background: ${getCSSVar('shdx-blue-300')};
					color: black;
					border-radius: 3px;
					white-space: nowrap;
				}
				.word {
					font-size: 3rem;
				}
				.word.front-context {
					font-size: 1.75rem;
				}
				.reading {
					font-size: 2rem;
				}
				small {
					color: gray;
				}
				a {
					color: #4bcbff;
				}
				a:not(:hover) {
					text-decoration: none;
				}
				li {
					text-align: left;
				}
				.context {
					margin: 0.3rem;
				}
				.tag:not(:last-of-type) {
					margin-right: 0.3rem;
				}
				.alternate-forms ruby:not(:last-of-type) {
					margin-right: 0.5rem;
				}
				.alternate-forms ruby:not(:last-of-type)::after {
					content: ', ';
				}
				.dictionary-details {
					padding: 0.5rem;
					border-radius: 3px;
					background: ${getCSSVar('shdx-gray-600')};
					box-shadow: ${getCSSVar('shdx-shadow-5')};
				}
				.dictionary-form {
					font-size: 1.3rem;
					margin: 0;
				}
				#definition-links {
					text-align: center;
				}
				.source {
					text-transform: capitalize;
					font-size: 0.7rem;
					margin: 0 0.2rem;
					display: inline;
				}
				#links-trigger:not(:checked) ~ .other-links {
					display: none;
				}
				#links-trigger {
					display: none;
				}
				#links-trigger + label {
					font-size: 0.7rem;
					cursor: pointer;
					margin: 0 0.2rem;
				}
				#links-trigger + label:hover {
					text-decoration: underline;
				}
				#links-trigger:checked + label::after {
					content: '▲';
					font-size: 0.4rem;
				}
				#links-trigger + label::after {
					content: '▼';
					font-size: 0.4rem;
				}
				.other-links {
					white-space: nowrap;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					position: absolute;
					left: 50%;
					transform: translate(-50%, calc(-100% - 1.5rem));
					background: ${getCSSVar('shdx-gray-500')};
					border-radius: 3px;
					box-shadow: ${getCSSVar('shdx-shadow-5')};
					padding: 0.3rem;
					font-size: 1.2rem;
				}
				.other-links-container {
					position: relative;
				}
				.freeform-notes {
					white-space: pre-line;
					margin: 1rem;
				}
			</style>
		`,
		ankiFrontTemplate = Handlebars.compile(`
				{{#if isFrontContext}}
					<p class="word front-context">
					{{frontBeforeHighlight}}<mark>{{frontHighlight}}</mark>{{frontAfterHighlight}}
					</p>
				{{/if}}
				{{#unless isFrontContext}}
					<p class="word">
						{{word}}
					</p>
				{{/unless}}
			${ankiCommonStyles}
		`),
		ankiBackTemplate = Handlebars.compile(`
			{{#if showReading}}
				<p class="reading">{{reading}}</p>
			{{/if}}
			
			{{#if beforeNotes}}
				<div class="freeform-notes">{{beforeNotes}}</div>
			{{/if}}
				
			<div class="dictionary-details">
				{{#if showOriginal}}
					<p class="dictionary-form">
						<ruby>
							{{definition.word}}
							<rp>(</rp>
							<rt>{{definition.reading}}</rt>
							<rp>)</rp>
						</ruby>
					</p>
				{{/if}}
				
				{{#if definition.tags}}
					{{#each definition.tags}}
						<span class="tag" style="{{this.styles}}">{{this.text}}</span>
					{{/each}}
				{{/if}}
				<ol>
					{{#each definition.meanings}}
						<li>
							{{#if this.preInfo}}
								<small>{{this.preInfo}}</small>
								<br>
							{{/if}}
							
							{{this.definition}}
							
							{{#if this.info}}
								<small> {{this.info}}</small>
							{{/if}}
							
							{{#each this.seeAlso}}
								<small> <a href="{{this.href}}">See also {{this.word}}</a></small>
							{{/each}}
							
							{{#each this.links}}
								<br>
								<small>
									<a href="{{this.url}}">{{this.text}}</a>
								</small>
							{{/each}}
						</li>
					{{/each}}
				</ol>
				{{#if definition.alternateForms}}
					<small class="alternate-forms">
						Alternate forms: 
						{{#each definition.alternateForms}}
							<ruby>
								{{this.word}}
								{{#if this.reading}}
									<rp>(</rp>
									<rt>{{this.reading}}</rt>
									<rp>)</rp>
								{{/if}}
							</ruby>
						{{/each}}
					</small>
				{{/if}}
			</div>
			{{#if afterNotes}}
				<div class="freeform-notes">{{afterNotes}}</div>
			{{/if}}
			{{#if context}}
				<p class="context">
					<a href="{{contextHref}}">「{{context}}」</a>
				</p>
			{{/if}}

			<div id="definition-links">
				{{#if source}}
					<p class="source">
						{{#if definition.href}}
							<a href="{{definition.href}}">Definition source: {{source}}</a>
						{{/if}}
						{{#unless definition.href}}
							Definition source: {{source}}
						{{/unless}}
					</p>
				{{/if}}
				
				<span class="other-links-container">
					<input type="checkbox" id="links-trigger">
					<label for="links-trigger">
						Other Links
					</label>
					
					<div class="other-links">
						{{#each otherLinks}}
							<a href="{{this.href}}">{{this.siteName}}</a>
						{{/each}}
					</div>
				</span>
			</div>
		`);

	return [ankiFrontTemplate, ankiBackTemplate];
}

export function compileAnkiCard(c: Card): [string, string] {
	const [ankiFrontTemplate, ankiBackTemplate] = createTemplates(),
		//don't leak changes if things weren't cloned elsewhere
		card: CardPrecompiled = cloneObject(c),
		jishoSearchUrl = (word: string) => `https://jisho.org/search/${encodeURIComponent(word)}`;

	//some processing beforehand to make the template easier to write

	card.definition.tags = analyzeTags(c.definition.tags || []);

	card.isFrontContext = card.cardStyle === 'context';

	const { before, highlight, after } = splitHighlightedTextByRange(card.context, card.wordHighlightRange);
	card.frontBeforeHighlight = before;
	card.frontHighlight = highlight;
	card.frontAfterHighlight = after;

	//if this word is the same as the context sentence, then they just directly added just this word,
	//there's no point in showing a context sentence that just mirrors the front of the card
	card.context = card.context === card.word ? null : card.context;
	if (card.context) {
		card.contextHref = jishoSearchUrl(card.context);
	}

	//if the word or reading has been altered from its original dictionary result form, show the dictionary's version
	//in smaller font below the reading they chose. also make sure the word actually exists (they might have deleted
	//it in customization) otherwise there will just be a bunch of blank space.
	card.showOriginal =
		card.isFrontContext ||
		(card.definition.word && (card.word !== card.definition.word || card.reading !== card.definition.reading));
	//don't want to repeat ourselves for only-kana words
	card.showReading = card.word !== card.reading;

	//don't show furigana in the dictionary definition if it's the same as the word itself
	if (card.definition.reading === card.definition.word) {
		card.definition.reading = '';
	}
	//don't show furigana on alternate forms if the word is the same as the reading
	(card.definition.alternateForms || []).map((form) => {
		if (form.word === form.reading) {
			form.reading = '';
		}
	});

	//enrich the 'see also' words with links so they can be clicked on the card
	card.definition.meanings.forEach((meaning, index) => {
		meaning.seeAlso = c.definition.meanings[index].seeAlso.map((word) => {
			return {
				word,
				href: jishoSearchUrl(word),
			};
		});
	});

	//add links to other dictionaries
	card.otherLinks = createLinks(card.word);

	return [ankiFrontTemplate(card), ankiBackTemplate(card)];
}
