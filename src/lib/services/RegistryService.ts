// users-profile.store.ts
import { fetchEvents, getZone, getZones, register } from "$lib/ao/relay";
import { get, writable, type Readable } from "svelte/store";
import { PostType, type Post } from "$lib/models/Post";
import { connect, createDataItemSigner, spawn } from "@permaweb/aoconnect";
import Permaweb, { type ProcessCreateType } from "@permaweb/libs";
import Arweave from "arweave";
import { HUB_MESSAGE_ID } from "$lib/constants";
import type { Zone } from "$lib/models/Zone";
import type { Spec } from "$lib/models/Spec";
export interface RegistryService extends Readable<Zone[]> {
    getZones: (filters: string, page: Number, limit: Number) => Promise<Zone[]>;
    getZoneById: (owner: string) => Promise<Zone>;
    register: (spec:Spec) => Promise<void>;
}

const service = (): RegistryService => {
    const { subscribe, set, update } = writable<Zone[]>([]);
    return {
        subscribe,
        register: async (spec:Spec): Promise<void> => {
            register(spec)
        },
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
        },
        getZoneById: async (owner: string): Promise<Zone> => {
            let zones = get(registryService)
            let _zones = zones.filter(zone => zone.id == owner)
            if (_zones.length > 0) {
                getZone(owner).then((_zones) => {
                    zones = [
                        ...zones,
                        ..._zones.filter(zone =>
                            !zones.some(existing => existing.id === zone.id)
                        )
                    ];
                    set(zones)
                })
                return _zones[0]
            } else {
                zones = await getZone(owner)
                zones = [
                    ...zones,
                    ..._zones.filter(zone =>
                        !zones.some(existing => existing.id === zone.id)
                    )
                ];
                set(zones)
                let temp = zones.filter(zone => zone.id == owner)
                return temp[0]
            }
        },
    };
};

export const registryService = service();
