package com.soo.apps.coolmove.config;

import org.springframework.context.annotation.Configuration;

import com.soo.appmain.PackageConfig;
import com.soo.common.helper.SystemHelper;

import lombok.Getter;

@Configuration
@Getter
public class CoolmoveConfig extends PackageConfig {

    // ====================================================================================================

    public static final String PackageName = PackageConfig.PackageName + ".coolmove";

    // ====================================================================================================

    public String getSysPrefix() {
        if (SystemHelper.IsWindows()) {
            return "C:/nas";
        }
        return "/nas";
    }

    public String getAppRoot() {
        return "/soo/apps/coolmove";
    }

    public String getRootCandidate() {
        return getAppRoot() + "/candidate";
    }

}
