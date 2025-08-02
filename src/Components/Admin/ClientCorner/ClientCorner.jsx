import React from 'react';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ClientCorner = () => {
    const allClient = useLoaderData();
    const location = useLocation();
    const from = location?.state?.pathname;
    const navigate = useNavigate();
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`https://bismillah-enterprise-server.onrender.com/client/${id}`, {
                    method: 'DELETE'
                })
                    .then(res => res.json())
                Swal.fire({
                    title: "Delete",
                    text: "This Client has been Deleted.",
                    icon: "success"
                }).then(() => {
                    navigate(location.pathname)
                })
            }
        });
    }
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
                <Link to={location.pathname.includes('admin') ? `/admin/new_client` : `/new_client`} state={{ pathname: location.pathname }} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md  lg:text-lg font-semibold'>+ Create A New Client</Link>
                <Link to={location.pathname.includes('admin') ?  `/admin/new_client_new_voucher` : `/new_client_new_voucher`} state={{ pathname: location.pathname }} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md  lg:text-lg font-semibold'>+ Create A New Client With New Voucher</Link>
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
                                <Link to={location.pathname.includes('admin') ? `/admin/client_details/${client?._id}` : `/client_details/${client?._id}`} state={{ pathname: location.pathname }} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md  lg:text-lg font-semibold'>View Details</Link>
                                <button onClick={() => { handleDelete(client?._id) }} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md  lg:text-lg font-semibold'>Delete</button>
                            </div>
                        </div>
                    </div>)
            }
        </div>
    );
};

export default ClientCorner;