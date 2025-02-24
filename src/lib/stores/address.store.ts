import {
  APP_INFO,
  GATEWAY,
  PERMISSIONS,
} from "$lib/constants/wallet.constants";
import type { Option } from "$lib/types/option";
import { writable, type Readable, get } from "svelte/store";

export interface AddressStoreData {
  address: Option<string>;
}

export interface AddressStore extends Readable<AddressStoreData> {
  sync: () => Promise<void>;
  isConnected: () => Promise<boolean>;
  connectWallet: () => Promise<void>;

  disconnectWallet: () => Promise<void>;
}

const initAddressStore = (): AddressStore => {
  const { set, subscribe } = writable<AddressStoreData>({ address: undefined });

  return {
    subscribe,
    sync: async () => {
      try {
        const address = await window.arweaveWallet.getActiveAddress();

        set({ address });
      } catch (error: unknown) {
        console.error(error);

        // To avoding loop of callbacks on address.subscribe callbacks
        if (get(addressStore).address !== null) set({ address: null });
      }
    },
    isConnected: async (): Promise<boolean> => {
      try {
        const address = await window.arweaveWallet.getActiveAddress();
        let permissions = await window.arweaveWallet.getPermissions()
        let hasPermissions = true
        for(var i = 0; i<0; i++){
          let permission = PERMISSIONS[i];
          if(!permissions.includes(permission)) hasPermissions = false;
        }
        if(hasPermissions) set({ address });
        return hasPermissions
      } catch (error: unknown) {
        console.error(error);

        // To avoding loop of callbacks on address.subscribe callbacks
        if (get(addressStore).address !== null) set({ address: null });
        return false
      }
    },
    connectWallet: async () => {
      if(get(addressStore).address) return;
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

        set({ address: null });
      } catch (error) {
        console.error("Failed to Disconnect", error);
      }
    },
  };
};

export const addressStore = initAddressStore();
