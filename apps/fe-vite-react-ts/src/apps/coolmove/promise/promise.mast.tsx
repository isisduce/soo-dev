import React, { useEffect, useState } from 'react';
import { defaultCandidateVote, emptyPromiseMast, type DtoCandidateMast, type DtoCandidateVote } from '../dto/dto.candidate';
import { CandidateMast } from '../component/candidate.mast';

interface PromiseMastProps {
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

export const PromiseMast: React.FC<PromiseMastProps> = (props: PromiseMastProps) => {

    const [candidateMast, setCandidateMast] = useState<DtoCandidateMast | undefined>(emptyPromiseMast);
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

    const handleDraftSave = () => {
        // setCandidateMast(emptyPromiseMast)
        if (props.onDraftSave) {
            props.onDraftSave(candidateMast);
        }
    }

    return (
        <CandidateMast
            candidateMast={candidateMast}
            setCandidateMast={handleCandidateMastChange}
            candidateVote={candidateVote}
            setCandidateVote={handleCandidateVoteChange}
            onDraftSave={handleDraftSave}
            onDraftView={props.onDraftView}
            onDraftDone={props.onDraftDone}
            onFinalSend={props.onFinalSend}
            onFinalShow={props.onFinalShow}
        />
    );

};
