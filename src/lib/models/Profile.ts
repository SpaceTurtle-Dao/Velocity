import type { Event } from "$lib/models/Event"

export type UserInfo = {
  Token: string,
  Events: number,
  Profile: Event,
  SubscriptionCost: number,
  FeedCost: number,
  Subs: number,
  Subscriptions: number
}

export type Profile = {
  name: string,
  about: string,
  picture: string | null,
  display_name: string | null,
  website: string | null,
  banner: string | null,
  bot: boolean | null,
}

export const profileFromEvent = (event: Event): Profile => {
  if (event.kind == 0) return JSON.parse(event.content)
  throw (400)
}