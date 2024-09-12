import { writable } from 'svelte/store';


export interface Event {
       id: string,
       pubkey: string,
       created_at: number,
       kind: number,
       tags: [
              [],
       ],
       content: "",
       sig: ""
}

// Define the structure of our event store
interface EventStore {
       events: Event[];
       loading: boolean;
       error: string | null;
}

// Create the initial state
const initialState: EventStore = {
       events: [],
       loading: false,
       error: null,
};



// Create the store
function createEventStore() {
       const { subscribe, set, update } = writable<EventStore>(initialState);

       return {
              subscribe,

              // Add a new event
              addEvent: (event: Event) => update(state => ({
                     ...state,
                     events: [...state.events, event]
              })),

              // Set multiple events (e.g., when fetching from a relay)
              setEvents: (events: Event[]) => update(state => ({
                     ...state,
                     events
              })),

              // Remove an event by its ID
              removeEvent: (id: string) => update(state => ({
                     ...state,
                     events: state.events.filter(event => event.id !== id)
              })),

              // Set loading state
              setLoading: (loading: boolean) => update(state => ({
                     ...state,
                     loading
              })),

              // Set error state
              setError: (error: string | null) => update(state => ({
                     ...state,
                     error
              })),

              // Clear all events
              clearEvents: () => update(state => ({
                     ...state,
                     events: []
              })),

              // Reset the store to its initial state
              reset: () => set(initialState)
       };
}

// Export the store
export const eventStore = createEventStore();