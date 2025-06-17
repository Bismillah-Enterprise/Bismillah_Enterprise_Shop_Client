import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2'

const User_IP = () => {
    const [allowed, setAllowed] = useState(false);
    const [wifiIp, setWifiIp] = useState(null);
    const [isSetIp, setIsSetIp] = useState(false);

    useEffect(() => {
        fetch('http://localhost:5000/get_network_ip')
            .then(res => res.json())
            .then(data => {
                setWifiIp(data.ip);
            })
    }, [])

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
            })
    }

    console.log(wifiIp);

    return (
        <div className='text-white'>
            <div className=''>
                <div className='w-[500px] mb-5 flex items-center gap-5'>
                    <p id='wifi_ip_text' className='text-2xl'>Click the button below to view your WiFi IP</p>
                    <button onClick={handleSetWifiIP} className={`${!isSetIp ? 'hidden' : 'block'} border-2 border-yellow-400 px-4 py-2 rounded-2xl cursor-pointer`}>Set The IP For Shop</button>
                </div>
                <button onClick={handleShowWifiIp} className='border-2 border-yellow-400 px-4 py-2 rounded-2xl cursor-pointer'>Show IP Address</button>
            </div>
        </div>
    );
};

export default User_IP;