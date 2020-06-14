import Handlebars from 'handlebars';
import {analyzeTag} from "../definitions/processTag";
const cloneObject = obj => JSON.parse(JSON.stringify(obj));

export default class SRSConstructor {
	constructor() {
		this.cards = [];
	}
	addCards(cards=[]) {
		this.cards = this.cards.concat(cards);
	}
	export() {
		const exported =  ankiExport(this.cards),
			blob = new Blob([exported], {type: 'text/plain'}),
			d = new Date();

		return {
			fileName: `context-reviews-anki-export-${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}.txt`,
			href: URL.createObjectURL(blob)
		};
	}
}

// build the templates when used so they for sure have access to the css variables by then,
// if this runs as the file first runs the css won't have loaded and the background colors will be blank
function createTemplates() {
	const docStyles = getComputedStyle(document.documentElement),
		getCSSVar = varName => docStyles.getPropertyValue(`--${varName}`),
		ankiCommonStyles = `
			<style>
				.card {
					background: ${getCSSVar('bg')} !important;
					color: white;
					max-width: 500px;
					margin: 0 auto;
					font-family: "Source Han Sans", "源ノ角ゴシック", "Hiragino Sans", "HiraKakuProN-W3", "Hiragino Kaku Gothic ProN W3", "Hiragino Kaku Gothic ProN", "ヒラギノ角ゴ ProN W3", "Noto Sans", "Noto Sans CJK JP", "メイリオ", Meiryo, "游ゴシック", YuGothic, "ＭＳ Ｐゴシック", "MS PGothic", "ＭＳ ゴシック", "MS Gothic", sans-serif;
				}
				.word {
					font-size: 3rem;
				}
				.reading {
					font-size: 2rem;
				}
				small {
					color: gray;
				}
				a {
					color: #00b7ff;
				}
				li {
					text-align: left;
				}
				.context {
					font-size: 1.5rem;
				}
				.tag {
					color: #8293a1;
					border: 1px solid #8293a1;
					font-size: 0.7rem;
					padding: 0 0.2rem;
					border-radius: 2px;
				}
				.source {
					text-transform: capitalize;
					font-size: 0.7rem;
				}
				.tag.common {
					color: #00ffac;
					border-color: #00ffac;
				}
				.tag.wanikani {
					border-color: #82216f;
					color: white;
					text-shadow: 0 0 1px black;
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
					background: ${getCSSVar('panel-bg')};
				}
				.dictionary-form {
					font-size: 1.3rem;
					margin: 0;
				}
			</style>
		`,
		ankiFrontTemplate = Handlebars.compile(`
			<p class="word">{{word}}</p>
			${ankiCommonStyles}
		`),
		ankiBackTemplate = Handlebars.compile(`
			{{#if showReading}}
				<p class="reading">{{reading}}</p>
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
						<span class="tag {{this.type}}" style="{{this.styles}}">{{this.text}}</span>
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
			{{#if context}}
				<p class="context">Context: 「{{context}}」</p>
			{{/if}}
			{{#if definition.href}}
				<a href="{{definition.href}}" class="source">Definition source: {{source}}</a>
			{{/if}}
			{{#unless definition.href}}
				<p class="source">Definition source: {{source}}</p>
			{{/unless}}
		`);

	return [
		ankiFrontTemplate,
		ankiBackTemplate
	];
}

export function compileAnkiCard(c) {
	const [
		ankiFrontTemplate,
		ankiBackTemplate
	] = createTemplates();
	//don't leak changes if things weren't cloned elsewhere
	const card = cloneObject(c);
	//some processing beforehand to make the template easier to write
	card.definition.tags = (card.definition.tags || [])
		.map(tag => {
			return analyzeTag(tag);
		})
	//if this word is the same as the context sentence, then they just directly added just this word,
	//there's no point in showing a context sentence that just mirrors the front of the card
	card.context = card.context === card.word ? null : card.context;
	//if the word or reading has been altered from its original dictionary result form, show the dictionary's version
	//in smaller font below the reading they chose.
	card.showOriginal = card.word !== card.definition.word || card.reading !== card.definition.reading;
	//don't want to repeat ourselves for only-kana words
	card.showReading = card.word !== card.reading;
	//don't show furigana in the dictionary definition if it's the same as the word itself
	if (card.definition.reading === card.definition.word) {
		card.definition.reading = '';
	}

	return [
		ankiFrontTemplate(card),
		ankiBackTemplate(card)
	];
}

function ankiExport(cards) {
	function ankiEscape(compiledCardSide) {
		const html = compiledCardSide
			//double double quotes are 'escaped' single double quotes to anki
			.replace(/"/g, '""')
			.replace(/\t/g, '')
			.replace(/\n/g, '');
		//quote return (not escaped quotes) so it allows newlines within the template
		return `"${html}"`
	}

	return cards.map(card => {
		return compileAnkiCard(card).map(ankiEscape).join(';');
	}).join('\n');
}