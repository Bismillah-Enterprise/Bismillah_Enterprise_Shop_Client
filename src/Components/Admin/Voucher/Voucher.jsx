import React, { useRef } from 'react';
import { Link, useLoaderData, useLocation, useNavigate, useParams } from 'react-router-dom';

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


    const voucherPrintRef = useRef();

    const handlePrint = () => {
        const printContents = voucherPrintRef.current.innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        navigate(location.pathname)
    };
    console.log(matchedVoucher)
    return (
        <div>
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
                            <h1>Total Paid: <span className='text-pink-300'>{matchedVoucher.paid_amount}</span></h1>
                            <h1>Due: <span className='text-pink-300'>{matchedVoucher.due_amount}</span></h1>
                        </div>
                    )
                        : ''
                }
            </div>
            <div className='flex items-center justify-center gap-5 mt-5 mb-10'>
                <button onClick={handlePrint} className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
                    Close Voucher
                </button>
                <button onClick={handlePrint} className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
                    Print
                </button>
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