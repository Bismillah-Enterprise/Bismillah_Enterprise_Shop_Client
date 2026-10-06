import React, { useRef, useState } from 'react';
import { MdOutlineCancel, MdSearch, MdFlightTakeoff, MdDeleteOutline } from 'react-icons/md';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AirTicketClient = () => {
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
                fetch(`https://bismillah-enterprise-server.onrender.com/air_ticket_client/${id}`, {
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
        <div className="relative min-h-full text-slate-200 pb-10 overflow-scroll">

            {/* Ambient glow */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-emerald-500/[0.07] blur-[130px]" />
                <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-cyan-500/[0.06] blur-[140px]" />
                <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-violet-500/[0.05] blur-[150px]" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between gap-4 mb-8">
                <Link to={from}>
                    <button className="hidden md:flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-slate-300 backdrop-blur-xl transition-all hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-emerald-300">
                        ← Back
                    </button>
                </Link>

                <div className="flex-1 md:text-center">
                    <div className="inline-flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                            <MdFlightTakeoff className="text-2xl" />
                        </div>
                        <div className="text-left">
                            <h2 className="text-xl md:text-2xl font-bold text-white">
                                Air Ticket Client Corner
                            </h2>
                            <p className="text-xs text-slate-500">
                                Manage your travel clients
                            </p>
                        </div>
                    </div>
                </div>

                <div className="hidden md:block w-[75px]" />
            </div>

            {/* Search */}
            <div className="mx-auto mb-6 max-w-2xl">
                <div className="group flex items-center rounded-2xl border border-white/10 bg-white/[0.035] p-1.5 shadow-2xl backdrop-blur-xl transition-all focus-within:border-emerald-400/30 focus-within:shadow-emerald-500/10">
                    <div className="flex h-11 w-11 items-center justify-center text-slate-500 group-focus-within:text-emerald-300">
                        <MdSearch className="text-2xl" />
                    </div>

                    <input
                        type="text"
                        onChange={(e) => { handleSearch(e.target.value) }}
                        ref={search_ref}
                        className="min-w-0 flex-1 bg-transparent px-2 text-sm text-slate-200 outline-none placeholder:text-slate-600"
                        placeholder="Search client by name..."
                    />

                    <button
                        onClick={handleClearSerch}
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-red-400/10 hover:text-red-300"
                    >
                        <MdOutlineCancel className="text-2xl" />
                    </button>
                </div>
            </div>

            {/* Create */}
            <div className="mb-8 flex justify-center">
                <Link
                    to={location.pathname.includes('admin') ? `/admin/air_ticket_new_client_new_voucher` : `/new_client_new_voucher`}
                    state={{ pathname: location.pathname }}
                    className="group inline-flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-gradient-to-r from-emerald-400/15 to-cyan-400/10 px-5 py-3 text-sm font-semibold text-emerald-200 shadow-lg shadow-emerald-500/5 transition-all hover:-translate-y-0.5 hover:border-emerald-300/40 hover:from-emerald-400/20 hover:to-cyan-400/15"
                >
                    <span className="text-lg">+</span>
                    Create New Client With Voucher
                </Link>
            </div>

            {/* Client list */}
            <div className="mx-auto max-w-6xl space-y-3">
                {
                    allClient?.toReversed().map((client, index) =>
                        <div
                            key={client._id}
                            className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 md:p-5 backdrop-blur-xl transition-all duration-300 hover:border-emerald-400/20 hover:bg-white/[0.04] hover:shadow-[0_15px_50px_rgba(16,185,129,0.06)]"
                        >
                            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-emerald-400 via-cyan-400 to-violet-500 opacity-40 group-hover:opacity-100" />

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_auto] md:items-center">

                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 font-bold text-emerald-300">
                                        {String(index + 1).padStart(2, '0')}
                                    </div>

                                    <div className="min-w-0">
                                        <h1 className={`truncate text-base md:text-lg font-bold ${client.vouchers.filter(voucher => voucher.payment_status === 'Unpaid').length > 0
                                            ? 'text-red-300'
                                            : 'text-white'
                                            }`}>
                                            {client.name}
                                        </h1>

                                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs md:text-sm text-slate-500">
                                            <span className="rounded-lg border border-white/5 bg-white/[0.03] px-2 py-1">
                                                {client?.vouchers[0]?.destination || 'No destination'}
                                            </span>

                                            <span className="text-slate-600">•</span>

                                            <span>{client.mobile_no}</span>

                                            {client.vouchers.filter(voucher => voucher.payment_status === 'Unpaid').length > 0 && (
                                                <>
                                                    <span className="text-slate-600">•</span>
                                                    <span className="rounded-lg bg-red-400/10 px-2 py-1 text-red-300">
                                                        Payment Due
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Link
                                        to={location.pathname.includes('admin') ? `/admin/air_ticket_client_details/${client?._id}` : `/client_details/${client?._id}`}
                                        state={{ pathname: location.pathname }}
                                        className="flex items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/20"
                                    >
                                        View Details
                                    </Link>

                                    <button
                                        onClick={() => { handleDelete(client?._id) }}
                                        className="flex items-center justify-center gap-1.5 rounded-xl border border-red-400/10 bg-red-400/5 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-400/15"
                                    >
                                        <MdDeleteOutline className="text-lg" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }

                {allClient?.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-16 text-center">
                        <MdSearch className="mx-auto mb-3 text-4xl text-slate-700" />
                        <p className="font-semibold text-slate-400">No clients found</p>
                        <p className="mt-1 text-xs text-slate-600">
                            Try searching with a different name.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AirTicketClient;