import React, { useContext, useEffect, useState } from 'react';
import { Link, useLoaderData, useLocation, useNavigation } from 'react-router-dom';
import { AuthContext } from '../Providers/AuthProvider';
import Loading from '../Shared/Loading/Loading';
import useCurrentUser from '../Hooks/useCurrentUser';
import Marquee from 'react-fast-marquee';
import {
	FaArrowRight,
	FaCalendarCheck,
	FaChartLine,
	FaBoxOpen,
	FaWallet,
	FaShieldAlt,
	FaUserClock,
	FaReceipt
} from 'react-icons/fa';
import { useEffectEvent } from 'react';

const Home = () => {

	const navigation = useNavigation();
	const { user, loading, setLoading } = useContext(AuthContext);

	const [notice, setNotice] = useState('');

	const [
		current_User,
		isAdmin,
		isStaff,
		userHookLoading
	] = useCurrentUser();

	const location = useLocation();

	const [dateCheckLoading, setDateCheckLoading] = useState(false);
	const [adminLoading, setAdminLoading] = useState(false);
	const [logedinUser, setlogedinUser] = useState();
	const [loadedUser, setLoadedUser] = useState();

	const [now, setNow] = useState(new Date());

	useEffect(() => {
		fetch('https://bismillah-enterprise-server.onrender.com/notice_panel').then(res => res.json()).then(data => setNotice(data));
	})

	useEffect(() => {
		const timer = setInterval(() => {
			setNow(new Date());
		}, 1000);
		return () => clearInterval(timer);
	}, []);

	const Time = now.toLocaleTimeString('en-BD', {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: true,
	});

	const currentDayName = now.toLocaleDateString('en-BD', {
		weekday: 'long'
	});

	const currentDate = now.toLocaleDateString('en-BD', {
		day: 'numeric',
		year: 'numeric',
		month: 'long',
	});

	const today_only_date_number =
		parseInt(
			currentDate
				.split(' ')[1]
				.split(',')[0]
		);

	useEffect(() => {

		fetch(`https://bismillah-enterprise-server.onrender.com/staff_bonus`)
			.then(bonusRes => bonusRes.json())
			.then(bonusData => {

				if (bonusData.date !== currentDate) {

					fetch(
						`https://bismillah-enterprise-server.onrender.com/staff_bonus`,
						{
							method: 'PUT',
							headers: {
								'content-type': 'application/json'
							},
							body: JSON.stringify({
								entry_type: 'new day',
								date: currentDate
							}),
						}
					)
						.then(firstEntryRes => firstEntryRes.json())
						.then(firstEntryData => {

							if (firstEntryData.acknowledged) {
							}

						});

				}

			});

	}, []);


	useEffect(() => {

		setDateCheckLoading(true);

		const todayFullDate = new Date();

		const todayOnlyDate =
			todayFullDate.toLocaleDateString(
				'en-BD',
				{ day: 'numeric' }
			);

		const todayOnlyDateIntFormat =
			parseInt(todayOnlyDate);

		fetch(
			`https://bismillah-enterprise-server.onrender.com/staff/uid_query/${user?.uid}`
		)
			.then(res => res.json())
			.then(data => {

				setLoadedUser(data);

				const {
					_id,
					today_date,
					name,
					hour_rate,
					last_month_due,
					withdrawal_amount,
					today_enter1_time,
					today_exit1_time,
					today_enter2_time,
					today_exit2_time,
					uid,
					user_category,
					total_working_hour,
					total_income,
					total_working_minute,
					additional_movement_status,
					total_bonus,
					additional_enter_time,
					additional_exit_time,
					additional_movement_hour,
					additional_movement_minute,
					available_balance
				} = data;

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

						today_date:
							todayOnlyDateIntFormat
					};

					fetch(
						`https://bismillah-enterprise-server.onrender.com/submit_work_time/${_id}`,
						{
							method: 'PUT',
							headers: {
								'content-type': 'application/json'
							},
							body: JSON.stringify(
								TodaySummary
							)
						}
					)
						.then(res => res.json())
						.then(() => {
						});

				}
				else {
					return;
				}

			});

		setDateCheckLoading(false);

	}, [user]);


	// =========================================================
	// LOADING
	// =========================================================

	if (dateCheckLoading || navigation.state === "loading") {

		return (
			<div className="h-full rounded-3xl overflow-hidden">
				<Loading />
			</div>
		);

	}

	if (!loadedUser) {

		return (
			<div className="h-full rounded-3xl overflow-hidden">
				<Loading />
			</div>
		);

	}

	return (

		<div className="min-h-full text-white py-5 sm:py-8">
			<div className="
				max-w-7xl
				mx-auto
				mb-5 sm:mb-7
				rounded-2xl
				border border-emerald-400/10
				bg-[#0b1917]/60
				backdrop-blur-xl
				overflow-hidden
			">

				<div className="
					h-10
					flex items-center
					border-b border-white/[0.04]
				">

					<div className="
						shrink-0
						h-full
						px-4
						flex items-center
						bg-emerald-400/10
						border-r border-emerald-400/10
					">

						<span className="
							text-[10px]
							sm:text-xs
							font-black
							tracking-[2px]
							text-emerald-400
							uppercase
						">
							Notice
						</span>

					</div>

					<Marquee
						speed={45}
						gradient={false}
					>

						<p className="
							text-xs
							sm:text-sm
							text-slate-400
							px-8
						">
							{notice[0]?.notice}
						</p>

					</Marquee>

				</div>

			</div>


			{/* ================================================= */}
			{/* HERO */}
			{/* ================================================= */}

			<section className="
				max-w-7xl
				mx-auto
				relative
				overflow-hidden
				rounded-[30px]
				sm:rounded-[38px]
				border border-white/[0.08]
				bg-gradient-to-br
				from-[#10231f]
				via-[#0c1917]
				to-[#0b1110]
				shadow-[0_30px_100px_rgba(0,0,0,.35)]
			">

				{/* Ambient glows */}

				<div className="
					absolute
					-w-20
					-top-32
					-w-80
					h-80
					rounded-full
					bg-emerald-400/10
					blur-[110px]
				" />

				<div className="
					absolute
					-right-32
					-bottom-40
					w-96
					h-96
					rounded-full
					bg-violet-500/10
					blur-[130px]
				" />

				<div className="
					relative
					grid
					lg:grid-cols-[1.4fr_.6fr]
					gap-8
					p-6 sm:p-8 lg:p-12
				">

					{/* Left */}

					<div className="flex flex-col justify-center">

						<div className="
							inline-flex
							items-center
							gap-2
							w-fit
							px-3
							py-1.5
							rounded-full
							border border-emerald-400/15
							bg-emerald-400/[0.05]
							mb-5
						">

							<span className="
								w-2
								h-2
								rounded-full
								bg-emerald-400
								shadow-[0_0_12px_rgba(52,211,153,.7)]
							" />

							<span className="
								text-[10px]
								sm:text-xs
								text-emerald-300
								font-bold
								tracking-[2px]
								uppercase
							">
								Enterprise Dashboard
							</span>

						</div>


						<h1 className="
							text-4xl
							sm:text-5xl
							lg:text-6xl
							font-black
							leading-[1.05]
							tracking-tight
						">

							Welcome back,

							<span className="
								block
								mt-2
								bg-gradient-to-r
								from-emerald-300
								via-cyan-300
								to-violet-400
								bg-clip-text
								text-transparent
							">
								{loadedUser?.name || "Team Member"}
							</span>

						</h1>


						<p className="
							mt-5
							max-w-xl
							text-sm
							sm:text-base
							text-slate-400
							leading-7
						">
							Manage your daily operations, attendance,
							products and transactions from one unified
							workspace.
						</p>


						{/* Date / Time */}

						<div className="
							flex
							flex-wrap
							gap-3
							mt-7
						">

							<div className="
								flex items-center gap-3
								px-4 py-3
								rounded-2xl
								bg-white/[0.035]
								border border-white/[0.07]
							">

								<FaCalendarCheck className="text-emerald-400" />

								<div>

									<p className="text-[10px] text-slate-500 uppercase tracking-wider">
										Today
									</p>

									<p className="text-sm font-semibold text-slate-200">
										{currentDayName}
									</p>

								</div>

							</div>


							<div className="
								flex items-center gap-3
								px-4 py-3
								rounded-2xl
								bg-white/[0.035]
								border border-white/[0.07]
							">

								<FaChartLine className="text-cyan-400" />

								<div>

									<p className="text-[10px] text-slate-500 uppercase tracking-wider">
										Date
									</p>

									<p className="text-sm font-semibold text-slate-200">
										{currentDate}
									</p>

								</div>

							</div>

						</div>

					</div>


					{/* Right status panel */}

					<div className="flex items-center justify-center">

						<div className="
		w-full
		lg:max-w-sm
		rounded-[28px]
		border border-white/[0.08]
		bg-black/20
		backdrop-blur-xl
		overflow-hidden
		relative
	">

							{/* Ambient glow */}

							<div className="
			absolute
			-top-20
			-right-16
			w-40
			h-40
			rounded-full
			bg-emerald-400/10
			blur-[70px]
			pointer-events-none
		"/>

							<div className="
			absolute
			-bottom-20
			-left-20
			w-32
			h-32
			rounded-full
			bg-cyan-400/5
			blur-[60px]
			pointer-events-none
		"/>


							<div className="relative p-5 sm:p-6">

								{/* Header */}

								<div className="flex items-center justify-between">

									<div>

										<p className="
						text-[10px]
						tracking-[3px]
						text-slate-500
						uppercase
					">
											Account Overview
										</p>

										<h3 className="
						text-xl
						sm:text-2xl
						font-black
						text-white
						mt-1
					">
											Your Access
										</h3>

									</div>


									{/* Status icon */}

									<div className="
					relative
					w-12
					h-12
					rounded-2xl
					bg-emerald-400/10
					border border-emerald-400/15
					flex
					items-center
					justify-center
				">

										<div className="
						absolute
						inset-0
						rounded-2xl
						bg-emerald-400/10
						blur-md
					"/>

										<FaShieldAlt className="
						relative
						text-emerald-400
						text-lg
					"/>

									</div>

								</div>


								{/* Status */}

								<div className="
				mt-6
				p-4
				rounded-2xl
				border border-emerald-400/10
				bg-emerald-400/[0.035]
			">

									<div className="flex items-center justify-between">

										<div className="flex items-center gap-3">

											<div className="relative flex">

												<span className="
								absolute
								inline-flex
								w-2.5
								h-2.5
								rounded-full
								bg-emerald-400
								animate-ping
								opacity-50
							"/>

												<span className="
								relative
								inline-flex
								w-2.5
								h-2.5
								rounded-full
								bg-emerald-400
							"/>

											</div>


											<div>

												<p className="
								text-[10px]
								text-slate-500
								uppercase
								tracking-wider
							">
													Account Status
												</p>

												<p className="
								text-sm
								font-bold
								text-emerald-300
								mt-0.5
							">
													{loadedUser?.status
														? "Account Active"
														: "Account Pending"}
												</p>

											</div>

										</div>


										<div className="
						px-2.5
						py-1
						rounded-lg
						bg-emerald-400/10
						border border-emerald-400/10
					">

											<span className="
							text-[9px]
							font-bold
							text-emerald-300
							uppercase
							tracking-wider
						">
												{loadedUser?.status
													? "Verified"
													: "Pending"}
											</span>

										</div>

									</div>

								</div>


								{/* Divider */}

								<div className="
				h-px
				bg-white/[0.06]
				my-5
			"/>


								{/* Information cards */}

								<div className="grid grid-cols-2 gap-3">

									{/* Category */}

									<div className="
					group
					p-4
					rounded-2xl
					bg-white/[0.025]
					border border-white/[0.05]
					hover:bg-emerald-400/[0.035]
					hover:border-emerald-400/10
					transition-all
					duration-300
				">

										<div className="
						flex
						items-center
						justify-between
						mb-3
					">

											<p className="
							text-[9px]
							text-slate-500
							uppercase
							tracking-wider
						">
												Category
											</p>

											<span className="
							text-emerald-400
							text-xs
							opacity-60
							group-hover:opacity-100
							transition-opacity
						">
												●
											</span>

										</div>


										<p className="
						text-sm
						font-bold
						text-emerald-300
						capitalize
						truncate
					">
											{loadedUser?.user_category || "Staff"}
										</p>

									</div>


									{/* Access */}

									<div className="
					group
					p-4
					rounded-2xl
					bg-white/[0.025]
					border border-white/[0.05]
					hover:bg-cyan-400/[0.035]
					hover:border-cyan-400/10
					transition-all
					duration-300
				">

										<div className="
						flex
						items-center
						justify-between
						mb-3
					">

											<p className="
							text-[9px]
							text-slate-500
							uppercase
							tracking-wider
						">
												Access
											</p>

											<span className="
							text-cyan-400
							text-xs
							opacity-60
							group-hover:opacity-100
							transition-opacity
						">
												●
											</span>

										</div>


										<p className="
						text-sm
						font-bold
						text-cyan-300
					">
											{loadedUser?.status
												? "Authorized"
												: "Restricted"}
										</p>

									</div>

								</div>


								{/* Bottom security strip */}

								<div className="
				mt-3
				flex
				items-center
				gap-3
				px-4
				py-3
				rounded-2xl
				bg-white/[0.02]
				border border-white/[0.04]
			">

									<div className="
					w-8
					h-8
					shrink-0
					rounded-xl
					bg-violet-400/10
					border border-violet-400/10
					flex
					items-center
					justify-center
				">

										<FaShieldAlt className="
						text-violet-300
						text-xs
					"/>

									</div>


									<div className="min-w-0">

										<p className="
						text-[10px]
						text-slate-500
						uppercase
						tracking-wider
					">
											Security
										</p>

										<p className="
						text-xs
						font-semibold
						text-slate-300
						mt-0.5
					">
											Your account is protected
										</p>

									</div>


									<div className="ml-auto">

										<div className="
						w-2
						h-2
						rounded-full
						bg-emerald-400
						shadow-[0_0_12px_rgba(52,211,153,.6)]
					"/>

									</div>

								</div>

							</div>

						</div>

					</div>

				</div>

			</section>


			{/* ================================================= */}
			{/* ACCESS */}
			{/* ================================================= */}

			{
				!loadedUser?.status ?

					<div className="
						max-w-7xl
						mx-auto
						mt-6 sm:mt-8
						rounded-[28px]
						border border-amber-400/10
						bg-[#111a17]/70
						backdrop-blur-xl
						p-6 sm:p-8
					">

						<div className="flex flex-col sm:flex-row sm:items-center gap-5">

							<div className="
								w-14 h-14
								shrink-0
								rounded-2xl
								bg-amber-400/10
								border border-amber-400/15
								flex items-center justify-center
							">

								<FaUserClock className="text-amber-400 text-xl" />

							</div>

							<div className="flex-1">

								<h3 className="text-xl font-black">
									Account approval required
								</h3>

								<p className="text-sm text-slate-500 mt-1 leading-6">
									Your account is waiting for administrator
									approval before accessing enterprise features.
								</p>

							</div>

							<Link
								to="/user_request"
								state={{ pathname: location.pathname }}
							>

								<button className="
									w-full sm:w-auto
									px-5
									py-3
									rounded-xl
									bg-gradient-to-r
									from-amber-400
									to-orange-400
									text-[#17100a]
									font-black
									text-sm
									hover:-translate-y-1
									transition-all duration-300
								">
									Request Access
								</button>

							</Link>

						</div>

					</div>

					:

					<div className="
						max-w-7xl
						mx-auto
						mt-6 sm:mt-8
					">

						<div className="flex items-center justify-between mb-4">

							<div>

								<p className="
									text-[10px]
									tracking-[3px]
									text-emerald-400
									uppercase
									font-bold
								">
									Workspace
								</p>

								<h2 className="text-2xl sm:text-3xl font-black mt-1">
									Quick Access
								</h2>

							</div>

						</div>


						<div className="
							grid
							grid-cols-2
							md:grid-cols-3
							lg:grid-cols-5
							gap-3 sm:gap-4
						">

							{/* Attendance */}

							<Link
								to={`/staff/uid_query/${loadedUser?.uid}`}
								state={{ pathname: location.pathname }}
								className="group"
							>

								<div className="
									h-full
									p-4 sm:p-5
									rounded-2xl sm:rounded-3xl
									border border-white/[0.07]
									bg-[#0c1917]/80
									hover:bg-emerald-400/[0.05]
									hover:border-emerald-400/20
									hover:-translate-y-1
									transition-all duration-300
								">

									<FaCalendarCheck className="text-emerald-400 text-xl mb-4" />

									<h3 className="font-bold text-sm sm:text-base">
										Attendance
									</h3>

									<p className="hidden sm:block text-xs text-slate-500 mt-1">
										Manage working hours
									</p>

									<FaArrowRight className="
										mt-4
										text-slate-600
										group-hover:text-emerald-400
										group-hover:translate-x-1
										transition-all
									" />

								</div>

							</Link>


							{/* Client */}

							<Link
								to="/client_corner"
								state={{ pathname: location.pathname }}
								className="group"
							>

								<div className="
									h-full
									p-4 sm:p-5
									rounded-2xl sm:rounded-3xl
									border border-white/[0.07]
									bg-[#0c1917]/80
									hover:bg-cyan-400/[0.05]
									hover:border-cyan-400/20
									hover:-translate-y-1
									transition-all duration-300
								">

									<FaWallet className="text-cyan-400 text-xl mb-4" />

									<h3 className="font-bold text-sm sm:text-base">
										Client Corner
									</h3>

									<p className="hidden sm:block text-xs text-slate-500 mt-1">
										Client management
									</p>

									<FaArrowRight className="
										mt-4
										text-slate-600
										group-hover:text-cyan-400
										group-hover:translate-x-1
										transition-all
									" />

								</div>

							</Link>


							{/* Products */}

							<Link
								to="/products"
								state={{ pathname: location.pathname }}
								className="group"
							>

								<div className="
									h-full
									p-4 sm:p-5
									rounded-2xl sm:rounded-3xl
									border border-white/[0.07]
									bg-[#0c1917]/80
									hover:bg-violet-400/[0.05]
									hover:border-violet-400/20
									hover:-translate-y-1
									transition-all duration-300
								">

									<FaBoxOpen className="text-violet-400 text-xl mb-4" />

									<h3 className="font-bold text-sm sm:text-base">
										Products
									</h3>

									<p className="hidden sm:block text-xs text-slate-500 mt-1">
										Manage inventory
									</p>

									<FaArrowRight className="
										mt-4
										text-slate-600
										group-hover:text-violet-400
										group-hover:translate-x-1
										transition-all
									" />

								</div>

							</Link>


							{/* Transactions */}

							<Link
								to="/daily_transactions"
								state={{ pathname: location.pathname }}
								className="group"
							>

								<div className="
									h-full
									p-4 sm:p-5
									rounded-2xl sm:rounded-3xl
									border border-white/[0.07]
									bg-[#0c1917]/80
									hover:bg-orange-400/[0.05]
									hover:border-orange-400/20
									hover:-translate-y-1
									transition-all duration-300
								">

									<FaReceipt className="text-orange-400 text-xl mb-4" />

									<h3 className="font-bold text-sm sm:text-base">
										Transactions
									</h3>

									<p className="hidden sm:block text-xs text-slate-500 mt-1">
										Daily records
									</p>

									<FaArrowRight className="
										mt-4
										text-slate-600
										group-hover:text-orange-400
										group-hover:translate-x-1
										transition-all
									" />

								</div>

							</Link>


							{/* Admin */}

							{
								loadedUser?.user_category === 'admin' &&

								<Link
									to="/admin"
									state={{ pathname: "/" }}
									className="group"
								>

									<div className="
										h-full
										p-4 sm:p-5
										rounded-2xl sm:rounded-3xl
										border border-white/[0.07]
										bg-[#0c1917]/80
										hover:bg-red-400/[0.05]
										hover:border-red-400/20
										hover:-translate-y-1
										transition-all duration-300
									">

										<FaShieldAlt className="text-red-400 text-xl mb-4" />

										<h3 className="font-bold text-sm sm:text-base">
											Admin
										</h3>

										<p className="hidden sm:block text-xs text-slate-500 mt-1">
											Control center
										</p>

										<FaArrowRight className="
											mt-4
											text-slate-600
											group-hover:text-red-400
											group-hover:translate-x-1
											transition-all
										" />

									</div>

								</Link>

							}

						</div>

					</div>
			}


			{/* Bottom spacing */}

			<div className="h-8 sm:h-12" />

		</div>

	);
};

export default Home;