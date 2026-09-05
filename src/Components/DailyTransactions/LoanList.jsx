import React, { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import { FiCheckCircle, FiClock, FiDollarSign, FiX } from 'react-icons/fi';

const API = 'http://localhost:5000';

const money = value => Number(value || 0).toLocaleString('en-BD', { maximumFractionDigits: 2 });
const number = value => Number(value) || 0;

const dueOf = loan => {
    const paid = Array.isArray(loan?.payback_transactions)
        ? loan.payback_transactions.reduce((sum, item) => sum + number(item?.amount), 0)
        : 0;
    return Math.max(0, number(loan?.amount) - paid);
};

export default function LoanList({ type }) {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [paybackAmount, setPaybackAmount] = useState('');
    const [paying, setPaying] = useState(false);
    const [expanded, setExpanded] = useState(null);

    const title = type === 'Given Loan' ? 'Given Loan List' : 'Taken Loan List';
    const field = type === 'Given Loan' ? 'given_loan_list' : 'taken_loan_list';

    const load = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API}/daily_transactions/loans`);
            const result = await response.json();
            if (!response.ok) throw new Error(result?.error || 'Failed to load loan list.');
            setLoans(Array.isArray(result?.[field]) ? result[field] : []);
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Loading Failed', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [field]);

    const totalDue = useMemo(() => loans.reduce((sum, loan) => sum + dueOf(loan), 0), [loans]);

    const openPayback = loan => {
        setSelected(loan);
        setPaybackAmount('');
    };

    const confirmPayback = async e => {
        e.preventDefault();
        const amount = number(paybackAmount);
        const currentDue = dueOf(selected);
        if (!selected || amount <= 0) {
            Swal.fire({ icon: 'warning', title: 'Invalid Amount', text: 'Enter a valid payback amount.' });
            return;
        }
        if (amount > currentDue) {
            Swal.fire({ icon: 'warning', title: 'Amount Too High', text: `Maximum payable amount is ৳ ${money(currentDue)}.` });
            return;
        }

        try {
            setPaying(true);
            const loanIndex = loans.findIndex(item => item === selected);
            const response = await fetch(`${API}/daily_transactions/loan/payback`, {
                method: 'PATCH',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ type, loanIndex, amount }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result?.error || 'Payback failed.');

            setSelected(null);
            setPaybackAmount('');
            await load();

            Swal.fire({
                icon: 'success',
                title: result.removed ? 'Loan Fully Paid' : 'Payback Saved',
                text: result.removed ? 'This loan has been removed from the active list.' : `Remaining due: ৳ ${money(result.remaining_due)}`,
                timer: 1900,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Payback Failed', text: error.message });
        } finally {
            setPaying(false);
        }
    };

    if (loading) return <div className="py-16 text-center text-slate-500">Loading {type.toLowerCase()}...</div>;

    return (
        <div className="py-3">
            <div className="mb-5 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">Active Loans</p>
                    <p className="mt-1 text-2xl font-black text-white">{loans.length}</p>
                </div>
                <div className="rounded-2xl border border-amber-400/10 bg-amber-500/[0.04] p-4 md:col-span-2">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">Total Outstanding</p>
                    <p className="mt-1 text-2xl font-black text-amber-300">৳ {money(totalDue)}</p>
                </div>
            </div>

            {loans.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] py-16 text-center">
                    <FiCheckCircle className="mx-auto text-emerald-400" size={30} />
                    <h3 className="mt-3 font-black text-white">No active {type.toLowerCase()}</h3>
                    <p className="mt-1 text-sm text-slate-500">All loans are currently cleared or none have been added.</p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {loans.map((loan, index) => {
                        const due = dueOf(loan);
                        const paid = number(loan?.amount) - due;
                        const isOpen = expanded === index;
                        return (
                            <div key={`${loan?.date}-${loan?.name}-${index}`} className="rounded-3xl border border-white/10 bg-white/[0.025] p-4 md:p-5">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-lg font-black text-white">{loan?.name || 'Unknown'}</h3>
                                            <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-2.5 py-1 text-[10px] font-bold text-violet-300">{loan?.date}</span>
                                        </div>
                                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                                            <span className="text-slate-500">Loan: <b className="text-white">৳ {money(loan?.amount)}</b></span>
                                            <span className="text-slate-500">Paid: <b className="text-emerald-300">৳ {money(paid)}</b></span>
                                            <span className="text-slate-500">Due: <b className="text-amber-300">৳ {money(due)}</b></span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setExpanded(isOpen ? null : index)} className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/[0.04] hover:text-white">
                                            <FiClock /> {isOpen ? 'Hide' : 'History'}
                                        </button>
                                        <button onClick={() => openPayback(loan)} className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-black text-slate-950 hover:bg-emerald-400">
                                            <FiDollarSign /> Payback
                                        </button>
                                    </div>
                                </div>

                                {isOpen && (
                                    <div className="mt-4 border-t border-white/10 pt-4">
                                        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Payback Transactions</p>
                                        {Array.isArray(loan?.payback_transactions) && loan.payback_transactions.length ? (
                                            <div className="grid gap-2">
                                                {loan.payback_transactions.map((item, i) => (
                                                    <div key={i} className="flex items-center justify-between rounded-xl bg-black/20 px-3 py-2 text-sm">
                                                        <span className="text-slate-400">{item?.date}</span>
                                                        <b className="text-emerald-300">৳ {money(item?.amount)}</b>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : <p className="text-sm text-slate-600">No payback yet.</p>}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <form onSubmit={confirmPayback} className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950 p-5 md:p-7 shadow-2xl">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.25em] text-emerald-400">Loan Payback</p>
                                <h3 className="mt-1 text-xl font-black text-white">{selected.name}</h3>
                            </div>
                            <button type="button" onClick={() => setSelected(null)} className="rounded-xl p-2 text-slate-500 hover:bg-white/5 hover:text-white"><FiX /></button>
                        </div>
                        <div className="mt-5 rounded-2xl bg-white/[0.04] p-4">
                            <div className="flex justify-between text-sm"><span className="text-slate-500">Original Loan</span><b className="text-white">৳ {money(selected.amount)}</b></div>
                            <div className="mt-2 flex justify-between text-sm"><span className="text-slate-500">Current Due</span><b className="text-amber-300">৳ {money(dueOf(selected))}</b></div>
                        </div>
                        <label className="mt-5 grid gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Payback Amount</span>
                            <input autoFocus type="number" min="0.01" max={dueOf(selected)} step="0.01" value={paybackAmount} onChange={e => setPaybackAmount(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400/50" placeholder="Enter amount" required />
                        </label>
                        <button disabled={paying} className="mt-5 w-full rounded-2xl bg-emerald-500 py-3.5 text-sm font-black text-slate-950 hover:bg-emerald-400 disabled:opacity-50">
                            {paying ? 'Processing...' : 'Confirm Payback'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
