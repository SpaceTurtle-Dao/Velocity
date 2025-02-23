//@ts-ignore
import { send, read } from "$lib/ao/process.svelte";
//@ts-ignore
import { FetchEvents } from "$lib/ao/messegeFactory.svelte";
import { HUB_ID } from "$lib/constants";
import type { Tag } from "$lib/models/Tag";
import type { Profile } from "$lib/models/Profile";
import type { profile } from "console";

export const event = async (tags: Array<Tag>) => {
  const actionTag: Tag = {
    name: "Action",
    value: "Event",
  };
  tags.push(actionTag);
  try {
    console.log("***TAGS***");
    console.log(tags);
    // @ts-ignore
    let result = await send(HUB_ID(), tags, null);
    console.log(result);
  } catch (e) {
    console.log(e);
  }
};

export const fetchEvents = async (filters: string): Promise<any[]> => {
  let events: any[] = [];
  try {
    // @ts-ignore
    let message = FetchEvents(filters);
    let result = await read(HUB_ID(), message);
    if (result) {
      let json = JSON.parse(result.Data);
      events = json;
    }
  } catch (e) {
    console.log(e);
    //throw e;
  }
  return events;
};

export const fetchProfile = async (address: string): Promise<Profile> => {
  //console.log("Address", address);
  const filter = JSON.stringify([
    {
      kinds: ["0"],
      authors: [address],
      //   limit: 1,
    },
  ]);

  let messages = await fetchEvents(filter);
  //console.log("Messages from App", messages);

  try {
    // messages[0] give the latest profile change of this address and it  return that
    let message = messages[0];
    if (!message) throw("message is empty");
    let profile = JSON.parse(message.Content);
    profile.address = message.From;
    profile.created_at = messages[0].Timestamp;
    profile.updated_at = message.Timestamp;
    //console.log("Profile from App", profile);
    return profile;
  } catch (e) {
    throw e;
  }
};

export const fetchFollowList = async (
  address: string
): Promise<Array<string>> => {
  //console.log("Address", address);
  let followList: Array<string> = [];
  const filter = JSON.stringify([
    {
      kinds: ["3"],
      authors: [address],
      //   limit: 1,
    },
  ]);

  let messages = await fetchEvents(filter);
  //console.log("Messages from App", messages);

  try {
    //console.log(`Follow List messages for ${address}`, messages);
    let message = messages[0]; // Latest Follow List at index 0
    if (message && message.p) {
      followList = JSON.parse(message.p);
      //console.log(`Latest Follow List for ${address}`, followList);
    }
  } catch (e) {
    console.log(e);
  }
  return followList;
};

// Modified fetchProfilesForUsersProfileMap with pagination
/*export const fetchProfilesForUsersProfileMap = async (
  page: number = 0,
  limit: number = 10,
  profiles: string []
): Promise<Map<string, Profile>> => {
  // Calculate start and end indices for pagination
  const startIndex = page * limit;
  
  let allProfiles = await fetchProfiles(profiles);
  
  // Paginate the profiles array
  const paginatedProfiles = allProfiles.slice(startIndex, startIndex + limit);

  try {
    const map = new Map<string, Profile>();

    paginatedProfiles.forEach((profile) => {
      const duplicate = map.get(profile.address);

      if (duplicate) {
        if (
          duplicate.updated_at !== undefined &&
          profile.updated_at !== undefined
        ) {
          if (profile.updated_at > duplicate.updated_at) {
            map.set(profile.address, profile);
          }
        } else if (profile.updated_at) {
          map.set(profile.address, profile);
        }
      } else {
        map.set(profile.address, profile);
      }
    });

    return map;
  } catch (e) {
    console.error(e);
    throw e;
  }
};*/

// that stores all profiles and returns paginated results from cache
/*export class ProfileCache {
  private static instance: ProfileCache;
  private profiles: Profile[] = [];
  private lastFetch: number = 0;
  private CACHE_DURATION = 10 * 60 * 1000; // 5 minutes

  private constructor() {}

  static getInstance(): ProfileCache {
    if (!ProfileCache.instance) {
      ProfileCache.instance = new ProfileCache();
    }
    return ProfileCache.instance;
  }

  /*private async refreshCache(): Promise<void> {
    const now = Date.now();
    if (now - this.lastFetch > this.CACHE_DURATION || this.profiles.length === 0) {
      this.profiles = await fetchProfiles([]);
      this.lastFetch = now;
    }
  }*/

  /*async getPaginatedProfiles(page: number, limit: number): Promise<Map<string, Profile>> {
    await this.refreshCache();
    
    const startIndex = page * limit;
    const paginatedProfiles = this.profiles.slice(startIndex, startIndex + limit);
    
    const map = new Map<string, Profile>();
    
    paginatedProfiles.forEach((profile) => {
      const duplicate = map.get(profile.address);

      if (duplicate) {
        if (
          duplicate.updated_at !== undefined &&
          profile.updated_at !== undefined
        ) {
          if (profile.updated_at > duplicate.updated_at) {
            map.set(profile.address, profile);
          }
        } else if (profile.updated_at) {
          map.set(profile.address, profile);
        }
      } else {
        map.set(profile.address, profile);
      }
    });

    return map;
  }

  hasMoreProfiles(page: number, limit: number): boolean {
    return (page + 1) * limit < this.profiles.length;
  }
}

// Modified version of fetchProfilesForUsersProfileMap that uses the cache
export const fetchPaginatedProfilesForUsersProfileMap = async (
  page: number = 0,
  limit: number = 10
): Promise<Map<string, Profile>> => {
  const cache = ProfileCache.getInstance();
  return await cache.getPaginatedProfiles(page, limit);
};

// Helper function to check if more profiles are available
export const hasMoreProfiles = (page: number, limit: number): boolean => {
  const cache = ProfileCache.getInstance();
  return cache.hasMoreProfiles(page, limit);
};*/