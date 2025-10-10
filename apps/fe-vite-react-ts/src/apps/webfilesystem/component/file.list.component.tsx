import React, { useState, useRef, useCallback } from 'react';
import type { WebFileSystem } from '../types/web.file.system.types';
import { FileItemComponent } from './file.item.component';
import './file.list.component.css';

interface FileListProps {
    directories: WebFileSystem.FileInfo[];
    files: WebFileSystem.FileInfo[];
    viewMode: WebFileSystem.ViewMode;
    selectedItems: string[];
    onFileClick: (file: WebFileSystem.FileInfo) => void;
    onFileDoubleClick: (file: WebFileSystem.FileInfo) => void;
    onDirectoryClick: (directory: WebFileSystem.FileInfo) => void;
    onDirectoryDoubleClick: (directory: WebFileSystem.FileInfo) => void;
    onFileSelect: (fileId: string) => void;
    onMultiSelect: (fileIds: string[]) => void;
    onRangeSelect: (fileId: string) => void;
    onClearSelection: () => void;
}

export const FileListComponent: React.FC<FileListProps> = ({
    directories,
    files,
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
        if (target.closest('.file-item-icon') ||
            target.closest('.file-item-list') ||
            target.closest('.file-checkbox')) {
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
                        key={dir.path}
                        item={dir}
                        viewMode={viewMode}
                        isSelected={selectedItems.includes(dir.path)}
                        onClick={(item) => {
                            if (item.type === 'directory') {
                                onDirectoryClick(item);
                            }
                        }}
                        onDoubleClick={(item) => {
                            if (item.type === 'directory') {
                                onDirectoryDoubleClick(item);
                            }
                        }}
                        onSelect={onFileSelect}
                        onRangeSelect={onRangeSelect}
                        ref={(el: HTMLDivElement | null) => setFileRef(dir.path, el)}
                    />
                ))}

                {/* 파일들을 다음에 표시 */}
                {files.map((file) => (
                    <FileItemComponent
                        key={file.path}
                        item={file}
                        viewMode={viewMode}
                        isSelected={selectedItems.includes(file.path)}
                        onClick={(item) => {
                            if (item.type === 'file') {
                                onFileClick(item);
                            }
                        }}
                        onDoubleClick={(item) => {
                            if (item.type === 'file') {
                                onFileDoubleClick(item);
                            }
                        }}
                        onSelect={onFileSelect}
                        onRangeSelect={onRangeSelect}
                        ref={(el: HTMLDivElement | null) => setFileRef(file.path, el)}
                    />
                ))}

                {files.length === 0 && directories.length === 0 && (
                    <div className="file-list-empty">
                        <div className="empty-icon">📁</div>
                        <div className="empty-text">Empty folder</div>
                    </div>
                )}
            </div>

            {isDragging && <div style={dragStyle} />}
        </div>
    );
};
