import React, { useState } from 'react';
import '../styles/css/reset.css';
import '../styles/css/font.css';
import '../styles/css/common.css';
import '../styles/css/main.css';
import loginLogoImg from '/styles/images/login-logo.svg';

interface LoginComponentProps {
    onLogin?: (username: string, password: string, autoLogin: boolean) => void;
    onPasswdChange?: () => void;
    onSignUp?: () => void;
    showError?: boolean;
    errorMessage?: string;
    isLoading?: boolean;
}

export const LoginComponent: React.FC<LoginComponentProps> = ({
    onLogin,
    onPasswdChange,
    onSignUp,
    showError = false,
    errorMessage = '',
    isLoading = false
}) => {
    const [userid, setUserid] = useState('admin');
    const [passwd, setPasswd] = useState('password');
    const [showPassword, setShowPassword] = useState(false);
    const [autoLogin, setAutoLogin] = useState(true);

    const handleUseridChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserid(e.target.value);
    };

    const handlePasswdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswd(e.target.value);
    };

    const togglePasswdVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleAutoLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAutoLogin(e.target.checked);
    };

    const handleLogin = () => {
        if (!userid || !passwd) {
            return;
        }
        onLogin?.(userid, passwd, autoLogin);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    const isLoginDisabled = !userid || !passwd || isLoading;

    return (
        <div className="login-wrap">
            <div className="login">
                <div className="logo">
                    <img src={loginLogoImg} alt="Cool Move" />
                </div>
                <div className="login-area">
                    <div>
                        <span>LOG IN</span>
                    </div>
                    <div className="login-input-group">
                        <div>
                            <input
                                type="text"
                                placeholder="아이디"
                                value={userid}
                                onChange={handleUseridChange}
                                onKeyDown={handleKeyDown}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="비밀번호"
                                value={passwd}
                                onChange={handlePasswdChange}
                                onKeyDown={handleKeyDown}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                className={`toggle-pw ${showPassword ? 'open-eye' : 'close-eye'}`}
                                title={showPassword ? '비밀번호 감추기' : '비밀번호 보이기'}
                                onClick={togglePasswdVisibility}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* 에러 메시지 */}
                    {showError && errorMessage && (
                        <div className="error-message">
                            {errorMessage}
                        </div>
                    )}

                    <button
                        type="button"
                        className="login-btn btn primary"
                        onClick={handleLogin}
                        disabled={isLoginDisabled}
                    >
                        {isLoading ? '로그인 중...' : '로그인'}
                    </button>

                    <div className="login-bottom">
                        <div className="auto-login">
                            <input
                                type="checkbox"
                                id="auto"
                                checked={autoLogin}
                                onChange={handleAutoLoginChange}
                                disabled={isLoading}
                            />
                            <label htmlFor="auto">자동 로그인</label>
                        </div>
                        <div>
                            <a href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onPasswdChange?.();
                                }}
                            >
                                비밀번호 변경
                            </a>
                            <a href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onSignUp?.();
                                }}
                            >
                                회원가입
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};