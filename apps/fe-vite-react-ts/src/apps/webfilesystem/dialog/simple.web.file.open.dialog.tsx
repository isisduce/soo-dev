import React, { useEffect, useState, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, CircularProgress, Alert, IconButton, Select, MenuItem } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { PathHelper } from '../helper/path.helper';
import { RenderPathTextComponent } from '../component/render.path.text.component';
import { webFileSystemApi } from '../api/web.file.system.api';
import { FileList } from '../component/file.list';
import type { FileInfoDto } from '../types/web.file.system.types';

interface SimpleWebFileOpenDialogProps {
    open?: boolean;
    onClose?: () => void;
    title?: string;
    onSelect?: (file: FileInfoDto[]) => void;
    apiServer?: string;
    rootPath?: string;
    initialPath?: string;
    fileExtensions?: string[];
}

export const SimpleWebFileOpenDialog: React.FC<SimpleWebFileOpenDialogProps> = (props: SimpleWebFileOpenDialogProps) => {

    const rootPath = PathHelper.normalizePath(props.rootPath);
    const open = props.open || false;
    const onClose = () => {
        if (props.onClose) {
            setCurrentPath(rootPath);
            setSelectedFiles([]);
            props.onClose();
        }
    };

    const pathContainerRef = useRef<HTMLDivElement>(null);
    const [availableWidth, setAvailableWidth] = useState(800);

    const [currentPath, setCurrentPath] = useState(PathHelper.normalizePath(props.initialPath || rootPath));
    // 기본값 ''(전체)로 강제 설정
    const [selectedExtension, setSelectedExtension] = useState<string>('');
    const [selectedFiles, setSelectedFiles] = useState<FileInfoDto[]>([]);
    const [fileList, setFileList] = useState<FileInfoDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 다이얼로그가 열릴 때마다, 또는 fileExtensions가 바뀔 때마다 '전체'로 초기화
    useEffect(() => {
        setSelectedExtension('');
    }, [open, props.fileExtensions]);

    // 다이얼로그 너비 측정
    useEffect(() => {
        const updateAvailableWidth = () => {
            const container = pathContainerRef.current;
            setAvailableWidth(container ? container.offsetWidth : 800);
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

    useEffect(() => {
        if (open) {
            const initialPath = PathHelper.normalizePath(props.initialPath || rootPath);
            if (currentPath !== initialPath) {
                setCurrentPath(initialPath);
            }
            setSelectedFiles([]);
            setError(null);
        }
    }, [open, props.initialPath]);

    // 파일 리스트 가져오기
    const fetchFileList = async (path: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await webFileSystemApi.getList(props.apiServer, path);
            if (response.code === 200000 && Array.isArray(response.result)) {
                setFileList(response.result);
                setError(null);
            } else {
                setFileList([]);
                let errorMessage = response.message || '파일 목록을 가져오는데 실패했습니다.';
                if (response.code && response.code !== 200000) {
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

    // 경로가 변경될 때마다 파일 리스트 가져오기
    useEffect(() => {
        if (open && currentPath) {
            // console.log('Current path changed, fetching file list:', currentPath);
            fetchFileList(currentPath);
        }
    }, [currentPath, open]);

    // 뒤로 가기 핸들러
    const handleBack = () => {
        const normalizedCurrentPath = PathHelper.normalizePath(currentPath);
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

    // 파일 선택 핸들러
    const handleFileSelect = () => {
        if (selectedFiles.length > 0 && props.onSelect) {
            props.onSelect(selectedFiles);
            setCurrentPath(rootPath);
            setSelectedFiles([]);
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{
                minHeight: 80,
                maxHeight: 80,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                py: 2
            }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={1}>
                        <Button
                            onClick={handleBack}
                            disabled={PathHelper.isRootPath(currentPath, rootPath)}
                            size="small"
                        >
                            뒤로
                        </Button>
                        <Typography variant="h6">
                            {props.title || '파일 탐색기'}
                        </Typography>
                    </Box>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box ref={pathContainerRef} sx={{ mt: 1, overflow: 'hidden' }}>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    </Typography>
                    <RenderPathTextComponent
                        rootPath={rootPath}
                        currentPath={currentPath}
                        setCurrentPath={setCurrentPath}
                        setSelectedFiles={setSelectedFiles}
                        availableWidth={availableWidth}
                    />
                </Box>
            </DialogTitle>
            <DialogContent
                dividers
                sx={{
                    height: 400,
                    maxHeight: 400,
                    overflowY: 'auto',
                    p: 0
                }}
            >
                {loading && (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                        <CircularProgress />
                    </Box>
                )}
                {error && (
                    <Alert severity="error" sx={{ m: 2 }}>
                        {error}
                    </Alert>
                )}
                {!loading && !error && (
                    <>
                        <FileList
                            fileList={fileList}
                            setCurrentPath={setCurrentPath}
                            fileExtensions={[selectedExtension]}
                            selectedFiles={selectedFiles}
                            setSelectedFiles={setSelectedFiles}
                            onSelect={handleFileSelect}
                        />
                        {/* <FileListComponent
                        fileList={fileList}
                        setCurrentPath={setCurrentPath}
                        fileExtensions={[selectedExtension]}
                        selectedFiles={selectedFiles}
                        setSelectedFiles={setSelectedFiles}
                        onSelect={handleFileSelect}
                    /> */}
                    </>
                )}
            </DialogContent>
            <DialogActions>
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
                            {/* 선택된 파일: <span style={{ fontWeight: 500 }}>{selectedFiles[0].name}</span> */}
                            선택된 파일: {selectedFiles[0].name}
                        </Typography>
                    )}
                </Box>
                <Button onClick={onClose}>취소</Button>
                <Button
                    onClick={handleFileSelect}
                    variant="contained"
                    disabled={selectedFiles.length === 0 || selectedFiles[0].type !== 'file'}
                >
                    선택
                </Button>
            </DialogActions>
        </Dialog>
    );
};