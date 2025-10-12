package com.soo.apps.coolmove.entity;

import java.util.List;

import com.soo.common.helper.StringHelper;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EntityCandidateMast {

    private String seq;
    // KEY
    private String uuid;
    //
    private String mastNm;
    //
    private List<EntityCandidateItem> candidates;
    private String period;
    private String begDt;
    private String endDt;
    //
    private String votersPathNm;
    private String votersOgnlNm;
    //
    private String pubYn;
    //
    private String sysUserId;
    private String regUserId;
    private String regDt;
    private String modUserId;
    private String modDt;

    public boolean isEqual(EntityCandidateMast other) {
        if (other == null) return false;
        if (StringHelper.IsNotEqual(uuid, other.uuid)) return false;
        if (StringHelper.IsNotEqual(mastNm, other.mastNm)) return false;
        if (candidates == null && other.candidates != null) return false;
        if (candidates != null && other.candidates == null) return false;
        if (candidates != null && other.candidates != null) {
            if (candidates.size() != other.candidates.size()) return false;
            for (int i = 0; i < candidates.size(); i++) {
                if (!candidates.get(i).isEqual(other.candidates.get(i))) return false;
            }
        }
        if (StringHelper.IsNotEqual(period, other.period)) return false;
        if (StringHelper.IsNotEqual(votersPathNm, other.votersPathNm)) return false;
        if (StringHelper.IsNotEqual(votersOgnlNm, other.votersOgnlNm)) return false;
        if (StringHelper.IsNotEqual(pubYn, other.pubYn)) return false;
        return true;
    }

    public boolean isNotEqual(EntityCandidateMast other) {
        return !isEqual(other);
    }

}
