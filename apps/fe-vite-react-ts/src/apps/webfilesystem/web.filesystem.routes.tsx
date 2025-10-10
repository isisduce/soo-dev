import type { RouterData } from '../../common/router/router.data';
import { WebFileSystemPage } from './web.filesystem.page';

export const webFileSystemRoutes: RouterData[] = [
    { path: '/web-filesystem', element: <WebFileSystemPage />, label: 'Web File System', },
];
