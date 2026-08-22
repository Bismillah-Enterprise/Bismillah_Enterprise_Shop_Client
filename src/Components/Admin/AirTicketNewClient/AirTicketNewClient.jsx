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
        <div className="relative min-h-full pb-10 text-slate-200">

            {/* Ambient background */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-emerald-500/[0.07] blur-[130px]" />
                <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-cyan-500/[0.06] blur-[140px]" />
                <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-violet-500/[0.05] blur-[150px]" />
            </div>

            {/* Top */}
            <div className="mb-8 flex items-center">
                <Link to={from}>
                    <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-emerald-300">
                        <MdArrowBack />
                        Back
                    </button>
                </Link>
            </div>

            {/* Heading */}
            <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 shadow-lg shadow-emerald-500/5">
                    <MdPersonAddAlt1 className="text-3xl" />
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Create A New Client
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                    Add client information to your air ticket management system
                </p>
            </div>

            {/* Form */}
            <div className="mx-auto max-w-3xl rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 md:p-8 shadow-2xl backdrop-blur-xl">

                <div className="mb-7 flex items-center gap-3 border-b border-white/[0.07] pb-5">
                    <div className="h-9 w-1 rounded-full bg-gradient-to-b from-emerald-400 to-cyan-400" />

                    <div>
                        <h1 className="font-semibold text-white">
                            Client Information
                        </h1>
                        <p className="text-xs text-slate-500">
                            Enter the details below carefully
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                    {/* Name */}
                    <div>
                        <label className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
                            <MdPersonAddAlt1 className="text-emerald-400" />
                            Client Name
                        </label>

                        <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 transition focus-within:border-emerald-400/30 focus-within:bg-emerald-400/[0.03]">
                            <input
                                ref={clientNameRef}
                                type="text"
                                className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-600"
                                placeholder="Enter Client Name"
                            />
                        </div>
                    </div>

                    {/* DOB */}
                    <div>
                        <label className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
                            <MdCalendarMonth className="text-cyan-400" />
                            Date of Birth
                        </label>

                        <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 transition focus-within:border-cyan-400/30 focus-within:bg-cyan-400/[0.03]">
                            <input
                                ref={dateOfBirthRef}
                                type="text"
                                className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-600"
                                placeholder="Enter Date of Birth"
                            />
                        </div>
                    </div>

                    {/* Passport */}
                    <div>
                        <label className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
                            <MdBadge className="text-violet-400" />
                            Passport No
                        </label>

                        <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 transition focus-within:border-violet-400/30 focus-within:bg-violet-400/[0.03]">
                            <input
                                ref={passportNoRef}
                                type="text"
                                className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-600"
                                placeholder="Enter Client Passport No"
                            />
                        </div>
                    </div>

                    {/* Expiry */}
                    <div>
                        <label className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
                            <MdCalendarMonth className="text-violet-400" />
                            Date of Expiry
                        </label>

                        <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 transition focus-within:border-violet-400/30">
                            <input
                                ref={dateOfExpiryRef}
                                type="text"
                                className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-600"
                                placeholder="Passport Date of Expiry"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
                            <MdOutlinePhone className="text-emerald-400" />
                            Phone Number
                        </label>

                        <div className={`rounded-xl border bg-black/20 px-4 py-3 transition ${numberAlert
                            ? 'border-red-400/50 bg-red-400/[0.03]'
                            : 'border-white/10 focus-within:border-emerald-400/30'
                            }`}>
                            <NumericFormat
                                getInputRef={phoneNoRef}
                                className="h-full w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-600"
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

                        {numberAlert && (
                            <p className="mt-1.5 text-xs text-red-400">
                                Please enter a valid 11 digit Bangladeshi phone number.
                            </p>
                        )}
                    </div>

                    {/* Address */}
                    <div>
                        <label className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
                            <MdLocationOn className="text-cyan-400" />
                            Address
                        </label>

                        <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 transition focus-within:border-cyan-400/30">
                            <input
                                ref={addressRef}
                                type="text"
                                className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-600"
                                placeholder="Enter Client Address"
                            />
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleCreateNewClient}
                        className="group flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-gradient-to-r from-emerald-400/15 to-cyan-400/10 px-7 py-3 text-sm font-bold text-emerald-200 shadow-lg shadow-emerald-500/10 transition-all hover:-translate-y-0.5 hover:border-emerald-300/40 hover:shadow-emerald-500/20"
                    >
                        <MdPersonAddAlt1 className="text-xl transition group-hover:scale-110" />
                        Submit Client Information
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AirTicketNewClient;