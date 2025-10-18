import type { RouterData } from '../../common/router/router.data';
import { CoolmovePage } from './coolmove.page';
import { LoginContainer } from './login/login.container';
import { PrimaryContainer } from './primary/primary.container';
import { PrimaryMast } from './primary/primary.mast';
import { PromiseContainer } from './promise/promise.container';
import { PromiseMast } from './promise/promise.mast';
import { CandidateRegistContainer } from './candidate/candidate.regist.container';
import { CandidateStatusContainer } from './candidate/candidate.status.container';

export const routerConst = {
    BASE: '/coolmove',
    LOGIN: '/coolmove/login',
    PROMISE_CONTAINER: '/coolmove/promise/container',
    PRIMARY_CONTAINER: '/coolmove/primary/container',
    PRIMARY_STATUS: '/coolmove/primary/status',
    PRIMARY_REGIST: '/coolmove/primary/regist',
    PROMISE_REGIST: '/coolmove/promise/regist',
    PROMISE_MAST: '/coolmove/promise/mast',
    PRIMARY_MAST: '/coolmove/primary/mast',
};

export const routerData: RouterData[] = [
    { path: routerConst.BASE,               element: <CoolmovePage />,              label: 'Coolmove', },
    { path: routerConst.LOGIN,              element: <LoginContainer />,            label: 'Login', },
    //
    { path: routerConst.PROMISE_CONTAINER,  element: <PromiseContainer />,          label: 'Promise Container', },
    { path: routerConst.PRIMARY_CONTAINER,  element: <PrimaryContainer />,          label: 'Primary Container', },
    { path: routerConst.PRIMARY_STATUS,     element: <CandidateStatusContainer />,  label: 'Primary Status', },
    { path: routerConst.PRIMARY_REGIST,     element: <CandidateRegistContainer />,  label: 'Primary Registration', },
    //
    // { path: routerConst.PROMISE_REGIST,      element: <PromiseRegistContainer />,  label: 'Promise Registration', },
    // { path: routerConst.PRIMARY_REGIST,      element: <PrimaryRegistContainer />,  label: 'Primary Registration', },
    { path: routerConst.PROMISE_MAST,       element: <PromiseMast />,               label: 'Promise Mast', },
    { path: routerConst.PRIMARY_MAST,       element: <PrimaryMast />,               label: 'Primary Mast', },
];
