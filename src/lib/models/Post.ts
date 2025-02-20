import type { Profile } from "./Profile";

export interface Post {
  id: string;
  from: string;
  timestamp: number;
  content: string;
  profile: Profile;
  mimeType:string | undefined;
  url:string | undefined;
  rePost:Post | undefined;
  replies:Post[];
  reposted:Post[];
  type: PostType;
}


export enum PostType {
  Root,
  Reply,
  Repost,
  Media
}