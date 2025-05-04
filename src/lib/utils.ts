import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(timestamp: string) {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    
    // If the message is from today, show only time
    const isSameDay = date.getDate() === now.getDate() && 
                      date.getMonth() === now.getMonth() && 
                      date.getFullYear() === now.getFullYear();
    
    if (isSameDay) {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    }
    
    // If the message is from this year, show month and day
    const isSameYear = date.getFullYear() === now.getFullYear();
    if (isSameYear) {
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    }
    
    // Otherwise show the full date
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  } catch (e) {
    return '未知时间';
  }
}
