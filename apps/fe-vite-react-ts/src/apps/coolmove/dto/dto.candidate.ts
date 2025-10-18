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
    pledges: string[];
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
    type: CoolmoveType;
    candidates: DtoCandidateItem[];
    period?: string;
    begDt?: string;
    endDt?: string;
    //
    status: CoolmoveStatus;
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

export const CandidateItem = {

    createEmpty: (): DtoCandidateItem => {
        return {
            clubNm: '',
            playerNm: '',
            pledges: ['', '', '', '', ''],
            sysUserId: localStorage.getItem('userid'),
        };
    },

    isChanged: (a: DtoCandidateItem, b: DtoCandidateItem): boolean => {
        if (a.uuid !== b.uuid) return true;
        if (a.clubNm !== b.clubNm) return true;
        if (a.playerNm !== b.playerNm) return true;
        if (a.photoPathNm !== b.photoPathNm) return true;
        if (a.photoOgnlNm !== b.photoOgnlNm) return true;
        if (a.photoFile !== b.photoFile) return true;
        if ((a.pledges?.length || 0) !== (b.pledges?.length || 0)) return true;
        for (let i = 0; i < (a.pledges?.length || 0); i++) {
            if (a.pledges?.[i] !== b.pledges?.[i]) return true;
        }
        return false;
    },

}

export const CandidateMast = {

    createEmptyPrimary: (): DtoCandidateMast => {
        return {
            no: 0,
            type: CoolmoveCode.TYPE.PRIMARY,
            candidates: [
                { ...CandidateItem.createEmpty(), id: 1, pledges: [...(CandidateItem.createEmpty().pledges || [])] },
                { ...CandidateItem.createEmpty(), id: 2, pledges: [...(CandidateItem.createEmpty().pledges || [])] },
            ],
            status: CoolmoveCode.STATUS.EMPTY,
            sysUserId: localStorage.getItem('userid'),
        };
    },

    createEmptyPromise: (): DtoCandidateMast => {
        return {
            no: 0,
            type: CoolmoveCode.TYPE.PROMISE,
            candidates: [
                { ...CandidateItem.createEmpty(), id: 1, pledges: [...(CandidateItem.createEmpty().pledges || [])] },
            ],
            status: CoolmoveCode.STATUS.EMPTY,
            sysUserId: localStorage.getItem('userid'),
        };
    },

    isChanged: (a?: DtoCandidateMast, b?: DtoCandidateMast): boolean => {
        if (!a || !b) return true;
        if (a.uuid !== b.uuid) return true;
        if (a.mastNm !== b.mastNm) return true;
        if (a.type !== b.type) return true;
        if (a.period !== b.period) return true;
        if (a.begDt !== b.begDt) return true;
        if (a.endDt !== b.endDt) return true;
        if (a.status !== b.status) return true;
        if (a.votersPathNm !== b.votersPathNm) return true;
        if (a.votersOgnlNm !== b.votersOgnlNm) return true;
        if (a.votersFile !== b.votersFile) return true;
        if ((a.candidates?.length || 0) !== (b.candidates?.length || 0)) return true;
        for (let i = 0; i < (a.candidates?.length || 0); i++) {
            if (CandidateItem.isChanged(a.candidates[i], b.candidates[i])) return true;
        }
        return false;
    },

}

export const CandidateVote = {

    createEmpty: (): DtoCandidateVote => {
        return {
            userId: localStorage.getItem('userid') || '',
            candidateUuid: '',
        };
    },

    isChanged: (a: DtoCandidateVote, b: DtoCandidateVote): boolean => {
        if (a.userId !== b.userId) return true;
        if (a.candidateUuid !== b.candidateUuid) return true;
        if (a.candidateId !== b.candidateId) return true;
        if (a.pledgeNo !== b.pledgeNo) return true;
        return false;
    },

}

// export const emptyCandidateItem: DtoCandidateItem = {
//     clubNm: '',
//     playerNm: '',
//     pledges: ['', '', '', '', ''],
//     sysUserId: localStorage.getItem('userid'),
// };

// export const emptyPrimaryMast: DtoCandidateMast = {
//     no: 0,
//     type: CoolmoveCode.TYPE.PRIMARY,
//     candidates: [
//         { ...emptyCandidateItem, id: 1, pledges: [...(emptyCandidateItem.pledges ?? [])] },
//         { ...emptyCandidateItem, id: 2, pledges: [...(emptyCandidateItem.pledges ?? [])] },
//     ],
//     status: CoolmoveCode.STATUS.EMPTY,
//     sysUserId: localStorage.getItem('userid'),
// };

// export const emptyPromiseMast: DtoCandidateMast = {
//     no: 0,
//     type: CoolmoveCode.TYPE.PROMISE,
//     candidates: [
//         { ...emptyCandidateItem, id: 1, pledges: [...(emptyCandidateItem.pledges ?? [])] },
//     ],
//     status: CoolmoveCode.STATUS.EMPTY,
//     sysUserId: localStorage.getItem('userid'),
// };

// export const defaultCandidateVote: DtoCandidateVote = {
//     userId: localStorage.getItem('userid') || '',
//     candidateUuid: '',
// }
