import { ApiCode, ApiResponse, type ApiResponseDTO } from '../../../libs/dto/api.response.dto';
import type { DirectoryContents, FileInfoDto } from '../types/web.file.system.types';

export const FileType = {
    DIRECTORY: 'directory',
    FILE: 'file'
} as const;

export const webFileSystemApi = {

    /**
     * get rootPath
     */
    getRootPath: async (apiServer?: string): Promise<ApiResponseDTO<string>> => {
        if (!apiServer) {
            return ApiResponse.failure<string>(
                400000,
                'API server is not configured'
            );
        }
        try {
            const response = await fetch(`${apiServer}/api/webfilesystem/env/rootPath`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to fetch root path:', error);
            return ApiResponse.failure<string>(
                ApiCode.CODE.ERROR_NETWORK,
                error instanceof Error ? error.message : ApiCode.CODE.ERROR_NETWORK_MSG
            );
        }
    },

    /**
     * @description 특정 경로의 파일/디렉토리 정보를 가져옵니다
     * @param apiServer
     * @param pathname
     * @returns WebFileSystem.FileInfo
     */
    getInfo: async (apiServer?: string, pathname?: string): Promise<ApiResponseDTO<FileInfoDto>> => {
        if (!apiServer) {
            throw new Error('ApiServer is not set.');
        }
        if (!pathname) {
            throw new Error('Pathname is not set.');
        }
        const url = new URL(`${apiServer}/api/webfilesystem/info`);
        url.searchParams.append('pathname', pathname);
        const response = await fetch(url.toString());
        const data = await response.json() as ApiResponseDTO<FileInfoDto>;
        return data;
    },

    /**
     * 파일 및 디렉토리 목록을 가져옵니다
     */
    getList: async (apiServer?: string, pathname?: string): Promise<ApiResponseDTO<FileInfoDto[]>> => {
        if (!apiServer) {
            throw new Error('ApiServer is not set.');
        }
        if (!pathname) {
            throw new Error('Pathname is not set.');
        }
        const url = new URL(`${apiServer}/api/webfilesystem/list`);
        // console.log('Fetching file list from:', url.toString());
        url.searchParams.append('pathname', pathname);
        const response = await fetch(url.toString());
        const data = await response.json() as ApiResponseDTO<FileInfoDto[]>;
        return data;
    },

    /**
     * 지정된 경로의 디렉토리 내용을 가져옵니다
     */
    getDirectoryContents: async (apiServer?: string, pathname?: string): Promise<ApiResponseDTO<DirectoryContents>> => {
        if (!apiServer) {
            return ApiResponse.failure<DirectoryContents>(
                400000,
                'API server is not configured',
                { directories: [], files: [], currentPath: '' }
            );
        }
        if (!pathname) {
            return ApiResponse.failure<DirectoryContents>(
                400000,
                'Pathname is required',
                { directories: [], files: [], currentPath: '' }
            );
        }
        try {
            const params = new URLSearchParams();
            params.append('pathname', pathname);
            const response = await fetch(`${apiServer}/api/webfilesystem/list?${params.toString()}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to fetch directory contents:', error);
            return ApiResponse.failure<DirectoryContents>(
                ApiCode.CODE.ERROR_NETWORK,
                error instanceof Error ? error.message : ApiCode.CODE.ERROR_NETWORK_MSG,
                { directories: [], files: [], currentPath: '' }
            );
        }
    },

    /**
     * 서버 응답을 프론트엔드에서 바로 사용할 수 있는 디렉토리 구조로 변환
     */
    parseDirectoryContentsResponse: (response: ApiResponseDTO<DirectoryContents>, pathname: string = ''): { directories: FileInfoDto[]; files: FileInfoDto[]; currentPath: string; error?: string; code?: number } => {
        if (!response || response.code !== 200000 || !Array.isArray(response.result)) {
            return {
                directories: [],
                files: [],
                currentPath: pathname,
                error: response?.message || 'Failed to get directory contents',
                code: response?.code
            };
        }
        const directories: FileInfoDto[] = [];
        const files: FileInfoDto[] = [];
        response.result.forEach((item: any) => {
            if (item.type === 'directory') {
                directories.push(item);
            } else {
                files.push(item);
            }
        });
        return {
            directories,
            files,
            currentPath: pathname
        };
    },

    /**
     * 디렉토리 트리 구조를 가져옵니다
     */
    getDirectoryTree: async (rootPath: string = '/'): Promise<ApiResponseDTO<FileInfoDto[]>> => {
        try {
            // 루트 디렉토리의 내용을 가져와서 트리 구조로 변환
            const result = await webFileSystemApi.getDirectoryContents(rootPath);
            if (result.code === 200000 && result.result) {
                return ApiResponse.successWithMessage<FileInfoDto[]>(
                    'Directory tree fetched successfully',
                    result.result.directories
                );
            } else {
                return ApiResponse.failure<FileInfoDto[]>(
                    400000,
                    result.message || 'Failed to get directory tree',
                    []
                );
            }
        } catch (error) {
            console.error('Failed to fetch directory tree:', error);
            return ApiResponse.error<FileInfoDto[]>(
                ApiCode.CODE.ERROR_NETWORK,
                error instanceof Error ? error.message : 'Network error',
                []
            );
        }
    },

    // downloadFile: async (path: string): Promise<Blob> => {
    //     const url = new URL(`${API_BASE}/download`);
    //     url.searchParams.append('path', path);
    //     const response = await fetch(url.toString());
    //     if (!response.ok) {
    //         throw new Error('파일 다운로드에 실패했습니다.');
    //     }
    //     return response.blob();
    // },

    // readTextFile: async (path: string): Promise<string> => {
    //     const url = new URL(`${API_BASE}/read`);
    //     url.searchParams.append('path', path);
    //     const response = await fetch(url.toString());
    //     const json = await response.json() as ApiResponseDTO<string>;
    //     if (json.code !== 200) {
    //         throw new Error(json.message);
    //     }
    //     return json.result;
    // },


};
