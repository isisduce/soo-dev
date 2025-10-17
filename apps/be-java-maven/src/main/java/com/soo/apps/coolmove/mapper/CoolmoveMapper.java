package com.soo.apps.coolmove.mapper;

import java.util.ArrayList;
import java.util.HashMap;

import org.apache.ibatis.annotations.Mapper;

import com.soo.apps.coolmove.entity.EntityCandidateItem;
import com.soo.apps.coolmove.entity.EntityCandidateMast;
import com.soo.apps.coolmove.entity.EntityCandidatePledge;
import com.soo.apps.coolmove.entity.EntityCandidateVote;

@Mapper
public interface CoolmoveMapper {

    ArrayList<EntityCandidateMast> candidateMastSelect(HashMap<String, Object> params);

    boolean candidateMastInsert(EntityCandidateMast entity);
    boolean candidateMastUpdate(EntityCandidateMast entity);
    boolean candidateMastUpdatePeriod(String uuid, String period, String begDt, String endDt, String modUserId);
    boolean candidateMastUpdateStatus(String uuid, String status, String modUserId);
    boolean candidateMastRemove(String uuid);

    ArrayList<EntityCandidateItem> candidateItemSelect(HashMap<String, Object> params);
    boolean candidateItemInsert(EntityCandidateItem entity);
    boolean candidateItemUpdate(EntityCandidateItem entity);
    boolean candidateItemRemove(String uuid, String id);

    ArrayList<EntityCandidatePledge> candidatePledgeSelect(HashMap<String, Object> params);
    boolean candidatePledgeInsert(String uuid, String id, String no, String pledge, String regUserId);
    boolean candidatePledgeUpdate(String uuid, String id, String no, String pledge, String modUserId);
    boolean candidatePledgeRemove(String uuid, String id, String no);

    ArrayList<EntityCandidateVote> candidateVoteSelect(HashMap<String, Object> params);
    boolean candidateVoteInsert(String userId, String uuid, String id, String no, String regUserId);
    boolean candidateVoteUpdate(String userId, String uuid, String id, String no, String modUserId);
    boolean candidateVoteRemove(String userId, String uuid, String id);

}
