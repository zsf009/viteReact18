import { createBrowserRouter, RouterProvider } from "react-router";
import MainLayout from "./components/MainLayout";
import HomeView from "./pages/home";
import AboutView from "./pages/about";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomeView /> },
      { path: "about", element: <AboutView /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
