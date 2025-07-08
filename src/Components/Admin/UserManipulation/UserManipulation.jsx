import React, { useContext } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Providers/AuthProvider';

const UserManipulation = () => {
	const { user } = useContext(AuthContext);
	const allStaffs = useLoaderData();
	const navigate = useNavigate();

	const handleDelete = (id) => {
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
				fetch(`https://shop-manager-server.onrender.com/staff/${id}`, {
					method: 'DELETE'
				}).then(res => res.json())
				Swal.fire({
					title: "Delete",
					text: "This Person has been Deleted.",
					icon: "success"
				}).then(() => {
					navigate('/admin/user_manipulation')
				})
			}
		});
	}

	return (
		<div className='w-full h-full md:p-5 flex flex-col gap-5 text-pink-200'>
			<h1 className='font-semibold text-2xl'>All Users</h1>
			{
				allStaffs.map(staff =>
					<div key={staff._id}>
						<div className='grid grid-cols-3 items-center justify-between border-b-2 border-pink-200 py-4'>
							<div className='flex flex-col md:flex-row items-center gap-2 md:gap-5 col-span-1'>
								<h1 className='font-semibold text-xl'>{staff.name}</h1>
							</div>
							<h1 className='col-span-1'>{staff.email}</h1>
							<div className='flex justify-end md:flex-row gap-4 col-span-1'>
								<button onClick={() => { handleDelete(staff._id) }} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md  md:text-lg font-semibold'>Delte User</button>
							</div>
						</div>
					</div>)
			}
		</div>
	);
};

export default UserManipulation;