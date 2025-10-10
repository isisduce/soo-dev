package com.soo.apps.webfilesystem.service;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;

import java.nio.file.attribute.FileTime;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.ZoneId;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.soo.apps.webfilesystem.dto.FileInfoDto;
import com.soo.apps.webfilesystem.env.WebFileSystemBeEnv;
import com.soo.common.helper.FileHelper;
import com.soo.common.helper.PathHelper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class WebFileSystemService {

    private final WebFileSystemBeEnv env;

    // ====================================================================================================
    // ====================================================================================================

    private void validatePath(String pathname) {
        if (pathname == null) {
            throw new SecurityException("Pathname is not set.");
        }
        List<String> allowedPaths = env.getAllowedPathStrings();
        // log.info("Allowed root paths: {}", allowedPaths);
        boolean isAllowed = allowedPaths.stream()
            .anyMatch(allowedPath -> {
                try {
                    Path normalizedPath = Paths.get(pathname).normalize();
                    Path normalizedAllowed = Paths.get(allowedPath.trim()).normalize();
                    return normalizedPath.startsWith(normalizedAllowed);
                } catch (Exception e) {
                    return false;
                }
            });
        if (!isAllowed) {
            throw new SecurityException("Access to the path is not allowed: " + pathname);
        }
    }

    // ====================================================================================================

    public List<FileInfoDto> listFiles(String pathname) {
        return listFiles(pathname, true, true, null);
    }

    public List<FileInfoDto> listFiles(String pathname, boolean includeDirectory, boolean includeFile, String extensions) {
        validatePath(pathname);
        try {
            Path targetPath = Paths.get(pathname);

            if (!Files.exists(targetPath)) {
                throw new RuntimeException("Not exist pathname: " + pathname);
            }
            if (!Files.isDirectory(targetPath)) {
                throw new RuntimeException("Not a directory: " + pathname);
            }
            return Files.list(targetPath)
                    .filter(p -> env.isEnableHiddenFiles() || !isHidden(p))
                    .filter(p -> shouldShowPath(p))
                    .map(this::toFileInfoDto)
                    .filter(f -> {
                        // includeDirectory와 includeFile 옵션 적용
                        if (f.getType().equals("directory") && !includeDirectory) {
                            return false;
                        }
                        if (!f.getType().equals("directory") && !includeFile) {
                            return false;
                        }
                        // 확장자 필터링 (파일에만 적용, 디렉토리는 항상 포함)
                        if (extensions != null && !extensions.isEmpty() && !f.getType().equals("directory")) {
                            String ext = getFileExtension(f.getName());
                            return Arrays.stream(extensions.split("[,;|]"))
                                    .map(String::trim)
                                    .anyMatch(e -> e.equalsIgnoreCase(ext));
                        }
                        return true;
                    })
                    .sorted(Comparator.comparing((FileInfoDto f) -> !f.getType().equals("directory"))
                            .thenComparing(FileInfoDto::getName))
                    .collect(Collectors.toList());

        } catch (IOException e) {
            log.error("Error retrieving file list: {}", e.getMessage());
            throw new RuntimeException("Failed to retrieve file list: " + e.getMessage());
        }
    }

    // ====================================================================================================

    public FileInfoDto getFileInfo(String pathname) {
        validatePath(pathname);
        try {
            Path targetPath = Paths.get(pathname);
            if (!Files.exists(targetPath)) {
                throw new RuntimeException("Not exist pathname: " + pathname);
            }
            return toFileInfoDto(targetPath);
        } catch (Exception e) {
            log.error("Error retrieving file info: {}", e.getMessage());
            throw new RuntimeException("Failed to retrieve file info: " + e.getMessage());
        }
    }

    // ====================================================================================================

    private FileInfoDto toFileInfoDto(Path path) {
        try {
            File file = path.toFile();
            String fileName = file.getName();
            String extension = "";

            if (!Files.isDirectory(path) && fileName.contains(".")) {
                extension = fileName.substring(fileName.lastIndexOf(".") + 1);
            }

            // 심볼릭 링크 및 Junction Point 감지
            boolean isSymLink = Files.isSymbolicLink(path);
            boolean isJunctionPoint = isJunctionPoint(path);
            String linkTarget = null;
            String fileType = "file";

            // 타입 결정
            if (isSymLink) {
                fileType = "symlink";
                try {
                    linkTarget = Files.readSymbolicLink(path).toString();
                } catch (IOException e) {
                    log.warn("Could not read symbolic link target: {}", path);
                }
            } else if (isJunctionPoint) {
                // Junction Point도 디렉토리로 표시 (프론트엔드에서 일반 폴더처럼 처리하기 위해)
                fileType = "directory";
                try {
                    linkTarget = getJunctionTarget(path);
                } catch (Exception e) {
                    log.warn("Could not read Junction Point target: {}", path);
                }
            } else if (Files.isDirectory(path)) {
                fileType = "directory";
            }

            // 생성일과 수정일 가져오기
            LocalDateTime createdAt = null;
            LocalDateTime modifiedAt = null;

            try {
                FileTime creationTime = (FileTime) Files.getAttribute(path, "creationTime");
                createdAt = LocalDateTime.ofInstant(creationTime.toInstant(), ZoneId.systemDefault());
            } catch (Exception e) {
                log.warn("Could not retrieve creation date: {}", path);
            }

            try {
                modifiedAt = LocalDateTime.ofInstant(
                    Files.getLastModifiedTime(path).toInstant(),
                    ZoneId.systemDefault());
            } catch (Exception e) {
                log.warn("Could not retrieve last modified date: {}", path);
            }

            boolean hasChildren = FileHelper.HasChildren(path.toString());

            return FileInfoDto.builder()
                    .name(fileName)
                    .path(FileHelper.ReplaceFileSeparatorForLinux(path.toString()))
                    .type(fileType)
                    .size(Files.isDirectory(path) ? 0 : Files.size(path))
                    .extension(extension)
                    .createdAt(createdAt)
                    .modifiedAt(modifiedAt)
                    .isReadable(Files.isReadable(path))
                    .isWritable(Files.isWritable(path))
                    .isExecutable(Files.isExecutable(path))
                    .isHidden(Files.isHidden(path))
                    .isSymbolicLink(isSymLink)
                    .isJunctionPoint(isJunctionPoint)
                    .linkTarget(linkTarget)
                    .parentPath(FileHelper.ReplaceFileSeparatorForLinux(path.getParent() != null ? path.getParent().toString() : null))
                    .hasChildren(hasChildren)
                    .build();

        } catch (IOException e) {
            log.error("Error converting file info: {}", e.getMessage());
            throw new RuntimeException("Failed to convert file info: " + e.getMessage());
        }
    }

    // ====================================================================================================

    private String getFileExtension(String fileName) {
        int lastDot = fileName.lastIndexOf('.');
        if (lastDot == -1 || lastDot == fileName.length() - 1) {
            return "";
        }
        return fileName.substring(lastDot).toLowerCase();
    }

    // ====================================================================================================

    private boolean isHidden(Path path) {
        try {
            return Files.isHidden(path);
        } catch (IOException e) {
            return false;
        }
    }

    // ====================================================================================================

    /**
     * 경로를 표시할지 여부 결정
     */
    private boolean shouldShowPath(Path path) {
        try {
            boolean isSymLink = Files.isSymbolicLink(path);
            boolean isJunctionPoint = isJunctionPoint(path);

            // 심볼릭 링크 필터링
            if (isSymLink && !env.isShowSymbolicLinks()) {
                return false;
            }
            // Junction Point 필터링
            if (isJunctionPoint && !env.isShowJunctionPoints()) {
                return false;
            }
            // 접근할 수 없는 링크 필터링
            if (env.isHideInaccessibleLinks() && (isSymLink || isJunctionPoint)) {
                try {
                    // 링크의 대상이 실제로 존재하는지 확인
                    if (isSymLink) {
                        Path target = Files.readSymbolicLink(path);
                        if (!Files.exists(target)) {
                            log.debug("접근할 수 없는 심볼릭 링크 숨김: {} -> {}", path, target);
                            return false;
                        }
                    } else if (isJunctionPoint) {
                        // Junction Point의 경우 접근을 시도해봄
                        if (!Files.isReadable(path)) {
                            log.debug("접근할 수 없는 Junction Point 숨김: {}", path);
                            return false;
                        }
                        // "Documents and Settings" 같은 특정 Junction Point는 숨김
                        String fileName = path.getFileName().toString().toLowerCase();
                        if (fileName.equals("documents and settings") ||
                            fileName.equals("application data") ||
                            fileName.equals("local settings")) {
                            log.debug("시스템 Junction Point 숨김: {}", path);
                            return false;
                        }
                    }
                } catch (Exception e) {
                    log.debug("링크 접근성 확인 실패, 숨김 처리: {}", path);
                    return false;
                }
            }
            return true;
        } catch (Exception e) {
            log.warn("경로 표시 여부 확인 실패: {}", path);
            return true; // 기본적으로는 표시
        }
    }

    /**
     * Junction Point 여부 확인 (Windows 전용)
     */
    private boolean isJunctionPoint(Path path) {
        try {
            // Junction Point check in Windows
            if (!System.getProperty("os.name").toLowerCase().contains("windows")) {
                return false;
            }

            // Junction Point는 디렉토리이면서 reparse point인 경우
            return Files.isDirectory(path) && !Files.isSymbolicLink(path) && isReparsePoint(path);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Reparse Point 여부 확인 (Windows 전용)
     */
    private boolean isReparsePoint(Path path) {
        try {
            // reparse point check in Windows file attributes
            Object fileAttributes = Files.getAttribute(path, "dos:reparse");
            return Boolean.TRUE.equals(fileAttributes);
        } catch (Exception e) {
            // DOS 속성을 읽을 수 없는 경우, 다른 방법으로 확인
            try {
                // Junction Point는 일반적으로 심볼릭 링크와 다르게 처리됨
                File file = path.toFile();
                return file.isDirectory() && !Files.isSymbolicLink(path) && file.getCanonicalPath().equals(file.getAbsolutePath());
            } catch (Exception ex) {
                return false;
            }
        }
    }

    /**
     * Junction Point의 대상 경로 가져오기 (Windows 전용)
     */
    private String getJunctionTarget(Path path) {
        try {
            if (!isJunctionPoint(path)) {
                return null;
            }
            // Windows에서 Junction Point의 실제 대상을 찾기 위해
            // canonical path와 absolute path를 비교
            File file = path.toFile();
            String canonical = file.getCanonicalPath();
            String absolute = file.getAbsolutePath();
            if (!canonical.equals(absolute)) {
                return canonical;
            }
            // 추가적으로 fsutil을 사용하여 Junction Point 정보를 가져올 수도 있지만
            // 보안상의 이유로 간단한 방법만 사용
            return null;
        } catch (Exception e) {
            log.warn("Junction Point 대상 경로를 가져올 수 없습니다: {}", path);
            return null;
        }
    }

    // ====================================================================================================
    // ====================================================================================================

    /**
     * 텍스트 파일 내용 읽기
     */
    public String readTextFile(String path) {
        try {
            Path targetPath = Paths.get(path);

            if (!Files.exists(targetPath) || Files.isDirectory(targetPath)) {
                throw new RuntimeException("읽을 수 없는 파일입니다: " + path);
            }

            return Files.readString(targetPath);

        } catch (IOException e) {
            log.error("파일 읽기 오류: {}", e.getMessage());
            throw new RuntimeException("파일을 읽을 수 없습니다: " + e.getMessage());
        }
    }

    /**
     * 텍스트 파일 내용 저장
     */
    public void writeTextFile(String path, String content) {
        try {
            Path targetPath = Paths.get(path);
            Files.writeString(targetPath, content);

        } catch (IOException e) {
            log.error("파일 저장 오류: {}", e.getMessage());
            throw new RuntimeException("파일을 저장할 수 없습니다: " + e.getMessage());
        }
    }

    // ====================================================================================================

    /**
     * 파일 다운로드를 위한 바이트 배열 반환
     */
    public byte[] downloadFile(String path) {
        try {
            Path targetPath = Paths.get(path);

            if (!Files.exists(targetPath) || Files.isDirectory(targetPath)) {
                throw new RuntimeException("다운로드할 수 없는 파일입니다: " + path);
            }

            return Files.readAllBytes(targetPath);

        } catch (IOException e) {
            log.error("파일 다운로드 오류: {}", e.getMessage());
            throw new RuntimeException("파일을 다운로드할 수 없습니다: " + e.getMessage());
        }
    }

    /**
     * 파일 업로드
     */
    public void uploadFile(String targetPath, MultipartFile file) {
        try {
            Path path = Paths.get(targetPath, file.getOriginalFilename());
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

        } catch (IOException e) {
            log.error("파일 업로드 오류: {}", e.getMessage());
            throw new RuntimeException("파일을 업로드할 수 없습니다: " + e.getMessage());
        }
    }

    /**
     * 다중 파일 다운로드 (ZIP 압축)
     */
    public byte[] downloadMultipleFiles(List<String> filePaths, String archiveName) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ZipOutputStream zos = new ZipOutputStream(baos);

            for (String filePath : filePaths) {
                try {
                    String decodedPath = PathHelper.decodePath(filePath);
                    Path path = Paths.get(decodedPath);

                    if (!Files.exists(path)) {
                        log.warn("파일이 존재하지 않음, 건너뜀: {}", decodedPath);
                        continue;
                    }

                    if (Files.isDirectory(path)) {
                        // 디렉토리인 경우 재귀적으로 추가
                        addDirectoryToZip(zos, path, path.getFileName().toString());
                    } else {
                        // 파일인 경우 직접 추가
                        addFileToZip(zos, path, path.getFileName().toString());
                    }
                } catch (Exception e) {
                    log.error("파일 압축 중 오류 (건너뜀): {} - {}", filePath, e.getMessage());
                }
            }

            zos.close();
            return baos.toByteArray();

        } catch (IOException e) {
            log.error("다중 파일 다운로드 오류: {}", e.getMessage());
            throw new RuntimeException("다중 파일을 다운로드할 수 없습니다: " + e.getMessage());
        }
    }

    /**
     * ZIP에 파일 추가
     */
    private void addFileToZip(ZipOutputStream zos, Path filePath, String entryName) throws IOException {
        ZipEntry zipEntry = new ZipEntry(entryName);
        zos.putNextEntry(zipEntry);
        Files.copy(filePath, zos);
        zos.closeEntry();
    }

    /**
     * ZIP에 디렉토리 재귀적으로 추가
     */
    private void addDirectoryToZip(ZipOutputStream zos, Path dirPath, String baseName) throws IOException {
        try (DirectoryStream<Path> stream = Files.newDirectoryStream(dirPath)) {
            for (Path entry : stream) {
                String entryName = baseName + "/" + entry.getFileName().toString();

                if (Files.isDirectory(entry)) {
                    // 빈 디렉토리 엔트리 추가
                    ZipEntry zipEntry = new ZipEntry(entryName + "/");
                    zos.putNextEntry(zipEntry);
                    zos.closeEntry();

                    // 재귀적으로 하위 디렉토리 추가
                    addDirectoryToZip(zos, entry, entryName);
                } else {
                    addFileToZip(zos, entry, entryName);
                }
            }
        }
    }

    /**
     * 디렉토리 생성
     */
    public void createDirectory(String path) {
        try {
            validatePath(path);
            Path targetPath = Paths.get(path);

            // 상위 디렉토리가 존재하는지 확인
            if (targetPath.getParent() != null && !Files.exists(targetPath.getParent())) {
                throw new RuntimeException("상위 디렉토리가 존재하지 않습니다: " + targetPath.getParent());
            }

            // 이미 존재하는지 확인
            if (Files.exists(targetPath)) {
                throw new RuntimeException("이미 존재하는 경로입니다: " + path);
            }

            Files.createDirectories(targetPath);
            log.info("디렉토리 생성 성공: {}", path);

        } catch (IOException e) {
            log.error("디렉토리 생성 오류: {}", e.getMessage());
            throw new RuntimeException("디렉토리를 생성할 수 없습니다: " + e.getMessage());
        }
    }

    /**
     * 파일/디렉토리 삭제
     */
    public void deleteFile(String path) {
        deleteFile(path, true, false);
    }

    public void deleteFile(String path, boolean deleteIfEmpty, boolean recursive) {
        try {
            Path targetPath = Paths.get(path);

            if (Files.isDirectory(targetPath)) {
                if (!deleteIfEmpty && recursive) {
                    Files.walk(targetPath)
                        .sorted(Comparator.reverseOrder())
                        .map(Path::toFile)
                        .forEach(File::delete);
                } else {
                    // Only delete if empty or deleteIfEmpty is true
                    try (DirectoryStream<Path> dirStream = Files.newDirectoryStream(targetPath)) {
                        if (deleteIfEmpty && !dirStream.iterator().hasNext()) {
                            Files.delete(targetPath);
                        } else if (!deleteIfEmpty) {
                            Files.delete(targetPath); // Try to delete, will fail if not empty
                        } else {
                            throw new RuntimeException("디렉토리가 비어있지 않아 삭제할 수 없습니다: " + path);
                        }
                    }
                }
            } else {
                Files.delete(targetPath);
            }

        } catch (IOException e) {
            log.error("파일 삭제 오류: {}", e.getMessage());
            throw new RuntimeException("파일을 삭제할 수 없습니다: " + e.getMessage());
        }
    }

    /**
     * 파일/디렉토리 이동/이름변경
     */
    public void moveFile(String sourcePath, String targetPath) {
        try {
            Path source = Paths.get(sourcePath);
            Path target = Paths.get(targetPath);

            Files.move(source, target, StandardCopyOption.REPLACE_EXISTING);

        } catch (IOException e) {
            log.error("파일 이동 오류: {}", e.getMessage());
            throw new RuntimeException("파일을 이동할 수 없습니다: " + e.getMessage());
        }
    }

    /**
     * 파일 복사
     */
    public void copyFile(String sourcePath, String targetPath) {
        try {
            if (sourcePath.equals(targetPath)) {
                throw new RuntimeException("원본과 대상 경로가 동일합니다.");
            }

            Path source = Paths.get(sourcePath);
            Path target = Paths.get(targetPath);

            if (Files.isDirectory(source)) {
                copyDirectory(source, target);
            } else {
                Files.copy(source, target, StandardCopyOption.REPLACE_EXISTING);
            }

        } catch (IOException e) {
            log.error("파일 복사 오류: {}", e.getMessage());
            throw new RuntimeException("파일을 복사할 수 없습니다: " + e.getMessage());
        }
    }

    /**
     * 디렉토리 재귀 복사
     */
    private void copyDirectory(Path source, Path target) throws IOException {
        Files.walk(source).forEach(src -> {
            try {
                Path dest = target.resolve(source.relativize(src));
                if (Files.isDirectory(src)) {
                    if (!Files.exists(dest)) {
                        Files.createDirectories(dest);
                    }
                } else {
                    Files.copy(src, dest, StandardCopyOption.REPLACE_EXISTING);
                }
            } catch (IOException e) {
                throw new RuntimeException("디렉토리 복사 오류: " + e.getMessage());
            }
        });
    }

    // ====================================================================================================
    // ====================================================================================================

}