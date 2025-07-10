import React from 'react';
import { useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AdditionalRequest = () => {
	const additionalRequestData = useLoaderData();
	const navigate = useNavigate();
	const location = useLocation();
	const handleApproveRequest = (uid) => {
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
				fetch(`https://shop-manager-server.onrender.com/additional_request_approve/${uid}`, {
					method: 'PUT',
					headers: {
						'content-type': 'application/json'
					},
					body: JSON.stringify({ additional_movement_status: true })
				})
					.then(res => res.json())
					.then(() => {
						fetch(`https://shop-manager-server.onrender.com/additional_movement_request/${uid}`, {
							method: 'DELETE'
						}).then(() => {
							navigate(location.pathname)
							Swal.fire({
								position: "center",
								icon: "success",
								title: "Request Approved",
								showConfirmButton: false,
								timer: 1500
							});
						})
					})
			}
		})
	}
	const handleRejectRequest = (uid) => {
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
				fetch(`https://shop-manager-server.onrender.com/additional_request_approve/${uid}`, {
					method: 'PUT',
					headers: {
						'content-type': 'application/json'
					},
					body: JSON.stringify({ additional_movement_status: false })
				})
					.then(res => res.json())
					.then(() => {
						fetch(`https://shop-manager-server.onrender.com/additional_request_approve/${uid}`, {
							method: 'DELETE'
						}).then(() => {
							navigate(location.pathname)
							Swal.fire({
								position: "center",
								icon: "success",
								title: "Request Rejected",
								showConfirmButton: false,
								timer: 1500
							});
						})
					})
			}
		})
	}
	return (
		<div className='w-full h-full lg:p-5 flex flex-col gap-5 text-pink-200'>
			<h1 className='font-semibold text-2xl text-pink-300'>Additonal Movement Requests</h1>
			{
				additionalRequestData.map(requestData =>
					<div key={requestData._id}>
						<div className='grid grid-cols-2 items-center justify-between border-b-2 border-pink-200 py-4'>
							<div className='flex items-center gap-2 lg:gap-5 col-span-1'>
								<h1 className='font-semibold text-xl'>{requestData.name}</h1>
							</div>
							<div className='flex justify-end lg:flex-row gap-4 col-span-1'>
								<div className='flex flex-col sm:flex-row items-end  justify-end gap-4'>
									<button onClick={() => { handleApproveRequest(requestData.uid) }} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md  lg:text-lg font-semibold w-[100px]'>Approve</button>
									<button onClick={() => { handleRejectRequest(requestData.uid) }} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md  lg:text-lg font-semibold w-[100px]'>Reject</button>
								</div>
							</div>
						</div>
					</div>)
			}
		</div>
	);
};

export default AdditionalRequest;