import React from 'react';
import { Link, useLoaderData, useLocation } from 'react-router-dom';
import { MdArrowBack, MdTrendingUp, MdPayments, MdAccessTime } from 'react-icons/md';

const IncomeHistory = () => {
	const staff = useLoaderData();
	const { name, income_history, uid } = staff;
	const location = useLocation();
	const from = location?.state?.pathname;
	const totalIncome =
		income_history?.reduce(
			(sum, item) => sum + (Number(item?.total_income) || 0),
			0
		) || 0;

	const totalPaid =
		income_history?.reduce(
			(sum, item) => sum + (Number(item?.paid_amount) || 0),
			0
		) || 0;

	return (
		<div className="min-h-full pt-5 pb-12 text-slate-200">
			<div className="pointer-events-none fixed -top-40 -left-40 w-[450px] h-[450px] rounded-full bg-emerald-500/10 blur-[140px]" />
			<div className="pointer-events-none fixed top-[30%] -right-40 w-[450px] h-[450px] rounded-full bg-cyan-500/10 blur-[140px]" />

			<div className="max-w-7xl mx-auto">

				<div className="flex items-center justify-between gap-4 mb-8">

					<Link
						to={from || `/staff/uid_query/${uid}`}
						className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 hover:border-emerald-400/30 hover:text-emerald-300 transition-all"
					>
						<MdArrowBack />
						Back
					</Link>

					<div className="text-right">
						<p className="text-xs uppercase tracking-[0.25em] text-emerald-400">
							Staff Finance
						</p>
						<h1 className="text-xl md:text-3xl font-black text-white">
							Income History
						</h1>
					</div>
				</div>

				<div className="rounded-3xl border border-emerald-400/15 bg-white/[0.025] p-6 mb-6">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
						<div>
							<p className="text-sm text-slate-500">
								Income records of
							</p>
							<h2 className="text-2xl font-black text-white mt-1">
								{name}
							</h2>
						</div>

						<div className="flex gap-3">
							<div className="px-4 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-400/15">
								<MdTrendingUp className="text-emerald-400 text-xl" />
								<p className="text-xs text-slate-500 mt-1">
									Total Income
								</p>
								<p className="font-black text-emerald-300">
									{totalIncome}
								</p>
							</div>

							<div className="px-4 py-3 rounded-2xl bg-cyan-500/10 border border-cyan-400/15">
								<MdPayments className="text-cyan-400 text-xl" />
								<p className="text-xs text-slate-500 mt-1">
									Total Paid
								</p>
								<p className="font-black text-cyan-300">
									{totalPaid}
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="rounded-3xl border border-white/[0.07] bg-white/[0.025] overflow-hidden p-5">

					<div className="overflow-x-auto">
						<table className="w-full min-w-[1000px] text-sm">

							<thead>
								<tr className="bg-white/[0.03] border-b border-white/10 text-slate-500">
									{[
										'Month',
										'Worked Time',
										'Previous Due',
										'Total Income',
										'Paid',
										'Receivable',
										'Closing Date'
									].map(item => (
										<th
											key={item}
											className="px-5 py-4 text-left"
										>
											{item}
										</th>
									))}
								</tr>
							</thead>

							<tbody>
								{income_history?.map((income, index) => (
									<tr
										key={index}
										className="border-b border-white/5 hover:bg-emerald-400/[0.025] transition-all"
									>
										<td className="px-5 py-4 font-semibold text-white">
											{income.month_name}
										</td>

										<td className="px-5 py-4 text-slate-300">
											<div className="flex items-center gap-2">
												<MdAccessTime className="text-violet-400" />
												{income.total_worked_time}
											</div>
										</td>

										<td className="px-5 py-4 text-amber-300">
											{income.previous_due}
										</td>

										<td className="px-5 py-4 font-bold text-emerald-300">
											{income.total_income}
										</td>

										<td className="px-5 py-4 font-bold text-cyan-300">
											{income.paid_amount}
										</td>

										<td className="px-5 py-4 font-bold text-violet-300">
											{income.receiveable_amount}
										</td>

										<td className="px-5 py-4 text-slate-400">
											{income.paid_date}
										</td>
									</tr>
								))}
							</tbody>

						</table>
					</div>

					{!income_history?.length && (
						<div className="py-20 text-center text-slate-500">
							No income history available.
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default IncomeHistory;