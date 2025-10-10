import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import UniversalException from './exceptions';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        // const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        response.status(status).json({
            code: status * 1000,
            message: exception.message,
            result: {
                origin: exception.getResponse(),
            },
        });
    }
}

@Catch(UniversalException)
export class UniversalExceptionFilter implements ExceptionFilter {
    catch(exception: UniversalException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = Math.floor(exception.code / 1000);

        response.status(status).json({
            code: exception.code,
            message: exception.message,
            result: exception.result
        });
    }
}

