import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { RichTreeView, type TreeViewBaseItem } from '@mui/x-tree-view';
import { webFileSystemApi } from '../api/web.file.system.api';
import type { WebFileSystem } from '../types/web.file.system.types';

interface WebFileSystemTreeComponentProps {
    apiServer?: string;
    rootPath?: string;
    currentPath?: string;
    setCurrentPath?: (value: string) => void;
    fileList?: WebFileSystem.FileInfo[];
    showHidden?: boolean;
    showFiles?: boolean;
    fileExtensions?: string[];
    enableMultiSelect?: boolean;
    enableSelectDirectory?: boolean;
    setSelectedFiles?: (files: WebFileSystem.FileInfo[]) => void;
}

interface WebFileSystemTreeItemProps {
    id: string;
    label: string;
    file: WebFileSystem.FileInfo;
    hasChildren: boolean;
    children?: WebFileSystemTreeItemProps[];
}

const getWebFileSystemTreeItemProps = (file: WebFileSystem.FileInfo) : WebFileSystemTreeItemProps => {
    // const renderLabel = (): JSX.Element => {
    //     return (
    //         <Box display="flex" alignItems="center">
    //             {FileHelper.getItemIcon(file)}
    //             {file.name}
    //         </Box>
    //     );
    // }
    return {
        id: file.path,
        // label: renderLabel(),
        label: file.name,
        file,
        hasChildren: !!file.hasChildren,
        children: undefined,
    };
};

// ...rest of imports

export const WebFileSystemTreeComponent: React.FC<WebFileSystemTreeComponentProps> = (props: WebFileSystemTreeComponentProps) => {
    // 트리 확장 상태를 직접 관리
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    // prevExpandedItems는 expandedItems로 대체

    // treeContentRef 제거

    // root 변수 제거

    const [treeItems, setTreeItems] = useState<TreeViewBaseItem<WebFileSystemTreeItemProps>[]>([]);
    // expandedItems 제거

    // 더미 노드 정의
    const DUMMY_NODE: TreeViewBaseItem<WebFileSystemTreeItemProps> = {
        id: '__dummy__',
        label: '',
        file: { path: '', name: '', type: 'directory', size: 0, hasChildren: false },
        hasChildren: false,
        children: undefined,
    };

    // 트리 초기화 시 props.currentPath까지 경로를 따라가며 확장된 상태로 children을 동적으로 추가
    // 트리 아이템 생성 (dummyChild 방식)
    const createTreeItems = async (rootPath: string) => {
        const response = await webFileSystemApi.getList(props.apiServer, rootPath);
        if (!response.success) return [];
        const results = response.result.filter(f => f.type === 'directory');
        return await Promise.all(results.map(async f => {
            let children;
            if (f.hasChildren) {
                const subChildrenResp = await webFileSystemApi.getList(props.apiServer, f.path);
                if (subChildrenResp.success) {
                    const subChildren = subChildrenResp.result.filter(sc => sc.type === 'directory');
                    const realChildren = subChildren.map(sc => ({
                        ...getWebFileSystemTreeItemProps(sc),
                        hasChildren: !!sc.hasChildren,
                        children: undefined,
                    }));
                    // 실제 children + 더미 노드
                    if (realChildren.length > 0) {
                        children = [...realChildren ];
                    } else {
                        children = [...realChildren, { ...DUMMY_NODE, id: f.path + '/__dummy__', hasChildren: false, children: undefined }];
                    }
                } else {
                    children = [{ ...DUMMY_NODE, id: f.path + '/__dummy__', hasChildren: false, children: undefined }];
                }
            }
            return {
                ...getWebFileSystemTreeItemProps(f),
                hasChildren: !!f.hasChildren,
                children: children ?? undefined,
            };
        }));
    };

    // 노드 확장 시 children 교체
    const handleNodeToggle = (_event: React.SyntheticEvent | null, expandedIds: string[]) => {
        // 확장 상태 직접 관리
        setExpandedItems(expandedIds);
        // 새로 확장된 id만 추출
        const newlyExpanded = expandedIds.filter(id => !expandedItems.includes(id));
        if (newlyExpanded.length === 0) return;
        const nodeId = newlyExpanded[0];
        (async () => {
            const findAndUpdate = async (items: TreeViewBaseItem<WebFileSystemTreeItemProps>[]): Promise<TreeViewBaseItem<WebFileSystemTreeItemProps>[]> => {
                return Promise.all(items.map(async item => {
                    if (item.id === nodeId && item.hasChildren) {
                        // 이미 실제 children이 있으면 새로 만들지 않음 (더미만 있을 때만 새로 만듦)
                        const isDummyOnly = !item.children || (item.children.length === 1 && item.children[0].id.endsWith('__dummy__'));
                        if (!isDummyOnly) {
                            return item;
                        }
                        // 실제 children 불러오기
                        const childrenRaw = await createTreeItems(item.id);
                        // 더미 노드 추가
                        const children = childrenRaw.length > 0
                            ? [...childrenRaw, ]
                            : [{ ...DUMMY_NODE, id: item.id + '/__dummy__', hasChildren: false, children: undefined }];
                        console.log('Loaded children for', item.id, children);
                        return { ...item, children };
                    } else if (item.children) {
                        return { ...item, children: await findAndUpdate(item.children) };
                    } else {
                        return item;
                    }
                }));
            };
            setTreeItems(await findAndUpdate(treeItems));
        })();
    };

    useEffect(() => {
        if (!props.rootPath) return;
        const printTree = (item: any, depth = 0) => {
            const indent = ' '.repeat(depth * 2);
            console.log(`${indent}- ${item.label} (id: ${item.id}, hasChildren: ${item.hasChildren}, children: ${Array.isArray(item.children) ? 'array' : typeof item.children})`);
            if (Array.isArray(item.children)) {
                item.children.forEach((child: any) => printTree(child, depth + 1));
            }
        };
        const fetchTreeItems = async () => {
            if (treeItems.length > 0) return; // 이미 트리 아이템이 있으면 새로 만들지 않음
            const addDummyRecursively = (items: TreeViewBaseItem<WebFileSystemTreeItemProps>[]): TreeViewBaseItem<WebFileSystemTreeItemProps>[] => {
                return items.map(item =>
                    item.hasChildren
                        ? { ...item, children: [{ ...DUMMY_NODE, id: item.id + '/__dummy__' }] }
                        : item
                );
            };
            const children = await createTreeItems(props.rootPath!);
            const rootNode: TreeViewBaseItem<WebFileSystemTreeItemProps> = {
                id: props.rootPath!,
                label: props.rootPath!,
                file: {
                    path: props.rootPath!,
                    name: props.rootPath!.split('/').filter(Boolean).pop() || props.rootPath!,
                    type: 'directory',
                    size: 0,
                    hasChildren: true,
                },
                hasChildren: true,
                children: addDummyRecursively(children),
            };
            // printTree(rootNode);
            setTreeItems([rootNode]);
        };
        fetchTreeItems();
    }, [props.rootPath, props.apiServer]);

    if (!props.rootPath || !props.fileList) {
        return null;
    }

    return (
        <Box className="directory-tree">
            <Box className="directory-tree-content">
                <RichTreeView
                    items={treeItems}
                    aria-label="customized"
                    expandedItems={expandedItems}
                    onExpandedItemsChange={handleNodeToggle}
                    sx={{ overflowX: 'hidden', flexGrow: 1 }}
                >
                    {/* {renderTree(props.rootPath)} */}
                    {/* {renderTree(root)} */}
                </RichTreeView>
            </Box>
        </Box>
    );

}
