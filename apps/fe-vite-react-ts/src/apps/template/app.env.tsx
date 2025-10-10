import { useEffect } from 'react';
import { create } from 'zustand';
import { defaultEnv, Env } from '../../common/env/env';
import { UrlHelper } from '../../common/helper/url.helper';

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
};

export const useAppEnvStore = create<AppEnvStore>((set: (fn: (state: AppEnvStore) => AppEnvStore) => void) => ({
    env: defaultEnv,
    setEnv: (env: AppEnv) => set((state) => ({ ...state, env })),
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
        useEffect(() => {
            const getEnvJson = async () => {
                const newEnv = await AppEnv.readEnv(envJsonPathname);
                setEnv(newEnv);
            };
            getEnvJson();
        }, [setEnv, envJsonPathname]);
        return env as AppEnv;
    }

}
