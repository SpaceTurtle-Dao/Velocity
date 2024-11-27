export type UserInfo = {
  Events: number;
  Profile: Profile;
  Subs: number;
  Subscriptions: number;
  CreatedAt: number;
};

export type Profile = {
  name: string;
  about?: string;
  picture?: string;
  display_name: string;
  address: string;
  followList: [string];
  website?: string;
  banner?: string;
  bot?: boolean;
  created_at?: string;
  updated_at?: string;
};

export const profileFromEvent = (event: any): Profile => {
  if (event.Kind == "0") return JSON.parse(event.Content);
  throw 400;
};
