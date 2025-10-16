package com.soo.apps.standard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SummaryDto {

    private String notDefinedWordCnt;
    private String notDefinedTermCnt;
    private String differentTermCnt;
    private String differentTypeCnt;
    private String wordCnt;
    private String termCnt;
    private String domnCnt;

}
