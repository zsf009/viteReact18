import CartCard from "./components/CartCard";
import CounterCard from "./components/CounterCard";
import NotificationCard from "./components/NotificationCard";
import SettingCard from "./components/SettingCard";
import TodoCard from "./components/TodoCard";

// 仿照 react17 的 RtkPage：每个 Card 是独立子组件，各自用 zustand 选择器消费 store。
// 与 RTK 版的关键区别：
// 1. 无需 <Provider store={store}> 包裹——zustand 的 store 是模块级单例，import 即用。
// 2. 子组件各自 useXxxStore((s) => s.field) 只订阅用到的字段，
//    打开控制台可见：操作某个 Card 只触发它自己的 "render" 日志，其它 Card 不重渲染。
const HomeView = () => {
  console.log("zustand HomePage render");

  return (
    <div>
      <h2>zustand 示例（对照 react17 的 RTK 页面，组件 + 子组件消费）</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          alignItems: "start",
        }}
      >
        <CounterCard />
        <SettingCard />
        <TodoCard />
        <CartCard />
        <div style={{ gridColumn: "1 / -1" }}>
          <NotificationCard />
        </div>
      </div>
    </div>
  );
};

export default HomeView;
