package com.soo.common.helper;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;

import org.mozilla.universalchardet.Constants;
import org.mozilla.universalchardet.UniversalDetector;

public class FileHelper {

    // ====================================================================================================

    public static String TrimDriveChar(String pathname) {
        if (SystemHelper.IsWindows()) {
            int i = pathname.indexOf(":");
            if (i >= 0) {
                pathname = pathname.substring(i + 1);
            }
        }
        return pathname;
    }

    // ====================================================================================================

    public static String ReplaceFileSeparator(String pathname, String oldSep, String newSep) {
        if (pathname != null) {
            if (oldSep.equals(newSep) == false) {
                pathname = pathname.replace(oldSep, newSep);
            }
        }
        return pathname;
    }

    public static String ReplaceFileSeparatorForLinux  (String pathname) { return pathname.replace("\\", "/"); }
    public static String ReplaceFileSeparatorForWindows(String pathname) { return pathname.replace("/", "\\"); }

    public static String ReplaceFileSeparator(String pathname) {
        if (SystemHelper.IsWindows()) {
            return ReplaceFileSeparatorForWindows(pathname);
        }
        return ReplaceFileSeparatorForLinux(pathname);
    }

    // ====================================================================================================

    public static boolean IsExist(String pathname) {
        File file = new File(pathname);
        return file.exists();
    }

    public static boolean IsNotExist(String pathname) {
        return IsExist(pathname) == false;
    }

    // ====================================================================================================

    public static boolean IsFile(String pathname) {
        Path path = Path.of(pathname);
        return path != null && Files.isRegularFile(path);
    }

    public static boolean IsDirectory(String pathname) {
        Path path = Path.of(pathname);
        return Files.isDirectory(path);
    }

    public static boolean HasChildren(String pathname) {
        Path path = Path.of(pathname);
        if (!Files.isDirectory(path)) {
            return false;
        }
        try (DirectoryStream<Path> stream = Files.newDirectoryStream(path)) {
            if (stream.iterator().hasNext()) {
                return true;
            }
        } catch (IOException e) {
        }
        return false;
    }

    // public static boolean HasSubDirectory(String pathname) {
    //     Path path = Path.of(pathname);
    //     if (!Files.isDirectory(path)) {
    //         return false;
    //     }
    //     try (DirectoryStream<Path> stream = Files.newDirectoryStream(path)) {
    //         for (Path entry : stream) {
    //             if (Files.isDirectory(entry)) {
    //                 return true;
    //             }
    //         }
    //     } catch (IOException e) {
    //     }
    //     return false;
    // }

    // public static Pair<Boolean, Boolean> HasChildrenAndSubDirectory(String pathname) {
    //     Path path = Path.of(pathname);
    //     if (!Files.isDirectory(path)) {
    //         return new Pair<>(false, false);
    //     }
    //     boolean hasChildren = false;
    //     boolean hasSubDirectory = false;
    //     try (DirectoryStream<Path> stream = Files.newDirectoryStream(path)) {
    //         for (Path entry : stream) {
    //             hasChildren = true;
    //             if (Files.isDirectory(entry)) {
    //                 hasSubDirectory = true;
    //             }
    //             if (hasChildren && hasSubDirectory) {
    //                 break;
    //             }
    //         }
    //     } catch (IOException e) {
    //     }
    //     return new Pair<>(hasChildren, hasSubDirectory);
    // }

    // ====================================================================================================

    public static String DetectEncoding(String pathname) {
        String encoding = "";
        try {
            FileInputStream fis = new java.io.FileInputStream(pathname);
            UniversalDetector detector = new UniversalDetector(null);
            byte[] buf = new byte[4096];
            int nread;
            while ((nread = fis.read(buf)) > 0 && !detector.isDone()) {
                detector.handleData(buf, 0, nread);
            }
            detector.dataEnd();
            fis.close();
            encoding = detector.getDetectedCharset();
            detector.reset();
        } catch (IOException e) {
        }
        return encoding;
    }

    public static boolean IsAnsi(String pathname) {
        String encoding = DetectEncoding(pathname);
        switch (1) {
        case 1:
            if (encoding.equals(Constants.CHARSET_EUC_KR)) { return true; }
            if (encoding.equals(Constants.CHARSET_WINDOWS_1252))  { return true; }
            break;
        }
        return false;
    }


    // ====================================================================================================

    public static String GetExt(String pathname) {
        if (pathname != null) {
            int indexExt = pathname.lastIndexOf('.');
            if (indexExt < 0) {
                return "";
            }
            String ext = pathname.substring(indexExt + 1);
            return ext;
        }
        return "";
    }

    public static String GetExt(String pathname, boolean toLower) {
        String ext = GetExt(pathname);
        if (ext != null && toLower) {
            ext = ext.toLowerCase();
        }
        return ext;
    }

    public static String SetExt(String pathname, String newExt) {
        if (pathname != null) {
            int indexExt = pathname.lastIndexOf('.');
            if (indexExt < 0) {
                return pathname + newExt.toLowerCase();
            }
            String name = pathname.substring(0, indexExt);
            return name + newExt.toLowerCase();
        }
        return "";
    }

    // ====================================================================================================

    public static boolean MakeDir(String pathname) {
        File root = new File(pathname);
        if (root.exists()) {
            return IsDirectory(pathname);
        }
        return root.mkdirs();
    }

    public static boolean MakeParentDir(String pathname) {
        File root = new File(pathname);
        String parent = root.getParent();
        return MakeDir(parent);
    }

    public static boolean MoveDir(String pathname, String newPathname) {
        File root = new File(pathname);
        if (root.exists()) {
            if (root.isDirectory()) {
                File newDir = new File(newPathname);
                if (MakeParentDir(newPathname)) {
                    if (newDir.exists() == false) {
                        return root.renameTo(newDir);
                    }
                }
            }
        }
        return false;
    }

    public static boolean RemoveDir(String pathname) {
        File root = new File(pathname);
        if (root.exists()) {
            if (root.isDirectory()) {
                return root.delete();
            }
        }
        return false;
    }

    public static boolean RenameDir(String pathname, String newName) {
        File root = new File(pathname);
        if (root.exists()) {
            if (root.isDirectory()) {
                String newPathname = root.getParent() + File.separator + newName;
                File newDir = new File(newPathname);
                if (newDir.exists() == false) {
                    return root.renameTo(newDir);
                }
            }
        }
        return false;
    }

    // ====================================================================================================

    public static boolean CopyFile(String pathname, String newPathname) {
        File srcFile = new File(pathname);
        if (srcFile.exists()) {
            if (srcFile.isFile()) {
                File newFile = new File(newPathname);
                if (newFile.exists() == false) {
                    try {
                        Path copyPath = Files.copy(srcFile.toPath(), newFile.toPath());
                        if (copyPath != null) {
                            String copyPathname = ReplaceFileSeparator(copyPath.toString());
                            return copyPathname.equals(newPathname);
                        }
                    } catch (Exception e) {
                        System.err.println(e);
                    }
                }
            }
        }
        return false;
    }

    public static boolean MoveFile(String pathname, String newPathname) {
        File root = new File(pathname);
        if (root.isFile()) {
            File newFile = new File(newPathname);
            String newRootPathname = newFile.getParent();
            File newRoot = new File(newRootPathname);
            if (newRoot.exists()) {
                if (newFile.exists() == false) {
                    return root.renameTo(newFile);
                }
            }
        }
        return false;
    }

    public static boolean RemoveFile(String pathname) {
        File root = new File(pathname);
        if (root.isFile()) {
            return root.delete();
        }
        return false;
    }

    public static boolean RenameFile(String pathname, String newName) {
        File root = new File(pathname);
        if (root.isFile()) {
            String newPathname = root.getParent() + File.separator + newName;
            File newFile = new File(newPathname);
            if (newFile.exists() == false) {
                return root.renameTo(newFile);
            }
        }
        return false;
    }

    // ====================================================================================================

    public static ArrayList<File> GetDirList(String pathname) {
        ArrayList<File> retList = GetDirList(pathname, false);
        return retList;
    }

    public static ArrayList<File> GetDirList(String pathname, boolean bRecursive) {
        ArrayList<File> retList = new ArrayList<>();
        GetDirList(pathname, bRecursive, retList);
        return retList;
    }

    public static void GetDirList(String pathname, boolean bRecursive, ArrayList<File> retList) {
        if (FileHelper.IsDirectory(pathname)) {
            File root = new File(pathname);
            File[] fileList = root.listFiles();
            for (File file : fileList) {
                String path = file.getPath();
                if (FileHelper.IsDirectory(path)) {
                    retList.add(file);
                    if (bRecursive) {
                        GetDirList(file.getPath(), bRecursive, retList);
                    }
                }
            }
        }
    }

    // ====================================================================================================

    public static ArrayList<File> GetFileList(String pathname) {
        ArrayList<File> retList = GetFileList(pathname, false);
        return retList;
    }

    public static ArrayList<File> GetFileList(String pathname, boolean bRecursive) {
        ArrayList<File> retList = new ArrayList<>();
        GetFileList(pathname, bRecursive, retList);
        return retList;
    }

    public static void GetFileList(String pathname, boolean bRecursive, ArrayList<File> retList) {
        if (FileHelper.IsDirectory(pathname)) {
            File root = new File(pathname);
            File[] fileList = root.listFiles();
            for (File file : fileList) {
                String path = file.getPath();
                if (FileHelper.IsDirectory(path)) {
                    if (bRecursive) {
                        GetFileList(file.getPath(), bRecursive, retList);
                    }
                } else {
                    retList.add(new File(pathname));
                }
            }
        } else {
            retList.add(new File(pathname));
        }
    }

    // ====================================================================================================

}
