import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className='text-white'>
            <div className='flex flex-col items-center justify-center w-full min-h-[85vh] pb-[100px]'>
                <div>
                    <Link to="/staff"><button className='mt-8 text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-lg font-semibold'>Staff</button></Link>
                </div>
                <div className='border-2 border-white rounded-2xl w-[650px] h-[300px] flex items-center justify-center div-glow'>
                    <h1 className='text-center text-4xl font-semibold'>Welcome <br /> To The Shop</h1>
                </div>
            </div>
        </div>
    );
};

export default Home;