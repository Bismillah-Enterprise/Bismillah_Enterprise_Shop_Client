import React from 'react';

const AdminHome = () => {
	return (
		<div className='flex flex-col items-center justify-center w-full h-full text-white'>
			<div className='border-2 border-white rounded-2xl w-[300px] lg:w-[650px] h-[300px] lg:h-[300px] flex items-center justify-center div-glow'>
				<h1 className='text-center text-2xl lg:text-4xl font-semibold'>Welcome <br /> To Admin Panel</h1>
			</div>
		</div>
	);
};

export default AdminHome;