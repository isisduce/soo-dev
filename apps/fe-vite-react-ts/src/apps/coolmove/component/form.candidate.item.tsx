import React, { } from 'react';
import { Box } from '@mui/material';
import { type CoolmoveType, type CoolmoveStatus, CoolmoveCode } from '../types/types';
import { type DtoCandidateItem, type DtoCandidateVote } from '../dto/dto.candidate';
import { FormCandidatePlayer } from './form.candidate.player';
import { FormCandidatePledge } from './form.candidate.pledge';

interface FormCandidateItemProps {
    type?: CoolmoveType;
    status?: CoolmoveStatus;
    candidateItem?: DtoCandidateItem;
    setCandidateItem?: (candidateItem: DtoCandidateItem) => void;
    candidateVote?: DtoCandidateVote;
    setCandidateVote?: (candidateVote: DtoCandidateVote) => void;
}

export const FormCandidateItem: React.FC<FormCandidateItemProps> = (props: FormCandidateItemProps) => {

    const type = props.type ?? CoolmoveCode.TYPE.PROMISE;
    const status = props.status ?? CoolmoveCode.STATUS.DRAFT;

    return (
        <Box sx={{ width: '100%', backgroundColor: '#f9f9f9', padding: 0 }}>
            <FormCandidatePlayer
                type={type}
                status={status}
                candidateItem={props.candidateItem}
                setCandidateItem={props.setCandidateItem}
            />
            <Box sx={{ height: 12 }} />
            <FormCandidatePledge
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
