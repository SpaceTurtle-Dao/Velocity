import { get, writable, type Readable } from "svelte/store";
import { fetchEvents } from "$lib/ao/relay";


export interface MyPostStore extends Readable<Array<any>> {
  fetch: () => Promise<void>;
}


const initMyPostsStore = (): MyPostStore => {
  const { subscribe, set } = writable<Array<any>>([]);
    return {
      subscribe,
      fetch: async () => {

        let filters: Array<any> = [
            {
                kinds: [1],
                since: 1663905355000,
                until: Date.now(),
                limit: 100,
            }
        ];

        const _filters = JSON.stringify(filters);
        let result = await fetchEvents(_filters);

        console.log("Results are ", result);

        set(result);
      },
    };
};

export const myPostStore = initMyPostsStore();