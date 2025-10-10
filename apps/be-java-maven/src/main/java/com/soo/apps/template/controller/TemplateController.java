package com.soo.apps.template.controller;

import java.util.Collections;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.soo.apps.template.service.TemplateService;
import com.soo.libs.dto.ApiCode;
import com.soo.libs.dto.ApiResponseDto;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/template")
public class TemplateController {

    private final String apiBase = "/api/template";

    private final TemplateService templateService;

    // ====================================================================================================
    // ====================================================================================================

    /**
     * @Description alive
     */
    @GetMapping("/alive")
    @Parameters({
    })
    public ResponseEntity<?> alive() {
        String apiPath = String.format("GET %s%s", apiBase, "/alive");
        // log.info(apiPath);
        boolean ret = true;
        String message = apiPath + " => " + ApiCode.SUCCESS_MSG;
        log.info(message + " :: " + ret);
        return ResponseEntity.ok(ApiResponseDto.success(ret, message));
    }

    /**
     * @Description hello
     */
    @GetMapping("/hello")
    @Parameters({
        @Parameter(name = "text", example = "Hello Java")
    })
    public ResponseEntity<?> getHello(
            @RequestParam(value = "text", required = false, defaultValue = "Hello Java") String text
    ) {
        String apiPath = String.format("GET %s%s", apiBase, "/hello");
        String hello = text;
        String message = apiPath + " => " + ApiCode.SUCCESS_MSG;
        log.info(message + " :: " + hello);
        return ResponseEntity.ok(ApiResponseDto.success(message, hello));
    }

    // ====================================================================================================
    // ====================================================================================================

    /**
     * @Description tables
     */
    @GetMapping("/tables")
    @Parameters({
    })
    public ResponseEntity<?> getTables() {
        String apiPath = String.format("GET %s%s", apiBase, "/tables");
        String message = apiPath + " => " + ApiCode.SUCCESS_MSG;
        List<String> tables = templateService.getTableNames();
        log.info(message + " :: " + tables.size());
        return ResponseEntity.ok(ApiResponseDto.success(Collections.singletonMap("tables", tables), message));
    }

    // ====================================================================================================
    // ====================================================================================================

}
