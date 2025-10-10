package com.soo.libs.dto;

import java.io.Serializable;

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
public class ApiParamDto implements Serializable {

    private String name;
    private String type;
    private boolean required;
    private Object defaultValue;
    private String description;

}
