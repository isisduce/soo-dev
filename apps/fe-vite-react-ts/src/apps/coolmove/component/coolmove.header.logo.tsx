import { Link } from 'react-router-dom';
import { Box } from '@mui/material';
import headerLogoImg from '/styles/images/header-logo.svg';
import { routerConst } from '../routerData';
import { CoolmoveConst } from '../types/const';

export const CoolmoveHeaderLogo = () => {

    return (
        <Box sx={{ height: `${CoolmoveConst.HEADER_HEIGHT}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
            <Link key={`${routerConst.BASE}.path`} to={routerConst.BASE} style={{ display: 'block', margin: '8px 0' }}>
                <img src={headerLogoImg} alt="Cool Move" style={{ display: 'block', margin: 'auto', maxHeight: '100%' }} />
            </Link>
        </Box>
    );

}
