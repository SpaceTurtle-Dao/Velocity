import { getZone, getZones, register } from "$lib/ao/relay";
import { get, writable, type Readable } from "svelte/store";
import type { Zone } from "$lib/models/Zone";
export interface ProfileRegistryService extends Readable<Map<string, Zone>> {
  getZones: (processId: string, filters: string, page: Number, limit: Number) => Promise<void>;
  getZoneById: (processId: string, owner: string) => Promise<Zone>;
  fetchZones: (processId: string, filters: string, page: Number, limit: Number) => Promise<Zone[]>;
  register: (processId: string, spec: any) => Promise<void>;
}

const service = (): ProfileRegistryService => {
  const { subscribe, set, update } = writable<Map<string, Zone>>(new Map<string, any>());
  return {
    subscribe,
    register: async (processId: string, spec: any): Promise<void> => {
      register(processId, spec)
    },
    getZones: async (processId: string, filters: string, page: Number, limit: Number): Promise<void> => {
      let zones = get(profileRegistryService)
      if (zones.size > 0) {
        getZones(processId, filters, page, limit).then((_zones) => {
          zones = new Map([...zones, ..._zones])
          console.log(zones)
          set(zones)
        })
      } else {
        let temp = await getZones(processId, filters, page, limit)
        let _zones = new Map(temp.map((zone) => [zone.owner, zone.value]));
        zones = new Map([...zones, ..._zones])
        set(zones)
      }
    },
    fetchZones: async (processId: string, filters: string, page: Number, limit: Number): Promise<Zone[]> => {
      return await getZones(processId, filters, page, limit)
    },
    getZoneById: async (processId: string, owner: string): Promise<Zone> => {
      console.log("Profile Registry")
      console.log(processId)
      let zones = get(profileRegistryService)
      let zone = zones.get(owner)
      if (zone) {
        console.log("Has Profile")
        getZone(processId, owner).then((_zone) => {
          console.log(_zone)
          zones.set(_zone.owner, _zone)
          set(zones)
        })
        return zone
      } else {
        console.log("doesn't have Profile")
        let _zone = await getZone(processId, owner)
        console.log(_zone)
        zones.set(_zone.owner, _zone)
        set(zones)
        return _zone 
      }
    },
  };
};

export const profileRegistryService = service();