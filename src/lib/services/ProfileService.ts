// users-profile.store.ts
import { fetchEvents, fetchFollowList, fetchProfile } from "$lib/ao/relay";
import type { Profile } from "$lib/models/Profile";

interface ProfileService {
  fetchProfiles: (since: Number, limit: Number, authors:string[]) => Promise<Profile[]>;
  get: (address: string) => Promise<Profile>;
}

const service = (): ProfileService => {
  return {
    fetchProfiles: async (since: Number, limit: Number, authors:string[]) => {
      let filter = "";
        if (authors.length > 0) {
          filter = JSON.stringify([
            {
              kinds: ["0"],
              authors: authors,
              since: since,
              limit: limit
            },
          ]);
        } else {
          filter = JSON.stringify([
            {
              kinds: ["0"],
              since: since,
              //limit: limit
            },
          ]);
        }
        let messages = await fetchEvents(filter);
        // console.log("Messages from App with all profiless", messages);
      
        try {
          return messages.map((message) => {
            let profile = JSON.parse(message.Content);
      
            profile.address = message.From;
      
            profile.created_at = messages[0].Timestamp;
      
            profile.updated_at = message.Timestamp;
      
            //console.log("Profile from App in new Fetch all Profiles", profile);
      
            return profile;
          }) as Profile[];
        } catch (e) {
          console.error(e);
          throw e;
        }
    },
    get: async (address: string): Promise<Profile> => {
      console.log("getting profile")
      try {
        //let profile = get({ subscribe }).get(address);
        //if (profile) return profile;
        const fetchedProfile = await fetchProfile(address);
        fetchedProfile.followList = await fetchFollowList(address)
        console.log(fetchedProfile)
        return fetchedProfile;
      } catch (error) {
        console.error("UsersProfileMapStore.get ", error);
        throw(error)
      }
    },
  };
};

export const profileService = service();
