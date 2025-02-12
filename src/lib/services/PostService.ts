// users-profile.store.ts
import { fetchEvents, fetchFollowList, fetchProfile } from "$lib/ao/relay";
import type { Profile } from "$lib/models/Profile";

interface PostService {
    fetchPost: (since: Number, limit: Number, authors:string[]) => Promise<any[]>;
    get: (id: string) => Promise<any>;
}

const service = (): PostService => {
    return {
        fetchPost: async (since: Number, limit: Number, authors: string[] = []) => {
            try {

                if (authors.length > 0) {
                    const filter = {
                        kinds: ["1", "6"],
                        since: 1663905355000,
                        limit: 100,
                        authors: authors
                    };
                    const filter2 = {
                        tags: { marker: ["root"] },
                    };

                    const _filters = JSON.stringify([filter, filter2]);
                    let result = await fetchEvents(_filters);
                    return result
                } else {
                    const filter = {
                        kinds: ["1", "6"],
                        since: since,
                        limit: limit
                    };
                    const filter2 = {
                        tags: { marker: ["root"] },
                    };

                    const _filters = JSON.stringify([filter, filter2]);
                    let result = await fetchEvents(_filters);
                    return result
                }


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
                    id: [id],
                    limit: 1
                };
                const filter2 = {
                    tags: { marker: ["root"] },
                };

                const _filters = JSON.stringify([filter, filter2]);
                let result = await fetchEvents(_filters);
                if (result.length == 0) throw ("Not Found")
                return result[0];
            } catch (error) {
                console.error("UsersProfileMapStore.get ", error);
                throw (error)
            }
        },
    };
};

export const postService = service();
