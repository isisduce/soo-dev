import type { RefObject } from "react";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import RefreshIcon from '@mui/icons-material/Refresh';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import DeleteIcon from '@mui/icons-material/Delete';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import type { ToolbarButton } from "../types/web.file.system.types";

export const WebFileSystemToolbar = {
    KEY: {
        UPPER: 'upper',
        REFRESH: 'refresh',
        CREATE: 'create',
        DELETE: 'delete',
        RENAME: 'rename',
        MOVE: 'move',
        COPY: 'copy',
        PASTE: 'paste',
        UPLOAD: 'upload',
        DOWNLOAD: 'download',
        VIEW: 'view',
        EDIT: 'edit',
    } as const,

    getButtons: (
        listRef: RefObject<HTMLDivElement | null>,
        enableKeys?: string[],
    ): (ToolbarButton & { enabled: boolean })[] => {
        return WebFileSystemToolbarBaseButtons.map(btn => ({
            key: btn.key,
            label: btn.label,
            tooltip: btn.tooltip,
            icon: btn.icon,
            onClick: btn.onClick(listRef),
            enabled: enableKeys ? enableKeys.includes(btn.key) : true,
        }));
    },

};

const WebFileSystemToolbarBaseButtons = [
    {
        key: WebFileSystemToolbar.KEY.UPPER,
        label: 'Upper',
        tooltip: 'Up to Parent Directory',
        icon: <ArrowUpwardIcon />,
        onClick: (listRef: RefObject<HTMLDivElement | null>) => () => listRef.current?.focus(),
    },
    {
        key: WebFileSystemToolbar.KEY.REFRESH,
        label: 'Refresh',
        tooltip: 'Refresh Directory',
        icon: <RefreshIcon />,
        onClick: (listRef: RefObject<HTMLDivElement | null>) => () => listRef.current?.focus(),
    },
    {
        key: WebFileSystemToolbar.KEY.CREATE,
        label: 'Create',
        tooltip: 'Create New Directory',
        icon: <CreateNewFolderIcon />,
        onClick: (listRef: RefObject<HTMLDivElement | null>) => () => listRef.current?.focus(),
    },
    {
        key: WebFileSystemToolbar.KEY.DELETE,
        label: 'Delete',
        tooltip: 'Delete Selected Item(s)',
        icon: <DeleteIcon />,
        onClick: (listRef: RefObject<HTMLDivElement | null>) => () => listRef.current?.focus(),
    },
    {
        key: WebFileSystemToolbar.KEY.RENAME,
        label: 'Rename',
        tooltip: 'Rename Selected Item',
        icon: <DriveFileRenameOutlineIcon />,
        onClick: (listRef: RefObject<HTMLDivElement | null>) => () => listRef.current?.focus(),
    },
    {
        key: WebFileSystemToolbar.KEY.MOVE,
        label: 'Move',
        tooltip: 'Move Selected Item(s)',
        icon: <DriveFileMoveIcon />,
        onClick: (listRef: RefObject<HTMLDivElement | null>) => () => listRef.current?.focus(),
    },
    {
        key: WebFileSystemToolbar.KEY.COPY,
        label: 'Copy',
        tooltip: 'Copy Selected Item(s) to virtual Clipboard',
        icon: <ContentCopyIcon />,
        onClick: (listRef: RefObject<HTMLDivElement | null>) => () => listRef.current?.focus(),
    },
    {
        key: WebFileSystemToolbar.KEY.PASTE,
        label: 'Paste',
        tooltip: 'Paste from virtual Clipboard',
        icon: <ContentPasteIcon />,
        onClick: (listRef: RefObject<HTMLDivElement | null>) => () => listRef.current?.focus(),
    },
    {
        key: WebFileSystemToolbar.KEY.UPLOAD,
        label: 'Upload',
        tooltip: 'Upload File(s)',
        icon: <CloudUploadIcon />,
        onClick: (listRef: RefObject<HTMLDivElement | null>) => () => listRef.current?.focus(),
    },
    {
        key: WebFileSystemToolbar.KEY.DOWNLOAD,
        label: 'Download',
        tooltip: 'Download Selected Item(s)',
        icon: <CloudDownloadIcon />,
        onClick: (listRef: RefObject<HTMLDivElement | null>) => () => listRef.current?.focus(),
    },
    {
        key: WebFileSystemToolbar.KEY.VIEW,
        label: 'View',
        tooltip: 'View Selected Item',
        icon: <VisibilityIcon />,
        onClick: (listRef: RefObject<HTMLDivElement | null>) => () => listRef.current?.focus(),
    },
    {
        key: WebFileSystemToolbar.KEY.EDIT,
        label: 'Edit',
        tooltip: 'Edit Selected Item',
        icon: <EditIcon />,
        onClick: (listRef: RefObject<HTMLDivElement | null>) => () => listRef.current?.focus(),
    },
];
