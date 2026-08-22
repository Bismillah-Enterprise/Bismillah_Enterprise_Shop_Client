import React from 'react';
import { Link, useLoaderData, useLocation } from 'react-router-dom';
import {
	MdArrowBack,
	MdTrendingUp,
	MdTrendingDown,
	MdSwapHoriz
} from 'react-icons/md';

const TransectionsHistory = () => {
	const staffData = useLoaderData();
	const { name, transections, uid } = staffData;
	const location = useLocation();
	const from = location?.state?.pathname;

	const totalAmount =
		transections?.reduce(
			(sum, item) => sum + (Number(item?.transection_amount) || 0),
			0
		) || 0;
	return (
		<div className="min-h-full pt-5 pb-12 text-slate-200">

			<div className="pointer-events-none fixed -top-40 -left-40 w-[450px] h-[450px] rounded-full bg-emerald-500/10 blur-[140px]" />
			<div className="pointer-events-none fixed top-[30%] -right-40 w-[450px] h-[450px] rounded-full bg-cyan-500/10 blur-[140px]" />
			<div className="pointer-events-none fixed -bottom-40 left-[35%] w-[450px] h-[450px] rounded-full bg-violet-500/10 blur-[150px]" />

			<div className="max-w-7xl mx-auto">

				<div className="flex items-center justify-between gap-4 mb-8">

					<Link
						to={from || `/staff/uid_query/${uid}`}
						className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 hover:border-cyan-400/30 hover:text-cyan-300 transition-all"
					>
						<MdArrowBack />
						Back
					</Link>

					<div className="text-right">
						<p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
							Staff Finance
						</p>
						<h1 className="text-xl md:text-3xl font-black text-white">
							Transaction History
						</h1>
					</div>
				</div>

				{/* Header card */}
				<div className="rounded-3xl border border-cyan-400/15 bg-white/[0.025] p-6 mb-6">

					<div className="flex flex-col md:flex-row md:items-center justify-between gap-5">

						<div>
							<p className="text-sm text-slate-500">
								Transaction details of
							</p>

							<h2 className="text-2xl font-black text-white mt-1">
								{name}
							</h2>
						</div>

						<div className="rounded-2xl bg-cyan-500/10 border border-cyan-400/15 px-5 py-4">
							<div className="flex items-center gap-2">
								<MdSwapHoriz className="text-cyan-400 text-xl" />

								<div>
									<p className="text-xs text-slate-500">
										Transactions
									</p>

									<p className="text-xl font-black text-cyan-300">
										{transections?.length || 0}
									</p>
								</div>
							</div>
						</div>

						<div className="rounded-2xl bg-violet-500/10 border border-violet-400/15 px-5 py-4">
							<p className="text-xs text-slate-500">
								Total Amount
							</p>

							<p className="text-xl font-black text-violet-300">
								{totalAmount}
							</p>
						</div>

					</div>
				</div>

				{/* Table */}
				<div className="rounded-3xl border border-white/[0.07] bg-white/[0.025] overflow-hidden p-5">

					<div className="overflow-x-auto">

						<table className="w-full min-w-[750px] text-sm">

							<thead>
								<tr className="bg-white/[0.03] border-b border-white/10 text-slate-500">
									<th className="px-5 py-4 text-left">
										Date
									</th>

									<th className="px-5 py-4 text-left">
										Comment
									</th>

									<th className="px-5 py-4 text-left">
										Type
									</th>

									<th className="px-5 py-4 text-right">
										Amount
									</th>
								</tr>
							</thead>

							<tbody>
								{transections?.map((transection, index) => {

									const type =
										transection?.transection_type
											?.toLowerCase() || '';

									const isPositive =
										type.includes('salary') ||
										type.includes('payback');

									return (
										<tr
											key={index}
											className="border-b border-white/5 hover:bg-white/[0.025] transition-all"
										>

											<td className="px-5 py-4 text-slate-300">
												{transection.transection_date}
											</td>

											<td className="px-5 py-4 max-w-[280px]">
												<p className="truncate text-slate-400">
													{transection.comment || 'No comment'}
												</p>
											</td>

											<td className="px-5 py-4">

												<span
													className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${isPositive
														? 'bg-emerald-500/10 border border-emerald-400/20 text-emerald-300'
														: 'bg-amber-500/10 border border-amber-400/20 text-amber-300'
														}`}
												>
													{isPositive
														? <MdTrendingUp />
														: <MdTrendingDown />
													}

													{transection.transection_type}
												</span>

											</td>

											<td
												className={`px-5 py-4 text-right font-black ${isPositive
													? 'text-emerald-300'
													: 'text-red-300'
													}`}
											>
												{transection.transection_amount}
											</td>

										</tr>
									);
								})}
							</tbody>

						</table>
					</div>

					{!transections?.length && (
						<div className="py-20 text-center">
							<p className="text-slate-500">
								No transaction history available.
							</p>
						</div>
					)}
				</div>

			</div>
		</div>
	);
};

export default TransectionsHistory;