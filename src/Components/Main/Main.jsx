import React, { useContext, useEffect, useState } from 'react';
import Home from '../Home/Home';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { MdOutlineCancel } from "react-icons/md";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import auth from '../../firebase/firebase.init';
import { AuthContext } from '../Provider/AuthProvider';
import Swal from 'sweetalert2';

const Main = () => {
    const [modal, setModal] = useState(false);
    const [staff, setStaff] = useState({});
    const { _id } = staff;
    const { user, googleSignIn, logOut } = useContext(AuthContext);
    const location = useLocation();

    useEffect(() => {
        fetch('http://localhost:5000/staffs')
            .then(res => res.json())
            .then(data => {
                console.log(data)
                const findCurrentUser = data.filter(currentUser => currentUser.email == user.email);
                if (findCurrentUser && findCurrentUser.length > 0) {
                    setStaff(findCurrentUser[0]);
                }
            })
    }, [user]);
    if (!staff) {
        return <div className="text-center mt-10 text-pink-400">⏳ Loading profile...</div>;
    }

    const handleGoogleLogin = () => {
        const submitted_shop_code = document.getElementById('submitted_shop_code');
        const shop_main_code = document.getElementById('shop_main_code');

        if (submitted_shop_code.value === shop_main_code.innerText) {
            googleSignIn()
                .then((result) => {
                    const email = result?.user?.email;
                    const name = result?.user?.displayName;
                    setModal(!modal);

                    // 1️⃣ First check if the user is in the staff list
                    fetch(`http://localhost:5000/staff/${name}`)
                        .then(res => res.json())
                        .then(staffData => {
                            if (staffData.length > 0) {
                                // ✅ User is a staff — proceed to profile or dashboard
                                console.log("✅ Logged in as staff:", staffData[0]);
                                // redirect to profile/dashboard if needed
                            } else {
                                // 2️⃣ Check if user request already exists
                                fetch(`http://localhost:5000/user_request/${email}`)
                                    .then(res => res.json())
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
                                                body: JSON.stringify({ name, email, message: 'You are Waiting for Admin Approval' })
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
            console.log('❌ Shop code does not match');
        }

        submitted_shop_code.value = '';
    };

    const handleLogOut = () => {
        logOut()
            .then(() => {
                location.reload();
            })
    }

    return (
        <div className='bg-linear-to-r from-[#485563] to-[#29322c] min-h-[100vh] px-[10px] pt-[20px]'>
            <div id='shop_code_modal' className={`${!modal ? 'hidden' : 'block'} h-[250px] w-[300px] bg-black shadow-md shadow-pink-200 rounded-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}>
                <div className='flex justify-end -top-[10px] -right-[10px] relative'>
                    <MdOutlineCancel onClick={() => { !setModal(!modal) }} className='text-pink-200 text-3xl cursor-pointer'></MdOutlineCancel>
                </div>
                <div className='text-pink-200 flex flex-col gap-5 p-8 items-center h-full w-full'>
                    <h1 className='text-2xl font-semibold'>Enter The Shop Code</h1>
                    <p id='shop_main_code' className='hidden'>12345</p>
                    <div className='px-3 border-2 rounded-xl h-8 shadow-2xl shadow-pink-300 mb-2 w-full'>
                        <input id='submitted_shop_code' type="password" className='outline-none' />
                    </div>
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
                        <Link to={`/staff/${_id}`}><button className='mt-8 text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-lg font-semibold'>Staff</button></Link>
                        {
                            staff?.user_category == 'admin' ?
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