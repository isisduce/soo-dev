import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { routerConst } from '../routerData';
import { CoolmoveConst } from '../types/const';

export const CoolmoveHeaderLogout = () => {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userid');
        localStorage.removeItem('passwd');
        localStorage.removeItem('token');
        localStorage.removeItem('autoLogin');
        navigate(routerConst.LOGIN);
    };

    return (
        <Box sx={{ height: `${CoolmoveConst.HEADER_HEIGHT}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
            <button
                type="button"
                className="logout btn circle"
                onClick={handleLogout}
            >
                로그아웃
            </button>
        </Box>
    );

}
