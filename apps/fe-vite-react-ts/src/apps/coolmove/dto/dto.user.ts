export interface DtoUser {
    seq?: number;
    // KEY
    userid: string;
    //
    passwd?: string;
    mobile: string;
    //
    name?: string;
    //
    sysUserId?: string | null;
    regUserId?: string;
    regDt?: Date;
    modUserId?: string;
    modDt?: Date;
}

export const emptyUser: DtoUser = {
    userid: '',
    mobile: '',
    sysUserId: localStorage.getItem('userid'),
};
