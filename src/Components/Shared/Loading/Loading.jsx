import React from 'react';
import { PuffLoader } from 'react-spinners';

const Loading = () => {
	return (
		<div className='h-full w-full flex items-center justify-center bg-linear-to-r from-[#485563] to-[#29322c]'>
			<PuffLoader color='#fccee8' />
		</div>
	);
};

export default Loading;