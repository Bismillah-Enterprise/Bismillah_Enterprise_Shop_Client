import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../Providers/AuthProvider';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdOutlineCancel } from 'react-icons/md';
import Loading from '../Loading/Loading';
import Swal from 'sweetalert2';

const Navbar = () => {
	const { user, googleSignIn, logOut, loading, setLoading } = useContext(AuthContext);
	const [modal, setModal] = useState(false);
	const [isCodeMatched, setIsCodeMatched] = useState(true);
	const inputRef = useRef(null);
	const navigate = useNavigate();
	const location = useLocation();
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
		setLoading(true)
		const typedShopCode = inputRef.current?.value;
		fetch(`https://shop-manager-server.onrender.com/shop_code/${import.meta.env.VITE_shop_code_object_id}`)
			.then(res => res.json())
			.then(theShopCode => {
				if (typedShopCode === theShopCode[0]?.shop_code) {
					inputRef.current.value = '';
					setModal(!modal);
					googleSignIn()
						.then(userData => {
							if (userData?.user?.uid) {
								fetch(`https://shop-manager-server.onrender.com/staff/uid_query/${userData?.user?.uid}`)
									.then(res => res.json())
									.then(queryData => {
										if (queryData?.message === 'UID not found') {
											fetch(`https://shop-manager-server.onrender.com/user_request_uid/${userData?.user?.uid}`)
												.then(res => res.json())
												.then(userRequestData => {
													if (userRequestData?.message === 'UID not found') {
														fetch(`https://shop-manager-server.onrender.com/user_request`, {
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
																	console.log('Something is Wrong');
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
										setLoading(false);
										setModal(!modal);
									})
							}
							setLoading(false);
							setModal(!modal);
						})
				}
				else {
					inputRef.current.value = '';
					setIsCodeMatched(false);
					setLoading(false);
				}
			})
	}
	return (
		<div>
			{/* ------------ Modal ---------------- */}
			< div id='shop_code_modal' className={`${!modal ? 'hidden' : 'block'} h-[300px] w-[350px] bg-black shadow-md shadow-pink-200 rounded-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50`
			}>
				<div>
					<div className='flex justify-end -top-[10px] -right-[10px] relative'>
						<MdOutlineCancel onClick={() => { !setModal(!modal) }} className='text-pink-200 text-3xl cursor-pointer'></MdOutlineCancel>
					</div>
					<div className='text-pink-200 flex flex-col gap-5 p-8 items-center h-full w-full'>
						<h1 className='text-2xl font-semibold'>Enter The Shop Code</h1>
						{/* <p id='shop_main_code' className='hidden'>12345</p> */}
						<div className='px-3 border-2 rounded-xl h-8 shadow-2xl shadow-pink-300  w-full'>
							<input type="password" ref={inputRef} className='outline-none' />
						</div>
						<p id='doesNotMatched' className={`text-red-500 ${isCodeMatched ? 'hidden' : ''}`}>Shop code does not matched</p>
						<button onClick={handleLogin} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md md:text-lg font-semibold mb-5 md:mb-0'>Submit</button>
					</div>
				</div>

			</div >
			{/* --------------- End Modal ------------------------- */}
			< div className='flex items-center justify-between md:justify-start relative py-5 px-5' >
				<Link to="/" className="logo hidden md:block"><b>BIS<span>M</span>ILLAH ENTER<span>P</span>RISE</b></Link>
				<Link to={'/'}><img className='w-[60px] h-[60px] md:hidden' src='https://i.ibb.co/01Zf9m1/logo.png'></img></Link>
				<div className='md:absolute md:right-10'>
					{
						user ?
							<div className='flex items-center gap-5'>
								<img className='rounded-full h-10 w-10' src={user?.photoURL} alt="" />
								<Link onClick={handleLogOut}><button className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-3 md:px-5 py-1 rounded-md text-md md:text-lg font-semibold'>Logout</button></Link>
							</div> :
							<Link><button onClick={handleOpenModal} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-3 md:px-5 py-1 rounded-md text-md md:text-lg md:font-semibold'>Staff Login</button></Link>
					}
				</div>

			</div >
		</div>
	);
};

export default Navbar;