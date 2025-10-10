import type { RouterData } from '../../libs/router/router.data';
import { ApiTest } from './api.test';

export const templateRoutes: RouterData[] = [
    { path: '/template-api-test', element: <ApiTest />, label: 'Template API Test', },

    // 필요한 라우트 추가 가능
];
