import React from 'react';
import { Link, useLoaderData, useLocation } from 'react-router-dom';

const ClientDetails = () => {
    const client = useLoaderData();
    const location = useLocation();
    const from = location?.state?.pathname;
    return (
        <div>
            <div className='md:grid grid-cols-3 items-center mt-5'>
                <div className='flex items-center justify-start'>
                    <Link to={location.pathname.includes('admin') ? '/admin/client_corner' : '/client_corner'}>
                        <button className="hidden md:block text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
                            Back
                        </button>
                    </Link>
                </div>
                <div>
                    <h1 className='font-semibold md:text-2xl text-pink-300 text-center'>{client.name}</h1>
                    <h1 className='font-semibold md:text-sm text-pink-300 text-center'>{client.address}</h1>
                    <h1 className='font-semibold md:text-md text-pink-300 text-center'>{client.on_behalf}</h1>
                </div>
            </div>
            <div className='flex flex-col md:flex-row items-center justify-center mt-5 mb-2 gap-5'>
                <Link to={location.pathname.includes('admin') ? `/admin/new_voucher/${client?._id}` : `/new_voucher/${client?._id}`} state={{ pathname: location.pathname }} className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
                    Create A New Voucher
                </Link>
                <Link to={location.pathname.includes('admin') ? `/admin/client_transections/${client?._id}` : `/client_transections/${client?._id}`} state={{ pathname: location.pathname }} className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
                    See Client Transections
                </Link>
            </div>
            <div>
                <div className="flex items-center sm:justify-center mt-5 overflow-x-scroll sm:overflow-x-hidden overflow-y-hidden scrollbar-hide text-xs lg:text-lg">
                    <table className="text-pink-200 w-full md:min-w-[70%]">
                        <tbody>
                            <tr>
                                <th>SL No</th>
                                <th>Date</th>
                                <th>Voucher No</th>
                                <th>Paid Amount</th>
                                <th>Due Amount</th>
                                <th>Status</th>
                                <th>View Details</th>
                            </tr>
                            {
                                client.vouchers?.map((voucher, index) =>
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{voucher.date}</td>
                                        <td>{voucher.voucher_no}</td>
                                        <td>{voucher.paid_amount}</td>
                                        <td>{voucher.due_amount}</td>
                                        <td className={`${voucher.payment_status === 'Paid' ? 'text-green-500' : 'text-red-500'}`}>{voucher.payment_status}</td>
                                        <td>
                                            <Link to={location.pathname.includes('admin') ? `/admin/voucher/${client._id}/${voucher.voucher_no}` : `/voucher/${client._id}/${voucher.voucher_no}`} state={{ pathname: location?.pathname }} className='text-pink-300 hover:text-pink-400 underline'>View Details</Link>
                                        </td>
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

export default ClientDetails;