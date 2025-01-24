export interface Officer {
  id: string;
  name: string;
  badgeNumber: string;
  title: string;
  investigativeRole: string;
  departmentNumber: string;
  defendantName: string;
  phoneNumber?: string;
  agency?: string;
  additionalComments?: string;
  created_at: string;
  verified: boolean;
  flagged: boolean;
}

export interface User {
  id: string;
  email: string;
  role: 'kiosk' | 'admin';
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
}