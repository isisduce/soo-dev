package com.soo.apps.coolmove.dto;

import java.util.List;

import com.soo.apps.coolmove.entity.EntityCandidateMast;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DtoCandidateMast {

    private String seq;
    // KEY
    private String uuid;
    //
    private String no;
    private String mastNm;
    //
    private List<DtoCandidateItem> candidates;
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

    public static DtoCandidateMast fromEntity(EntityCandidateMast entity) {
        if (entity == null) {
            return null;
        }
        return DtoCandidateMast.builder()
                .seq(entity.getSeq())
                .uuid(entity.getUuid())
                .mastNm(entity.getMastNm())
                .candidates(entity.getCandidates() != null ? entity.getCandidates().stream()
                    .map(DtoCandidateItem::fromEntity)
                    .toList() : null)
                .period(entity.getPeriod())
                .begDt(entity.getBegDt())
                .endDt(entity.getEndDt())
                .votersPathNm(entity.getVotersPathNm())
                .votersOgnlNm(entity.getVotersOgnlNm())
                .pubYn(entity.getPubYn())
                .sysUserId(entity.getSysUserId())
                .regUserId(entity.getRegUserId())
                .regDt(entity.getRegDt())
                .modUserId(entity.getModUserId())
                .modDt(entity.getModDt())
                .build();
    }

    static public EntityCandidateMast toEntity(DtoCandidateMast dto) {
        if (dto == null) {
            return null;
        }
        return EntityCandidateMast.builder()
                .seq(dto.seq)
                .uuid(dto.uuid)
                .mastNm(dto.mastNm)
                .candidates(dto.candidates != null ? dto.candidates.stream()
                    .map(DtoCandidateItem::toEntity)
                    .toList() : null)
                .period(dto.period)
                .begDt(dto.begDt)
                .endDt(dto.endDt)
                .votersPathNm(dto.votersPathNm)
                .votersOgnlNm(dto.votersOgnlNm)
                .pubYn(dto.pubYn)
                .sysUserId(dto.sysUserId)
                .regUserId(dto.regUserId)
                .regDt(dto.regDt)
                .modUserId(dto.modUserId)
                .modDt(dto.modDt)
                .build();
    }

}
