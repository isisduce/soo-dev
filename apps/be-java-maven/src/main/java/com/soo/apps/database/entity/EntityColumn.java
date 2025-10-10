package com.soo.apps.database.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EntityColumn {

    private String tableName;
    private String columnName;
    private String columnComment;
    private String dataType;
    private String dataSize;
    private String isNullable;
    private String columnKey;
    private String columnDefault;
    private String extra;

}
