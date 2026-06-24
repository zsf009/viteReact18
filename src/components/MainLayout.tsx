import { Link, Outlet } from "react-router";

const MainLayout = () => {
  return (
    <div style={{ padding: 20 }}>
      <nav style={{ display: "flex", gap: 15, marginBottom: 20 }}>
        <Link to="/">首页</Link>
        <Link to="/about">关于我们</Link>
      </nav>
      <hr />
      <main style={{ marginTop: 20 }}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
