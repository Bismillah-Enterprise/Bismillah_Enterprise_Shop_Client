import React from 'react';
import Navbar from '../Shared/Navbar/Navbar';
import { Outlet } from 'react-router-dom';

const Main = () => {
	return (
		<div className="bg-gradient-to-r from-[#485563] to-[#29322c] h-screen flex flex-col">
			<Navbar />
			<div className="flex-1 overflow-auto">
				<Outlet />
			</div>
		</div>
	);
};

export default Main;