package com.soo.apps.database.controller;

import java.util.Collections;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.soo.apps.database.dto.DtoColumn;
import com.soo.apps.database.entity.EntityColumn;
import com.soo.apps.database.service.DatabaseService;
import com.soo.common.dto.ApiCode;
import com.soo.common.dto.ApiResponseDto;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/database")
public class DatabaseController {

    private final String apiBase = "/api/database";
    protected final Logger logger = LoggerFactory.getLogger(this.getClass());

    private final DatabaseService databaseService;

    // ====================================================================================================
    // ====================================================================================================

    @GetMapping("/alive")
    @Parameters({
    })
    public ResponseEntity<?> alive() {
        String apiPath = String.format("GET %s%s", apiBase, "/alive");
        // logger.info(apiPath);
        boolean ret = true;
        logger.info(apiPath + " => " + ApiCode.SUCCESS_MSG + " :: " + ret);
        return ResponseEntity.ok(ApiResponseDto.success(ret));
    }

    // ====================================================================================================
    // ====================================================================================================

    @GetMapping("/tables")
    @Parameters({
    })
    public ResponseEntity<?> getTables() {
        String apiPath = String.format("GET %s%s", apiBase, "/tables");
        List<String> tables = databaseService.getTableNames();
        logger.info(apiPath + " => " + ApiCode.SUCCESS_MSG + " :: " + tables.size());
        return ResponseEntity.ok(ApiResponseDto.success(Collections.singletonMap("tables", tables)));
    }

    @GetMapping("/columns")
    @Parameters({
        @Parameter(name = "tableName", description = "table name", required = false),
    })
    public ResponseEntity<?> getColumns(
            @RequestParam(required = false) String tableName
    ) {
        String apiPath = String.format("GET %s%s", apiBase, "/columns");
        logger.info(apiPath + " :: " + tableName);
        List<EntityColumn> entityColumns = databaseService.getColumns(tableName);
        List<DtoColumn> dtoColumns = Collections.emptyList();
        for (EntityColumn col : entityColumns) {
            dtoColumns.add(DtoColumn.FromEntity(col));
        }
        logger.info(apiPath + " => " + ApiCode.SUCCESS_MSG + " :: " + dtoColumns.size());
        return ResponseEntity.ok(ApiResponseDto.success(Collections.singletonMap("columns", dtoColumns)));
    }

    // get table info
    // get table data
    // execute query

}
