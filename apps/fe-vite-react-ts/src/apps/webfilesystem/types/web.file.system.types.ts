import type { JSX } from "react";

export type FileType = 'file' | 'directory';
export type ViewMode = 'icon' | 'list' | 'detail';

export interface FileInfoDto {
    name: string;
    path: string;
    type: FileType;
    size: number;
    extension?: string;
    createdAt?: Date | string;
    modifiedAt?: Date | string;
    isReadable?: boolean;
    isWritable?: boolean;
    isExecutable?: boolean;
    isHidden?: boolean;
    isSymbolicLink?: boolean;
    isJunctionPoint?: boolean;
    linkTarget?: string;
    parentPath?: string;
    hasChildren?: boolean;
    //
    children?: FileInfoDto[];
    expanded?: boolean;
    isLoading?: boolean;
    hasLoadedChildren?: boolean;
}

export interface ToolbarButton {
    key: string;
    label: string;
    tooltip: string;
    icon: JSX.Element;
    onClick: () => void;
}

export interface DirectoryContents {
    currentPath: string;
    directories: FileInfoDto[];
    files: FileInfoDto[];
}

export interface State {
    apiServer: string;
    rootPath: string;
    initialPath: string;
    allowedPaths: string[];
    maxDepth: number;
    enableHiddenFiles: boolean;
    currentPath: string;
    directories: FileInfoDto[];            // 트리 구조용 디렉토리들
    currentDirectories: FileInfoDto[];     // 현재 경로의 디렉토리들 (파일 목록용)
    files: FileInfoDto[];
    selectedItems: string[];
    lastSelectedItem?: string | null;
    viewMode: ViewMode;
    loading: boolean;
    error?: string | null;
}
