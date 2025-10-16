package com.soo.apps.standard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UndefinedTermDto {

    private String tblNm;
    private String colNm;
    private String dataType;
    private String dataLen;

}
