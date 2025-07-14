import React, { useRef, useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { Link, useLoaderData } from 'react-router-dom';
import Swal from 'sweetalert2';

const UserRequest = () => {
	const userRequest = useLoaderData();
	const [modal, setModal] = useState(false);
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
	const todayDate = now.toLocaleDateString('en-BD', { day: 'numeric' });
	const todayDateIntFormat = parseInt(todayDate);

	const handleApprove = (email, uid, id) => {
		const user_email_field = document.getElementById('user_email');
		const user_uid_field = document.getElementById('user_uid');
		const user_old_id_field = document.getElementById('user_old_id')
		user_email_field.value = email;
		user_uid_field.value = uid;
		user_old_id_field.value = id;
		setModal(!modal);
	}
	const handleSetNewUser = () => {
		const user_category = user_category_field.current.value;
		const name = user_name_field.current.value;
		const email = user_email_field.current.value;
		const hour_rate = hour_rate_field.current.value;
		const uid = user_uid_field.current.value;
		const id = user_old_id_field.current.value;
		console.log(id)
		const userAllData = {
			name,
			email,
			hour_rate,
			user_category,
			status: true,
			current_working_month: currentDate.split(' ')[0],
			total_income: 0,
			bonus: 0,
			fine: 0,
			last_month_due: 0,
			withdrawal_amount: 0,
			available_balance: 0,
			transections: [],
			total_working_hour: "",
			total_working_minute: "",
			current_month_details: [],
			income_history: [],
			today_date: todayDateIntFormat,
			today_enter1_time: "",
			today_enter2_time: "",
			today_exit1_time: "",
			today_exit2_time: "",
			additional_movement_status: false,
			additional_exit_time: "",
			additional_enter_time: "",
			additional_movement_hour: "",
			additional_movement_minute: "",
			uid
		};

		fetch('https://bismillah-enterprise-server.onrender.com/staff', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify(userAllData)
		})
			.then(async res => {
				if (!res.ok) {
					// request failed (e.g. 404 or 500)
					throw new Error("Server error or user not found");
				}

				// 🔐 Make sure response is not empty before calling .json()
				const text = await res.text();
				return text ? JSON.parse(text) : null;
			})
			.then(() => {
				fetch(`https://bismillah-enterprise-server.onrender.com/user_request/${id}`, {
					method: 'DELETE'
				})
					.then(() => {
						Swal.fire({
							position: "center",
							icon: "success",
							title: "User Profile Created Successfully",
							showConfirmButton: false,
							timer: 1500
						});
						window.location.reload();
					});
			});
	}

	const user_name_field = useRef();
	const user_email_field = useRef();
	const hour_rate_field = useRef();
	const user_uid_field = useRef();
	const user_category_field = useRef();
	const user_old_id_field = useRef();
	const handleReject = (id) => {
		Swal.fire({
			title: "Are you sure?",
			text: "You won't be able to revert this!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, reject it!"
		}).then((result) => {
			if (result.isConfirmed) {
				fetch(`https://bismillah-enterprise-server.onrender.com/user_request/${id}`, {
					method: 'DELETE'
				}).then(res => res.json())
				Swal.fire({
					title: "Rejected!",
					text: "This Person has been rejected.",
					icon: "success"
				}).then(() => {
					window.location.reload();
				})
			}
		});
	}
	return (
		<div className='w-full h-full lg:p-5 flex flex-col gap-5 text-pink-200'>
			<div id='user_request_modal' className={`${!modal ? 'hidden' : 'block'}  w-[350px] bg-black shadow-md shadow-pink-200 rounded-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}>
				<div className='flex justify-end -top-[10px] -right-[10px] relative'>
					<MdOutlineCancel onClick={() => { !setModal(!modal) }} className='text-pink-200 text-3xl cursor-pointer'></MdOutlineCancel>
				</div>
				<div className='text-pink-200 flex flex-col gap-5 p-8 items-center h-full w-full'>
					<div>
						<input ref={user_email_field} id='user_email' type="text" className='outline-none hidden' />
						<input ref={user_uid_field} id='user_uid' type="text" className='outline-none hidden' />
						<input ref={user_old_id_field} id='user_old_id' type="text" className='outline-none hidden' />
						<div>
							<h1 className='lg:text-lg font-semibold mb-2'>User Name</h1>
							<div className='px-3 border-2 rounded-xl h-8 shadow-2xl shadow-pink-300  w-full'>
								<input ref={user_name_field} id='user_name_in_shop' type="text" className='outline-none' />
							</div>
						</div>
						<div className='mt-5'>
							<h1 className='lg:text-lg font-semibold mb-2'>Hour Rate</h1>
							<div className='px-3 border-2 rounded-xl h-8 shadow-2xl shadow-pink-300  w-full'>
								<input ref={hour_rate_field} id='user_hour_rate' type="text" className='outline-none' />
							</div>
						</div>
						<div className='mt-5 flex items-center gap-5'>
							<h1 className='lg:text-lg font-semibold'>User Category</h1>
							<select ref={user_category_field} className='px-3 outline-none border p-1 rounded-md' name="user_category_in_shop" id="user_category">
								<option className='text-xs text-black bg-gray' value="staff">Staff</option>
								<option className='text-xs text-black bg-gray' value="admin">Admin</option>
							</select>
						</div>
					</div>
					<Link><button onClick={() => { handleSetNewUser() }} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-lg font-semibold mb-5 lg:mb-0'>Submit</button></Link>
				</div>
			</div>
			<h1 className='font-semibold text-2xl text-pink-300'>User Requests</h1>
			{
				userRequest?.map(user =>
					<div key={user._id}>
						<div className='grid grid-cols-2 xl:grid-cols-3 gap-5 items-center border-b-2 border-pink-200 py-4'>
							<div className='flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-5'>
								<img src={user.photo} className='rounded-full w-10 lg:w-14 h-10 lg:h-14' alt="not uploaded" />
								<h1>{user.display_name}</h1>
							</div>
							<div className='hidden xl:block overflow-hidden'>
								<h1 className=''>{user.email}</h1>
							</div>
							<div className='flex flex-col items-end justify- md:flex-row md:justify-end gap-4'>
								<button onClick={() => { handleApprove(user?.email, user?.uid, user?._id) }} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md  lg:text-lg font-semibold w-[100px]'>Approve</button>
								<button onClick={() => { handleReject(user._id) }} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md  lg:text-lg font-semibold w-[100px]'>Reject</button>
							</div>
						</div>
					</div>)
			}
		</div>
	);
};

export default UserRequest;