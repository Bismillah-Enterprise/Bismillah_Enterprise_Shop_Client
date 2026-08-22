import React, { useContext, useEffect, useState } from 'react';
import AdminNavbar from '../AdminNavbar/AdminNavbar';
import { Link, Outlet } from 'react-router-dom';
import { AuthContext } from '../../Providers/AuthProvider';
import { FiHome } from 'react-icons/fi';

const AdminMain = () => {
	const { setIsMenu } = useContext(AuthContext);
	const [loading, setLoading] = useState(false);
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
		<div className="relative h-screen w-full overflow-hidden text-white">
			{/* Ambient background */}
			<div className="pointer-events-none fixed inset-0 overflow-hidden">
				<div className="absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-emerald-500/[0.035] blur-[130px]" />

				<div className="absolute -right-40 top-[25%] h-[450px] w-[450px] rounded-full bg-cyan-500/[0.035] blur-[140px]" />

				<div className="absolute -bottom-40 left-[35%] h-[500px] w-[500px] rounded-full bg-violet-500/[0.025] blur-[150px]" />
			</div>

			<div className="relative z-10 flex h-full w-full">
				<AdminNavbar />

				<main
					onClick={() => setIsMenu(false)}
					className="
				min-w-0
				flex-1
				h-full
				overflow-y-auto
				px-3
				pb-24
				pt-3
				sm:px-5
				sm:pt-20
				lg:px-6
				lg:pb-16
				lg:pt-6
			"
				>
					<Link
						to="/"
						className={`
					${mobileNav ? 'flex' : 'hidden'}
					items-center
					justify-center
					mb-7
				`}
					>
						<span className="
					flex items-center gap-4
					rounded-2xl
					border border-white/[0.06]
					bg-[#071311]/60
					px-10 py-3
					text-[12px] font-medium
					shadow-[0_25px_80px_rgba(0,0,0,0.25)]
					backdrop-blur-xl
				">
							<FiHome size={18} />
							Home
						</span>
					</Link>

					{/* CONTENT CARD */}
					<div className="
				flex
				h-[calc(100%-0px)]
				min-h-0
				w-full
				flex-col
				overflow-hidden
				rounded-2xl
				border border-white/[0.06]
				bg-[#071311]/60
				shadow-[0_25px_80px_rgba(0,0,0,0.25)]
				backdrop-blur-xl
			">
						<div className="
					flex
					min-h-0
					flex-1
					w-full
					flex-col
					p-4
					sm:p-5
					lg:p-6
				">
							<div className="flex min-h-0 flex-1 w-full flex-col overflow-scroll scrollbar-hide">
								<Outlet />
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default AdminMain;