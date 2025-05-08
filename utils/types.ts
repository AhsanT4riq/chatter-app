interface ChatRoom {
  id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  sender_name: string;
  sender_photo: string;
  chatroom_id: string;
  created_at: string;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  imageUrl: string;
}

export type { ChatRoom, Message, User };
