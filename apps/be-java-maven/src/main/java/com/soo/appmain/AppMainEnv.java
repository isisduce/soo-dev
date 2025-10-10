package com.soo.appmain;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PreDestroy;
import lombok.Getter;
import lombok.Setter;

@Component
@Getter
@Setter
public class AppMainEnv extends com.soo.common.env.Env<com.soo.common.env.EnvJson> {

    private String envJsonPathname;

    @Value("${app.config.be-env-json}")
    public void setEnvJsonPathname(String envJsonPathname) {
        this.envJsonPathname = envJsonPathname;
        setFilePath(envJsonPathname);
        setClazz(com.soo.common.env.EnvJson.class);
        load();
    }

    @PreDestroy
    public void cleanup() {
        stopFileWatching();
    }

}
