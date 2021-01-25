import './extension-style.scss';
import Stasher from './stasher/Stasher.svelte'
import {addToast} from "./stasher/toast-stores";
import {COULDNT_CONNECT_ERROR, messageBackground, record} from "./extension-utils";

const mount = document.createElement('div');
mount.id = "context-reviews-root"
document.body.appendChild(mount);
const app = new Stasher({
    target: mount
})

function setup() {
    //if the first result ever changes (like when clicking through parts of a sentence), run a callback
    let lastKnownFirstResult = '';
    setInterval(() => {
        const firstResult = document.querySelector('.concept_light .concept_light-representation .text');

        if (firstResult && firstResult !== lastKnownFirstResult) {
            lastKnownFirstResult = firstResult;
            onResultsChange();
        }
    }, 20);
}

//anything that needs to happen whenever the list of search results change,
//runs both immediately and when clicking through the words in a phrase
function onResultsChange() {
    //.concept_light-wrapper is the column that contains the reading for the word, as well as the links
    for (const wrapper of document.querySelectorAll('.concept_light')) {
        const word = wrapper.querySelector('.concept_light-representation .text').textContent.trim(),
            addReview = document.createElement('a');

        addReview.textContent = `Add ${word} to Context.Reviews`;
        addReview.setAttribute('href', '#');
        addReview.classList.add('concept_light-status_link');
        addReview.addEventListener('click', e => {
            record(word)
            //prevent scrolling to the top
            e.preventDefault();
        })

        //.concept_light-status is the direct container of the badges and links beneath the word
        //it's easy to accidentally open the "links" dropdown when moving your cursor down the list
        //of links, so put the add button right before it so that remains on the bottom
        wrapper.querySelector('.concept_light-status a[data-dropdown]')
            .after(addReview);
    }
}

setup();