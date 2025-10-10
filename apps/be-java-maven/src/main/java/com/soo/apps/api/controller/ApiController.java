package com.soo.apps.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.charset.StandardCharsets;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.RestController;

import com.soo.appmain.PackageConfig;
import com.soo.common.api.ApiParser;
import com.soo.common.dto.ApiCode;
import com.soo.common.dto.ApiInfoDto;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ApiController {

    @Value("${app.config.be-api-json}")
    private String appConfigBeApiJson;

    private final String apiBase = "/api";

    private final PackageConfig packageConfig;

    // ====================================================================================================
    // ====================================================================================================

    /**
     * @Description API List
     */
    @GetMapping("/list")
    @Parameters({
        @Parameter(name = "generate", description = "Regenerate the api-list.json file (only in dev mode)", example = "false")
    })
    public ResponseEntity<?> getApiList(
            @RequestParam(value = "generate", required = false, defaultValue = "false") boolean generate
    ) {
        String apiPath = String.format("GET %s%s", apiBase, "/list");
        Path jsonPath = Path.of(appConfigBeApiJson);
        ObjectMapper objectMapper = new ObjectMapper();
        List<ApiInfoDto> allApiList = null;
        if (packageConfig.isDev()) {
            String packageName = PackageConfig.PackageName.replace('.', '/');
            String dirPath = "src/main/java/" + packageName;
            ApiParser apiParser = new ApiParser();
            allApiList = apiParser.parseApiListFromControllers(dirPath);
            boolean fileExists = Files.exists(jsonPath);
            // logger.info("[DEV] api.json exists: {}", fileExists);
            if (generate || !fileExists) {
                try {
                    String json = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(allApiList);
                    Files.createDirectories(jsonPath.getParent());
                    Files.writeString(jsonPath, json, StandardCharsets.UTF_8);
                    log.info("[DEV] api.json generated: {}", jsonPath);
                } catch (Exception e) {
                    log.error("[DEV] api.json file write error", e);
                }
            }
        } else {
            try {
                if (Files.exists(jsonPath)) {
                    String json = Files.readString(jsonPath, StandardCharsets.UTF_8);
                    allApiList = objectMapper.readValue(json, objectMapper.getTypeFactory().constructCollectionType(List.class, ApiInfoDto.class));
                }
            } catch (Exception e) {
                log.error("api.json file read error", e);
            }
        }
        log.info(apiPath + " => " + ApiCode.SUCCESS_MSG);
        return ResponseEntity.ok(allApiList);
    }


    // ====================================================================================================
    // ====================================================================================================

}
