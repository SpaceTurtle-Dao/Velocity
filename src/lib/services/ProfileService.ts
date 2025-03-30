import { connect, createDataItemSigner } from "@permaweb/aoconnect";
import Arweave from "arweave";
import Permaweb from "@permaweb/libs";
import { get, writable, type Readable } from "svelte/store";
import type { Profile } from "$lib/models/Profile";
import { evalProcess } from "$lib/ao/relay";
import { luaModule } from "./profile_lua";
import { createProcess } from "$lib/ao/process.svelte";
import { walletAddress, setWalletAddress } from "$lib/stores/walletStore";

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
  banner?: string;
}

interface ProfileUpdateData extends ProfileCreateData {
  userName: string;
  displayName?: string;
  description?: string;
  thumbnail?: string;
  banner?: string;
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
        return profiles.get(address);
      }

      try {
        const profile = await permaweb.getProfileByWalletAddress(address);
        console.log("*** Profile ***", profile);
        console.log(profile);
        profiles.set(address, profile);
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
      
  
      // const profileId = await permaweb.createProfile({
      //   userName: profileData.userName,
      //   displayName: profileData.displayName || profileData.userName,
      //   description: profileData.description,
      //   thumbnail: profileData.thumbnail,
      //   banner: profileData.banner,
      // }, (value) => {
      //   console.log("Value from Create Profile", value);
      // })

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
          banner: profileData.banner,
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
      banner: profileData.banner,
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