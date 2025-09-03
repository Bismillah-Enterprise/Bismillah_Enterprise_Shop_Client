import React from 'react';
import { PuffLoader } from 'react-spinners';

const Loading = () => {
	return (
		<div className='h-full w-full flex flex-col gap-5 items-center justify-center bg-linear-to-r from-[#485563] to-[#29322c]'>
			<PuffLoader color='#fccee8' />
			<p className='text-lg text-pink-200'>Please Wait... It may take up to 1 minute</p>
		</div>
	);
};

export default Loading;