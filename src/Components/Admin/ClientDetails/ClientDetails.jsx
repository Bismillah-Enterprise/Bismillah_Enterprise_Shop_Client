import React, { useRef, useState } from 'react';
import { MdOutlineCancel, MdArrowBack, MdEdit, MdReceiptLong, MdHistory, MdPerson } from 'react-icons/md';
import { NumericFormat } from 'react-number-format';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ClientDetails = () => {
    const client = useLoaderData();
    const [isEdit, setIsEdit] = useState(false);
    const [numberAlert, setNumberAlert] = useState(false);
    const location = useLocation();
    const from = location?.state?.pathname;
    const [value, setValue] = useState('');
    const navigate = useNavigate();
    const handleEditClientData = (id) => {
        const clientName = clientNameRef.current.value;
        const onBehalf = onBehalfRef.current.value;
        const address = addressRef.current.value;
        const phoneNo = phoneNoRef.current.value;
        const ClientData = {
            name: clientName,
            on_behalf: onBehalf,
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
                    fetch(`http://localhost:5000/edit_client_data/${id}`, {
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
    const onBehalfRef = useRef();
    const addressRef = useRef();
    const phoneNoRef = useRef();

    const totalVouchers = client?.vouchers?.length || 0;

    const paidVouchers =
        client?.vouchers?.filter(
            (voucher) => voucher.payment_status === 'Paid'
        ).length || 0;

    const unpaidVouchers =
        client?.vouchers?.filter(
            (voucher) => voucher.payment_status === 'Unpaid'
        ).length || 0;

    return (
        <div className="min-h-full py-5 sm:py-7 overflow-scroll">

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">

                <Link
                    to={location.pathname.includes('admin') ? '/admin/client_corner': location.pathname.includes('daily_transactions') ? '/daily_transactions/client_corner' : '/client_corner'}
                    className="hidden md:flex group items-center gap-2 px-4 py-2 rounded-xl
                    border border-white/10 bg-white/[0.03]
                    text-slate-300 hover:text-emerald-300
                    hover:border-emerald-400/30 transition-all duration-300"
                >
                    <MdArrowBack className="text-xl group-hover:-translate-x-1 transition-transform" />
                    Back
                </Link>

                <div className="flex-1 flex items-center justify-center md:justify-start gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-400/10 border border-emerald-400/20">
                        <MdPerson className="text-2xl text-emerald-300" />
                    </div>

                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-white">
                            Client Details
                        </h1>
                        <p className="text-xs text-slate-500">
                            Client profile and voucher history
                        </p>
                    </div>
                </div>
            </div>

            {/* Client profile */}
            <div className="relative overflow-hidden rounded-3xl
                border border-white/[0.08]
                bg-white/[0.025] backdrop-blur-xl
                p-5 sm:p-7
                shadow-[0_20px_70px_rgba(0,0,0,0.2)]">

                <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-emerald-400/5 blur-3xl pointer-events-none" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

                    <div className="flex items-center gap-4">

                        <div className="h-16 w-16 rounded-2xl
                            bg-gradient-to-br from-emerald-400/20 to-cyan-400/10
                            border border-emerald-400/20
                            flex items-center justify-center">
                            <MdPerson className="text-3xl text-emerald-300" />
                        </div>

                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-white">
                                {client.name}
                            </h2>

                            <p className="text-sm text-slate-500 mt-1">
                                {client.on_behalf}
                            </p>

                            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-400">
                                <span>{client.mobile_no}</span>
                                <span className="text-slate-700">•</span>
                                <span>{client.address}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsEdit(true)}
                        className="flex items-center justify-center gap-2
                        px-4 py-2.5 rounded-xl
                        border border-white/10
                        bg-white/[0.035]
                        text-slate-300
                        hover:text-emerald-300
                        hover:border-emerald-400/30
                        transition-all duration-300"
                    >
                        <MdEdit />
                        Edit Client
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-4">

                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                    <p className="text-[10px] sm:text-xs text-slate-500">Vouchers</p>
                    <p className="text-xl sm:text-2xl font-bold text-white mt-1">
                        {totalVouchers}
                    </p>
                </div>

                <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.025] p-4">
                    <p className="text-[10px] sm:text-xs text-slate-500">Paid</p>
                    <p className="text-xl sm:text-2xl font-bold text-emerald-400 mt-1">
                        {paidVouchers}
                    </p>
                </div>

                <div className="rounded-2xl border border-red-400/10 bg-red-400/[0.025] p-4">
                    <p className="text-[10px] sm:text-xs text-slate-500">Due</p>
                    <p className="text-xl sm:text-2xl font-bold text-red-400 mt-1">
                        {unpaidVouchers}
                    </p>
                </div>
            </div>

            {/* Edit panel */}
            {isEdit && (
                <div className="mt-5 rounded-3xl border border-emerald-400/15
                    bg-[#091815]/90 backdrop-blur-xl p-5 sm:p-7
                    shadow-[0_20px_70px_rgba(0,0,0,0.3)]">

                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h2 className="font-bold text-white">
                                Update Client Information
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                                Modify the information below.
                            </p>
                        </div>

                        <button
                            onClick={() => setIsEdit(false)}
                            className="text-slate-500 hover:text-red-400 transition-colors"
                        >
                            <MdOutlineCancel className="text-2xl" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {[
                            ['Client Name', clientNameRef, client.name],
                            ['On Behalf', onBehalfRef, client.on_behalf],
                            ['Address', addressRef, client.address],
                        ].map(([label, ref, defaultValue]) => (
                            <div key={label}>
                                <label className="block text-xs text-slate-500 mb-2">
                                    {label}
                                </label>

                                <input
                                    defaultValue={defaultValue}
                                    ref={ref}
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl
                                    bg-white/[0.035]
                                    border border-white/10
                                    text-slate-200 outline-none
                                    focus:border-emerald-400/40
                                    transition-all"
                                />
                            </div>
                        ))}

                        <div>
                            <label className="block text-xs text-slate-500 mb-2">
                                Phone Number
                            </label>

                            <div className={`px-4 py-3 rounded-xl
                                bg-white/[0.035]
                                border ${numberAlert ? 'border-red-500' : 'border-white/10'}
                                focus-within:border-emerald-400/40`}>
                                <NumericFormat
                                    defaultValue={client.mobile_no}
                                    getInputRef={phoneNoRef}
                                    className="outline-none w-full bg-transparent text-slate-200"
                                    placeholder="Enter Phone Number"
                                    format="0##########"
                                    mask="_"
                                    onValueChange={(values) => setValue(values.value)}
                                    isAllowed={(values) => values.value.length <= 11}
                                />
                            </div>
                        </div>
                    </div>

                    {numberAlert && (
                        <p className="text-xs text-red-400 mt-3">
                            Please enter a valid 11-digit Bangladeshi mobile number.
                        </p>
                    )}

                    <button
                        onClick={() => handleEditClientData(client._id)}
                        className="mt-5 px-5 py-3 rounded-xl
                        bg-emerald-400/10
                        border border-emerald-400/20
                        text-emerald-300
                        hover:bg-emerald-400/15
                        hover:border-emerald-400/40
                        transition-all font-semibold text-sm"
                    >
                        Save Changes
                    </button>
                </div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">

                <Link
                    to={location.pathname.includes('admin') ? `/admin/new_voucher/${client._id}` : location.pathname.includes('daily_transactions') ? `/daily_transactions/create_new_voucher/${client._id}` : `/new_voucher/${client._id}`}
                    state={{ pathname: location.pathname }}
                    className="flex items-center justify-center gap-2
                    rounded-xl py-3
                    border border-emerald-400/20
                    bg-emerald-400/[0.05]
                    text-emerald-300
                    hover:bg-emerald-400/10
                    hover:border-emerald-400/40
                    transition-all font-semibold text-sm"
                >
                    <MdReceiptLong className="text-xl" />
                    Create New Voucher
                </Link>

                <Link
                    to={location.pathname.includes('admin') ? `/admin/client_transections/${client._id}` : location.pathname.includes('daily_transactions') ? `/daily_transactions/client_transactions/${client._id}` : `/client_transections/${client._id}`}
                    state={{ pathname: location.pathname }}
                    className="flex items-center justify-center gap-2
                    rounded-xl py-3
                    border border-cyan-400/20
                    bg-cyan-400/[0.05]
                    text-cyan-300
                    hover:bg-cyan-400/10
                    hover:border-cyan-400/40
                    transition-all font-semibold text-sm"
                >
                    <MdHistory className="text-xl" />
                    Client Transactions
                </Link>
            </div>

            {/* Voucher table */}
            <div className="mt-6 rounded-3xl border border-white/[0.07]
                bg-white/[0.02] overflow-hidden">

                <div className="p-5 border-b border-white/[0.06]">
                    <h2 className="font-bold text-white">
                        Voucher History
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                        All vouchers associated with this client.
                    </p>
                </div>

                <div className="overflow-x-auto scrollbar-hide p-5">
                    <table className="w-full min-w-[750px] text-sm">
                        <thead>
                            <tr className="text-left text-xs text-slate-500 border-b border-white/[0.06]">
                                <th className="px-5 py-4">SL</th>
                                <th className="px-5 py-4">Date</th>
                                <th className="px-5 py-4">Voucher</th>
                                <th className="px-5 py-4">Paid</th>
                                <th className="px-5 py-4">Due</th>
                                <th className="px-5 py-4">Status</th>
                                <th className="px-5 py-4">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {client.vouchers?.map((voucher, index) => {
                                const paid = voucher.payment_status === 'Paid';

                                return (
                                    <tr
                                        key={index}
                                        className="border-b border-white/[0.04]
                                        hover:bg-white/[0.025] transition-colors"
                                    >
                                        <td className="px-5 py-4 text-slate-500">
                                            {String(index + 1).padStart(2, '0')}
                                        </td>

                                        <td className="px-5 py-4 text-slate-400">
                                            {voucher?.date}
                                        </td>

                                        <td className="px-5 py-4 text-slate-200 font-semibold">
                                            #{voucher?.voucher_no}
                                        </td>

                                        <td className="px-5 py-4 text-emerald-400">
                                            {voucher?.paid_amount}
                                        </td>

                                        <td className="px-5 py-4 text-red-400">
                                            {voucher?.due_amount}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold
                                                ${paid
                                                    ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20'
                                                    : 'bg-red-400/10 text-red-400 border border-red-400/20'
                                                }`}>
                                                {voucher.payment_status}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <Link
                                                to={
                                                    location.pathname.includes('admin')
                                                        ? `/admin/voucher/${client._id}/${voucher.voucher_no}` : location.pathname.includes('daily_transactions') ? `/daily_transactions/voucher/${client._id}/${voucher.voucher_no}`
                                                        : `/voucher/${client._id}/${voucher.voucher_no}`
                                                }
                                                state={{ pathname: location.pathname }}
                                                className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold"
                                            >
                                                View Details →
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ClientDetails;