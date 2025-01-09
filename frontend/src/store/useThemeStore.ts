import { create } from "zustand"
import { devtools, persist } from 'zustand/middleware';

interface useThemeStoreState {
  theme: string;
  setTheme: (theme: string) => void;



}

export const useThemeStore = create<useThemeStoreState>()(
  devtools(
    persist(
      (set) => ({
        theme: localStorage.getItem("chat-theme") || "coffee",
        setTheme: (theme) => {
          localStorage.setItem("chat-theme", theme);
          set({ theme });
        },
      }),
      { name: 'useThemeStore' },
    ),
  )
)
