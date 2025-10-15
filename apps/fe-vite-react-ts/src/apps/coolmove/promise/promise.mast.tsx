import React, { useEffect, useState } from 'react';
import { defaultCandidateVote, emptyPromiseMast, type DtoCandidateMast, type DtoCandidateVote } from '../dto/dto.candidate';
import { CoolmoveCode } from '../types/types';
import { CandidateMast } from '../component/candidate.mast';

interface PromiseMastProps {
    candidateMast?: DtoCandidateMast;
    setCandidateMast?: (candidateMast: DtoCandidateMast) => void;
    candidateVote?: DtoCandidateVote;
    setCandidateVote?: (candidateVote: DtoCandidateVote) => void;
    onSave?: (candidateMast?: DtoCandidateMast) => void;
    onView?: (candidateMast?: DtoCandidateMast) => void;
    onDone?: (candidateMast?: DtoCandidateMast) => void;
    onSend?: (candidateMast?: DtoCandidateMast) => void;
    onShow?: (candidateMast?: DtoCandidateMast) => void;
}

export const PromiseMast: React.FC<PromiseMastProps> = (props: PromiseMastProps) => {

    const [candidateMast, setCandidateMast] = useState<DtoCandidateMast | undefined>({
        ...emptyPromiseMast,
        type: CoolmoveCode.TYPE.PROMISE,
        status: CoolmoveCode.STATUS.DRAFT,
    });
    useEffect(() => {
        setCandidateMast(props.candidateMast ?? emptyPromiseMast);
    }, [props.candidateMast]);

    const handleCandidateMastChange = (candidateMast: DtoCandidateMast) => {
        setCandidateMast(candidateMast);
        if (props.setCandidateMast) {
            props.setCandidateMast(candidateMast);
        }
    }

    const [candidateVote, setCandidateVote] = useState<DtoCandidateVote | undefined>(defaultCandidateVote);
    useEffect(() => {
        setCandidateVote(props.candidateVote ?? defaultCandidateVote);
    }, [props.candidateVote]);

    const handleCandidateVoteChange = (candidateVote: DtoCandidateVote) => {
        setCandidateVote(candidateVote);
        if (props.setCandidateVote) {
            props.setCandidateVote(candidateVote);
        }
    }

    return (
        <CandidateMast
            candidateMast={candidateMast}
            setCandidateMast={handleCandidateMastChange}
            candidateVote={candidateVote}
            setCandidateVote={handleCandidateVoteChange}
            onSave={props.onSave}
            onView={props.onView}
            onDone={props.onDone}
            onSend={props.onSend}
            onShow={props.onShow}
        />
    );

};
