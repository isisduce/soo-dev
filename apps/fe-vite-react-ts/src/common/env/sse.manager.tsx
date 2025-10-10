import { create } from 'zustand';

type SseManagerStore = {
    eventSource: EventSource | null;
    isConnected: boolean;
    subscribers: Map<string, (eventData: string) => void>;
    connect: (url: string) => void;
    disconnect: () => void;
    subscribe: (id: string, callback: (eventData: string) => void) => void;
    unsubscribe: (id: string) => void;
};

const logging = false;

export const useSseManagerStore = create<SseManagerStore>((set, get) => ({

    eventSource: null,
    isConnected: false,
    subscribers: new Map(),

    connect: (url: string) => {
        const { eventSource, isConnected } = get();

        if (eventSource && isConnected) {
            logging && console.log('SSE already connected, skipping duplicate connection');
            return;
        }

        logging && console.log('Creating SSE connection to:', url);

        const newEventSource = new EventSource(url);

        newEventSource.onopen = () => {
            logging && console.log('Global SSE connection opened successfully');
            set({ isConnected: true });
        };

        newEventSource.onmessage = (event) => {
            logging && console.log('Global SSE message received:', event.data);

            // 모든 구독자에게 이벤트 전파
            const { subscribers } = get();
            subscribers.forEach((callback) => {
                try {
                    callback(event.data);
                } catch (error) {
                    logging && console.error('Error in SSE subscriber callback:', error);
                }
            });
        };

        newEventSource.onerror = (error) => {
            logging && console.error('Global SSE connection error:', error);
            logging && console.error('Global SSE readyState:', newEventSource.readyState);
            set({ isConnected: false });
        };

        set({ eventSource: newEventSource });
    },

    disconnect: () => {
        const { eventSource } = get();
        if (eventSource) {
            logging && console.log('Closing global SSE connection');
            eventSource.close();
            set({ eventSource: null, isConnected: false });
        }
    },

    subscribe: (id: string, callback: (eventData: string) => void) => {
        const { subscribers } = get();
        logging && console.log(`Subscribing ${id} to SSE events`);
        subscribers.set(id, callback);
        set({ subscribers: new Map(subscribers) });
    },

    unsubscribe: (id: string) => {
        const { subscribers } = get();
        logging && console.log(`Unsubscribing ${id} from SSE events`);
        subscribers.delete(id);
        set({ subscribers: new Map(subscribers) });
    },
}));

export const SseManager = {
    connect: (url: string) => useSseManagerStore.getState().connect(url),
    disconnect: () => useSseManagerStore.getState().disconnect(),
    subscribe: (id: string, callback: (eventData: string) => void) =>
        useSseManagerStore.getState().subscribe(id, callback),
    unsubscribe: (id: string) => useSseManagerStore.getState().unsubscribe(id),
};