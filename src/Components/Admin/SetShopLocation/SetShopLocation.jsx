import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Providers/AuthProvider';
import Loading from '../../Shared/Loading/Loading';
import Swal from 'sweetalert2';
import { PropagateLoader } from 'react-spinners';
import { MdLocationOn, MdMyLocation, MdOutlineCancel, MdSave } from 'react-icons/md';

const API = 'https://bismillah-enterprise-server.onrender.com';

const SetShopLocation = () => {
	const [location, setLocation] = useState({
		latitude: '',
		longitude: '',
		shop_range: 0
	});

	const { loading, setLoading } = useContext(AuthContext);

	const [locationLoading, setLocationLoading] = useState(false);
	const [saveLocationLoading, setSaveLocationLoading] = useState(false);
	const [modal, setModal] = useState(false);
	const [shopRange, setShopRange] = useState('');

	useEffect(() => {
		fetch(`${API}/shop_location`)
			.then(res => res.json())
			.then(data => {
				setLocation(data);
				setLoading(false);
			})
			.catch(() => {
				setLoading(false);
			});
	}, [setLoading]);

	const handleSetCurrentLocation = () => {
		if (!navigator.geolocation) {
			Swal.fire({
				icon: 'error',
				title: 'Geolocation Not Supported',
				background: '#0b1b18',
				color: '#fff'
			});
			return;
		}

		setLocationLoading(true);

		navigator.geolocation.getCurrentPosition(
			pos => {
				setLocation({
					latitude: pos.coords.latitude,
					longitude: pos.coords.longitude,
					shop_range: 0
				});

				setLocationLoading(false);

				Swal.fire({
					icon: 'success',
					title: 'Location Detected',
					showConfirmButton: false,
					timer: 1000,
					background: '#0b1b18',
					color: '#fff'
				});
			},
			() => {
				setLocationLoading(false);

				Swal.fire({
					icon: 'error',
					title: 'Unable To Detect Location',
					text: 'Please allow location permission.',
					background: '#0b1b18',
					color: '#fff'
				});
			},
			{
				enableHighAccuracy: true,
				timeout: 10000
			}
		);
	};

	const handleSaveLocation = async () => {
		const range = parseInt(shopRange);

		if (
			!location.latitude ||
			!location.longitude ||
			isNaN(range) ||
			range <= 0
		) {
			Swal.fire({
				icon: 'warning',
				title: 'Invalid Information',
				text: 'Please detect your location and enter a valid shop range.',
				background: '#0b1b18',
				color: '#fff'
			});
			return;
		}

		setSaveLocationLoading(true);

		try {
			const res = await fetch(`${API}/shop_location`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					latitude: location.latitude,
					longitude: location.longitude,
					shop_range: range
				})
			});

			await res.json();

			setLocation(prev => ({
				...prev,
				shop_range: range
			}));

			setModal(false);

			Swal.fire({
				icon: 'success',
				title: 'Shop Location Updated',
				showConfirmButton: false,
				timer: 1200,
				background: '#0b1b18',
				color: '#fff'
			});
		} catch {
			Swal.fire({
				icon: 'error',
				title: 'Saving Failed',
				background: '#0b1b18',
				color: '#fff'
			});
		} finally {
			setSaveLocationLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="h-full rounded-2xl overflow-hidden">
				<Loading />
			</div>
		);
	}

	return (
		<div className="min-h-full py-5 sm:py-8 text-white">
			<div className="relative overflow-hidden rounded-3xl border border-emerald-400/10 bg-[#0a1a17]/80 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl mb-7">

				<div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
				<div className="absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

				<div className="relative z-10 text-center">
					<p className="text-xs uppercase tracking-[0.25em] text-emerald-400/70">
						Security
					</p>

					<h1 className="text-2xl sm:text-3xl font-bold">
						Shop Location
					</h1>

					<p className="text-slate-400 mt-1">
						Configure your shop's geolocation and access radius.
					</p>
				</div>
			</div>

			<div className='flex justify-center'>
				<div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-emerald-400/10 bg-[#081714]/90 p-6 shadow-[0_25px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-9"
				>
					<div className="flex items-center gap-4 mb-8">
						<div className="p-3 rounded-2xl bg-emerald-400/10 border border-emerald-400/20">
							<MdLocationOn className="text-3xl text-emerald-300" />
						</div>

						<div>
							<h2 className="text-xl font-semibold">Current Shop Position</h2>
							<p className="text-sm text-slate-500">
								GPS coordinates saved for your shop
							</p>
						</div>
					</div>

					<div className="grid sm:grid-cols-2 gap-4">
						<div className="rounded-2xl border border-white/10 bg-black/10 p-4">
							<p className="text-xs text-slate-500 uppercase tracking-wider">
								Latitude
							</p>

							{locationLoading ? (
								<PropagateLoader color="#34d399" size={8} />
							) : (
								<p className="mt-2 text-emerald-300 font-mono break-all">
									{location.latitude || 'Not set'}
								</p>
							)}
						</div>

						<div className="rounded-2xl border border-white/10 bg-black/10 p-4">
							<p className="text-xs text-slate-500 uppercase tracking-wider">
								Longitude
							</p>

							{locationLoading ? (
								<PropagateLoader color="#22d3ee" size={8} />
							) : (
								<p className="mt-2 text-cyan-300 font-mono break-all">
									{location.longitude || 'Not set'}
								</p>
							)}
						</div>

						<div className="sm:col-span-2 rounded-2xl border border-white/10 bg-black/10 p-4">
							<p className="text-xs text-slate-500 uppercase tracking-wider">
								Shop Radius
							</p>

							<p className="mt-2 text-violet-300 text-xl font-bold">
								{location.shop_range || 0} meters
							</p>
						</div>
					</div>

					<div className="flex flex-col sm:flex-row gap-3 mt-7">
						<button
							onClick={handleSetCurrentLocation}
							disabled={locationLoading}
							className="flex-1 flex items-center justify-center gap-2
                        px-5 py-3 rounded-xl border border-emerald-400/20
                        bg-emerald-400/5 text-emerald-300
                        hover:bg-emerald-400/10 transition disabled:opacity-50"
						>
							<MdMyLocation className="text-xl" />
							{locationLoading ? 'Detecting...' : 'Use Current Location'}
						</button>

						<button
							onClick={() => setModal(true)}
							className="flex-1 flex items-center justify-center gap-2
                        px-5 py-3 rounded-xl
                        bg-gradient-to-r from-emerald-500 to-cyan-500
                        hover:from-emerald-400 hover:to-cyan-400
                        font-semibold shadow-lg shadow-emerald-500/20 transition"
						>
							<MdSave className="text-xl" />
							Save Location
						</button>
					</div>
				</div>
			</div>

			{modal && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
					<div
						onClick={() => !saveLocationLoading && setModal(false)}
						className="absolute inset-0 bg-black/70 backdrop-blur-sm"
					/>

					<div className="relative w-full max-w-md rounded-3xl overflow-hidden
                        border border-emerald-400/20 bg-[#0b1b18]
                        shadow-2xl shadow-emerald-500/10"
					>
						{saveLocationLoading ? (
							<div className="h-72 flex items-center justify-center">
								<Loading />
							</div>
						) : (
							<>
								<div className="h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400" />

								<div className="flex items-center justify-between p-5 border-b border-white/10">
									<div>
										<p className="text-xs uppercase tracking-widest text-emerald-400/70">
											Location Settings
										</p>
										<h2 className="text-xl font-bold">
											Set Shop Radius
										</h2>
									</div>

									<button
										onClick={() => setModal(false)}
										className="p-2 rounded-full hover:bg-white/10"
									>
										<MdOutlineCancel className="text-2xl text-slate-400" />
									</button>
								</div>

								<div className="p-5">
									<p className="text-slate-400 text-sm mb-4">
										How many meters around your shop should be considered
										within the shop area?
									</p>

									<input
										type="number"
										min="1"
										value={shopRange}
										onChange={e => setShopRange(e.target.value)}
										placeholder="Example: 100"
										className="w-full px-4 py-3 rounded-xl bg-white/[0.04]
                                        border border-white/10 outline-none
                                        focus:border-emerald-400/50 transition"
									/>

									<button
										onClick={handleSaveLocation}
										className="w-full mt-4 py-3 rounded-xl font-semibold
                                        bg-gradient-to-r from-emerald-500 to-cyan-500
                                        hover:from-emerald-400 hover:to-cyan-400 transition"
									>
										Save Radius
									</button>
								</div>
							</>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default SetShopLocation;