//@ts-ignore
import { send, read } from "$lib/ao/process.svelte";
//@ts-ignore
import { FetchEvents, GetZones, GetZoneById, Register } from "$lib/ao/messegeFactory.svelte";
import type { Tag } from "$lib/models/Tag";
import type { Profile } from "$lib/models/Profile";
import { addressStore } from "$lib/stores/address.store";
import { REGISTRY_ID } from "$lib/constants";
//@ts-ignore
import { Eval } from "./messegeFactory.svelte";
import type { Spec } from "$lib/models/Spec";

export const evalProcess = async (data: string, processId: string) => {
  await addressStore.connectWallet();

  try {
    const tags = Eval();
    // @ts-ignore
    let result = await send(processId, tags, data,);
    console.log(result);
  } catch (e) {
    console.log(e);
  }
};

export const event = async (hub: string, tags: Array<Tag>) => {
  await addressStore.connectWallet();
  const actionTag: Tag = {
    name: "Action",
    value: "Event",
  };
  tags.push(actionTag);
  try {
    console.log("***TAGS***");
    console.log(tags);
    // @ts-ignore
    let result = await send(hub, tags, null);
    console.log(result);
  } catch (e) {
    console.log(e);
  }
};

export const fetchEvents = async (hub: string, filters: string): Promise<any[]> => {
  let events: any[] = [];
  try {
    // @ts-ignore
    let message = FetchEvents(filters);
    let result = await read(hub, message);
    console.log(result)
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

export const fetchProfile = async (hub: string, address: string): Promise<Profile> => {
  //console.log("Address", address);
  const filter = JSON.stringify([
    {
      kinds: ["0"],
      authors: [address],
      //   limit: 1,
    },
  ]);

  let messages = await fetchEvents(hub, filter);
  //console.log("Messages from App", messages);

  try {
    // messages[0] give the latest profile change of this address and it  return that
    let message = messages[0];
    if (!message) throw ("message is empty");
    let profile = JSON.parse(message.Content);
    profile.address = message.From;
    profile.created_at = messages[0].Timestamp;
    profile.updated_at = message.Timestamp;
    console.log("Profile from App", profile);
    return profile;
  } catch (e) {
    throw e;
  }
};

export const fetchFollowList = async (
  hub: string, address: string
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

  let messages = await fetchEvents(hub, filter);
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

export const register = async (spec: Spec): Promise<void> => {
  try {
    // @ts-ignore
    let message = Register();
    let result = await send(REGISTRY_ID(), message, JSON.stringify(spec));
    console.log(result)
  } catch (e) {
    console.log(e);
  }
};

export const getZones = async (filters: string, page: Number, limit: Number): Promise<any[]> => {
  let events: any[] = [];
  try {
    // @ts-ignore
    let message = GetZones(filters, page, limit);
    let result = await read(REGISTRY_ID(), message);
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

export const getZone = async (zoneId: string): Promise<any[]> => {
  let events: any[] = [];
  try {
    // @ts-ignore
    let message = GetZoneById(zoneId);
    let result = await read(REGISTRY_ID(), message);
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