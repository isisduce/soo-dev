import React from 'react';
import { DirectoryTree } from '../DirectoryTree/DirectoryTree';
import type { DirectoryItem, ServerConfig } from '../../types';
import './SidebarNavigation.css';

interface SidebarNavigationProps {
    serverConfig: ServerConfig | null | undefined;
    currentPath: string;
    directories: DirectoryItem[];
    onPathSelect: (path: string) => void;
    onDirectoryClick: (path: string) => void;
    onDirectoryToggle: (path: string) => void;
    scrollToTreeItem?: boolean; // 스크롤 트리거용
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
    serverConfig,
    currentPath,
    directories,
    onPathSelect,
    onDirectoryClick,
    onDirectoryToggle,
    scrollToTreeItem = false,
}) => {
    return (
        <div className="sidebar-navigation">
            <div className="sidebar-section">
                <div className="sidebar-section-header">
                    <span className="sidebar-section-title">폴더 트리</span>
                </div>
                <div className="sidebar-section-content">
                    <DirectoryTree
                        directories={directories}
                        currentPath={currentPath}
                        allowedPaths={serverConfig?.allowedPaths || []}
                        onDirectoryClick={onDirectoryClick}
                        onDirectoryToggle={onDirectoryToggle}
                        onPathSelect={onPathSelect}
                        scrollToItem={scrollToTreeItem}
                    />
                </div>
            </div>
        </div>
    );
};
