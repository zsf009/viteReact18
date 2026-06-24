import { memo, useState } from "react";
import { useSettingStore } from "../../../store/useSettingStore";
import { useUserStore } from "../../../store/useUserStore";
import Card from "./Card";

// 对照 react17 的 RtkSettingCard（同时消费 setting 和 user 两个 slice）：
// RTK：dispatch(toggleTheme()) / dispatch(login(name)) 走 thunk 三段式
// zustand：login 是普通 async 方法，组件直接 await 调用即可
const SettingCard = () => {
  // setting store
  const theme = useSettingStore((s) => s.theme);
  const fontSize = useSettingStore((s) => s.fontSize);
  const toggleTheme = useSettingStore((s) => s.toggleTheme);
  const setFontSize = useSettingStore((s) => s.setFontSize);

  // user store（异步登录）
  const user = useUserStore((s) => s.info);
  const loading = useUserStore((s) => s.loading);
  const error = useUserStore((s) => s.error);
  const login = useUserStore((s) => s.login);
  const logout = useUserStore((s) => s.logout);

  const [nameInput, setNameInput] = useState("");

  console.log("zustand SettingCard render");

  const handleLogin = () => {
    if (nameInput) {
      login(nameInput);
      setNameInput("");
    }
  };

  return (
    <Card title="设置 & 用户 (zustand 异步)">
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div>
          用户：{user.name ? `${user.avatar} ${user.name}` : "未登录"}
          {loading && <span style={{ marginLeft: 8 }}>登录中...</span>}
        </div>
        {error && <div style={{ color: "red" }}>{error}</div>}

        <div style={{ display: "flex", gap: 8 }}>
          <input
            placeholder="用户名（输入 error 模拟失败）"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            disabled={loading}
          />
          <button onClick={handleLogin} disabled={loading}>
            登录
          </button>
          <button onClick={logout} disabled={!user.name}>
            登出
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={toggleTheme}>切换主题（{theme}）</button>
          <span>字号：</span>
          <input
            type="number"
            value={fontSize}
            style={{ width: 64 }}
            onChange={(e) => setFontSize(Number(e.target.value))}
          />
        </div>
      </div>
    </Card>
  );
};

export default memo(SettingCard);
