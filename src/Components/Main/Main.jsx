import React, { useContext, useEffect, useState } from 'react';
import { Link, Links, Outlet, useLocation } from 'react-router-dom';
import { MdOutlineCancel } from "react-icons/md";
import { AuthContext } from '../Provider/AuthProvider';
import Swal from 'sweetalert2';
import useGetUser from '../Hooks/useGetUser';
import useIsAdmin from '../Hooks/useIsAdmin';
import useShopCode from '../Hooks/useShopCode';

const Main = () => {
    const [modal, setModal] = useState(false);
    const [staff, setStaff] = useState({});
    const [isAdmin] = useIsAdmin();
    const [shopCode] = useShopCode();

    const { user, googleSignIn, logOut } = useContext(AuthContext);
    const location = useLocation();
    useEffect(() => {
        if (!user?.email) return;

        fetch('http://localhost:5000/staffs')
            .then(res => res.json())
            .then(data => {
                const findCurrentUser = data.filter(currentUser => currentUser.email === user.email);
                console.log(findCurrentUser[0])
                if (findCurrentUser && findCurrentUser.length > 0) {
                    setStaff(findCurrentUser[0]);
                }
            });
    }, [user]);
    // if (Object.keys(staff).length === 0) {
    //     return <div className="text-center mt-10 text-pink-400">⏳ Loading profile...</div>;
    // }


    const handleGoogleLogin = () => {
        const submitted_shop_code = document.getElementById('submitted_shop_code');
        // const shop_main_code = document.getElementById('shop_main_code');

        if (submitted_shop_code.value === shopCode) {
            googleSignIn()
                .then((result) => {
                    const email = result?.user?.email;
                    const uid = result?.user?.uid;
                    const display_name = result?.user?.displayName;
                    const photo = result?.user?.photoURL
                    setModal(!modal);

                    // 1️⃣ First check if the user is in the staff list
                    fetch(`http://localhost:5000/staff/uid_query/${uid}`)
                        .then(res => res.json())
                        .then(staffData => {
                            if (staffData.length > 0) {
                                // ✅ User is a staff — proceed to profile or dashboard
                                console.log("✅ Logged in as staff:", staffData[0]);
                                // redirect to profile/dashboard if needed
                            } else {
                                // 2️⃣ Check if user request already exists
                                fetch(`http://localhost:5000/user_request_uid/${uid}`)
                                    .then(async res => {
                                        if (!res.ok) {
                                            // request failed (e.g. 404 or 500)
                                            throw new Error("Server error or user not found");
                                        }

                                        // 🔐 Make sure response is not empty before calling .json()
                                        const text = await res.text();
                                        return text ? JSON.parse(text) : null;
                                    })
                                    .then(userRequest => {
                                        if (userRequest) {
                                            console.log("ℹ️ User request already exists:", userRequest);
                                        } else {
                                            // 3️⃣ Insert new request
                                            fetch(`http://localhost:5000/user_request`, {
                                                method: 'POST',
                                                headers: {
                                                    'content-type': 'application/json'
                                                },
                                                body: JSON.stringify({ display_name, email, uid, photo, message: 'You are Waiting for Admin Approval' })
                                            })
                                                .then(res => res.json())
                                                .then(data => {
                                                    console.log("📩 New request submitted:", data);
                                                    Swal.fire({
                                                        position: "center",
                                                        icon: "success",
                                                        title: "User Request Sent Successfully",
                                                        showConfirmButton: false,
                                                        timer: 1000
                                                    });
                                                });
                                        }
                                    });
                            }
                        });
                })
                .catch(error => {
                    console.log('❌ Google login failed:', error);
                });
        } else {
            const doesNotMatched = document.getElementById('doesNotMatched');
            doesNotMatched.classList.remove('hidden')
            console.log('❌ Shop code does not match');
        }

        submitted_shop_code.value = '';
    };

    const handleLogOut = () => {
        logOut()
        location.reload();
    }

    return (
        <div className='bg-linear-to-r from-[#485563] to-[#29322c] min-h-[100vh] px-[10px] pt-[20px]'>
            <div id='shop_code_modal' className={`${!modal ? 'hidden' : 'block'} h-[300px] w-[350px] bg-black shadow-md shadow-pink-200 rounded-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}>
                <div className='flex justify-end -top-[10px] -right-[10px] relative'>
                    <MdOutlineCancel onClick={() => { !setModal(!modal) }} className='text-pink-200 text-3xl cursor-pointer'></MdOutlineCancel>
                </div>
                <div className='text-pink-200 flex flex-col gap-5 p-8 items-center h-full w-full'>
                    <h1 className='text-2xl font-semibold'>Enter The Shop Code</h1>
                    {/* <p id='shop_main_code' className='hidden'>12345</p> */}
                    <div className='px-3 border-2 rounded-xl h-8 shadow-2xl shadow-pink-300  w-full'>
                        <input id='submitted_shop_code' type="password" className='outline-none' />
                    </div>
                    <p id='doesNotMatched' className='text-red-500 hidden'>Shop code does not matched</p>
                    <Link onClick={handleGoogleLogin}><button className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-lg font-semibold mb-5 md:mb-0'>Submit</button></Link>
                </div>
            </div>
            <div className='flex items-center justify-between md:justify-start relative'>
                <Link to="/" className="logo hidden md:block"><b>BIS<span>M</span>ILLAH ENTER<span>P</span>RISE</b></Link>
                <img className='w-[60px] h-[60px] md:hidden' src='https://i.ibb.co/01Zf9m1/logo.png'></img>
                <div className='md:absolute md:right-10 mt-5 md:mt-0'>
                    {
                        user ?
                            <div className='flex items-center gap-5'>
                                <img className='rounded-full h-10 w-10' src={user?.photoURL} alt="" />
                                <Link onClick={handleLogOut}><button className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-3 md:px-5 py-1 rounded-md text-md md:text-lg md:font-semibold'>Logout</button></Link>
                            </div> :
                            <Link><button onClick={() => { setModal(!modal) }} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-3 md:px-5 py-1 rounded-md text-md md:text-lg md:font-semibold'>Staff Login</button></Link>
                    }
                </div>

            </div>
            {
                user && location.pathname == '/' ?
                    <div className='flex items-center justify-center gap-7'>
                        <Link to={staff?._id ? `/staff/${staff?._id}` : '/not_authorized'} state={{ from: `/` }}><button className='mt-8 text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-lg font-semibold'>Staff</button></Link>
                        {
                            isAdmin ?
                                <Link to={`/admin`}><button className='mt-8 text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-lg font-semibold'>Admin</button></Link>
                                : ''
                        }
                    </div> : ''
            }
            <Outlet></Outlet>
        </div>
    );
};

export default Main;