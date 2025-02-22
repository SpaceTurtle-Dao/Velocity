import type { Profile } from "./Profile";

export interface Post {
  id: string;
  from: string;
  timestamp: number;
  content: string;
  mimeType:string | undefined;
  url:string | undefined;
  rePost:Post | undefined;
  reposted:Post[];
  type: PostType;
  e:string | undefined;
  p:string | undefined;
}


export enum PostType {
  Root,
  Reply,
  Repost,
  Media
}