import { connect, createDataItemSigner } from "@permaweb/aoconnect";
import Arweave from "arweave";
import Permaweb from "@permaweb/libs";
import { get, writable, type Readable } from "svelte/store";
import type { Profile } from "$lib/models/Profile";
import { evalProcess } from "$lib/ao/relay";
import { luaModule } from "./profile_lua";
import { createProcess } from "$lib/ao/process.svelte";
import { walletAddress, setWalletAddress } from "$lib/stores/walletStore";
import { registryService } from './RegistryService';
import type { Spec } from "$lib/models/Spec";
import { hubService } from './HubService';

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
        updated_at: undefined
      };
      setWalletAddress(address);
      let profiles = get({ subscribe });

      if (profiles.has(address)) {
        return profiles.get(address);
      }

      try {
        const profile = await permaweb.getProfileByWalletAddress(address);
        const zone = await registryService.getZoneById(address);
        
        console.log("*** Profile ***", zone.spec.processId);
        console.log("*** Zone ***", zone);
        console.log("*** Profile ***", profile);
        console.log("*** Zone ***", zone);
        
        profiles.set(address, profile);
        set(profiles);
        return profile;
      } catch (error) {
        console.log("Profile not found, creating anonymous profile", error);
        //profiles.set(address, anonymousProfile);
        //set(profiles);
        return anonymousProfile;
      }
    },
    

    create: async (profileData: ProfileCreateData): Promise<string> => {
      const processId = await createProcess();
      console.log("ProfileId", processId);
      await evaluateProfile(profileData, processId);

      const hubSpec: Spec = {
        type: "hub",
        kinds: ["1", "7", "6", "3", "2"],
        description: "Social message hub",
        version: "1.0.0",
        processId: processId
      };

      try {
        await registryService.register(hubSpec);
        const hubId = await hubService.create();
        console.log("*** Hub ID ***", hubId);
      } catch (error) {
        console.error("Failed to register profile:", error);
      }

      if (!processId) {
        throw new Error("Profile creation failed - no ID returned");
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
      ao: connect({
        MU_URL: "https://mu.ao-testnet.xyz",
        CU_URL: "https://cu.ao-testnet.xyz",
        GATEWAY_URL: "https://arweave.net",
      },),
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