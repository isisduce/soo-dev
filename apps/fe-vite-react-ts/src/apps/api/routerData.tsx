import type { RouterData } from '../../common/router/router.data';
import { ApiTest } from './api.test';

export const routerData: RouterData[] = [
    { path: '/api',             element: <ApiTest />, label: '' },
    { path: '/api/api-test',    element: <ApiTest />, label: 'API Test' },

    // 필요한 라우트 추가 가능
];
