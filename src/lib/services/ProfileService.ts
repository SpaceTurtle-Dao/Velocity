import { fetchEvents, event } from "$lib/ao/relay";
import { get, writable, type Readable } from "svelte/store";
import type { Tag } from "$lib/models/Tag";
import type { Profile, ProfileCreateData } from "$lib/models/Profile";

export interface ProfileService extends Readable<Map<string, Profile>> {
    fetchProfiles: (hubId: string, addresses: string[]) => Promise<Map<string, Profile>>;
    searchProfiles: (hubId: string, search: string) => Promise<Map<string, Profile>>;
    updateProfile: (hubId: string, profile: Profile) => Promise<void>;
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
                    console.log(profile);
                    profiles.set(message.Owner,profile)
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

            let messages = await fetchEvents(hubId, filter);
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
                    console.log(profile);
                    profiles.set(message.Owner,profile)
                }
                set(profiles)
                return profiles
            } catch (e) {
                throw e;
            }
        },
        updateProfile: async (hubId: string, profile: Profile): Promise<void> => {
            try {
                await createProfile(hubId, profile)
            } catch (error) {
                console.log("Failed to register profile:", error);
                throw (error)
            }
        },
    };
};

async function createProfile(hubId: string, profileData: ProfileCreateData) {
    try {
        let tags: Array<Tag> = [];
        // Prepare the content for the event
        const content = JSON.stringify(profileData);

        const kindTag: Tag = {
            name: "Kind",
            value: "0",
        };

        const contentTag: Tag = {
            name: "Content",
            value: content,
        };
        tags.push(kindTag);
        tags.push(contentTag);
        await event(hubId, tags)
    } catch (err) {
        console.log(err)
    }
}

export const profileService = service();
