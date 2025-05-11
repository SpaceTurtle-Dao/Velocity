import { evalProcess, fetchEvents, info, event } from "$lib/ao/relay";
import { get, writable, type Readable } from "svelte/store";
import { PostType, type Post } from "$lib/models/Post";
import { luaModule } from "./hub_lua";
import { createProcess } from "$lib/ao/process.svelte";
import type { Hub } from "$lib/models/Hub";
import type { Tag } from "$lib/models/Tag";
import type { Profile, ProfileCreateData } from "$lib/models/Profile";
import { HUB_REGISTRY_ID } from "$lib/constants";
import { hubRegistryService } from "./HubRegistryService";
import { profileService } from "./ProfileService";


export interface HubService extends Readable<Map<string, Hub>> {
    info: (hubId: string) => Promise<Hub>
    updateFollowList: (hubId: string, followList: string[]) => Promise<void>;
    create: (profileData: ProfileCreateData) => Promise<string>;
}

const service = (): HubService => {
    const { subscribe, set, update } = writable<Map<string, Hub>>(
        new Map<string, any>()
    );
    return {
        subscribe,
        info: async (hubId: string): Promise<Hub> => {
            let hubs = get(hubService)
            let temp = await info(hubId)
            //console.log(temp)
            let hub: Hub = {
                User: temp.User,
                Followers: JSON.parse(temp.Followers),
                Following: JSON.parse(temp.Following),
                spec: temp.spec
            };
            hubs.set(temp.User,hub)
            set(hubs)
            return hub
        },
        updateFollowList: async (hubId: string, followList: string[]) => {
            try {

                let kind: Tag = { name: "Kind", value: "3" };
                let pTag: Tag = { name: "p", value: JSON.stringify(followList) };
                let tags: Tag[] = [kind, pTag];

                await event(hubId, tags);
            } catch (error) {
                console.log(error);
            }
        },
        create: async (profileData: ProfileCreateData): Promise<string> => {
            try {
                const processId = await createProcess();
                console.log(processId)
                await evaluateHub(processId)
                console.log("ProfileId", processId);
                const hubSpec = {
                    type: "hub",
                    kinds: ["0", "1", "7", "6", "3", "2"],
                    description: "Social message hub",
                    version: "1.0.0",
                    processId: processId
                };
                await hubRegistryService.register(HUB_REGISTRY_ID(), hubSpec);
                await createProfile(processId, profileData)
                console.log("*** Hub ID ***", processId);
                //console.log("*** Profile ID ***", processId);
                return processId;
            } catch (error) {
                console.log("Failed to register profile:", error);
                throw (error)
            }
        },
    };
};

async function evaluateHub(processId: string) {
    try {
        await evalProcess(luaModule, processId);
    } catch (e) {
        console.log(e)
    }

}

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function createProfile(hubId: string, profileData: ProfileCreateData) {
    try {
        let tags: Array<Tag> = [];
        // Prepare the content for the event
        const content = JSON.stringify(profileData);

        const kindTag: Tag = {
            name: "Kind",
            value: "0",
        };

        const contentTag: Tag = {
            name: "Content",
            value: content,
        };
        tags.push(kindTag);
        tags.push(contentTag);
        await event(hubId, tags)
    } catch (err) {
        console.log(err)
    }
}

export const hubService = service();
