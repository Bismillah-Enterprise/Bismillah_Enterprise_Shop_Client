import React, { useContext } from 'react';
import { AuthContext } from '../../Providers/AuthProvider';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router-dom';

const StaffManipulation = () => {
	const { user } = useContext(AuthContext);
	const allStaffs = useLoaderData();
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
			text: `You Are ${updatedStatus? 'Unblocking' : 'Blocking'} This Staff`,
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

	return (
		<div className='w-full h-full lg:p-5 flex flex-col text-pink-200 scrollbar-hide'>
			<h1 className='font-semibold text-2xl text-pink-300 mb-5'>Staff Manipulation</h1>
			{
				allStaffs.map(staff =>
					<div key={staff._id}>
						<div className='flex items-center justify-between gap-5 lg:grid grid-cols-2 lg:grid-cols-3 border-b-2 border-pink-200 py-4'>
							<div className='col-span-1 flex-1'>
								<h1 className='font-semibold md:text-xl'>{staff.name}</h1>
							</div>
							<h1 className='col-span-1 hidden lg:block'>{staff.email}</h1>
							<div className='flex flex-wrap items-center justify-center lg:justify-end gap-4 col-span-1'>
								{
									staff.user_category === 'admin' ?
										<Link onClick={() => { handleUserCategory(staff.uid, 'staff') }} className={`text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md  lg:text-lg font-semibold max-w-[150px] w-full`}>Set As Staff</Link> :

										<Link onClick={() => { handleUserCategory(staff.uid, 'admin') }} className={`text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md  lg:text-lg font-semibold max-w-[150px] w-full`}>Set As Admin</Link>

								}
								{
									staff.status ?
										<Link onClick={() => { handleUserStatus(staff.uid, false) }} className={`text-center text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md  lg:text-lg font-semibold max-w-[100px] w-full`}>Block</Link> :

										<Link onClick={() => { handleUserStatus(staff.uid, true) }} className={`text-center text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md  lg:text-lg font-semibold max-w-[100px] w-full`}>Unblock</Link>

								}
								<Link to={`/staff/uid_query/${staff.uid}`} state={{ pathname: location.pathname }} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md  lg:text-lg font-semibold'>View User</Link>
							</div>
						</div>
					</div>)
			}
		</div>
	);
};

export default StaffManipulation;