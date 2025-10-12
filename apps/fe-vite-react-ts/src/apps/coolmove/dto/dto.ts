export interface DtoCandidateItem {
    seq?: number;
    // KEY
    uuid?: string;
    index?: number;
    //
    clubNm: string;
    playerNm: string;
    photoPathNm?: string;
    photoOgnlNm?: string;
    photoFile?: File;
    pledges?: string[];
    //
    sysUserId?: string | null;
    regUserId?: string;
    regDt?: Date;
    modUserId?: string;
    modDt?: Date;
}

export interface DtoCandidateStatus {
    type: 'active' | 'draft' | 'end' | 'empty';
    participants?: number;
    date?: string;
}

export interface DtoCandidateMast {
    seq?: number;
    // KEY
    uuid?: string;
    //
    no: number;
    mastNm?: string;
    //
    candidates: DtoCandidateItem[];
    period?: string;
    begDt?: string;
    endDt?: string;
    //
    status?: DtoCandidateStatus;
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
    photoPathNm: '',
    photoOgnlNm: '',
    pledges: ['', '', '', '', ''],
    sysUserId: localStorage.getItem('userid'),
};

export const emptyCandidateMast: DtoCandidateMast = {
    no: 0,
    candidates: [emptyCandidateItem, emptyCandidateItem],
    sysUserId: localStorage.getItem('userid'),
};
