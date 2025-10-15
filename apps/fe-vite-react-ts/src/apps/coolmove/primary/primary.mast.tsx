import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { emptyPrimaryMast, type DtoCandidateItem, type DtoCandidateMast, type DtoCandidateVote } from '../dto/dto.candidate';
import { CoolmoveCode, type CoolmoveStatus, type CoolmoveType } from '../types/types';
import { CandidateItem } from '../component/candidate.item';
import { PeriodVoters } from '../component/period.voters';

interface PrimaryMastProps {
    type?: CoolmoveType;
    status?: CoolmoveStatus;
    candidateMast?: DtoCandidateMast;
    onCandidateMastChange?: (candidateMast: DtoCandidateMast) => void;
    onPhotoUpload?: () => void;
    candidateVote?: DtoCandidateVote;
    onCandidateVoteChange?: (vote: DtoCandidateVote) => void;
}

export const PrimaryMast: React.FC<PrimaryMastProps> = (props: PrimaryMastProps) => {

    const [candidateMast, setCandidateMast] = useState<DtoCandidateMast | undefined>(emptyPrimaryMast);
    useEffect(() => {
        setCandidateMast(props.candidateMast ?? emptyPrimaryMast);
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

    // const [candidateVote, setCandidateVote] = useState<DtoCandidateVote | undefined>(defaultCandidateVote);
    // useEffect(() => {
    //     setCandidateVote(props.candidateVote ?? defaultCandidateVote);
    // }, [props.candidateVote]);

    // const handleCandidateVoteChange = (vote: DtoCandidateVote) => {
    //     setCandidateVote(vote);
    //     if (props.onCandidateVoteChange) {
    //         props.onCandidateVoteChange(vote);
    //     }
    // }

    const handleSave = () => {
        alert('임시 저장');
    }

    const handleSend = () => {
        alert('카카오로 발송');
    }

    const handleShow = () => {
        alert('스마트폰에 공개');
    }

    const type = candidateMast?.type ?? CoolmoveCode.TYPE.PRIMARY;
    const status = candidateMast?.status ?? CoolmoveCode.STATUS.DRAFT;

    return (
        <Box sx={{ width: '100%', backgroundColor: '#f9f9f9', padding: 1, borderRadius: 4, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', }} >
            <Box sx={{ marginBottom: '16px' }} >
                <h2>후보자 등록</h2>
            </Box>
            <Box sx={{ height: 12 }} />
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 1,
                }}
            >
                {candidateMast?.candidates.map((candidate, index) => (
                    <Box key={index} sx={{ minWidth: { sm: 320 }, flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box>
                            <h3>후보자 {candidate.id} 등록</h3>
                        </Box>
                        <CandidateItem
                            type={type}
                            status={status}
                            candidateItem={candidateMast?.candidates[index] ?? undefined}
                            onCandidateItemChange={handleCandidateItemChange}
                            onPhotoUpload={props.onPhotoUpload}
                        />
                    </Box>
                ))}
            </Box>
            <Box sx={{ height: 12 }} />
            <PeriodVoters
                type={type}
                status={status}
                candidateMast={candidateMast}
                onCandidateMastChange={props.onCandidateMastChange}
            />
            <Box sx={{ height: 12 }} />
            <Typography variant="body2" color="textSecondary">
                공개기간과 유권자 목록은 선거가 시작된 후에는 변경할 수 없습니다.
            </Typography>
            <Box sx={{ height: 12 }} />
            <Box sx={{ width: '100%', justifyContent: 'space-between', justifyItems: 'center', display: 'flex', gap: 2 }}>
                <Button
                    variant="outlined"
                    color="primary"
                    disabled={status !== CoolmoveCode.STATUS.DRAFT}
                    sx={{ width: '35%' }}
                    onClick={handleSave}
                >
                    임시 저장
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={status === CoolmoveCode.STATUS.DRAFT}
                    sx={{ width: '40%' }}
                    onClick={handleSend}
                >
                    카카오로 발송
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={status === CoolmoveCode.STATUS.DRAFT}
                    sx={{ width: '25%' }}
                    onClick={handleShow}
                >
                    스마트폰에 공개
                </Button>
            </Box>
        </Box>
    );
};