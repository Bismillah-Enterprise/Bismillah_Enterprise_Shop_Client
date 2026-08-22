import { ShieldOff, ArrowLeft, Home, LockKeyhole } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const NotAuthorized = () => {
	return (
		<div className="relative min-h-full w-full overflow-hidden bg-[#071311] text-white flex items-center justify-center px-4 py-10">

			{/* Ambient Background */}
			<div className="absolute inset-0 pointer-events-none overflow-hidden">
				<div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[140px]" />
				<div className="absolute top-[20%] -right-40 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[150px]" />
				<div className="absolute -bottom-52 left-[35%] w-[550px] h-[550px] rounded-full bg-violet-500/10 blur-[160px]" />
			</div>

			{/* Grid */}
			<div
				className="absolute inset-0 opacity-[0.035] pointer-events-none"
				style={{
					backgroundImage:
						'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
					backgroundSize: '42px 42px',
				}}
			/>

			{/* Main Card */}
			<div className="relative z-10 w-full max-w-lg">

				<div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035] backdrop-blur-2xl shadow-[0_30px_100px_rgba(0,0,0,0.5)]">

					{/* Top glow */}
					<div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-40 bg-emerald-400/10 blur-[80px]" />

					<div className="relative px-6 py-10 sm:px-10 sm:py-12 text-center">

						{/* Icon */}
						<div className="relative mx-auto mb-7 w-24 h-24 flex items-center justify-center">

							<div className="absolute inset-0 rounded-full bg-emerald-400/10 blur-2xl animate-pulse" />

							<div className="relative w-24 h-24 rounded-full border border-emerald-400/20 bg-emerald-400/[0.04] flex items-center justify-center shadow-[0_0_35px_rgba(52,211,153,0.08)]">
								<ShieldOff
									size={48}
									strokeWidth={1.5}
									className="text-emerald-300"
								/>
							</div>

							{/* Lock badge */}
							<div className="absolute -right-1 -bottom-1 w-8 h-8 rounded-full border border-white/10 bg-[#0b1b17] flex items-center justify-center shadow-lg">
								<LockKeyhole
									size={15}
									className="text-cyan-300"
								/>
							</div>
						</div>

						{/* Status */}
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-400/15 bg-emerald-400/[0.05] text-emerald-300/80 text-[11px] uppercase tracking-[0.2em] font-medium mb-5">
							<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
							Restricted Area
						</div>

						{/* Heading */}
						<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
							Access Denied
						</h1>

						<p className="mt-4 max-w-md mx-auto text-sm sm:text-base leading-7 text-slate-400">
							You don't have the required permission to view this page.
							Please return to a page you are authorized to access.
						</p>

						{/* Divider */}
						<div className="my-8 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

						{/* Actions */}
						<div className="flex flex-col sm:flex-row items-center justify-center gap-3">

							<Link
								to="/"
								className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-semibold text-sm text-[#071311] bg-linear-to-r from-emerald-300 via-cyan-300 to-emerald-300 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-400/20 hover:-translate-y-0.5 transition-all duration-300"
							>
								<Home size={17} />
								Return to Home
								<ArrowLeft
									size={16}
									className="rotate-180 transition-transform duration-300 group-hover:translate-x-1"
								/>
							</Link>

							<button
								onClick={() => window.history.back()}
								className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 font-semibold text-sm text-slate-300 hover:bg-white/[0.07] hover:text-white hover:border-emerald-400/20 transition-all duration-300"
							>
								<ArrowLeft size={17} />
								Go Back
							</button>

						</div>
					</div>

					{/* Bottom accent */}
					<div className="h-[2px] w-full bg-linear-to-r from-transparent via-emerald-400/50 to-transparent" />
				</div>

				<p className="text-center text-[11px] text-slate-600 mt-5 tracking-wide">
					SECURITY • AUTHORIZATION • PROTECTED
				</p>
			</div>
		</div>
	);
};

export default NotAuthorized;