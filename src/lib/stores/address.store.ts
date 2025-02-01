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

    connectWallet: async () => {
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
