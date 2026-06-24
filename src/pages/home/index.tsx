import { memo } from "react";
import { useUserStore } from "../../store/useUserStore";

const HomeView = () => {
  const { userInfo, count, increaseCount, updateName } = useUserStore();

  return (
    <div>
      <h3>当前登录用户：{userInfo.name}</h3>
      <p>状态计数：{count}</p>
      <button onClick={increaseCount}>点我加 1</button>
      <button onClick={() => updateName("Gamer2" + count)}>更新用户名</button>
    </div>
  );
};

export default memo(HomeView);
