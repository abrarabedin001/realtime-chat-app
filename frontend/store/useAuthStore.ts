

import { create } from "zustand"
import { axiosInstance } from '../lib/axios';

interface User {
  _id: string;
  fullName: string;
  email: string;
  profilePic: string;
}



import { devtools, persist } from 'zustand/middleware';

interface useAuthStoreState {
  authUser: User | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;

  checkAuth: () => void;
  setAuthUser: (authUser: User | null) => void;

}

export const useAuthStore = create<useAuthStoreState>()(
  devtools(
    persist(
      (set) => ({
        authUser: null,
        isSigningUp: false,
        isLoggingIn: false,
        isUpdatingProfile: false,

        isCheckingAuth: true,

        checkAuth: async () => {
          try {
            const res = await axiosInstance.get("/auth/check")
            set({ authUser: res.data })
          }
          catch (err) {
            console.error("Error in checkAuth:", err)
            set({ authUser: null })
          } finally {
            set({ isCheckingAuth: false })
          }
        },
        setAuthUser: (authUser: User | null) => set({ authUser }),




      }),
      { name: 'signInStoreMassDm' },
    ),
  ),
);
