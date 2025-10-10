
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { WebFileSystemBeEnv } from '../env/web.file.system.be.env';
import type { WebFileSystem } from '../types/web.file.system.types';
const { execSync } = require('child_process');
const archiver = require('archiver');
const stream = require('stream');

@Injectable()
export class WebFileSystemService {
    constructor(
        private readonly env: WebFileSystemBeEnv
    ) {}

    getEnv() {
        return this.env.getConfig();
    }

    validatePath(pathname: string): void {
        if (!pathname) {
            throw new Error(`Pathname is not set.`);
        }
        const allowedPaths = this.env.getWebFileSystem()?.allowedPaths?.map(r => r.path) || [];
        const isAllowed = allowedPaths.some(allowedPath => {
            try {
                const normalizedPath = path.normalize(pathname);
                const normalizedAllowed = path.normalize(allowedPath.trim());
                return normalizedPath.startsWith(normalizedAllowed);
            } catch {
                return false;
            }
        });
        if (!isAllowed) {
            throw new Error(`Access to the path is not allowed: ${pathname}`);
        }
    }

    // ====================================================================================================

    listFilesByPathname(
        pathname: string,
    ): WebFileSystem.FileInfo[] {
        return this.listFiles(
            pathname,
            true,
            true,
            undefined
        );
    }

    listFiles(
        pathname: string,
        includeDirectory: boolean = true,
        includeFile: boolean = true,
        extensions?: string
    ): WebFileSystem.FileInfo[] {
        this.validatePath(pathname);
        try {
            const targetDir = path.resolve(pathname);
            if (!fs.existsSync(targetDir)) {
                throw new Error(`Not exist pathname: ${pathname}`);
            }
            if (!fs.statSync(targetDir).isDirectory()) {
                throw new Error(`Not a directory: ${pathname}`);
            }
            const files = fs.readdirSync(targetDir);
            return files
                .map(file => this.toFileInfo(path.join(targetDir, file), pathname))
                .filter(f => {
                    // includeDirectory/includeFile option
                    if (f.type === 'directory' && !includeDirectory) return false;
                    if (f.type === 'file' && !includeFile) return false;
                    // extension filtering (only for files)
                    if (extensions && f.type === 'file') {
                        const extList = extensions.split(/[,;|]/).map(e => e.trim().toLowerCase());
                        return extList.includes((f.extension || '').toLowerCase());
                    }
                    return true;
                })
                .sort((a, b) => {
                    // Directories first, then by name
                    if (a.type !== b.type) {
                        return a.type === 'directory' ? -1 : 1;
                    }
                    return a.name.localeCompare(b.name);
                });
        } catch (e: any) {
            throw new Error(`Failed to retrieve file list: ${e.message}`);
        }
    }

    // ====================================================================================================

    getFileInfo(pathname: string): WebFileSystem.FileInfo {
        this.validatePath(pathname);
        const targetPath = path.resolve(pathname);
        if (!fs.existsSync(targetPath)) {
            throw new Error(`Not exist pathname: ${pathname}`);
        }
        return this.toFileInfo(targetPath);
    }

    // ====================================================================================================

    toFileInfo(filePath: string, requestedPath?: string): WebFileSystem.FileInfo {
        try {
            const stat = fs.statSync(filePath);
            const lstat = fs.lstatSync(filePath);
            const name = path.basename(filePath);
            let extension = '';
            let fileType: WebFileSystem.FileType = 'file';
            let linkTarget: string | undefined = undefined;
            const isDirectory = stat.isDirectory();
            const isSymbolicLink = lstat.isSymbolicLink();
            const isJunctionPoint = false; // Junction Point detection not implemented
            if (!isDirectory && name.includes('.')) {
                extension = name.substring(name.lastIndexOf('.') + 1);
            }
            if (isSymbolicLink) {
                fileType = 'symlink';
                try {
                    linkTarget = fs.readlinkSync(filePath);
                } catch {
                    linkTarget = undefined;
                }
            } else if (isDirectory) {
                fileType = 'directory';
            }
            let resultPath = filePath.split(path.sep).join('/');
            // 드라이브 문자 처리
            if (requestedPath && !/^[a-zA-Z]:/.test(requestedPath)) {
                resultPath = resultPath.replace(/^[a-zA-Z]:/, '');
            }
            let hasChildren = false;
            if (fileType === 'directory') {
                try {
                    const dir = fs.opendirSync(filePath);
                    hasChildren = !!dir.readSync();
                    dir.closeSync();
                } catch {
                    hasChildren = false;
                }
            }
            return {
                name,
                path: resultPath,
                type: fileType,
                size: isDirectory ? 0 : stat.size,
                extension,
                createdAt: stat.birthtime,
                modifiedAt: stat.mtime,
                isReadable: true,
                isWritable: true,
                isExecutable: true,
                isHidden: name.startsWith('.'),
                isSymbolicLink,
                isJunctionPoint,
                linkTarget,
                parentPath: path.dirname(filePath).split(path.sep).join('/'),
                hasChildren,
            };
        } catch (e: any) {
            throw new Error(`Failed to convert file info: ${e.message}`);
        }
    }

    // ====================================================================================================

    getFileExtension(fileName: string): string {
        const lastDot = fileName.lastIndexOf('.');
        if (lastDot === -1 || lastDot === fileName.length - 1) {
            return '';
        }
        return fileName.substring(lastDot).toLowerCase();
    }

    // ====================================================================================================

    isHidden(filePath: string): boolean {
        try {
            const name = path.basename(filePath);
            // On Unix, files starting with '.' are hidden.
            if (name.startsWith('.')) return true;
            // On Windows, check 'hidden' attribute.
            if (process.platform === 'win32') {
                try {
                    const attrs = execSync(`attrib "${filePath}"`).toString();
                    return attrs.includes('H');
                } catch {
                    return false;
                }
            }
            return false;
        } catch {
            return false;
        }
    }

    // ====================================================================================================

    shouldShowPath(filePath: string): boolean {
        try {
            const isSymLink = fs.lstatSync(filePath).isSymbolicLink();
            const isJunctionPoint = false; // Junction Point detection not implemented

            // 심볼릭 링크 필터링
            if (isSymLink && !this.env.isShowSymbolicLinks()) {
                return false;
            }
            // Junction Point 필터링
            if (isJunctionPoint && !this.env.isShowJunctionPoints()) {
                return false;
            }
            // 접근할 수 없는 링크 필터링
            if (this.env.isHideInaccessibleLinks() && (isSymLink || isJunctionPoint)) {
                try {
                    // 링크의 대상이 실제로 존재하는지 확인
                    if (isSymLink) {
                        const target = fs.readlinkSync(filePath);
                        if (!fs.existsSync(target)) {
                            // 접근할 수 없는 심볼릭 링크 숨김
                            return false;
                        }
                    } else if (isJunctionPoint) {
                        // Junction Point의 경우 접근을 시도해봄
                        try {
                            fs.accessSync(filePath, fs.constants.R_OK);
                        } catch {
                            // 접근할 수 없는 Junction Point 숨김
                            return false;
                        }
                        // "Documents and Settings" 같은 특정 Junction Point는 숨김
                        const fileName = path.basename(filePath).toLowerCase();
                        if (
                            fileName === "documents and settings" ||
                            fileName === "application data" ||
                            fileName === "local settings"
                        ) {
                            // 시스템 Junction Point 숨김
                            return false;
                        }
                    }
                } catch {
                    // 링크 접근성 확인 실패, 숨김 처리
                    return false;
                }
            }
            return true;
        } catch {
            // 경로 표시 여부 확인 실패: 기본적으로는 표시
            return true;
        }
    }

    /**
     * Checks if the given path is a Junction Point (Windows only).
     * Note: Node.js does not provide direct API for reparse points.
     * This implementation uses heuristics: directory, not symlink, and Windows.
     */
    isJunctionPoint(filePath: string): boolean {
        if (process.platform !== 'win32') return false;
        try {
            const stat = fs.statSync(filePath);
            const lstat = fs.lstatSync(filePath);
            // Junction Point: directory, not a symlink, and has reparse point attribute
            if (!stat.isDirectory() || lstat.isSymbolicLink()) return false;
            // Check for reparse point attribute using 'fsutil' (requires admin privileges)
            // Fallback: check if canonical and absolute paths differ
            const canonical = fs.realpathSync(filePath);
            const absolute = path.resolve(filePath);
            return canonical !== absolute;
        } catch {
            return false;
        }
    }

    /**
     * Checks if the given path is a reparse point (Windows only).
     * Node.js does not provide direct API for reparse points.
     * This implementation uses heuristics and shell commands.
     */
    isReparsePoint(filePath: string): boolean {
        if (process.platform !== 'win32') return false;
        try {
            // Use 'fsutil reparsepoint query' to check for reparse point (requires admin privileges)
            // Fallback: check if canonical and absolute paths differ
            const stat = fs.statSync(filePath);
            const lstat = fs.lstatSync(filePath);
            if (!stat.isDirectory() || lstat.isSymbolicLink()) return false;
            const canonical = fs.realpathSync(filePath);
            const absolute = path.resolve(filePath);
            return canonical !== absolute;
        } catch {
            return false;
        }
    }

    /**
     * Gets the target path of a Junction Point (Windows only).
     * Returns the canonical path if different from the absolute path.
     */
    getJunctionTarget(filePath: string): string | null {
        try {
            if (!this.isJunctionPoint(filePath)) {
                return null;
            }
            // Compare canonical and absolute paths
            const canonical = fs.realpathSync(filePath);
            const absolute = path.resolve(filePath);
            if (canonical !== absolute) {
                return canonical;
            }
            // For security reasons, we avoid using shell commands like fsutil
            return null;
        } catch (e) {
            // Optionally log the error here
            return null;
        }
    }

    // ====================================================================================================
    // ====================================================================================================

    /**
     * 텍스트 파일 내용 읽기
     * @param pathname 읽을 파일 경로
     * @return 파일 내용 (문자열)
     */
    readTextFile(pathname: string): string {
        this.validatePath(pathname);
        try {
            const targetPath = path.resolve(pathname);

            if (!fs.existsSync(targetPath) || fs.statSync(targetPath).isDirectory()) {
                throw new Error(`읽을 수 없는 파일입니다: ${pathname}`);
            }

            return fs.readFileSync(targetPath, 'utf8');
        } catch (e: any) {
            // You may want to use a logger here
            throw new Error(`파일을 읽을 수 없습니다: ${e.message}`);
        }
    }

    /**
     * 텍스트 파일 내용 저장
     * @param pathname 저장할 파일 경로
     * @param content 저장할 내용
     * @returns void
     */
    writeTextFile(pathname: string, content: string): void {
        this.validatePath(pathname);
        try {
            const targetPath = path.resolve(pathname);
            fs.writeFileSync(targetPath, content, 'utf8');
        } catch (e: any) {
            // You may want to use a logger here
            throw new Error(`파일을 저장할 수 없습니다: ${e.message}`);
        }
    }

    // ====================================================================================================

    /**
     * 파일 다운로드를 위한 바이트 배열 반환
     * @param pathname 다운로드할 파일 경로
     * @returns 파일 내용이 담긴 Buffer
     */
    downloadFile(pathname: string): Buffer {
        this.validatePath(pathname);
        try {
            const targetPath = path.resolve(pathname);

            if (!fs.existsSync(targetPath) || fs.statSync(targetPath).isDirectory()) {
                throw new Error(`다운로드할 수 없는 파일입니다: ${pathname}`);
            }

            return fs.readFileSync(targetPath);
        } catch (e: any) {
            // You may want to use a logger here
            throw new Error(`파일을 다운로드할 수 없습니다: ${e.message}`);
        }
    }

    /**
     * 다중 파일 다운로드 (ZIP 압축)
     * @param filePaths 다운로드할 파일 경로 목록
     * @param archiveName 압축 파일 이름 (사용하지 않음, 반환값은 Buffer)
     * @returns ZIP 압축된 파일 내용이 담긴 Buffer
     */
    async downloadMultipleFiles(filePaths: string[], archiveName: string): Promise<Buffer> {
        const archive = archiver('zip', { zlib: { level: 9 } });
        const output = new stream.PassThrough();
        const chunks: Buffer[] = [];

        return new Promise<Buffer>((resolve, reject) => {
            output.on('data', (chunk: Buffer) => chunks.push(chunk));
            output.on('end', () => resolve(Buffer.concat(chunks)));
            output.on('error', (err: Error) => reject(err));
            archive.on('error', (err: Error) => reject(err));

            archive.pipe(output);

            filePaths.forEach(filePath => {
                try {
                    const decodedPath = decodeURIComponent(filePath);
                    const targetPath = path.resolve(decodedPath);

                    if (!fs.existsSync(targetPath)) {
                        // Optionally log: file does not exist, skip
                        return;
                    }

                    const stat = fs.statSync(targetPath);
                    if (stat.isDirectory()) {
                        // Add directory recursively
                        archive.directory(targetPath, path.basename(targetPath));
                    } else {
                        // Add file
                        archive.file(targetPath, { name: path.basename(targetPath) });
                    }
                } catch (e: any) {
                    // Optionally log: error while adding file to archive
                }
            });

            archive.finalize();
        });
    }

    /**
     * Add a file to a ZIP archive using archiver.
     * @param archive Archiver instance
     * @param filePath Absolute file path
     * @param entryName Name to use inside the ZIP
     * @return void
     */
    private addFileToZip(archive: any, filePath: string, entryName: string): void {
        archive.file(filePath, { name: entryName });
    }

    /**
     * Recursively add a directory to a ZIP archive using archiver.
     * @param archive Archiver instance
     * @param dirPath Absolute directory path
     * @param baseName Base name inside the ZIP
     * @return void
     */
    private addDirectoryToZip(archive: any, dirPath: string, baseName: string): void {
        const entries = fs.readdirSync(dirPath);
        entries.forEach(entry => {
            const fullPath = path.join(dirPath, entry);
            const entryName = baseName ? `${baseName}/${entry}` : entry;
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                // Add empty directory entry
                archive.append('', { name: `${entryName}/` });
                // Recursively add subdirectory
                this.addDirectoryToZip(archive, fullPath, entryName);
            } else {
                this.addFileToZip(archive, fullPath, entryName);
            }
        });
    }

    /**
     * 파일 업로드
     * @param targetPath 대상 경로 (디렉토리)
     * @param file 업로드할 파일 (Express.Multer.File)
     * @return void
     */
    uploadFile(targetPath: string, file: Express.Multer.File): void {
        this.validatePath(targetPath);
        try {
            const uploadDir = path.resolve(targetPath);
            if (!fs.existsSync(uploadDir) || !fs.statSync(uploadDir).isDirectory()) {
                throw new Error(`업로드 대상 디렉토리가 존재하지 않습니다: ${targetPath}`);
            }
            const destPath = path.join(uploadDir, file.originalname);
            fs.writeFileSync(destPath, file.buffer);
        } catch (e: any) {
            // You may want to use a logger here
            throw new Error(`파일을 업로드할 수 없습니다: ${e.message}`);
        }
    }
    /**
     * 디렉토리 생성
     * @param dirPath 생성할 디렉토리 경로
     * @return void
     */
    createDirectory(dirPath: string): void {
        this.validatePath(dirPath);
        try {
            const targetPath = path.resolve(dirPath);

            // 상위 디렉토리가 존재하는지 확인
            const parentDir = path.dirname(targetPath);
            if (parentDir && !fs.existsSync(parentDir)) {
                throw new Error(`상위 디렉토리가 존재하지 않습니다: ${parentDir}`);
            }

            // 이미 존재하는지 확인
            if (fs.existsSync(targetPath)) {
                throw new Error(`이미 존재하는 경로입니다: ${dirPath}`);
            }

            fs.mkdirSync(targetPath, { recursive: true });
            // Optionally log: 디렉토리 생성 성공
        } catch (e: any) {
            // Optionally log: 디렉토리 생성 오류
            throw new Error(`디렉토리를 생성할 수 없습니다: ${e.message}`);
        }
    }
    /**
     * 파일/디렉토리 삭제
     * @param targetPath 삭제할 경로
     * @param deleteIfEmpty 디렉토리일 때 비어있을 경우만 삭제 (기본값: true)
     * @param recursive 디렉토리일 때 재귀적으로 삭제 (기본값: false)
     * @return void
     */
    deleteFile(targetPath: string, deleteIfEmpty: boolean = true, recursive: boolean = false): void {
        this.validatePath(targetPath);
        try {
            const resolvedPath = path.resolve(targetPath);
            if (!fs.existsSync(resolvedPath)) {
                throw new Error(`삭제할 경로가 존재하지 않습니다: ${targetPath}`);
            }
            const stat = fs.statSync(resolvedPath);

            if (stat.isDirectory()) {
                const files = fs.readdirSync(resolvedPath);
                if (deleteIfEmpty && recursive) {
                    // 재귀적으로 디렉토리 삭제
                    files.forEach(file => {
                        const childPath = path.join(resolvedPath, file);
                        this.deleteFile(childPath, true, true);
                    });
                    fs.rmdirSync(resolvedPath);
                } else {
                    // 비어있는 디렉토리만 삭제
                    if (deleteIfEmpty && files.length === 0) {
                        fs.rmdirSync(resolvedPath);
                    } else if (!deleteIfEmpty) {
                        // 비어있지 않아도 삭제 시도 (실패할 수 있음)
                        fs.rmdirSync(resolvedPath);
                    } else {
                        throw new Error(`디렉토리가 비어있지 않아 삭제할 수 없습니다: ${targetPath}`);
                    }
                }
            } else {
                fs.unlinkSync(resolvedPath);
            }
        } catch (e: any) {
            // Optionally log: 파일 삭제 오류
            throw new Error(`파일을 삭제할 수 없습니다: ${e.message}`);
        }
    }
    /**
     * 파일/디렉토리 이동/이름변경
     * @param sourcePath 원본 경로
     * @param targetPath 대상 경로
     * @return void
     */
    moveFile(sourcePath: string, targetPath: string): void {
        this.validatePath(sourcePath);
        this.validatePath(targetPath);
        try {
            const resolvedSource = path.resolve(sourcePath);
            const resolvedTarget = path.resolve(targetPath);

            if (!fs.existsSync(resolvedSource)) {
                throw new Error(`이동할 원본 경로가 존재하지 않습니다: ${sourcePath}`);
            }

            fs.renameSync(resolvedSource, resolvedTarget);
        } catch (e: any) {
            // Optionally log: 파일 이동 오류
            throw new Error(`파일을 이동할 수 없습니다: ${e.message}`);
        }
    }
    /**
     * 파일 복사
     * @param sourcePath 원본 경로
     * @param targetPath 대상 경로
     * @returns void
     */
    copyFile(sourcePath: string, targetPath: string): void {
        this.validatePath(sourcePath);
        this.validatePath(targetPath);
        try {
            if (sourcePath === targetPath) {
                throw new Error("원본과 대상 경로가 동일합니다.");
            }

            const resolvedSource = path.resolve(sourcePath);
            const resolvedTarget = path.resolve(targetPath);

            if (!fs.existsSync(resolvedSource)) {
                throw new Error(`원본 경로가 존재하지 않습니다: ${sourcePath}`);
            }

            const stat = fs.statSync(resolvedSource);

            if (stat.isDirectory()) {
                this.copyDirectory(resolvedSource, resolvedTarget);
            } else {
                fs.copyFileSync(resolvedSource, resolvedTarget);
            }
        } catch (e: any) {
            throw new Error(`파일을 복사할 수 없습니다: ${e.message}`);
        }
    }

    /**
     * 디렉토리 재귀 복사
     * @param source 원본 디렉토리 경로
     * @param target 대상 디렉토리 경로
     * @returns void
     */
    copyDirectory(source: string, target: string): void {
        if (!fs.existsSync(target)) {
            fs.mkdirSync(target, { recursive: true });
        }
        const entries = fs.readdirSync(source, { withFileTypes: true });
        for (const entry of entries) {
            const srcPath = path.join(source, entry.name);
            const destPath = path.join(target, entry.name);
            if (entry.isDirectory()) {
                this.copyDirectory(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }
    /**
     * 디렉토리 재귀 복사 (TypeScript 버전)
     * @param source 원본 디렉토리 경로
     * @param target 대상 디렉토리 경로
     * @returns void
     */
    copyDirectoryRecursive(source: string, target: string): void {
        const entries = fs.readdirSync(source, { withFileTypes: true });
        for (const entry of entries) {
            const srcPath = path.join(source, entry.name);
            const destPath = path.join(target, entry.name);
            if (entry.isDirectory()) {
                if (!fs.existsSync(destPath)) {
                    fs.mkdirSync(destPath, { recursive: true });
                }
                this.copyDirectoryRecursive(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }

    // ====================================================================================================
    // ====================================================================================================

}
