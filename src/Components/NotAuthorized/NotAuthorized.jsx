import React from 'react';
import { Link } from 'react-router-dom';

const NotAuthorized = () => {
    return (
        <div>
            <div className="text-center text-red-500 mt-10">
                🚫 You are not authorized to view this page.
            </div>
            <div className='flex items-center justify-center mt-5'>
                <Link to={"/"}><button className='mt-8 text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-lg font-semibold'>Go to Home</button></Link>
            </div>
        </div>
    );
};

export default NotAuthorized;