<div class="card-preview" use:mountPreview={card}></div>

<script>
    import {compileAnkiCard} from './SRSConstructor';
    export let card = {};

	/**
     * Compile the card's markup, and mount it within a shadow DOM to keep styles separate
	 * @param element
     * @param card - the card store
	 */
	function mountPreview(element) {
        const [cardFront, cardBack] = compileAnkiCard(card),
            shadow = element.shadowRoot || element.attachShadow({mode: 'open'}),
            cardContainer = document.createElement('div');
        cardContainer.style.padding = '1rem';
        cardContainer.classList.add('card');
        cardContainer.innerHTML = `
            ${cardFront}
            <hr>
            ${cardBack}

            <style>
                .card {
                    text-align: center;
                }
                p.word {
                    margin: 0;
                }
            </style>

        `;
        shadow.innerHTML = '';
        shadow.appendChild(cardContainer);
        //can't set target=_blank in the template or Anki won't open it,
        //but we don't want someone to accidentally open it and lose progress (there is a confirm, but don't want to risk it)
		cardContainer.querySelectorAll('a').forEach(anchor => anchor.setAttribute('target', '_blank'));

		return {
            update() {
                mountPreview(element, card);
            }
        }
	}
</script>