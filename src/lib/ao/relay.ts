//@ts-ignore
import { send, read } from "$lib/ao/process.svelte";
//@ts-ignore
import { FetchEvents } from "$lib/ao/messegeFactory.svelte";
import { HUB_ID } from "$lib/constants";
import type { Tag } from "$lib/models/Tag";
import type { Profile } from "$lib/models/Profile";

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
      //console.log(result);
      let json = JSON.parse(result.Data);
      //console.log("***Filters***")
      //console.log(JSON.parse(filters));
      //console.log("***Got Events***")
      //console.log(json);
      events = json;
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
  return events;
};

export const fetchProfile = async (address: string): Promise<Profile> => {
  console.log("Address", address);
  const filter = JSON.stringify([
    {
      kinds: ["0"],
      authors: [address],
      //   limit: 1,
    },
  ]);

  let messages = await fetchEvents(filter);
  console.log("Messages from App", messages);

  try {
    // messages[0] give the latest profile change of this address and it  return that
    let message = messages[0];
    let profile = JSON.parse(message.Content);

    profile.address = message.From;
    profile.created_at = messages[0].Timestamp;
    profile.updated_at = message.Timestamp;
    fetchFollowList(address).then((followList) => {
      profile.followList = followList
    }).catch(console.log);
    console.log("Profile from App", profile);
    return profile;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const fetchProfiles = async (
  authors: Array<string>
): Promise<Profile[]> => {
  let filter = "";
  if (authors.length > 0) {
    filter = JSON.stringify([
      {
        kinds: ["0"],
        authors: authors,
        //   limit: 1,
      },
    ]);
  } else {
    filter = JSON.stringify([
      {
        kinds: ["0"],
        //   limit: 1,
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

      console.log("Profile from App in new Fetch all Profiles", profile);

      return profile;
    }) as Profile[];
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const fetchFollowList = async (
  address: string
): Promise<Array<string>> => {
  console.log("Address", address);
  let followList: Array<string> = [];
  const filter = JSON.stringify([
    {
      kinds: ["3"],
      authors: [address],
      //   limit: 1,
    },
  ]);

  let messages = await fetchEvents(filter);
  console.log("Messages from App", messages);

  try {
    console.log(`Follow List messages for ${address}`, messages);
    let message = messages.pop();
    if (message.p) {
      followList = JSON.parse(message.p);
      console.log(`Follow List for ${address}`, followList);
    }
  } catch (e) {
    console.log(e);
  }
  return followList;
};

// Returns Profile in Key value format that can be used in UsersProfileMapStore
export const fetchProfilesForUsersProfileMap = async (): Promise<
  Map<string, Profile>
> => {

  let profiles = await fetchProfiles([]);

  try {
    const map = new Map<string, Profile>();

    profiles.forEach((profile) => {

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
};
