import React from 'react';
import { Link, useLoaderData, useLocation } from 'react-router-dom';

const ClientTransections = () => {
    const client = useLoaderData();
    const location = useLocation();
    const from = location?.state?.pathname || `/admin/client_details/${client?._id}`;

    const transactions = client?.transections || [];

    const totalTransaction = transactions.reduce(
        (sum, item) => sum + Number(item?.transection_amount || 0),
        0
    );

    const totalPaid = transactions.reduce(
        (sum, item) => sum + Number(item?.paid_amount || 0),
        0
    );

    const totalDue = transactions.reduce(
        (sum, item) => sum + Number(item?.due_amount || 0),
        0
    );
    return (
        <div className="min-h-full pb-10 text-white">

            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl border border-emerald-400/10 bg-[#0a1a17]/80 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.35)]">

                <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
                <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

                <div className="relative z-10 p-5 sm:p-7">

                    <div className="flex items-center justify-between gap-4">

                        <Link to={from}>
                            <button className="group hidden md:flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-2 text-sm font-semibold text-emerald-100 transition-all duration-300 hover:border-emerald-300/40 hover:bg-emerald-400/10 hover:shadow-[0_0_25px_rgba(16,185,129,0.12)]">
                                <span className="text-lg transition-transform duration-300 group-hover:-translate-x-1">
                                    ←
                                </span>
                                Back
                            </button>
                        </Link>

                        <div className="flex-1 text-center">
                            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-400/70">
                                Client Profile
                            </p>

                            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                                {client?.name}
                            </h1>

                            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                                {client?.address}
                            </p>

                            <p className="mt-1 text-xs font-medium text-cyan-300/80">
                                {client?.on_behalf}
                            </p>
                        </div>

                        <div className="hidden w-[72px] md:block" />
                    </div>

                    {/* Stats */}
                    <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">

                        <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.035] p-4">
                            <p className="text-xs uppercase tracking-wider text-slate-500">
                                Transactions
                            </p>
                            <p className="mt-1 text-xl font-bold text-cyan-300">
                                {transactions.length}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.035] p-4">
                            <p className="text-xs uppercase tracking-wider text-slate-500">
                                Total Paid
                            </p>
                            <p className="mt-1 text-xl font-bold text-emerald-300">
                                {totalPaid.toFixed(2)}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-violet-400/10 bg-violet-400/[0.035] p-4">
                            <p className="text-xs uppercase tracking-wider text-slate-500">
                                Total Due
                            </p>
                            <p className="mt-1 text-xl font-bold text-violet-300">
                                {totalDue.toFixed(2)}
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            {/* Section title */}
            <div className="mt-7 flex items-center gap-3">
                <div className="h-8 w-1 rounded-full bg-gradient-to-b from-emerald-400 via-cyan-400 to-violet-500" />

                <div>
                    <h2 className="text-lg font-bold text-white sm:text-xl">
                        Client's All Transactions
                    </h2>

                    <p className="text-xs text-slate-500">
                        Complete payment transaction history
                    </p>
                </div>
            </div>

            {/* Table */}
            <div className="mt-5 overflow-hidden rounded-3xl border border-emerald-400/10 bg-[#081714]/80 shadow-[0_20px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl p-5">

                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full min-w-[850px] text-left text-sm">

                        <thead>
                            <tr className="border-b border-emerald-400/10 bg-emerald-400/[0.035]">
                                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-emerald-300/80">
                                    SL
                                </th>
                                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-emerald-300/80">
                                    Date
                                </th>
                                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-emerald-300/80">
                                    Reference Voucher
                                </th>
                                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-emerald-300/80">
                                    Transaction
                                </th>
                                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-emerald-300/80">
                                    Total Paid
                                </th>
                                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-emerald-300/80">
                                    Due
                                </th>
                                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-emerald-300/80">
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {transactions.length > 0 ? (
                                transactions.map((transaction, index) => (
                                    <tr
                                        key={`${transaction?.reference_voucher}-${index}`}
                                        className="group border-b border-white/[0.035] transition-colors duration-200 hover:bg-emerald-400/[0.025]"
                                    >
                                        <td className="px-5 py-4 font-medium text-slate-500">
                                            {String(index + 1).padStart(2, '0')}
                                        </td>

                                        <td className="px-5 py-4 text-slate-300">
                                            {transaction?.date}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="rounded-lg border border-cyan-400/10 bg-cyan-400/[0.04] px-3 py-1 text-cyan-300">
                                                #{transaction?.reference_voucher}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 text-right font-medium text-slate-200">
                                            {Number(transaction?.transection_amount || 0).toFixed(2)}
                                        </td>

                                        <td className="px-5 py-4 text-right font-semibold text-emerald-300">
                                            {Number(transaction?.paid_amount || 0).toFixed(2)}
                                        </td>

                                        <td className="px-5 py-4 text-right font-semibold text-violet-300">
                                            {Number(transaction?.due_amount || 0).toFixed(2)}
                                        </td>

                                        <td className="px-5 py-4 text-center">
                                            <span
                                                className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${transaction?.payment_status === 'Paid'
                                                    ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
                                                    : 'border-rose-400/20 bg-rose-400/10 text-rose-300'
                                                    }`}
                                            >
                                                {transaction?.payment_status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="px-5 py-16 text-center text-slate-500"
                                    >
                                        No transaction found.
                                    </td>
                                </tr>
                            )}
                        </tbody>

                        {transactions.length > 0 && (
                            <tfoot>
                                <tr className="bg-white/[0.015]">
                                    <td
                                        colSpan="3"
                                        className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500"
                                    >
                                        Total
                                    </td>

                                    <td className="px-5 py-4 text-right font-bold text-white">
                                        {totalTransaction.toFixed(2)}
                                    </td>

                                    <td className="px-5 py-4 text-right font-bold text-emerald-300">
                                        {totalPaid.toFixed(2)}
                                    </td>

                                    <td className="px-5 py-4 text-right font-bold text-violet-300">
                                        {totalDue.toFixed(2)}
                                    </td>

                                    <td />
                                </tr>
                            </tfoot>
                        )}

                    </table>
                </div>
            </div>
        </div>
    );
};

export default ClientTransections;