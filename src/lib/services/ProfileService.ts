// users-profile.store.ts
import { fetchEvents, fetchFollowList, fetchProfile } from "$lib/ao/relay";
import type { Profile } from "$lib/models/Profile";
import { get, writable, type Readable } from "svelte/store";

interface ProfileService extends Readable<Map<string, any>> {
  get: (address: string) => void;
}

const service = (): ProfileService => {
  const { subscribe, set } = writable<Map<string, any>>(
    new Map<string, any>()
  );
  return {
    subscribe,
    get: async (address: string) => {
      let profiles = get(profileService);
      try {
        fetchProfile(address).then((profile) => {
          fetchFollowList(address).then((followList) => {
            profile.followList = followList;
            profiles.set(profile.address, profile)
            set(profiles)
          })
        })
      } catch (error) {
        throw (error)
      }
    },
  };
};

export const profileService = service();

      