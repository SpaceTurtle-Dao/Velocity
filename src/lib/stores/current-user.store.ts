import { get, writable, type Readable } from "svelte/store";
import type { Profile } from "$lib/models/Profile";
import { event, fetchFollowList, fetchProfile } from "$lib/ao/relay";
import { addressStore } from "./address.store";
import { push } from "svelte-spa-router";
import type { Tag } from "$lib/models/Tag";
import { profileService } from "$lib/services/ProfileService";

export interface CurrentUserStore extends Readable<Profile> {
  fetch: () => Promise<void>;
  set: (profile: Profile) => void;
  follow: (address: string) => Promise<void>;
  unfollow: (address: string) => Promise<void>;
}

const initCurrentUserStore = () => {
  const { subscribe, set, update } = writable<Profile>();
  let hubId: string = "";

  // Add function to get hubId
  async function getHubId() {
    const { address } = get(addressStore);
    if (address) {
      const profile = await profileService.get(address);
      hubId = profile.hubId;
      return hubId;
    }
    return "";
  }

  return {
    subscribe,
    fetch: async () => {
      console.log("checking for address");
      const { address } = get(addressStore);
      console.log("got address");
      try {
        if (address) {
          await getHubId(); // Initialize hubId when fetching user data
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
    follow: async (address: string) => {
      try {
        if (!hubId) {
          await getHubId();
        }

        const _currentUser = get(currentUser);
        _currentUser.followList.push(address);

        let kind: Tag = { name: "Kind", value: "3" };
        let pTag: Tag = { name: "p", value: JSON.stringify(_currentUser.followList) };
        let tags: Tag[] = [kind, pTag];

        await event(hubId, tags);

        set(_currentUser);
      } catch (error) {
        console.error(error);
      }
    },

    unfollow: async (address: string) => {
      try {
        if (!hubId) {
          await getHubId();
        }

        const _currentUser = get(currentUser);
        const followListSet = new Set(_currentUser.followList);
        followListSet.delete(address);
        _currentUser.followList = Array.from(followListSet);

        let kind: Tag = { name: "Kind", value: "3" };
        let pTag: Tag = { name: "p", value: JSON.stringify(_currentUser.followList) };
        let tags: Tag[] = [kind, pTag];

        await event(hubId, tags);

        set(_currentUser);
      } catch (error) {
        console.error(error);
      }
    },

    set
  };
};

export const currentUser = initCurrentUserStore();
