import React, { } from 'react';
import { Box } from '@mui/material';
import { type DtoCandidateItem, type DtoCandidateMast, type DtoCandidateVote } from '../dto/dto.candidate';
import { useAppEnvStore } from '../../../appmain/app.env';
import { coolmoveApi } from '../api/coolmove.api';
import { CoolmoveCode } from '../types/types';
import { CandidateItem } from '../component/candidate.item';
import { CandidatePeriodVoters } from './candidate.period.voters';
import { CandidateOperation } from './candidate.operation';

interface CandidateMastProps {
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

export const CandidateMast: React.FC<CandidateMastProps> = (props: CandidateMastProps) => {

    const env = useAppEnvStore((state) => state.env);
    const apiServer = env.apps?.urlApiServerJava || '';
    const token = localStorage.getItem('token') || '';

    const candidateMast = props.candidateMast;
    const candidateVote = props.candidateVote;
    const type = candidateMast?.type ?? CoolmoveCode.TYPE.PROMISE;
    const status = candidateMast?.status ?? CoolmoveCode.STATUS.DRAFT;

    const handleCandidateItemChange = (candidateItem: DtoCandidateItem) => {
        if (!candidateMast) return;
        if (candidateItem && candidateItem.id) {
            const newCandidates = [...candidateMast.candidates];
            newCandidates[candidateItem.id - 1] = candidateItem;
            const newMast = { ...candidateMast, candidates: newCandidates };
            if (props.setCandidateMast) {
                props.setCandidateMast(newMast);
            }
        }
    };

    const handleSave = async () => {
        if (apiServer && candidateMast) {
            const candidateMastPayload = {
                ...candidateMast,
                no: candidateMast?.no ?? 0,
                candidates: candidateMast?.candidates.map(({ photoFile, ...c }) => c),
                votersFile: undefined,
            };
            console.log(candidateMastPayload);
            const response = await coolmoveApi.candidateMastInsert(
                apiServer,
                token,
                {
                    candidateMast: candidateMastPayload,
                    photo1: candidateMast?.candidates[0]?.photoFile,
                    photo2: candidateMast?.candidates[1]?.photoFile,
                    voters: candidateMast?.votersFile,
                }
            );
            if (response.success) {
                if (response.result) {
                    props.setCandidateMast?.(response.result);
                }
                alert('저장되었습니다.');
            } else {
                alert(`저장에 실패하였습니다: ${response.code} ${response.message}`);
            }
        }
        if (props.onSave) {
            props.onSave(candidateMast);
        }
    }

    const handleView = () => {
        console.log('미리 보기');
        if (props.onView) {
            props.onView(candidateMast);
        }
    }

    const handleDone = () => {
        console.log('등록 완료');
        if (props.onDone) {
            props.onDone(candidateMast);
        }
    }

    const handleSend = () => {
        console.log('카카오로 발송');
        if (props.onSend) {
            props.onSend(candidateMast);
        }
    }

    const handleShow = () => {
        console.log('스마트폰에 공개');
        if (props.onShow) {
            props.onShow(candidateMast);
        }
    }

    return (
        <Box sx={{ width: '100%', backgroundColor: '#f9f9f9', padding: 1, borderRadius: 4, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', }} >
            <Box sx={{ marginBottom: '16px' }} >
                {type === CoolmoveCode.TYPE.PROMISE && <h2>공약 등록</h2>}
                {type === CoolmoveCode.TYPE.PRIMARY && <h2>후보자 등록</h2>}
            </Box>
            <Box sx={{ height: 12 }} />
            <Box sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1, }} >
                {candidateMast?.candidates.map((candidate, index) => (
                    <Box key={index} sx={{ minWidth: { sm: 320 }, flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {type === CoolmoveCode.TYPE.PRIMARY &&
                            <Box>
                                <h3>후보자 {candidate.id} 등록</h3>
                            </Box>
                        }
                        <CandidateItem
                            type={type}
                            status={status}
                            candidateItem={candidateMast?.candidates[index] ?? undefined}
                            setCandidateItem={handleCandidateItemChange}
                            candidateVote={candidateVote}
                            setCandidateVote={props.setCandidateVote}
                        />
                    </Box>
                ))}
            </Box>
            <Box sx={{ height: 12 }} />
            <CandidatePeriodVoters
                type={type}
                status={status}
                candidateMast={candidateMast}
                setCandidateMast={props.setCandidateMast}
            />
            <Box sx={{ height: 12 }} />
            <CandidateOperation
                type={type}
                status={status}
                onSave={handleSave}
                onView={handleView}
                onDone={handleDone}
                onSend={handleSend}
                onShow={handleShow}
            />
        </Box>
    );
};