//@ts-ignore
import { send, read } from "$lib/ao/process.svelte";
//@ts-ignore
import { FetchEvents, GetZones, GetZoneById, Register, Info, UpdateProfile, Transfer, QueryFee } from "$lib/ao/messegeFactory.svelte";
import type { Tag } from "$lib/models/Tag";
import type { Profile } from "$lib/models/Profile";
import { currentUser } from "$lib/services/UserService";
import { HUB_REGISTRY_ID } from "$lib/constants";
//@ts-ignore
import { Eval } from "./messegeFactory.svelte";
import type { Spec } from "$lib/models/Spec";
import type { Hub } from "$lib/models/Hub";
import { walletService } from "$lib/services/walletService";

export const evalProcess = async (data: string, processId: string) => {
  //await walletService.connectWallet();
  try {
    const tags = Eval();
    // @ts-ignore
    await send(processId, tags, data);
    ;
  } catch (e) {
    console.log(e);
  }
};

export const event = async (hub: string, tags: Array<Tag>) => {
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
    ;
  } catch (e) {
    console.log(e);
  }
};

export const payedEvent = async (recipient: string, quantity: string, payload: string) => {
  let tags = Transfer(recipient, quantity, payload)
  try {
    console.log("***TAGS***");
    console.log(tags);
    // @ts-ignore
    let result = await send(AO_Token, tags, null);
    ;
  } catch (e) {
    console.log(e);
  }
};

export const updateProfile = async (processId: string, data: string) => {
  //await walletService.connectWallet();
  const tags: Tag[] = UpdateProfile();
  try {
    console.log("***TAGS***");
    console.log(tags);
    // @ts-ignore
    let result = await send(processId, tags, data);
    ;
  } catch (e) {
    console.log(e);
  }
};

export const info = async (processId: string): Promise<any> => {
  try {
    // @ts-ignore
    let message = Info();
    let result = await read(processId, message);
    //
    if (result) {
      let json = JSON.parse(result.Data);
      //
      return json;
    } else {
      throw ("Not Found")
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const queryFee = async (hubId: string, kind: string): Promise<any> => {
  try {
    // @ts-ignore
    let message = QueryFee(kind);
    console.log(message)
    let result = await read(hubId, message);
    console.log(result)
    //
    if (result) {
      let json = JSON.parse(result.Data);
      //
      return json;
    } else {
      throw ("Not Found")
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const fetchEvents = async (processId: string, filters: string): Promise<any[]> => {
  let events: any[] = [];
  try {
    // @ts-ignore
    let message = FetchEvents(filters);
    console.log(message)
    console.log(processId)
    let result = await read(processId, message);

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

export const fetchFollowList = async (
  hub: string
): Promise<Array<string>> => {
  //console.log("Address", address);
  let followList: Array<string> = [];
  const filter = JSON.stringify([
    {
      kinds: ["3"],
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

export const register = async (processId: string, spec: any): Promise<void> => {
  try {
    // @ts-ignore
    let message = Register();
    await send(processId, message, JSON.stringify(spec));

  } catch (e) {
    console.log(e);
  }
};

export const getZones = async (processId: string, filters: string, page: Number, limit: Number): Promise<any[]> => {
  let events: any[] = [];
  try {
    // @ts-ignore
    let message = GetZones(filters, page.toString(), limit.toString());
    let result = await read(processId, message);
    console.log(message)
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

export const getZone = async (processId: string, zoneId: string): Promise<any> => {
  let events: any[] = [];
  try {
    // @ts-ignore
    let message = GetZoneById(zoneId);
    let result = await read(processId, message);
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