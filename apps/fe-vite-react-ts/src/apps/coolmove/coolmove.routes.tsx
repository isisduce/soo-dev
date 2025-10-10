import type { RouterData } from '../../common/router/router.data';
import { CoolmovePage } from './coolmove.page';

export const routes: RouterData[] = [
    { path: '/coolmove', element: <CoolmovePage />, label: 'Coolmove', },
];
