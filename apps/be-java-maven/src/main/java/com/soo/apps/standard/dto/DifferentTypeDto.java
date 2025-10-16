package com.soo.apps.standard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DifferentTypeDto {

    private String tblNm;
    private String colNm;
    private String dataType;
    private String dataLen;
    private String domnDataType;
    private String domnDataLen;
    private String domnDataScale;

}
