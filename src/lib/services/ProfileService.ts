import { fetchEvents, event } from "$lib/ao/relay";
import { get, writable, type Readable } from "svelte/store";
import type { Tag } from "$lib/models/Tag";
import type { Profile, ProfileCreateData } from "$lib/models/Profile";

export interface ProfileService extends Readable<Map<string, Profile>> {
    fetchProfiles: (hubId: string, addresses: string[]) => Promise<Map<string, Profile>>;
    searchProfiles: (hubId: string, search: string) => Promise<Map<string, Profile>>;
}

const service = (): ProfileService => {
    const { subscribe, set, update } = writable<Map<string, Profile>>(
        new Map<string, any>()
    );
    return {
        subscribe,
        fetchProfiles: async (hubId: string, addresses: string[]): Promise<Map<string, Profile>> => {
            let profiles = get(profileService)
            const filter = JSON.stringify([
                {
                    kinds: ["0"],
                    authors: addresses,
                    //   limit: 1,
                },
            ]);

            let messages = await fetchEvents(hubId, filter);
            //console.log(messages)
            try {
                // messages[0] give the latest profile change of this address and it  return that
                let message = messages[0];
                for (var i = 0; i < messages.length; i++) {
                    if (!message) throw ("message is empty");
                    let profile = JSON.parse(message.Content);
                    profile.from = message.From;
                    profile.owner = message.Owner;
                    profile.created_at = messages[0].Timestamp;
                    profile.updated_at = message.Timestamp;
                    //console.log(profile);
                    profiles.set(message.Owner,profile)
                    profiles.set(message.From,profile)
                }
                set(profiles)
                return profiles
            } catch (e) {
                throw e;
            }
        },
        searchProfiles: async (hubId: string, search: string): Promise<Map<string, Profile>> => {
            let profiles = get(profileService)
            const filter = JSON.stringify([
                {
                    kinds: ["0"],
                    search: search,
                    //   limit: 1,
                },
            ]);
            console.log("starting search")
            let messages = await fetchEvents(hubId, filter);
            console.log("end search")
            console.log(messages)
            try {
                // messages[0] give the latest profile change of this address and it  return that
                let message = messages[0];
                for (var i = 0; i < messages.length; i++) {
                    if (!message) throw ("message is empty");
                    let profile = JSON.parse(message.Content);
                    profile.from = message.From;
                    profile.created_at = messages[0].Timestamp;
                    profile.updated_at = message.Timestamp;
                    //console.log(profile);
                    profiles.set(message.Owner,profile)
                }
                set(profiles)
                return profiles
            } catch (e) {
                throw e;
            }
        },
    };
};

export const profileService = service();
