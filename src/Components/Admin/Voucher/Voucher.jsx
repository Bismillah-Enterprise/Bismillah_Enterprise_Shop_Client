import React, { useRef, useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { NumberFormatBase, NumericFormat } from 'react-number-format';
import { Link, useLoaderData, useLocation, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const Voucher = () => {
    const { voucher_no } = useParams();
    console.log(voucher_no);
    const client = useLoaderData();
    const matchedVoucher = client.vouchers.find(
        (voucher) => voucher.voucher_no === voucher_no
    );
    const location = useLocation();
    const from = location?.state?.pathname;
    const navigate = useNavigate();
    const [modal, setModal] = useState(false);
    const [statusError, setStatusError] = useState(false);
    const now = new Date();
    const Time = now.toLocaleTimeString('en-BD', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
    const currentDate = now.toLocaleDateString('en-BD', {
        day: 'numeric',
        year: 'numeric',
        month: 'long',
    });

    const transection_amount_ref = useRef();
    const payment_status_ref = useRef();
    const voucherPrintRef = useRef();

    const handlePrint = () => {
        const printContents = voucherPrintRef.current.innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        navigate(location.pathname)
    };
    const handleTakePayment = (id) => {
        const transectionAmount = parseFloat(transection_amount_ref.current.value).toFixed(2);
        if (payment_status_ref.current.value === '') {
            setStatusError(true);
            return;
        }
        let newDue = parseFloat(matchedVoucher.due_amount) - transectionAmount;
        if (payment_status_ref.current.value === 'Paid') {
            newDue = 0
        }
        const paymentDetails = {
            date: `${currentDate}, ${Time}`,
            reference_voucher: voucher_no,
            paid_amount: parseFloat(transectionAmount),
            due: parseFloat(newDue).toFixed(2),
            payment_status: payment_status_ref.current.value,
            voucher_no: `${voucher_no}`
        }
        console.log(paymentDetails);
        Swal.fire({
            title: "Are you sure?",
            text: `You Are Taking a Payment From ${client.name}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, I am Sure"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:5000/take_payment/${id}`, {
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(paymentDetails)
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            transection_amount_ref.current.value = '';
                            payment_status_ref.current.value = '';
                            setModal(!modal);
                            navigate(location.pathname)
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: 'Payment Taking Successfully',
                                showConfirmButton: false,
                                timer: 1000,
                            })
                        }
                    })
            }

        })
    }
    return (
        <div className='relative'>
            {/* modal */}
            <div id='staff_details_modal' className={`${!modal ? 'hidden' : 'block'}  w-[350px] bg-black shadow-md shadow-pink-200 rounded-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}>
                <div className='flex justify-end -top-[10px] -right-[10px] relative'>
                    <MdOutlineCancel onClick={() => { !setModal(!modal) }} className='text-pink-200 text-3xl cursor-pointer'></MdOutlineCancel>
                </div>
                <div className='mb-4'>
                    <h1 className='text-lg font-semibold text-pink-300 text-center mb-2'>Payment Details</h1>
                    <hr className='text-pink-300 w-full' />
                </div>
                <div className='text-pink-200 flex flex-col gap-5 px-8 pt-0 pb-7 items-center h-full w-full'>
                    <div className='mt-2 w-full'>
                        <h1 className='lg:text-lg font-semibold mb-2'>Transection Amount</h1>
                        <div className='px-3 border-2 rounded-xl h-8 shadow-2xl shadow-pink-300 w-full'>
                            <NumericFormat
                                getInputRef={transection_amount_ref}
                                className="outline-none w-full h-full"
                                placeholder="Enter Amount"
                                allowNegative={false}
                                decimalScale={2}
                                fixedDecimalScale={false}
                                thousandSeparator={false}
                            />
                        </div>
                    </div>
                    <div className='mt-2 w-full'>
                        <div className='flex items-center gap-5'>
                            <h1 className='lg:text-lg font-semibold'>Transection Type: </h1>
                            <select ref={payment_status_ref} className='px-3 outline-none border p-1 rounded-md' name="user_category_in_shop" id="user_category">
                                <option defaultChecked className='text-xs text-black bg-gray' value=""></option>
                                <option className='text-xs text-black bg-gray' value="Due">Due</option>
                                <option className='text-xs text-black bg-gray' value="Paid">Paid</option>
                            </select>
                        </div>
                        <p className={`text-red-500 font-thin ${statusError ? 'block' : 'hidden'}`}>Please select the status</p>
                    </div>
                    <button onClick={() => handleTakePayment(client._id)} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-lg font-semibold mb-5 lg:mb-0'>Submit</button>
                </div>
            </div>
            {/* end modal */}
            <div>
                <div className='flex items-center justify-start'>
                    <Link to={from}>
                        <button className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
                            Back
                        </button>
                    </Link>
                </div>
                <div className='flex items-center justify-center nunito'>
                    <h1 className="nunito text-2xl text-center font-bold px-5 text-pink-300">
                        Voucher - {voucher_no}
                    </h1>
                </div>
                <div className='flex items-center justify-center'>
                    <div className='text-lg font-semibold grid grid-cols-2 text-pink-200 min-w-[380px] sm:min-w-[70%]'>
                        <div className=''>
                            <h1>Name: {client.name}</h1>
                            <h1>Address: {client.address}</h1>
                        </div>
                        <div className='flex justify-end'>
                            <div>
                                <h1>Date: {matchedVoucher.date}</h1>
                                <h1>Mobile No: {client.mobile_no}</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center sm:justify-center mt-5 overflow-x-scroll sm:overflow-x-hidden overflow-y-hidden scrollbar-hide text-xs lg:text-lg">
                    {matchedVoucher ? (
                        <table className="text-pink-200 min-w-[380px] sm:min-w-[70%]">
                            <thead>
                                <tr className="text-pink-300">
                                    <th className="p-2 border">SL</th>
                                    <th className="p-2 border">Product Name</th>
                                    <th className="p-2 border">Quantity</th>
                                    <th className="p-2 border">Rate</th>
                                    <th className="p-2 border">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {matchedVoucher.products?.map((product, index) => (
                                    <tr key={index}>
                                        <td className="p-2 border">{index + 1}</td>
                                        <td className="p-2 border">{product.product_name}</td>
                                        <td className="p-2 border">{product.quantity}</td>
                                        <td className="p-2 border">
                                            {product.rate.$numberDouble || product.rate}
                                        </td>
                                        <td className="p-2 border">{product.total}</td>
                                    </tr>
                                ))}
                                <tr className='text-pink-300'>
                                    <td className="p-2 border" colSpan={3}></td>
                                    <td className="p-2 border text-right">Total Bill</td>
                                    <td className="p-2 border">{matchedVoucher.total}</td>
                                </tr>
                            </tbody>
                        </table>

                    ) : (
                        <p className="text-red-600 mt-4">Voucher not found.</p>
                    )}
                </div>
            </div>
            <div className='flex items-center justify-center px-5'>
                {
                    matchedVoucher ? (
                        <div className='flex items-center justify-between gap-8 text-pink-200 mt-5 text-lg min-w-[380px] sm:min-w-[70%] font-semibold'>
                            <h1>Payment Status: <span className={`${matchedVoucher.payment_status === 'Due' ? 'text-red-500' : 'text-green-500'}`}>{matchedVoucher.payment_status}</span></h1>
                            <h1>Total Paid: <span className='text-pink-300'>{matchedVoucher.paid_amount}</span></h1>
                            <h1>Due: <span className='text-pink-300'>{matchedVoucher.due_amount}</span></h1>
                        </div>
                    )
                        : ''
                }
            </div>
            <div className='flex flex-col items-center justify-center gap-5 mt-8 mb-10'>
                <div className='flex items-center justify-center gap-5'>
                    <button onClick={() => { setModal(true) }} className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
                        Take A Payment
                    </button>
                    <button onClick={handlePrint} className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
                        Print
                    </button>
                </div>
            </div>
            <div ref={voucherPrintRef} className='nunito w-[550px] hidden'>
                <div className='flex items-center justify-center mt-3 gap-4'>
                    <img className='w-[50px] h-[50px]' src='https://i.ibb.co/01Zf9m1/logo.png'></img>
                    <div className='text-center text-2xl font-bold'>
                        <h1>BISMILLAH ENTERPRISE</h1>
                        <h1 className='text-sm'>Jokshin Bazar, Lakshmipur</h1>
                    </div>
                </div>
                <div className='flex items-center justify-center'>
                    <div className='text-sm font-semibold grid grid-cols-2 text-black w-full'>
                        <div className=''>
                            <h1>Name: {client.name}</h1>
                            <h1>Address: {client.address}</h1>
                        </div>
                        <div className='flex justify-end'>
                            <div>
                                <h1>Date: {matchedVoucher.date}</h1>
                                <h1>Mobile No: {client.mobile_no}</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex items-center justify-center nunito'>
                    <h1 className="nunito text-xl text-center font-bold px-5 text-black">
                        Voucher - {voucher_no}
                    </h1>
                </div>
                <div className="flex items-center justify-center mt-1 overflow-x-scroll sm:overflow-x-hidden overflow-y-hidden scrollbar-hide text-md">
                    <table className="text-black w-full">
                        <thead>
                            <tr className="text-black">
                                <th className="p-2 border">SL</th>
                                <th className="p-2 border">Product Name</th>
                                <th className="p-2 border">Quantity</th>
                                <th className="p-2 border">Rate</th>
                                <th className="p-2 border">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {matchedVoucher.products?.map((product, index) => (
                                <tr key={index}>
                                    <td className="p-2 border">{index + 1}</td>
                                    <td className="p-2 border">{product.product_name}</td>
                                    <td className="p-2 border">{product.quantity}</td>
                                    <td className="p-2 border">
                                        {product.rate.$numberDouble || product.rate}
                                    </td>
                                    <td className="p-2 border">{product.total}</td>
                                </tr>
                            ))}
                            <tr className='text-black'>
                                <td className="p-2 border" colSpan={3}></td>
                                <td className="p-2 border text-right">Total Bill</td>
                                <td className="p-2 border">{matchedVoucher.total}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Voucher;