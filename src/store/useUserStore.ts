import { create } from "zustand";

export const useUserStore = create((set) => ({
  userInfo: { name: "Gamer", role: "Admin" },
  count: 0,
  // 修改状态的 Action
  increaseCount: () => set((state) => ({ count: state.count + 1 })),
  updateName: (newName) =>
    set((state) => ({ userInfo: { ...state.userInfo, name: newName } })),
}));
