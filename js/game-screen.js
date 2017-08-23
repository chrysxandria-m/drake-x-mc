class GameScreen {
    constructor(containerElement, finishGame) {
        this.containerElement = containerElement;
        this.finishGame = finishGame;

        // bind
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.setScreenActive = this.setScreenActive.bind(this);
        this.updateTextContent = this.updateTextContent.bind(this);
        this.displayNextScreen = this.displayNextScreen.bind(this);

        // set up ScriptReader
        this.scriptReader = new ScriptReader();
    }

    show() {
        this.containerElement.classList.remove('inactive');
    }

    hide() {
        this.containerElement.classList.add('inactive');
    }

    setScreenActive(type) {
        for (var key in g.types) {
            const elem = document.querySelector('#' + g.types[key]);
            if (type === key) {
                elem.classList.remove('inactive');
            } else {
                elem.classList.add('inactive');
            }
        }
    }

    updateTextContent(elem, text) {
        var re = /_([^_]+)_/; // _threw it away_
        var found = text.match(re);
        if (found) {
            while (found) {
                text = text.replace(found[0], '<em>' + found[1] + '</em>');
                found = text.match(re);
            }
            elem.innerHTML = text;
        } else {
            elem.textContent = text;
        }
    }

    displayNextScreen() {
        var result = this.scriptReader.nextScreen();
        this.setScreenActive(result.type);
        const elem = document.querySelector('#' + g.types[result.type]);
        if (result.type === 'narrator') {
            const textElem = elem.querySelector('.text');
            this.updateTextContent(textElem, result.text);
        } else { // mc, choice, or other
            const profileElem = elem.querySelector('.profile');
            profileElem.textContent = g.smileys[result.emotion];
            profileElem.style.backgroundImage = 'radial-gradient(circle at center, #' +
                g.emotions[result.emotion][0] + ', #' + g.emotions[result.emotion][1] + ')';

            const nameElem = elem.querySelector('.name');
            const textElem = elem.querySelector('.text');
            nameElem.textContent = result.name;
            this.updateTextContent(textElem, result.text);

            if (result.type === 'choice') {
                const choicesElem = elem.querySelector('.choices');
                choicesElem.innerHTML = ''
                for (var choiceKey in result.choices) {
                    const newElem = document.createElement('div');
                    newElem.dataset.id = choiceKey;
                    this.updateTextContent(newElem, result.choices[choiceKey]);
                    choicesElem.appendChild(newElem);
                }
            }
        }
    }
}











