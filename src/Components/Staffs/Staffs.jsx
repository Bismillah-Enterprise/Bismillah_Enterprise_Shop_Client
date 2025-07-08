import React, { useContext, useEffect, useState } from 'react';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Providers/AuthProvider';
import Loading from '../Shared/Loading/Loading';
import useCurrentUser from '../Hooks/useCurrentUser';
import Swal from 'sweetalert2'; // assuming you're using this
import { PuffLoader } from 'react-spinners';
import Clock from '../Clock/Clock';

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

function calculateTotalWorkTime({
	today_enter1_time,
	today_exit1_time,
	today_enter2_time,
	today_exit2_time
}) {
	let totalMilliseconds = 0;

	const enter1 = parseTimeToDate(today_enter1_time);
	const exit1 = parseTimeToDate(today_exit1_time);
	console.log(enter1, enter2)
	if (enter1 && exit1) {
		totalMilliseconds += exit1 - enter1
		console.log(totalMilliseconds);
	};

	const enter2 = parseTimeToDate(today_enter2_time);
	const exit2 = parseTimeToDate(today_exit2_time);
	console.log(enter2, exit2)
	if (enter2 && exit2) {
		totalMilliseconds += exit2 - enter2
		console.log(totalMilliseconds)
	};

	if (totalMilliseconds <= 0) return '0 hr 0 min';

	const totalMinutes = Math.floor(totalMilliseconds / 60000);
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;

	return `${hours} hr ${minutes} min`;
}

const Staffs = () => {
	const { user } = useContext(AuthContext);
	const [, , isAdmin, userHookLoading] = useCurrentUser();
	const staff = useLoaderData();
	const { _id, name, hour_rate, today_enter1_time, today_exit1_time, today_enter2_time, today_exit2_time, uid, user_category, total_working_hour, total_income, total_working_minute, additional_movement_status, additional_enter_time, additional_exit_time, additional_movement_hour, additional_movement_minute } = staff;
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
	console.log(location);
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

		fetch(`https://shop-manager-server.onrender.com/staff/uid_query/${uid}`)
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
						total_income: updatedEarn
					};

					// Save to database
					fetch(`https://shop-manager-server.onrender.com/submit_work_time/${_id}`, {
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
		if (userHookLoading || !user) return;

		if (isAdmin) {
			setIsAllowed(true);  // Admin bypasses location check
			return;
		}

		// Then do the location fetch here...
	}, [user, isAdmin, userHookLoading]);

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
		console.log(workSubmitButton);
	}, [user, staff])

	useEffect(() => {
		setLocationLoading(true);
		fetch('https://shop-manager-server.onrender.com/shop_location')
			.then(res => res.json())
			.then(currentLocationData => {
				setCurrentLocation(currentLocationData);
				console.log(currentLocationData)
				navigator.geolocation.getCurrentPosition(
					(position) => {
						const { latitude, longitude, accuracy } = position.coords;

						const distance = getDistanceFromLatLonInMeters(
							latitude,
							longitude,
							currentLocationData.latitude,
							currentLocationData.longitude
						);
						if (accuracy <= 100 && distance <= currentLocationData?.shop_range) {
							setIsAllowed(true)
							setLocationLoading(false);
						}
						else {
							setIsAllowed(false);
							setLocationLoading(false)
						}

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
				fetch(`https://shop-manager-server.onrender.com/staffs_daily_time/${id}`, {
					method: 'PUT',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify(updatedTime),
				})
					.then((res) => res.json())
					.then((data) => {
						console.log(data);
						Swal.fire({
							position: 'center',
							icon: 'success',
							title: 'saved time',
							showConfirmButton: false,
							timer: 1000,
						});
						if (name === 'today_enter1_time') {
							setWorkSubmitButton(false);
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
				fetch(`https://shop-manager-server.onrender.com/additional_movement_request`, {
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
				await fetch(`https://shop-manager-server.onrender.com/additional_movements/${id}`, {
					method: 'PUT',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify(updatedTime),
				})
					.then((res) => res.json())
					.then(async (data) => {
						console.log(name)
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
							console.log(additional_exit_time, Time)
							const exit = parseTime(additional_exit_time);
							const enter = parseTime(Time);
							console.log(exit, enter);
							if (exit !== null && enter !== null && enter > exit) {
								totalMinutes += enter - exit;
							}
							console.log(totalMinutes);

							const previousAdditionalTotalMinutes = (additional_movement_hour || 0) * 60 + (additional_movement_minute || 0);
							console.log(previousAdditionalTotalMinutes);
							const updatedAdditionalTotalMinutes = previousAdditionalTotalMinutes + totalMinutes;
							console.log(updatedAdditionalTotalMinutes)
							const updatedAdditionalTotalHours = Math.floor(updatedAdditionalTotalMinutes / 60);
							console.log(updatedAdditionalTotalHours)
							const updatedAdditionalTotalMinutesRemainder = updatedAdditionalTotalMinutes % 60;
							console.log(updatedAdditionalTotalMinutesRemainder)

							const AdditionalMovementSummary = {
								additional_movement_hour: updatedAdditionalTotalHours,
								additional_movement_minute: updatedAdditionalTotalMinutesRemainder,
							};
							console.log(AdditionalMovementSummary);
							await fetch(`https://shop-manager-server.onrender.com/additional_movement_submit/${_id}`, {
								method: 'PUT',
								headers: {
									'content-type': 'application/json'
								},
								body: JSON.stringify(AdditionalMovementSummary)
							})
								.then(res => res.json())
								.then(async (sentDataToStuffProfile) => {
									if (sentDataToStuffProfile.acknowledged) {
										await fetch(`https://shop-manager-server.onrender.com/additional_request_approve/${uid}`, {
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


	const handleSubmitWorkTime = () => {
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
				// Helper to parse time
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

				if (additional_movement_hour || additional_movement_minute) {
					console.log(totalMinutes)
					totalMinutes = totalMinutes - (additional_movement_hour*60) - additional_movement_minute;
					console.log(totalMinutes)
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

				const previousEarn = parseFloat(total_income || 0);
				const updatedEarn = parseFloat((previousEarn + today_earned).toFixed(2));

				const TodaySummary = {
					currentDate,
					currentDayName,
					today_enter1_time,
					today_exit1_time,
					today_enter2_time,
					today_exit2_time,
					total_hour: today_hours,
					total_minute: today_minutes,
					total_earn: today_earned,
					additional_movement_hour,
					additional_movement_minute,
					total_working_hour: updatedTotalHours,
					total_working_minute: updatedTotalMinutesRemainder,
					total_income: updatedEarn
				};

				// Save to database
				fetch(`https://shop-manager-server.onrender.com/submit_work_time/${_id}`, {
					method: 'PUT',
					headers: {
						'content-type': 'application/json'
					},
					body: JSON.stringify(TodaySummary)
				})
					.then(res => res.json())
					.then(sentDataToStuffProfile => {
						if (sentDataToStuffProfile.acknowledged) {
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

	if (userHookLoading || locationLoading || dateCheckLoading) {
		return (
			<div className="h-full rounded-2xl overflow-hidden">
				<Loading />
			</div>
		);
	}
	return (
		<div className="px-5">
			<div>
				<div className="flex items-center justify-center gap-5 mb-10">
					{user ?
						<Link to={'/'} state={{ from: location }}>
							<button className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md md:text-lg font-semibold">
								Home
							</button>
						</Link> : ''
					}
					{
						user_category === 'admin' ?
							<div className='flex items-center gap-5'>
								<Link to={'/admin'} state={{ from: '/' }}>
									<button className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md md:text-lg font-semibold">
										Admin
									</button>
								</Link>
								<Link to={from} state={{ from: location.pathname }}>
									<button className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md md:text-lg font-semibold">
										Back
									</button>
								</Link>
							</div> : ''
					}
				</div>
				<h1 className='text-pink-200 text-md md:text-xl text-center mb-2 font-semibold'>Your Location From Shop</h1>
				{
					!accuracy && !distance ? <div className='flex justify-center'><PuffLoader color='#fccee8' size={40} /></div> :
						<div className='flex items-center justify-center gap-5 text-pink-200 text-md md:text-xl'>
							<h1>Accuracy: {accuracy} meters</h1>
							<h1>Distance: {distance} meters</h1>
						</div>
				}
				<div>
					<Clock></Clock>
				</div>
				<div>
					<h1 className="text-lg md:text-2xl text-center text-pink-200 mt-5 font-semibold">
						{name} - Hour Rate: {hour_rate}
					</h1>
				</div>

				{
					!accuracy && !distance ? <div className='flex justify-center mt-10'><PuffLoader color='#fccee8' size={40} /></div> :
						<div>
							<div className="flex items-center gap-5 md:gap-10 justify-center mt-10 flex-wrap">
								<button
									disabled={!!today_enter1_time || !isAllowed || additional_movement_status}
									onClick={() => handleTodayTime('today_enter1_time', _id)}
									className="disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-60 rounded-full h-[70px] md:h-[100px] w-[70px] md:w-[100px] shadow-md shadow-pink-200 border-none text-pink-200 text-md md:text-lg cursor-pointer hover:shadow-lg"
								>
									Enter 1
								</button>
								<button
									disabled={!!today_exit1_time || !isAllowed || additional_movement_status || today_enter1_time === ''}
									onClick={() => handleTodayTime('today_exit1_time', _id)}
									className="disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-60 rounded-full h-[70px] md:h-[100px] w-[70px] md:w-[100px] shadow-md shadow-pink-200 border-none text-pink-200 text-md md:text-lg cursor-pointer hover:shadow-lg"
								>
									Exit 1
								</button>
								<button
									disabled={!!today_enter2_time || !isAllowed || additional_movement_status || today_exit1_time === ''}
									onClick={() => handleTodayTime('today_enter2_time', _id)}
									className="disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-60 rounded-full h-[70px] md:h-[100px] w-[70px] md:w-[100px] shadow-md shadow-pink-200 border-none text-pink-200 text-md md:text-lg cursor-pointer hover:shadow-lg"
								>
									Enter 2
								</button>
								<button
									disabled={!!today_exit2_time || !isAllowed || additional_movement_status || today_enter2_time === ''}
									onClick={() => handleTodayTime('today_exit2_time', _id)}
									className="disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-60 rounded-full h-[70px] md:h-[100px] w-[70px] md:w-[100px] shadow-md shadow-pink-200 border-none text-pink-200 text-md md:text-lg cursor-pointer hover:shadow-lg"
								>
									Exit 2
								</button>
							</div>
							<div className='mt-10'>
								<div className={`${additional_movement_status ? 'hidden' : 'flex'} items-center justify-center`}>
									<button onClick={() => { handleAdditionalMovementRequest(name, uid) }} disabled={today_enter1_time === ''} className="disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-60 text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md md:text-lg font-semibold">Request For Additional Movement</button>
								</div>
								<div className={`${additional_movement_status ? 'flex' : 'hidden'} items-center gap-5 md:gap-10 justify-center flex-wrap`}>

									<button
										disabled={!!additional_exit_time || !isAllowed}
										onClick={() => handleAdditionalTime('additional_exit_time', _id)}
										className="disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-60 rounded-full h-[70px] md:h-[100px] w-[70px] md:w-[100px] shadow-md shadow-pink-200 border-none text-pink-200 text-md md:text-lg cursor-pointer hover:shadow-lg"
									>
										Exit
									</button>
									<button
										disabled={!!additional_enter_time || !isAllowed || additional_exit_time === ''}
										onClick={() => handleAdditionalTime('additional_enter_time', _id)}
										className="disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-60 rounded-full h-[70px] md:h-[100px] w-[70px] md:w-[100px] shadow-md shadow-pink-200 border-none text-pink-200 text-md md:text-lg cursor-pointer hover:shadow-lg"
									>
										Enter
									</button>
								</div>
								<div className={`${additional_movement_status ? 'flex' : 'hidden'} items-center sm:justify-center mt-8 md:mt-10 overflow-x-scroll sm:overflow-x-hidden overflow-y-hidden scrollbar-hide text-xs md:text-lg`}>
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
				<div className="flex items-center sm:justify-center mt-8 md:mt-10 overflow-x-scroll sm:overflow-x-hidden overflow-y-hidden scrollbar-hide text-xs md:text-lg">
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
								<td id="enter1_time">{today_enter1_time}</td>
								<td id="exit1_time">{today_exit1_time}</td>
								<td id="enter2_time">{today_enter2_time}</td>
								<td id="exit2_time">{today_exit2_time}</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div className='flex flex-col gap-10 items-center justify-center mt-5'>
					<button onClick={handleSubmitWorkTime} disabled={!workSubmitButton} className="disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-60 text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md md:text-lg font-semibold">
						Submit Your Work Time
					</button>
					<Link to={`/monthly_records/${uid}`} state={{ pathname: location.pathname }} className="disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-60 text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md md:text-lg font-semibold">
						See Your Montly Records
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Staffs;
