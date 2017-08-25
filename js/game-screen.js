class GameScreen {
    constructor(containerElement, finishGame) {
        this.containerElement = containerElement;
        this.finishGame = finishGame;

        // bind
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.doSelectChoice = this.doSelectChoice.bind(this);
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

    doSelectChoice(e) {
        if (e) {
            e.stopPropagation();
        }
        let dataID = e.currentTarget.dataset.id;
        this.scriptReader.selectChoice(dataID);
        this.displayNextScreen();
    }

    setScreenActive(type) {
        for (let key in g.types) {
            const elem = document.querySelector('#' + g.types[key]);
            if (type === key) {
                elem.classList.remove('inactive');
            } else {
                elem.classList.add('inactive');
            }
        }
    }

    updateTextContent(elem, text) {
        let re = /_([^_]+)_/; // _threw it away_
        let found = text.match(re);
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

    // hoverText: http://jsfiddle.net/xaAN3/
    addHoverText(e) {
        let currElem = e.currentTarget;
        let titleElem = currElem.querySelector('.title');
        if (!titleElem) { // titleElem not created
            let newTitleElem = document.createElement('span');
            newTitleElem.classList.add('title');
            newTitleElem.textContent = currElem.getAttribute('title');
            currElem.appendChild(newTitleElem);
        } else if (titleElem.textContent.length === 0) { // titleElem exists but not populated
            titleElem.textContent = currElem.getAttribute('title');
        } else { // titleElem exists and populated
            titleElem.textContent = '';
        }
    }

    displayNextScreen(e) {
        // bug fix for skipping screens
        if (e) {
            e.stopPropagation();
        }

        let result = this.scriptReader.nextScreen();

        // endgame
        if (!result) {
            this.finishGame();
            return;
        }

        // make <article> clickable only if necessary
        const articleElem = document.querySelector('article');
        articleElem.removeEventListener('click', this.displayNextScreen);
        articleElem.classList.remove('can-click');
        if (result.type !== 'choice') {
            articleElem.addEventListener('click', this.displayNextScreen);
            articleElem.classList.add('can-click');
        }

        this.setScreenActive(result.type);
        const elem = document.querySelector('#' + g.types[result.type]);

        if (result.type === 'narrator') { // narrator
            const textElem = elem.querySelector('.text');
            this.updateTextContent(textElem, result.text);

        } else { // mc, choice, or other
            // set name and text
            const nameElem = elem.querySelector('.name');
            const textElem = elem.querySelector('.text');
            nameElem.textContent = result.name.toUpperCase();
            this.updateTextContent(textElem, result.text);

            // set profile image
            const profileElem = elem.querySelector('.profile');
            if (result.type === 'other') { // other
                profileElem.textContent = '';
                let profileKey = result.shortName + '-' + result.emotion + '.jpg';
                profileElem.style.backgroundImage = 'url(img/' + profileKey + ')';
            } else { // mc or choice
                profileElem.textContent = g.smileys[result.emotion];
                profileElem.style.backgroundImage = 'radial-gradient(circle at center, #' +
                g.emotions[result.emotion][0] + ', #' + g.emotions[result.emotion][1] + ')';
            }

            // set choices
            if (result.type === 'choice') {
                // clear existing choices
                const choicesElem = elem.querySelector('.choices');
                choicesElem.innerHTML = ''

                // create new choices
                for (let choiceKey in result.choices) {
                    const newElem = document.createElement('div');
                    this.updateTextContent(newElem, result.choices[choiceKey]);

                    if (choiceKey.indexOf('*') !== -1) { // unavailable choice
                        let hoverText = choiceKey.slice(choiceKey.indexOf('*') + 1);
                        newElem.setAttribute("title", hoverText);
                        newElem.addEventListener('click', this.addHoverText);
                        // newElem.setAttribute("data-balloon", hoverText);
                        // newElem.setAttribute("data-balloon-pos", 'up');
                        newElem.classList.add('invalid-choice')
                    } else { // regular choice
                        newElem.dataset.id = choiceKey;
                        newElem.classList.add('valid-choice')
                        newElem.addEventListener('click', this.doSelectChoice);
                    }
                    choicesElem.appendChild(newElem);
                }
            }
        }
    }
}











