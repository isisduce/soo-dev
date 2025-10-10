import type { RouterData } from '../../libs/router/router.data';
import { WebFileSystemPage } from './web.filesystem.page';

export const webFileSystemRoutes: RouterData[] = [
    { path: '/web-filesystem', element: <WebFileSystemPage />, label: 'Web File System', },
];
