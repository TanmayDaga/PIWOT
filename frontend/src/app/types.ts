interface User {
    id: string;
    name: string;
    username: string;
    avatarUrl: string;
  }
  
  interface Post {
    id: string;
    content: string;
    createdAt: string;
    likes: number;
    comments: number;
    author: User;
    imageUrl?: string;
  }

  interface Community {
    id: string;
    name: string;
    description: string;
    memberCount: number;
    imageUrl: string;
    isJoined: boolean;
    category: string;
  }