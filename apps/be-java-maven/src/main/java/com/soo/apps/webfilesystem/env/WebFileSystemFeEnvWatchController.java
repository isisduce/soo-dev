package com.soo.apps.webfilesystem.env;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.http.MediaType;
// import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/webfilesystem/fe/env")
public class WebFileSystemFeEnvWatchController {

    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    // @CrossOrigin(origins = "*")
    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamFeEnvChanges() {
        // log.info("New SSE client attempting to connect...");

        SseEmitter emitter = new SseEmitter(30000L); // 30초 타임아웃
        emitters.add(emitter);

        emitter.onCompletion(() -> {
            emitters.remove(emitter);
            // log.info("SSE client disconnected. Total emitters: {}", emitters.size());
        });

        emitter.onTimeout(() -> {
            emitters.remove(emitter);
            // log.warn("SSE client timed out. Total emitters: {}", emitters.size());
        });

        emitter.onError((ex) -> {
            emitters.remove(emitter);
            // log.error("SSE client error. Total emitters: {}", emitters.size(), ex);
        });

        log.info("SSE client connected successfully. Total emitters: {}", emitters.size());

        // 연결 확인 메시지 전송
        try {
            // emitter.send("connected");
        } catch (Exception e) {
            // log.error("Error sending connection confirmation", e);
        }

        return emitter;
    }

    // fe env.json 변경 감지 시 호출
    public void notifyFeEnvChanged() {
        // log.info("Notifying fe env.json change to {} clients", emitters.size());
        for (SseEmitter emitter : emitters) {
            try {
                // emitter.send("fe-env-updated");
            } catch (Exception e) {
                emitters.remove(emitter);
                // log.error("Error occurred while notifying fe env change", e);
            }
        }
    }

}