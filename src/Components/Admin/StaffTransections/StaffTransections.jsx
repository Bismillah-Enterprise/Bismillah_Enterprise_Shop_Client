import React from 'react';
import { Link, useLoaderData } from 'react-router-dom';

const StaffTransections = () => {
	const All_Staffs = useLoaderData();
	return (
		<div className='w-full h-full lg:p-5 flex flex-col gap-5 text-pink-200'>
			<h1 className='font-semibold text-2xl text-pink-300'>Staff Transections</h1>
			{
				All_Staffs.map(staff =>
					<div key={staff._id}>
						<div className='grid grid-cols-2 gap-5 items-center justify-between border-b-2 border-pink-200 py-4'>
							<div className='col-span-1'>
								<h1 className='font-semibold md:text-xl'>{staff.name}</h1>
							</div>
							<div className='flex justify-end lg:flex-row gap-4 col-span-1'>
								<Link to={`/admin/staff_details/${staff?.uid}`} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md  lg:text-lg font-semibold'>View Details</Link>
							</div>
						</div>
					</div>)
			}
		</div>
	);
};

export default StaffTransections;