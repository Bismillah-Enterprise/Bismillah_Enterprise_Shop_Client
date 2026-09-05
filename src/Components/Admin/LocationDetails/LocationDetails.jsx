import React, { useState } from 'react';
import Loading from '../../Shared/Loading/Loading';

const LocationDetails = () => {
	const [accuracy, setAccuracy] = useState('');
	const [lat, setLat] = useState('');
	const [lan, setLan] = useState('');
	const [distance, setDistance] = useState('');
	const [currentLocation, setCurrentLocation] = useState({});
	const [locationLoading, setLocationLoading] = useState(false);
	const [error, setError] = useState('');

	const getDistanceFromLatLonInMeters = (
		lat1,
		lon1,
		lat2,
		lon2
	) => {
		const R = 6371000;

		const dLat = ((lat2 - lat1) * Math.PI) / 180;
		const dLon = ((lon2 - lon1) * Math.PI) / 180;

		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos((lat1 * Math.PI) / 180) *
			Math.cos((lat2 * Math.PI) / 180) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);

		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		return R * c;
	};

	const handleLocation = async () => {
		setLocationLoading(true);
		setError('');

		try {
			const response = await fetch(
				'http://localhost:5000/shop_location'
			);

			if (!response.ok) {
				throw new Error('Unable to load shop location.');
			}

			const currentLocationData = await response.json();

			setCurrentLocation(currentLocationData);

			if (!navigator.geolocation) {
				throw new Error(
					'Geolocation is not supported by this browser.'
				);
			}

			navigator.geolocation.getCurrentPosition(
				(position) => {
					const {
						latitude,
						longitude,
						accuracy: gpsAccuracy,
					} = position.coords;

					const calculatedDistance =
						getDistanceFromLatLonInMeters(
							latitude,
							longitude,
							Number(currentLocationData.latitude),
							Number(currentLocationData.longitude)
						);

					setLat(latitude);
					setLan(longitude);
					setAccuracy(gpsAccuracy);
					setDistance(calculatedDistance);
					setLocationLoading(false);
				},
				() => {
					setError(
						'Unable to access your current location. Please allow location permission.'
					);
					setLocationLoading(false);
				},
				{
					enableHighAccuracy: true,
					timeout: 15000,
					maximumAge: 0,
				}
			);
		} catch (err) {
			setError(err?.message || 'Something went wrong.');
			setLocationLoading(false);
		}
	};

	if (locationLoading) {
		return <Loading />;
	}

	return (
		<div className="min-h-full pb-10 text-white">

			{/* Header */}
			<div className="relative overflow-hidden rounded-3xl border border-emerald-400/10 bg-[#0a1a17]/80 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:p-8">

				<div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
				<div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

				<div className="relative z-10">
					<div className="flex items-center gap-3">
						<div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-xl">
							◎
						</div>

						<div>
							<p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-400/70">
								GPS Monitor
							</p>

							<h1 className="text-2xl font-bold text-white">
								Location Details
							</h1>
						</div>
					</div>

					<p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">
						Check your current GPS position, accuracy and distance
						from the registered shop location.
					</p>
				</div>
			</div>

			{/* Error */}
			{error && (
				<div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-400/5 px-5 py-4 text-sm text-rose-300">
					{error}
				</div>
			)}

			{/* Location cards */}
			<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

				<div className="rounded-2xl border border-cyan-400/10 bg-[#081714]/80 p-5 backdrop-blur-xl">
					<p className="text-xs uppercase tracking-wider text-slate-500">
						Latitude
					</p>
					<p className="mt-2 break-all text-lg font-bold text-cyan-300">
						{lat || '—'}
					</p>
				</div>

				<div className="rounded-2xl border border-emerald-400/10 bg-[#081714]/80 p-5 backdrop-blur-xl">
					<p className="text-xs uppercase tracking-wider text-slate-500">
						Longitude
					</p>
					<p className="mt-2 break-all text-lg font-bold text-emerald-300">
						{lan || '—'}
					</p>
				</div>

				<div className="rounded-2xl border border-violet-400/10 bg-[#081714]/80 p-5 backdrop-blur-xl">
					<p className="text-xs uppercase tracking-wider text-slate-500">
						GPS Accuracy
					</p>
					<p className="mt-2 text-lg font-bold text-violet-300">
						{accuracy ? `${Number(accuracy).toFixed(2)} m` : '—'}
					</p>
				</div>

				<div className="rounded-2xl border border-amber-400/10 bg-[#081714]/80 p-5 backdrop-blur-xl">
					<p className="text-xs uppercase tracking-wider text-slate-500">
						Distance
					</p>
					<p className="mt-2 text-lg font-bold text-amber-300">
						{distance
							? `${Number(distance).toFixed(2)} m`
							: '—'}
					</p>
				</div>

			</div>

			{/* Registered location */}
			<div className="mt-5 rounded-3xl border border-emerald-400/10 bg-[#081714]/80 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl">

				<div className="flex items-center justify-between gap-4">
					<div>
						<p className="text-xs uppercase tracking-wider text-slate-500">
							Registered Shop Location
						</p>

						<p className="mt-1 text-sm font-semibold text-white">
							Server Location
						</p>
					</div>

					<span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
						Registered
					</span>
				</div>

				<div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div className="rounded-2xl bg-white/[0.025] p-4">
						<p className="text-xs text-slate-500">Latitude</p>
						<p className="mt-1 font-semibold text-slate-200">
							{currentLocation?.latitude || '—'}
						</p>
					</div>

					<div className="rounded-2xl bg-white/[0.025] p-4">
						<p className="text-xs text-slate-500">Longitude</p>
						<p className="mt-1 font-semibold text-slate-200">
							{currentLocation?.longitude || '—'}
						</p>
					</div>
				</div>
			</div>

			{/* Action */}
			<div className="mt-7 flex justify-center">
				<button
					onClick={handleLocation}
					className="group flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 px-7 py-3 font-semibold text-emerald-200 transition-all duration-300 hover:border-emerald-300/40 hover:shadow-[0_0_35px_rgba(16,185,129,0.15)]"
				>
					<span className="text-lg transition-transform duration-300 group-hover:scale-110">
						◎
					</span>
					Check My Location
				</button>
			</div>
		</div>
	);
};

export default LocationDetails;