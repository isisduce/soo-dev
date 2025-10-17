import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Box } from '@mui/material';
import { useAppEnvStore } from '../../../appmain/app.env';
import { CoolmoveHeaderLogo } from '../component/coolmove.header.logo';
import { CoolmoveLogout } from '../component/coolmove.logout';
import { CoolmoveUserConfig } from '../component/coolmove.user.config';
import { PromiseMast } from './promise.mast';
import { PromiseStatus } from './promise.status';
import type { DtoCandidateMast } from '../dto/dto.candidate';
import { coolmoveApi } from '../api/coolmove.api';
import { CoolmoveCode } from '../types/types';
import { routerConst } from '../routerData';
import { CoolmoveConst } from '../types/const';

export const PromiseContainer = () => {

    const navigate = useNavigate();
    const env = useAppEnvStore((state) => state.env);
    const apiServer = env.apps?.urlApiServerJava || '';
    const userid = localStorage.getItem('userid') || '';
    const signin = !!userid;

    if (!signin) {
        navigate(routerConst.LOGIN);
    }

    // const [selectedRow, setSelectedRow] = useState<number | null>(null);
    const [data, setData] = useState<DtoCandidateMast[]>([]);
    const [selectedCandidateMast, setSelectedCandidateMast] = useState<DtoCandidateMast | undefined>();

    useEffect(() => {
        if (apiServer) {
            loadCandidateMast();
        }
    }, [apiServer]);

    const loadCandidateMast = async () => {
        try {
            const token = localStorage.getItem('token') || '';
            const response = await coolmoveApi.candidateMastSelect(apiServer, token, { type: CoolmoveCode.TYPE.PROMISE });
            setData(response.result);
            setSelectedCandidateMast(undefined);
        } catch (error) {
            console.error('loadCandidateMast failure:', error);
        }
    };

    const handleCandidateMastChange = (candidateMast: DtoCandidateMast) => {
        setData(data.map(d => d.uuid === candidateMast.uuid ? candidateMast : d));
    }

    const handleNew = () => {
    }

    const handleRemove = (candidateMast: DtoCandidateMast) => {
        loadCandidateMast();
    }

    const handleDraftSave = () => {
        if (!selectedCandidateMast?.uuid) {
            loadCandidateMast();
        } else {
            console.log('PromiseContainer - handleDraftSave', selectedCandidateMast);
            setData(data.map(d => d.uuid === selectedCandidateMast.uuid ? selectedCandidateMast : d));
        }
        // setSelectedCandidateMast(undefined);
    }

    const handleDraftView = () => {
    }

    const handleDraftDone = () => {
        loadCandidateMast();
        setSelectedCandidateMast(undefined);
    }

    return (
        <>{signin &&
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', }}>
                <AppBar sx={{ backgroundColor: '#ffffff', color: '#000000', display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '0 16px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', flexWrap: 'nowrap', overflowX: 'auto' }}>
                    <Box sx={{ display: 'flex !important', alignItems: 'center', flexShrink: 1 }}>
                        <CoolmoveHeaderLogo />
                    </Box>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0, minWidth: 0 }}>
                        <CoolmoveLogout />
                        <CoolmoveUserConfig />
                    </Box>
                </AppBar>
                <Box sx={{ height: `${CoolmoveConst.HEADER_HEIGHT}px` }} />
                <Box>
                    {/* Responsive layout: column on xs, row on md and up */}
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, padding: 2, boxSizing: 'border-box' }}>
                        <Box sx={{ width: { xs: '540px', md: '320px' }, maxWidth: { md: '540px' } }}>
                            <PromiseMast
                                candidateMast={selectedCandidateMast}
                                setCandidateMast={handleCandidateMastChange}
                                onDraftSave={handleDraftSave}
                                onDraftView={handleDraftView}
                                onDraftDone={handleDraftDone}
                            />
                        </Box>
                        <Box sx={{ width: { xs: '100%', md: 'calc(100% - 320px)' }, flexGrow: 1, minWidth: 0, overflow: 'auto' }}>
                            <PromiseStatus
                                data={data}
                                selectedCandidateMast={selectedCandidateMast}
                                setSelectedCandidateMast={setSelectedCandidateMast}
                                onNew={handleNew}
                                onRemove={handleRemove}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
        }</>
    );
};
