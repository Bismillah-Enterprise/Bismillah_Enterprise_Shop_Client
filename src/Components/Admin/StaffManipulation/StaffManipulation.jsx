import React, { useContext, useRef, useState } from 'react';
import { AuthContext } from '../../Providers/AuthProvider';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import { MdOutlineCancel } from 'react-icons/md';
import { NumberFormatBase, NumericFormat } from 'react-number-format';

const StaffManipulation = () => {
	const { user } = useContext(AuthContext);
	const allStaffs = useLoaderData();
	const [modal, setModal] = useState(false);
	const [staffId, setStaffId] = useState('');
	console.log(staffId);
	const navigate = useNavigate();
	const location = useLocation();

	const handleUserCategory = (uid, newUserCategory) => {
		Swal.fire({
			title: "Are you sure?",
			text: `You Are Changing User Category To ${newUserCategory}`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, I am Sure"
		}).then((result) => {
			if (result.isConfirmed) {
				fetch(`https://bismillah-enterprise-server.onrender.com/set_user_category/${uid}`, {
					method: 'PUT',
					headers: {
						'content-type': 'application/json'
					},
					body: JSON.stringify({ user_category: newUserCategory })
				}).then(res => res.json()).then((data) => {
					if (data.acknowledged) {
						navigate(location.pathname)
						Swal.fire({
							position: 'center',
							icon: 'success',
							title: 'User Category Set Successfully',
							showConfirmButton: false,
							timer: 1000,
						})
					}
				})
			}
		})

	}
	const handleUserStatus = (uid, updatedStatus) => {
		Swal.fire({
			title: "Are you sure?",
			text: `You Are ${updatedStatus ? 'Unblocking' : 'Blocking'} This Staff`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, I am Sure"
		}).then((result) => {
			if (result.isConfirmed) {
				fetch(`https://bismillah-enterprise-server.onrender.com/set_user_status/${uid}`, {
					method: 'PUT',
					headers: {
						'content-type': 'application/json'
					},
					body: JSON.stringify({ status: updatedStatus })
				}).then(res => res.json()).then((data) => {
					if (data.acknowledged) {
						navigate(location.pathname)
						Swal.fire({
							position: 'center',
							icon: 'success',
							title: `User ${updatedStatus === true ? 'Unblock' : 'Block'} Successfully`,
							showConfirmButton: false,
							timer: 1000,
						})
					}
				})
			}
		})
	}
	const hour_rate_ref = useRef();
	const handleHourRate = () => {
		const newHourRate = parseFloat(hour_rate_ref.current.value);
		fetch(`https://bismillah-enterprise-server.onrender.com/hour_rate/${staffId}`, {
			method: 'PUT',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({ hour_rate: newHourRate })
		})
			.then(res => res.json())
			.then(data => {
				if (data.acknowledged) {
					navigate(location.pathname)
					setModal(false)
					Swal.fire({
						position: 'center',
						icon: 'success',
						title: 'Hour Rate Set Successfully',
						showConfirmButton: false,
						timer: 1000,
					})
				}
			})
	}
	return (
		<div className='w-full h-full lg:p-5 flex flex-col text-pink-200 scrollbar-hide'>
			{/* modal */}
			<div id='staff_details_modal' className={`${!modal ? 'hidden' : 'block'}  w-[350px] bg-black shadow-md shadow-pink-200 rounded-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}>
				<div className='flex justify-end -top-[10px] -right-[10px] relative'>
					<MdOutlineCancel onClick={() => { !setModal(false) }} className='text-pink-200 text-3xl cursor-pointer'></MdOutlineCancel>
				</div>
				<div className='mb-4'>
					<h1 className='text-lg font-semibold text-pink-300 text-center mb-2'>Set New Hour Rate</h1>
					<hr className='text-pink-300 w-full' />
				</div>
				<div className='text-pink-200 flex flex-col gap-5 p-8 pt-0 items-center h-full w-full'>
					<div className='mb-4'>
						<div className='mt-2'>
							<h1 className='lg:text-lg font-semibold mb-2'>Enter New Hour Rate</h1>
							<div className='px-3 border-2 rounded-xl h-8 shadow-2xl shadow-pink-300 w-full'>
								<NumericFormat
									getInputRef={hour_rate_ref}
									className='outline-none w-full h-full'
									placeholder='Enter amount'
									allowNegative={false}
									decimalScale={2}
									fixedDecimalScale={false}
									thousandSeparator={false}
								/>
							</div>
						</div>
					</div>
					<button onClick={() => handleHourRate()} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-lg font-semibold mb-5 lg:mb-0'>Submit</button>
				</div>
			</div>
			{/* end modal */}
			<h1 className='font-semibold text-2xl text-pink-300 mb-5'>Staff Manipulation</h1>
			{
				allStaffs?.map(staff =>
					<div key={staff._id}>
						<div className='flex items-center justify-between gap-5 lg:grid grid-cols-2 lg:grid-cols-3 border-b-2 border-pink-200 py-4'>
							<div className='col-span-1 flex-1'>
								<h1 className='font-semibold md:text-xl'>{staff?.name}</h1>
							</div>
							<h1 className='col-span-1 hidden lg:block'>{staff?.email}</h1>
							<div className='flex flex-wrap items-center justify-end gap-4 col-span-1'>
								<Link to={`/staff/uid_query/${staff?.uid}`} state={{ pathname: location.pathname }} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md  lg:text-lg font-semibold'>View User</Link>

								{
									user?.email === 'bismillah786e@gmail.com' ?
										<div>
											{
												staff.user_category === 'admin' ?
													<Link onClick={() => { handleUserCategory(staff?.uid, 'staff') }} className={`text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md  lg:text-lg font-semibold max-w-[150px] w-full`}>Set As Staff</Link> :

													<Link onClick={() => { handleUserCategory(staff?.uid, 'admin') }} className={`text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md  lg:text-lg font-semibold max-w-[150px] w-full`}>Set As Admin</Link>
											}
										</div> :
										''
								}


								{
									staff.status ?
										<Link onClick={() => { handleUserStatus(staff?.uid, false) }} className={`text-center text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md  lg:text-lg font-semibold max-w-24 w-full`}>Block</Link> :

										<Link onClick={() => { handleUserStatus(staff?.uid, true) }} className={`text-center text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md  lg:text-lg font-semibold max-w-24 w-full`}>Unblock</Link>

								}
								{
									user?.email === 'bismillah786e@gmail.com' ?
										<Link onClick={() => { setStaffId(staff?._id); setModal(true) }} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md  lg:text-lg font-semibold'>Change Hour Rate</Link>
										: ''
								}

							</div>
						</div>
					</div>)
			}
		</div>
	);
};

export default StaffManipulation;