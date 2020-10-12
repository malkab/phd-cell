/*

    A simple error class

*/

export enum ECellErrorCode {
    UNKNOWNERROR = 0,
    CELLDSERROR,
    DATAERROR,
    CLASSERROR,
    REDISERROR
}

const cellErrorCodesDescription: { [ errorCode: number ]: string } = {
    0: "UNKNOWNERROR",
    1: "CELLDSERROR",
    2: "DATAERROR",
    3: "CLASSERROR",
    4: "REDISERROR"
};


export class CellError extends Error {

    /*

        Private members

    */

    private _code: ECellErrorCode;
    private _message: string;
    private _originalMessage: string;
    private _stack: any;


    /*

        Getters & Setters

    */

    get code(): ECellErrorCode {
        return this._code;
    }

    get message(): string {
        return this._message;
    }

    get originalMessage(): string {
        return this._originalMessage;
    }

    get stack(): any {
        if (this._stack) {
            return this._stack;
        } else {
            return super.stack;
        }
    }

    get explanation(): string {

        return `
ERROR:
    Code: ${this._code}
    Error: ${cellErrorCodesDescription[this._code]}
    Message: ${this._message}
    Original message: ${this._originalMessage}
    Stack:
    ${this.stack}
        `;

    }



    /*

        Constructor

    */

    constructor(code: ECellErrorCode, message?: string, error?: Error) {

        super(message);

        this._code = code;
        this._message = message;

        if (error) {
            this._stack = error.stack;
            this._originalMessage = error.message;
        } else {
            this._stack = null;
            this._originalMessage = null;
        }

    }

}