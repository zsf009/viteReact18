import { memo } from "react";
import { useCartStore } from "../../../store/useCartStore";
import Card from "./Card";

// 对照 react17 的 RtkCartCard：
// RTK：dispatch(addToCart({ id, name, price }))（prepare 补 quantity:1）
// zustand：addToCart({ id, name, price }) 普通方法，补默认值逻辑在 action 内
const CartCard = () => {
  const list = useCartStore((s) => s.list);
  const addToCart = useCartStore((s) => s.addToCart);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const clearCart = useCartStore((s) => s.clearCart);

  console.log("zustand CartCard render");

  const total = list.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <Card
      title="购物车 (zustand)"
      extra={
        <button onClick={clearCart} style={{ color: "red" }}>
          清空
        </button>
      }
    >
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <button
          onClick={() => addToCart({ id: "a1", name: "React 实战", price: 59 })}
        >
          加书
        </button>
        <button
          onClick={() =>
            addToCart({ id: "b2", name: "TypeScript 指南", price: 45 })
          }
        >
          加另一本
        </button>
      </div>
      <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
        {list.map((item) => (
          <li
            key={item.id}
            style={{ display: "flex", gap: 8, alignItems: "center", padding: "4px 0" }}
          >
            <span>
              {item.name} × {item.quantity} = ¥{item.price * item.quantity}
            </span>
            <a
              onClick={() => removeFromCart(item.id)}
              style={{ cursor: "pointer" }}
            >
              移除
            </a>
          </li>
        ))}
      </ul>
      {list.length > 0 && <div>总计: ¥{total}</div>}
    </Card>
  );
};

export default memo(CartCard);
