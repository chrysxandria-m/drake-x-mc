class GameScreen {
    constructor(containerElement, finishGame) {
        this.containerElement = containerElement;
        this.finishGame = finishGame;

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
}
