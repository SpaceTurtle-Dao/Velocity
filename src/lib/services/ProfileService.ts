import { fetchEvents, event } from "$lib/ao/relay";
import { get, writable, type Readable } from "svelte/store";
import type { Tag } from "$lib/models/Tag";
import type { Profile, ProfileCreateData } from "$lib/models/Profile";

// Cache for profiles
const profileCache = new Map<string, Profile>();

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
            const profiles = get(profileService);
            const cachedProfiles = new Map<string, Profile>();
            const profilesToFetch = [];

            for (const address of addresses) {
                if (profileCache.has(address)) {
                    cachedProfiles.set(address, profileCache.get(address)!);
                } else {
                    profilesToFetch.push(address);
                }
            }

            if (cachedProfiles.size > 0) {
                update(store => new Map([...store, ...cachedProfiles]));
            }

            if (profilesToFetch.length === 0) {
                return cachedProfiles;
            }

            const filter = JSON.stringify([
                {
                    kinds: ["0"],
                    authors: profilesToFetch,
                },
            ]);

            const messages = await fetchEvents(hubId, filter);

            try {
                for (const message of messages) {
                    if (!message) continue;
                    const profile = JSON.parse(message.Content);
                    profile.from = message.From;
                    profile.owner = message.Owner;
                    profile.created_at = message.Timestamp;
                    profile.updated_at = message.Timestamp;
                    
                    profileCache.set(message.Owner, profile);
                    profiles.set(message.Owner, profile);
                    profiles.set(message.From, profile);
                }
                set(profiles);
                return profiles;
            } catch (e) {
                throw e;
            }
        },
        searchProfiles: async (hubId: string, search: string): Promise<Map<string, Profile>> => {
            const profiles = get(profileService);
            const filter = JSON.stringify([
                {
                    kinds: ["0"],
                    search: search,
                },
            ]);

            const messages = await fetchEvents(hubId, filter);

            try {
                for (const message of messages) {
                    if (!message) continue;
                    const profile = JSON.parse(message.Content);
                    profile.from = message.From;
                    profile.created_at = message.Timestamp;
                    profile.updated_at = message.Timestamp;

                    profileCache.set(message.Owner, profile);
                    profiles.set(message.Owner, profile);
                }
                set(profiles);
                return profiles;
            } catch (e) {
                throw e;
            }
        },
    };
};

export const profileService = service();
