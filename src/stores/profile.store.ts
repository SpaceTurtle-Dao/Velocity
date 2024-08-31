import { writable } from 'svelte/store';

// Interfaces
export interface UserData {
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  totalMarketCap: number;
}

export interface Post {
  id: number;
  content: string;
  timestamp: string;
  marketCap: number;
  tokenPrice: number;
  comments: number;
  shares: number;
}

export interface MarketCapData {
  labels: string[];
  data: number[];
}

// User Data Store
export const userData = writable<UserData>({
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
    id: 1,
    content: "Just launched our new bonding curve algorithm! 🚀 The future of social media is here. #CryptoTwitter #Web3",
    timestamp: "2h ago",
    marketCap: 2500,
    tokenPrice: 0.05,
    comments: 42,
    shares: 18
  },
  {
    id: 2,
    content: "Thoughts on using market cap for content recommendation? Let's discuss the pros and cons. 🤔 #ContentDiscovery",
    timestamp: "5h ago",
    marketCap: 1800,
    tokenPrice: 0.03,
    comments: 37,
    shares: 12
  },
  {
    id: 3,
    content: "New blog post: 'The Attention Economy and Token-Powered Social Media' - check it out! 📝 #AttentionEconomy #Tokenomics",
    timestamp: "1d ago",
    marketCap: 3200,
    tokenPrice: 0.07,
    comments: 56,
    shares: 29
  }
]);

export const activeTab = writable<'posts' | 'marketCap'>('posts');

export const marketCapData = writable<MarketCapData>({
  labels: ['7d', '6d', '5d', '4d', '3d', '2d', '1d'],
  data: [120000, 125000, 140000, 135000, 150000, 145000, 156000]
});