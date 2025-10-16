package com.soo.apps.standard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StdWordDto {

    private String revNo;
    private String wordNm;
    private String wordDesc;
    private String wordEnAbrvNm;
    private String wordEnNm;
    private String formWordYn;
    private String domnClassNm;
    private String aliasWordList;
    private String forbdWordList;
    private String stdKind;
    private String useYn;

}
