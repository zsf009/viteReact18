import { create } from "zustand";

// ============ zustand vs RTK：最简单的计数器 ============
// RTK：createSlice({ name, initialState: 0, reducers: { increment, ... } })
//      → 自动生成 action type 'count/increment' + action creator + reducer，
//        再交给 configureStore 注册到全局 store 的 count 字段。
// zustand：一个 create 就是一个独立 store，state 和 "action" 写在同一个对象里。
//      → 没有 action type、没有 reducer、没有 dispatch，方法直接调用即可。

interface CountStore {
  // ---- state ----
  count: number;
  // ---- actions（RTK 里叫 reducers，这里就是普通函数）----
  increment: () => void;
  decrement: () => void;
  resetCount: () => void;
}

// create<T>()(fn) 的柯里化写法是 zustand v5 + TS 的推荐姿势（保证类型推导）
export const useCountStore = create<CountStore>()((set) => ({
  count: 0,
  // RTK: increment: (state) => state + 1（靠 immer 处理不可变）
  // zustand: set 接收 "部分新 state"，用函数式拿到旧值
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  // RTK: resetCount: () => 0
  resetCount: () => set({ count: 0 }),
}));

// 组件用法对比：
// RTK:     const count = useSelector((s: RootState) => s.count);
//          const dispatch = useDispatch(); dispatch(increment());
// zustand: const count = useCountStore((s) => s.count);
//          const increment = useCountStore((s) => s.increment); increment();
