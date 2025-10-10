package com.soo.apps.webfilesystem.env;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@Getter
@Setter
public class WebFileSystemFeEnv {

    // ====================================================================================================
    // ====================================================================================================

    private String pathname;
    private WebFileSystemFeEnvWatchService feEnvWatchService;

    @Value("${app.config.fe-env-json}")
    public void setFeEnvJsonPathname(String pathname) {
        this.pathname = pathname;
        if (feEnvWatchService != null) {
            feEnvWatchService.setFeEnvJsonPathname(pathname);
        }
    }

    @Bean
    public WebFileSystemFeEnvWatchService feEnvWatchService(WebFileSystemFeEnvWatchController controller) {
        this.feEnvWatchService = new WebFileSystemFeEnvWatchService(controller);
        if (pathname != null && !pathname.isEmpty()) {
            feEnvWatchService.setFeEnvJsonPathname(pathname);
        }
        return feEnvWatchService;
    }

    // ====================================================================================================
    // ====================================================================================================

}
