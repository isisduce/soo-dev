package com.soo.apps.coolmove.mapper;

import java.util.ArrayList;
import java.util.HashMap;

import org.apache.ibatis.annotations.Mapper;

import com.soo.apps.coolmove.entity.EntityCandidateItem;
import com.soo.apps.coolmove.entity.EntityCandidateMast;
import com.soo.apps.coolmove.entity.EntityCandidatePledge;

@Mapper
public interface CoolmoveMapper {

    ArrayList<EntityCandidateMast> candidateMastSelect(HashMap<String, Object> params);

    boolean candidateMastInsert(EntityCandidateMast entity);
    boolean candidateMastUpdate(EntityCandidateMast entity);

    ArrayList<EntityCandidateItem> candidateItemSelect(HashMap<String, Object> params);
    boolean candidateItemInsert(EntityCandidateItem entity);
    boolean candidateItemUpdate(EntityCandidateItem entity);

    ArrayList<EntityCandidatePledge> candidatePledgeSelect(HashMap<String, Object> params);
    boolean candidatePledgeInsert(String uuid, String index, String no, String pledge, String regUserId);
    boolean candidatePledgeUpdate(String uuid, String index, String no, String pledge, String modUserId);

}
