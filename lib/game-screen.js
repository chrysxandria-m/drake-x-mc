'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GameScreen = function () {
    function GameScreen(containerElement, finishGame) {
        _classCallCheck(this, GameScreen);

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

    _createClass(GameScreen, [{
        key: 'show',
        value: function show() {
            this.containerElement.classList.remove('inactive');
        }
    }, {
        key: 'hide',
        value: function hide() {
            this.containerElement.classList.add('inactive');
        }
    }, {
        key: 'doSelectChoice',
        value: function doSelectChoice(e) {
            if (e) {
                e.stopPropagation();
            }
            var dataID = e.currentTarget.dataset.id;
            this.scriptReader.selectChoice(dataID);
            this.displayNextScreen();
        }
    }, {
        key: 'setScreenActive',
        value: function setScreenActive(type) {
            for (var key in g.types) {
                var elem = document.querySelector('#' + g.types[key]);
                if (type === key) {
                    elem.classList.remove('inactive');
                } else {
                    elem.classList.add('inactive');
                }
            }
        }
    }, {
        key: 'updateTextContent',
        value: function updateTextContent(elem, text) {
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

        // hoverText: http://jsfiddle.net/xaAN3/

    }, {
        key: 'addHoverText',
        value: function addHoverText(e) {
            var currElem = e.currentTarget;
            var titleElem = currElem.querySelector('.title');
            if (!titleElem) {
                // titleElem not created
                var newTitleElem = document.createElement('span');
                newTitleElem.classList.add('title');
                newTitleElem.textContent = currElem.getAttribute('title');
                currElem.appendChild(newTitleElem);
            } else if (titleElem.textContent.length === 0) {
                // titleElem exists but not populated
                titleElem.textContent = currElem.getAttribute('title');
            } else {
                // titleElem exists and populated
                titleElem.textContent = '';
            }
        }
    }, {
        key: 'displayNextScreen',
        value: function displayNextScreen(e) {
            // bug fix for skipping screens
            if (e) {
                e.stopPropagation();
            }

            var result = this.scriptReader.nextScreen();

            // endgame
            if (!result) {
                this.finishGame();
                return;
            }

            // make <article> clickable only if necessary
            var articleElem = document.querySelector('article');
            articleElem.removeEventListener('click', this.displayNextScreen);
            articleElem.classList.remove('can-click');
            if (result.type !== 'choice') {
                articleElem.addEventListener('click', this.displayNextScreen);
                articleElem.classList.add('can-click');
            }

            this.setScreenActive(result.type);
            var elem = document.querySelector('#' + g.types[result.type]);

            if (result.type === 'narrator') {
                // narrator
                var textElem = elem.querySelector('.text');
                this.updateTextContent(textElem, result.text);
            } else {
                // mc, choice, or other
                // set name and text
                var nameElem = elem.querySelector('.name');
                var _textElem = elem.querySelector('.text');
                nameElem.textContent = result.name.toUpperCase();
                this.updateTextContent(_textElem, result.text);

                // set profile image
                var profileElem = elem.querySelector('.profile');
                if (result.type === 'other') {
                    // other
                    profileElem.textContent = '';
                    var profileKey = result.shortName + '-' + result.emotion + '.jpg';
                    profileElem.style.backgroundImage = 'url(img/' + profileKey + ')';
                } else {
                    // mc or choice
                    profileElem.textContent = g.smileys[result.emotion];
                    profileElem.style.backgroundImage = 'radial-gradient(circle at center, #' + g.emotions[result.emotion][0] + ', #' + g.emotions[result.emotion][1] + ')';
                }

                // set choices
                if (result.type === 'choice') {
                    // clear existing choices
                    var choicesElem = elem.querySelector('.choices');
                    choicesElem.innerHTML = '';

                    // create new choices
                    for (var choiceKey in result.choices) {
                        var newElem = document.createElement('div');
                        this.updateTextContent(newElem, result.choices[choiceKey]);

                        if (choiceKey.indexOf('*') !== -1) {
                            // unavailable choice
                            var hoverText = choiceKey.slice(choiceKey.indexOf('*') + 1);
                            newElem.setAttribute("title", hoverText);
                            newElem.addEventListener('click', this.addHoverText);
                            // newElem.setAttribute("data-balloon", hoverText);
                            // newElem.setAttribute("data-balloon-pos", 'up');
                            newElem.classList.add('invalid-choice');
                        } else {
                            // regular choice
                            newElem.dataset.id = choiceKey;
                            newElem.classList.add('valid-choice');
                            newElem.addEventListener('click', this.doSelectChoice);
                        }
                        choicesElem.appendChild(newElem);
                    }
                }
            }
        }
    }]);

    return GameScreen;
}();