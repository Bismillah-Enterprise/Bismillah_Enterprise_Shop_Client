import React from 'react';
import { useLoaderData } from 'react-router-dom';
import Swal from 'sweetalert2';

const UserRequest = () => {
    const userRequest = useLoaderData();
    const handleApprove = () => {
        const userAllData = {
            "name": "Robiul Hasan",
            "email": "bismillah786e@gmail.com",
            "hour_rate": 18,
            "total_income": 0,
            "total_working_hour": "0-0",
            "current_working_month": "June",
            "current_month_details": [

            ],
            "income_history": [

            ],
            "user_category": "admin",
            "today_enter1_time": "",
            "today_enter2_time": "",
            "today_exit1_time": "",
            "today_exit2_time": "",
            "uid": ""
        }
    }
    const handleReject = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, reject it!"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`https://shop-manager-server.onrender.com/user_request/${id}`, {
                    method: 'DELETE'
                }).then(res => res.json())
                Swal.fire({
                    title: "Rejected!",
                    text: "This Person has been rejected.",
                    icon: "success"
                }).then(() => {
                    window.location.reload();
                })
            }
        });
    }
    return (
        <div className='w-full h-full p-5 flex flex-col gap-5'>
            <h1 className='font-semibold text-2xl'>User Requests</h1>
            {
                userRequest.map(user =>
                    <div key={user._id}>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-5'>
                                <img src={user.photo} className='rounded-full w-14 h-14' alt="not uploaded" />
                                <h1>{user.display_name}</h1>
                            </div>
                            <h1>{user.email}</h1>
                            <div className='flex gap-4'>
                                <button onClick={handleApprove} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-lg font-semibold'>Approve</button>
                                <button onClick={() => { handleReject(user._id) }} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-lg font-semibold'>Reject</button>
                            </div>
                        </div>
                    </div>)
            }
        </div>
    );
};

export default UserRequest;