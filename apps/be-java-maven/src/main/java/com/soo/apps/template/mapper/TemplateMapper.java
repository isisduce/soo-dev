package com.soo.apps.template.mapper;

import java.util.HashMap;
import java.util.List;

public interface TemplateMapper {

    List<String> selectTableNames();
    void dropTable(HashMap<String, Object> paramMap);

}
