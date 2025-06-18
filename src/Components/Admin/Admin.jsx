import React from 'react';
import { Link, Outlet, useLoaderData } from 'react-router-dom';

const Admin = () => {
    const allStaffs = useLoaderData();
    return (
        <div className='flex gap-5 items-start justify-center w-full text-pink-200 mt-10'>

            <div className='min-h-fit w-[28%] rounded-2xl shadow-lg shadow-pink-300 flex gap-5 flex-col items-center'>
                <Link to={"/"} className='w-full shadow-md hover:shadow-pink-400 rounded-t-2xl shadow-pink-300 py-3 font-semibold text-center cursor-pointer'>
                    Home
                </Link>
                <Link to={"/admin/user_request"} className='w-full shadow-md hover:shadow-pink-400 shadow-pink-300 py-3 font-semibold text-center cursor-pointer'>
                    User Request
                </Link>
                <Link to={"/admin/user_account_manipulation"} className='w-full shadow-md hover:shadow-pink-400 shadow-pink-300 py-3 font-semibold text-center cursor-pointer'>
                    User Account Manipulation
                </Link>
                <Link to={"/admin/staff_manipulation"} className='w-full shadow-md hover:shadow-pink-400 shadow-pink-300 py-3 font-semibold text-center cursor-pointer'>
                    Staff Manipulation
                </Link>
                <Link to={"/admin/notice_panel"} className='rounded-b-2xl w-full shadow-md hover:shadow-pink-400 shadow-pink-300 py-3 font-semibold text-center cursor-pointer'>
                    Notice Panel
                </Link>
            </div>
            <div className='min-h-[60vh] w-[68%] rounded-2xl shadow-lg shadow-pink-300 flex items-center justify-center'>
                <Outlet></Outlet>
            </div>

            {/* {
                allStaffs.map(staff => <div key={staff._id}>{staff.name}</div>)
            } */}
        </div>
    );
};

export default Admin;