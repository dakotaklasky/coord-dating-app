import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import App from "./App"
import Home from "./pages/Home"
import MyMatches from "./pages/MyMatches"
import PlanDate from "./pages/PlanDate"
import MyAccount from "./pages/MyAccount"

const routes = [
    {
      path: "/",
      element: <App/>,
      children:[
        {
          path: "/",
          element: <Home></Home>
        },
        {
          path: "/mymatches",
          element: <MyMatches></MyMatches>
        },
        {
          path:"/plandate",
          element: <PlanDate></PlanDate>
        },
        {
          path:"/myaccount",
          element: <MyAccount></MyAccount>
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