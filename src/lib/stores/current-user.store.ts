import { get, writable, type Readable } from "svelte/store";
import type { Profile } from "$lib/models/Profile";
import { event, fetchFollowList, fetchProfile } from "$lib/ao/relay";
import { addressStore } from "./address.store";
import { push } from "svelte-spa-router";
import type { Tag } from "$lib/models/Tag";

export interface CurrentUserStore extends Readable<Profile> {
  fetch: () => Promise<void>;
  set: (profile: Profile) => void;
}

const initCurrentUserStore = () => {
  const { subscribe, set, update } = writable<Profile>();

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
          let _profile = fetchProfile(address);
          let _followList = fetchFollowList(address);
          let promises = [_profile,_followList];
          let results = await Promise.all(promises)
          let profile:Profile = results[0] as Profile;
          let followList:string[] = results[1] as string[];
          profile.followList = followList
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
    follow: async (address: string) => {
      try {
        const _currentUser = get(currentUser);
        _currentUser.followList.push(address);

        let kind: Tag = { name: "Kind", value: "3" };

        let pTag: Tag = { name: "p", value: JSON.stringify(_currentUser.followList) };

        let tags: Tag[] = [kind, pTag];

        await event(tags);

        set(_currentUser);
      } catch (error) {
        console.error(error);
      }
    },

    unfollow: async (address: string) => {
      try {
        const _currentUser = get(currentUser);
        const followListSet = new Set(_currentUser.followList);
        followListSet.delete(address);
        _currentUser.followList = followListSet.values().toArray()

        let kind: Tag = { name: "Kind", value: "3" };

        let pTag: Tag = { name: "p", value: JSON.stringify(_currentUser.followList) };

        let tags: Tag[] = [kind, pTag];

        await event(tags);

        set(_currentUser);
      } catch (error) {
        console.error(error);
      }
    },
  };
};

export const currentUser = initCurrentUserStore();
