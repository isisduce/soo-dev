package com.soo.apps.standard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StdTablesDto {

    private String enDbNm;
    private String tblOwner;
    private String tblKr;
    private String tblNm;
    private String tblType;
    private String entityNm;
    private String tblDesc;
    private String tblVol;
    private String genPeriod;
    private String publicYn;
    private String pubDataList;
    private String stdApplyYn;
    private String notStdReason;

}
