import React, { useRef, useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { NumericFormat } from 'react-number-format';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const StaffDetails = () => {
	const staffDetails = useLoaderData();
	const {
		_id,
		name,
		total_income,
		last_month_due,
		withdrawal_amount,
		current_working_month,
		available_balance,
		total_working_hour,
		total_working_minute,
		transections,
		uid
	} = staffDetails;

	const [modal, setModal] = useState(false);

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

	const transection_amount_ref = useRef(null);
	const transection_type_ref = useRef(null);
	const comment_ref = useRef(null);

	const handleTransections = (id) => {
		const transection_amount = parseFloat(
			transection_amount_ref.current?.value
		);

		const transection_type =
			transection_type_ref.current?.value || '';

		const newWithdrawalAmmount =
			withdrawal_amount + transection_amount;

		const newReceiveableAmount =
			last_month_due +
			total_income -
			newWithdrawalAmmount;

		const comment =
			comment_ref.current?.value?.trim() || '';

		const transection_id =
			String(parseInt(transection_amount)) +
			String(transection_type) +
			String(parseInt(newWithdrawalAmmount)) +
			String(parseInt(newReceiveableAmount));

		const transectionData = {
			transection_id,
			currentDate,
			transection_amount,
			transection_type,
			previous_withdrawal_amount: withdrawal_amount,
			previous_available_balance: available_balance,
			withdrawal_amount: parseFloat(
				newWithdrawalAmmount.toFixed(2)
			),
			available_balance: parseFloat(
				newReceiveableAmount.toFixed(2)
			),
			comment
		};

		Swal.fire({
			title: 'Are you sure?',
			text: `You Are Giving ${transection_amount} Taka ${transection_type} to ${name}`,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, I am Sure'
		}).then((result) => {
			if (result.isConfirmed) {
				fetch(
					`https://bismillah-enterprise-server.onrender.com/transection_details/${id}`,
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
							if (transection_amount_ref.current) {
								transection_amount_ref.current.value = '';
							}

							if (transection_type_ref.current) {
								transection_type_ref.current.value = '';
							}

							if (comment_ref.current) {
								comment_ref.current.value = '';
							}

							setModal(false);

							navigate(location.pathname);

							Swal.fire({
								position: 'center',
								icon: 'success',
								title: 'Transection Details Saved Successfully',
								showConfirmButton: false,
								timer: 1000,
							});
						}
					});
			} else {
				if (transection_amount_ref.current) {
					transection_amount_ref.current.value = '';
				}
			}
		});
	};

	const handleClosingMonth = () => {
		Swal.fire({
			title: 'Are you sure?',
			text: 'You Are Sure?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, I am Sure'
		}).then((result) => {
			if (result.isConfirmed) {
				const currentWorkingMonth =
					currentDate.split(' ')[0];

				const closing_month_details = {
					current_working_month: currentWorkingMonth,
					month_name: current_working_month,
					total_income,
					paid_amount: withdrawal_amount,
					paid_date: currentDate,
					last_month_due: available_balance,
					total_working_hour,
					total_working_minute
				};

				fetch(
					`https://bismillah-enterprise-server.onrender.com/closing_month/${_id}`,
					{
						method: 'PUT',
						headers: {
							'content-type': 'application/json'
						},
						body: JSON.stringify(closing_month_details)
					}
				)
					.then(res => res.json())
					.then(data => {
						if (data.acknowledged) {
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

	return (
		<div className="min-h-full bg-transparent text-white px-3 py-5 sm:px-5 lg:px-8">

			{/* ================= MODAL ================= */}
			{modal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">

					<div className="
						w-full
						max-w-lg
						rounded-[28px]
						border border-white/[0.08]
						bg-[#071411]/95
						shadow-2xl
						shadow-black/40
						backdrop-blur-xl
						overflow-hidden
					">

						{/* Modal Header */}
						<div className="
							flex
							items-center
							justify-between
							border-b border-white/[0.06]
							px-5 py-4 sm:px-6
						">

							<div>
								<p className="
									text-[10px]
									tracking-[3px]
									text-emerald-400/70
									uppercase
								">
									Staff Payment
								</p>

								<h2 className="
									mt-1
									text-lg
									font-black
									text-white
								">
									Transaction Details
								</h2>
							</div>

							<button
								type="button"
								onClick={() => setModal(false)}
								className="
									flex h-10 w-10
									items-center justify-center
									rounded-xl
									border border-white/[0.06]
									bg-white/[0.03]
									text-slate-400
									transition
									hover:bg-white/[0.07]
									hover:text-white
								"
							>
								<MdOutlineCancel className="text-2xl" />
							</button>

						</div>

						{/* Modal Body */}
						<div className="p-5 sm:p-6">

							<div className="grid gap-5">

								{/* Amount */}
								<div>
									<label className="
										text-[11px]
										font-semibold
										tracking-[1.5px]
										text-slate-400
										uppercase
									">
										Transaction Amount
									</label>

									<div className="
										mt-2
										flex items-center
										rounded-2xl
										border border-white/[0.08]
										bg-white/[0.035]
										px-4
										h-14
										transition
										focus-within:border-emerald-400/40
										focus-within:bg-emerald-400/[0.03]
									">

										<span className="
											mr-3
											text-lg
											font-bold
											text-emerald-400
										">
											৳
										</span>

										<NumericFormat
											getInputRef={transection_amount_ref}
											className="
												w-full
												bg-transparent
												outline-none
												text-white
												placeholder:text-slate-600
											"
											placeholder="Enter amount"
											allowNegative={false}
											decimalScale={2}
											fixedDecimalScale={false}
											thousandSeparator={false}
										/>

									</div>
								</div>

								{/* Transaction Type */}
								<div>
									<label className="
										text-[11px]
										font-semibold
										tracking-[1.5px]
										text-slate-400
										uppercase
									">
										Transaction Type
									</label>

									<select
										ref={transection_type_ref}
										className="
											mt-2
											h-14
											w-full
											rounded-2xl
											border border-white/[0.08]
											bg-[#0b1f1b]
											px-4
											text-sm
											text-white
											outline-none
											transition
											focus:border-emerald-400/40
										"
									>

										<option
											className="bg-[#0b1f1b]"
											value="Lend"
										>
											Lend
										</option>

										{withdrawal_amount > 0 && (
											<option
												className="bg-[#0b1f1b]"
												value="Payback Lend"
											>
												Payback Lend
											</option>
										)}

										<option
											className="bg-[#0b1f1b]"
											value="Salary"
										>
											Salary
										</option>

									</select>
								</div>

								{/* Comment */}
								<div>
									<label className="
										text-[11px]
										font-semibold
										tracking-[1.5px]
										text-slate-400
										uppercase
									">
										Comment
									</label>

									<input
										ref={comment_ref}
										type="text"
										placeholder="Optional comment"
										className="
											mt-2
											h-14
											w-full
											rounded-2xl
											border border-white/[0.08]
											bg-white/[0.035]
											px-4
											text-sm
											text-white
											outline-none
											placeholder:text-slate-600
											transition
											focus:border-emerald-400/40
											focus:bg-emerald-400/[0.03]
										"
									/>
								</div>

							</div>

							{/* Submit */}
							<button
								type="button"
								onClick={() => handleTransections(_id)}
								className="
									mt-6
									h-12
									w-full
									rounded-2xl
									border border-emerald-400/20
									bg-emerald-400/10
									text-sm
									font-bold
									text-emerald-300
									transition
									hover:-translate-y-0.5
									hover:bg-emerald-400/15
									hover:shadow-lg
									hover:shadow-emerald-500/10
								"
							>
								Save Transaction
							</button>

						</div>
					</div>
				</div>
			)}

			{/* ================= BACK ================= */}
			<div className="mb-5">
				<Link
					to={from}
					state={{ from: location.pathname }}
				>
					<button className="
						hidden md:inline-flex
						items-center
						rounded-xl
						border border-white/[0.07]
						bg-white/[0.025]
						px-5 py-2.5
						text-sm
						font-semibold
						text-slate-300
						transition
						hover:bg-white/[0.06]
						hover:text-white
					">
						← Back
					</button>
				</Link>
			</div>

			{/* ================= HEADER ================= */}
			<div className="
				relative
				overflow-hidden
				rounded-[28px]
				border border-white/[0.07]
				bg-[#071411]/70
				p-5 sm:p-7
				backdrop-blur-xl
			">

				<div className="
					pointer-events-none
					absolute
					-right-20
					-top-20
					h-48
					w-48
					rounded-full
					bg-emerald-400/10
					blur-3xl
				" />

				<div className="
					relative
					flex
					flex-col
					gap-5
					md:flex-row
					md:items-center
					md:justify-between
				">

					<div>
						<p className="
							text-[10px]
							tracking-[4px]
							text-emerald-400/70
							uppercase
						">
							Staff Account
						</p>

						<h1 className="
							mt-2
							text-2xl
							font-black
							text-white
							sm:text-3xl
						">
							{name}
						</h1>

						<p className="
							mt-2
							text-sm
							text-slate-500
						">
							{currentDayName} · {Time}
						</p>
					</div>

					<div className="
						self-start
						rounded-2xl
						border border-emerald-400/10
						bg-emerald-400/[0.04]
						px-4 py-3
						md:self-auto
					">

						<p className="
							text-[9px]
							tracking-[2px]
							text-slate-500
							uppercase
						">
							Working Month
						</p>

						<p className="
							mt-1
							text-sm
							font-bold
							text-emerald-300
						">
							{current_working_month}
						</p>

					</div>

				</div>
			</div>

			{/* ================= FINANCIAL CARDS ================= */}
			<div className="
				mt-5
				grid
				grid-cols-1
				sm:grid-cols-2
				xl:grid-cols-4
				gap-4
			">

				<div className="
					rounded-[24px]
					border border-white/[0.06]
					bg-white/[0.025]
					p-5
					backdrop-blur-xl
				">
					<p className="text-[10px] tracking-[2px] text-slate-500 uppercase">
						Last Month Due
					</p>

					<p className="mt-3 text-2xl font-black text-amber-300">
						৳ {Number(last_month_due || 0).toLocaleString()}
					</p>
				</div>

				<div className="
					rounded-[24px]
					border border-white/[0.06]
					bg-white/[0.025]
					p-5
					backdrop-blur-xl
				">
					<p className="text-[10px] tracking-[2px] text-slate-500 uppercase">
						Total Earned
					</p>

					<p className="mt-3 text-2xl font-black text-cyan-300">
						৳ {Number(total_income || 0).toLocaleString()}
					</p>
				</div>

				<div className="
					rounded-[24px]
					border border-white/[0.06]
					bg-white/[0.025]
					p-5
					backdrop-blur-xl
				">
					<p className="text-[10px] tracking-[2px] text-slate-500 uppercase">
						Withdrawal
					</p>

					<p className="mt-3 text-2xl font-black text-rose-300">
						৳ {Number(withdrawal_amount || 0).toLocaleString()}
					</p>
				</div>

				<div className="
					rounded-[24px]
					border border-emerald-400/10
					bg-emerald-400/[0.04]
					p-5
					backdrop-blur-xl
				">
					<p className="text-[10px] tracking-[2px] text-slate-500 uppercase">
						Receivable
					</p>

					<p className="mt-3 text-2xl font-black text-emerald-300">
						৳ {Number(available_balance || 0).toLocaleString()}
					</p>
				</div>

			</div>

			{/* ================= ACTION PANEL ================= */}
			<div className="
				mt-5
				rounded-[28px]
				border border-white/[0.06]
				bg-white/[0.02]
				p-5 sm:p-6
				backdrop-blur-xl
			">

				<div className="mb-5">
					<p className="
						text-[10px]
						tracking-[3px]
						text-slate-500
						uppercase
					">
						Account Actions
					</p>

					<h2 className="
						mt-1
						text-lg
						font-black
						text-white
					">
						Manage Staff Account
					</h2>
				</div>

				<div className="
					grid
					grid-cols-1
					sm:grid-cols-2
					lg:grid-cols-3
					gap-3
				">

					<button
						onClick={() => setModal(true)}
						className="
							h-12
							rounded-2xl
							border border-emerald-400/20
							bg-emerald-400/10
							text-sm
							font-bold
							text-emerald-300
							transition
							hover:-translate-y-0.5
							hover:bg-emerald-400/15
						"
					>
						Make a Transaction
					</button>

					<Link
						to={`/admin/transections_history/${uid}`}
						state={{ pathname: location.pathname }}
						className="
							flex
							h-12
							items-center
							justify-center
							rounded-2xl
							border border-cyan-400/20
							bg-cyan-400/10
							text-sm
							font-bold
							text-cyan-300
							transition
							hover:-translate-y-0.5
							hover:bg-cyan-400/15
						"
					>
						Transaction History
					</Link>

					<button
						onClick={handleClosingMonth}
						className="
							h-12
							rounded-2xl
							border border-violet-400/20
							bg-violet-400/10
							text-sm
							font-bold
							text-violet-300
							transition
							hover:-translate-y-0.5
							hover:bg-violet-400/15
						"
					>
						Close The Month
					</button>

				</div>
			</div>

			{/* ================= WORK SUMMARY ================= */}
			<div className="
				mt-5
				grid
				grid-cols-1
				md:grid-cols-3
				gap-4
			">

				<div className="
					rounded-[24px]
					border border-white/[0.06]
					bg-white/[0.02]
					p-5
				">
					<p className="text-[10px] tracking-[2px] text-slate-500 uppercase">
						Working Hours
					</p>

					<p className="mt-2 text-xl font-black text-white">
						{total_working_hour || 0}
						<span className="ml-1 text-sm font-medium text-slate-500">
							hours
						</span>
					</p>
				</div>

				<div className="
					rounded-[24px]
					border border-white/[0.06]
					bg-white/[0.02]
					p-5
				">
					<p className="text-[10px] tracking-[2px] text-slate-500 uppercase">
						Working Minutes
					</p>

					<p className="mt-2 text-xl font-black text-white">
						{total_working_minute || 0}
						<span className="ml-1 text-sm font-medium text-slate-500">
							minutes
						</span>
					</p>
				</div>

				<div className="
					rounded-[24px]
					border border-white/[0.06]
					bg-white/[0.02]
					p-5
				">
					<p className="text-[10px] tracking-[2px] text-slate-500 uppercase">
						Current Date
					</p>

					<p className="mt-2 text-sm font-bold text-slate-200">
						{currentDate}
					</p>
				</div>

			</div>

		</div>
	);
};

export default StaffDetails;





