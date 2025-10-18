import React, { } from 'react';
import { Box, Button } from '@mui/material';
import { CoolmoveCode, type CoolmoveStatus, type CoolmoveType } from '../types/types';
import { CandidateMast, type DtoCandidateMast } from '../dto/dto.candidate';

interface FormCandidateOperationProps {
    type?: CoolmoveType;
    status?: CoolmoveStatus;
    candidateMast?: DtoCandidateMast;
    setCandidateMast?: (candidateMast: DtoCandidateMast) => void;
    selectedCandidateMast?: DtoCandidateMast;
    onDraftSave?: () => void;
    onDraftView?: () => void;
    onDraftDone?: () => void;
    onFinalSend?: () => void;
    onFinalShow?: () => void;
}

export const FormCandidateOperation: React.FC<FormCandidateOperationProps> = (props: FormCandidateOperationProps) => {

    const editEnabled = props.status === CoolmoveCode.STATUS.EMPTY || props.status === CoolmoveCode.STATUS.DRAFT;
    const saveEnabled = props.candidateMast?.candidates.every(c => c.clubNm && c.playerNm);
    const isChanged = CandidateMast.isChanged(props.candidateMast, props.selectedCandidateMast);

    return (
        <Box sx={{ width: '100%', backgroundColor: '#EFF9FF' }}>
            <Box>
                <span>'등록완료'를 선택해야 화면에 노출됩니다.</span>
            </Box>
            <Box sx={{ width: '100%', justifyContent: 'space-between', justifyItems: 'center', display: 'flex', gap: 1 }}>
                <Button
                    variant="outlined"
                    color="primary"
                    disabled={!editEnabled || !saveEnabled || !isChanged}
                    sx={{ width: '34%', whiteSpace: 'nowrap' }}
                    onClick={() => {
                        if (props.candidateMast && props.setCandidateMast) {
                            props.setCandidateMast?.({
                                ...props.candidateMast,
                                status: CoolmoveCode.STATUS.DRAFT,
                            });
                        }
                        props.onDraftSave?.()
                    }}
                >
                    임시 저장
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={!editEnabled || !saveEnabled}
                    sx={{ width: '33%', whiteSpace: 'nowrap' }}
                    onClick={() => props.onDraftView?.()}
                >
                    미리 보기
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={!editEnabled || !saveEnabled}
                    sx={{ width: '33%', whiteSpace: 'nowrap' }}
                    onClick={() => {
                        if (props.candidateMast && props.setCandidateMast) {
                            props.setCandidateMast?.({
                                ...props.candidateMast,
                                status: CoolmoveCode.STATUS.FINAL,
                            });
                        }
                        props.onDraftDone?.()
                    }}
                >
                    등록 완료
                </Button>
            </Box>
            <Box sx={{ height: 8 }} />
            <Box sx={{ width: '100%', justifyContent: 'space-between', justifyItems: 'center', display: 'flex', gap: 1 }}>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={props.status !== CoolmoveCode.STATUS.FINAL}
                    sx={{ width: '50%', whiteSpace: 'nowrap' }}
                    onClick={() => props.onFinalSend?.()}
                >
                    카카오로 발송
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={props.status !== CoolmoveCode.STATUS.FINAL}
                    sx={{ width: '50%', whiteSpace: 'nowrap' }}
                    onClick={() => props.onFinalShow?.()}
                >
                    스마트폰에 공개
                </Button>
            </Box>
        </Box>
    );
};
