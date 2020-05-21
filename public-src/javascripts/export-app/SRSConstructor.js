import Handlebars from 'handlebars';
import {analyzeTag} from "../definitions/processTag";

export default class SRSConstructor {
	constructor() {
		this.cards = [];
	}
	addCards(cards=[]) {
		this.cards = this.cards.concat(cards);
	}
	export() {
		const exported =  ankiExport(this.cards),
			a = document.createElement('a'),
			blob = new Blob([exported], {type: 'text/plain'}),
			d = new Date();
		a.download = `context-sentence-anki-export-${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}.txt`;
		a.href = URL.createObjectURL(blob);
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}
}

const ankiCommonStyles = `
		<style>
			.card {
				background: #151d29;
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
				border: 1px solid #1f2b3d;
				font-size: 0.7rem;
				padding: 0 0.2rem;
			}
			a.source {
				text-transform: capitalize;
				font-size: 0.7rem;
			}
			.tag.common {
				color: #00ffac;
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
		</style>
	`,
	ankiFrontTemplate = Handlebars.compile(`
		${ankiCommonStyles}
		<p class="word">{{word}}</p>
	`),
	ankiBackTemplate = Handlebars.compile(`
		${ankiCommonStyles}
		<p class="reading">{{reading}}</p>
		{{#if detail.tags}}
			{{#each detail.tags}}
				<span class="tag {{this.type}}" style="{{this.styles}}">{{this.text}}</span>
			{{/each}}
		{{/if}}
		<ol>
			{{#each detail.meanings}}
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
		{{#if detail.alternateForms}}
			<small class="alternate-forms">
				Alternate forms: 
				{{#each detail.alternateForms}}
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
		{{#if context}}
			<p class="context">Context: 「{{context}}」</p>
		{{/if}}
		<a href="{{detail.href}}" class="source">Source: {{detail.source}}</a>
	`)

function ankiExport(cards) {
	function side(template, card) {
		const html = template(card)
			//double double quotes are 'escaped' single double quotes to anki
			.replace(/"/g, '""')
			.replace(/\t/g, '')
			.replace(/\n/g, '');
		//quote return (not escaped quotes) so it allows newlines within the template
		return `"${html}"`
	}
	return cards.map(card => {
		card.detail.tags = (card.detail.tags || [])
			.map(tag => {
				return analyzeTag(tag);
			})
		//if this word is the same as the context sentence, then they just directly added just this word,
		//there's no point in showing a context sentence
		card.context = card.context === card.word ? null : card.context;
		return [
			side(ankiFrontTemplate, card),
			side(ankiBackTemplate, card)
		].join(';');
	}).join('\n');
}