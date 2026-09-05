import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FiArrowDownLeft, FiArrowUpRight, FiPlusCircle } from 'react-icons/fi';

export default function LoanManagement() {
    const location = useLocation();

    const nav = [
        ['Loan Input', '/daily_transactions/loan_management/input', FiPlusCircle],
        ['Given Loan', '/daily_transactions/loan_management/given', FiArrowUpRight],
        ['Taken Loan', '/daily_transactions/loan_management/taken', FiArrowDownLeft],
    ];

    return (
        <section className="mt-2 border border-white/10  p-3 md:p-5 shadow-2xl shadow-black/20 rounded-3xl  bg-white/[0.025] overflow-scroll">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-violet-400">Loan Control</p>
                    <h2 className="mt-1 text-xl md:text-2xl font-black text-white">Loan Management</h2>
                </div>
                <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/[0.025] p-1">
                    {nav.map(([label, path, Icon]) => {
                        const active = location.pathname === path;
                        return (
                            <Link
                                key={path}
                                to={path}
                                className={`flex items-center gap-2 rounded-xl px-3 md:px-4 py-2.5 text-xs md:text-sm font-bold transition ${active
                                    ? 'border border-violet-400/20 bg-violet-500/15 text-violet-300'
                                    : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
                                    }`}
                            >
                                <Icon size={16} />
                                {label}
                            </Link>
                        );
                    })}
                </div>
            </div>

            <Outlet />
        </section>
    );
}
