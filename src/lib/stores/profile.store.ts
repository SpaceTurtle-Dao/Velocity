import type { Meme } from "$lib/models/Meme";
import type { Profile, UserInfo } from "$lib/models/Profile";
import { writable } from "svelte/store";
import { info, relay, relays } from "$lib/ao/relay";

export enum ProfileState {
  Empty = "Empty",
  Loading = "Loading",
  Loaded = "Loaded",
  Error = "Error"
}

export enum WalletState {
  Disconnected = "Disconnected",
  Connecting = "Connecting",
  Connected = "Connected",
  Error = "Error"
}

export const isConnected = writable<boolean>(false);
export const profileState = writable<ProfileState>();
export const walletState = writable<WalletState>();



export const user = writable<UserInfo>();
export const currentUser = writable<UserInfo>();

export const userRelay = writable<string>();

export const followers = writable<Array<string>>([]);
export const userEvents = writable<Array<Event>>([]);
export const feedEvents = writable<Array<Event>>([]);


export async function aoconnect() {
  if (window.arweaveWallet) {
    try {
      walletState.set(WalletState.Connecting);
      const address = await window.arweaveWallet.getActiveAddress();
      if (address) {
        let _relay = await relay(address);
        walletState.set(WalletState.Connected);
        if (_relay) {
          profileState.set(ProfileState.Loading);
          let _currentUser = await info(_relay);
          profileState.set(ProfileState.Loaded);
          currentUser.set(_currentUser);
          user.set(_currentUser);
        } else {
          profileState.set(ProfileState.Empty);
        }
      }
    } catch (error) {
      // console.error("Failed to get active address:", error);
      console.log("Failed to get active address:", error);
      walletState.set(WalletState.Disconnected);
      profileState.set(ProfileState.Empty);
      // isConnected.set(false);
    }
  } else {
    // console.log()
  }
}






// User Data Store
/*export const userData = writable<UserData>({
  username: "Nickzz_AO",
  displayName: "Nickkzz",
  avatar: "/Users/nickk/Documents/Meme_Market_Frontend/src/assets/sunny.jpeg",
  bio: "Exploring the intersection of social media and crypto. Building the future of decentralized communication.",
  followers: 5280,
  following: 420,
  totalMarketCap: 156000
});

// Posts Store
export const posts = writable<Post[]>([
  {
    id: "1",
    author: {
      id: "user123",
      username: "Nickzz_AO",
      displayName: "Nickkzz",
      avatarUrl: "/Users/nickk/Documents/Meme_Market_Frontend/src/assets/sunny.jpeg"
    },
    content: "Just launched our new bonding curve algorithm! 🚀 The future of social media is here. #CryptoTwitter #Web3",
    createdAt: "2024-09-01T10:00:00Z",
    updatedAt: "2024-09-01T10:00:00Z",
    metrics: {
      marketCap: 2500,
      tokenPrice: 0.05,
      commentsCount: 42,
      sharesCount: 18,
      likesCount: 105
    },
    tags: ["CryptoTwitter", "Web3"],
    isEdited: false
  },
  {
    id: "2",
    author: {
      id: "user123",
      username: "Nickzz_AO",
      displayName: "Nickkzz",
      avatarUrl: "/Users/nickk/Documents/Meme_Market_Frontend/src/assets/sunny.jpeg"
    },
    content: "Thoughts on using market cap for content recommendation? Let's discuss the pros and cons. 🤔 #ContentDiscovery",
    createdAt: "2024-09-01T07:00:00Z",
    updatedAt: "2024-09-01T07:30:00Z",
    metrics: {
      marketCap: 1800,
      tokenPrice: 0.03,
      commentsCount: 37,
      sharesCount: 12,
      likesCount: 89
    },
    tags: ["ContentDiscovery"],
    isEdited: true
  },
]);

export const activeTab = writable<'posts' | 'marketCap'>('posts');

export const marketCapData = writable<MarketCapData>({
  labels: ['7d', '6d', '5d', '4d', '3d', '2d', '1d'],
  data: [120000, 125000, 140000, 135000, 150000, 145000, 156000]
});*/