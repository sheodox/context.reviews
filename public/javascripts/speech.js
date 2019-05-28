(function() {
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

    window.say = function(text) {
        if (!text) {
            return;
        }
        voiceReady.then(() => {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.voice = jpVoice;
                speechSynthesis.speak(utterance);
            }
        )
    }
}());
