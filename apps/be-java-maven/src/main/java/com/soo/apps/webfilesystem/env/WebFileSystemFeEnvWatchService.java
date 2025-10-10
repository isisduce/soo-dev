package com.soo.apps.webfilesystem.env;

import org.springframework.stereotype.Service;

import com.soo.common.watcher.FileWatcher;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

@Service
@Getter
@Setter
@RequiredArgsConstructor
@Slf4j
public class WebFileSystemFeEnvWatchService {

    private final WebFileSystemFeEnvWatchController feEnvController;
    private FileWatcher fileWatcher;
    private String pathname;

    public void setFeEnvJsonPathname(String pathname) {
        this.pathname = pathname;
        restartWatchService();
    }

    @PostConstruct
    public void watchFeEnvFile() {
        restartWatchService();
    }

    public synchronized void restartWatchService() {
        // 기존 FileWatcher 중단
        if (fileWatcher != null) {
            fileWatcher.stop();
        }
        if (pathname == null || pathname.isEmpty()) {
            log.warn("pathname is not set, file watching disabled");
            return;
        }
        // 새로운 FileWatcher 생성 및 시작
        fileWatcher = new FileWatcher(
            pathname,
            () -> {
                // log.info("File change detected: {}", pathname);
                feEnvController.notifyFeEnvChanged();
            },
            (error) -> {
                log.error("Error occurred while watching: {}", pathname, error);
            }
        );
        fileWatcher.start();
        log.info("Started watching: {}", pathname);
    }

    public synchronized void stopWatchService() {
        if (fileWatcher != null) {
            fileWatcher.stop();
            log.info("Stopped watching: {}", pathname);
        }
    }

    @PreDestroy
    public void cleanup() {
        stopWatchService();
        log.info("Cleanup completed");
    }
}