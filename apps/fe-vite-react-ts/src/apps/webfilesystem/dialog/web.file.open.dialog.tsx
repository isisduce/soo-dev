import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography, CircularProgress, Alert, Select, MenuItem } from "@mui/material";
import { Close as CloseIcon } from '@mui/icons-material';
import type { FileInfoDto } from "../types/web.file.system.types";
import { webFileSystemApi } from "../api/web.file.system.api";
import { PathHelper } from "../helper/path.helper";
import { WebFileSystemPathTextComponent } from "../component/webfilesystem.path.text.component";
import { WebFileSystemToolbar } from "../component/webfilesystem.toolbar.buttons";
import { WebFileSystemToolbarComponent } from "../component/webfilesystem.toolbar.component";
import { WebFileSystemListComponent } from "../component/webfilesystem.list.component";
import { WebFileSystemTreeComponent } from "../component/webfilesystem.tree.component";

interface WebFileOpenDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    onClose?: () => void;
    title?: string;
    dialogId?: string;
    zIndex?: number;
    apiServer?: string;
    rootPath?: string;
    initialPath?: string;
    showHidden?: boolean;
    fileExtensions?: string[];
    enableMultiSelect?: boolean;
    enableSelectDirectory?: boolean;
    clickToMove?: boolean;
    doubleClickToMove?: boolean;
    selectedFiles?: FileInfoDto[];
    onSelect?: (files: FileInfoDto[]) => void;
    showButtonLabel?: boolean;
    showButtonTooltip?: boolean;
    showTree?: boolean;
    showList?: boolean;
}

export const WebFileOpenDialog: React.FC<WebFileOpenDialogProps> = (props: WebFileOpenDialogProps) => {

    // ====================================================================================================

    const { open, setOpen, title, rootPath, initialPath } = props;

    // ====================================================================================================

    const listRef = useRef<HTMLDivElement>(null);
    // const listHeight = 240;
    const listHeight = 320;

    // ====================================================================================================

    const handleClose = (_event?: any, reason?: string) => {
        if (reason === 'backdropClick') return;
        setOpen(false);
        props.onClose?.();
    }

    // ====================================================================================================

    const handleUpper = () => {
        const normalizedCurrentPath = PathHelper.normalizePath(currentPath);
        if (!rootPath) return;
        if (!currentPath || normalizedCurrentPath === rootPath) return;
        // 경로를 분할 (윈도우/유닉스 경로 구분자 모두 처리)
        const parts = PathHelper.splitPath(normalizedCurrentPath);
        const rootParts = PathHelper.splitPath(rootPath);
        // 마지막 부분(현재 디렉토리) 제거
        parts.pop();
        // 부모 경로 생성 - rootPath보다 위로는 올라가지 않도록 제한
        let parentPath;
        if (parts.length <= rootParts.length) {
            // 루트 경로까지 올라간 경우
            parentPath = rootPath;
        } else {
            parentPath = PathHelper.joinPath(parts);
        }
        setCurrentPath(parentPath);
        setSelectedFiles([]);
    };

    const handleRefresh = () => {
        if (currentPath) {
            fetchFileList(currentPath);
            setSelectedFiles([]);
        }
    };

    // ====================================================================================================

    const [showTree, setShowTree] = useState(props.showTree ?? true);
    const [showList, setShowList] = useState(props.showList ?? true);
    const toolbarButtons = WebFileSystemToolbar.getButtons(listRef,
        [
            WebFileSystemToolbar.KEY.UPPER,
            WebFileSystemToolbar.KEY.REFRESH,
        ]
    ).map(btn => {
        if (btn.key === WebFileSystemToolbar.KEY.UPPER) { return { ...btn, onClick: handleUpper }; }
        if (btn.key === WebFileSystemToolbar.KEY.REFRESH) { return { ...btn, onClick: handleRefresh }; }
        // 다른 버튼도 필요하면 추가
        return btn;
    }).filter(btn => btn.enabled !== false);
    const [showButtonLabel, setShowButtonLabel] = useState(props.showButtonLabel ?? false);
    const [showButtonTooltip, setShowButtonTooltip] = useState(props.showButtonTooltip ?? true);

    const [enableMultiSelect, setEnableMultiSelect] = useState(props.enableMultiSelect ?? false);
    const [enableSelectDirectory, setEnableSelectDirectory] = useState(props.enableSelectDirectory ?? false);
    const [clickToMove, setClickToMove] = useState(props.clickToMove ?? false);
    const [doubleClickToMove, setDoubleClickToMove] = useState(props.doubleClickToMove ?? true);

    // ====================================================================================================

    const [rootInfoRaw, setRootInfoRaw] = useState<FileInfoDto>();
    const [expandedItemsRaw, setExpandedItemsRaw] = useState<string[]>([]);
    const [dirCache, setDirCache] = useState<{ [path: string]: FileInfoDto[] }>({});

    useEffect(() => {
        if (rootPath) {
            webFileSystemApi.getInfo(props.apiServer, rootPath).then(response => {
                if (response.success && response.result) {
                    setRootInfoRaw(response.result);
                }
            });
        }
    }, [props.apiServer, rootPath]);

    // rootInfo, expandedItems, getChildren을 useMemo/useCallback으로 고정
    const rootInfo = useMemo(() => rootInfoRaw, [rootInfoRaw]);
    const expandedItems = useMemo(() => expandedItemsRaw, [expandedItemsRaw]);
    const setExpandedItems = useCallback((items: string[]) => setExpandedItemsRaw(items), []);
    const getChildren = useCallback(async (apiServer: string, parentPath: string) => {
        if (dirCache[parentPath]) return dirCache[parentPath];
        const response = await webFileSystemApi.getList(apiServer, parentPath);
        if (!response.success || !Array.isArray(response.result)) return [];
        const children = response.result.filter(f => f.type === 'directory');
        setDirCache(prev => ({ ...prev, [parentPath]: children }));
        return children;
    }, [dirCache]);
    // ====================================================================================================

    const [currentPath, setCurrentPath] = useState<string | undefined>(initialPath || rootPath);

    useEffect(() => {
        if (open) {
            if (!currentPath || currentPath !== initialPath) {
                setCurrentPath(initialPath || rootPath || '');
            }
            setSelectedFiles([]);
            // setError(null);
        }
    }, [open, rootPath, initialPath]);

    useEffect(() => {
        if (props.rootPath) {
            console.log('rootPath:', props.rootPath);
        }
    }, [props.rootPath]);

    const pathContainerRef = useRef<HTMLDivElement>(null);
    const defaultAvailableWidth = 400;
    const [availableWidth, setAvailableWidth] = useState(defaultAvailableWidth);
    useEffect(() => {
        const updateAvailableWidth = () => {
            const container = pathContainerRef.current;
            setAvailableWidth(container ? container.offsetWidth : defaultAvailableWidth);
        };
        updateAvailableWidth();
        window.addEventListener('resize', updateAvailableWidth);
        if (open) {
            const timer = setTimeout(updateAvailableWidth, 100);
            return () => {
                clearTimeout(timer);
                window.removeEventListener('resize', updateAvailableWidth);
            };
        }
        return () => {
            window.removeEventListener('resize', updateAvailableWidth);
        };
    }, [open]);

    // ====================================================================================================

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState<FileInfoDto[]>([]);
    const fetchFileList = async (pathname: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await webFileSystemApi.getList(props.apiServer, pathname);
            if (response.success && Array.isArray(response.result)) {
                // console.log('Fetched file list:', response.result);
                setFileList(response.result);
                setError(null);
            } else {
                setFileList([]);
                let errorMessage = response.message || '파일 목록을 가져오는데 실패했습니다.';
                if (response.code && !response.success) {
                    errorMessage = `[${response.code}] ${errorMessage}`;
                }
                setError(errorMessage);
            }
        } catch (error) {
            console.error('파일 목록 조회 오류:', error);
            setFileList([]);
            let errorMessage = '파일 목록을 가져오는데 실패했습니다.';
            if (error instanceof Error) {
                errorMessage += ` (${error.message})`;
            } else if (typeof error === 'string') {
                errorMessage += ` (${error})`;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (open && currentPath) {
            // console.log('Current path changed, fetching file list:', currentPath);
            fetchFileList(currentPath);
        }
    }, [open, currentPath]);

    // ====================================================================================================

    const [selectedFiles, setSelectedFiles] = useState<FileInfoDto[]>([]);
    const handleSelect = () => {
        if (0 < selectedFiles.length) {
            props.onSelect?.(selectedFiles);
            setSelectedFiles([]);
            handleClose();
        }
    }

    const [selectedExtension, setSelectedExtension] = useState<string>('');

    // ====================================================================================================

    // 너비 상태 추가
    const [treeWidth, setTreeWidth] = useState<number>(200); // px
    const [listWidth, setListWidth] = useState<number>(600); // px

    // 리사이저 드래그 핸들러
    const dragRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const startWidth = useRef(treeWidth);
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        isDragging.current = true;
        startX.current = e.clientX;
        startWidth.current = treeWidth;
        document.body.style.cursor = 'ew-resize';
    };
    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging.current || !containerRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const minTree = 50, maxTree = 600, minList = 50;
        let newTreeWidth = e.clientX - containerRect.left;
        let containerWidth = containerRect.width;
        // 리사이저(2px) 포함
        newTreeWidth = Math.max(minTree, Math.min(maxTree, newTreeWidth));
        let newListWidth = containerWidth - newTreeWidth - 2;
        if (newListWidth < minList) {
            newTreeWidth = containerWidth - minList - 2;
            newListWidth = minList;
        }
        setTreeWidth(newTreeWidth);
        setListWidth(newListWidth);
    };
    const handleMouseUp = () => {
        isDragging.current = false;
        document.body.style.cursor = '';
    };
    // 드래그 이벤트 등록/해제
    useEffect(() => {
        const move = (e: MouseEvent) => handleMouseMove(e);
        const up = () => handleMouseUp();
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', up);
        return () => {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', up);
        };
    }, []);

    // ====================================================================================================

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ px: 1, py: 1 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="h6">{title}</Typography>
                    </Box>
                    <IconButton onClick={handleClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent sx={{ px: 1, py: 1 }}>
                <Box display='flex' flexDirection='column' gap={1} padding={0} margin={0} >
                    <Box display='flex' flexDirection='column' gap={0} padding={0} margin={0} >
                        <Box>
                            <Box sx={{ mb: 0, display: 'flex', gap: 1 }}>
                                {[
                                    { label: "Tree", value: showTree, setValue: setShowTree },
                                    { label: "List", value: showList, setValue: setShowList },
                                    { label: "Label", value: showButtonLabel, setValue: setShowButtonLabel },
                                    { label: "Tooltip", value: showButtonTooltip, setValue: setShowButtonTooltip },
                                    { label: "multi", value: enableMultiSelect, setValue: setEnableMultiSelect },
                                    { label: "dir", value: enableSelectDirectory, setValue: setEnableSelectDirectory },
                                    { label: "Click", value: clickToMove, setValue: setClickToMove },
                                    { label: "DClick", value: doubleClickToMove, setValue: setDoubleClickToMove },
                                ].map(({ label, value, setValue }) => (
                                    <Button
                                        key={label}
                                        variant={value ? "contained" : "outlined"}
                                        color={value ? "primary" : "inherit"}
                                        sx={{ minWidth: 50, maxWidth: 50, textTransform: "none" }}
                                        onClick={() => setValue(!value)}
                                    >
                                        {label}
                                    </Button>
                                ))}
                            </Box>
                        </Box>
                        <Box
                            ref={pathContainerRef}
                            sx={{
                                backgroundColor: '#f0f0f0',
                                p: 1,
                                mb: 1,
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                        >
                            <WebFileSystemPathTextComponent
                                rootPath={rootPath || ''}
                                currentPath={currentPath || rootPath || ''}
                                setCurrentPath={setCurrentPath}
                                setSelectedFiles={undefined}
                                availableWidth={availableWidth}
                            />
                        </Box>
                        <Box>
                            <WebFileSystemToolbarComponent
                                toolbarButtons={toolbarButtons}
                                showButtonLabel={showButtonLabel}
                                showButtonTooltip={showButtonTooltip}
                            />
                        </Box>
                    </Box>
                    <Box
                        ref={containerRef}
                        display='flex'
                        flexDirection='row'
                        gap={(showTree && showList) ? '6px' : 0}
                        sx={{ height: listHeight, overflowY: 'hidden', }}
                    >
                        {showTree && (
                            <Box
                                border='1px solid #ccc'
                                sx={{
                                    height: listHeight - 2,
                                    overflowY: 'auto',
                                    width: treeWidth,
                                    minWidth: 50,
                                    transition: isDragging.current ? 'none' : 'width 0.1s',
                                }}
                            >
                                {loading ? (
                                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                        <CircularProgress />
                                    </Box>
                                ) : error ? (
                                    <Alert severity="error" sx={{ m: 2 }}>
                                        {error}
                                    </Alert>
                                ) : (
                                    <WebFileSystemTreeComponent
                                        apiServer={props.apiServer}
                                        rootInfo={rootInfo}
                                        currentPath={currentPath || ''}
                                        setCurrentPath={(path) => { setCurrentPath(path); setSelectedFiles([]); }}
                                        expandedItems={expandedItems}
                                        setExpandedItems={setExpandedItems}
                                        dirCache={dirCache}
                                        getChildren={getChildren}
                                        setSelectedFiles={setSelectedFiles}
                                    />
                                )}
                            </Box>
                        )}
                        {showTree && showList && (
                            <Box
                                ref={dragRef}
                                style={{
                                    width: 8,
                                    cursor: 'ew-resize',
                                    background: '#fff',
                                    height: listHeight - 2,
                                    margin: '0 2px',
                                    zIndex: 10,
                                }}
                                onMouseDown={handleMouseDown}
                            />
                        )}
                        {showList && (
                            <Box
                                ref={listRef}
                                flexGrow={3}
                                flexBasis={0}
                                border='1px solid #ccc'
                                tabIndex={0}
                                sx={{
                                    height: listHeight - 2,
                                    overflowY: 'auto',
                                    width: listWidth,
                                    minWidth: 50,
                                }}
                            >
                                {loading ? (
                                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                        <CircularProgress />
                                    </Box>
                                ) : error ? (
                                    <Alert severity="error" sx={{ m: 2 }}>
                                        {error}
                                    </Alert>
                                ) : (
                                    <WebFileSystemListComponent
                                        fileList={fileList}
                                        setCurrentPath={setCurrentPath}
                                        // fileExtensions={props.fileExtensions}
                                        fileExtensions={[selectedExtension]}
                                        showHidden={props.showHidden}
                                        enableMultiSelect={enableMultiSelect}
                                        enableSelectDirectory={enableSelectDirectory}
                                        clickToMove={clickToMove}
                                        doubleClickToMove={doubleClickToMove}
                                        selectedFiles={selectedFiles}
                                        setSelectedFiles={setSelectedFiles}
                                        onSelect={handleSelect}
                                    />
                                )}
                            </Box>
                        )}
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 1, py: 1 }}>
                <Box flex={1} display="flex" alignItems="center" gap={2}>
                    <Box>
                        {/* <select
                            style={{ height: 32, fontSize: 14, borderRadius: 4, border: '1px solid #ccc', padding: '0 8px' }}
                            value={selectedExtension}
                            onChange={e => setSelectedExtension(e.target.value)}
                        >
                            <option value="">전체</option>
                            {(props.fileExtensions || ['.txt', '.log', '.json', '.xml', '.csv']).map(ext => (
                                <option key={ext} value={ext}>{ext}</option>
                            ))}
                        </select> */}
                        {/* <select
                            className="simple-web-file-open-dialog-select"
                            title="파일 확장자 선택"
                            value={selectedExtension}
                            onChange={e => setSelectedExtension(e.target.value)}
                        >
                            <option value="">전체</option>
                            {(props.fileExtensions || ['.txt', '.log', '.json', '.xml', '.csv']).map(ext => (
                                <option key={ext} value={ext}>{ext}</option>
                            ))}
                        </select> */}
                        <Select
                            value={selectedExtension}
                            onChange={e => setSelectedExtension(e.target.value)}
                            size="small"
                            style={{ minWidth: 100 }}
                        >
                            <MenuItem value="">전체</MenuItem>
                            {(props.fileExtensions || ['.txt', '.log', '.json', '.xml', '.csv']).map(ext => (
                                <MenuItem key={ext} value={ext}>{ext}</MenuItem>
                            ))}
                        </Select>
                    </Box>
                    {selectedFiles.length > 0 && (
                        <Typography variant="body2" color="text.secondary">
                            선택: {selectedFiles[0].name}
                        </Typography>
                    )}
                </Box>
                <Button
                    variant="contained"
                    disabled={selectedFiles.length === 0 || (selectedFiles[0].type !== 'file' && !enableSelectDirectory)}
                    onClick={handleSelect}
                >
                    OK
                </Button>
                <Button onClick={handleClose} color="primary">Cancel</Button>
            </DialogActions>
        </Dialog>
    );

}