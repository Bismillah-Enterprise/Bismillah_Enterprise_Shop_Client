import React from 'react';

const AdminBanner = () => {
    return (
        <div>
            <div className='text-white'>
                <div className='flex flex-col items-center justify-center w-full min-h-[85vh]'>
                    <div className='border-2 border-white rounded-2xl w-[650px] h-[300px] flex items-center justify-center div-glow'>
                        <h1 className='text-center text-4xl font-semibold'>Welcome <br /> To Admin Panel</h1>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminBanner;