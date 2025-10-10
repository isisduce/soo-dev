package com.soo.appmain;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;

@Configuration
@Getter
public class PackageConfig {

    // ====================================================================================================

    public static final String PackageName  = "com.soo";

    // ====================================================================================================

    @Value("${spring.config.activate.on-profile}")
    private String springConfigActivateOnProfile;

    public boolean isDev() { return springConfigActivateOnProfile.equals("dev"); }
    public boolean isPrd() { return springConfigActivateOnProfile.equals("prd"); }

    public String setMode(String s) {
        return (isDev() ? "dev-" : "") + s;
    }

    public void devPrint(Object o) {
        if (isDev()) {
            System.out.println(o);
        }
    }

    // ====================================================================================================

}
