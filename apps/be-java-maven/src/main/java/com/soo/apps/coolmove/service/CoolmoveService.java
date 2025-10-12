package com.soo.apps.coolmove.service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.soo.apps.coolmove.config.CoolmoveConfig;
import com.soo.apps.coolmove.dto.DtoCandidateMast;
import com.soo.apps.coolmove.entity.EntityCandidateItem;
import com.soo.apps.coolmove.entity.EntityCandidateMast;
import com.soo.apps.coolmove.entity.EntityCandidatePledge;
import com.soo.apps.coolmove.mapper.CoolmoveMapper;
import com.soo.common.helper.FileHelper;
import com.soo.common.helper.ParamHelper;
import com.soo.common.helper.PathHelper;
import com.soo.common.helper.StringHelper;
import com.soo.common.helper.SystemHelper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@Primary
@RequiredArgsConstructor
public class CoolmoveService {

    // ====================================================================================================

    private final CoolmoveConfig coolmoveConfig;
    private final CoolmoveMapper coolmoveMapper;

    // ====================================================================================================
    // ====================================================================================================

    public String saveFile(String uploadBasePath, String prefix, String fileNm, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            log.warn("saveFile : file is null");
            return null;
        }
        String ognlNm = file.getOriginalFilename();
        if (fileNm.equals(ognlNm) == false) {
            log.warn("saveFile : fileNm[" + fileNm + "] is not same as ognlNm[" + ognlNm + "]");
            return null;
        }
        String pathNm = uploadBasePath + "/";
        if (StringHelper.IsNotEmpty(prefix)) {
            pathNm += prefix;
        }
        pathNm += SystemHelper.GetCurrentDateTime() + "_" + ognlNm;
        pathNm = PathHelper.normalizePath(pathNm);
        pathNm = FileHelper.ReplaceFileSeparatorForLinux(pathNm);
        try {
            String sysPathname = coolmoveConfig.getSysPrefix() + pathNm;
            FileHelper.MakeParentDir(sysPathname);
            file.transferTo(new File(sysPathname));
        } catch (IOException e) {
            log.error("Error saving file: " + e.getMessage(), e);
        }
        return pathNm;
    }

    // ====================================================================================================
    // ====================================================================================================

    public ArrayList<EntityCandidateMast> candidateMastSelect(HashMap<String,Object> params) {
        ArrayList<EntityCandidateMast> list = coolmoveMapper.candidateMastSelect(params);
        for (EntityCandidateMast item : list) {
            entityCandidateMastBuild(item);
        }
        return list;
    }

    public void entityCandidateMastBuild(EntityCandidateMast entity) {
        if (entity != null) {
            entity.setCandidates(candidateItemSelect(entity.getUuid()));
        }
    }

    // ====================================================================================================

    public ArrayList<EntityCandidateItem> candidateItemSelect(HashMap<String,Object> params) {
        ArrayList<EntityCandidateItem> list = coolmoveMapper.candidateItemSelect(params);
        for (EntityCandidateItem item : list) {
            entityCandidateItemBuild(item);
        }
        return list;
    }

    public void entityCandidateItemBuild(EntityCandidateItem entity) {
        if (entity != null) {
            ArrayList<EntityCandidatePledge> list = candidatePledgeSelect(entity.getUuid(), entity.getIndex());
            List<String> pledges = new ArrayList<>();
            for (EntityCandidatePledge item : list) {
                pledges.add(item.getPledge());
            }
            entity.setPledges(pledges);
        }
    }

    public ArrayList<EntityCandidateItem> candidateItemSelect(String uuid) {
        return candidateItemSelect(uuid, null);
    }

    public ArrayList<EntityCandidateItem> candidateItemSelect(String uuid, String index) {
        HashMap<String,Object> params = new HashMap<>();
        ParamHelper.addParam(params, "uuid", uuid);
        ParamHelper.addParam(params, "index", index);
        return candidateItemSelect(params);
    }

    // ====================================================================================================

    public ArrayList<EntityCandidatePledge> candidatePledgeSelect(HashMap<String,Object> params) {
        ArrayList<EntityCandidatePledge> list = coolmoveMapper.candidatePledgeSelect(params);
        return list;
    }

    public ArrayList<EntityCandidatePledge> candidatePledgeSelect(String uuid) {
        return candidatePledgeSelect(uuid, null, null);
    }

    public ArrayList<EntityCandidatePledge> candidatePledgeSelect(String uuid, String index) {
        return candidatePledgeSelect(uuid, index, null);
    }

    public ArrayList<EntityCandidatePledge> candidatePledgeSelect(String uuid, String index, String no) {
        HashMap<String,Object> params = new HashMap<>();
        ParamHelper.addParam(params, "uuid", uuid);
        ParamHelper.addParam(params, "index", index);
        ParamHelper.addParam(params, "no", no);
        return candidatePledgeSelect(params);
    }

    // ====================================================================================================

    public EntityCandidateMast candidateMastGet(String uuid) {
        if (StringHelper.IsEmpty(uuid)) {
            return null;
        }
        HashMap<String,Object> params = new HashMap<>();
        ParamHelper.addParam(params, "uuid", uuid);
        ArrayList<EntityCandidateMast> list = candidateMastSelect(params);
        if (0 < list.size()) {
            return list.get(0);
        }
        return null;
    }

    // ====================================================================================================

    public DtoCandidateMast candidateMastInsert(DtoCandidateMast dto) {
        if (dto == null) {
            log.warn("candidateMastInsert : candidateMast is null");
            return null;
        }
        EntityCandidateMast item = candidateMastGet(dto.getUuid());
        if (item == null) {
            EntityCandidateMast newItem = DtoCandidateMast.toEntity(dto);
            newItem.setRegUserId(newItem.getSysUserId());
            if (candidateMastInsert(newItem)) {
                item = candidateMastGet(newItem.getUuid());
            }
        }
        return DtoCandidateMast.fromEntity(item);
    }

    public boolean candidateMastInsert(EntityCandidateMast entity) {
        if (entity == null) {
            log.warn("candidateMastInsert : candidateMast is null");
            return false;
        }
        String uuid = entity.getUuid();
        if (coolmoveMapper.candidateMastInsert(entity)) {
            for (int i = 0; i < entity.getCandidates().size(); i++) {
                EntityCandidateItem candidate = entity.getCandidates().get(i);
                if (StringHelper.IsEmpty(candidate.getUuid())) {
                    candidate.setUuid(uuid);
                }
                String index = Integer.toString(i + 1);
                candidate.setIndex(index);
                candidate.setRegUserId(entity.getRegUserId());
                candidateItemInsert(candidate);
            }
        }
        return true;
    }

    public boolean candidateItemInsert(EntityCandidateItem entity) {
        if (entity == null) {
            log.warn("candidateItemInsert : candidate is null");
            return false;
        }
        if (coolmoveMapper.candidateItemInsert(entity)) {
            String uuid = entity.getUuid();
            String index = entity.getIndex();
            for (int i = 0; i < entity.getPledges().size(); i++) {
                String pledge = entity.getPledges().get(i);
                String no = Integer.toString(i + 1);
                coolmoveMapper.candidatePledgeInsert(uuid, index, no, pledge, entity.getRegUserId());
            }
            return true;
        }
        return false;
    }

    // ====================================================================================================

    public boolean candidateMastUpdate(DtoCandidateMast dto) {
        if (dto == null) {
            log.warn("candidateMastUpdate : candidateMast is null");
            return false;
        }
        EntityCandidateMast item = candidateMastGet(dto.getUuid());
        if (item != null) {
            EntityCandidateMast newItem = DtoCandidateMast.toEntity(dto);
            boolean modified = item.isNotEqual(newItem);
            if (modified) {
                newItem.setSeq(item.getSeq());
                newItem.setModUserId(newItem.getSysUserId());
                candidateMastUpdate(newItem);
            }
            return (modified);
        }
        return false;
    }

    public boolean candidateMastUpdate(EntityCandidateMast entity) {
        if (entity == null) {
            log.warn("candidateMastUpdate : candidateMast is null");
            return false;
        }
        if (coolmoveMapper.candidateMastUpdate(entity)) {
            for (int i = 0; i < entity.getCandidates().size(); i++) {
                EntityCandidateItem candidate = entity.getCandidates().get(i);
                candidate.setIndex(Integer.toString(i + 1));
                candidate.setModUserId(entity.getModUserId());
                candidateItemUpdate(candidate);
            }
        }
        return true;
    }

    public boolean candidateItemUpdate(EntityCandidateItem entity) {
        if (entity == null) {
            log.warn("candidateItemUpdate : candidate is null");
            return false;
        }
        if (coolmoveMapper.candidateItemUpdate(entity)) {
            String uuid = entity.getUuid();
            String index = entity.getIndex();
            for (int i = 0; i < entity.getPledges().size(); i++) {
                String pledge = entity.getPledges().get(i);
                coolmoveMapper.candidatePledgeUpdate(uuid, index, Integer.toString(i + 1), pledge, entity.getModUserId());
            }
            return true;
        }
        return false;
    }


    // ====================================================================================================
    // ====================================================================================================

}