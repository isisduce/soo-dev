import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { LoggerModule } from './logger/logger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormConfigService } from './database/typeorm-config.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiController } from './apps/api/controller/api.controller';
import { TemplateEntity } from './database/entities/template.entity';
// import { TemplateController } from './apps/template/controller/template.controller';
import { TemplateService } from './apps/template/service/template.service';
import { WebFileSystemModule } from './apps/webfilesystem/web.file.system.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, }),
        LoggerModule,
        TypeOrmModule.forRootAsync({
            useClass: TypeormConfigService,
            dataSourceFactory: async (options) => {
                const dataSource = await new DataSource(options).initialize();
                return dataSource;
            },
        }),
        TypeOrmModule.forFeature([TemplateEntity]),
        WebFileSystemModule,
    ],
    controllers: [
        AppController,
        ApiController,
        // TemplateController,
    ],
    providers: [
        AppService,
        TemplateService,
    ],
})
export class AppModule { }
