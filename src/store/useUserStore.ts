import { create } from "zustand";

interface UserInfo {
  name: string;
  role: string;
}

interface UserState {
  userInfo: UserInfo;
  count: number;
  increaseCount: () => void;
  updateName: (newName: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  userInfo: { name: "Gamer", role: "Admin" },
  count: 0,
  increaseCount: () => set((state) => ({ count: state.count + 1 })),
  updateName: (newName) =>
    set((state) => {
      return { userInfo: { ...state.userInfo, name: newName } };
    }),
}));
