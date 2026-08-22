import React, { useRef, useState } from 'react';
import { MdArrowBack, MdPersonAdd, MdSave } from 'react-icons/md';
import { NumericFormat } from 'react-number-format';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const CreateNewClient = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.pathname;

    const [value, setValue] = useState('');
    const [numberAlert, setNumberAlert] = useState(false);
    const [loading, setLoading] = useState(false);

    const clientNameRef = useRef();
    const onBehalfRef = useRef();
    const addressRef = useRef();
    const phoneNoRef = useRef();

    const handleCreateNewClient = () => {
        const clientName = clientNameRef.current.value.trim();
        const onBehalf = onBehalfRef.current.value.trim();
        const address = addressRef.current.value.trim();
        const phoneNo = phoneNoRef.current.value;

        const pn = `0${phoneNo}`;

        if (!clientName || !onBehalf || !address) {
            Swal.fire({
                title: 'Incomplete Information',
                text: 'Please fill in all client information.',
                icon: 'warning',
                background: '#0b1a17',
                color: '#ecfdf5',
                confirmButtonColor: '#10b981',
            });
            return;
        }

        if (pn.length !== 11 || value.charAt(0) !== '1') {
            setNumberAlert(true);
            return;
        }

        const newClient = {
            name: clientName,
            on_behalf: onBehalf,
            mobile_no: phoneNo,
            address,
            vouchers: [],
            transections: [],
        };

        Swal.fire({
            title: 'Create New Client?',
            text: 'The new client will be added to your client list.',
            icon: 'question',
            background: '#0b1a17',
            color: '#ecfdf5',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#334155',
            confirmButtonText: 'Create Client',
        }).then((result) => {
            if (!result.isConfirmed) return;

            setLoading(true);
            fetch(`https://bismillah-enterprise-server.onrender.com/new_client`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(newClient),
            })
                .then((res) => res.json())
                .then(() => {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Client Created',
                        text: 'New client added successfully.',
                        background: '#0b1a17',
                        color: '#ecfdf5',
                        showConfirmButton: false,
                        timer: 1200,
                    }).then(() => {
                        navigate(from || '/client_corner');
                    });
                })
                .catch(() => {
                    Swal.fire({
                        title: 'Something went wrong',
                        text: 'Unable to create the client.',
                        icon: 'error',
                        background: '#0b1a17',
                        color: '#ecfdf5',
                        confirmButtonColor: '#10b981',
                    });
                })
                .finally(() => setLoading(false));
        });
    };

    return (
        <div className="min-h-full py-5 sm:py-8">

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">

                <Link
                    to={from || '/client_corner'}
                    className="hidden md:flex group items-center gap-2 px-4 py-2 rounded-xl
                    border border-white/10 bg-white/[0.03]
                    text-slate-300 hover:text-emerald-300
                    hover:border-emerald-400/30
                    transition-all duration-300"
                >
                    <MdArrowBack className="text-xl group-hover:-translate-x-1 transition-transform" />
                    Back
                </Link>

                <div className="flex-1 flex items-center justify-center md:justify-start gap-3">
                    <div className="p-3 rounded-xl bg-emerald-400/10 border border-emerald-400/20">
                        <MdPersonAdd className="text-2xl text-emerald-300" />
                    </div>

                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-white">
                            Create New Client
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Add a new client to your records
                        </p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-3xl mx-auto">

                <div className="relative overflow-hidden rounded-3xl
                    border border-white/[0.08]
                    bg-white/[0.025] backdrop-blur-xl
                    p-5 sm:p-8
                    shadow-[0_25px_80px_rgba(0,0,0,0.25)]">

                    <div className="absolute -top-32 -right-32 w-72 h-72 rounded-full
                        bg-emerald-400/5 blur-[100px] pointer-events-none" />

                    <div className="relative">

                        <div className="mb-7">
                            <h2 className="text-lg font-bold text-white">
                                Client Information
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                                Enter the basic information of your client.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-2">
                                    Client Name
                                </label>

                                <input
                                    ref={clientNameRef}
                                    type="text"
                                    placeholder="Enter client name"
                                    className="w-full px-4 py-3 rounded-xl
                                    bg-white/[0.035]
                                    border border-white/10
                                    text-slate-200 placeholder:text-slate-700
                                    outline-none
                                    focus:border-emerald-400/40
                                    focus:bg-emerald-400/[0.025]
                                    transition-all duration-300"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-2">
                                    On Behalf
                                </label>

                                <input
                                    ref={onBehalfRef}
                                    type="text"
                                    placeholder="Enter representative name"
                                    className="w-full px-4 py-3 rounded-xl
                                    bg-white/[0.035]
                                    border border-white/10
                                    text-slate-200 placeholder:text-slate-700
                                    outline-none
                                    focus:border-emerald-400/40
                                    focus:bg-emerald-400/[0.025]
                                    transition-all duration-300"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-2">
                                    Address
                                </label>

                                <input
                                    ref={addressRef}
                                    type="text"
                                    placeholder="Enter client address"
                                    className="w-full px-4 py-3 rounded-xl
                                    bg-white/[0.035]
                                    border border-white/10
                                    text-slate-200 placeholder:text-slate-700
                                    outline-none
                                    focus:border-emerald-400/40
                                    focus:bg-emerald-400/[0.025]
                                    transition-all duration-300"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-2">
                                    Phone Number
                                </label>

                                <div className={`px-4 py-3 rounded-xl
                                    bg-white/[0.035]
                                    border ${numberAlert
                                        ? 'border-red-500'
                                        : 'border-white/10'
                                    }
                                    focus-within:border-emerald-400/40
                                    transition-all`}
                                >
                                    <NumericFormat
                                        getInputRef={phoneNoRef}
                                        className="outline-none w-full bg-transparent text-slate-200 placeholder:text-slate-700"
                                        placeholder="01XXXXXXXXX"
                                        format="0##########"
                                        allowEmptyFormatting={false}
                                        mask="_"
                                        onValueChange={(values) => {
                                            setValue(values.value);
                                            setNumberAlert(false);
                                        }}
                                        isAllowed={(values) => values.value.length <= 11}
                                    />
                                </div>

                                {numberAlert && (
                                    <p className="text-[11px] text-red-400 mt-2">
                                        Enter a valid 11-digit mobile number.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end mt-7">

                            <button
                                onClick={handleCreateNewClient}
                                disabled={loading}
                                className="flex items-center justify-center gap-2
                                w-full sm:w-auto
                                px-6 py-3 rounded-xl
                                bg-emerald-400/10
                                border border-emerald-400/20
                                text-emerald-300
                                hover:bg-emerald-400/15
                                hover:border-emerald-400/40
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                                transition-all duration-300
                                font-semibold text-sm"
                            >
                                <MdSave className="text-xl" />
                                {loading ? 'Creating...' : 'Create Client'}
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateNewClient;