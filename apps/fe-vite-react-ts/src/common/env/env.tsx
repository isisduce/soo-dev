import { useEffect } from 'react';
import { create } from 'zustand';

export interface Env {
    global: {
        mode?: string;
        hostname?: string;
    };
}

export const defaultEnv: Env = {
    global: {
        mode: import.meta.env.NODE || 'dev',
        hostname: import.meta.env.HOSTNAME || 'localhost',
    },
};

type EnvStore = {
    env: Env;
    setEnv: (env: Env) => void;
};

export const useEnvStore = create<EnvStore>((set) => ({
    env: defaultEnv,
    setEnv: (env: Env) => set((state) => ({ ...state, env })),
}));

export const Env = {
    ReadEnv: async (envJsonPathname: string): Promise<Env | undefined> => {
        try {
            const response = await fetch(envJsonPathname);
            if (!response.ok) {
                throw new Error(`[${envJsonPathname}] does not exist.`);
            }
            const json = await response.json();
            return json;
        } catch (e) {
            console.warn('Using default environment configuration: ', e);
            return undefined;
        }
    },

    useInitEnv: (envJsonPathname: string): Env => {
        const env = useEnvStore((state) => state.env);
        const setEnv = useEnvStore((state) => state.setEnv);
        useEffect(() => {
            const getEnvJson = async () => {
                const newEnv = await Env.ReadEnv(envJsonPathname);
                if (newEnv) {
                    setEnv(newEnv);
                }
            };
            getEnvJson();
        }, [setEnv, envJsonPathname]);
        return env as Env;
    },
};