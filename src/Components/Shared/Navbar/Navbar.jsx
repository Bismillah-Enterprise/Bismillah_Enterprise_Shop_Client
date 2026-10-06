import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../Providers/AuthProvider';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdOutlineCancel } from 'react-icons/md';
import Loading from '../Loading/Loading';
import Swal from 'sweetalert2';

const Navbar = () => {
	const { user, googleSignIn, logOut, loading, setLoading } = useContext(AuthContext);
	const [loginLoading, setLoginLoading] = useState(false)
	const [modal, setModal] = useState(false);
	const [isCodeMatched, setIsCodeMatched] = useState(true);
	const inputRef = useRef(null);
	const navigate = useNavigate();
	const location = useLocation();
	const [shopCode, setShopCode] = useState(null);

	const [currentTime, setCurrentTime] = useState(new Date());
	const [clockColor, setClockColor] = useState('#34D399');
	const [colorSerial, setColorSerial] = useState(1);

	const fetchColorPlate = async (serial) => {
		try {
			const response = await fetch(
				`https://bismillah-enterprise-server.onrender.com/colorplate/${serial}`
			);

			if (!response.ok) {
				throw new Error('Color not found');
			}

			const data = await response.json();

			if (data?.color) {
				setClockColor(data.color);
			}

		} catch (error) {
			console.error('Color plate loading failed:', error);
		}
	};

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		let serial = 1;
		fetchColorPlate(serial);
		const colorTimer = setInterval(() => {
			serial += 1;
			if (serial > 3) {
				serial = 1;
			}
			setColorSerial(serial);
			fetchColorPlate(serial);
		}, 60 * 1000);
		return () => clearInterval(colorTimer);
	}, []);

	const formattedTime = currentTime.toLocaleTimeString('en-BD', {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: true,
	});

	const formattedDate = currentTime.toLocaleDateString('en-BD', {
		weekday: 'short',
		month: 'short',
		day: 'numeric',
	});
	const handleOpenModal = () => {
		setModal(!modal)
	}
	useEffect(() => {
		if (modal) {
			// Slight delay ensures input is mounted before focusing
			setTimeout(() => {
				inputRef.current?.focus();
			}, 50);
		}
	}, [modal]);
	const handleLogOut = () => {
		logOut().then(() => {
			setLoading(false);
			if (location.pathname.includes('staffs')) {
				navigate('/')
			}
			else {
				navigate('/')
			}
		})
	}
	const handleLogin = () => {
	setLoginLoading(true)
		const typedShopCode = inputRef.current?.value;
		fetch(`https://bismillah-enterprise-server.onrender.com/shop_code`)
			.then(res => res.json())
			.then(theShopCode => {
				console.log(theShopCode)
				if (typedShopCode === theShopCode?.shop_code) {
					inputRef.current.value = '';
					setModal(!modal);
					googleSignIn()
						.then(userData => {
							if (userData?.user?.uid) {
								fetch(`https://bismillah-enterprise-server.onrender.com/staff/uid_query/${userData?.user?.uid}`)
									.then(res => res.json())
									.then(queryData => {
										if (queryData?.message === 'UID not found') {
											fetch(`https://bismillah-enterprise-server.onrender.com/user_request_uid/${userData?.user?.uid}`)
												.then(res => res.json())
												.then(userRequestData => {
													if (userRequestData?.message === 'UID not found') {
														fetch(`https://bismillah-enterprise-server.onrender.com/user_request`, {
															method: 'POST',
															headers: {
																'content-type': 'application/json'
															},
															body: JSON.stringify({ display_name: userData?.user?.displayName, email: userData?.user?.email, uid: userData?.user?.uid, photo: userData?.user?.photoURL, message: 'You are Waiting for Admin Approval' })
														})
															.then(res => res.json())
															.then(newUserRequest => {
																if (newUserRequest?.acknowledged) {
																	Swal.fire({
																		position: "center",
																		icon: "success",
																		title: "User Request Sent Successfully",
																		showConfirmButton: false,
																		timer: 1000
																	});
																}
																else {
																}
															})
													}
													else {
														Swal.fire({
															position: "center",
															icon: "success",
															title: "You Are Waiting For Admin Approval",
															showConfirmButton: false,
															timer: 1000
														});
													}
												})
										}
										else {
											Swal.fire({
												position: "center",
												icon: "success",
												title: "Login Successfully",
												showConfirmButton: false,
												timer: 1000
											});
										}
										setLoginLoading(false);
										setModal(!modal);
									})
							}
							setLoginLoading(false);
							setModal(!modal);
						})
				}
				else {
					inputRef.current.value = '';
					setIsCodeMatched(false);
					setLoginLoading(false);
				}
			})
	}
	return (
		<>
			{/* ================================================= */}
			{/* SHOP CODE MODAL */}
			{/* ================================================= */}

			<div
				className={`
					${!modal ? 'opacity-0 pointer-events-none' : 'opacity-100'}
					fixed inset-0 z-[100]
					flex items-center justify-center
					p-4
					bg-black/60 backdrop-blur-md
					transition-all duration-300
				`}
			>

				<div
					className={`
						w-full max-w-md
						rounded-[30px]
						border border-emerald-400/20
						bg-[#0b1917]/95
						backdrop-blur-2xl
						shadow-[0_30px_100px_rgba(0,0,0,.65)]
						overflow-hidden
						transform
						${modal ? 'scale-100 translate-y-0' : 'scale-95 translate-y-5'}
						transition-all duration-300
					`}
				>

					<div
						className="relative h-1"
						style={{
							background: `linear-gradient(90deg, ${clockColor}, #22d3ee, #8b5cf6)`
						}}
					/>

					<div className="p-6 sm:p-8">

						<div className="flex justify-between items-start mb-7">

							<div>

								<p
									className="text-[11px] uppercase tracking-[4px]"
									style={{ color: clockColor }}
								>
									Bismillah Enterprise
								</p>

								<h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
									Staff Login
								</h2>

							</div>

							<button
								onClick={() => setModal(!modal)}
								className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-500/10 hover:border-red-400/20 transition-all"
							>
								<MdOutlineCancel className="text-2xl" />
							</button>

						</div>

						<div
							className="rounded-2xl border p-4 mb-6"
							style={{
								borderColor: `${clockColor}20`,
								backgroundColor: `${clockColor}08`
							}}
						>

							<p className="text-xs text-slate-500 uppercase tracking-wider">
								Current Shop Code
							</p>

							<p
								className="text-lg font-bold mt-1 tracking-[4px]"
								style={{ color: clockColor }}
							>
								{shopCode}
							</p>

						</div>

						<div>

							<label className="block text-sm font-semibold text-slate-300 mb-2">
								Enter Access Code
							</label>

							<input
								type="password"
								ref={inputRef}
								className="
									w-full
									h-12
									px-4
									rounded-xl
									bg-white/[0.04]
									border border-white/10
									text-white
									outline-none
									focus:border-emerald-400/50
									focus:ring-4
									focus:ring-emerald-400/10
									transition-all
								"
								onChange={() => setIsCodeMatched(true)}
							/>

						</div>

						<p
							className={`
								text-red-400 text-sm mt-3
								${isCodeMatched ? 'hidden' : 'block'}
							`}
						>
							Shop code does not match.
						</p>

						<button
							onClick={handleLogin}
							className="
								w-full
								mt-6
								h-12
								rounded-xl
								text-[#06110f]
								font-black
								hover:-translate-y-0.5
								transition-all duration-300
							"
							style={{
								background: `linear-gradient(90deg, ${clockColor}, #22d3ee, #8b5cf6)`,
								boxShadow: `0 10px 35px ${clockColor}25`
							}}
						>
							{loginLoading ? 'Loading . . .' : 'Continue'}
						</button>

					</div>

				</div>

			</div>


			{/* ================================================= */}
			{/* NAVBAR */}
			{/* ================================================= */}

			<nav
				className="
					relative
					mx-2 sm:mx-4 lg:mx-6
					mt-3 sm:mt-4
					rounded-2xl sm:rounded-[24px]
					border border-white/[0.08]
					bg-[#0a1715]/75
					backdrop-blur-2xl
					shadow-[0_15px_50px_rgba(0,0,0,.3)
				"
			>

				{/* top gradient line */}

				<div
					className="absolute top-0 left-[10%] right-[10%] h-px transition-all duration-1000"
					style={{
						background: `linear-gradient(90deg, transparent, ${clockColor}, transparent)`
					}}
				/>

				<div className="
					min-h-[76px] sm:min-h-[84px]
					px-4 sm:px-6 lg:px-8
					py-3
					flex items-center justify-between gap-3
				">

					{/* Logo */}

					<Link
						to="/"
						className="group flex items-center gap-3 shrink-0"
					>

						<div
							className="
								w-12 h-12
								sm:w-14 sm:h-14
								rounded-2xl
								p-[1.5px]
								shadow-[0_8px_30px_rgba(45,212,191,0.18)]
								group-hover:scale-105
								transition-all duration-300
							"
							style={{
								background: `linear-gradient(135deg, ${clockColor}, #22d3ee, #8b5cf6)`
							}}
						>
							<div
								className="w-full h-full rounded-[14px] bg-[#071311] flex items-center justify-center relative overflow-hidden"
							>

								<div
									className="absolute inset-0 opacity-20"
									style={{
										background: `radial-gradient(circle at center, ${clockColor}, transparent 70%)`
									}}
								/>

								<img
									src="https://i.ibb.co/01Zf9m1/logo.png"
									alt="Bismillah Enterprise"
									className="
										relative z-10
										w-9 h-9
										sm:w-10 sm:h-10
										object-contain
										drop-shadow-[0_0_10px_rgba(45,212,191,0.25)]
									"
								/>

							</div>
						</div>

						<div className="hidden lg:block">

							<p
								className="text-[9px] sm:text-[10px] tracking-[4px] font-bold uppercase transition-colors duration-700"
								style={{ color: clockColor }}
							>
								Management System
							</p>

							<h1 className="text-base sm:text-lg font-black text-white tracking-wide">
								BISMILLAH <span style={{ color: clockColor }}>ENTERPRISE</span>
							</h1>

						</div>

					</Link>


					{/* ================================================= */}
					{/* LIVE CLOCK */}
					{/* ================================================= */}

					<div
						className="
							flex-1
							flex
							justify-center
							min-w-0
						"
					>

						<div
							className="
								group relative
								overflow-hidden
								rounded-xl sm:rounded-2xl
								border
								bg-[#0b1b18]/70
								backdrop-blur-xl
								px-3 sm:px-5
								py-2
								text-center
								transition-all duration-700
							"
							style={{
								borderColor: `${clockColor}30`,
								boxShadow: `0 0 30px ${clockColor}0d`
							}}
						>

							{/* Clock glow */}

							<div
								className="pointer-events-none absolute -right-8 -top-8 h-16 w-16 rounded-full blur-2xl opacity-20 transition-all duration-1000"
								style={{ backgroundColor: clockColor }}
							/>

							<div
								className="relative text-sm sm:text-lg lg:text-xl font-bold tracking-wide whitespace-nowrap transition-colors duration-700"
								style={{
									color: clockColor,
									textShadow: `0 0 15px ${clockColor}35`
								}}
							>
								{formattedTime}
							</div>

							<div className="relative text-[8px] sm:text-[10px] text-cyan-100/60 whitespace-nowrap">
								{formattedDate}
							</div>

						</div>

					</div>


					{/* User section */}

					<div className="shrink-0">

						{
							user ?

								<div className="flex items-center gap-2 sm:gap-4">

									<div className="
										hidden lg:flex
										items-center gap-3
										px-3 py-2
										rounded-xl
										border border-white/[0.06]
										bg-white/[0.025]
									">

										<div className="relative">

											<img
												className="
													rounded-full
													h-9 w-9
													object-cover
													border
												"
												style={{ borderColor: `${clockColor}50` }}
												src={user?.photoURL}
												alt=""
											/>

											<span
												className="
													absolute
													bottom-0 right-0
													w-2.5 h-2.5
													rounded-full
													border-2
													border-[#0a1715]
												"
												style={{ backgroundColor: clockColor }}
											/>

										</div>

										<div className="max-w-[130px]">

											<p className="text-xs text-slate-500">
												Welcome back
											</p>

											<p className="text-sm font-semibold text-white truncate">
												{user?.displayName || "Staff"}
											</p>

										</div>

									</div>

									<button
										onClick={handleLogOut}
										className="
											px-3 sm:px-5
											h-10 sm:h-11
											rounded-xl
											border border-red-400/15
											bg-red-400/[0.04]
											text-red-300
											text-xs sm:text-sm
											font-bold
											hover:bg-red-500/10
											hover:border-red-400/30
											hover:-translate-y-0.5
											transition-all duration-300
										"
									>
										Logout
									</button>

								</div>

								:

								<button
									onClick={() => handleOpenModal(modal)}
									className="
										h-10 sm:h-11
										px-3 sm:px-6
										rounded-xl
										text-[#06110f]
										font-black
										text-xs sm:text-sm
										shadow-[0_8px_30px_rgba(45,212,191,.15)]
										hover:-translate-y-0.5
										transition-all duration-300
									"
									style={{
										background: `linear-gradient(90deg, ${clockColor}, #22d3ee)`
									}}
								>
									Staff Login
								</button>
						}

					</div>

				</div>

			</nav>

		</>
	);
};

export default Navbar;