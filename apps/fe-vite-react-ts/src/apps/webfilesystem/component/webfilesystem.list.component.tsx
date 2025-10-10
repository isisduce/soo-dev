import { useCallback, useEffect, useRef, useState } from "react";
import type { FileInfoDto } from "../types/web.file.system.types";
import { PathHelper } from "../helper/path.helper";
import { Box, Typography } from "@mui/material";
import { FileHelper } from "../helper/file.helper";
import DateHelper from "../../../libs/helper/date.helper";
import { NumberHelper } from "../../../libs/helper/number.helper";

interface WebFileSystemListComponentProps {
    setCurrentPath?: (value: string) => void;
    fileList?: FileInfoDto[];
    showHidden?: boolean;
    fileExtensions?: string[];
    enableMultiSelect?: boolean;
    enableSelectDirectory?: boolean;
    clickToMove?: boolean;
    doubleClickToMove?: boolean;
    selectedFiles?: FileInfoDto[];
    setSelectedFiles?: (files: FileInfoDto[]) => void;
    onSelect?: (files: FileInfoDto[]) => void;
}

export const WebFileSystemListComponent: React.FC<WebFileSystemListComponentProps> = (props: WebFileSystemListComponentProps) => {
    const {
        setCurrentPath,
        fileExtensions,
        enableMultiSelect = false,
        enableSelectDirectory = false,
        clickToMove = true,
        doubleClickToMove = false,
        selectedFiles,
        setSelectedFiles,
        onSelect,
    } = props;

    const containerRef = useRef<HTMLDivElement>(null);
    const fileRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    const filteredFiles = props.fileList?.filter((file: FileInfoDto) => {
        if (file.type === 'directory') return true;
        if (!fileExtensions) return true;
        if (!fileExtensions[0]) return true;
        return file.name.endsWith(fileExtensions[0]);
    }) || [];

    const directories = filteredFiles.filter((file: FileInfoDto) => file.type === 'directory');
    const files = filteredFiles.filter((file: FileInfoDto) => file.type === 'file');

    // ====================================================================================================

    // 각 파일 Box에 ref 부여
    const setFileRef = useCallback((filePath: string, element: HTMLDivElement | null) => {
        if (element) {
            fileRefs.current.set(filePath, element);
        } else {
            fileRefs.current.delete(filePath);
        }
    }, []);

    const renderItem = useCallback(({
        file,
        handleClickDirectory,
        handleDoubleClickDirectory,
        handleClickFile,
        handleDoubleClickFile,
    }: {
        file: FileInfoDto,
        handleClickDirectory?: (file: FileInfoDto, event?: React.MouseEvent) => void ,
        handleDoubleClickDirectory?: (file: FileInfoDto, event?: React.MouseEvent) => void,
        handleClickFile?: (file: FileInfoDto, event?: React.MouseEvent) => void,
        handleDoubleClickFile?: (file: FileInfoDto, event?: React.MouseEvent) => void,
    }) => {
        return (
            <Box
                key={file.path}
                className="dir-list-item"
                draggable={false}
                ref={(el: HTMLDivElement | null) => setFileRef(file.path, el)}
                sx={{
                    p: 1,
                    borderRadius: 1,
                    cursor: 'pointer',
                    backgroundColor: selectedFiles?.includes(file) ? 'info.light' : 'transparent',
                    color: selectedFiles?.includes(file as FileInfoDto) ? 'text.primary' : 'inherit',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    msUserSelect: 'none',
                    '&:hover': {
                        backgroundColor: selectedFiles?.includes(file) ? 'info.light' : 'action.hover',
                    }
                }}
                onClick={(event) => {
                    if (file.type === 'directory') {
                        handleClickDirectory?.(file, event);
                    } else {
                        handleClickFile?.(file, event);
                    }
                }}
                onDoubleClick={(event) => {
                    if (event.shiftKey) {
                        event.preventDefault();
                    }
                    if (file.type === 'directory') {
                        handleDoubleClickDirectory?.(file, event);
                    } else {
                        handleDoubleClickFile?.(file, event);
                    }
                }}
            >
                <Box display="flex" flexDirection="row" gap={1} sx={{ pointerEvents: 'none' }}>
                    <Typography variant="body2" sx={{ pointerEvents: 'none', width: '100%', minWidth: 200, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {FileHelper.getItemIcon(file)} {file.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" sx={{ pointerEvents: 'none', width: 80, textAlign: 'right', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {file.type === 'directory' ? '' : NumberHelper.getProperSizeFromNumber(file.size)}
                    </Typography>
                    {/* <Typography variant="caption" color="textSecondary" sx={{ pointerEvents: 'none', width: 80, textAlign: 'right', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {file.type === 'directory' ? 'Directory' : ''}
                    </Typography> */}
                    <Typography variant="caption" color="textSecondary" sx={{ pointerEvents: 'none', width: 120, textAlign: 'left', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {/* {file.modifiedAt ? (file.modifiedAt instanceof Date ? file.modifiedAt.toLocaleString() : file.modifiedAt) : ''} */}
                        {DateHelper.getYYMMDDhms(
                            file.modifiedAt
                                ? (file.modifiedAt instanceof Date
                                    ? file.modifiedAt.toISOString()
                                    : file.modifiedAt)
                                : undefined
                        )}
                    </Typography>
                </Box>
            </Box>
        );
    }, [selectedFiles, setFileRef]);


    const handleClickDirectory = (file: FileInfoDto, event?: React.MouseEvent) => {
        if (clickToMove) {
            moveDirectory(file);
        } else {
            if (!enableSelectDirectory) return;
            handleFileClick(file, event);
        }
    };

    const handleDoubleClickDirectory = (file: FileInfoDto, event?: React.MouseEvent) => {
        if (doubleClickToMove) {
            moveDirectory(file);
        } else {
            if (!enableSelectDirectory) return;
            handleFileClick(file, event);
        }
    };

    const handleClickFile = (file: FileInfoDto, event?: React.MouseEvent) => {
        handleFileClick(file, event);
    };

    const handleDoubleClickFile = (file: FileInfoDto, event?: React.MouseEvent) => {
        handleFileClick(file, event);
        handleFileSelect();
    };

    // ====================================================================================================

    const moveDirectory = (file: FileInfoDto) => {
        // console.log('Moving to directory:', file);
        const targetPath = file.linkTarget ? file.linkTarget : file.path;
        // console.log('Resolved target path:', targetPath);
        setCurrentPath?.(PathHelper.normalizePath(targetPath));
        setSelectedFiles?.([]);
    };

    // ====================================================================================================

    const [lastSelectedIndex, setLastSelectedIndex] = useState<number>(-1);

    const handleFileClick = (file: FileInfoDto, event?: React.MouseEvent) => {
        if (event?.shiftKey) {
            event.preventDefault();
        }
        if (file.type === 'directory' && !enableSelectDirectory) return;
        if (filteredFiles) {
            const currentIndex = filteredFiles.findIndex((f: FileInfoDto) => f.path === file.path);
            if (enableMultiSelect) {
                if (event?.shiftKey && lastSelectedIndex !== -1) {
                    const startIndex = Math.min(lastSelectedIndex, currentIndex);
                    const endIndex = Math.max(lastSelectedIndex, currentIndex);
                    const rangeFiles = filteredFiles.slice(startIndex, endIndex + 1).filter((f: FileInfoDto) => f.type === 'file' || (f.type === 'directory' && enableSelectDirectory));
                    if (event?.ctrlKey) {
                        const existingPaths = new Set((selectedFiles?.map((f: FileInfoDto) => f.path)) || []);
                        const newFiles = rangeFiles.filter((f: FileInfoDto) => !existingPaths.has(f.path));
                        setSelectedFiles?.([...(selectedFiles || []), ...newFiles]);
                    } else {
                        setSelectedFiles?.(rangeFiles);
                    }
                } else if (event?.ctrlKey) {
                    if (selectedFiles?.some((f: FileInfoDto) => f.path === file.path)) {
                        const newSelectedFiles = selectedFiles.filter((f: FileInfoDto) => f.path !== file.path);
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
            } else {
                setSelectedFiles?.([file]);
                setLastSelectedIndex(currentIndex);
            }
        }
    };

    const handleFileSelect = () => {
        if (selectedFiles && selectedFiles.length > 0 && onSelect) {
            onSelect?.(selectedFiles);
            setSelectedFiles?.([]);
        }
    };

    // ====================================================================================================

    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [dragEnd, setDragEnd] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (e.button !== 0) return; // allow left-click
        const target = e.target as HTMLElement;
        const isDirItem = target.closest('.dir-list-item');
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
        setDragEnd({ x: e.clientX, y: e.clientY });
        if (!e.ctrlKey && !e.metaKey && !isDirItem) {
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
        const intersectingFiles: FileInfoDto[] = [];
        fileRefs.current.forEach((element, filePath) => {
            if (element) {
                const rect = element.getBoundingClientRect();
                if (
                    rect.left < dragRect.right &&
                    rect.right > dragRect.left &&
                    rect.top < dragRect.bottom &&
                    rect.bottom > dragRect.top
                ) {
                    const file = filteredFiles?.find((f: FileInfoDto) => f.path === filePath);
                    if (file && file.type === 'file' || (file && file.type === 'directory' && enableSelectDirectory)) {
                        intersectingFiles.push(file);
                    }
                }
            }
        });
        if (enableMultiSelect) {
            setSelectedFiles?.(intersectingFiles);
        } else {
            setSelectedFiles?.(intersectingFiles.slice(0, 1));
            // setSelectedFiles?.(intersectingFiles.length > 0 ? [intersectingFiles[0]] : []);
        }
    }, [isDragging, dragStart, setSelectedFiles, filteredFiles]);

    // 드래그 종료
    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            const handleWindowMouseMove = (e: MouseEvent) => {
                const dialog = document.querySelector('.MuiDialog-root');
                if (dialog) {
                    const rect = dialog.getBoundingClientRect();
                    let clampX = e.clientX;
                    let clampY = e.clientY;
                    let outOfBounds = false;
                    if (e.clientX < rect.left) {
                        clampX = rect.left;
                        outOfBounds = true;
                    }
                    if (e.clientX > rect.right) {
                        clampX = rect.right;
                        outOfBounds = true;
                    }
                    if (e.clientY < rect.top) {
                        clampY = rect.top;
                        outOfBounds = true;
                    }
                    if (e.clientY > rect.bottom) {
                        clampY = rect.bottom;
                        outOfBounds = true;
                    }
                    if (outOfBounds) {
                        setDragEnd({ x: clampX, y: clampY });
                        return;
                    }
                }
                handleMouseMove(e as any);
            };
            window.addEventListener('mousemove', handleWindowMouseMove);
            window.addEventListener('mouseup', handleMouseUp as any);
            return () => {
                window.removeEventListener('mousemove', handleWindowMouseMove);
                window.removeEventListener('mouseup', handleMouseUp as any);
            };
        }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    // ====================================================================================================

    const dragStyle = isDragging && 1 < Math.abs(dragEnd.x - dragStart.x) && 1 < Math.abs(dragEnd.y - dragStart.y) ? {
        position: 'fixed' as const,
        left: Math.min(dragStart.x, dragEnd.x),
        top: Math.min(dragStart.y, dragEnd.y),
        width: Math.abs(dragEnd.x - dragStart.x),
        height: Math.abs(dragEnd.y - dragStart.y),
        border: '1px dashed #0969da',
        backgroundColor: 'rgba(9, 105, 218, 0.1)',
        pointerEvents: 'none' as const,
        zIndex: 1000,
    } : undefined;

    return (
        <Box
            ref={containerRef}
            sx={{ p: 0, height: '100%', }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onDragStart={e => e.preventDefault()}
            onDragOver={e => e.preventDefault()}
        >
            {directories.length > 0 && directories.map((file: FileInfoDto) => (
                renderItem({
                    file,
                    handleClickDirectory: handleClickDirectory,
                    handleDoubleClickDirectory: handleDoubleClickDirectory,
                })
            ))}
            {files.length > 0 && files.map((file: FileInfoDto) => (
                renderItem({
                    file,
                    handleClickFile: handleClickFile,
                    handleDoubleClickFile: handleDoubleClickFile,
                })
            ))}
            {filteredFiles.length === 0 && (
                <Typography variant="body2" color="textSecondary" textAlign="center" sx={{ py: 4 }}>
                    No files.
                </Typography>
            )}
            {isDragging && <Box sx={dragStyle} />}
        </Box>
    );
};