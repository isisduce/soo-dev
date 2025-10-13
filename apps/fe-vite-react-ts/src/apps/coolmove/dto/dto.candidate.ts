import type { CoolmoveStatus, CoolmoveType } from "../types/types";

export interface DtoCandidateItem {
    seq?: number;
    // KEY
    uuid?: string;
    id?: number;
    //
    clubNm: string;
    playerNm: string;
    photoPathNm?: string;
    photoOgnlNm?: string;
    photoFile?: File;
    //
    promises?: string[];
    pledges?: string[];
    votersCount?: number[];
    //
    sysUserId?: string | null;
    regUserId?: string;
    regDt?: Date;
    modUserId?: string;
    modDt?: Date;
}

export interface DtoCandidateMast {
    seq?: number;
    // KEY
    uuid?: string;
    //
    no: number;
    mastNm?: string;
    //
    type?: CoolmoveType;
    candidates: DtoCandidateItem[];
    period?: string;
    begDt?: string;
    endDt?: string;
    //
    status?: CoolmoveStatus;
    votersCount?: number;
    //
    votersPathNm?: string;
    votersOgnlNm?: string;
    votersFile?: File;
    //
    pubYn?: 'Y' | 'N';
    //
    sysUserId?: string | null;
    regUserId?: string;
    regDt?: Date;
    modUserId?: string;
    modDt?: Date;
}

export const emptyCandidateItem: DtoCandidateItem = {
    clubNm: '',
    playerNm: '',
    pledges: ['', '', '', '', ''],
    sysUserId: localStorage.getItem('userid'),
};

export const emptyCandidateMast: DtoCandidateMast = {
    no: 0,
    candidates: [
        { ...emptyCandidateItem, id: 1, pledges: [...(emptyCandidateItem.pledges ?? [])] },
        { ...emptyCandidateItem, id: 2, pledges: [...(emptyCandidateItem.pledges ?? [])] },
    ],
    sysUserId: localStorage.getItem('userid'),
};
