import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter, UniversalExceptionFilter } from './exception/filters';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalFilters(new UniversalExceptionFilter(), new HttpExceptionFilter());
    // CORS 설정 외부 파일에서 읽기, 없으면 기본값 사용
    const defaultCorsOptions = {
        origin: [
            'http://localhost:8080',
            'http://192.168.0.101:8080',
            'http://isisduce.iptime.org:8080',
        ],
        credentials: true,
    };
    let corsOptions: any = defaultCorsOptions;
    const corsConfigPath = path.join(__dirname, '../config/env.json');
    if (fs.existsSync(corsConfigPath)) {
        try {
            const envConfig = JSON.parse(fs.readFileSync(corsConfigPath, 'utf-8'));
            if (envConfig.cors && envConfig.cors.enabled) {
                corsOptions = {
                    origin: envConfig.cors.origin || defaultCorsOptions.origin,
                    credentials: envConfig.cors.credentials !== undefined ? envConfig.cors.credentials : defaultCorsOptions.credentials,
                    methods: envConfig.cors.allowedMethods,
                    allowedHeaders: envConfig.cors.allowedHeaders,
                };
            }
        } catch (e) {
            console.warn('CORS 설정 파일 파싱 오류, 기본값 사용:', e);
        }
    }
    console.log('Load CORS: ', corsOptions);
    app.enableCors(corsOptions);
    await app.listen(process.env.PORT || 3000);
}
bootstrap();
