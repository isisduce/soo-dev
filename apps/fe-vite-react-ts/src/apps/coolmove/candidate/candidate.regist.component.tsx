import { useState } from 'react';
import '../styles/css/reset.css';
import '../styles/css/font.css';
import '../styles/css/common.css';
import '../styles/css/main.css';
import { useAppEnvStore } from '../../../appmain/app.env';
import { coolmoveApi } from '../api/coolmove.api';
import { emptyCandidateMast, type DtoCandidateMast } from '../dto/dto';
import { CandidateItem } from '../candidate/candidate-item.component';
import headerLogoImg from '/styles/images/header-logo.svg';

interface CandidateRegistComponentProps {
    onLogout?: () => void;
    onUserSetting?: () => void;
    onCandidateStatus?: () => void;
    onSave?: (v: DtoCandidateMast) => void;
    onSendByKakao?: (v: DtoCandidateMast) => void;
    onPublish?: (v: DtoCandidateMast) => void;
}

export const CandidateRegistComponent: React.FC<CandidateRegistComponentProps> = ({
    onLogout,
    onUserSetting,
    onCandidateStatus,
    onSave,
    onSendByKakao,
    onPublish,
}) => {

    const env = useAppEnvStore((state) => state.env);
    const apiServer = env.apps?.urlApiServerJava || '';
    const token = localStorage.getItem('token') || '';

    const [candidateMast, setCandidateMast] = useState<DtoCandidateMast>(emptyCandidateMast);

    const handleVoterListUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xlsx,.xls,.csv';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                setCandidateMast(prev => ({
                    ...prev,
                    votersPathNm: file.name,
                    votersFile: file
                }));
            }
        };
        input.click();
    };

    const handleSave = async () => {
        const candidateMastPayload = {
            ...candidateMast,
            candidates: candidateMast.candidates.map(({ photoFile, ...c }) => c),
            votersFile: undefined,
        };
        await coolmoveApi.candidateMastInsert(
            apiServer,
            token,
            {
                candidateMast: candidateMastPayload,
                photo1: candidateMast.candidates[0]?.photoFile,
                photo2: candidateMast.candidates[1]?.photoFile,
                voters: candidateMast.votersFile,
            }
        );
        onSave?.(candidateMast);
    };

    const handleSendByKakao = () => {
        alert('카카오 발송 기능은 현재 준비 중입니다.');
        onSendByKakao?.(candidateMast);
    };

    const handlePublish = () => {
        alert('스마트폰 공개 기능은 현재 준비 중입니다.');
        onPublish?.(candidateMast);
    };

    return (
        <div className="main-container manager-main">
            <header>
                <a
                    href="#"
                    className="logo"
                    onClick={(e) => e.preventDefault()}
                >
                    <img src={headerLogoImg} alt="Cool Move" />
                </a>
                <div>
                    <button
                        type="button"
                        className="check-view btn circle"
                        onClick={onCandidateStatus}
                    >
                        후보자 선택 현황 보기
                    </button>
                    <button
                        type="button"
                        className="logout btn circle"
                        onClick={onLogout}
                    >
                        로그아웃
                    </button>
                    <button
                        type="button"
                        className="user-setting btn circle"
                        onClick={onUserSetting}
                    >
                        회원정보관리
                    </button>
                </div>
                <div className="mo">
                    <button
                        type="button"
                        className="check-view btn circle"
                        title='후보자 선택 현황 보기'
                        onClick={onCandidateStatus}
                    />
                    <button
                        type="button"
                        className="logout btn circle"
                        title='로그아웃'
                        onClick={onLogout}
                    />
                    <button
                        type="button"
                        className="user-setting btn circle"
                        title='회원정보관리'
                        onClick={onUserSetting}
                    />
                </div>
            </header>
            <section>
                <div className="main-contents">
                    <div className="contents-tit">
                        <h2>후보자 등록</h2>
                    </div>
                    <div className="candidate-cont">
                        <CandidateItem
                            candidateNumber={1}
                            candidate={candidateMast.candidates[0]}
                            onCandidateChange={candidate => setCandidateMast(prev => {
                                if (!prev) return prev;
                                const newCandidates = prev.candidates.map((c, idx) => idx === 0 ? candidate : c);
                                return { ...prev, candidates: newCandidates };
                            })}
                        />
                        <CandidateItem
                            candidateNumber={2}
                            candidate={candidateMast.candidates[1]}
                            onCandidateChange={candidate => setCandidateMast(prev => {
                                if (!prev) return prev;
                                const newCandidates = prev.candidates.map((c, idx) => idx === 1 ? candidate : c);
                                return { ...prev, candidates: newCandidates };
                            })}
                        />
                    </div>
                    {/* 공개 설정 */}
                    <div className="candidate-bottom">
                        <div>
                            <div>
                                <label>공개기간</label>
                                <input
                                    type="text"
                                    value={candidateMast.period}
                                    readOnly
                                    placeholder="공개기간을 선택하세요"
                                />
                                <button
                                    type="button"
                                    className="btn outline small"
                                    // onClick={onSetPeriod}
                                >
                                    설정
                                </button>
                            </div>
                            <div>
                                <label>유권자 목록</label>
                                <input
                                    type="text"
                                    value={candidateMast.votersPathNm}
                                    readOnly
                                    placeholder="유권자 목록 파일을 선택하세요"
                                />
                                <button
                                    type="button"
                                    className="btn outline small"
                                    onClick={handleVoterListUpload}
                                >
                                    파일
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* 버튼 영역 */}
                    <div className="contents-btn-area">
                        <span>'공개'를 선택해야 화면에 노출됩니다.</span>
                        <div className="btn-group">
                            <div>
                                <button
                                    type="button"
                                    className="btn outline large"
                                    onClick={handleSave}
                                >
                                    임시저장
                                </button>
                                <button
                                    disabled
                                    type="button"
                                    className="btn kakao large ico-kakao"
                                    onClick={handleSendByKakao}
                                >
                                    <span></span>카카오로 발송
                                </button>
                            </div>
                            <button
                                disabled
                                type="button"
                                className="btn primary large"
                                onClick={handlePublish}
                            >
                                스마트폰에 공개
                            </button>
                        </div>
                    </div>
                </div>
                {/* 구분선, 미리보기 영역 등은 필요시 추가 구현 */}
                {/* 구분선 */}
                <div className="between-fake-area"></div>
                <div className="between-area">
                    <span>
                        [임시저장]을 클릭하면<br />미리보기 화면이 제공됩니다
                    </span>
                    <span className="double-arrow"></span>
                </div>

                {/* 미리보기 */}
                <div className="side-contents">
                    <div className="contents-tit inner-sub-txt">
                        <h2>미리보기</h2>
                        <span className="sub-txt">좋아하는 후보자를 선택해주세요</span>
                    </div>
                    <div className="contents-input-group gap36">
                        {/* 후보자 1 미리보기 */}
                        {/* <div className="candidate-list case-01">
                            <div className="candidate-area">
                                <img src={candidate1.photo} alt="후보자 사진" />
                                <div>
                                    <span className="candidate-group">
                                        {candidate1.group || "입력한 소속"}
                                    </span>
                                    <span className="candidate-name">
                                        {candidate1.name || "입력한 이름"}
                                    </span>
                                </div>
                            </div>
                            <div className="input-group">
                                {candidate1.pledges.map((pledge, index) => (
                                    <div key={index}>
                                        <input
                                            type="text"
                                            placeholder={pledge || `입력한 공약 ${index + 1}`}
                                            value={pledge}
                                            readOnly
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="like-group">
                                <button type="button" className="btn primary large">
                                    좋아요
                                </button>
                                <div className="like-number">
                                    <span><em></em>0</span>
                                </div>
                            </div>
                        </div> */}

                        {/* 후보자 2 미리보기 */}
                        {/* <div className="candidate-list case-02">
                            <div className="candidate-area">
                                <img src={candidate2.photo} alt="후보자 사진" />
                                <div>
                                    <span className="candidate-group">
                                        {candidate2.group || "입력한 소속"}
                                    </span>
                                    <span className="candidate-name">
                                        {candidate2.name || "입력한 이름"}
                                    </span>
                                </div>
                            </div>
                            <div className="input-group">
                                {candidate2.pledges.map((pledge, index) => (
                                    <div key={index}>
                                        <input
                                            type="text"
                                            placeholder={pledge || `입력한 공약 ${index + 1}`}
                                            value={pledge}
                                            readOnly
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="like-group">
                                <button type="button" className="btn primary large">
                                    좋아요
                                </button>
                                <div className="like-number">
                                    <span><em></em>0</span>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </section>
        </div>
    );

}