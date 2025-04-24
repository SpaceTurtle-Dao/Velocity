import { connect, createDataItemSigner } from "@permaweb/aoconnect";
import Arweave from "arweave";
import Permaweb from "@permaweb/libs";
import { get, writable, type Readable } from "svelte/store";
import type { Profile } from "$lib/models/Profile";
import { evalProcess, updateProfile } from "$lib/ao/relay";
import { luaModule } from "./profile_lua";
import { createProcess } from "$lib/ao/process.svelte";
import { walletAddress, setWalletAddress } from "$lib/stores/walletStore";
import { profileRegistryService } from './ProfileRegistryService';
import { hubRegistryService } from './HubRegistryService';
import type { Spec } from "$lib/models/Spec";
import { hubService } from './HubService';
import type { Tag } from "$lib/models/Tag";
import { P } from "flowbite-svelte";
import { CU_URL, GATEWAY_URL, HUB_REGISTRY_ID, MU_URL, PROFILE_REGISTRY_ID } from "$lib/constants";

interface ProfileService extends Readable<Map<string, any>> {
  create: (profileData: ProfileCreateData) => Promise<string>;
  update: (
    processId: string, data: string
  ) => Promise<string>;

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

    /*get: async (address: string) => {
      let profile: Profile = {
        userName: "Anonymous",
        description: undefined,
        profileImage: undefined,
        displayName: "Anonymous",
        id: address,
        owner: address,
        website: undefined,
        thumbnail: undefined,
        bot: undefined,
        dateCreated: Math.floor(Date.now() / 1000),
        updated_at: undefined
      };
      let profiles = get(profileService);

      if (profiles.has(address)) {
        profile = profiles.get(address);
      }
      try {
        profileRegistryService.getZoneById(PROFILE_REGISTRY_ID(), address)
      } catch (error) {
        console.log("Profile not found, creating anonymous profile", error);
      }
      return profile;
    },*/


    create: async (profileData: ProfileCreateData): Promise<string> => {
      try {
        const processId = await createProcess();
        console.log("ProfileId", processId);
        await evaluateProfile(profileData, processId);
        const hubId = await hubService.create();
        const hubSpec = {
          type: "hub",
          kinds: ["1", "7", "6", "3", "2"],
          description: "Social message hub",
          version: "1.0.0",
          processId: hubId
        };
        const profileSpec = {
          type: "profile",
          userName: profileData.userName,
          displayName: profileData.displayName || "",
          description: profileData.description || "",
          thumbnail: profileData.thumbnail || "",
          coverImage: profileData.coverImage || "",
          processId: processId
        };
        await hubRegistryService.register(HUB_REGISTRY_ID(), hubSpec);
        await profileRegistryService.register(PROFILE_REGISTRY_ID(), profileSpec);
        console.log("*** Hub ID ***", hubId);
        console.log("*** Profile ID ***", processId);
        return processId;
      } catch (error) {
        console.log("Failed to register profile:", error);
        throw (error)
      }
    },

    update: async (
      processId: string, data: string
    ): Promise<string> => {
      try {
        await updateProfile(processId, data)
      } catch (e) {
        console.log(e)
      }
      return processId
    },


  };
};

async function evaluateProfile(profileData: ProfileCreateData, processId: string) {
  try {
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
        MU_URL: MU_URL(),
        CU_URL: CU_URL(),
        GATEWAY_URL: GATEWAY_URL(),
      },),
      arweave: Arweave.init({}),
      signer: createDataItemSigner(wallet),
    });
    const result = await permaweb.updateProfile(args, processId);

    console.log("**REsults***", result);
  } catch (e) {
    await evaluateProfile(profileData, processId);
  }

}


export const profileService = service();


function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}