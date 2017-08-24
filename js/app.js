class App {
    constructor() {
        // default names
        this.names = {
            mcFirstName: 'Riley',
            mcLastName: 'Tennant',
            princeFirstName: 'Liam',
        }

        // for preloading
        this.loadedImages = new Array(g.images.length).fill(null);

        // bind
        this._loadImage = this._loadImage.bind(this);
        this.startGame = this.startGame.bind(this);
        this.finishGame = this.finishGame.bind(this);

        // set up views
        const gameElem = document.querySelector('article');
        this.gameScreen = new GameScreen(gameElem, this.finishGame);

        const feedbackElem = document.querySelector('footer');
        this.feedbackScreen = new FeedbackScreen(feedbackElem);

        // set up interactions
        this.gameScreen.hide();
        this.feedbackScreen.hide();
    }

    _loadImage(imgIndex) {
        return new Promise((resolve, reject) => {
            let onImageLoad = () => {
                resolve();
            };

            this.loadedImages[imgIndex] = new Image();
            this.loadedImages[imgIndex].onload = onImageLoad;
            this.loadedImages[imgIndex].src = 'https://chrysxandria-m.github.io/drake-x-mc/img/' + g.images[imgIndex];
        });
    }

    startGame() {
        // update player-defined names
        const mcFirstName = document.querySelector('#mc-first-name').value;
        const mcLastName = document.querySelector('#mc-last-name').value;
        const princeFirstName = document.querySelector('#prince-first-name').value;
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
        const introElem = document.querySelector('#questions');
        const loadingElem = document.querySelector('#loading');
        introElem.classList.add('inactive');
        loadingElem.classList.remove('inactive');

        let promisesArr = [];

        // update script
        const scriptFile = document.querySelector('#script-file').value;
        this.gameScreen.scriptReader.setScript(scriptFile, this.names);
        // setScript returns a promise
        let scriptPromise = this.gameScreen.scriptReader.setScript(scriptFile, this.names);
        promisesArr.push(scriptPromise);

        // preload images
        for (let i = 0; i < g.images.length; i++) {
            let currPromise = this._loadImage(i);
            promisesArr.push(currPromise);
        }

        // when ready, hide loading screen, show game screen
        Promise.all(promisesArr).then(
            (value) => { // on success
                const loadingElem = document.querySelector('#loading');
                loadingElem.classList.add('inactive');

                this.gameScreen.show();
            },
            (error) => { // on error
                console.error('Error: Something went wrong loading script/images. ' + error);
            });
    }

    finishGame() {
        this.gameScreen.hide();
        this.feedbackScreen.show();
    }
}
