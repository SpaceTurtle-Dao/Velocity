import { HUB_REGISTRY_ID } from "$lib/constants";
import type { Hub } from "$lib/models/Hub";
import type { Profile, ProfileCreateData } from "$lib/models/Profile";
import type { Tag } from "$lib/models/Tag";
import type { Zone } from "$lib/models/Zone";
import { hubRegistryService } from "$lib/services/HubRegistryService";
import { hubService } from "$lib/services/HubService";
import { profileService } from "$lib/services/ProfileService";
import { writable, type Readable, get } from "svelte/store";
import { event, payedEvent, queryFee } from "$lib/ao/relay";

export interface UserStoreData {
  address: string;
  hub: Hub;
  zone: Zone;
  profile: Profile;
}

export interface UserStore extends Readable<(UserStoreData | undefined)> {
  setup: (address: string) => Promise<void>;
  unfollow: (hubId: string) => Promise<void>;
  follow: (hubId: string) => Promise<void>;
  updateProfile: (hubId: string, profile: Profile) => Promise<void>;
  createEvent: (hubId: string, tags: Tag[], kind:string) => Promise<void>
}

const initUserStore = (): UserStore => {
  const { set, subscribe } = writable<UserStoreData | undefined>();
  return {
    subscribe,
    setup: async (address: string): Promise<void> => {
      try {
        console.log("setting up")
        const zone = await hubRegistryService.getZoneById(HUB_REGISTRY_ID(), address)
        console.log(zone)
        const hub = await hubService.info(zone?.spec.processId);
        console.log(hub)
        const profiles = await profileService.fetchProfiles(hub.Spec.processId, [hub.Spec.processId]);
        console.log(profiles)
        const profile = profiles.get(address)
        if (!profile) return;
        console.log("setup complete")
        set({
          address: address,
          zone: zone,
          hub: hub,
          profile: profile
        });
      } catch (error) {
        console.log(error);
        // To avoding loop of callbacks on address.subscribe callbacks
        set(undefined);
      }
    },
    unfollow: async (hubId: string) => {
      let _currentUser = get(currentUser)
      if (!_currentUser) return
      _currentUser.hub.Following = _currentUser.hub.Following.filter((value) => value != hubId);
      set(_currentUser);
      await hubService.updateFollowList(_currentUser.hub.Spec.processId, _currentUser.hub.Following);
    },

    follow: async (hubId: string) => {
      let _currentUser = get(currentUser)
      if (!_currentUser) return
      if (_currentUser.hub.Following.includes(hubId)) return;
      _currentUser.hub.Following.push(hubId);
      set(_currentUser);
      await hubService.updateFollowList(_currentUser.hub.Spec.processId, _currentUser.hub.Following);
    }, 
    updateProfile: async (hubId: string, profile: Profile): Promise<void> => {
      try {
        await createProfile(hubId, profile)
      } catch (error) {
        console.log("Failed to register profile:", error);
        throw (error)
      }
    }, 
    createEvent: async (hubId: string, tags: Tag[], kind:string) => {
      try {
        await event(hubId, tags);
      } catch (e) {
        console.log(e)
      }
      /*console.log(hubId)
      let _currentUser = get(currentUser)
      let fee = (await queryFee(hubId, kind)).requiredFee
      console.log(fee)
      if (!_currentUser) return
      if (fee == 0) {
        try {
          await event(hubId, tags);
        } catch (e) {
          console.log(e)
        }
      } else {
        //payedEvent
        try {
          let payload = JSON.stringify(tags)
          await payedEvent(hubId, fee, payload)
        } catch (e) {
          console.log(e)
        }
      }*/
    },
  };
};

async function createProfile(hubId: string, profileData: ProfileCreateData) {
  try {
    let tags: Array<Tag> = [];
    // Prepare the content for the event
    const content = JSON.stringify(profileData);

    const kindTag: Tag = {
      name: "Kind",
      value: "0",
    };

    const contentTag: Tag = {
      name: "Content",
      value: content,
    };
    tags.push(kindTag);
    tags.push(contentTag);
    await event(hubId, tags)
  } catch (err) {
    console.log(err)
  }
}

export const currentUser = initUserStore();


