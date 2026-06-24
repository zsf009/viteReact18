import { memo } from "react";
import { useNotificationStore } from "../../../store/useNotificationStore";
import Card from "./Card";

// 对照 react17 的 RtkNotificationCard：
// RTK：dispatch(addNotification('msg', 'info'))（prepare 组装 payload）
// zustand：addNotification(msg, level)，组装逻辑在 action 内部
const NotificationCard = () => {
  const list = useNotificationStore((s) => s.list);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const dismissNotification = useNotificationStore((s) => s.dismissNotification);
  const clearAllNotifications = useNotificationStore(
    (s) => s.clearAllNotifications,
  );

  console.log("zustand NotificationCard render");

  const color = (level: string) =>
    level === "error" ? "red" : level === "warn" ? "orange" : "#1677ff";

  return (
    <Card
      title="通知 (zustand)"
      extra={
        <button onClick={clearAllNotifications} style={{ color: "red" }}>
          清空
        </button>
      }
    >
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <button onClick={() => addNotification("一条info", "info")}>
          +Info
        </button>
        <button onClick={() => addNotification("一条warn", "warn")}>
          +Warn
        </button>
        <button onClick={() => addNotification("一条error", "error")}>
          +Error
        </button>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {list.map((n) => (
          <span
            key={n.id}
            style={{
              border: `1px solid ${color(n.level)}`,
              color: color(n.level),
              borderRadius: 4,
              padding: "2px 6px",
              cursor: "pointer",
            }}
            onClick={() => dismissNotification(n.id)}
          >
            {n.msg} ✕
          </span>
        ))}
      </div>
    </Card>
  );
};

export default memo(NotificationCard);
