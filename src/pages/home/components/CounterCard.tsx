import { memo } from "react";
import { useCountStore } from "../../../store/useCountStore";
import Card from "./Card";

// 对照 react17 的 RtkCounterCard：
// RTK：useDispatch() + useSelector((s: RootState) => s.count) + dispatch(increment())
// zustand：直接从 store hook 取 state 和 action，无 dispatch、无 Provider
const CounterCard = () => {
  // 分别选择各字段：只订阅 count，action 是稳定引用不会引起额外渲染

  const count = useCountStore((s) => s.count);
  const increment = useCountStore((s) => s.increment);
  const decrement = useCountStore((s) => s.decrement);
  const resetCount = useCountStore((s) => s.resetCount);

  console.log("zustand CounterCard render");

  return (
    <Card title="Counter (zustand)">
      <div>count: {count}</div>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button onClick={increment}>+1</button>
        <button onClick={decrement}>-1</button>
        <button onClick={resetCount}>Reset</button>
      </div>
    </Card>
  );
};

export default memo(CounterCard);
