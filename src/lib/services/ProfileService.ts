// users-profile.store.ts
import { fetchEvents, fetchFollowList, fetchProfile } from "$lib/ao/relay";
import type { Profile } from "$lib/models/Profile";
import { get, writable, type Readable } from "svelte/store";

interface ProfileService extends Readable<Map<string, any>> {
  get: (address: string) => Promise<Profile>;
}

const service = (): ProfileService => {
  const { subscribe, set } = writable<Map<string, any>>(
    new Map<string, any>()
  );
  return {
    subscribe,
    get: async (address: string): Promise<Profile> => {
      let profiles = get(profileService);
      try {
        const fetchedProfile = await fetchProfile(address);
        fetchedProfile.followList = await fetchFollowList(address)
        profiles.set(fetchedProfile.address, fetchedProfile)
        set(profiles)
        return fetchedProfile
      } catch (error) {
        throw (error)
      }
    },
  };
};

export const profileService = service();

      