import React, { } from 'react';
import { Box, Button } from '@mui/material';
import { CoolmoveCode, type CoolmoveStatus, type CoolmoveType } from '../types/types';
import type { DtoCandidateMast } from '../dto/dto.candidate';

interface CandidateOperationProps {
    type?: CoolmoveType;
    status?: CoolmoveStatus;
    candidateMast?: DtoCandidateMast;
    onDraftSave?: () => void;
    onDraftView?: () => void;
    onDraftDone?: () => void;
    onFinalSend?: () => void;
    onFinalShow?: () => void;
}

export const CandidateOperation: React.FC<CandidateOperationProps> = (props: CandidateOperationProps) => {

    const editEnabled = props.status === CoolmoveCode.STATUS.EMPTY || props.status === CoolmoveCode.STATUS.DRAFT;
    const saveEnabled = props.candidateMast?.candidates.every(c => c.clubNm && c.playerNm);

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ width: '100%', justifyContent: 'space-between', justifyItems: 'center', display: 'flex', gap: 1 }}>
                <Button
                    variant="outlined"
                    color="primary"
                    disabled={!editEnabled || !saveEnabled}
                    sx={{ width: '34%', whiteSpace: 'nowrap' }}
                    onClick={() => props.onDraftSave?.()}
                >
                    임시 저장
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={!editEnabled}
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
                    onClick={() => props.onDraftDone?.()}
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
