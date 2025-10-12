package com.soo.common.helper;

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

    public static boolean IsEqual(String a, String b) {
        return (a == null && b == null) || (a != null && a.equals(b));
    }

    public static boolean IsNotEqual(String s0, String s1) {
        return (IsEqual(s0, s1) == false);
    }

    public static boolean IsEqual(ArrayList<String> a, ArrayList<String> b) {
        if (a == null && b == null) { return true; }
        if (a == null && b != null) { return false; }
        if (a != null && b == null) { return false; }
        if (a != null && b != null) {
            if (a.size() != b.size()) { return false; }
            for (int i = 0; i < a.size(); i++) {
                if (b.contains(a.get(i)) == false) { return false; }
            }
        }
        return true;
    }

    public static boolean IsNotEqual(ArrayList<String> a, ArrayList<String> b) {
        return (IsEqual(a, b) == false);
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
