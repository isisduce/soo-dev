package com.soo.apps.api;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@Builder
@Data
@NoArgsConstructor
@ToString
public class ApiInfoDto implements Serializable {

    private String controller;
    private String method;
    private String label;
    private String path;
    private String description;
    private List<ApiParamDto> params;

}
