import React from 'react';
import type { ServerConfig } from '../../types';
import './Toolbar.css';

interface ToolbarProps {
    currentPath: string;
    viewMode: 'list' | 'icons';
    canGoUp: boolean;
    serverConfig?: ServerConfig | null;
    selectedFiles?: string[]; // 선택된 파일들
    onNavigateUp: () => void;
    onToggleViewMode: () => void;
    onRefresh: () => void;
    onCreateFolder: () => void;
    onNavigateToPath?: (path: string) => void; // 경로 클릭 네비게이션용
    onUpload?: (files: FileList) => void; // 업로드 핸들러
    onDownload?: (filePaths: string[]) => void; // 다운로드 핸들러
    onDelete?: (filePaths: string[]) => void; // 삭제 핸들러
    onRename?: (oldPath: string, newName: string) => void; // 이름변경 핸들러
}

export const Toolbar: React.FC<ToolbarProps> = ({
    currentPath,
    viewMode,
    canGoUp,
    serverConfig,
    selectedFiles = [],
    onNavigateUp,
    onToggleViewMode,
    onRefresh,
    onCreateFolder,
    onNavigateToPath,
    onUpload,
    onDownload,
    onDelete,
    onRename,
}) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [showRenameDialog, setShowRenameDialog] = React.useState(false);
    const [newName, setNewName] = React.useState('');
    const [itemToRename, setItemToRename] = React.useState<string>('');

    // 업로드 버튼 클릭 핸들러
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    // 파일 선택 핸들러
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0 && onUpload) {
            onUpload(files);
            // 파일 선택을 초기화
            event.target.value = '';
        }
    };

    // 다운로드 버튼 클릭 핸들러
    const handleDownloadClick = () => {
        if (onDownload && selectedFiles.length > 0) {
            onDownload(selectedFiles);
        }
    };

    // 삭제 버튼 클릭 핸들러
    const handleDeleteClick = () => {
        if (onDelete && selectedFiles.length > 0) {
            const confirmMessage = selectedFiles.length === 1
                ? '선택된 항목을 삭제하시겠습니까?'
                : `선택된 ${selectedFiles.length}개 항목을 삭제하시겠습니까?`;

            if (window.confirm(confirmMessage)) {
                onDelete(selectedFiles);
            }
        }
    };

    // 이름변경 버튼 클릭 핸들러
    const handleRenameClick = () => {
        if (selectedFiles.length === 1) {
            const filePath = selectedFiles[0];
            const fileName = filePath.split(/[/\\]/).pop() || '';
            setItemToRename(filePath);
            setNewName(fileName);
            setShowRenameDialog(true);
        }
    };

    // 이름변경 확인 핸들러
    const handleRenameConfirm = () => {
        if (onRename && itemToRename && newName.trim()) {
            onRename(itemToRename, newName.trim());
            setShowRenameDialog(false);
            setNewName('');
            setItemToRename('');
        }
    };

    // 이름변경 취소 핸들러
    const handleRenameCancel = () => {
        setShowRenameDialog(false);
        setNewName('');
        setItemToRename('');
    };

    // 경로를 올바르게 파싱하여 breadcrumb용 세그먼트 생성
    const pathSegments = React.useMemo(() => {
        if (!currentPath) return [];

        console.log('Current path for breadcrumb:', currentPath);

        if (currentPath.includes('\\')) {
            // Windows 경로 처리
            const parts = currentPath.split('\\').filter(part => part !== '');
            console.log('Windows path parts:', parts);
            return parts;
        } else {
            // Unix 경로 처리
            const parts = currentPath.split('/').filter(part => part !== '');
            console.log('Unix path parts:', parts);
            return parts;
        }
    }, [currentPath]);

    // 특정 세그먼트까지의 경로 생성
    const getPathUpToSegment = (segmentIndex: number): string => {
        if (!currentPath) return '';

        const isWindowsPath = currentPath.includes('\\');

        if (isWindowsPath) {
            // Windows 경로 처리
            // 현재 경로를 정규화하여 세그먼트 추출
            const pathParts = currentPath.split('\\').filter(part => part !== '');
            const targetParts = pathParts.slice(0, segmentIndex + 1);

            let path = targetParts.join('\\');

            // 드라이브 루트가 아닌 경우 시작에 백슬래시가 없으면 추가
            if (targetParts.length > 0 && !path.match(/^[A-Z]:/)) {
                // 첫 번째 부분이 드라이브가 아니면 원래 경로의 드라이브 부분 유지
                const driveMatch = currentPath.match(/^([A-Z]:\\)/);
                if (driveMatch) {
                    path = driveMatch[1] + path;
                } else {
                    path = '\\' + path;
                }
            }

            // 드라이브 루트인 경우 백슬래시 보장
            if (targetParts.length === 1 && targetParts[0].match(/^[A-Z]:$/)) {
                path += '\\';
            }

            console.log('Windows breadcrumb - currentPath:', currentPath, 'targetParts:', targetParts, 'result:', path);
            return path;
        } else {
            // Unix 경로 처리
            const pathParts = currentPath.split('/').filter(part => part !== '');
            const targetParts = pathParts.slice(0, segmentIndex + 1);
            const path = '/' + targetParts.join('/');

            console.log('Unix breadcrumb - currentPath:', currentPath, 'targetParts:', targetParts, 'result:', path);
            return path;
        }
    };

    // 루트 클릭 핸들러
    const handleRootClick = () => {
        if (onNavigateToPath && serverConfig) {
            // 서버 설정의 rootPath 또는 첫 번째 allowedPath 사용
            let rootPath = serverConfig.rootPath;

            // rootPath가 없으면 allowedPaths의 첫 번째 경로 사용
            if (!rootPath && serverConfig.allowedPaths && serverConfig.allowedPaths.length > 0) {
                rootPath = serverConfig.allowedPaths[0];
            }

            // 그래도 없으면 현재 경로 기반으로 추정
            if (!rootPath) {
                const isWindowsPath = currentPath && currentPath.includes('\\');
                rootPath = isWindowsPath ? 'C:\\' : '/';
            }

            onNavigateToPath(rootPath);
        }
    };

    // 세그먼트 클릭 핸들러
    const handleSegmentClick = (segmentIndex: number) => {
        if (onNavigateToPath) {
            const targetPath = getPathUpToSegment(segmentIndex);
            console.log('Breadcrumb clicked - segmentIndex:', segmentIndex, 'targetPath:', targetPath);
            onNavigateToPath(targetPath);
        }
    };

    return (
        <div className="toolbar">
            <div className="toolbar-left">
                <button
                    className={`toolbar-button ${!canGoUp ? 'disabled' : ''}`}
                    onClick={onNavigateUp}
                    disabled={!canGoUp}
                    title="상위 폴더로"
                >
                    ⬆️
                </button>

                <button
                    className="toolbar-button"
                    onClick={onRefresh}
                    title="새로고침"
                >
                    🔄
                </button>

                <button
                    className="toolbar-button"
                    onClick={onCreateFolder}
                    title="새 폴더"
                >
                    📁➕
                </button>

                <button
                    className="toolbar-button"
                    onClick={handleUploadClick}
                    title="파일 업로드"
                >
                    📤
                </button>

                <button
                    className={`toolbar-button ${selectedFiles.length === 0 ? 'disabled' : ''}`}
                    onClick={handleDownloadClick}
                    disabled={selectedFiles.length === 0}
                    title={selectedFiles.length === 0 ? "다운로드할 파일을 선택하세요" : `${selectedFiles.length}개 파일 다운로드`}
                >
                    📥
                </button>

                <button
                    className={`toolbar-button ${selectedFiles.length === 0 ? 'disabled' : ''}`}
                    onClick={handleDeleteClick}
                    disabled={selectedFiles.length === 0}
                    title={selectedFiles.length === 0 ? "삭제할 항목을 선택하세요" : `${selectedFiles.length}개 항목 삭제`}
                >
                    🗑️
                </button>

                <button
                    className={`toolbar-button ${selectedFiles.length !== 1 ? 'disabled' : ''}`}
                    onClick={handleRenameClick}
                    disabled={selectedFiles.length !== 1}
                    title={selectedFiles.length !== 1 ? "이름을 변경할 항목을 하나만 선택하세요" : "이름 변경"}
                >
                    ✏️
                </button>

                {/* 숨겨진 파일 입력 */}
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                />
            </div>

            <div className="toolbar-center">
                <div className="breadcrumb">
                    <span
                        className={`breadcrumb-item root ${onNavigateToPath ? 'clickable' : ''}`}
                        title="루트로 이동"
                        onClick={onNavigateToPath ? handleRootClick : undefined}
                        style={onNavigateToPath ? { cursor: 'pointer' } : undefined}
                    >
                        🏠
                    </span>
                    {pathSegments.map((segment, index) => (
                        <React.Fragment key={index}>
                            <span className="breadcrumb-separator">/</span>
                            <span
                                className={`breadcrumb-item ${onNavigateToPath ? 'clickable' : ''}`}
                                title={segment}
                                onClick={() => onNavigateToPath && handleSegmentClick(index)}
                                style={onNavigateToPath ? { cursor: 'pointer' } : undefined}
                            >
                                {segment}
                            </span>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="toolbar-right">
                <button
                    className={`toolbar-button view-toggle ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={onToggleViewMode}
                    title="리스트 보기"
                >
                    📋
                </button>

                <button
                    className={`toolbar-button view-toggle ${viewMode === 'icons' ? 'active' : ''}`}
                    onClick={onToggleViewMode}
                    title="아이콘 보기"
                >
                    🔲
                </button>
            </div>

            {/* 이름변경 다이얼로그 */}
            {showRenameDialog && (
                <div className="dialog-overlay">
                    <div className="dialog">
                        <div className="dialog-header">
                            <h3>이름 변경</h3>
                        </div>
                        <div className="dialog-content">
                            <label htmlFor="newName">새 이름:</label>
                            <input
                                id="newName"
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleRenameConfirm();
                                    } else if (e.key === 'Escape') {
                                        handleRenameCancel();
                                    }
                                }}
                                autoFocus
                            />
                        </div>
                        <div className="dialog-actions">
                            <button
                                className="dialog-button-cancel"
                                onClick={handleRenameCancel}
                            >
                                취소
                            </button>
                            <button
                                className="dialog-button-confirm"
                                onClick={handleRenameConfirm}
                                disabled={!newName.trim()}
                            >
                                변경
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
