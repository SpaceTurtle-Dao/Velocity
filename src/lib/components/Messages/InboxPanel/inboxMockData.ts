// Types for our mock data
interface ChatUser {
    id: string;
    name: string;
    username: string;
    avatarUrl?: string;
  }
  
  interface ChatMessage {
    id: string;
    senderId: string;
    content: string;
    timestamp: string;
    read: boolean;
  }
  
  interface ChatThread {
    user: ChatUser;
    lastMessage: ChatMessage;
    unreadCount: number;
  }
  
  // Mock users with different name lengths and scenarios
  const mockUsers: ChatUser[] = [
    {
      id: "1",
      name: "John Doe",
      username: "@johndoe",
      avatarUrl: "https://github.com/shadcn.png"
    },
    {
      id: "2",
      name: "Alexandra Richardson-Montgomery",
      username: "@alex_richardson_montgomery",
      avatarUrl: "https://github.com/shadcn.png"
    },
    {
      id: "3",
      name: "Li",
      username: "@really_long_username_that_should_truncate",
    },
    {
      id: "4",
      name: "María José González de la Torre",
      username: "@mjg",
      avatarUrl: "https://github.com/shadcn.png"
    },
    {
      id: "5",
      name: "Bob",
      username: "@bob123",
    }
  ];
  
  // Mock messages with different lengths and content
  const mockMessages: ChatMessage[] = [
    {
      id: "msg1",
      senderId: "1",
      content: "Hey, how are you?",
      timestamp: "2m",
      read: true
    },
    {
      id: "msg2",
      senderId: "2",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      timestamp: "5m",
      read: false
    },
    {
      id: "msg3",
      senderId: "3",
      content: "🎉 🎈 🎊",
      timestamp: "1h",
      read: true
    },
    {
      id: "msg4",
      senderId: "4",
      content: "Please review the latest changes to the project when you have a chance. I've updated the documentation and added new features.",
      timestamp: "2h",
      read: false
    },
    {
      id: "msg5",
      senderId: "5",
      content: "k",
      timestamp: "1d",
      read: true
    }
  ];
  
  // Combine into chat threads
  const mockChatThreads: ChatThread[] = [
    {
      user: mockUsers[0],
      lastMessage: mockMessages[0],
      unreadCount: 0
    },
    {
      user: mockUsers[1],
      lastMessage: mockMessages[1],
      unreadCount: 3
    },
    {
      user: mockUsers[2],
      lastMessage: mockMessages[2],
      unreadCount: 1
    },
    {
      user: mockUsers[3],
      lastMessage: mockMessages[3],
      unreadCount: 12
    },
    {
      user: mockUsers[4],
      lastMessage: mockMessages[4],
      unreadCount: 0
    }
  ];
  
  export { mockChatThreads };