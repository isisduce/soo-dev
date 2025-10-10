export interface AllowedRoot {
    name: string;
    path: string;
}

export interface WebFilesystem {
    rootPath: string;
    uploadPath: string;
    allowedPaths: AllowedRoot[];
    maxDepth: number;
    enableHiddenFiles: boolean;
    showJunctionPoints: boolean;
    showSymbolicLinks: boolean;
    hideInaccessibleLinks: boolean;
}

export interface WebFileSystemBeEnvJson {
    webFilesystem: WebFilesystem;
}
