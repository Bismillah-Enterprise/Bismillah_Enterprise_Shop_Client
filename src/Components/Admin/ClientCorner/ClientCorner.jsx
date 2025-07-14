import React from 'react';
import { Link, useLoaderData, useLocation } from 'react-router-dom';

const ClientCorner = () => {
    const allClient = useLoaderData();
    const location = useLocation();
    const from = location?.state?.pathname;
    return (
        <div>
            <div className='flex items-center justify-start'>
                <Link to={from}>
                    <button className="hidden md:block text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
                        Back
                    </button>
                </Link>
            </div>
            <h2 className="text-2xl text-pink-300 font-semibold text-center">Client Corner</h2>
            <div className='flex items-center justify-center gap-5 mt-5'>
                <Link to={`/admin/new_client`} state={{ pathname: location.pathname }} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md  lg:text-lg font-semibold'>+ Create A New Client</Link>
            </div>
            {
                allClient?.map(client =>
                    <div key={client._id}>
                        <div className='grid grid-cols-2 gap-5 items-center justify-between border-b-2 border-pink-200 py-4'>
                            <div className='col-span-1 text-pink-300'>
                                <h1 className='font-semibold md:text-xl'>{client.name}</h1>
                                <div className='flex items-center gap-3 flex-col lg:flex-row'>
                                    <h1 className='font-semibold md:text-md'>{client.on_behalf}</h1>
                                    <h1 className='font-semibold md:text-md'>{client.mobile_no}</h1>
                                </div>
                            </div>
                            <div className='flex justify-end lg:flex-row gap-4 col-span-1'>
                                <Link to={`/admin/client_details/${client?._id}`} state={{ pathname: location.pathname }} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md  lg:text-lg font-semibold'>View Details</Link>
                            </div>
                        </div>
                    </div>)
            }
        </div>
    );
};

export default ClientCorner;