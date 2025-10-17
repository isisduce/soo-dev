import { CoolmoveCode, type CoolmoveStatus, type CoolmoveType } from "../types/types";

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
    selectedVotersCount?: number;
    //
    pledges?: string[];
    pledgeOrder?: number[];
    pledgeSelectedCounts?: number[];
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

export interface DtoCandidateVote {
    userId: string;
    candidateUuid: string;
    candidateId?: number;
    pledgeNo?: number;
}

export const emptyCandidateItem: DtoCandidateItem = {
    clubNm: '',
    playerNm: '',
    pledges: ['', '', '', '', ''],
    sysUserId: localStorage.getItem('userid'),
};

export const emptyPrimaryMast: DtoCandidateMast = {
    no: 0,
    type: CoolmoveCode.TYPE.PRIMARY,
    candidates: [
        { ...emptyCandidateItem, id: 1, pledges: [...(emptyCandidateItem.pledges ?? [])] },
        { ...emptyCandidateItem, id: 2, pledges: [...(emptyCandidateItem.pledges ?? [])] },
    ],
    status: CoolmoveCode.STATUS.EMPTY,
    sysUserId: localStorage.getItem('userid'),
};

export const emptyPromiseMast: DtoCandidateMast = {
    no: 0,
    type: CoolmoveCode.TYPE.PROMISE,
    candidates: [
        { ...emptyCandidateItem, id: 1, pledges: [...(emptyCandidateItem.pledges ?? [])] },
    ],
    status: CoolmoveCode.STATUS.EMPTY,
    sysUserId: localStorage.getItem('userid'),
};

export const defaultCandidateVote: DtoCandidateVote = {
    userId: localStorage.getItem('userid') || '',
    candidateUuid: '',
}
