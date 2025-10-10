import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import type { TreeViewBaseItem } from '@mui/x-tree-view';
import { webFileSystemApi } from '../../api/web.file.system.api';
import type { WebFileSystem } from '../../types/web.file.system.types';

interface WebFileSystemTreeComponentProps {
    apiServer?: string;
    rootPath?: string;
    currentPath?: string;
    setCurrentPath?: (value: string) => void;
    fileList?: WebFileSystem.FileInfo[];
    showHidden?: boolean;
    showFiles?: boolean;
    fileExtensions?: string[];
    enableMultiSelect?: boolean;
    enableSelectDirectory?: boolean;
    setSelectedFiles?: (files: WebFileSystem.FileInfo[]) => void;
}

interface WebFileSystemTreeNodeProps {
    file: WebFileSystem.FileInfo;
    label: string;
    depth: number;
    currentPath: string;
    onClick: (path: string) => void;
    onToggle: (path: string, expanded?: boolean) => void;
}

const WebFileSystemTreeNode: React.FC<WebFileSystemTreeNodeProps> = ({
    file,
    label,
    depth,
    currentPath,
    onClick,
    onToggle,
}) => {
    const isActive = currentPath === file.path;

    // 현재 경로가 이 디렉토리의 하위에 있는지 확인
    const isInCurrentPath = useMemo(() => {
        const normalizePath = (p: string) => p.replace(/\\/g, '/').replace(/\/+$/, '');
        const normalizedCurrent = normalizePath(currentPath);
        const normalizedDir = normalizePath(file.path);
        return normalizedCurrent.startsWith(normalizedDir + '/') || normalizedCurrent === normalizedDir;
    }, [file.path, currentPath]);

    // 현재 경로에 포함되어 있으면 자동으로 확장
    useEffect(() => {
        if (isInCurrentPath && !file.expanded && !isActive) {
            // 현재 경로에 포함되어 있고, 아직 확장되지 않았으며, 현재 선택된 경로가 아닌 경우 확장
            onToggle(file.path);
        }
    }, [isInCurrentPath, file.path, file.expanded, onToggle, isActive]);

    // 확장 아이콘 표시 조건:
    // 1. 아직 로드하지 않은 디렉토리 (잠재적으로 하위 디렉토리가 있을 수 있음)
    // 2. 이미 로드했고 하위 디렉토리가 있는 경우
    const shouldShowToggle = !file.hasLoadedChildren ||
                            ( file.hasLoadedChildren && file.children && file.children.length > 0);

    const handleClick = () => {
        onClick(file.path);
    };

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggle(file.path);
    };

    return (
        <Box className="directory-node">
            <Box
                className={`directory-item ${isActive ? 'active' : ''}`}
                style={{ paddingLeft: `${depth * 20 + 8}px` }}
                onClick={handleClick}
            >
                <span
                    className={`directory-toggle ${shouldShowToggle ? 'has-children' : ''} ${file.expanded ? 'expanded' : ''
                        }`}
                    onClick={handleToggle}
                >
                    {shouldShowToggle ? (file.expanded ? '▼' : '▶') : ''}
                </span>
                <span className="directory-icon">📁</span>
                <span className="directory-name">{label}</span>
            </Box>

            {file.expanded && (
                <Box className="directory-children">
                    {file.isLoading ? (
                        // 로딩 중
                        <Box
                            className="directory-loading"
                            style={{ paddingLeft: `${(depth + 1) * 20 + 8}px` }}
                        >
                            Loading...
                        </Box>
                    ) : file.hasLoadedChildren && file.children && file.children.length > 0 ? (
                        // 하위 디렉토리가 있음
                        file.children
                            .filter((f) => f.type === 'directory')
                            .map((f) => (
                                <WebFileSystemTreeNode
                                    key={f.path}
                                    file={f as WebFileSystem.FileInfo}
                                    label={f.name}
                                    depth={depth + 1}
                                    currentPath={currentPath}
                                    onClick={onClick}
                                    onToggle={onToggle}
                                />
                            ))
                    ) : file.hasLoadedChildren ? (
                        // 하위 디렉토리가 없음 (아무것도 표시하지 않음)
                        null
                    ) : null}
                </Box>
            )}
        </Box>
    );
};

interface WebFileSystemTreeRootProps {
    files: WebFileSystem.FileInfo[];
    currentPath: string;
    rootPath: string;
    onClick: (path: string) => void;
    onToggle: (directoryId: string) => void;
    onPathSelect?: (path: string) => void;
    scrollToItem?: boolean; // 강제 스크롤 트리거용
}

export const WebFileSystemTreeRoot: React.FC<WebFileSystemTreeRootProps> = ({
    files,
    currentPath,
    rootPath,
    onClick,
    onToggle,
    onPathSelect,
    scrollToItem = false,
}) => {

    // 스크롤 컨테이너 참조
    const treeContentRef = useRef<HTMLDivElement>(null);

    // 현재 선택된 아이템으로 스크롤
    const scrollToCurrentItem = useCallback(() => {
        if (!treeContentRef.current || !currentPath) return;

        // 현재 경로에 해당하는 active 아이템 찾기
        const activeItem = treeContentRef.current.querySelector('.directory-item.active');
        if (activeItem) {
            activeItem.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }, [currentPath]);

    // currentPath가 변경될 때 스크롤
    useEffect(() => {
        // 약간의 지연을 두어 DOM 업데이트 후 스크롤
        const timer = setTimeout(() => {
            scrollToCurrentItem();
        }, 100);

        return () => clearTimeout(timer);
    }, [currentPath, scrollToCurrentItem]);

    // scrollToItem prop이 변경될 때도 스크롤
    useEffect(() => {
        if (scrollToItem) {
            const timer = setTimeout(() => {
                scrollToCurrentItem();
            }, 200); // 좀 더 긴 지연으로 트리 확장 후 스크롤

            return () => clearTimeout(timer);
        }
    }, [scrollToItem, scrollToCurrentItem]);

    // const isCurrentPath = (path: string): boolean => {
    //     const normalizePath = (p: string) => {
    //         let normalized = p.replace(/\\/g, '/');
    //         if (normalized.length > 1 && normalized.endsWith('/')) {
    //             normalized = normalized.slice(0, -1);
    //         }
    //         return normalized;
    //     };

    //     const normalizedCurrent = normalizePath(currentPath);
    //     const normalizedPath = normalizePath(path);

    //     // 정확히 일치하는 경우만 true
    //     return normalizedCurrent === normalizedPath;
    // };

    return (
        <Box className="directory-tree">
            <Box className="directory-tree-content" ref={treeContentRef}>
                <SimpleTreeView
                    sx={{ overflowX: 'hidden', flexGrow: 1 }}
                >
                    {files.map((file) => (
                        <WebFileSystemTreeNode
                            key={file.path}
                            file={file}
                            label={file.name}
                            depth={0}
                            currentPath={currentPath}
                            onClick={onClick}
                            onToggle={onToggle}
                        />
                    ))}
                </SimpleTreeView>
            </Box>
        </Box>
    );
};


export const WebFileSystemTreeComponent: React.FC<WebFileSystemTreeComponentProps> = (props: WebFileSystemTreeComponentProps) => {

    interface WebFileSystemTreeItem {
        id: string;
        label: string;
        hasChildren: boolean;
        children?: WebFileSystemTreeItem[];
        expanded?: boolean;
        file: WebFileSystem.FileInfo;
    }

    const getWebFileSystemTreeItem = (file: WebFileSystem.FileInfo) : WebFileSystemTreeItem => {
        return {
            id: file.path,
            label: file.name,
            hasChildren: !!file.hasChildren,
            children: undefined,
            expanded: false,
            file,
        };
    };

    const DUMMY: WebFileSystemTreeItem = getWebFileSystemTreeItem({
        path: '__dummy__',
        name: 'Loading...',
        type: 'directory',
        size: 0,
        hasChildren: true,
    });

    const rootPath = props.rootPath;

    if (!rootPath) {
        return <Box sx={{ p: 2, color: 'error.main' }}>Root path is not set.</Box>;
    }

    return (
        <Box className="directory-tree">
            <Box className="directory-tree-content">
                <WebFileSystemTreeRoot
                    files={[]}
                    currentPath={props.currentPath || ''}
                    rootPath={props.rootPath || ''}
                    onClick={(path) => {
                        if (props.setCurrentPath) {
                            props.setCurrentPath(path);
                        }
                        // if (props.setSelectedFiles) {
                        //     const selectedFile = (props.files || []).find(f => f.path === path);
                        //     if (selectedFile) {
                        //         props.setSelectedFiles([selectedFile]);
                        //     }
                        // }
                    }}
                    onToggle={(directoryId) => {
                        // 디렉토리 확장/축소 처리
                        // const file = (props.files || []).find(f => f.path === directoryId);
                        // if (file && file.type === 'directory') {
                        //     if (!file.expanded) {
                                // // 확장 요청
                                // webFileSystemApi.loadDirectoryContents(file.path, props.showHidden || false, props.showFiles || false, props.fileExtensions || [])
                                //     .then((children) => {
                                //         file.children = children;
                                //         file.hasLoadedChildren = true;
                                //         file.expanded = true;
                                //         // 강제 리렌더링을 위해 상태 업데이트
                                //         if (props.setCurrentPath) {
                                //             props.setCurrentPath(props.currentPath || '');
                                //         }
                                //     })
                                //     .catch((err) => {
                                //         console.error('Failed to load directory contents:', err);
                                //     });
                        //     } else {
                        //         // 축소 요청
                        //         file.expanded = false;
                        //         if (props.setCurrentPath) {
                        //             props.setCurrentPath(props.currentPath || '');
                        //         }
                        //     }
                        // }
                    }}
                    scrollToItem={false}
                />
                {/* <SimpleTreeView
                    // expandedItems={expandedItems}
                    // onExpandedItemsChange={handleNodeToggle}
                    sx={{ overflowX: 'hidden', flexGrow: 1 }}
                >
                    {renderTree(rootItems)}
                </SimpleTreeView> */}
            </Box>
        </Box>
    );

}
