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
      const profileId = await createProcess();
      console.log("ProfileId", profileId);
      await evaluateProfile(profileData, profileId);
      
  
      // const profileId = await permaweb.createProfile({
      //   userName: profileData.userName,
      //   displayName: profileData.displayName || profileData.userName,
      //   description: profileData.description,
      //   thumbnail: profileData.thumbnail,
      //   banner: profileData.banner,
      // }, (value) => {
      //   console.log("Value from Create Profile", value);
      // })

      if (!profileId) {
        throw new Error("Profile creation failed - no ID returned");
      }

      return profileId;
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

async function evaluateProfile(profileData: ProfileCreateData, profileId: string) {
  try{
    await sleep(3000);
    await evalProcess(luaModule, profileId);
    console.log("*** PROFILE ID ****", profileId);
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
    const result = await permaweb.updateProfile(args, profileId);

    console.log("**REsults***", result);
  }catch(e){
    await evaluateProfile(profileData, profileId);
  }
  
}


export const profileService = service();


function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// import { fetchEvents, fetchFollowList, fetchProfile } from "$lib/ao/relay";
// import type { Profile } from "$lib/models/Profile";
// import { get, writable, type Readable } from "svelte/store";
// import Arweave from "arweave";
// import { connect, createDataItemSigner } from "@permaweb/aoconnect";
// import Permaweb from "@permaweb/libs";

// interface ProfileService extends Readable<Map<string, any>> {
//   get: (address: string) => Promise<Profile>;
// }

// const service = (): ProfileService => {
//   const { subscribe, set } = writable<Map<string, any>>(
//     new Map<string, any>()
//   );
//   return {
//     subscribe,
//     get: async (address: string) => {
//       let profiles = get(profileService);
//       if (profiles.has(address)) {
//         fetchProfile(address).then((profile) => {
//           fetchFollowList(address).then((followList) => {
//             profile.followList = followList
//             profiles.set(profile.address, profile)
//             set(profiles)
//           })
//         })
//         return profiles.get(address)
//       } else {
//         try {
//           let profile = await fetchProfile(address)
//           profile.followList = await fetchFollowList(address)
//           profiles.set(profile.address, profile)
//           set(profiles)
//           return profile
//         } catch (error) {
//           console.log(error)
//           let profile: Profile = {
//             name: "Anonymous",
//             about: undefined,
//             picture: undefined,
//             display_name: "Anonymous",
//             address: address,
//             followList: [],
//             website: undefined,
//             banner: undefined,
//             bot: undefined,
//             created_at: 1740359833,
//             updated_at: undefined
//           }
//           profiles.set(profile.address, profile)
//           set(profiles)
//           return profile
//           //throw (error)
//         }
//       }
//     },
//   };
// };

// export const profileService = service();
