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
          let results = await Promise.all([fetchProfile(address),fetchFollowList(address)])
          const profile = results[0] as Profile;
          profile.followList = results[1] as Array<string>;
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
