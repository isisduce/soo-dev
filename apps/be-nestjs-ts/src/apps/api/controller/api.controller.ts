import { Controller, Get, Query } from '@nestjs/common';
import { join } from 'path';
import { ApiParser } from '../../../common/api/api.parser';
import { ApiInfoDto } from '../../../common/dto/api.dto';
import { ConfigService } from '@nestjs/config';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { isAbsolute } from 'path';

@Controller('api')
export class ApiController {
    // private readonly appBase = "/api";
    constructor(
        private readonly configService: ConfigService
    ) {}

    /**
     * @desc API List
     */
    @Get('api-list')
    getApiList(
        /**
         * @desc Regenerate the api-list.json file (only in dev mode)
         */
        @Query('generate') generate: boolean = false
    ): ApiInfoDto[] {
        const apiListJsonPath = this.configService.get<string>('APP_API_LIST_JSON') || 'config/api-list.json';
        const dirPath = join(process.cwd(), 'src', 'apps');
        let allApiList: ApiInfoDto[] = [];
        const isDev = process.env.NODE_ENV !== 'production';
        const filePath = isAbsolute(apiListJsonPath) ? apiListJsonPath : join(process.cwd(), apiListJsonPath);
        if (isDev) {
            allApiList = ApiParser.parseApiListFromControllers(dirPath);
            const fileExists = existsSync(filePath);
            if (generate || !fileExists) {
                try {
                    mkdirSync(require('path').dirname(filePath), { recursive: true });
                    writeFileSync(filePath, JSON.stringify(allApiList, null, 2), 'utf-8');
                } catch (e) {
                    // eslint-disable-next-line no-console
                    console.error('[DEV] api-list-json file write error', e);
                }
            }
        } else {
            // 파일을 읽어서 리턴
            try {
                if (existsSync(filePath)) {
                    const json = readFileSync(filePath, 'utf-8');
                    allApiList = JSON.parse(json);
                }
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error('api-list-json file read error', e);
            }
        }
        return allApiList;
    }
}
