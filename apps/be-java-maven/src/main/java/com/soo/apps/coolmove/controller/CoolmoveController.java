package com.soo.apps.coolmove.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.soo.apps.coolmove.config.CoolmoveConfig;
import com.soo.apps.coolmove.dto.DtoCandidateMast;
import com.soo.apps.coolmove.dto.DtoUser;
import com.soo.apps.coolmove.entity.EntityCandidateMast;
import com.soo.apps.coolmove.service.CoolmoveService;
import com.soo.apps.coolmove.service.CoolmoveTableService;
import com.soo.common.dto.ApiCode;
import com.soo.common.dto.ApiResponseDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/coolmove/api")
public class CoolmoveController {

    // ====================================================================================================

    private final String apiBase = "/coolmove/api";

    private final CoolmoveConfig coolmoveConfig;
    private final CoolmoveTableService coolmoveTableService;
    private final CoolmoveService coolmoveService;

    // ====================================================================================================
    // ====================================================================================================

    @GetMapping("/alive")
    public ResponseEntity<?> alive() {
        String apiPath = String.format("GET %s%s", apiBase, "/alive");
        log.info(apiPath + " => " + ApiCode.SUCCESS_MSG);
        return ResponseEntity.ok(ApiResponseDto.success(true));
    }

    // ====================================================================================================
    // ====================================================================================================

    @GetMapping("/admin/create-tables")
    public ResponseEntity<?> createTables(
    ) {
        String apiPath = String.format("GET %s%s", apiBase, "/admin/create-tables");
        boolean result = coolmoveTableService.createTables();
        log.info(apiPath + " => " + (result ? ApiCode.SUCCESS_MSG : ApiCode.FAILURE_MSG));
        return ResponseEntity.ok(ApiResponseDto.success(result));
    }

    @GetMapping("/admin/drop-tables")
    public ResponseEntity<?> dropTables(
    ) {
        String apiPath = String.format("GET %s%s", apiBase, "/admin/drop-tables");
        boolean result = coolmoveTableService.dropTables();
        log.info(apiPath + " => " + (result ? ApiCode.SUCCESS_MSG : ApiCode.FAILURE_MSG));
        return ResponseEntity.ok(ApiResponseDto.success(result));
    }

    // ====================================================================================================
    // ====================================================================================================

    @GetMapping("/login")
    public ResponseEntity<?> login(
        @RequestParam(required = true) String username,
        @RequestParam(required = true) String password
    ) {
        String apiPath = String.format("GET %s%s", apiBase, "/login");
        return ResponseEntity.ok(doLogin(apiPath, username, password));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
        @RequestBody(required = true) DtoUser user
    ) {
        String apiPath = String.format("POST %s%s", apiBase, "/login");
        return ResponseEntity.ok(doLogin(apiPath, user.getUsername(), user.getPassword()));
    }

    ApiResponseDto<String> doLogin(String apiPath, String username, String password) {
        ApiResponseDto<String> response = ApiResponseDto.success("token");
        log.info(apiPath + " :: " + "'" + username + "'('" + password + "')" + " => " + response.getMessage());
        return response;
    }

    // ====================================================================================================
    // ====================================================================================================

    @GetMapping("/candidate-mast/{uuid}")
    public ResponseEntity<?> candidateMastSelect(
        @PathVariable(required = false) String uuid
    ) {
        String apiPath = String.format("GET %s%s", apiBase, "/candidate-mast");
        HashMap<String,Object> params = new HashMap<>();
        ArrayList<EntityCandidateMast> entityList = coolmoveService.candidateMastSelect(params);
        ArrayList<DtoCandidateMast> dtoList = new ArrayList<>();
        for (int i = 0; i < entityList.size(); i++) {
            EntityCandidateMast entity = entityList.get(i);
            DtoCandidateMast dto = DtoCandidateMast.fromEntity(entity);
            dto.setNo(Integer.toString(entityList.size() - i));
            dtoList.add(dto);
        }
        log.info(apiPath + " => " + ApiCode.SUCCESS_MSG);
        return ResponseEntity.ok(ApiResponseDto.success(dtoList));
    }

    @PostMapping("/candidate-mast")
    public ResponseEntity<?> candidateMastInsert(
        @RequestPart(value = "candidateMast", required = true) String candidateMastJson,
        @RequestPart(value = "photo1", required = false) MultipartFile photo1,
        @RequestPart(value = "photo2", required = false) MultipartFile photo2,
        @RequestPart(value = "voters", required = false) MultipartFile voters
    ) {
        String apiPath = String.format("POST %s%s", apiBase, "/candidate-mast");
        ObjectMapper mapper = new ObjectMapper();
        DtoCandidateMast candidateMast = new DtoCandidateMast();
        try {
            candidateMast = mapper.readValue(candidateMastJson, DtoCandidateMast.class);
        } catch (Exception e) {
            log.error("Failed to process candidateMast", e);
            return ResponseEntity.badRequest().body(ApiResponseDto.failure("Failed to process candidateMast"));
        }
        ApiResponseDto<DtoCandidateMast> response = candidateMastInsertImpl(apiPath, candidateMast, photo1, photo2, voters);
        return ResponseEntity.ok(response);
    }

    ApiResponseDto<DtoCandidateMast> candidateMastInsertImpl(
        String apiPath,
        DtoCandidateMast candidateMast,
        MultipartFile photo1,
        MultipartFile photo2,
        MultipartFile voters
    ) {
        if (candidateMast.getUuid() == null || candidateMast.getUuid().isEmpty()) {
            candidateMast.setUuid(UUID.randomUUID().toString());
        }
        String uuid = candidateMast.getUuid();
        String uploadBasePath = coolmoveConfig.getRootCandidate();
        if (photo1 != null && candidateMast.getCandidates().size() > 0) {
            String prefix = uuid + "/photo1_";
            String ognlNm = photo1.getOriginalFilename();
            String pathNm = coolmoveService.saveFile(uploadBasePath, prefix, ognlNm, photo1);
            candidateMast.getCandidates().get(0).setPhotoPathNm(pathNm);
            candidateMast.getCandidates().get(0).setPhotoOgnlNm(ognlNm);
        }
        if (photo2 != null && candidateMast.getCandidates().size() > 1) {
            String prefix = uuid + "/photo2_";
            String ognlNm = photo2.getOriginalFilename();
            String pathNm = coolmoveService.saveFile(uploadBasePath, prefix, ognlNm, photo2);
            candidateMast.getCandidates().get(1).setPhotoPathNm(pathNm);
            candidateMast.getCandidates().get(1).setPhotoOgnlNm(ognlNm);
        }
        if (voters != null) {
            String prefix = uuid + "/voters_";
            String ognlNm = voters.getOriginalFilename();
            String pathNm = coolmoveService.saveFile(uploadBasePath, prefix, ognlNm, voters);
            candidateMast.setVotersPathNm(pathNm);
            candidateMast.setVotersOgnlNm(ognlNm);
        }
        DtoCandidateMast savedCandidateMast = coolmoveService.candidateMastInsert(candidateMast);
        ApiResponseDto<DtoCandidateMast> response = ApiResponseDto.success(savedCandidateMast);
        log.info(apiPath + " :: candidates: " + savedCandidateMast.getCandidates());
        log.info(apiPath + " :: period: " + savedCandidateMast.getPeriod());
        log.info(apiPath + " :: voters: " + savedCandidateMast.getVotersOgnlNm());
        log.info(apiPath + " => " + response.getMessage());
        return response;
    }

    // 유권자 목록 파일 다운로드
    @GetMapping("/candidates/voter-list")
    public ResponseEntity<byte[]> downloadVoterList(
        @RequestParam(required = false) String id
    ) {
        String apiPath = String.format("GET %s%s", apiBase, "/candidates/voter-list");
        log.info(apiPath + " => voter list file download");
        // 실제 파일 생성 또는 파일 읽기 로직 필요 (여기서는 예시로 CSV 문자열)
        String csv = "이름,전화번호\n홍길동,010-1234-5678\n김철수,010-2345-6789\n";
        byte[] fileContent = csv.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        return ResponseEntity.ok()
            .header("Content-Disposition", "attachment; filename=유권자목록.csv")
            .header("Content-Type", "text/csv; charset=UTF-8")
            .body(fileContent);
    }

    // ====================================================================================================
    // ====================================================================================================

}
