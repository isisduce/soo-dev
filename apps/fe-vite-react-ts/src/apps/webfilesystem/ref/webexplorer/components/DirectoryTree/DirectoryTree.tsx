import React from 'react';
import type { DirectoryItem } from '../../types';
import './DirectoryTree.css';

interface DirectoryTreeProps {
    directories: DirectoryItem[];
    currentPath: string;
    allowedPaths?: string[];
    onDirectoryClick: (path: string) => void;
    onDirectoryToggle: (directoryId: string) => void;
    onPathSelect?: (path: string) => void;
    scrollToItem?: boolean; // 강제 스크롤 트리거용
}

interface DirectoryNodeProps {
    directory: DirectoryItem;
    level: number;
    currentPath: string;
    onDirectoryClick: (path: string) => void;
    onDirectoryToggle: (directoryId: string) => void;
}

const DirectoryNode: React.FC<DirectoryNodeProps> = ({
    directory,
    level,
    currentPath,
    onDirectoryClick,
    onDirectoryToggle,
}) => {
    const isActive = currentPath === directory.path;

    // 현재 경로가 이 디렉토리의 하위에 있는지 확인
    const isInCurrentPath = React.useMemo(() => {
        const normalizePath = (p: string) => p.replace(/\\/g, '/').replace(/\/+$/, '');
        const normalizedCurrent = normalizePath(currentPath);
        const normalizedDir = normalizePath(directory.path);

        return normalizedCurrent.startsWith(normalizedDir + '/') || normalizedCurrent === normalizedDir;
    }, [currentPath, directory.path]);

    // 현재 경로에 포함되어 있으면 자동으로 확장
    React.useEffect(() => {
        if (isInCurrentPath && !directory.expanded && !isActive) {
            // 현재 경로에 포함되어 있고, 아직 확장되지 않았으며, 현재 선택된 경로가 아닌 경우 확장
            onDirectoryToggle(directory.id);
        }
    }, [isInCurrentPath, directory.expanded, directory.id, onDirectoryToggle, isActive]);

    // 확장 아이콘 표시 조건:
    // 1. 아직 로드하지 않은 디렉토리 (잠재적으로 하위 디렉토리가 있을 수 있음)
    // 2. 이미 로드했고 하위 디렉토리가 있는 경우
    const shouldShowToggle = !directory.hasLoadedChildren ||
                            (directory.hasLoadedChildren && directory.children && directory.children.length > 0);

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDirectoryToggle(directory.id);
    };

    const handleClick = () => {
        onDirectoryClick(directory.path);
    };

    return (
        <div className="directory-node">
            <div
                className={`directory-item ${isActive ? 'active' : ''}`}
                style={{ paddingLeft: `${level * 20 + 8}px` }}
                onClick={handleClick}
            >
                <span
                    className={`directory-toggle ${shouldShowToggle ? 'has-children' : ''} ${directory.expanded ? 'expanded' : ''
                        }`}
                    onClick={handleToggle}
                >
                    {shouldShowToggle ? (directory.expanded ? '▼' : '▶') : ''}
                </span>
                <span className="directory-icon">📁</span>
                <span className="directory-name">{directory.name}</span>
            </div>

            {directory.expanded && (
                <div className="directory-children">
                    {directory.isLoading ? (
                        // 로딩 중
                        <div
                            className="directory-loading"
                            style={{ paddingLeft: `${(level + 1) * 20 + 8}px` }}
                        >
                            로딩 중...
                        </div>
                    ) : directory.hasLoadedChildren && directory.children && directory.children.length > 0 ? (
                        // 하위 디렉토리가 있음
                        directory.children
                            .filter((child) => child.type === 'directory')
                            .map((child) => (
                                <DirectoryNode
                                    key={child.id}
                                    directory={child as DirectoryItem}
                                    level={level + 1}
                                    currentPath={currentPath}
                                    onDirectoryClick={onDirectoryClick}
                                    onDirectoryToggle={onDirectoryToggle}
                                />
                            ))
                    ) : directory.hasLoadedChildren ? (
                        // 하위 디렉토리가 없음 (아무것도 표시하지 않음)
                        null
                    ) : null}
                </div>
            )}
        </div>
    );
};

export const DirectoryTree: React.FC<DirectoryTreeProps> = ({
    directories,
    currentPath,
    allowedPaths = [],
    onDirectoryClick,
    onDirectoryToggle,
    onPathSelect,
    scrollToItem = false,
}) => {
    // 각 루트 경로의 확장 상태를 관리
    const [expandedRoots, setExpandedRoots] = React.useState<Set<string>>(new Set());

    // 스크롤 컨테이너 참조
    const treeContentRef = React.useRef<HTMLDivElement>(null);

    // 현재 선택된 아이템으로 스크롤
    const scrollToCurrentItem = React.useCallback(() => {
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
    React.useEffect(() => {
        // 약간의 지연을 두어 DOM 업데이트 후 스크롤
        const timer = setTimeout(() => {
            scrollToCurrentItem();
        }, 100);

        return () => clearTimeout(timer);
    }, [currentPath, scrollToCurrentItem]);

    // scrollToItem prop이 변경될 때도 스크롤
    React.useEffect(() => {
        if (scrollToItem) {
            const timer = setTimeout(() => {
                scrollToCurrentItem();
            }, 200); // 좀 더 긴 지연으로 트리 확장 후 스크롤

            return () => clearTimeout(timer);
        }
    }, [scrollToItem, scrollToCurrentItem]);

    // 현재 경로에 해당하는 루트를 자동으로 확장
    React.useEffect(() => {
        if (currentPath && allowedPaths.length > 0) {
            const normalizePath = (p: string) => p.replace(/\\/g, '/').replace(/\/+$/, '');
            const normalizedCurrent = normalizePath(currentPath);

            // 현재 경로를 포함하는 모든 루트를 찾아서 확장
            const matchingRoots = allowedPaths.filter(path => {
                const normalizedRoot = normalizePath(path);
                return normalizedCurrent === normalizedRoot ||
                       normalizedCurrent.startsWith(normalizedRoot + '/');
            });

            // 가장 구체적인 루트만 확장 (가장 긴 경로)
            if (matchingRoots.length > 0) {
                const mostSpecificRoot = matchingRoots.reduce((longest, current) => {
                    const normalizedCurrent = normalizePath(current);
                    const normalizedLongest = normalizePath(longest);
                    return normalizedCurrent.length > normalizedLongest.length ? current : longest;
                });

                setExpandedRoots(prev => {
                    const newSet = new Set<string>();
                    newSet.add(mostSpecificRoot);
                    return newSet;
                });
            }
        }
    }, [currentPath, allowedPaths]); // currentPath 의존성 다시 추가

    // Helper functions for path display
    const getDisplayName = (path: string): string => {
        if (path === 'C:\\' || path === 'C:') return '로컬 드라이브 (C:)';
        if (path === 'D:\\' || path === 'D:') return '데이터 드라이브 (D:)';
        if (path === 'E:\\' || path === 'E:') return '드라이브 (E:)';
        if (path.includes('Users\\Administrator') || path.includes('Users/Administrator')) return '사용자 홈';
        if (path === '/develop') return '개발환경';
        if (path === '/nas') return 'NAS 스토리지';

        const parts = path.split(/[\\/]/).filter(Boolean);
        return parts.length > 0 ? parts[parts.length - 1] : path;
    };

    const getIcon = (path: string): string => {
        if (path === 'C:\\' || path === 'C:') return '💻';
        if (path === 'D:\\' || path === 'D:') return '💾';
        if (path === 'E:\\' || path === 'E:') return '💿';
        if (path.includes('Users')) return '🏠';
        if (path === '/develop') return '⚡';
        if (path === '/nas') return '🗄️';
        return '📁';
    };

    const isCurrentPath = (path: string): boolean => {
        const normalizePath = (p: string) => {
            let normalized = p.replace(/\\/g, '/');
            if (normalized.length > 1 && normalized.endsWith('/')) {
                normalized = normalized.slice(0, -1);
            }
            return normalized;
        };

        const normalizedCurrent = normalizePath(currentPath);
        const normalizedPath = normalizePath(path);

        // 정확히 일치하는 경우만 true
        return normalizedCurrent === normalizedPath;
    };

    // 루트 경로 확장/축소 토글
    const toggleRootExpansion = (path: string) => {
        setExpandedRoots(prev => {
            const newSet = new Set(prev);

            if (newSet.has(path)) {
                // 축소: 해당 루트 제거
                newSet.delete(path);
            } else {
                // 확장: 기존 확장된 루트들을 모두 축소하고 새로운 루트만 확장
                newSet.clear();
                newSet.add(path);
            }

            return newSet;
        });
    };

    // 루트 경로에 속한 디렉토리들을 반환 (다른 루트와 겹치지 않도록)
    const getDirectoriesForRoot = (rootPath: string) => {
        const normalizeForComparison = (p: string) => p.replace(/\\/g, '/').replace(/\/+$/, '');
        const normalizedRoot = normalizeForComparison(rootPath);

        // 현재 루트보다 더 구체적인 다른 루트들 찾기 (더 긴 경로)
        const moreSpecificRoots = allowedPaths
            .filter(path => path !== rootPath)
            .map(path => normalizeForComparison(path))
            .filter(path =>
                (path.startsWith(normalizedRoot + '/') || path.startsWith(normalizedRoot + '\\')) &&
                path.length > normalizedRoot.length
            );

        const filtered = directories.filter(directory => {
            const normalizedDir = normalizeForComparison(directory.path);

            // 현재 루트의 직접적인 하위 디렉토리인지 확인
            const isDirectChildOfRoot =
                (normalizedDir.startsWith(normalizedRoot + '/') ||
                 normalizedDir.startsWith(normalizedRoot + '\\')) &&
                normalizedDir !== normalizedRoot;

            if (!isDirectChildOfRoot) {
                return false;
            }

            // 더 구체적인 루트의 하위에 있는지 확인
            const isUnderMoreSpecificRoot = moreSpecificRoots.some(specificRoot =>
                normalizedDir.startsWith(specificRoot + '/') ||
                normalizedDir.startsWith(specificRoot + '\\') ||
                normalizedDir === specificRoot
            );

            // 더 구체적인 루트의 하위가 아닌 경우만 포함
            return !isUnderMoreSpecificRoot;
        });

        console.log(`getDirectoriesForRoot(${rootPath}):`, {
            normalizedRoot,
            totalDirectories: directories.length,
            filteredCount: filtered.length,
            moreSpecificRoots: moreSpecificRoots,
            filteredPaths: filtered.map(d => d.path).slice(0, 3) // 처음 3개만 표시
        });

        return filtered;
    };

    return (
        <div className="directory-tree">
            <div className="directory-tree-content" ref={treeContentRef}>
                {/* 접근 가능한 경로들을 루트로 표시 */}
                {allowedPaths.map((path, index) => {
                    const isExpanded = expandedRoots.has(path);
                    const rootDirectories = getDirectoriesForRoot(path);

                    return (
                        <div key={`root-${index}`} className="root-path-section">
                            <div
                                className={`directory-item root-path-item ${isCurrentPath(path) ? 'active' : ''}`}
                                onClick={() => {
                                    // 루트 항목 클릭 시 토글과 경로 선택
                                    toggleRootExpansion(path);
                                    onPathSelect?.(path);
                                }}
                            >
                                <button
                                    className="toggle-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleRootExpansion(path);
                                    }}
                                >
                                    {isExpanded ? '▼' : '▶'}
                                </button>

                                <span className="directory-icon">
                                    {getIcon(path)}
                                </span>
                                <span className="directory-name">
                                    {getDisplayName(path)}
                                </span>
                            </div>

                            {/* 확장된 경우에만 하위 디렉토리들 표시 */}
                            {isExpanded && rootDirectories.map((directory) => (
                                <DirectoryNode
                                    key={directory.id}
                                    directory={directory}
                                    level={1}
                                    currentPath={currentPath}
                                    onDirectoryClick={onDirectoryClick}
                                    onDirectoryToggle={onDirectoryToggle}
                                />
                            ))}
                        </div>
                    );
                })}

                {/* allowedPaths가 없는 경우 기존 방식으로 표시 */}
                {allowedPaths.length === 0 && directories.map((directory) => (
                    <DirectoryNode
                        key={directory.id}
                        directory={directory}
                        level={0}
                        currentPath={currentPath}
                        onDirectoryClick={onDirectoryClick}
                        onDirectoryToggle={onDirectoryToggle}
                    />
                ))}
            </div>
        </div>
    );
};
