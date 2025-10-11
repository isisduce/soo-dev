import type { RouterData } from '../../common/router/router.data';
import { CoolmovePage } from './coolmove.page';

export const routerData: RouterData[] = [
    { path: '/coolmove',            element: <CoolmovePage />, label: '', },
    { path: '/coolmove/coolmove',   element: <CoolmovePage />, label: 'Coolmove', },
];
