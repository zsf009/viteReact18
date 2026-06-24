import { create } from "zustand";

// ============ zustand vs RTK：嵌套对象 state（list + filter）============
// RTK：todoSlice 把 list 和 filter 合到一个 slice，addTodo 用 prepare 生成 id。
// zustand：同样内聚到一个 store，嵌套更新需手动展开（无 immer）。

type Priority = "high" | "normal" | "low";
type Filter = "all" | "active" | "done";

interface Todo {
  id: number;
  text: string;
  done: boolean;
  priority: Priority;
}

interface TodoStore {
  list: Todo[];
  filter: Filter;
  // 对应 RTK addTodo 的 prepare 签名（priority 默认 normal）
  addTodo: (text: string, priority?: Priority) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  setPriority: (id: number, priority: Priority) => void;
  setFilter: (filter: Filter) => void;
}

export const useTodoStore = create<TodoStore>()((set) => ({
  list: [],
  filter: "all",

  // RTK：prepare 生成 {id,text,done:false,priority} → reducer push
  addTodo: (text, priority = "normal") =>
    set((state) => ({
      list: [...state.list, { id: Date.now(), text, done: false, priority }],
    })),

  // RTK（immer）：todo.done = !todo.done
  toggleTodo: (id) =>
    set((state) => ({
      list: state.list.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t,
      ),
    })),

  deleteTodo: (id) =>
    set((state) => ({ list: state.list.filter((t) => t.id !== id) })),

  setPriority: (id, priority) =>
    set((state) => ({
      list: state.list.map((t) => (t.id === id ? { ...t, priority } : t)),
    })),

  setFilter: (filter) => set({ filter }),
}));
