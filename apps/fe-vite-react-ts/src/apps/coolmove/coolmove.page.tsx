import React, {  } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { shallow } from 'zustand/shallow';
import './coolmove.page.css';
import { routerData as cmvRouterData } from './routerData';
import { useAppEnvStore } from '../../appmain/app.env';
import { coolmoveApi } from './api/coolmove.api';

export const CoolmovePage: React.FC = () => {

    const env = useAppEnvStore((state) => state.env);
    const appServer = env.apps?.urlApiServerJava || '';

    const { envChanged, envChangeMessage } = useAppEnvStore((state) => ({
        envChanged: state.envChanged,
        envChangeMessage: state.envChangeMessage,
    }), shallow);

    return (
        <Box className="coolmove-page">
            <h1>Coolmove</h1>
            {envChanged && (
                <div className="coolmove-notice">
                    {envChangeMessage}
                </div>
            )}
            <Box className="coolmove-btn-group-outer">
                {cmvRouterData.map(router => (
                    router.label &&
                    <Link key={router.path} to={router.path} style={{ display: 'block', margin: '8px 0' }}>
                        {router.label}
                    </Link>
                ))}
            </Box>
            <Box>
                <Button
                    style={{ marginRight: '16px' }}
                    onClick={() => { coolmoveApi.createTables(appServer); }}
                >
                    Create Tables
                </Button>
                <Button
                    onClick={() => { coolmoveApi.dropTables(appServer); }}
                >
                    Drop Tables
                </Button>
            </Box>
        </Box>
    );
};
