import { send, read } from "$lib/ao/process.svelte";
import { FetchEvents } from "$lib/ao/messegeFactory.svelte";
import { HUB_ID } from "$lib/constants";
import type { Tag } from "$lib/models/Tag";

export const event = async (
    tags: Array<Tag>,
) => {
    const actionTag: Tag = {
        name: "Action",
        value: "Event"
    }
    tags.push(actionTag)
    try {
        console.log("***TAGS***")
        console.log(tags)
        // @ts-ignore
        let result = await send(HUB_ID(), tags, null);
        console.log(result);
    } catch (e) {
        console.log(e);
    }
};


export const fetchEvents = async (filters: string) : Promise<any[]> => {
    let events:any[] = []
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
            events = json
        };
    } catch (e) {
        console.log(e);
        throw(e)
    }
    return events
};