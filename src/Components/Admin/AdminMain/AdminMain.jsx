import React, { useContext } from 'react';
import AdminNavbar from '../AdminNavbar/AdminNavbar';
import { Outlet } from 'react-router-dom';
import { AuthContext } from '../../Providers/AuthProvider';

const AdminMain = () => {
	const {isMenu, setIsMenu} = useContext(AuthContext);
	return (
		<div className='flex md:gap-10 p-5 md:p-10 h-full'>
			<div className='max-h-fit md:w-[400px] shadow-lg shadow-pink-200 rounded-2xl overflow-scroll scrollbar-hide'>
				<AdminNavbar></AdminNavbar>
			</div>
			<div onClick={() => {setIsMenu(false)}} className='shadow-lg shadow-pink-200 p-5 rounded-2xl flex-1 h-full'>
				<Outlet></Outlet>
			</div>
		</div>
	);
};

export default AdminMain;