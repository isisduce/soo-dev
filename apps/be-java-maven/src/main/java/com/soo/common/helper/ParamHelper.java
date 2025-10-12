package com.soo.common.helper;

import java.util.ArrayList;
import java.util.HashMap;

public class ParamHelper {

    public static HashMap<String,Object> addParam(HashMap<String,Object> params, String key, String value) {
        if (params == null) {
            params = new HashMap<String,Object>();
        }
        if (value != null && 0 < value.length()) {
            params.put(key, value);
        }
        return params;
    }

    public static HashMap<String,Object> addParam(HashMap<String,Object> params, String key, ArrayList<String> value) {
        if (params == null) {
            params = new HashMap<String,Object>();
        }
        if (value != null && 0 < value.size()) {
            params.put(key, value);
        }
        return params;
    }

}
