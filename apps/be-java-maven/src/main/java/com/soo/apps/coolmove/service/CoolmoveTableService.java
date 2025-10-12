package com.soo.apps.coolmove.service;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import com.soo.apps.coolmove.mapper.CoolmoveTableMapper;
import com.soo.apps.database.mapper.DatabaseMapper;
import com.soo.common.helper.ParamHelper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@Primary
@RequiredArgsConstructor
public class CoolmoveTableService {

    // ====================================================================================================

    private final DatabaseMapper databaseMapper;
    private final CoolmoveTableMapper coolmoveTableMapper;

    // ====================================================================================================
    // ====================================================================================================

    public boolean createTables() {
        try {
            coolmoveTableMapper.createTableCandidatePledge();
            coolmoveTableMapper.createTableCandidateItem();
            coolmoveTableMapper.createTableCandidateMast();
            return true;
        } catch (Exception e) {
            log.error("Error creating tables: " + e.getMessage(), e);
        }
        return false;
    }

    public boolean dropTables() {
        try {
            ArrayList<String> tableNameList = coolmoveTableMapper.selectTableNames();
            for (String tableName : tableNameList) {
                if (tableName != null && tableName.startsWith("candidate_")) {
                    HashMap<String, Object> param = new HashMap<>();
                    ParamHelper.addParam(param, "tableName", tableName);
                    databaseMapper.dropTable(param);
                }
            }
            return true;
        } catch (Exception e) {
            log.error("Error creating tables: " + e.getMessage(), e);
        }
        return false;
    }

    // ====================================================================================================
    // ====================================================================================================

}