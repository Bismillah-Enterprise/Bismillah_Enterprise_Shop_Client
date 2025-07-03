import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Providers/AuthProvider';

const Home = () => {
	const { user } = useContext(AuthContext);
	return (
		<div className="flex flex-col items-center text-white px-4 py-8 h-full">
			{
				user ? <div className="flex items-center justify-center gap-5 mb-10">
					<Link to="/staff" state={{ from: "/" }}>
						<button className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-lg font-semibold">
							Staff
						</button>
					</Link>
					<Link to="/admin" state={{ from: "/" }}>
						<button className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-lg font-semibold">
							Admin
						</button>
					</Link>
				</div> : ''
			}

			{/* This wrapper div takes remaining space and centers the glow box */}
			<div className="flex-1 flex items-center justify-center w-full">
				<div className="border-2 border-white rounded-2xl w-[300px] md:w-[500px] h-[200px] md:h-[300px] flex items-center justify-center div-glow">
					<h1 className="text-center text-2xl md:text-4xl font-semibold">
						Welcome <br /> To The Shop
					</h1>
				</div>
			</div>
		</div>
	);
};

export default Home;
