import type { WebFileSystem } from "../types/web.file.system.types";

export const FileHelper = {

    getDirectoryIcon: (): string => {
        return '📁';
    },

    getFileIcon: (extension?: string): string => {
        const iconMap: { [key: string]: string } = {
            // 문서
            'pdf': '📄',
            'doc': '📝',
            'docx': '📝',
            'txt': '📄',
            'md': '📝',
            'rtf': '📄',

            // 이미지
            'jpg': '🖼️',
            'jpeg': '🖼️',
            'png': '🖼️',
            'gif': '🖼️',
            'bmp': '🖼️',
            'svg': '🖼️',
            'tif': '🖼️',
            'tiff': '🖼️',
            'webp': '🖼️',

            // 비디오
            'mp4': '🎬',
            'avi': '🎬',
            'mov': '🎬',
            'wmv': '🎬',
            'flv': '🎬',
            'webm': '🎬',

            // 오디오
            'mp3': '🎵',
            'wav': '🎵',
            'flac': '🎵',
            'aac': '🎵',
            'ogg': '🎵',

            // 압축
            'zip': '🗜️',
            'rar': '🗜️',
            '7z': '🗜️',
            'tar': '🗜️',
            'gz': '🗜️',

            // 코드
            'js': '📜',
            'ts': '📜',
            'jsx': '📜',
            'tsx': '📜',
            'html': '🌐',
            'css': '🎨',
            'scss': '🎨',
            'sass': '🎨',
            'json': '📋',
            'xml': '📋',
            'yml': '📋',
            'yaml': '📋',

            // 실행파일
            'exe': '⚙️',
            'msi': '⚙️',
            'app': '⚙️',
            'deb': '⚙️',
            'rpm': '⚙️',
        };

        return extension && iconMap[extension?.toLowerCase()] || '📄';
    },

    getItemIcon: (item: WebFileSystem.FileInfo): string => {
        if (item.type === 'directory') {
            return FileHelper.getDirectoryIcon();
        } else {
            return FileHelper.getFileIcon(item.extension);
        }
    },

    formatFileSize: (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    },

    formatDate: (date?: Date | string): string => {
        try {
            if (!date) {
                return '날짜 없음';
            }
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            if (isNaN(dateObj.getTime())) {
                return '날짜 없음';
            }
            return new Intl.DateTimeFormat('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            }).format(dateObj);
        } catch (error) {
            console.error('Date formatting error:', error);
            return '날짜 오류';
        }
    },

};