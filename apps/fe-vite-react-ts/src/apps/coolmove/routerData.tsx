import type { RouterData } from '../../common/router/router.data';
import { CoolmovePage } from './coolmove.page';
import { LoginContainer } from './login/login.container';
import { CandidateRegistContainer } from './candidate/candidate.regist.container';
import { CandidateStatusContainer } from './candidate/candidate.status.container';
import { PledgeMain } from './candidate/pledge.main';

export const routerConst = {
    BASE: '/coolmove',
    LOGIN: '/coolmove/login',
    PLEDGE_MAIN: '/coolmove/main',
    PLEDGE_STATUS: '/coolmove/pledge',
    PLEDGE_REGIST: '/coolmove/pledge/regist',
    PRIMARY_STATUS: '/coolmove/primary',
    PRIMARY_REGIST: '/coolmove/primary/regist',
    CANDIDATE_REGIST: '/coolmove/candidate/regist',
    CANDIDATE_STATUS: '/coolmove/candidate/status',
};

export const routerData: RouterData[] = [
    { path: routerConst.BASE,               element: <CoolmovePage />,              label: 'Coolmove', },
    { path: routerConst.LOGIN,              element: <LoginContainer />,            label: 'Login', },
    //
    { path: routerConst.PLEDGE_MAIN,        element: <PledgeMain />,      label: 'Pledge Main', },
    // { path: routerConst.PLEDGE_STATUS,      element: <PledgeStatusContainer />,  label: 'Pledge Status', },
    // { path: routerConst.PLEDGE_REGIST,      element: <PledgeRegistContainer />,  label: 'Pledge Registration', },
    //
    // { path: routerConst.PRIMARY_STATUS,      element: <PrimaryStatusContainer />,  label: 'Primary Status', },
    // { path: routerConst.PRIMARY_REGIST,      element: <PrimaryRegistContainer />,  label: 'Primary Registration', },
    //
    { path: routerConst.CANDIDATE_REGIST,   element: <CandidateRegistContainer />,  label: 'Candidate Registration', },
    { path: routerConst.CANDIDATE_STATUS,   element: <CandidateStatusContainer />,  label: 'Candidate Status', },
];
