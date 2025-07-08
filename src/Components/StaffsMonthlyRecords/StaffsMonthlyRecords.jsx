import React, { useEffect, useState } from 'react';
import { Link, useLoaderData, useLocation } from 'react-router-dom';

const StaffsMonthlyRecords = () => {
	const staff = useLoaderData();
	const { _id, name, hour_rate, uid, user_category, current_month_details, total_working_hour, total_working_minute, total_income } = staff;
	// const {today_enter1_time, today_exit1_time, today_enter2_time, today_exit2_time} = current_month_details
	const [totalTimeCalculation, setTotalTimeCalculation] = useState('');
	const location = useLocation();
	const from = location?.state?.pathname;


	const calculateMonthlySummary = (dailyRecords) => {
		let totalHours = 0;
		let totalMinutes = 0;
		let totalEarnings = 0;

		dailyRecords.forEach(record => {
			totalHours += record.hour || 0;
			totalMinutes += record.minutes || 0;
			totalEarnings += record.earn || 0;
		});

		// Convert extra minutes to hours
		totalHours += Math.floor(totalMinutes / 60);
		totalMinutes = totalMinutes % 60;

		return {
			totalHour: totalHours,
			totalMinute: totalMinutes,
			totalEarn: totalEarnings.toFixed(2)
		};
	};



	return (
		<div>
			<div className='flex items-center justify-center my-7 gap-5'>
				<Link to={`/`} state={{ from: "/" }}>
					<button className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md md:text-lg font-semibold">
						Home
					</button>
				</Link>
				<Link to={`/staff/uid_query/${uid}`} state={{ from: "/" }}>
					<button className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md md:text-lg font-semibold">
						Staff
					</button>
				</Link>
				<Link to={from}>
					<button className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md md:text-lg font-semibold">
						Back
					</button>
				</Link>
				{
					user_category === 'admin' ?
						<Link to={'/admin'} state={{ from: '/' }}>
							<button className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md md:text-lg font-semibold">
								Admin
							</button>
						</Link> : ''
				}
			</div>
			<div>
				<h1 className="text-lg md:text-2xl text-center text-pink-200 mt-5 font-semibold">
					{name} - Hour Rate: {hour_rate}
				</h1>
			</div>
			<div className='flex items-center justify-center mt-10'>
				<h1 className="text-lg md:text-2xl text-center text-pink-200 mt-5 font-semibold px-5 py-2 border-2 border-pink-200 rounded-lg">
					Monthly Working Details Of {name}
				</h1>
			</div>
			<div className="flex items-center sm:justify-center mt-5 overflow-x-scroll sm:overflow-x-hidden overflow-y-hidden scrollbar-hide text-xs md:text-lg">
				<table className="text-pink-200 min-w-[380px] sm:min-w-[70%]">
					<tbody>
						<tr>
							<th>Date</th>
							<th>Day Name</th>
							<th>Enter 1</th>
							<th>Exit 1</th>
							<th>Enter 2</th>
							<th>Exit 2</th>
							<th>Additional Movement</th>
							<th>Total Working Time</th>
							<th>Total Earn</th>
						</tr>
						{
							current_month_details.map(day =>
								<tr>
									<td id="today_date">{day.current_date}</td>
									<td id="today_day_name">{day.current_day_name}</td>
									<td id="enter1_time">{day.today_enter1_time}</td>
									<td id="exit1_time">{day.today_exit1_time}</td>
									<td id="enter2_time">{day.today_enter2_time}</td>
									<td id="exit2_time">{day.today_exit2_time}</td>
									<td id="exit2_time">{day.additional_movement_hour || 0} Hours, {day.additional_movement_minute || 0} Minutes</td>
									<td id="total_working_hour">{day.total_hour} Hours, {day.total_minute} Minutes</td>
									<td id="total_earning">{day.total_earn} Taka</td>
								</tr>
							)
						}
						<tr>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td>{total_working_hour} Hour, {total_working_minute} Minute</td>
							<td>{total_income} Taka</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default StaffsMonthlyRecords;