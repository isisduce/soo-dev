import React, { useState } from 'react';
import '../styles/css/reset.css';
import '../styles/css/font.css';
import '../styles/css/common.css';
import '../styles/css/main.css';
import type { DtoCandidateMast } from '../dto/dto';
import headerLogoImg from '/styles/images/header-logo.svg';
import { useAppEnvStore } from '../../../appmain/app.env';

interface CandidateStatusProps {
    onNewAdd?: () => void;
    onLogout?: () => void;
    onUserSetting?: () => void;
    onRowClick?: (row: DtoCandidateMast) => void;
    onDateClick?: (date: string, type: 'start' | 'end') => void;
    onStatusClick?: (status: any) => void;
    onSendByKakao?: (no: number) => void;
    onPublicToggle?: (no: number) => void;
    onExcelDownload?: (no: number) => void;
    onReportDownload?: (no: number) => void;
    data?: DtoCandidateMast[];
    selectedCandidateMast?: DtoCandidateMast;
}

export const CandidateStatus: React.FC<CandidateStatusProps> = ({
    onNewAdd,
    onLogout,
    onUserSetting,
    onRowClick,
    onDateClick,
    onStatusClick,
    onSendByKakao,
    // onPublicToggle,
    onExcelDownload,
    // onReportDownload,
    data = [],
    selectedCandidateMast = undefined,
}) => {

    const env = useAppEnvStore((state) => state.env);
    const imgServer = env.apps?.urlImgServer || '';

    const [selectedRow, setSelectedRow] = useState<number | null>(null);

    // const formatLikeCount = (count: number) => {
    //     return count.toLocaleString();
    // };

    const formatParticipants = (participants: number) => {
        return participants.toLocaleString();
    };

    const handleRowClick = (row: DtoCandidateMast) => {
        setSelectedRow(row.no);
        onRowClick?.(row);
    };

    const renderStatus = (status: DtoCandidateMast['status']) => {
        switch (status?.type) {
            case 'active':
                return (
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            onStatusClick?.(status);
                        }}
                    >
                        {formatParticipants(status.participants || 0)} 참여
                    </a>
                );
            case 'draft':
                return (
                    <>
                        <div>{status.date}</div>
                        <span className="badge draft">임시저장</span>
                    </>
                );
            case 'end':
                return (
                    <>
                        <div>{status.date}</div>
                        <span className="badge end">종료</span>
                    </>
                );
            default:
                return null;
        }
    };

    // const renderPublicStatus = (status: string, no: number) => {
    //     switch (status) {
    //         case 'active':
    //             return '공개 중';
    //         case 'button':
    //             return (
    //                 <button
    //                     type="button"
    //                     className="btn small secondary"
    //                     onClick={() => onPublicToggle?.(no)}
    //                 >
    //                     공개
    //                 </button>
    //             );
    //         default:
    //             return null;
    //     }
    // };

    return (
        <div className="main-container">
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
                        className="new-add btn circle"
                        onClick={onNewAdd}
                    >
                        후보자 신규등록
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
                        className="new-add btn circle"
                        title="후보자 신규등록"
                        onClick={onNewAdd}
                    />
                    <button
                        type="button"
                        className="logout btn circle"
                        title="로그아웃"
                        onClick={onLogout}
                    />
                    <button
                        type="button"
                        className="user-setting btn circle"
                        title="회원정보관리"
                        onClick={onUserSetting}
                    />
                </div>
            </header>
            <section>
                <div className="side-contents">
                    <div className="contents-tit">
                        <h2>후보자 선택 현황</h2>
                    </div>
                    <div className="contents-input-group gap36">
                        {selectedCandidateMast?.candidates.map((candidate, index) => (
                            <div
                                key={candidate.index}
                                className={`candidate-list ${index === 0 ? 'case-01' : 'case-02'}`}
                            >
                                <div className="candidate-area">
                                    <img src={`${imgServer}/${candidate.photoPathNm}`} alt="후보자 사진" />
                                    <div>
                                        <span className="candidate-group">{candidate.clubNm}</span>
                                        <span className="candidate-name">{candidate.playerNm}</span>
                                    </div>
                                </div>
                                <div className="input-group">
                                    {candidate.pledges?.map((pledge, pledgeIndex) => (
                                        <div key={pledgeIndex}>
                                            <input
                                                type="text"
                                                placeholder={pledge}
                                                value={pledge}
                                                readOnly
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="like-number">
                                    <span>
                                        <em></em>
                                        {/* {formatLikeCount(candidate.likeCount)} */}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="main-contents">
                    <div className="contents-tit inner-btn">
                        <button
                            type="button"
                            className="btn primary large"
                            onClick={onNewAdd}
                        >
                            신규등록
                        </button>
                        <h2>후보자 선택 현황</h2>
                    </div>
                    <div className="table-area">
                        <table>
                            <thead>
                                <tr>
                                    <th>NO.</th>
                                    <th>소속</th>
                                    <th>이름</th>
                                    <th>공개일시</th>
                                    <th>종료일시</th>
                                    <th>상태</th>
                                    <th>수신자 목록</th>
                                    <th>카카오 발송</th>
                                    <th>스마트폰에 공개</th>
                                    <th>결과보고서</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.map((row) => (
                                    <tr
                                        key={row.no}
                                        className={selectedRow === row.no ? 'active' : ''}
                                        onClick={() => handleRowClick(row)}
                                    >
                                        <td>{row.no}</td>
                                        <td>{row.candidates?.at(0)?.clubNm || ''}</td>
                                        <td>{row.candidates?.at(0)?.playerNm || ''}</td>
                                        <td>
                                            {row.begDt ? (
                                                <a
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        onDateClick?.(row.begDt!, 'start');
                                                    }}
                                                >
                                                    {row.begDt.replace(' ', '\n')}
                                                </a>
                                            ) : (row.begDt === undefined ? '' : '-')}
                                        </td>
                                        <td>
                                            {row.endDt ? (
                                                <a
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        onDateClick?.(row.endDt!, 'end');
                                                    }}
                                                >
                                                    {row.endDt.replace(' ', '\n')}
                                                </a>
                                            ) : (row.endDt === undefined ? '' : '-')}
                                        </td>
                                        <td onClick={(e) => e.stopPropagation()}>
                                            {renderStatus(row.status)}
                                        </td>
                                        <td onClick={(e) => e.stopPropagation()}>
                                            {row.votersPathNm ? (
                                                <button
                                                    type="button"
                                                    className="btn-excel"
                                                    title="엑셀 다운로드"
                                                    onClick={() => onExcelDownload?.(row.no)}
                                                />
                                            ) : (!row.votersPathNm && row.status?.type !== 'empty' ? '-' : '')}
                                        </td>
                                        <td onClick={(e) => e.stopPropagation()}>
                                            {row.pubYn === 'Y' && (
                                                <button
                                                    type="button"
                                                    className="btn small kakao"
                                                    onClick={() => onSendByKakao?.(row.no)}
                                                >
                                                    발송
                                                </button>
                                            )}
                                        </td>
                                        <td onClick={(e) => e.stopPropagation()}>
                                            {/* {renderPublicStatus(row.publicStatus, row.no)} */}
                                        </td>
                                        <td onClick={(e) => e.stopPropagation()}>
                                            {/* {row.hasReport ? (
                                                <button
                                                    type="button"
                                                    className="btn-file"
                                                    title="보고서 다운로드"
                                                    onClick={() => onReportDownload?.(row.no)}
                                                />
                                            ) : (row.hasReport === false && row.status.type !== 'empty' ? '-' : '')} */}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="table-list">
                        <span>현황 관리</span>
                        <span>
                            <p>공약 목록은 10개까지만 관리되며, 종료일 이후 3일까지만 현황 확인이 가능합니다.</p>
                            <p>종료일 이후 3일 뒤에는 모든 데이터가 삭제됩니다.</p>
                        </span>
                    </div>
                </div>
            </section>
        </div>
    );
};
