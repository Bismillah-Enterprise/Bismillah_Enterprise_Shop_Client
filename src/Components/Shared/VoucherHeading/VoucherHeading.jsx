import React from 'react';

const VoucherHeading = () => {
    return (
        <div>
            <div className='grid grid-cols-3 items-center justify-between'>
                <div>
                    <img className='w-14 h-14' src='https://i.ibb.co/605Lndzd/airplane.png'></img>
                </div>
                <div className='flex justify-center'>
                    <img className='w-12 h-12' src='https://i.ibb.co/01Zf9m1/logo.png'></img>
                </div>
                <div className='flex justify-end'>
                    <img className='h-12' src='https://i.ibb.co/v4vgmYqg/stationary.png'></img>
                </div>
            </div>
            <div className='flex items-center justify-center mt-3 gap-4 mb-1'>
                <div className='text-center text-xl font-bold'>
                    <h1>BISMILLAH ENTERPRISE</h1>
                    <h1 className='text-sm'>Online Travel Agent and Stationary</h1>
                    <div className='flex items-center justify-center my-1'>
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

export default VoucherHeading;