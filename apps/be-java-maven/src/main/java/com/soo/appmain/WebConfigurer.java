package com.soo.appmain;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class WebConfigurer implements WebMvcConfigurer {

    @Value("${app.config.cors-json}")
    private String appConfigCorsJson;

    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    private final AppMainEnv env;

    // ====================================================================================================

    @Bean
    public FilterRegistrationBean<?> corsFilter() {
        boolean allowAllOrigin = false; //env.isCorsEnabled());
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedHeader("*"); // env.getCorsAllowedHeaders()
        config.addAllowedMethod("*"); // env.getCorsAllowedMethods()
        // config.setAllowedMethods(Arrays.asList("DELETE,GET,POST,PUT,OPTIONS,HEAD,PATCH,TRACE".split(",")));
        config.setAllowCredentials(env.isCorsCredentials());
        if (allowAllOrigin) {
            config.setAllowedOriginPatterns(List.of("*"));
        } else {
            List<String> origins = null;
            logger.info("==================================================");
            if (origins == null || origins.isEmpty()) {
                logger.info("load cors.origin from: '" + env.getEnvJsonPathname() + "'");
                origins = env.getCorsOrigin();
            }
            if (origins == null || origins.isEmpty()) {
                logger.info("load cors.origin from: '" + appConfigCorsJson + "'");
                origins = loadOriginList();
            }
            if (origins == null || origins.isEmpty()) {
                if (origins == null) {
                    origins = new ArrayList<>();
                }
                logger.info("load cors.origin from: default");
                addOrigin(origins, "http://localhost:8080");
                addOrigin(origins, "http://192.168.0.101:8080");
                addOrigin(origins, "http://isisduce.iptime.org:8080");
            }
            for (String origin : origins) {
                logger.info("  allowedOrigin: " + origin);
            }
            config.setAllowedOrigins(origins);
            logger.info("==================================================");
        }
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        FilterRegistrationBean<?> bean = new FilterRegistrationBean<CorsFilter>(new CorsFilter(source));
        bean.setOrder(0);
        return bean;
    }

    // ====================================================================================================

    List<String> loadOriginList() {
        List<String> origins = new ArrayList<>();
        String corsJson = appConfigCorsJson;
        File file = new File(corsJson);
        if (file.exists()) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                JsonNode root = mapper.readTree(file);
                JsonNode originNode = root.get("origin");
                if (originNode != null && originNode.isArray()) {
                    for (JsonNode node : originNode) {
                        String origin = node.asText().trim();
                        addOrigin(origins, origin);
                    }
                }
            } catch (IOException e) {
                logger.error("CORS JSON 파일 읽기 오류: " + e.getMessage());
            }
        }
        return origins;
    }

    void addOrigin(List<String> origins, String origin) {
        if (origins.indexOf(origin) == -1) {
            origins.add(origin);
        }
    }

    // ====================================================================================================
    // ====================================================================================================

}
