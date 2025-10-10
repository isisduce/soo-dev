import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Subject } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class WebFileSystemFeEnvWatchService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(WebFileSystemFeEnvWatchService.name);
    private feEnvJsonPathname: string;
    private watcherActive: boolean = false;
    private debounceTimer: NodeJS.Timeout | null = null;
    public readonly envChangeSubject = new Subject<string>();

    constructor(
        private readonly configService: ConfigService,
    ) {
        // fe env.json 파일 경로 설정 (프론트엔드 설정 파일)
        this.feEnvJsonPathname = this.configService.get<string>('FE_ENV_JSON')
            || path.join(process.cwd(), '../fe-vite-react-ts/public/config/env.json');
    }

    onModuleInit() {
        this.startWatchService();
    }

    onModuleDestroy() {
        this.stopWatchService();
    }

    startWatchService(): void {
        if (this.watcherActive) {
            this.stopWatchService();
        }

        const resolvedPath = path.resolve(this.feEnvJsonPathname);

        if (fs.existsSync(resolvedPath)) {
            fs.watchFile(resolvedPath, { interval: 1000 }, (curr, prev) => {
                if (curr.mtime !== prev.mtime) {
                    this.logger.log(`fe env.json file changed: ${resolvedPath}`);
                    this.handleFileChange();
                }
            });
            this.watcherActive = true;
            this.logger.log(`Started watching fe env.json: ${resolvedPath}`);
        } else {
            this.logger.warn(`fe env.json file not found: ${resolvedPath}`);
        }
    }

    stopWatchService(): void {
        if (this.watcherActive) {
            fs.unwatchFile(this.feEnvJsonPathname);
            this.watcherActive = false;
            this.logger.log('Stopped watching fe env.json file');
        }

        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = null;
        }
    }

    private handleFileChange(): void {
        // 디바운스 처리: 300ms 내에 연속된 변경은 마지막 것만 처리
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        this.debounceTimer = setTimeout(() => {
            this.logger.log('Notifying fe env.json change after debounce');
            this.envChangeSubject.next('fe-env-updated');
        }, 300);
    }

    // 수동으로 알림을 트리거하는 메서드
    public triggerNotification(): void {
        this.logger.log('Manually triggering fe env.json change notification');
        this.envChangeSubject.next('fe-env-updated');
    }
}