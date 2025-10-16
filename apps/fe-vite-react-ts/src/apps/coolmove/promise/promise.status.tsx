import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { useAppEnvStore } from '../../../appmain/app.env';
import { CoolmoveStatusNotice } from '../component/coolmove.status.notice';
import type { DtoCandidateMast } from '../dto/dto.candidate';
import { CoolmoveCode } from '../types/types';
import defaultUserImg from '/styles/images/user-img-120.png';

interface PromiseStatusProps {
    data?: DtoCandidateMast[];
    selectedCandidateMast?: DtoCandidateMast;
    setSelectedCandidateMast?: (candidateMast: DtoCandidateMast | undefined) => void;
    onNew?: () => void;

    // onNewRegistration?: () => void;
    // onPublishToMobile?: (formData: any) => void;
    // onExcelDownload?: (rowNo: number) => void;
    // onKakaoSend?: (rowNo: number) => void;
    // onPublish?: (rowNo: number) => void;
    // onReportDownload?: (rowNo: number) => void;
    // // onPledgeReorder?: (newOrder: PledgeData[]) => void;
}

export const PromiseStatus: React.FC<PromiseStatusProps> = (props: PromiseStatusProps) => {

    const env = useAppEnvStore((state) => state.env);
    const imgServer = env.apps?.urlImgServer || '';

    const [selectedRow, setSelectedRow] = useState<number | null>(null);

    const handleRowClick = (row: DtoCandidateMast) => {
        setSelectedRow(row.no);
        props.setSelectedCandidateMast?.(row);
    };

    const formatParticipants = (participants: number) => {
        return participants.toLocaleString();
    };
    const renderStatus = (row: DtoCandidateMast) => {
        switch (row.status) {
            case CoolmoveCode.STATUS.DRAFT:
                return (
                    <>
                        <div>{row.begDt}</div>
                        <span className="badge draft">임시저장</span>
                    </>
                );
            case CoolmoveCode.STATUS.FINAL:
                return (
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            // onStatusClick?.(row.status);
                        }}
                    >
                        {formatParticipants(row.votersCount || 0)} 참여
                    </a>
                );
            case CoolmoveCode.STATUS.CLOSE:
                return (
                    <>
                        <div>{row.endDt}</div>
                        <span className="badge end">종료</span>
                    </>
                );
            default:
                return null;
        }
    };

    const handleNew = () => {
        setSelectedRow(null);
        props.setSelectedCandidateMast?.(undefined);
        props.onNew?.();
    };

    // const renderDateCell = (date: string) => {
    //     if (date === "-" || date === "") return date;
    //     return (
    //         <a href="#">
    //             {date.split('\n').map((line, index) => (
    //                 <React.Fragment key={index}>
    //                     {line}
    //                     {index < date.split('\n').length - 1 && <br />}
    //                 </React.Fragment>
    //             ))}
    //         </a>
    //     );
    // };

    return (
        <Box sx={{ width: '100%', backgroundColor: '#fff', padding: 1, borderRadius: 4, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', gap: 2, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', mb: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ position: 'absolute', left: 0, marginRight: 2 }}
                    onClick={handleNew}
                >
                    신규등록
                </Button>
                <h2>공약 선택 현황</h2>
            </Box>
            <div
                style={{ width: '100%', overflowX: 'auto' }}
            >
                <table>
                    <thead>
                        <tr>
                            <th>NO.</th>
                            <th>소속</th>
                            <th>이름</th>
                            <th>공개일시</th>
                            <th>종료일시</th>
                            <th>상태</th>
                            <th>유권자</th>
                            <th>카카오 발송</th>
                            <th>공개 여부</th>
                            <th>결과보고서</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.data?.map((row) => (
                            <tr
                                key={row.no}
                                className={selectedRow === row.no ? 'active' : ''}
                                onClick={() => handleRowClick(row)}
                            >
                                <td>{row.no}</td>
                                <td>{row.candidates?.at(0)?.clubNm || ''}</td>
                                <td>{
                                    row.candidates?.at(0)?.photoPathNm ? (
                                        <img
                                            src={`${imgServer}/${row.candidates.at(0)?.photoPathNm}`}
                                            alt={row.candidates.at(0)?.playerNm}
                                            style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', verticalAlign: 'middle', marginRight: 8 }}
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: '50%',
                                                backgroundColor: '#ccc',
                                                display: 'inline-block',
                                                verticalAlign: 'middle',
                                                marginRight: 8,
                                                backgroundImage: `url(${defaultUserImg})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                            }}
                                        />
                                    )}
                                    {`${row.candidates?.at(0)?.playerNm || ''}`}
                                </td>
                                <td>
                                    {row.begDt ? (
                                        <a
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                // onDateClick?.(row.begDt!, 'start');
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
                                                // onDateClick?.(row.endDt!, 'end');
                                            }}
                                        >
                                            {row.endDt.replace(' ', '\n')}
                                        </a>
                                    ) : (row.endDt === undefined ? '' : '-')}
                                </td>
                                <td onClick={(e) => e.stopPropagation()}>
                                    {renderStatus(row)}
                                </td>
                                <td onClick={(e) => e.stopPropagation()}>
                                    {row.votersPathNm ? (
                                        <button
                                            type="button"
                                            className="btn-excel"
                                            title="엑셀 다운로드"
                                            // onClick={() => onExcelDownload?.(row.no)}
                                        />
                                    ) : (!row.votersPathNm && row.status !== CoolmoveCode.STATUS.EMPTY ? '-' : '')}
                                </td>
                                <td onClick={(e) => e.stopPropagation()}>
                                    {row.pubYn === 'Y' && (
                                        <button
                                            type="button"
                                            className="btn small kakao"
                                            // onClick={() => onSendByKakao?.(row.no)}
                                        >
                                            발송
                                        </button>
                                    )}
                                </td>
                                <td>
                                    {/* {row.statusType === 'active' && row.isPublic ? '공개 중' :
                                    row.statusType === 'draft' && row.group ? (
                                        <button
                                            type="button"
                                            className="btn small secondary"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onPublish?.(row.no);
                                            }}
                                        >
                                            공개
                                        </button>
                                    ) : ''} */}
                                </td>
                                <td>
                                    {/* {row.hasReportDownload ? (
                                        <button
                                            type="button"
                                            className="btn-file"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onReportDownload?.(row.no);
                                            }}
                                            title="보고서 다운로드"
                                        />
                                    ) : (row.statusType === 'end' ? '-' : '')} */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <CoolmoveStatusNotice />
        </Box>
    );
};