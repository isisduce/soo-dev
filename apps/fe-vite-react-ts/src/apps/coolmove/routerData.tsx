import type { RouterData } from '../../common/router/router.data';
import { CoolmovePage } from './coolmove.page';
import { LoginContainer } from './login/login.container';
import { CandidateRegistContainer } from './candidate/candidate.regist.container';
import { CandidateStatusContainer } from './candidate/candidate.status.container';
import { PromiseMain } from './promise/promise.main';

export const routerConst = {
    BASE: '/coolmove',
    LOGIN: '/coolmove/login',
    PROMISE_MAIN: '/coolmove/promise/main',
    PROMISE_STATUS: '/coolmove/promise/status',
    PROMISE_REGIST: '/coolmove/promise/regist',
    PRIMARY_MAIN: '/coolmove/primary/main',
    PRIMARY_STATUS: '/coolmove/primary/status',
    PRIMARY_REGIST: '/coolmove/primary/regist',
    CANDIDATE_REGIST: '/coolmove/candidate/regist',
    CANDIDATE_STATUS: '/coolmove/candidate/status',
};

export const routerData: RouterData[] = [
    { path: routerConst.BASE,               element: <CoolmovePage />,              label: 'Coolmove', },
    { path: routerConst.LOGIN,              element: <LoginContainer />,            label: 'Login', },
    //
    { path: routerConst.PROMISE_MAIN,        element: <PromiseMain />,              label: 'Promise Main', },
    // { path: routerConst.PROMISE_STATUS,      element: <PromiseStatusContainer />,  label: 'Promise Status', },
    // { path: routerConst.PROMISE_REGIST,      element: <PromiseRegistContainer />,  label: 'Promise Registration', },
    //
    // { path: routerConst.PRIMARY_MAIN,        element: <PrimaryMainContainer />,    label: 'Primary Main', },
    // { path: routerConst.PRIMARY_STATUS,      element: <PrimaryStatusContainer />,  label: 'Primary Status', },
    // { path: routerConst.PRIMARY_REGIST,      element: <PrimaryRegistContainer />,  label: 'Primary Registration', },
    //
    { path: routerConst.CANDIDATE_REGIST,   element: <CandidateRegistContainer />,  label: 'Candidate Registration', },
    { path: routerConst.CANDIDATE_STATUS,   element: <CandidateStatusContainer />,  label: 'Candidate Status', },
];
