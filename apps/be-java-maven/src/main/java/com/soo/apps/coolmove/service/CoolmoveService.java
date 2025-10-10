package com.soo.apps.coolmove.service;

import java.io.File;
import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.soo.apps.coolmove.config.CoolmoveConfig;
import com.soo.common.helper.FileHelper;
import com.soo.common.helper.SystemHelper;

import lombok.RequiredArgsConstructor;

@Component
@Primary
@RequiredArgsConstructor
public class CoolmoveService {

    // ====================================================================================================

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    // ====================================================================================================

    private final CoolmoveConfig coolmoveConfig;

    // ====================================================================================================
    // ====================================================================================================

    public String saveFile(String uploadBasePath, String uuid, String fileNm, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            logger.warn("saveFile : file is null");
            return null;
        }
        String ognlNm = file.getOriginalFilename();
        if (fileNm.equals(ognlNm) == false) {
            logger.warn("saveFile : fileNm[" + fileNm + "] is not same as ognlNm[" + ognlNm + "]");
            return null;
        }
        String now = SystemHelper.GetCurrentDateTime();
        String pathNm = uploadBasePath + "/" + uuid + "/" + now + "_" + ognlNm;
        try {
            String sysPathname = coolmoveConfig.getSysPrefix() + pathNm;
            FileHelper.MakeParentDir(sysPathname);
            file.transferTo(new File(sysPathname));
        } catch (IOException e) {
            logger.error("Error saving file: " + e.getMessage(), e);
        }
        return pathNm;
    }

    // ====================================================================================================
    // ====================================================================================================

}
