import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { ApiInfoDto } from '../dto/api.dto';

export const ApiParser = {
    parseApiListFromControllers: (dirPath: string): ApiInfoDto[] => {
        const apiList: ApiInfoDto[] = [];
        const entries = readdirSync(dirPath, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = join(dirPath, entry.name);
            if (entry.isDirectory()) {
                apiList.push(...ApiParser.parseApiListFromControllers(fullPath));
            } else if (entry.isFile() && entry.name.endsWith('.controller.ts')) {
                apiList.push(...ApiParser.parseApiListFromFile(fullPath));
            }
        }
        return apiList;
    },

    parseApiListFromFile: (filePath: string): ApiInfoDto[] => {
        const apiList: ApiInfoDto[] = [];
        const content = readFileSync(filePath, 'utf-8');
        // Controller 이름 추출
        const controllerMatch = content.match(/class\s+(\w+Controller)/);
        const controller = controllerMatch ? controllerMatch[1] : '';
        // BasePath 추출
        const basePathMatch = content.match(/@Controller\(['"](.*?)['"]\)/);
        const basePath = basePathMatch ? basePathMatch[1] : '';
        // 메서드 추출: 메서드 선언부 바로 위에 붙은 JSDoc만 매칭 (파라미터 JSDoc은 매칭하지 않음)
        // 라인 단위 파싱으로 JSDoc과 @Get 사이에 공백/줄바꿈만 있을 때만 JSDoc을 API desc로 사용
        const lines = content.split(/\r?\n/);
        let lastJSDoc: string | undefined = undefined;
        let lastJSDocLine: number | undefined = undefined;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            // JSDoc 시작
            if (line.trim().startsWith('/**')) {
                let jsdocLines = [line];
                let j = i + 1;
                while (j < lines.length && !lines[j].trim().endsWith('*/')) {
                    jsdocLines.push(lines[j]);
                    j++;
                }
                if (j < lines.length) {
                    jsdocLines.push(lines[j]);
                    lastJSDoc = jsdocLines.join('\n');
                    lastJSDocLine = j;
                    i = j;
                }
                continue;
            }
            // @Get 등 데코레이터
            const decoMatch = line.match(/@(Get|Post|Put|Delete|Patch)\(['\"](.*?)['\"]\)/);
            if (decoMatch) {
                // JSDoc이 바로 위에 붙어있는지(공백/줄바꿈만 있는지) 체크
                let hasOnlyBlank = true;
                if (lastJSDocLine !== undefined) {
                    for (let k = lastJSDocLine + 1; k < i; k++) {
                        if (lines[k].trim() !== '') {
                            hasOnlyBlank = false;
                            break;
                        }
                    }
                } else {
                    hasOnlyBlank = false;
                }
                const method = decoMatch[1].toUpperCase();
                const apiPath = decoMatch[2];
                const fullPath = basePath ? `/${basePath.replace(/^\//, '')}/${apiPath.replace(/^\//, '')}` : `/${apiPath.replace(/^\//, '')}`;
                // description 추출
                let description: string | undefined = undefined;
                if (hasOnlyBlank && lastJSDoc) {
                    const descMatch = lastJSDoc.match(/@desc\s+([\s\S]*?)(?=\*\s*@|\*\/|$)/);
                    if (descMatch) {
                        description = descMatch[1].replace(/^\s*\*\s?/gm, '').replace(/\s+$/, '').trim();
                    }
                }
                // 파라미터 추출: 함수 선언부 찾기
                let funcLine = i + 1;
                while (funcLine < lines.length && !/\w+\s*\(/.test(lines[funcLine])) funcLine++;
                let paramsRaw = '';
                if (funcLine < lines.length) {
                    // 괄호 카운팅 방식으로 파라미터 블록 추출
                    const funcText = lines.slice(funcLine).join('\n');
                    const openIdx = funcText.indexOf('(');
                    if (openIdx >= 0) {
                        let depth = 1, endIdx = openIdx + 1;
                        for (; endIdx < funcText.length; endIdx++) {
                            if (funcText[endIdx] === '(') depth++;
                            else if (funcText[endIdx] === ')') depth--;
                            if (depth === 0) break;
                        }
                        paramsRaw = funcText.slice(openIdx + 1, endIdx);
                    }
                }
                // 파라미터 파싱 로직 재활용
                const paramBlockRegex = /(\/\*\*[\s\S]*?\*\/|\/\/.*)?\s*(@[\w\(\)'",\s]+\s+[\w$]+\??:\s*[\w\[\]<>]+(?:\s*=\s*[^,\)]+)?)/g;
                const paramList: { param: string, jsdoc?: string }[] = [];
                let paramBlockMatch;
                while ((paramBlockMatch = paramBlockRegex.exec(paramsRaw)) !== null) {
                    paramList.push({
                        param: paramBlockMatch[2].replace(/\s+/g, ' ').trim(),
                        jsdoc: paramBlockMatch[1] ? paramBlockMatch[1].trim() : undefined
                    });
                }
                const paramRegex = /@(Param|Query|Body|Req|Res|Headers|UploadedFile|UploadedFiles|Ip|Session|Custom\w*)\s*(?:\([\s\S]*?['"]([^'")]+)['"][\s\S]*?\))?\s*([\w$]+)(\?)?\s*:\s*([\w\[\]<>]+)/;
                const params: any[] = [];
                for (const param of paramList) {
                    const paramMatch = paramRegex.exec(param.param);
                    let paramDescription: string | undefined = undefined;
                    if (param.jsdoc) {
                        const jsdocEndIdx = param.param.indexOf('*/');
                        const afterJsdoc = jsdocEndIdx >= 0 ? param.param.slice(jsdocEndIdx + 2) : '';
                        if (!/^\s*\n\s*\n/.test(afterJsdoc)) {
                            const doc = param.jsdoc;
                            const descLine = doc.match(/@desc\s+([^*\n]+)/) || doc.match(/\*\s*([^@\n]+)/) || doc.match(/\/\/\s*(.+)/);
                            if (descLine) paramDescription = descLine[1].trim();
                        }
                    }
                    let defaultValue: any = undefined;
                    let required = true;
                    const defaultMatch = param.param.match(/=\s*([^,)]+)/);
                    if (defaultMatch) {
                        let val = defaultMatch[1].trim();
                        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                            defaultValue = val.slice(1, -1);
                        } else if (val === 'false') defaultValue = false;
                        else if (val === 'true') defaultValue = true;
                        else if (!isNaN(Number(val))) defaultValue = Number(val);
                        else defaultValue = val;
                        required = false;
                    } else {
                        required = !paramMatch?.[4];
                    }
                    if (paramMatch) {
                        params.push({
                            name: paramMatch[2] || paramMatch[3],
                            type: paramMatch[5] ? paramMatch[5].split('=')[0].trim() : undefined,
                            required,
                            defaultValue,
                            description: paramDescription
                        });
                    }
                }
                apiList.push({
                    controller,
                    method,
                    label: fullPath,
                    path: fullPath,
                    description,
                    params
                });
                // JSDoc 소진
                lastJSDoc = undefined;
                lastJSDocLine = undefined;
            }
        }
        return apiList;
    },

    generateApiListFile: (dirPath: string, apiList: ApiInfoDto[], fileName = 'api-list.json') => {
        const { writeFileSync } = require('fs');
        const { join, isAbsolute } = require('path');
        const filePath = isAbsolute(fileName) ? fileName : join(dirPath, fileName);
        // 디버깅 로그 추가
        // eslint-disable-next-line no-console
        console.log('[ApiParser] api-list.json 생성 경로:', filePath);
        if (apiList && apiList.length > 0) {
            // eslint-disable-next-line no-console
            console.log('[ApiParser] 첫 번째 API params:', JSON.stringify(apiList[0].params, null, 2));
        }
        writeFileSync(filePath, JSON.stringify(apiList, null, 2), 'utf-8');
        return filePath;
    }

};