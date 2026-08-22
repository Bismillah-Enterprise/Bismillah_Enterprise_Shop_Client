import React, {
	useContext,
	useMemo,
	useState,
	useEffect,
} from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import useCurrentUser from '../../Hooks/useCurrentUser';

import {
	FiHome,
	FiClock,
	FiDollarSign,
	FiPackage,
	FiUsers,
	FiUserPlus,
	FiMapPin,
	FiMap,
	FiKey,
	FiBell,
	FiSettings,
	FiChevronDown,
	FiChevronRight,
	FiActivity,
	FiUserCheck,
	FiMenu,
	FiX,
	FiFileText,
} from 'react-icons/fi';

import { AuthContext } from '../../Providers/AuthProvider';
import { FaPlane } from 'react-icons/fa';

const AdminNavbar = () => {
	const [current_User] = useCurrentUser();

	const { isMenu, setIsMenu } = useContext(AuthContext);

	const location = useLocation();

	const [openGroup, setOpenGroup] = useState(null);

	const [mounted, setMounted] = useState(false);

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const handleLogOut = () => {
		logOut().then(() => {
			setLoading(false);

			if (location.pathname.includes('staffs')) {
				navigate('/');
			}
			else {
				navigate('/');
			}
		});
	};

	const isOwner =
		current_User?.email === 'bismillah786e@gmail.com';

	const isOwnerOrManager =
		current_User?.email === 'bismillah786e@gmail.com' ||
		current_User?.email === 'toyburrahman48@gmail.com';

	const handleIsMenuClose = () => {
		if (isMenu) {
			setIsMenu(false);
		}
	};

	const isActive = path => {
		if (path === '/') {
			return location.pathname === '/';
		}

		return location.pathname.includes(path);
	};

	const groups = useMemo(
		() => [
			{
				id: 'main',
				title: 'Main',
				icon: FiHome,

				items: [
					{
						label: 'Home',
						path: '/',
						icon: FiHome,
					},

					{
						label: 'Attendance',
						path: `/staff/uid_query/${current_User?.uid}`,
						icon: FiClock,
					},
				],
			},

			{
				id: 'business',
				title: 'Business',
				icon: FiPackage,

				items: [
					{
						label: 'Products',
						path: '/admin/products_manipulation',
						icon: FiPackage,
					},

					{
						label: 'Client Corner',
						path: '/admin/client_corner',
						icon: FiUsers,
					},

					{
						label: 'Air Ticket Clients',
						path: '/admin/air_ticket_client_corner',
						icon: FaPlane,
						ownerOnly: true,
					},
				],
			},

			{
				id: 'transactions',
				title: 'Transactions',
				icon: FiDollarSign,

				items: [
					{
						label: 'Daily Transactions',
						path: '/admin/daily_transactions',
						icon: FiDollarSign,
						managerAccess: true,
					},

					{
						label: 'Shop Transactions',
						path: '/admin/shop_transections',
						icon: FiActivity,
					},
					{
						label: 'Staff Transactions',
						path: '/admin/staff_transections',
						icon: FiUserCheck,
					},
				],
			},

			{
				id: 'people',
				title: 'People & Accounts',
				icon: FiUsers,

				items: [
					{
						label: 'User Requests',
						path: '/admin/user_request',
						icon: FiUserPlus,
						ownerOnly: true,
					},

					{
						label: 'Additional Requests',
						path: '/admin/additional_request',
						icon: FiFileText,
					},

					{
						label: 'User Accounts',
						path: '/admin/user_manipulation',
						icon: FiUsers,
					},

					{
						label: 'Staff Management',
						path: '/admin/staff_manipulation',
						icon: FiUserCheck,
					},
				],
			},

			{
				id: 'settings',
				title: 'Settings',
				icon: FiSettings,

				items: [
					{
						label: 'Location Details',
						path: '/admin/location_details',
						icon: FiMapPin,
					},

					{
						label: 'Shop Location',
						path: '/admin/shop_location',
						icon: FiMap,
						ownerOnly: true,
					},

					{
						label: 'Shop Code',
						path: '/admin/set_shop_code',
						icon: FiKey,
						ownerOnly: true,
					},

					{
						label: 'Notice Panel',
						path: '/admin/notice_panel',
						icon: FiBell,
					},
				],
			},
		],
		[current_User?.uid]
	);

	const filteredGroups = groups
		.map(group => ({
			...group,

			items: group.items.filter(item => {
				if (item.ownerOnly) {
					return isOwner;
				}

				if (item.managerAccess) {
					return isOwnerOrManager;
				}

				return true;
			}),
		}))
		.filter(group => group.items.length > 0);

	const getActiveGroup = () => {
		for (const group of filteredGroups) {
			if (
				group.items.some(item =>
					isActive(item.path)
				)
			) {
				return group.id;
			}
		}

		return null;
	};

	const activeGroup = getActiveGroup();

	const renderItem = item => {
		const Icon = item.icon;

		const active = isActive(item.path);

		return (
			<Link
				key={item.label}
				to={item.path}
				state={{
					pathname: location.pathname,
				}}
				onClick={handleIsMenuClose}
				className={`
					group relative flex items-center gap-3
					rounded-xl px-3 py-2.5
					border transition-all duration-300

					${active
						? `
								border-emerald-400/20
								bg-gradient-to-r
								from-emerald-400/[0.13]
								to-cyan-400/[0.05]
								text-emerald-200
								shadow-[0_4px_20px_rgba(16,185,129,0.05)]
							`
						: `
								border-transparent
								text-slate-300
								hover:border-white/[0.08]
								hover:bg-white/[0.045]
								hover:text-slate-100
							`
					}
				`}
			>
				{active && (
					<div
						className="
							absolute left-0 top-1/2
							h-6 w-[2px]
							-translate-y-1/2
							rounded-r-full
							bg-emerald-400
							shadow-[0_0_12px_rgba(52,211,153,0.9)]
						"
					/>
				)}

				<div
					className={`
						flex h-8 w-8 shrink-0
						items-center justify-center
						rounded-lg
						transition-all duration-300

						${active
							? `
									bg-emerald-400/10
									text-emerald-300
								`
							: `
									bg-white/[0.035]
									text-slate-400
									group-hover:bg-emerald-400/[0.08]
									group-hover:text-emerald-300
								`
						}
					`}
				>
					<Icon size={15} />
				</div>

				<span
					className="
						truncate
						text-[12px]
						font-medium
						leading-none
						tracking-[0.01em]
					"
				>
					{item.label}
				</span>

				{active && (
					<span
						className="
							ml-auto
							h-1.5 w-1.5
							shrink-0
							rounded-full
							bg-emerald-400
							shadow-[0_0_9px_rgba(52,211,153,0.9)]
						"
					/>
				)}
			</Link>
		);
	};

	const renderSidebar = mobile => (
		<div
			className="
				flex h-full flex-col
				overflow-hidden
				rounded-2xl
				border border-white/[0.10]
				bg-[#091714]
				shadow-[0_30px_100px_rgba(0,0,0,0.65)]
				backdrop-blur-2xl
			"
		>
			{/* ================= HEADER ================= */}

			<div
				className="
					relative
					border-b border-white/[0.07]
					p-4
				"
			>
				<div
					className="
						pointer-events-none
						absolute left-8 right-8 top-0
						h-px
						bg-gradient-to-r
						from-transparent
						via-emerald-400/60
						to-transparent
					"
				/>

				<div className="flex items-center justify-between">
					<Link
						to="/"
						onClick={handleIsMenuClose}
						className="
							flex items-center gap-3
							outline-none
						"
					>
						<div
							className="
								relative
								flex h-10 w-10
								items-center justify-center
								rounded-xl
								border border-emerald-400/15
								bg-gradient-to-br
								from-emerald-400/10
								to-cyan-400/[0.04]
							"
						>
							<FiSettings
								size={18}
								className="text-emerald-300"
							/>

							<span
								className="
									absolute right-1 top-1
									h-1.5 w-1.5
									rounded-full
									bg-emerald-400
									shadow-[0_0_9px_rgba(52,211,153,0.9)]
								"
							/>
						</div>

						<div>
							<p
								className="
									text-[9px]
									font-semibold
									uppercase
									tracking-[0.25em]
									text-emerald-300/80
								"
							>
								Management
							</p>

							<h2
								className="
									mt-0.5
									text-sm
									font-semibold
									text-white
								"
							>
								Admin Panel
							</h2>
						</div>
					</Link>

					{mobile && (
						<button
							type="button"
							onClick={() => setIsMenu(false)}
							aria-label="Close admin menu"
							className="
								flex h-9 w-9
								items-center justify-center
								rounded-xl
								border border-white/[0.08]
								bg-white/[0.035]
								text-slate-300
								transition-all duration-200
								hover:border-emerald-400/20
								hover:bg-emerald-400/[0.06]
								hover:text-emerald-300
								active:scale-95
							"
						>
							<FiX size={17} />
						</button>
					)}
				</div>

				{/* ================= USER ================= */}

				<div
					className="
						mt-4
						rounded-xl
						border border-white/[0.07]
						bg-white/[0.025]
						px-3 py-2.5
					"
				>
					<div className="flex items-center gap-2.5">
						<div
							className="
								flex h-8 w-8 shrink-0
								items-center justify-center
								rounded-full
								border border-emerald-400/10
								bg-gradient-to-br
								from-emerald-400/20
								to-cyan-400/10
								text-[10px]
								font-bold
								text-emerald-300
							"
						>
							{current_User?.displayName
								?.charAt(0)
								?.toUpperCase() ||
								current_User?.email
									?.charAt(0)
									?.toUpperCase() ||
								'A'}
						</div>

						<div className="min-w-0 flex-1">
							<p
								className="
									truncate
									text-[11px]
									font-medium
									text-slate-200
								"
							>
								{current_User?.displayName ||
									'Administrator'}
							</p>

							<p
								className="
									mt-0.5
									truncate
									text-[9px]
									text-slate-400
								"
							>
								{current_User?.email || ''}
							</p>
						</div>

						<div
							className="
								flex items-center gap-1.5
							"
						>
							<span
								className="
									h-1.5 w-1.5
									rounded-full
									bg-emerald-400
									shadow-[0_0_8px_rgba(52,211,153,0.9)]
								"
							/>

							<span
								className="
									text-[8px]
									font-medium
									tracking-wider
									text-emerald-300/70
								"
							>
								ONLINE
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* ================= NAVIGATION ================= */}

			<div
				className="
					scrollbar-hide
					min-h-0
					flex-1
					overflow-y-auto
					px-3 py-3
				"
			>
				<div className="space-y-1">
					{filteredGroups.map(group => {
						const GroupIcon = group.icon;

						const isOpen =
							openGroup === group.id ||
							activeGroup === group.id;

						return (
							<div key={group.id}>
								<button
									type="button"
									onClick={() =>
										setOpenGroup(prev =>
											prev === group.id
												? null
												: group.id
										)
									}
									className={`
										flex w-full
										items-center gap-2
										rounded-xl
										px-3 py-2.5
										text-left
										transition-all duration-300

										${isOpen
											? `
													bg-white/[0.025]
													text-slate-200
												`
											: `
													text-slate-400
													hover:bg-white/[0.025]
													hover:text-slate-200
												`
										}
									`}
								>
									<GroupIcon size={13} />

									<span
										className="
											flex-1
											text-[9px]
											font-semibold
											uppercase
											tracking-[0.18em]
										"
									>
										{group.title}
									</span>

									{isOpen ? (
										<FiChevronDown size={13} />
									) : (
										<FiChevronRight size={13} />
									)}
								</button>

								<div
									className={`
										overflow-hidden
										transition-all
										duration-300

										${isOpen
											? 'max-h-[600px] opacity-100'
											: 'max-h-0 opacity-0'
										}
									`}
								>
									<div
										className="space-y-1 pb-1 pl-1"
									>
										{group.items.map(renderItem)}
									</div>
								</div>
							</div>
						);
					})}
					<button
						onClick={handleLogOut}
						className="w-full mt-4 px-4 sm:px-5 h-10 sm:h-11 rounded-xl border border-red-400/15 bg-red-400/[0.04] text-red-300 text-sm sm:text-base font-bold hover:bg-red-500/10 hover:border-red-400/30 hover:-translate-y-0.5 transition-all duration-300"
					>
						Logout
					</button>
				</div>
			</div>

			{/* ================= FOOTER ================= */}

			<div
				className="
					border-t border-white/[0.07]
					p-3
				"
			>
				<div
					className="
						flex items-center
						justify-between
						rounded-xl
						border border-emerald-400/[0.10]
						bg-emerald-400/[0.025]
						px-3 py-2.5
					"
				>
					<div className="flex items-center gap-2">
						<span className="relative flex h-2 w-2">
							<span
								className="
									absolute
									inline-flex
									h-full w-full
									animate-ping
									rounded-full
									bg-emerald-400
									opacity-40
								"
							/>

							<span
								className="
									relative
									h-2 w-2
									rounded-full
									bg-emerald-400
								"
							/>
						</span>

						<span
							className="
								text-[9px]
								font-medium
								text-slate-400
							"
						>
							System Online
						</span>
					</div>

					<span
						className="
							text-[8px]
							tracking-widest
							text-emerald-300/60
						"
					>
						SECURE
					</span>
				</div>
			</div>
		</div>
	);

	/* =========================================================
	   DESKTOP NAVBAR
	========================================================= */

	const desktopNavbar = (
		<div
			className="
				hidden
				shrink-0
				lg:block
				lg:w-[280px]
				lg:py-6
				lg:pl-5
				xl:w-[300px]
			"
		>
			<div className="sticky top-6 h-[calc(100vh-48px)]">
				{renderSidebar(false)}
			</div>
		</div>
	);

	/* =========================================================
	   MOBILE NAVBAR
	========================================================= */

	const mobileNavbar = mounted
		? createPortal(
			<>
				{/* MOBILE OPEN BUTTON */}

				<button
					type="button"
					onClick={() =>
						setIsMenu(!isMenu)
					}
					aria-label={
						isMenu
							? 'Close admin menu'
							: 'Open admin menu'
					}
					className={`
							${isMenu ? 'hidden' : 'fixed'}
							left-4 top-3 md:top-5
							z-[2147483647]
							flex h-11 w-11
							items-center justify-center
							rounded-xl
							border border-white/[0.12]
							bg-[#091714]
							text-slate-200
							shadow-[0_10px_40px_rgba(0,0,0,0.6)]
							backdrop-blur-xl
							transition-all duration-300
							hover:border-emerald-400/30
							hover:bg-[#0c1d19]
							hover:text-emerald-300
							active:scale-95
							lg:hidden
						`}
				>
					{isMenu ? (
						<FiX size={19} />
					) : (
						<FiMenu size={19} />
					)}
				</button>

				{/* BACKDROP */}

				<div
					onClick={() =>
						setIsMenu(false)
					}
					className={`
							fixed
							inset-0
							z-[2147483640]
							bg-black/70
							backdrop-blur-[4px]
							transition-all
							duration-300
							lg:hidden

							${isMenu
							? `
										pointer-events-auto
										opacity-100
									`
							: `
										pointer-events-none
										opacity-0
									`
						}
						`}
				/>

				{/* DRAWER */}

				<div
					className={`
							fixed
							bottom-3
							left-3
							top-3
							z-[2147483646]
							w-[min(300px,calc(100vw-24px))]
							lg:hidden

							transition-transform
							duration-500
							ease-[cubic-bezier(0.22,1,0.36,1)]

							${isMenu
							? 'translate-x-0'
							: '-translate-x-[calc(100%+40px)]'
						}
						`}
				>
					{renderSidebar(true)}
				</div>
			</>,
			document.body
		)
		: null;

	return (
		<>
			{desktopNavbar}

			{mobileNavbar}
		</>
	);
};

export default AdminNavbar;