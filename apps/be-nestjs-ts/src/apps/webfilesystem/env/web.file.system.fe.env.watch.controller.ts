import { Controller, Sse, MessageEvent, Logger } from '@nestjs/common';
import { Observable, map, tap, finalize, startWith } from 'rxjs';
import { WebFileSystemBeEnv } from '../env/web.file.system.be.env';
import { WebFileSystemFeEnvWatchService } from './web.file.system.fe.env.watch.service';

@Controller('api/webfilesystem/fe/env')
export class WebFileSystemFeEnvWatchController {
    private readonly logger = new Logger(WebFileSystemFeEnvWatchController.name);
    private clientCount = 0;

    constructor(
        private readonly beEnv: WebFileSystemBeEnv,
        private readonly feEnvWatchService: WebFileSystemFeEnvWatchService
    ) {}

    @Sse('stream')
    streamFeEnvChanges(): Observable<MessageEvent> {
        this.clientCount++;
        this.logger.log(`[FeEnvWatchController] New SSE client connected. Total clients: ${this.clientCount}`);

        return this.feEnvWatchService.envChangeSubject.asObservable().pipe(
            startWith('connected'), // 연결 시 즉시 확인 메시지 전송
            tap((data: string) => {
                this.logger.log(`[FeEnvWatchController] Sending SSE message: ${data}`);
            }),
            map((data: string) => ({
                data,
                type: 'message',
            } as MessageEvent)),
            finalize(() => {
                this.clientCount--;
                this.logger.log(`[FeEnvWatchController] SSE client disconnected. Total clients: ${this.clientCount}`);
            })
        );
    }
}