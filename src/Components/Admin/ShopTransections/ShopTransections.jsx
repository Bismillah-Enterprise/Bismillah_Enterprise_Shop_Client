import React, { useRef, useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { NumberFormatBase } from 'react-number-format';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ShopTransections = () => {
	const shop_transections = useLoaderData();
	const { _id, month_name, total_revenue_amount, total_expense_amount, hand_on_cash } = shop_transections[0];
	const [revenueModal, setRevenueModal] = useState(false);
	const [expenseModal, setExpenseModal] = useState(false);
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
	console.log(shop_transections[0])
	console.log(currentDate.split(' ')[0])
	const handleRevenueTransections = (transectionType) => {
		const revenue_transection_amount = parseFloat(revenue_transection_amount_ref.current.value);
		const transection_type = transectionType;
		const new_total_revenue_amount = parseFloat(total_revenue_amount + revenue_transection_amount);
		const new_hand_on_cash = parseFloat(hand_on_cash + revenue_transection_amount);
		const comment = revenue_comment_ref.current.value;
		const transection_id = String(parseInt(revenue_transection_amount)) + String(transection_type) + String(new_total_revenue_amount) + String(new_hand_on_cash);

		const transectionData = { transection_id, transection_date: currentDate, transection_amount: revenue_transection_amount, transection_type, transection_explaination: comment, total_revenue_amount: new_total_revenue_amount, hand_on_cash: new_hand_on_cash }
		console.log(transectionData);
		Swal.fire({
			title: "Are you sure?",
			text: `You Are Adding ${transection_type} ${revenue_transection_amount} Taka `,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, I am Sure"
		}).then((result) => {
			if (result.isConfirmed) {
				fetch(`https://bismillah-enterprise-server.onrender.com/shop_transections`, {
					method: 'PUT',
					headers: {
						'content-type': 'application/json'
					},
					body: JSON.stringify(transectionData)
				})
					.then(res => res.json())
					.then(transectionDataSubmit => {
						if (transectionDataSubmit.acknowledged) {
							revenue_transection_amount_ref.current.value = '';
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
				revenue_transection_amount_ref.current.value = '';

			}
		});

		setRevenueModal(!revenueModal)
	}
	const handleExpenseTransections = (transectionType) => {
		const expense_transection_amount = parseFloat(expense_transection_amount_ref.current.value);
		const transection_type = transectionType;
		const new_total_expense_amount = parseFloat(total_expense_amount + expense_transection_amount);
		const new_hand_on_cash = parseFloat(hand_on_cash - expense_transection_amount);
		const comment = expense_comment_ref.current.value;
		const transection_id = String(parseInt(expense_transection_amount)) + String(transection_type) + String(new_total_expense_amount) + String(new_hand_on_cash);

		const transectionData = { transection_id, transection_date: currentDate, transection_amount: expense_transection_amount, transection_type, transection_explaination: comment, total_expense_amount: new_total_expense_amount, hand_on_cash: new_hand_on_cash }
		console.log(transectionData);
		Swal.fire({
			title: "Are you sure?",
			text: `You Are Adding ${transection_type} ${expense_transection_amount} Taka `,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, I am Sure"
		}).then((result) => {
			if (result.isConfirmed) {
				fetch(`https://bismillah-enterprise-server.onrender.com/shop_transections`, {
					method: 'PUT',
					headers: {
						'content-type': 'application/json'
					},
					body: JSON.stringify(transectionData)
				})
					.then(res => res.json())
					.then(transectionDataSubmit => {
						if (transectionDataSubmit.acknowledged) {
							expense_transection_amount_ref.current.value = '';
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
				expense_transection_amount_ref.current.value = '';

			}
		});

		setExpenseModal(!expenseModal)
	}
	const revenue_transection_amount_ref = useRef();
	const revenue_comment_ref = useRef();
	const expense_transection_amount_ref = useRef();
	const expense_comment_ref = useRef();

	const handleClosingMonth = () => {
		Swal.fire({
			title: "Are you sure?",
			text: `You Should Print It Before Closing`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, I am Sure"
		}).then((result) => {
			if (result.isConfirmed) {
				const closing_month_details = { month_name, hand_on_cash, total_expense_amount, total_revenue_amount };
				fetch(`http://localhost:5000/shop_transections_closing_month`, {
					method: 'POST',
					headers: {
						'content-type': 'application/json'
					},
					body: JSON.stringify(closing_month_details)
				})
					.then(res => res.json())
					.then(data => {
						if (data.message === 'Shop transections saved successfully') {
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
			<div className={`${!revenueModal ? 'hidden' : 'block'}  w-[350px] bg-black shadow-md shadow-pink-200 rounded-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}>
				<div className='flex justify-end -top-[10px] -right-[10px] relative'>
					<MdOutlineCancel onClick={() => { !setRevenueModal(!revenueModal) }} className='text-pink-200 text-3xl cursor-pointer'></MdOutlineCancel>
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
								<NumberFormatBase
									getInputRef={revenue_transection_amount_ref}
									className='outline-none w-full h-full'
									placeholder='Enter amount'
									thousandSeparator={true}
									allowNegative={false}
									isNumericString={true}
								/>
							</div>
						</div>
						<div className='mt-5 flex items-center gap-5'>
							<h1 className='lg:text-lg font-semibold mb-2'>Comment</h1>
							<div className='px-3 border-2 rounded-xl h-8 shadow-2xl shadow-pink-300 w-full'>
								<input ref={revenue_comment_ref} type="text" className='outline-none w-full' />
							</div>
						</div>
					</div>
					<button onClick={() => handleRevenueTransections('revenue')} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-lg font-semibold mb-5 lg:mb-0'>Submit</button>
				</div>
			</div>
			<div className={`${!expenseModal ? 'hidden' : 'block'}  w-[350px] bg-black shadow-md shadow-pink-200 rounded-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}>
				<div className='flex justify-end -top-[10px] -right-[10px] relative'>
					<MdOutlineCancel onClick={() => { !setExpenseModal(!expenseModal) }} className='text-pink-200 text-3xl cursor-pointer'></MdOutlineCancel>
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
								<NumberFormatBase
									getInputRef={expense_transection_amount_ref}
									className='outline-none w-full h-full'
									placeholder='Enter amount'
									thousandSeparator={true}
									allowNegative={false}
									isNumericString={true}
								/>
							</div>
						</div>
						<div className='mt-5 flex items-center gap-5'>
							<h1 className='lg:text-lg font-semibold mb-2'>Comment</h1>
							<div className='px-3 border-2 rounded-xl h-8 shadow-2xl shadow-pink-300 w-full'>
								<input ref={expense_comment_ref} type="text" className='outline-none w-full' />
							</div>
						</div>
					</div>
					<button onClick={() => handleExpenseTransections('expense')} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-lg font-semibold mb-5 lg:mb-0'>Submit</button>
				</div>
			</div>
			{/* end modal */}
			<div className='flex items-center justify-start'>
				<Link to={from} state={{ from: location.pathname }}>
					<button className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
						Back
					</button>
				</Link>
			</div>
			<hr className='mt-4 text-pink-300' />
			<hr className='mt-2 text-pink-300' />
			<h1 className='text-pink-200 text-2xl text-center font-semibold mt-10'>Month Name: {month_name}</h1>
			<div className='flex flex-wrap md:grid md:grid-cols-3 items-center justify-center gap-7 mt-10'>
				<h1 className='text-pink-200 text-lg lg:text-2xl text-center font-semibold'>Total Revenue Amount: {total_revenue_amount}</h1>
				<h1 className='text-pink-200 text-lg lg:text-2xl text-center font-semibold'>Total Expense Amount: {total_expense_amount}</h1>
				<h1 className='text-pink-200 text-lg lg:text-2xl text-center font-semibold'>Hand on Cash: {hand_on_cash}</h1>
			</div>
			<div className='mt-10 flex flex-col lg:flex-row items-center justify-center gap-5'>
				<button onClick={() => setRevenueModal(!revenueModal)} className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-3 lg:px-5 py-1 rounded-md text-md lg:text-lg lg:font-semibold">
					Make a Revenue Transections
				</button>
				<button onClick={() => setExpenseModal(!expenseModal)} className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-3 lg:px-5 py-1 rounded-md text-md lg:text-lg lg:font-semibold">
					Make a Expense Transections
				</button>

			</div>
			<div className='mt-10 flex flex-col lg:flex-row items-center justify-center gap-5'>
				<Link to={`/admin/revenue_transections_details`} state={{ pathname: location.pathname }} className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-3 lg:px-5 py-1 rounded-md text-md lg:text-lg lg:font-semibold">
					See Current Month All Revenue Transections
				</Link>
				<Link to={`/admin/expense_transections_details`} state={{ pathname: location.pathname }} className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-3 lg:px-5 py-1 rounded-md text-md lg:text-lg lg:font-semibold">
					See Current Month All Expense Transections
				</Link>
			</div>
			<div className='mt-10 flex flex-col lg:flex-row items-center justify-center gap-5'>
				<button onClick={() => handleClosingMonth()} className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-3 lg:px-5 py-1 rounded-md text-md lg:text-lg lg:font-semibold">
					Close The Month
				</button>
				<Link to={`/admin/shop_transections_summary`} state={{ pathname: location.pathname }} className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-3 lg:px-5 py-1 rounded-md text-md lg:text-lg lg:font-semibold">
					See Shop Monthly Transections Summary
				</Link>
			</div>

		</div>
	);
};

export default ShopTransections;