import { useEffect, useState } from 'react';
import { AppBar, Box } from '@mui/material';
import { useAppEnvStore } from '../../../appmain/app.env';
import { CoolmoveHeaderLogo } from '../component/coolmove.header.logo';
import { CoolmoveHeaderLogout } from '../component/coolmove.header.logout';
import { CoolmoveHeaderUserConfig } from '../component/coolmove.header.user.config';
import { PrimaryMast } from './primary.mast';
import type { DtoCandidateMast } from '../dto/dto.candidate';
import { CandidateMast } from '../dto/dto.candidate';
import { coolmoveApi } from '../api/coolmove.api';
import { CoolmoveCode, type CoolmoveStatus } from '../types/types';
import { CoolmoveConst } from '../types/const';
import { signinCheck } from '../login/signin.check';
import { FormCandidateTableNotice } from '../component/form.candidate.table.notice';
import { TableCandidateMast } from '../component/table.candidate.mast';

export const PrimaryContainer = () => {

    const env = useAppEnvStore((state) => state.env);
    const apiServer = env.apps?.urlApiServerJava || '';
    const token = localStorage.getItem('token') || '';
    const signin = signinCheck();

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
            const response = await coolmoveApi.candidateMastSelect(apiServer, token, { type: CoolmoveCode.TYPE.PRIMARY });
            setData(response.result);
            setSelectedCandidateMast(undefined);
        } catch (error) {
            console.error('loadCandidateMast failure:', error);
        }
    };

    const handleNew = () => {
        setSelectedCandidateMast(CandidateMast.createEmptyPrimary());
    }

    const handleRemove = async (v?: DtoCandidateMast) => {
        if (!v) return;
        const response = await coolmoveApi.candidateMastRemove(env.apps?.urlApiServerJava || '', localStorage.getItem('token') || '', v.uuid || '')
        if (response.success) {
            setData(prev => {
                const newArr = prev.filter(item => item.uuid !== v.uuid);
                return newArr.map((item, idx) => ({ ...item, no: newArr.length - idx }));
            });
            setSelectedCandidateMast(prev => (prev && prev.uuid === v.uuid) ? undefined : prev);
        }
    }

    const handleSave = async (v?: DtoCandidateMast, status?: CoolmoveStatus) => {
        if (!v) return;
        if (!v?.uuid) {
            if (10 <= data.length) {
                alert('공약은 최대 10개까지만 등록할 수 있습니다.');
                return;
            }
        }
        if (apiServer) {
            const payload = {
                ...v,
                no: v?.no ?? 0,
                candidates: v?.candidates.map(({ photoFile, ...c }) => c),
                votersFile: undefined,
                status: status ?? CoolmoveCode.STATUS.EMPTY,
            };
            const response = await coolmoveApi.candidateMastInsert(
                apiServer,
                token,
                {
                    candidateMast: payload,
                    photo1: v.candidates[0]?.photoFile,
                    photo2: v.candidates[1]?.photoFile,
                    voters: v.votersFile,
                }
            );
            if (response.success) {
                if (response.result) {
                    const saved = response.result as DtoCandidateMast;
                    setData(prev => {
                        const exists = prev.some(item => item.uuid === saved.uuid);
                        const newArr = exists
                            ? prev.map(item => item.uuid === saved.uuid ? saved : item)
                            : [saved, ...prev];
                        return newArr.map((item, idx) => ({ ...item, no: newArr.length - idx }));
                    });
                    setSelectedCandidateMast(prev => (prev && prev.uuid === saved.uuid) ? saved : prev);
                }
            } else {
                alert(`저장에 실패하였습니다: ${response.code} ${response.message}`);
            }
        }
    }

    const handleDraftSave = async (v?: DtoCandidateMast) => {
        handleSave(v, CoolmoveCode.STATUS.DRAFT);
    }

    const handleDraftView = (v?: DtoCandidateMast) => {
        if (!v) return;
    }

    const handleDraftDone = async (v?: DtoCandidateMast) => {
        handleSave(v, CoolmoveCode.STATUS.FINAL);
    }

    return (
        <>{signin &&
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', minHeight: '100vh', }}>
                <AppBar sx={{ backgroundColor: '#ffffff', color: '#000000', display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '0 16px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', flexWrap: 'nowrap', overflowX: 'auto' }}>
                    <Box sx={{ display: 'flex !important', alignItems: 'center', flexShrink: 1 }}>
                        <CoolmoveHeaderLogo />
                    </Box>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0, minWidth: 0 }}>
                        <CoolmoveHeaderLogout />
                        <CoolmoveHeaderUserConfig />
                    </Box>
                </AppBar>
                <Box sx={{ height: `${CoolmoveConst.HEADER_HEIGHT}px` }} />
                <Box sx={{ width: '100%' }}>
                    {/* Responsive layout: column on xs, row on md and up */}
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, padding: 2, boxSizing: 'border-box' }}>
                        <Box sx={{ width: { xs: '640px', md: '640px' }, maxWidth: { md: '640px' } }}>
                            <PrimaryMast
                                candidateMast={selectedCandidateMast}
                                selectedCandidateMast={selectedCandidateMast}
                                onDraftSave={handleDraftSave}
                                onDraftView={handleDraftView}
                                onDraftDone={handleDraftDone}
                            />
                        </Box>
                        <Box sx={{ width: { xs: '100%', md: 'calc(100% - 600px)' }, flexGrow: 1, minWidth: 0, overflow: 'auto' }}>
                            <Box sx={{ width: '100%', marginBottom: 2 }}>
                                <TableCandidateMast
                                    type={CoolmoveCode.TYPE.PRIMARY}
                                    data={data}
                                    isLoading={false}
                                    selectedCandidateMast={selectedCandidateMast}
                                    setSelectedCandidateMast={setSelectedCandidateMast}
                                    onNew={handleNew}
                                    onRemove={handleRemove}
                                />
                                <FormCandidateTableNotice />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        }</>
    );
};
