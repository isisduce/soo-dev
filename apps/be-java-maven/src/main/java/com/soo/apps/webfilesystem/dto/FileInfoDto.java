package com.soo.apps.webfilesystem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileInfoDto {

    private String name;
    private String path;
    private String type; // file, directory, symlink, junction
    private long size;
    private String extension;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
    private boolean isReadable;
    private boolean isWritable;
    private boolean isExecutable;
    private boolean isHidden;
    private boolean isSymbolicLink;
    private boolean isJunctionPoint;
    private String linkTarget;
    private String parentPath;
    private boolean hasChildren;
}
