import { useEffect } from 'react';
import { createWithEqualityFn } from 'zustand/traditional';
import { defaultEnv, Env } from '../../libs/env/env';
import { UrlHelper } from '../../libs/helper/url.helper';
import { SseManager } from '../../libs/env/sse.manager';

export interface AppEnv extends Env {
    apps?: {
        appLang?: string;
        appTitle?: string;
        urlApiServerJava?: string;
        urlApiServerNest?: string;
        urlAppServer?: string;
        urlImgServer?: string;
    };
};

type AppEnvStore = {
    env: AppEnv;
    setEnv: (env: AppEnv) => void;
    envChanged: boolean;
    envChangeMessage: string | null;
    setEnvChanged: (changed: boolean, message?: string) => void;
};

export const useAppEnvStore = createWithEqualityFn<AppEnvStore>()((set: (fn: (state: AppEnvStore) => AppEnvStore) => void) => ({
    env: defaultEnv,
    setEnv: (env: AppEnv) => set((state) => ({ ...state, env })),
    envChanged: false,
    envChangeMessage: null,
    setEnvChanged: (changed: boolean, message?: string) => set((state) => {
        // 동일한 상태라면 업데이트하지 않음 (중복 방지)
        if (state.envChanged === changed && state.envChangeMessage === (message ?? null)) {
            // console.log('WebFileSystem Env: Skipping duplicate envChanged update');
            return state;
        }
        // console.log('Setting envChanged:', changed, 'message:', message);
        return {
            ...state,
            envChanged: changed,
            envChangeMessage: message ?? null,
        };
    }),
}));

export const AppEnv = {

    readEnv : async (envJsonPathname: string): Promise<AppEnv> => {
        const baseEnv = await Env.ReadEnv(envJsonPathname);
        const env = baseEnv as AppEnv;
        if (env.apps) {
            env.apps.urlApiServerJava = UrlHelper.ResolveUrl(env.apps.urlApiServerJava, env.global?.hostname);
            env.apps.urlApiServerNest = UrlHelper.ResolveUrl(env.apps.urlApiServerNest, env.global?.hostname);
            env.apps.urlAppServer = UrlHelper.ResolveUrl(env.apps.urlAppServer, env.global?.hostname);
            env.apps.urlImgServer = UrlHelper.ResolveUrl(env.apps.urlImgServer, env.global?.hostname);
        }
        return env;
    },

    useInitEnv : (envJsonPathname: string): AppEnv => {
        const env = useAppEnvStore((state: AppEnvStore) => state.env);
        const setEnv = useAppEnvStore((state: AppEnvStore) => state.setEnv);
        const setEnvChanged = useAppEnvStore((state: AppEnvStore) => state.setEnvChanged);
        useEffect(() => {
            const getEnvJson = async (fromSse = false) => {
                const newEnv = await AppEnv.readEnv(envJsonPathname);
                // console.log(`ENV loaded:`, newEnv);
                setEnv(newEnv);
                if (fromSse) {
                    // setEnvChanged(true, `ENV has been updated and the latest settings have been applied. (${new Date().toLocaleTimeString()})`);
                    setEnvChanged(true, undefined);
                    setTimeout(() => setEnvChanged(false), 5000); // 5초 후 알림 자동 해제
                }
            };

            // 초기 env.json 로드
            getEnvJson();
        }, [setEnv, envJsonPathname]);

        // SSE 연결을 위한 별도 useEffect
        useEffect(() => {
            const apiServerUrl = env.apps?.urlApiServerNest; // NestJS 서버로 변경
            if (!apiServerUrl) {
                // console.log('No NestJS API server URL available, skipping SSE setup');
                return;
            }

            // console.log('Setting up SSE connection to NestJS:', apiServerUrl);

            // 전역 SSE 연결 설정
            const feEnvAddr = `${apiServerUrl}/api/webfilesystem/fe/env/stream`;
            SseManager.connect(feEnvAddr);

            // Debounce를 위한 타이머
            let reloadTimer: number | null = null;

            const handleEnvReload = (eventData: string) => {
                if (eventData === 'connected') {
                    // console.log('ENV: SSE connection confirmed');
                    return;
                }

                if (eventData !== 'fe-env-updated') {
                    return;
                }

                // console.log('ENV: fe-env-updated event received');

                // 기존 타이머가 있으면 취소
                if (reloadTimer) {
                    clearTimeout(reloadTimer);
                }

                // 300ms 후에 실행 (debounce)
                reloadTimer = setTimeout(async () => {
                    try {
                        // console.log('WebFileSystem Env: Reloading env.json after debounce...');
                        const newEnv = await AppEnv.readEnv(envJsonPathname);
                        // console.log('WebFileSystem Env: Reloaded env.json:', newEnv);
                        setEnv(newEnv);
                        // setEnvChanged(true, `ENV has been updated and the latest settings have been applied. (${new Date().toLocaleTimeString()})`);
                        setEnvChanged(true, undefined);
                        setTimeout(() => setEnvChanged(false), 5000);
                    } catch (error) {
                        console.error('ENV: Error reloading env.json:', error);
                    }
                }, 300);
            };

            // 전역 SSE에 구독
            const subscriberId = `webfilesystem-env-${Date.now()}`;
            SseManager.subscribe(subscriberId, handleEnvReload);

            return () => {
                // console.log('ENVG: Cleaning up SSE subscription...');
                if (reloadTimer) {
                    clearTimeout(reloadTimer);
                }
                SseManager.unsubscribe(subscriberId);
            };
        }, [env.apps?.urlApiServerJava, setEnv, setEnvChanged, envJsonPathname]); // SSE 재연결 조건
        return env as AppEnv;
    }

}
