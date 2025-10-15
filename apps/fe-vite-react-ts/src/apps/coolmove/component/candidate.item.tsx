import React, { } from 'react';
import { Box } from '@mui/material';
import { type CoolmoveType, type CoolmoveStatus, CoolmoveCode } from '../types/types';
import { type DtoCandidateItem, type DtoCandidateVote } from '../dto/dto.candidate';
import { CandidatePlayer } from './candidate.player';
import { CandidatePledge } from './candidate.pledge';

interface CandidateItemProps {
    type?: CoolmoveType;
    status?: CoolmoveStatus;
    candidateItem?: DtoCandidateItem;
    setCandidateItem?: (candidateItem: DtoCandidateItem) => void;
    candidateVote?: DtoCandidateVote;
    setCandidateVote?: (candidateVote: DtoCandidateVote) => void;
}

export const CandidateItem: React.FC<CandidateItemProps> = (props: CandidateItemProps) => {

    const type = props.type ?? CoolmoveCode.TYPE.PROMISE;
    const status = props.status ?? CoolmoveCode.STATUS.DRAFT;

    return (
        <Box sx={{ width: '100%', backgroundColor: '#f9f9f9', padding: 0 }}>
            <CandidatePlayer
                type={type}
                status={status}
                candidateItem={props.candidateItem}
                setCandidateItem={props.setCandidateItem}
            />
            <Box sx={{ height: 12 }} />
            <CandidatePledge
                type={type}
                status={status}
                candidateItem={props.candidateItem}
                setCandidateItem={props.setCandidateItem}
                candidateVote={props.candidateVote}
                setCandidateVote={props.setCandidateVote}
            />
        </Box>
    );
};
