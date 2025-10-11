import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { shallow } from 'zustand/shallow';
import { useAppEnvStore } from '../../appmain/app.env';
import { WebExplorer } from './explorer/web.explorer';
import { SimpleWebFileOpenDialog } from './dialog/simple.web.file.open.dialog';
import { webFileSystemApi } from './api/web.file.system.api';
import './web.filesystem.page.css';
import { WebFileOpenDialog } from './dialog/web.file.open.dialog';

export const WebFileSystemPage: React.FC = () => {

    const env = useAppEnvStore((state) => state.env);

    const [rootPath, setRootPath] = useState<string>();
    const [rootPathJava, setRootPathJava] = useState<string>();
    const [rootPathNest, setRootPathNest] = useState<string>();
    useEffect(() => {
        const fetchRootPath = async () => {
            try {
                const res = await webFileSystemApi.getRootPath(env.apps?.urlApiServerJava);
                if (res.code === 200000) {
                    setRootPathJava(res.result);
                }
            } catch (error) {
                console.error('Exception fetching root path from Java:', error);
            }
            try {
                const res = await webFileSystemApi.getRootPath(env.apps?.urlApiServerNest);
                if (res.code === 200000) {
                    setRootPathNest(res.result);
                }
            } catch (error) {
                console.error('Exception fetching root path from Nest:', error);
            }
        };
        fetchRootPath();
    }, [env.apps?.urlApiServerJava, env.apps?.urlApiServerNest]);

    const [apiServer, setApiServer] = useState(env.apps?.urlApiServerJava || '');

    const [dialogOpenWebExplorer, setDialogOpenWebExplorer] = useState(false);
    const [dialogOpenFileOpenOld, setDialogOpenFileOpenOld] = useState(false);
    const [dialogOpenFileOpenNew, setDialogOpenFileOpenNew] = useState(false);

    const handleOpenWebExplorerDialog = () => { setDialogOpenWebExplorer(true); };
    const handleCloseWebExplorerDialog = () => { setDialogOpenWebExplorer(false); };

    const handleOpenFileOpenDialogOld = () => { setDialogOpenFileOpenOld(true); };
    const handleCloseFileOpenDialogOld = () => { setDialogOpenFileOpenOld(false); };

    const handleFileSelect = (file: any) => {
        console.log('Selected file:', file);
        // 파일 선택 시 처리할 로직
    };

    const { envChanged, envChangeMessage } = useAppEnvStore((state) => ({
        envChanged: state.envChanged,
        envChangeMessage: state.envChangeMessage,
    }), shallow);

    // envChanged 상태 변경 시에만 로그 출력
    // useEffect(() => {
    //     if (envChanged) {
    //         console.log('WebFileSystem Page: envChanged:', envChanged, 'envChangeMessage:', envChangeMessage);
    //     }
    // }, [envChanged, envChangeMessage]);

    return (
        <div className="web-filesystem-page">
            <h1>WFS</h1>
            {envChanged && (
                <div className="web-explorer-notice">
                    {envChangeMessage}
                </div>
            )}
            <div className="web-filesystem-btn-group-outer">
                <div className="web-filesystem-btn-group-inner">
                    <Button variant="contained" color="primary" onClick={() => { setApiServer(env.apps?.urlApiServerJava || ''); setRootPath(rootPathJava); handleOpenWebExplorerDialog(); }} >(Java) Web Explorer</Button>
                    <Button variant="contained" color="primary" onClick={() => { setApiServer(env.apps?.urlApiServerJava || ''); setRootPath(rootPathJava); handleOpenFileOpenDialogOld(); }} >(Java) Web File Open Dialog</Button>
                    <Button variant="contained" color="primary" onClick={() => { setApiServer(env.apps?.urlApiServerJava || ''); setRootPath(rootPathJava); setDialogOpenFileOpenNew(true); }} >(Java) Web File Open Dialog</Button>
                </div>
                <div className="web-filesystem-btn-group-inner">
                    <Button variant="contained" color="primary" onClick={() => { setApiServer(env.apps?.urlApiServerNest || ''); setRootPath(rootPathNest); handleOpenWebExplorerDialog(); }} >(Nest) Web Explorer</Button>
                    <Button variant="contained" color="primary" onClick={() => { setApiServer(env.apps?.urlApiServerNest || ''); setRootPath(rootPathNest); handleOpenFileOpenDialogOld(); }} >(Nest) Web File Open Dialog</Button>
                    <Button variant="contained" color="primary" onClick={() => { setApiServer(env.apps?.urlApiServerNest || ''); setRootPath(rootPathNest); setDialogOpenFileOpenNew(true); }} >(Nest) Web File Open Dialog</Button>
                </div>
            </div>

            <WebExplorer
                open={dialogOpenWebExplorer}
                onClose={handleCloseWebExplorerDialog}
                title="WebExplorer"
                // onFocus={() => handleDialogFocus(dialog.id)}
                // onSelect={handleFileSelect}
                apiServer={apiServer}
                rootPath={rootPath}
                initialPath={rootPath}
                // fileExtensions={['.png', '.jpg', '.jpeg', '.tif']}
                dialogId={''}
                zIndex={1}
            />
            <SimpleWebFileOpenDialog
                open={dialogOpenFileOpenOld}
                onClose={handleCloseFileOpenDialogOld}
                title="파일 선택"
                onSelect={handleFileSelect}
                apiServer={apiServer}
                rootPath={rootPath}
                initialPath={undefined}
                fileExtensions={['.png', '.jpg', '.jpeg', '.tif']}
            />
            <WebFileOpenDialog
                open={dialogOpenFileOpenNew}
                setOpen={setDialogOpenFileOpenNew}
                title="File Open Dialog"
                dialogId='dialogId'
                zIndex={1}
                apiServer={apiServer}
                rootPath={rootPath}
                initialPath={undefined}
                // initialPath={'/nas/soo/apps'}
                showHidden={true}
                // fileExtensions={['.png', '.jpg', '.jpeg', '.tif', '.dxf']}
                enableMultiSelect={false}
                onSelect={handleFileSelect}
                showButtonLabel={true}
                showButtonTooltip={true}
                showTree={true}
                showList={true}
            />
        </div>
    );
};
