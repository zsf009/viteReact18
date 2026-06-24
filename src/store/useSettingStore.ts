import { create } from "zustand";

// ============ zustand vs RTK：对象 state + Record 动态 key ============
// RTK：settingSlice 把 theme/fontSize/loading/errors 内聚到一个 slice，
//      Record 更新靠 immer：state.loading[key] = loading。
// zustand：同样内聚，但 Record 更新要手动展开旧对象（无 immer）。

interface SettingStore {
  theme: "light" | "dark";
  fontSize: number;
  loading: Record<string, boolean>; // 按 key 存储各模块 loading
  errors: Record<string, string | null>; // 按 key 存储各模块错误

  toggleTheme: () => void;
  setFontSize: (size: number) => void;
  setLoading: (key: string, loading: boolean) => void;
  setError: (key: string, error: string | null) => void;
}

export const useSettingStore = create<SettingStore>()((set) => ({
  theme: "light",
  fontSize: 14,
  loading: {},
  errors: {},

  // RTK: state.theme = state.theme === 'light' ? 'dark' : 'light'
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
  setFontSize: (size) => set({ fontSize: size }),

  // RTK（immer）: state.loading[key] = loading
  // zustand：必须展开旧 Record 再覆盖单个 key，否则会整体替换丢数据
  setLoading: (key, loading) =>
    set((state) => ({ loading: { ...state.loading, [key]: loading } })),
  setError: (key, error) =>
    set((state) => ({ errors: { ...state.errors, [key]: error } })),
}));
