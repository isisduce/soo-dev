import React from 'react';
import type { ServerConfig } from '../../types';
import './RootPathSelector.css';

interface RootPathSelectorProps {
    serverConfig?: ServerConfig;
    currentPath: string;
    onPathSelect: (path: string) => void;
}

export const RootPathSelector: React.FC<RootPathSelectorProps> = ({
    serverConfig,
    currentPath,
    onPathSelect,
}) => {
    if (!serverConfig?.allowedPaths || serverConfig.allowedPaths.length === 0) {
        return null;
    }

    const getDisplayName = (path: string): string => {
        // 경로에 따른 표시명 생성
        if (path === 'C:\\' || path === 'C:') return '💻 로컬 드라이브 (C:)';
        if (path === 'D:\\' || path === 'D:') return '💾 데이터 드라이브 (D:)';
        if (path === 'E:\\' || path === 'E:') return '💿 드라이브 (E:)';
        if (path.includes('Users\\Administrator') || path.includes('Users/Administrator')) return '🏠 사용자 홈';
        if (path === '/develop') return '⚡ 개발환경';
        if (path === '/nas') return '🗄️ NAS 스토리지';

        // 기본적으로 경로의 마지막 부분을 표시명으로 사용
        const parts = path.split(/[\\/]/).filter(Boolean);
        return parts.length > 0 ? `📁 ${parts[parts.length - 1]}` : path;
    };

    const getIcon = (path: string): string => {
        if (path === 'C:\\' || path === 'C:') return '💻';
        if (path === 'D:\\' || path === 'D:') return '💾';
        if (path === 'E:\\' || path === 'E:') return '💿';
        if (path.includes('Users')) return '🏠';
        if (path === '/develop') return '⚡';
        if (path === '/nas') return '🗄️';
        return '📁';
    };

    const isCurrentPath = (path: string): boolean => {
        // 정확한 경로 매칭을 위해 경로를 정규화
        const normalizePath = (p: string) => {
            // 백슬래시를 슬래시로 통일
            let normalized = p.replace(/\\/g, '/');
            // 마지막 슬래시 제거 (루트가 아닌 경우)
            if (normalized.length > 1 && normalized.endsWith('/')) {
                normalized = normalized.slice(0, -1);
            }
            // Windows 드라이브 경로 처리 (C: -> C:/)
            if (/^[A-Za-z]:$/.test(normalized)) {
                normalized += '/';
            }
            return normalized;
        };

        const normalizedCurrent = normalizePath(currentPath);
        const normalizedPath = normalizePath(path);

        // 정확히 같은 경로인 경우만 true
        return normalizedCurrent === normalizedPath;
    };

    return (
        <div className="root-path-selector">
            <div className="root-path-selector-header">
                <span className="root-path-selector-title">📍 접근 가능한 경로</span>
            </div>
            <div className="root-path-selector-list">
                {serverConfig.allowedPaths.map((path, index) => (
                    <button
                        key={index}
                        className={`root-path-item ${isCurrentPath(path) ? 'active' : ''}`}
                        onClick={() => onPathSelect(path)}
                        title={`${path}로 이동`}
                    >
                        <span className="root-path-icon">{getIcon(path)}</span>
                        <span className="root-path-name">{getDisplayName(path)}</span>
                        <span className="root-path-path">{path}</span>
                    </button>
                ))}
            </div>
            <div className="root-path-selector-info">
                <small>현재 경로: {currentPath}</small>
            </div>
        </div>
    );
};
