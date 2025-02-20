// users-profile.store.ts
import { fetchEvents, fetchFollowList, fetchProfile } from "$lib/ao/relay";
import type { Profile } from "$lib/models/Profile";
import { get, writable, type Readable } from "svelte/store";

interface ProfileService extends Readable<Map<string, any>> {
  fetchProfiles: (since: Number, limit: Number, authors: string[]) => Promise<Map<string, Profile>>;
  get: (address: string) => Promise<Profile>;
}

const service = (): ProfileService => {
  const { subscribe, set, update } = writable<Map<string, any>>(
    new Map<string, any>()
  );
  return {
    subscribe,
    fetchProfiles: async (since: Number, limit: Number, authors: string[]): Promise<Map<string, Profile>> => {
      let profiles = get(profileService);
      let _profiles:Map<string, Profile> = new Map<string, Profile>()
      let filters = "";
      try {
        if (authors.length > 0) {
          filters = JSON.stringify([
            {
              kinds: ["0"],
              authors: authors,
            },
          ]);
        } else {
          filters = JSON.stringify([
            {
              kinds: ["0"],
              since: since,
              limit: limit
            },
          ]);
        }
        let events = await fetchEvents(filters);
        let temp = events.map((event) => {
        let profile = JSON.parse(event.Content);

        profile.address = event.From;

        profile.created_at = event.Timestamp;

        profile.updated_at = event.Timestamp;

          return profile;
        }) as Profile[];
        for (var i = 0; i < temp.length; i++) {
          let currentProfile = profiles.get(temp[i].address);
          if (currentProfile) {
            if (currentProfile.created_at < temp[i].created_at) {
              profiles.set(temp[i].address, temp[i])
              _profiles.set(temp[i].address, temp[i])
            }
          } else {
            profiles.set(temp[i].address, temp[i])
            _profiles.set(temp[i].address, temp[i])
          }

        }
        set(profiles)
        //console.log("Profiles are")
        //console.log(get(profileService))
      } catch (e) {
        throw e;
      }
      return _profiles
    },
    get: async (address: string): Promise<Profile> => {
      //console.log("getting profile for", address)
      let profiles = get(profileService);
      try {
        const fetchedProfile = await fetchProfile(address);
        fetchedProfile.followList = await fetchFollowList(address)
        profiles.set(fetchedProfile.address, fetchedProfile)
        return fetchedProfile
      } catch (error) {
        throw (error)
      }
    },
  };
};

export const profileService = service();
