import { get, writable, type Readable } from "svelte/store";
import type { Profile } from "$lib/models/Profile";
import { fetchProfile } from "$lib/ao/relay";
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
      console.log("checking for address");
      const { address } = get(addressStore);
      console.log("got address");
      try {
        if (address) {
          console.log("fetching Profile");
          const profile = await fetchProfile(address);
          console.log("Got Profiles");

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
