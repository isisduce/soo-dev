package com.soo.apps.standard.controller;

import java.util.HashMap;
import java.util.List;

// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.soo.apps.standard.dto.DifferentTermDto;
import com.soo.apps.standard.dto.DifferentTypeDto;
import com.soo.apps.standard.dto.UndefinedDomainDto;
import com.soo.apps.standard.dto.UndefinedTermDto;
import com.soo.apps.standard.dto.UndefinedWordDto;
import com.soo.apps.standard.dto.StdAttribDto;
import com.soo.apps.standard.dto.StdColumnDto;
import com.soo.apps.standard.dto.StdDomainDto;
import com.soo.apps.standard.dto.StdEntityDto;
import com.soo.apps.standard.dto.StdTablesDto;
import com.soo.apps.standard.dto.StdTermDto;
import com.soo.apps.standard.dto.StdWordDto;
import com.soo.apps.standard.service.PostgresService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Tag(name = "PostgresController", description = "Database Standard Postgres API Document")
@RequiredArgsConstructor
@RequestMapping("/standard/postgres")
@RestController
public class PostgresController {

    // private final Logger logger = LoggerFactory.getLogger(this.getClass());

    private final PostgresService postgresService;

    // @Value("${standard.postgres.dblink}")
    // private String standardDblink;

    public void init_standard(HashMap<String, Object> param) throws Exception
    {
        // if((standardDblink == null) || standardDblink.isEmpty()) standardDblink = "dbname=standard";
        int nFind = postgresService.findTable("standard_info");
        // String sInfo = "";
        if(0 < nFind) {
            param.put("standard_info", "1");
            // sInfo = param.get("standard_info").toString();
        }
        // log.info("standard_info : " + sInfo + ((0 < nFind) ? " : exist" : " : not exist"));
        // param.put("dblink", standardDblink);
        // logger.info("dblink : " + standardDblink);
    }

    // @GetMapping("/summary")
    // @Operation(summary="Summary", description="Summary")
    // @ApiResponses(value = { @ApiResponse(code = 200, message = "Good"),
    //                         @ApiResponse(code = 500, message = "source error"),
    //                         @ApiResponse(code = 404, message = "Table not found")})
    // @Parameters({
    // })
    // public ResponseEntity<?> getSummary(
    // ) throws Exception {
    //     List<SummaryDto> ret = postgresService.getSummary();
    //     return ResponseEntity.ok(ret);
    // }

    @GetMapping("/list/word/columns")
    @Operation(summary="Standard Word Header", description="표준단어 헤더")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Good"),
                            @ApiResponse(code = 500, message = "source error"),
                            @ApiResponse(code = 404, message = "Table not found")})
    @Parameters({
    })
    public ResponseEntity<?> getStdWordColumns(
    ) throws Exception {
        HashMap<String, Object> param = new HashMap<>();
        init_standard(param);
        List<StdWordDto> ret = postgresService.getStdWordColumns(param);
        return ResponseEntity.ok(ret);
    }

    @GetMapping("/list/word/data")
    @Operation(summary="Standard Word", description="표준단어")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Good"),
                            @ApiResponse(code = 500, message = "source error"),
                            @ApiResponse(code = 404, message = "Table not found")})
    @Parameters({
            @Parameter(name = "word", description = "단어명", example = "연도")
        ,   @Parameter(name = "abrv", description = "약어명", example = "YEAR")
        ,   @Parameter(name = "name", description = "영문명", example = "YEAR")
    })
    public ResponseEntity<?> getStdWordList(
            @RequestParam(value = "word", required = false) @Nullable String word
        ,   @RequestParam(value = "abrv", required = false) @Nullable String abrv
        ,   @RequestParam(value = "name", required = false) @Nullable String name
    ) throws Exception {
        HashMap<String, Object> param = new HashMap<>();
        init_standard(param);
        boolean b = false;
        if(word != null) { param.put("word", word); b = true; }
        if(abrv != null) { param.put("abrv", abrv); b = true; }
        if(name != null) { param.put("name", name); b = true; }
        if(b) {
            param.put("cond", "1");
        }
        List<StdWordDto> ret = postgresService.getStdWordList(param);
        return ResponseEntity.ok(ret);
    }

    @GetMapping("/list/term/columns")
    @Operation(summary="Standard Term Header", description="표준용어 헤더")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Good"),
                            @ApiResponse(code = 500, message = "source error"),
                            @ApiResponse(code = 404, message = "Table not found")})
    @Parameters({
    })
    public ResponseEntity<?> getStdTermColumns(
    ) throws Exception {
        HashMap<String, Object> param = new HashMap<>();
        init_standard(param);
        List<StdTermDto> ret = postgresService.getStdTermColumns(param);
        return ResponseEntity.ok(ret);
    }

    @GetMapping("/list/term/data")
    @Operation(summary="Standard Term", description="표준용어")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Good"),
                            @ApiResponse(code = 500, message = "source error"),
                            @ApiResponse(code = 404, message = "Table not found")})
    @Parameters({
            @Parameter(name = "term", description = "용어명", example = "연도")
        ,   @Parameter(name = "abrv", description = "약어명", example = "YEAR")
        ,   @Parameter(name = "name", description = "영문명", example = "YEAR")
    })
    public ResponseEntity<?> getStdTermList(
            @RequestParam(value = "term", required = false) @Nullable String term
        ,   @RequestParam(value = "abrv", required = false) @Nullable String abrv
        ,   @RequestParam(value = "name", required = false) @Nullable String name
    ) throws Exception {
        HashMap<String, Object> param = new HashMap<>();
        init_standard(param);
        boolean b = false;
        if(term != null) { param.put("term", term); b = true; }
        if(abrv != null) { param.put("abrv", abrv); b = true; }
        if(name != null) { param.put("name", name); b = true; }
        if(b) {
            param.put("cond", "1");
        }
        List<StdTermDto> ret = postgresService.getStdTermList(param);
        return ResponseEntity.ok(ret);
    }

    @GetMapping("/list/domain/columns")
    @Operation(summary="Standard Domain Header", description="표준도메인 헤더")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Good"),
                            @ApiResponse(code = 500, message = "source error"),
                            @ApiResponse(code = 404, message = "Table not found")})
    @Parameters({
    })
    public ResponseEntity<?> getStdDomainColumns(
    ) throws Exception {
        HashMap<String, Object> param = new HashMap<>();
        init_standard(param);
        List<StdDomainDto> ret = postgresService.getStdDomainColumns(param);
        return ResponseEntity.ok(ret);
    }

    @GetMapping("/list/domain/data")
    @Operation(summary="Standard Domain", description="표준도메인")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Good"),
                            @ApiResponse(code = 500, message = "source error"),
                            @ApiResponse(code = 404, message = "Table not found")})
    @Parameters({
            @Parameter(name = "name", description = "이름", example = "문자열")
        ,   @Parameter(name = "type", description = "타입", example = "VARCHAR")
    })
    public ResponseEntity<?> getStdDomainList(
            @RequestParam(value = "name", required = false) @Nullable String name
        ,   @RequestParam(value = "type", required = false) @Nullable String type
    ) throws Exception {
        HashMap<String, Object> param = new HashMap<>();
        init_standard(param);
        boolean b = false;
        if(name != null) { param.put("name", name); b = true; }
        if(type != null) { param.put("type", type); b = true; }
        if(b) {
            param.put("cond", "1");
        }
        List<StdDomainDto> ret = postgresService.getStdDomainList(param);
        return ResponseEntity.ok(ret);
    }

    @GetMapping("/list/entity/columns")
    @Operation(summary="Entity Header", description="엔티티정의서 헤더")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Good"),
                            @ApiResponse(code = 500, message = "source error"),
                            @ApiResponse(code = 404, message = "Table not found")})
    @Parameters({
    })
    public ResponseEntity<?> getEntityColumns(
    ) throws Exception {
        HashMap<String, Object> param = new HashMap<>();
        init_standard(param);
        List<StdEntityDto> ret = postgresService.getStdEntityColumns(param);
        return ResponseEntity.ok(ret);
    }

    @GetMapping("/list/entity/data")
    @Operation(summary="Entity", description="엔티티정의서")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Good"),
                            @ApiResponse(code = 500, message = "source error"),
                            @ApiResponse(code = 404, message = "Table not found")})
    @Parameters({
    })
    public ResponseEntity<?> getEntityList(
    ) throws Exception {
        HashMap<String, Object> param = new HashMap<>();
        init_standard(param);
        List<StdEntityDto> ret = postgresService.getStdEntityList(param);
        return ResponseEntity.ok(ret);
    }

    @GetMapping("/list/attrib/columns")
    @Operation(summary="Attrib Header", description="어트리뷰트정의서 헤더")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Good"),
                            @ApiResponse(code = 500, message = "source error"),
                            @ApiResponse(code = 404, message = "Table not found")})
    @Parameters({
    })
    public ResponseEntity<?> getAttribColumns(
    ) throws Exception {
        HashMap<String, Object> param = new HashMap<>();
        init_standard(param);
        List<StdAttribDto> ret = postgresService.getStdAttribColumns(param);
        return ResponseEntity.ok(ret);
    }

    @GetMapping("/list/attrib/data")
    @Operation(summary="Attrib", description="어트리뷰트정의서")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Good"),
                            @ApiResponse(code = 500, message = "source error"),
                            @ApiResponse(code = 404, message = "Table not found")})
    @Parameters({
    })
    public ResponseEntity<?> getAttribList(
    ) throws Exception {
        HashMap<String, Object> param = new HashMap<>();
        init_standard(param);
        List<StdAttribDto> ret = postgresService.getStdAttribList(param);
        return ResponseEntity.ok(ret);
    }

    @GetMapping("/list/tables/columns")
    @Operation(summary="Tables Header", description="테이블정의서 헤더")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Good"),
                            @ApiResponse(code = 500, message = "source error"),
                            @ApiResponse(code = 404, message = "Table not found")})
    @Parameters({
    })
    public ResponseEntity<?> getTablesColumns(
    ) throws Exception {
        HashMap<String, Object> param = new HashMap<>();
        init_standard(param);
        List<StdTablesDto> ret = postgresService.getStdTablesColumns(param);
        return ResponseEntity.ok(ret);
    }

    @GetMapping("/list/tables/data")
    @Operation(summary="Tables", description="테이블정의서")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Good"),
                            @ApiResponse(code = 500, message = "source error"),
                            @ApiResponse(code = 404, message = "Table not found")})
    @Parameters({
    })
    public ResponseEntity<?> getTables(
    ) throws Exception {
        HashMap<String, Object> param = new HashMap<>();
        init_standard(param);
        List<StdTablesDto> ret = postgresService.getStdTablesList(param);
        return ResponseEntity.ok(ret);
    }

    @GetMapping("/list/column/columns")
    @Operation(summary="Column Header", description="컬럼정의서 헤더")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Good"),
                            @ApiResponse(code = 500, message = "source error"),
                            @ApiResponse(code = 404, message = "Table not found")})
    @Parameters({
    })
    public ResponseEntity<?> getColumnColumns(
    ) throws Exception {
        HashMap<String, Object> param = new HashMap<>();
        init_standard(param);
        List<StdColumnDto> ret = postgresService.getStdColumnColumns(param);
        return ResponseEntity.ok(ret);
    }

    @GetMapping("/list/column/data")
    @Operation(summary="Column", description="컬럼정의서")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Good"),
                            @ApiResponse(code = 500, message = "source error"),
                            @ApiResponse(code = 404, message = "Table not found")})
    @Parameters({
    })
    public ResponseEntity<?> getColumn(
    ) throws Exception {
        HashMap<String, Object> param = new HashMap<>();
        init_standard(param);
        List<StdColumnDto> ret = postgresService.getStdColumnList(param);
        return ResponseEntity.ok(ret);
    }

    @GetMapping("/find/UndefinedWord/columns")
    @Operation(summary="Undefined Word Header", description="Undefined Word Header")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Good"),
                            @ApiResponse(code = 500, message = "source error"),
                            @ApiResponse(code = 404, message = "Table not found")})
    @Parameters({
    })
    public ResponseEntity<?> findUndefinedWordColumns(
    ) throws Exception {
        HashMap<String, Object> param = new HashMap<>();
        init_standard(param);
        List<UndefinedWordDto> ret = postgresService.findUndefinedWordColumns(param);
        return ResponseEntity.ok(ret);
    }

    @GetMapping("/find/UndefinedWord/data")
    @Operation(summary="Undefined Word", description="Undefined Word")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Good"),
                            @ApiResponse(code = 500, message = "source error"),
                            @ApiResponse(code = 404, message = "Table not found")})
    @Parameters({
    })
    public ResponseEntity<?> findUndefinedWordList(
    ) throws Exception {
        HashMap<String, Object> param = new HashMap<>();
        init_standard(param);
        List<UndefinedWordDto> ret = postgresService.findUndefinedWordList(param);
        return ResponseEntity.ok(ret);
    }

    @GetMapping("/find/UndefinedTerm/columns")
    @Operation(summary="Undefined Term Header", description="Undefined Term Header")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Good"),
                            @ApiResponse(code = 500, message = "source error"),
                            @ApiResponse(code = 404, message = "Table not found")})
    @Parameters({
    })
    public ResponseEntity<?> findUndefinedTermColumns(
    ) throws Exception {
        HashMap<String, Object> param = new HashMap<>();
        init_standard(param);
        List<UndefinedTermDto> ret = postgresService.findUndefinedTermColumns(param);
        return ResponseEntity.ok(ret);
    }

    @GetMapping("/find/UndefinedTerm/data")
    @Operation(summary="Undefined Term", description="Undefined Term")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Good"),
                            @ApiResponse(code = 500, message = "source error"),
                            @ApiResponse(code = 404, message = "Table not found")})
    @Parameters({
    })
    public ResponseEntity<?> findUndefinedTermList(
    ) throws Exception {
        HashMap<String, Object> param = new HashMap<>();
        init_standard(param);
        List<UndefinedTermDto> ret = postgresService.findUndefinedTermList(param);
        return ResponseEntity.ok(ret);
    }

    @GetMapping("/find/UndefinedDomain/columns")
    @Operation(summary="Undefined Domain Header", description="Undefined Domain Header")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Good"),
                            @ApiResponse(code = 500, message = "source error"),
                            @ApiResponse(code = 404, message = "Table not found")})
    @Parameters({
    })
    public ResponseEntity<?> findUndefinedDomainColumns(
    ) throws Exception {
        HashMap<String, Object> param = new HashMap<>();
        init_standard(param);
        List<UndefinedDomainDto> ret = postgresService.findUndefinedDomainColumns(param);
        return ResponseEntity.ok(ret);
    }

    @GetMapping("/find/UndefinedDomain/data")
    @Operation(summary="Undefined Domain", description="Undefined Domain")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Good"),
                            @ApiResponse(code = 500, message = "source error"),
                            @ApiResponse(code = 404, message = "Table not found")})
    @Parameters({
    })
    public ResponseEntity<?> findUndefinedDomainList(
    ) throws Exception {
        HashMap<String, Object> param = new HashMap<>();
        init_standard(param);
        List<UndefinedDomainDto> ret = postgresService.findUndefinedDomainList(param);
        return ResponseEntity.ok(ret);
    }

    @GetMapping("/find/DifferentTerm/columns")
    @Operation(summary="Different Term Header", description="Different Term Header")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Good"),
                            @ApiResponse(code = 500, message = "source error"),
                            @ApiResponse(code = 404, message = "Table not found")})
    @Parameters({
    })
    public ResponseEntity<?> findDifferentTermColumns(
    ) throws Exception {
        HashMap<String, Object> param = new HashMap<>();
        init_standard(param);
        List<DifferentTermDto> ret = postgresService.findDifferentTermColumns(param);
        return ResponseEntity.ok(ret);
    }

    @GetMapping("/find/DifferentTerm/data")
    @Operation(summary="Different Term", description="Different Term")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Good"),
                            @ApiResponse(code = 500, message = "source error"),
                            @ApiResponse(code = 404, message = "Table not found")})
    @Parameters({
    })
    public ResponseEntity<?> findDifferentTermList(
    ) throws Exception {
        HashMap<String, Object> param = new HashMap<>();
        init_standard(param);
        List<DifferentTermDto> ret = postgresService.findDifferentTermList(param);
        return ResponseEntity.ok(ret);
    }

    @GetMapping("/find/DifferentType/columns")
    @Operation(summary="Different Type/Length Header", description="Different Type/Length Header")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Good"),
                            @ApiResponse(code = 500, message = "source error"),
                            @ApiResponse(code = 404, message = "Table not found")})
    @Parameters({
    })
    public ResponseEntity<?> findDifferentTypeColumns(
    ) throws Exception {
        HashMap<String, Object> param = new HashMap<>();
        init_standard(param);
        List<DifferentTypeDto> ret = postgresService.findDifferentTypeColumns(param);
        return ResponseEntity.ok(ret);
    }

    @GetMapping("/find/DifferentType/data")
    @Operation(summary="Different Type/Length", description="Different Type/Length")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Good"),
                            @ApiResponse(code = 500, message = "source error"),
                            @ApiResponse(code = 404, message = "Table not found")})
    @Parameters({
    })
    public ResponseEntity<?> findDifferentTypeList(
    ) throws Exception {
        HashMap<String, Object> param = new HashMap<>();
        init_standard(param);
        List<DifferentTypeDto> ret = postgresService.findDifferentTypeList(param);
        return ResponseEntity.ok(ret);
    }

    @GetMapping("/save/excel")
    @Operation(summary="Save xlsx", description="엑셀저장")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Good"),
                            @ApiResponse(code = 500, message = "source error"),
                            @ApiResponse(code = 404, message = "Table not found")})
    @Parameters({
    })
    public ResponseEntity<?> saveExcel(
    ) throws Exception {
        HashMap<String, Object> param = new HashMap<>();
        init_standard(param);
        // List<StdColumnDto> ret = postgresService.getStdColumnList(param);
        // return ResponseEntity.ok(ret);
        return null;
    }

}
