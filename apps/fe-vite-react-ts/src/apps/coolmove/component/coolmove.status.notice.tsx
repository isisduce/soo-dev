import { Box } from '@mui/material';

export const CoolmoveStatusNotice = () => {

    return (
        <Box sx={{ width: '100%' }}>
            <Box
                sx={{ width: '100%', p: 2, border: '1px solid #fff', borderRadius: '8px', backgroundColor: '#fff',
                    display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start', textAlign: 'left'
                }}>
                <h3 style={{ textAlign: 'left', width: '100%' }}>현황 관리</h3>
                <span style={{ fontSize: '1em', color: '#555', lineHeight: 1.4, textAlign: 'left', width: '100%' }}>
                    <p>① 공약 목록은 10개까지만 관리되며, 종료일 이후 3일까지만 현황 확인이 가능합니다.</p>
                    <p>② 종료일 이후 3일 뒤에는 모든 데이터가 삭제됩니다.</p>
                </span>
            </Box>
        </Box>
    );

}
