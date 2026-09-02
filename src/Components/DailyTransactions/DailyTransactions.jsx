import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FiArrowDownCircle, FiArrowUpCircle, FiUsers, FiCreditCard } from 'react-icons/fi';
import Swal from 'sweetalert2';
import useAdmin from '../Hooks/useAdmin';

const API = 'https://bismillah-enterprise-server.onrender.com';

const money = v => Number(v || 0).toLocaleString();

const dateOnly = value => {
    if (!value) return '';
    const text = String(value).trim();
    const match = text.match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})/);
    return match ? `${match[1]} ${match[2]}, ${match[3]}` : text.split(',')[0].trim();
};

const todayDue = data => {
    const target = dateOnly(data?.date);
    if (!target || !Array.isArray(data?.due_list)) return 0;
    return data.due_list
        .filter(g => dateOnly(g?.date) === target)
        .reduce((s, g) => s + (Array.isArray(g?.due_data) ? g.due_data.reduce((a, d) => a + Number(d?.amount || 0), 0) : 0), 0);
};

const discountTotal = data => {
    const target = dateOnly(data?.date);
    return Array.isArray(data?.discount)
        ? data.discount.filter(x => dateOnly(x?.date) === target).reduce((s, x) => s + Number(x?.amount || 0), 0)
        : 0;
};

export default function DailyTransactions() {
    const location = useLocation();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, isAdminLoading] = useAdmin();

    const load = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API}/daily_transactions/ensure_today`);
            const result = await res.json();
            if (!res.ok) throw new Error(result?.error || 'Failed to load transactions.');
            setData(result);
        } catch (e) {
            Swal.fire({ icon: 'error', title: 'Loading Failed', text: e.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-slate-400">Loading transactions...</div>;

    const computer = Number(data?.computer_revenues || 0);
    const stationary = Number(data?.stationary_revenues || 0);
    const photocopy = Number(data?.photocopy_revenues || 0);
    const others = (data?.others_revenues || []).reduce((s, x) => s + Number(x?.amount || 0), 0);
    const airTicket = Number(data?.air_ticket_revenues || 0);
    const expenses = (data?.expenses || []).reduce((s, x) => s + Number(x?.amount || 0), 0);
    const discount = discountTotal(data);
    const revenue = computer + stationary + photocopy + airTicket + others - discount;
    const due = todayDue(data);
    const cash = revenue - expenses - due;
    const totalSell = revenue + discount

    const nav = [
        ['Revenue', '/daily_transactions/revenue', FiArrowUpCircle],
        ['Expense', '/daily_transactions/expense', FiArrowDownCircle],
        ['Client Corner', '/daily_transactions/client_corner', FiUsers],
        ['Due Management', '/daily_transactions/due_management', FiCreditCard]
    ];

    return <div className="min-h-full px-4 py-6 text-slate-200">
        <div className="max-w-7xl mx-auto">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">Finance Control</p>
            <h1 className="text-3xl md:text-4xl font-black text-white mt-1">Daily Transactions</h1>
            <p className="text-slate-500 mt-2 mb-7">Manage revenue, expenses, dues and daily cash flow.</p>

            <div className={`${!isAdmin ? 'hidden': 'grid'} grid-cols-2 xl:grid-cols-5 gap-3 mb-6`}>
                {[
                    ['Total Sell', totalSell, 'text-orange-300'],
                    ['Revenue', revenue, 'text-emerald-300'],
                    ['Discount', discount, 'text-pink-300'],
                    ['Expense', expenses, 'text-red-300'],
                    ['Today Due', due, 'text-amber-300'],
                    ['Cash Movement', cash, cash < 0 ? 'text-red-300' : 'text-cyan-300'],
                    ['Air Ticket', airTicket, 'text-violet-300'],
                    ['Active Dues', (data?.due_list || []).reduce((n, g) => n + (g?.due_data?.length || 0), 0), 'text-violet-300']
                ].map(([label, value, color]) => <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
                    <p className={`text-xl md:text-2xl font-black mt-1 ${color}`}>
                        {label === 'Active Dues' ? value : `৳ ${money(value)}`}
                    </p>
                </div>)}
            </div>

            <div className="flex flex-wrap gap-2 p-1 rounded-2xl bg-white/[0.025] border border-white/10 mb-7">
                {nav.map(([label, path, Icon]) => {
                    const active = location.pathname === path;
                    return <Link key={path} to={path} className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold ${active ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/20' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'}`}>
                        <Icon size={17} />{label}
                    </Link>;
                })}
            </div>

            <Outlet context={{ data, reload: load }} />
        </div>
    </div>;
}


