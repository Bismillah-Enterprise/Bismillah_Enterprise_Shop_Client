import React, { useContext } from 'react';
import { AuthContext } from '../../Providers/AuthProvider';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router-dom';

const StaffManipulation = () => {
	const { user } = useContext(AuthContext);
	const allStaffs = useLoaderData();
	const navigate = useNavigate();
	const location = useLocation();
	console.log(location);

	return (
		<div className='w-full h-full lg:p-5 flex flex-col text-pink-200 scrollbar-hide'>
			<h1 className='font-semibold text-2xl text-pink-300 mb-5'>Staff Manipulation</h1>
			{
				allStaffs.map(staff =>
					<div key={staff._id}>
						<div className='grid grid-cols-2 lg:grid-cols-3 border-b-2 border-pink-200 py-4'>
							<div className='col-span-1'>
								<h1 className='font-semibold md:text-xl'>{staff.name}</h1>
							</div>
							<h1 className='col-span-1 hidden lg:block'>{staff.email}</h1>
							<div className='flex items-center justify-end gap-4 col-span-1'>
								<Link to={`/staff/uid_query/${staff.uid}`} state={{ pathname: location.pathname }} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md  lg:text-lg font-semibold'>View User</Link>
							</div>
						</div>
					</div>)
			}
		</div>
	);
};

export default StaffManipulation;