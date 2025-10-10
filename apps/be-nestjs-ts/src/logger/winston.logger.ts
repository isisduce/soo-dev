import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

const dailyOption = (level: string) => {
    return {
        level,
        datePattern: 'YYYY-MM-DD',
        dirname: `./logs/${level}`,
        filename: `%DATE%.${level}.log`,
        maxFiles: 30,
        zippedArchive: true,
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        ),
    };
};

@Injectable()
export default class WinstonLogger implements LoggerService {
    private logger: winston.Logger;

    constructor() {
        this.logger = winston.createLogger({
            level: 'debug',
            levels: {
                // fatal: 0,
                error: 1,
                warn: 2,
                info: 3,
                // http: 4,
                verbose: 5,
                debug: 6,
                // silly: 7
            },
            transports: [
                new winstonDaily(dailyOption('debug')),
                new winstonDaily(dailyOption('verbose')),
                new winstonDaily(dailyOption('info')),
                new winstonDaily(dailyOption('warn')),
                new winstonDaily(dailyOption('error')),
            ],
        });


        if (process.env.NODE_ENV !== 'production') {
            this.logger.add(new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.errors({ stack: true }),
                    winston.format.timestamp(),
                    nestWinstonModuleUtilities.format.nestLike(process.env.APP_NAME, {
                        prettyPrint: true,
                        colors: true,
                    }),
                    winston.format.colorize({
                        all: true,
                        level: true,
                        colors: {
                            error: 'red',
                            warn: 'yellow',
                            info: 'green',
                            debug: 'blue',
                        }
                    }),
                ),
            }));
        }
    }

    fatal(message: string, ...trace: any[]) {
        this.logger.error(message, trace);
    }

    error(message: string, ...trace: any[]) {
        this.logger.error(message, trace);
    }

    warn(message: string, ...context: any[]) {
        this.logger.warn(message, context);
    }

    log(message: string, ...context: any[]) {
        this.logger.info(message, context);
    }

    verbose(message: string, ...context: any[]) {
        this.logger.verbose(message, context);
    }

    debug(message: string, ...context: any[]) {
        this.logger.debug(message, context);
    }

}

