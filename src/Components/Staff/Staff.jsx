import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Provider/AuthProvider';
import { useLocation } from 'react-router-dom';


const Staff = () => {
    const [disabled, setDisabled] = useState(false);
    const { user } = useContext(AuthContext);
    const [staff, setStaff] = useState({});
    const [userIP, setUserIP] = useState('')
    const [permanentIP, setPermanentIP] = useState('')
    const [isAllowed, setIsAllowed] = useState(false);
    const [loading, setLoading] = useState(false);

    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer); // cleanup
    }, []);

    // Format time and date
    const formattedTime = time.toLocaleTimeString('en-BD', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });

    const formattedDate = time.toLocaleDateString('en-BD', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    useEffect(() => {
        fetch('http://localhost:5000/staffs')
            .then(res => res.json())
            .then(data => {
                console.log(data)
                const findCurrentUser = data.filter(currentUser => currentUser.email == user.email);
                setStaff(findCurrentUser[0]);
            })
    }, [user]);

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
                // setPermanentIP(ip);
                if (userIP == ip) {
                    setIsAllowed(true);
                }
                else {
                    setIsAllowed(false);
                }
            })
    }, []);


    const handleEnter1 = () => {
        setDisabled(true);
        // Do something here...
        console.log("Button clicked");
    };
    return (
        <div>
            <div>
                <h1 className='text-2xl text-center text-pink-200 mt-5 font-semibold'>{staff?.name} - Hour Rate: {staff?.hour_rate}</h1>
            </div>
            <div className="text-center mt-5">
                <h2 className="text-3xl font-bold text-pink-200">{formattedTime}</h2>
                <p className="text-lg text-pink-100">{formattedDate}</p>
            </div>
            <div className='flex items-center gap-10 justify-center mt-10'>
                <button onClick={handleEnter1}
                    disabled={disabled && !isAllowed} className={`rounded-full h-[100px] w-[100px] shadow-md shadow-pink-200 border-none text-pink-200 text-lg  ${disabled
                        ? 'bg-gray-400 cursor-not-allowed opacity-60'
                        : 'bg-transparent hover:shadow-lg'}`}>Enter 1</button>
                <button className='rounded-full h-[100px] w-[100px] shadow-md shadow-pink-200 border-none text-pink-200 text-lg cursor-pointer hover:shadow-lg'>Exit 1</button>
                <button className='rounded-full h-[100px] w-[100px] shadow-md shadow-pink-200 border-none text-pink-200 text-lg cursor-pointer hover:shadow-lg'>Enter 2</button>
                <button className='rounded-full h-[100px] w-[100px] shadow-md shadow-pink-200 border-none text-pink-200 text-lg cursor-pointer hover:shadow-lg'>Exit 2</button>
            </div>
        </div>
    );
};

export default Staff;