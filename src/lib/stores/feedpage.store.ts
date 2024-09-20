// import { writable } from "svelte/store";
// import type { Event } from "$lib/models/Event";

// // Reusing the events from the profile store
// let event1: Event = {
//   id: "8f4e867bcf2c4a63944c2c04bbd28be3",
//   pubkey: "a3b35fe237529f80798e4a5c4f6d12be",
//   created_at: 1684312352,
//   kind: 1,
//   content: "Check out this cool video about Svelte!",
//   tags: [
//     ["title", "Svelte Introduction"],
//     ["thumb", "https://arweave.net/Ov0Xea2kWa5GS1DCEmeF0aoct8rbJwDmizmTo9bQrtY"],
//     ["published_at", "1684312352"],
//     ["url", "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"],
//     ["m", "video/mp4"],
//     ["size", "1048576"],
//     ["duration", "180"],
//     ["dim", "1280x720"]
//   ]
// };

// let event2: Event = {
//   id: "9f8e762bc2d4b859443e1a05bbd29cf4",
//   pubkey: "b3c45ae138739f80897f5b6d5e7e24cf",
//   created_at: 1685312452,
//   kind: 1,
//   content: "A deep dive into web development trends.",
//   tags: [
//     ["title", "Web Development Trends 2024"],
//     ["thumb", "https://arweave.net/Ive8YUyCU0FQEBSc8UjfTlQYFZY5s8t45gqsNf3uJMw"],
//     ["published_at", "1685312452"],
//     ["url", "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"],
//     ["m", "video/mp4"],
//     ["size", "2097152"],
//     ["duration", "240"],
//     ["dim", "1920x1080"]
//   ]
// };

// // Create more events for the feed
// let event3: Event = {
//   id: "7d2c654ab1e3c951332f0b06aac17de2",
//   pubkey: "c2d34bf027628e70986g4a7c3f8e13dg",
//   created_at: 1686412552,
//   kind: 1,
//   content: "Exploring the latest features in JavaScript ES2024",
//   tags: [
//     ["title", "JavaScript ES2024 Features"],
//     ["thumb", "https://arweave.net/Xve9YUyCU0FQEBSc8UjfTlQYFZY5s8t45gqsNf3uKNx"],
//     ["published_at", "1686412552"],
//     ["url", "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"],
//     ["m", "video/mp4"],
//     ["size", "3145728"],
//     ["duration", "300"],
//     ["dim", "1920x1080"]
//   ]
// };

// export const feedEvents = writable<Array<Event>>([event1, event2, event3]);

// export function addEventToFeed(newEvent: Event) {
//   feedEvents.update(events => [newEvent, ...events]);
// }

// // Function to remove events from the feed
// export function removeEventFromFeed(eventId: string) {
//   feedEvents.update(events => events.filter(event => event.id !== eventId));
// }


import { writable } from "svelte/store";


export interface Meme {
  BondingCurve: string
  Post: Post
  Denomination: string
  AmountB: string
  AmountA: string
  Dumps: number
  createdAt: number
  Creator: string
  Module: string
  Supply: string
  Analytics: Analytics
  TokenB: string
  Pumps: number
  TokenA: string
  IsPump: boolean
  Pool: string
  IsActive: boolean
  Replies: number
  Profile: Profile
  Holders: Holders
}

export interface Post {
  Tags: any[]
  Content: string
  Kind: string
}

export interface Analytics {
  WeekVolume: WeekVolume
  Volume: string
  Buys: number
  HourVolume: HourVolume
  MarketCap: number
  Liquidty: string
  Price: string
  MontlyVolume: MontlyVolume
  DayVolume: DayVolume
}

export interface WeekVolume {
  Past: string
  Now: string
}

export interface HourVolume {
  Past: string
  Now: string
}

export interface MontlyVolume {
  Past: string
  Now: string
}

export interface DayVolume {
  Past: string
  Now: string
}

export interface Profile {
  Image: string
  CreatedAt: number
  Name: string
  Creator: string
}

export interface Holders {
  count: number
  top10: number
  dev: number
}

export const currentUser = writable<Profile | null>(null);
export const feedPosts = writable<Meme[]>([]);
export const replies = writable<Meme[]>([]);
