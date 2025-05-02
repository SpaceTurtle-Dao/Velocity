import { HUB_REGISTRY_ID } from "$lib/constants";
import {
  APP_INFO,
  GATEWAY,
  PERMISSIONS,
} from "$lib/constants/wallet.constants";
import type { Zone } from "$lib/models/Zone";
import { hubRegistryService } from "$lib/services/HubRegistryService";
import type { Option } from "$lib/types/option";
import { writable, type Readable, get } from "svelte/store";

export interface AddressStoreData {
  address: Option<string>;
  hub: Option<Zone>;
}

export interface AddressStore extends Readable<AddressStoreData> {
  sync: () => Promise<string | undefined>;
  isConnected: () => Promise<boolean>;
  connectWallet: () => Promise<void>;

  disconnectWallet: () => Promise<void>;
}

const initAddressStore = (): AddressStore => {
  const { set, subscribe } = writable<AddressStoreData>({ address: undefined, hub: undefined });

  return {
    subscribe,
    sync: async (): Promise<string | undefined> => {
      try {
        const address = await window.arweaveWallet.getActiveAddress();
        const hub = await hubRegistryService.getZoneById(HUB_REGISTRY_ID(), address)
        set({
          address: address,
          hub: hub
        });
        return address
      } catch (error: unknown) {
        console.error(error);

        // To avoding loop of callbacks on address.subscribe callbacks
        if (get(addressStore).address !== null) set({ address: undefined, hub: undefined });
      }
    },
    isConnected: async (): Promise<boolean> => {
      try {
        const address = await window.arweaveWallet.getActiveAddress();
        const hub = await hubRegistryService.getZoneById(HUB_REGISTRY_ID(), address)
        let permissions = await window.arweaveWallet.getPermissions()
        let hasPermissions = true
        for (var i = 0; i < 0; i++) {
          let permission = PERMISSIONS[i];
          if (!permissions.includes(permission)) hasPermissions = false;
        }
        if (hasPermissions) set({
          address: address,
          hub: hub
        });
        return hasPermissions
      } catch (error: unknown) {
        console.error(error);

        // To avoding loop of callbacks on address.subscribe callbacks
        if (get(addressStore).address !== null) set({ address: undefined, hub: undefined });
        return false
      }
    },
    connectWallet: async () => {
      if (get(addressStore).address) return;
      try {
        await window.arweaveWallet.connect(PERMISSIONS, APP_INFO, GATEWAY);

        await addressStore.sync();
      } catch (error) {
        console.error("Failed to Connect", error);
      }
    },

    disconnectWallet: async () => {
      try {
        await window.arweaveWallet.disconnect();

        set({ address: undefined, hub: undefined });
      } catch (error) {
        console.error("Failed to Disconnect", error);
      }
    },
  };
};

export const addressStore = initAddressStore();
