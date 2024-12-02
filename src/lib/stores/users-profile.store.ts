import { fetchProfile, fetchProfilesForUsersProfileMap } from "$lib/ao/relay";
import type { Profile } from "$lib/models/Profile";
import { get, writable, type Readable } from "svelte/store";
import { addressStore } from "./address.store";

export interface UsersProfileMapStore extends Readable<Map<string, Profile>> {
  fetchProfiles: () => Promise<void>;
  get: (address: string) => Promise<Profile | undefined>;
}

const initUsersProfileMapStore = (): UsersProfileMapStore => {
  const { subscribe, set, update } = writable<Map<string, Profile>>(
    new Map<string, Profile>()
  );

  return {
    subscribe,
    fetchProfiles: async () => {
      try {
        console.log("**Fetching all profiles**");
        const map = await fetchProfilesForUsersProfileMap();
        console.log("profile-map", map);

        set(map);
      } catch (error) {
        console.error("Failed to fetch Users Profiles", error);
      }
    },
    get: async (address: string): Promise<Profile | undefined> => {
      try {
        let profile = get(usersProfile).get(address);

        if (profile) return profile;

        const fetchedProfile = await fetchProfile(address);

        update((map) => map.set(fetchedProfile.address, fetchedProfile));

        return fetchedProfile;
      } catch (error) {
        console.error("UsersProfileMapStore.get ", error);
      }
    },
  };
};

export const usersProfile = initUsersProfileMapStore();
