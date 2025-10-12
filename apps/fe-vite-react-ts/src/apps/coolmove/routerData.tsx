import type { RouterData } from '../../common/router/router.data';
import { CoolmovePage } from './coolmove.page';
import { LoginContainer } from './login/login.container';
import { CandidateRegistContainer } from './candidate/candidate.regist.container';
import { CandidateStatusContainer } from './candidate/candidate.status.container';
import { routerConst } from './routerConst';

export const routerData: RouterData[] = [
    { path: routerConst.BASE,               element: <CoolmovePage />,              label: 'Coolmove', },
    { path: routerConst.LOGIN,              element: <LoginContainer />,            label: 'Login', },
    { path: routerConst.CANDIDATE_REGIST,   element: <CandidateRegistContainer />,  label: 'Candidate Registration', },
    { path: routerConst.CANDIDATE_STATUS,   element: <CandidateStatusContainer />,  label: 'Candidate Status', },
];
