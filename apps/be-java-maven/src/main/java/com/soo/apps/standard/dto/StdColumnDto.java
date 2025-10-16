package com.soo.apps.standard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StdColumnDto {

    private String tblNm;
    private String colKr;
    private String colNm;
    private String dataType;
    private String dataLen;
    private String notNull;
    private String pkInfo;
    private String fkInfo;
    private String constrt;
    private String privateYn;
    private String encryptYn;
    private String publicYn;

}
