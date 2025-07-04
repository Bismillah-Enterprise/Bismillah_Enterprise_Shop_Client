import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import useCurrentUser from '../../Hooks/useCurrentUser';
import { RiMenuUnfoldFill } from 'react-icons/ri';
import { AuthContext } from '../../Providers/AuthProvider';

const AdminNavbar = () => {
	const [current_User] = useCurrentUser();
	const {isMenu, setIsMenu} = useContext(AuthContext);
	const handleIsMenuClose = () => {
		if(isMenu) {
			
		}
	}
	return (
		<div className='text-pink-200'>
			<div className='min-h-fit rounded-2xl shadow-lg shadow-pink-300 hidden md:flex gap-5 flex-col items-center'>
				<Link to={"/"} className='w-full shadow-md hover:shadow-pink-400 rounded-t-2xl shadow-pink-300 py-3 font-semibold text-center cursor-pointer'>
					Home
				</Link>
				<Link to={`/staff/uid_query/${current_User?.uid}`} className='w-full shadow-md hover:shadow-pink-400 rounded-t-2xl shadow-pink-300 py-3 font-semibold text-center cursor-pointer'>
					Staff Page
				</Link>
				<Link to={"/admin/user_request"} className='w-full shadow-md hover:shadow-pink-400 shadow-pink-300 py-3 font-semibold text-center cursor-pointer'>
					User Request
				</Link>
				<Link to={"/admin/user_account_manipulation"} className='w-full shadow-md hover:shadow-pink-400 shadow-pink-300 py-3 font-semibold text-center cursor-pointer'>
					User Account Manipulation
				</Link>
				<Link to={"/admin/staff_manipulation"} className='w-full shadow-md hover:shadow-pink-400 shadow-pink-300 py-3 font-semibold text-center cursor-pointer'>
					Staff Manipulation
				</Link>
				<Link to={"/admin/shop_location"} className='w-full shadow-md hover:shadow-pink-400 shadow-pink-300 py-3 font-semibold text-center cursor-pointer'>
					Set Shop Location
				</Link>
				<Link to={"/admin/shop_code"} className='w-full shadow-md hover:shadow-pink-400 shadow-pink-300 py-3 font-semibold text-center cursor-pointer'>
					Set Shop Code
				</Link>
				<Link to={"/admin/notice_panel"} className='rounded-b-2xl w-full shadow-md hover:shadow-pink-400 shadow-pink-300 py-3 font-semibold text-center cursor-pointer'>
					Notice Panel
				</Link>
			</div>
			<div className='block md:hidden absolute'>
				<div id='mobileMenu' className={`relative ${isMenu ? 'left-0' : '-left-[250px]'} -top-8 duration-300`}>
					<RiMenuUnfoldFill onClick={() => { setIsMenu(!isMenu) }} className={`absolute ${isMenu ? '-right-5' : '-right-[50px]'} duration-300 top-2`} />
					<div onClick={() => { setIsMenu(false) }} className={`w-fit min-h-fit rounded-2xl ${isMenu ? 'shadow-lg' : 'shadow-none'}shadow-lg shadow-pink-300 flex md:hidden flex-col items-center bg-linear-to-r from-[#485563] to-[#29322c]`}>
						<Link to={"/"} className={`px-3 w-full ${isMenu ? 'shadow-md' : 'shadow-none'} hover:shadow-pink-400 rounded-t-2xl shadow-pink-300 py-3 font-semibold text-center cursor-pointer`}>
							Home
						</Link>
						<Link to={`/staff/uid_query/${current_User?.uid}`} className={`px-3 w-full ${isMenu ? 'shadow-md' : 'shadow-none'} hover:shadow-pink-400 rounded-t-2xl shadow-pink-300 py-3 font-semibold text-center cursor-pointer`}>
							Staff Page
						</Link>
						<Link to={"/admin/user_request"} className={`px-3 w-full ${isMenu ? 'shadow-md' : 'shadow-none'} hover:shadow-pink-400 shadow-pink-300 py-3 font-semibold text-center cursor-pointer`}>
							User Request
						</Link>
						<Link to={"/admin/user_account_manipulation"} className={`px-3 w-full ${isMenu ? 'shadow-md' : 'shadow-none'} hover:shadow-pink-400 shadow-pink-300 py-3 font-semibold text-center cursor-pointer`}>
							User Account Manipulation
						</Link>
						<Link to={"/admin/staff_manipulation"} className={`px-3 w-full ${isMenu ? 'shadow-md' : 'shadow-none'} hover:shadow-pink-400 shadow-pink-300 py-3 font-semibold text-center cursor-pointer`}>
							Staff Manipulation
						</Link>
						<Link to={"/admin/shop_location"} className={`px-3 w-full ${isMenu ? 'shadow-md' : 'shadow-none'} hover:shadow-pink-400 shadow-pink-300 py-3 font-semibold text-center cursor-pointer`}>
							Set Shop Location
						</Link>
						<Link to={"/admin/shop_code"} className={`px-3 w-full ${isMenu ? 'shadow-md' : 'shadow-none'} hover:shadow-pink-400 shadow-pink-300 py-3 font-semibold text-center cursor-pointer`}>
							Set Shop Code
						</Link>
						<Link to={"/admin/notice_panel"} className={`rounded-b-2xl px-3 w-full ${isMenu ? 'shadow-md' : 'shadow-none'} hover:shadow-pink-400 shadow-pink-300 py-3 font-semibold text-center cursor-pointer`}>
							Notice Panel
						</Link>

					</div>
				</div>
			</div>
		</div >
	);
};

export default AdminNavbar;