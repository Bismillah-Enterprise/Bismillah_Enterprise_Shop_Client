import React, { useEffect, useState } from 'react';
import Navbar from '../Shared/Navbar/Navbar';
import { Outlet, useLocation } from 'react-router-dom';
import Loading from '../Shared/Loading/Loading';

const Main = () => {
	const [loading, setLoading] = useState(false);
	const location = useLocation();
	const [mobileNav, setMobileNav] = useState(false);

	useEffect(() => {

		const handleResize = () => {

			const width = window.innerWidth;
			if (width >= 1024) {

				setMobileNav(false);

			} else {

				setMobileNav(true);

			}

		};

		handleResize();

		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);

	}, []);

	return (
		<div className="min-h-screen h-screen flex flex-col bg-[#071311] text-white relative overflow-hidden">

			{/* Ambient background */}
			<div className="fixed inset-0 pointer-events-none overflow-hidden">

				<div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[140px]" />

				<div className="absolute top-[25%] -right-40 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[150px]" />

				<div className="absolute -bottom-52 left-[35%] w-[550px] h-[550px] rounded-full bg-violet-500/10 blur-[160px]" />

			</div>

			{/* Navbar */}
			<div className={`${location.pathname.includes('admin') && mobileNav ? 'hidden' : 'relative'} z-50`}>
				<Navbar />
			</div>

			{/* Page content */}
			<div className="relative z-10 flex-1 overflow-auto h-full scrollbar-hide px-3 sm:px-5 lg:px-8">

				<Outlet />

			</div>

		</div>
	);
};

export default Main;