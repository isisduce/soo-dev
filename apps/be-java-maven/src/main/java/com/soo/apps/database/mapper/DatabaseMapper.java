package com.soo.apps.database.mapper;

import java.util.HashMap;
import java.util.List;

import com.soo.apps.database.entity.EntityColumn;

public interface DatabaseMapper {

    List<String> selectTableNames();
    List<EntityColumn> selectColumns(HashMap<String, Object> paramMap);

    void dropTable(HashMap<String, Object> paramMap);

}
