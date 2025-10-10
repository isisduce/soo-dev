package com.soo.apps.coolmove.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.soo.common.dto.ApiCode;
import com.soo.common.dto.ApiResponseDto;

import io.swagger.v3.oas.annotations.Parameters;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/coolmove")
public class CoolmoveController {

    // ====================================================================================================

    private final String apiBase = "/coolmove";
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    // ====================================================================================================
    // ====================================================================================================

    @GetMapping("/alive")
    @Parameters({
    })
    public ResponseEntity<?> alive() {
        String apiPath = String.format("GET %s%s", apiBase, "/alive");
        logger.info(apiPath + " => " + ApiCode.SUCCESS_MSG);
        return ResponseEntity.ok(ApiResponseDto.success(true));
    }

    // ====================================================================================================
    // ====================================================================================================

    // ====================================================================================================
    // ====================================================================================================
}
