import React, { useState } from 'react';

const Staff = () => {
    const [disabled, setDisabled] = useState(false);

    const handleClick = () => {
        setDisabled(true);
        // Do something here...
        console.log("Button clicked");
    };
    return (
        <div>
            <div>
                <h1 className='text-2xl text-center text-pink-200 mt-5 font-semibold'>Staff Name - Hour Rate: 00</h1>
            </div>
            <div className='flex items-center gap-10 justify-center mt-10'>
                <button onClick={handleClick}
                    disabled={disabled} className={`rounded-full h-[100px] w-[100px] shadow-md shadow-pink-200 border-none text-pink-200 text-lg  ${disabled
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