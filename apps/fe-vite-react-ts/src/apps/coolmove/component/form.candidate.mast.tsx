import React, { } from 'react';
import { Box } from '@mui/material';
import { type DtoCandidateItem, type DtoCandidateMast, type DtoCandidateVote } from '../dto/dto.candidate';
import { CoolmoveCode } from '../types/types';
import { FormCandidateItem } from '../component/form.candidate.item';
import { FormCandidatePeriodVoters } from './form.candidate.period.voters';
import { FormCandidateOperation } from './form.candidate.operation';

interface FormCandidateMastProps {
    candidateMast?: DtoCandidateMast;
    setCandidateMast?: (v: DtoCandidateMast) => void;
    candidateVote?: DtoCandidateVote;
    setCandidateVote?: (v: DtoCandidateVote) => void;
    onDraftSave?: (v?: DtoCandidateMast) => void;
    onDraftView?: (v?: DtoCandidateMast) => void;
    onDraftDone?: (v?: DtoCandidateMast) => void;
    onFinalSend?: (v?: DtoCandidateMast) => void;
    onFinalShow?: (v?: DtoCandidateMast) => void;
}

export const FormCandidateMast: React.FC<FormCandidateMastProps> = (props: FormCandidateMastProps) => {

    const candidateMast = props.candidateMast;
    const candidateVote = props.candidateVote;
    const type = candidateMast?.type ?? CoolmoveCode.TYPE.PROMISE;
    const status = candidateMast?.status ?? CoolmoveCode.STATUS.EMPTY;

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
                        <FormCandidateItem
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
            <FormCandidatePeriodVoters
                type={type}
                status={status}
                candidateMast={candidateMast}
                setCandidateMast={props.setCandidateMast}
            />
            <Box sx={{ height: 12 }} />
            <span>'등록완료'를 선택해야 화면에 노출됩니다.</span>
            <Box sx={{ height: 4 }} />
            <FormCandidateOperation
                type={type}
                status={status}
                candidateMast={candidateMast}
                setCandidateMast={props.setCandidateMast}
                onDraftSave={props.onDraftSave}
                onDraftView={props.onDraftView}
                onDraftDone={props.onDraftDone}
                onFinalSend={props.onFinalSend}
                onFinalShow={props.onFinalShow}
            />
        </Box>
    );
};