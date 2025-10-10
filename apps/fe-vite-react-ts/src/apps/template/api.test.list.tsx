import { useState, useEffect } from 'react';

export interface ApiListProps {
    label: string;
    apiServer: string | undefined;
    setResult?: (result: string) => void;
    width?: number | string;
    height?: number | string;
    bgColor?: string;
}

export const ApiList = (props: ApiListProps) => {
    const { label, apiServer, setResult, width, height, bgColor = '#fff' } = props;

    const styleWidth = typeof width === 'number' ? `${width}px` : width || '500px';
    const styleHeight = typeof height === 'number' ? `${height}px` : height || '100%';

    const [apiList, setApiList] = useState<Array<{ method: string; path: string; label: string; params: any[]; description?: string }>>([]);

    const testApi = async (api: string, method: string = 'GET') => {
        try {
            const options: RequestInit = { method };

            if (method.toUpperCase() !== 'GET') {
                options.headers = {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                };
                options.body = JSON.stringify({});
            }

            const res = await fetch(`${api}`, options);

            if (!res.ok) {
                const errorText = await res.text();
                setResult?.(`Error ${res.status}: ${res.statusText}\n${errorText}`);
                return;
            }

            const contentType = res.headers.get('content-type');
            let data;

            if (contentType && contentType.includes('application/json')) {
                data = await res.json();
            } else {
                data = await res.text();
            }

            setResult?.(typeof data === 'string' ? data : JSON.stringify(data, null, 2));
        } catch (e) {
            setResult?.('Network Error: ' + e);
        }
    };

    useEffect(() => {
        const fetchApiList = async () => {
            if (!apiServer) return;
            try {
                const res = await fetch(`${apiServer}/api/api-list`);
                const data = await res.json();
                setApiList(data);
            } catch (error) {
                console.error('Error fetching API list:', error);
            }
        };
        fetchApiList();
    }, [apiServer]);

    // API Description show/hide
    const [showApiDesc, setShowApiDesc] = useState<Record<string, boolean>>({});
    const toggleApiDesc = (apiKey: string) => {
        setShowApiDesc(prev => ({ ...prev, [apiKey]: !prev[apiKey] }));
    };
    // Param desc show/hide
    const [showParamDesc, setShowParamDesc] = useState<Record<string, Record<string, boolean>>>({});
    const toggleParamDesc = (apiKey: string, paramName: string) => {
        setShowParamDesc(prev => ({
            ...prev,
            [apiKey]: {
                ...(prev[apiKey] || {}),
                [paramName]: !prev[apiKey]?.[paramName]
            }
        }));
    };

    // API Parameters show/hide
    const [showApiParam, setShowApiParam] = useState<Record<string, boolean>>({});
    const toggleApiParam = (apiKey: string) => {
        setShowApiParam(prev => ({ ...prev, [apiKey]: !prev[apiKey] }));
    };

    // 파라미터 입력 상태 관리
    const [paramInputs, setParamInputs] = useState<Record<string, Record<string, string>>>({});

    // 파라미터 입력값 변경 핸들러
    const handleParamChange = (apiKey: string, paramName: string, value: string) => {
        setParamInputs(prev => ({
            ...prev,
            [apiKey]: {
                ...(prev[apiKey] || {}),
                [paramName]: value
            }
        }));
    };

    // params 배열을 name이 있는 객체 배열로 변환
    const normalizeParams = (params: any[], idxPrefix = '') =>
        params.map((p, idx) =>
            typeof p === 'string'
                ? { name: p }
                : p && typeof p === 'object' && p.name
                    ? p
                    : { ...p, name: p.name || `param${idxPrefix}${idx + 1}` }
        );

    // 파라미터가 있는 API 호출
    const testApiWithParams = async (api: any, apiServer?: string, method?: string) => {
        const actualMethod = method || api.method || 'GET';
        const apiKey = `${apiServer}${api.method}_${api.path}`;
        let url = apiServer + (api.path || api.label);
        let options: RequestInit = { method: actualMethod };
        const paramObj = paramInputs[apiKey] || {};
        // params name 필드 체크
        if (api.params && Array.isArray(api.params)) {
            api.params.forEach((p: any) => {
                if (!p.name) {
                    // eslint-disable-next-line no-console
                    console.warn('params 배열에 name 필드가 없습니다:', p);
                }
            });
        }
        if (actualMethod.toUpperCase() === 'GET') {
            const query = Object.entries(paramObj)
                .filter(([_, v]) => v !== undefined && v !== '')
                .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
                .join('&');
            if (query) url += (url.includes('?') ? '&' : '?') + query;
        } else {
            // POST, PUT, DELETE 등 요청 시 headers와 body 설정
            options.headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };
            options.body = JSON.stringify(paramObj);
        }
        // 호출 직전 콘솔 출력
        // eslint-disable-next-line no-console
        console.log('API 호출', { url, options, paramObj });
        try {
            const res = await fetch(url, options);

            // 응답 상태 체크
            if (!res.ok) {
                const errorText = await res.text();
                setResult?.(`Error ${res.status}: ${res.statusText}\n${errorText}`);
                return;
            }

            const contentType = res.headers.get('content-type');
            let data;

            if (contentType && contentType.includes('application/json')) {
                data = await res.json();
            } else {
                data = await res.text();
            }

            setResult?.(typeof data === 'string' ? data : JSON.stringify(data, null, 2));
        } catch (e) {
            setResult?.('Network Error: ' + e);
        }
    };

    return (
        <div style={{ padding: 0, width: styleWidth, height: styleHeight, backgroundColor: bgColor, display: 'flex', flexDirection: 'column' }}>
            <div key={label} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', height: 30, padding: '4px 8px', backgroundColor: '#bbb' }}>
                    <h4 style={{ margin: 0, textAlign: 'left', width: '100%', fontSize: 16 }}>{label + ` (${apiServer})`}</h4>
                </div>
                <div style={{ flex: 1, width: '100%', height: `calc(${styleHeight} - 30px)`, overflow: 'auto', backgroundColor: bgColor }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 8 }}>
                        <thead>
                            <tr style={{ background: '#ddd' }}>
                                <th style={{ fontSize: 12, fontWeight: 'bold', width: 1, border: '1px solid #ddd', padding: 4 }}>method</th>
                                <th style={{ fontSize: 12, fontWeight: 'bold', width: 1, border: '1px solid #ddd', padding: 4 }}>desc</th>
                                <th style={{ fontSize: 12, fontWeight: 'bold', width: 300, border: '1px solid #ddd', padding: 4 }}>path</th>
                                <th style={{ fontSize: 12, fontWeight: 'bold', width: 1, border: '1px solid #ddd', padding: 4 }}>run</th>
                            </tr>
                        </thead>
                        <tbody>
                            {apiList.flatMap(api => {
                                const apiInfo = apiList.find(a => a.path === api.path && a.method === api.method);
                                const params = normalizeParams(apiInfo?.params || [], api.label);
                                const apiKey = `${apiServer}${api.method}_${api.path}`;
                                const rowKey = `${api.method}_${api.path}`;
                                const rows = [
                                    <tr key={rowKey} style={{ background: bgColor }}>
                                        <td style={{ fontSize: 14, fontWeight: 'bold', border: '1px solid #ddd', padding: 4, textAlign: 'center' }}>{api.method || 'GET'}</td>
                                        <td style={{ fontSize: 11, border: '1px solid #ddd', width: 30, padding: 0, textAlign: 'center' }}>
                                            <a
                                                href="#"
                                                style={{
                                                    fontSize: 11,
                                                    marginRight: 0,
                                                    padding: 0,
                                                    color: !apiInfo?.description ? '#aaa' : '#007bff',
                                                    cursor: !apiInfo?.description ? 'not-allowed' : 'pointer',
                                                    pointerEvents: !apiInfo?.description ? 'none' : 'auto',
                                                    fontWeight: showApiDesc[apiKey] ? 'bold' : 'normal'
                                                }}
                                                onClick={e => {
                                                    e.preventDefault();
                                                    if (apiInfo?.description) toggleApiDesc(apiKey);
                                                }}
                                                aria-disabled={!apiInfo?.description}
                                            >desc</a>
                                        </td>
                                        <td style={{ fontSize: 12, fontWeight: 'inherit', border: '1px solid #ddd', padding: 4, fontFamily: 'monospace', textAlign: 'left' }}>
                                            <div>
                                                <span
                                                    style={{ cursor: 'pointer', color: 'inherit', textDecoration: 'none', fontWeight: 'bold' }}
                                                    title="경로 복사"
                                                    onClick={() => navigator.clipboard.writeText(api.path)}
                                                >
                                                    {api.path}
                                                </span>
                                                <a
                                                    href="#"
                                                    style={{
                                                        fontSize: 12,
                                                        marginLeft: 8,
                                                        color: !(Array.isArray(params) && params.length > 0) ? '#aaa' : '#007bff',
                                                        cursor: !(Array.isArray(params) && params.length > 0) ? 'not-allowed' : 'pointer',
                                                        pointerEvents: !(Array.isArray(params) && params.length > 0) ? 'none' : 'auto',
                                                        fontWeight: showApiParam[apiKey] ? 'bold' : 'normal'
                                                    }}
                                                    onClick={e => {
                                                        e.preventDefault();
                                                        toggleApiParam(apiKey);
                                                    }}
                                                    aria-disabled={!(Array.isArray(params) && params.length > 0)}
                                                >params</a>
                                            </div>
                                            {showApiDesc[apiKey] && apiInfo?.description && (
                                                <div style={{ fontSize: 11, color: '#666', padding: '0 0 0 10px', marginTop: 4, textAlign: 'left' }}>
                                                    {apiInfo.description}
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ border: '1px solid #ddd', padding: 4, textAlign: 'center' }}>
                                            <a
                                                href="#"
                                                style={{
                                                    fontSize: 12,
                                                    color: '#007bff',
                                                    cursor: 'pointer',
                                                    fontWeight: 'bold'
                                                }}
                                                onClick={e => {
                                                    e.preventDefault();
                                                    if (params.length > 0) {
                                                        if (showApiParam[apiKey]) {
                                                            testApiWithParams(api, apiServer, api.method);
                                                        } else {
                                                            toggleApiParam(apiKey);
                                                        }
                                                    } else {
                                                        testApi(apiServer + (api.path || api.label), api.method || 'GET');
                                                    }
                                                }}
                                            >run</a>
                                        </td>
                                    </tr>
                                ];
                                if (showApiParam[apiKey] && params.length > 0) {
                                    rows.push(
                                        <tr key={rowKey + '_params'} style={{ background: bgColor }}>
                                            <td style={{ border: '1px solid #ddd', padding: 0, background: bgColor }}></td>
                                            <td colSpan={3} style={{ border: '1px solid #ddd', padding: 0, background: bgColor }}>
                                                <form style={{ margin: 0 }}
                                                    onSubmit={e => {
                                                        e.preventDefault();
                                                        testApiWithParams(api, apiServer, api.method);
                                                    }}
                                                >
                                                    <table style={{ width: '100%' }}>
                                                        <tbody>
                                                            {params.map((param, i) => [
                                                                <tr key={rowKey + '_param_' + i}>
                                                                    <td style={{ fontSize: 11, border: '1px solid #fff', width: '30px', textAlign: 'center' }}>
                                                                        <a
                                                                            href="#"
                                                                            style={{
                                                                                fontSize: 11,
                                                                                marginLeft: 0,
                                                                                color: !param?.description ? '#aaa' : '#007bff',
                                                                                cursor: !param?.description ? 'not-allowed' : 'pointer',
                                                                                pointerEvents: !param?.description ? 'none' : 'auto',
                                                                                fontWeight: showParamDesc[apiKey]?.[param.name] ? 'bold' : 'normal',
                                                                            }}
                                                                            onClick={e => {
                                                                                e.preventDefault();
                                                                                toggleParamDesc(apiKey, param.name);
                                                                            }}
                                                                            aria-disabled={!param.description}
                                                                        >desc</a>
                                                                    </td>
                                                                    <td style={{ fontSize: 12, border: '1px solid #fff', padding: '0px', width: '100px', textAlign: 'left' }}>
                                                                        {param.required ? <span style={{ color: 'red', marginRight: 2 }}>*</span> : null}
                                                                        <b>{param.name}</b>
                                                                    </td>
                                                                    <td style={{ fontSize: 12, border: '1px solid #fff', padding: '0px', width: '70px', textAlign: 'right' }}>
                                                                        {param.type ? ` (${param.type})` : ''}
                                                                    </td>
                                                                    <td style={{ fontSize: 12, border: '1px solid #fff', padding: '4px', }}>
                                                                        {param.type === 'boolean' ? (
                                                                            <select
                                                                                value={
                                                                                    paramInputs[apiKey]?.[param.name] !== undefined
                                                                                        ? paramInputs[apiKey][param.name]
                                                                                        : (param.defaultValue ?? 'false')
                                                                                }
                                                                                onChange={e => handleParamChange(apiKey, param.name, e.target.value)}
                                                                                style={{ width: '100%' }}
                                                                            >
                                                                                <option value="true">true</option>
                                                                                <option value="false">false</option>
                                                                            </select>
                                                                        ) : (
                                                                            <input
                                                                                type="text"
                                                                                value={
                                                                                    paramInputs[apiKey]?.[param.name] !== undefined
                                                                                        ? paramInputs[apiKey][param.name]
                                                                                        : (param.defaultValue ?? '')
                                                                                }
                                                                                onChange={e => handleParamChange(apiKey, param.name, e.target.value)}
                                                                                style={{ width: '100%' }}
                                                                            />
                                                                        )}
                                                                    </td>
                                                                </tr>,
                                                                param.description && showParamDesc[apiKey]?.[param.name] ? (
                                                                    <tr key={rowKey + '_paramdesc_' + i}>
                                                                        <td></td>
                                                                        <td colSpan={3} style={{ fontSize: 11, color: '#666', padding: '2px 4px 8px 4px', textAlign: 'left' }}>
                                                                            {param.description}
                                                                        </td>
                                                                    </tr>
                                                                ) : null
                                                            ])}
                                                        </tbody>
                                                    </table>
                                                </form>
                                            </td>
                                        </tr>
                                    );
                                }
                                return rows;
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

};
