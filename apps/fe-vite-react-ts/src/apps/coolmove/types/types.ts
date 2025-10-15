export const CoolmoveCode = {

    TYPE: {
        PROMISE: 'promise',
        PRIMARY: 'primary',
    } as const,

    STATUS: {
        EMPTY: 'empty',
        DRAFT: 'draft',
        FINAL: 'final',
        CLOSE: 'close',
    } as const,

};

export type CoolmoveType = (typeof CoolmoveCode.TYPE)[keyof typeof CoolmoveCode.TYPE];
export type CoolmoveStatus = (typeof CoolmoveCode.STATUS)[keyof typeof CoolmoveCode.STATUS];
