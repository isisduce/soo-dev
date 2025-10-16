package com.soo.apps.standard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DifferentTermDto {

    private String tblNm;
    private String colNm;
    private String colKr;
    private String termEnAbrvNm;
    private String termNm;

}
