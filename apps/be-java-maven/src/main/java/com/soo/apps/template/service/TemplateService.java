package com.soo.apps.template.service;

import java.util.HashMap;
import java.util.List;

import org.springframework.stereotype.Service;

import com.soo.apps.template.mapper.TemplateMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TemplateService {

    private final TemplateMapper templateMapper;

    public List<String> getTableNames() {
        return templateMapper.selectTableNames();
    }

    public void dropTable(String tableName) {
        HashMap<String, Object> hashMap = new HashMap<>() {{
            put("tableName", tableName);
        }};
        templateMapper.dropTable(hashMap);
    }

}
