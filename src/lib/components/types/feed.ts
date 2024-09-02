export interface Post {
  Id: string;
  ProcessId: string;
  Creator: string;
  Created_at: number;
  Kind: number;
  Tags: string[];
  Content: string;
  Engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  Analytics: {
    views: number;
    clicks: number;
  };
  MediaUrl?: string;
}

export interface CreatePostData {
  content: string;
  mediaFile: File | null;
}