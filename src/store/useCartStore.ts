import { create } from "zustand";

// ============ zustand vs RTK：数组增删改 + prepare 补默认值 ============
// RTK：addToCart 用 prepare 自动补 quantity:1，reducer 内用 immer 改 existing.quantity++。
// zustand：在 action 里组装 + 不可变更新（find 后用 map 生成新数组）。

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartStore {
  list: CartItem[];
  // 对应 RTK prepare 签名：只传 {id,name,price}，quantity 内部补 1
  addToCart: (item: { id: string; name: string; price: number }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()((set) => ({
  list: [],

  // RTK（immer）：existing.quantity += 1 / state.push(payload)
  // zustand：已存在则 map 改数量，不存在则展开追加
  addToCart: (item) =>
    set((state) => {
      const existing = state.list.find((i) => i.id === item.id);
      if (existing) {
        return {
          list: state.list.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        };
      }
      return { list: [...state.list, { ...item, quantity: 1 }] };
    }),

  removeFromCart: (id) =>
    set((state) => ({ list: state.list.filter((i) => i.id !== id) })),

  // RTK（immer）：item.quantity = quantity
  updateQuantity: (id, quantity) =>
    set((state) => ({
      list: state.list.map((i) => (i.id === id ? { ...i, quantity } : i)),
    })),

  clearCart: () => set({ list: [] }),
}));
