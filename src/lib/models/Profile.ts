import type { Event } from "$lib/models/Event"

export type UserInfo = {
  Process:string,
  Token: string,
  Events: number,
  Profile: Profile,
  SubscriptionCost: number,
  FeedCost: number,
  Subs: number,
  Subscriptions: number
}

export type Profile = {
  name: string,
  about?: string,
  picture?: string,
  display_name: string,
  website?: string,
  banner?: string,
  bot?: boolean
}

export const profileFromEvent = (event:Event) : Profile => {
  if (event.kind == 0) return JSON.parse(event.content)
  throw(400)
}