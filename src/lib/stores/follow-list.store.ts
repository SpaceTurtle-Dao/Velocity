import { event, fetchFollowList } from "$lib/ao/relay";
import { get, writable, type Readable } from "svelte/store";
import { currentUser } from "./current-user.store";
import type { Tag } from "$lib/models/Tag";

export interface FollowListStore extends Readable<Set<string>> {
  sync: () => Promise<void>;

  follow: (address: string) => Promise<void>;

  unfollow: (address: string) => Promise<void>;
}

const initFollowListStore = (): FollowListStore => {
  const { subscribe, set, update } = writable<Set<string>>(new Set<string>());

  return {
    subscribe,
    sync: async () => {
      try {
        const { address } = get(currentUser);

        const followListArray = await fetchFollowList(address);

        const followListSet = new Set(followListArray);

        set(followListSet);
      } catch (error) {
        console.error(error);
      }
    },
    follow: async (address: string) => {
      try {
        const followListSet = get(followListStore);

        const followList = Array.from(followListSet);
        followList.push(address);

        let kind: Tag = { name: "Kind", value: "3" };

        let pTag: Tag = { name: "p", value: JSON.stringify(followList) };

        let tags: Tag[] = [kind, pTag];

        await event(tags);

        update((set) => set.add(address));
      } catch (error) {
        console.error(error);
      }
    },

    unfollow: async (address: string) => {
      try {
        const followListSet = get(followListStore);
        followListSet.delete(address);

        const followList = Array.from(followListSet);

        let kind: Tag = { name: "Kind", value: "3" };

        let pTag: Tag = { name: "p", value: JSON.stringify(followList) };

        let tags: Tag[] = [kind, pTag];

        await event(tags);

        update((set) => {
          set.delete(address);

          return set;
        });
      } catch (error) {
        console.error(error);
      }
    },
  };
};

export const followListStore = initFollowListStore();
