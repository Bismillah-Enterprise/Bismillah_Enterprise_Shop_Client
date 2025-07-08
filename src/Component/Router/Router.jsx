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
import NotAuthorized from "../NotAuthorized/NotAuthorized";
import AdminRoute from "./AdminRoute";
import StaffRoute from "./StaffRoute";
import ShopCode from "../ShopCode/ShopCode";

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
        element: <StaffRoute><Staff></Staff></StaffRoute>,
        loader: ({ params }) => fetch(`https://shop-manager-server.onrender.com/staff/${params.id}`)
      },

      {
        path: "/calculation",
        element: <Calculation></Calculation>
      },
      {
        path: "/admin",
        element: <AdminRoute><Admin></Admin></AdminRoute>,
        loader: () => fetch('https://shop-manager-server.onrender.com/staffs'),
        children: [
          {
            path: "/admin",
            element: <AdminRoute><AdminBanner></AdminBanner></AdminRoute>
          },
          {
            path: "/admin/user_ip",
            element: <AdminRoute><User_IP></User_IP></AdminRoute>
          },
          {
            path: "/admin/shop_code",
            element: <AdminRoute><ShopCode></ShopCode></AdminRoute>
          },
          {
            path: "/admin/user_request",
            element: <AdminRoute><UserRequest></UserRequest></AdminRoute>,
            loader: () => fetch('https://shop-manager-server.onrender.com/user_request')
          },
          {
            path: "/admin/user_account_manipulation",
            element: <AdminRoute><UserAccountManipulation></UserAccountManipulation></AdminRoute>
          },
          {
            path: "/admin/staff_manipulation",
            element: <AdminRoute><StaffManipulation></StaffManipulation></AdminRoute>
          },
          {
            path: "/admin/notice_panel",
            element: <AdminRoute><NoticePanel></NoticePanel></AdminRoute>
          }
        ]
      },
      {
        path: '/not_authorized',
        element: <NotAuthorized></NotAuthorized>
      }
    ]
  },
]);

export default router;