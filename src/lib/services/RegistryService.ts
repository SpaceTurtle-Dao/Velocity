import { fetchEvents, getZone, getZones, register } from "$lib/ao/relay";
import { get, writable, type Readable } from "svelte/store";
import { PostType, type Post } from "$lib/models/Post";
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
                      ..._zones.filter(
                        (zone) =>
                          !zones.some(
                            (existing) => existing.owner === zone.owner
                          )
                      ),
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
            let _zones = zones.filter(zone => zone.owner == owner)
            console.log(_zones)
            if (_zones.length > 0) {
                getZone(owner).then((zone) => {
                    if (zone) {
                        zones = [
                          ...zones,
                          ...(Array.isArray(zone) ? zone : [zone]).filter(
                            (zone) =>
                              !zones.some(
                                (existing) => existing.owner === zone.owner
                              )
                          ),
                        ];
                        set(zones)
                    }
                })
                console.log(zones)
                return _zones[0]
            } else {
                const zone = await getZone(owner)
                if (zone) {
                    const newZone = Array.isArray(zone) ? zone[0] : zone;
                    zones = [
                      ...zones,
                      ...(newZone ? [newZone] : []).filter(
                        (zone) =>
                          !zones.some(
                            (existing) => existing.owner === zone.owner
                          )
                      ),
                    ];
                    set(zones)
                    console.log(zones)
                    return newZone;
                }
                throw new Error("Zone not found");
            }
        },
    };
};

export const registryService = service();
