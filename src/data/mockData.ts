
import { User, Post, Topic, Couple, Article, Concept } from '../types';

export const currentUser: User = {
  id: '541763035',
  name: '无无无无呜呜呜呜',
  avatar: '/placeholder.svg',
  gender: 'female',
  verified: false,
  profileCompleted: false,
};

export const nearbyUsers: User[] = [
  {
    id: '1',
    name: 'User1',
    avatar: '/placeholder.svg',
    gender: 'male',
    distance: '100m内',
    online: true
  },
  {
    id: '2',
    name: 'User2',
    avatar: '/placeholder.svg',
    gender: 'female',
    distance: '100m内',
    online: true
  },
  {
    id: '3',
    name: 'User3',
    avatar: '/placeholder.svg',
    gender: 'female',
    distance: '100m内',
    online: false
  },
  {
    id: '4',
    name: 'User4',
    avatar: '/placeholder.svg',
    gender: 'female',
    distance: '100m内',
    online: true
  }
];

export const topics: Topic[] = [
  {
    id: '1',
    title: '语音派对',
    participants: 24,
    timeRange: '05:00-13:00'
  },
  {
    id: '2',
    title: '土多啤梨没有土',
    participants: 24
  },
  {
    id: '3',
    title: '这是一首小歌',
    participants: 30
  },
  {
    id: '4',
    title: '是白小胖儿吗',
    participants: 27
  }
];

export const feedPosts: Post[] = [
  {
    id: '1',
    content: '无无无无呜呜呜呜',
    author: {
      id: '101',
      name: '无无无无呜呜呜呜',
      avatar: '/placeholder.svg',
      gender: 'female',
      location: '北京市',
      online: true,
      verified: false
    },
    likes: 24,
    comments: 0,
    time: '刚刚',
    tags: []
  },
  {
    id: '2',
    content: '关我屁事',
    author: {
      id: '102',
      name: 'User102',
      avatar: '/placeholder.svg',
      gender: 'male',
      location: '山西省',
      online: false,
      verified: true
    },
    likes: 34,
    comments: 0,
    time: '刚刚',
    tags: ['VIP', '真名实名']
  },
  {
    id: '3',
    content: '该隐X',
    author: {
      id: '103',
      name: '该隐X',
      avatar: '/placeholder.svg',
      gender: 'female',
      location: '浙江省',
      online: true,
      verified: true
    },
    likes: 29,
    comments: 0,
    time: '1小时前',
    tags: ['VIP', '中', '真名实名']
  }
];

export const communityPosts: Post[] = [
  {
    id: '4',
    content: '感冒真的好难受 嗓子巨痛!',
    author: {
      id: '104',
      name: '淼西',
      avatar: '/placeholder.svg',
      gender: 'female',
      location: '河北省',
      online: false
    },
    likes: 11,
    comments: 1,
    time: '2小时前',
    tags: ['谁能懂我啊!']
  },
  {
    id: '5',
    content: '谁懂45cm软床垫的救赎感',
    author: {
      id: '105',
      name: '我变坏了吗',
      avatar: '/placeholder.svg',
      gender: 'female',
      location: '浙江省',
      online: true
    },
    likes: 24,
    comments: 5,
    time: '4小时前',
    image: '/placeholder.svg',
    tags: ['人哪有不疯的!']
  },
  {
    id: '6',
    content: '我尊脚要生气啦',
    author: {
      id: '106',
      name: '我尊脚要生气啦',
      avatar: '/placeholder.svg',
      gender: 'female',
      location: '',
      online: false
    },
    likes: 0,
    comments: 0,
    time: '刚刚',
    tags: ['真名']
  }
];

export const articles: Article[] = [
  {
    id: '1',
    title: '社交距离也太难把握了吧！',
    content: '社交距离也太难把握了，需要考虑很多因素...',
    author: '心理专家',
    image: '/placeholder.svg',
    likes: 117,
    comments: 29,
    date: '2025/01/16'
  },
  {
    id: '2',
    title: '交朋友、约会、恋爱，也是有进度条的吗',
    content: '人际关系发展的各个阶段...',
    author: '情感咨询师',
    image: '/placeholder.svg',
    likes: 116,
    comments: 28,
    date: '2025/01/02'
  },
  {
    id: '3',
    title: '人际交往中的边界感有多重要？',
    content: '边界感在人际交往中起着至关重要的作用...',
    author: '社会心理学家',
    image: '/placeholder.svg',
    likes: 89,
    comments: 26,
    date: '2024/11/27'
  }
];

export const concepts: Concept[] = [
  {
    id: '1',
    title: '邓巴数',
    description: '「邓巴数」是指，能与某个人维持紧密人际关系的人数上限。...'
  },
  {
    id: '2',
    title: '爱情三角理论',
    description: '心理学家Sternberg提出的「三角理论」。他认为...'
  }
];

export const couples: Couple[] = [
  {
    id: '1',
    name: 'GHOST & BEAST',
    created_at: '2025-01-15',
    user1: {
      id: '201',
      nickname: 'GHOST_',
      avatar: '/placeholder.svg'
    },
    user2: {
      id: '202',
      nickname: 'BEAST_',
      avatar: '/placeholder.svg'
    },
    leftUser: 'GHOST_',
    rightUser: 'BEAST_',
    imageLeft: '/placeholder.svg',
    imageRight: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'Puff & emotional',
    created_at: '2025-01-10',
    user1: {
      id: '203',
      nickname: '_Puff',
      avatar: '/placeholder.svg'
    },
    user2: {
      id: '204',
      nickname: 'emotional_',
      avatar: '/placeholder.svg'
    },
    leftUser: '_Puff',
    rightUser: 'emotional_',
    imageLeft: '/placeholder.svg',
    imageRight: '/placeholder.svg'
  }
];

export const trends: {id: string; title: string; participants: number; icon?: string}[] = [
  { id: '1', title: '我笑起来真好看', participants: 1428, icon: '😊' },
  { id: '2', title: '被小动物治愈了', participants: 8584, icon: '🐱' },
  { id: '3', title: '美食治愈一切！', participants: 45899, icon: '🍱' },
  { id: '4', title: '去看看诗', participants: 48398, icon: '🐦' },
];
