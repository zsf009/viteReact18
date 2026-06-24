import { memo, type ReactNode } from "react";

// 轻量 Card（替代 react17 项目里的 antd Card，避免给 demo 引入整个 UI 库）
interface CardProps {
  title: string;
  extra?: ReactNode;
  children: ReactNode;
}

const Card = ({ title, extra, children }: CardProps) => {
  return (
    <div
      style={{
        border: "1px solid #e5e5e5",
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
          fontWeight: 600,
        }}
      >
        <span>{title}</span>
        {extra}
      </div>
      {children}
    </div>
  );
};

export default memo(Card);
