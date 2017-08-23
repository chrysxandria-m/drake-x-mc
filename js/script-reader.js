class ScriptReader {
    constructor() {
        this.scriptLines = [];
        this.lineIndex = 0;
        this.characters = {};
        this.choices = []
        this.names = null;

        // bind
        this._onReadProcessed = this._onReadProcessed.bind(this);
        this._onReadSuccess = this._onReadSuccess.bind(this);
        this._onReadError = this._onReadError.bind(this);
        this.setScript = this.setScript.bind(this);
        this.printError = this.printError.bind(this);
        this._processDialogue = this._processDialogue.bind(this);
        this._processLogic = this._processLogic.bind(this);
        this._processLine = this._processLine.bind(this);
        this.replaceNames = this.replaceNames.bind(this);
        this.nextScreen = this.nextScreen.bind(this);
    }

    _onReadProcessed(text) {
        var scriptRaw = text;
        this.scriptLines = text.split('\n');

        // process characters
        if (this.scriptLines[this.lineIndex].includes('% characters %')) {
            this.lineIndex++; // skip '% characters %'
            while (!this.scriptLines[this.lineIndex].includes('% end characters %')) {
                var str = this.scriptLines[this.lineIndex];
                var re = /([A-Za-z]+)\[([A-Z]+)\]/; // Drake[D]
                var found = str.match(re);
                if (found) {
                    this.characters[found[2]] = found[1];
                }
                this.lineIndex++;
            }
        }
        this.characters['MC'] = this.names.mcFirstName;
        this.characters['LN'] = this.names.mcLastName;
        this.characters['P'] = this.names.princeFirstName;
        console.log('CHARACTERS: ', this.characters);
        this.lineIndex++; // skip '% end characters %'
    }

    _onReadSuccess(response) {
        response.text().then(this._onReadProcessed)
    }

    _onReadError(error) {
        console.error('Error: Script file was not found. ' + error);
    }

    setScript(scriptFile, names) {
        this.names = names;
        console.log('TODO: fix this hardcoded value')
        fetch('https://chrysxandria-m.github.io/drake-x-mc/writing/ending.txt').then(this._onReadSuccess, this._onReadError);
    }

    printError(message, line) {
        console.error('Error: ' + message + ' (' + this.lineIndex + ' - ' + line + ')')
    }

    _processDialogue(result, str) {
        var re = /@([A-Z]*):*([hsano]*) \{/; // @MC:n {
        var found = str.match(re);
        if (found) {
            // set type, name, and emotion
            if (found[1] === '') {
                result.type = 'narrator';
            } else {
                result.type = (found[1] === 'MC') ? 'mc' : 'other';
                result.name = this.characters[found[1]];
                result.emotion = found[2] ? found[2] : 'n';
            }
            this.lineIndex++;

            // set text
            while (true) {
                var nextStr = this.scriptLines[this.lineIndex];

                console.log(nextStr); // DEBUG

                if (nextStr.length === 0 || nextStr.includes('#')) { // blank or comment (#)
                    this.lineIndex++; // skip line
                } else if (nextStr.includes('}')) { // finished dialogue
                    this.lineIndex++;
                    break;
                } else if (nextStr.includes('<')) {
                    var nextRe = /<\[(.+)\] (.+)>/; // <[2.1] Drake.>
                    var nextFound = nextStr.match(nextRe);
                    if (nextFound) {
                        result.type = 'choice';
                        result.choices[nextFound[1]] = nextFound[2];
                    }
                    this.lineIndex++;
                } else {
                    result.text += nextStr.trim() + ' ';
                    this.lineIndex++;
                }
            }
        } else {
            this.printError('Incorrectly formatted @ line', str);
        }
    }

    _processLogic(result, str) {
        var re = /% if (.+) %/; // % if 2.1 %
        var found = str.match(re);
        if (found) {
            if (this.choices.includes(found[1])) {
                // enter into the if statement
                console.log('Entering: ' + str)
            } else {
                // skip the if statement

                console.log(found[1]) // DEBUG

                while (!this.scriptLines[this.lineIndex].includes('% end if ' + found[1] + ' %')) {

                    console.log(this.scriptLines[this.lineIndex]) // DEBUG

                    this.lineIndex++; // skip internal lines
                }
            }
            this.lineIndex++; // skip '% end if ... %'
        } else if (str.includes('% end ')) {
            // exiting an if statement
            console.log('Exiting: ' + str);
            this.lineIndex++;
        } else {
            this.printError('Incorrectly formatted % line', str);
        }
    }

    _processLine(result) {
        while (true) {
            var str = this.scriptLines[this.lineIndex];

            console.log(str); // DEBUG

            if (str.length === 0 || str.includes('#')) { // blank or comment (#)
                this.lineIndex++; // skip line
            } else if (str.includes('%')) { // logic (%)
                this._processLogic(result, str);
            } else if (str.includes('@')) { // name (@)
                this._processDialogue(result, str);
                break;
            } else {
                this.printError('Not sure how to interpret line', str);
            }
        }
    }

    replaceNames(result) {
        //TODO
    }

    nextScreen() {
        var result = {
            type: '',
            name: '',
            emotion: '',
            text: '',
            choices: {},
        }
        this._processLine(result);
        this.replaceNames(result);
        console.log('NEXT SCREEN: ', result);
        return result;
    }

    selectChoice(choiceID) {
        this.choices.push(choiceID);
    }
}