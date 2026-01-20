import { create } from 'zustand';

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void; // Add logout function to the AuthState interface
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('authToken'), // Retrieve token from localStorage
  setToken: (token) => set({ token }),
  logout: () => {
    set({ token: null });
    localStorage.removeItem('authToken');
  },
}));
