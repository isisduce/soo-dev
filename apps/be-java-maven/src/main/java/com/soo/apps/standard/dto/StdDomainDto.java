package com.soo.apps.standard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StdDomainDto {

    private String revNo;
    private String domnGroupNm;
    private String domnClassNm;
    private String domnNm;
    private String domnDesc;
    private String dataType;
    private String dataLen;
    private String dataScale;
    private String saveFmt;
    private String dispFmt;
    private String unit;
    private String allowedValue;
    private String stdKind;
    private String useYn;

}
