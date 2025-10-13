import React, { useState, useRef } from 'react';
import '../styles/css/reset.css';
import '../styles/css/font.css';
import '../styles/css/common.css';
import '../styles/css/main.css';

// npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

interface PledgeData {
    id: number;
    text: string;
    characterCount: number;
}

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

interface PromiseMainProps {
    onLogout?: () => void;
    onUserSetting?: () => void;
    onNewRegistration?: () => void;
    onFileUpload?: (file: File) => void;
    onDateSetting?: () => void;
    onTempSave?: (formData: any) => void;
    onPreview?: (formData: any) => void;
    onRegisterComplete?: (formData: any) => void;
    onPublishToMobile?: (formData: any) => void;
    onExcelDownload?: (rowNo: number) => void;
    onKakaoSend?: (rowNo: number) => void;
    onPublish?: (rowNo: number) => void;
    onReportDownload?: (rowNo: number) => void;
    // onPledgeReorder?: (newOrder: PledgeData[]) => void;
    tableData?: TableRowData[];
}

export const PromiseMain: React.FC<PromiseMainProps> = ({
    onLogout,
    onUserSetting,
    onNewRegistration,
    onFileUpload,
    onDateSetting,
    onTempSave,
    onPreview,
    onRegisterComplete,
    onPublishToMobile,
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

    const [pledges, setPledges] = useState<PledgeData[]>([
        { id: 1, text: '', characterCount: 0 },
        { id: 2, text: '', characterCount: 0 },
        { id: 3, text: '', characterCount: 0 },
        { id: 4, text: '', characterCount: 0 },
        { id: 5, text: '', characterCount: 0 },
    ]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (field: string, value: string) => {
        if ((field === 'group' || field === 'name') && value.length > 20) {
            return; // 20자 제한
        }
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePledgeChange = (id: number, newText: string) => {
        if (newText.length <= 40) {
            setPledges(prev =>
                prev.map(pledge =>
                    pledge.id === id
                        ? { ...pledge, text: newText, characterCount: newText.length }
                        : pledge
                )
            );
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setFormData(prev => ({ ...prev, photo: result }));
            };
            reader.readAsDataURL(file);
            onFileUpload?.(file);
        }
    };

    const handleRowClick = (rowNo: number) => {
        setSelectedRow(rowNo);
    };

    const getFormDataForSubmit = () => ({
        ...formData,
        pledges: pledges
    });

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
            <header>
                <a href="#" className="logo">
                    <img src="../style/images/header-logo.svg" alt="Cool Move" />
                </a>
                <div>
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
                        className="logout btn circle"
                        onClick={onLogout}
                        title="로그아웃"
                    />
                    <button
                        type="button"
                        className="user-setting btn circle"
                        onClick={onUserSetting}
                        title="회원정보관리"
                    />
                </div>
            </header>
            <section>
                <div className="side-contents">
                    <div className="contents-tit">
                        <h2>공약 등록</h2>
                    </div>
                    <div className="contents-input-group">
                        <div>
                            <div className="input-group01">
                                <div>
                                    <label>소속</label>
                                    <input
                                        type="text"
                                        placeholder="20자 이내"
                                        value={formData.group}
                                        onChange={(e) => handleInputChange('group', e.target.value)}
                                        maxLength={20}
                                    />
                                </div>
                                <div>
                                    <label>이름</label>
                                    <input
                                        type="text"
                                        placeholder="20자 이내"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        maxLength={20}
                                    />
                                </div>
                                <div className="flex-top">
                                    <label>사진</label>
                                    <div className="candidate-upload-area">
                                        {formData.photo ? (
                                            <img src={formData.photo} alt="candidate" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <span>000px×000px</span>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        className="btn outline small"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        파일
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={handleFileUpload}
                                        aria-label="후보자 사진 업로드"
                                    />
                                </div>
                            </div>
                            <div className="input-group02">
                                <label>공개기간</label>
                                <div>
                                    <div>
                                        <input
                                            type="text"
                                            value={formData.startDate}
                                            onChange={(e) => handleInputChange('startDate', e.target.value)}
                                            placeholder="YYYY.MM.DD HH:MM"
                                        />
                                        <button
                                            type="button"
                                            className="btn outline small"
                                            onClick={onDateSetting}
                                        >
                                            설정
                                        </button>
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            value={formData.endDate}
                                            onChange={(e) => handleInputChange('endDate', e.target.value)}
                                            placeholder="YYYY.MM.DD HH:MM"
                                        />
                                        <button
                                            type="button"
                                            className="btn outline small"
                                            onClick={onDateSetting}
                                        >
                                            설정
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="input-group03">
                                <label>공약 입력</label>
                                <span>
                                    <p>
                                        공약 5개를 입력할 수 있습니다.<br />
                                        <em></em>아이콘을 움직여 순서를 변경할 수 있습니다.
                                    </p>
                                </span>
                                <div className="promise-input-area">
                                    {pledges.map((pledge) => (
                                        <div key={pledge.id}>
                                            <div>
                                                <textarea
                                                    maxLength={40}
                                                    placeholder="공약을 40자 이내로 입력해 주세요."
                                                    value={pledge.text}
                                                    onChange={(e) => handlePledgeChange(pledge.id, e.target.value)}
                                                />
                                                <span>
                                                    <em>{pledge.characterCount}</em>/40
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                className="btn-list"
                                                onClick={() => {}}
                                                title="공약 이동"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="contents-btn-area">
                        <span>'공개'를 선택해야 화면에 노출됩니다.</span>
                        <div className="btn-group">
                            <div>
                                <button
                                    type="button"
                                    className="btn outline large"
                                    onClick={() => onTempSave?.(getFormDataForSubmit())}
                                >
                                    임시저장
                                </button>
                                <button
                                    type="button"
                                    className="btn outline large"
                                    onClick={() => onPreview?.(getFormDataForSubmit())}
                                >
                                    미리보기
                                </button>
                                <button
                                    type="button"
                                    className="btn secondary large"
                                    onClick={() => onRegisterComplete?.(getFormDataForSubmit())}
                                >
                                    등록완료
                                </button>
                            </div>
                            <button
                                type="button"
                                className="btn primary large"
                                onClick={() => onPublishToMobile?.(getFormDataForSubmit())}
                            >
                                스마트폰에 공개
                            </button>
                        </div>
                    </div>
                </div>
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
            </section>
        </div>
    );
};