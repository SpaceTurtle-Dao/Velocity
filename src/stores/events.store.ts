import { writable } from 'svelte/store';
import type { Event } from "$lib/models/Event";

// Example post event
let event1: Event = {
    id: "8f4e867bcf2c4a63944c2c04bbd28be3",
    pubkey: "a3b35fe237529f80798e4a5c4f6d12be",
    created_at: 1684312352,
    kind: 1, // Normal post
    content: "Check out this cool video about Svelte!",
    tags: [
        ["title", "Svelte Introduction"],
        ["thumb", "https://arweave.net/Ov0Xea2kWa5GS1DCEmeF0aoct8rbJwDmizmTo9bQrtY"],
        ["published_at", "1684312352"],
        ["url", "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"],
        ["m", "video/mp4"],
        ["size", "1048576"],
        ["duration", "180"],
        ["dim", "1280x720"]
    ]
};

//  repost event
let repostEvent: Event = {
    id: "repost123",
    pubkey: "repostuser456",
    created_at: 1685312452,
    kind: 6, // Repost
    content: "Reposting Something Cool",
    tags: [
        ["e", "8f4e867bcf2c4a63944c2c04bbd28be3"], // Reference to event1's ID
        ["p", "a3b35fe237529f80798e4a5c4f6d12be"], // Reference to event1's pubkey
        ["market_cap", "12000000"],
        ["liquidity", "1000000"],
        ["buys", "350"],
        ["holders", "1500"],
        ["replies", "50"],
        ["token_id", "token_789"]
    ]
};

interface EventStore {
    events: Event[];
    loading: boolean;
    error: string | null;
}

const initialState: EventStore = {
    events: [event1, repostEvent], // Add both post and repost
    loading: false,
    error: null,
};

// Create the store
function createEventStore() {
    const { subscribe, set, update } = writable<EventStore>(initialState);

    return {
        subscribe,

        addEvent: (event: Event) => update(state => ({
            ...state,
            events: [...state.events, event]
        })),

        setEvents: (events: Event[]) => update(state => ({
            ...state,
            events
        })),

        removeEvent: (id: string) => update(state => ({
            ...state,
            events: state.events.filter(event => event.id !== id)
        })),

        setLoading: (loading: boolean) => update(state => ({
            ...state,
            loading
        })),

        setError: (error: string | null) => update(state => ({
            ...state,
            error
        })),

        clearEvents: () => update(state => ({
            ...state,
            events: []
        })),

        reset: () => set(initialState)
    };
}

// Export the store
export const eventStore = createEventStore();
