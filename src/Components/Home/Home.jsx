import React, { useContext, useEffect, useState } from 'react';
import { Link, useLoaderData, useLocation } from 'react-router-dom';
import { AuthContext } from '../Providers/AuthProvider';
import Loading from '../Shared/Loading/Loading';
import useCurrentUser from '../Hooks/useCurrentUser';
import Marquee from 'react-fast-marquee';

const Home = () => {
	const { user, loading, setLoading } = useContext(AuthContext);
	const notice = useLoaderData();
	const [current_User, isAdmin, isStaff, userHookLoading] = useCurrentUser();
	const location = useLocation();
	console.log(location);

	if (userHookLoading && loading) {
		return (<div className='h-full rounded-2xl overflow-hidden'><Loading></Loading></div>);
	}
	else {
		return (
			<div className="flex flex-col items-center text-white px-4 pt-4 pb-8 h-full">
				<Marquee speed={50} className='mb-4'>
					<p className='text-pink-200 text-lg'>{notice[0].notice}</p>
				</Marquee>
				{
					user ? <div className="flex items-center justify-center gap-5 mb-10">

						<Link to={!isStaff ? `/not_authorized` : `/staff/uid_query/${current_User?.uid}`} state={{ pathname: location.pathname }}>
							<button className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
								Staff
							</button>
						</Link>

						{
							isAdmin ?
								<Link to="/admin" state={{ pathname: "/" }}>
									<button className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
										Admin
									</button>
								</Link> : ''
						}
					</div> : ''
				}
				{/* This wrapper div takes remaining space and centers the glow box */}
				<div className="flex-1 flex items-center justify-center w-full">
					<div className="border-2 border-white rounded-2xl w-[300px] lg:w-[500px] h-[200px] lg:h-[300px] flex items-center justify-center div-glow">
						<h1 className="text-center text-2xl lg:text-4xl font-semibold">
							Welcome <br /> To The Shop
						</h1>
					</div>
				</div>
			</div>
		);
	};
};

export default Home;
