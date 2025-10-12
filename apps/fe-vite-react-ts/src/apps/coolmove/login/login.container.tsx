import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginComponent } from './login.component'
import { useAppEnvStore } from '../../../appmain/app.env';
import { coolmoveApi } from '../api/coolmove.api';
import { routerConst } from '../routerConst';

export const LoginContainer: React.FC = () => {

    const navigate = useNavigate();

    const env = useAppEnvStore((state) => state.env);
    const apiServer = env.apps?.urlApiServerJava || '';

    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (userid: string, passwd: string, autoLogin: boolean) => {
        setIsLoading(true);
        setShowError(false);

        try {
            const response = await coolmoveApi.login(apiServer, userid, passwd);
            if (!response.success) {
                setShowError(true);
                setErrorMessage(response.message || '로그인에 실패했습니다.');
                setIsLoading(false);
                return;
            }
            // 임시 로그인 로직 (실제로는 API 호출)
            if (userid === 'admin' && passwd === 'password') {
                // 자동 로그인 설정
                if (autoLogin) {
                    localStorage.setItem('autoLogin', autoLogin.toString());
                    // localStorage.setItem('token', 'dummy-token');
                    localStorage.setItem('userid', userid);
                    localStorage.setItem('passwd', passwd);
                }

                // 매니저 메인으로 이동
                navigate(routerConst.CANDIDATE_STATUS);
            } else {
                setShowError(true);
                setErrorMessage('아이디 또는 비밀번호가 올바르지 않습니다.');
            }
        } catch (error) {
            setShowError(true);
            setErrorMessage('로그인 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswdChange = () => {
        // 비밀번호 변경 페이지로 이동
        console.log('비밀번호 변경 페이지로 이동');
    };

    const handleSignUp = () => {
        // 회원가입 페이지로 이동
        console.log('회원가입 페이지로 이동');
    };

    return (
        <LoginComponent
            onLogin={handleLogin}
            onPasswdChange={handlePasswdChange}
            onSignUp={handleSignUp}
            showError={showError}
            errorMessage={errorMessage}
            isLoading={isLoading}
        />
    );
};
