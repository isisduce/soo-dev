import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppEnvStore } from '../../../appmain/app.env';
import { coolmoveApi } from '../api/coolmove.api';
import { CandidateStatus } from './candidate.status.component';
import { routerConst } from '../routerConst';
import type { DtoCandidateMast } from '../dto/dto';

export const CandidateStatusContainer: React.FC = () => {

    const navigate = useNavigate();

    const env = useAppEnvStore((state) => state.env);
    const apiServer = env.apps?.urlApiServerJava || '';

    // const [selectedRow, setSelectedRow] = useState<number | null>(null);
    const [data, setData] = useState<DtoCandidateMast[]>([]);
    const [selectedCandidateMast, setSelectedCandidateMast] = useState<DtoCandidateMast | undefined>();

    useEffect(() => {
        // 컴포넌트 마운트 시 데이터 로드
        loadCandidateMast();
    }, []);

    const loadCandidateMast = async () => {
        try {
            const token = localStorage.getItem('token') || '';
            const response = await coolmoveApi.candidateMastSelect(apiServer, token);
            setData(response.result);
            setSelectedCandidateMast(undefined);
        } catch (error) {
            console.error('현황 데이터 로드 실패:', error);
        }
    };

    const handleNewAdd = () => {
        navigate(routerConst.CANDIDATE_REGIST);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('autoLogin');
        navigate('/login');
    };

    const handleUserSetting = () => {
        console.log('회원정보관리 페이지로 이동');
    };

    const handleRowClick = (rowData: any) => {
        // setSelectedRow(rowData.no);
        setSelectedCandidateMast(rowData);
        console.log('선택된 행:', rowData);
    };

    const handleDateClick = (date: string, type: 'start' | 'end') => {
        console.log('날짜 클릭:', date, type);
        // 날짜 수정 팝업 등 처리
    };

    const handleStatusClick = (status: any) => {
        console.log('상태 클릭:', status);
        // 상세 현황 보기
    };

    const handleExcelDownload = (no: number) => {
        console.log('엑셀 다운로드:', no);
        // 엑셀 다운로드 API 호출
    };

    const handleSendByKakao = (no: number) => {
        console.log('카카오 발송:', no);
        // 카카오 발송 API 호출
    };

    const handlePublicToggle = (no: number) => {
        console.log('공개 토글:', no);
        // 공개 상태 변경 API 호출
    };

    const handleReportDownload = (no: number) => {
        console.log('보고서 다운로드:', no);
        // 보고서 다운로드 API 호출
    };

    return (
        <CandidateStatus
            onNewAdd={handleNewAdd}
            onLogout={handleLogout}
            onUserSetting={handleUserSetting}
            onRowClick={handleRowClick}
            onDateClick={handleDateClick}
            onStatusClick={handleStatusClick}
            onExcelDownload={handleExcelDownload}
            onSendByKakao={handleSendByKakao}
            onPublicToggle={handlePublicToggle}
            onReportDownload={handleReportDownload}
            data={data}
            selectedCandidateMast={selectedCandidateMast}
        />
    );
};
