package com.soo.apps.database.dto;

import com.soo.apps.database.entity.EntityColumn;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DtoColumn {

    private String tableName;
    private String columnName;
    private String columnComment;
    private String dataType;
    private String dataSize;
    private String isNullable;
    private String columnKey;
    private String columnDefault;
    private String extra;

    public static DtoColumn FromEntity(EntityColumn entity) {
        DtoColumn dto = new DtoColumn();
        dto.setTableName(entity.getTableName());
        dto.setColumnName(entity.getColumnName());
        dto.setColumnComment(entity.getColumnComment());
        dto.setDataType(entity.getDataType());
        dto.setDataSize(entity.getDataSize());
        dto.setIsNullable(entity.getIsNullable());
        dto.setColumnKey(entity.getColumnKey());
        dto.setColumnDefault(entity.getColumnDefault());
        dto.setExtra(entity.getExtra());
        return dto;
    }

    public static EntityColumn ToEntity(DtoColumn dto) {
        EntityColumn entity = new EntityColumn();
        entity.setTableName(dto.getTableName());
        entity.setColumnName(dto.getColumnName());
        entity.setColumnComment(dto.getColumnComment());
        entity.setDataType(dto.getDataType());
        entity.setDataSize(dto.getDataSize());
        entity.setIsNullable(dto.getIsNullable());
        entity.setColumnKey(dto.getColumnKey());
        entity.setColumnDefault(dto.getColumnDefault());
        entity.setExtra(dto.getExtra());
        return entity;
    }

}
