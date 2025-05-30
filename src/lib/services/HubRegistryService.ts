import { getZone, getZones, register } from "$lib/ao/relay";
import { get, writable, type Readable } from "svelte/store";
import type { Zone } from "$lib/models/Zone";
export interface HubRegistryService extends Readable<Map<string, Zone>> {
  getZones: (processId: string, filters: string, page: Number, limit: Number) => Promise<void>;
  getZoneById: (processId: string, owner: string) => Promise<Zone>;
  search: (processId: string, value: string, page: Number, limit: Number) => Promise<Zone[]>;
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

          set(zones)
        })
      } else {
        let _zones = await getZones(processId, filters, page, limit)
        for (var i = 0; i < _zones.length; i++) {
          zones.set(_zones[i].owner, _zones[i])
        }
        set(zones)
      }
    },
    search: async (processId: string, value: string, page: Number, limit: Number): Promise<Zone[]> => {
      const filters = JSON.stringify({
        search: value,
      });
      console.log("starting search")
      let zones = await getZones(processId, filters, page, limit)
      console.log("end search")
      console.log(zones)

      return zones.filter((zone) => zone.spec.profile)
    },
    fetchZones: async (processId: string, filters: string, page: Number, limit: Number): Promise<Zone[]> => {
      return await getZones(processId, filters, page, limit)
    },
    getZoneById: async (processId: string, owner: string): Promise<Zone> => {
      let zones = get(hubRegistryService)
      let zone = zones.get(owner)
      if (zone) {
        getZone(processId, owner).then((_zone) => {
          zones.set(_zone.owner, _zone)
          set(zones)
        })

        return zone
      } else {
        console.log("fetching zone")
        let zone = await getZone(processId, owner)
        zones.set(zone.owner, zone)
        set(zones)
        return zone
      }
    },
  };
};

export const hubRegistryService = service();
