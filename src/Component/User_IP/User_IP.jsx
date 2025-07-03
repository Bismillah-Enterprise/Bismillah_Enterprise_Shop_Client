import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2'
import useGetWifiIp from '../Hooks/useGetWifiIp';

const User_IP = () => {
    const [allowed, setAllowed] = useState(false);
    const [wifiIp] = useGetWifiIp();
    console.log(wifiIp)
    const [isSetIp, setIsSetIp] = useState(false);

    const handleShowWifiIp = () => {
        const ipText = document.getElementById('wifi_ip_text');
        ipText.innerText = wifiIp
        setIsSetIp(true);
    }

    const handleSetWifiIP = () => {
        const getIp = document.getElementById('wifi_ip_text');
        const wifi_ip = getIp.innerText;
        const updatedWifiIp = { wifi_ip };
        const _id = import.meta.env.VITE_wifi_ip_object_id;
        console.log(_id)
        console.log(updatedWifiIp)

        fetch(`http://localhost:5000/set_ip/${_id}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(updatedWifiIp)
        })
            .then(res => res.json())
            .then(data => {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Wi-fi IP update successfully",
                    showConfirmButton: false,
                    timer: 1000
                });
                const ipText = document.getElementById('wifi_ip_text');
                ipText.innerText = 'Click the button below to view your WiFi IP'
                setIsSetIp(!isSetIp);
            })
    }

    console.log(wifiIp);

    return (
        <div className='text-white'>
            <div className=''>
                <div className='w-[500px] mb-5 flex items-center gap-5'>
                    <p id='wifi_ip_text' className='text-2xl'>Click the button below to view your WiFi IP</p>
                </div>
                <div className='flex items-center gap-8'>
                    <button onClick={handleShowWifiIp} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-lg font-semibold'>Show IP Address</button>
                    <button onClick={handleSetWifiIP} disabled={!isSetIp ? true : false} className={`disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed disabled:border-2 disabled:border-gray-400 text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-lg font-semibold`}>Set The IP For Shop</button>
                </div>
            </div>
        </div>
    );
};

export default User_IP;