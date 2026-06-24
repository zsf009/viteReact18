import { create } from "zustand";

// ============ zustand vs RTK：数组 state + "prepare" 模式 ============
// RTK 的 prepare：把 "组装 payload"（生成 id/时间戳）和 "更新 state" 拆成两段。
//   addNotification: { reducer, prepare: (msg, level) => ({ payload: {...} }) }
// zustand 没有 prepare 概念，本质就是 "在 action 函数里自己组装数据再 set"，
//   反而更直观——加工逻辑和写入逻辑写在一起。

interface Notification {
  id: number;
  msg: string;
  level: "info" | "warn" | "error";
  time: string;
}

interface NotificationStore {
  list: Notification[];
  // 对应 RTK addNotification 的 prepare 签名 (msg, level)
  addNotification: (msg: string, level: Notification["level"]) => void;
  dismissNotification: (id: number) => void;
  clearAllNotifications: () => void;
}

export const useNotificationStore = create<NotificationStore>()((set) => ({
  list: [],
  // RTK：prepare 生成 payload → reducer 里 state.push(payload)（immer）
  // zustand：函数内组装对象 + 不可变拼接（没有 immer，用展开运算符）
  addNotification: (msg, level) =>
    set((state) => ({
      list: [
        ...state.list,
        { id: Date.now(), msg, level, time: new Date().toISOString() },
      ],
    })),
  // RTK: return state.filter(...) ；zustand: set 新数组
  dismissNotification: (id) =>
    set((state) => ({ list: state.list.filter((n) => n.id !== id) })),
  clearAllNotifications: () => set({ list: [] }),
}));

// 注意：RTK 的 slice state 直接就是数组（initialState: [] as Notification[]）；
// zustand 的 store 必须是对象，所以这里用 { list: [] } 包一层。
