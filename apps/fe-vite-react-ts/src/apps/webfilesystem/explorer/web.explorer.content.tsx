import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useWebFileSystemActions } from '../hooks/use.web.file.system.actions';
import type { WebFileSystem } from '../types/web.file.system.types';
import { FileListComponent } from '../component/file.list.component';
import './web.explorer.css';

interface WebExplorerContentProps {
    apiServer: string;
    rootPath?: string;
    initialPath?: string;
}

export const WebExplorerContent: React.FC<WebExplorerContentProps> = ({ apiServer, rootPath, initialPath }) => {
    const {
        currentPath,
        directories,
        currentDirectories,
        files,
        selectedItems,
        viewMode,
        loading,
        error,
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
    } = useWebFileSystemActions();

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

    // 파일 시스템 변경 이벤트 리스너
    useEffect(() => {
        const handleFileSystemChange = (event: CustomEvent) => {
            const { changedPath, action } = event.detail;
            const currentPath = currentPathRef.current;

            // 경로 정규화 함수
            const normalizePathSeparator = (path: string) => path.replace(/\\/g, '/');
            const normalizedChangedPath = normalizePathSeparator(changedPath);
            const normalizedCurrentPath = normalizePathSeparator(currentPath);

            // 항상 전체 트리를 새로고침
            loadDirectoryTree();

            // 변경된 경로가 현재 경로와 일치하면 현재 디렉토리도 새로고침
            if (normalizedChangedPath === normalizedCurrentPath) {
                loadDirectoryContents(apiServer, currentPath);
            }

            // 지연된 이벤트의 경우 강제로 한 번 더 새로고침
            if (action === 'move-delayed' && normalizedChangedPath === normalizedCurrentPath) {
                setTimeout(() => {
                    loadDirectoryContents(apiServer, currentPath);
                }, 50);
            }
        };

        window.addEventListener('fileSystemChanged', handleFileSystemChange as EventListener);

        return () => {
            window.removeEventListener('fileSystemChanged', handleFileSystemChange as EventListener);
        };
    }, [loadDirectoryContents, loadDirectoryTree]);

    useEffect(() => {
        if (rootPath) {
            loadDirectoryTree();
            loadDirectoryContents(apiServer, rootPath);
        }
    }, [rootPath, loadDirectoryTree, loadDirectoryContents]);

    const handlePathChange = useCallback((path: string) => {
        navigateToDirectory(apiServer, path);
        setScrollToTreeItem(true);
    }, [navigateToDirectory]);

    const handleTreeNavigation = useCallback((path: string) => {
        navigateToDirectory(apiServer, path);
    }, [navigateToDirectory]);

    const handleFileClick = useCallback((file: WebFileSystem.FileInfo) => {
        // 기존 선택을 모두 해제하고 현재 파일만 선택 (메인 화면과 동일한 동작)
        clearSelection();
        selectItem(file.path);
    }, [selectItem, clearSelection]);

    const handleFileDoubleClick = useCallback((file: WebFileSystem.FileInfo) => {
        // 파일 더블클릭 처리 (필요시 구현)
    }, []);

    const handleDirectoryClick = useCallback((directory: WebFileSystem.FileInfo) => {
        // 기존 선택을 모두 해제하고 현재 디렉토리만 선택 (메인 화면과 동일한 동작)
        clearSelection();
        selectItem(directory.path);
    }, [selectItem, clearSelection]);

    const handleDirectoryDoubleClick = useCallback((directory: WebFileSystem.FileInfo) => {
        navigateToDirectory(apiServer, directory.path);
        setScrollToTreeItem(true);
    }, [navigateToDirectory]);

    const handleCreateFolder = useCallback(async () => {
        if (!newFolderName.trim()) return;

        try {
            // console.log('Creating directory in dialog:', {
            //     parentPath: currentPath,
            //     directoryName: newFolderName.trim()
            // });
            // await webFileSystemApi.createDirectory(currentPath, newFolderName.trim());
            // await loadDirectoryContents(currentPath);
            // await loadDirectoryTree();
            // setShowCreateFolderDialog(false);
            // setNewFolderName('');
        } catch (error) {
            console.error('Failed to create folder:', error);
        }
    }, [newFolderName, currentPath, loadDirectoryContents, loadDirectoryTree]);

    // 파일 업로드 핸들러
    const handleUpload = useCallback(async (files: FileList) => {
        try {
            // const result = await webFileSystemApi.uploadFiles(currentPath, files);
            // if (result.success) {
            //     // 성공 시 현재 디렉토리 새로고침
            //     await loadDirectoryContents(currentPath);
            //     alert(result.data?.message || '파일이 성공적으로 업로드되었습니다.');
            // } else {
            //     alert('파일 업로드에 실패했습니다: ' + (result.error || '알 수 없는 오류'));
            // }
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
                        // const result = await webFileSystemApi.moveItem(sourcePath, targetPath);
                        // if (result.success) {
                        //     // 이동된 파일의 선택 해제
                        //     clearSelection();

                        //     console.log('File moved successfully:', { sourceDir, currentPath });

                        //     // 성공 시 전체 디렉토리 트리와 현재 디렉토리 새로고침
                        //     await loadDirectoryTree();
                        //     await loadDirectoryContents(currentPath);

                        //     // 원본 폴더에 대한 이벤트 발생 (다이얼로그 간 이동 시 중요)
                        //     console.log('Dispatching move event for source directory:', sourceDir);
                        //     window.dispatchEvent(new CustomEvent('fileSystemChanged', {
                        //         detail: { changedPath: sourceDir, action: 'move' }
                        //     }));

                        //     // 대상 폴더에 대한 이벤트도 발생 (현재 폴더가 대상)
                        //     if (sourceDir !== currentPathNormalized) {
                        //         console.log('Dispatching move event for target directory:', currentPathNormalized);
                        //         window.dispatchEvent(new CustomEvent('fileSystemChanged', {
                        //             detail: { changedPath: currentPathNormalized, action: 'move' }
                        //         }));
                        //     }

                        //     // 약간의 지연 후 한 번 더 새로고침 (확실하게)
                        //     setTimeout(() => {
                        //         console.log('Dispatching delayed move events');
                        //         window.dispatchEvent(new CustomEvent('fileSystemChanged', {
                        //             detail: { changedPath: sourceDir, action: 'move-delayed' }
                        //         }));
                        //         if (sourceDir !== currentPathNormalized) {
                        //             window.dispatchEvent(new CustomEvent('fileSystemChanged', {
                        //                 detail: { changedPath: currentPathNormalized, action: 'move-delayed' }
                        //             }));
                        //         }
                        //     }, 100);

                        //     alert('파일이 성공적으로 이동되었습니다.');
                        // } else {
                        //     alert('파일 이동에 실패했습니다: ' + (result.error || '알 수 없는 오류'));
                        // }
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
            // const result = await webFileSystemApi.downloadFiles(filePaths);
            // if (result.success) {
            //     // 다운로드 성공 메시지는 브라우저에서 자동으로 표시
            //     console.log('Files downloaded successfully');
            // } else {
            //     alert('파일 다운로드에 실패했습니다: ' + (result.error || '알 수 없는 오류'));
            // }
        } catch (error) {
            console.error('Failed to download files:', error);
            alert('파일 다운로드 중 오류가 발생했습니다.');
        }
    }, []);

    // 파일/폴더 삭제 핸들러
    const handleDelete = useCallback(async (filePaths: string[]) => {
        try {
            // const result = await webFileSystemApi.deleteItems(filePaths);
            // if (result.success) {
            //     // 성공 시 현재 디렉토리 새로고침
            //     await loadDirectoryContents(currentPath);
            //     await loadDirectoryTree();
            //     alert(result.data?.message || '선택된 항목이 삭제되었습니다.');
            // } else {
            //     alert('항목 삭제에 실패했습니다: ' + (result.error || '알 수 없는 오류'));
            // }
        } catch (error) {
            console.error('Failed to delete items:', error);
            alert('항목 삭제 중 오류가 발생했습니다.');
        }
    }, [currentPath, loadDirectoryContents, loadDirectoryTree]);

    // 파일/폴더 이름변경 핸들러
    const handleRename = useCallback(async (oldPath: string, newName: string) => {
        try {
            // const result = await webFileSystemApi.renameItem(oldPath, newName);
            // if (result.success) {
            //     // 성공 시 현재 디렉토리 새로고침
            //     await loadDirectoryContents(currentPath);
            //     await loadDirectoryTree();
            //     alert('이름이 성공적으로 변경되었습니다.');
            // } else {
            //     alert('이름 변경에 실패했습니다: ' + (result.error || '알 수 없는 오류'));
            // }
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

    return (
        <div className={`web-explorer-content ${isDragOver ? 'drag-over' : ''}`}>
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
                    {/* <SidebarNavigation
                        directories={directories}
                        currentPath={currentPath}
                        onPathSelect={handleTreeNavigation}
                        onDirectoryClick={handleTreeNavigation}
                        onDirectoryToggle={toggleDirectory}
                        scrollToTreeItem={scrollToTreeItem}
                    /> */}
                    <div
                        className="sidebar-resize-handle"
                        onMouseDown={handleSidebarResizeStart}
                    />
                </div>
                <div className="webexplorer-main">
                    {/* <Toolbar
                        currentPath={currentPath}
                        viewMode={viewMode}
                        canGoUp={currentPath !== serverConfig?.rootPath}
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
                    /> */}
                    <FileListComponent
                        directories={currentDirectories}
                        files={files}
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
