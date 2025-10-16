package com.soo.apps.standard.mapper;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

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
import com.soo.apps.standard.dto.SummaryDto;

@Mapper
public interface PostgresMapper {

    public List<SummaryDto> getSummary(HashMap<String, Object> param) throws Exception;

    public int findTable(String tblNm) throws Exception;

    public List<StdWordDto> getStdWordColumns(HashMap<String, Object> param) throws Exception;
    public List<StdWordDto> getStdWordList(HashMap<String, Object> param) throws Exception;

    public List<StdTermDto> getStdTermColumns(HashMap<String, Object> param) throws Exception;
    public List<StdTermDto> getStdTermList(HashMap<String, Object> param) throws Exception;

    public List<StdDomainDto> getStdDomainColumns(HashMap<String, Object> param) throws Exception;
    public List<StdDomainDto> getStdDomainList(HashMap<String, Object> param) throws Exception;

    public List<StdEntityDto> getStdEntityColumns(HashMap<String, Object> param) throws Exception;
    public List<StdEntityDto> getStdEntityList(HashMap<String, Object> param) throws Exception;

    public List<StdAttribDto> getStdAttribColumns(HashMap<String, Object> param) throws Exception;
    public List<StdAttribDto> getStdAttribList(HashMap<String, Object> param) throws Exception;

    public List<StdTablesDto> getStdTablesColumns(HashMap<String, Object> param) throws Exception;
    public List<StdTablesDto> getStdTablesList(HashMap<String, Object> param) throws Exception;

    public List<StdColumnDto> getStdColumnColumns(HashMap<String, Object> param) throws Exception;
    public List<StdColumnDto> getStdColumnList(HashMap<String, Object> param) throws Exception;

    public List<UndefinedWordDto> findUndefinedWordColumns(HashMap<String, Object> param) throws Exception;
    public List<UndefinedWordDto> findUndefinedWordList(HashMap<String, Object> param) throws Exception;

    public List<UndefinedTermDto> findUndefinedTermColumns(HashMap<String, Object> param) throws Exception;
    public List<UndefinedTermDto> findUndefinedTermList(HashMap<String, Object> param) throws Exception;

    public List<UndefinedDomainDto> findUndefinedDomainColumns(HashMap<String, Object> param) throws Exception;
    public List<UndefinedDomainDto> findUndefinedDomainList(HashMap<String, Object> param) throws Exception;

    public List<DifferentTermDto> findDifferentTermColumns(HashMap<String, Object> param) throws Exception;
    public List<DifferentTermDto> findDifferentTermList(HashMap<String, Object> param) throws Exception;

    public List<DifferentTypeDto> findDifferentTypeColumns(HashMap<String, Object> param) throws Exception;
    public List<DifferentTypeDto> findDifferentTypeList(HashMap<String, Object> param) throws Exception;

}
