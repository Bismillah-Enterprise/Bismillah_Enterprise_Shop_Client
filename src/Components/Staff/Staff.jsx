import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Provider/AuthProvider';
import { useLoaderData, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import Clock from '../Clock/Clock';


const Staff = () => {
    const [disabled, setDisabled] = useState(false);
    const staff = useLoaderData();
    const { _id, name, hour_rate, today_enter1_time, today_exit1_time, today_enter2_time, today_exit2_time } = staff[0];
    const [userIP, setUserIP] = useState('')
    const [isAllowed, setIsAllowed] = useState(false);
    const now = new Date();

    // Format time and date

    const Time = now.toLocaleTimeString('en-BD', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

    const currentDayName = now.toLocaleDateString('en-BD', {
        weekday: 'long',
    });

    const currentDate = now.toLocaleDateString('en-BD', {
        day: 'numeric',
        year: 'numeric',
        month: 'long',
    });

    useEffect(() => {
        const now = new Date();
        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0); // 12:00 AM next day

        const timeUntilMidnight = midnight.getTime() - now.getTime();

        const midnightAction = () => {
            console.log('🎉 It is 12:00 AM! Taking action...');

            // 👉 Do whatever you want here:
            // For example, refresh user data, reset daily time logs, etc.
            // You can even call a backend API here if needed
        };

        // Wait until midnight first time
        const timeoutId = setTimeout(() => {
            midnightAction();

            // Then repeat every 24 hours
            const intervalId = setInterval(midnightAction, 24 * 60 * 60 * 1000);

            // Cleanup interval on unmount
            return () => clearInterval(intervalId);
        }, timeUntilMidnight);

        // Cleanup timeout on unmount
        return () => clearTimeout(timeoutId);
    }, []);

    useEffect(() => {
        fetch('http://localhost:5000/get_network_ip')
            .then(res => res.json())
            .then(data => {
                setUserIP(data.ip)
            })
    }, [])

    useEffect(() => {
        fetch('http://localhost:5000/set_ip')
            .then(res => res.json())
            .then(data => {
                const ip = data[0].wifi_ip
                if (userIP == ip) {
                    setIsAllowed(true);
                }
                else {
                    setIsAllowed(false);
                }
            })
    }, []);


    const handleTodayTime = (name, id) => {
        const updatedTime = { name, clickedTime: Time }
        console.log(updatedTime)
        fetch(`http://localhost:5000/staffs_daily_time/${id}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(updatedTime)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "saved time",
                    showConfirmButton: false,
                    timer: 1000
                });
                location.reload();
            })
    }
    return (
        <div>
            <Clock></Clock>
            <div>
                <h1 className='text-2xl text-center text-pink-200 mt-5 font-semibold'>{name} - Hour Rate: {hour_rate}</h1>
            </div>
            <div className='flex items-center gap-10 justify-center mt-10'>
                <button disabled={today_enter1_time == '' ? false : true} onClick={() => handleTodayTime('today_enter1_time', _id)} className='disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-60 rounded-full h-[100px] w-[100px] shadow-md shadow-pink-200 border-none text-pink-200 text-lg cursor-pointer hover:shadow-lg'>Enter 1</button>
                <button disabled={today_exit1_time == '' ? false : true} onClick={() => handleTodayTime('today_exit1_time', _id)} className='disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-60 rounded-full h-[100px] w-[100px] shadow-md shadow-pink-200 border-none text-pink-200 text-lg cursor-pointer hover:shadow-lg'>Exit 1</button>
                <button disabled={today_enter2_time == '' ? false : true} onClick={() => handleTodayTime('today_enter2_time', _id)} className='disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-60 rounded-full h-[100px] w-[100px] shadow-md shadow-pink-200 border-none text-pink-200 text-lg cursor-pointer hover:shadow-lg'>Enter 2</button>
                <button disabled={today_exit2_time == '' ? false : true} onClick={() => handleTodayTime('today_exit2_time', _id)} className='disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-60 rounded-full h-[100px] w-[100px] shadow-md shadow-pink-200 border-none text-pink-200 text-lg cursor-pointer hover:shadow-lg'>Exit 2</button>
            </div>
            <div className='flex items-center justify-center mt-10'>
                <table className='text-pink-200 w-[70%]'>
                    <tr>
                        <th>Date</th>
                        <th>Day Name</th>
                        <th>Enter 1</th>
                        <th>Exit 1</th>
                        <th>Enter 2</th>
                        <th>Exit 2</th>
                    </tr>
                    <tr>
                        <td id='today_date'>{currentDate}</td>
                        <td id='today_day_name'>{currentDayName}</td>
                        <td id='enter1_time'>{today_enter1_time}</td>
                        <td id='exit1_time'>{today_exit1_time}</td>
                        <td id='enter2_time'>{today_enter2_time}</td>
                        <td id='exit2_time'>{today_exit2_time}</td>
                    </tr>
                </table>
            </div>
        </div>
    );
};

export default Staff;