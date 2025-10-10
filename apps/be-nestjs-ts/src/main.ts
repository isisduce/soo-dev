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
    const corsConfigPath = path.join(__dirname, '../config/cors.json');
    let corsOptions = defaultCorsOptions;
    if (fs.existsSync(corsConfigPath)) {
        try {
            corsOptions = JSON.parse(fs.readFileSync(corsConfigPath, 'utf-8'));
        } catch (e) {
            console.warn('CORS 설정 파일 파싱 오류, 기본값 사용:', e);
        }
    }
    console.log('CORS 설정:', corsOptions);
    app.enableCors(corsOptions);
    await app.listen(process.env.PORT || 3000);
}
bootstrap();
