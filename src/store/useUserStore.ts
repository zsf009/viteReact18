import { create } from "zustand";

// ============ zustand vs RTK：异步请求（重点对比）============
// RTK：createAsyncThunk 自动派发 pending/fulfilled/rejected 三个 action，
//      你在 extraReducers 里分别处理 loading/数据/错误。结构清晰但样板多。
// zustand：异步就是一个普通 async 方法——自己 set(loading) → await → set(结果/错误)。
//      没有 thunk、没有 extraReducers、没有三个 action type，全部手动但一目了然。

interface User {
  name: string;
  age: number;
  avatar: string;
}

interface UserStore {
  info: User;
  loading: boolean;
  error: string | null;
  login: (username: string) => Promise<void>;
  logout: () => void;
}

const emptyUser: User = { name: "", age: 0, avatar: "" };

// 模拟登录接口（与 RTK 版 userSlice 里的 fakeLoginApi 完全一致）
const fakeLoginApi = (username: string): Promise<User> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === "error") reject(new Error("用户名不存在"));
      else resolve({ name: username, age: 25, avatar: "🧑‍💻" });
    }, 1000);
  });

export const useUserStore = create<UserStore>()((set) => ({
  info: emptyUser,
  loading: false,
  error: null,

  // 对应 RTK 的 login = createAsyncThunk('user/login', ...) + extraReducers
  // 这里把 pending/fulfilled/rejected 三个阶段写在一个函数里：
  login: async (username) => {
    set({ loading: true, error: null }); // === login.pending
    try {
      const user = await fakeLoginApi(username);
      set({ loading: false, info: user }); // === login.fulfilled
    } catch (err) {
      set({
        loading: false,
        error: err instanceof Error ? err.message : "登录失败",
      }); // === login.rejected
    }
  },

  // 对应 RTK userSlice.reducers.logout（同步 action）
  logout: () => set({ info: emptyUser, error: null }),
}));

// 组件用法：
// RTK:     dispatch(login('Alice'))  —— dispatch 一个 thunk
// zustand: 组件内 const login = useUserStore((s) => s.login); login('Alice')
//          组件外 useUserStore.getState().login('Alice')
