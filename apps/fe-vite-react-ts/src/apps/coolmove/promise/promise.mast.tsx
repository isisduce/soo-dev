import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { defaultCandidateVote, emptyPromiseMast, type DtoCandidateItem, type DtoCandidateMast, type DtoCandidateVote } from '../dto/dto.candidate';
import { CoolmoveCode, type CoolmoveStatus, type CoolmoveType } from '../types/types';
import { CandidateItem } from '../component/candidate.item';
import { PeriodVoters } from '../component/period.voters';

interface PromiseMastProps {
    type?: CoolmoveType;
    status?: CoolmoveStatus;
    candidateMast?: DtoCandidateMast;
    onCandidateMastChange?: (candidateMast: DtoCandidateMast) => void;
    onPhotoUpload?: () => void;
    candidateVote?: DtoCandidateVote;
    onCandidateVoteChange?: (vote: DtoCandidateVote) => void;
}

export const PromiseMast: React.FC<PromiseMastProps> = (props: PromiseMastProps) => {

    const [candidateMast, setCandidateMast] = useState<DtoCandidateMast | undefined>(emptyPromiseMast);
    useEffect(() => {
        setCandidateMast(props.candidateMast ?? emptyPromiseMast);
    }, [props.candidateMast]);

    const handleCandidateItemChange = (candidateItem: DtoCandidateItem) => {
        setCandidateMast(prev => {
            if (!prev) return prev;
            if (candidateItem && candidateItem.id) {
                const newCandidates = [...prev.candidates];
                newCandidates[candidateItem.id - 1] = candidateItem;
                const newMast = { ...prev, candidates: newCandidates };
                if (props.onCandidateMastChange) {
                    props.onCandidateMastChange(newMast);
                }
                return newMast;
            }
        });
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

    const type = candidateMast?.type ?? CoolmoveCode.TYPE.PROMISE;
    const status = candidateMast?.status ?? CoolmoveCode.STATUS.DRAFT;

    return (
        <Box sx={{ width: '100%', backgroundColor: '#f9f9f9', padding: 1, borderRadius: 4, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', }} >
            <Box sx={{ marginBottom: '16px' }} >
                <h2>공약 등록</h2>
            </Box>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', gap: 1, }}>
                <CandidateItem
                    type={type}
                    status={status}
                    candidateItem={candidateMast?.candidates[0] ?? undefined}
                    onCandidateItemChange={handleCandidateItemChange}
                    onPhotoUpload={props.onPhotoUpload}
                    candidateVote={candidateVote}
                    onCandidateVoteChange={handleCandidateVoteChange}
                />
            </Box>
            <Box sx={{ height: 12 }} />
            <PeriodVoters
                type={type}
                status={status}
                candidateMast={candidateMast}
                onCandidateMastChange={props.onCandidateMastChange}
            />
        </Box>
    );
};