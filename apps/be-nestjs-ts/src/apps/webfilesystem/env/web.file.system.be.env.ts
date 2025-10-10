import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { WebFileSystemBeEnvJson, WebFilesystem, AllowedRoot } from './web.file.system.be.env.json';

@Injectable()
export class WebFileSystemBeEnv implements OnModuleDestroy {
    private readonly logger = new Logger(WebFileSystemBeEnv.name);
    private config: WebFileSystemBeEnvJson | null = null;
    private watcherActive: boolean = false;
    private envJsonPathname: string;

    constructor(private configService: ConfigService) {
        this.envJsonPathname = this.configService.get<string>('BE_ENV_JSON') || './config/env.json';
        this.load();
        this.startFileWatching();
    }

    onModuleDestroy() {
        this.stopFileWatching();
    }

    private load(): void {
        try {
            if (fs.existsSync(this.envJsonPathname)) {
                const jsonContent = fs.readFileSync(this.envJsonPathname, 'utf8');
                this.config = JSON.parse(jsonContent) as WebFileSystemBeEnvJson;
                this.logger.log(`Loaded WebFileSystem BE config from: ${this.envJsonPathname}`);
            } else {
                this.logger.warn(`Config file not found: ${this.envJsonPathname}`);
                this.config = { webFilesystem: this.getDefaultWebFilesystem() };
            }
        } catch (error) {
            this.logger.error(`Failed to load config from ${this.envJsonPathname}:`, error);
            this.config = { webFilesystem: this.getDefaultWebFilesystem() };
        }
    }

    private getDefaultWebFilesystem(): WebFilesystem {
        return {
            rootPath: '/tmp',
            uploadPath: '/tmp/uploads',
            allowedPaths: [],
            maxDepth: 5,
            enableHiddenFiles: false,
            showJunctionPoints: false,
            showSymbolicLinks: false,
            hideInaccessibleLinks: true
        };
    }

    private startFileWatching(): void {
        if (this.watcherActive) {
            this.stopFileWatching();
        }

        if (fs.existsSync(this.envJsonPathname)) {
            fs.watchFile(this.envJsonPathname, { interval: 1000 }, () => {
                this.logger.log(`Config file changed: ${this.envJsonPathname}`);
                this.load();
            });
            this.watcherActive = true;
            this.logger.log(`Started watching config file: ${this.envJsonPathname}`);
        }
    }

    private stopFileWatching(): void {
        if (this.watcherActive) {
            fs.unwatchFile(this.envJsonPathname);
            this.watcherActive = false;
            this.logger.log('Stopped watching config file');
        }
    }

    // ====================================================================================================
    // Getter methods for WebFilesystem config
    // ====================================================================================================

    getConfig(): WebFileSystemBeEnvJson | null {
        return this.config;
    }

    getWebFileSystem(): WebFilesystem | null {
        return this.config?.webFilesystem || null;
    }

    // ====================================================================================================
    // Root Path
    // ====================================================================================================

    getRootPath(): string | null {
        return this.getWebFileSystem()?.rootPath || null;
    }

    setRootPath(rootPath: string): void {
        const webFs = this.getWebFileSystem();
        if (webFs) {
            webFs.rootPath = rootPath;
        }
    }

    // ====================================================================================================
    // Upload Path
    // ====================================================================================================

    getUploadPath(): string | null {
        return this.getWebFileSystem()?.uploadPath || null;
    }

    setUploadPath(uploadPath: string): void {
        const webFs = this.getWebFileSystem();
        if (webFs) {
            webFs.uploadPath = uploadPath;
        }
    }

    // ====================================================================================================
    // Allowed Paths
    // ====================================================================================================

    getAllowedPaths(): AllowedRoot[] {
        return this.getWebFileSystem()?.allowedPaths || [];
    }

    getAllowedPathStrings(): string[] {
        return this.getAllowedPaths().map(root => root.path);
    }

    setAllowedPaths(allowedPaths: AllowedRoot[]): void {
        const webFs = this.getWebFileSystem();
        if (webFs) {
            webFs.allowedPaths = allowedPaths;
        }
    }

    // ====================================================================================================
    // Max Depth
    // ====================================================================================================

    getMaxDepth(): number {
        return this.getWebFileSystem()?.maxDepth || 0;
    }

    setMaxDepth(maxDepth: number): void {
        const webFs = this.getWebFileSystem();
        if (webFs) {
            webFs.maxDepth = maxDepth;
        }
    }

    // ====================================================================================================
    // Enable Hidden Files
    // ====================================================================================================

    isEnableHiddenFiles(): boolean {
        return this.getWebFileSystem()?.enableHiddenFiles || false;
    }

    setEnableHiddenFiles(enableHiddenFiles: boolean): void {
        const webFs = this.getWebFileSystem();
        if (webFs) {
            webFs.enableHiddenFiles = enableHiddenFiles;
        }
    }

    // ====================================================================================================
    // Show Junction Points
    // ====================================================================================================

    isShowJunctionPoints(): boolean {
        return this.getWebFileSystem()?.showJunctionPoints || false;
    }

    setShowJunctionPoints(showJunctionPoints: boolean): void {
        const webFs = this.getWebFileSystem();
        if (webFs) {
            webFs.showJunctionPoints = showJunctionPoints;
        }
    }

    // ====================================================================================================
    // Show Symbolic Links
    // ====================================================================================================

    isShowSymbolicLinks(): boolean {
        return this.getWebFileSystem()?.showSymbolicLinks || false;
    }

    setShowSymbolicLinks(showSymbolicLinks: boolean): void {
        const webFs = this.getWebFileSystem();
        if (webFs) {
            webFs.showSymbolicLinks = showSymbolicLinks;
        }
    }

    // ====================================================================================================
    // Hide Inaccessible Links
    // ====================================================================================================

    isHideInaccessibleLinks(): boolean {
        return this.getWebFileSystem()?.hideInaccessibleLinks || false;
    }

    setHideInaccessibleLinks(hideInaccessibleLinks: boolean): void {
        const webFs = this.getWebFileSystem();
        if (webFs) {
            webFs.hideInaccessibleLinks = hideInaccessibleLinks;
        }
    }
}