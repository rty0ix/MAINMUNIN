import { create } from 'zustand';

interface User {
  username: string;
  isAdmin: boolean;
  approved: boolean;
}

interface AuthState {
  user: User | null;
  users: User[];
  setUser: (user: User | null) => void;
  addUser: (user: User) => void;
  approveUser: (username: string) => void;
  rejectUser: (username: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  users: [],
  setUser: (user) => set({ user }),
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
  approveUser: (username) => set((state) => ({
    users: state.users.map(u => 
      u.username === username ? { ...u, approved: true } : u
    )
  })),
  rejectUser: (username) => set((state) => ({
    users: state.users.filter(u => u.username !== username)
  }))
}));