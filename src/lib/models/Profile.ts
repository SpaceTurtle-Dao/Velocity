export type UserInfo = {
  Events: number;
  Profile: Profile;
  Subs: number;
  Subscriptions: number;
  CreatedAt: number;
};

export type Profile = {
  displayName: string;
  about?: string;
  profileImage?: string;
  coverImage?: string;
  userName: string;
  description?: string;
  id: string;
  owner: string;
  followList?: string[];
  website?: string;
  thumbnail?: string;
  bot?: boolean;
  dateCreated: number;
  updated_at?: number;
};

export const profileFromEvent = (event: any): Profile => {
  if (event.Kind == "0") return JSON.parse(event.Content);
  throw 400;
};
