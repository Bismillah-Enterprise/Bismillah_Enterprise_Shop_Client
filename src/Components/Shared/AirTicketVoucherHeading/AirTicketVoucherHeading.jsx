import React from 'react';
import { FaRegHandshake } from 'react-icons/fa';

const AirTicketVoucherHeading = () => {
    return (
        <div>
            <div className='grid grid-cols-3 items-center justify-between'>
                <div>
                    <img className='w-16 h-16' src='https://i.ibb.co.com/8D94xmx4/Chat-GPT-Image-Aug-22-2026-05-21-57-PM.png'></img>
                </div>
                <div className='flex flex-col items-center justify-center'>
                    <h1 className='text-xl font-semibold'>JOKSHIN TRAVELS</h1>
                    <FaRegHandshake className='text-3xl' />
                    <h1 className='text-md font-semibold'>BISMILLAH ENTERPRISE</h1>
                </div>
                <div className='flex justify-end'>
                    <img className='w-16 h-16' src='https://i.ibb.co/01Zf9m1/logo.png'></img>
                </div>
            </div>
            <div className='flex items-center justify-center mt-1 gap-4 mb-1'>
                <div className='text-center text-lg font-bold flex flex-col items-center justify-center gap-0'>
                    <div className='flex items-center justify-center mb-1'>
                        <h1 className='text-sm border border-black px-4 py-1'>Visa Process & Air Ticketing Any Country In The World</h1>
                    </div>
                    <h1 className='text-xs'>Amin Super Market, Jokshin East Bazar, Sadar, Lakshmipur</h1>
                    <h1 className='text-xs'>Proprietor: Abdul Kader - 01713-630690, Shop Mobile: 01760-766685</h1>
                    <h1 className='text-xs'></h1>
                </div>
            </div>
            <hr className='border border-black mb-2' />
        </div>
    );
};

export default AirTicketVoucherHeading;