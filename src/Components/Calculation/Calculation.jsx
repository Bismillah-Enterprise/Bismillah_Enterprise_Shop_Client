import React from 'react';

const Calculation = () => {

    const getTime = (id) => {
        const el = document.getElementById(id);
        if (el && el.value !== '') {
            const parts = el.value.split('-');
            return {
                hour: parseInt(parts[0] || '0', 10),
                minute: parseInt(parts[1] || '0', 10)
            };
        }
        return { hour: 0, minute: 0 };
    };

    const hourCalculation = () => {
        const enter1 = getTime('enter1');
        const exit1 = getTime('exit1');
        const enter2 = getTime('enter2');
        const exit2 = getTime('exit2');

        // Convert all times to total minutes
        const enter1_total = enter1.hour * 60 + enter1.minute;
        const exit1_total = exit1.hour * 60 + exit1.minute;
        const enter2_total = enter2.hour * 60 + enter2.minute;
        const exit2_total = exit2.hour * 60 + exit2.minute;

        // Calculate total minutes
        let total_minutes = (exit1_total - enter1_total) + (exit2_total - enter2_total);

        if (total_minutes < 0) {
            total_minutes = 0; // Prevent negative results if inputs are reversed or invalid
        }

        const total_hour = Math.floor(total_minutes / 60);
        const total_minute = total_minutes % 60;
        const total_time = document.getElementById('total_time');
        total_time.value = `${total_hour}-${total_minute}`
    };

    const amount_calculation = () => {
        const total_time = document.getElementById('total_time');
        const hour_rate = document.getElementById('hour_rate');
        const bonus = document.getElementById('bonus');
        const fine = document.getElementById('fine');

        // Parse time
        const [hourStr, minuteStr] = total_time.value.split('-');
        const hours = parseInt(hourStr || '0', 10);
        const minutes = parseInt(minuteStr || '0', 10);

        // Convert total time to decimal hours
        const totalHours = hours + (minutes / 60);

        // Parse other inputs
        const rate = parseFloat(hour_rate.value) || 0;
        const bonusAmount = parseFloat(bonus.value) || 0;
        const fineAmount = parseFloat(fine.value) || 0;

        // Calculate total amount
        let total_amount = (totalHours * rate) + bonusAmount - fineAmount;

        // Format and return
        total_amount = Math.round(total_amount * 100) / 100;
        const totalAmount = document.getElementById('total_amount');
        totalAmount.value = total_amount.toFixed(2);
    }

    const resetFields = () => {
        const fields = ['enter1', 'exit1', 'enter2', 'exit2', 'total_time', 'bonus', 'fine', 'total_amount'];
        fields.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
    };


    return (
        <div>
            <div className='text-white flex items-center justify-center gap-10 mt-20'>
                <div className='w-[100px]'>
                    <p className='mb-2'>Enter-1</p>
                    <input id='enter1' type="text" placeholder='HH-MM' className='border-white px-3 py-2 border-2 rounded-xl h-7 shadow-2xl shadow-pink-300 mb-5 w-full' />
                </div>
                <div className='w-[100px]'>
                    <p className='mb-2'>Exit-1</p>
                    <input id='exit1' type="text" placeholder='HH-MM' className='border-white px-3 py-2 border-2 rounded-xl h-7 shadow-2xl shadow-pink-300 mb-5 w-full' />
                </div>
                <div className='w-[100px]'>
                    <p className='mb-2'>Enter-2</p>
                    <input id='enter2' type="text" placeholder='HH-MM' className='border-white px-3 py-2 border-2 rounded-xl h-7 shadow-2xl shadow-pink-300 mb-5 w-full' />
                </div>
                <div className='w-[100px]'>
                    <p className='mb-2'>Exit-2</p>
                    <input id='exit2' type="text" placeholder='HH-MM' className='border-white px-3 py-2 border-2 rounded-xl h-7 shadow-2xl shadow-pink-300 mb-5 w-full' />
                </div>
                <button onClick={hourCalculation} className='cursor-pointer shadow-xl shadow-pink-300 px-5 py-2 rounded-md text-lg font-semibold'>Hour Calculation</button>
            </div>
            <div className='text-white flex items-center justify-center gap-10 mt-20'>
                <div className='w-[100px]'>
                    <p className='mb-2'>Total Time</p>
                    <input id='total_time' type="text" className='border-white px-3 py-2 border-2 rounded-xl h-7 shadow-2xl shadow-pink-300 mb-5 w-full' />
                </div>
                <div className='w-[100px]'>
                    <p className='mb-2'>Hour Rate</p>
                    <input id='hour_rate' type="text" className='border-white px-3 py-2 border-2 rounded-xl h-7 shadow-2xl shadow-pink-300 mb-5 w-full' />
                </div>
                <div className='w-[100px]'>
                    <p className='mb-2'>Bonus</p>
                    <input id='bonus' type="text" className='border-white px-3 py-2 border-2 rounded-xl h-7 shadow-2xl shadow-pink-300 mb-5 w-full' />
                </div>
                <div className='w-[100px]'>
                    <p className='mb-2'>Fine</p>
                    <input id='fine' type="text" className='border-white px-3 py-2 border-2 rounded-xl h-7 shadow-2xl shadow-pink-300 mb-5 w-full' />
                </div>
                <button onClick={amount_calculation} className='cursor-pointer shadow-xl shadow-pink-300 px-5 py-2 rounded-md text-lg font-semibold'>Amount Calculation</button>
                <div className='w-[100px]'>
                    <p className='mb-2'>Total Amount</p>
                    <input id='total_amount' type="text" className='border-white px-3 py-2 border-2 rounded-xl h-7 shadow-2xl shadow-pink-300 mb-5 w-full' />
                </div>
            </div>
            <div className='text-white flex items-center justify-center gap-10 mt-20'>
                <button onClick={resetFields} className='cursor-pointer shadow-xl shadow-pink-300 px-5 py-2 rounded-md text-lg font-semibold'>Reset</button>
            </div>
        </div>
    );
};

export default Calculation;