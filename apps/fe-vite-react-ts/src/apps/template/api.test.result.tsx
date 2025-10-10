export interface ApiTestResultProps {
    path: string;
    params: string[];
    result: string;
    bgColor?: string;
}

export const ApiTestResult = (props: ApiTestResultProps) => {
    const { result, bgColor = '#fff' } = props;

    return (
        <div style={{ flex: 1, gap: '10px', padding: 0, width: '100%', height: '100%', backgroundColor: bgColor }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', backgroundColor: '#bbb', height: 30, padding: '4px 8px' }}>
                <h4 style={{ margin: 0, textAlign: 'left', width: '100%', fontSize: 16, display: 'inline-block' }}>API Result</h4>
                <a
                    href="#"
                    title="결과 복사"
                    style={{ marginLeft: 8, textDecoration: 'none', cursor: 'pointer', fontSize: 14, verticalAlign: 'middle', color: '#1976d2', display: 'inline-flex', alignItems: 'center' }}
                    onClick={e => {
                        e.preventDefault();
                        if (result) navigator.clipboard.writeText(result);
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="gray" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </a>
            </div>
            <div style={{ flex: 1, width: '100%', overflow: 'auto', height: '100%' }}>
                <pre style={{ textAlign: 'left', whiteSpace: 'pre-wrap', margin: 0 }}>{result}</pre>
            </div>
        </div>
    );

};
