<div class="card-preview" use:mountPreview></div>

<script>
    import {compileAnkiCard} from './SRSConstructor';
    export let card = {};

    function mountPreview(element) {
        const [cardFront, cardBack] = compileAnkiCard(card),
            shadow = element.attachShadow({mode: 'closed'}),
            cardContainer = document.createElement('div');
        cardContainer.classList.add('card');
        cardContainer.innerHTML = `
            <style>
                .card {
                    text-align: center;
                }
                p.word {
                    margin: 0;
                }
            </style>

            ${cardFront}
            <hr>
            ${cardBack}
        `;
        shadow.appendChild(cardContainer);
    }
</script>