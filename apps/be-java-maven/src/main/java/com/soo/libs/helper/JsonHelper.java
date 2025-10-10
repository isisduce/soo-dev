package com.soo.libs.helper;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.core.type.TypeReference;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class JsonHelper {

    // ====================================================================================================

    public static String Read(String jsonPathNm) {
        String jsonString = "";
        try {
            jsonString = Files.readString(Paths.get(jsonPathNm));
        } catch (IOException e) {
            log.error("Error reading JSON from file: {}", jsonPathNm, e);
        }
        return jsonString;
    }

    public static Path Write(String jsonPathNm, String jsonString) {
        Path path = null;
        try {
            path = Files.writeString(Paths.get(jsonPathNm), jsonString);
        } catch (IOException e) {
            log.error("Error writing JSON to file: {}", jsonPathNm, e);
        }
        return path;
    }

    // ====================================================================================================

    public static String ToFormattedJsonString(String jsonString) {
        return ToFormattedJsonString(jsonString, 2);
    }

    public static String ToFormattedJsonString(String jsonString, int indent) {
        String formattedJsonString = "";
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.enable(SerializationFeature.INDENT_OUTPUT);
            ObjectWriter writer = mapper.writerWithDefaultPrettyPrinter();
            formattedJsonString = writer.writeValueAsString(mapper.readValue(jsonString, Object.class));
            if (2 != indent) {
                formattedJsonString = SetIndent(formattedJsonString, indent);
            }
        } catch (IOException e) {
            log.error("Error formatting JSON string", e);
            formattedJsonString = jsonString;
        }
        return formattedJsonString;
    }

    // ====================================================================================================

    public static String SetIndent(String formattedJsonString, int newIndent) {
        String reFormattedJsonString = "";
        try {
            boolean first = true;
            int orgIndent = 2;
            BufferedReader reader = new BufferedReader(new StringReader(formattedJsonString));
            String line;
            while ((line = reader.readLine()) != null) {
                int count = 0;
                for (int i = 0; i < line.length(); i++) {
                    if (line.charAt(i) != ' ') {
                        break;
                    }
                    count++;
                }
                if (first && 0 < count) {
                    first = false;
                    orgIndent = count;
                    if (newIndent < 0) {
                        newIndent = orgIndent;
                    }
                    if (orgIndent == newIndent) {
                        reFormattedJsonString = formattedJsonString;
                        break;
                    }
                }
                int nIndent = count / orgIndent;
                for (int n = 0; n < nIndent; n++) {
                    for (int i = 0; i < newIndent; i++) {
                        reFormattedJsonString += ' ';
                    }
                }
                reFormattedJsonString += line.trim() + "\n";
            }
            reader.close();
        } catch (IOException e) {
            log.error("Error closing reader", e);
        }
        return reFormattedJsonString;
    }

    // ====================================================================================================

    public static String GetJsonStringFromMap(Map<String, Object> map) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.writeValueAsString(map);
        } catch (Exception e) {
            return "{}";
        }
    }

    public static String GetJsonStringFromList(List<Map<String, Object>> list) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.writeValueAsString(list);
        } catch (Exception e) {
            return "[]";
        }
    }

    // ====================================================================================================

    public static List<Map<String, Object>> GetJSONArrayFromString(String str) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(str, new TypeReference<List<Map<String, Object>>>() {});
        } catch (Exception e) {
            log.error("json parse error", e);
            return new ArrayList<>();
        }
    }

    // ====================================================================================================

    public static Map<String, Object> GetMapFromJsonString(String jsonString) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(jsonString, new TypeReference<Map<String, Object>>() {});
        } catch (Exception e) {
            log.error("json parse error", e);
            return new HashMap<>();
        }
    }
    // ====================================================================================================

    public static Map<String, Object> GetMapFromJsonObject(JSONObject jsonObject) {
        Map<String, Object> map = null;
        try {
            ObjectMapper mapper = new ObjectMapper();
            map = mapper.readValue(jsonObject.toJSONString(), new TypeReference<Map<String, Object>>() {});
        } catch (Exception e) {
            log.error("json parse/mapping/io error", e);
        }
        return map;
    }

    public static List<Map<String, Object>> GetListMapFromJsonArray(JSONArray jsonArray) {
        List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
        if (jsonArray != null) {
            int jsonSize = jsonArray.size();
            for (int i = 0; i < jsonSize; i++) {
                Map<String, Object> map = GetMapFromJsonString(jsonArray.get(i).toString());
                list.add(map);
            }
        }
        return list;
    }

    // ====================================================================================================

}
