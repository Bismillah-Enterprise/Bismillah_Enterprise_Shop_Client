import React, { useRef, useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { NumberFormatBase, NumericFormat } from 'react-number-format';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const StaffDetails = () => {
	const staffDetails = useLoaderData();
	const { _id, name, total_income, last_month_due, withdrawal_amount, current_working_month, available_balance, total_working_hour, total_working_minute, transections, uid } = staffDetails;
	const [modal, setModal] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	const from = location?.state?.pathname;
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
	const handleTransections = (id) => {
		const transection_amount = parseFloat(transection_amount_ref.current.value);
		const transection_type = transection_type_ref.current.value;
		const newWithdrawalAmmount = withdrawal_amount + transection_amount;
		const newReceiveableAmount = last_month_due + total_income - newWithdrawalAmmount;
		const comment = comment_ref.current.value;
		const transection_id = String(parseInt(transection_amount)) + String(transection_type) + String(parseInt(newWithdrawalAmmount)) + String(parseInt(newReceiveableAmount));

		const transectionData = {
			transection_id,
			currentDate,
			transection_amount,
			transection_type,
			previous_withdrawal_amount: withdrawal_amount,
			previous_available_balance: available_balance,
			withdrawal_amount: parseFloat(newWithdrawalAmmount.toFixed(2)),
			available_balance: parseFloat(newReceiveableAmount.toFixed(2)),
			comment
		}
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
				fetch(`https://bismillah-enterprise-server.onrender.com/transection_details/${id}`, {
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
							transection_type_ref.current.value = '';
							navigate(location.pathname)
							Swal.fire({
								position: 'center',
								icon: 'success',
								title: 'Transection Details Saved Successfully',
								showConfirmButton: false,
								timer: 1000,
							})
						}
					})
			}
			else {
				transection_amount_ref.current.value = '';

			}
		});

		setModal(!modal)
	}
	const transection_amount_ref = useRef(null);
	const transection_type_ref = useRef(null);
	const comment_ref = useRef('');

	const handleClosingMonth = () => {
		Swal.fire({
			title: "Are you sure?",
			text: `You Are Sure?`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, I am Sure"
		}).then((result) => {
			if (result.isConfirmed) {
				const currentWorkingMonth = currentDate.split(' ')[0];
				const closing_month_details = { current_working_month: currentWorkingMonth, month_name: current_working_month, total_income, paid_amount: withdrawal_amount, paid_date: currentDate, last_month_due: available_balance, total_working_hour, total_working_minute };
				fetch(`https://bismillah-enterprise-server.onrender.com/closing_month/${_id}`, {
					method: 'PUT',
					headers: {
						'content-type': 'application/json'
					},
					body: JSON.stringify(closing_month_details)
				})
					.then(res => res.json())
					.then(data => {
						if (data.acknowledged) {
							navigate(location.pathname)
							Swal.fire({
								position: 'center',
								icon: 'success',
								title: 'Month Closed Successfully',
								showConfirmButton: false,
								timer: 1000,
							})
						}
					})
			}
		})
	}
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
								<NumericFormat
									getInputRef={transection_amount_ref}
									className='outline-none w-full h-full'
									placeholder='Enter amount'
									allowNegative={false}
									decimalScale={2}
									fixedDecimalScale={false}
									thousandSeparator={false}
								/>
							</div>
						</div>
						<div className='mt-2 flex items-center justify-between gap-5'>
							<h1 className='lg:text-lg font-semibold'>Transection Type: </h1>
							<select ref={transection_type_ref} className='px-3 outline-none border p-1 rounded-md text-xs' name="user_category_in_shop" id="user_category">
								<option className='text-xs text-black bg-gray' value="Lend">Lend</option>
								{
									withdrawal_amount > 0 ?
									<option className='text-xs text-black bg-gray' value="Payback Lend">Payback Lend</option>
									:''
								}
								<option className='text-xs text-black bg-gray' value="Salary">Salary</option>
							</select>
						</div>
						<div className='mt-5 flex items-center gap-5'>
							<h1 className='lg:text-lg font-semibold mb-2'>Comment</h1>
							<div className='px-3 border-2 rounded-xl h-8 shadow-2xl shadow-pink-300 w-full'>
								<input ref={comment_ref} type="text" className='outline-none w-full' />
							</div>
						</div>
					</div>
					<button onClick={() => handleTransections(_id)} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-lg font-semibold mb-5 lg:mb-0'>Submit</button>
				</div>
			</div>
			{/* end modal */}
			<div className='flex items-center justify-start'>
				<Link to={from} state={{ from: location.pathname }}>
					<button className="hidden md:block text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
						Back
					</button>
				</Link>
			</div>
			<h1 className='text-pink-300 text-2xl text-center font-semibold mt-5'>{name}</h1>
			<hr className='mt-4 text-pink-300' />
			<hr className='mt-2 text-pink-300' />
			<h1 className='text-pink-200 text-2xl text-center font-semibold mt-10'>Month Name: {current_working_month}</h1>
			<div className='flex flex-wrap md:grid md:grid-cols-4 items-center justify-center gap-7 mt-10'>
				<h1 className='text-pink-200 text-lg lg:text-2xl text-center font-semibold'>Last Month Due: {last_month_due}</h1>
				<h1 className='text-pink-200 text-lg lg:text-2xl text-center font-semibold'>Total Earned: {total_income}</h1>
				<h1 className='text-pink-200 text-lg lg:text-2xl text-center font-semibold'>Withdrawal Amount: {withdrawal_amount}</h1>
				<h1 className='text-pink-200 text-lg lg:text-2xl text-center font-semibold'>Receiveable Amount: {available_balance}</h1>
			</div>
			<div className='mt-10 flex flex-col lg:flex-row items-center justify-center gap-5'>
				<button onClick={() => setModal(!modal)} className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-3 lg:px-5 py-1 rounded-md text-md lg:text-lg lg:font-semibold">
					Make a Transections
				</button>
				<Link to={`/admin/transections_history/${uid}`} state={{ pathname: location.pathname }} className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-3 lg:px-5 py-1 rounded-md text-md lg:text-lg lg:font-semibold">
					See All Transections
				</Link>
				<button onClick={() => handleClosingMonth()} className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-3 lg:px-5 py-1 rounded-md text-md lg:text-lg lg:font-semibold">
					Close The Month
				</button>
			</div>

		</div>
	);
};

export default StaffDetails;