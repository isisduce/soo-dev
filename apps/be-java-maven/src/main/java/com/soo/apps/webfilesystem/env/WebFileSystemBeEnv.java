package com.soo.apps.webfilesystem.env;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.soo.apps.webfilesystem.env.WebFileSystemBeEnvJson.WebFilesystem;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@Getter
@Setter
public class WebFileSystemBeEnv extends com.soo.libs.env.Env<WebFileSystemBeEnvJson> {

    // ====================================================================================================
    // ====================================================================================================

    private String envJsonPathname;
    private String feEnvJsonPathname;

    private WebFileSystemFeEnvWatchService feEnvWatchService;

    @Value("${app.config.be-env-json}")
    public void setEnvJsonPathname(String envJsonPathname) {
        this.envJsonPathname = envJsonPathname;
        setFilePath(envJsonPathname);
        setClazz(WebFileSystemBeEnvJson.class);
        load(); // 부모 클래스에서 자동으로 파일 모니터링 시작
    }

    @PreDestroy
    public void cleanup() {
        stopFileWatching(); // 부모 클래스의 메서드 사용
        if (feEnvWatchService != null) {
            feEnvWatchService.stopWatchService();
        }
    }

    // ====================================================================================================
    // ====================================================================================================

    public WebFilesystem getWebFileSystem() {
        return getConfig() != null ? getConfig().getWebFilesystem() : null;
    }

    // ====================================================================================================

    public String getRootPath() {
        return getWebFileSystem() != null ? getWebFileSystem().getRootPath() : null;
    }

    public void setRootPath(String rootPath) {
        if (getWebFileSystem() != null) {
            getWebFileSystem().setRootPath(rootPath);
        }
    }

    // ====================================================================================================

    public String getUploadPath() {
        return getWebFileSystem() != null ? getWebFileSystem().getUploadPath() : null;
    }

    public void setUploadPath(String uploadPath) {
        if (getWebFileSystem() != null) {
            getWebFileSystem().setUploadPath(uploadPath);
        }
    }

    // ====================================================================================================

    public List<WebFileSystemBeEnvJson.AllowedRoot> getAllowedPaths() {
        return getWebFileSystem() != null ? getWebFileSystem().getAllowedPaths() : Collections.emptyList();
    }

    public List<String> getAllowedPathStrings() {
        return getWebFileSystem() != null ? getWebFileSystem().getAllowedPaths().stream()
                .map(WebFileSystemBeEnvJson.AllowedRoot::getPath)
                .collect(Collectors.toList()) : Collections.emptyList();
    }

    public void setAllowedPaths(List<WebFileSystemBeEnvJson.AllowedRoot> allowedPaths) {
        if (getWebFileSystem() != null) {
            getWebFileSystem().setAllowedPaths(allowedPaths);
        }
    }

    // ====================================================================================================

    public int getMaxDepth() {
        return getWebFileSystem() != null ? getWebFileSystem().getMaxDepth() : 0;
    }

    public void setMaxDepth(int maxDepth) {
        if (getWebFileSystem() != null) {
            getWebFileSystem().setMaxDepth(maxDepth);
        }
    }

    // ====================================================================================================

    public boolean isEnableHiddenFiles() {
        return getWebFileSystem() != null ? getWebFileSystem().isEnableHiddenFiles() : false;
    }

    public void setEnableHiddenFiles(boolean enableHiddenFiles) {
        if (getWebFileSystem() != null) {
            getWebFileSystem().setEnableHiddenFiles(enableHiddenFiles);
        }
    }

    // ====================================================================================================

    public boolean isShowJunctionPoints() {
        return getWebFileSystem() != null ? getWebFileSystem().isShowJunctionPoints() : false;
    }

    public void setShowJunctionPoints(boolean showJunctionPoints) {
        if (getWebFileSystem() != null) {
            getWebFileSystem().setShowJunctionPoints(showJunctionPoints);
        }
    }

    // ====================================================================================================

    public boolean isShowSymbolicLinks() {
        return getWebFileSystem() != null ? getWebFileSystem().isShowSymbolicLinks() : false;
    }

    public void setShowSymbolicLinks(boolean showSymbolicLinks) {
        if (getWebFileSystem() != null) {
            getWebFileSystem().setShowSymbolicLinks(showSymbolicLinks);
        }
    }

    // ====================================================================================================

    public boolean isHideInaccessibleLinks() {
        return getWebFileSystem() != null ? getWebFileSystem().isHideInaccessibleLinks() : false;
    }

    public void setHideInaccessibleLinks(boolean hideInaccessibleLinks) {
        if (getWebFileSystem() != null) {
            getWebFileSystem().setHideInaccessibleLinks(hideInaccessibleLinks);
        }
    }

    // ====================================================================================================
    // ====================================================================================================

}
