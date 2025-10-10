package com.soo.libs.env;

import com.soo.libs.watcher.FileWatcher;

import lombok.extern.slf4j.Slf4j;

/**
 * 환경 파일 변경을 감지하여 Env 인스턴스의 load()를 자동 호출하는 Watcher 클래스
 * FileWatcher를 사용하여 구현됨
 * 사용 예: new EnvJsonFileWatcher<>(env, "경로").startWatching();
 */
@Slf4j
public class EnvJsonFileWatcher<T extends com.soo.libs.env.Env<?>> {

    private final FileWatcher fileWatcher;

    public EnvJsonFileWatcher(T env, String envJsonPathname) {
        this.fileWatcher = new FileWatcher(
            envJsonPathname,
            () -> {
                log.info("Environment file change detected, attempting reload for: [{}] {}", env.getClazz().getName(), envJsonPathname);
                env.load();
            },
            (error) -> log.error("Error during file watching: [" + env.getClazz().getName() + "] " + error.getMessage(), error)
        );
    }

    public void startWatching() {
        fileWatcher.start();
    }

    public void stopWatching() {
        fileWatcher.stop();
    }

    public boolean isWatching() {
        return fileWatcher.isRunning();
    }
}
