import React, { useEffect, useState } from 'react';
import { CandidateMast, CandidateVote, type DtoCandidateMast, type DtoCandidateVote } from '../dto/dto.candidate';
import { FormCandidateMast } from '../component/form.candidate.mast';

interface PrimaryMastProps {
    candidateMast?: DtoCandidateMast;
    setCandidateMast?: (candidateMast: DtoCandidateMast) => void;
    candidateVote?: DtoCandidateVote;
    setCandidateVote?: (candidateVote: DtoCandidateVote) => void;
    onDraftSave?: (candidateMast?: DtoCandidateMast) => void;
    onDraftView?: (candidateMast?: DtoCandidateMast) => void;
    onDraftDone?: (candidateMast?: DtoCandidateMast) => void;
    onFinalSend?: (candidateMast?: DtoCandidateMast) => void;
    onFinalShow?: (candidateMast?: DtoCandidateMast) => void;
}

export const PrimaryMast: React.FC<PrimaryMastProps> = (props: PrimaryMastProps) => {

    const [candidateMast, setCandidateMast] = useState<DtoCandidateMast | undefined>(CandidateMast.createEmptyPrimary);
    useEffect(() => {
        setCandidateMast(props.candidateMast ?? CandidateMast.createEmptyPrimary);
    }, [props.candidateMast]);

    const handleCandidateMastChange = (candidateMast: DtoCandidateMast) => {
        setCandidateMast(candidateMast);
        if (props.setCandidateMast) {
            props.setCandidateMast(candidateMast);
        }
    }

    const [candidateVote, setCandidateVote] = useState<DtoCandidateVote | undefined>(CandidateVote.createEmpty);
    useEffect(() => {
        setCandidateVote(props.candidateVote ?? CandidateVote.createEmpty);
    }, [props.candidateVote]);

    const handleCandidateVoteChange = (candidateVote: DtoCandidateVote) => {
        setCandidateVote(candidateVote);
        if (props.setCandidateVote) {
            props.setCandidateVote(candidateVote);
        }
    }

    return (
        <FormCandidateMast
            candidateMast={candidateMast}
            setCandidateMast={handleCandidateMastChange}
            candidateVote={candidateVote}
            setCandidateVote={handleCandidateVoteChange}
            onDraftSave={props.onDraftSave}
            onDraftView={props.onDraftView}
            onDraftDone={props.onDraftDone}
            onFinalSend={props.onFinalSend}
            onFinalShow={props.onFinalShow}
        />
    );
};