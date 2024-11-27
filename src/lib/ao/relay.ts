import { send, read } from "$lib/ao/process.svelte";
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
    let message = messages.pop();
    let profile = JSON.parse(message.Content);
    profile.address = message.From;
    profile.created_at = messages[0].Timestamp;
    profile.updated_at = message.Timestamp;
    console.log("Profile from App", profile);
    return profile;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const fetchProfiles = async (): Promise<Profile[]> => {
  const filter = JSON.stringify([
    {
      kinds: ["0"],
      // authors: [],
      //   limit: 1,
    },
  ]);

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

export const fetchFollowList = async (address: string): Promise<[string]> => {
  console.log("Address", address);
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
    let message = messages.pop();
    let followList = JSON.parse(message.p);
    console.log(`Follow List for ${address}`, followList);
    return followList;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

// Returns Profile in Key value format that can be used in UsersProfileMapStore
export const fetchProfilesForUsersProfileMap = async (): Promise<
  [string, Profile][]
> => {
  const profileFilter = JSON.stringify([
    {
      kinds: ["0"],
    },
  ]);

  let messages = await fetchEvents(profileFilter);

  try {
    return messages.map((message) => {
      let profile = JSON.parse(message.Content);

      profile.address = message.From;

      profile.created_at = messages[0].Timestamp;

      profile.updated_at = message.Timestamp;

      return [profile.address, profile];
    }) as [string, Profile][];
  } catch (e) {
    console.error(e);
    throw e;
  }
};
