import React, { } from 'react';
import { Box, Button } from '@mui/material';
import { CoolmoveCode, type CoolmoveStatus, type CoolmoveType } from '../types/types';

interface CandidateOperationProps {
    type?: CoolmoveType;
    status?: CoolmoveStatus;
    onSave?: () => void;
    onView?: () => void;
    onDone?: () => void;
    onSend?: () => void;
    onShow?: () => void;
}

export const CandidateOperation: React.FC<CandidateOperationProps> = (props: CandidateOperationProps) => {

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ width: '100%', justifyContent: 'space-between', justifyItems: 'center', display: 'flex', gap: 1 }}>
                <Button
                    variant="outlined"
                    color="primary"
                    disabled={props.status !== CoolmoveCode.STATUS.DRAFT}
                    sx={{ width: '34%', whiteSpace: 'nowrap' }}
                    onClick={() => props.onSave?.()}
                >
                    임시 저장
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={props.status === CoolmoveCode.STATUS.DRAFT}
                    sx={{ width: '33%', whiteSpace: 'nowrap' }}
                    onClick={() => props.onView?.()}
                >
                    미리 보기
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={props.status === CoolmoveCode.STATUS.DRAFT}
                    sx={{ width: '33%', whiteSpace: 'nowrap' }}
                    onClick={() => props.onDone?.()}
                >
                    등록 완료
                </Button>
            </Box>
            <Box sx={{ height: 8 }} />
            <Box sx={{ width: '100%', justifyContent: 'space-between', justifyItems: 'center', display: 'flex', gap: 1 }}>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={props.status === CoolmoveCode.STATUS.DRAFT}
                    sx={{ width: '50%', whiteSpace: 'nowrap' }}
                    onClick={() => props.onSend?.()}
                >
                    카카오로 발송
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={props.status === CoolmoveCode.STATUS.DRAFT}
                    sx={{ width: '50%', whiteSpace: 'nowrap' }}
                    onClick={() => props.onShow?.()}
                >
                    스마트폰에 공개
                </Button>
            </Box>
        </Box>
    );
};
