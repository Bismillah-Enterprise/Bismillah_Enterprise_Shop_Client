import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../Providers/AuthProvider';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import { MdOutlineCancel } from 'react-icons/md';
import { NumericFormat } from 'react-number-format';
import Swal from 'sweetalert2';

const StaffManipulation = () => {
	const { user } = useContext(AuthContext);
	const allStaffs = useLoaderData();
	const [modal, setModal] = useState(false);
	const [staffId, setStaffId] = useState('');
	const [isTimeEdit, setIsTimeEdit] = useState(false);
	const [startTime, setStartTime] = useState();
	const [endTime, setEndTime] = useState();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		fetch(`https://bismillah-enterprise-server.onrender.com/staff_bonus`)
			.then(res => res.json())
			.then(data => {
				const formatTime = (totalMinutes) => {
					if (totalMinutes == null) return null;

					let hours = Math.floor(totalMinutes / 60);
					let minutes = totalMinutes % 60;

					const modifier = hours >= 12 ? 'PM' : 'AM';

					hours = hours % 12;
					if (hours === 0) hours = 12;

					return `${hours}:${minutes.toString().padStart(2, '0')} ${modifier}`;
				};

				setStartTime(formatTime(data.start_time));
				setEndTime(formatTime(data.end_time));
			});
	}, []);

	const handleUserCategory = (uid, newUserCategory) => {
		Swal.fire({
			title: "Are you sure?",
			text: `You Are Changing User Category To ${newUserCategory}`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, I am Sure"
		}).then((result) => {
			if (result.isConfirmed) {
				fetch(`https://bismillah-enterprise-server.onrender.com/set_user_category/${uid}`, {
					method: 'PUT',
					headers: {
						'content-type': 'application/json'
					},
					body: JSON.stringify({ user_category: newUserCategory })
				})
					.then(res => res.json())
					.then((data) => {
						if (data.acknowledged) {
							navigate(location.pathname);

							Swal.fire({
								position: 'center',
								icon: 'success',
								title: 'User Category Set Successfully',
								showConfirmButton: false,
								timer: 1000,
							});
						}
					});
			}
		});
	};

	const handleUserStatus = (uid, updatedStatus) => {
		Swal.fire({
			title: "Are you sure?",
			text: `You Are ${updatedStatus ? 'Unblocking' : 'Blocking'} This Staff`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, I am Sure"
		}).then((result) => {
			if (result.isConfirmed) {
				fetch(`https://bismillah-enterprise-server.onrender.com/set_user_status/${uid}`, {
					method: 'PUT',
					headers: {
						'content-type': 'application/json'
					},
					body: JSON.stringify({ status: updatedStatus })
				})
					.then(res => res.json())
					.then((data) => {
						if (data.acknowledged) {
							navigate(location.pathname);

							Swal.fire({
								position: 'center',
								icon: 'success',
								title: `User ${updatedStatus === true ? 'Unblock' : 'Block'} Successfully`,
								showConfirmButton: false,
								timer: 1000,
							});
						}
					});
			}
		});
	};

	const hour_rate_ref = useRef();

	const handleHourRate = () => {
		const newHourRate = parseFloat(hour_rate_ref.current.value);

		fetch(`https://bismillah-enterprise-server.onrender.com/hour_rate/${staffId}`, {
			method: 'PUT',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({ hour_rate: newHourRate })
		})
			.then(res => res.json())
			.then(data => {
				if (data.acknowledged) {
					navigate(location.pathname);
					setModal(false);

					Swal.fire({
						position: 'center',
						icon: 'success',
						title: 'Hour Rate Set Successfully',
						showConfirmButton: false,
						timer: 1000,
					});
				}
			});
	};

	const handleSetBonusTime = (newStartTime, newEndTime) => {
		const parseTime = (timeStr) => {
			if (!timeStr) return null;

			const [time, modifier] = timeStr.split(' ');
			let [hours, minutes] = time.split(':').map(Number);

			if (modifier === 'PM' && hours !== 12) hours += 12;
			if (modifier === 'AM' && hours === 12) hours = 0;

			return hours * 60 + minutes;
		};

		const bonusStartTime = parseTime(newStartTime);
		const bonusEndTime = parseTime(newEndTime);

		console.log(bonusStartTime, bonusEndTime);

		fetch(`https://bismillah-enterprise-server.onrender.com/set_bonus_time`, {
			method: 'PATCH',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				start_time: bonusStartTime,
				end_time: bonusEndTime
			})
		})
			.then(res => res.json())
			.then(data => {
				if (data.acknowledged) {
					navigate(location.pathname);
					setStartTime(newStartTime);
					setEndTime(newEndTime);
					setIsTimeEdit(false);

					Swal.fire({
						position: 'center',
						icon: 'success',
						title: 'Bonus Time Set Successfully',
						showConfirmButton: false,
						timer: 1000,
					});
				}
			});
	};

	const bonusTimeStartRef = useRef();
	const bonusTimeEndRef = useRef();

	return (
		<div className="min-h-full w-full bg-[#061512] text-slate-200 px-4 py-5 sm:px-6 lg:px-8">

			{/* Background glow */}
			<div className="pointer-events-none fixed inset-0 overflow-hidden">
				<div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
				<div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
			</div>

			<div className="relative mx-auto max-w-7xl">

				{/* ================= HEADER ================= */}
				<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

					<div>
						<p className="mb-1 text-xs font-medium uppercase tracking-[0.25em] text-emerald-400/70">
							Administration
						</p>

						<h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
							Staff Manipulation
						</h1>

						<p className="mt-1 text-sm text-slate-500">
							Manage staff accounts, permissions, rates and bonus hours.
						</p>
					</div>

					<div className="rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 backdrop-blur-xl">
						<p className="text-xs text-slate-500">Total Staff</p>
						<p className="text-xl font-bold text-white">
							{allStaffs?.length || 0}
						</p>
					</div>
				</div>

				{/* ================= BONUS TIME CARD ================= */}
				<div className="mb-8 overflow-hidden rounded-3xl border border-white/5 bg-[#0b1f1b]/70 shadow-2xl shadow-black/20 backdrop-blur-xl">

					<div className="border-b border-white/5 px-5 py-4 sm:px-6">
						<div className="flex items-center justify-between gap-4">
							<div>
								<p className="text-xs font-medium uppercase tracking-wider text-emerald-400">
									Staff Bonus Schedule
								</p>

								<h2 className="mt-1 text-lg font-semibold text-white">
									Bonus Working Hours
								</h2>
							</div>

							<div className="hidden rounded-xl bg-emerald-400/10 px-3 py-2 text-xs font-medium text-emerald-300 sm:block">
								Time Settings
							</div>
						</div>
					</div>

					{/* Current Time */}
					<div className={`${isTimeEdit ? 'hidden' : 'flex'} flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6`}>

						<div className="grid w-full grid-cols-2 gap-3 sm:max-w-md">

							<div className="rounded-2xl border border-white/5 bg-black/10 p-4">
								<p className="text-xs text-slate-500">
									Bonus Starts
								</p>

								<p className="mt-1 text-lg font-bold text-emerald-300">
									{startTime || 'Not set'}
								</p>
							</div>

							<div className="rounded-2xl border border-white/5 bg-black/10 p-4">
								<p className="text-xs text-slate-500">
									Bonus Ends
								</p>

								<p className="mt-1 text-lg font-bold text-cyan-300">
									{endTime || 'Not set'}
								</p>
							</div>

						</div>

						<button
							onClick={() => { setIsTimeEdit(true) }}
							className="inline-flex items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-2.5 text-sm font-semibold text-emerald-300 transition hover:-translate-y-0.5 hover:bg-emerald-400/15"
						>
							Edit Time
						</button>
					</div>

					{/* Edit Time */}
					<div className={`${isTimeEdit ? 'flex' : 'hidden'} flex-col gap-4 p-5 sm:flex-row sm:items-end sm:px-6`}>

						<div className="w-full">
							<label className="mb-2 block text-xs font-medium text-slate-400">
								Bonus Time Start From
							</label>

							<div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 transition focus-within:border-emerald-400/40">
								<input
									ref={bonusTimeStartRef}
									defaultValue={startTime}
									type="text"
									className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
									placeholder="Example: 10:00 AM"
								/>
							</div>
						</div>

						<div className="w-full">
							<label className="mb-2 block text-xs font-medium text-slate-400">
								Bonus Time End At
							</label>

							<div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 transition focus-within:border-cyan-400/40">
								<input
									ref={bonusTimeEndRef}
									defaultValue={endTime}
									type="text"
									className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
									placeholder="Example: 06:00 PM"
								/>
							</div>
						</div>

						<div className="flex gap-2">
							<button
								onClick={() => {
									handleSetBonusTime(
										bonusTimeStartRef.current.value,
										bonusTimeEndRef.current.value
									)
								}}
								className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-2.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/15"
							>
								Save
							</button>

							<button
								onClick={() => setIsTimeEdit(false)}
								className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-400 transition hover:bg-white/10 hover:text-white"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>

				{/* ================= STAFF LIST ================= */}
				<div className="mb-4 flex items-center justify-between">
					<div>
						<h2 className="text-lg font-semibold text-white">
							Staff Members
						</h2>

						<p className="text-sm text-slate-500">
							Manage individual staff accounts
						</p>
					</div>
				</div>

				<div className="space-y-3">

					{allStaffs?.map(staff => (
						<div
							key={staff._id}
							className="group rounded-2xl border border-white/5 bg-[#0b1f1b]/60 p-4 backdrop-blur-xl transition hover:border-emerald-400/10 hover:bg-[#0d251f]/70 sm:p-5"
						>

							<div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

								{/* Staff Info */}
								<div className="min-w-0 flex-1">
									<div className="flex items-start gap-3">

										<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/10 text-lg font-bold text-emerald-300">
											{staff?.name?.charAt(0)?.toUpperCase() || '?'}
										</div>

										<div className="min-w-0">
											<div className="flex flex-wrap items-center gap-2">
												<h3 className="truncate text-base font-semibold text-white sm:text-lg">
													{staff?.name}
												</h3>

												<span
													className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${staff.status
															? 'bg-emerald-400/10 text-emerald-300'
															: 'bg-red-400/10 text-red-300'
														}`}
												>
													{staff.status ? 'Active' : 'Blocked'}
												</span>

												<span className="rounded-full bg-violet-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-violet-300">
													{staff?.user_category || 'staff'}
												</span>
											</div>

											<p className="mt-1 truncate text-sm text-slate-500">
												{staff?.email}
											</p>
										</div>

									</div>
								</div>

								{/* Actions */}
								<div className="flex flex-wrap gap-2 justify-center xl:justify-end">

									<Link
										to={`/staff/uid_query/${staff?.uid}`}
										state={{ pathname: location.pathname }}
										className="inline-flex items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-3.5 py-2 text-xs font-semibold text-cyan-300 transition hover:-translate-y-0.5 hover:bg-cyan-400/15 sm:text-sm"
									>
										View User
									</Link>

									{user?.email === 'toyburrahman48@gmail.com' || 'bismillah786e@gmail.com' ? (
										staff.user_category === 'admin' ? (
											<button
												onClick={() => {
													handleUserCategory(staff?.uid, 'staff')
												}}
												className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10 px-3.5 py-2 text-xs font-semibold text-violet-300 transition hover:-translate-y-0.5 hover:bg-violet-400/15 sm:text-sm"
											>
												Set As Staff
											</button>
										) : (
											<button
												onClick={() => {
													handleUserCategory(staff?.uid, 'admin')
												}}
												className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10 px-3.5 py-2 text-xs font-semibold text-violet-300 transition hover:-translate-y-0.5 hover:bg-violet-400/15 sm:text-sm"
											>
												Set As Admin
											</button>
										)
									) : (
										''
									)}

									{staff.status ? (
										<button
											onClick={() => {
												handleUserStatus(staff?.uid, false)
											}}
											className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-red-400/20 bg-red-400/10 px-3.5 py-2 text-xs font-semibold text-red-300 transition hover:-translate-y-0.5 hover:bg-red-400/15 sm:text-sm w-24"
										>
											Block
										</button>
									) : (
										<button
											onClick={() => {
												handleUserStatus(staff?.uid, true)
											}}
											className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3.5 py-2 text-xs font-semibold text-emerald-300 transition hover:-translate-y-0.5 hover:bg-emerald-400/15 sm:text-sm w-24"
										>
											Unblock
										</button>
									)}

									{user?.email === 'toyburrahman48@gmail.com' || 'bismillah786e@gmail.com' ? (
										<button
											onClick={() => {
												setStaffId(staff?._id);
												setModal(true);
											}}
											className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 px-3.5 py-2 text-xs font-semibold text-amber-300 transition hover:-translate-y-0.5 hover:bg-amber-400/15 sm:text-sm"
										>
											Change Hour Rate
										</button>
									) : (
										''
									)}

								</div>
							</div>
						</div>
					))}

				</div>
			</div>

			{/* ================= HOUR RATE MODAL ================= */}
			<div
				className={`fixed inset-0 z-50 ${!modal ? 'hidden' : 'flex'
					} items-center justify-center bg-black/70 p-4 backdrop-blur-sm`}
			>

				<div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#081714] shadow-2xl shadow-black/50">

					{/* Modal Header */}
					<div className="flex items-center justify-between border-b border-white/5 px-5 py-4 sm:px-6">

						<div>
							<p className="text-xs font-medium uppercase tracking-wider text-amber-400">
								Staff Settings
							</p>

							<h2 className="mt-1 text-lg font-semibold text-white">
								Set New Hour Rate
							</h2>
						</div>

						<button
							onClick={() => { !setModal(false) }}
							className="rounded-xl p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
						>
							<MdOutlineCancel className="text-2xl" />
						</button>
					</div>

					{/* Modal Body */}
					<div className="p-5 sm:p-6">

						<label className="mb-2 block text-sm font-medium text-slate-300">
							Enter New Hour Rate
						</label>

						<div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 transition focus-within:border-amber-400/40">
							<NumericFormat
								getInputRef={hour_rate_ref}
								className="w-full bg-transparent text-white outline-none placeholder:text-slate-600"
								placeholder="Enter amount"
								allowNegative={false}
								decimalScale={2}
								fixedDecimalScale={false}
								thousandSeparator={false}
							/>
						</div>

						<div className="mt-5 flex gap-2">
							<button
								onClick={() => handleHourRate()}
								className="flex-1 rounded-xl border border-amber-400/20 bg-amber-400/10 px-5 py-3 text-sm font-semibold text-amber-300 transition hover:bg-amber-400/15"
							>
								Save Hour Rate
							</button>

							<button
								onClick={() => setModal(false)}
								className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-400 transition hover:bg-white/10 hover:text-white"
							>
								Cancel
							</button>
						</div>

					</div>
				</div>
			</div>

		</div>
	);
};

export default StaffManipulation;