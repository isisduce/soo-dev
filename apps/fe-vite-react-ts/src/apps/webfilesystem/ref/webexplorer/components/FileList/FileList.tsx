import React, { useState, useRef, useCallback } from 'react';
import type { FileItem, DirectoryItem, FileSystemItem } from '../../types';
import './FileList.css';

interface FileListProps {
    files: FileItem[];
    directories: DirectoryItem[];
    viewMode: 'list' | 'icons';
    selectedItems: string[];
    onFileClick: (file: FileItem) => void;
    onFileDoubleClick: (file: FileItem) => void;
    onDirectoryClick: (directory: DirectoryItem) => void;
    onDirectoryDoubleClick: (directory: DirectoryItem) => void;
    onFileSelect: (fileId: string) => void;
    onMultiSelect: (fileIds: string[]) => void;
    onRangeSelect: (fileId: string) => void;
    onClearSelection: () => void;
}

interface FileItemComponentProps {
    item: FileSystemItem;
    viewMode: 'list' | 'icons';
    isSelected: boolean;
    onClick: (item: FileSystemItem) => void;
    onDoubleClick: (item: FileSystemItem) => void;
    onSelect: (itemId: string) => void;
    onRangeSelect: (itemId: string) => void;
}

const getFileIcon = (extension: string): string => {
    const iconMap: { [key: string]: string } = {
        // 문서
        'pdf': '📄',
        'doc': '📝',
        'docx': '📝',
        'txt': '📄',
        'md': '📝',
        'rtf': '📄',

        // 이미지
        'jpg': '🖼️',
        'jpeg': '🖼️',
        'png': '🖼️',
        'gif': '🖼️',
        'bmp': '🖼️',
        'svg': '🖼️',
        'webp': '🖼️',

        // 비디오
        'mp4': '🎬',
        'avi': '🎬',
        'mov': '🎬',
        'wmv': '🎬',
        'flv': '🎬',
        'webm': '🎬',

        // 오디오
        'mp3': '🎵',
        'wav': '🎵',
        'flac': '🎵',
        'aac': '🎵',
        'ogg': '🎵',

        // 압축
        'zip': '🗜️',
        'rar': '🗜️',
        '7z': '🗜️',
        'tar': '🗜️',
        'gz': '🗜️',

        // 코드
        'js': '📜',
        'ts': '📜',
        'jsx': '📜',
        'tsx': '📜',
        'html': '🌐',
        'css': '🎨',
        'scss': '🎨',
        'sass': '🎨',
        'json': '📋',
        'xml': '📋',
        'yml': '📋',
        'yaml': '📋',

        // 실행파일
        'exe': '⚙️',
        'msi': '⚙️',
        'app': '⚙️',
        'deb': '⚙️',
        'rpm': '⚙️',
    };

    return iconMap[extension.toLowerCase()] || '📄';
};

const getDirectoryIcon = (): string => {
    return '📁';
};

const getItemIcon = (item: FileSystemItem): string => {
    if (item.type === 'directory') {
        return getDirectoryIcon();
    } else {
        return getFileIcon((item as FileItem).extension);
    }
};

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const formatDate = (date: Date | string): string => {
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;

        // 유효한 날짜인지 확인
        if (isNaN(dateObj.getTime())) {
            return '날짜 없음';
        }

        return new Intl.DateTimeFormat('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        }).format(dateObj);
    } catch (error) {
        console.error('Date formatting error:', error);
        return '날짜 오류';
    }
};

// 생성일과 수정일을 함께 표시하는 포맷 함수
const formatCombinedDate = (item: FileSystemItem): React.ReactNode => {
    const createdDate = item.type === 'file'
        ? (item as FileItem).createdDate
        : (item as DirectoryItem).createdDate;

    const modifiedDate = item.type === 'file'
        ? (item as FileItem).lastModified
        : (item as DirectoryItem).lastModified;

    const created = createdDate ? formatDate(createdDate) : null;
    const modified = modifiedDate ? formatDate(modifiedDate) : null;

    // 둘 다 있으면 두 줄로 표시, 하나만 있으면 한 줄로 표시
    if (created && modified) {
        return (
            <div className="combined-date">
                <div className="date-created">생성: {created}</div>
                <div className="date-modified">수정: {modified}</div>
            </div>
        );
    } else if (modified) {
        return <div className="date-modified">수정: {modified}</div>;
    } else if (created) {
        return <div className="date-created">생성: {created}</div>;
    } else {
        return '-';
    }
};

const FileItemComponent = React.forwardRef<HTMLDivElement, FileItemComponentProps>(({
    item,
    viewMode,
    isSelected,
    onClick,
    onDoubleClick,
    onSelect,
    onRangeSelect,
}, ref) => {
    // 드래그 핸들러
    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('application/json', JSON.stringify({
            type: 'file-move',
            sourceItem: item,
            sourcePath: item.path
        }));
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleClick = (e: React.MouseEvent) => {
        if (e.shiftKey) {
            // Shift 키를 누른 상태에서는 범위 선택
            onRangeSelect(item.id);
        } else if (e.ctrlKey || e.metaKey) {
            // 컨트롤 키를 누른 상태에서는 다중 선택 (토글)
            onSelect(item.id);
        } else {
            // 일반 클릭 시에는 단일 선택
            onClick(item);
        }
    };

    const handleCheckboxClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // 체크박스 클릭 시 파일 클릭 이벤트 방지
        onSelect(item.id);
    };

    const handleDoubleClick = () => {
        onDoubleClick(item);
    };

    if (viewMode === 'icons') {
        return (
            <div
                ref={ref}
                className={`file-item-icon ${isSelected ? 'selected' : ''}`}
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
                draggable={true}
                onDragStart={handleDragStart}
            >
                <div className="file-checkbox-container">
                    <input
                        type="checkbox"
                        className="file-checkbox"
                        checked={isSelected}
                        onChange={() => {}} // onChange는 handleCheckboxClick에서 처리
                        onClick={handleCheckboxClick}
                    />
                </div>
                <div className="file-icon-large">
                    {getItemIcon(item)}
                </div>
                <div className="file-name-icon">{item.name}</div>
                <div className="file-size-icon">
                    {item.type === 'file'
                        ? formatFileSize((item as FileItem).size)
                        : (item as DirectoryItem).lastModified
                            ? `폴더 (${formatDate((item as DirectoryItem).lastModified!).split(' ')[0]})`
                            : '폴더'}
                </div>
            </div>
        );
    }

    return (
        <div
            ref={ref}
            className={`file-item-list ${isSelected ? 'selected' : ''}`}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            draggable={true}
            onDragStart={handleDragStart}
        >
            <div className="file-checkbox-container">
                <input
                    type="checkbox"
                    className="file-checkbox"
                    checked={isSelected}
                    onChange={() => {}} // onChange는 handleCheckboxClick에서 처리
                    onClick={handleCheckboxClick}
                />
            </div>
            <div className="file-icon">
                {getItemIcon(item)}
            </div>
            <div className="file-name">{item.name}</div>
            <div className="file-size">
                {item.type === 'file' ? formatFileSize((item as FileItem).size) : '폴더'}
            </div>
            <div className="file-date">
                {formatCombinedDate(item)}
            </div>
        </div>
    );
});

export const FileList: React.FC<FileListProps> = ({
    files,
    directories,
    viewMode,
    selectedItems,
    onFileClick,
    onFileDoubleClick,
    onDirectoryClick,
    onDirectoryDoubleClick,
    onFileSelect,
    onMultiSelect,
    onRangeSelect,
    onClearSelection,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [dragEnd, setDragEnd] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const fileRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        // 파일 아이템이나 체크박스를 클릭한 경우에는 드래그 시작하지 않음
        const target = e.target as HTMLElement;
        if (target.closest('.file-item-list') || target.closest('.file-item-icon') || target.closest('.file-checkbox')) {
            return;
        }

        // 기본 동작 방지 (텍스트 선택, 드래그 앤 드롭 등)
        e.preventDefault();

        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
        setDragEnd({ x: e.clientX, y: e.clientY });

        // 새로운 드래그를 시작할 때 기존 선택 해제 (Ctrl 키를 누르지 않은 경우)
        if (!e.ctrlKey && !e.metaKey) {
            onClearSelection();
        }
    }, [onClearSelection]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging) return;

        // 기본 동작 방지
        e.preventDefault();

        setDragEnd({ x: e.clientX, y: e.clientY });

        // 드래그 영역과 겹치는 파일들 찾기
        const dragRect = {
            left: Math.min(dragStart.x, e.clientX),
            top: Math.min(dragStart.y, e.clientY),
            right: Math.max(dragStart.x, e.clientX),
            bottom: Math.max(dragStart.y, e.clientY),
        };

        const intersectingFiles: string[] = [];
        fileRefs.current.forEach((element, fileId) => {
            if (element) {
                const rect = element.getBoundingClientRect();
                if (
                    rect.left < dragRect.right &&
                    rect.right > dragRect.left &&
                    rect.top < dragRect.bottom &&
                    rect.bottom > dragRect.top
                ) {
                    intersectingFiles.push(fileId);
                }
            }
        });

        onMultiSelect(intersectingFiles);
    }, [isDragging, dragStart, onMultiSelect]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const setFileRef = useCallback((fileId: string, element: HTMLDivElement | null) => {
        if (element) {
            fileRefs.current.set(fileId, element);
        } else {
            fileRefs.current.delete(fileId);
        }
    }, []);

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
        <div
            className={`file-list ${viewMode} ${isDragging ? 'dragging' : ''}`}
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            {viewMode === 'list' && (
                <div className="file-list-header">
                    <div className="file-header-checkbox"></div>
                    <div className="file-header-icon"></div>
                    <div className="file-header-name">이름</div>
                    <div className="file-header-size">크기</div>
                    <div className="file-header-date">날짜</div>
                </div>
            )}

            <div className="file-list-content">
                {/* 디렉토리들을 먼저 표시 */}
                {directories.map((dir) => (
                    <FileItemComponent
                        key={dir.id}
                        item={dir}
                        viewMode={viewMode}
                        isSelected={selectedItems.includes(dir.id)}
                        onClick={(item) => {
                            if (item.type === 'directory') {
                                onDirectoryClick(item as DirectoryItem);
                            }
                        }}
                        onDoubleClick={(item) => {
                            if (item.type === 'directory') {
                                onDirectoryDoubleClick(item as DirectoryItem);
                            }
                        }}
                        onSelect={onFileSelect}
                        onRangeSelect={onRangeSelect}
                        ref={(el: HTMLDivElement | null) => setFileRef(dir.id, el)}
                    />
                ))}

                {/* 파일들을 다음에 표시 */}
                {files.map((file) => (
                    <FileItemComponent
                        key={file.id}
                        item={file}
                        viewMode={viewMode}
                        isSelected={selectedItems.includes(file.id)}
                        onClick={(item) => {
                            if (item.type === 'file') {
                                onFileClick(item as FileItem);
                            }
                        }}
                        onDoubleClick={(item) => {
                            if (item.type === 'file') {
                                onFileDoubleClick(item as FileItem);
                            }
                        }}
                        onSelect={onFileSelect}
                        onRangeSelect={onRangeSelect}
                        ref={(el: HTMLDivElement | null) => setFileRef(file.id, el)}
                    />
                ))}

                {files.length === 0 && directories.length === 0 && (
                    <div className="file-list-empty">
                        <div className="empty-icon">📁</div>
                        <div className="empty-text">폴더가 비어있습니다</div>
                    </div>
                )}
            </div>

            {isDragging && <div style={dragStyle} />}
        </div>
    );
};
