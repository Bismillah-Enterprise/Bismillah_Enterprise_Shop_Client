import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Providers/AuthProvider';
import Loading from '../Shared/Loading/Loading';
import useCurrentUser from '../Hooks/useCurrentUser';
import Swal from 'sweetalert2'; // assuming you're using this
import { PuffLoader } from 'react-spinners';
import Clock from '../Clock/Clock';
import { MdEdit } from 'react-icons/md';

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
		fetch(`https://bismillah-enterprise-server.onrender.com/staff_bonus`)
			.then(bonusRes => bonusRes.json())
			.then(bonusData => {
				if (bonusData.date !== currentDate) {
					fetch(`https://bismillah-enterprise-server.onrender.com/staff_bonus`, {
						method: 'PUT',
						headers: { 'content-type': 'application/json' },
						body: JSON.stringify({ entry_type: 'new day', date: currentDate }),
					}).then(firstEntryRes => firstEntryRes.json()).then(firstEntryData => {
						if (firstEntryData.acknowledged) {
						}
					})
				}
			})
	}, [])

	useEffect(() => {
		setDateCheckLoading(true);
		const todayFullDate = new Date();
		const todayOnlyDate = todayFullDate.toLocaleDateString('en-BD', { day: 'numeric' });
		const todayOnlyDateIntFormat = parseInt(todayOnlyDate);

		const parseTime = (timeStr) => {
			if (!timeStr) return null;
			const [time, modifier] = timeStr.split(' ');
			let [hours, minutes] = time.split(':').map(Number);
			if (modifier === 'PM' && hours !== 12) hours += 12;
			if (modifier === 'AM' && hours === 12) hours = 0;
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

		const today_hours = Math.floor(totalMinutes / 60);
		const today_minutes = totalMinutes % 60;

		const todayDecimal = totalMinutes / 60;
		const today_earned = parseFloat((todayDecimal * hour_rate).toFixed(2));

		// Add today’s work to previous total from staff data
		const previousTotalMinutes = (total_working_hour || 0) * 60 + (total_working_minute || 0);
		const updatedTotalMinutes = previousTotalMinutes + totalMinutes;
		const updatedTotalHours = Math.floor(updatedTotalMinutes / 60);
		const updatedTotalMinutesRemainder = updatedTotalMinutes % 60;

		const previousEarn = parseFloat(staff.total_income || 0);
		const updatedEarn = parseFloat((previousEarn + today_earned).toFixed(2));

		fetch(`https://bismillah-enterprise-server.onrender.com/staff/uid_query/${uid}`)
			.then(res => res.json())
			.then(data => {
				if (data.today_date !== todayOnlyDateIntFormat) {
					const TodaySummary = {
						currentDate,
						currentDayName,
						today_enter1_time: "",
						today_exit1_time: "",
						today_enter2_time: "",
						today_exit2_time: "",
						total_hour: 0,
						total_minute: 0,
						total_earn: 0,
						total_working_hour: updatedTotalHours,
						total_working_minute: updatedTotalMinutesRemainder,
						total_income: parseFloat(updatedEarn.toFixed(2)),
						available_balance,
						additional_movement_hour,
						additional_movement_minute,
						today_bonus: 0,
						total_bonus,
						today_date: todayOnlyDateIntFormat
					};

					// Save to database
					fetch(`https://bismillah-enterprise-server.onrender.com/submit_work_time/${_id}`, {
						method: 'PUT',
						headers: {
							'content-type': 'application/json'
						},
						body: JSON.stringify(TodaySummary)
					})
						.then(res => res.json())
						.then(() => {
							setDateCheckLoading(false);
						});
				}
				else {
					setDateCheckLoading(false)
					return;
				}
			})
	}, [user])

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
		fetch('https://bismillah-enterprise-server.onrender.com/shop_location')
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
		}).then((result) => {
			if (result.isConfirmed) {
				const updatedTime = { name, clickedTime: Time, today_date: today_only_date_number };
				fetch(`https://bismillah-enterprise-server.onrender.com/staffs_daily_time/${id}`, {
					method: 'PUT',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify(updatedTime),
				})
					.then((res) => res.json())
					.then((data) => {
						Swal.fire({
							position: 'center',
							icon: 'success',
							title: 'saved time',
							showConfirmButton: false,
							timer: 1000,
						});
						if (name === 'today_enter1_time') {
							setWorkSubmitButton(false);
							fetch(`https://bismillah-enterprise-server.onrender.com/staff_bonus`)
								.then(response => response.json())
								.then(bonusData => {
									const parseTime = (timeStr) => {
										if (!timeStr) return null;
										const [time, modifier] = timeStr.split(' ');
										let [hours, minutes] = time.split(':').map(Number);
										if (modifier === 'PM' && hours !== 12) hours += 12;
										if (modifier === 'AM' && hours === 12) hours = 0;
										return hours * 60 + minutes;
									};
									if (!bonusData.first_entry.time && !bonusData.second_entry.time && parseTime(Time) < bonusData?.time) {
										fetch(`https://bismillah-enterprise-server.onrender.com/staff_bonus`, {
											method: 'PUT',
											headers: { 'content-type': 'application/json' },
											body: JSON.stringify({ entry_type: 'first entry', time: Time, uid }),
										}).then(firstEntryRes => firstEntryRes.json()).then(firstEntryData => {
											if (firstEntryData.acknowledged) {
												Swal.fire({
													position: 'center',
													icon: 'success',
													title: 'You Will Get Bonus Today',
													showConfirmButton: false,
													timer: 1000,
												});
											}
										})
									}
									if (bonusData.first_entry.time && parseTime(Time) - parseTime(bonusData.first_entry.time) < 11 && !bonusData.second_entry.time) {
										fetch(`https://bismillah-enterprise-server.onrender.com/staff_bonus`, {
											method: 'PUT',
											headers: { 'content-type': 'application/json' },
											body: JSON.stringify({ entry_type: 'second entry', time: Time, uid }),
										}).then(firstEntryRes => firstEntryRes.json()).then(firstEntryData => {
											if (firstEntryData.acknowledged) {
												Swal.fire({
													position: 'center',
													icon: 'success',
													title: 'You Will Get Bonus Today',
													showConfirmButton: false,
													timer: 1000,
												});
											}
										})
									}
								})
						}
						else if (name === 'today_exit1_time') {
							setWorkSubmitButton(true);
						}
						else if (name === 'today_enter2_time') {
							setWorkSubmitButton(false);
						}
						else {
							setWorkSubmitButton(true);
						}
						navigate(`/staff/uid_query/${uid}`)
					});
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
				fetch(`https://bismillah-enterprise-server.onrender.com/additional_movement_request`, {
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
				await fetch(`https://bismillah-enterprise-server.onrender.com/additional_movements/${id}`, {
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
							await fetch(`https://bismillah-enterprise-server.onrender.com/additional_movement_submit/${_id}`, {
								method: 'PUT',
								headers: {
									'content-type': 'application/json'
								},
								body: JSON.stringify(AdditionalMovementSummary)
							})
								.then(res => res.json())
								.then(async (sentDataToStuffProfile) => {
									if (sentDataToStuffProfile.acknowledged) {
										await fetch(`https://bismillah-enterprise-server.onrender.com/additional_request_approve/${uid}`, {
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
				let total_bonus = bonus;
				await fetch(`https://bismillah-enterprise-server.onrender.com/staff_bonus`)
					.then(bonusres => bonusres.json())
					.then(bonusdata => {
						if (bonusdata.first_entry?.uid === uid && !bonusdata.second_entry.time) {
							today_bonus = 50;
							total_bonus = bonus + 50;
							today_earned = today_earned + 50;
						}
						else if (bonusdata.first_entry?.uid === uid && bonusdata.second_entry.time) {
							today_bonus = 30;
							total_bonus = bonus + 30;
							today_earned = today_earned + 30;
						}
						else if (bonusdata.first_entry.time && bonusdata.second_entry?.uid === uid) {
							today_bonus = 20;
							total_bonus = bonus + 20;
							today_earned = today_earned + 20;
						}
						else if (!bonusdata.first_entry.time && !bonusdata.second_entry.time) {
							today_bonus = 0;
							total_bonus = 0;
						}
					})

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
					today_date: today_only_date_number
				};

				// Save to database
				fetch(`https://bismillah-enterprise-server.onrender.com/submit_work_time/${_id}`, {
					method: 'PUT',
					headers: {
						'content-type': 'application/json'
					},
					body: JSON.stringify(TodaySummary)
				})
					.then(res => res.json())
					.then(sentDataToStuffProfile => {
						if (sentDataToStuffProfile.message === 'Work time submitted successfully') {
							navigate(`/staff/uid_query/${uid}`)
							Swal.fire({
								position: 'center',
								icon: 'success',
								title: 'Work Time Submitted Successfully',
								showConfirmButton: false,
								timer: 1000,
							});
						}
					});
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
			fetch(`https://bismillah-enterprise-server.onrender.com/change_time/${id}`, {
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
			fetch(`https://bismillah-enterprise-server.onrender.com/change_time/${id}`, {
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
			fetch(`https://bismillah-enterprise-server.onrender.com/change_time/${id}`, {
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
			fetch(`https://bismillah-enterprise-server.onrender.com/change_time/${id}`, {
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
			<div className="h-full rounded-2xl overflow-hidden">
				<Loading />
			</div>
		);
	}
	return (
		<div className="">
			<div>
				<div className="flex items-center justify-center gap-5 mb-5">
					{user ?
						<div className='flex items-center justify-center gap-5 flex-wrap mt-5'>
							<Link to={'/'} state={{ from: location }}>
								<button className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
									Home
								</button>
							</Link>
							<Link to={`/monthly_records/${uid}`} className="disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-60 text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
								See Your Montly Records
							</Link>
							<Link to={`/transections_history/${uid}`} state={{ pathname: location.pathname }} className="disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-60 text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
								Transections History
							</Link>
							<Link to={`/income_history/${uid}`} className="disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-60 text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
								Income History
							</Link>
						</div>
						: ''
					}
				</div>
				{
					user?.uid !== uid || user_category === 'admin' ?
						<div className='flex items-center justify-center gap-5 mb-10'>
							<Link to={'/admin'} state={{ from: '/' }}>
								<button className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
									Admin
								</button>
							</Link>
							<Link to={from || '/admin/staff_manipulation'} state={{ from: location.pathname }}>
								<button className="hidden md:block text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
									Back
								</button>
							</Link>
						</div> : ''
				}

				<h1 className='text-pink-200 text-md lg:text-xl text-center mb-2 font-semibold'>Your Location From Shop</h1>
				{
					!isAllowed && locationLoading ? <div className='flex justify-center'><PuffLoader color='#fccee8' size={40} /></div> :
						<div className='flex items-center justify-center gap-5 text-pink-200 text-md lg:text-xl'>
							<h1>Accuracy: {accuracy} meters</h1>
							<h1>Distance: {distance} meters</h1>
						</div>
				}
				<div>
					<Clock></Clock>
				</div>
				<div>
					<h1 className="text-lg lg:text-2xl text-center text-pink-200 mt-5 font-semibold">
						{name} - Hour Rate: {hour_rate}
					</h1>
				</div>

				{
					!accuracy && !distance && !staff ? <div className='flex justify-center mt-10'><PuffLoader color='#fccee8' size={40} /></div> :
						<div>
							<div className="flex items-center gap-5 lg:gap-10 justify-center mt-10 flex-wrap">
								<button
									disabled={!isAllowed || currentDayName === 'Friday' || !!today_enter1_time || additional_movement_status}
									onClick={() => handleTodayTime('today_enter1_time', _id)}
									className="disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-60 rounded-full h-[70px] lg:h-24 w-[70px] lg:w-24 shadow-md shadow-pink-200 border-none text-pink-200 text-md lg:text-lg cursor-pointer hover:shadow-lg"
								>
									Enter 1
								</button>
								<button
									disabled={!isAllowed || currentDayName === 'Friday' || !!today_exit1_time || today_enter1_time === '' || additional_movement_status}
									onClick={() => handleTodayTime('today_exit1_time', _id)}
									className="disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-60 rounded-full h-[70px] lg:h-24 w-[70px] lg:w-24 shadow-md shadow-pink-200 border-none text-pink-200 text-md lg:text-lg cursor-pointer hover:shadow-lg"
								>
									Exit 1
								</button>
								<button
									disabled={!isAllowed || currentDayName === 'Friday' || !!today_enter2_time || today_exit1_time === '' || additional_movement_status}
									onClick={() => handleTodayTime('today_enter2_time', _id)}
									className="disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-60 rounded-full h-[70px] lg:h-24 w-[70px] lg:w-24 shadow-md shadow-pink-200 border-none text-pink-200 text-md lg:text-lg cursor-pointer hover:shadow-lg"
								>
									Enter 2
								</button>
								<button
									disabled={!isAllowed || currentDayName === 'Friday' || !!today_exit2_time || today_enter2_time === '' || additional_movement_status}
									onClick={() => handleTodayTime('today_exit2_time', _id)}
									className="disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-60 rounded-full h-[70px] lg:h-24 w-[70px] lg:w-24 shadow-md shadow-pink-200 border-none text-pink-200 text-md lg:text-lg cursor-pointer hover:shadow-lg"
								>
									Exit 2
								</button>
							</div>
							<div className='mt-10'>
								<div className={`${additional_movement_status ? 'hidden' : 'flex'} items-center justify-center`}>
									<button onClick={() => { handleAdditionalMovementRequest(name, uid) }} disabled={!accuracy || !distance || locationLoading || today_enter1_time === ''} className="disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-60 text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">Request For Additional Movement</button>
								</div>
								<div className={`${additional_movement_status ? 'flex' : 'hidden'} items-center gap-5 lg:gap-10 justify-center flex-wrap`}>

									<button
										disabled={!isAllowed || !!additional_exit_time}
										onClick={() => handleAdditionalTime('additional_exit_time', _id)}
										className="disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-60 rounded-full h-[70px] lg:h-24 w-[70px] lg:w-24 shadow-md shadow-pink-200 border-none text-pink-200 text-md lg:text-lg cursor-pointer hover:shadow-lg"
									>
										Exit
									</button>
									<button
										disabled={!isAllowed || !!additional_enter_time || additional_exit_time === ''}
										onClick={() => handleAdditionalTime('additional_enter_time', _id)}
										className="disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-60 rounded-full h-[70px] lg:h-24 w-[70px] lg:w-24 shadow-md shadow-pink-200 border-none text-pink-200 text-md lg:text-lg cursor-pointer hover:shadow-lg"
									>
										Enter
									</button>
								</div>
								<div className={`${additional_movement_status ? 'flex' : 'hidden'} items-center sm:justify-center mt-8 lg:mt-10 overflow-x-scroll sm:overflow-x-hidden overflow-y-hidden scrollbar-hide text-xs lg:text-lg`}>
									<table className="text-pink-200 min-w-[380px] sm:min-w-[70%]">
										<tbody>
											<tr>
												<th>Date</th>
												<th>Day Name</th>
												<th>Exit</th>
												<th>Enter</th>
											</tr>
											<tr>
												<td id="today_date">{currentDate}</td>
												<td id="today_day_name">{currentDayName}</td>
												<td id="exit2_time">{additional_exit_time}</td>
												<td id="enter2_time">{additional_enter_time}</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>

				}
				<div className="flex items-center justify-center mt-8 lg:mt-10 overflow-x-scroll sm:overflow-x-hidden overflow-y-hidden scrollbar-hide text-xs lg:text-lg">
					<table className="text-pink-200 min-w-[380px] sm:min-w-[70%]">
						<tbody>
							<tr>
								<th>Date</th>
								<th>Day Name</th>
								<th>Enter 1</th>
								<th>Exit 1</th>
								<th>Enter 2</th>
								<th>Exit 2</th>
							</tr>
							<tr>
								<td id="today_date">{currentDate}</td>
								<td id="today_day_name">{currentDayName}</td>
								<td id="enter1_time">
									<div className='flex items-center justify-between gap-0'>
										<div className='max-w-[100px] overflow-hidden'>
											<input ref={enter1ref} autoFocus={true} className={`${editEnter1Time ? 'block' : 'hidden'} flex-1 w-full outline-none`} defaultValue={today_enter1_time} type="text" />
										</div>
										<h1 className={`flex-1 ${editEnter1Time ? 'hidden' : 'block'}`}>{today_enter1_time}</h1>
										<MdEdit onClick={() => { handleEditTime('today_enter1_time') }} className={`text-end cursor-pointer ${isAdmin ? 'block' : 'hidden'}`} />
									</div>
								</td>
								<td id="exit1_time">
									<div className='flex items-center justify-between gap-0'>
										<div className='max-w-[100px] overflow-hidden'>
											<input ref={exit1ref} className={`${editExit1Time ? 'block' : 'hidden'} flex-1 w-full outline-none`} defaultValue={today_exit1_time} type="text" />
										</div>
										<h1 className={`flex-1 ${editExit1Time ? 'hidden' : 'block'}`}>{today_exit1_time}</h1>
										<MdEdit onClick={() => { handleEditTime('today_exit1_time') }} className={`text-end cursor-pointer ${isAdmin ? 'block' : 'hidden'}`} />
									</div>
								</td>
								<td id="enter2_time">
									<div className='flex items-center justify-between gap-0'>
										<div className='max-w-[100px] overflow-hidden'>
											<input ref={enter2ref} className={`${editEnter2Time ? 'block' : 'hidden'} flex-1 w-full outline-none`} defaultValue={today_enter2_time} type="text" />
										</div>
										<h1 className={`flex-1 ${editEnter2Time ? 'hidden' : 'block'}`}>{today_enter2_time}</h1>
										<MdEdit onClick={() => { handleEditTime('today_enter2_time') }} className={`text-end cursor-pointer ${isAdmin ? 'block' : 'hidden'}`} />
									</div>
								</td>
								<td id="exit2_time">
									<div className='flex items-center justify-between gap-0'>
										<div className='max-w-[100px] overflow-hidden'>
											<input ref={exit2ref} className={`${editExit2Time ? 'block' : 'hidden'} flex-1 w-full outline-none`} defaultValue={today_exit2_time} type="text" />
										</div>
										<h1 className={`flex-1 ${editExit2Time ? 'hidden' : 'block'}`}>{today_exit2_time}</h1>
										<MdEdit onClick={() => { handleEditTime('today_exit2_time') }} className={`text-end cursor-pointer ${isAdmin ? 'block' : 'hidden'}`} />
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div className='flex flex-col gap-10 items-center justify-center mt-5 mb-10'>
					<button onClick={() => { handleChangeTime(_id) }} disabled={!isEnableEdit} className={`${isAdmin ? 'block' : 'hidden'} disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-60 text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold`}>
						Submit Edited Time
					</button>
					<button onClick={() => { handleSubmitWorkTime(uid) }} disabled={!workSubmitButton} className="disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-60 text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
						Submit Your Work Time
					</button>
				</div>
			</div>
		</div>
	);
};

export default Staffs;
