export interface Post {
  id: string;
  from: string;
  timestamp: number;
  content: string;
  isReply?: boolean;
  isRepost?: boolean;
  originalEvent?: any;
}
