class App {
    constructor() {
        this.names = {
            mcFirstName: 'Riley',
            mcLastName: 'Tennant',
            princeFirstName: 'Liam',
        }

        // bind
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

    startGame() {
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

        // update script
        var scriptFile = document.querySelector('#script-file').value;
        this.gameScreen.scriptReader.setScript(scriptFile, this.names);

        // hide intro screen
        const introElem = document.querySelector('#questions');
        introElem.classList.add('inactive');

        this.gameScreen.show();
    }

    finishGame() {
        this.gameScreen.hide();
        this.feedbackScreen.show();
    }
}
