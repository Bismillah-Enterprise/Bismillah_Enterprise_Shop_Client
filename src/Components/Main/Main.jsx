import React, { useEffect, useState } from 'react';
import Navbar from '../Shared/Navbar/Navbar';
import { Outlet } from 'react-router-dom';
import Loading from '../Shared/Loading/Loading';

const Main = () => {
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		setLoading(true);
		fetch('https://bismillah-enterprise-server.onrender.com/')
			.then(res => res.json())
			.then(() => {
				setLoading(false);
			})
		setLoading(false);
	}, [loading]);

	if (loading) {
		return (<div className='h-[100vh] overflow-hidden'><Loading></Loading></div>);
	}
	return (
		<div className="bg-gradient-to-r from-[#485563] to-[#29322c] h-screen flex flex-col">
			<Navbar />
			<div className="flex-1 overflow-auto h-full scrollbar-hide px-5">
				<Outlet />
			</div>
		</div>
	);
};

export default Main;