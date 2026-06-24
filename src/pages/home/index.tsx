// 可以在首页中这样测试 Zustand
import { memo } from "react";
import { useUserStore } from "../../store/useUserStore";

const HomeView = () => {
  const { userInfo, count, increaseCount } = useUserStore();

  return (
    <div>
      <h3>当前登录用户：{userInfo.name}</h3>
      <p>状态计数：{count}</p>
      <button onClick={increaseCount}>点我加 1</button>
    </div>
  );
};

export default memo(HomeView);
