package com.soo.common.helper;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class SystemHelper {

    private static final String osName = System.getProperty("os.name").toLowerCase();

    // ====================================================================================================

    public static boolean IsWindows() { return osName.contains("windows"); }
    public static boolean IsLinux()   { return osName.contains("linux"); }

    // ====================================================================================================

    public static String GetCurrentDate() {
        return GetCurrentDateTime("yyyyMMdd");
    }

    public static String GetCurrentTime() {
        return GetCurrentDateTime("HHmmss");
    }

    public static String GetCurrentDateTime() {
        return GetCurrentDateTime("yyyyMMdd_HHmmss");
    }

    public static String GetCurrentDateTime(String pattern) {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern(pattern));
    }

    // ====================================================================================================

    public static boolean IsProcessRunning(long pid) {
        boolean ret = false;
        String pidStr = Long.toString(pid);
        String runCmd;
        if (SystemHelper.IsWindows()) {
            runCmd = "tasklist /FI \"PID eq " + pidStr + "\"";
        } else {
            runCmd = "ps -p " + pidStr;
        }
        try {
            ProcessBuilder processBuilder;
            if (SystemHelper.IsWindows()) {
                processBuilder = new ProcessBuilder("cmd.exe", "/c", runCmd);
            } else {
                processBuilder = new ProcessBuilder("sh", "-c", runCmd);
            }
            Process process = processBuilder.start();
            BufferedReader input = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = input.readLine()) != null) {
                if (line.contains(pidStr)) {
                    ret = true;
                    break;
                }
            }
            input.close();
        } catch (Exception e) {
            System.err.println(e);
        }
        return ret;
    }

    public static boolean KillProcess(long pid) {
        ProcessHandle processHandle = ProcessHandle.of(pid).orElse(null);
        if (processHandle != null) {
            return processHandle.destroy();
        }
        return false;
    }

    // ====================================================================================================

}
