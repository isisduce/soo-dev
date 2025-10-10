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
            // 경로를 정규화 (백슬래시를 슬래시로 변환)
            const normalizedPath = parentPath.replace(/\\/g, '/');

            console.log('Create directory API request:', {
                originalPath: parentPath,
                normalizedPath,
                directoryName
            });

            // JSON Body 방식으로 전송
            const response = await fetch(`${API_BASE_URL}/create-directory`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    path: normalizedPath,
                    name: directoryName
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
            // 경로 정규화 (백슬래시 -> 슬래시)
            const normalizedPath = targetPath.replace(/\\/g, '/');

            // FormData에 여러 파일을 files로 추가
            const formData = new FormData();
            formData.append('targetPath', normalizedPath);
            formData.append('path', normalizedPath);

            // 모든 파일을 files 배열로 추가
            for (let i = 0; i < files.length; i++) {
                const file = files.item(i);
                if (file) {
                    formData.append('files', file, file.name);
                }
            }

            console.log(`Uploading ${files.length} files to ${normalizedPath}`);

            const response = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok && result.success) {
                return {
                    success: true,
                    data: result.data || { message: `${files.length}개 파일 업로드 성공` }
                };
            } else {
                // 서버가 files 배열을 지원하지 않는 경우, 개별 업로드로 폴백
                console.log('Multi-file upload failed, falling back to individual uploads');
                return await this.uploadFilesIndividually(normalizedPath, files);
            }
        } catch (error) {
            console.error('Failed to upload files:', error);
            // 네트워크 오류인 경우에도 개별 업로드로 폴백
            console.log('Network error, falling back to individual uploads');
            return await this.uploadFilesIndividually(targetPath, files);
        }
    }

    /**
     * 파일을 개별적으로 업로드합니다 (폴백 메서드)
     */
    private static async uploadFilesIndividually(targetPath: string, files: FileList): Promise<ApiResponse<any>> {
        const normalizedPath = targetPath.replace(/\\/g, '/');
        const uploadedFiles: string[] = [];
        const errors: string[] = [];

        // 각 파일을 개별적으로 업로드
        for (let i = 0; i < files.length; i++) {
            const file = files.item(i);
            if (!file) continue;

            try {
                const formData = new FormData();
                formData.append('targetPath', normalizedPath);
                formData.append('path', normalizedPath);
                formData.append('file', file, file.name);

                console.log(`Uploading file ${i + 1}/${files.length}: ${file.name}`);

                const response = await fetch(`${API_BASE_URL}/upload`, {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    uploadedFiles.push(file.name);
                    console.log(`Successfully uploaded: ${file.name}`);
                } else {
                    const errorMsg = result.message || `Failed to upload ${file.name}`;
                    errors.push(errorMsg);
                    console.error(`Failed to upload ${file.name}:`, errorMsg);
                }
            } catch (fileError) {
                const errorMsg = `Error uploading ${file.name}: ${fileError instanceof Error ? fileError.message : 'Unknown error'}`;
                errors.push(errorMsg);
                console.error(errorMsg);
            }
        }

        // 결과 반환
        if (uploadedFiles.length > 0) {
            const message = errors.length > 0
                ? `${uploadedFiles.length}개 파일 업로드 성공, ${errors.length}개 실패`
                : `${uploadedFiles.length}개 파일 업로드 성공`;

            return {
                success: true,
                data: {
                    message,
                    uploadedFiles,
                    errors: errors.length > 0 ? errors : undefined
                }
            };
        } else {
            return {
                success: false,
                error: `모든 파일 업로드 실패: ${errors.join(', ')}`
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

    /**
     * 파일 또는 디렉토리를 삭제합니다
     */
    static async deleteItems(itemPaths: string[]): Promise<ApiResponse<any>> {
        try {
            if (itemPaths.length === 0) {
                return {
                    success: false,
                    error: 'No items selected for deletion'
                };
            }

            // 경로들을 정규화
            const normalizedPaths = itemPaths.map(path => path.replace(/\\/g, '/'));

            const response = await fetch(`${API_BASE_URL}/delete-multiple`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ paths: normalizedPaths })
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || 'Failed to delete items'
                };
            }

            return {
                success: true,
                data: result.data || { message: `${itemPaths.length}개 항목이 삭제되었습니다.` }
            };
        } catch (error) {
            console.error('Failed to delete items:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error'
            };
        }
    }

    /**
     * 파일 또는 디렉토리의 이름을 변경합니다
     */
    static async renameItem(oldPath: string, newName: string): Promise<ApiResponse<any>> {
        try {
            // 경로 정규화
            const normalizedOldPath = oldPath.replace(/\\/g, '/');

            const response = await fetch(`${API_BASE_URL}/rename`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    // oldPath: normalizedOldPath,
                    path: normalizedOldPath,
                    newName: newName
                })
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || 'Failed to rename item'
                };
            }

            return {
                success: true,
                data: result.data
            };
        } catch (error) {
            console.error('Failed to rename item:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error'
            };
        }
    }

    /**
     * 파일 또는 디렉토리를 이동합니다
     */
    static async moveItem(sourcePath: string, targetPath: string): Promise<ApiResponse<any>> {
        try {
            // 경로 정규화
            const normalizedSourcePath = sourcePath.replace(/\\/g, '/');
            const normalizedTargetPath = targetPath.replace(/\\/g, '/');

            const response = await fetch(`${API_BASE_URL}/move`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sourcePath: normalizedSourcePath,
                    targetPath: normalizedTargetPath
                })
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || 'Failed to move item'
                };
            }

            return {
                success: true,
                data: result.data
            };
        } catch (error) {
            console.error('Failed to move item:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error'
            };
        }
    }
}

// 실제 서버 API 사용 - 정적 메서드를 위해 클래스 직접 참조
export { FileSystemAPI as fileSystemAPI };
