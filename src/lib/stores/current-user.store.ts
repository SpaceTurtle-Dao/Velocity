import { get, writable, type Readable } from "svelte/store";
import type { Profile } from "$lib/models/Profile";
import { fetchFollowList, fetchProfile } from "$lib/ao/relay";
import { addressStore } from "./address.store";
import { push } from "svelte-spa-router";

export interface CurrentUserStore extends Readable<Profile> {
  fetch: () => Promise<void>;
  set: (profile: Profile) => void;
}

const initCurrentUserStore = () => {
  const { subscribe, set } = writable<Profile>();

  return {
    subscribe,
    set: (profile: Profile) => {
      set(profile);
    },
    fetch: async () => {
      const { address } = get(addressStore);
      try {
        if (address) {
          const profile = await fetchProfile(address);
          const followList = await fetchFollowList(address);
          set(profile);
          push("/feed");
        }
      } catch (error) {
        console.error(error);

        if (error instanceof TypeError) {
          // This error will come if the Content is undefined, That mean user dont have a profile
          if (error.message.includes("Cannot read properties of undefined")) {
            // navigate to signup page
            push("/signup");
          }
        }
      }
    },
  };
};

export const currentUser = initCurrentUserStore();
