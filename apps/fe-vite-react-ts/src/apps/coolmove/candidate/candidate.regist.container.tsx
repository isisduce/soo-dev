import React, {  } from 'react';
import { useNavigate } from 'react-router-dom';
import { CandidateRegistComponent } from './candidate.regist.component';
import type { DtoCandidateMast } from '../dto/dto';
import { routerConst } from '../routerConst';
// import { PopRegiDateSetting } from './popup/PopRegiDateSetting';

export const CandidateRegistContainer: React.FC = () => {
    const navigate = useNavigate();
    // const [isDateSettingPopupOpen, setIsDateSettingPopupOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('autoLogin');
        navigate(routerConst.LOGIN);
    };

    const handleUserSetting = () => {
        console.log('회원정보관리 페이지로 이동');
    };

    const handleCandidateStatus = () => {
        navigate(routerConst.CANDIDATE_STATUS);
    };

    const handleSave = (candidateMast: DtoCandidateMast) => {
        console.log('임시저장:', candidateMast);
        // 임시저장 API 호출
    };

    const handleKakaoSend = (candidateMast: DtoCandidateMast) => {
        console.log('카카오 발송:', candidateMast);
        // 카카오 발송 API 호출
    };

    const handlePublishToMobile = (candidateMast: DtoCandidateMast) => {
        console.log('스마트폰에 공개:', candidateMast);
        // 공개 API 호출 후 현황 페이지로 이동
        navigate(routerConst.CANDIDATE_STATUS);
    };

    return (
        <>
            <CandidateRegistComponent
                onLogout={handleLogout}
                onUserSetting={handleUserSetting}
                onCandidateStatus={handleCandidateStatus}
                onSave={handleSave}
                onSendByKakao={handleKakaoSend}
                onPublish={handlePublishToMobile}
            />

            {/* <PopRegiDateSetting
                isOpen={isDateSettingPopupOpen}
                onClose={() => setIsDateSettingPopupOpen(false)}
                onConfirm={handleDateSettingConfirm}
            /> */}
        </>
    );
};
