package com.soo.libs.watcher;

import java.io.IOException;
import java.nio.file.*;
import java.util.function.Consumer;

import com.soo.libs.helper.FileHelper;

import lombok.extern.slf4j.Slf4j;

/**
 * 범용 파일 변경 감지 클래스
 * 지정된 파일의 변경을 감지하여 콜백을 실행합니다.
 * 사용 예: new FileWatcher("파일경로", () -> { ... }).start();
 */
@Slf4j
public class FileWatcher {

    private Thread watcherThread;
    private volatile boolean running = false;
    private final Path filePath;
    private final Runnable onFileChanged;
    private final Consumer<Exception> onError;
    private static final long DEBOUNCE_MS = 2000;
    private long lastEventTime = 0;

    /**
     * 파일 변경 감지자 생성
     * @param filePath 감시할 파일 경로
     * @param onFileChanged 파일 변경 시 실행할 콜백
     */
    public FileWatcher(String filePath, Runnable onFileChanged) {
        this(filePath, onFileChanged, null);
    }

    /**
     * 파일 변경 감지자 생성
     * @param filePath 감시할 파일 경로
     * @param onFileChanged 파일 변경 시 실행할 콜백
     * @param onError 오류 발생 시 실행할 콜백 (null 가능)
     */
    public FileWatcher(String filePath, Runnable onFileChanged, Consumer<Exception> onError) {
        this.filePath = Paths.get(filePath);
        this.onFileChanged = onFileChanged;
        this.onError = onError != null ? onError : (e) -> log.error("Error occurred: " + e.getMessage(), e);

        if (this.filePath.getParent() == null) {
            log.warn("Warning: Watch folder is null. Please check the path: {}", filePath);
        }
    }

    /**
     * 파일 감시 시작
     */
    public synchronized void start() {
        if (running) {
            log.warn("Already running for: {}", filePath);
            return;
        }
        running = true;
        watcherThread = new Thread(() -> {
            try {
                WatchService watchService = FileSystems.getDefault().newWatchService();
                filePath.getParent().register(watchService, StandardWatchEventKinds.ENTRY_MODIFY);
                log.info("Started watching: {}", FileHelper.ReplaceFileSeparatorForLinux(filePath.toString()));

                while (running) {
                    WatchKey key = watchService.take();
                    for (WatchEvent<?> event : key.pollEvents()) {
                        if (event.context().toString().equals(filePath.getFileName().toString())) {
                            long now = System.currentTimeMillis();
                            if (now - lastEventTime > DEBOUNCE_MS) {
                                log.info("File change detected: {}", FileHelper.ReplaceFileSeparatorForLinux(filePath.toString()));
                                try {
                                    onFileChanged.run();
                                } catch (Exception e) {
                                    onError.accept(e);
                                }
                                lastEventTime = now;
                            }
                        }
                    }
                    key.reset();
                }
                watchService.close();
            } catch (IOException | InterruptedException e) {
                if (running) { // 정상 종료가 아닌 경우에만 에러 처리
                    onError.accept(e);
                }
            }
            log.info("Stopped watching: {}", FileHelper.ReplaceFileSeparatorForLinux(filePath.toString()));
        });
        watcherThread.setDaemon(true);
        watcherThread.start();
    }

    /**
     * 파일 감시 중단
     */
    public synchronized void stop() {
        if (!running) {
            return;
        }
        running = false;
        if (watcherThread != null && watcherThread.isAlive()) {
            watcherThread.interrupt();
            try {
                watcherThread.join(1000); // 1초 대기
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }

    /**
     * 감시 상태 확인
     * @return 감시 중이면 true
     */
    public boolean isRunning() {
        return running;
    }

    /**
     * 감시 중인 파일 경로 반환
     * @return 파일 경로
     */
    public Path getFilePath() {
        return filePath;
    }
}