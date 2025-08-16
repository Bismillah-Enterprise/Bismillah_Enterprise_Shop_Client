import React, { useRef, useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ClientCorner = () => {
    const loadClient = useLoaderData();
    const [allClient, setAllClient] = useState(loadClient);
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
    const handleSearch = (text) => {
        const filterClient = loadClient.filter(client => ((client.name).toLowerCase()).includes(text.toLowerCase()));
        setAllClient(filterClient);
    }
    const handleClearSerch = () => {
        search_ref.current.value = '';
        setAllClient(loadClient);
    }
    const search_ref = useRef();
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
            <div className='flex justify-center mt-3'>
                <div className='flex items-center justify-center border-2 border-pink-300 w-[50%] pl-2 pr-1 py-1 rounded-2xl'>
                    <div className='flex-1'>
                        <input
                            type="text"
                            onChange={(e) => { handleSearch(e.target.value) }}
                            ref={search_ref}
                            className="w-full p-1 outline-none text-pink-300"
                            placeholder='Enter Your Search Keywords'
                        />
                    </div>
                    <MdOutlineCancel onClick={handleClearSerch} className='text-pink-200 text-3xl cursor-pointer'></MdOutlineCancel>
                </div>
            </div>
            <div className='flex items-center justify-center gap-5 mt-5'>
                <Link to={location.pathname.includes('admin') ? `/admin/new_client` : `/new_client`} state={{ pathname: location.pathname }} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md  lg:text-lg font-semibold'>+ Create A New Client</Link>
                <Link to={location.pathname.includes('admin') ? `/admin/new_client_new_voucher` : `/new_client_new_voucher`} state={{ pathname: location.pathname }} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md  lg:text-lg font-semibold'>+ Create A New Client With New Voucher</Link>
            </div>
            {
                allClient?.map((client, index) =>
                    <div key={client._id}>
                        <div className='grid grid-cols-2 gap-5 items-center justify-between border-b-2 border-pink-200 py-4'>
                            <div className='col-span-1 text-pink-300 flex items-center gap-5'>
                                <div className='flex items-center justify-center text-lg font-bold text-pink-400 h-10 w-10 rounded-full border-2 border-r-pink-400 p-5'>{index + 1}</div>
                                <div>
                                    <h1 className={`font-semibold md:text-xl ${client.vouchers.filter(voucher => voucher.payment_status === 'Unpaid').length > 0 ? 'text-red-500' : ''}`}>{client.name}</h1>
                                    <div className='flex items-center gap-3 flex-col lg:flex-row'>
                                        <h1 className='font-semibold md:text-md'>{client.on_behalf}</h1>
                                        <h1 className='font-semibold md:text-md'>{client.mobile_no}</h1>
                                    </div>
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