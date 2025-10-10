import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { templateRoutes } from './apps/template/router.data';
import { AppEnv as TemplateEnv } from './apps/template/app.env';
import { webFileSystemRoutes } from './apps/webfilesystem/web.filesystem.routes';
import { AppEnv as WebExplorerEnv } from './apps/webfilesystem/app.env';

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
            {templateRoutes.map(route => (
                <Link key={route.path} to={route.path} style={{ display: 'block', margin: '8px 0' }}>
                    {route.label}
                </Link>
            ))}
            {webFileSystemRoutes.map(route => (
                <Link key={route.path} to={route.path} style={{ display: 'block', margin: '8px 0' }}>
                    {route.label}
                </Link>
            ))}
        </>
    );
}

function App() {
    TemplateEnv.useInitEnv('/config/env.json');
    WebExplorerEnv.useInitEnv('/config/env.json');
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                {templateRoutes.map(route => (
                    <Route key={route.path} path={route.path} element={route.element} />
                ))}
                {webFileSystemRoutes.map(route => (
                    <Route key={route.path} path={route.path} element={route.element} />
                ))}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
