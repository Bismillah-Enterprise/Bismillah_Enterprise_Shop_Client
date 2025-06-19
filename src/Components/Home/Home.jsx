import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className='text-white'>
            <div className='flex flex-col items-center justify-center w-full min-h-[85vh] pb-[100px]'>
                <div className='border-2 border-white rounded-2xl w-[500px] md:w-[650px] h-[200px] md:h-[300px] flex items-center justify-center div-glow'>
                    <h1 className='text-center text-2xl md:text-4xl font-semibold'>Welcome <br /> To The Shop</h1>
                </div>
            </div>
        </div>
    );
};

export default Home;