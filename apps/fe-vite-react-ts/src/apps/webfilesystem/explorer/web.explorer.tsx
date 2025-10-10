import React, { useState, useRef, useCallback, useEffect } from 'react';
import { WebFileSystemProvider } from '../context/web.file.system.context';
import { WebExplorerContent } from './web.explorer.content';
import './web.explorer.dialog.css';

interface WebExplorerProps {
    open: boolean;
    onClose: () => void;
    onFocus?: () => void; // 다이얼로그 포커스 핸들러
    title: string;
    apiServer: string;
    rootPath?: string;
    initialPath?: string;
    dialogId?: string; // 다이얼로그 고유 ID 추가
    zIndex?: number; // z-index 제어
}

export const WebExplorer: React.FC<WebExplorerProps> = ({
    open,
    onClose,
    onFocus,
    title,
    apiServer,
    rootPath,
    initialPath,
    dialogId = 'default',
    zIndex = 1000
}) => {
    // 다이얼로그 ID를 기반으로 한 위치 오프셋 계산
    const getInitialPosition = () => {
        const dialogNumber = parseInt(dialogId.split('-')[1]) || 1;
        const offset = (dialogNumber - 1) * 50; // 각 다이얼로그마다 50px씩 오프셋

        return { x: 10 + offset, y: 10 + offset };
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
        position: { x: 10, y: 10 },
        size: { width: 1000, height: 700 }
    });

    const dialogRef = useRef<HTMLDivElement>(null);

    // 다이얼로그가 열릴 때 초기 위치 재설정
    useEffect(() => {
        if (open) {
            setPosition(getInitialPosition());
        }
    }, [open, dialogId]);

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

    if (!open) return null;

    return (
        <div
            ref={dialogRef}
            className={`web-explorer modeless ${isMaximized ? 'maximized' : ''}`}
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
                    <div className="resize-handle resize-handle-n"  onMouseDown={(e) => handleResizeStart(e, 'n')} />
                    <div className="resize-handle resize-handle-ne" onMouseDown={(e) => handleResizeStart(e, 'ne')} />
                    <div className="resize-handle resize-handle-e"  onMouseDown={(e) => handleResizeStart(e, 'e')} />
                    <div className="resize-handle resize-handle-se" onMouseDown={(e) => handleResizeStart(e, 'se')} />
                    <div className="resize-handle resize-handle-s"  onMouseDown={(e) => handleResizeStart(e, 's')} />
                    <div className="resize-handle resize-handle-sw" onMouseDown={(e) => handleResizeStart(e, 'sw')} />
                    <div className="resize-handle resize-handle-w"  onMouseDown={(e) => handleResizeStart(e, 'w')} />
                    <div className="resize-handle resize-handle-nw" onMouseDown={(e) => handleResizeStart(e, 'nw')} />
                </>
            )}

            {/* 다이얼로그 헤더 */}
            <div
                className={`web-explorer-header ${isDragging ? 'dragging' : ''}`}
                onMouseDown={handleDragStart}
            >
                <h2 className="web-explorer-title">
                    📁 {title}
                </h2>
                <div className="web-explorer-controls">
                    <button
                        className="dialog-control-button maximize"
                        onClick={handleMaximize}
                        title={isMaximized ? "Restore" : "Maximize"}
                    >
                        {isMaximized ? "🗗" : "🗖"}
                    </button>
                    <button
                        className="dialog-control-button close"
                        onClick={onClose}
                        title="Close"
                    >
                        ✕
                    </button>
                </div>
            </div>

            {/* 다이얼로그 콘텐츠 */}
            <div className="web-explorer-content">
                <WebFileSystemProvider>
                    <WebExplorerContent
                        apiServer={apiServer}
                        rootPath={rootPath}
                        initialPath={initialPath}
                    />
                </WebFileSystemProvider>
            </div>
        </div>
    );
};
