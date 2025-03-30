// users-profile.store.ts
import { fetchEvents, getZones } from "$lib/ao/relay";
import { get, writable, type Readable } from "svelte/store";
import { PostType, type Post } from "$lib/models/Post";
import { connect, createDataItemSigner, spawn } from "@permaweb/aoconnect";
import Permaweb, { type ProcessCreateType } from "@permaweb/libs";
import Arweave from "arweave";
import { HUB_MESSAGE_ID } from "$lib/constants";
import type { Zone } from "$lib/models/Zone";
export interface RegistryService extends Readable<Zone[]> {
    getZones: (filters: string, page: Number, limit: Number) => Promise<Zone[]>;
}

const service = (): RegistryService => {
    const { subscribe, set, update } = writable<Zone[]>([]);
    return {
        subscribe,
        getZones: async (filters: string, page: Number, limit: Number): Promise<Zone[]> => {
            // console.log("since",since);
            // console.log("limit",until);
            let zones = get(registryService)
            if (zones.length > 0) {
                getZones(filters, page, limit).then((_zones) => {
                    zones = [
                        ...zones,
                        ..._zones.filter(zone =>
                            !zones.some(existing => existing.id === zone.id)
                        )
                    ];
                    set(zones)
                })
                return zones
            } else {
                zones = await getZones(filters, page, limit)
                set(zones)
                return zones
            }
        }
    };
};

export const registryService = service();
