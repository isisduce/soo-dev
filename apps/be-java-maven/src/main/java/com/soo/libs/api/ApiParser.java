package com.soo.libs.api;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.soo.libs.dto.ApiInfoDto;
import com.soo.libs.dto.ApiParamDto;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ApiParser {

    public List<ApiInfoDto> parseApiListFromControllers(String dirPath) {
        ApiParser apiParser = new ApiParser();
        File dir = new File(dirPath);
        List<ApiInfoDto> allApiList = new ArrayList<>();
        if (dir.exists() && dir.isDirectory()) {
            File[] files = dir.listFiles();
            if (files != null) {
                for (File file : files) {
                    if (file.isFile() && file.getName().endsWith("Controller.java")) {
                        List<ApiInfoDto> apiList = apiParser.parseApiListFromFile(file.getPath());
                        if (apiList != null) {
                            allApiList.addAll(apiList);
                        }
                    } else if (file.isDirectory()) {
                        allApiList.addAll(parseApiListFromControllers(file.getPath()));
                    }
                }
            }
        }
        return allApiList;
    }

    // API List from Java Controller file
    public List<ApiInfoDto> parseApiListFromFile(String controllerPath) {
        List<ApiInfoDto> apiList = new ArrayList<>();
        try {
            Path path = Paths.get(controllerPath);
            String source = java.nio.file.Files.readString(path);
            // @RequestMapping("/api-path")
            Pattern basePattern = Pattern.compile("@RequestMapping\\(\\\"([^\\\"]+)\\\"\\)");
            Matcher baseMatcher = basePattern.matcher(source);
            String basePath = "";
            if (baseMatcher.find()) {
                basePath = baseMatcher.group(1);
            }
            // Controller name
            String controllerName = null;
            Pattern classPattern = Pattern.compile("class\\s+(\\w+Controller)");
            Matcher classMatcher = classPattern.matcher(source);
            if (classMatcher.find()) {
                controllerName = classMatcher.group(1);
            }
            // 1차 루프: 함수 시작 인덱스만 우선 수집
            Pattern mappingPattern = Pattern.compile("@(Get|Post|Put|Delete)Mapping\\(\\\"([^\\\"]+)\\\"\\)");
            Matcher matcher = mappingPattern.matcher(source);
            List<Integer> methodStarts = new ArrayList<>();
            while (matcher.find()) {
                methodStarts.add(matcher.start());
            }
            // 각 함수의 시작/끝 인덱스 쌍 생성
            List<int[]> methodRanges = new ArrayList<>();
            for (int i = 0; i < methodStarts.size(); i++) {
                int start = methodStarts.get(i);
                int end = (i + 1 < methodStarts.size()) ? methodStarts.get(i + 1) : source.length();
                methodRanges.add(new int[]{start, end});
            }
            // 2차 루프: 각 함수 블록별로 파싱
            matcher = mappingPattern.matcher(source);
            int methodIdx = 0;
            while (matcher.find() && methodIdx < methodRanges.size()) {
                int[] range = methodRanges.get(methodIdx);
                String methodBlock = source.substring(range[0], range[1]);
                methodIdx++;
                String httpMethod = matcher.group(1).toUpperCase();
                String apiPath = matcher.group(2);
                // --- API description(Javadoc) 추출 ---
                // 매핑 어노테이션~메서드 선언부~파라미터 선언까지 블록에서 @Parameters, @Parameter 파싱
                int methodStart = matcher.start();
                // methodStart 앞에서 JavaDoc /** ... */ 추출
                String beforeMethod = source.substring(Math.max(0, methodStart - 1000), methodStart);
                String apiDescription = null;
                Pattern javadocPattern = Pattern.compile("/\\*\\*([\\s\\S]*?)\\*/", Pattern.MULTILINE);
                Matcher javadocMatcher = javadocPattern.matcher(beforeMethod);
                while (javadocMatcher.find()) {
                    // 각 줄 앞의 * 및 공백을 모두 무시
                    String raw = javadocMatcher.group(1);
                    StringBuilder descBuilder = new StringBuilder();
                    for (String line : raw.split("\\r?\\n")) {
                        String clean = line.replaceFirst("^[ \\t]*\\* ?", "").trim();
                        if (clean.startsWith("@Description")) {
                            descBuilder.append(clean.replaceFirst("@Description\\s*", "").trim()).append(" ");
                        }
                    }
                    String desc = descBuilder.toString().trim();
                    if (!desc.isEmpty()) {
                        apiDescription = desc;
                    }
                }
                Map<String, String> paramDescMap = new HashMap<>();
                // @Parameters({ ... }) 블록 전체 추출 (여러 줄, 들여쓰기, 주석 허용)
                Pattern parametersBlockPattern = Pattern.compile("@Parameters\\s*\\(\\s*\\{([\\s\\S]*?)\\}\\s*\\)", Pattern.MULTILINE);
                Matcher parametersBlockMatcher = parametersBlockPattern.matcher(methodBlock);
                if (parametersBlockMatcher.find()) {
                    String parametersBlock = parametersBlockMatcher.group(1);
                    // name/description을 한 번에 robust하게 추출
                    Pattern paramPattern = Pattern.compile("name\\s*=\\s*\"([^\"]*)\"[\\s\\S]*?description\\s*=\\s*\"([^\"]*)\"", Pattern.MULTILINE);
                    Matcher paramMatcher = paramPattern.matcher(parametersBlock);
                    while (paramMatcher.find()) {
                        String name = paramMatcher.group(1);
                        String desc = paramMatcher.group(2);
                        paramDescMap.put(name, desc);
                    }
                } else {
                    // 단일 @Parameter도 지원 (name이 없으면 변수명과 자동 연결)
                    Pattern paramDescPattern = Pattern.compile("@Parameter\\s*\\(([^)]*)\\)\\s*@RequestParam[^(]*\\([^)]*\\)\\s*[\\w<>\\[\\], ]+\\s+(\\w+)", Pattern.MULTILINE);
                    Matcher paramDescMatcher = paramDescPattern.matcher(methodBlock);
                    while (paramDescMatcher.find()) {
                        String paramOptions = paramDescMatcher.group(1);
                        String varName = paramDescMatcher.group(2);
                        String name = null;
                        String desc = null;
                        Pattern namePattern = Pattern.compile("name\\s*=\\s*\"([^\"]*)\"");
                        Matcher nameMatcher = namePattern.matcher(paramOptions);
                        if (nameMatcher.find()) {
                            name = nameMatcher.group(1);
                        }
                        Pattern descPattern = Pattern.compile("description\\s*=\\s*\"([^\"]*)\"");
                        Matcher descMatcher = descPattern.matcher(paramOptions);
                        if (descMatcher.find()) {
                            desc = descMatcher.group(1);
                        }
                        if (desc != null) {
                            if (name != null) {
                                paramDescMap.put(name, desc);
                            } else {
                                paramDescMap.put(varName, desc);
                            }
                        }
                    }
                }
                // --- 파라미터: @RequestParam, 타입, 이름, required, defaultValue 추출 ---
                Pattern paramPattern = Pattern.compile("@RequestParam\\s*\\(([^)]*)\\)\\s*([\\w<>\\[\\]]+)\\s+(\\w+)");
                Matcher paramMatcher = paramPattern.matcher(methodBlock);
                List<ApiParamDto> params = new ArrayList<>();
                while (paramMatcher.find()) {
                    String paramOptions = paramMatcher.group(1);
                    String paramType = paramMatcher.group(2);
                    String paramVar = paramMatcher.group(3);
                    String name = null;
                    Object defaultValue = null;
                    boolean required = false;
                    Pattern optPattern = Pattern.compile("(value|name) *= *\"(\\w+)\"|required *= *(true|false)|defaultValue *= *\"([^\"]*)\"");
                    Matcher optMatcher = optPattern.matcher(paramOptions);
                    while (optMatcher.find()) {
                        if (optMatcher.group(1) != null)
                            name = optMatcher.group(2);
                        if (optMatcher.group(3) != null)
                            required = "true".equals(optMatcher.group(3));
                        if (optMatcher.group(4) != null) {
                            String rawDefault = optMatcher.group(4);
                            if ("boolean".equals(paramType)) {
                                if ("true".equalsIgnoreCase(rawDefault)) defaultValue = true;
                                else if ("false".equalsIgnoreCase(rawDefault)) defaultValue = false;
                                else defaultValue = null;
                            } else {
                                defaultValue = rawDefault;
                            }
                        }
                    }
                    if (name == null)
                        name = paramVar;
                    String description = paramDescMap.getOrDefault(name, null);
                    params.add(ApiParamDto.builder()
                            .name(name)
                            .type(paramType)
                            .required(required)
                            .defaultValue(defaultValue)
                            .description(description)
                            .build());
                }
                String fullPath = basePath.endsWith("/") || apiPath.startsWith("/") ? basePath + apiPath
                        : basePath + "/" + apiPath;
                ApiInfoDto dto = ApiInfoDto.builder()
                        .controller(controllerName)
                        .method(httpMethod)
                        .label(fullPath)
                        .path(fullPath)
                        .description(apiDescription)
                        .params(params)
                        .build();
                apiList.add(dto);
            }
            return apiList;
        } catch (Exception e) {
            return apiList;
        }
    }

    // ====================================================================================================
    // ====================================================================================================

}
