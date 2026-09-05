import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Providers/AuthProvider';
import Loading from '../Shared/Loading/Loading';
import useCurrentUser from '../Hooks/useCurrentUser';
import Swal from 'sweetalert2'; // assuming you're using this
import { PuffLoader } from 'react-spinners';
import Clock from '../Clock/Clock';
import { MdEdit, MdLocationOn, MdAccessTime, MdPayments, MdTrendingUp, MdCheckCircle, MdPendingActions, MdOutlineWorkHistory, MdArrowBack, MdHome, MdAdminPanelSettings, MdHistory, MdAccountBalanceWallet, MdDirectionsWalk } from 'react-icons/md';

// Utility to calculate distance in meters
function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
	const R = 6371000;
	const dLat = ((lat2 - lat1) * Math.PI) / 180;
	const dLon = ((lon2 - lon1) * Math.PI) / 180;
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos((lat1 * Math.PI) / 180) *
		Math.cos((lat2 * Math.PI) / 180) *
		Math.sin(dLon / 2) * Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
}

function parseTimeToDate(timeString) {
	if (!timeString) return null;
	const [time, modifier] = timeString.split(' ');
	let [hours, minutes] = time.split(':').map(Number);

	if (modifier === 'PM' && hours !== 12) hours += 12;
	if (modifier === 'AM' && hours === 12) hours = 0;

	const now = new Date();
	now.setHours(hours, minutes, 0, 0);
	return now;
}

const Staffs = () => {
	const { user } = useContext(AuthContext);
	const [, , isAdmin, userHookLoading] = useCurrentUser();
	const staff = useLoaderData();
	const { _id, name, hour_rate, last_month_due, withdrawal_amount, today_enter1_time, today_exit1_time, bonus, available_balance, today_enter2_time, today_exit2_time, uid, user_category, total_working_hour, total_income, total_working_minute, additional_movement_status, additional_enter_time, additional_exit_time, additional_movement_hour, additional_movement_minute, total_bonus } = staff;
	const [isAllowed, setIsAllowed] = useState(false);
	const [accuracy, setAccuracy] = useState('');
	const [lat, setLat] = useState('')
	const [lan, setLan] = useState('')
	const [distance, setDistance] = useState('')
	const [currentLocation, setCurrentLocation] = useState({});
	const [locationLoading, setLocationLoading] = useState(false);
	const navigate = useNavigate();
	const [workSubmitButton, setWorkSubmitButton] = useState(false);
	const [totalTimeCalculation, setTotalTimeCalculation] = useState({});
	const [dateCheckLoading, setDateCheckLoading] = useState(false);
	const location = useLocation();
	const from = location?.state?.pathname;
	// Time
	const now = new Date();
	const Time = now.toLocaleTimeString('en-BD', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: true,
	});

	const currentDayName = now.toLocaleDateString('en-BD', { weekday: 'long' });
	const currentDate = now.toLocaleDateString('en-BD', {
		day: 'numeric',
		year: 'numeric',
		month: 'long',
	});
	const today_only_date_number = parseInt(currentDate.split(' ')[1].split(',')[0]);


	useEffect(() => {
		setDateCheckLoading(true);
		const checkTodaySubmission = async () => {
			try {
				const res = await fetch(`http://localhost:5000/staff/uid_query/${uid}`);
				const data = await res.json();
				const submittedToday = Array.isArray(data?.current_month_details)
					&& data.current_month_details.some(item => item?.current_date === currentDate);
				setWorkSubmitButton(!submittedToday && (data?.today_exit1_time || data?.today_exit2_time));
			} catch (error) {
				console.error('Attendance date check failed:', error);
				setWorkSubmitButton(false);
			} finally {
				setDateCheckLoading(false);
			}
		};
		checkTodaySubmission();
	}, [user, uid, currentDate]);

	useEffect(() => {
		if (
			today_enter2_time !== '' &&
			today_exit2_time === ''
		) {
			setWorkSubmitButton(false); // still working on 2nd shift
		} else if (today_exit1_time !== '') {
			setWorkSubmitButton(true); // finished first shift (or both)
		} else {
			setWorkSubmitButton(false); // no shift completed
		}
	}, [user, staff])

	useEffect(() => {
		setIsAllowed(false);
		setLocationLoading(true);
		if (!user) return;

		if (location?.state?.pathname?.includes('admin') && user?.uid !== uid) {
			setIsAllowed(true);  // Admin bypasses location check
			setLocationLoading(false);
			return;
		}
		fetch('http://localhost:5000/shop_location')
			.then(res => res.json())
			.then(currentLocationData => {
				setCurrentLocation(currentLocationData);
				navigator.geolocation.getCurrentPosition(
					(position) => {
						const { latitude, longitude, accuracy } = position.coords;

						const distance = getDistanceFromLatLonInMeters(
							latitude,
							longitude,
							currentLocationData.latitude,
							currentLocationData.longitude
						);

						const isOwnStaffPage = location.pathname === `/staff/uid_query/${user?.uid}`;

						// CASE 1: Admin viewing own staff page → check accuracy + distance
						if (user_category === 'admin' && isOwnStaffPage) {
							if (accuracy <= 100 && distance <= currentLocationData?.shop_range) {
								setIsAllowed(true);
							} else {
								setIsAllowed(false);
							}
							setLocationLoading(false);
						}

						// CASE 2: Admin viewing someone else’s staff page → allow directly

						if (user_category === 'admin' && !isOwnStaffPage) {
							setIsAllowed(true);
							setLocationLoading(false);
						}

						// CASE 3: Non-admin (e.g. staff) → must pass location check
						if (accuracy <= 100 && distance <= currentLocationData?.shop_range) {
							setIsAllowed(true);
						} else {
							setIsAllowed(false);
						}
						setLocationLoading(false);

						setLat(latitude);
						setLan(longitude);
						setAccuracy(accuracy.toFixed(2));
						setDistance(distance.toFixed(2));
						setLocationLoading(false);

					}
				)
			})
		setLocationLoading(false)
	}, [user]);




	const handleTodayTime = (name, id) => {
		Swal.fire({
			title: "Are you sure?",
			text: "You won't be able to revert this!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, Submit"
		}).then(async (result) => {
			if (!result.isConfirmed) return;

			try {
				const updatedTime = {
					name,
					clickedTime: Time,
					today_date: today_only_date_number,
					current_date: currentDate
				};

				const attendanceRes = await fetch(`http://localhost:5000/staffs_daily_time/${id}`, {
					method: 'PUT',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify(updatedTime),
				});
				const attendanceData = await attendanceRes.json();
				if (!attendanceRes.ok) throw new Error(attendanceData?.message || attendanceData?.error || 'Attendance update failed.');

				let bonusResult = null;
				if (name === 'today_enter1_time') {
					setWorkSubmitButton(false);
					const bonusRes = await fetch(`http://localhost:5000/staff_bonus`, {
						method: 'PUT',
						headers: { 'content-type': 'application/json' },
						body: JSON.stringify({ entry_type: 'first entry', time: Time, uid, date: currentDate }),
					});
					bonusResult = await bonusRes.json();
					if (!bonusRes.ok) throw new Error(bonusResult?.message || 'Bonus check failed.');

					if (bonusResult?.bonus > 0) {
						await Swal.fire({
							position: 'center',
							icon: 'success',
							title: `You Will Get ৳${bonusResult.bonus} Bonus Today`,
							showConfirmButton: false,
							timer: 1200,
						});
					}
				}

				if (name === 'today_exit1_time') setWorkSubmitButton(true);
				else if (name === 'today_enter2_time') setWorkSubmitButton(false);
				else if (name === 'today_exit2_time') setWorkSubmitButton(true);

				if (bonusResult?.bonus === 0 && name === 'today_enter1_time') {
					await Swal.fire({
						position: 'center',
						icon: 'success',
						title: 'Attendance Saved',
						text: 'No attendance bonus was available for this entry.',
						showConfirmButton: false,
						timer: 1200,
					});
				} else if (name !== 'today_enter1_time') {
					await Swal.fire({
						position: 'center',
						icon: 'success',
						title: 'Saved Time',
						showConfirmButton: false,
						timer: 900,
					});
				}

				navigate(`/staff/uid_query/${uid}`);
			} catch (error) {
				Swal.fire('Attendance Failed', error.message, 'error');
			}
		});
	};

	const handleAdditionalMovementRequest = (name, uid) => {
		Swal.fire({
			title: "Are you sure?",
			text: "You won't be able to revert this!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, Submit"
		}).then((result) => {
			if (result.isConfirmed) {
				const requestData = { name, uid };
				fetch(`http://localhost:5000/additional_movement_request`, {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify(requestData),
				})
					.then((res) => res.json())
					.then(() => {
						Swal.fire({
							position: 'center',
							icon: 'success',
							title: 'Request Sent Successfully',
							showConfirmButton: false,
							timer: 1000,
						});
					})
			}
		})
	}


	const handleAdditionalTime = (name, id) => {
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
				const updatedTime = { name, clickedTime: Time };
				await fetch(`http://localhost:5000/additional_movements/${id}`, {
					method: 'PUT',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify(updatedTime),
				})
					.then((res) => res.json())
					.then(async (data) => {
						if (data.acknowledged && name === 'additional_enter_time') {
							const parseTime = (timeStr) => {
								if (!timeStr) return null;
								const [time, modifier] = timeStr.split(' ');
								let [hours, minutes] = time.split(':').map(Number);
								if (modifier === 'PM' && hours !== 12) hours += 12;
								if (modifier === 'AM' && hours === 12) hours = 0;
								return hours * 60 + minutes;
							};

							let totalMinutes = 0;
							const exit = parseTime(additional_exit_time);
							const enter = parseTime(Time);
							if (exit !== null && enter !== null && enter > exit) {
								totalMinutes += enter - exit;
							}

							const previousAdditionalTotalMinutes = (additional_movement_hour || 0) * 60 + (additional_movement_minute || 0);
							const updatedAdditionalTotalMinutes = previousAdditionalTotalMinutes + totalMinutes;
							const updatedAdditionalTotalHours = Math.floor(updatedAdditionalTotalMinutes / 60);
							const updatedAdditionalTotalMinutesRemainder = updatedAdditionalTotalMinutes % 60;

							const AdditionalMovementSummary = {
								additional_movement_hour: updatedAdditionalTotalHours,
								additional_movement_minute: updatedAdditionalTotalMinutesRemainder,
							};
							await fetch(`http://localhost:5000/additional_movement_submit/${_id}`, {
								method: 'PUT',
								headers: {
									'content-type': 'application/json'
								},
								body: JSON.stringify(AdditionalMovementSummary)
							})
								.then(res => res.json())
								.then(async (sentDataToStuffProfile) => {
									if (sentDataToStuffProfile.acknowledged) {
										await fetch(`http://localhost:5000/additional_request_approve/${uid}`, {
											method: 'PUT',
											headers: {
												'content-type': 'application/json'
											},
											body: JSON.stringify({ additional_movement_status: false })
										})
											.then(res => res.json())
											.then(() => {
												navigate(`/staff/uid_query/${uid}`)
												Swal.fire({
													position: 'center',
													icon: 'success',
													title: 'Additional Movement Record Submitted Successfully',
													showConfirmButton: false,
													timer: 1000,
												});
											})
									}
								});


						}
						else {
							setWorkSubmitButton(true);
						}
						navigate(`/staff/uid_query/${uid}`)
					});
			}
		});
	}


	const handleSubmitWorkTime = (uid) => {
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
				// Helper to parse time
				const parseTime = (timeStr) => {
					if (!timeStr || timeStr.trim() === '') return null; // more strict check
					const [time, modifier] = timeStr.split(' ');
					if (!time || !modifier) return null;

					let [hours, minutes] = time.split(':').map(Number);
					if (modifier === 'PM' && hours !== 12) hours += 12;
					if (modifier === 'AM' && hours === 12) hours = 0;

					if (isNaN(hours) || isNaN(minutes)) return null;

					return hours * 60 + minutes;
				};

				let totalMinutes = 0;


				const enter1 = parseTime(today_enter1_time);
				const exit1 = parseTime(today_exit1_time);
				if (enter1 !== null && exit1 !== null && exit1 > enter1) {
					totalMinutes += exit1 - enter1;
				}

				const enter2 = parseTime(today_enter2_time);
				const exit2 = parseTime(today_exit2_time);
				if (enter2 !== null && exit2 !== null && exit2 > enter2) {
					totalMinutes += exit2 - enter2;
				}

				if (additional_movement_hour || additional_movement_minute) {
					totalMinutes = totalMinutes - (additional_movement_hour * 60) - additional_movement_minute;
				}

				const today_hours = Math.floor(totalMinutes / 60);
				const today_minutes = totalMinutes % 60;

				const todayDecimal = totalMinutes / 60;
				let today_earned = parseFloat((todayDecimal * hour_rate).toFixed(2));
				let today_bonus = 0;
				let total_bonus = Number(bonus || 0);
				try {
					const bonusres = await fetch(`http://localhost:5000/staff_bonus`);
					const bonusdata = await bonusres.json();
					if (bonusdata?.date === currentDate) {
						if (bonusdata.first_entry?.uid === uid) today_bonus = 50;
						else if (bonusdata.second_entry?.uid === uid) today_bonus = 20;
					}
					total_bonus = Number(bonus || 0) + today_bonus;
					today_earned = parseFloat((today_earned + today_bonus).toFixed(2));
				} catch (error) {
					console.error('Bonus calculation failed:', error);
				}

				// Add today’s work to previous total from staff data
				const previousTotalMinutes = (total_working_hour || 0) * 60 + (total_working_minute || 0);
				const updatedTotalMinutes = previousTotalMinutes + totalMinutes;
				const updatedTotalHours = Math.floor(updatedTotalMinutes / 60);
				const updatedTotalMinutesRemainder = updatedTotalMinutes % 60;

				const previousEarn = total_income || 0;
				const updatedEarn = previousEarn + today_earned;
				const new_available_balance = parseFloat((last_month_due + updatedEarn - withdrawal_amount).toFixed(2));
				const TodaySummary = {
					currentDate,
					currentDayName,
					today_enter1_time,
					today_exit1_time,
					today_enter2_time,
					today_exit2_time,
					total_hour: today_hours,
					total_minute: today_minutes,
					total_earn: parseFloat(today_earned.toFixed(2)),
					available_balance: new_available_balance,
					additional_movement_hour,
					additional_movement_minute,
					total_working_hour: updatedTotalHours,
					total_working_minute: updatedTotalMinutesRemainder,
					today_bonus,
					total_bonus,
					total_income: parseFloat(updatedEarn.toFixed(2)),
					today_date: today_only_date_number,
					current_date: currentDate
				};

				// Save to database
				const submitRes = await fetch(`http://localhost:5000/submit_work_time/${_id}`, {
					method: 'PUT',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify(TodaySummary)
				});
				const sentDataToStuffProfile = await submitRes.json();

				if (submitRes.status === 409) {
					await Swal.fire('Already Submitted', sentDataToStuffProfile?.message || 'Work time for this date has already been submitted.', 'warning');
					return;
				}
				if (!submitRes.ok) throw new Error(sentDataToStuffProfile?.error || sentDataToStuffProfile?.message || 'Work time submission failed.');

				if (sentDataToStuffProfile.message === 'Work time submitted successfully') {
					navigate(`/staff/uid_query/${uid}`);
					Swal.fire({
						position: 'center',
						icon: 'success',
						title: 'Work Time Submitted Successfully',
						showConfirmButton: false,
						timer: 1000,
					});
				}
			}
		});
	};
	const [isEnableEdit, setIsEnableEdit] = useState(false);
	const [editEnter1Time, setEditEnter1Time] = useState(false);
	const [editExit1Time, setEditExit1Time] = useState(false);
	const [editEnter2Time, setEditEnter2Time] = useState(false);
	const [editExit2Time, setEditExit2Time] = useState(false);
	const enter1ref = useRef();
	const exit1ref = useRef();
	const enter2ref = useRef();
	const exit2ref = useRef();
	const handleEditTime = (name) => {
		if (name === 'today_enter1_time') {
			setEditEnter1Time(true);
			setIsEnableEdit(true);
			setTimeout(() => {
				enter1ref.current?.focus();
			}, 50);
		}
		if (name === 'today_exit1_time') {
			setEditExit1Time(true);
			setIsEnableEdit(true);
			setTimeout(() => {
				exit1ref.current?.focus();
			}, 50);
		}
		if (name === 'today_enter2_time') {
			setEditEnter2Time(true);
			setIsEnableEdit(true);
			setTimeout(() => {
				enter2ref.current?.focus();
			}, 50);
		}
		if (name === 'today_exit2_time') {
			setEditExit2Time(true);
			setIsEnableEdit(true);
			setTimeout(() => {
				exit2ref.current?.focus();
			}, 50);
		}

	}
	const handleChangeTime = (id) => {
		if (editEnter1Time) {
			fetch(`http://localhost:5000/change_time/${id}`, {
				method: 'PUT',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify({ name: 'today_enter1_time', time: enter1ref.current.value })
			}).then(res => res.json()).then(data => {
				if (data.acknowledged) {
					Swal.fire({
						position: 'center',
						icon: 'success',
						title: 'Time Edited Successfully',
						showConfirmButton: false,
						timer: 1000,
					});
				}
			})
			setEditEnter1Time(false);
			setIsEnableEdit(false);
		}
		if (editExit1Time) {
			fetch(`http://localhost:5000/change_time/${id}`, {
				method: 'PUT',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify({ name: 'today_exit1_time', time: exit1ref.current.value })
			}).then(res => res.json()).then(data => {
				if (data.acknowledged) {
					Swal.fire({
						position: 'center',
						icon: 'success',
						title: 'Time Edited Successfully',
						showConfirmButton: false,
						timer: 1000,
					});
				}
			})
			setEditExit1Time(false);
			setIsEnableEdit(false);
		}
		if (editEnter2Time) {
			fetch(`http://localhost:5000/change_time/${id}`, {
				method: 'PUT',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify({ name: 'today_enter2_time', time: enter2ref.current.value })
			}).then(res => res.json()).then(data => {
				if (data.acknowledged) {
					Swal.fire({
						position: 'center',
						icon: 'success',
						title: 'Time Edited Successfully',
						showConfirmButton: false,
						timer: 1000,
					});
				}
			})
			setEditEnter2Time(false);
			setIsEnableEdit(false);
		}
		if (editExit2Time) {
			fetch(`http://localhost:5000/change_time/${id}`, {
				method: 'PUT',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify({ name: 'today_exit2_time', time: exit2ref.current.value })
			}).then(res => res.json()).then(data => {
				if (data.acknowledged) {
					Swal.fire({
						position: 'center',
						icon: 'success',
						title: 'Time Edited Successfully',
						showConfirmButton: false,
						timer: 1000,
					});
				}
			})
			setEditExit2Time(false);
			setIsEnableEdit(false);
		}
		navigate(`/staff/uid_query/${uid}`);
	}

	if (locationLoading || dateCheckLoading) {
		return (
			<div className="min-h-full flex items-center justify-center rounded-3xl border border-emerald-400/10 bg-[#071311]/80">
				<Loading />
			</div>
		);
	}

	const parseMinutesForUI = (timeStr) => {
		if (!timeStr) return null;
		const [time, modifier] = timeStr.split(' ');
		if (!time || !modifier) return null;
		let [hours, minutes] = time.split(':').map(Number);
		if (modifier === 'PM' && hours !== 12) hours += 12;
		if (modifier === 'AM' && hours === 12) hours = 0;
		return hours * 60 + minutes;
	};

	const shiftMinutes = (enter, exit) => {
		const e = parseMinutesForUI(enter);
		const x = parseMinutesForUI(exit);
		return e !== null && x !== null && x > e ? x - e : 0;
	};

	const todayWorkedMinutes = shiftMinutes(today_enter1_time, today_exit1_time || Time) + shiftMinutes(today_enter2_time, today_exit2_time || Time);
	const todayWorkedHours = Math.floor(todayWorkedMinutes / 60);
	const todayWorkedRemainder = todayWorkedMinutes % 60;
	const todayEarnedUI = Number(((todayWorkedMinutes / 60) * (hour_rate || 0)).toFixed(2));
	const dailyTargetMinutes = 12 * 60;
	const progress = Math.min(100, Math.round((todayWorkedMinutes / dailyTargetMinutes) * 100));
	const locationReady = Number(distance) <= Number(currentLocation?.shop_range || Infinity) && Number(accuracy) <= 100;
	const actionButton = (label, icon, disabled, onClick, tone = 'emerald') => {
		const toneMap = {
			emerald: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200 shadow-emerald-500/10 hover:bg-emerald-400/20',
			cyan: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200 shadow-cyan-500/10 hover:bg-cyan-400/20',
			violet: 'border-violet-400/30 bg-violet-400/10 text-violet-200 shadow-violet-500/10 hover:bg-violet-400/20',
		};
		return (
			<button disabled={disabled} onClick={onClick} className={`group relative flex h-24 w-24 flex-col items-center justify-center rounded-full border backdrop-blur-xl shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/5 disabled:text-slate-500 disabled:shadow-none ${toneMap[tone]}`}>
				<span className="mb-1 text-xl transition-transform duration-300 group-hover:scale-110">{icon}</span>
				<span className="text-sm font-semibold">{label}</span>
			</button>
		);
	};
	const navButton = (children, icon) => (
		<div className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2 text-sm font-semibold text-slate-200 shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/25 hover:bg-emerald-400/[0.07] hover:text-emerald-200">
			<span className="text-emerald-300/80">{icon}</span>{children}
		</div>
	);

	return (
		<div className="relative min-h-full overflow-hidden md:pb-12 text-white">
			{/* Premium ambient layer — same palette as Main.jsx */}
			<div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
				<div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-emerald-500/10 blur-[130px]" />
				<div className="absolute right-[-180px] top-[25%] h-[480px] w-[480px] rounded-full bg-cyan-500/10 blur-[150px]" />
				<div className="absolute bottom-[-220px] left-[35%] h-[520px] w-[520px] rounded-full bg-violet-500/10 blur-[160px]" />
			</div>

			<div className="mx-auto max-w-7xl space-y-6 pt-4 lg:pt-7">
				{/* Navigation */}
				<div className="flex flex-wrap items-center justify-center gap-2.5">
					{user && <Link to="/" state={{ from: location }}>{navButton('Home', <MdHome />)}</Link>}
					{user && <Link to={`/monthly_records/${uid}`}>{navButton('Monthly Records', <MdOutlineWorkHistory />)}</Link>}
					{user && <Link to={`/transections_history/${uid}`} state={{ pathname: location.pathname }}>{navButton('Transactions', <MdHistory />)}</Link>}
					{user && <Link to={`/income_history/${uid}`}>{navButton('Income History', <MdPayments />)}</Link>}
					{(user?.uid !== uid || user_category === 'admin') && <Link to="/admin" state={{ from: '/' }}>{navButton('Admin', <MdAdminPanelSettings />)}</Link>}
					{(user?.uid !== uid || user_category === 'admin') && <Link to={from || '/admin/staff_manipulation'} state={{ from: location.pathname }} className="hidden sm:block">{navButton('Back', <MdArrowBack />)}</Link>}
				</div>

				{/* Profile / live status */}
				<section className="hidden sm:relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-7">
					<div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />
					<div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
						<div>
							<div className="mb-2 flex flex-wrap items-center gap-2">
								<span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Staff Workspace</span>
								{isAdmin && <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-semibold text-violet-300">ADMIN</span>}
							</div>
							<h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{name}</h1>
							<p className="mt-1 text-sm text-slate-400">Today · {currentDayName}, {currentDate}</p>
						</div>
						<div className="flex items-center gap-3 rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.05] px-4 py-3">
							<div className="rounded-xl bg-cyan-400/10 p-2.5 text-cyan-300"><MdAccessTime size={23} /></div>
							<div><p className="text-xs text-slate-500">Hourly Rate</p><p className="text-xl font-bold text-cyan-200">৳ {Number(hour_rate || 0).toFixed(2)}</p></div>
						</div>
					</div>
				</section>

				{/* Location + clock */}
				<section className="grid gap-4 lg:grid-cols-[1fr_auto]">
					<div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-xl backdrop-blur-xl">
						<div className="mb-4 flex items-center justify-between gap-3">
							<div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Attendance Security</p><h2 className="mt-1 text-lg font-bold text-slate-100">Your Location From Shop</h2></div>
							<div className={`hidden sm:flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${locationReady ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300' : 'border-amber-400/25 bg-amber-400/10 text-amber-300'}`}><span className={`h-2 w-2 rounded-full ${locationReady ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />{locationReady ? 'Location Verified' : 'Location Restricted'}</div>
						</div>
						<div className="grid gap-3 grid-cols-2">
							<div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.04] p-4"><div className="flex items-center gap-2 text-emerald-300"><MdLocationOn size={20} /><span className="text-xs uppercase tracking-wider text-slate-500">Accuracy</span></div><p className="mt-2 sm:text-2xl font-bold">{accuracy || '--'} <span className="text-sm font-medium text-slate-500">m</span></p></div>
							<div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.04] p-4"><div className="flex items-center gap-2 text-cyan-300"><MdDirectionsWalk size={20} /><span className="text-xs uppercase tracking-wider text-slate-500">Distance</span></div><p className="mt-2 sm:text-2xl font-bold">{distance || '--'} <span className="text-sm font-medium text-slate-500">m</span></p></div>
						</div>
					</div>
					<div className="flex min-h-[190px] items-center justify-center rounded-3xl border border-violet-400/10 bg-violet-400/[0.035] px-5 shadow-xl backdrop-blur-xl"><Clock /></div>
				</section>

				{/* Today's overview */}
				<section className="hidden sm:grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
					{[
						['Worked Today', `${todayWorkedHours}h ${todayWorkedRemainder}m`, <MdAccessTime />, 'emerald'],
						['Today Earned', `৳ ${todayEarnedUI.toFixed(2)}`, <MdPayments />, 'cyan'],
						['Total Worked', `${total_working_hour || 0}h ${total_working_minute || 0}m`, <MdTrendingUp />, 'violet'],
						['Available Balance', `৳ ${Number(available_balance || 0).toFixed(2)}`, <MdAccountBalanceWallet />, 'emerald']
					].map(([label, value, icon, tone]) => <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 shadow-lg backdrop-blur-xl"><div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${tone === 'emerald' ? 'bg-emerald-400/10 text-emerald-300' : tone === 'cyan' ? 'bg-cyan-400/10 text-cyan-300' : 'bg-violet-400/10 text-violet-300'}`}>{icon}</div><p className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p><p className="mt-1 text-xl font-bold text-slate-100">{value}</p></div>)}
				</section>

				{/* Progress */}
				<section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-xl backdrop-blur-xl">
					<div className="mb-3 flex items-center justify-between"><div><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Daily Progress</p><p className="mt-1 font-semibold text-slate-200">{progress}% of 12-hour target</p></div><span className="text-sm font-bold text-emerald-300">{todayWorkedHours}h {todayWorkedRemainder}m</span></div>
					<div className="h-2.5 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 transition-all duration-700" style={{ width: `${progress}%` }} /></div>
				</section>

				{/* Attendance actions */}
				<section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl backdrop-blur-xl sm:p-7">
					<div className="mb-6 text-center"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Today's Attendance</p><h2 className="mt-1 text-xl font-bold text-slate-100">Shift Control</h2><p className="mt-1 text-sm text-slate-500">Use the controls in sequence to record your working hours.</p></div>
					<div className="flex flex-wrap items-center justify-center gap-5">
						{actionButton('Enter 1', <MdCheckCircle />, !isAllowed || !!today_enter1_time || additional_movement_status, () => handleTodayTime('today_enter1_time', _id), 'emerald')}
						{actionButton('Exit 1', <MdPendingActions />, !isAllowed || !!today_exit1_time || today_enter1_time === '' || additional_movement_status, () => handleTodayTime('today_exit1_time', _id), 'cyan')}
						{actionButton('Enter 2', <MdCheckCircle />, !isAllowed || !!today_enter2_time || today_exit1_time === '' || additional_movement_status, () => handleTodayTime('today_enter2_time', _id), 'violet')}
						{actionButton('Exit 2', <MdPendingActions />, !isAllowed || !!today_exit2_time || today_enter2_time === '' || additional_movement_status, () => handleTodayTime('today_exit2_time', _id), 'emerald')}
					</div>

					<div className="mt-8 flex flex-col items-center gap-3">
						{!additional_movement_status && <button onClick={() => handleAdditionalMovementRequest(name, uid)} disabled={!accuracy || !distance || locationLoading || today_enter1_time === ''} className="flex items-center gap-2 rounded-xl border border-violet-400/20 bg-violet-400/10 px-5 py-2.5 text-sm font-semibold text-violet-200 shadow-lg shadow-violet-500/10 transition hover:bg-violet-400/20 disabled:cursor-not-allowed disabled:opacity-40"><MdDirectionsWalk /> Request For Additional Movement</button>}
						{additional_movement_status && <div className="flex flex-wrap justify-center gap-5">{actionButton('Exit', <MdDirectionsWalk />, !isAllowed || !!additional_exit_time, () => handleAdditionalTime('additional_exit_time', _id), 'violet')}{actionButton('Enter', <MdDirectionsWalk />, !isAllowed || !!additional_enter_time || additional_exit_time === '', () => handleAdditionalTime('additional_enter_time', _id), 'cyan')}</div>}
					</div>
				</section>

				{/* Today's timeline */}
				<section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] shadow-2xl backdrop-blur-xl">
					<div className="border-b border-white/10 px-5 py-4"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Attendance Timeline</p><h2 className="mt-1 text-lg font-bold">{currentDayName} · {currentDate}</h2></div>
					<div className="overflow-x-auto p-5">
						<table className="w-full min-w-[760px] text-left text-sm">
							<thead className="bg-white/[0.025] text-xs uppercase tracking-wider text-slate-500"><tr>{['Date', 'Day', 'Enter 1', 'Exit 1', 'Enter 2', 'Exit 2'].map(h => <th key={h} className="px-5 py-4 font-semibold">{h}</th>)}</tr></thead>
							<tbody><tr className="border-t border-white/10 text-slate-300">{[
								currentDate, currentDayName, ['today_enter1_time', today_enter1_time, enter1ref, editEnter1Time], ['today_exit1_time', today_exit1_time, exit1ref, editExit1Time], ['today_enter2_time', today_enter2_time, enter2ref, editEnter2Time], ['today_exit2_time', today_exit2_time, exit2ref, editExit2Time]
							].map((cell, i) => i < 2 ? <td key={i} className="px-5 py-5 font-medium">{cell}</td> : <td key={cell[0]} className="px-5 py-5"><div className="flex min-w-[100px] items-center gap-2">{cell[3] ? <input ref={cell[2]} defaultValue={cell[1]} type="text" className="w-full rounded-lg border border-emerald-400/20 bg-black/20 px-2 py-1 text-sm text-slate-100 outline-none" /> : <span className="font-semibold text-slate-200">{cell[1] || '—'}</span>}<MdEdit onClick={() => handleEditTime(cell[0])} className={`shrink-0 cursor-pointer text-slate-500 transition hover:text-emerald-300 ${user_category !== 'admin' && user?.uid === uid ? 'hidden' : 'block'} ${cell[3] ? 'text-emerald-300' : ''}`} /></div></td>)} </tr></tbody>
						</table>
					</div>
				</section>

				{/* Additional movement record */}
				{additional_movement_status && <section className="overflow-hidden rounded-3xl border border-violet-400/15 bg-violet-400/[0.035] shadow-xl"><div className="border-b border-violet-400/10 px-5 py-4"><p className="text-xs uppercase tracking-[0.18em] text-violet-300/70">Additional Movement</p><h2 className="mt-1 font-bold">Active movement record</h2></div><div className="overflow-x-auto p-5"><table className="w-full min-w-[520px] text-sm"><thead className="text-xs uppercase tracking-wider text-slate-500"><tr>{['Date', 'Day', 'Exit', 'Enter'].map(h => <th key={h} className="px-5 py-4 text-left">{h}</th>)}</tr></thead><tbody><tr className="border-t border-white/10 text-slate-300"><td className="px-5 py-4">{currentDate}</td><td className="px-5 py-4">{currentDayName}</td><td className="px-5 py-4">{additional_exit_time || '—'}</td><td className="px-5 py-4">{additional_enter_time || '—'}</td></tr></tbody></table></div></section>}

				{/* Footer actions */}
				<div className="flex flex-wrap items-center justify-center gap-3 pb-6">
					<button onClick={() => handleChangeTime(_id)} disabled={!isEnableEdit} className={`${isAdmin ? 'flex' : 'hidden'} items-center gap-2 rounded-xl border border-violet-400/25 bg-violet-400/10 px-5 py-2.5 text-sm font-semibold text-violet-200 transition hover:bg-violet-400/20 disabled:cursor-not-allowed disabled:opacity-30`}><MdEdit /> Submit Edited Time</button>
					<button onClick={() => handleSubmitWorkTime(uid)} disabled={!workSubmitButton} className="flex items-center gap-2 rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-5 py-2.5 text-sm font-semibold text-emerald-200 shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-30"><MdCheckCircle /> Submit Your Work Time</button>
				</div>
			</div>
		</div>
	)
};

export default Staffs;
