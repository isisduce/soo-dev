package com.soo.apps.webfilesystem.controller;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.soo.libs.dto.ApiCode;
import com.soo.libs.dto.ApiResponseDto;
import com.soo.libs.helper.FileHelper;
import com.soo.libs.helper.PathHelper;
import com.soo.libs.helper.StringHelper;
import com.soo.apps.webfilesystem.dto.FileInfoDto;
import com.soo.apps.webfilesystem.env.WebFileSystemBeEnvJson;
import com.soo.apps.webfilesystem.env.WebFileSystemBeEnv;
import com.soo.apps.webfilesystem.service.WebFileSystemService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/webfilesystem")
public class WebFileSystemController {

    private final String apiBase = "/api/webfilesystem";

    private final WebFileSystemBeEnv env;
    private final WebFileSystemService webFileSystemService;

    // ====================================================================================================
    // Health Check
    // ====================================================================================================

    @GetMapping("/alive")
    public ResponseEntity<?> alive() {
        String apiPath = String.format("GET %s%s", apiBase, "/alive");
        log.info(apiPath + " => " + ApiCode.SUCCESS_MSG);
        return ResponseEntity.ok(ApiResponseDto.success(true));
    }

    // ====================================================================================================
    // Environment Management
    // ====================================================================================================

    @GetMapping("/env/reload")
    public ResponseEntity<?> reloadConfig() {
        String apiPath = String.format("GET %s%s", apiBase, "/env/reload");
        try {
            env.load();
            log.info(apiPath + " => " + ApiCode.SUCCESS_MSG);
            return ResponseEntity.ok(ApiResponseDto.success(true));
        } catch (Exception e) {
            log.error(apiPath + " => " + ApiCode.FAILURE_MSG, e);
            return ResponseEntity.ok(ApiResponseDto.failure("Environment reload failed"));
        }
    }

    @GetMapping("/env/status")
    public ResponseEntity<?> getWebFileSystem() {
        String apiPath = String.format("GET %s%s", apiBase, "/env/status");
        try {
            WebFileSystemBeEnvJson.WebFilesystem config = env.getWebFileSystem();
            log.info(apiPath + " => " + ApiCode.SUCCESS_MSG);
            return ResponseEntity.ok(ApiResponseDto.success(config));
        } catch (Exception e) {
            log.error(apiPath + " => " + ApiCode.FAILURE_MSG, e);
            return ResponseEntity.ok(ApiResponseDto.failure("Failed to retrieve environment status"));
        }
    }

    @GetMapping("/env/rootPath")
    public ResponseEntity<?> rootPath() {
        String apiPath = String.format("GET %s%s", apiBase, "/env/rootPath");
        String rootPath = env.getRootPath();
        log.info(apiPath + " => " + ApiCode.SUCCESS_MSG + " :: " + rootPath);
        return ResponseEntity.ok(ApiResponseDto.success(rootPath));
    }

    @GetMapping("/env/uploadPath")
    public ResponseEntity<?> uploadPath() {
        String apiPath = String.format("GET %s%s", apiBase, "/env/uploadPath");
        String uploadPath = env.getUploadPath();
        log.info(apiPath + " => " + ApiCode.SUCCESS_MSG + " :: " + uploadPath);
        return ResponseEntity.ok(ApiResponseDto.success(uploadPath));
    }

    @GetMapping("/env/allowedPaths")
    public ResponseEntity<?> allowedPaths() {
        String apiPath = String.format("GET %s%s", apiBase, "/env/allowedPaths");
        List<WebFileSystemBeEnvJson.AllowedRoot> allowedPaths = env.getAllowedPaths();
        log.info(apiPath + " => " + ApiCode.SUCCESS_MSG + " :: " + allowedPaths);
        return ResponseEntity.ok(ApiResponseDto.success(allowedPaths));
    }

    // ====================================================================================================
    // Web File System Operations
    // ====================================================================================================

    @GetMapping("/list")
    public ResponseEntity<?> getDirList(
        @Parameter(description = "pathname to list")
        @RequestParam(required = true) String pathname,
        @Parameter(description = "include directory in the list")
        @RequestParam(required = false, defaultValue = "true") boolean includeDirectory,
        @Parameter(description = "include file in the list")
        @RequestParam(required = false, defaultValue = "true") boolean includeFile,
        @Parameter(description = "extenstions for file filter")
        @RequestParam(required = false) String extensions
    ) {
        String apiPath = String.format("GET %s%s", apiBase, "/list");
        String apiCall = apiPath + " :: pathname=" + pathname + ", includeDirectory=" + includeDirectory + ", includeFile=" + includeFile + ", extensions=" + extensions;
        try {
            List<FileInfoDto> list = webFileSystemService.listFiles(pathname, includeDirectory, includeFile, extensions);
            log.info(apiCall + " => " + ApiCode.SUCCESS_MSG + " : count=" + list.size());
            return ResponseEntity.ok(ApiResponseDto.success(list));
        } catch (Exception e) {
            log.error(apiCall + " => " + ApiCode.FAILURE_MSG + " :: " + e.getMessage());
            return ResponseEntity.ok(ApiResponseDto.failure("Failed to get list of directory: " + e.getMessage()));
        }
    }

    @PostMapping("/list")
    @Operation(summary = "디렉토리 내용 조회 (POST)", description = "POST 요청으로 경로에 특수문자가 있는 디렉토리의 파일과 디렉토리 목록을 조회합니다.")
    public ResponseEntity<?> listFilesPost(
        @RequestBody Map<String, String> request
    ) {
        String apiPath = String.format("POST %s%s", apiBase, "/list");
        String pathname = request.get("pathname");
        boolean includeDirectory = Boolean.parseBoolean(request.getOrDefault("includeDirectory", "true"));
        boolean includeFile = Boolean.parseBoolean(request.getOrDefault("includeFile", "true"));
        String extensions = request.get("extensions");
        String apiCall = apiPath + " :: pathname=" + pathname + ", includeDirectory=" + includeDirectory + ", includeFile=" + includeFile + ", extensions=" + extensions;
        try {
            String decodedPath = PathHelper.decodePath(pathname);
            List<FileInfoDto> list = webFileSystemService.listFiles(decodedPath, includeDirectory, includeFile, extensions);
            return ResponseEntity.ok(ApiResponseDto.success(list));
        } catch (Exception e) {
            log.error(apiCall + " => " + ApiCode.FAILURE_MSG + " :: " + e.getMessage());
            return ResponseEntity.ok(ApiResponseDto.failure("Failed to get list of directory: " + e.getMessage()));
        }
    }

    // ====================================================================================================

    @GetMapping("/info")
    public ResponseEntity<?> getFileInfo(
        @Parameter(description = "pathname of the file or directory")
        @RequestParam(required = true) String pathname
    ) {
        String apiPath = String.format("GET %s%s", apiBase, "/info");
        String apiCall = apiPath + " pathname=" + pathname;
        try {
            FileInfoDto fileInfo = webFileSystemService.getFileInfo(pathname);
            log.info(apiCall + " => " + ApiCode.SUCCESS_MSG + " :: " + fileInfo);
            return ResponseEntity.ok(ApiResponseDto.success(fileInfo));
        } catch (Exception e) {
            log.error(apiCall + " => " + ApiCode.FAILURE_MSG + " :: " + e.getMessage());
            return ResponseEntity.ok(ApiResponseDto.failure("Failed to get file info"));
        }
    }

    // ====================================================================================================

    @GetMapping("/read")
    public ApiResponseDto<String> readTextFile(
        @RequestParam(required = true) String pathname
    ) {
        String apiPath = String.format("GET %s%s", apiBase, "/read");
        String apiCall = apiPath + " :: pathname=" + pathname;
        try {
            String decodedPath = PathHelper.decodePath(pathname);
            String content = webFileSystemService.readTextFile(decodedPath);
            log.info(apiCall + " => " + ApiCode.SUCCESS_MSG);
            return ApiResponseDto.success(content);
        } catch (Exception e) {
            log.error(apiCall + " => " + ApiCode.FAILURE_MSG + " :: " + e.getMessage());
            return ApiResponseDto.error("Failed to read file: " + e.getMessage());
        }
    }

    @PostMapping("/write")
    public ApiResponseDto<String> writeTextFile(
        @RequestBody Map<String, String> request
    ) {
        String apiPath = String.format("POST %s%s", apiBase, "/write");
        String apiCall = apiPath + " :: request=" + request;
        try {
            String pathname = request.get("pathname");
            String content = request.get("content");
            if (pathname == null || content == null) {
                return ApiResponseDto.error("pathname and content are required.");
            }
            String decodedPath = PathHelper.decodePath(pathname);
            webFileSystemService.writeTextFile(decodedPath, content);
            log.info(apiCall + " => " + ApiCode.SUCCESS_MSG);
            return ApiResponseDto.success("success");
        } catch (Exception e) {
            log.error(apiCall + " => " + ApiCode.FAILURE_MSG + " :: " + e.getMessage());
            return ApiResponseDto.error("Failed to write file: " + e.getMessage());
        }
    }

    // ====================================================================================================

    private ResponseEntity<Resource> buildDownloadResponse(byte[] content, String fileName) {
        try {
            ByteArrayResource resource = new ByteArrayResource(content);
            String safeFileName = PathHelper.getSafeFileName(fileName);
            String encodedFileName = URLEncoder.encode(fileName, StandardCharsets.UTF_8.toString()).replaceAll("\\+", "%20");
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + safeFileName + "\"; filename*=UTF-8''" + encodedFileName)
                    .body(resource);
        } catch (UnsupportedEncodingException e) {
            log.error("File name encoding error: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/download")
    public ResponseEntity<Resource> downloadFile(
        @RequestParam(required = true) String pathname
    ) {
        String apiPath = String.format("GET %s%s", apiBase, "/download");
        String apiCall = apiPath + " :: pathname=" + pathname;
        try {
            String decodedPath = PathHelper.decodePath(pathname);
            byte[] fileContent = webFileSystemService.downloadFile(decodedPath);
            FileInfoDto fileInfo = webFileSystemService.getFileInfo(decodedPath);
            log.info(apiCall + " => " + ApiCode.SUCCESS_MSG + " :: fileName=" + fileInfo.getName() + ", size=" + fileInfo.getSize() + " bytes");
            return buildDownloadResponse(fileContent, fileInfo.getName());
        } catch (Exception e) {
            log.error(apiCall + " => " + ApiCode.FAILURE_MSG + " :: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/download-multiple")
    public ResponseEntity<Resource> downloadMultipleFiles(
        @RequestBody Map<String, Object> request
    ) {
        String apiPath = String.format("POST %s%s", apiBase, "/download-multiple");
        String apiCall = apiPath + " :: " + request.toString();
        try {
            Object obj = request.get("filePaths");
            List<String> filePaths = null;
            if (obj instanceof List<?>) {
                filePaths = ((List<?>) obj).stream().map(String.class::cast).collect(Collectors.toList());
            }
            String dateStr = java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String archiveName = (String) request.getOrDefault("archiveName", "download-" + dateStr + ".zip");
            if (filePaths == null || filePaths.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            log.info(apiCall + " => " + ApiCode.SUCCESS_MSG + " :: file count=" + filePaths.size() + ", archive name=" + archiveName);
            byte[] zipContent = webFileSystemService.downloadMultipleFiles(filePaths, archiveName);
            return buildDownloadResponse(zipContent, archiveName);
        } catch (Exception e) {
            log.error(apiCall + " => " + ApiCode.FAILURE_MSG + " :: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // ====================================================================================================

    private ApiResponseDto<Map<String, Object>> handleUploadFile(
        String incomingPath, MultipartFile[] incomingFiles) {
        if (StringHelper.IsEmpty(incomingPath)) {
            log.warn("Missing upload target path: one of path, pathname, targetPath, or uploadPath is required");
            return ApiResponseDto.error("Please specify the upload path: one of path, pathname, targetPath, or uploadPath is required.");
        }
        if (incomingFiles == null || incomingFiles.length == 0) {
            return ApiResponseDto.error("Please select files to upload.");
        }
        String decodedTargetPath = PathHelper.decodePath(incomingPath);
        log.info("File upload request: targetPath=[{}] -> decoded=[{}], file count=[{}]", incomingPath, decodedTargetPath, incomingFiles.length);

        int successCount = 0;
        int failCount = 0;
        List<String> successFiles = new ArrayList<>();
        List<String> failFiles = new ArrayList<>();

        for (MultipartFile f : incomingFiles) {
            try {
                if (f != null && !f.isEmpty()) {
                    log.info("Uploading: file=[{}] size=[{}]", f.getOriginalFilename(), f.getSize());
                    webFileSystemService.uploadFile(decodedTargetPath, f);
                    successCount++;
                    successFiles.add(f.getOriginalFilename());
                } else {
                    String fileName = f != null ? f.getOriginalFilename() : "unknown";
                    log.warn("Skipping empty file: {}", fileName);
                    failCount++;
                    failFiles.add(fileName + " (empty file)");
                }
            } catch (Exception e) {
                String fileName = f != null ? f.getOriginalFilename() : "unknown";
                log.error("File upload failure: {} - {}", fileName, e.getMessage());
                failCount++;
                failFiles.add(fileName + " (" + e.getMessage() + ")");
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("totalFiles", incomingFiles.length);
        result.put("successCount", successCount);
        result.put("failCount", failCount);
        result.put("successFiles", successFiles);
        result.put("failFiles", failFiles);

        if (incomingFiles.length == 1) {
            // 단일 파일 업로드인 경우 기존 응답 형식 유지
            if (successCount == 1) {
                return ApiResponseDto.success(result);
            } else {
                return ApiResponseDto.error("File upload failure. See details: " + result);
            }
        } else {
            // 다중 파일 업로드인 경우
            if (failCount == 0) {
                return ApiResponseDto.success(result, "All files uploaded successfully");
            } else if (successCount == 0) {
                log.warn("All files upload failed. Details: {}", result);
                return ApiResponseDto.error("All files upload failed. See details: " + result);
            } else {
                return ApiResponseDto.success(result, "Some files uploaded successfully (Success: " + successCount + ", Fail: " + failCount + ")");
            }
        }
    }

    @PostMapping("/upload")
    public ApiResponseDto<Map<String, Object>> uploadFile(
        @Parameter(description = "Upload pathname")
        @RequestParam(required = false) String path,
        @RequestParam(required = false) String pathname,
        @RequestParam(required = false) String targetPath,
        @RequestParam(required = false) String uploadPath,
        @Parameter(description = "File(s) to upload")
        @RequestParam(required = false) MultipartFile[] file,
        @RequestParam(required = false) MultipartFile[] files,
        @RequestParam(required = false) MultipartFile[] uploadFiles
    ) {
        String apiPath = String.format("POST %s%s", apiBase, "/upload");
        String apiCall = apiPath + " :: path=" + path + ", pathname=" + pathname + ", targetPath=" + targetPath + ", uploadPath=" + uploadPath;
        String incomingPath
                = StringHelper.IsNotEmpty(path)       ? path
                : StringHelper.IsNotEmpty(pathname)   ? pathname
                : StringHelper.IsNotEmpty(targetPath) ? targetPath
                : StringHelper.IsNotEmpty(uploadPath) ? uploadPath
                : null;
        MultipartFile[] incomingFiles
                = (file        != null && file       .length > 0) ? file
                : (files       != null && files      .length > 0) ? files
                : (uploadFiles != null && uploadFiles.length > 0) ? uploadFiles
                : null;
        log.info(apiCall + " :: incomingPath=" + incomingPath + ", incomingFiles count=" + (incomingFiles != null ? incomingFiles.length : 0));
        return handleUploadFile(incomingPath, incomingFiles);
    }

    @PostMapping("/upload-multiple")
    public ApiResponseDto<Map<String, Object>> uploadMultipleFiles(
        @Parameter(description = "Upload pathname")
        @RequestParam(required = false) String path,
        @RequestParam(required = false) String pathname,
        @RequestParam(required = false) String targetPath,
        @RequestParam(required = false) String uploadPath,
        @Parameter(description = "Files to upload")
        @RequestParam(required = false) MultipartFile[] files
    ) {
        String apiPath = String.format("POST %s%s", apiBase, "/upload-multiple");
        String apiCall = apiPath + " :: path=" + path + ", pathname=" + pathname + ", targetPath=" + targetPath + ", uploadPath=" + uploadPath;
        String incomingPath
                = StringHelper.IsNotEmpty(path)       ? path
                : StringHelper.IsNotEmpty(pathname)   ? pathname
                : StringHelper.IsNotEmpty(targetPath) ? targetPath
                : StringHelper.IsNotEmpty(uploadPath) ? uploadPath
                : null;
        log.info(apiCall + " :: incomingPath=" + incomingPath + ", incomingFiles count=" + (files != null ? files.length : 0));
        return handleUploadFile(incomingPath, files);
    }

    // ====================================================================================================
    // ====================================================================================================

    private ApiResponseDto<String> handleCreateDirectory(String pathname, String directoryName) {
        if (pathname == null || pathname.trim().isEmpty()) {
            log.warn("pathname is empty or null: [{}]", pathname);
            return ApiResponseDto.error("pathname is necessary.");
        }
        if (directoryName == null || directoryName.trim().isEmpty()) {
            log.warn("directoryName is empty or null: [{}]", directoryName);
            return ApiResponseDto.error("directory name is necessary.");
        }
        String fullPath = pathname.endsWith("/") ? pathname + directoryName : pathname + "/" + directoryName;
        fullPath = fullPath.replaceAll("[/\\\\]+", "/");
        fullPath = FileHelper.ReplaceFileSeparatorForLinux(fullPath);
        String decodedPath = PathHelper.decodePath(fullPath);
        try {
            webFileSystemService.createDirectory(decodedPath);
            log.info("Directory creation completed: {}", decodedPath);
            return ApiResponseDto.success("Directory creation successful");
        } catch (Exception e) {
            log.error("Directory creation failed: {}", e.getMessage(), e);
            return ApiResponseDto.error("Directory creation failed: " + e.getMessage());
        }
    }

    @PostMapping("/create-directory")
    public ApiResponseDto<String> createDirectory(
        @RequestBody Map<String, String> request
    ) {
        String apiPath = String.format("POST %s%s", apiBase, "/create-directory");
        String apiCall = apiPath + " :: " + request.toString();
        String pathname = request.get("pathname");
        String directoryName = request.get("directoryName");
        log.info(apiCall + " :: pathname=" + pathname + ", directoryName=" + directoryName);
        return handleCreateDirectory(pathname, directoryName);
    }

    @PostMapping("/create-directory-param")
    public ApiResponseDto<String> createDirectoryParam(
        @RequestParam(required = true)  String pathname,
        @RequestParam(required = false) String directoryName
    ) {
        String apiPath = String.format("POST %s%s", apiBase, "/create-directory-param");
        String apiCall = apiPath + " :: pathname=" + pathname + ", directoryName=" + directoryName;
        if (StringHelper.IsEmpty(directoryName)) {
            // directoryName = "NewFolder";
        }
        log.info(apiCall + " :: pathname=" + pathname + ", directoryName=" + directoryName);
        return handleCreateDirectory(pathname, directoryName);
    }

    // ====================================================================================================

    @DeleteMapping("/delete")
    public ApiResponseDto<String> deleteFile(
        @RequestParam(required = true)  String pathname,
        @RequestParam(required = false, defaultValue = "true")  boolean deleteIfEmpty,
        @RequestParam(required = false, defaultValue = "false") boolean recursive
    ) {
        String apiPath = String.format("DELETE %s%s", apiBase, "/delete");
        String apiCall = apiPath + " :: pathname=" + pathname + ", deleteIfEmpty=" + deleteIfEmpty + ", recursive=" + recursive;
        try {
            String decodedPath = PathHelper.decodePath(pathname);
            webFileSystemService.deleteFile(decodedPath, deleteIfEmpty, recursive);
            log.info(apiCall + " => " + ApiCode.SUCCESS_MSG);
            return ApiResponseDto.success("Delete completed");
        } catch (Exception e) {
            log.error(apiCall + " => " + ApiCode.FAILURE_MSG + " :: " + "File deletion failed: {}", e.getMessage());
            return ApiResponseDto.error("File deletion failed: " + e.getMessage());
        }
    }

    @PostMapping("/delete-multiple")
    public ApiResponseDto<Map<String, Object>> deleteMultipleFiles(
        @RequestBody Map<String, Object> request
    ) {
        String apiPath = String.format("POST %s%s", apiBase, "/delete-multiple");
        String apiCall = apiPath + " :: " + request.toString();
        try {
            Object obj = request.get("paths");
            List<String> paths = null;
            if (obj instanceof List<?>) {
                paths = ((List<?>) obj).stream().map(String.class::cast).collect(Collectors.toList());
            }
            if (paths == null || paths.isEmpty()) {
                return ApiResponseDto.error("File/directory path to delete is required.");
            }
            boolean deleteIfEmpty = Boolean.parseBoolean(String.valueOf(request.getOrDefault("deleteIfEmpty", "true")));
            boolean recursive = Boolean.parseBoolean(String.valueOf(request.getOrDefault("recursive", "false")));

            log.info("Multiple file deletion request: file count=[{}]", paths.size());

            int successCount = 0;
            int failCount = 0;
            List<String> successFiles = new ArrayList<>();
            List<String> failFiles = new ArrayList<>();

            for (String path : paths) {
                try {
                    String decodedPath = PathHelper.decodePath(path);
                    log.info("삭제 중: path=[{}]", decodedPath);
                    webFileSystemService.deleteFile(decodedPath, deleteIfEmpty, recursive);
                    successCount++;
                    successFiles.add(path);
                } catch (Exception e) {
                    log.error("파일 삭제 실패: {} - {}", path, e.getMessage());
                    failCount++;
                    failFiles.add(path + " (" + e.getMessage() + ")");
                }
            }

            Map<String, Object> result = new HashMap<>();
            result.put("totalFiles", paths.size());
            result.put("successCount", successCount);
            result.put("failCount", failCount);
            result.put("successFiles", successFiles);
            result.put("failFiles", failFiles);

            if (failCount == 0) {
                log.info(apiCall + " => " + ApiCode.SUCCESS_MSG);
                return ApiResponseDto.success(result, "All files deleted successfully");
            } else if (successCount == 0) {
                log.warn(apiCall + " => " + ApiCode.FAILURE_MSG + " :: " + "All file deletions failed");
                return ApiResponseDto.error("All file deletions failed");
            } else {
                log.info(apiCall + " => " + ApiCode.SUCCESS_MSG);
                return ApiResponseDto.success(result, "Some files deleted successfully (Success: " + successCount + ", Fail: " + failCount + ")");
            }
        } catch (Exception e) {
            log.error(apiCall + " => " + ApiCode.FAILURE_MSG + " :: " + "Multiple file deletion failed: {}", e.getMessage());
            return ApiResponseDto.error("File path and new name are required: " + e.getMessage());
        }
    }

    // ====================================================================================================

    @PostMapping("/move")
    public ApiResponseDto<String> moveFile(
        @RequestBody Map<String, String> request
    ) {
        String apiPath = String.format("POST %s%s", apiBase, "/move");
        String apiCall = apiPath + " :: " + request.toString();
        try {
            String sourcePath = request.get("sourcePath");
            String targetPath = request.get("targetPath");
            if (sourcePath == null || targetPath == null) {
                return ApiResponseDto.error("File path and new name are required.");
            }
            String decodedSourcePath = PathHelper.decodePath(sourcePath);
            String decodedTargetPath = PathHelper.decodePath(targetPath);
            webFileSystemService.moveFile(decodedSourcePath, decodedTargetPath);
            log.info(apiCall + " => " + ApiCode.SUCCESS_MSG);
            return ApiResponseDto.success("Move completed");
        } catch (Exception e) {
            log.error(apiCall + " => " + ApiCode.FAILURE_MSG + " :: " + "File move failed: {}", e.getMessage());
            return ApiResponseDto.error("Failed to move: " + e.getMessage());
        }
    }

    // ====================================================================================================

    @PostMapping("/rename")
    public ApiResponseDto<String> renameFile(
        @RequestBody Map<String, String> request
    ) {
        String apiPath = String.format("POST %s%s", apiBase, "/rename");
        String apiCall = apiPath + " :: " + request.toString();
        try {
            String path = request.get("path");
            String newName = request.get("newName");

            if (path == null || newName == null || newName.trim().isEmpty()) {
                return ApiResponseDto.error("File path and new name are required.");
            }

            String decodedPath = PathHelper.decodePath(path);
            log.info("File rename request: path=[{}], newName=[{}]", decodedPath, newName);

            // 경로에서 부모 디렉토리와 파일명 분리
            Path filePath = Path.of(decodedPath);
            Path parentDir = filePath.getParent();

            if (parentDir == null) {
                return ApiResponseDto.error("Cannot rename the root directory.");
            }

            // 새로운 전체 경로 생성
            String newFullPath = parentDir.resolve(newName).toString();
            log.info("New path: [{}]", newFullPath);

            webFileSystemService.moveFile(decodedPath, newFullPath);
            log.info(apiCall + " => " + ApiCode.SUCCESS_MSG);
            return ApiResponseDto.success("Rename completed");
        } catch (Exception e) {
            log.error(apiCall + " => " + ApiCode.FAILURE_MSG + " :: " + "File rename failed: {}", e.getMessage());
            return ApiResponseDto.error("Failed to rename: " + e.getMessage());
        }
    }

    // ====================================================================================================

    @PostMapping("/copy")
    public ApiResponseDto<String> copyFile(
        @RequestBody Map<String, String> request
    ) {
        String apiPath = String.format("POST %s%s", apiBase, "/copy");
        String apiCall = apiPath + " :: " + request.toString();
        try {
            String sourcePath = request.get("sourcePath");
            String targetPath = request.get("targetPath");

            if (sourcePath == null || targetPath == null) {
                return ApiResponseDto.error("Source path and target path are required.");
            }

            String decodedSourcePath = PathHelper.decodePath(sourcePath);
            String decodedTargetPath = PathHelper.decodePath(targetPath);
            webFileSystemService.copyFile(decodedSourcePath, decodedTargetPath);
            log.info(apiCall + " => " + ApiCode.SUCCESS_MSG);
            return ApiResponseDto.success("Copy completed");
        } catch (Exception e) {
            log.error(apiCall + " => " + ApiCode.FAILURE_MSG + " :: " + "File copy failed: {}", e.getMessage());
            return ApiResponseDto.error("Copy failed: " + e.getMessage());
        }
    }

}
