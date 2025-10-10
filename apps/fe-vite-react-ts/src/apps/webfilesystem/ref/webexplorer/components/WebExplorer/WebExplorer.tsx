import React, { useEffect, useState, useRef, useCallback } from 'react';
import { FileSystemProvider } from '../../context/FileSystemContext';
import { useFileSystemActions } from '../../hooks/useFileSystemActions';
import { AppBar } from '../AppBar/AppBar';
import { ExplorerDialog } from '../ExplorerDialog/ExplorerDialog';
import { SidebarNavigation } from '../SidebarNavigation/SidebarNavigation';
import { FileList } from '../FileList/FileList';
import { Toolbar } from '../Toolbar/Toolbar';
import type { FileItem, DirectoryItem } from '../../types';
import { FileSystemAPI } from '../../services/FileSystemAPI';
import './WebExplorer.css';

interface WebExplorerContentProps { }

const WebExplorerContent: React.FC<WebExplorerContentProps> = () => {
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
    const [currentVersion, setCurrentVersion] = useState<'current' | 'previous'>('current');

    // 다중 다이얼로그 관리
    const [dialogs, setDialogs] = useState<Array<{
        id: string;
        version: 'current' | 'previous';
        title: string;
        isOpen: boolean;
        zIndex: number;
    }>>([]);
    const [nextDialogId, setNextDialogId] = useState(1);
    const [maxZIndex, setMaxZIndex] = useState(5000); // AppBar(10000)보다 낮게 시작

    // 드래그 앤 드롭 상태
    const [isDragOver, setIsDragOver] = useState(false);
    const [dragCounter, setDragCounter] = useState(0);

    const sidebarRef = useRef<HTMLDivElement>(null);
    const currentPathRef = useRef<string>(currentPath);

    // currentPath가 변경될 때마다 ref 업데이트
    useEffect(() => {
        currentPathRef.current = currentPath;
    }, [currentPath]);

    // 사이드바 리사이즈 핸들러
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        setIsResizing(true);
        e.preventDefault();
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isResizing) return;

        const newWidth = e.clientX;
        if (newWidth >= 150 && newWidth <= 800) {
            setSidebarWidth(newWidth);
        }
    }, [isResizing]);

    const handleMouseUp = useCallback(() => {
        setIsResizing(false);
    }, []);

    useEffect(() => {
        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';

            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            };
        }
    }, [isResizing, handleMouseMove, handleMouseUp]);

    // 전역 드래그 앤 드롭 이벤트 방지
    useEffect(() => {
        const preventDefaults = (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
        };

        const handleWindowDragOver = (e: DragEvent) => {
            e.preventDefault();
            e.dataTransfer!.dropEffect = 'copy';
        };

        const handleWindowDrop = (e: DragEvent) => {
            e.preventDefault();
        };

        // 전역 드래그 이벤트 방지
        window.addEventListener('dragenter', preventDefaults);
        window.addEventListener('dragover', handleWindowDragOver);
        window.addEventListener('dragleave', preventDefaults);
        window.addEventListener('drop', handleWindowDrop);

        return () => {
            window.removeEventListener('dragenter', preventDefaults);
            window.removeEventListener('dragover', handleWindowDragOver);
            window.removeEventListener('dragleave', preventDefaults);
            window.removeEventListener('drop', handleWindowDrop);
        };
    }, []);

    // 파일 시스템 변경 이벤트 리스너
    useEffect(() => {
        const handleFileSystemChange = (event: CustomEvent) => {
            const { changedPath, action } = event.detail;
            const currentPath = currentPathRef.current;

            // 경로 정규화 함수
            const normalizePathSeparator = (path: string) => path.replace(/\\/g, '/');
            const normalizedChangedPath = normalizePathSeparator(changedPath);
            const normalizedCurrentPath = normalizePathSeparator(currentPath);

            console.log('Main - File system changed:', {
                changedPath: normalizedChangedPath,
                action,
                currentPath: normalizedCurrentPath,
                component: 'WebExplorer'
            });

            // 항상 전체 트리를 새로고침
            loadDirectoryTree(serverConfig?.rootPath || '/', false);

            // 변경된 경로가 현재 경로와 일치하면 현재 디렉토리도 새로고침
            if (normalizedChangedPath === normalizedCurrentPath) {
                console.log('Refreshing current directory:', normalizedCurrentPath, 'in WebExplorer main');
                loadDirectoryContents(currentPath);
            }

            // 지연된 이벤트의 경우 강제로 한 번 더 새로고침
            if (action === 'move-delayed' && normalizedChangedPath === normalizedCurrentPath) {
                console.log('Processing delayed refresh for:', normalizedCurrentPath, 'in WebExplorer main');
                setTimeout(() => {
                    console.log('Executing delayed refresh for:', normalizedCurrentPath, 'in WebExplorer main');
                    loadDirectoryContents(currentPath);
                }, 50);
            }
        };

        window.addEventListener('fileSystemChanged', handleFileSystemChange as EventListener);

        return () => {
            window.removeEventListener('fileSystemChanged', handleFileSystemChange as EventListener);
        };
    }, [serverConfig, loadDirectoryContents, loadDirectoryTree]);    // 초기 데이터 로드
    useEffect(() => {
        // 서버 설정 먼저 로드
        loadServerConfig().then(async (config) => {
            if (config && config.allowedPaths && config.allowedPaths.length > 0) {
                // 첫 번째 경로는 일반 로드 (기존 트리 교체)
                await loadDirectoryTree(config.allowedPaths[0], false);

                // 나머지 경로들은 병합 모드로 순차 로드
                for (let i = 1; i < config.allowedPaths.length; i++) {
                    await loadDirectoryTree(config.allowedPaths[i], true);
                }
            }
            // 초기 경로의 파일 목록 로드
            loadDirectoryContents('/');
        });
    }, [loadServerConfig, loadDirectoryTree, loadDirectoryContents]);

    // 경로 선택 핸들러
    const handlePathSelect = async (path: string) => {
        try {
            // 선택된 경로로 이동
            navigateToDirectory(path);
            // 선택된 경로의 내용만 로드 (트리는 다시 로드하지 않음)
            await loadDirectoryContents(path);
        } catch (error) {
            console.error('Failed to navigate to path:', error);
        }
    };

    // 디렉토리 클릭 핸들러 (단일 선택)
    const handleDirectoryClick = (directory: DirectoryItem) => {
        // 기존 선택을 모두 해제하고 현재 디렉토리만 선택
        clearSelection();
        selectItem(directory.id);
    };

    // 디렉토리 더블클릭 핸들러 (폴더 열기)
    const handleDirectoryDoubleClick = (directory: DirectoryItem) => {
        navigateToDirectory(directory.path);
    };

    // 파일 클릭 핸들러 (단일 선택)
    const handleFileClick = (file: FileItem) => {
        // 기존 선택을 모두 해제하고 현재 파일만 선택
        clearSelection();
        selectItem(file.id);
    };

    // 파일 더블클릭 핸들러 (다운로드 또는 미리보기)
    const handleFileDoubleClick = async (file: FileItem) => {
        console.log('File double clicked:', file);
        try {
            await FileSystemAPI.downloadFiles([file.path]);
        } catch (error) {
            console.error('Failed to download file:', error);
            alert('파일 다운로드에 실패했습니다.');
        }
    };

    // 새 폴더 생성
    const handleCreateFolder = () => {
        setShowCreateFolderDialog(true);
        setNewFolderName('새 폴더');
    };

    // 파일 업로드 핸들러
    const handleUpload = async (files: FileList) => {
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
    };

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
                            await loadDirectoryTree(serverConfig?.rootPath || '/', false);
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
    }, [currentPath, handleUpload]);

    // 파일 다운로드 핸들러
    const handleDownload = async (filePaths: string[]) => {
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
    };

    // 파일/폴더 삭제 핸들러
    const handleDelete = async (filePaths: string[]) => {
        try {
            const result = await FileSystemAPI.deleteItems(filePaths);
            if (result.success) {
                // 성공 시 현재 디렉토리 새로고침
                await loadDirectoryContents(currentPath);
                await loadDirectoryTree(serverConfig?.rootPath || '/', false);
                alert(result.data?.message || '선택된 항목이 삭제되었습니다.');
            } else {
                alert('항목 삭제에 실패했습니다: ' + (result.error || '알 수 없는 오류'));
            }
        } catch (error) {
            console.error('Failed to delete items:', error);
            alert('항목 삭제 중 오류가 발생했습니다.');
        }
    };

    // 파일/폴더 이름변경 핸들러
    const handleRename = async (oldPath: string, newName: string) => {
        try {
            const result = await FileSystemAPI.renameItem(oldPath, newName);
            if (result.success) {
                // 성공 시 현재 디렉토리 새로고침
                await loadDirectoryContents(currentPath);
                await loadDirectoryTree(serverConfig?.rootPath || '/', false);
                alert('이름이 성공적으로 변경되었습니다.');
            } else {
                alert('이름 변경에 실패했습니다: ' + (result.error || '알 수 없는 오류'));
            }
        } catch (error) {
            console.error('Failed to rename item:', error);
            alert('이름 변경 중 오류가 발생했습니다.');
        }
    };

    // 버전 변경 핸들러
    const handleViewVersion = (version: 'current' | 'previous') => {
        setCurrentVersion(version);
        console.log(`Switched to ${version} version`);
    };

    // 새 다이얼로그 열기 핸들러
    const handleOpenInDialog = (version: 'current' | 'previous') => {
        const newZIndex = Math.min(maxZIndex + 1, 9999); // AppBar(10000)보다 낮게 제한
        const newDialog = {
            id: `dialog-${nextDialogId}`,
            version,
            title: `웹 파일 탐색기 - ${version === 'current' ? '현재 버전' : '이전 버전'} #${nextDialogId}`,
            isOpen: true,
            zIndex: newZIndex
        };

        setDialogs(prev => [...prev, newDialog]);
        setNextDialogId(prev => prev + 1);
        setMaxZIndex(newZIndex);
    };

    // 다이얼로그 닫기 핸들러
    const handleCloseDialog = (dialogId: string) => {
        setDialogs(prev => prev.filter(dialog => dialog.id !== dialogId));
    };

    // 다이얼로그 포커스 핸들러 (맨 앞으로 가져오기)
    const handleDialogFocus = (dialogId: string) => {
        const newZIndex = Math.min(maxZIndex + 1, 9999); // AppBar(10000)보다 낮게 제한
        setDialogs(prev => prev.map(dialog =>
            dialog.id === dialogId
                ? { ...dialog, zIndex: newZIndex }
                : dialog
        ));
        setMaxZIndex(newZIndex);
    };

    const confirmCreateFolder = async () => {
        if (newFolderName.trim()) {
            try {
                console.log('Creating directory:', {
                    parentPath: currentPath,
                    directoryName: newFolderName.trim()
                });
                await FileSystemAPI.createDirectory(currentPath, newFolderName.trim());
                await loadDirectoryContents(currentPath);
                await loadDirectoryTree(serverConfig?.rootPath || '/', false);
                setShowCreateFolderDialog(false);
                setNewFolderName('');
            } catch (error) {
                console.error('Failed to create folder:', error);
                alert('폴더 생성에 실패했습니다.');
            }
        }
    };

    const cancelCreateFolder = () => {
        setShowCreateFolderDialog(false);
        setNewFolderName('');
    };

    const handleRefresh = () => {
        loadDirectoryContents(currentPath);
        loadDirectoryTree(serverConfig?.rootPath || '/', false);
    };

    // Breadcrumb에서 경로 클릭 시 트리 스크롤을 포함한 네비게이션
    const handleBreadcrumbNavigation = useCallback((path: string) => {
        // 일반 네비게이션 수행
        navigateToDirectory(path);

        // 트리 스크롤 트리거
        setScrollToTreeItem(prev => !prev); // 토글하여 useEffect 트리거
    }, [navigateToDirectory]);

    // 상위 디렉토리로 갈 수 있는지 확인
    const canGoUp = React.useMemo(() => {
        if (!currentPath || !serverConfig?.allowedPaths) return false;

        const normalizePath = (path: string) => {
            return path.replace(/\\/g, '/').replace(/\/+$/, '');
        };

        const normalizedCurrent = normalizePath(currentPath);

        // 현재 경로가 allowedPaths 중 하나와 정확히 일치하면 상위로 갈 수 없음
        const isRootPath = serverConfig.allowedPaths.some(rootPath => {
            const normalizedRoot = normalizePath(rootPath);
            return normalizedCurrent === normalizedRoot;
        });

        return !isRootPath;
    }, [currentPath, serverConfig?.allowedPaths]);

    if (error) {
        return (
            <div className="webexplorer-error">
                <div className="error-icon">⚠️</div>
                <div className="error-message">{error}</div>
                <button onClick={handleRefresh} className="error-retry">
                    다시 시도
                </button>
            </div>
        );
    }

    return (
        <>
            <AppBar
                onViewVersion={handleViewVersion}
                onOpenInDialog={handleOpenInDialog}
            />

            <div
                className={`webexplorer ${currentVersion} ${isDragOver ? 'drag-over' : ''}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
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

                <Toolbar
                    currentPath={currentPath}
                    viewMode={viewMode}
                    canGoUp={canGoUp}
                    serverConfig={serverConfig}
                    selectedFiles={selectedItems}
                    onNavigateUp={navigateUp}
                    onToggleViewMode={toggleViewMode}
                    onCreateFolder={handleCreateFolder}
                    onRefresh={handleRefresh}
                    onNavigateToPath={handleBreadcrumbNavigation}
                    onUpload={handleUpload}
                    onDownload={handleDownload}
                    onDelete={handleDelete}
                    onRename={handleRename}
                />

                <div className="webexplorer-content">
                    <div
                        className="webexplorer-sidebar"
                        ref={sidebarRef}
                        style={{ width: `${sidebarWidth}px` }}
                    >
                        <SidebarNavigation
                            serverConfig={serverConfig}
                            currentPath={currentPath}
                            directories={directories}
                            onPathSelect={handlePathSelect}
                            onDirectoryClick={navigateToDirectory}
                            onDirectoryToggle={toggleDirectory}
                            scrollToTreeItem={scrollToTreeItem}
                        />
                        <div
                            className="sidebar-resize-handle"
                            onMouseDown={handleMouseDown}
                        />
                    </div>

                    <div className="webexplorer-main">
                        {loading ? (
                            <div className="webexplorer-loading">
                                <div className="loading-spinner">🔄</div>
                                <div className="loading-text">로딩 중...</div>
                            </div>
                        ) : (
                            <FileList
                                files={files}
                                directories={currentDirectories}
                                viewMode={viewMode}
                                selectedItems={selectedItems}
                                onFileClick={handleFileClick}
                                onFileDoubleClick={handleFileDoubleClick}
                                onDirectoryClick={handleDirectoryClick}
                                onDirectoryDoubleClick={handleDirectoryDoubleClick}
                                onFileSelect={selectItem}
                                onMultiSelect={selectMultipleItems}
                                onRangeSelect={selectRange}
                                onClearSelection={clearSelection}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* 새 폴더 생성 다이얼로그 */}
            {showCreateFolderDialog && (
                <div className="dialog-overlay">
                    <div className="dialog">
                        <div className="dialog-header">
                            <h3>새 폴더 만들기</h3>
                        </div>
                        <div className="dialog-content">
                            <label htmlFor="folder-name">폴더 이름:</label>
                            <input
                                id="folder-name"
                                type="text"
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        confirmCreateFolder();
                                    } else if (e.key === 'Escape') {
                                        cancelCreateFolder();
                                    }
                                }}
                                autoFocus
                            />
                        </div>
                        <div className="dialog-actions">
                            <button onClick={cancelCreateFolder} className="dialog-button-cancel">
                                취소
                            </button>
                            <button onClick={confirmCreateFolder} className="dialog-button-confirm">
                                만들기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 다중 익스플로러 다이얼로그들 */}
            {dialogs.map((dialog) => (
                <ExplorerDialog
                    key={dialog.id}
                    isOpen={dialog.isOpen}
                    onClose={() => handleCloseDialog(dialog.id)}
                    onFocus={() => handleDialogFocus(dialog.id)}
                    version={dialog.version}
                    title={dialog.title}
                    dialogId={dialog.id}
                    zIndex={dialog.zIndex}
                />
            ))}
        </>
    );
};

export const WebExplorer: React.FC = () => {
    return (
        <FileSystemProvider>
            <WebExplorerContent />
        </FileSystemProvider>
    );
};
