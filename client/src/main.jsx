import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import App from "./App"
import HomePage from "./pages/HomePage"
import MatchListPage from "./pages/MatchesListPage"
import PlanDatePage from "./pages/PlanDatePage"
import AccountPage from "./pages/AccountPage"
import MatchProfilePage from "./pages/MatchProfilePage"
import LoginPage from "./pages/LoginPage"

const routes = [
    {
      path: "/",
      element: <App/>,
      children:[
        {
          path: "/",
          element: <HomePage></HomePage>
        },
        {
          path: "/mymatches",
          element: <MatchListPage></MatchListPage>
        },
        {
          path:"/plandate",
          element: <PlanDatePage></PlanDatePage>
        },
        {
          path:"/myaccount",
          element: <AccountPage></AccountPage>
        },
        {
          path:"/:id",
          element: <MatchProfilePage></MatchProfilePage>
        },
        {
          path:"/login",
          element: <LoginPage></LoginPage>
        }
      ]
    }
]

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);