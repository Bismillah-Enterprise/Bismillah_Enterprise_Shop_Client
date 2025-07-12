import React, { useEffect } from 'react';

const RevenueTransectionsDetials = () => {
    const now = new Date();
    const Time = now.toLocaleTimeString('en-BD', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
    const currentDayName = now.toLocaleDateString('en-BD', { weekday: 'long' });
    const currentDate = now.toLocaleDateString('en-BD', {
        day: 'numeric',
        year: 'numeric',
        month: 'long',
    });
    const parseTime = (timeStr) => {
        if (!timeStr) return null;
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        return hours * 60 + minutes;
    };

    console.log(parseTime('8:30 AM'));

    useEffect(() => {
        fetch(`https://bismillah-enterprise-server.onrender.com/staff_bonus`)
            .then(response => response.json())
            .then(bonusData => {
                console.log(bonusData[0].first_entry.time);
            })
    }, [])
    let totalMinutes = 0;
    return (
        <div>

        </div>
    );
};

export default RevenueTransectionsDetials;