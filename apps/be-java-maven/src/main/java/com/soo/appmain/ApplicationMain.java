package com.soo.appmain;

import org.springframework.boot.Banner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = PackageConfig.PackageName)
@EnableAutoConfiguration
public class ApplicationMain extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(ApplicationMain.class);
    }

    public static void main(String[] args) {
        SpringApplication springApplication = new SpringApplication(ApplicationMain.class);
        springApplication.setBannerMode(Banner.Mode.OFF);
        springApplication.setLogStartupInfo(false);
        springApplication.run(args);
    }

}
