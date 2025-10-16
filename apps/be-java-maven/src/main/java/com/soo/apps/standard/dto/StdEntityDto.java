package com.soo.apps.standard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StdEntityDto {

    private String krDbNm;
    private String entityNm;
    private String entityDesc;
    private String identifier;
    private String superTypeEntityNm;

}
