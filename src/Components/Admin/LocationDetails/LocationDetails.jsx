import React, { useState } from 'react';
import Loading from '../../Shared/Loading/Loading';
// import { data } from 'react-router-dom';

const LocationDetails = () => {
	const [accuracy, setAccuracy] = useState('');
	const [lat, setLat] = useState('')
	const [lan, setLan] = useState('')
	const [distance, setDistance] = useState('')
	const [currentLocation, setCurrentLocation] = useState({});
	const [locationLoading, setLocationLoading] = useState(false);



	const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
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
	const handleLocation = () => {
		setLocationLoading(true);
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

						setLat(latitude);
						setLan(longitude);
						setAccuracy(accuracy);
						setDistance(distance)
						setLocationLoading(false);

					}
				)
			})
	}

	if (locationLoading) {
		return <Loading></Loading>
	}
	return (
		<div className='w-full h-full lg:p-5 flex flex-col text-pink-200 scrollbar-hide'>
			<h1 className='font-semibold text-2xl mb-10 text-pink-300'>Location Details</h1>
			<div className='text-pink-200 text-xl font-semibold flex flex-col gap-5 mb-7'>
				<h1>Lan: {lan}</h1>
				<h1>Lat: {lat}</h1>
				<h1>Accuracy: {accuracy} meters</h1>
				<h1>Distance: {distance} meters</h1>
				<h1>Current Location: lan: {currentLocation.longitude}, lat: {currentLocation.latitude}</h1>
			</div>
			<div className='flex items-center justify-center'>
				<button onClick={handleLocation} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold'>Show Location details</button>
			</div>
		</div>
	);
};

export default LocationDetails;