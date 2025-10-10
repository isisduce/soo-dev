import React, { useRef, useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
// import type { FileInfoDto } from '../dto/file.info.dto';
import { PathHelper } from '../helper/path.helper';
import { FileHelper } from '../helper/file.helper';
import type { WebFileSystem } from '../types/web.file.system.types';


interface FileListProps {
    fileList?: WebFileSystem.FileInfo[];
    setCurrentPath?: (path: string) => void;
    fileExtensions?: string[];
    selectSingleFile?: boolean;
    selectedFiles?: WebFileSystem.FileInfo[];
    setSelectedFiles?: (files: WebFileSystem.FileInfo[]) => void;
    clickToMove?: boolean;
    doubleClickToMove?: boolean;
    onSelect?: (file: WebFileSystem.FileInfo[]) => void;
}

export const FileList: React.FC<FileListProps> = (props) => {

    const {
        fileList,
        setCurrentPath,
        fileExtensions,
        selectSingleFile = true,
        selectedFiles,
        setSelectedFiles,
        clickToMove = true,
        doubleClickToMove = false,
        onSelect,
    } = props;

    // const directories = fileList?.filter((file: WebFileSystem.FileInfo) => file.type === 'directory') || [];
    // const files = fileList?.filter((file: WebFileSystem.FileInfo) => file.type === 'file' && (!fileExtensions || !fileExtensions[0] || file.name.endsWith(fileExtensions[0]))) || [];

    // 마지막으로 선택된 파일의 인덱스를 추적
    const [lastSelectedIndex, setLastSelectedIndex] = useState<number>(-1);
    // 드래그 상태
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [dragEnd, setDragEnd] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const fileRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    // 디렉토리 이동 핸들러 (공통)
    const moveDirectory = (file: WebFileSystem.FileInfo) => {
        console.log('Moving to directory:', file);
        const targetPath = file.linkTarget ? file.linkTarget : file.path;
        console.log('Resolved target path:', targetPath);
        setCurrentPath?.(PathHelper.normalizePath(targetPath));
        setSelectedFiles?.([]);
    };

    // 파일 클릭 핸들러
    const handleFileClick = (file: WebFileSystem.FileInfo, event?: React.MouseEvent) => {
        if (event?.shiftKey) {
            event.preventDefault();
        }
        if (file.type === 'file' && fileList) {
            const filteredFiles = fileList.filter((f: WebFileSystem.FileInfo) => {
                if (f.type === 'directory') return true;
                if (!fileExtensions) return true;
                if (!fileExtensions[0]) return true;
                return f.name.endsWith(fileExtensions[0]);
            });
            const currentIndex = filteredFiles.findIndex((f: WebFileSystem.FileInfo) => f.path === file.path);
            if (selectSingleFile && !event?.ctrlKey && !event?.shiftKey) {
                setSelectedFiles?.([file]);
                setLastSelectedIndex(currentIndex);
            } else if (event?.shiftKey && lastSelectedIndex !== -1) {
                const startIndex = Math.min(lastSelectedIndex, currentIndex);
                const endIndex = Math.max(lastSelectedIndex, currentIndex);
                const rangeFiles = filteredFiles.slice(startIndex, endIndex + 1).filter((f: WebFileSystem.FileInfo) => f.type === 'file');
                if (event?.ctrlKey) {
                    const existingPaths = new Set((selectedFiles?.map((f: WebFileSystem.FileInfo) => f.path)) || []);
                    const newFiles = rangeFiles.filter((f: WebFileSystem.FileInfo) => !existingPaths.has(f.path));
                    setSelectedFiles?.([...(selectedFiles || []), ...newFiles]);
                } else {
                    setSelectedFiles?.(rangeFiles);
                }
            } else if (event?.ctrlKey) {
                if (selectedFiles?.some((f: WebFileSystem.FileInfo) => f.path === file.path)) {
                    const newSelectedFiles = selectedFiles.filter((f: WebFileSystem.FileInfo) => f.path !== file.path);
                    setSelectedFiles?.(newSelectedFiles);
                } else {
                    const newSelectedFiles = [...(selectedFiles || []), file];
                    setSelectedFiles?.(newSelectedFiles);
                }
                setLastSelectedIndex(currentIndex);
            } else {
                setSelectedFiles?.([file]);
                setLastSelectedIndex(currentIndex);
            }
        }
    };

    // 파일 선택 핸들러
    const handleFileSelect = () => {
        if (selectedFiles && selectedFiles.length > 0 && onSelect) {
            onSelect?.(selectedFiles);
            setSelectedFiles?.([]);
        }
    };

    // 드래그 시작(리스트 전체에서)
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        // 파일 아이템이나 텍스트 클릭 시 드래그 시작 안 함
        const target = e.target as HTMLElement;
        if (target.closest('.file-list-item') || target.closest('.MuiTypography-root')) {
            return;
        }
        e.preventDefault();
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
        setDragEnd({ x: e.clientX, y: e.clientY });
        if (!e.ctrlKey && !e.metaKey) {
            setSelectedFiles?.([]);
        }
    }, [setSelectedFiles]);

    // 드래그 중(리스트 전체에서)
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        setDragEnd({ x: e.clientX, y: e.clientY });
        // 드래그 영역과 겹치는 파일들 찾기
        const dragRect = {
            left: Math.min(dragStart.x, e.clientX),
            top: Math.min(dragStart.y, e.clientY),
            right: Math.max(dragStart.x, e.clientX),
            bottom: Math.max(dragStart.y, e.clientY),
        };
        const intersectingFiles: WebFileSystem.FileInfo[] = [];
        fileRefs.current.forEach((element, filePath) => {
            if (element) {
                const rect = element.getBoundingClientRect();
                if (
                    rect.left < dragRect.right &&
                    rect.right > dragRect.left &&
                    rect.top < dragRect.bottom &&
                    rect.bottom > dragRect.top
                ) {
                    const file = fileList?.find((f: WebFileSystem.FileInfo) => f.path === filePath);
                    if (file && file.type === 'file') {
                        intersectingFiles.push(file);
                    }
                }
            }
        });
        setSelectedFiles?.(intersectingFiles);
    }, [isDragging, dragStart, setSelectedFiles, fileList]);

    // 드래그 종료
    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    // 각 파일 Box에 ref 부여
    const setFileRef = useCallback((filePath: string, element: HTMLDivElement | null) => {
        if (element) {
            fileRefs.current.set(filePath, element);
        } else {
            fileRefs.current.delete(filePath);
        }
    }, []);

    // 렌더링
    const filteredFiles = fileList?.filter((file: WebFileSystem.FileInfo) => {
        if (file.type === 'directory') return true;
        if (!fileExtensions) return true;
        if (!fileExtensions[0]) return true;
        return file.name.endsWith(fileExtensions[0]);
    }) || [];

    const dragStyle = isDragging ? {
        position: 'fixed' as const,
        left: Math.min(dragStart.x, dragEnd.x),
        top: Math.min(dragStart.y, dragEnd.y),
        width: Math.abs(dragEnd.x - dragStart.x),
        height: Math.abs(dragEnd.y - dragStart.y),
        border: '1px dashed #0969da',
        backgroundColor: 'rgba(9, 105, 218, 0.1)',
        pointerEvents: 'none' as const,
        zIndex: 1000,
    } : {};

    return (
        <Box
            ref={containerRef}
            sx={{ p: 1 }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onDragStart={e => e.preventDefault()}
            onDragOver={e => e.preventDefault()}
        >
            {filteredFiles.length > 0 && filteredFiles.map((file: WebFileSystem.FileInfo) => (
                <Box
                    key={file.path}
                    className="file-list-item"
                    draggable={false}
                    ref={(el: HTMLDivElement | null) => setFileRef(file.path, el)}
                    sx={{
                        p: 1,
                        borderRadius: 1,
                        cursor: 'pointer',
                        backgroundColor: selectedFiles?.includes(file) ? 'info.light' : 'transparent',
                        color: selectedFiles?.includes(file as WebFileSystem.FileInfo) ? 'text.primary' : 'inherit',
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        MozUserSelect: 'none',
                        msUserSelect: 'none',
                        '&:hover': {
                            backgroundColor: selectedFiles?.includes(file) ? 'info.light' : 'action.hover',
                        }
                    }}
                    onClick={(event) => {
                        if (
                            file.type === 'directory' ||
                            (file.isSymbolicLink) ||
                            (file.isJunctionPoint)
                        ) {
                            if (clickToMove) {
                                moveDirectory(file);
                            }
                        } else {
                            handleFileClick(file, event);
                        }
                    }}
                    onDoubleClick={(event) => {
                        if (event.shiftKey) {
                            event.preventDefault();
                        }
                        if (
                            file.type === 'directory' ||
                            (file.isSymbolicLink) ||
                            (file.isJunctionPoint)
                        ) {
                            if (doubleClickToMove) {
                                moveDirectory(file);
                            }
                        } else {
                            handleFileClick(file, event);
                            handleFileSelect();
                        }
                    }}
                >
                    <Typography variant="body2" sx={{ pointerEvents: 'none' }}>
                        {FileHelper.getItemIcon(file)} {file.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" sx={{ pointerEvents: 'none' }}>
                        Size: {file.size} bytes | Modified: {file.modifiedAt ? (file.modifiedAt instanceof Date ? file.modifiedAt.toLocaleString() : file.modifiedAt) : ''}
                    </Typography>
                </Box>
            ))}
            {filteredFiles.length === 0 && (
                <Typography variant="body2" color="textSecondary" textAlign="center" sx={{ py: 4 }}>
                    No files found.
                </Typography>
            )}
            {isDragging && <Box sx={dragStyle} />}
        </Box>
    );
};