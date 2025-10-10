package com.soo.apps.webfilesystem.env;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.soo.common.env.EnvJson;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class WebFileSystemBeEnvJson extends EnvJson {

    @Getter
    @Setter
    public static class AllowedRoot {
        private String name;
        private String path;
    }

    @Getter
    @Setter
    public static class WebFilesystem {

        private String rootPath;
        private String uploadPath;
        private List<AllowedRoot> allowedPaths;
        private int maxDepth;
        private boolean enableHiddenFiles;
        private boolean showJunctionPoints;
        private boolean showSymbolicLinks;
        private boolean hideInaccessibleLinks;
	}

    private WebFilesystem webFilesystem;

}
