export type UserInfo = {
  Events: number;
  Profile: Profile;
  Subs: number;
  Subscriptions: number;
  CreatedAt: number;
};

export type Profile = {
  displayName: string;
  profileImage?: string;
  coverImage?: string;
  userName: string;
  description?: string;
  id: string;
  owner: string;
  from:string;
  website?: string;
  thumbnail?: string;
  bot?: boolean;
  created_at: number;
  updated_at?: number;
};

export type ProfileCreateData = {
  userName: string;
  displayName?: string;
  description?: string;
  thumbnail?: string;
  coverImage?: string;
  bot?: boolean;
  website?: string;
}

export const profileFromEvent = (event: any): Profile => {
  if (event.Kind == "0") return JSON.parse(event.Content);
  throw 400;
};
