// users-profile.store.ts
import { fetchEvents, fetchFollowList, fetchProfile } from "$lib/ao/relay";
import type { Profile } from "$lib/models/Profile";
import { get, writable, type Readable } from "svelte/store";
import { profileService } from "./ProfileService";

export interface PostService extends Readable<Map<string, any>> {
    fetchPost: (since: Number, limit: Number, authors: string[]) => void;
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
                        posts.set(events[i].From, events[i])
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
                        posts.set(post.From, post)
                    }
                    set(posts)
                    /*const profiles = new Map(temp.map((profile) => [profile.address, profile]))

                    for (var i = 0; i < _events.length; i++) {
                        const event = _events[i];
                        const profile = profiles.get(event.From)
                        event.profile = profile;
                        events.push(event)
                    }
                    return events*/
                }


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
