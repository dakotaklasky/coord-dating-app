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
import AccountPage from "./pages/AccountPage"
import MatchProfilePage from "./pages/MatchProfilePage"
import LoginPage from "./pages/LoginPage"
import ErrorPage from "./pages/ErrorPage"
import LogoutPage from "./pages/LogoutPage"
import SignupPage from "./pages/SignupPage"
import CalendarPage from "./pages/CalendarPage"

const routes = [
    {
      path: "/",
      element: <App/>,
      errorElement: <ErrorPage/>,
      children:[
        {
          path: "/",
          element: <HomePage/>
        },
        {
          path: "/mymatches",
          element: <MatchListPage/>
        },
        {
          path:"/myaccount",
          element: <AccountPage/>
        },
        {
          path:"/:id",
          element: <MatchProfilePage/>
        },
        {
          path:"/login",
          element: <LoginPage/>
        },
        {
          path:"/signup",
          element:<SignupPage/>
        },
        {
          path:"/logout",
          element: <LogoutPage/>
        },
        {
          path:"/calendar",
          element: <CalendarPage/>
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