import React, { useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const CreateNewClient = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.pathname;
    const handleCreateNewClient = () => {
        const clientName = clientNameRef.current.value;
        const onBehalf = onBehalfRef.current.value;
        const address = addressRef.current.value;
        const phoneNo = phoneNoRef.current.value;
        const newClient = {
            name: clientName,
            on_behalf: onBehalf,
            mobile_no: phoneNo,
            address,
            vouchers: [],
            transections: []
        }
        Swal.fire({
            title: "Are you sure?",
            text: `You Are Creating a New Client`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, I am Sure"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`https://bismillah-enterprise-server.onrender.com/new_client`, {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(newClient)
                })
                    .then(res => res.json())
                    .then(data => {
                        clientNameRef.current.value = ''
                        onBehalfRef.current.value = '';
                        addressRef.current.value = '';
                        phoneNoRef.current.value = '';
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "New Client Added Successfully",
                            showConfirmButton: false,
                            timer: 1000
                        }).then(() => {
                            navigate(location?.state?.pathname)
                        })
                    });
            }
        })
    }
    const clientNameRef = useRef();
    const onBehalfRef = useRef();
    const addressRef = useRef();
    const phoneNoRef = useRef();
    return (
        <div>
            <div className='flex items-center justify-start'>
                <Link to={from}>
                    <button className="hidden md:block text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
                        Back
                    </button>
                </Link>
            </div>
            <h2 className="text-2xl text-pink-300 font-semibold text-center">Create A New Client</h2>
            <div className='h-fit min-h-[320px] flex lg:justify-center duration-300'>
                <div className="text-pink-200 shadow-lg shadow-pink-200 flex flex-col items-center justify-center mt-10 w-fit rounded-2xl px-10 py-5">
                    <h1 className='text-lg lg:text-2xl font-semibold'>Enter Client Informations</h1>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                        <div>
                            <div className='text-pink-200 flex flex-col items-start w-full gap-2 mt-4'>
                                <p>Client Name</p>
                                <div className='px-3 border-2 rounded-xl h-8 shadow-2xl shadow-pink-300  w-full'>
                                    <input ref={clientNameRef} type="text" className='outline-none w-full' />
                                </div>
                            </div>
                            <div className='text-pink-200 flex flex-col items-start w-full gap-2 mt-4'>
                                <p>On Behalf</p>
                                <div className='px-3 border-2 rounded-xl h-8 shadow-2xl shadow-pink-300  w-full'>
                                    <input ref={onBehalfRef} type="text" className='outline-none w-full' />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className='text-pink-200 flex flex-col items-start w-full gap-2 mt-4'>
                                <p>Address</p>
                                <div className='px-3 border-2 rounded-xl h-8 shadow-2xl shadow-pink-300  w-full'>
                                    <input ref={addressRef} type="text" className='outline-none w-full' />
                                </div>
                            </div>
                            <div className='text-pink-200 flex flex-col items-start w-full gap-2 mt-4'>
                                <p>Phone Number</p>
                                <div className='px-3 border-2 rounded-xl h-8 shadow-2xl shadow-pink-300  w-full'>
                                    <input ref={phoneNoRef} type="text" className='outline-none w-full' />
                                </div>
                            </div>
                        </div>
                    </div>
                    <button onClick={handleCreateNewClient} className=' my-5 text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-lg font-semibold mb-5 lg:mb-0'>Submit Client Information</button>
                </div>
            </div>
        </div>
    );
};

export default CreateNewClient;