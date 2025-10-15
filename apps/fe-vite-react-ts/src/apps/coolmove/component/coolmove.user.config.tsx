// import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { CoolmoveConst } from '../types/const';

export const CoolmoveUserConfig = () => {

    // const navigate = useNavigate();

    const handleConfig = () => {
        // localStorage.removeItem('token');
        // localStorage.removeItem('autoLogin');
        // navigate(routerConst.LOGIN);
    };

    return (
        <Box sx={{ height: `${CoolmoveConst.HEADER_HEIGHT}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
            <button
                type="button"
                className="user-setting btn circle"
                onClick={handleConfig}
            >
                회원정보관리
            </button>
        </Box>
    );

}
