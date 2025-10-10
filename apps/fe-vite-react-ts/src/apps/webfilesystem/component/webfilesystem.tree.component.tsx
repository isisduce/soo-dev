import React, { useContext } from 'react';
import type { FileInfoDto } from '../types/web.file.system.types';
import Box from '@mui/material/Box';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';

export interface TreeContextValue {
    expandedItems: string[];
    setExpandedItems: (items: string[]) => void;
    rootInfo?: FileInfoDto;
    getChildren?: (apiServer: string, parentPath: string) => Promise<FileInfoDto[]>;
    apiServer?: string;
    setCurrentPath?: (value: string) => void;
}
export const TreeContext = React.createContext<TreeContextValue>({
    expandedItems: [],
    setExpandedItems: () => {},
});

interface WebFileSystemTreeComponentProps {
    apiServer?: string;
    rootInfo?: FileInfoDto;
    currentPath?: string;
    setCurrentPath?: (value: string) => void;
    expandedItems?: string[];
    setExpandedItems?: (items: string[]) => void;
    dirCache?: { [path: string]: FileInfoDto[] };
    getChildren?: (apiServer: string, parentPath: string) => Promise<FileInfoDto[]>;
    enableMultiSelect?: boolean;
    enableSelectDirectory?: boolean;
    setSelectedFiles?: (files: FileInfoDto[]) => void;
}

export const WebFileSystemTreeComponent = React.memo(
    (props: WebFileSystemTreeComponentProps) => {
        const { apiServer, rootInfo, currentPath, setCurrentPath, expandedItems: expandedItemsRaw, setExpandedItems, getChildren } = props;
        const expandedItems = React.useMemo(() => expandedItemsRaw ?? [], [expandedItemsRaw]);
        const treeContentRef = React.useRef<HTMLDivElement>(null);
        React.useEffect(() => {
            if (!treeContentRef.current || !currentPath) return;
            const activeItem = treeContentRef.current.querySelector(`[data-item-id='${currentPath}']`);
            if (activeItem) {
                activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, [currentPath]);
        if (!rootInfo) {
            return null;
        }
        return (
            <TreeContext.Provider value={{ expandedItems, setExpandedItems: setExpandedItems ?? (() => {}), rootInfo, getChildren, apiServer, setCurrentPath }}>
                <Box className="directory-tree" sx={{ width: '100%' }}>
                    <Box className="directory-tree-content" sx={{ width: '100%' }} ref={treeContentRef}>
                        <SimpleTreeView
                            expandedItems={expandedItems}
                            onExpandedItemsChange={(_: any, itemIds: any) => setExpandedItems?.(itemIds)}
                        >
                            <TreeNode currentPath={currentPath} />
                        </SimpleTreeView>
                    </Box>
                </Box>
            </TreeContext.Provider>
        );
    },
    (prev, next) => (
        prev.rootInfo === next.rootInfo &&
        prev.expandedItems === next.expandedItems &&
        prev.getChildren === next.getChildren
    )
);

interface TreeNodeProps {
    currentPath?: string;
}
const TreeNode: React.FC<TreeNodeProps> = React.memo(({ currentPath }) => {
    const { apiServer, rootInfo, setCurrentPath, expandedItems, setExpandedItems, getChildren } = useContext(TreeContext);
    const [children, setChildren] = React.useState<FileInfoDto[]>([]);
    React.useEffect(() => {
        let mounted = true;
        getChildren?.(apiServer || '', rootInfo?.path || '').then(result => {
            if (mounted) setChildren(result);
        });
        return () => { mounted = false; };
    }, [apiServer, rootInfo?.path, getChildren]);
    const isSelected = currentPath === rootInfo?.path;
    return (
        <TreeItem
            key={rootInfo?.path ?? ''}
            itemId={rootInfo?.path ?? ''}
            data-item-id={rootInfo?.path ?? ''}
            label={
                <Box
                    display="flex"
                    alignItems="center"
                    sx={{
                        width: '100%',
                        minHeight: 0,
                        height: '32px',
                        py: 0,
                        my: 0,
                        marginTop: 0,
                        marginBottom: 0,
                        paddingTop: 0,
                        paddingBottom: 0,
                        gap: 0,
                        alignItems: 'center',
                        cursor: 'pointer',
                        bgcolor: isSelected ? 'rgba(0, 120, 255, 0.1)' : undefined,
                        userSelect: 'none',
                    }}
                    onClick={(e: any) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (rootInfo && rootInfo.path) {
                            if (setCurrentPath) setCurrentPath(rootInfo.path);
                        }
                    }}
                >
                    📁&nbsp;
                    {rootInfo?.name}
                </Box>
            }
        >
            {children.map(childDir => (
                <TreeContext.Provider value={{ apiServer, rootInfo: childDir, setCurrentPath, expandedItems, setExpandedItems, getChildren }}>
                    <TreeNode key={childDir.path} currentPath={currentPath} />
                </TreeContext.Provider>
            ))}
        </TreeItem>
    );
});
