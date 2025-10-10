package com.soo.apps.webfilesystem.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Data
@Component
@ConfigurationProperties(prefix = "web-filesystem")
public class WebExplorerProperties {

    /**
     * 파일 탐색기 루트 경로
     */
    private String rootPath = System.getProperty("user.home");

    /**
     * 접근 허용 경로 목록 (보안용)
     */
    private List<String> allowedPaths;

    /**
     * 최대 탐색 깊이
     */
    private int maxDepth = 10;

    /**
     * 숨김 파일 표시 여부
     */
    private boolean enableHiddenFiles = false;

    /**
     * Junction Point 표시 여부
     */
    private boolean showJunctionPoints = true;

    /**
     * 심볼릭 링크 표시 여부
     */
    private boolean showSymbolicLinks = true;

    /**
     * 접근할 수 없는 링크 숨기기 여부
     */
    private boolean hideInaccessibleLinks = true;
}
