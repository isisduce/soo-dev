export namespace WebFileSystem {
    export type FileType = 'file' | 'directory' | 'symlink' | 'junction';
    export type ItemViewMode = 'icon' | 'list' | 'detail';
    export interface FileInfo {
        name: string;
        path: string;
        type: FileType;
        size: number;
        extension: string;
        createdAt?: Date | string;
        modifiedAt?: Date | string;
        isReadable: boolean;
        isWritable: boolean;
        isExecutable: boolean;
        isHidden: boolean;
        isSymbolicLink: boolean;
        isJunctionPoint: boolean;
        linkTarget?: string;
        parentPath?: string;
        hasChildren?: boolean;
        children?: FileInfo[];
        expanded?: boolean;
        isLoading?: boolean;
        hasLoadedChildren?: boolean;
    }
    export interface DirectoryContents {
        currentPath: string;
        directories: FileInfo[];
        files: FileInfo[];
    }
    export interface State {
        apiServer: string;
        rootPath: string;
        initialPath: string;
        allowedPaths: string[];
        maxDepth: number;
        enableHiddenFiles: boolean;
        currentPath: string;
        directories: FileInfo[];
        currentDirectories: FileInfo[];
        files: FileInfo[];
        selectedItems: string[];
        lastSelectedItem?: string | null;
        viewMode: ItemViewMode;
        loading: boolean;
        error?: string | null;
    }
}
