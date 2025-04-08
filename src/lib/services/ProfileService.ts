import { connect, createDataItemSigner } from "@permaweb/aoconnect";
import Arweave from "arweave";
import Permaweb from "@permaweb/libs";
import { get, writable, type Readable } from "svelte/store";
import type { Profile } from "$lib/models/Profile";
import { evalProcess, updateProfile } from "$lib/ao/relay";
import { luaModule } from "./profile_lua";
import { createProcess } from "$lib/ao/process.svelte";
import { walletAddress, setWalletAddress } from "$lib/stores/walletStore";
import { registryService } from './RegistryService';
import type { Spec } from "$lib/models/Spec";
import { hubService } from './HubService';
import type { Tag } from "$lib/models/Tag";
import { P } from "flowbite-svelte";

interface ProfileService extends Readable<Map<string, any>> {
  get: (address: string) => Promise<Profile>;
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

    get: async (address: string) => {
      let profile: Profile = {
        userName: "Anonymous",
        about: undefined,
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
        permaweb.getProfileByWalletAddress(address).then((_profile) => {
          if (_profile) {
            profile = _profile;
          }
          profiles.set(address, profile);
          set(profiles);
        });
      } catch (error) {
        console.log("Profile not found, creating anonymous profile", error);
      }
      return profile;
    },


    create: async (profileData: ProfileCreateData): Promise<string> => {
      try {
        const processId = await createProcess();
        console.log("ProfileId", processId);
        await evaluateProfile(profileData, processId);
        const hubId = await hubService.create();
        const hubSpec: Spec = {
          type: "hub",
          kinds: ["1", "7", "6", "3", "2"],
          description: "Social message hub",
          version: "1.0.0",
          processId: hubId
        };
        await registryService.register(hubSpec);
        console.log("*** Hub ID ***", hubId);
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
        MU_URL: "https://mu.ao-testnet.xyz",
        CU_URL: "https://cu.ao-testnet.xyz",
        GATEWAY_URL: "https://arweave.net",
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