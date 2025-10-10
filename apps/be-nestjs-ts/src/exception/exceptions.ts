export default class UniversalException extends Error {
    readonly code: number;
    readonly result: unknown;

    constructor(p: { code: number, message?: string, result?: { [key: string]: any, origin?: Error } }) {
        super(p.message)
        this.code = p.code;
        this.result = p.result;
    }
}