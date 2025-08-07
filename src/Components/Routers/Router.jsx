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
import RevenueTransectionsDetials from '../Admin/RevenueTransectionsDetails/RevenueTransectionsDetials';
import ExpenseTransectionsDetails from '../Admin/ExpenseTransectionsDetails/ExpenseTransectionsDetails';
import ShopTransectionsSummary from '../Admin/ShopTransectionsSummary/ShopTransectionsSummary';
import SelfTransections from '../Admin/SelfTransections/SelfTransections';
import ClientCorner from '../Admin/ClientCorner/ClientCorner';
import ClientDetails from '../Admin/ClientDetails/ClientDetails';
import Voucher from '../Admin/Voucher/Voucher';
import CreateNewClient from '../Admin/CreateNewClient/CreateNewClient';
import NewVoucher from '../Admin/NewVoucher/NewVoucher';
import ClientTransections from '../Admin/ClientTransections/ClientTransections';
import SelfRevenueTransectionsDetails from '../Admin/SelfRevenueTransectionsDetails/SelfRevenueTransectionsDetails';
import SelfTransectionsSummary from '../Admin/SelfTransectionsSummary/SelfTransectionsSummary';
import ProductsManipulation from '../Admin/ProductsManipulation/ProductsManipulation';
import CreateNewClientWithVoucher from '../Admin/CreateNewClientWithVoucher/CreateNewClientWithVoucher';
import AirTicketClient from '../Admin/AirTicketClilent/AirTicketClient';
import AirTicketNewClient from '../Admin/AirTicketNewClient/AirTicketNewClient';
import AirTicketNewClientWithNewVoucher from '../Admin/AirTicketNewClientWithNewVoucher/AirTicketNewClientWithNewVoucher';
import AirTicketClientDetails from '../Admin/AirTicketClientDetails/AirTicketClientDetails';
import AirTicketClientTransections from '../Admin/AirTicketClientTransections/AirTicketClientTransections';
import AirTicketNewVoucher from '../Admin/AirTicketNewVoucher/AirTicketNewVoucher';
import AirTicketVoucher from '../Admin/AirTicketVoucher/AirTicketVoucher';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Main></Main>,
		children: [
			{
				path: '/',
				element: <Home></Home>,
				loader: () => fetch(`https://bismillah-enterprise-server.onrender.com/notice_panel`)
			},
			{
				path: '/staff/uid_query/:uid',
				element: <StaffRoute><Staffs></Staffs></StaffRoute>,
				loader: ({ params }) => fetch(`https://bismillah-enterprise-server.onrender.com/staff/uid_query/${params?.uid}`)
			},
			{
				path: '/monthly_records/:uid',
				element: <StaffRoute><StaffsMonthlyRecords></StaffsMonthlyRecords></StaffRoute>,
				loader: ({ params }) => fetch(`https://bismillah-enterprise-server.onrender.com/staff/uid_query/${params.uid}`)
			},
			{
				path: '/transections_history/:uid',
				element: <StaffRoute><TransectionsHistory></TransectionsHistory></StaffRoute>,
				loader: ({ params }) => fetch(`https://bismillah-enterprise-server.onrender.com/staff/uid_query/${params.uid}`)
			},
			{
				path: '/income_history/:uid',
				element: <StaffRoute><IncomeHistory></IncomeHistory></StaffRoute>,
				loader: ({ params }) => fetch(`https://bismillah-enterprise-server.onrender.com/staff/uid_query/${params.uid}`)
			},
			{
				path: '/not_authorized',
				element: <NotAuthorized></NotAuthorized>
			},
			{
				path: '/client_corner',
				element: <ClientCorner></ClientCorner>,
				loader: () => fetch('https://bismillah-enterprise-server.onrender.com/client_corner'),
			},
			{
				path: '/new_client',
				element: <CreateNewClient></CreateNewClient>,
			},
			{
				path: '/new_client_new_voucher',
				element: <CreateNewClientWithVoucher></CreateNewClientWithVoucher>,
			},
			{
				path: '/client_details/:id',
				element: <ClientDetails></ClientDetails>,
				loader: ({ params }) => fetch(`https://bismillah-enterprise-server.onrender.com/client_details/${params.id}`),
			},
			{
				path: '/client_transections/:id',
				element: <ClientTransections></ClientTransections>,
				loader: ({ params }) => fetch(`https://bismillah-enterprise-server.onrender.com/client_details/${params.id}`),
			},
			{
				path: '/new_voucher/:id',
				element: <NewVoucher></NewVoucher>,
				loader: ({ params }) => fetch(`https://bismillah-enterprise-server.onrender.com/client_details/${params.id}`),
			},
			{
				path: '/voucher/:id/:voucher_no',
				element: <Voucher></Voucher>,
				loader: ({ params }) => fetch(`https://bismillah-enterprise-server.onrender.com/client_details/${params.id}`),

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
						element: <AdminRoute><NoticePanel></NoticePanel></AdminRoute>,
						loader: () => fetch(`https://bismillah-enterprise-server.onrender.com/notice_panel`)
					},
					{
						path: '/admin/shop_transections',
						element: <AdminRoute><ShopTransections></ShopTransections></AdminRoute>,
						loader: () => fetch(`https://bismillah-enterprise-server.onrender.com/shop_transections`)
					},
					{
						path: '/admin/revenue_transections_details',
						element: <AdminRoute><RevenueTransectionsDetials></RevenueTransectionsDetials></AdminRoute>,
						loader: () => fetch(`https://bismillah-enterprise-server.onrender.com/shop_transections`)
					},
					{
						path: '/admin/self_revenue_transections_details',
						element: <AdminRoute><SelfRevenueTransectionsDetails></SelfRevenueTransectionsDetails></AdminRoute>,
						loader: () => fetch(`https://bismillah-enterprise-server.onrender.com/self_transections`)
					},
					{
						path: '/admin/expense_transections_details',
						element: <AdminRoute><ExpenseTransectionsDetails></ExpenseTransectionsDetails></ AdminRoute>,
						loader: () => fetch(`https://bismillah-enterprise-server.onrender.com/shop_transections`)
					},
					{
						path: '/admin/self_expense_transections_details',
						element: <AdminRoute><ExpenseTransectionsDetails></ExpenseTransectionsDetails></ AdminRoute>,
						loader: () => fetch(`https://bismillah-enterprise-server.onrender.com/self_transections`)
					},
					{
						path: '/admin/shop_transections_summary',
						element: <AdminRoute><ShopTransectionsSummary></ShopTransectionsSummary></ AdminRoute>,
						loader: () => fetch(`https://bismillah-enterprise-server.onrender.com/shop_transections_summary`)
					},
					{
						path: '/admin/self_transections_summary',
						element: <AdminRoute><SelfTransectionsSummary></SelfTransectionsSummary></ AdminRoute>,
						loader: () => fetch(`https://bismillah-enterprise-server.onrender.com/self_transections_summary`)
					},
					{
						path: '/admin/client_corner',
						element: <AdminRoute><ClientCorner></ClientCorner></ AdminRoute>,
						loader: () => fetch('https://bismillah-enterprise-server.onrender.com/client_corner'),
					},
					{
						path: '/admin/air_ticket_client_corner',
						element: <AdminRoute><AirTicketClient></AirTicketClient></ AdminRoute>,
						loader: () => fetch('https://bismillah-enterprise-server.onrender.com/air_ticket_client_corner'),
					},
					{
						path: '/admin/new_client',
						element: <AdminRoute><CreateNewClient></CreateNewClient></ AdminRoute>
					},
					{
						path: '/admin/air_ticket_new_client',
						element: <AdminRoute><AirTicketNewClient></AirTicketNewClient></ AdminRoute>
					},
					{
						path: '/admin/new_client_new_voucher',
						element: <AdminRoute><CreateNewClientWithVoucher></CreateNewClientWithVoucher></ AdminRoute>
					},
					{
						path: '/admin/air_ticket_new_client_new_voucher',
						element: <AdminRoute><AirTicketNewClientWithNewVoucher></AirTicketNewClientWithNewVoucher></ AdminRoute>
					},
					{
						path: '/admin/client_details/:id',
						element: <AdminRoute><ClientDetails></ClientDetails></ AdminRoute>,
						loader: ({ params }) => fetch(`https://bismillah-enterprise-server.onrender.com/client_details/${params.id}`),
					},
					{
						path: '/admin/air_ticket_client_details/:id',
						element: <AdminRoute><AirTicketClientDetails></AirTicketClientDetails></ AdminRoute>,
						loader: ({ params }) => fetch(`https://bismillah-enterprise-server.onrender.com/air_ticket_client_details/${params.id}`),
					},
					{
						path: '/admin/client_transections/:id',
						element: <AdminRoute><ClientTransections></ClientTransections></ AdminRoute>,
						loader: ({ params }) => fetch(`https://bismillah-enterprise-server.onrender.com/client_details/${params.id}`),
					},
					{
						path: '/admin/air_ticket_client_transections/:id',
						element: <AdminRoute><AirTicketClientTransections></AirTicketClientTransections></ AdminRoute>,
						loader: ({ params }) => fetch(`https://bismillah-enterprise-server.onrender.com/air_ticket_client_details/${params.id}`),
					},
					{
						path: '/admin/new_voucher/:id',
						element: <AdminRoute><NewVoucher></NewVoucher></ AdminRoute>,
						loader: ({ params }) => fetch(`https://bismillah-enterprise-server.onrender.com/client_details/${params.id}`),
					},
					{
						path: '/admin/air_ticket_new_voucher/:id',
						element: <AdminRoute><AirTicketNewVoucher></AirTicketNewVoucher></ AdminRoute>,
						loader: ({ params }) => fetch(`https://bismillah-enterprise-server.onrender.com/air_ticket_client_details/${params.id}`),
					},
					{
						path: '/admin/voucher/:id/:voucher_no',
						element: <AdminRoute><Voucher></Voucher></ AdminRoute>,
						loader: ({ params }) => fetch(`https://bismillah-enterprise-server.onrender.com/client_details/${params.id}`),

					},
					{
						path: '/admin/air_ticket_voucher/:id/:voucher_no',
						element: <AdminRoute><AirTicketVoucher></AirTicketVoucher></ AdminRoute>,
						loader: ({ params }) => fetch(`https://bismillah-enterprise-server.onrender.com/air_ticket_client_details/${params.id}`),

					},
					{
						path: '/admin/set_shop_code',
						element: <AdminRoute><SetShopCode></SetShopCode></ AdminRoute>
					},
					{
						path: '/admin/shop_location',
						element: <AdminRoute><SetShopLocation></SetShopLocation></ AdminRoute>
					},
					{
						path: '/admin/staff_manipulation',
						element: <AdminRoute><StaffManipulation></StaffManipulation></ AdminRoute>,
						loader: () => fetch(`https://bismillah-enterprise-server.onrender.com/staffs`)
					},
					{
						path: '/admin/additional_request',
						element: <AdminRoute><AdditionalRequest></AdditionalRequest></ AdminRoute>,
						loader: () => fetch(`https://bismillah-enterprise-server.onrender.com/additional_movement_request`)
					},
					{
						path: '/admin/staff_transections',
						element: <AdminRoute><StaffTransections></StaffTransections></ AdminRoute>,
						loader: () => fetch('https://bismillah-enterprise-server.onrender.com/staffs'),
					},
					{
						path: '/admin/self_transections',
						element: <AdminRoute><SelfTransections></SelfTransections></ AdminRoute>,
						loader: () => fetch('https://bismillah-enterprise-server.onrender.com/self_transections'),
					},
					{
						path: '/admin/products_manipulation',
						element: <AdminRoute><ProductsManipulation></ProductsManipulation></ AdminRoute>,
						loader: () => fetch(`https://bismillah-enterprise-server.onrender.com/products`),

					},
					{
						path: '/admin/staff_details/:uid',
						element: <AdminRoute><StaffDetails></StaffDetails></ AdminRoute>,
						loader: ({ params }) => fetch(`https://bismillah-enterprise-server.onrender.com/staff/uid_query/${params.uid}`)
					},
					{
						path: '/admin/user_manipulation',
						element: <AdminRoute><UserManipulation></UserManipulation></ AdminRoute>,
						loader: () => fetch(`https://bismillah-enterprise-server.onrender.com/staffs`)
					},
					{
						path: '/admin/user_request',
						element: <AdminRoute><UserRequest></UserRequest></ AdminRoute>,
						loader: () => fetch(`https://bismillah-enterprise-server.onrender.com/user_request`)
					},
					{
						path: '/admin/location_details',
						element: <AdminRoute><LocationDetails></LocationDetails></ AdminRoute>
					}
				]
			}
		]
	}
]);

export default router;