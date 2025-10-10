export const PathHelper = {

    // 경로를 string 배열로 반환
    // renderPathTextArray: (currentPath: string, rootPath: string) => {
    //     const normalizedPath = PathHelper.normalizePath(currentPath);
    //     const rootNormalized = PathHelper.normalizePath(rootPath);
    //     const parts = PathHelper.splitPath(normalizedPath);
    //     const rootParts = PathHelper.splitPath(rootNormalized);
    //     // 하위 경로만 추출
    //     return parts.slice(rootParts.length);
    // },

    // 경로 처리 유틸리티 함수들
    normalizePath: (path?: string): string => {
        // path가 undefined/null/빈 문자열이면 루트 경로 반환
        if (!path) return '';
        // 백슬래시를 슬래시로 변환
        return path.replace(/\\/g, '/');
    },

    splitPath: (path: string): string[] => {
        // 경로를 정규화하고 분할
        return PathHelper.normalizePath(path).split('/').filter(Boolean);
    },

    joinPath: (parts: string[]): string => {
        // 윈도우와 유닉스 모두 호환되도록 / 사용
        return parts.length === 0 ? '/' : '/' + parts.join('/');
    },

    isRootPath: (path: string, rootPath: string): boolean => {
        return !path || path === rootPath || path === '/';
    },

}