import { getZone, getZones, register } from "$lib/ao/relay";
import { get, writable, type Readable } from "svelte/store";
import type { Zone } from "$lib/models/Zone";
export interface HubRegistryService extends Readable<Map<string, Zone>> {
  getZones: (processId: string, filters: string, page: Number, limit: Number) => Promise<void>;
  getZoneById: (processId: string, owner: string) => Promise<void>;
  fetchZones: (processId: string, filters: string, page: Number, limit: Number) => Promise<Zone[]>;
  register: (processId: string, spec: any) => Promise<void>;
}

const service = (): HubRegistryService => {
  const { subscribe, set, update } = writable<Map<string, Zone>>(new Map<string, any>());
  return {
    subscribe,
    register: async (processId: string, spec: any): Promise<void> => {
      register(processId, spec)
    },
    getZones: async (processId: string, filters: string, page: Number, limit: Number): Promise<void> => {
      let zones = get(hubRegistryService)
      if (zones.size > 0) {
        getZones(processId, filters, page, limit).then((_zones) => {
          zones = new Map([...zones, ..._zones])
          console.log(zones)
          set(zones)
        })
      } else {
        let _zones = await getZones(processId, filters, page, limit)
        for(var i = 0; i < _zones.length; i++){
          zones.set(_zones[i].owner,_zones[i])
        }
        set(zones)
      }
    },
    fetchZones: async (processId: string, filters: string, page: Number, limit: Number): Promise<Zone[]> => {
      return await getZones(processId, filters, page, limit)
    },
    getZoneById: async (processId: string, owner: string): Promise<void> => {
      let zones = get(hubRegistryService)
      if (zones.has(owner)) {
        getZone(processId, owner).then((_zones) => {
          for(var i = 0; i < _zones.length; i++){
            zones.set(_zones[i].owner,_zones[i])
          }
          set(zones)
        })
        console.log(zones)
      } else {
        console.log("doesn't have zone")
        let _zones = await getZone(processId, owner)
        console.log(_zones)
        for(var i = 0; i < _zones.length; i++){
          zones.set(_zones[i].owner,_zones[i])
        }
        set(zones)
        console.log(zones)
      }
    },
  };
};

export const hubRegistryService = service();
