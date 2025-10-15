import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { type CoolmoveType, type CoolmoveStatus, CoolmoveCode } from '../types/types';
import { defaultCandidateVote, emptyCandidateItem, type DtoCandidateItem, type DtoCandidateVote } from '../dto/dto.candidate';
import { CandidatePlayer } from './candidate.player';
import { CandidatePledge } from './candidate.pledge';

interface CandidateItemProps {
    type?: CoolmoveType;
    status?: CoolmoveStatus;
    candidateItem?: DtoCandidateItem;
    onCandidateItemChange?: (candidate: DtoCandidateItem) => void;
    onPhotoUpload?: () => void;
    candidateVote?: DtoCandidateVote;
    onCandidateVoteChange?: (vote: DtoCandidateVote) => void;
}

export const CandidateItem: React.FC<CandidateItemProps> = (props: CandidateItemProps) => {

    const [candidateItem, setCandidateItem] = useState<DtoCandidateItem | undefined>(emptyCandidateItem);
    useEffect(() => {
        setCandidateItem(props.candidateItem ?? emptyCandidateItem);
    }, [props.candidateItem]);

    const handleCandidateItemChange = (candidate: DtoCandidateItem) => {
        setCandidateItem(candidate);
        if (props.onCandidateItemChange) {
            props.onCandidateItemChange(candidate);
        }
    }

    const [candidateVote, setCandidateVote] = useState<DtoCandidateVote | undefined>(defaultCandidateVote);
    useEffect(() => {
        setCandidateVote(props.candidateVote ?? defaultCandidateVote);
    }, [props.candidateVote]);

    const handleCandidateVoteChange = (vote: DtoCandidateVote) => {
        setCandidateVote(vote);
        if (props.onCandidateVoteChange) {
            props.onCandidateVoteChange(vote);
        }
    }

    const type = props.type ?? CoolmoveCode.TYPE.PROMISE;
    const status = props.status ?? CoolmoveCode.STATUS.DRAFT;

    return (
        <Box sx={{ width: '100%', backgroundColor: '#ffffff', padding: 1 }}>
            <CandidatePlayer
                type={type}
                status={status}
                candidateItem={candidateItem}
                onCandidateItemChange={handleCandidateItemChange}
                onPhotoUpload={props.onPhotoUpload}
            />
            <Box sx={{ height: 12 }} />
            <CandidatePledge
                type={type}
                status={status}
                candidateItem={candidateItem}
                onCandidateItemChange={handleCandidateItemChange}
                onPhotoUpload={props.onPhotoUpload}
                candidateVote={candidateVote}
                onCandidateVoteChange={handleCandidateVoteChange}
            />
        </Box>
    );
};