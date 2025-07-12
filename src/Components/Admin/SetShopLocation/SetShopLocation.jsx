import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../Providers/AuthProvider';
import Loading from '../../Shared/Loading/Loading';
import Swal from 'sweetalert2';
import { PropagateLoader } from 'react-spinners';
import { MdOutlineCancel } from 'react-icons/md';

const SetShopLocation = () => {
	const [location, setLocation] = useState({ latitude: '', longitude: '' });
	const { loading, setLoading } = useContext(AuthContext);
	const [locationLoading, setLocationLoading] = useState(false);
	const [saveLocationLoading, setSaveLocationLoading] = useState(false);
	const [modal, setModal] = useState(false);
	const inputRef = useRef(null);
	const handleOpenModal = () => {
		setModal(!modal)
	}
	// Fetch current shop location
	useEffect(() => {
		fetch('https://bismillah-enterprise-server.onrender.com/shop_location')
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
				setLocation({ latitude, longitude, shop_range: 0 });
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
		setSaveLocationLoading(true);
		const shop_range = parseInt(inputRef.current.value);
		fetch('https://bismillah-enterprise-server.onrender.com/shop_location', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				latitude: location?.latitude,
				longitude: location?.longitude,
				shop_range
			}),
		})
			.then((res) => res.json())
			.then(() => {
				setSaveLocationLoading(false);
				setModal(!modal);
				Swal.fire({
					position: "center",
					icon: "success",
					title: "Shop Locaiton Updated",
					showConfirmButton: false,
					timer: 1000
				});
			})
			.catch(() => {
				setSaveLocationLoading(false);
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
		// How many meters of your shop area do you want to save?
		<div className="p-4 h-full relative">
			<h2 className="text-lg lg:text-2xl font-semibold text-center text-pink-300">Set Shop Location</h2>
			{/* modal */}
			< div className={`${!modal ? 'hidden' : 'block'} h-[250px] w-full lg:w-[350px] bg-black shadow-md shadow-pink-200 rounded-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50`
			}>
				{
					saveLocationLoading ? <div className='h-full w-full flex items-center justify-center rounded-2xl overflow-hidden'><Loading></Loading></div> :
						<div>
							<div className='flex justify-end -top-[10px] -right-[10px] relative'>
								<MdOutlineCancel onClick={() => { !setModal(!modal) }} className='text-pink-200 text-3xl cursor-pointer'></MdOutlineCancel>
							</div>
							<div className='text-pink-200 flex flex-col gap-5 p-5 items-center h-full w-full'>
								<h1 className='text-xl font-semibold text-center'>How many meters of your shop area do you want to save?</h1>
								<div className='px-3 border-2 rounded-xl h-8 shadow-2xl shadow-pink-300  w-full'>
									<input type="text" ref={inputRef} className='outline-none' />
								</div>
								<button onClick={handleSaveLocation} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold mb-5 lg:mb-0'>Submit</button>
							</div>
						</div>
				}

			</div >
			{/* end modal */}
			<div className='h-fit flex lg:justify-center'>
				<div className="text-pink-200 shadow-lg shadow-pink-200 lg:p-10 flex flex-col items-center lg:justify-center mt-10 w-full lg:w-[500px] rounded-2xl">
					<div className='flex flex-col items-center justify-center gap-5 text-pink-200 text-md lg:text-lg font-semibold mt-5'>
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
					<div className='my-7 flex flex-col lg:flex-row items-center justify-center gap-5'>

						<button
							onClick={handleSetCurrentLocation}
							className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-3 lg:px-5 py-1 rounded-md text-md lg:text-lg lg:font-semibold"
						>
							Use Current Location
						</button>
						<button
							onClick={handleOpenModal}
							className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-3 lg:px-5 py-1 rounded-md text-md lg:text-lg lg:font-semibold"
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