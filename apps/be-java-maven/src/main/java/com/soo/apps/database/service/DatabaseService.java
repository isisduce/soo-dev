package com.soo.apps.database.service;

import java.util.HashMap;
import java.util.List;

import org.springframework.stereotype.Service;

import com.soo.apps.database.entity.EntityColumn;
import com.soo.apps.database.mapper.DatabaseMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DatabaseService {

    private final DatabaseMapper databaseMapper;

    public List<String> getTableNames() {
        return databaseMapper.selectTableNames();
    }

    public List<EntityColumn> getColumns(String tableName) {
        HashMap<String, Object> hashMap = new HashMap<>() {{
            put("tableName", tableName);
        }};
        return databaseMapper.selectColumns(hashMap);
    }

    public void dropTable(String tableName) {
        HashMap<String, Object> hashMap = new HashMap<>() {{
            put("tableName", tableName);
        }};
        databaseMapper.dropTable(hashMap);
    }

}
