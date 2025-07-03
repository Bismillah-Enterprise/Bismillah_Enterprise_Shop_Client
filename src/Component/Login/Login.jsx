import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
        setShowPassword(prev => !prev);
    };

    const submitUserInformation = () => {
        const login_user_name = document.getElementById('login_user_name');
        const login_password = document.getElementById('login_password');
        console.log('user name: ', login_user_name.value, 'user password: ', login_password.value)
    }
    return (
        <div className='flex items-center justify-center min-h-[80vh] mt-[50px] pb-[50px]'>
            <div className='h-[350px] w-[300px] shadow-2xl shadow-pink-300 p-5 flex items-center justify-center rounded-2xl'>
                <div className='w-full text-white'>
                    <h1 className='text-3xl font-bold mb-8 text-center'>Login</h1>
                    <p className='mb-2'>User Name</p>
                    <div className='px-3 border-2 rounded-xl h-8 shadow-2xl shadow-pink-300 mb-5 w-full'>
                        <input id='login_user_name' type="text" className='outline-none' />
                    </div>
                    <p className='mb-2'>Password</p>
                    <div className='px-3 border-2 rounded-xl h-8 shadow-2xl shadow-pink-300 w-full flex justify-between items-center'>
                        <input id='login_password' type={showPassword ? 'text' : 'password'} className='outline-none' />
                        <button onClick={togglePassword} className='border-none h-fit text-sm cursor-pointer'>{showPassword ? 'Hide' : 'Show'}</button>
                    </div>
                    <Link to="/signup"><p className='mt-3 text-right text-sm text-pink-200 cursor-pointer'>Create an new account</p></Link>
                    <div className='flex items-center justify-center mt-5'>
                        <Link to="/staff"><button onClick={submitUserInformation} className='cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-lg font-semibold'>Submit</button></Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;