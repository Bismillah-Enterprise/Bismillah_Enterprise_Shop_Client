import { ShieldOff } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const NotAuthorized = () => {
	return (
		<div className="flex flex-col items-center justify-center h-full text-pink-200 px-4 text-cente">
			<div className='shadow-lg shadow-pink-200 p-8 rounded-2xl flex items-center justify-center flex-col'>
				<ShieldOff size={80} className="text-pink-200 mb-6" />
				<h1 className="text-4xl md:text-5xl font-bold mb-4">Access Denied</h1>
				<p className="text-lg md:text-xl text-pink-200 mb-8 text-center">
					You are not authorized to view this page.
				</p>
				<Link
					to="/"
					className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-3 md:px-5 py-1 rounded-md text-md md:text-lg font-semibold"
				>
					Return to Home
				</Link>
			</div>
		</div>
	);
};

export default NotAuthorized;