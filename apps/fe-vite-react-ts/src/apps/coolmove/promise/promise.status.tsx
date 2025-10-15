import React, { useState, useRef } from 'react';
import '../styles/css/reset.css';
import '../styles/css/font.css';
import '../styles/css/common.css';
import '../styles/css/main.css';
import { CoolmoveHeaderLogo } from '../component/coolmove.header.logo';
import { CoolmoveLogout } from '../component/coolmove.logout';
import { CoolmoveUserConfig } from '../component/coolmove.user.config';
import { PromiseMast } from './promise.mast';
import { Box } from '@mui/material';

interface TableRowData {
    no: number;
    group: string;
    name: string;
    startDate: string;
    endDate: string;
    status: string;
    statusType: 'active' | 'draft' | 'end';
    participants?: number;
    isPublic: boolean;
    hasReportDownload?: boolean;
}

interface PromiseStatusProps {
    onNewRegistration?: () => void;
    onPublishToMobile?: (formData: any) => void;
    onExcelDownload?: (rowNo: number) => void;
    onKakaoSend?: (rowNo: number) => void;
    onPublish?: (rowNo: number) => void;
    onReportDownload?: (rowNo: number) => void;
    // onPledgeReorder?: (newOrder: PledgeData[]) => void;
    tableData?: TableRowData[];
}

export const PromiseStatus: React.FC<PromiseStatusProps> = ({
    onNewRegistration,
    onExcelDownload,
    onKakaoSend,
    onPublish,
    onReportDownload,
    // onPledgeReorder,
    tableData = [
        { no: 10, group: "소속표기", name: "이름표기", startDate: "2025.02.22\n15:00", endDate: "2025.02.22\n15:00", status: "5,451 참여", statusType: "active", participants: 5451, isPublic: true },
        { no: 9, group: "소속표기", name: "이름표기", startDate: "2025.02.22\n15:00", endDate: "2025.02.22\n15:00", status: "5,451 참여", statusType: "active", participants: 5451, isPublic: true },
        { no: 8, group: "소속표기", name: "이름표기", startDate: "2025.02.22\n15:00", endDate: "2025.02.22\n15:00", status: "임시저장", statusType: "draft", isPublic: false },
        { no: 7, group: "소속표기", name: "이름표기", startDate: "2025.02.22\n15:00", endDate: "2025.02.22\n15:00", status: "임시저장", statusType: "draft", isPublic: false },
        { no: 6, group: "", name: "", startDate: "-", endDate: "-", status: "임시저장", statusType: "draft", isPublic: false },
        { no: 5, group: "", name: "", startDate: "2025.02.22\n15:00", endDate: "2025.02.22\n15:00", status: "종료", statusType: "end", isPublic: false, hasReportDownload: true },
        { no: 4, group: "", name: "", startDate: "", endDate: "", status: "", statusType: "draft", isPublic: false },
        { no: 3, group: "", name: "", startDate: "-", endDate: "-", status: "", statusType: "draft", isPublic: false },
        { no: 2, group: "", name: "", startDate: "", endDate: "", status: "", statusType: "draft", isPublic: false },
        { no: 1, group: "", name: "", startDate: "", endDate: "", status: "", statusType: "draft", isPublic: false },
    ]
}) => {
    const [selectedRow, setSelectedRow] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        group: '',
        name: '',
        photo: '',
        startDate: '',
        endDate: '',
    });

    const handleRowClick = (rowNo: number) => {
        setSelectedRow(rowNo);
    };

    const renderStatusBadge = (status: string, statusType: string) => {
        if (statusType === 'active' && status.includes('참여')) {
            return <a href="#">{status}</a>;
        } else if (statusType === 'draft') {
            return (
                <div>
                    <div>2025.02.09</div>
                    <span className="badge draft">임시저장</span>
                </div>
            );
        } else if (statusType === 'end') {
            return (
                <div>
                    <div>2025.02.09</div>
                    <span className="badge end">종료</span>
                </div>
            );
        }
        return status;
    };

    const renderDateCell = (date: string) => {
        if (date === "-" || date === "") return date;
        return (
            <a href="#">
                {date.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                        {line}
                        {index < date.split('\n').length - 1 && <br />}
                    </React.Fragment>
                ))}
            </a>
        );
    };

    return (
        <div className="main-container">
                <div className="main-contents">
                    <div className="contents-tit inner-btn">
                        <button
                            type="button"
                            className="btn primary large"
                            onClick={onNewRegistration}
                        >
                            신규등록
                        </button>
                        <h2>공약 선택 현황</h2>
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
                                {tableData.map((row) => (
                                    <tr
                                        key={row.no}
                                        className={selectedRow === row.no ? 'active' : ''}
                                        onClick={() => handleRowClick(row.no)}
                                    >
                                        <td>{row.no}</td>
                                        <td>{row.group}</td>
                                        <td>{row.name}</td>
                                        <td>{renderDateCell(row.startDate)}</td>
                                        <td>{renderDateCell(row.endDate)}</td>
                                        <td>{renderStatusBadge(row.status, row.statusType)}</td>
                                        <td>
                                            {row.group ? (
                                                <button
                                                    type="button"
                                                    className="btn-excel"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onExcelDownload?.(row.no);
                                                    }}
                                                    title="엑셀 다운로드"
                                                />
                                            ) : '-'}
                                        </td>
                                        <td>
                                            {row.group && (
                                                <button
                                                    type="button"
                                                    className="btn small kakao"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onKakaoSend?.(row.no);
                                                    }}
                                                >
                                                    발송
                                                </button>
                                            )}
                                        </td>
                                        <td>
                                            {row.statusType === 'active' && row.isPublic ? '공개 중' :
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
                                            ) : ''}
                                        </td>
                                        <td>
                                            {row.hasReportDownload ? (
                                                <button
                                                    type="button"
                                                    className="btn-file"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onReportDownload?.(row.no);
                                                    }}
                                                    title="보고서 다운로드"
                                                />
                                            ) : (row.statusType === 'end' ? '-' : '')}
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
        </div>
    );
};