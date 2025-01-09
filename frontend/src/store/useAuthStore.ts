import { create } from "zustand"
import { axiosInstance } from '../lib/axios';
import { io, Socket } from "socket.io-client";



interface User {
  _id: string;
  fullName: string;
  email: string;
  createdAt: string;
  profilePic: string;
}

// const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";


import { devtools, persist } from 'zustand/middleware';
import toast from "react-hot-toast";

interface useAuthStoreState {
  authUser: User | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: string[];
  socket: Socket | null;

  checkAuth: () => void;
  setAuthUser: (authUser: User | null) => void;
  signup: (data: { fullName: string; email: string; password: string }) => void;
  login: (data: { email: string; password: string }) => void;
  logout: () => void;
  updateProfile: (data: { profilePic: string | ArrayBuffer | null }) => void;
  connectSocket: () => void;
  disconnectSocket: () => void;


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
        onlineUsers: [],
        socket: null,

        checkAuth: async () => {
          try {
            const res = await axiosInstance.get("/auth/check")
            console.log("res.data", res.data)
            // set({ authUser: res.data })
          }
          catch (err) {
            console.error("Error in checkAuth:", err)
            set({ authUser: null })
          } finally {
            set({ isCheckingAuth: false })
          }
        },
        setAuthUser: (authUser: User | null) => set({ authUser }),
        signup: async (data) => {
          set({ isSigningUp: true });
          try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");
            // get().connectSocket();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) { // changed type to 'any'
            toast.error(error.response.data.message);
          } finally {
            set({ isSigningUp: false });
          }
        },

        login: async (data) => {
          set({ isLoggingIn: true });
          try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");

            // get().connectSocket();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) { // changed type to 'any'
            toast.error(error.response.data.message);
          } finally {
            set({ isLoggingIn: false });
          }
        },

        logout: async () => {
          try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
            // get().disconnectSocket();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) { // changed type to 'any'
            toast.error(error.response.data.message);
          }
        },
        updateProfile: async (data) => {
          set({ isUpdatingProfile: true });
          try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) { // changed type to 'any'
            console.log("error in update profile:", error);
            toast.error(error.response.data.message);
          } finally {
            set({ isUpdatingProfile: false });
          }
        },

        connectSocket: () => {
          // const { authUser } = get();
          // if (!authUser || get().socket?.connected) return;

          // const socket = io(BASE_URL, {
          //   query: {
          //     userId: authUser._id,
          //   },
          // });
          // socket.connect();

          // set({ socket: socket });

          // socket.on("getOnlineUsers", (userIds) => {
          //   set({ onlineUsers: userIds });
          // });
        },
        disconnectSocket: () => {
          // if (get().socket?.connected) get()?.socket?.disconnect();
        },





      }),
      { name: 'userAuthStore' },
    ),
  ),
);
