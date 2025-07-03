import React, { useEffect, useState } from 'react';

const Clock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer); // cleanup
    }, []);

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



    return (
        <div>
            <div className="text-center mt-5">
                <h2 className="text-3xl font-bold text-pink-200">{formattedTime}</h2>
                <p className="text-lg text-pink-100">{formattedDate}</p>
            </div>
        </div>
    );
};

export default Clock;