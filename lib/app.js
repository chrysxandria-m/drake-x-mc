'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function () {
    function App() {
        _classCallCheck(this, App);

        // default names
        this.names = {
            mcFirstName: 'Riley',
            mcLastName: 'Tennant',
            princeFirstName: 'Liam'

            // for preloading
        };this.loadedImages = new Array(g.images.length).fill(null);

        // bind
        this._loadImage = this._loadImage.bind(this);
        this.initGame = this.initGame.bind(this);
        this._startGame = this._startGame.bind(this);
        this.finishGame = this.finishGame.bind(this);

        // set up views
        var gameElem = document.querySelector('article');
        this.gameScreen = new GameScreen(gameElem, this.finishGame);
        this.gameScreen.hide();

        var feedbackElem = document.querySelector('footer');
        this.feedbackScreen = new FeedbackScreen(feedbackElem);
        this.feedbackScreen.hide();
    }

    _createClass(App, [{
        key: '_loadImage',
        value: function _loadImage(imgIndex) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                var onImageLoad = function onImageLoad() {
                    resolve();
                };

                _this.loadedImages[imgIndex] = new Image();
                _this.loadedImages[imgIndex].onload = onImageLoad;
                _this.loadedImages[imgIndex].src = 'https://chrysxandria-m.github.io/drake-x-mc/img/' + g.images[imgIndex];
            });
        }
    }, {
        key: '_startGame',
        value: function _startGame() {
            // hide loading screen, show game screen
            var loadingElem = document.querySelector('#loading');
            loadingElem.classList.add('inactive');
            this.gameScreen.show();
            this.gameScreen.displayNextScreen();
        }
    }, {
        key: 'initGame',
        value: function initGame() {
            // update player-defined names
            var mcFirstName = document.querySelector('#mc-first-name').value;
            var mcLastName = document.querySelector('#mc-last-name').value;
            var princeFirstName = document.querySelector('#prince-first-name').value;
            if (mcFirstName.length > 0) {
                this.names.mcFirstName = mcFirstName;
            }
            if (mcLastName.length > 0) {
                this.names.mcLastName = mcLastName;
            }
            if (princeFirstName.length > 0) {
                this.names.princeFirstName = princeFirstName;
            }

            // hide intro screen, show loading screen
            var headerElem = document.querySelector('header');
            var questionElem = document.querySelector('#questions');
            var loadingElem = document.querySelector('#loading');
            headerElem.classList.add('hide-on-mobile');
            questionElem.classList.add('inactive');
            loadingElem.classList.remove('inactive');

            var promisesArr = [];

            // update script
            var scriptFile = document.querySelector('#script-file').value;
            // setScript returns a promise
            var scriptPromise = this.gameScreen.scriptReader.setScript(scriptFile, this.names);
            promisesArr.push(scriptPromise);

            // preload images
            for (var i = 0; i < g.images.length; i++) {
                var currPromise = this._loadImage(i);
                promisesArr.push(currPromise);
            }

            // when ready, hide loading screen, show game screen
            Promise.all(promisesArr).then(this._startGame, function (error) {
                // on error
                console.error('Error: Something went wrong loading script/images. ' + error);
            });
        }
    }, {
        key: 'finishGame',
        value: function finishGame() {
            this.gameScreen.hide();
            this.feedbackScreen.show();
        }
    }]);

    return App;
}();