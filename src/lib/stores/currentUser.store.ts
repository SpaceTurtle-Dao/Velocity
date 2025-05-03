import { HUB_REGISTRY_ID } from "$lib/constants";
import {
  APP_INFO,
  GATEWAY,
  PERMISSIONS,
} from "$lib/constants/wallet.constants";
import type { Hub } from "$lib/models/Hub";
import type { Zone } from "$lib/models/Zone";
import { hubRegistryService } from "$lib/services/HubRegistryService";
import { hubService } from "$lib/services/HubService";
import type { Option } from "$lib/types/option";
import { writable, type Readable, get } from "svelte/store";

export interface UserStoreData {
  address: Option<string>;
  hub: Option<Hub>;
  zone: Option<Zone>;
}

export interface UserStore extends Readable<UserStoreData> {
  sync: () => Promise<string | undefined>;
  isConnected: () => Promise<boolean>;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  unsubscribe: (hubId: string) => Promise<void>;
  subscribe_: (hubId: string) => Promise<void>;
}

const initUserStore = (): UserStore => {
  const { set, subscribe } = writable<UserStoreData>({ address: undefined, zone: undefined, hub: undefined });
  return {
    subscribe,
    sync: async (): Promise<string | undefined> => {
      let _currentUser = get(currentUser)
      try {
        const address = await window.arweaveWallet.getActiveAddress();
        set({
          address: address,
          zone: undefined,
          hub: undefined
        });
        return address
      } catch (error: unknown) {
        console.error(error);

        // To avoding loop of callbacks on address.subscribe callbacks
        if (_currentUser.address !== null) set({ address: undefined, zone: undefined, hub: undefined });
      }
    },
    isConnected: async (): Promise<boolean> => {
      let _currentUser = get(currentUser)
      try {
        const address = await window.arweaveWallet.getActiveAddress();
        let permissions = await window.arweaveWallet.getPermissions()
        let hasPermissions = true
        for (var i = 0; i < 0; i++) {
          let permission = PERMISSIONS[i];
          if (!permissions.includes(permission)) hasPermissions = false;
        }
        if (hasPermissions) {
          const zone = await hubRegistryService.getZoneById(HUB_REGISTRY_ID(), address)
          const hub = await hubService.info(zone?.spec.processId);
          set({
            address: address,
            zone: zone,
            hub: hub
          });
        }
        return hasPermissions
      } catch (error: unknown) {
        console.log(error);

        // To avoding loop of callbacks on address.subscribe callbacks
        if (_currentUser.address !== null) set({ address: undefined, zone: undefined, hub: undefined });
        return false
      }
    },
    connectWallet: async () => {
      let _currentUser = get(currentUser)
      if (_currentUser.address) return;
      try {
        await window.arweaveWallet.connect(PERMISSIONS, APP_INFO, GATEWAY);
        await currentUser.sync()
      } catch (error) {
        console.error("Failed to Connect", error);
      }
    },

    disconnectWallet: async () => {
      try {
        await window.arweaveWallet.disconnect();
        set({ address: undefined, zone: undefined, hub: undefined });
      } catch (error) {
        console.error("Failed to Disconnect", error);
      }
    },

    unsubscribe: async (hubId: string) => {
      let _currentUser = get(currentUser)
      if ((!_currentUser.address || !_currentUser.zone || !_currentUser.hub)) return
      _currentUser.hub.Following = _currentUser.hub.Following.filter((value) => value != hubId);
      set(_currentUser);
      await hubService.updateFollowList(_currentUser.zone.spec.processId, _currentUser.hub.Following);
    },

    subscribe_: async (hubId: string) => {
      let _currentUser = get(currentUser)
      if ((!_currentUser.address || !_currentUser.zone || !_currentUser.hub)) return
      if (_currentUser.hub.Following.includes(hubId)) return;
      _currentUser.hub.Following.push(hubId);
      set(_currentUser);
      await hubService.updateFollowList(_currentUser.zone.spec.processId, _currentUser.hub.Following);
    },
  };
};

export const currentUser = initUserStore();


