import { connect, createDataItemSigner } from "@permaweb/aoconnect";
import Arweave from "arweave";
import Permaweb from "@permaweb/libs";
import { get, writable, type Readable } from "svelte/store";
import type { Profile } from "$lib/models/Profile";
import { evalProcess } from "$lib/ao/relay";
import { luaModule } from "./profile_lua";
import { createProcess } from "$lib/ao/process.svelte";
import { walletAddress, setWalletAddress } from "$lib/stores/walletStore";
import { hubService } from './HubService';
import { currentHubId } from '$lib/stores/hubStore';

interface ProfileService extends Readable<Map<string, any>> {
  get: (address: string) => Promise<Profile>;
  create: (profileData: ProfileCreateData) => Promise<string>;
  update: (
    profileData: ProfileUpdateData,
    profileId: string
  ) => Promise<string>;
  getById: (profileId: string) => Promise<Profile>;
}

interface ProfileCreateData {
  userName: string;
  displayName?: string;
  description?: string;
  thumbnail?: string;
  coverImage?: string;
}

interface ProfileUpdateData extends ProfileCreateData {
  userName: string;
  displayName?: string;
  description?: string;
  thumbnail?: string;
  coverImage?: string;
}

const service = (): ProfileService => {
  const wallet =
    typeof window !== "undefined"
      ? window.arweaveWallet
      : ""
    
  const permaweb = Permaweb.init({
    ao: connect(),
    arweave: Arweave.init({}),
    signer: createDataItemSigner(wallet),
  });

  const { subscribe, set, update } = writable<Map<string, any>>(
    new Map<string, any>()
  );

  return {
    subscribe,

    get: async (address: string) => {
      setWalletAddress(address);
      let profiles = get({ subscribe });

      if (profiles.has(address)) {
        const profile = profiles.get(address);
        if (profile.hubId) {
          currentHubId.set(profile.hubId);
          console.log("*** Current Hub ID ***", profile.hubId);
        }
        return profile;
      }

      try {
        const profile = await permaweb.getProfileByWalletAddress(address);
        console.log("*** Profile ***", profile);
        if (profile.hubId) {
          currentHubId.set(profile.hubId);
          console.log("*** Current Hub ID ***", profile.hubId);
        }
        profiles.set(address, profile);
        console.log("*** Profiles ***", profiles);
        set(profiles);
        return profile;
      } catch (error) {
        console.log("Profile not found, creating anonymous profile", error);

        const anonymousProfile: Profile = {
          userName: "Anonymous",
          about: undefined,
          profileImage: undefined,
          displayName: "Anonymous",
          address: address,
          followList: [],
          website: undefined,
          thumbnail: undefined,
          bot: undefined,
          dateCreated: Math.floor(Date.now() / 1000),
          updated_at: undefined,
          hubId: ""
        };

        profiles.set(address, anonymousProfile);
        set(profiles);
        return anonymousProfile;
      }
    },
    

    create: async (profileData: ProfileCreateData): Promise<string> => {
      const processId = await createProcess();
      console.log("ProfileId", processId);

      await evaluateProfile(profileData, processId);
      
      const hubId = await hubService.create();
      console.log("Created hub with ID:", hubId);
      
      currentHubId.set(hubId);
      console.log("*** Current Hub ID after setting", hubId);
      if (!processId) {
        throw new Error("Profile creation failed - no ID returned");
      }

      // Store the hubId in the profile data
      const profiles = get({ subscribe });
      const address = get(walletAddress);
      if (address) {
        const profile = profiles.get(address);
        if (profile) {
          profile.hubId = hubId;
          profiles.set(address, profile);
          set(profiles);
        }
      }

      return processId;
    },

    update: async (
      profileData: ProfileUpdateData,
      profileId: string
    ): Promise<string> => {
      const updatedProfileId = await permaweb.updateProfile(
        {
          userName: profileData.userName,
          displayName: profileData.displayName || profileData.userName,
          description: profileData.description,
          thumbnail: profileData.thumbnail,
          coverImage: profileData.coverImage,
        },
        profileId
      );

      if (!updatedProfileId) {
        throw new Error("Profile update failed - no ID returned");
      }

      return updatedProfileId;
    },

    getById: async (profileId: string) => {
      const profile = await permaweb.getProfileById(profileId);

      if (!profile) {
        throw new Error("Profile not found");
      }

      let profiles = get({ subscribe });
      profiles.set(profileId, profile);
      if (profile.address) {
        profiles.set(profile.address, profile);
      }
      set(profiles);

      return profile;
    },
  };
};

async function evaluateProfile(profileData: ProfileCreateData, processId: string) {
  try{
    await sleep(3000);
    await evalProcess(luaModule, processId);
    console.log("*** PROFILE ID ****", processId);
    const args = {
      userName: profileData.userName,
      displayName: profileData.displayName || profileData.userName,
      description: profileData.description,
      thumbnail: profileData.thumbnail,
      coverImage: profileData.coverImage,
    };
    const wallet = typeof window !== "undefined" ? window.arweaveWallet : "";
    const permaweb = Permaweb.init({
      ao: connect(),
      arweave: Arweave.init({}),
      signer: createDataItemSigner(wallet),
    });
    const result = await permaweb.updateProfile(args, processId);

    console.log("**REsults***", result);
  }catch(e){
    await evaluateProfile(profileData, processId);
  }
  
}


export const profileService = service();


function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}