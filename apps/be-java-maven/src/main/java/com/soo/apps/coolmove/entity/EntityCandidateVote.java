package com.soo.apps.coolmove.entity;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EntityCandidateVote {

    private String seq;
    // KEY
    private String uuid;
    private String userId;
    //
    private String id;
    private String no;
    //
    private String sysUserId;
    private String regUserId;
    private String regDt;
    private String modUserId;
    private String modDt;

}
