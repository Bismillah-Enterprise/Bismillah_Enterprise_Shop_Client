import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
        setShowPassword(prev => !prev);
    };

    const submitUserInformation = () => {
        const login_user_name = document.getElementById('signup_user_name');
        const login_password = document.getElementById('signup_password');
        console.log('user name: ', login_user_name.value, 'user password: ', login_password.value)
    }
    return (
        <div className='flex items-center justify-center min-h-[80vh] mt-[50px] pb-[50px]'>
            <div className='h-fit w-[300px] shadow-2xl shadow-pink-300 p-5 flex items-center justify-center rounded-2xl'>
                <div className='w-full text-white'>
                    <h1 className='text-3xl font-bold mb-8 text-center'>Signup</h1>
                    <p className='mb-2'>User Name</p>
                    <div className='px-3 border-2 rounded-xl h-8 shadow-2xl shadow-pink-300 mb-5 w-full'>
                        <input id='signup_user_name' type="text" className='outline-none' />
                    </div>
                    <p className='mb-2'>Password</p>
                    <div className='px-3 mb-5 border-2 rounded-xl h-8 shadow-2xl shadow-pink-300 w-full flex justify-between items-center'>
                        <input id='signup_password' type={showPassword ? 'text' : 'password'} className='outline-none' />
                        <button onClick={togglePassword} className='border-none h-fit text-sm cursor-pointer'>{showPassword ? 'Hide' : 'Show'}</button>
                    </div>
                    <p className='mb-2'>Confirm Password</p>
                    <div className='px-3 border-2 rounded-xl h-8 shadow-2xl shadow-pink-300 w-full flex justify-between items-center'>
                        <input id='signup_confirm_password' type='password' className='outline-none' />
                    </div>
                    <Link to="/login"><p className='mt-3 text-right text-sm text-pink-200 cursor-pointer'>Already have an account</p></Link>
                    <div className='flex items-center justify-center mt-5'>
                        <Link to="/staff"><button onClick={submitUserInformation} className='cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-lg font-semibold'>Submit</button></Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;