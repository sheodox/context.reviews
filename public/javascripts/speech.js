(function() {
    let jpVoice;
    const voiceReady = new Promise(resolve => {
        speechSynthesis.onvoiceschanged = () => {
            jpVoice = speechSynthesis.getVoices().find(voice => {
                return voice.lang === 'ja-JP';
            });
            resolve();
        };
    });

    window.say = function(text) {
        voiceReady.then(() => {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.voice = jpVoice;
                speechSynthesis.speak(utterance);
            }
        )
    }
}());
