<CardPreview card={cards[currentCard]} demoMode={true} on:demo-learned={nextCard} />

<script lang="ts">
	import CardPreview from '../export-app/CardPreview.svelte';
	import type { Card } from '../types/cards';
	let currentCard = 0;

	function nextCard() {
		if (currentCard + 1 < cards.length) {
			currentCard += 1;
		} else {
			currentCard = 0;
		}
	}

	const cards: Card[] = [
		{
			id: 'https://jisho.org/word/%E4%BA%BA%E6%B0%97',
			word: '人気',
			reading: 'にんき',
			context: '僕の出身の徳島もこってり系のラーメンが人気でよくそれに慣れていた。',
			beforeNotes: '',
			afterNotes: '',
			definition: {
				word: '人気',
				href: 'https://jisho.org/word/%E4%BA%BA%E6%B0%97',
				tags: ['common', 'jlpt-n3', 'wanikani4'],
				alternateForms: [],
				reading: 'にんき',
				meanings: [
					{ preInfo: 'Noun, No-adjective', definition: 'popularity, public favor', seeAlso: [], links: [], info: '' },
					{
						preInfo: 'Noun',
						definition: 'condition (e.g. market), tone, character, nature',
						seeAlso: [],
						links: [],
						info: '',
					},
				],
			},
			source: 'jisho',
		},
		{
			cardStyle: 'context',
			wordHighlightRange: [26, 28],
			id: 'https://jisho.org/word/%E7%B0%A1%E5%8D%98',
			word: '簡単',
			reading: 'かんたん',
			context: '近未来、ICチップを身体に埋め込むだけで全ての言語を簡単に話せるようになったりね',
			beforeNotes: 'You can customize your cards to add notes or change meanings!',
			afterNotes: 'You can even put notes down here if you want!',
			definition: {
				word: '簡単',
				href: 'https://jisho.org/word/%E7%B0%A1%E5%8D%98',
				tags: ['common', 'jlpt-n4', 'wanikani33'],
				alternateForms: [
					{ reading: 'かんたん', word: '簡短' },
					{ reading: 'かんたん', word: '簡端' },
				],
				reading: 'かんたん',
				meanings: [
					{
						preInfo: 'Na-adjective, Noun',
						definition: 'simple, easy, uncomplicated',
						seeAlso: [],
						links: [],
						info: '',
					},
					{ preInfo: '', definition: 'brief, quick, light', seeAlso: [], links: [], info: '' },
				],
			},
			source: 'jisho',
		},
		{
			id: 'https://jisho.org/word/%E5%BA%AD',
			word: '庭',
			reading: 'にわ',
			context: 'どうやって鹿は庭に入ったかな',
			beforeNotes: '',
			afterNotes: '',
			definition: {
				word: '庭',
				href: 'https://jisho.org/word/%E5%BA%AD',
				tags: ['common', 'jlpt-n5', 'wanikani12'],
				alternateForms: [],
				reading: 'にわ',
				meanings: [
					{ preInfo: 'Noun', definition: 'garden, yard, courtyard', seeAlso: [], links: [], info: '' },
					{ preInfo: '', definition: 'field (of action), area', seeAlso: [], links: [], info: '' },
				],
			},
			source: 'jisho',
		},
		{
			cardStyle: 'context',
			wordHighlightRange: [10, 12],
			id: 'https://jisho.org/word/%E8%BA%AB%E4%BD%93',
			word: '身体',
			reading: 'しんたい',
			context: '近未来、ICチップを身体に埋め込むだけで全ての言語を簡単に話せるようになったりね',
			beforeNotes: '',
			afterNotes: '',
			definition: {
				word: '身体',
				href: 'https://jisho.org/word/%E8%BA%AB%E4%BD%93',
				tags: ['common'],
				alternateForms: [
					{ reading: 'しんだい', word: '身体' },
					{ reading: 'しんてい', word: '身体' },
				],
				reading: 'しんたい',
				meanings: [
					{ preInfo: 'Noun', definition: 'body, physical system, person', seeAlso: ['体 からだ'], links: [], info: '' },
				],
			},
			source: 'jisho',
		},
		{
			id: 'https://jisho.org/word/%E6%9C%AA%E7%9F%A5',
			word: '未知',
			reading: 'みち',
			context: '遊泳中に見えない水面下より未知の生物に噛まれ、毒を注入され誰にも気付かれず溺れて死ぬこと。',
			beforeNotes: '',
			afterNotes: '',
			definition: {
				word: '未知',
				href: 'https://jisho.org/word/%E6%9C%AA%E7%9F%A5',
				tags: ['common', 'jlpt-n1'],
				alternateForms: [],
				reading: 'みち',
				meanings: [
					{
						preInfo: 'No-adjective, Noun',
						definition: 'not yet known, unknown, strange',
						seeAlso: [],
						links: [],
						info: '',
					},
				],
			},
			source: 'jisho',
		},
		{
			id: 'https://jisho.org/word/%E8%B1%9A%E9%AA%A8',
			word: '豚骨',
			reading: 'とんこつ',
			context: '好きなラーメンは豚骨スープベースのものだ。',
			beforeNotes: '',
			afterNotes: '',
			definition: {
				word: '豚骨',
				href: 'https://jisho.org/word/%E8%B1%9A%E9%AA%A8',
				tags: [],
				alternateForms: [],
				reading: 'とんこつ',
				meanings: [
					{
						preInfo: 'Noun',
						definition:
							'dish made with pork belly and bones, simmered with miso, sake, vegetables, etc. (from Kagoshima)',
						seeAlso: [],
						links: [],
						info: '',
					},
				],
			},
			source: 'jisho',
		},
		{
			cardStyle: 'context',
			wordHighlightRange: [5, 9],
			id: 'https://jisho.org/word/%E3%81%82%E3%81%A3%E3%81%95%E3%82%8A',
			word: 'あっさり',
			reading: 'あっさり',
			context: '東京は逆にあっさりした醤油ベースのラーメンが多いが口に合わない。',
			beforeNotes: '',
			afterNotes: '',
			definition: {
				word: 'あっさり',
				href: 'https://jisho.org/word/%E3%81%82%E3%81%A3%E3%81%95%E3%82%8A',
				tags: ['common', 'jlpt-n1'],
				alternateForms: [{ reading: 'アッサリ', word: 'アッサリ' }],
				reading: 'あっさり',
				meanings: [
					{
						preInfo: "Adverb, Adverb taking the 'to' particle, Suru verb",
						definition: 'easily, readily, quickly, flatly (refuse)',
						seeAlso: [],
						links: [],
						info: 'Onomatopoeic or mimetic word',
					},
					{
						preInfo: '',
						definition: 'lightly (seasoned food, applied make-up, etc.), plainly, simply',
						seeAlso: [],
						links: [],
						info: 'Onomatopoeic or mimetic word',
					},
				],
			},
			source: 'jisho',
		},
		{
			id: 'https://jisho.org/word/%E6%9C%AA%E6%9D%A5',
			word: '未来',
			reading: 'みらい',
			context: '人に触れることでその人の未来を見ること。',
			beforeNotes: '',
			afterNotes: '',
			definition: {
				word: '未来',
				href: 'https://jisho.org/word/%E6%9C%AA%E6%9D%A5',
				tags: ['common', 'jlpt-n3', 'wanikani7'],
				alternateForms: [],
				reading: 'みらい',
				meanings: [
					{
						preInfo: 'Noun, No-adjective',
						definition: 'the future (usually distant)',
						seeAlso: [],
						links: [],
						info: '',
					},
					{ preInfo: '', definition: 'future tense', seeAlso: [], links: [], info: '' },
					{ preInfo: '', definition: 'the world to come', seeAlso: [], links: [], info: '' },
					{
						preInfo: 'Wikipedia definition',
						definition: 'Future',
						seeAlso: [],
						links: [
							{
								text: 'Read “Future” on English Wikipedia',
								url: 'http://en.wikipedia.org/wiki/Future?oldid=495475617',
							},
							{ text: 'Read “未来” on Japanese Wikipedia', url: 'http://ja.wikipedia.org/wiki/未来?oldid=42589705' },
						],
						info: '',
					},
				],
			},
			source: 'jisho',
		},
		{
			id: 'https://jisho.org/word/%E8%A6%8B%E5%BC%B5%E3%82%8B',
			word: '見張る',
			reading: 'みはる',
			context: '森を抜けると目を見張るような風景が広がっています。',
			beforeNotes: '',
			afterNotes: '',
			definition: {
				word: '見張る',
				href: 'https://jisho.org/word/%E8%A6%8B%E5%BC%B5%E3%82%8B',
				tags: ['common'],
				alternateForms: [
					{ reading: 'みはる', word: '見はる' },
					{ reading: 'みはる', word: '瞠る' },
				],
				reading: 'みはる',
				meanings: [
					{
						preInfo: 'Godan verb with ru ending, Transitive verb',
						definition: 'to stand watch, to stand guard, to look out',
						seeAlso: [],
						links: [],
						info: 'Only applies to 見張る, Only applies to 見はる',
					},
					{ preInfo: '', definition: "to open (one's eyes) wide", seeAlso: ['目を見張る'], links: [], info: '' },
				],
			},
			source: 'jisho',
		},
		{
			id: 'https://jisho.org/word/%E9%A2%A8%E6%99%AF',
			word: '風景',
			reading: 'ふうけい',
			context: '森を抜けると目を見張るような風景が広がっています。',
			beforeNotes: '',
			afterNotes: '',
			definition: {
				word: '風景',
				href: 'https://jisho.org/word/%E9%A2%A8%E6%99%AF',
				tags: ['common', 'jlpt-n3'],
				alternateForms: [],
				reading: 'ふうけい',
				meanings: [
					{
						preInfo: 'Noun, No-adjective',
						definition: 'scenery, scene, landscape, view, sight',
						seeAlso: [],
						links: [],
						info: '',
					},
					{ preInfo: '', definition: 'scene (e.g. of a crime)', seeAlso: [], links: [], info: '' },
				],
			},
			source: 'jisho',
		},
		{
			id: 'https://jisho.org/word/%E8%A8%80%E8%AA%9E',
			word: '言語',
			reading: 'げんご',
			context: '近未来、ICチップを身体に埋め込むだけで全ての言語を簡単に話せるようになったりね',
			beforeNotes: '',
			afterNotes: '',
			definition: {
				word: '言語',
				href: 'https://jisho.org/word/%E8%A8%80%E8%AA%9E',
				tags: ['common', 'jlpt-n3', 'wanikani10'],
				alternateForms: [
					{ reading: 'ごんご', word: '言語' },
					{ reading: 'げんきょ', word: '言語' },
				],
				reading: 'げんご',
				meanings: [
					{ preInfo: 'Noun', definition: 'language', seeAlso: [], links: [], info: '' },
					{
						preInfo: 'Wikipedia definition',
						definition: 'Language',
						seeAlso: [],
						links: [
							{
								text: 'Read “Language” on English Wikipedia',
								url: 'http://en.wikipedia.org/wiki/Language?oldid=495368622',
							},
							{ text: 'Read “言語” on Japanese Wikipedia', url: 'http://ja.wikipedia.org/wiki/言語?oldid=42599820' },
						],
						info: '',
					},
				],
			},
			source: 'jisho',
		},
	];
</script>
