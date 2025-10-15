import { Box } from '@mui/material';
import { CoolmoveHeaderLogo } from '../component/coolmove.header.logo';
import { CoolmoveLogout } from '../component/coolmove.logout';
import { CoolmoveUserConfig } from '../component/coolmove.user.config';
import { PromiseMast } from './promise.mast';
import { PromiseStatus } from './promise.status';

export const PromiseContainer = () => {

    return (
        <div className="main-container">
            <header>
                <CoolmoveHeaderLogo />
                <div>
                    <CoolmoveLogout />
                    <CoolmoveUserConfig />
                </div>
            </header>
            <section>
                <Box sx={{ minWidth: '340px', maxWidth: '500px', marginRight: 2 }}>
                    <PromiseMast />
                </Box>
                <Box>
                    <PromiseStatus />
                </Box>
            </section>
        </div>
    );
};
