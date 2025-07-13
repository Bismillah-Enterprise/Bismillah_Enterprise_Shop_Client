import React from 'react';
import { Link, useLoaderData, useLocation } from 'react-router-dom';

const TransectionsHistory = () => {
	const staffData = useLoaderData();
	const { name, transections } = staffData;
	const location = useLocation();
	const from = location?.state?.pathname;
	return (
		<div className='pb-10'>
			<div className='flex items-center justify-center mt-8 mb-8'>
				<Link to={from}>
					<button className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
						Back
					</button>
				</Link>
			</div>
			<div className='flex items-center justify-center nunito'>
				<h1 className="nunito text-lg lg:text-2xl text-center font-semibold px-5 py-2 border-2 rounded-lg text-pink-300">
					Transections Details Of {name}
				</h1>
			</div>
			<div className="flex items-center justify-center mt-5 overflow-x-scroll sm:overflow-x-hidden overflow-y-hidden scrollbar-hide text-xs lg:text-lg">
				<table className="nunito min-w-[380px] sm:min-w-[70%]">
					<tbody>
						<tr className='text-pink-300'>
							<th>Date</th>
							<th>Comment</th>
							<th>Transection Type</th>
							<th>Ammount</th>
						</tr>
						{
							transections?.map(transection =>
								<tr className='text-pink-200'>
									<td>{transection.transection_date}</td>
									<td className='max-w-[100px] text-wrap overflow-scroll scrollbar-hide cursor-context-menu'>{transection.comment}</td>
									<td>{transection.transection_type}</td>
									<td>{transection.transection_amount}</td>
								</tr>
							)
						}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default TransectionsHistory;