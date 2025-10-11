import { useState } from 'react';
import { useAppEnvStore } from '../../appmain/app.env';
import { ApiTestResult } from './api.test.result';
import { ApiList } from './api.test.list';
import { Select } from '@mui/material';

export interface ApiServerProps {
    label: string;
    apiServer: string | undefined;
    apis: Array<{
        method?: string;
        label?: string;
        href?: string;
        path?: string;
        params?: any[];
    }>;
}

export const ApiTest = () => {
    const env = useAppEnvStore(state => state.env);

    const [result, setResult] = useState<string>('');

    const serverOptions = [
        { label: 'Java', url: env.apps?.urlApiServerJava },
        { label: 'Nest', url: env.apps?.urlApiServerNest },
    ].filter(s => !!s.url);
    const [selectedServerIdx, setSelectedServerIdx] = useState(0);

    if (serverOptions.length === 0 || !serverOptions[selectedServerIdx]) {
        return <div>No API server information available.</div>;
    }
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start', justifyContent: 'flex-start', width: '1024px', height: '100%', }}>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f0f0f0', marginBottom: 0, width: '100%', height: '50px' }}>
                <h2 style={{ margin: 0, textAlign: 'center', flex: 1 }}>API Test</h2>
                <Select
                    style={{ marginLeft: 16, fontSize: 16, padding: '4px 8px' }}
                    value={selectedServerIdx}
                    onChange={e => setSelectedServerIdx(Number(e.target.value))}
                >
                    {serverOptions.map((s, idx) => (
                        <option key={s.label} value={idx}>{s.label} ({s.url})</option>
                    ))}
                </Select>
            </div>
            <div style={{ display: 'flex', gap: '10px', width: '100%', alignItems: 'flex-start' }}>
                {/* left api table */}
                <div style={{ width: '500px', height: 'calc(100vh - 70px)', overflow: 'hidden', backgroundColor: '#eee' }}>
                    <ApiList label={serverOptions[selectedServerIdx].label} apiServer={serverOptions[selectedServerIdx].url} setResult={setResult} />
                </div>
                {/* right api result */}
                <div style={{ flex: 1, width: '100%', height: 'calc(100vh - 70px)', overflow: 'hidden', backgroundColor: '#eee' }}>
                    <ApiTestResult path={''} params={[]} result={result} />
                </div>
            </div>
        </div>
    );

};
