import type { RouterData } from '../../common/router/router.data';
import { WebFileSystemPage } from './web.filesystem.page';

export const routerData: RouterData[] = [
    { path: '/wfs',                 element: <WebFileSystemPage />, label: '', },
    { path: '/wfs/web-filesystem',  element: <WebFileSystemPage />, label: 'Web File System', },
];
