import React, { useState } from 'react';
import useShopCode from '../../Hooks/useShopCode';

const SetShopCode = () => {
	const [allowed, setAllowed] = useState(false);
	const [shopCode] = useShopCode();
	const [isSetShopCode, setIsSetShopCode] = useState(false);
	const [isChange, setIsChange] = useState(false);

	const handleShowShopCode = () => {
		const currentShopCode = document.getElementById('current_shop_code');
		currentShopCode.innerText = shopCode
		setIsSetShopCode(true);
	}

	const handleChangeShopCode = () => {
		const new_shop_code = document.getElementById('new_shop_code');
		const shop_code = new_shop_code.value;
		const newShopCode = { shop_code };
		const _id = import.meta.env.VITE_shop_code_object_id;
		fetch(`https://bismillah-enterprise-server.onrender.com/shop_code`, {
			method: 'PUT',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify(newShopCode)
		})
			.then(res => res.json())
			.then(data => {
				const shopCodeField = document.getElementById('new_shop_code');
				shopCodeField.value = ''
				setIsChange(!isChange);

				Swal.fire({
					position: "center",
					icon: "success",
					title: "Shop Code Changed successfully",
					showConfirmButton: false,
					timer: 1000
				}).then(() => {
					window.location.reload();
				})
				setIsSetShopCode(!isSetIp);
			});

	}

	return (
		<div>
			<h2 className="text-2xl text-pink-300 font-semibold text-center">Set Shop Code</h2>
			<div className='h-fit min-h-[320px] flex lg:justify-center duration-300'>
				<div className="text-pink-200 shadow-lg shadow-pink-200 lg:p-10 flex flex-col items-center justify-center mt-10 w-fit rounded-2xl p-5">
					{
						isChange ?
							<div className='text-pink-200 flex flex-col gap-5 p-8 items-center h-full w-full'>
								<h1 className='text-lg lg:text-2xl font-semibold'>Enter Your New Shop Code</h1>
								<div className='px-3 border-2 rounded-xl h-8 shadow-2xl shadow-pink-300  w-full'>
									<input id='new_shop_code' type="text" className='outline-none w-full' />
								</div>
								<p id='doesNotMatched' className='text-red-500 hidden'>Shop code does not matched</p>
								<button onClick={handleChangeShopCode} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-lg font-semibold mb-5 lg:mb-0'>Change</button>
							</div> :
							<div className='lg:w-[500px] mb-5 flex items-center justify-center gap-5'>
								<p id='current_shop_code' className='font-semibold text-lg text-center md:text-2xl'>Click the button below to view your Shop Code</p>
							</div>
					}
					<div className='flex flex-col md:flex-row items-center gap-8'>
						<button onClick={handleShowShopCode} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-lg font-semibold'>Show Current Shop Code</button>
						<button onClick={() => { setIsChange(!isChange) }} disabled={!isSetShopCode ? true : false} className={`disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed disabled:border-2 disabled:border-gray-400 text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-lg font-semibold`}>Change The Code</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SetShopCode;