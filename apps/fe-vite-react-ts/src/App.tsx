import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { AppEnv } from './appmain/app.env';
import { routerData as apiRouterData } from './apps/api/routerData';
import { routerData as cmvRouterData } from './apps/coolmove/routerData';
import { routerData as wfsRouterData } from './apps/webfilesystem/routerData';

function Home() {
    const [count, setCount] = useState(0);
    return (
        <>
            <div>
                <a href="https://vite.dev" target="_blank" rel="noopener">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank" rel="noopener">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
            {apiRouterData.map(router => (
                router.label &&
                <Link key={router.path} to={router.path} style={{ display: 'block', margin: '8px 0' }}>
                    {router.label}
                </Link>
            ))}
            {cmvRouterData.map(router => (
                router.label &&
                <Link key={router.path} to={router.path} style={{ display: 'block', margin: '8px 0' }}>
                    {router.label}
                </Link>
            ))}
            {wfsRouterData.map(router => (
                router.label &&
                <Link key={router.path} to={router.path} style={{ display: 'block', margin: '8px 0' }}>
                    {router.label}
                </Link>
            ))}
        </>
    );
}

function App() {
    AppEnv.useInitEnv('/config/env.json');
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                {apiRouterData.map(router => (
                    <Route key={router.path} path={router.path} element={router.element} />
                ))}
                {cmvRouterData.map(router => (
                    <Route key={router.path} path={router.path} element={router.element} />
                ))}
                {wfsRouterData.map(router => (
                    <Route key={router.path} path={router.path} element={router.element} />
                ))}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
