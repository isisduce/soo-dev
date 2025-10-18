import { Box, Typography } from '@mui/material';
import { type DtoCandidateMast } from '../dto/dto.candidate';
import { CoolmoveCode, type CoolmoveStatus, type CoolmoveType } from '../types/types';

interface FormCandidatePeriodVotersProps {
    type?: CoolmoveType;
    status?: CoolmoveStatus;
    candidateMast?: DtoCandidateMast;
    setCandidateMast?: (candidateMast: DtoCandidateMast) => void;
}

export const FormCandidatePeriodVoters: React.FC<FormCandidatePeriodVotersProps> = (props: FormCandidatePeriodVotersProps) => {

    const publicHeadWidth = 80;

    const handlePeriodChange = () => {
        // props.setCandidateMast?.(prev => ({ ...prev, period: value }));
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
                if (props.candidateMast) {
                    props.setCandidateMast?.({
                        ...props.candidateMast,
                        votersPathNm: file.name,
                        votersOgnlNm: file.name,
                        votersFile: file,
                    });
                }
            }
        };
        input.click();
    };

    const editEnabled = props.status === CoolmoveCode.STATUS.EMPTY || props.status === CoolmoveCode.STATUS.DRAFT;

    return (
        <Box sx={{ width: '100%', backgroundColor: '#EFF9FF', padding: 2, borderRadius: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', gap: 1 }}>
                <Box sx={{ width: `${publicHeadWidth}px`, marginRight: 1, whiteSpace: 'nowrap' }}>공개기간</Box>
                <input
                    disabled={!editEnabled}
                    readOnly
                    type="text"
                    placeholder={'공개기간을 설정하세요'}
                    value={props.candidateMast?.period || ''}
                    style={{ width: '100%' }}
                />
                <button
                    disabled={!editEnabled}
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
                    disabled={!editEnabled}
                    readOnly
                    type="text"
                    placeholder={'유권자 목록 파일을 선택하세요'}
                    value={props.candidateMast?.votersOgnlNm || ''}
                    style={{ width: '100%' }}
                />
                <button
                    disabled={!editEnabled}
                    type="button"
                    className="btn outline small"
                    style={{ whiteSpace: 'nowrap' }}
                    onClick={handleVotersUpload}
                >
                    파일
                </button>
            </Box>
            <Box sx={{ height: 12 }} />
            <Typography variant="body2" color='warning' >
                공개기간과 유권자 목록은 선거가 시작된 후에는 변경할 수 없습니다.
            </Typography>
        </Box>
    );
};