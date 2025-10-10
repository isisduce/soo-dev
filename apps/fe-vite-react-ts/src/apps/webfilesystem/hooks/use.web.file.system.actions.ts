import { useCallback } from 'react';
import { useWebFileSystem } from '../context/web.file.system.context';
import type { WebFileSystem } from '../types/web.file.system.types';
import { webFileSystemApi } from '../api/web.file.system.api';

// 재귀적으로 디렉토리를 찾는 유틸리티 함수
const findDirectoryByPath = (directories: WebFileSystem.FileInfo[], targetId: string): WebFileSystem.FileInfo | null => {
    for (const dir of directories) {
        if (dir.path === targetId) {
            return dir;
        }
        if (dir.children) {
            const found = findDirectoryByPath(dir.children as WebFileSystem.FileInfo[], targetId);
            if (found) return found;
        }
    }
    return null;
};

export const useWebFileSystemActions = () => {
    const { state, dispatch } = useWebFileSystem();

    // 디렉토리 내용 로드
    const loadDirectoryContents = useCallback(async (apiServer: string, path: string) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            const response = await webFileSystemApi.getDirectoryContents(apiServer, path);
            const parsed = webFileSystemApi.parseDirectoryContentsResponse(response, path);
            if (parsed.error) {
                dispatch({
                    type: 'SET_ERROR',
                    payload: parsed.error
                });
            } else {
                dispatch({
                    type: 'SET_DIRECTORY_CONTENTS',
                    payload: parsed
                });
            }
        } catch (error) {
            let errorMessage = 'Unknown error';
            if (error instanceof Error) {
                if (error.message.includes('fetch')) {
                    errorMessage = '서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요. (포트: 8092)';
                } else {
                    errorMessage = error.message;
                }
            }
            dispatch({
                type: 'SET_ERROR',
                payload: errorMessage
            });
        }
    }, [dispatch]);

    // 디렉토리 트리 로드
    const loadDirectoryTree = useCallback(async (rootPath: string = '/', merge: boolean = false) => {
        try {
            // 실제 서버 API 사용
            const response = await webFileSystemApi.getDirectoryTree(rootPath);
            if (response.code === 200000 && response.result) {
                dispatch({
                    type: merge ? 'MERGE_DIRECTORIES' : 'SET_DIRECTORIES',
                    payload: response.result
                });
            }
        } catch (error) {
            console.error('Failed to load directory tree:', error);
            // 트리 로드 실패 시에도 사용자에게 알려줄 수 있음
            if (error instanceof Error && error.message.includes('fetch')) {
                dispatch({
                    type: 'SET_ERROR',
                    payload: '디렉토리 트리를 불러올 수 없습니다. 서버 연결을 확인해주세요.'
                });
            }
        }
    }, [dispatch]);

    // 디렉토리 탐색
    const navigateToDirectory = useCallback((apiServer: string, path: string) => {
        // 현재 경로 상태를 먼저 업데이트
        dispatch({ type: 'SET_CURRENT_PATH', payload: path });
        // 그 다음 디렉토리 내용 로드
        loadDirectoryContents(apiServer, path);
    }, [loadDirectoryContents, dispatch]);

    // 디렉토리 토글 (하위 디렉토리 동적 로딩)
    const toggleDirectory = useCallback(async (directoryId: string) => {
        const directory = findDirectoryByPath(state.directories, directoryId);
        if (!directory) return;

        // 이미 확장된 디렉토리는 축소
        if (directory.expanded) {
            dispatch({ type: 'TOGGLE_DIRECTORY', payload: directoryId });
            return;
        }

        // 이미 로드된 디렉토리는 하위 디렉토리 여부에 따라 처리
        if (directory.hasLoadedChildren) {
            if (directory.children && directory.children.length > 0) {
                // 하위 디렉토리가 있으면 확장
                dispatch({ type: 'TOGGLE_DIRECTORY', payload: directoryId });
            }
            // 하위 디렉토리가 없으면 아무것도 하지 않음 (확장 모션 없음)
            return;
        }

        // 첫 번째 로드 시에는 일단 로딩 상태로 설정
        dispatch({
            type: 'SET_DIRECTORY_LOADING',
            payload: { directoryId, isLoading: true }
        });

        try {
            const response = await webFileSystemApi.getDirectoryContents(directory.path);
            const parsed = webFileSystemApi.parseDirectoryContentsResponse(response, directory.path);
            // 하위 디렉토리만 필터링
            const subDirectories = parsed.directories;
            // 자식 데이터 설정
            dispatch({
                type: 'SET_DIRECTORY_CHILDREN',
                payload: { directoryId, children: subDirectories }
            });
            // 하위 디렉토리가 있을 때만 확장
            if (subDirectories.length > 0) {
                dispatch({ type: 'TOGGLE_DIRECTORY', payload: directoryId });
            }
        } catch (error) {
            console.error('Failed to load subdirectories:', error);
            // 로딩 실패 시에도 완료 상태로 설정
            dispatch({
                type: 'SET_DIRECTORY_CHILDREN',
                payload: { directoryId, children: [] }
            });
        }
    }, [dispatch, state.directories]);

    // 아이템 선택
    const selectItem = useCallback((itemId: string) => {
        if (state.selectedItems.includes(itemId)) {
            dispatch({ type: 'DESELECT_ITEM', payload: itemId });
        } else {
            dispatch({ type: 'SELECT_ITEM', payload: itemId });
        }
    }, [state.selectedItems, dispatch]);

    // 선택 해제
    const clearSelection = useCallback(() => {
        dispatch({ type: 'CLEAR_SELECTION' });
    }, [dispatch]);

    // 다중 선택 (드래그 선택용)
    const selectMultipleItems = useCallback((itemIds: string[]) => {
        // 기존 선택을 모두 해제하고 새로운 아이템들 선택
        dispatch({ type: 'CLEAR_SELECTION' });
        itemIds.forEach(itemId => {
            dispatch({ type: 'SELECT_ITEM', payload: itemId });
        });
    }, [dispatch]);

    // 범위 선택 (Shift + 클릭용)
    const selectRange = useCallback((endItemId: string) => {
        if (!state.lastSelectedItem) {
            // 마지막 선택 아이템이 없으면 일반 선택
            dispatch({ type: 'SELECT_ITEM', payload: endItemId });
            return;
        }

        dispatch({
            type: 'SELECT_RANGE',
            payload: {
                startId: state.lastSelectedItem,
                endId: endItemId
            }
        });
    }, [state.lastSelectedItem, dispatch]);

    // 뷰 모드 변경
    const toggleViewMode = useCallback(() => {
        dispatch({ type: 'TOGGLE_VIEW_MODE' });
    }, [dispatch]);

    const setViewMode = useCallback((mode: WebFileSystem.ItemViewMode) => {
        dispatch({ type: 'SET_VIEW_MODE', payload: mode });
    }, [dispatch]);

    // 상위 디렉토리로 이동
    const navigateUp = useCallback((apiServer: string) => {
        const currentPath = state.currentPath;
        if (!currentPath) return;

        // 경로 정규화 (하지만 원본 형태 유지)
        const normalizePath = (path: string) => {
            return path.replace(/\\/g, '/').replace(/\/+$/, '');
        };

        const normalizedCurrent = normalizePath(currentPath);
        const allowedPaths = state.allowedPaths || [];

        // allowedPaths 중에서 현재 경로가 속한 루트 찾기
        const belongsToRoot = allowedPaths.find((rootPath: string) => {
            const normalizedRoot = normalizePath(rootPath);
            return  normalizedCurrent === normalizedRoot ||
                    normalizedCurrent.startsWith(normalizedRoot + '/');
        });

        if (!belongsToRoot) {
            // allowedPaths가 없거나 속한 루트를 찾을 수 없는 경우 기본 처리
            const pathParts = normalizedCurrent.split('/');
            if (pathParts.length <= 1) return;

            const parentPath = pathParts.slice(0, -1).join('/') || '/';
            navigateToDirectory(apiServer, parentPath);
            return;
        }

        const normalizedRoot = normalizePath(belongsToRoot);

        // 현재 경로가 루트와 같다면 상위로 갈 수 없음
        if (normalizedCurrent === normalizedRoot) {
            return;
        }

        // 상위 경로 계산 - Windows 스타일 경로로 복원
        const pathParts = normalizedCurrent.split('/');
        const parentPathNormalized = pathParts.slice(0, -1).join('/');

        // 상위 경로가 루트보다 상위로 가지 않도록 제한
        if (parentPathNormalized.length < normalizedRoot.length) {
            // 루트로 이동 (원본 경로 사용)
            navigateToDirectory(apiServer, belongsToRoot);
        } else {
            // Windows 경로 형태로 복원하여 이동
            let parentPath = parentPathNormalized;

            // Windows 경로인 경우 백슬래시로 복원
            if (currentPath.includes('\\')) {
                parentPath = parentPathNormalized.replace(/\//g, '\\');
                // 드라이브 루트인 경우 끝에 백슬래시 추가
                if (parentPath.match(/^[A-Z]:$/)) {
                    parentPath += '\\';
                }
            }

            console.log('Navigating up from:', currentPath, 'to:', parentPath);
            navigateToDirectory(apiServer, parentPath);
        }
    }, [state.currentPath, state.allowedPaths, navigateToDirectory]);

    return {
        // State
        ...state,

        // Actions
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
        setViewMode,
    };
};
