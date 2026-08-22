import React from 'react';
import { PuffLoader } from 'react-spinners';

const Loading = () => {
	return (
		<div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#071311] px-4 text-white">

			{/* Ambient Background */}
			<div className="absolute inset-0 pointer-events-none overflow-hidden">

				<div className="absolute -top-40 -left-40 w-[420px] h-[420px] rounded-full bg-emerald-500/10 blur-[130px] animate-pulse" />

				<div className="absolute top-[25%] -right-40 w-[450px] h-[450px] rounded-full bg-cyan-500/10 blur-[140px] animate-pulse [animation-delay:1s]" />

				<div className="absolute -bottom-48 left-[35%] w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-[150px] animate-pulse [animation-delay:2s]" />

			</div>

			{/* Subtle Grid */}
			<div
				className="absolute inset-0 opacity-[0.035] pointer-events-none"
				style={{
					backgroundImage:
						'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
					backgroundSize: '40px 40px',
				}}
			/>

			{/* Loading Card */}
			<div className="relative z-10 w-full max-w-md">

				<div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] px-8 py-10 shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:px-12">

					{/* Top Glow */}
					<div className="absolute -top-20 left-1/2 h-32 w-48 -translate-x-1/2 bg-emerald-400/15 blur-[70px]" />

					{/* Animated Border Glow */}
					<div className="pointer-events-none absolute inset-0 rounded-3xl border border-emerald-400/10" />

					<div className="relative flex flex-col items-center text-center">

						{/* Loader */}
						<div className="relative mb-7 flex items-center justify-center">

							<div className="absolute h-28 w-28 rounded-full bg-emerald-400/10 blur-2xl animate-pulse" />

							<div className="absolute h-[88px] w-[88px] rounded-full border border-cyan-400/10 animate-[spin_6s_linear_infinite]" />

							<PuffLoader
								color="#34d399"
								size={68}
								speedMultiplier={1.1}
							/>

						</div>

						{/* Status */}
						<div className="mb-3 flex items-center gap-2">

							<span className="relative flex h-2.5 w-2.5">
								<span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />

								<span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
							</span>

							<span className="text-xs font-medium uppercase tracking-[0.25em] text-emerald-300/80">
								Loading
							</span>

						</div>

						{/* Main Text */}
						<h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
							Preparing Everything
						</h2>

						<p className="mt-3 max-w-xs text-sm leading-6 text-slate-400">
							Please wait while we securely prepare your dashboard.
						</p>

						{/* Progress Animation */}
						<div className="mt-7 w-full max-w-xs">

							<div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">

								<div className="h-full w-1/2 rounded-full bg-linear-to-r from-emerald-400 via-cyan-400 to-violet-400 animate-[loading_1.6s_ease-in-out_infinite]" />

							</div>

							<div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">

								<span>Initializing</span>

								<span className="text-emerald-300/70">
									Please Wait...
								</span>

							</div>

						</div>

						{/* Small Note */}
						<p className="mt-7 text-[11px] text-slate-600">
							It may take up to 1 minute
						</p>

					</div>

				</div>

			</div>

			{/* Custom Animation */}
			<style>
				{`
					@keyframes loading {
						0% {
							transform: translateX(-100%);
						}

						50% {
							transform: translateX(100%);
						}

						100% {
							transform: translateX(200%);
						}
					}
				`}
			</style>

		</div>
	);
};

export default Loading;