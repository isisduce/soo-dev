import React, { useState, useRef, useCallback, useEffect } from 'react';
import { FileSystemProvider } from '../../context/FileSystemContext';
import { useFileSystemActions } from '../../hooks/useFileSystemActions';
import { SidebarNavigation } from '../SidebarNavigation/SidebarNavigation';
import { FileList } from '../FileList/FileList';
import { Toolbar } from '../Toolbar/Toolbar';
import type { FileItem, DirectoryItem } from '../../types';
import { FileSystemAPI } from '../../services/FileSystemAPI';
import './ExplorerDialog.css';

interface ExplorerDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onFocus?: () => void; // 다이얼로그 포커스 핸들러
    version: 'current' | 'previous';
    title: string;
    dialogId?: string; // 다이얼로그 고유 ID 추가
    zIndex?: number; // z-index 제어
}

const ExplorerDialogContent: React.FC<{ version: 'current' | 'previous' }> = ({ version }) => {
    const {
        currentPath,
        directories,
        currentDirectories,
        files,
        selectedItems,
        viewMode,
        loading,
        error,
        serverConfig,
        loadServerConfig,
        loadDirectoryContents,
        loadDirectoryTree,
        navigateToDirectory,
        navigateUp,
        toggleDirectory,
        selectItem,
        clearSelection,
        selectMultipleItems,
        selectRange,
        toggleViewMode,
    } = useFileSystemActions();

    const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [sidebarWidth, setSidebarWidth] = useState(300);
    const [isResizing, setIsResizing] = useState(false);
    const [scrollToTreeItem, setScrollToTreeItem] = useState(false);

    // 드래그 앤 드롭 상태
    const [isDragOver, setIsDragOver] = useState(false);
    const [dragCounter, setDragCounter] = useState(0);

    const sidebarRef = useRef<HTMLDivElement>(null);
    const currentPathRef = useRef<string>(currentPath);

    // currentPath가 변경될 때마다 ref 업데이트
    useEffect(() => {
        currentPathRef.current = currentPath;
    }, [currentPath]);

    useEffect(() => {
        loadServerConfig();
    }, [loadServerConfig]);

    // 파일 시스템 변경 이벤트 리스너
    useEffect(() => {
        const handleFileSystemChange = (event: CustomEvent) => {
            const { changedPath, action } = event.detail;
            const currentPath = currentPathRef.current;

            // 경로 정규화 함수
            const normalizePathSeparator = (path: string) => path.replace(/\\/g, '/');
            const normalizedChangedPath = normalizePathSeparator(changedPath);
            const normalizedCurrentPath = normalizePathSeparator(currentPath);

            console.log('Dialog - File system changed:', {
                changedPath: normalizedChangedPath,
                action,
                currentPath: normalizedCurrentPath,
                dialogId: version
            });

            // 항상 전체 트리를 새로고침
            loadDirectoryTree();

            // 변경된 경로가 현재 경로와 일치하면 현재 디렉토리도 새로고침
            if (normalizedChangedPath === normalizedCurrentPath) {
                console.log('Refreshing current directory:', normalizedCurrentPath, 'in dialog:', version);
                loadDirectoryContents(currentPath);
            }

            // 지연된 이벤트의 경우 강제로 한 번 더 새로고침
            if (action === 'move-delayed' && normalizedChangedPath === normalizedCurrentPath) {
                console.log('Processing delayed refresh for:', normalizedCurrentPath, 'in dialog:', version);
                setTimeout(() => {
                    console.log('Executing delayed refresh for:', normalizedCurrentPath, 'in dialog:', version);
                    loadDirectoryContents(currentPath);
                }, 50);
            }
        };

        window.addEventListener('fileSystemChanged', handleFileSystemChange as EventListener);

        return () => {
            window.removeEventListener('fileSystemChanged', handleFileSystemChange as EventListener);
        };
    }, [loadDirectoryContents, loadDirectoryTree, version]);

    useEffect(() => {
        if (serverConfig) {
            loadDirectoryTree();
            loadDirectoryContents(serverConfig.rootPath || 'C:\\');
        }
    }, [serverConfig, loadDirectoryTree, loadDirectoryContents]);

    const handlePathChange = useCallback((path: string) => {
        navigateToDirectory(path);
        setScrollToTreeItem(true);
    }, [navigateToDirectory]);

    const handleTreeNavigation = useCallback((path: string) => {
        navigateToDirectory(path);
    }, [navigateToDirectory]);

    const handleFileClick = useCallback((file: FileItem) => {
        // 기존 선택을 모두 해제하고 현재 파일만 선택 (메인 화면과 동일한 동작)
        clearSelection();
        selectItem(file.id);
    }, [selectItem, clearSelection]);

    const handleFileDoubleClick = useCallback((file: FileItem) => {
        // 파일 더블클릭 처리 (필요시 구현)
    }, []);

    const handleDirectoryClick = useCallback((directory: DirectoryItem) => {
        // 기존 선택을 모두 해제하고 현재 디렉토리만 선택 (메인 화면과 동일한 동작)
        clearSelection();
        selectItem(directory.id);
    }, [selectItem, clearSelection]);

    const handleDirectoryDoubleClick = useCallback((directory: DirectoryItem) => {
        navigateToDirectory(directory.path);
        setScrollToTreeItem(true);
    }, [navigateToDirectory]);

    const handleCreateFolder = useCallback(async () => {
        if (!newFolderName.trim()) return;

        try {
            console.log('Creating directory in dialog:', {
                parentPath: currentPath,
                directoryName: newFolderName.trim()
            });
            await FileSystemAPI.createDirectory(currentPath, newFolderName.trim());
            await loadDirectoryContents(currentPath);
            await loadDirectoryTree();
            setShowCreateFolderDialog(false);
            setNewFolderName('');
        } catch (error) {
            console.error('Failed to create folder:', error);
        }
    }, [newFolderName, currentPath, loadDirectoryContents, loadDirectoryTree]);

    // 파일 업로드 핸들러
    const handleUpload = useCallback(async (files: FileList) => {
        try {
            const result = await FileSystemAPI.uploadFiles(currentPath, files);
            if (result.success) {
                // 성공 시 현재 디렉토리 새로고침
                await loadDirectoryContents(currentPath);
                alert(result.data?.message || '파일이 성공적으로 업로드되었습니다.');
            } else {
                alert('파일 업로드에 실패했습니다: ' + (result.error || '알 수 없는 오류'));
            }
        } catch (error) {
            console.error('Failed to upload files:', error);
            alert('파일 업로드 중 오류가 발생했습니다.');
        }
    }, [currentPath, loadDirectoryContents]);

    // 드래그 앤 드롭 핸들러들
    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter(prev => prev + 1);
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragOver(true);
        }
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter(prev => {
            const newCount = prev - 1;
            if (newCount === 0) {
                setIsDragOver(false);
            }
            return newCount;
        });
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        setDragCounter(0);

        // 파일 업로드 처리
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            await handleUpload(files);
            return;
        }

        // 파일 이동 처리
        try {
            const dragData = e.dataTransfer.getData('application/json');
            if (dragData) {
                const data = JSON.parse(dragData);
                if (data.type === 'file-move') {
                    const sourceItem = data.sourceItem;
                    const sourcePath = data.sourcePath;

                    // 같은 경로로의 이동인지 확인
                    const normalizePathSeparator = (path: string) => path.replace(/\\/g, '/');
                    const sourceDirNormalized = normalizePathSeparator(sourcePath);
                    const sourceDir = sourceDirNormalized.substring(0, sourceDirNormalized.lastIndexOf('/')) || '/';
                    const currentPathNormalized = normalizePathSeparator(currentPath);

                    if (sourceDir === currentPathNormalized) {
                        console.log('Same directory, no move needed');
                        return;
                    }

                    // 파일/폴더 이동 처리
                    const fileName = sourceItem.name;
                    const targetPath = currentPath === '/' ? `/${fileName}` : `${currentPath}/${fileName}`;

                    console.log('Moving file:', { from: sourcePath, to: targetPath, sourceDir, currentPath });

                    try {
                        const result = await FileSystemAPI.moveItem(sourcePath, targetPath);
                        if (result.success) {
                            // 이동된 파일의 선택 해제
                            clearSelection();

                            console.log('File moved successfully:', { sourceDir, currentPath });

                            // 성공 시 전체 디렉토리 트리와 현재 디렉토리 새로고침
                            await loadDirectoryTree();
                            await loadDirectoryContents(currentPath);

                            // 원본 폴더에 대한 이벤트 발생 (다이얼로그 간 이동 시 중요)
                            console.log('Dispatching move event for source directory:', sourceDir);
                            window.dispatchEvent(new CustomEvent('fileSystemChanged', {
                                detail: { changedPath: sourceDir, action: 'move' }
                            }));

                            // 대상 폴더에 대한 이벤트도 발생 (현재 폴더가 대상)
                            if (sourceDir !== currentPathNormalized) {
                                console.log('Dispatching move event for target directory:', currentPathNormalized);
                                window.dispatchEvent(new CustomEvent('fileSystemChanged', {
                                    detail: { changedPath: currentPathNormalized, action: 'move' }
                                }));
                            }

                            // 약간의 지연 후 한 번 더 새로고침 (확실하게)
                            setTimeout(() => {
                                console.log('Dispatching delayed move events');
                                window.dispatchEvent(new CustomEvent('fileSystemChanged', {
                                    detail: { changedPath: sourceDir, action: 'move-delayed' }
                                }));
                                if (sourceDir !== currentPathNormalized) {
                                    window.dispatchEvent(new CustomEvent('fileSystemChanged', {
                                        detail: { changedPath: currentPathNormalized, action: 'move-delayed' }
                                    }));
                                }
                            }, 100);

                            alert('파일이 성공적으로 이동되었습니다.');
                        } else {
                            alert('파일 이동에 실패했습니다: ' + (result.error || '알 수 없는 오류'));
                        }
                    } catch (error) {
                        console.error('Failed to move file:', error);
                        alert('파일 이동 중 오류가 발생했습니다.');
                    }
                }
            }
        } catch (error) {
            console.error('Failed to parse drag data:', error);
        }
    }, [handleUpload, currentPath]);

    // 파일 다운로드 핸들러
    const handleDownload = useCallback(async (filePaths: string[]) => {
        try {
            const result = await FileSystemAPI.downloadFiles(filePaths);
            if (result.success) {
                // 다운로드 성공 메시지는 브라우저에서 자동으로 표시
                console.log('Files downloaded successfully');
            } else {
                alert('파일 다운로드에 실패했습니다: ' + (result.error || '알 수 없는 오류'));
            }
        } catch (error) {
            console.error('Failed to download files:', error);
            alert('파일 다운로드 중 오류가 발생했습니다.');
        }
    }, []);

    // 파일/폴더 삭제 핸들러
    const handleDelete = useCallback(async (filePaths: string[]) => {
        try {
            const result = await FileSystemAPI.deleteItems(filePaths);
            if (result.success) {
                // 성공 시 현재 디렉토리 새로고침
                await loadDirectoryContents(currentPath);
                await loadDirectoryTree();
                alert(result.data?.message || '선택된 항목이 삭제되었습니다.');
            } else {
                alert('항목 삭제에 실패했습니다: ' + (result.error || '알 수 없는 오류'));
            }
        } catch (error) {
            console.error('Failed to delete items:', error);
            alert('항목 삭제 중 오류가 발생했습니다.');
        }
    }, [currentPath, loadDirectoryContents, loadDirectoryTree]);

    // 파일/폴더 이름변경 핸들러
    const handleRename = useCallback(async (oldPath: string, newName: string) => {
        try {
            const result = await FileSystemAPI.renameItem(oldPath, newName);
            if (result.success) {
                // 성공 시 현재 디렉토리 새로고침
                await loadDirectoryContents(currentPath);
                await loadDirectoryTree();
                alert('이름이 성공적으로 변경되었습니다.');
            } else {
                alert('이름 변경에 실패했습니다: ' + (result.error || '알 수 없는 오류'));
            }
        } catch (error) {
            console.error('Failed to rename item:', error);
            alert('이름 변경 중 오류가 발생했습니다.');
        }
    }, [currentPath, loadDirectoryContents, loadDirectoryTree]);

    const handleSidebarResize = useCallback((e: MouseEvent) => {
        if (!isResizing || !sidebarRef.current) return;

        const containerRect = sidebarRef.current.parentElement?.getBoundingClientRect();
        if (!containerRect) return;

        const newWidth = e.clientX - containerRect.left;
        const minWidth = 150;
        const maxWidth = containerRect.width * 0.6;

        setSidebarWidth(Math.min(Math.max(newWidth, minWidth), maxWidth));
    }, [isResizing]);

    const handleSidebarResizeStart = useCallback(() => {
        setIsResizing(true);
    }, []);

    const handleSidebarResizeEnd = useCallback(() => {
        setIsResizing(false);
    }, []);

    useEffect(() => {
        if (isResizing) {
            document.addEventListener('mousemove', handleSidebarResize);
            document.addEventListener('mouseup', handleSidebarResizeEnd);
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';

            return () => {
                document.removeEventListener('mousemove', handleSidebarResize);
                document.removeEventListener('mouseup', handleSidebarResizeEnd);
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            };
        }
    }, [isResizing, handleSidebarResize, handleSidebarResizeEnd]);

    if (loading && !directories.length) {
        return (
            <div className="webexplorer-loading">
                <div className="loading-spinner">🔄</div>
                <div className="loading-text">파일 시스템을 로드하는 중...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="webexplorer-error">
                <div className="error-icon">⚠️</div>
                <div className="error-message">{error}</div>
                <button className="error-retry" onClick={loadServerConfig}>
                    다시 시도
                </button>
            </div>
        );
    }

    return (
        <div className={`web-filesystem-dialog ${version} ${isDragOver ? 'drag-over' : ''}`}>
            {/* 드래그 앤 드롭 오버레이 */}
            {isDragOver && (
                <div className="drag-overlay">
                    <div className="drag-overlay-content">
                        <div className="drag-icon">📁</div>
                        <div className="drag-text">파일을 여기에 드롭하여 업로드</div>
                        <div className="drag-path">현재 경로: {currentPath}</div>
                    </div>
                </div>
            )}
            <div
                className="webexplorer-content"
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <div
                    ref={sidebarRef}
                    className="webexplorer-sidebar"
                    style={{ width: sidebarWidth }}
                >
                    <SidebarNavigation
                        serverConfig={serverConfig}
                        directories={directories}
                        currentPath={currentPath}
                        onPathSelect={handleTreeNavigation}
                        onDirectoryClick={handleTreeNavigation}
                        onDirectoryToggle={toggleDirectory}
                        scrollToTreeItem={scrollToTreeItem}
                    />
                    <div
                        className="sidebar-resize-handle"
                        onMouseDown={handleSidebarResizeStart}
                    />
                </div>
                <div className="webexplorer-main">
                    <Toolbar
                        currentPath={currentPath}
                        viewMode={viewMode}
                        canGoUp={currentPath !== serverConfig?.rootPath}
                        serverConfig={serverConfig}
                        selectedFiles={selectedItems}
                        onNavigateUp={navigateUp}
                        onToggleViewMode={toggleViewMode}
                        onCreateFolder={() => setShowCreateFolderDialog(true)}
                        onRefresh={() => loadDirectoryContents(currentPath)}
                        onNavigateToPath={handlePathChange}
                        onUpload={handleUpload}
                        onDownload={handleDownload}
                        onDelete={handleDelete}
                        onRename={handleRename}
                    />
                    <FileList
                        files={files}
                        directories={currentDirectories}
                        selectedItems={selectedItems}
                        viewMode={viewMode}
                        onFileClick={handleFileClick}
                        onFileDoubleClick={handleFileDoubleClick}
                        onDirectoryClick={handleDirectoryClick}
                        onDirectoryDoubleClick={handleDirectoryDoubleClick}
                        onFileSelect={selectItem}
                        onMultiSelect={selectMultipleItems}
                        onRangeSelect={selectRange}
                        onClearSelection={clearSelection}
                    />
                </div>
            </div>

            {showCreateFolderDialog && (
                <div className="dialog-overlay">
                    <div className="dialog">
                        <div className="dialog-header">
                            <h3>새 폴더 만들기</h3>
                        </div>
                        <div className="dialog-content">
                            <label htmlFor="folderName">폴더 이름:</label>
                            <input
                                id="folderName"
                                type="text"
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleCreateFolder();
                                    }
                                }}
                                autoFocus
                            />
                        </div>
                        <div className="dialog-actions">
                            <button
                                className="dialog-button-cancel"
                                onClick={() => {
                                    setShowCreateFolderDialog(false);
                                    setNewFolderName('');
                                }}
                            >
                                취소
                            </button>
                            <button
                                className="dialog-button-confirm"
                                onClick={handleCreateFolder}
                                disabled={!newFolderName.trim()}
                            >
                                만들기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const ExplorerDialog: React.FC<ExplorerDialogProps> = ({
    isOpen,
    onClose,
    onFocus,
    version,
    title,
    dialogId = 'default',
    zIndex = 1000
}) => {
    // 다이얼로그 ID를 기반으로 한 위치 오프셋 계산
    const getInitialPosition = () => {
        const dialogNumber = parseInt(dialogId.split('-')[1]) || 1;
        const offset = (dialogNumber - 1) * 50; // 각 다이얼로그마다 50px씩 오프셋

        return version === 'current'
            ? { x: 100 + offset, y: 100 + offset }
            : { x: 150 + offset, y: 150 + offset };
    };

    const [position, setPosition] = useState(getInitialPosition());
    const [size, setSize] = useState({ width: 1000, height: 700 });
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeDirection, setResizeDirection] = useState<string>('');
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [resizeStart, setResizeStart] = useState({
        x: 0, y: 0, width: 0, height: 0, startX: 0, startY: 0
    });
    const [isMaximized, setIsMaximized] = useState(false);
    const [previousState, setPreviousState] = useState({
        position: { x: 100, y: 100 },
        size: { width: 1000, height: 700 }
    });

    const dialogRef = useRef<HTMLDivElement>(null);

    // 다이얼로그가 열릴 때 초기 위치 재설정
    useEffect(() => {
        if (isOpen) {
            setPosition(getInitialPosition());
        }
    }, [isOpen, version, dialogId]);

    // 드래그 시작
    const handleDragStart = useCallback((e: React.MouseEvent) => {
        if (isMaximized) return;

        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
    }, [position, isMaximized]);

    // 드래그 중
    const handleDrag = useCallback((e: MouseEvent) => {
        if (!isDragging || isMaximized) return;

        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;

        // 화면 경계 제한
        const maxX = window.innerWidth - 300; // 최소 300px은 보이도록
        const maxY = window.innerHeight - 100; // 최소 100px은 보이도록

        setPosition({
            x: Math.max(0, Math.min(newX, maxX)),
            y: Math.max(0, Math.min(newY, maxY))
        });
    }, [isDragging, dragStart, isMaximized]);

    // 드래그 종료
    const handleDragEnd = useCallback(() => {
        setIsDragging(false);
    }, []);

    // 리사이즈 시작
    const handleResizeStart = useCallback((e: React.MouseEvent, direction: string) => {
        e.stopPropagation();
        if (isMaximized) return;

        setIsResizing(true);
        setResizeDirection(direction);
        setResizeStart({
            x: position.x,
            y: position.y,
            width: size.width,
            height: size.height,
            startX: e.clientX,
            startY: e.clientY
        });
    }, [position, size, isMaximized]);

    // 리사이즈 중
    const handleResize = useCallback((e: MouseEvent) => {
        if (!isResizing || isMaximized) return;

        const deltaX = e.clientX - resizeStart.startX;
        const deltaY = e.clientY - resizeStart.startY;

        let newX = resizeStart.x;
        let newY = resizeStart.y;
        let newWidth = resizeStart.width;
        let newHeight = resizeStart.height;

        // 최소/최대 크기
        const minWidth = 400;
        const minHeight = 300;
        const maxWidth = window.innerWidth;
        const maxHeight = window.innerHeight;

        if (resizeDirection.includes('e')) {
            newWidth = Math.max(minWidth, Math.min(resizeStart.width + deltaX, maxWidth));
        }
        if (resizeDirection.includes('w')) {
            const proposedWidth = resizeStart.width - deltaX;
            if (proposedWidth >= minWidth) {
                newWidth = proposedWidth;
                newX = resizeStart.x + deltaX;
            }
        }
        if (resizeDirection.includes('s')) {
            newHeight = Math.max(minHeight, Math.min(resizeStart.height + deltaY, maxHeight));
        }
        if (resizeDirection.includes('n')) {
            const proposedHeight = resizeStart.height - deltaY;
            if (proposedHeight >= minHeight) {
                newHeight = proposedHeight;
                newY = resizeStart.y + deltaY;
            }
        }

        setPosition({ x: newX, y: newY });
        setSize({ width: newWidth, height: newHeight });
    }, [isResizing, resizeDirection, resizeStart, isMaximized]);

    // 리사이즈 종료
    const handleResizeEnd = useCallback(() => {
        setIsResizing(false);
        setResizeDirection('');
    }, []);

    // 최대화/복원
    const handleMaximize = useCallback(() => {
        if (isMaximized) {
            setPosition(previousState.position);
            setSize(previousState.size);
            setIsMaximized(false);
        } else {
            setPreviousState({ position, size });
            setPosition({ x: 0, y: 0 });
            setSize({ width: window.innerWidth, height: window.innerHeight });
            setIsMaximized(true);
        }
    }, [isMaximized, position, size, previousState]);

    // 이벤트 리스너 등록
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleDrag);
            document.addEventListener('mouseup', handleDragEnd);
            document.body.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
        }

        return () => {
            document.removeEventListener('mousemove', handleDrag);
            document.removeEventListener('mouseup', handleDragEnd);
            if (isDragging) {
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            }
        };
    }, [isDragging, handleDrag, handleDragEnd]);

    useEffect(() => {
        if (isResizing) {
            document.addEventListener('mousemove', handleResize);
            document.addEventListener('mouseup', handleResizeEnd);
            document.body.style.userSelect = 'none';
        }

        return () => {
            document.removeEventListener('mousemove', handleResize);
            document.removeEventListener('mouseup', handleResizeEnd);
            if (isResizing) {
                document.body.style.userSelect = '';
            }
        };
    }, [isResizing, handleResize, handleResizeEnd]);

    if (!isOpen) return null;

    return (
        <div
            ref={dialogRef}
            className={`explorer-dialog modeless ${isMaximized ? 'maximized' : ''}`}
            style={{
                position: 'fixed',
                left: position.x,
                top: position.y,
                width: size.width,
                height: size.height,
                zIndex: zIndex,
            }}
            onMouseDown={() => onFocus?.()} // 다이얼로그 클릭시 포커스
        >
            {/* 리사이즈 핸들들 */}
            {!isMaximized && (
                <>
                    <div
                        className="resize-handle resize-handle-n"
                        onMouseDown={(e) => handleResizeStart(e, 'n')}
                    />
                    <div
                        className="resize-handle resize-handle-ne"
                        onMouseDown={(e) => handleResizeStart(e, 'ne')}
                    />
                    <div
                        className="resize-handle resize-handle-e"
                        onMouseDown={(e) => handleResizeStart(e, 'e')}
                    />
                    <div
                        className="resize-handle resize-handle-se"
                        onMouseDown={(e) => handleResizeStart(e, 'se')}
                    />
                    <div
                        className="resize-handle resize-handle-s"
                        onMouseDown={(e) => handleResizeStart(e, 's')}
                    />
                    <div
                        className="resize-handle resize-handle-sw"
                        onMouseDown={(e) => handleResizeStart(e, 'sw')}
                    />
                    <div
                        className="resize-handle resize-handle-w"
                        onMouseDown={(e) => handleResizeStart(e, 'w')}
                    />
                    <div
                        className="resize-handle resize-handle-nw"
                        onMouseDown={(e) => handleResizeStart(e, 'nw')}
                    />
                </>
            )}

            {/* 다이얼로그 헤더 */}
            <div
                className={`explorer-dialog-header ${isDragging ? 'dragging' : ''}`}
                onMouseDown={handleDragStart}
            >
                <h2 className="explorer-dialog-title">
                    📁 {title}
                </h2>
                <div className="explorer-dialog-controls">
                    <button
                        className="dialog-control-button maximize"
                        onClick={handleMaximize}
                        title={isMaximized ? "복원" : "최대화"}
                    >
                        {isMaximized ? "🗗" : "🗖"}
                    </button>
                    <button
                        className="dialog-control-button close"
                        onClick={onClose}
                        title="닫기"
                    >
                        ✕
                    </button>
                </div>
            </div>

            {/* 다이얼로그 콘텐츠 */}
            <div className="explorer-dialog-content">
                <FileSystemProvider>
                    <ExplorerDialogContent version={version} />
                </FileSystemProvider>
            </div>
        </div>
    );
};
