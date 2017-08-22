class ScriptReader {
    constructor() {
        this.scriptRaw = '';
        this.characters = [];

        // bind
        this.setScript = this.setScript.bind(this);
        this.onReadSuccess = this.onReadSuccess.bind(this);
        this.onReadError = this.onReadError.bind(this);
        this.onReadProcessed = this.onReadProcessed.bind(this);
    }

    // for reading script file
    onReadProcessed(text) {
        this.scriptRaw = text;
        var lines = text.split('\n');
        for (const line of lines) {
            console.log(line);
        }
    }
    onReadSuccess(response) {
        response.text().then(this.onReadProcessed)
    }
    onReadError(error) {
        console.error('Error: Script file was not found. ' + error);
    }

    setScript(scriptFile) {
        fetch(scriptFile).then(this.onReadSuccess, this.onReadError);
    }
}
