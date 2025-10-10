package com.soo.libs.helper;

import lombok.extern.slf4j.Slf4j;
import org.springframework.util.StringUtils;

import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;

@Slf4j
public class PathHelper {

    /**
     * URL 인코딩된 경로를 디코딩합니다
     */
    public static String decodePath(String path) {
        if (!StringUtils.hasText(path)) {
            return path;
        }

        try {
            // URL 디코딩 수행
            String decoded = URLDecoder.decode(path, StandardCharsets.UTF_8.toString());
            log.debug("경로 디코딩: '{}' -> '{}'", path, decoded);
            return decoded;
        } catch (Exception e) {
            log.warn("경로 디코딩 실패, 원본 경로 사용: '{}', 오류: {}", path, e.getMessage());
            return path;
        }
    }

    /**
     * 경로를 URL 인코딩합니다
     */
    public static String encodePath(String path) {
        if (!StringUtils.hasText(path)) {
            return path;
        }

        try {
            return URLEncoder.encode(path, StandardCharsets.UTF_8.toString())
                    .replaceAll("\\+", "%20")  // 공백을 %20으로 변환
                    .replaceAll("%2F", "/")     // 슬래시는 인코딩하지 않음
                    .replaceAll("%5C", "\\\\"); // 백슬래시는 인코딩하지 않음 (Windows 경로용)
        } catch (Exception e) {
            log.warn("경로 인코딩 실패, 원본 경로 사용: '{}', 오류: {}", path, e.getMessage());
            return path;
        }
    }

    /**
     * 경로를 정규화합니다 (상대경로 해결, 중복 슬래시 제거 등)
     */
    public static String normalizePath(String path) {
        if (!StringUtils.hasText(path)) {
            return path;
        }

        try {
            Path normalized = Paths.get(path).normalize();
            return normalized.toString();
        } catch (Exception e) {
            log.warn("경로 정규화 실패, 원본 경로 사용: '{}', 오류: {}", path, e.getMessage());
            return path;
        }
    }

    /**
     * 경로에 특수 문자나 공백이 포함되어 있는지 확인합니다
     */
    public static boolean containsSpecialCharacters(String path) {
        if (!StringUtils.hasText(path)) {
            return false;
        }

        // 공백, 특수문자 등이 포함된 경우
        return  path.contains(" ") ||
                path.contains("%") ||
                path.contains("+") ||
                path.contains("&") ||
                path.contains("?") ||
                path.contains("#");
    }

    /**
     * 안전한 파일명을 생성합니다 (다운로드용)
     */
    public static String getSafeFileName(String fileName) {
        if (!StringUtils.hasText(fileName)) {
            return "untitled";
        }

        // 파일명에서 위험한 문자들을 제거하거나 대체
        return fileName .replaceAll("[<>:\"/\\\\|?*]", "_")
                        .replaceAll("\\s+", "_")  // 연속된 공백을 _로 변환
                        .trim();
    }
}
