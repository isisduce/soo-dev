import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { FileSystemState, DirectoryItem, FileItem, ServerConfig } from '../types';

// 초기 상태
const initialState: FileSystemState = {
    currentPath: '/',
    directories: [],
    currentDirectories: [],
    files: [],
    selectedItems: [],
    lastSelectedItem: null,
    viewMode: 'list',
    loading: false,
    error: null,
    serverConfig: undefined,
};

// 액션 타입들
export type FileSystemAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_CURRENT_PATH'; payload: string }
    | { type: 'SET_DIRECTORIES'; payload: DirectoryItem[] }
    | { type: 'MERGE_DIRECTORIES'; payload: DirectoryItem[] }
    | { type: 'SET_FILES'; payload: FileItem[] }
    | { type: 'SET_DIRECTORY_CONTENTS'; payload: { directories: DirectoryItem[]; files: FileItem[]; currentPath: string } }
    | { type: 'SET_SERVER_CONFIG'; payload: ServerConfig }
    | { type: 'TOGGLE_DIRECTORY'; payload: string }
    | { type: 'SET_DIRECTORY_LOADING'; payload: { directoryId: string; isLoading: boolean } }
    | { type: 'SET_DIRECTORY_CHILDREN'; payload: { directoryId: string; children: DirectoryItem[] } }
    | { type: 'SELECT_ITEM'; payload: string }
    | { type: 'DESELECT_ITEM'; payload: string }
    | { type: 'SELECT_RANGE'; payload: { startId: string; endId: string } }
    | { type: 'CLEAR_SELECTION' }
    | { type: 'TOGGLE_VIEW_MODE' }
    | { type: 'SET_VIEW_MODE'; payload: 'list' | 'icons' };

// 리듀서
function fileSystemReducer(state: FileSystemState, action: FileSystemAction): FileSystemState {
    // 재귀적으로 디렉토리 토글을 처리하는 헬퍼 함수
    const toggleDirectoryRecursive = (directories: DirectoryItem[], targetId: string): DirectoryItem[] => {
        return directories.map(dir => {
            if (dir.id === targetId) {
                return { ...dir, expanded: !dir.expanded };
            }
            if (dir.children) {
                return {
                    ...dir,
                    children: toggleDirectoryRecursive(dir.children as DirectoryItem[], targetId)
                };
            }
            return dir;
        });
    };

    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload };

        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false };

        case 'SET_CURRENT_PATH':
            return { ...state, currentPath: action.payload };

        case 'SET_DIRECTORIES':
            return { ...state, directories: action.payload };

        case 'MERGE_DIRECTORIES':
            // 기존 디렉토리와 새로운 디렉토리를 병합
            const existingPaths = new Set(state.directories.map(dir => dir.path));
            const newDirectories = action.payload.filter(dir => !existingPaths.has(dir.path));
            return {
                ...state,
                directories: [...state.directories, ...newDirectories]
            };

        case 'SET_FILES':
            return { ...state, files: action.payload };

        case 'SET_DIRECTORY_CONTENTS':
            return {
                ...state,
                // directories는 트리용으로 유지, currentDirectories는 파일 목록용으로 업데이트
                currentDirectories: action.payload.directories,
                files: action.payload.files,
                currentPath: action.payload.currentPath,
                loading: false,
                error: null,
            };

        case 'SET_SERVER_CONFIG':
            return {
                ...state,
                serverConfig: action.payload,
            };

        case 'TOGGLE_DIRECTORY':
            return {
                ...state,
                directories: toggleDirectoryRecursive(state.directories, action.payload),
            };

        case 'SET_DIRECTORY_CHILDREN':
            // 재귀적으로 디렉토리의 자식들을 설정하는 헬퍼 함수
            const setDirectoryChildrenRecursive = (directories: DirectoryItem[], targetId: string, children: DirectoryItem[]): DirectoryItem[] => {
                return directories.map(dir => {
                    if (dir.id === targetId) {
                        return {
                            ...dir,
                            children: children,
                            hasLoadedChildren: true,
                            isLoading: false
                        };
                    }
                    if (dir.children) {
                        return {
                            ...dir,
                            children: setDirectoryChildrenRecursive(dir.children as DirectoryItem[], targetId, children)
                        };
                    }
                    return dir;
                });
            };

            return {
                ...state,
                directories: setDirectoryChildrenRecursive(state.directories, action.payload.directoryId, action.payload.children),
            };

        case 'SET_DIRECTORY_LOADING':
            // 재귀적으로 디렉토리의 로딩 상태를 설정하는 헬퍼 함수
            const setDirectoryLoadingRecursive = (directories: DirectoryItem[], targetId: string, isLoading: boolean): DirectoryItem[] => {
                return directories.map(dir => {
                    if (dir.id === targetId) {
                        return { ...dir, isLoading: isLoading };
                    }
                    if (dir.children) {
                        return {
                            ...dir,
                            children: setDirectoryLoadingRecursive(dir.children as DirectoryItem[], targetId, isLoading)
                        };
                    }
                    return dir;
                });
            };

            return {
                ...state,
                directories: setDirectoryLoadingRecursive(state.directories, action.payload.directoryId, action.payload.isLoading),
            };

        case 'SELECT_ITEM':
            return {
                ...state,
                selectedItems: [...state.selectedItems, action.payload],
                lastSelectedItem: action.payload,
            };

        case 'DESELECT_ITEM':
            return {
                ...state,
                selectedItems: state.selectedItems.filter(id => id !== action.payload),
            };

        case 'SELECT_RANGE':
            // 현재 파일 목록에서 시작과 끝 인덱스 찾기
            const allItems = [...state.directories, ...state.files];
            const startIndex = allItems.findIndex(item => item.id === action.payload.startId);
            const endIndex = allItems.findIndex(item => item.id === action.payload.endId);

            if (startIndex === -1 || endIndex === -1) {
                return state;
            }

            const minIndex = Math.min(startIndex, endIndex);
            const maxIndex = Math.max(startIndex, endIndex);
            const rangeItems = allItems.slice(minIndex, maxIndex + 1).map(item => item.id);

            // 중복 제거하면서 합치기
            const newSelectedItems = [...state.selectedItems];
            rangeItems.forEach(id => {
                if (!newSelectedItems.includes(id)) {
                    newSelectedItems.push(id);
                }
            });

            return {
                ...state,
                selectedItems: newSelectedItems,
                lastSelectedItem: action.payload.endId,
            };

        case 'CLEAR_SELECTION':
            return {
                ...state,
                selectedItems: [],
                lastSelectedItem: null,
            };

        case 'TOGGLE_VIEW_MODE':
            return {
                ...state,
                viewMode: state.viewMode === 'list' ? 'icons' : 'list',
            };

        case 'SET_VIEW_MODE':
            return {
                ...state,
                viewMode: action.payload,
            };

        default:
            return state;
    }
}

// Context 타입
interface FileSystemContextType {
    state: FileSystemState;
    dispatch: React.Dispatch<FileSystemAction>;
}

// Context 생성
const FileSystemContext = createContext<FileSystemContextType | undefined>(undefined);

// Provider 컴포넌트
interface FileSystemProviderProps {
    children: ReactNode;
}

export const FileSystemProvider: React.FC<FileSystemProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(fileSystemReducer, initialState);

    return (
        <FileSystemContext.Provider value={{ state, dispatch }}>
            {children}
        </FileSystemContext.Provider>
    );
};

// Custom Hook
export const useFileSystem = () => {
    const context = useContext(FileSystemContext);
    if (!context) {
        throw new Error('useFileSystem must be used within a FileSystemProvider');
    }
    return context;
};
