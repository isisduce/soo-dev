export interface FileItem {
    id: string;
    name: string;
    type: 'file';
    extension: string;
    size: number;
    lastModified: Date | string;
    createdDate?: Date | string;
    path: string;
}

export interface DirectoryItem {
    id: string;
    name: string;
    type: 'directory';
    path: string;
    lastModified?: Date | string;
    createdDate?: Date | string;
    children?: (FileItem | DirectoryItem)[];
    expanded?: boolean;
    isLoading?: boolean;
    hasLoadedChildren?: boolean;
}

export type FileSystemItem = FileItem | DirectoryItem;

export interface DirectoryContents {
    directories: DirectoryItem[];
    files: FileItem[];
    currentPath: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface ServerConfig {
    rootPath: string;
    allowedPaths: string[];
    maxDepth: number;
    enableHiddenFiles: boolean;
}

export interface FileSystemState {
    currentPath: string;
    directories: DirectoryItem[];           // 트리 구조용 디렉토리들
    currentDirectories: DirectoryItem[];   // 현재 경로의 디렉토리들 (파일 목록용)
    files: FileItem[];
    selectedItems: string[];
    lastSelectedItem: string | null;
    viewMode: 'list' | 'icons';
    loading: boolean;
    error: string | null;
    serverConfig?: ServerConfig;
}
