import React, { useContext, useEffect, useState } from 'react';
import { Link, useLoaderData, useLocation } from 'react-router-dom';
import { AuthContext } from '../Providers/AuthProvider';
import Loading from '../Shared/Loading/Loading';
import useCurrentUser from '../Hooks/useCurrentUser';
import Marquee from 'react-fast-marquee';

const Home = () => {
	const { user, loading, setLoading } = useContext(AuthContext);
	const notice = useLoaderData();
	const [current_User, isAdmin, isStaff, userHookLoading] = useCurrentUser();
	const location = useLocation();
	const [dateCheckLoading, setDateCheckLoading] = useState(false)
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
	const today_only_date_number = parseInt(currentDate.split(' ')[1].split(',')[0]);
	useEffect(() => {
		setDateCheckLoading(true);
		const todayFullDate = new Date();
		const todayOnlyDate = todayFullDate.toLocaleDateString('en-BD', { day: 'numeric' });
		const todayOnlyDateIntFormat = parseInt(todayOnlyDate);
		fetch(`https://bismillah-enterprise-server.onrender.com/staff/uid_query/${user?.uid}`)
			.then(res => res.json())
			.then(data => {
				const { _id, today_date, name, hour_rate, last_month_due, withdrawal_amount, today_enter1_time, today_exit1_time, bonus, available_balance, today_enter2_time, today_exit2_time, uid, user_category, total_working_hour, total_income, total_working_minute, additional_movement_status, total_bonus, additional_enter_time, additional_exit_time, additional_movement_hour, additional_movement_minute } = data;
				console.log(today_date, todayOnlyDateIntFormat)
				console.log(today_date !== todayOnlyDateIntFormat)
				if (today_date !== todayOnlyDateIntFormat) {
					const TodaySummary = {
						currentDate,
						currentDayName,
						today_enter1_time: "",
						today_exit1_time: "",
						today_enter2_time: "",
						today_exit2_time: "",
						total_hour: 0,
						total_minute: 0,
						total_earn: 0,
						total_working_hour,
						total_working_minute,
						total_income,
						available_balance,
						additional_movement_hour,
						additional_movement_minute,
						today_bonus: 0,
						total_bonus,
						today_date: todayOnlyDateIntFormat
					};
					// Save to database
					fetch(`https://bismillah-enterprise-server.onrender.com/submit_work_time/${_id}`, {
						method: 'PUT',
						headers: {
							'content-type': 'application/json'
						},
						body: JSON.stringify(TodaySummary)
					})
						.then(res => res.json())
						.then(() => {
							setDateCheckLoading(false);
							console.log('submited')
						});
				}
				else {
					setDateCheckLoading(false)
					return;
				}
			})


	}, [user])

	if (userHookLoading && loading ) {
		return (<div className='h-full rounded-2xl overflow-hidden'><Loading></Loading></div>);
	}
	else {
		return (
			<div className="flex flex-col items-center text-white px-4 pt-4 pb-8 h-full">
				<Marquee speed={50} className='mb-4'>
					<p className='text-pink-200 text-lg'>{notice[0].notice}</p>
				</Marquee>
				{
					user ? <div className="flex items-center justify-center gap-5 mb-10">

						<Link to={!isStaff ? `/not_authorized` : `/staff/uid_query/${current_User?.uid}`} state={{ pathname: location.pathname }}>
							<button className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
								Staff
							</button>
						</Link>
						<Link to={!isStaff ? `/not_authorized` : `/client_corner`} state={{ pathname: location.pathname }}>
							<button className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
								Client Corner
							</button>
						</Link>

						{
							isAdmin ?
								<Link to="/admin" state={{ pathname: "/" }}>
									<button className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
										Admin
									</button>
								</Link> : ''
						}
					</div> : ''
				}
				{/* This wrapper div takes remaining space and centers the glow box */}
				<div className="flex-1 flex items-center justify-center w-full">
					<div className="border-2 border-white rounded-2xl w-[300px] lg:w-[500px] h-[200px] lg:h-[300px] flex items-center justify-center div-glow">
						<h1 className="text-center text-2xl lg:text-4xl font-semibold">
							Welcome <br /> To The Shop
						</h1>
					</div>
				</div>
			</div>
		);
	};
};

export default Home;
