import React, { useEffect, useRef, useState } from 'react';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router-dom';

const StaffsMonthlyRecords = () => {
	const staff = useLoaderData();
	const { _id, name, hour_rate, uid, user_category, current_month_details, total_working_hour, bonus, total_working_minute, total_income, withdrawal_amount, available_balance } = staff;
	const location = useLocation();
	const from = location?.state?.pathname;
	const navigate = useNavigate();

	const printRef = useRef();

	const handlePrint = () => {
		const printContents = printRef.current.innerHTML;
		// Create a hidden iframe
		const iframe = document.createElement('iframe');
		iframe.style.position = 'fixed';
		iframe.style.right = '0';
		iframe.style.bottom = '0';
		iframe.style.width = '0';
		iframe.style.height = '0';
		iframe.style.border = '0';

		document.body.appendChild(iframe);

		const doc = iframe.contentWindow.document;

		// Optional: You can load Tailwind CSS from CDN inside iframe
		doc.open();
		doc.write(`
      <html>
        <head>
          <title>Print</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            @page { size: A4; margin: 20mm; }
            body { font-family: sans-serif; color: black; }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
		doc.close();

		// Wait until iframe is ready then print
		iframe.onload = () => {
			iframe.contentWindow.focus();
			iframe.contentWindow.print();

			// Optional: Cleanup after printing
			setTimeout(() => {
				document.body.removeChild(iframe);
			}, 1000);
		}; te
	};

	const handleDeleteRecord = (staffId, deletedDate) => {
		Swal.fire({
			title: "Are you sure?",
			text: "You won't be able to revert this!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, Submit"
		}).then(async (result) => {
			if (result.isConfirmed) {
				fetch(`https://bismillah-enterprise-server.onrender.com/staff/remove_attendance/${staffId}`, {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ dateToRemove: `${deletedDate}` })
				})
					.then(res => res.json())
					.then(data => {
						navigate(location.pathname)
						if (data.acknowledged) {
							Swal.fire({
								position: 'center',
								icon: 'success',
								title: 'Deleted Record Successfully',
								showConfirmButton: false,
								timer: 1000,
							});
						}
					});
			}
		})


	}
	return (
		<div className='overflow-auto scrollbar-hide'>
			<div className='flex items-center justify-center my-7 gap-5'>
				<Link to={`/`} state={{ from: "/" }}>
					<button className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
						Home
					</button>
				</Link>
				<Link to={`/staff/uid_query/${uid}`}>
					<button className="hidden md:block text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
						Back
					</button>
				</Link>
				{
					user_category === 'admin' ?
						<Link to={'/admin'} state={{ from: '/' }}>
							<button className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
								Admin
							</button>
						</Link> : ''
				}
			</div>
			<div>
				<h1 className="text-lg lg:text-2xl text-center text-pink-200 mt-5 font-semibold">
					{name} - Hour Rate: {hour_rate}
				</h1>
				<div className='flex flex-wrap items-center justify-center gap-7 mt-10 sm:min-w-[70%]'>
					<h1 className='text-pink-200 text-lg text-center font-semibold'>Total Earned: {total_income}</h1>
					<h1 className='text-pink-200 text-lg text-center font-semibold'>Bonus: {bonus}</h1>
					<h1 className='text-pink-200 text-lg text-center font-semibold'>Withdrawal Amount: {withdrawal_amount}</h1>
					<h1 className='text-pink-200 text-lg text-center font-semibold'>Receiveable Amount: {available_balance}</h1>
				</div>
			</div>
			<div className='flex items-center justify-center mt-10'>
				<h1 className="text-lg lg:text-2xl text-center text-pink-200 mt-5 font-semibold px-5 py-2 border-2 border-pink-200 rounded-lg">
					Monthly Working Details Of {name}
				</h1>
			</div>
			<div className="flex items-center sm:justify-center mt-5 overflow-x-scroll sm:overflow-x-hidden overflow-y-hidden scrollbar-hide text-xs lg:text-lg">
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
							<th>Bonus</th>
							<th>Total Earn</th>
							<th></th>
						</tr>
						{
							current_month_details?.map((day, index) =>
								<tr key={index}>
									<td id="today_date">{day.current_date}</td>
									<td id="today_day_name">{day.current_day_name}</td>
									<td id="enter1_time">{day.today_enter1_time}</td>
									<td id="exit1_time">{day.today_exit1_time}</td>
									<td id="enter2_time">{day.today_enter2_time}</td>
									<td id="exit2_time">{day.today_exit2_time}</td>
									<td id="exit2_time">{day.additional_movement_hour || 0} Hours, {day.additional_movement_minute || 0} Minutes</td>
									<td id="total_working_hour">{day.total_hour} Hours, {day.total_minute} Minutes</td>
									<td id="total_working_hour">{day.today_bonus}</td>
									<td id="total_earning">{day.total_earn} Taka</td>
									<td onClick={() => { handleDeleteRecord(_id, day.current_date) }} className='text-pink-400 cursor-pointer underline' id="total_earning">Delete</td>
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
							<td className='text-pink-400'>Total Worked</td>
							<td className='text-pink-300'>{total_working_hour} Hours, {total_working_minute} Minutes</td>
							<td></td>
							<td className='text-pink-300'>{total_income} Taka</td>
							<td></td>
						</tr>
					</tbody>
				</table>
			</div>
			{
				user_category === 'admin' ?
					<div className='flex items-center justify-center mt-5 mb-10'>
						<button onClick={handlePrint} className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
							Print
						</button>
					</div>
					: ''
			}


			<div ref={printRef} className='nunito hidden'>
				<div>
					<div className='text-center text-4xl font-bold'><h1>BISMILLAH ENTERPRISE</h1></div>
				</div>
				<div className='flex items-center justify-center my-3'>
					<img className='w-24 h-24' src='https://i.ibb.co/01Zf9m1/logo.png'></img>
				</div>
				<div className='flex items-center justify-center'>
					<h1 className="nunito text-lg lg:text-2xl text-center font-semibold px-5 py-2 border-2 rounded-lg">
						Monthly Working Details Of {name}
					</h1>
				</div>
				<div className='flex flex-wrap items-center justify-center gap-7 mt-5 sm:min-w-[70%]'>
					<h1 className='text-lg text-center font-semibold'>Total Earned: {total_income}</h1>
					<h1 className='text-lg text-center font-semibold'>Withdrawal Amount: {withdrawal_amount}</h1>
					<h1 className='text-lg text-center font-semibold'>Receiveable Amount: {available_balance}</h1>
				</div>
				<div className="flex items-center sm:justify-center mt-5 overflow-x-scroll sm:overflow-x-hidden overflow-y-hidden scrollbar-hide text-xs lg:text-lg">
					<table className="nunito min-w-[380px] sm:min-w-[380px]">
						<tbody>
							<tr>
								<th className='p-2 border'>Date</th>
								<th className='p-2 border'>Day Name</th>
								<th className='p-2 border'>Enter 1</th>
								<th className='p-2 border'>Exit 1</th>
								<th className='p-2 border'>Enter 2</th>
								<th className='p-2 border'>Exit 2</th>
								<th className='p-2 border'>Additional Movement</th>
								<th className='p-2 border'>Total Working Time</th>
								<th className='p-2 border'>Total Earn</th>
							</tr>
							{
								current_month_details?.map(day =>
									<tr>
										<td className='p-2 border' id="today_date">{day.current_date}</td>
										<td className='p-2 border' id="today_day_name">{day.current_day_name}</td>
										<td className='p-2 border' id="enter1_time">{day.today_enter1_time}</td>
										<td className='p-2 border' id="exit1_time">{day.today_exit1_time}</td>
										<td className='p-2 border' id="enter2_time">{day.today_enter2_time}</td>
										<td className='p-2 border' id="exit2_time">{day.today_exit2_time}</td>
										<td className='p-2 border' id="exit2_time">{day.additional_movement_hour || 0} Hours, {day.additional_movement_minute || 0} Minutes</td>
										<td className='p-2 border' id="total_working_hour">{day.total_hour} Hours, {day.total_minute} Minutes</td>
										<td className='p-2 border' id="total_earning">{day.total_earn} Taka</td>
									</tr>
								)
							}
							<tr>
								<td className='p-2 border'></td>
								<td className='p-2 border'></td>
								<td className='p-2 border'></td>
								<td className='p-2 border'></td>
								<td className='p-2 border'></td>
								<td className='p-2 border'></td>
								<td className='p-2 border'></td>
								<td className='p-2 border text-center'>{total_working_hour} Hour, {total_working_minute} Minute</td>
								<td className='p-2 border'>{total_income} Taka</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default StaffsMonthlyRecords;