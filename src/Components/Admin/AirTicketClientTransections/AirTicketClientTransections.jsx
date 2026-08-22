import React from 'react';
import { Link, useLoaderData, useLocation } from 'react-router-dom';
import {
    MdFlightTakeoff,
    MdArrowBack,
    MdReceiptLong
} from 'react-icons/md';

const AirTicketClientTransections = () => {
    const client = useLoaderData();
    const location = useLocation();
    const from = location?.state?.pathname;

    return (
        <div className="relative min-h-full pb-10 text-slate-200">

            {/* Ambient background */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-emerald-500/[0.06] blur-[130px]" />
                <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-cyan-500/[0.06] blur-[140px]" />
                <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-violet-500/[0.05] blur-[150px]" />
            </div>

            {/* Header */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_auto_1fr] md:items-center">

                <div>
                    <Link to={from}>
                        <button className="hidden md:flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-emerald-300">
                            <MdArrowBack />
                            Back
                        </button>
                    </Link>
                </div>

                <div className="text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                        <MdFlightTakeoff className="text-2xl" />
                    </div>

                    <h1 className="text-xl md:text-2xl font-bold text-white">
                        {client.name}
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        {client.address}
                    </p>

                    <p className="mt-1 text-xs text-emerald-300">
                        {client.destination}
                    </p>
                </div>

                <div />
            </div>

            {/* Title */}
            <div className="my-8 flex justify-center">
                <div className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-5 py-3 backdrop-blur-xl">
                    <MdReceiptLong className="text-xl text-emerald-300" />
                    <h1 className="text-sm md:text-base font-semibold text-slate-200">
                        Client's All Transactions
                    </h1>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] shadow-2xl backdrop-blur-xl p-5">
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full min-w-[760px] text-left text-sm">
                        <thead>
                            <tr className="border-b border-white/[0.07] bg-emerald-400/[0.04]">
                                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-emerald-300">SL No</th>
                                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-emerald-300">Date</th>
                                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-emerald-300">Reference Voucher</th>
                                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-emerald-300">Amount</th>
                                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-emerald-300">Total Paid</th>
                                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-emerald-300">Due</th>
                                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-emerald-300">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                client.transections?.map((transection, index) =>
                                    <tr
                                        key={index}
                                        className="border-b border-white/[0.05] transition hover:bg-white/[0.025]"
                                    >
                                        <td className="px-5 py-4 text-slate-500">
                                            {String(index + 1).padStart(2, '0')}
                                        </td>

                                        <td className="px-5 py-4 text-slate-300">
                                            {transection.date}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="rounded-lg border border-cyan-400/10 bg-cyan-400/5 px-3 py-1.5 text-cyan-300">
                                                {transection.reference_voucher}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 font-semibold text-white">
                                            {transection.transection_amount}
                                        </td>

                                        <td className="px-5 py-4 text-emerald-300">
                                            {transection.paid_amount}
                                        </td>

                                        <td className="px-5 py-4 text-orange-300">
                                            {transection.due_amount}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${transection.payment_status === 'Paid'
                                                ? 'bg-emerald-400/10 text-emerald-300 border border-emerald-400/10'
                                                : 'bg-red-400/10 text-red-300 border border-red-400/10'
                                                }`}>
                                                {transection.payment_status}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            {(!client.transections || client.transections.length === 0) && (
                <div className="mt-4 rounded-2xl border border-dashed border-white/10 py-12 text-center text-slate-600">
                    No transactions available.
                </div>
            )}
        </div>
    );
};

export default AirTicketClientTransections;