
export interface Topic {
  id: string;
  title: string;
  icon?: string;
  color?: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  image?: string;
  tags?: string[];
}

export interface Concept {
  id: string;
  title: string;
  description: string;
  image?: string;
  tags?: string[];
}

export interface Post {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    location?: string;
    gender: 'male' | 'female' | 'unknown';
    verified?: boolean;
  };
  likes: number;
  comments: number;
  time: string;
  image?: string;
  tags?: string[];
}

export interface MatchOption {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
}

export interface Couple {
  id: string;
  name: string;
  created_at: string;
  user1: {
    id: string;
    nickname: string;
    avatar: string;
  };
  user2: {
    id: string;
    nickname: string;
    avatar: string;
  };
}
