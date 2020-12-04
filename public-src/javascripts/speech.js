let jpVoice;
const voiceReady = new Promise(resolve => {
    function checkVoices() {
        jpVoice = speechSynthesis.getVoices().find(voice => {
            return voice.lang === 'ja-JP' || voice.lang === 'ja';
        });

        if (jpVoice) {
            resolve();
        }
    }
    speechSynthesis.onvoiceschanged = checkVoices; //chrome
    checkVoices(); //firefox
});

export const say = (text) => {
    if (!text) {
        return;
    }
    voiceReady.then(() => {
		//immediately try and say this word, if they wanted to keep listening
        //to something they shouldn't have selected something else
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = jpVoice;
        speechSynthesis.speak(utterance);
    })
};
