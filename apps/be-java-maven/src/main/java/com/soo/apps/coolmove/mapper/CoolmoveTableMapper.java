package com.soo.apps.coolmove.mapper;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CoolmoveTableMapper {

    ArrayList<String> selectTableNames();

    void createTableCandidatePledge();
    void createTableCandidateItem();
    void createTableCandidateMast();

}
