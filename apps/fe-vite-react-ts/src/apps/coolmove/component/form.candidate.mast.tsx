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
    selectedCandidateMast?: DtoCandidateMast;
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
            <Box sx={{ width: '100%' }} >
                {type === CoolmoveCode.TYPE.PROMISE && <h2>공약 등록</h2>}
                {type === CoolmoveCode.TYPE.PRIMARY && <h2>후보자 등록</h2>}
            </Box>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }} >
                {candidateMast?.candidates.map((candidate, index) => (
                    <Box key={index} sx={{ minWidth: { sm: 320 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
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
            <Box sx={{ width: '100%', mt: 1 }} >
                <FormCandidatePeriodVoters
                    type={type}
                    status={status}
                    candidateMast={candidateMast}
                    setCandidateMast={props.setCandidateMast}
                />
            </Box>
            <Box sx={{ width: '100%', mt: 1 }} >
                <FormCandidateOperation
                    type={type}
                    status={status}
                    candidateMast={candidateMast}
                    setCandidateMast={props.setCandidateMast}
                    selectedCandidateMast={props.selectedCandidateMast}
                    onDraftSave={props.onDraftSave}
                    onDraftView={props.onDraftView}
                    onDraftDone={props.onDraftDone}
                    onFinalSend={props.onFinalSend}
                    onFinalShow={props.onFinalShow}
                />
            </Box>
        </Box>
    );
};