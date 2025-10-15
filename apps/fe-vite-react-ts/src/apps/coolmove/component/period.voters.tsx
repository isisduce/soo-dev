import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { emptyPrimaryMast, type DtoCandidateMast } from '../dto/dto.candidate';
import { CoolmoveCode, type CoolmoveStatus, type CoolmoveType } from '../types/types';

interface PeriodVotersProps {
    type?: CoolmoveType;
    status?: CoolmoveStatus;
    candidateMast?: DtoCandidateMast;
    onCandidateMastChange?: (candidateMast: DtoCandidateMast) => void;
    onVotersUpload?: () => void;
}

export const PeriodVoters: React.FC<PeriodVotersProps> = (props: PeriodVotersProps) => {

    const publicHeadWidth = 80;

    const [candidateMast, setCandidateMast] = useState<DtoCandidateMast>(emptyPrimaryMast);
    useEffect(() => {
        setCandidateMast(props.candidateMast ?? emptyPrimaryMast);
    }, [props.candidateMast]);

    const handlePeriodChange = () => {
        // setCandidateMast(prev => ({ ...prev, period: value }));
        // if (props.onCandidateMastChange) {
            // props.onCandidateMastChange({ ...candidateMast, period: value });
        // }
    }

    const handleVotersUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xlsx,.xls,.csv';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                setCandidateMast(prev => ({
                    ...prev,
                    votersPathNm: file.name,
                    votersFile: file
                }));
            }
        };
        input.click();
    };

    return (
        <Box sx={{ width: '100%', padding: 1, backgroundColor: '#EFF9FF', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', gap: 1 }}>
                <Box sx={{ width: `${publicHeadWidth}px`, marginRight: 1, whiteSpace: 'nowrap' }}>공개기간</Box>
                <input
                    disabled={props.status !== CoolmoveCode.STATUS.DRAFT}
                    readOnly
                    type="text"
                    placeholder={'공개 기간 설정'}
                    value={candidateMast?.period}
                    style={{ width: '100%' }}
                />
                <button
                    type="button"
                    className="btn outline small"
                    style={{ whiteSpace: 'nowrap' }}
                    onClick={handlePeriodChange}
                >
                    설정
                </button>
            </Box>
            <Box sx={{ height: 8 }} />
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', gap: 1 }}>
                <Box sx={{ width: `${publicHeadWidth}px`, marginRight: 1, whiteSpace: 'nowrap' }}>유권자들</Box>
                <input
                    disabled={props.status !== CoolmoveCode.STATUS.DRAFT}
                    readOnly
                    type="text"
                    placeholder={'유권자 목록 파일 선택'}
                    value={candidateMast.votersOgnlNm}
                    style={{ width: '100%' }}
                />
                <button
                    disabled={props.status !== CoolmoveCode.STATUS.DRAFT}
                    type="button"
                    className="btn outline small"
                    style={{ whiteSpace: 'nowrap' }}
                    onClick={handleVotersUpload}
                >
                    파일
                </button>
            </Box>
        </Box>
    );
};