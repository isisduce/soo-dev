import React, { useEffect, useState } from 'react';
import { CandidateMast, CandidateVote, type DtoCandidateMast, type DtoCandidateVote } from '../dto/dto.candidate';
import { FormCandidateMast } from '../component/form.candidate.mast';

interface PromiseMastProps {
    candidateMast?: DtoCandidateMast;
    candidateVote?: DtoCandidateVote;
    onDraftSave?: (v?: DtoCandidateMast) => void;
    onDraftView?: (v?: DtoCandidateMast) => void;
    onDraftDone?: (v?: DtoCandidateMast) => void;
    onFinalSend?: (v?: DtoCandidateMast) => void;
    onFinalShow?: (v?: DtoCandidateMast) => void;
}

export const PromiseMast: React.FC<PromiseMastProps> = (props: PromiseMastProps) => {

    const [candidateMast, setCandidateMast] = useState<DtoCandidateMast | undefined>(CandidateMast.createEmptyPromise);
    useEffect(() => {
        setCandidateMast(props.candidateMast ?? CandidateMast.createEmptyPromise);
    }, [props.candidateMast]);

    const handleCandidateMastChange = (candidateMast: DtoCandidateMast) => {
        setCandidateMast(candidateMast);
    }

    const [candidateVote, setCandidateVote] = useState<DtoCandidateVote | undefined>(CandidateVote.createEmpty);
    useEffect(() => {
        setCandidateVote(props.candidateVote ?? CandidateVote.createEmpty);
    }, [props.candidateVote]);

    const handleCandidateVoteChange = (candidateVote: DtoCandidateVote) => {
        setCandidateVote(candidateVote);
    }

    const handleDraftSave = () => {
        if (props.onDraftSave) {
            props.onDraftSave(candidateMast);
        }
    }

    const handleDraftDone = () => {
        if (props.onDraftDone) {
            props.onDraftDone(candidateMast);
        }
    }

    return (
        <FormCandidateMast
            candidateMast={candidateMast}
            setCandidateMast={handleCandidateMastChange}
            candidateVote={candidateVote}
            setCandidateVote={handleCandidateVoteChange}
            onDraftSave={handleDraftSave}
            // onDraftView={props.onDraftView}
            onDraftDone={handleDraftDone}
            // onFinalSend={props.onFinalSend}
            // onFinalShow={props.onFinalShow}
        />
    );

};
