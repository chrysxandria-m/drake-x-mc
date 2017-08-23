class GameScreen {
    constructor(containerElement, finishGame) {
        this.containerElement = containerElement;
        this.finishGame = finishGame;

        // bind
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.showNextScreen = this.showNextScreen.bind(this);

        // set up ScriptReader
        this.scriptReader = new ScriptReader();
    }

    show() {
        this.containerElement.classList.remove('inactive');

        // this.containerElement.addEventListener('click', this.finishGame);
        // console.log(g.mcFirstName)
    }

    hide() {
        this.containerElement.classList.add('inactive');
    }

    showNextScreen() {

    }
}
