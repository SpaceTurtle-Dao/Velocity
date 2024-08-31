import { writable } from "svelte/store";

// interfaces.ts
export interface User {
  id: string;
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
  userId: string;
  content: string;
  timestamp: string;
  marketCap: number;
  tokenPrice: number;
  comments: number;
  shares: number;
}

export const currentUser = writable<User | null>(null);
export const feedPosts = writable<Post[]>([]);
