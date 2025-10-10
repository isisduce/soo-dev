// FileInfoDto.java에 해당하는 TypeScript DTO

export interface FileInfoDto {
    name: string;
    path: string;
    type: string; // file, directory, symlink, junction
    size: number;
    extension?: string;
    createdAt: string; // ISO string
    modifiedAt: string; // ISO string
    isReadable: boolean;
    isWritable: boolean;
    isExecutable: boolean;
    isHidden: boolean;
    isSymbolicLink: boolean;
    isJunctionPoint: boolean;
    linkTarget?: string;
    parentPath?: string;
}
