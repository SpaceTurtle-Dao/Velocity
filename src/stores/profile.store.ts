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
  id: string; 
  author: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
  };
  content: string;
  createdAt: string; 
  updatedAt: string;
  metrics: {
    marketCap: number;
    tokenPrice: number;
    commentsCount: number;
    sharesCount: number;
    likesCount: number;
  };
  tags: string[];
  isEdited: boolean;
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
});