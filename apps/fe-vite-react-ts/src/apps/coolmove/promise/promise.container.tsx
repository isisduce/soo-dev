import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useAppEnvStore } from '../../../appmain/app.env';
import { CoolmoveHeaderLogo } from '../component/coolmove.header.logo';
import { CoolmoveLogout } from '../component/coolmove.logout';
import { CoolmoveUserConfig } from '../component/coolmove.user.config';
import { PromiseMast } from './promise.mast';
import { PromiseStatus } from './promise.status';
import type { DtoCandidateMast } from '../dto/dto.candidate';
import { coolmoveApi } from '../api/coolmove.api';
import { CoolmoveCode } from '../types/types';

export const PromiseContainer = () => {

    const env = useAppEnvStore((state) => state.env);
    const apiServer = env.apps?.urlApiServerJava || '';

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

    const handleNew = () => {
        console.log('신규 등록 클릭');
    }

    const handleSave = () => {
        loadCandidateMast();
        console.log('저장 클릭');
    }

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
                    <PromiseMast
                        candidateMast={selectedCandidateMast}
                        onSave={handleSave}
                        // onView={handleView}
                        // onDone={handleDone}
                        // onSend={handleSend}
                        // onShow={handleShow}
                    />
                </Box>
                <Box sx={{ flexGrow: 1, maxWidth: '100%' }}>
                    <PromiseStatus
                        data={data}
                        selectedCandidateMast={selectedCandidateMast}
                        setSelectedCandidateMast={setSelectedCandidateMast}
                        onNew={handleNew}
                    />
                </Box>
            </section>
        </div>
    );
};
