package com.soo.appmain;

import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI myOpenAPI() {
        return new OpenAPI()
                .components(new Components())
                .info(new Info()
                        .title("API Documentation")
                        .version("1.0.0")
                        .description("Spring Boot API Documentation")
                        .license(new License().name("Apache 2.0").url("http://springdoc.org")));
    }

    @Bean
    public GroupedOpenApi baseApi() {
        return GroupedOpenApi.builder()
                .group("All API")
                .pathsToMatch("/**")
                .build();
    }

    public GroupedOpenApi newGroup(String packageName) {
        String[] packagesToScan = { packageName };
        return GroupedOpenApi.builder()
            .group(packageName)
            .packagesToScan(packagesToScan)
            .build();
    }
    // @Bean public GroupedOpenApi groupMain() { return newGroup(PackageConfig.PackageName + ""); }
    @Bean public GroupedOpenApi groupAPPS() { return newGroup(PackageConfig.PackageName + ".apps"); }

    // ====================================================================================================

}
