import React from 'react';
import { Link } from 'react-router-dom';
import {
	FiActivity,
	FiArrowUpRight,
	FiCommand,
	FiDollarSign,
	FiPackage,
	FiShield,
	FiUserCheck,
	FiUsers,
	FiMapPin,
	FiBell,
} from 'react-icons/fi';

const AdminHome = () => {
	const shortcuts = [
		{
			title: 'Client Corner',
			description: 'Manage client information',
			path: '/admin/client_corner',
			icon: FiUsers,
			accent: 'emerald',
		},
		{
			title: 'Staff Management',
			description: 'Manage staff accounts',
			path: '/admin/staff_manipulation',
			icon: FiUserCheck,
			accent: 'cyan',
		},
		{
			title: 'Products',
			description: 'Manage your products',
			path: '/admin/products_manipulation',
			icon: FiPackage,
			accent: 'violet',
		},
		{
			title: 'Shop Transactions',
			description: 'View shop transactions',
			path: '/admin/shop_transections',
			icon: FiActivity,
			accent: 'emerald',
		},
		{
			title: 'Location Details',
			description: 'Manage location information',
			path: '/admin/location_details',
			icon: FiMapPin,
			accent: 'cyan',
		},
		{
			title: 'Notice Panel',
			description: 'Manage important notices',
			path: '/admin/notice_panel',
			icon: FiBell,
			accent: 'violet',
		},
	];

	return (
		<div className="relative min-h-[calc(100vh-110px)] w-full overflow-hidden py-6 sm:py-8">
			{/* Ambient Background */}
			<div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 animate-pulse rounded-full bg-emerald-500/[0.045] blur-[110px]" />

			<div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 animate-pulse rounded-full bg-cyan-500/[0.045] blur-[120px] [animation-delay:1.5s]" />

			<div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/[0.025] blur-[120px]" />

			{/* Floating dots */}
			<div className="pointer-events-none absolute left-[12%] top-[20%] h-1 w-1 animate-pulse rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(52,211,153,0.9)]" />

			<div className="pointer-events-none absolute right-[15%] top-[18%] h-1 w-1 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.9)] [animation-delay:1s]" />

			<div className="pointer-events-none absolute bottom-[15%] left-[25%] h-1 w-1 animate-pulse rounded-full bg-violet-300 shadow-[0_0_14px_rgba(167,139,250,0.9)] [animation-delay:2s]" />

			<div className="relative z-10 mx-auto w-full max-w-6xl">
				{/* Hero */}
				<div className="group relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-[#0d201c]/95 via-[#091714]/95 to-[#081311]/95 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:p-8 lg:p-10">
					{/* Top glow */}
					<div className="pointer-events-none absolute left-[12%] right-[12%] top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

					{/* Background glows */}
					<div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-500/[0.06] blur-[100px] transition-all duration-700 group-hover:bg-emerald-500/[0.09]" />

					<div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-cyan-500/[0.035] blur-[100px]" />

					{/* Grid */}
					<div
						className="pointer-events-none absolute inset-0 opacity-[0.018]"
						style={{
							backgroundImage:
								'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
							backgroundSize: '38px 38px',
						}}
					/>

					<div className="relative z-10">
						{/* Top */}
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.06]">
									<FiCommand
										size={20}
										className="text-emerald-300"
									/>

									<span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
								</div>

								<div>
									<p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-400/70">
										Control Center
									</p>

									<p className="mt-1 text-xs text-slate-500">
										Administrator workspace
									</p>
								</div>
							</div>

							<div className="hidden items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/[0.04] px-3 py-1.5 sm:flex">
								<span className="relative flex h-2 w-2">
									<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />

									<span className="relative h-2 w-2 rounded-full bg-emerald-400" />
								</span>

								<span className="text-[9px] font-medium tracking-[0.15em] text-emerald-300">
									SYSTEM OPERATIONAL
								</span>
							</div>
						</div>

						{/* Hero text */}
						<div className="mt-10 max-w-3xl sm:mt-12">
							<div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5">
								<span className="text-[9px] text-emerald-400">
									✦
								</span>

								<span className="text-[9px] font-medium uppercase tracking-[0.2em] text-slate-400">
									Welcome to your workspace
								</span>
							</div>

							<h1 className="text-4xl font-bold leading-[1.08] tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl">
								Everything under
								<br />

								<span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-300 bg-clip-text text-transparent">
									your control.
								</span>
							</h1>

							<p className="mt-6 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
								Manage your shop operations, products, users,
								transactions and daily activities from one
								secure administration workspace.
							</p>
						</div>

						{/* Quick shortcuts */}
						<div className="mt-10">
							<div className="mb-4 flex items-center justify-between">
								<div>
									<p className="text-xs font-semibold text-slate-300">
										Quick Access
									</p>

									<p className="mt-1 text-[10px] text-slate-600">
										Your frequently used admin sections
									</p>
								</div>

								<div className="hidden items-center gap-2 sm:flex">
									<span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
									<span className="text-[9px] uppercase tracking-widest text-slate-600">
										Shortcuts
									</span>
								</div>
							</div>

							<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
								{shortcuts.map(item => {
									const Icon = item.icon;

									return (
										<Link
											key={item.title}
											to={item.path}
											className="group/shortcut relative overflow-hidden rounded-2xl border border-white/[0.06] bg-black/10 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/15 hover:bg-white/[0.025] hover:shadow-[0_12px_35px_rgba(0,0,0,0.2)]"
										>
											<div className="flex items-center justify-between">
												<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.035] text-slate-400 transition-all duration-300 group-hover/shortcut:bg-emerald-400/[0.07] group-hover/shortcut:text-emerald-300">
													<Icon size={18} />
												</div>

												<FiArrowUpRight
													size={15}
													className="text-slate-700 transition-all duration-300 group-hover/shortcut:-translate-y-0.5 group-hover/shortcut:translate-x-0.5 group-hover/shortcut:text-emerald-400"
												/>
											</div>

											<p className="mt-4 text-sm font-semibold text-slate-200 transition-colors group-hover/shortcut:text-white">
												{item.title}
											</p>

											<p className="mt-1 text-[10px] text-slate-600">
												{item.description}
											</p>

											<div className="absolute bottom-0 left-4 right-4 h-px scale-x-0 bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent transition-transform duration-500 group-hover/shortcut:scale-x-100" />
										</Link>
									);
								})}
							</div>
						</div>

						{/* Status row */}
						<div className="mt-8 grid gap-3 sm:grid-cols-3">
							<div className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.015] px-4 py-3">
								<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/[0.05] text-emerald-400/70">
									<FiActivity size={15} />
								</div>

								<div>
									<p className="text-[9px] uppercase tracking-widest text-slate-600">
										System
									</p>

									<p className="mt-0.5 text-xs font-medium text-slate-300">
										Operational
									</p>
								</div>

								<span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
							</div>

							<div className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.015] px-4 py-3">
								<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/[0.05] text-cyan-400/70">
									<FiShield size={15} />
								</div>

								<div>
									<p className="text-[9px] uppercase tracking-widest text-slate-600">
										Security
									</p>

									<p className="mt-0.5 text-xs font-medium text-slate-300">
										Protected
									</p>
								</div>

								<span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
							</div>

							<div className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.015] px-4 py-3">
								<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-400/[0.05] text-violet-400/70">
									<FiTrendingUpIcon />
								</div>

								<div>
									<p className="text-[9px] uppercase tracking-widest text-slate-600">
										Workspace
									</p>

									<p className="mt-0.5 text-xs font-medium text-slate-300">
										Ready
									</p>
								</div>

								<span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]" />
							</div>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="mt-4 flex items-center justify-center gap-2">
					<span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />

					<span className="text-[9px] uppercase tracking-[0.18em] text-slate-700">
						Secure Administration Environment
					</span>
				</div>
			</div>
		</div>
	);
};

const FiTrendingUpIcon = () => (
	<FiDollarSign size={15} />
);

export default AdminHome;