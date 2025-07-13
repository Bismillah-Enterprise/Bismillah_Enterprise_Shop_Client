import React, { useRef, useState } from 'react';
import AdminRoute from '../../AdminRoute/AdminRoute';
import { useLoaderData, useLocation, useNavigate } from 'react-router-dom';

const NoticePanel = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const handleChangeNotice = () => {
		const newNotice = newNoticeRef.current.value;
		fetch(`http://localhost:5000/notice_panel`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({notice: newNotice})
		})
			.then(res => res.json())
			.then(data => {
				newNoticeRef.current.value = ''
				Swal.fire({
					position: "center",
					icon: "success",
					title: "Notice Changed Successfully",
					showConfirmButton: false,
					timer: 1000
				}).then(() => {
					navigate(location.pathname)
				})
			});
	}
	const newNoticeRef = useRef();
	return (
		<div>
			<h2 className="text-2xl text-pink-300 font-semibold text-center">Notice Board</h2>
			<div className='h-fit min-h-[320px] flex lg:justify-center duration-300'>
				<div className="text-pink-200 shadow-lg shadow-pink-200 lg:p-10 flex flex-col items-center justify-center mt-10 w-fit rounded-2xl p-5">
					<div className='text-pink-200 flex flex-col gap-5 p-8 items-center h-full w-full'>
						<h1 className='text-lg lg:text-2xl font-semibold'>Enter Your New Notice</h1>
						<div className='px-3 border-2 rounded-xl h-8 shadow-2xl shadow-pink-300  w-full'>
							<input ref={newNoticeRef} type="text" className='outline-none w-full' />
						</div>
						<button onClick={handleChangeNotice} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-lg font-semibold mb-5 lg:mb-0'>Set New Notice</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NoticePanel;