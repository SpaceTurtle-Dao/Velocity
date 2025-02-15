// users-profile.store.ts
import { fetchEvents, fetchFollowList, fetchProfile } from "$lib/ao/relay";
import type { Profile } from "$lib/models/Profile";
import { get, writable, type Readable } from "svelte/store";
import { profileService } from "./ProfileService";

export interface PostService extends Readable<Map<string, any>> {
    fetchPost: (since: Number, limit: Number, authors: string[]) => void;
    fetchReplies: (since: Number, limit: Number, id: string) => Promise<Map<string, any>>;
    get: (id: string) => void;
}

const service = (): PostService => {
    const { subscribe, set, update } = writable<Map<string, any>>(
        new Map<string, any>()
    );
    return {
        subscribe,
        fetchPost: async (since: Number, limit: Number, authors: string[] = []) => {
            let posts = get(postService)
            try {
                if (authors.length > 0) {
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
                    let events = await fetchEvents(_filters)
                    let profiles = await profileService.fetchProfiles(0, 10000, authors)
                    for (var i = 0; i < events.length; i++) {
                        let post = events[i];
                        post.profile = profiles.get(post.From);
                        posts.set(post.From, post)
                    }
                    set(posts)
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
                    let events = await fetchEvents(_filters);
                    const authors = events.map(event => event.From);
                    let profiles = await profileService.fetchProfiles(0, 1000, authors)
                    for (var i = 0; i < events.length; i++) {
                        let post = events[i];
                        post.profile = profiles.get(post.From);
                        posts.set(post.Id, post)
                    }
                    set(posts)
                }


            } catch (error) {
                throw (error)
            }
        },
        fetchReplies: async (since: Number, limit: Number, id: string): Promise<Map<string, any>> => {
            let posts = get(postService);
            let replies:Map<string, any> = new Map<string, any>();
            try {
                const filter = {
                    kinds: ["1"],
                    //since: since,
                    //limit: limit
                };
                const filter2 = {
                    tags: { marker: ["reply"] },
                };

                const filter3 = {
                    tags: { e: [id] },
                };

                const _filters = JSON.stringify([filter, filter2, filter3]);
                let events = await fetchEvents(_filters)
                const authors = events.map(event => event.From);
                let profiles = await profileService.fetchProfiles(0, 10000, authors)
                for (var i = 0; i < events.length; i++) {
                    let post = events[i];
                    post.profile = profiles.get(post.From);
                    posts.set(post.From, post)
                    replies.set(post.From, post)
                }
                set(posts)
                console.log("got replies")
                console.log(replies)
                return replies

            } catch (error) {
                throw (error)
            }
        },
        get: async (id: string): Promise<any> => {
            let posts = get(postService)
            try {
                const filter = {
                    kinds: ["1", "6"],
                    ids: [id]
                };
                const _filters = JSON.stringify([filter]);
                let result = await fetchEvents(_filters)
                if (result.length == 0) throw ("Not Found")
                let post = result[0];
                post.profile = await profileService.get(post.From)
                posts.set(id, post)
                set(posts)
                return post
            } catch (error) {
                throw (error)
            }
        },
    };
};

export const postService = service();
