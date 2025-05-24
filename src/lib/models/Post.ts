export interface Post {
  id: string;
  original_Id:string;
  from: string;
  owner: string;
  timestamp: number;
  content: string;
  mimeType:string | undefined;
  url:string | undefined;
  rePost:Post | undefined;
  reposted:Post[];
  type: PostType;
  e:string | undefined;
  p:string | undefined;
  event:any;
}


export enum PostType {
  Root,
  Reply,
  Repost,
  Media
}