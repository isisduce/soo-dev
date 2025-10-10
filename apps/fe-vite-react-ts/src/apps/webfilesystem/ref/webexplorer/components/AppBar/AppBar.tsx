import React, { useState } from 'react';
import './AppBar.css';

interface AppBarProps {
    onViewVersion: (version: 'current' | 'previous') => void;
    onOpenInDialog: (version: 'current' | 'previous') => void;
}

export const AppBar: React.FC<AppBarProps> = ({
    onViewVersion,
    onOpenInDialog
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleMenuAction = (action: () => void) => {
        action();
        setIsMenuOpen(false);
    };

    return (
        <div className="app-bar">
            <div className="app-bar-content">
                <div className="app-bar-left">
                    <h1 className="app-title">웹 파일 탐색기</h1>
                </div>

                <div className="app-bar-center">
                    <button
                        className="version-button current"
                        onClick={() => onViewVersion('current')}
                    >
                        현재 버전
                    </button>
                    <button
                        className="version-button previous"
                        onClick={() => onViewVersion('previous')}
                    >
                        이전 버전
                    </button>
                </div>

                <div className="app-bar-right">
                    <div className="menu-container">
                        <button
                            className="menu-button"
                            onClick={toggleMenu}
                            aria-label="메뉴"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                            </svg>
                        </button>

                        {isMenuOpen && (
                            <div className="menu-dropdown">
                                <div className="menu-section">
                                    <div className="menu-section-title">버전 보기</div>
                                    <button
                                        className="menu-item"
                                        onClick={() => handleMenuAction(() => onViewVersion('current'))}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                        </svg>
                                        현재 버전으로 전환
                                    </button>
                                    <button
                                        className="menu-item"
                                        onClick={() => handleMenuAction(() => onViewVersion('previous'))}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
                                        </svg>
                                        이전 버전으로 전환
                                    </button>
                                </div>

                                <div className="menu-divider"></div>

                                <div className="menu-section">
                                    <div className="menu-section-title">새 창으로 열기</div>
                                    <button
                                        className="menu-item"
                                        onClick={() => handleMenuAction(() => onOpenInDialog('current'))}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                                        </svg>
                                        새 현재 버전 창
                                    </button>
                                    <button
                                        className="menu-item"
                                        onClick={() => handleMenuAction(() => onOpenInDialog('previous'))}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                                        </svg>
                                        새 이전 버전 창
                                    </button>
                                </div>

                                <div className="menu-divider"></div>

                                <div className="menu-section">
                                    <div className="menu-section-title">다이얼로그로 열기</div>
                                    <button
                                        className="menu-item"
                                        onClick={() => handleMenuAction(() => onOpenInDialog('current'))}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                                        </svg>
                                        현재 버전 다이얼로그
                                    </button>
                                    <button
                                        className="menu-item"
                                        onClick={() => handleMenuAction(() => onOpenInDialog('previous'))}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                                        </svg>
                                        이전 버전 다이얼로그
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
