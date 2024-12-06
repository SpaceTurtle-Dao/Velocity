import { derived } from "svelte/store";
import { addressStore } from "./address.store";

export const isConnected = derived(addressStore, ({ address }) => {
  if (address) {
    return true;
  }
  return false;
});
