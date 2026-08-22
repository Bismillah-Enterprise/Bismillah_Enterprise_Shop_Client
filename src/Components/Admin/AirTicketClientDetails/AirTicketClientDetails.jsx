import React, { useRef, useState } from 'react';
import { MdOutlineCancel, MdEdit, MdFlightTakeoff, MdArrowBack, MdPerson, MdBadge, MdPhone, MdCalendarMonth } from 'react-icons/md';
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
        const dateOfBirth = dateOfBirthRef.current.value;
        const passportNo = passportNoRef.current.value;
        const dateOfExpiry = dateOfExpiryRef.current.value;
        const ClientData = {
            name: clientName,
            mobile_no: `0${phoneNo}`,
            date_of_birth: dateOfBirth,
            passport_no: passportNo,
            date_of_expiry: dateOfExpiry,
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
    const dateOfBirthRef = useRef();
    const passportNoRef = useRef();
    const dateOfExpiryRef = useRef();
    return (
        <div className="relative min-h-full pb-10 text-slate-200">

            {/* Ambient background */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-emerald-500/[0.06] blur-[130px]" />
                <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-cyan-500/[0.05] blur-[140px]" />
                <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-violet-500/[0.05] blur-[150px]" />
            </div>

            {/* Back */}
            <div className="mb-6">
                <Link to={location.pathname.includes('admin') ? '/admin/air_ticket_client_corner' : '/client_corner'}>
                    <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-emerald-300">
                        <MdArrowBack />
                        Back
                    </button>
                </Link>
            </div>

            {/* Client hero */}
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 md:p-8 backdrop-blur-xl shadow-2xl">

                <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-emerald-400/[0.07] blur-3xl" />

                <div className="relative flex flex-col items-center text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                        <MdPerson className="text-4xl" />
                    </div>

                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                        {client.name}
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        {client.address}
                    </p>

                    <div className="mt-5 flex flex-wrap justify-center gap-2">
                        <span className="rounded-xl border border-cyan-400/10 bg-cyan-400/5 px-3 py-2 text-xs text-cyan-300">
                            Destination: {client?.vouchers[0]?.destination}
                        </span>

                        <span className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-400">
                            Mobile: {client.mobile_no}
                        </span>

                        <span className="rounded-xl border border-violet-400/10 bg-violet-400/5 px-3 py-2 text-xs text-violet-300">
                            Passport: {client?.passport_no}
                        </span>

                        <span className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-400">
                            Expiry: {client.date_of_expiry}
                        </span>
                    </div>

                    <button
                        onClick={() => { setIsEdit(true) }}
                        className="mt-5 flex items-center gap-2 text-xs font-semibold text-emerald-300 transition hover:text-emerald-200"
                    >
                        <MdEdit />
                        Edit Client Information
                    </button>
                </div>
            </div>

            {/* Edit */}
            <div className={`min-h-[200px] ${isEdit ? 'flex' : 'hidden'} justify-center duration-300`}>
                <div className="relative mt-6 w-full max-w-3xl rounded-3xl border border-white/[0.08] bg-white/[0.035] p-5 md:p-7 shadow-2xl backdrop-blur-xl">

                    <button
                        onClick={() => { setIsEdit(false) }}
                        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl bg-red-400/5 text-slate-400 transition hover:bg-red-400/10 hover:text-red-300"
                    >
                        <MdOutlineCancel className="text-2xl" />
                    </button>

                    <div className="mb-6">
                        <h1 className="text-lg font-bold text-white">
                            Update Client Information
                        </h1>
                        <p className="mt-1 text-xs text-slate-500">
                            Modify the information and submit your changes.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        {[
                            ['Client Name', client.name, clientNameRef, 'text'],
                            ['Client Date of Birth', client.date_of_birth, dateOfBirthRef, 'text'],
                            ['Client Passport No', client.passport_no, passportNoRef, 'text'],
                            ['Date of Expiry', client.date_of_expiry, dateOfExpiryRef, 'text'],
                        ].map(([label, defaultValue, ref, type]) => (
                            <div key={label}>
                                <label className="mb-2 block text-xs font-medium text-slate-400">
                                    {label}
                                </label>

                                <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 focus-within:border-emerald-400/30">
                                    <input
                                        defaultValue={defaultValue}
                                        ref={ref}
                                        type={type}
                                        className="w-full bg-transparent text-sm text-slate-200 outline-none"
                                        placeholder={`Enter ${label}`}
                                    />
                                </div>
                            </div>
                        ))}

                        <div>
                            <label className="mb-2 block text-xs font-medium text-slate-400">
                                Phone Number
                            </label>

                            <div className={`rounded-xl border bg-black/20 px-4 py-3 ${numberAlert
                                ? 'border-red-400/50'
                                : 'border-white/10 focus-within:border-emerald-400/30'
                                }`}>
                                <NumericFormat
                                    defaultValue={client.mobile_no}
                                    getInputRef={phoneNoRef}
                                    className="h-full w-full bg-transparent text-sm text-slate-200 outline-none"
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

                        <div>
                            <label className="mb-2 block text-xs font-medium text-slate-400">
                                Address
                            </label>

                            <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 focus-within:border-emerald-400/30">
                                <input
                                    defaultValue={client.address}
                                    ref={addressRef}
                                    type="text"
                                    className="w-full bg-transparent text-sm text-slate-200 outline-none"
                                    placeholder="Enter Client Address"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={() => { handleEditClientData(client._id) }}
                            className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-6 py-3 text-sm font-bold text-emerald-300 transition hover:bg-emerald-400/20"
                        >
                            Save Client Information
                        </button>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="my-6 grid grid-cols-1 gap-3 sm:grid-cols-2">

                <Link
                    to={location.pathname.includes('admin') ? `/admin/air_ticket_new_voucher/${client?._id}` : `/new_voucher/${client?._id}`}
                    state={{ pathname: location.pathname }}
                    className="flex items-center justify-center rounded-2xl border border-emerald-400/20 bg-gradient-to-r from-emerald-400/10 to-cyan-400/5 px-5 py-3 text-sm font-bold text-emerald-300 transition hover:border-emerald-300/30 hover:bg-emerald-400/15"
                >
                    + Create A New Voucher
                </Link>

                <Link
                    to={location.pathname.includes('admin') ? `/admin/air_ticket_client_transections/${client?._id}` : `/client_transections/${client?._id}`}
                    state={{ pathname: location.pathname }}
                    className="flex items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/5 px-5 py-3 text-sm font-bold text-cyan-300 transition hover:bg-cyan-400/10"
                >
                    See Client Transactions
                </Link>
            </div>

            {/* Voucher table */}
            <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] shadow-2xl backdrop-blur-xl">
                <div className="border-b border-white/[0.07] px-5 py-4">
                    <h2 className="font-semibold text-white">Voucher History</h2>
                    <p className="mt-1 text-xs text-slate-500">
                        All vouchers associated with this client
                    </p>
                </div>

                <div className="overflow-x-auto scrollbar-hide p-5">
                    <table className="w-full min-w-[800px] text-left text-sm">
                        <thead>
                            <tr className="border-b border-white/[0.07] bg-emerald-400/[0.035]">
                                <th className="px-5 py-4 text-xs uppercase tracking-wider text-emerald-300">SL No</th>
                                <th className="px-5 py-4 text-xs uppercase tracking-wider text-emerald-300">Date</th>
                                <th className="px-5 py-4 text-xs uppercase tracking-wider text-emerald-300">Voucher No</th>
                                <th className="px-5 py-4 text-xs uppercase tracking-wider text-emerald-300">Paid</th>
                                <th className="px-5 py-4 text-xs uppercase tracking-wider text-emerald-300">Due</th>
                                <th className="px-5 py-4 text-xs uppercase tracking-wider text-emerald-300">Status</th>
                                <th className="px-5 py-4 text-xs uppercase tracking-wider text-emerald-300">Details</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                client.vouchers?.map((voucher, index) =>
                                    <tr
                                        key={index}
                                        className="border-b border-white/[0.05] transition hover:bg-white/[0.025]"
                                    >
                                        <td className="px-5 py-4 text-slate-500">
                                            {String(index + 1).padStart(2, '0')}
                                        </td>

                                        <td className="px-5 py-4 text-slate-300">
                                            {voucher.date}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="rounded-lg border border-cyan-400/10 bg-cyan-400/5 px-3 py-1.5 text-cyan-300">
                                                {voucher.voucher_no}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 font-semibold text-emerald-300">
                                            {voucher.paid_amount}
                                        </td>

                                        <td className="px-5 py-4 font-semibold text-orange-300">
                                            {voucher.due_amount}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${voucher.payment_status === 'Paid'
                                                ? 'border-emerald-400/10 bg-emerald-400/10 text-emerald-300'
                                                : 'border-red-400/10 bg-red-400/10 text-red-300'
                                                }`}>
                                                {voucher.payment_status}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <Link
                                                to={location.pathname.includes('admin') ? `/admin/air_ticket_voucher/${client._id}/${voucher.voucher_no}` : `/voucher/${client._id}/${voucher.voucher_no}`}
                                                state={{ pathname: location?.pathname }}
                                                className="font-semibold text-cyan-300 transition hover:text-cyan-200"
                                            >
                                                View Details →
                                            </Link>
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