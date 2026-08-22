import React, { useRef, useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { NumericFormat } from 'react-number-format';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ShopTransections = () => {
	const shop_transections = useLoaderData();

	const {
		_id,
		month_name,
		total_revenue_amount,
		total_expense_amount,
		hand_on_cash,
		revenue_transections
	} = shop_transections[0];

	const [revenueModal, setRevenueModal] = useState(false);
	const [expenseModal, setExpenseModal] = useState(false);
	const [transectionTypeValue, setTransectionTypeValue] = useState('');
	const [isComment, setIsComment] = useState(false);

	const navigate = useNavigate();
	const location = useLocation();
	const from = location?.state?.pathname;

	const now = new Date();

	const Time = now.toLocaleTimeString('en-BD', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: true,
	});

	const currentDayName = now.toLocaleDateString('en-BD', {
		weekday: 'long'
	});

	const currentDate = now.toLocaleDateString('en-BD', {
		day: 'numeric',
		year: 'numeric',
		month: 'long',
	});

	/* =========================
	   REFS
	========================= */

	const revenue_transection_amount_ref = useRef();
	const revenue_comment_ref = useRef();
	const expense_transection_amount_ref = useRef();
	const expense_comment_ref = useRef();
	const transection_type_ref = useRef();

	/* =========================
	   REVENUE
	========================= */

	const handleRevenueTransections = (transectionType) => {
		const revenue_transection_amount = parseFloat(
			revenue_transection_amount_ref.current.value
		);

		const transection_type = transectionType;

		const transection_category =
			transection_type_ref.current.value;

		const new_total_revenue_amount = parseFloat(
			total_revenue_amount + revenue_transection_amount
		);

		const new_hand_on_cash = parseFloat(
			hand_on_cash + revenue_transection_amount
		);
		const comment = revenue_comment_ref.current?.value?.trim() || '';

		const transectionData = {
			transection_date: currentDate,
			transection_amount: revenue_transection_amount,
			transection_type: 'revenue',
			transection_category: transection_type_ref.current?.value || '',
			transection_explaination:
				revenue_comment_ref.current?.value?.trim() || '',
			total_revenue_amount:
				Number(total_revenue_amount) + revenue_transection_amount,
			hand_on_cash:
				Number(hand_on_cash) + revenue_transection_amount
		};

		Swal.fire({
			title: "Are you sure?",
			text: `You Are Adding ${transection_type} ${revenue_transection_amount} Taka`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#10b981",
			cancelButtonColor: "#ef4444",
			confirmButtonText: "Yes, I am Sure"
		}).then((result) => {

			if (result.isConfirmed) {

				fetch(
					`https://bismillah-enterprise-server.onrender.com/shop_transections`,
					{
						method: 'PUT',
						headers: {
							'content-type': 'application/json'
						},
						body: JSON.stringify(transectionData)
					}
				)
					.then(res => res.json())
					.then(transectionDataSubmit => {

						if (transectionDataSubmit.acknowledged) {

							revenue_transection_amount_ref.current.value = '';
							if (revenue_comment_ref.current) {
								revenue_comment_ref.current.value = '';
							}

							setRevenueModal(false);
							setTransectionTypeValue('');
							setIsComment(false);

							navigate(location.pathname);

							Swal.fire({
								position: 'center',
								icon: 'success',
								title: 'Transaction Saved Successfully',
								showConfirmButton: false,
								timer: 1000,
							});
						}
					});
			}
			else {
				revenue_transection_amount_ref.current.value = '';
			}
		});
	};

	/* =========================
	   EXPENSE
	========================= */

	const handleExpenseTransections = (transectionType) => {

		const expense_transection_amount = parseFloat(
			expense_transection_amount_ref.current.value
		);

		const transection_type = transectionType;

		const new_total_expense_amount = parseFloat(
			total_expense_amount + expense_transection_amount
		);

		const new_hand_on_cash = parseFloat(
			hand_on_cash - expense_transection_amount
		);

		const comment = expense_comment_ref.current.value?.trim() || '';

		const transectionData = {
			transection_id: `${Date.now()}-${Math.round(expense_transection_amount)}`,
			transection_date: currentDate,
			transection_amount: expense_transection_amount,
			transection_type: 'expense',
			transection_explaination:
				expense_comment_ref.current?.value?.trim() || '',
			total_expense_amount:
				Number(total_expense_amount) + expense_transection_amount,
			hand_on_cash:
				Number(hand_on_cash) - expense_transection_amount
		};

		Swal.fire({
			title: "Are you sure?",
			text: `You Are Adding ${transection_type} ${expense_transection_amount} Taka`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#10b981",
			cancelButtonColor: "#ef4444",
			confirmButtonText: "Yes, I am Sure"
		}).then((result) => {

			if (result.isConfirmed) {

				fetch(
					`https://bismillah-enterprise-server.onrender.com/shop_transections`,
					{
						method: 'PUT',
						headers: {
							'content-type': 'application/json'
						},
						body: JSON.stringify(transectionData)
					}
				)
					.then(res => res.json())
					.then(transectionDataSubmit => {

						if (transectionDataSubmit.acknowledged) {

							expense_transection_amount_ref.current.value = '';
							if (expense_comment_ref.current) {
								expense_comment_ref.current.value = '';
							}

							setExpenseModal(false);

							navigate(location.pathname);

							Swal.fire({
								position: 'center',
								icon: 'success',
								title: 'Transaction Saved Successfully',
								showConfirmButton: false,
								timer: 1000,
							});
						}
					});
			}
			else {
				expense_transection_amount_ref.current.value = '';
			}
		});
	};

	/* =========================
	   CLOSE MONTH
	========================= */

	const handleClosingMonth = () => {

		Swal.fire({
			title: "Are you sure?",
			text: `You Should Print It Before Closing`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#10b981",
			cancelButtonColor: "#ef4444",
			confirmButtonText: "Yes, I am Sure"
		}).then((result) => {

			if (result.isConfirmed) {

				const closing_month_details = {
					month_name,
					hand_on_cash,
					total_expense_amount,
					total_revenue_amount
				};

				fetch(
					`https://bismillah-enterprise-server.onrender.com/shop_transections_closing_month`,
					{
						method: 'POST',
						headers: {
							'content-type': 'application/json'
						},
						body: JSON.stringify(closing_month_details)
					}
				)
					.then(res => res.json())
					.then(data => {

						if (
							data.message ===
							'Shop transections saved successfully'
						) {

							navigate(location.pathname);

							Swal.fire({
								position: 'center',
								icon: 'success',
								title: 'Month Closed Successfully',
								showConfirmButton: false,
								timer: 1000,
							});
						}
					});
			}
		});
	};

	/* =========================
	   NEW MONTH
	========================= */

	const handleNewMonth = () => {

		Swal.fire({
			title: "Are you sure?",
			text: `You Are Sure?`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#10b981",
			cancelButtonColor: "#ef4444",
			confirmButtonText: "Yes, I am Sure"
		}).then((result) => {

			if (result.isConfirmed) {

				const newMonthName =
					currentDate.split(' ')[0];

				const newData = {
					month_name: newMonthName
				};

				fetch(
					`https://bismillah-enterprise-server.onrender.com/start_new_month`,
					{
						method: 'PUT',
						headers: {
							'content-type': 'application/json'
						},
						body: JSON.stringify(newData)
					}
				)
					.then(res => res.json())
					.then(data => {

						if (data.acknowledged) {

							navigate(location.pathname);

							Swal.fire({
								position: 'center',
								icon: 'success',
								title: 'New Month Started Successfully',
								showConfirmButton: false,
								timer: 1000,
							});
						}
					});
			}
		});
	};

	const netMovement =
		Number(total_revenue_amount) -
		Number(total_expense_amount);

	/* =========================
	   UI
	========================= */

	return (
		<div className="min-h-screen bg-[#061311] text-white px-4 py-6 sm:px-6 lg:px-8">

			{/* Background glow */}

			<div className="pointer-events-none fixed inset-0 overflow-hidden">
				<div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-[120px]" />
				<div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-400/5 blur-[120px]" />
			</div>


			<div className="relative mx-auto max-w-7xl">

				{/* ================= HEADER ================= */}

				<div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

					<div>

						<p className="text-[10px] font-semibold uppercase tracking-[4px] text-emerald-400/60">
							Financial Management
						</p>

						<h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
							Shop Transactions
						</h1>

						<p className="mt-1 text-sm text-slate-500">
							{currentDayName} • {currentDate} • {Time}
						</p>

					</div>


					<Link
						to={from}
						state={{ from: location.pathname }}
						className="self-start"
					>
						<button className="
							rounded-xl
							border border-white/10
							bg-white/[0.03]
							px-5 py-2.5
							text-sm font-semibold
							text-slate-300
							transition
							hover:border-emerald-400/30
							hover:bg-emerald-400/10
							hover:text-emerald-300
						">
							← Back
						</button>
					</Link>

				</div>


				{/* ================= MONTH CARD ================= */}

				<div className="
					mb-6
					rounded-[28px]
					border border-white/[0.07]
					bg-white/[0.025]
					p-5
					backdrop-blur-xl
					sm:p-6
				">

					<div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

						<div>

							<p className="text-[10px] uppercase tracking-[3px] text-slate-500">
								Current Accounting Period
							</p>

							<h2 className="mt-2 text-2xl font-black text-emerald-300">
								{month_name}
							</h2>

						</div>


						<button
							disabled={month_name === currentDate.split(' ')[0]}
							onClick={handleNewMonth}
							className="
								rounded-xl
								border border-emerald-400/20
								bg-emerald-400/10
								px-5 py-2.5
								text-sm font-semibold
								text-emerald-300
								transition
								hover:bg-emerald-400/15
								disabled:cursor-not-allowed
								disabled:opacity-30
							"
						>
							+ Start New Month
						</button>

					</div>

				</div>


				{/* ================= STAT CARDS ================= */}

				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

					<div className="
						rounded-[24px]
						border border-emerald-400/10
						bg-emerald-400/[0.035]
						p-5
					">

						<p className="text-[10px] uppercase tracking-[2px] text-slate-500">
							Total Revenue
						</p>

						<p className="mt-3 text-2xl font-black text-emerald-300">
							৳ {Number(total_revenue_amount).toLocaleString()}
						</p>

						<p className="mt-1 text-xs text-slate-600">
							Incoming cash
						</p>

					</div>


					<div className="
						rounded-[24px]
						border border-red-400/10
						bg-red-400/[0.025]
						p-5
					">

						<p className="text-[10px] uppercase tracking-[2px] text-slate-500">
							Total Expense
						</p>

						<p className="mt-3 text-2xl font-black text-red-300">
							৳ {Number(total_expense_amount).toLocaleString()}
						</p>

						<p className="mt-1 text-xs text-slate-600">
							Outgoing cash
						</p>

					</div>


					<div className="
						rounded-[24px]
						border border-cyan-400/10
						bg-cyan-400/[0.025]
						p-5
					">

						<p className="text-[10px] uppercase tracking-[2px] text-slate-500">
							Hand On Cash
						</p>

						<p className="mt-3 text-2xl font-black text-cyan-300">
							৳ {Number(hand_on_cash).toLocaleString()}
						</p>

						<p className="mt-1 text-xs text-slate-600">
							Available balance
						</p>

					</div>

				</div>


				{/* ================= NET MOVEMENT ================= */}

				<div className="
					mt-4
					rounded-[24px]
					border border-white/[0.06]
					bg-black/20
					p-5
				">

					<div className="flex items-center justify-between">

						<div>

							<p className="text-[10px] uppercase tracking-[3px] text-slate-500">
								Net Movement
							</p>

							<p className="mt-1 text-xs text-slate-600">
								Revenue minus expense
							</p>

						</div>

						<p className={`text-xl font-black ${netMovement >= 0
							? 'text-emerald-300'
							: 'text-red-300'
							}`}>
							{netMovement >= 0 ? '+' : '-'}৳ {Math.abs(netMovement).toLocaleString()}
						</p>

					</div>

				</div>


				{/* ================= ACTIONS ================= */}

				<div className="mt-8 grid gap-4 sm:grid-cols-2">

					<button
						onClick={() => setRevenueModal(true)}
						className="
							group
							rounded-[24px]
							border border-emerald-400/15
							bg-emerald-400/[0.05]
							p-5
							text-left
							transition
							hover:-translate-y-0.5
							hover:border-emerald-400/30
							hover:bg-emerald-400/[0.08]
						"
					>

						<p className="text-2xl text-emerald-300">
							↑
						</p>

						<p className="mt-3 text-lg font-bold text-white">
							Revenue Transaction
						</p>

						<p className="mt-1 text-xs text-slate-500">
							Add incoming money to the current month
						</p>

					</button>


					<button
						onClick={() => setExpenseModal(true)}
						className="
							group
							rounded-[24px]
							border border-red-400/15
							bg-red-400/[0.035]
							p-5
							text-left
							transition
							hover:-translate-y-0.5
							hover:border-red-400/30
							hover:bg-red-400/[0.06]
						"
					>

						<p className="text-2xl text-red-300">
							↓
						</p>

						<p className="mt-3 text-lg font-bold text-white">
							Expense Transaction
						</p>

						<p className="mt-1 text-xs text-slate-500">
							Record outgoing money from cash
						</p>

					</button>

				</div>


				{/* ================= DETAILS ================= */}

				<div className="mt-6 grid gap-3 sm:grid-cols-2">

					<Link
						to="/admin/revenue_transections_details"
						state={{ pathname: location.pathname }}
						className="
							rounded-2xl
							border border-white/[0.06]
							bg-white/[0.025]
							p-4
							text-center
							text-sm font-semibold
							text-slate-300
							transition
							hover:border-emerald-400/20
							hover:text-emerald-300
						"
					>
						View Current Month Revenue
					</Link>


					<Link
						to="/admin/expense_transections_details"
						state={{ pathname: location.pathname }}
						className="
							rounded-2xl
							border border-white/[0.06]
							bg-white/[0.025]
							p-4
							text-center
							text-sm font-semibold
							text-slate-300
							transition
							hover:border-red-400/20
							hover:text-red-300
						"
					>
						View Current Month Expense
					</Link>

				</div>


				{/* ================= BOTTOM ACTIONS ================= */}

				<div className="mt-4 grid gap-3 sm:grid-cols-2">

					<button
						onClick={handleClosingMonth}
						className="
							rounded-2xl
							border border-amber-400/15
							bg-amber-400/[0.04]
							p-4
							text-sm font-semibold
							text-amber-300
							transition
							hover:bg-amber-400/[0.08]
						"
					>
						Close Current Month
					</button>


					<Link
						to="/admin/shop_transections_summary"
						state={{ pathname: location.pathname }}
						className="
							rounded-2xl
							border border-violet-400/15
							bg-violet-400/[0.04]
							p-4
							text-center
							text-sm font-semibold
							text-violet-300
							transition
							hover:bg-violet-400/[0.08]
						"
					>
						Monthly Transaction Summary
					</Link>

				</div>

			</div>


			{/* =====================================================
			    REVENUE MODAL
			===================================================== */}

			{revenueModal && (

				<div className="
					fixed inset-0 z-[100]
					flex items-center justify-center
					bg-black/70
					p-4
					backdrop-blur-md
				">

					<div className="
						w-full max-w-lg
						rounded-[28px]
						border border-emerald-400/15
						bg-[#071613]
						p-6
						shadow-2xl
					">

						<div className="flex items-start justify-between">

							<div>

								<p className="text-[10px] uppercase tracking-[3px] text-emerald-400/60">
									Cash In
								</p>

								<h2 className="mt-1 text-xl font-black text-white">
									Revenue Transaction
								</h2>

							</div>


							<button
								onClick={() => {
									setRevenueModal(false);
									setTransectionTypeValue('');
									setIsComment(false);
								}}
								className="
									rounded-xl
									p-2
									text-slate-500
									transition
									hover:bg-white/5
									hover:text-white
								"
							>
								<MdOutlineCancel className="text-2xl" />
							</button>

						</div>


						<div className="mt-6 space-y-5">

							<div>

								<label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
									Revenue Category
								</label>

								<select
									ref={transection_type_ref}
									value={transectionTypeValue}
									onChange={(e) => {

										const value = e.target.value;

										setTransectionTypeValue(value);

										setIsComment(value === 'Others');

									}}
									className="
										h-12 w-full
										rounded-xl
										border border-white/10
										bg-white/[0.04]
										px-4
										text-sm text-white
										outline-none
										focus:border-emerald-400/40
									"
								>

									<option value="" className="bg-[#071613]">
										Select category
									</option>

									<option value="Stationary" className="bg-[#071613]">
										Stationary
									</option>

									<option value="Photocopy" className="bg-[#071613]">
										Photocopy
									</option>

									<option value="Air Ticket" className="bg-[#071613]">
										Air Ticket
									</option>

									<option value="Others" className="bg-[#071613]">
										Others
									</option>

								</select>

							</div>


							<div>

								<label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
									Transaction Amount
								</label>

								<div className="
									flex h-14 items-center
									rounded-xl
									border border-white/10
									bg-white/[0.04]
									px-4
									focus-within:border-emerald-400/40
								">

									<span className="mr-3 text-emerald-300">
										৳
									</span>

									<NumericFormat
										getInputRef={revenue_transection_amount_ref}
										className="
											h-full w-full
											bg-transparent
											text-lg font-bold
											text-white
											outline-none
										"
										placeholder="0.00"
										allowNegative={false}
										decimalScale={2}
										fixedDecimalScale={false}
										thousandSeparator={false}
									/>

								</div>

							</div>


							{isComment && (

								<div>

									<label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
										Description
									</label>

									<input
										ref={revenue_comment_ref}
										type="text"
										placeholder="Explain this revenue"
										className="
											h-12 w-full
											rounded-xl
											border border-white/10
											bg-white/[0.04]
											px-4
											text-sm text-white
											outline-none
											placeholder:text-slate-600
											focus:border-emerald-400/40
										"
									/>

								</div>

							)}


							<button
								onClick={() =>
									handleRevenueTransections('revenue')
								}
								className="
									h-12 w-full
									rounded-xl
									bg-emerald-400
									font-bold
									text-black
									transition
									hover:bg-emerald-300
								"
							>
								Save Revenue Transaction
							</button>

						</div>

					</div>

				</div>

			)}


			{/* =====================================================
			    EXPENSE MODAL
			===================================================== */}

			{expenseModal && (

				<div className="
					fixed inset-0 z-[100]
					flex items-center justify-center
					bg-black/70
					p-4
					backdrop-blur-md
				">

					<div className="
						w-full max-w-lg
						rounded-[28px]
						border border-red-400/15
						bg-[#071613]
						p-6
						shadow-2xl
					">

						<div className="flex items-start justify-between">

							<div>

								<p className="text-[10px] uppercase tracking-[3px] text-red-400/60">
									Cash Out
								</p>

								<h2 className="mt-1 text-xl font-black text-white">
									Expense Transaction
								</h2>

							</div>


							<button
								onClick={() =>
									setExpenseModal(false)
								}
								className="
									rounded-xl
									p-2
									text-slate-500
									transition
									hover:bg-white/5
									hover:text-white
								"
							>
								<MdOutlineCancel className="text-2xl" />
							</button>

						</div>


						<div className="mt-6 space-y-5">

							<div>

								<label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
									Expense Amount
								</label>

								<div className="
									flex h-14 items-center
									rounded-xl
									border border-white/10
									bg-white/[0.04]
									px-4
									focus-within:border-red-400/40
								">

									<span className="mr-3 text-red-300">
										৳
									</span>

									<NumericFormat
										getInputRef={expense_transection_amount_ref}
										className="
											h-full w-full
											bg-transparent
											text-lg font-bold
											text-white
											outline-none
										"
										placeholder="0.00"
										allowNegative={false}
										decimalScale={2}
										fixedDecimalScale={false}
										thousandSeparator={false}
									/>

								</div>

							</div>


							<div>

								<label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
									Comment
								</label>

								<input
									ref={expense_comment_ref}
									type="text"
									placeholder="What is this expense for?"
									className="
										h-12 w-full
										rounded-xl
										border border-white/10
										bg-white/[0.04]
										px-4
										text-sm text-white
										outline-none
										placeholder:text-slate-600
										focus:border-red-400/40
									"
								/>

							</div>


							<button
								onClick={() =>
									handleExpenseTransections('expense')
								}
								className="
									h-12 w-full
									rounded-xl
									bg-red-400
									font-bold
									text-black
									transition
									hover:bg-red-300
								"
							>
								Save Expense Transaction
							</button>

						</div>

					</div>

				</div>

			)}

		</div>
	);
};

export default ShopTransections;