import {
  createBrowserRouter,
  RouterProvider,
  Link,
  Outlet,
} from "react-router";
import HomeView from "./pages/home";

// 简单的布局组件
const Layout = () => (
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <HomeView /> },
      { path: "/about", element: <div>这是关于页面内容</div> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
