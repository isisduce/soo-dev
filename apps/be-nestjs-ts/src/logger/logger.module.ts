import { Logger, Module } from '@nestjs/common';
import WinstonLogger from './winston.logger';

@Module({
    providers: [{
        provide: Logger,
        useClass: WinstonLogger,
    }],
    exports: [{
        provide: Logger,
        useClass: WinstonLogger,
    }],
})
export class LoggerModule { }
