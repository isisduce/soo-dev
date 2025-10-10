package com.soo.libs.helper;

import java.util.ArrayList;

public class StringHelper {

    // ====================================================================================================

    public static String SetDefault(String str, String defaultStr) throws Exception {
        String s = str;
        if (s == null || s.isEmpty()) {
            s = defaultStr;
        }
        return s;
    }

    // ====================================================================================================

    public static String AddQuote (String str) { return "'"  + str + "'"; }
    public static String AddQuote2(String str) { return "\"" + str + "\""; }

    // ====================================================================================================

    public static boolean IsEmpty(String str) {
        boolean b = (str == null || str.isEmpty());
        return b;
    }

    public static boolean IsNotEmpty(String str) {
        boolean b = !IsEmpty(str);
        return b;
    }

    // ====================================================================================================

    public static boolean IsSubstring(String str, ArrayList<String> list) {
        boolean b = false;
        if (list != null) {
            for (String s : list) {
                if ((s != null && s.isEmpty() == false) && (0 <= str.indexOf(s))) {
                    b = true;
                    break;
                }
            }
        }
        return b;
    }

    public static boolean IsStartWith(String str, ArrayList<String> list) {
        boolean b = false;
        if (list != null) {
            for (String s : list) {
                if ((s != null && s.isEmpty() == false) && str.startsWith(s)) {
                    b = true;
                    break;
                }
            }
        }
        return b;
    }

    // ====================================================================================================

    public static int parseInt(String s) {
        int v = 0;
        try {
            v = Integer.parseInt(s);
        } catch (Exception e) {
        }
        return v;
    }

    public static long parseLong(String s) {
        long v = 0;
        try {
            v = Long.parseLong(s);
        } catch (Exception e) {
        }
        return v;
    }

    public static double parseDouble(String s) {
        double v = 0;
        try {
            v = Double.parseDouble(s);
        } catch (Exception e) {
        }
        return v;
    }

    // ====================================================================================================

}
