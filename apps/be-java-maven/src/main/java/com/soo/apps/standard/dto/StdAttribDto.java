package com.soo.apps.standard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StdAttribDto {

    private String entityNm;
    private String attribNm;
    private String attribKind;
    private String notNull;
    private String identifier;
    private String refEntityNm;
    private String refAttribNm;
    private String attribDesc;

}
