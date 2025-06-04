import React from 'react';
import Home from '../Home/Home';
import { Outlet } from 'react-router-dom';

const Main = () => {
    return (
        <div className='bg-linear-to-r from-[#485563] to-[#29322c] min-h-[100vh] px-[10px] pt-[20px]'>
            {/* <h1 className='text-white text-5xl nunito font-bold text-center'>BISMILLAH ENTERPRISE</h1> */}
            <div class="logo"><b>BIS<span>M</span>ILLAH ENTER<span>P</span>RISE</b></div>
            <Outlet></Outlet>
        </div>
    );
};

export default Main;