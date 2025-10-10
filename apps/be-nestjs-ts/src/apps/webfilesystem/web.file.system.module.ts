import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WebFileSystemController } from './controller/web.file.system.controller';
import { WebFileSystemService } from './service/web.file.system.service';
import { WebFileSystemBeEnv } from './env/web.file.system.be.env';
import { WebFileSystemFeEnvWatchController } from './env/web.file.system.fe.env.watch.controller';
import { WebFileSystemFeEnvWatchService } from './env/web.file.system.fe.env.watch.service';

@Module({
    imports: [ConfigModule],
    controllers: [
        WebFileSystemController,
        WebFileSystemFeEnvWatchController,
    ],
    providers: [
        WebFileSystemService,
        WebFileSystemBeEnv,
        WebFileSystemFeEnvWatchService,
    ],
    exports: [
        WebFileSystemService,
        WebFileSystemBeEnv,
        WebFileSystemFeEnvWatchService,
    ],
})
export class WebFileSystemModule {}