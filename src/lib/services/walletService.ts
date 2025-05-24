import { HUB_REGISTRY_ID, PROFILE_REGISTRY_ID } from "$lib/constants";
import {
  APP_INFO,
  GATEWAY,
  PERMISSIONS,
} from "$lib/constants/wallet.constants";
import type { Hub } from "$lib/models/Hub";
import type { Zone } from "$lib/models/Zone";
import { hubRegistryService } from "$lib/services/HubRegistryService";
import { hubService } from "$lib/services/HubService";
import { profileService } from "$lib/services/ProfileService";
import { writable, type Readable, get } from "svelte/store";

export interface UserStore extends Readable<(string | undefined)> {
  isConnected: () => Promise<void>;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
}

const service = (): UserStore => {
  const { set, subscribe } = writable<string | undefined>();
  return {
    subscribe,
    isConnected: async (): Promise<void> => {
      let hasPermissions = false;
      try {
        let address = await window.arweaveWallet.getActiveAddress()
        let permissions = await window.arweaveWallet.getPermissions()
        hasPermissions = PERMISSIONS.every((permission) => permissions.includes(permission));
        if(hasPermissions) set(address);
      } catch (error) {
        console.log(error);
      }
    },
    connectWallet: async () => {
      try {
        await window.arweaveWallet.connect(PERMISSIONS, APP_INFO, GATEWAY);
        
        walletService.isConnected()
      } catch (error) {
        // To avoding loop of callbacks on address.subscribe callbacks
        console.log("Failed to Connect", error);
      }
    },

    disconnectWallet: async () => {
      try {
        await window.arweaveWallet.disconnect();
        set(undefined);
      } catch (error) {
        console.error("Failed to Disconnect", error);
      }
    },
  };
  
};

export const walletService = service();


