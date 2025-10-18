import React, { useEffect, useState } from 'react';
import { CandidateMast, CandidateVote, type DtoCandidateMast, type DtoCandidateVote } from '../dto/dto.candidate';
import { FormCandidateMast } from '../component/form.candidate.mast';

interface PrimaryMastProps {
    candidateMast?: DtoCandidateMast;
    selectedCandidateMast?: DtoCandidateMast;
    candidateVote?: DtoCandidateVote;
    onDraftSave?: (v?: DtoCandidateMast) => void;
    onDraftView?: (v?: DtoCandidateMast) => void;
    onDraftDone?: (v?: DtoCandidateMast) => void;
    onFinalSend?: (v?: DtoCandidateMast) => void;
    onFinalShow?: (v?: DtoCandidateMast) => void;
}

export const PrimaryMast: React.FC<PrimaryMastProps> = (props: PrimaryMastProps) => {

    const [candidateMast, setCandidateMast] = useState<DtoCandidateMast | undefined>(CandidateMast.createEmptyPrimary);
    useEffect(() => {
        setCandidateMast(props.candidateMast ?? CandidateMast.createEmptyPrimary);
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
            selectedCandidateMast={props.selectedCandidateMast}
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
