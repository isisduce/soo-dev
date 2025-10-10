package com.soo.common.env;

import java.io.File;
import java.util.Collections;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Getter
@Setter
public class Env<T extends EnvJson> {

    // ====================================================================================================
    // ====================================================================================================

    private String filePath;
    private Class<T> clazz;
    private EnvJsonFileWatcher<Env<T>> fileWatcher;
    private boolean autoWatch = true;

    // ====================================================================================================
    // ====================================================================================================

    protected T config;
    private static final ObjectMapper mapper = new ObjectMapper();

    // ====================================================================================================
    // ====================================================================================================

    private void startFileWatching() {
        if (fileWatcher != null) {
            log.debug("File watcher is already running for: [{}] {}", clazz.getName(), filePath);
            return;
        }
        try {
            fileWatcher = new EnvJsonFileWatcher<>(this, filePath);
            fileWatcher.startWatching();
            log.info("Started watching: [{}] {}", clazz.getName(), filePath);
        } catch (Exception e) {
            log.error("Failed to start watching: [{}] {}", clazz.getName(), e.getMessage(), e);
        }
    }

    public void stopFileWatching() {
        if (fileWatcher != null) {
            fileWatcher.stopWatching();
            fileWatcher = null;
            log.info("Stopped watching: [{}] {}", clazz.getName(), filePath);
        }
    }

    public void setAutoWatch(boolean autoWatch) {
        this.autoWatch = autoWatch;
        if (!autoWatch && fileWatcher != null) {
            stopFileWatching();
        }
    }

    // ====================================================================================================
    // ====================================================================================================

    public T load() {
        if (filePath == null || clazz == null) {
            throw new IllegalStateException("Must be to set both filePath and clazz." + " Current values - filePath: " + filePath + ", clazz: " + clazz);
        }
        try {
            config = mapper.readValue(new File(filePath), clazz);
            log.info("Env loaded: [{}] {}", clazz.getName(), filePath);

            if (autoWatch && fileWatcher == null && filePath != null) {
                startFileWatching();
            }

        } catch (Exception e) {
            log.error("Failed to load configuration: [{}] {}", clazz.getName(), e.getMessage(), e);
            throw new RuntimeException("Failure to load: [" + clazz.getName() + "], " + e.getMessage(), e);
        }
        return config;
    }

    public void save() {
        save(filePath);
    }

    public void save(String filePath) {
        try {
            mapper.writeValue(new File(filePath), config);
        } catch (Exception e) {
            throw new RuntimeException("Failure to save: [" + clazz.getName() + "], " + e.getMessage(), e);
        }
    }

    // ====================================================================================================
    // ====================================================================================================

    public EnvJson.CorsConfig getCors() {
        return config != null ? config.getCors() : null;
    }

    public void setCors(EnvJson.CorsConfig cors) {
        if (config != null) config.setCors(cors);
    }

    // ====================================================================================================

    public boolean isCorsEnabled() {
        return getCors() != null && getCors().isEnabled();
    }

    public void setCorsEnabled(boolean enabled) {
        if (getCors() != null) {
            getCors().setEnabled(enabled);
        }
    }

    // ====================================================================================================

    public List<String> getCorsAllowedMethods() {
        return (getCors() != null && getCors().getAllowedMethods() != null) ? getCors().getAllowedMethods() : Collections.emptyList();
    }

    public void setCorsAllowedMethods(List<String> methods) {
        if (getCors() != null) {
            getCors().setAllowedMethods(methods);
        }
    }

    // ====================================================================================================

    public List<String> getCorsAllowedHeaders() {
        return (getCors() != null && getCors().getAllowedHeaders() != null) ? getCors().getAllowedHeaders() : Collections.emptyList();
    }

    public void setCorsAllowedHeaders(List<String> headers) {
        if (getCors() != null) {
            getCors().setAllowedHeaders(headers);
        }
    }

    // ====================================================================================================

    public boolean isCorsCredentials() {
        return getCors() != null ? getCors().isCredentials() : false;
    }

    public void setCorsCredentials(boolean credentials) {
        if (getCors() != null) {
            getCors().setCredentials(credentials);
        }
    }

    // ====================================================================================================

    public List<String> getCorsOrigin() {
        return getCors() != null && getCors().getOrigin() != null ? getCors().getOrigin() : Collections.emptyList();
    }

    public void setCorsOrigin(List<String> origin) {
        if (getCors() != null) {
            getCors().setOrigin(origin);
        }
    }

    // ====================================================================================================
    // ====================================================================================================

}
