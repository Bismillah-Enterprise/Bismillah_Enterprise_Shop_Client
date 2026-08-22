import React, { useEffect, useState } from 'react';

const Clock = () => {
	const [time, setTime] = useState(new Date());

	useEffect(() => {
		const timer = setInterval(() => {
			setTime(new Date());
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	const formattedTime = time.toLocaleTimeString('en-BD', {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: true,
	});

	const formattedDate = time.toLocaleDateString('en-BD', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});

	return (
		<div className="flex justify-center px-3">
			<div
				className="
					group relative mt-5 w-fit min-w-[280px] sm:min-w-[340px]
					overflow-hidden rounded-2xl
					border border-emerald-400/15
					bg-[#0b1b18]/70
					px-7 py-4 sm:px-10 sm:py-5
					text-center
					backdrop-blur-xl
					shadow-[0_0_35px_rgba(16,185,129,0.08)]
					transition-all duration-500
					hover:border-emerald-400/30
					hover:shadow-[0_0_45px_rgba(16,185,129,0.15)]
				"
			>
				{/* Ambient glow */}
				<div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-emerald-500/10 blur-3xl transition-all duration-500 group-hover:bg-emerald-400/20" />
				<div className="pointer-events-none absolute -bottom-14 -left-10 h-28 w-28 rounded-full bg-cyan-500/10 blur-3xl" />

				{/* Top accent */}
				<div className="mx-auto mb-3 h-px w-16 bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent" />

				{/* Live indicator */}
				<div className="mb-2 flex items-center justify-center gap-2">
					<span className="relative flex h-2 w-2">
						<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
						<span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
					</span>

					<span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald-300/70">
						Live Time
					</span>
				</div>

				{/* Time */}
				<h2
					className="
						relative text-3xl sm:text-4xl
						font-bold tracking-wide
						text-emerald-100
						drop-shadow-[0_0_15px_rgba(52,211,153,0.18)]
					"
				>
					{formattedTime}
				</h2>

				{/* Date */}
				<p className="relative mt-1 text-xs sm:text-sm font-medium tracking-wide text-cyan-100/70">
					{formattedDate}
				</p>

				{/* Bottom accent */}
				<div className="mx-auto mt-3 h-px w-24 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
			</div>
		</div>
	);
};

export default Clock;