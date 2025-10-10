import type { DirectoryContents, DirectoryItem, ApiResponse } from '../types';

// 환경변수에서 백엔드 서버 URL 가져오기
// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8092/api/file-explorer';
const API_BASE_URL = 'http://localhost:8092/api/file-explorer';

export class FileSystemAPI {

    /**
     * 지정된 경로의 디렉토리 내용을 가져옵니다
     */
    static async getDirectoryContents(path: string = '/'): Promise<ApiResponse<DirectoryContents>> {
        try {
            const params = new URLSearchParams();
            if (path && path !== '/') {
                params.append('path', path);
            }

            const response = await fetch(`${API_BASE_URL}/list?${params.toString()}`);
            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || 'Failed to fetch directory contents'
                };
            }

            if (result.success) {
                // 서버 응답을 클라이언트 형식으로 변환
                const directories: DirectoryItem[] = [];
                const files: any[] = [];

                result.data.forEach((item: any) => {
                    if (item.type === 'directory') {
                        console.log('Directory dates - lastModified:', item.lastModified, 'createdDate:', item.createdDate);
                        const directory: DirectoryItem = {
                            id: item.path,
                            name: item.name,
                            path: item.path,
                            type: 'directory',
                            lastModified: item.lastModified,
                            createdDate: item.createdDate || item.lastModified,
                            expanded: false,
                            children: []
                        };
                        directories.push(directory);
                    } else {
                        files.push({
                            id: item.path,
                            name: item.name,
                            path: item.path,
                            type: 'file',
                            size: item.size || 0,
                            lastModified: item.lastModified || new Date().toISOString(),
                            createdDate: item.createdDate || item.lastModified || new Date().toISOString(),
                            extension: item.extension || ''
                        });
                    }
                });

                return {
                    success: true,
                    data: {
                        currentPath: path,
                        directories,
                        files
                    }
                };
            } else {
                return {
                    success: false,
                    error: result.message || 'Failed to get directory contents'
                };
            }
        } catch (error) {
            console.error('Failed to fetch directory contents:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error'
            };
        }
    }

    /**
     * 디렉토리 트리 구조를 가져옵니다
     */
    static async getDirectoryTree(rootPath: string = '/'): Promise<ApiResponse<DirectoryItem[]>> {
        try {
            // 루트 디렉토리의 내용을 가져와서 트리 구조로 변환
            const result = await this.getDirectoryContents(rootPath);

            if (result.success && result.data) {
                return {
                    success: true,
                    data: result.data.directories
                };
            } else {
                return {
                    success: false,
                    error: result.error || 'Failed to get directory tree'
                };
            }
        } catch (error) {
            console.error('Failed to fetch directory tree:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error'
            };
        }
    }

    /**
     * 특정 디렉토리의 하위 디렉토리들을 가져옵니다 (트리 확장용)
     */
    static async getSubDirectories(parentPath: string): Promise<ApiResponse<DirectoryItem[]>> {
        try {
            const result = await this.getDirectoryContents(parentPath);

            if (result.success && result.data) {
                return {
                    success: true,
                    data: result.data.directories
                };
            } else {
                return {
                    success: false,
                    error: result.error || 'Failed to get subdirectories'
                };
            }
        } catch (error) {
            console.error('Failed to fetch subdirectories:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error'
            };
        }
    }

    /**
     * 서버 설정을 가져옵니다
     */
    static async getServerConfig(): Promise<ApiResponse<any>> {
        try {
            const response = await fetch(`${API_BASE_URL}/config`);
            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || 'Failed to fetch server config'
                };
            }

            return {
                success: true,
                data: result.data
            };
        } catch (error) {
            console.error('Failed to fetch server config:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error'
            };
        }
    }

    /**
     * 새 디렉토리를 생성합니다
     */
    static async createDirectory(parentPath: string, directoryName: string): Promise<ApiResponse<any>> {
        try {
            const response = await fetch(`${API_BASE_URL}/create-directory`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    parentPath,
                    directoryName
                })
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || 'Failed to create directory'
                };
            }

            return {
                success: true,
                data: result.data
            };
        } catch (error) {
            console.error('Failed to create directory:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error'
            };
        }
    }

    /**
     * 파일을 업로드합니다
     */
    static async uploadFiles(targetPath: string, files: FileList): Promise<ApiResponse<any>> {
        try {
            const formData = new FormData();
            formData.append('path', targetPath);

            // 여러 파일 추가
            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i]);
            }

            const response = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || 'Failed to upload files'
                };
            }

            return {
                success: true,
                data: result.data
            };
        } catch (error) {
            console.error('Failed to upload files:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error'
            };
        }
    }

    /**
     * 파일을 다운로드합니다
     */
    static async downloadFiles(filePaths: string[]): Promise<ApiResponse<any>> {
        try {
            if (filePaths.length === 0) {
                return {
                    success: false,
                    error: 'No files selected for download'
                };
            }

            if (filePaths.length === 1) {
                // 단일 파일 다운로드
                const response = await fetch(`${API_BASE_URL}/download?path=${encodeURIComponent(filePaths[0])}`);

                if (!response.ok) {
                    const result = await response.json();
                    return {
                        success: false,
                        error: result.message || 'Failed to download file'
                    };
                }

                // 파일 다운로드 처리
                const blob = await response.blob();
                const filename = filePaths[0].split(/[/\\]/).pop() || 'download';

                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                return {
                    success: true,
                    data: { message: 'File downloaded successfully' }
                };
            } else {
                // 여러 파일 다운로드 (ZIP)
                const response = await fetch(`${API_BASE_URL}/download-multiple`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ paths: filePaths })
                });

                if (!response.ok) {
                    const result = await response.json();
                    return {
                        success: false,
                        error: result.message || 'Failed to download files'
                    };
                }

                // ZIP 파일 다운로드 처리
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'selected-files.zip';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                return {
                    success: true,
                    data: { message: 'Files downloaded successfully' }
                };
            }
        } catch (error) {
            console.error('Failed to download files:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error'
            };
        }
    }
}

// 실제 서버 API 사용 - 정적 메서드를 위해 클래스 직접 참조
export { FileSystemAPI as fileSystemAPI };
