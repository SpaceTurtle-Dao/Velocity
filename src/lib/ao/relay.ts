import { send, read } from "$lib/ao/process.svelte";
import {
    Event,
    Subscribe,
    UnSubscribe,
    SetOwner,
    GetOwner,
    Info,
    Subs,
    Subscriptions,
    IsSubscribed,
    FetchFeed,
    FetchEvents,
    Request,
    Relay,
    Relays
} from "$lib/ao/messegeFactory.svelte";
import { INDEXER_ID, WAR_TOKEN } from "$lib/constants";
import { currentUser, feedEvents, followers, userEvents } from "$lib/stores/profile.store";
import { feedPosts, replies } from "../stores/feedpage.store";
import type { UserInfo } from "$lib/models/Profile";
import { users } from "$lib/stores/main.store";

type Relay = {
    owner: string,
    relay: string
}

export const event = async (
    value: string,
    relay: string
) => {
    try {
        // @ts-ignore
        let message = Event();
        let result = await send(relay, message, value);
        console.log(result);
    } catch (e) {
        console.log(e);
    }
};

export const subscribe = async (
    subscribing_relay: string,
    relay: string
) => {
    try {
        // @ts-ignore
        let message = Subscribe(relay);
        let result = await send(subscribing_relay, message, null);
        console.log(result);
    } catch (e) {
        console.log(e);
    }
};

export const unsubscribe = async (
    unsubscribing_relay: string,
    relay: string,
) => {
    try {
        // @ts-ignore
        let message = UnSubscribe(relay);
        let result = await send(unsubscribing_relay, message, null);
        console.log(result);
    } catch (e) {
        console.log(e);
    }
};

export const setOwner = async (
    owner: string,
    relay: string
) => {
    try {
        // @ts-ignore
        let message = SetOwner(owner);
        let result = await send(relay, message, null);
        console.log(result);
    } catch (e) {
        console.log(e);
    }
};

export const spawnRelay = async () => {
    try {
        // @ts-ignore
        let message = Request();
        let result = await send(INDEXER_ID(), message, null);
        //console.log(result);
    } catch (e) {
        console.log(e);
    }
};

export const fetchFeed = async (relay: string, filters: string) => {
    let _events: Array<any> = [];
    try {
        // @ts-ignore
        let message = FetchFeed(filters);
        let result = await read(relay, message);
        if (result == undefined) return _events;
        console.log(result);
        let json = JSON.parse(result.Data);
        console.log(json);
        for (const key in json) {
            _events.push(json[key]);
            console.log(json[key]);
        }
        feedEvents.set(_events)
    } catch (e) {
        console.log(e);
    }
    return _events;
};

export const fetchEvents = async (relay: string, filters: string) => {
    try {
        // @ts-ignore
        let message = FetchEvents(filters);
        let result = await read(relay, message);
        if (result) {
            console.log(result);
            let json = JSON.parse(result.Data);
            console.log(json);
            userEvents.set(json)
        };
    } catch (e) {
        console.log(e);
    }
};

export const subs = async (relay: string, page: string, size: string) => {
    console.log("Fetching subs for " + relay)
    try {
        // @ts-ignore
        let message = Subs(page, size);
        let result = await read(relay, message);
        console.log(result);
        let json = JSON.parse(result.Data);
        console.log(json);
        followers.set(json)
    } catch (e) {
        console.log(e);
    }
};

export const subscriptions = async (relay: string, page: string, size: string) => {
    console.log("Fetching subscriptions for " + relay)
    try {
        // @ts-ignore
        let message = Subscriptions(page, size);
        let result = await read(relay, message);
        console.log(result);
        let json = JSON.parse(result.Data);
        console.log(json);
        followers.set(json)
    } catch (e) {
        console.log(e);
    }
};

export const isSubscribed = async (process: string, relay: string) => {
    try {
        // @ts-ignore
        let message = IsSubscribed(relay);
        let result = await read(process, message);
        if (result == undefined) throw (404);
        console.log("********IS SUBSCIRBED**********")
        console.log(result);
        return result.Data
    } catch (e) {
        console.log(e);
    }
};

export const info = async (process: string): Promise<any | null> => {
    let _info = null;
    try {
        // @ts-ignore
        let message = Info();
        let result = await read(process, message);
        if (result) {
            let json = JSON.parse(result.Data);
            _info = json
        }
    } catch (e) {
        console.log(e);
    }
    return _info
};

export const getOwner = async (process: string): Promise<string> => {
    let owner = ""
    try {
        // @ts-ignore
        let message = GetOwner();
        let result = await read(process, message);
        console.log(result);
        owner = result.Data
    } catch (e) {
        console.log(e);
    }
    return owner
};


export const relay = async (owner: string): Promise<string | null> => {
    let _relay = null;
    try {
        // @ts-ignore
        let message = Relay(owner);
        let result = await read(INDEXER_ID(), message);
        if (result) {
            _relay = result.Data
        }
    } catch (e) {
        console.log(e);
    }
    return _relay
};

export async function relays(page: string, size: string) {
    let userProfiles: Array<UserInfo> = [];
    try {
        // @ts-ignore
        let message = Relays(page, size);
        let result = await read(INDEXER_ID(), message);
        let userRelays: Array<Relay> = JSON.parse(result.Data);
        for (var i = 0; i < userRelays.length; i++) {
            let userProfile = await info(userRelays[i].relay)
            if(userProfile){
                userProfiles.push(userProfile)
            }
        }
        console.log("****USERS****")
        console.log(userProfiles);
        users.set(userProfiles)
    } catch (e) {
        console.log(e);
    }
};