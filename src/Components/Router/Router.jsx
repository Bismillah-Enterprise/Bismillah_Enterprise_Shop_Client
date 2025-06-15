import {
  createBrowserRouter
} from "react-router-dom";
import Home from "../Home/Home";
import Staff from "../Staff/Staff";
import Main from "../Main/Main";
import Login from "../Login/Login";
import Calculation from "../Calculation/Calculation";
import Signup from "../Signup/Signup";
import User_IP from "../User_IP/User_IP";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
        {
            path: "/",
            element: <Home></Home>
        },
        {
            path: "/staff",
            element: <Staff></Staff>
        },
        {
          path: "/user_ip",
          element: <User_IP></User_IP>
        },
        {
            path: "/calculation",
            element: <Calculation></Calculation>
        }
    ]
  },
]);

export default router;