import React, { useRef, useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const StaffDetails = () => {
	const staffDetails = useLoaderData();
	const { _id, name, total_income, withdrawal_amount, receiveable_amount, current_working_month, available_balance, uid } = staffDetails;
	const [modal, setModal] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	const now = new Date();
	const Time = now.toLocaleTimeString('en-BD', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: true,
	});
	const currentDayName = now.toLocaleDateString('en-BD', { weekday: 'long' });
	const currentDate = now.toLocaleDateString('en-BD', {
		day: 'numeric',
		year: 'numeric',
		month: 'long',
	});

	console.log(parseFloat(10.3))
	const handleTransections = (id) => {
		const transection_amount = parseFloat(transection_amount_ref.current.value);
		const transection_type = transection_type_ref.current.value;
		const newWithdrawalAmmount = withdrawal_amount + transection_amount;
		const newReceiveableAmount = total_income - newWithdrawalAmmount;

		const transectionData = { currentDate, transection_amount, transection_type, withdrawal_amount: newWithdrawalAmmount, available_balance: newReceiveableAmount }
		Swal.fire({
			title: "Are you sure?",
			text: `You Are Giving ${transection_amount} Taka ${transection_type} to ${name}`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, I am Sure"
		}).then((result) => {
			if (result.isConfirmed) {
				fetch(`http://localhost:5000/transection_details/${id}`, {
					method: 'PUT',
					headers: {
						'content-type': 'application/json'
					},
					body: JSON.stringify(transectionData)
				})
					.then(res => res.json())
					.then(transectionDataSubmit => {
						if (transectionDataSubmit.acknowledged) {
							transection_amount_ref.current.value = '';
							navigate(location.pathname)
							Swal.fire({
								position: 'center',
								icon: 'success',
								title: 'Transection Details Saved Successfully',
								showConfirmButton: false,
								timer: 1000,
							});
						}
					})
			}
			else {
				transection_amount_ref.current.value = '';

			}
		});

		setModal(!modal)
	}
	const transection_amount_ref = useRef();
	const transection_type_ref = useRef();
	return (
		<div>
			{/* modal */}
			<div id='staff_details_modal' className={`${!modal ? 'hidden' : 'block'}  w-[350px] bg-black shadow-md shadow-pink-200 rounded-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}>
				<div className='flex justify-end -top-[10px] -right-[10px] relative'>
					<MdOutlineCancel onClick={() => { !setModal(!modal) }} className='text-pink-200 text-3xl cursor-pointer'></MdOutlineCancel>
				</div>
				<div className='mb-4'>
					<h1 className='text-lg font-semibold text-pink-300 text-center mb-2'>Transection Details</h1>
					<hr className='text-pink-300 w-full' />
				</div>
				<div className='text-pink-200 flex flex-col gap-5 p-8 pt-0 items-center h-full w-full'>
					<div className='mb-4'>
						<div className='mt-2'>
							<h1 className='lg:text-lg font-semibold mb-2'>Transection Amount</h1>
							<div className='px-3 border-2 rounded-xl h-8 shadow-2xl shadow-pink-300 w-full'>
								<input ref={transection_amount_ref} type="text" className='outline-none w-full' />
							</div>
						</div>
						<div className='mt-5 flex items-center gap-5'>
							<h1 className='lg:text-lg font-semibold'>Transection Type: </h1>
							<select ref={transection_type_ref} className='px-3 outline-none border p-1 rounded-md' name="user_category_in_shop" id="user_category">
								<option className='text-xs text-black bg-gray' value="lend">Lend</option>
								<option className='text-xs text-black bg-gray' value="salary">Salary</option>
							</select>
						</div>
					</div>
					<button onClick={() => handleTransections(_id)} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-lg font-semibold mb-5 lg:mb-0'>Submit</button>
				</div>
			</div>
			{/* end modal */}
			<h1 className='text-pink-300 text-2xl text-center font-semibold mt-5'>{name}</h1>
			<hr className='mt-4 text-pink-300' />
			<hr className='mt-2 text-pink-300' />
			<h1 className='text-pink-200 text-2xl text-center font-semibold mt-10'>Month Name: {current_working_month}</h1>
			<div className='flex flex-wrap md:grid md:grid-cols-3 items-center justify-center gap-7 mt-10'>
				<h1 className='text-pink-200 text-lg lg:text-2xl text-center font-semibold'>Total Earned: {total_income}</h1>
				<h1 className='text-pink-200 text-lg lg:text-2xl text-center font-semibold'>Withdrawal Amount: {withdrawal_amount}</h1>
				<h1 className='text-pink-200 text-lg lg:text-2xl text-center font-semibold'>Receiveable Amount: {available_balance}</h1>
			</div>
			<div className='mt-10 flex flex-col lg:flex-row items-center justify-center gap-5'>
				<button onClick={() => setModal(!modal)} className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-3 lg:px-5 py-1 rounded-md text-md lg:text-lg lg:font-semibold">
					Make a Transections
				</button>
			</div>

		</div>
	);
};

export default StaffDetails;