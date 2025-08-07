import React, { useRef, useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { NumericFormat } from 'react-number-format';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AirTicketClientDetails = () => {
    const client = useLoaderData();
    const [isEdit, setIsEdit] = useState(false);
    const [numberAlert, setNumberAlert] = useState(false);
    const location = useLocation();
    const from = location?.state?.pathname;
    const [value, setValue] = useState('');
    const navigate = useNavigate();
    const handleEditClientData = (id) => {
        const clientName = clientNameRef.current.value;
        const address = addressRef.current.value;
        const phoneNo = phoneNoRef.current.value;
        const ClientData = {
            name: clientName,
            mobile_no: `0${phoneNo}`,
            address,
        }
        const pn = `0${phoneNo}`
        if (pn.length < 11 || pn.length > 11 || value.charAt(0) !== '1') {
            setNumberAlert(true);
            return;
        }
        else {
            Swal.fire({
                title: "Are you sure?",
                text: `You Are Updating Client Informations`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, I am Sure"
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch(`https://bismillah-enterprise-server.onrender.com/air_ticket_edit_client_data/${id}`, {
                        method: 'PATCH',
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify(ClientData)
                    })
                        .then(res => res.json())
                        .then(data => {
                            setIsEdit(false);
                            setNumberAlert(false);
                            navigate(location?.pathname);
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Information Updated Successfully",
                                showConfirmButton: false,
                                timer: 1000
                            })
                        });
                }
            })
        }
    }
    const clientNameRef = useRef();
    const addressRef = useRef();
    const phoneNoRef = useRef();
    return (
        <div>
            <div className='md:grid grid-cols-3 items-center mt-5'>
                <div className='flex items-center justify-start'>
                    <Link to={location.pathname.includes('admin') ? '/admin/air_ticket_client_corner' : '/client_corner'}>
                        <button className="hidden md:block text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
                            Back
                        </button>
                    </Link>
                </div>
                <div>
                    <h1 className='font-semibold md:text-2xl text-pink-300 text-center'>{client.name}</h1>
                    <h1 className='font-semibold md:text-sm text-pink-300 text-center'>{client.address}</h1>
                    <h1 className='font-semibold md:text-md text-pink-300 text-center'>Destination: {client.destination}  Mobile No: {client.mobile_no}</h1>
                    <h1 onClick={() => { setIsEdit(true) }} className='underline cursor-pointer text-xs text-pink-300 text-center'>Edit Client Data</h1>
                </div>
            </div>
            <div className={`h-fit min-h-[200px] ${isEdit ? 'flex' : 'hidden'} lg:justify-center duration-300`}>
                <div className="relative text-pink-200 shadow-lg shadow-pink-200 flex flex-col items-center justify-center mt-5 w-fit rounded-2xl p-5">
                    <div className='flex justify-end -top-[10px] -right-[10px] absolute'>
                        <MdOutlineCancel onClick={() => { setIsEdit(false) }} className='text-pink-200 text-3xl cursor-pointer'></MdOutlineCancel>
                    </div>
                    <h1 className='text-md font-semibold'>Enter Update Informations</h1>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-5 text-xs'>
                        <div className='text-pink-200 flex flex-col items-start w-full gap-2 mt-4'>
                            <p>Client Name</p>
                            <div className='px-3 border-2 rounded-xl h-6 shadow-2xl shadow-pink-300  w-full'>
                                <input defaultValue={client.name} ref={clientNameRef} type="text" className='outline-none w-full' placeholder='Enter Client Name' />
                            </div>
                        </div>
                        <div className='text-pink-200 flex flex-col items-start w-full gap-2 mt-4'>
                            <p>Phone Number</p>
                            <div className={`px-3 ${numberAlert ? 'border-red-500' : ''} border-2 rounded-xl h-6 shadow-2xl shadow-pink-300  w-full`}>
                                {/* <input defaultValue={client.mobile_no} onChange={() => { handleClientInfoChange('clientNumber') }} ref={phoneNoRef} type="text" className='outline-none w-full' /> */}
                                <NumericFormat
                                    defaultValue={client.mobile_no}
                                    getInputRef={phoneNoRef}
                                    className="outline-none w-full h-full"
                                    placeholder="Enter Phone Number"
                                    format="0##########"
                                    allowEmptyFormatting={false}
                                    mask="_"
                                    onValueChange={(values) => setValue(values.value)}
                                    isAllowed={(values) => {
                                        return values.value.length <= 11;
                                    }}
                                />
                            </div>
                        </div>
                        <div className='text-pink-200 flex flex-col items-start w-full gap-2 col-span-2'>
                            <p>Address</p>
                            <div className='px-3 border-2 rounded-xl h-6 shadow-2xl shadow-pink-300 w-full'>
                                <input defaultValue={client.address} ref={addressRef} type="text" className='outline-none w-full' placeholder='Enter Client Address' />
                            </div>
                        </div>
                    </div>
                    <button onClick={() => { handleEditClientData(client._id) }} className=' mt-3 text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-3 py-1 rounded-md text-xs font-semibold mb-5 lg:mb-0'>Submit Client Information</button>
                </div>
            </div>
            <div className='flex flex-col md:flex-row items-center justify-center mt-5 mb-2 gap-5'>
                <Link to={location.pathname.includes('admin') ? `/admin/air_ticket_new_voucher/${client?._id}` : `/new_voucher/${client?._id}`} state={{ pathname: location.pathname }} className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
                    Create A New Voucher
                </Link>
                <Link to={location.pathname.includes('admin') ? `/admin/air_ticket_client_transections/${client?._id}` : `/client_transections/${client?._id}`} state={{ pathname: location.pathname }} className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
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
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{voucher.date}</td>
                                        <td>{voucher.voucher_no}</td>
                                        <td>{voucher.paid_amount}</td>
                                        <td>{voucher.due_amount}</td>
                                        <td className={`${voucher.payment_status === 'Paid' ? 'text-green-500' : 'text-red-500'}`}>{voucher.payment_status}</td>
                                        <td>
                                            <Link to={location.pathname.includes('admin') ? `/admin/air_ticket_voucher/${client._id}/${voucher.voucher_no}` : `/voucher/${client._id}/${voucher.voucher_no}`} state={{ pathname: location?.pathname }} className='text-pink-300 hover:text-pink-400 underline'>View Details</Link>
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

export default AirTicketClientDetails;