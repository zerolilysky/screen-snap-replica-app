
export interface User {
  id: string;
  name: string;
  avatar: string;
  gender: 'male' | 'female';
  age?: number;
  distance?: string;
  location?: string;
  online?: boolean;
  verified?: boolean;
  profileCompleted?: boolean;
}

export interface Post {
  id: string;
  content: string;
  author: User;
  likes: number;
  comments: number;
  time: string;
  image?: string;
  tags?: string[];
}

export interface Topic {
  id: string;
  title: string;
  participants: number;
  icon?: string;
  timeRange?: string;
}

export interface Couple {
  id: string;
  leftUser: string;
  rightUser: string;
  imageLeft: string;
  imageRight: string;
}

export interface Article {
  id: string;
  title: string;
  image: string;
  likes: number;
  comments: number;
  date: string;
}

export interface Concept {
  id: string;
  title: string;
  description: string;
}
