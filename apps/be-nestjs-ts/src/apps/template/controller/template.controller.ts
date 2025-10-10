import { Controller, Get, Param, Post, Query, Body } from "@nestjs/common";
import { ApiResponse, ApiResponseDTO } from "../../../common/dto/api.response.dto";
import { TemplateService } from "../service/template.service";

export class Hello3Dto {
    /**
     * @desc text for hello
     */
    text?: string;

    /**
     * @desc boolean flag
     */
    on?: boolean;
    /**
     * @desc boolean flag
     */
    use?: boolean;
}

@Controller("api/template")
export class TemplateController {
    private readonly appBase = "/api/template";
    constructor(
        private readonly templateService: TemplateService
    ) { }

    /**
     * @desc alive
     */
    @Get("alive")
    async alive(): Promise<
        ApiResponseDTO<boolean>
    > {
        const message = "GET" + " " + this.appBase + "/alive";
        const alive = true;
        return ApiResponse.successWithMessage(alive, message + " => success");
    }

    /**
     * @desc hello
     */
    @Get("hello")
    async hello(
        /**
         * @desc text for hello
         */
        @Query('text') text: string = "Hello nestjs"
    ): Promise<
        ApiResponseDTO<string>
    > {
        const message = "GET" + " " + this.appBase + "/hello";
        const hello = text;
        return ApiResponse.successWithMessage(hello, message + " => success");
    }

    /**
     * @desc hello
     */
    @Get("hello2")
    async hello2(
        /**
         * @desc text for hello
         */
        @Query('text') text: string = "Hello nestjs"
    ): Promise<
        ApiResponseDTO<string>
    > {
        const message = "GET" + " " + this.appBase + "/hello";
        const hello = text;
        return ApiResponse.successWithMessage(message + " => success", hello);
    }

    /**
     * @desc hello3 - POST 방식으로 텍스트와 플래그를 받아 처리
     */
    @Post("hello3")
    async hello3(
        @Body() body: Hello3Dto,
        @Query('text') queryText: string = 'Hello nestjs',
        @Query('on') queryOn: boolean = false,
        /**
         * @desc use on/off
         */
        @Query('use') queryUse: boolean = true
    ): Promise<
        ApiResponseDTO<string>
    > {
        const message = "POST" + " " + this.appBase + "/hello3";
        // Body에서 우선적으로 파라미터를 가져오고, 없으면 Query에서 가져옴
        const text = body?.text || queryText || "Hello nestjs";
        const on = body?.on !== undefined ? body.on : queryOn === true;
        const use = body?.use !== undefined ? body.use : queryUse === true;
        const hello = `${text} (on: ${on}, use: ${use})`;
        return ApiResponse.successWithMessage(message + " => success", hello);
    }

    /**
     * @desc tables
     */
    @Get("tables")
    async getTables(): Promise<
        ApiResponseDTO<{ tables: string[] }>
    > {
        const message = "GET" + " " + this.appBase + "/tables";
        const tables = await this.templateService.getTables();
        return ApiResponse.successWithMessage({ tables }, message + " => success");
    }

}
