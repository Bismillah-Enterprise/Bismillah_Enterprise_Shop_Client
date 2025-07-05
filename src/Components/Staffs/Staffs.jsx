import React, { useContext, useEffect, useState } from 'react';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Providers/AuthProvider';
import Loading from '../Shared/Loading/Loading';
import useCurrentUser from '../Hooks/useCurrentUser';
import Swal from 'sweetalert2'; // assuming you're using this

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

const Staffs = () => {
	const { user } = useContext(AuthContext);
	const [, , isAdmin, userHookLoading] = useCurrentUser();
	const staff = useLoaderData();
	const { _id, name, hour_rate, today_enter1_time, today_exit1_time, today_enter2_time, today_exit2_time, uid } = staff;
	const [isAllowed, setIsAllowed] = useState(false);
	const [accuracy, setAccuracy] = useState('');
	const [lat, setLat] = useState('')
	const [lan, setLan] = useState('')
	const [distance, setDistance] = useState('')
	const [currentLocation, setCurrentLocation] = useState({});
	const [locationLoading, setLocationLoading] = useState(false);
	const navigate = useNavigate();

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

						if(distance > 50 && accuracy > 100) {
							setIsAllowed(false)
							setLocationLoading(false);
							console.log('no')
						}
						else {
							setIsAllowed(true);
							setLocationLoading(false)
							console.log('yes')
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

	const handleTodayTime = (name, id) => {
		const updatedTime = { name, clickedTime: Time };
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
				navigate(`/staff/uid_query/${uid}`)
			});
	};
	console.log(userHookLoading);
	console.log(locationLoading);
	if (userHookLoading || locationLoading) {
		return (
			<div className="h-full rounded-2xl overflow-hidden">
				<Loading />
			</div>
		);
	}

	return (
		<div className="px-5">
			<div>
				{user && (
					<div className="flex items-center justify-center gap-5 mb-10">
						<Link to={'/'} state={{ from: '/' }}>
							<button className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md md:text-lg font-semibold">
								Home
							</button>
						</Link>
						{isAdmin && (
							<Link to="/admin" state={{ from: '/' }}>
								<button className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md md:text-lg font-semibold">
									Admin
								</button>
							</Link>
						)}
					</div>
				)}
				<h1 className='text-pink-200 text-md md:text-xl text-center mb-2 font-semibold'>Your Location From Shop</h1>
				<div className='flex items-center justify-center gap-5 text-pink-200 text-md md:text-xl'>
					<h1>Accuracy: {accuracy} meters</h1>
					<h1>Distance: {distance} meters</h1>
				</div>
				<div>
					<h1 className="text-lg md:text-2xl text-center text-pink-200 mt-5 font-semibold">
						{name} - Hour Rate: {hour_rate}
					</h1>
				</div>

				<div className="flex items-center gap-5 md:gap-10 justify-center mt-10 flex-wrap">
					<button
						disabled={!!today_enter1_time || !isAllowed}
						onClick={() => handleTodayTime('today_enter1_time', _id)}
						className="disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-60 rounded-full h-[70px] md:h-[100px] w-[70px] md:w-[100px] shadow-md shadow-pink-200 border-none text-pink-200 text-md md:text-lg cursor-pointer hover:shadow-lg"
					>
						Enter 1
					</button>
					<button
						disabled={!!today_exit1_time || !isAllowed}
						onClick={() => handleTodayTime('today_exit1_time', _id)}
						className="disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-60 rounded-full h-[70px] md:h-[100px] w-[70px] md:w-[100px] shadow-md shadow-pink-200 border-none text-pink-200 text-md md:text-lg cursor-pointer hover:shadow-lg"
					>
						Exit 1
					</button>
					<button
						disabled={!!today_enter2_time || !isAllowed}
						onClick={() => handleTodayTime('today_enter2_time', _id)}
						className="disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-60 rounded-full h-[70px] md:h-[100px] w-[70px] md:w-[100px] shadow-md shadow-pink-200 border-none text-pink-200 text-md md:text-lg cursor-pointer hover:shadow-lg"
					>
						Enter 2
					</button>
					<button
						disabled={!!today_exit2_time || !isAllowed}
						onClick={() => handleTodayTime('today_exit2_time', _id)}
						className="disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-60 rounded-full h-[70px] md:h-[100px] w-[70px] md:w-[100px] shadow-md shadow-pink-200 border-none text-pink-200 text-md md:text-lg cursor-pointer hover:shadow-lg"
					>
						Exit 2
					</button>
				</div>
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
			</div>
		</div>
	);
};

export default Staffs;
