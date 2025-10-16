package com.soo.apps.standard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StdTermDto {

    private String revNo;
    private String termNm;
    private String termDesc;
    private String termEnNm;
    private String termEnAbrvNm;
    private String domnNm;
    private String allowedValue;
    private String stdCdNm;
    private String mngDeptNm;
    private String workFld;
    private String stdKind;
    private String useYn;

}
