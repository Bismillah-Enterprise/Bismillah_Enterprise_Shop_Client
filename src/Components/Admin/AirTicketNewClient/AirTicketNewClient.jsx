import React, { useRef, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AirTicketNewClient = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.pathname;
    const [value, setValue] = useState('');
    const [numberAlert, setNumberAlert] = useState(false);
    const handleCreateNewClient = () => {
        const clientName = clientNameRef.current.value;
        const address = addressRef.current.value;
        const phoneNo = phoneNoRef.current.value;
        const dateOfBirth = dateOfBirthRef.current.value;
        const passportNo = passportNoRef.current.value;
        const dateOfExpiry = dateOfExpiryRef.current.value;
        const newClient = {
            name: clientName,
            mobile_no: `0${phoneNo}`,
            date_of_birth: dateOfBirth,
            passport_no: passportNo,
            date_of_expiry: dateOfExpiry,
            address,
            vouchers: [],
            transections: []
        }
        const pn = `0${phoneNo}`
        if (pn.length < 11 || pn.length > 11 || value.charAt(0) !== '1') {
            setNumberAlert(true);
            return;
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
                fetch(`https://bismillah-enterprise-server.onrender.com/air_ticket_new_client`, {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(newClient)
                })
                    .then(res => res.json())
                    .then(data => {
                        clientNameRef.current.value = '';
                        dateOfBirthRef.current.value = '';
                        passportNoRef.current.value = '';
                        dateOfExpiryRef.current.value = '';
                        addressRef.current.value = '';
                        phoneNoRef.current.value = '';
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "New Client Added Successfully",
                            showConfirmButton: false,
                            timer: 1000
                        }).then(() => {
                            setNumberAlert(false);
                            navigate(location?.state?.pathname);
                        })
                    });
            }
        })
    }
    const clientNameRef = useRef();
    const addressRef = useRef();
    const phoneNoRef = useRef();
    const dateOfBirthRef = useRef();
    const passportNoRef = useRef();
    const dateOfExpiryRef = useRef();
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
                        <div className='text-pink-200 flex flex-col items-start w-full gap-2 mt-2'>
                            <p>Client Name</p>
                            <div className='px-3 border-2 rounded-xl h-8 shadow-2xl shadow-pink-300  w-full'>
                                <input ref={clientNameRef} type="text" className='outline-none w-full' placeholder='Enter Client Name' />
                            </div>
                        </div>
                        <div className='text-pink-200 flex flex-col items-start w-full gap-2 mt-2'>
                            <p>Date of Birth</p>
                            <div className='px-3 border-2 rounded-xl h-8 shadow-2xl shadow-pink-300  w-full'>
                                <input ref={dateOfBirthRef} type="text" className='outline-none w-full' placeholder='Enter Client Date of Birth' />
                            </div>
                        </div>
                        <div className='text-pink-200 flex flex-col items-start w-full gap-2 mt-2'>
                            <p>Passport No</p>
                            <div className='px-3 border-2 rounded-xl h-8 shadow-2xl shadow-pink-300  w-full'>
                                <input ref={passportNoRef} type="text" className='outline-none w-full' placeholder='Enter Client Passport No' />
                            </div>
                        </div>
                        <div className='text-pink-200 flex flex-col items-start w-full gap-2 mt-2'>
                            <p>Date of Expiry</p>
                            <div className='px-3 border-2 rounded-xl h-8 shadow-2xl shadow-pink-300  w-full'>
                                <input ref={dateOfExpiryRef} type="text" className='outline-none w-full' placeholder='Passport Date of Expiry' />
                            </div>
                        </div>
                        <div className='text-pink-200 flex flex-col items-start w-full gap-2 mt-2'>
                            <p>Phone Number</p>
                            <div className={`${numberAlert ? 'border-red-500' : ''} px-3 border-2 rounded-xl h-8 shadow-2xl shadow-pink-300  w-full`}>
                                <NumericFormat
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
                        <div className='text-pink-200 flex flex-col items-start w-full gap-2 mt-2'>
                            <p>Address</p>
                            <div className='px-3 border-2 rounded-xl h-8 shadow-2xl shadow-pink-300  w-full'>
                                <input ref={addressRef} type="text" className='outline-none w-full' placeholder='Enter Client Address' />
                            </div>
                        </div>
                    </div>
                    <button onClick={handleCreateNewClient} className=' my-5 text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-lg font-semibold mb-5 lg:mb-0'>Submit Client Information</button>
                </div>
            </div>
        </div>
    );
};

export default AirTicketNewClient;