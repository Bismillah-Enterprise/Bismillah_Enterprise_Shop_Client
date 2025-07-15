import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useCurrentUser from '../../Hooks/useCurrentUser';
import { RiMenuUnfoldFill } from 'react-icons/ri';
import { AuthContext } from '../../Providers/AuthProvider';

const AdminNavbar = () => {
	const [current_User] = useCurrentUser();
	const { isMenu, setIsMenu } = useContext(AuthContext);
	const location = useLocation();
	const handleIsMenuClose = () => {
		if (isMenu) {

		}
	}
	return (
		<div className='text-pink-200'>
			<div className='min-h-fit rounded-2xl shadow-lg shadow-pink-300 hidden lg:flex gap-5 flex-col items-center'>
				<Link to={"/"} state={{ pathname: location.pathname }} className={`w-full shadow-md hover:shadow-pink-400 rounded-t-2xl shadow-pink-300 py-3 font-semibold text-center cursor-pointer`}>
					Home
				</Link>
				<Link to={`/staff/uid_query/${current_User?.uid}`} state={{ pathname: location.pathname }} className={`w-full shadow-md hover:shadow-pink-400 rounded-t-2xl shadow-pink-300 py-3 font-semibold text-center cursor-pointer`}>
					Staff Page
				</Link>
				<Link to={`/admin/products_manipulation`} state={{ pathname: location.pathname }} className={`w-full shadow-md hover:shadow-pink-400 rounded-t-2xl shadow-pink-300 py-3 font-semibold text-center cursor-pointer`}>
					Products Manipulation
				</Link>
				<Link to={`/admin/shop_transections`} state={{ pathname: location.pathname }} className={`${location.pathname.includes('/admin/shop_transections') ? 'text-pink-400': 'text-pink-200'} ${location.pathname.includes('/admin/revenue_transections_details') ? 'text-pink-400': 'text-pink-200'} ${location.pathname.includes('/admin/expense_transections_details') ? 'text-pink-400': 'text-pink-200'} w-full shadow-md hover:shadow-pink-400 rounded-t-2xl shadow-pink-300 py-3 font-semibold text-center cursor-pointer`}>
					Shop Transections
				</Link>
				<Link to={`/admin/client_corner`} state={{ pathname: location.pathname }} className={`${location.pathname.includes('/admin/client_corner')? 'text-pink-400': 'text-pink-200'} w-full shadow-md hover:shadow-pink-400 rounded-t-2xl shadow-pink-300 py-3 font-semibold text-center cursor-pointer`}>
					Client Corner
				</Link>
				<Link to={`/admin/self_transections`} state={{ pathname: location.pathname }} className={`${location.pathname.includes('/admin/self_transections')? 'text-pink-400': 'text-pink-200'} ${current_User?.email === 'bismillah786e@gmail.com' ? 'block': 'hidden'} w-full shadow-md hover:shadow-pink-400 rounded-t-2xl shadow-pink-300 py-3 font-semibold text-center cursor-pointer`}>
					Abdul Kader Transections
				</Link>
				<Link to={"/admin/user_request"} state={{ pathname: location.pathname }} className={`${current_User?.email === 'bismillah786e@gmail.com' ? 'block': 'hidden'} ${location.pathname.includes('/admin/user_request')? 'text-pink-400': 'text-pink-200'} w-full shadow-md hover:shadow-pink-400 shadow-pink-300 py-3 font-semibold text-center cursor-pointer`}>
					User Request
				</Link>
				<Link to={"/admin/additional_request"} state={{ pathname: location.pathname }} className={`${location.pathname.includes('/admin/additional_request')? 'text-pink-400': 'text-pink-200'} w-full shadow-md hover:shadow-pink-400 shadow-pink-300 py-3 font-semibold text-center cursor-pointer`}>
					Additional Movement Request
				</Link>
				<Link to={"/admin/staff_transections"} state={{ pathname: location.pathname }} className={`${location.pathname.includes('/admin/staff_transections') ? 'text-pink-400': 'text-pink-200'} w-full shadow-md hover:shadow-pink-400 shadow-pink-300 py-3 font-semibold text-center cursor-pointer`}>
					Staff Transections
				</Link>
				<Link to={"/admin/user_manipulation"} state={{ pathname: location.pathname }} className={`${location.pathname.includes('/admin/user_manipulation')? 'text-pink-400': 'text-pink-200'} w-full shadow-md hover:shadow-pink-400 shadow-pink-300 py-3 font-semibold text-center cursor-pointer`}>
					User Account Manipulation
				</Link>
				<Link to={"/admin/staff_manipulation"} state={{ pathname: location.pathname }} className={`${location.pathname.includes('/admin/staff_manipulation')? 'text-pink-400': 'text-pink-200'} w-full shadow-md hover:shadow-pink-400 shadow-pink-300 py-3 font-semibold text-center cursor-pointer`}>
					Staff Manipulation
				</Link>
				<Link to={"/admin/location_details"} state={{ pathname: location.pathname }} className={`${location.pathname.includes('/admin/location_details')? 'text-pink-400': 'text-pink-200'} w-full shadow-md hover:shadow-pink-400 shadow-pink-300 py-3 font-semibold text-center cursor-pointer`}>
					Location Details
				</Link>
				<Link to={"/admin/shop_location"} state={{ pathname: location.pathname }} className={`${current_User?.email === 'bismillah786e@gmail.com' ? 'block': 'hidden'} ${location.pathname.includes('/admin/shop_location')? 'text-pink-400': 'text-pink-200'} w-full shadow-md hover:shadow-pink-400 shadow-pink-300 py-3 font-semibold text-center cursor-pointer`}>
					Set Shop Location
				</Link>
				<Link to={"/admin/set_shop_code"} state={{ pathname: location.pathname }} className={`${location.pathname.includes('/admin/set_shop_code')? 'text-pink-400': 'text-pink-200'} w-full shadow-md hover:shadow-pink-400 shadow-pink-300 py-3 font-semibold text-center cursor-pointer`}>
					Set Shop Code
				</Link>
				<Link to={"/admin/notice_panel"} state={{ pathname: location.pathname }} className={`${location.pathname.includes('/admin/notice_panel')? 'text-pink-400': 'text-pink-200'} rounded-b-2xl w-full shadow-md hover:shadow-pink-400 shadow-pink-300 py-3 font-semibold text-center cursor-pointer`}>
					Notice Panel
				</Link>
			</div>
			{/* <div className={`block lg:hidden absolute`}>
				< */}
			<div className={`absolute ${isMenu ? 'left-5 gap-7' : '-left-[280px] gap-14'} top-24 duration-300 flex z-50 `}>
				<div onClick={() => { setIsMenu(false) }} className={`w-fit min-h-fit rounded-2xl ${isMenu ? 'shadow-lg' : 'shadow-none'}  flex shadow-pink-300 flex-col items-center bg-linear-to-r from-[#485563] to-[#29322c]`}>
					<Link to={"/"} state={{ pathname: location.pathname }} className={`px-3 w-full ${isMenu ? 'shadow-md' : 'shadow-none'} hover:shadow-pink-400 rounded-t-2xl shadow-pink-300 py-3 font-semibold text-center cursor-pointer`}>
						Home
					</Link>
					<Link to={`/staff/uid_query/${current_User?.uid}`} state={{ pathname: location.pathname }} className={`px-3 w-full ${isMenu ? 'shadow-md' : 'shadow-none'} hover:shadow-pink-400 rounded-t-2xl shadow-pink-300 py-3 font-semibold text-center cursor-pointer`}>
						Staff Page
					</Link>
					<Link to={`/admin/products_manipulation`} state={{ pathname: location.pathname }} className={`px-3 w-full ${isMenu ? 'shadow-md' : 'shadow-none'} hover:shadow-pink-400 rounded-t-2xl shadow-pink-300 py-3 font-semibold text-center cursor-pointer`}>
						Products Manipulations
					</Link>
					<Link to={`/admin/shop_transections`} state={{ pathname: location.pathname }} className={`${location.pathname.includes('/admin/shop_transections') ? 'text-pink-400': 'text-pink-200'} ${location.pathname.includes('/admin/revenue_transections_details') ? 'text-pink-400': 'text-pink-200'} ${location.pathname.includes('/admin/expense_transections_details') ? 'text-pink-400': 'text-pink-200'} px-3 w-full ${isMenu ? 'shadow-md' : 'shadow-none'} hover:shadow-pink-400 rounded-t-2xl shadow-pink-300 py-3 font-semibold text-center cursor-pointer`}>
						Shop Transections
					</Link>
					<Link to={`/admin/client_corner`} state={{ pathname: location.pathname }} className={`px-3 w-full ${isMenu ? 'shadow-md' : 'shadow-none'} hover:shadow-pink-400 rounded-t-2xl shadow-pink-300 py-3 font-semibold text-center cursor-pointer`}>
						Client Corner
					</Link>
					<Link to={`/admin/self_transections`} state={{ pathname: location.pathname }} className={`${current_User?.email === 'bismillah786e@gmail.com' ? 'block': 'hidden'} px-3 w-full ${isMenu ? 'shadow-md' : 'shadow-none'} hover:shadow-pink-400 rounded-t-2xl shadow-pink-300 py-3 font-semibold text-center cursor-pointer`}>
						Abdul Kader Transections
					</Link>
					<Link to={"/admin/user_request"} state={{ pathname: location.pathname }} className={`${current_User?.email === 'bismillah786e@gmail.com' ? 'block': 'hidden'} px-3 w-full ${isMenu ? 'shadow-md' : 'shadow-none'} hover:shadow-pink-400 shadow-pink-300 py-3 font-semibold text-center cursor-pointer`}>
						User Request
					</Link>
					<Link to={"/admin/additional_request"} state={{ pathname: location.pathname }} className={`px-3 w-full ${isMenu ? 'shadow-md' : 'shadow-none'} hover:shadow-pink-400 shadow-pink-300 py-3 font-semibold text-center cursor-pointer`}>
						Additional Movement Request
					</Link>
					<Link to={"/admin/staff_transections"} state={{ pathname: location.pathname }} className={`px-3 w-full ${isMenu ? 'shadow-md' : 'shadow-none'} hover:shadow-pink-400 shadow-pink-300 py-3 font-semibold text-center cursor-pointer`}>
						Staff Transections
					</Link>
					<Link to={"/admin/user_manipulation"} state={{ pathname: location.pathname }} className={`px-3 w-full ${isMenu ? 'shadow-md' : 'shadow-none'} hover:shadow-pink-400 shadow-pink-300 py-3 font-semibold text-center cursor-pointer`}>
						User Account Manipulation
					</Link>
					<Link to={"/admin/staff_manipulation"} state={{ pathname: location.pathname }} className={`px-3 w-full ${isMenu ? 'shadow-md' : 'shadow-none'} hover:shadow-pink-400 shadow-pink-300 py-3 font-semibold text-center cursor-pointer`}>
						Staff Manipulation
					</Link>
					<Link to={"/admin/location_details"} state={{ pathname: location.pathname }} className={`px-3 w-full ${isMenu ? 'shadow-md' : 'shadow-none'} hover:shadow-pink-400 shadow-pink-300 py-3 font-semibold text-center cursor-pointer`}>
						Location Details
					</Link>
					<Link to={"/admin/shop_location"} state={{ pathname: location.pathname }} className={`${current_User?.email === 'bismillah786e@gmail.com' ? 'block': 'hidden'} ${location.pathname.includes('/admin/shop_location')? 'text-pink-400': 'text-pink-200'} px-3 w-full ${isMenu ? 'shadow-md' : 'shadow-none'} hover:shadow-pink-400 shadow-pink-300 py-3 font-semibold text-center cursor-pointer`}>
						Shop Location
					</Link>
					<Link to={"/admin/set_shop_code"} state={{ pathname: location.pathname }} className={`${current_User?.email === 'bismillah786e@gmail.com' ? 'block': 'hidden'} px-3 w-full ${isMenu ? 'shadow-md' : 'shadow-none'} hover:shadow-pink-400 shadow-pink-300 py-3 font-semibold text-center cursor-pointer`}>
						Set Shop Code
					</Link>
					<Link to={"/admin/notice_panel"} state={{ pathname: location.pathname }} className={`rounded-b-2xl px-3 w-full ${isMenu ? 'shadow-md' : 'shadow-none'} hover:shadow-pink-400 shadow-pink-300 py-3 font-semibold text-center cursor-pointer`}>
						Notice Panel
					</Link>
				</div>
				<RiMenuUnfoldFill onClick={() => { setIsMenu(!isMenu) }} className={`lg:hidden text-2xl relative -left-5`} />
			</div>
			{/* 
			</div> */}
		</div >
	);
};

export default AdminNavbar;