import React from 'react';
import { Link, useLoaderData, useLocation } from 'react-router-dom';

const IncomeHistory = () => {
	const staff = useLoaderData();
	const { name, income_history, uid } = staff;
	const location = useLocation();
	const from = location?.state?.pathname;
	return (
		<div className='pb-10'>
			<div className='flex items-center justify-center mt-8 mb-8'>
				<Link to={`/staff/uid_query/${uid}`}>
					<button className="hidden md:block text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
						Back
					</button>
				</Link>
			</div>
			<div className='flex items-center justify-center nunito'>
				<h1 className="nunito text-lg lg:text-2xl text-center font-semibold px-5 py-2 border-2 rounded-lg text-pink-300">
					Income History Of {name}
				</h1>
			</div>
			<div className="flex items-center justify-center mt-5 overflow-x-scroll sm:overflow-x-hidden overflow-y-hidden scrollbar-hide text-xs lg:text-lg">
				<table className="nunito min-w-[380px] sm:min-w-[70%]">
					<tbody>
						<tr className='text-pink-300'>
							<th>Month Name</th>
							<th>Total Worked Time</th>
							<th>Previous Due</th>
							<th>Total Income</th>
							<th>Paid Amount</th>
							<th>Receiveable Amount</th>
							<th>Closing Date</th>
						</tr>
						{
							income_history?.map(income =>
								<tr className='text-pink-200'>
									<td>{income.month_name}</td>
									<td>{income.total_worked_time}</td>
									<td>{income.previous_due}</td>
									<td>{income.total_income}</td>
									<td>{income.paid_amount}</td>
									<td>{income.receiveable_amount}</td>
									<td>{income.paid_date}</td>
								</tr>
							)
						}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default IncomeHistory;