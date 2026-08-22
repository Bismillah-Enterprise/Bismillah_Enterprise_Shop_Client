import React, { useMemo, useState } from 'react';
import { FiArrowRight, FiSearch, FiUsers } from 'react-icons/fi';
import { Link, useLoaderData, useLocation } from 'react-router-dom';

const StaffTransections = () => {
	const staffs = useLoaderData() || [];
	const location = useLocation();
	const [search, setSearch] = useState('');

	const filteredStaffs = useMemo(() => {
		const query = search.trim().toLowerCase();
		if (!query) return staffs;
		return staffs.filter((staff) =>
			`${staff?.name || ''} ${staff?.email || ''}`.toLowerCase().includes(query)
		);
	}, [staffs, search]);

	return (
		<div className="relative min-h-full w-full px-1 py-3 sm:px-2 lg:p-5 text-slate-100">
			<div className="pointer-events-none fixed -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-emerald-500/10 blur-[130px]" />
			<div className="pointer-events-none fixed top-1/3 -right-40 h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[140px]" />

			<div className="relative mx-auto max-w-6xl">
				<div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
					<div>
						<p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400"><FiUsers /> Staff Finance</p>
						<h1 className="text-2xl font-bold sm:text-3xl">Staff Transactions</h1>
						<p className="mt-1 text-sm text-slate-500">Choose a staff account to inspect payments and transaction history.</p>
					</div>
					<div className="relative w-full sm:w-72">
						<FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
						<input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search staff..."
							className="w-full rounded-xl border border-emerald-400/10 bg-[#0b1f1b]/70 py-3 pl-11 pr-4 text-sm text-white outline-none backdrop-blur-xl focus:border-emerald-400/30"
						/>
					</div>
				</div>

				<div className="mb-4 text-xs text-slate-500">{filteredStaffs.length} staff account{filteredStaffs.length !== 1 ? 's' : ''}</div>

				<div className="grid gap-3">
					{filteredStaffs.map((staff) => (
						<div
							key={staff._id}
							className="group rounded-2xl border border-emerald-400/10 bg-[#0b1f1b]/65 p-4 shadow-xl shadow-black/20 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-cyan-400/20 hover:bg-[#0d241f]/80 sm:p-5"
						>
							<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
								<div className="flex min-w-0 items-center gap-4">
									<div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-cyan-400/15 bg-cyan-400/5 font-bold text-cyan-300">
										{(staff?.name || 'S').charAt(0).toUpperCase()}
									</div>
									<div className="min-w-0">
										<h2 className="truncate font-semibold text-white sm:text-lg">{staff?.name}</h2>
										<p className="truncate text-xs text-slate-500">{staff?.email || 'Staff account'}</p>
									</div>
								</div>
								<Link
									to={`/admin/staff_details/${staff?.uid}`}
									state={{ pathname: location.pathname }}
									className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/15"
								>
									View Details <FiArrowRight />
								</Link>
							</div>
						</div>
					))}

					{filteredStaffs.length === 0 && (
						<div className="rounded-2xl border border-white/5 bg-[#0b1f1b]/60 p-12 text-center text-sm text-slate-500">
							No matching staff found.
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default StaffTransections;
