import React from 'react';
import {
	createBrowserRouter
} from "react-router-dom";
import Main from '../Main/Main';
import Home from '../Home/Home';
import Staffs from '../Staffs/Staffs';
import NotAuthorized from '../Shared/NotAuthorized/NotAuthorized';
import AdminMain from '../Admin/AdminMain/AdminMain';
import AdminHome from '../Admin/AdminHome/AdminHome';
import NoticePanel from '../Admin/NoticePanel/NoticePanel';
import SetShopCode from '../Admin/SetShopCode/SetShopCode';
import StaffManipulation from '../Admin/StaffManipulation/StaffManipulation';
import UserManipulation from '../Admin/UserManipulation/UserManipulation';
import UserRequest from '../Admin/UserRequest/UserRequest';
import SetShopLocation from '../Admin/SetShopLocation/SetShopLocation';
import LocationDetails from '../Admin/LocationDetails/LocationDetails';
import StaffsMonthlyRecords from '../StaffsMonthlyRecords/StaffsMonthlyRecords';
import AdditionalRequest from '../Admin/AdditionalRequest/AdditionalRequest';
import StaffTransections from '../Admin/StaffTransections/StaffTransections';
import StaffDetails from '../Admin/StaffDetails/StaffDetails';
import TransectionsHistory from '../TransectionsHistory/TransectionsHistory';
import AdminRoute from '../AdminRoute/AdminRoute';
import StaffRoute from '../StaffRoute/StaffRoute';
import IncomeHistory from '../IncomeHistory/IncomeHistory';
import ShopTransections from '../Admin/ShopTransections/ShopTransections';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Main></Main>,
		children: [
			{
				path: '/',
				element: <Home></Home>
			},
			{
				path: '/staff/uid_query/:uid',
				element: <StaffRoute><Staffs></Staffs></StaffRoute>,
				loader: ({ params }) => fetch(`https://shop-manager-server.onrender.com/staff/uid_query/${params.uid}`)
			},
			{
				path: '/monthly_records/:uid',
				element: <StaffRoute><StaffsMonthlyRecords></StaffsMonthlyRecords></StaffRoute>,
				loader: ({ params }) => fetch(`https://shop-manager-server.onrender.com/staff/uid_query/${params.uid}`)
			},
			{
				path: '/transections_history/:uid',
				element: <StaffRoute><TransectionsHistory></TransectionsHistory></StaffRoute>,
				loader: ({ params }) => fetch(`https://shop-manager-server.onrender.com/staff/uid_query/${params.uid}`)
			},
			{
				path: '/income_history/:uid',
				element: <StaffRoute><IncomeHistory></IncomeHistory></StaffRoute>,
				loader: ({ params }) => fetch(`https://shop-manager-server.onrender.com/staff/uid_query/${params.uid}`)
			},
			{
				path: '/not_authorized',
				element: <NotAuthorized></NotAuthorized>
			},
			{
				path: '/admin',
				element: <AdminRoute><AdminMain></AdminMain></AdminRoute>,
				children: [
					{
						path: '/admin',
						element: <AdminHome></AdminHome>
					},
					{
						path: '/admin/notice_panel',
						element: <NoticePanel></NoticePanel>
					},
					{
						path: '/admin/shop_transections',
						element: <ShopTransections></ShopTransections>
					},
					{
						path: '/admin/set_shop_code',
						element: <SetShopCode></SetShopCode>
					},
					{
						path: '/admin/shop_location',
						element: <SetShopLocation></SetShopLocation>
					},
					{
						path: '/admin/staff_manipulation',
						element: <StaffManipulation></StaffManipulation>,
						loader: () => fetch(`https://shop-manager-server.onrender.com/staffs`)
					},
					{
						path: '/admin/additional_request',
						element: <AdditionalRequest></AdditionalRequest>,
						loader: () => fetch(`https://shop-manager-server.onrender.com/additional_movement_request`)
					},
					{
						path: '/admin/staff_transections',
						element: <StaffTransections></StaffTransections>,
						loader: () => fetch('https://shop-manager-server.onrender.com/staffs'),


					},
					{
						path: '/admin/staff_details/:uid',
						element: <StaffDetails></StaffDetails>,
						loader: ({ params }) => fetch(`https://shop-manager-server.onrender.com/staff/uid_query/${params.uid}`)
					},
					{
						path: '/admin/user_manipulation',
						element: <UserManipulation></UserManipulation>,
						loader: () => fetch(`https://shop-manager-server.onrender.com/staffs`)
					},
					{
						path: '/admin/user_request',
						element: <UserRequest></UserRequest>,
						loader: () => fetch(`https://shop-manager-server.onrender.com/user_request`)
					},
					{
						path: '/admin/location_details',
						element: <LocationDetails></LocationDetails>
					}
				]
			}
		]
	}
]);

export default router;