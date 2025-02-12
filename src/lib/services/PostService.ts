// users-profile.store.ts
import { fetchEvents, fetchFollowList, fetchProfile } from "$lib/ao/relay";
import type { Profile } from "$lib/models/Profile";

interface PostService {
    fetchPost: (since: string, limit: string, authors: string[]) => Promise<any[]>;
    get: (id: string) => Promise<any>;
}

const service = (): PostService => {
    return {
        fetchPost: async (since: string, limit: string, authors: string[]) => {
            try {
                const filter = {
                    kinds: ["1", "6"],
                    since: since,
                    limit: limit,
                    authors: authors
                };
                const filter2 = {
                    tags: { marker: ["root"] },
                };

                const _filters = JSON.stringify([filter, filter2]);
                return await fetchEvents(_filters);
            } catch (error) {
                console.error("Error fetching following events:", error);
                return []
            }
        },
        get: async (id: string): Promise<any> => {
            console.log("getting profile")
            try {
                const filter = {
                    kinds: ["1", "6"],
                    id:[id],
                    limit:1
                };
                const filter2 = {
                    tags: { marker: ["root"] },
                };

                const _filters = JSON.stringify([filter, filter2]);
                let result = await fetchEvents(_filters);
                if (result.length == 0) throw("Not Found")
                return result[0];
            } catch (error) {
                console.error("UsersProfileMapStore.get ", error);
                throw (error)
            }
        },
    };
};

export const postService = service();
