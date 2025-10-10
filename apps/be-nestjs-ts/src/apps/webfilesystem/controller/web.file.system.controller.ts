import { Controller, Logger, Body, Get, HttpStatus, Post, Query, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { ApiCode, ApiResponse, ApiResponseDTO } from 'src/libs/dto/api.response.dto';
import { WebFileSystemService } from '../service/web.file.system.service';
import { WebFileSystemBeEnv } from '../env/web.file.system.be.env';
import { WebFileSystemFeEnvWatchService } from '../env/web.file.system.fe.env.watch.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('api/webfilesystem')
export class WebFileSystemController {
    private readonly logger = new Logger(WebFileSystemController.name);
    private readonly apiBase = "/api/webfilesystem";
    constructor(
        private readonly configService: ConfigService,
        private readonly env: WebFileSystemBeEnv,
        private readonly webFileSystemService: WebFileSystemService,
        private readonly feEnvWatchService: WebFileSystemFeEnvWatchService,
    ) {}

    // ====================================================================================================
    // Health Check
    // ====================================================================================================

    @Get('alive')
    alive() {
        const apiPath = `GET ${this.apiBase}/alive`;
        console.log(`${apiPath} => API is alive`);
        return ApiResponse.success(true);
    }

    // ====================================================================================================
    // Environment Management
    // ====================================================================================================

    @Get('env/reload')
    reloadConfig() {
        // BE 환경 리로드는 자동으로 감시
    }

    @Get('env/status')
    getWebFileSystem() {
        const apiPath = `GET ${this.apiBase}/env/status`;
        this.logger.log(`${apiPath} => success`);
        return ApiResponse.success(this.env.getWebFileSystem);
    }

    @Get('env/rootPath')
    getRootPath() {
        const apiPath = `GET ${this.apiBase}/env/rootPath`;
        const rootPath = this.env.getRootPath();
        this.logger.log(`${apiPath} => success :: ${rootPath}`);
        return ApiResponse.success(rootPath);
    }

    @Get('env/uploadPath')
    getUploadPath() {
        const apiPath = `GET ${this.apiBase}/env/uploadPath`;
        const uploadPath = this.env.getUploadPath();
        this.logger.log(`${apiPath} => success :: ${uploadPath}`);
        return ApiResponse.success(uploadPath);
    }

    @Get('env/allowedPaths')
    getAllowedPaths() {
        const apiPath = `GET ${this.apiBase}/env/allowedPaths`;
        const allowedPaths = this.env.getAllowedPaths();
        this.logger.log(`${apiPath} => success :: ${JSON.stringify(allowedPaths)}`);
        return ApiResponse.success(allowedPaths);
    }

    // ====================================================================================================
    // Web File System Operations
    // ====================================================================================================

    /**
     * @desc API List
     */
    @Get('list')
    getApiList(
        @Query('pathname') pathname: string,
        @Query('includeDirectory') includeDirectory: boolean = true,
        @Query('includeFile') includeFile: boolean = true,
        @Query('extensions') extensions: string,
    ): ApiResponseDTO<any[]> {
        const apiPath = `GET ${this.apiBase}/list`;
        const apiCall = apiPath + " :: pathname=" + pathname + ", includeDirectory=" + includeDirectory + ", includeFile=" + includeFile + ", extensions=" + extensions;
        try {
            const list = this.webFileSystemService.listFiles(
                pathname,
                includeDirectory,
                includeFile,
                extensions
            );
            this.logger.log(`${apiCall} => success : count=${list.length}`);
            return ApiResponse.success(list);
        } catch (error) {
            this.logger.error(`${apiCall} => failure: `, error);
            return ApiResponse.failure(
                ApiCode.CODE.FAILURE,
                "Failed to get list of directory: " + (error instanceof Error ? error.message : 'Unknown error')
            );
        }
    }

    @Get('list-post')
    listFilesPost(
        @Query('pathname') pathname: string,
        @Query('includeDirectory') includeDirectory: boolean = true,
        @Query('includeFile') includeFile: boolean = true,
        @Query('extensions') extensions: string,
    ): ApiResponseDTO<any[]> {
        const apiPath = `POST ${this.apiBase}/list`;
        const apiCall = apiPath + " :: pathname=" + pathname + ", includeDirectory=" + includeDirectory + ", includeFile=" + includeFile + ", extensions=" + extensions;
        try {
            const decodedPath = pathname; // If you have a decodePath helper, use it here
            const list = this.webFileSystemService.listFiles(
                decodedPath,
                includeDirectory,
                includeFile,
                extensions
            );
            return ApiResponse.success(list);
        } catch (error) {
            this.logger.error(`${apiCall} => failure: `, error);
            return ApiResponse.failure(
                ApiCode.CODE.FAILURE,
                "Failed to get list of directory: " + (error instanceof Error ? error.message : 'Unknown error')
            );
        }
    }

    // ====================================================================================================

    @Get('info')
    getFileInfo(
        @Query('pathname') pathname: string
    ): ApiResponseDTO<any> {
        const apiPath = `GET ${this.apiBase}/info`;
        const apiCall = `${apiPath} pathname=${pathname}`;
        try {
            const decodedPath = pathname; // If you have a decodePath helper, use it here
            const fileInfo = this.webFileSystemService.getFileInfo(decodedPath);
            this.logger.log(`${apiCall} => success :: ${JSON.stringify(fileInfo)}`);
            return ApiResponse.success(fileInfo);
        } catch (error) {
            this.logger.error(`${apiCall} => failure :: ${error instanceof Error ? error.message : error}`);
            return ApiResponse.failure(
                ApiCode.CODE.FAILURE,
                "Failed to get file info: " + (error instanceof Error ? error.message : 'Unknown error')
            );
        }
    }

    // ====================================================================================================

    @Get('read')
    readTextFile(
        @Query('pathname') pathname: string
    ): ApiResponseDTO<string> {
        const apiPath = `GET ${this.apiBase}/read`;
        const apiCall = `${apiPath} :: pathname=${pathname}`;
        try {
            const decodedPath = pathname; // If you have a decodePath helper, use it here
            const content = this.webFileSystemService.readTextFile(decodedPath);
            this.logger.log(`${apiCall} => success`);
            return ApiResponse.success(content);
        } catch (error) {
            this.logger.error(`${apiCall} => failure :: ${error instanceof Error ? error.message : error}`);
            return ApiResponse.failure(
                ApiCode.CODE.FAILURE,
                "Failed to read file: " + (error instanceof Error ? error.message : 'Unknown error')
            );
        }
    }

    @Get('write')
    writeTextFile(
        @Query('pathname') pathname: string,
        @Query('content') content: string
    ): ApiResponseDTO<string> {
        const apiPath = `POST ${this.apiBase}/write`;
        const apiCall = `${apiPath} :: pathname=${pathname}, content=[${content ? content.length : 0} chars]`;
        try {
            if (!pathname || !content) {
                return ApiResponse.failure(
                    ApiCode.CODE.FAILURE, "pathname and content are required."
                );
            }
            const decodedPath = pathname; // If you have a decodePath helper, use it here
            this.webFileSystemService.writeTextFile(decodedPath, content);
            this.logger.log(`${apiCall} => success`);
            return ApiResponse.success("success");
        } catch (error) {
            this.logger.error(`${apiCall} => failure :: ${error instanceof Error ? error.message : error}`);
            return ApiResponse.failure(
                ApiCode.CODE.FAILURE,
                "Failed to write file: " + (error instanceof Error ? error.message : 'Unknown error')
            );
        }
    }

    // ====================================================================================================

    @Get('download')
    async downloadFile(
        @Query('pathname') pathname: string,
        @Res() res: Response
    ) {
        const apiPath = `GET ${this.apiBase}/download`;
        const apiCall = `${apiPath} :: pathname=${pathname}`;
        try {
            const decodedPath = pathname; // Use decodePath helper if available
            const fileContent: Buffer = await this.webFileSystemService.downloadFile(decodedPath);
            const fileInfo = await this.webFileSystemService.getFileInfo(decodedPath);
            const safeFileName = fileInfo.name.replace(/[^\w\-\.]/g, '_');
            const encodedFileName = encodeURIComponent(fileInfo.name).replace(/\+/g, '%20');
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader(
                'Content-Disposition',
                `attachment; filename="${safeFileName}"; filename*=UTF-8''${encodedFileName}`
            );
            res.status(HttpStatus.OK).send(fileContent);
        } catch (error) {
            this.logger.error(`${apiCall} => failure :: ${error instanceof Error ? error.message : error}`);
            res.status(HttpStatus.BAD_REQUEST).send();
        }
    }

    @Post('download-multiple')
    async downloadMultipleFiles(
        @Body() request: { filePaths: string[]; archiveName?: string },
        @Res() res: Response
    ) {
        const apiPath = `POST ${this.apiBase}/download-multiple`;
        const apiCall = `${apiPath} :: ${JSON.stringify(request)}`;
        try {
            const filePaths = request.filePaths;
            const dateStr = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 15);
            const archiveName = request.archiveName || `download-${dateStr}.zip`;
            if (!filePaths || filePaths.length === 0) {
                return res.status(HttpStatus.BAD_REQUEST).send();
            }
            const zipContent: Buffer = await this.webFileSystemService.downloadMultipleFiles(filePaths, archiveName);
            const safeFileName = archiveName.replace(/[^\w\-\.]/g, '_');
            const encodedFileName = encodeURIComponent(archiveName).replace(/\+/g, '%20');
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader(
                'Content-Disposition',
                `attachment; filename="${safeFileName}"; filename*=UTF-8''${encodedFileName}`
            );
            res.status(HttpStatus.OK).send(zipContent);
        } catch (error) {
            this.logger.error(`${apiCall} => failure :: ${error instanceof Error ? error.message : error}`);
            res.status(HttpStatus.BAD_REQUEST).send();
        }
    }

    // ====================================================================================================

    private async handleUploadFile(
        incomingPath: string,
        incomingFiles: Express.Multer.File[]
    ): Promise<ApiResponseDTO<Record<string, any>>> {
        if (!incomingPath || incomingPath.trim().length === 0) {
            console.warn("Missing upload target path: one of path, pathname, targetPath, or uploadPath is required");
            return ApiResponse.failure(
                ApiCode.CODE.FAILURE,
                "Please specify the upload path: one of path, pathname, targetPath, or uploadPath is required."
            );
        }
        if (!incomingFiles || incomingFiles.length === 0) {
            return ApiResponse.failure(
                ApiCode.CODE.FAILURE,
                "Please select files to upload."
            );
        }
        const decodedTargetPath = incomingPath; // Use decodePath helper if available
        console.info(`File upload request: targetPath=[${incomingPath}] -> decoded=[${decodedTargetPath}], file count=[${incomingFiles.length}]`);

        let successCount = 0;
        let failCount = 0;
        const successFiles: string[] = [];
        const failFiles: string[] = [];

        for (const f of incomingFiles) {
            try {
                if (f && f.size > 0) {
                    console.info(`Uploading: file=[${f.originalname}] size=[${f.size}]`);
                    await this.webFileSystemService.uploadFile(decodedTargetPath, f);
                    successCount++;
                    successFiles.push(f.originalname);
                } else {
                    const fileName = f ? f.originalname : "unknown";
                    console.warn(`Skipping empty file: ${fileName}`);
                    failCount++;
                    failFiles.push(`${fileName} (empty file)`);
                }
            } catch (e: any) {
                const fileName = f ? f.originalname : "unknown";
                console.error(`File upload failure: ${fileName} - ${e?.message}`);
                failCount++;
                failFiles.push(`${fileName} (${e?.message ?? 'Unknown error'})`);
            }
        }

        const result = {
            totalFiles: incomingFiles.length,
            successCount,
            failCount,
            successFiles,
            failFiles,
        };

        if (incomingFiles.length === 1) {
            if (successCount === 1) {
                return ApiResponse.success(result);
            } else {
                return ApiResponse.failure(
                    ApiCode.CODE.FAILURE,
                    "File upload failure. See details: " + JSON.stringify(result)
                );
            }
        } else {
            if (failCount === 0) {
                return ApiResponse.successWithMessage(result, "All files uploaded successfully");
            } else if (successCount === 0) {
                this.logger.warn("All files upload failed. Details: ", result);
                return ApiResponse.failure(
                    ApiCode.CODE.FAILURE,
                    "All files upload failed. See details: " + JSON.stringify(result)
                );
            } else {
                return ApiResponse.successWithMessage(result, `Some files uploaded successfully (Success: ${successCount}, Fail: ${failCount})`);
            }
        }
    }

    @Post('upload')
    @UseInterceptors(FilesInterceptor('files'))
    async uploadFile(
        @Query('path') path?: string,
        @Query('pathname') pathname?: string,
        @Query('targetPath') targetPath?: string,
        @Query('uploadPath') uploadPath?: string,
        @UploadedFiles() files?: Express.Multer.File[],
        @Body() body?: any
    ): Promise<ApiResponseDTO<Record<string, any>>> {
        const apiPath = `POST ${this.apiBase}/upload`;
        const apiCall = `${apiPath} :: path=${path}, pathname=${pathname}, targetPath=${targetPath}, uploadPath=${uploadPath}`;

        // Determine incomingPath
        const incomingPath =
            path && path.trim() !== '' ? path :
            pathname && pathname.trim() !== '' ? pathname :
            targetPath && targetPath.trim() !== '' ? targetPath :
            uploadPath && uploadPath.trim() !== '' ? uploadPath :
            undefined;

        // Determine incomingFiles (support alternative keys if needed)
        let incomingFiles: Express.Multer.File[] | undefined = files;
        if ((!incomingFiles || incomingFiles.length === 0) && body) {
            if (body.file && Array.isArray(body.file) && body.file.length > 0) {
                incomingFiles = body.file;
            } else if (body.uploadFiles && Array.isArray(body.uploadFiles) && body.uploadFiles.length > 0) {
                incomingFiles = body.uploadFiles;
            }
        }

        this.logger.log(`${apiCall} :: incomingPath=${incomingPath}, incomingFiles count=${incomingFiles ? incomingFiles.length : 0}`);
        return await this.handleUploadFile(incomingPath, incomingFiles ?? []);
    }

    @Post('upload-multiple')
    @UseInterceptors(FilesInterceptor('files'))
    async uploadMultipleFiles(
        @Query('path') path?: string,
        @Query('pathname') pathname?: string,
        @Query('targetPath') targetPath?: string,
        @Query('uploadPath') uploadPath?: string,
        @UploadedFiles() files?: Express.Multer.File[],
        @Body() body?: any
    ): Promise<ApiResponseDTO<Record<string, any>>> {
        const apiPath = `POST ${this.apiBase}/upload-multiple`;
        const apiCall = `${apiPath} :: path=${path}, pathname=${pathname}, targetPath=${targetPath}, uploadPath=${uploadPath}`;

        // Determine incomingPath
        const incomingPath =
            path && path.trim() !== '' ? path :
            pathname && pathname.trim() !== '' ? pathname :
            targetPath && targetPath.trim() !== '' ? targetPath :
            uploadPath && uploadPath.trim() !== '' ? uploadPath :
            undefined;

        // Determine incomingFiles (support alternative keys if needed)
        let incomingFiles: Express.Multer.File[] | undefined = files;
        if ((!incomingFiles || incomingFiles.length === 0) && body) {
            if (body.file && Array.isArray(body.file) && body.file.length > 0) {
                incomingFiles = body.file;
            } else if (body.uploadFiles && Array.isArray(body.uploadFiles) && body.uploadFiles.length > 0) {
                incomingFiles = body.uploadFiles;
            }
        }

        this.logger.log(`${apiCall} :: incomingPath=${incomingPath}, incomingFiles count=${incomingFiles ? incomingFiles.length : 0}`);
        return await this.handleUploadFile(incomingPath, incomingFiles ?? []);
    }

    // ====================================================================================================
    // ====================================================================================================

    private handleCreateDirectory(pathname: string, directoryName: string): ApiResponseDTO<string> {
        if (!pathname || pathname.trim().length === 0) {
            console.warn(`pathname is empty or null: [${pathname}]`);
            return ApiResponse.failure(
                ApiCode.CODE.FAILURE,
                "pathname is necessary."
            );
        }
        if (!directoryName || directoryName.trim().length === 0) {
            console.warn(`directoryName is empty or null: [${directoryName}]`);
            return ApiResponse.failure(
                ApiCode.CODE.FAILURE,
                "directory name is necessary."
            );
        }
        let fullPath = pathname.endsWith("/") ? pathname + directoryName : pathname + "/" + directoryName;
        fullPath = fullPath.replace(/[/\\]+/g, "/");
        // If you have a helper for Linux file separator, use it here
        // fullPath = FileHelper.ReplaceFileSeparatorForLinux(fullPath);
        const decodedPath = fullPath; // If you have a decodePath helper, use it here
        try {
            this.webFileSystemService.createDirectory(decodedPath);
            this.logger.log(`Directory creation completed: ${decodedPath}`);
            return ApiResponse.success("Directory creation successful");
        } catch (e: any) {
            this.logger.error(`Directory creation failed: ${e?.message}`, e);
            return ApiResponse.failure(
                ApiCode.CODE.FAILURE,
                "Directory creation failed: " + (e?.message ?? 'Unknown error')
            );
        }
    }

    @Post('create-directory')
    createDirectory(
        @Body() request: { pathname: string; directoryName?: string }
    ): ApiResponseDTO<string> {
        const apiPath = `POST ${this.apiBase}/create-directory`;
        const apiCall = `${apiPath} :: ${JSON.stringify(request)}`;
        const { pathname, directoryName } = request;
        this.logger.log(`${apiCall} :: pathname=${pathname}, directoryName=${directoryName}`);
        return this.handleCreateDirectory(pathname, directoryName ?? '');
    }

    @Post('create-directory-param')
    createDirectoryParam(
        @Body() request: { pathname: string; directoryName?: string }
    ): ApiResponseDTO<string> {
        const apiPath = `POST ${this.apiBase}/create-directory-param`;
        const { pathname, directoryName } = request;
        // Optionally set default directoryName if empty
        // const dirName = directoryName && directoryName.trim() !== '' ? directoryName : 'NewFolder';
        this.logger.log(`${apiPath} :: pathname=${pathname}, directoryName=${directoryName}`);
        return this.handleCreateDirectory(pathname, directoryName ?? '');
    }

    // ====================================================================================================

    @Get('delete')
    deleteFile(
        @Query('pathname') pathname: string,
        @Query('deleteIfEmpty') deleteIfEmpty: boolean = true,
        @Query('recursive') recursive: boolean = false
    ): ApiResponseDTO<string> {
        const apiPath = `DELETE ${this.apiBase}/delete`;
        const apiCall = `${apiPath} :: pathname=${pathname}, deleteIfEmpty=${deleteIfEmpty}, recursive=${recursive}`;
        try {
            const decodedPath = pathname; // Use decodePath helper if available
            this.webFileSystemService.deleteFile(decodedPath, deleteIfEmpty, recursive);
            this.logger.log(`${apiCall} => success`);
            return ApiResponse.success("Delete completed");
        } catch (error) {
            this.logger.error(`${apiCall} => failure :: ${error instanceof Error ? error.message : error}`);
            return ApiResponse.failure(
                ApiCode.CODE.FAILURE,
                "File deletion failed: " + (error instanceof Error ? error.message : 'Unknown error')
            );
        }
    }

    @Post('delete-multiple')
    async deleteMultipleFiles(
        @Body() request: { paths: string[]; deleteIfEmpty?: boolean; recursive?: boolean }
    ): Promise<ApiResponseDTO<Record<string, any>>> {
        const apiPath = `POST ${this.apiBase}/delete-multiple`;
        const apiCall = `${apiPath} :: ${JSON.stringify(request)}`;
        try {
            const paths = request.paths;
            const deleteIfEmpty = request.deleteIfEmpty ?? true;
            const recursive = request.recursive ?? false;

            if (!paths || !Array.isArray(paths) || paths.length === 0) {
                return ApiResponse.failure(
                    ApiCode.CODE.FAILURE,
                    "File/directory path to delete is required."
                );
            }

            let successCount = 0;
            let failCount = 0;
            const successFiles: string[] = [];
            const failFiles: string[] = [];

            for (const path of paths) {
                try {
                    const decodedPath = path; // Use decodePath helper if available
                    this.webFileSystemService.deleteFile(decodedPath, deleteIfEmpty, recursive);
                    successCount++;
                    successFiles.push(path);
                } catch (e: any) {
                    failCount++;
                    failFiles.push(`${path} (${e?.message ?? 'Unknown error'})`);
                }
            }

            const result = {
                totalFiles: paths.length,
                successCount,
                failCount,
                successFiles,
                failFiles,
            };

            if (failCount === 0) {
                return ApiResponse.success(result);
            } else if (successCount === 0) {
                return ApiResponse.failure(
                    ApiCode.CODE.FAILURE,
                    "All file deletions failed"
                );
            } else {
                return ApiResponse.successWithMessage(result, `Some files deleted successfully (Success: ${successCount}, Fail: ${failCount})`);
            }
        } catch (e: any) {
            return ApiResponse.failure(
                ApiCode.CODE.FAILURE,
                "File path and new name are required: " + (e?.message ?? 'Unknown error')
            );
        }
    }

    // ====================================================================================================

    @Post('move')
    moveFile(
        @Body() request: { sourcePath: string; targetPath: string }
    ): ApiResponseDTO<string> {
        const apiPath = `POST ${this.apiBase}/move`;
        const apiCall = `${apiPath} :: ${JSON.stringify(request)}`;
        try {
            const { sourcePath, targetPath } = request;
            if (!sourcePath || !targetPath) {
                return ApiResponse.failure(
                    ApiCode.CODE.FAILURE,
                    "File path and new name are required."
                );
            }
            const decodedSourcePath = sourcePath; // Use decodePath helper if available
            const decodedTargetPath = targetPath; // Use decodePath helper if available
            this.webFileSystemService.moveFile(decodedSourcePath, decodedTargetPath);
            this.logger.log(`${apiCall} => success`);
            return ApiResponse.success("Move completed");
        } catch (error) {
            this.logger.error(`${apiCall} => failure :: ${error instanceof Error ? error.message : error}`);
            return ApiResponse.failure(
                ApiCode.CODE.FAILURE,
                "Failed to move: " + (error instanceof Error ? error.message : 'Unknown error')
            );
        }
    }

    // ====================================================================================================

    @Post('rename')
    renameFile(
        @Body() request: { path: string; newName: string }
    ): ApiResponseDTO<string> {
        const apiPath = `POST ${this.apiBase}/rename`;
        const apiCall = `${apiPath} :: ${JSON.stringify(request)}`;
        try {
            const { path, newName } = request;
            if (!path || !newName || newName.trim().length === 0) {
                return ApiResponse.failure(
                    ApiCode.CODE.FAILURE,
                    "File path and new name are required."
                );
            }

            const decodedPath = path; // Use decodePath helper if available
            console.info(`File rename request: path=[${decodedPath}], newName=[${newName}]`);

            // Split parent directory and file name
            const parentDir = path.split('/').slice(0, -1).join('/');
            if (!parentDir) {
                return ApiResponse.failure(
                    ApiCode.CODE.FAILURE,
                    "Cannot rename the root directory."
                );
            }

            // Create new full path
            const newFullPath = parentDir + '/' + newName;
            console.info(`New path: [${newFullPath}]`);

            this.webFileSystemService.moveFile(decodedPath, newFullPath);
            this.logger.log(`${apiCall} => success`);
            return ApiResponse.success("Rename completed");
        } catch (error) {
            this.logger.error(`${apiCall} => failure :: ${error instanceof Error ? error.message : error}`);
            return ApiResponse.failure(
                ApiCode.CODE.FAILURE,
                "Failed to rename: " + (error instanceof Error ? error.message : 'Unknown error')
            );
        }
    }

    // ====================================================================================================

    @Post('copy')
    copyFile(
        @Body() request: { sourcePath: string; targetPath: string }
    ): ApiResponseDTO<string> {
        const apiPath = `POST ${this.apiBase}/copy`;
        const apiCall = `${apiPath} :: ${JSON.stringify(request)}`;
        try {
            const { sourcePath, targetPath } = request;
            if (!sourcePath || !targetPath) {
                return ApiResponse.failure(
                    ApiCode.CODE.FAILURE,
                    "Source path and target path are required."
                );
            }
            const decodedSourcePath = sourcePath; // Use decodePath helper if available
            const decodedTargetPath = targetPath; // Use decodePath helper if available
            this.webFileSystemService.copyFile(decodedSourcePath, decodedTargetPath);
            this.logger.log(`${apiCall} => success`);
            return ApiResponse.success("Copy completed");
        } catch (error) {
            this.logger.error(`${apiCall} => failure :: ${error instanceof Error ? error.message : error}`);
            return ApiResponse.failure(
                ApiCode.CODE.FAILURE,
                "Copy failed: " + (error instanceof Error ? error.message : 'Unknown error')
            );
        }
    }

    // ====================================================================================================
    // ====================================================================================================

}
