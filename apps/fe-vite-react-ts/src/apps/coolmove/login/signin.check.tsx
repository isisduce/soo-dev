import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { routerConst } from '../routerData';

export const signinCheck = (): boolean => {

    const navigate = useNavigate();
    const userid = localStorage.getItem('userid') || '';
    const token = localStorage.getItem('token') || 'token';

    useEffect(() => {
        const signin = !!userid && !!token;
        if (!signin) {
            navigate(routerConst.LOGIN);
        }
    }, [navigate, userid, token]);

    return true;

};