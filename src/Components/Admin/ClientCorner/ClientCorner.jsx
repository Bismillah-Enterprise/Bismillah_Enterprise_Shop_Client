import React, { useRef, useState } from 'react';
import { MdOutlineCancel, MdSearch, MdPersonAdd, MdReceiptLong, MdDeleteOutline, MdArrowBack, MdPeople } from 'react-icons/md';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ClientCorner = () => {
    const loadClient = useLoaderData();
    const [allClient, setAllClient] = useState(loadClient);
    const [searchText, setSearchText] = useState('');
    const location = useLocation();
    const from = location?.state?.pathname;
    const navigate = useNavigate();
    const search_ref = useRef();

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Delete Client?',
            text: "This action cannot be undone.",
            icon: 'warning',
            background: '#0b1a17',
            color: '#ecfdf5',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#334155',
            confirmButtonText: 'Yes, delete',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`https://bismillah-enterprise-server.onrender.com/client/${id}`, {
                    method: 'DELETE',
                })
                    .then((res) => res.json())
                    .then(() => {
                        setAllClient((prev) => prev.filter((client) => client._id !== id));

                        Swal.fire({
                            title: 'Deleted',
                            text: 'Client has been deleted successfully.',
                            icon: 'success',
                            background: '#0b1a17',
                            color: '#ecfdf5',
                            confirmButtonColor: '#10b981',
                        });
                    });
            }
        });
    };

    const handleSearch = (text) => {
        setSearchText(text);

        const query = text.trim().toLowerCase();

        if (!query) {
            setAllClient(loadClient);
            return;
        }

        const filtered = loadClient.filter(
            (client) =>
                client?.name?.toLowerCase().includes(query) ||
                client?.mobile_no?.includes(query) ||
                client?.on_behalf?.toLowerCase().includes(query)
        );

        setAllClient(filtered);
    };

    const handleClearSearch = () => {
        search_ref.current.value = '';
        setSearchText('');
        setAllClient(loadClient);
    };

    const totalClients = loadClient?.length || 0;

    const unpaidClients =
        loadClient?.filter(
            (client) =>
                client?.vouchers?.some(
                    (voucher) => voucher.payment_status === 'Unpaid'
                )
        )?.length || 0;

    return (
        <div className="min-h-full py-5 sm:py-7 overflow-scroll">

            {/* Header */}
            <div className="flex items-center justify-between gap-4 mb-6">

                <Link
                    to={from || '/'}
                    className="group hidden md:flex items-center gap-2 px-4 py-2 rounded-xl
                    border border-white/10 bg-white/[0.03]
                    text-slate-300 hover:text-emerald-300
                    hover:border-emerald-400/30 hover:bg-emerald-400/[0.06]
                    transition-all duration-300"
                >
                    <MdArrowBack className="text-xl group-hover:-translate-x-1 transition-transform" />
                    Back
                </Link>

                <div className="flex-1 text-center md:text-left md:pl-3">
                    <div className="flex items-center justify-center md:justify-start gap-3">
                        <div className="p-2.5 rounded-xl bg-emerald-400/10 border border-emerald-400/20">
                            <MdPeople className="text-2xl text-emerald-300" />
                        </div>

                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-white">
                                Client Corner
                            </h1>
                            <p className="text-xs text-slate-500">
                                Manage your clients and vouchers
                            </p>
                        </div>
                    </div>
                </div>

                <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl
                    bg-white/[0.03] border border-white/10">
                    <span className="text-xs text-slate-500">Clients</span>
                    <span className="font-bold text-emerald-300">
                        {totalClients}
                    </span>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-5">

                <div className="rounded-2xl border border-white/[0.07]
                    bg-white/[0.025] backdrop-blur-xl p-4
                    shadow-[0_15px_50px_rgba(0,0,0,0.15)]">
                    <p className="text-xs text-slate-500">Total Clients</p>
                    <p className="text-2xl font-bold text-white mt-1">
                        {totalClients}
                    </p>
                </div>

                <div className="rounded-2xl border border-red-400/10
                    bg-red-400/[0.025] backdrop-blur-xl p-4
                    shadow-[0_15px_50px_rgba(0,0,0,0.15)]">
                    <p className="text-xs text-slate-500">Payment Pending</p>
                    <p className="text-2xl font-bold text-red-400 mt-1">
                        {unpaidClients}
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="flex justify-center mb-5">
                <div className="group flex items-center w-full md:w-[65%] lg:w-[55%]
                    rounded-2xl border border-white/10
                    bg-white/[0.035] backdrop-blur-xl
                    px-4 py-2
                    focus-within:border-emerald-400/40
                    focus-within:bg-emerald-400/[0.025]
                    focus-within:shadow-[0_0_35px_rgba(16,185,129,0.08)]
                    transition-all duration-300">

                    <MdSearch className="text-2xl text-slate-500 group-focus-within:text-emerald-300 transition-colors" />

                    <input
                        type="text"
                        ref={search_ref}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="flex-1 bg-transparent outline-none px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600"
                        placeholder="Search by client name, phone or behalf..."
                    />

                    {searchText && (
                        <MdOutlineCancel
                            onClick={handleClearSearch}
                            className="text-xl text-slate-500 hover:text-red-400 cursor-pointer transition-colors"
                        />
                    )}
                </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7">

                <Link
                    to={location.pathname.includes('admin') ? '/admin/new_client' : location.pathname.includes('daily_transactions') ? '/daily_transactions/create_new_client' : '/new_client'}
                    state={{ pathname: location.pathname }}
                    className="group flex items-center justify-center gap-2 rounded-xl
                    border border-emerald-400/20
                    bg-emerald-400/[0.06]
                    hover:bg-emerald-400/[0.11]
                    hover:border-emerald-400/40
                    text-emerald-300 hover:text-emerald-200
                    px-4 py-3 font-semibold text-sm
                    transition-all duration-300"
                >
                    <MdPersonAdd className="text-xl group-hover:scale-110 transition-transform" />
                    Create New Client
                </Link>

                <Link
                    to={
                        location.pathname.includes('admin')
                            ? '/admin/new_client_new_voucher' : location.pathname.includes('daily_transactions') ? '/daily_transactions/create_new_client_with_voucher'
                            : '/new_client_new_voucher'
                    }
                    state={{ pathname: location.pathname }}
                    className="group flex items-center justify-center gap-2 rounded-xl
                    border border-cyan-400/20
                    bg-cyan-400/[0.05]
                    hover:bg-cyan-400/[0.10]
                    hover:border-cyan-400/40
                    text-cyan-300 hover:text-cyan-200
                    px-4 py-3 font-semibold text-sm
                    transition-all duration-300"
                >
                    <MdReceiptLong className="text-xl group-hover:scale-110 transition-transform" />
                    New Client + Voucher
                </Link>
            </div>

            {/* Client list */}
            <div className="space-y-3">

                {allClient?.length === 0 && (
                    <div className="rounded-2xl border border-white/[0.07]
                        bg-white/[0.025] py-14 text-center">
                        <MdPeople className="mx-auto text-5xl text-slate-700 mb-3" />
                        <h3 className="text-slate-300 font-semibold">
                            No clients found
                        </h3>
                        <p className="text-xs text-slate-600 mt-1">
                            Try another search keyword.
                        </p>
                    </div>
                )}

                {allClient?.map((client, index) => {
                    const unpaid =
                        client?.vouchers?.filter(
                            (voucher) => voucher.payment_status === 'Unpaid'
                        ).length > 0;

                    return (
                        <div
                            key={client._id}
                            className={`group relative overflow-hidden rounded-2xl
                            border border-white/[0.07]
                            bg-white/[0.025] backdrop-blur-xl
                            hover:bg-white/[0.045]
                            hover:border-emerald-400/20
                            p-4 sm:p-5
                            transition-all duration-300
                            ${unpaid ? 'border-l-2 border-l-red-500/70' : 'border-l-2 border-l-emerald-400/30'}`}
                        >

                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                                <div className="flex items-center gap-4 min-w-0">

                                    <div className={`shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-xl
                                        flex items-center justify-center
                                        border font-bold
                                        ${unpaid
                                            ? 'bg-red-400/10 border-red-400/20 text-red-300'
                                            : 'bg-emerald-400/10 border-emerald-400/20 text-emerald-300'
                                        }`}>
                                        {String(index + 1).padStart(2, '0')}
                                    </div>

                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h2 className={`font-bold text-sm sm:text-lg truncate
                                                ${unpaid ? 'text-red-300' : 'text-slate-100'}`}>
                                                {client.name}
                                            </h2>

                                            {unpaid && (
                                                <span className="shrink-0 text-[9px] uppercase tracking-wider
                                                    px-2 py-0.5 rounded-full
                                                    bg-red-400/10 border border-red-400/20 text-red-400">
                                                    Due
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                                            <span className="text-xs sm:text-sm text-slate-500">
                                                {client.on_behalf}
                                            </span>

                                            <span className="hidden sm:block text-slate-700">•</span>

                                            <span className="text-xs sm:text-sm text-slate-400">
                                                {client.mobile_no}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 sm:gap-3 lg:shrink-0">

                                    <Link
                                        to={
                                            location.pathname.includes('admin')
                                                ? `/admin/client_details/${client._id}` : location.pathname.includes('daily_transactions') ? `/daily_transactions/client_details/${client._id}` 
                                                : `/client_details/${client._id}`
                                        }
                                        state={{ pathname: location.pathname }}
                                        className="flex-1 sm:flex-none text-center
                                        px-4 py-2 rounded-xl
                                        border border-cyan-400/20
                                        bg-cyan-400/[0.04]
                                        text-cyan-300
                                        hover:bg-cyan-400/10
                                        hover:border-cyan-400/40
                                        transition-all duration-300 text-xs sm:text-sm font-semibold"
                                    >
                                        View Details
                                    </Link>

                                    <button
                                        onClick={() => handleDelete(client._id)}
                                        className="flex items-center justify-center
                                        px-3 py-2 rounded-xl
                                        border border-red-400/10
                                        bg-red-400/[0.03]
                                        text-red-400/70
                                        hover:text-red-300
                                        hover:bg-red-400/10
                                        hover:border-red-400/30
                                        transition-all duration-300"
                                    >
                                        <MdDeleteOutline className="text-xl" />
                                    </button>

                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ClientCorner;