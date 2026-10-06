import React, { useEffect, useRef, useState } from 'react';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import {
	ArrowLeft,
	ArrowUpRight,
	Banknote,
	CalendarDays,
	Clock3,
	Download,
	Home,
	Printer,
	ShieldCheck,
	Trash2,
	TrendingUp,
	WalletCards,
} from 'lucide-react';
import useAdmin from '../Hooks/useAdmin';

const StaffsMonthlyRecords = () => {
	const staff = useLoaderData();
	const { _id, name, hour_rate, uid, user_category, current_month_details, total_working_hour, bonus, total_working_minute, total_income, withdrawal_amount, available_balance } = staff;
	const location = useLocation();
	const from = location?.state?.pathname;
	const navigate = useNavigate();
	const [isAdmin, isAdminLoading] = useAdmin();

	const printRef = useRef();

	const records = current_month_details || [];

	const handlePrint = () => {
		const printContents = printRef.current.innerHTML;
		// Create a hidden iframe
		const iframe = document.createElement('iframe');
		iframe.style.position = 'fixed';
		iframe.style.right = '0';
		iframe.style.bottom = '0';
		iframe.style.width = '0';
		iframe.style.height = '0';
		iframe.style.border = '0';

		document.body.appendChild(iframe);

		const doc = iframe.contentWindow.document;

		// Optional: You can load Tailwind CSS from CDN inside iframe
		doc.open();
		doc.write(`
      			<html>
    <head>
        <title>${name} - Monthly Staff Record</title>

        <link
            href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
            rel="stylesheet"
        />

        <style>
            @page {
                size: A4 landscape;
                margin: 12mm;
            }

            * {
                box-sizing: border-box;
            }

            body {
                font-family: Arial, sans-serif;
                color: #000;
                background: white;
                margin: 0;
                padding: 0;
            }

            table {
                width: 100%;
                border-collapse: collapse;
            }

            th,
            td {
                border: 1px solid #000 !important;
                padding: 7px;
                font-size: 10px;
                text-align: center;
            }

            th {
                font-weight: 700;
            }
        </style>
    </head>

    <body>
        ${printContents}
    </body>
</html>
    `);
		doc.close();

		// Wait until iframe is ready then print
		iframe.onload = () => {
			iframe.contentWindow.focus();
			iframe.contentWindow.print();

			// Optional: Cleanup after printing
			setTimeout(() => {
				document.body.removeChild(iframe);
			}, 1000);
		}; te
	};

	const handleDeleteRecord = (staffId, deletedDate) => {
		Swal.fire({
			title: "Are you sure?",
			text: "You won't be able to revert this!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, Submit"
		}).then(async (result) => {
			if (result.isConfirmed) {
				fetch(`https://bismillah-enterprise-server.onrender.com/staff/remove_attendance/${staffId}`, {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ dateToRemove: `${deletedDate}` })
				})
					.then(res => res.json())
					.then(data => {
						navigate(location.pathname)
						if (data.acknowledged) {
							Swal.fire({
								position: 'center',
								icon: 'success',
								title: 'Deleted Record Successfully',
								showConfirmButton: false,
								timer: 1000,
							});
						}
					});
			}
		})
	}

	const summaryCards = [
		{
			label: 'Total Earned',
			value: total_income,
			icon: TrendingUp,
			iconClass: 'text-emerald-300',
			bg: 'from-emerald-500/15 to-emerald-500/5',
			border: 'border-emerald-400/15',
		},
		{
			label: 'Bonus',
			value: bonus,
			icon: ArrowUpRight,
			iconClass: 'text-cyan-300',
			bg: 'from-cyan-500/15 to-cyan-500/5',
			border: 'border-cyan-400/15',
		},
		{
			label: 'Withdrawn',
			value: withdrawal_amount,
			icon: WalletCards,
			iconClass: 'text-violet-300',
			bg: 'from-violet-500/15 to-violet-500/5',
			border: 'border-violet-400/15',
		},
		{
			label: 'Available Balance',
			value: available_balance,
			icon: Banknote,
			iconClass: 'text-emerald-300',
			bg: 'from-emerald-500/15 to-cyan-500/5',
			border: 'border-emerald-400/15',
		},
	];
	return (
		<div className="min-h-full relative py-5 sm:py-7 pb-12 text-white">
			{/* Ambient background */}
			<div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
				<div className="absolute -top-40 -left-40 w-[430px] h-[430px] rounded-full bg-emerald-500/10 blur-[140px]" />
				<div className="absolute top-[28%] -right-40 w-[460px] h-[460px] rounded-full bg-cyan-500/10 blur-[150px]" />
				<div className="absolute -bottom-52 left-[35%] w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-[160px]" />
			</div>

			<div className="max-w-[1500px] mx-auto">
				{/* Top navigation */}
				<div className="flex flex-wrap items-center justify-between gap-3 mb-6">
					<div className="flex items-center gap-2">
						<Link
							to="/"
							state={{ from: '/' }}
							className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-all duration-300"
						>
							<Home
								size={17}
								className="text-emerald-300 group-hover:scale-110 transition-transform"
							/>
							<span className="text-sm font-medium">Home</span>
						</Link>

						<Link
							to={`/staff/uid_query/${uid}`}
							className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-all duration-300"
						>
							<ArrowLeft size={17} className="text-cyan-300" />
							<span className="text-sm font-medium">Back</span>
						</Link>

						{isAdmin && (
							<Link
								to="/admin"
								state={{ from: '/' }}
								className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-violet-400/20 bg-violet-500/10 hover:bg-violet-500/20 transition-all duration-300"
							>
								<ShieldCheck size={17} className="text-violet-300" />
								<span className="text-sm font-medium">Admin</span>
							</Link>
						)}
					</div>

					{isAdmin && (
						<button
							onClick={handlePrint}
							className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-400/20 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all duration-300 cursor-pointer"
						>
							<Printer
								size={17}
								className="text-emerald-300 group-hover:scale-110 transition-transform"
							/>
							<span className="text-sm font-medium">Print Report</span>
						</button>
					)}
				</div>

				{/* Staff profile header */}
				<div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] backdrop-blur-xl shadow-2xl mb-6">
					<div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.06] via-transparent to-cyan-500/[0.05] pointer-events-none" />

					<div className="relative p-5 sm:p-7">
						<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
							<div>
								<div className="flex items-center gap-3 mb-2">
									<div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-gradient-to-br from-emerald-400/20 to-cyan-400/10 border border-emerald-300/20">
										<CalendarDays
											size={21}
											className="text-emerald-300"
										/>
									</div>

									<div>
										<p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
											Monthly Staff Report
										</p>
										<h1 className="text-xl sm:text-2xl font-bold tracking-tight">
											{name}
										</h1>
									</div>
								</div>

								<div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
									<span className="px-3 py-1 rounded-full bg-white/[0.05] border border-white/10">
										UID: {uid}
									</span>

									<span className="px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/15 text-emerald-300">
										Rate: {hour_rate} Taka/hour
									</span>
								</div>
							</div>

							<div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-black/10 border border-white/10">
								<Clock3 size={20} className="text-cyan-300" />
								<div>
									<p className="text-xs text-slate-400">Total Working Time</p>
									<p className="font-semibold">
										{total_working_hour}h {total_working_minute}m
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Financial summary */}
				<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
					{summaryCards.map((card) => {
						const Icon = card.icon;

						return (
							<div
								key={card.label}
								className={`relative overflow-hidden rounded-2xl border ${card.border} bg-gradient-to-br ${card.bg} backdrop-blur-xl p-5 shadow-xl`}
							>
								<div className="flex items-start justify-between gap-3">
									<div>
										<p className="text-xs uppercase tracking-wider text-slate-400">
											{card.label}
										</p>
										<p className="text-xl sm:text-2xl font-bold mt-2">
											{card.value}
										</p>
										<p className="text-[11px] text-slate-500 mt-1">
											Taka
										</p>
									</div>

									<div className="w-10 h-10 rounded-xl bg-black/10 border border-white/10 flex items-center justify-center">
										<Icon size={19} className={card.iconClass} />
									</div>
								</div>
							</div>
						);
					})}
				</div>

				{/* Table section */}
				<div className="rounded-3xl border border-white/10 bg-white/[0.035] backdrop-blur-xl overflow-hidden shadow-2xl">
					<div className="px-5 sm:px-7 py-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
						<div>
							<h2 className="text-lg sm:text-xl font-bold">
								Attendance & Earnings
							</h2>
							<p className="text-xs text-slate-400 mt-1">
								Complete monthly working details of {name}
							</p>
						</div>

						<div className="text-xs px-3 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/15 text-emerald-300 w-fit">
							{records.length} {records.length === 1 ? 'Record' : 'Records'}
						</div>
					</div>

					<div className="overflow-x-auto scrollbar-hide p-5">
						<table className="w-full min-w-[1150px] text-sm">
							<thead>
								<tr className="bg-black/20 text-slate-300">
									<th className="px-4 py-4 text-left font-semibold">Date</th>
									<th className="px-4 py-4 text-left font-semibold">Day</th>
									<th className="px-4 py-4 text-left font-semibold">Enter 1</th>
									<th className="px-4 py-4 text-left font-semibold">Exit 1</th>
									<th className="px-4 py-4 text-left font-semibold">Enter 2</th>
									<th className="px-4 py-4 text-left font-semibold">Exit 2</th>
									<th className="px-4 py-4 text-left font-semibold">Movement</th>
									<th className="px-4 py-4 text-left font-semibold">Working Time</th>
									<th className="px-4 py-4 text-left font-semibold">Bonus</th>
									<th className="px-4 py-4 text-left font-semibold">Earned</th>
									{isAdmin && (
										<th className="px-4 py-4 text-center font-semibold">
											Action
										</th>
									)}
								</tr>
							</thead>

							<tbody className="divide-y divide-white/[0.06]">
								{records.map((day, index) => (
									<tr
										key={index}
										className="hover:bg-emerald-400/[0.035] transition-colors duration-200"
									>
										<td className="px-4 py-4 text-slate-200 font-medium">
											{day.current_date}
										</td>

										<td className="px-4 py-4 text-slate-400">
											{day.current_day_name}
										</td>

										<td className="px-4 py-4 text-slate-300">
											{day.today_enter1_time}
										</td>

										<td className="px-4 py-4 text-slate-300">
											{day.today_exit1_time}
										</td>

										<td className="px-4 py-4 text-slate-300">
											{day.today_enter2_time}
										</td>

										<td className="px-4 py-4 text-slate-300">
											{day.today_exit2_time}
										</td>

										<td className="px-4 py-4 text-slate-400">
											{day.additional_movement_hour || 0}h{' '}
											{day.additional_movement_minute || 0}m
										</td>

										<td className="px-4 py-4 text-emerald-300 font-medium">
											{day.total_hour}h {day.total_minute}m
										</td>

										<td className="px-4 py-4 text-cyan-300">
											{day.today_bonus}
										</td>

										<td className="px-4 py-4 text-white font-semibold">
											{day.total_earn} Taka
										</td>

										{isAdmin && (
											<td className="px-4 py-4 text-center">
												<button
													onClick={() =>
														handleDeleteRecord(
															_id,
															day.current_date
														)
													}
													title="Delete attendance"
													className="w-9 h-9 inline-flex items-center justify-center rounded-xl bg-red-500/10 border border-red-400/15 text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all duration-200 cursor-pointer"
												>
													<Trash2 size={16} />
												</button>
											</td>
										)}
									</tr>
								))}

								<tr className="bg-emerald-400/[0.035]">
									<td
										colSpan={6}
										className="px-4 py-5"
									/>

									<td className="px-4 py-5 text-right text-slate-400 font-semibold">
										Total
									</td>

									<td className="px-4 py-5 text-emerald-300 font-bold">
										{total_working_hour}h {total_working_minute}m
									</td>

									<td className="px-4 py-5 text-cyan-300 font-bold">
										{bonus}
									</td>

									<td className="px-4 py-5 text-white font-bold">
										{total_income} Taka
									</td>

									{isAdmin && (
										<td className="px-4 py-5" />
									)}
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				{/* Bottom summary */}
				<div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 rounded-2xl border border-white/10 bg-white/[0.025]">
					<div className="flex items-center gap-2 text-sm text-slate-400">
						<WalletCards size={17} className="text-emerald-300" />
						<span>
							Available balance:{' '}
							<strong className="text-white">{available_balance} Taka</strong>
						</span>
					</div>

					{isAdmin && (
						<button
							onClick={handlePrint}
							className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400/15 to-cyan-400/10 border border-emerald-400/20 text-emerald-200 hover:from-emerald-400/25 hover:to-cyan-400/20 transition-all duration-300 cursor-pointer text-sm font-semibold"
						>
							<Download size={16} />
							Export / Print
						</button>
					)}
				</div>
			</div>

			{/* Print-only document */}
			<div ref={printRef} className="hidden text-black">

				{/* Heading */}
				<div className="text-center mb-5">

					<h1 className="text-3xl font-bold">
						BISMILLAH ENTERPRISE
					</h1>

					<p className="text-sm mt-1">
						Monthly Staff Working Report
					</p>

					<p className="text-sm mt-3">
						<strong>Staff:</strong> {name}
					</p>

					<p className="text-sm mt-1">
						<strong>Report Period:</strong>{' '}
						{records?.length > 0
							? `${records[0]?.current_date} to ${records[records.length - 1]?.current_date}`
							: 'N/A'}
					</p>

					<p className="text-sm mt-1">
						<strong>Hour Rate:</strong> {hour_rate} Taka
					</p>

				</div>


				{/* Summary */}
				<div className="flex justify-center gap-8 mb-5 text-sm">

					<div>
						<strong>Total Earned:</strong> {total_income} Taka
					</div>

					<div>
						<strong>Bonus:</strong> {bonus}
					</div>

					<div>
						<strong>Withdrawn:</strong> {withdrawal_amount} Taka
					</div>

					<div>
						<strong>Balance:</strong> {available_balance} Taka
					</div>

				</div>


				{/* Records Table */}
				<table>

					<thead>
						<tr>

							<th>Date</th>

							<th>Day</th>

							<th>Enter 1</th>

							<th>Exit 1</th>

							<th>Enter 2</th>

							<th>Exit 2</th>

							<th>Movement</th>

							<th>Working Time</th>

							<th>Bonus</th>

							<th>Total Earn</th>

						</tr>
					</thead>


					<tbody>

						{records.map((day, index) => (

							<tr key={index}>

								<td>
									{day.current_date}
								</td>

								<td>
									{day.current_day_name}
								</td>

								<td>
									{day.today_enter1_time}
								</td>

								<td>
									{day.today_exit1_time}
								</td>

								<td>
									{day.today_enter2_time}
								</td>

								<td>
									{day.today_exit2_time}
								</td>

								<td>
									{day.additional_movement_hour || 0}h{' '}
									{day.additional_movement_minute || 0}m
								</td>

								<td>
									{day.total_hour}h{' '}
									{day.total_minute}m
								</td>

								<td>
									{day.today_bonus}
								</td>

								<td>
									{day.total_earn} Taka
								</td>

							</tr>

						))}


						{/* Total Row */}
						<tr>

							<td colSpan="7"></td>

							<td>
								<strong>
									{total_working_hour}h{' '}
									{total_working_minute}m
								</strong>
							</td>

							<td>
								<strong>
									{bonus}
								</strong>
							</td>

							<td>
								<strong>
									{total_income} Taka
								</strong>
							</td>

						</tr>

					</tbody>

				</table>

			</div>
		</div>
	);
};

export default StaffsMonthlyRecords;