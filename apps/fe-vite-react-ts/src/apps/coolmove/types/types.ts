export const CoolmoveCode = {

    STATUS: {
        EMPTY: 'empty',
        DRAFT: 'draft',
        ACTIVATE: 'activate',
        FINISHED: 'finished',
    } as const,

    TYPE: {
        PROMISE: 'promise',
        PRIMARY: 'primary',
    } as const,

};

export type CoolmoveStatus = (typeof CoolmoveCode.STATUS)[keyof typeof CoolmoveCode.STATUS];

export type CoolmoveType = (typeof CoolmoveCode.TYPE)[keyof typeof CoolmoveCode.TYPE];
