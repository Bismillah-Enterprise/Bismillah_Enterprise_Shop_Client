import React from 'react';
import { Link, useLoaderData, useLocation } from 'react-router-dom';

const AirTicketClientTransections = () => {
    const client = useLoaderData();
    const location = useLocation();
    const from = location?.state?.pathname;
    return (
        <div>
            <div className='grid grid-cols-3 items-center mt-5'>
                <div className='flex items-center justify-start'>
                    <Link to={from}>
                        <button className="hidden md:block text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
                            Back
                        </button>
                    </Link>
                </div>
                <div>
                    <h1 className='font-semibold md:text-2xl text-pink-300 text-center'>{client.name}</h1>
                    <h1 className='font-semibold md:text-sm text-pink-300 text-center'>{client.address}</h1>
                    <h1 className='font-semibold md:text-md text-pink-300 text-center'>{client.destination}</h1>
                </div>
            </div>
            <div className='flex items-center justify-center mt-5 mb-2 gap-5'>
                <h1 className="text-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
                    Client's All Transections
                </h1>
            </div>
            <div>
                <div className="flex items-center sm:justify-center mt-5 overflow-x-scroll sm:overflow-x-hidden overflow-y-hidden scrollbar-hide text-xs lg:text-lg">
                    <table className="text-pink-200 min-w-[380px] sm:min-w-[70%] text-[14px]">
                        <tbody>
                            <tr>
                                <th>SL No</th>
                                <th>Date</th>
                                <th>Reference Voucher No</th>
                                <th>Transection Amount</th>
                                <th>Total Paid</th>
                                <th>Due Amount</th>
                                <th>Status</th>
                            </tr>
                            {
                                client.transections?.map((transection, index) =>
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{transection.date}</td>
                                        <td>{transection.reference_voucher}</td>
                                        <td>{transection.transection_amount}</td>
                                        <td>{transection.paid_amount}</td>
                                        <td>{transection.due_amount}</td>
                                        <td className={`${transection.payment_status === 'Paid' ? 'text-green-500' : 'text-red-500'}`}>{transection.payment_status}</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AirTicketClientTransections;