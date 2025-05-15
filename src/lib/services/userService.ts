import { HUB_REGISTRY_ID, PROFILE_REGISTRY_ID } from "$lib/constants";
import {
  APP_INFO,
  GATEWAY,
  PERMISSIONS,
} from "$lib/constants/wallet.constants";
import type { Hub } from "$lib/models/Hub";
import type { Profile } from "$lib/models/Profile";
import type { Zone } from "$lib/models/Zone";
import { hubRegistryService } from "$lib/services/HubRegistryService";
import { hubService } from "$lib/services/HubService";
import { profileService } from "$lib/services/ProfileService";
import { writable, type Readable, get } from "svelte/store";

export interface UserStoreData {
  address: string;
  hub: Hub;
  zone: Zone;
  profile:Profile;
}

export interface UserStore extends Readable<(UserStoreData | undefined)> {
  setup: (address:string) => Promise<void>;
  unfollow: (hubId: string) => Promise<void>;
  follow: (hubId: string) => Promise<void>;
}

const initUserStore = (): UserStore => {
  const { set, subscribe } = writable<UserStoreData| undefined>();
  return {
    subscribe,
    setup: async (address:string): Promise<void> => {
      try {
        console.log("setting up")
        const zone = await hubRegistryService.getZoneById(HUB_REGISTRY_ID(), address)
        const hub = await hubService.info(zone?.spec.processId);
        const profiles = await profileService.fetchProfiles(zone?.spec.processId, [zone.spec.processId]);
        const profile = profiles.get(address)
        if(!profile) return;
        console.log("setup complete")
        set({
          address: address,
          zone: zone,
          hub: hub,
          profile:profile
        });
      } catch (error) {
        console.log(error);
        // To avoding loop of callbacks on address.subscribe callbacks
        set(undefined);
      }
    },
    unfollow: async (hubId: string) => {
      let _currentUser = get(currentUser)
      if (!_currentUser) return
      _currentUser.hub.Following = _currentUser.hub.Following.filter((value) => value != hubId);
      set(_currentUser);
      hubService.updateFollowList(_currentUser.zone.spec.processId, _currentUser.hub.Following);
      hubService.updateFollowList(hubId, _currentUser.hub.Following);
    },

    follow: async (hubId: string) => {
      let _currentUser = get(currentUser)
      if (!_currentUser) return
      if (_currentUser.hub.Following.includes(hubId)) return;
      _currentUser.hub.Following.push(hubId);
      set(_currentUser);
      hubService.updateFollowList(_currentUser.zone.spec.processId, _currentUser.hub.Following);
      hubService.updateFollowList(hubId, _currentUser.hub.Following);
    },
  };
  
};

export const currentUser = initUserStore();


