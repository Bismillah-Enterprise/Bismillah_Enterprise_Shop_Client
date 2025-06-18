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
import Admin from "../Admin/Admin";
import UserRequest from "../UserRequest/UserRequest";
import UserAccountManipulation from "../UserAccountManipulation/UserAccountManipulation";
import StaffManipulation from "../StaffManipulation/StaffManipulation";
import NoticePanel from "../NoticePanel/NoticePanel";
import AdminBanner from "../AdminBanner/AdminBanner";

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
            path: "/staff/:id",
            element: <Staff></Staff>,
            loader: ({ params }) => fetch(`http://localhost:5000/staff/${params.id}`)                                                                     
        },
        {
          path: "/user_ip",
          element: <User_IP></User_IP>
        },
        {
            path: "/calculation",
            element: <Calculation></Calculation>
        },
        {
          path: "/admin",
          element: <Admin></Admin>,
          loader: () => fetch('http://localhost:5000/staffs'),
          children: [
            {
              path: "/admin",
              element: <AdminBanner></AdminBanner>
            },
            {
              path: "/admin/user_request",
              element: <UserRequest></UserRequest>
            },
            {
              path: "/admin/user_account_manipulation",
              element: <UserAccountManipulation></UserAccountManipulation>
            },
            {
              path: "/admin/staff_manipulation",
              element: <StaffManipulation></StaffManipulation>
            },
            {
              path: "/admin/notice_panel",
              element: <NoticePanel></NoticePanel>
            }
          ]
        }
    ]
  },
]);

export default router;