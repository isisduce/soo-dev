package com.soo.apps.coolmove.entity;

import com.soo.common.helper.StringHelper;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EntityCandidatePledge {

    private String seq;
    // KEY
    private String uuid;
    private String index;
    private String no;
    //
    private String pledge;
    //
    private String sysUserId;
    private String regUserId;
    private String regDt;
    private String modUserId;
    private String modDt;

    public boolean isEqual(EntityCandidatePledge other) {
        if (other == null) return false;
        if (StringHelper.IsNotEqual(this.pledge, other.pledge)) return false;
        return true;
    }

    public boolean isNotEqual(EntityCandidatePledge other) {
        return !isEqual(other);
    }

}
