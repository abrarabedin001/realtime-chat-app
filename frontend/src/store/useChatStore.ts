import { create } from "zustand"
import { axiosInstance } from '../lib/axios';
// import { io, Socket } from "socket.io-client";



interface User {
  _id: string;
  fullName: string;
  email: string;
  profilePic: string;
}

interface Message { _id: string, message: string, createdAt: string, updatedAt: string, senderId: string, receiverId: string, text: string, image: string }



import { devtools, persist } from 'zustand/middleware';
import toast from "react-hot-toast";

interface useChatStoreState {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  getUsers: () => void;
  getMessages: (userId: string) => void;
  sendMessage: (messageData: Message) => void;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
  setSelectedUser: (selectedUser: User | null) => void;



}

export const useChatStore = create<useChatStoreState>()(
  devtools(
    persist(
      (set, get) => ({
        messages: [],
        users: [],
        selectedUser: null,
        isUsersLoading: false,
        isMessagesLoading: false,

        getUsers: async () => {
          set({ isUsersLoading: true });
          try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {

            toast.error(error.response.data.message);
          } finally {
            set({ isUsersLoading: false });
          }
        },

        getMessages: async (userId) => {
          set({ isMessagesLoading: true });
          try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            console.log("res.data", res.data)
            set({ messages: res.data });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {

            toast.error(error.response.data.message);
          } finally {
            set({ isMessagesLoading: false });
          }
        },
        sendMessage: async (messageData) => {
          const { selectedUser, messages } = get();
          try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser?._id}`, messageData);
            set({ messages: [...messages, res.data] });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            toast.error(error.response.data.message);
          }
        },

        subscribeToMessages: () => {
          const { selectedUser } = get();
          if (!selectedUser) return;

          // const socket = useAuthStore.getState().socket;

          // socket.on("newMessage", (newMessage) => {
          //   const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
          //   if (!isMessageSentFromSelectedUser) return;

          //   set({
          //     messages: [...get().messages, newMessage],
          //   });
          // });
        },

        unsubscribeFromMessages: () => {
          // const socket = useAuthStore.getState().socket;
          // socket.off("newMessage");
        },

        setSelectedUser: (selectedUser: User | null) => set({ selectedUser }),
      }),
      { name: 'useChatStore' },
    ),
  )
)
