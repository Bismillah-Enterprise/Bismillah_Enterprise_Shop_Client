import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Providers/AuthProvider';
import Loading from '../../Shared/Loading/Loading';
import Swal from 'sweetalert2';
import { PropagateLoader } from 'react-spinners';

const SetShopLocation = () => {
	const [location, setLocation] = useState({ latitude: '', longitude: '' });
	const { loading, setLoading } = useContext(AuthContext);
	const [locationLoading, setLocationLoading] = useState(false)

	// Fetch current shop location
	useEffect(() => {
		fetch('https://shop-manager-server.onrender.com/shop_location')
			.then((res) => res.json())
			.then((data) => {
				setLocation(data);
				setLoading(false);
			})
			.catch(() => setLoading(false));
	}, []);

	const handleSetCurrentLocation = () => {
		setLocationLoading(true)
		if (!navigator.geolocation) {
			Swal.fire({
				position: "center",
				icon: "success",
				title: "Geolocation not supported",
				showConfirmButton: false,
				timer: 1000
			});
			setLocationLoading(false);
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(pos) => {
				const { latitude, longitude } = pos.coords;
				setLocation({ latitude, longitude });
				setLocationLoading(false);
			},
			(err) => {
				Swal.fire({
					position: "center",
					icon: "success",
					title: "Failed to get current location",
					showConfirmButton: false,
					timer: 1000
				});
				setLocationLoading(false);
			}
		);
	};

	const handleSaveLocation = () => {
		fetch('https://shop-manager-server.onrender.com/shop_location', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(location),
		})
			.then((res) => res.json())
			.then(() => {
				Swal.fire({
					position: "center",
					icon: "success",
					title: "Shop Locaiton Updated",
					showConfirmButton: false,
					timer: 1000
				});
			})
			.catch(() => {
				Swal.fire({
					position: "center",
					icon: "success",
					title: "Error Saving Shop Location",
					showConfirmButton: false,
					timer: 1000
				});
			});
	};

	if (loading) return <div className='h-full rounded-2xl overflow-hidden'><Loading></Loading></div>;

	return (
		<div className="p-4 h-full">
			<h2 className="text-lg md:text-2xl text-pink-200 font-semibold text-center">Set Shop Location</h2>
			<div className='h-full flex items-center justify-center'>
				<div className="text-pink-200 shadow-lg shadow-pink-200 p-10 flex flex-col items-center justify-center mt-10 w-[350px] md:w-[500px] rounded-2xl">
					<div className='flex flex-col items-center justify-center gap-5 text-pink-200 text-md md:text-lg font-semibold mt-5'>
						{
							locationLoading ? <div className='w-fit'><PropagateLoader color='#fccee8' size={10} /></div> :
								<div className='flex items-center gap-3'>
									<label>Latitude:</label>
									<input
										className="hidden"
										type="text"
										value={location.latitude}
										onChange={(e) => setLocation({ ...location, latitude: parseFloat(e.target.value) })}
									/>

									<p>{location?.latitude}</p>
								</div>
						}
						{
							locationLoading ? <div className='w-fit'><PropagateLoader color='#fccee8' size={10} /></div> :
								<div className='flex items-center gap-3'>
									<label>Longitude:</label>
									<input
										className="hidden"
										type="text"
										value={location.longitude}
										onChange={(e) => setLocation({ ...location, longitude: parseFloat(e.target.value) })}
									/>
									{
										locationLoading ? <div><PropagateLoader color='#fccee8' /></div> :
											<p>{location?.longitude}</p>
									}
								</div>
						}
					</div>
					<div className='mt-7 flex flex-col md:flex-row items-center justify-center gap-5'>

						<button
							onClick={handleSetCurrentLocation}
							className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-3 md:px-5 py-1 rounded-md text-md md:text-lg md:font-semibold"
						>
							Use Current Location
						</button>
						<button
							onClick={handleSaveLocation}
							className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-3 md:px-5 py-1 rounded-md text-md md:text-lg md:font-semibold"
						>
							Save
						</button>

					</div>
				</div>
			</div>
		</div>
	);
};

export default SetShopLocation;