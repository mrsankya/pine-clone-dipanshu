
export interface Pin {
  id: string;
  title: string;
  imageUrl: string;
  author: string;
  userId?: string;
  heightRatio?: number; // For masonry layout simulation
  likedBy?: string[]; // Array of user IDs who liked this pin
}

export interface PinFormData {
  title: string;
  file: File | null;
}

export interface User {
  id: string;
  username: string;
  email: string;
  token?: string;
  role: 'admin' | 'user';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Notification {
  id: string;
  recipientId: string;
  senderId: string;
  senderName: string;
  type: 'like';
  pinId: string;
  pinImage: string;
  message: string;
  isRead: boolean;
  createdAt: number;
}
