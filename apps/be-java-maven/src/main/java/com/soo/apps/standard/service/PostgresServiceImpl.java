package com.soo.apps.standard.service;

import java.util.HashMap;
import java.util.List;

import org.springframework.stereotype.Component;

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
import com.soo.apps.standard.mapper.PostgresMapper;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class PostgresServiceImpl implements PostgresService {

    private final PostgresMapper postgresdMapper;

    @Override
    public List<SummaryDto> getSummary(HashMap<String, Object> param) throws Exception
    {
        List<SummaryDto> ret = postgresdMapper.getSummary(param);
        return ret;
    }

    @Override
    public int findTable(String tblNm) throws Exception {
        int ret = postgresdMapper.findTable(tblNm);
        return ret;
    }

    @Override
    public List<StdWordDto> getStdWordColumns(HashMap<String, Object> param) throws Exception
    {
        List<StdWordDto> ret = postgresdMapper.getStdWordColumns(param);
        return ret;
    }

    @Override
    public List<StdWordDto> getStdWordList(HashMap<String, Object> param) throws Exception
    {
        List<StdWordDto> ret = postgresdMapper.getStdWordList(param);
        return ret;
    }

    @Override
    public List<StdTermDto> getStdTermColumns(HashMap<String, Object> param) throws Exception
    {
        List<StdTermDto> ret = postgresdMapper.getStdTermColumns(param);
        return ret;
    }

    @Override
    public List<StdTermDto> getStdTermList(HashMap<String, Object> param) throws Exception
    {
        List<StdTermDto> ret = postgresdMapper.getStdTermList(param);
        return ret;
    }

    @Override
    public List<StdDomainDto> getStdDomainColumns(HashMap<String, Object> param) throws Exception
    {
        List<StdDomainDto> ret = postgresdMapper.getStdDomainColumns(param);
        return ret;
    }

    @Override
    public List<StdDomainDto> getStdDomainList(HashMap<String, Object> param) throws Exception
    {
        List<StdDomainDto> ret = postgresdMapper.getStdDomainList(param);
        return ret;
    }

    @Override
    public List<StdEntityDto> getStdEntityColumns(HashMap<String, Object> param) throws Exception
    {
        List<StdEntityDto> ret = postgresdMapper.getStdEntityColumns(param);
        return ret;
    }

    @Override
    public List<StdEntityDto> getStdEntityList(HashMap<String, Object> param) throws Exception
    {
        List<StdEntityDto> ret = postgresdMapper.getStdEntityList(param);
        return ret;
    }

    @Override
    public List<StdAttribDto> getStdAttribColumns(HashMap<String, Object> param) throws Exception
    {
        List<StdAttribDto> ret = postgresdMapper.getStdAttribColumns(param);
        return ret;
    }

    @Override
    public List<StdAttribDto> getStdAttribList(HashMap<String, Object> param) throws Exception
    {
        List<StdAttribDto> ret = postgresdMapper.getStdAttribList(param);
        return ret;
    }

    @Override
    public List<StdTablesDto> getStdTablesColumns(HashMap<String, Object> param) throws Exception
    {
        List<StdTablesDto> ret = postgresdMapper.getStdTablesColumns(param);
        return ret;
    }

    @Override
    public List<StdTablesDto> getStdTablesList(HashMap<String, Object> param) throws Exception
    {
        List<StdTablesDto> ret = postgresdMapper.getStdTablesList(param);
        return ret;
    }

    @Override
    public List<StdColumnDto> getStdColumnColumns(HashMap<String, Object> param) throws Exception
    {
        List<StdColumnDto> ret = postgresdMapper.getStdColumnColumns(param);
        return ret;
    }

    @Override
    public List<StdColumnDto> getStdColumnList(HashMap<String, Object> param) throws Exception
    {
        List<StdColumnDto> ret = postgresdMapper.getStdColumnList(param);
        return ret;
    }

    @Override
    public List<UndefinedWordDto> findUndefinedWordColumns(HashMap<String, Object> param) throws Exception
    {
        List<UndefinedWordDto> ret = postgresdMapper.findUndefinedWordColumns(param);
        return ret;
    }

    @Override
    public List<UndefinedWordDto> findUndefinedWordList(HashMap<String, Object> param) throws Exception
    {
        List<UndefinedWordDto> ret = postgresdMapper.findUndefinedWordList(param);
        return ret;
    }

    @Override
    public List<UndefinedTermDto> findUndefinedTermColumns(HashMap<String, Object> param) throws Exception
    {
        List<UndefinedTermDto> ret = postgresdMapper.findUndefinedTermColumns(param);
        return ret;
    }

    @Override
    public List<UndefinedTermDto> findUndefinedTermList(HashMap<String, Object> param) throws Exception
    {
        List<UndefinedTermDto> ret = postgresdMapper.findUndefinedTermList(param);
        return ret;
    }

    @Override
    public List<UndefinedDomainDto> findUndefinedDomainColumns(HashMap<String, Object> param) throws Exception
    {
        List<UndefinedDomainDto> ret = postgresdMapper.findUndefinedDomainColumns(param);
        return ret;
    }

    @Override
    public List<UndefinedDomainDto> findUndefinedDomainList(HashMap<String, Object> param) throws Exception
    {
        List<UndefinedDomainDto> ret = postgresdMapper.findUndefinedDomainList(param);
        return ret;
    }

    @Override
    public List<DifferentTermDto> findDifferentTermColumns(HashMap<String, Object> param) throws Exception
    {
        List<DifferentTermDto> ret = postgresdMapper.findDifferentTermColumns(param);
        return ret;
    }

    @Override
    public List<DifferentTermDto> findDifferentTermList(HashMap<String, Object> param) throws Exception
    {
        List<DifferentTermDto> ret = postgresdMapper.findDifferentTermList(param);
        return ret;
    }

    @Override
    public List<DifferentTypeDto> findDifferentTypeColumns(HashMap<String, Object> param) throws Exception
    {
        List<DifferentTypeDto> ret = postgresdMapper.findDifferentTypeColumns(param);
        return ret;
    }

    @Override
    public List<DifferentTypeDto> findDifferentTypeList(HashMap<String, Object> param) throws Exception
    {
        List<DifferentTypeDto> ret = postgresdMapper.findDifferentTypeList(param);
        return ret;
    }

}
