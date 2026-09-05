import React, { useContext, useEffect, useRef, useState } from 'react';
import { MdOutlineCancel, MdPersonAdd, MdSwapHoriz, MdDeleteOutline } from 'react-icons/md';
import { NumericFormat } from 'react-number-format';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../../Providers/AuthProvider';

const UserRequest = () => {
	const { user } = useContext(AuthContext);
	const userRequest = useLoaderData();

	const [allStaffs, setAllStaffs] = useState([]);
	const [modal, setModal] = useState(false);
	const [replaceModal, setReplaceModal] = useState(false);

	const location = useLocation();
	const navigate = useNavigate();

	const [selectedUser, setSelectedUser] = useState(null);

	useEffect(() => {
		fetch(`http://localhost:5000/staffs`)
			.then(res => res.json())
			.then(data => setAllStaffs(data));
	}, [user]);

	const now = new Date();

	const currentDate = now.toLocaleDateString('en-BD', {
		day: 'numeric',
		year: 'numeric',
		month: 'long',
	});

	const todayDate = now.toLocaleDateString('en-BD', {
		day: 'numeric'
	});

	const todayDateIntFormat = parseInt(todayDate);

	const user_name_field = useRef();
	const user_email_field = useRef();
	const hour_rate_field = useRef();
	const user_uid_field = useRef();
	const user_category_field = useRef();
	const user_old_id_field = useRef();

	const handleApprove = (email, uid, id, name) => {
		user_email_field.current.value = email;
		user_uid_field.current.value = uid;
		user_old_id_field.current.value = id;
		user_name_field.current.value = name;

		setSelectedUser({ email, uid, id, name });
		setModal(true);
	};

	const handleReplace = (email, uid, id) => {
		user_email_field.current.value = email;
		user_uid_field.current.value = uid;
		user_old_id_field.current.value = id;

		setSelectedUser({ email, uid, id });
		setReplaceModal(true);
	};

	const handleReplaceStaff = (old_id, staffName) => {
		const email = user_email_field.current.value;
		const uid = user_uid_field.current.value;
		const id = user_old_id_field.current.value;

		const userUpdatedData = {
			email,
			uid
		};

		Swal.fire({
			title: "Replace User?",
			text: `You are replacing this account with ${staffName}.`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#10b981",
			cancelButtonColor: "#ef4444",
			background: "#0b1c18",
			color: "#e2e8f0",
			confirmButtonText: "Yes, Replace"
		}).then((result) => {
			if (result.isConfirmed) {
				fetch(`http://localhost:5000/replace_staff/${old_id}`, {
					method: 'PUT',
					headers: {
						'content-type': 'application/json'
					},
					body: JSON.stringify(userUpdatedData)
				})
					.then(async res => {
						if (!res.ok) {
							throw new Error("Server error or user not found");
						}

						const text = await res.text();
						return text ? JSON.parse(text) : null;
					})
					.then(() => {
						fetch(`http://localhost:5000/user_request/${id}`, {
							method: 'DELETE'
						}).then(() => {
							setReplaceModal(false);

							navigate(location.pathname);

							Swal.fire({
								position: "center",
								icon: "success",
								title: "User Replaced Successfully",
								showConfirmButton: false,
								timer: 1500,
								background: "#0b1c18",
								color: "#e2e8f0"
							});
						});
					});
			}
		});
	};

	const handleSetNewUser = () => {
		if (!user) {
			return;
		}
		const user_category = user_category_field.current.value;
		const name = user_name_field.current.value;
		const email = user?.email;
		const hour_rate = parseFloat(hour_rate_field.current.value) || 0;
		const uid = user?.uid;

		console.log(user, { user_category, name, email, hour_rate, uid })

		const userAllData = {
			name,
			email,
			hour_rate,
			user_category,
			status: true,
			current_working_month: currentDate.split(' ')[0],
			total_income: 0,
			bonus: 0,
			last_month_due: 0,
			withdrawal_amount: 0,
			available_balance: 0,
			transections: [],
			total_working_hour: "",
			total_working_minute: "",
			current_month_details: [],
			income_history: [],
			today_date: todayDateIntFormat,
			today_enter1_time: "",
			today_enter2_time: "",
			today_exit1_time: "",
			today_exit2_time: "",
			additional_movement_status: false,
			additional_exit_time: "",
			additional_enter_time: "",
			additional_movement_hour: "",
			additional_movement_minute: "",
			uid
		};

		Swal.fire({
			title: "Create User Profile?",
			text: `Create ${name} as ${user_category}.`,
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: "#10b981",
			cancelButtonColor: "#ef4444",
			background: "#0b1c18",
			color: "#e2e8f0",
			confirmButtonText: "Create"
		}).then(result => {
			if (!result.isConfirmed) return;

			fetch('http://localhost:5000/staff', {
				method: 'POST',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify(userAllData)
			})
				.then(async res => {
					if (!res.ok) {
						throw new Error("Server error or user not found");
					}

					const text = await res.text();
					return text ? JSON.parse(text) : null;
				})
				.then(() => {
					return fetch(`http://localhost:5000/user_request/${uid}`, {
						method: 'DELETE'
					});
				})
				.then(() => {
					setModal(false);
					navigate(location.pathname);

					Swal.fire({
						position: "center",
						icon: "success",
						title: "User Created Successfully",
						showConfirmButton: false,
						timer: 1500,
						background: "#0b1c18",
						color: "#e2e8f0"
					});
					if (location.pathname === '/user_request') {
						navigate('/');
					}
				})
				.catch(error => {
					Swal.fire({
						icon: "error",
						title: "Operation Failed",
						text: error.message,
						background: "#0b1c18",
						color: "#e2e8f0"
					});
				});
		});
	};

	const handleReject = (id) => {
		Swal.fire({
			title: "Reject Request?",
			text: "This request will be permanently removed.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#ef4444",
			cancelButtonColor: "#64748b",
			background: "#0b1c18",
			color: "#e2e8f0",
			confirmButtonText: "Reject"
		}).then((result) => {
			if (result.isConfirmed) {
				fetch(`http://localhost:5000/user_request/${id}`, {
					method: 'DELETE'
				})
					.then(res => res.json())
					.then(() => {
						Swal.fire({
							title: "Rejected",
							text: "This request has been rejected.",
							icon: "success",
							background: "#0b1c18",
							color: "#e2e8f0"
						}).then(() => window.location.reload());
					});
			}
		});
	};

	return (
		<div className="overflow-scroll min-h-full pb-12 p-5 text-slate-200">

			{/* Ambient accents */}
			<div className="pointer-events-none fixed -top-32 -left-32 w-80 h-80 bg-emerald-500/10 blur-[120px] rounded-full" />
			<div className="pointer-events-none fixed top-1/3 -right-32 w-80 h-80 bg-cyan-500/10 blur-[120px] rounded-full" />

			{/* Create user modal */}
			{modal && (
				<div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
					<div className="w-full max-w-md rounded-3xl border border-emerald-400/20 bg-[#0b1c18]/95 shadow-2xl shadow-emerald-500/10">

						<div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
							<div>
								<p className="text-xs uppercase tracking-[0.25em] text-emerald-400">
									User Management
								</p>
								<h2 className="text-xl font-bold text-white mt-1">
									Create User Profile
								</h2>
							</div>

							<button
								onClick={() => setModal(false)}
								className="w-9 h-9 rounded-full bg-white/5 hover:bg-red-500/10 flex items-center justify-center"
							>
								<MdOutlineCancel className="text-2xl text-slate-400 hover:text-red-400" />
							</button>
						</div>

						<div className="p-6 space-y-5">
							<input defaultValue={user?.email} ref={user_email_field} type="hidden" />
							<input defaultValue={user?.uid} ref={user_uid_field} type="hidden" />

							<div>
								<label className="text-sm text-slate-400">User Name</label>
								<input
									ref={user_name_field}
									type="text"
									className="mt-2 w-full h-12 rounded-xl bg-white/[0.04] border border-white/10 px-4 text-white outline-none focus:border-emerald-400/50"
								/>
							</div>

							<div>
								<label className="text-sm text-slate-400">Hour Rate</label>
								<NumericFormat
									getInputRef={hour_rate_field}
									className="mt-2 w-full h-12 rounded-xl bg-white/[0.04] border border-white/10 px-4 text-white outline-none focus:border-emerald-400/50"
									placeholder="Enter amount"
									allowNegative={false}
									decimalScale={2}
									thousandSeparator={false}
								/>
							</div>

							<div>
								<label className="text-sm text-slate-400">User Category</label>
								<select
									ref={user_category_field}
									className="mt-2 w-full h-12 rounded-xl bg-[#10231f] border border-white/10 px-4 text-white outline-none"
								>
									<option value="staff">Staff</option>
									<option value="admin">Admin</option>
								</select>
							</div>

							<button
								onClick={handleSetNewUser}
								className="w-full h-12 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 hover:bg-emerald-500 hover:text-[#071311] font-bold transition-all"
							>
								Create Profile
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Replace modal */}
			{replaceModal && (
				<div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
					<div className="w-full max-w-md rounded-3xl border border-cyan-400/20 bg-[#0b1c18]/95 shadow-2xl shadow-cyan-500/10">

						<div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
							<div>
								<p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
									Account Replacement
								</p>
								<h2 className="text-xl font-bold text-white mt-1">
									Select Staff
								</h2>
							</div>

							<button onClick={() => setReplaceModal(false)}>
								<MdOutlineCancel className="text-2xl text-slate-400 hover:text-red-400" />
							</button>
						</div>

						<div className="p-4 max-h-[400px] overflow-y-auto space-y-2 scrollbar-hide">
							{allStaffs.map(staff => (
								<div
									key={staff?._id}
									className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-cyan-400/20 transition-all"
								>
									<div>
										<p className="font-semibold text-white">{staff?.name}</p>
										<p className="text-xs text-slate-500">{staff?.email}</p>
									</div>

									<button
										onClick={() => handleReplaceStaff(staff?._id, staff?.name)}
										className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 hover:bg-cyan-500 hover:text-[#071311] font-semibold transition-all"
									>
										Select
									</button>
								</div>
							))}
						</div>
					</div>
				</div>
			)}

			<div className="max-w-7xl mx-auto">

				<div className="flex items-center justify-between gap-4 mb-8">
					<div>
						<p className="text-xs uppercase tracking-[0.3em] text-emerald-400">
							Account Center
						</p>
						<h1 className="text-2xl md:text-3xl font-black text-white mt-1">
							User Requests
						</h1>
						<p className="text-sm text-slate-500 mt-2">
							Review and manage incoming account requests.
						</p>
					</div>

					{location?.state?.pathname === '/' && (
						<Link
							to="/"
							className="hidden md:block px-5 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] hover:border-emerald-400/30 hover:text-emerald-300 transition-all"
						>
							Back
						</Link>
					)}
				</div>

				<div className="mb-6 rounded-2xl border border-amber-400/10 bg-amber-400/[0.03] px-5 py-4 text-sm text-slate-400">
					<span className="text-amber-400 font-semibold">Workflow:</span>{" "}
					Approve to create a new profile, Replace to assign this account
					to an existing staff profile, or Reject to remove the request.
				</div>

				<div className="space-y-3">
					{userRequest?.length ? userRequest.map(user => (
						<div
							key={user._id}
							className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] hover:bg-white/[0.045] hover:border-emerald-400/20 p-4 md:p-5 transition-all duration-300"
						>
							<div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-5 items-center">

								<div className="flex items-center gap-4 min-w-0">
									<div className="relative shrink-0">
										<img
											src={user?.photo}
											className="w-12 h-12 md:w-14 md:h-14 rounded-2xl object-cover border border-emerald-400/20"
											alt="User"
										/>
										<span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#071311]" />
									</div>

									<div className="min-w-0">
										<h2 className="font-bold text-white truncate">
											{user?.display_name}
										</h2>
										<p className="text-sm text-slate-500 truncate">
											{user?.email}
										</p>
									</div>
								</div>

								<div className="flex flex-wrap justify-center md:justify-end gap-2">
									<button
										onClick={() => setModal(!modal)}
										className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 hover:bg-emerald-500 hover:text-[#071311] font-semibold transition-all"
									>
										<MdPersonAdd />
										Approve
									</button>

									<button
										onClick={() =>
											setReplaceModal(true)
										}
										className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 hover:bg-cyan-500 hover:text-[#071311] font-semibold transition-all"
									>
										<MdSwapHoriz />
										Replace
									</button>

									<button
										onClick={() => handleReject(user._id)}
										className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-400/20 text-red-300 hover:bg-red-500 hover:text-white font-semibold transition-all"
									>
										<MdDeleteOutline />
										Reject
									</button>
								</div>
							</div>
						</div>
					)) : (
						<div className="py-20 text-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02]">
							<p className="text-slate-500">No pending user requests.</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default UserRequest;