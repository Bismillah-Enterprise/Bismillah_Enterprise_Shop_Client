import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { FiCalendar, FiUser, FiDollarSign, FiSend } from 'react-icons/fi';

const API = 'http://localhost:5000';

const todayInput = () => {
    const d = new Date();
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
};

const displayDate = value => {
    if (!value) return '';
    const d = new Date(`${value}T00:00:00`);
    return d.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
};

export default function LoanInput() {
    const [type, setType] = useState('');
    const [amount, setAmount] = useState('');
    const [name, setName] = useState('');
    const [date, setDate] = useState(todayInput());
    const [saving, setSaving] = useState(false);

    const submit = async e => {
        e.preventDefault();
        if (!type || !amount || !name.trim() || !date) {
            Swal.fire({ icon: 'warning', title: 'All fields are required', text: 'Please complete all 4 fields.' });
            return;
        }

        try {
            setSaving(true);
            const response = await fetch(`${API}/daily_transactions/loan`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    type,
                    amount: Number(amount),
                    name: name.trim(),
                    date: displayDate(date),
                }),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result?.error || 'Loan could not be saved.');

            Swal.fire({
                icon: 'success',
                title: 'Loan Saved',
                text: `${type} of ৳ ${Number(amount).toLocaleString()} recorded successfully.`,
                timer: 1800,
                showConfirmButton: false,
            });

            setType('');
            setAmount('');
            setName('');
            setDate(todayInput());
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Save Failed', text: error.message });
        } finally {
            setSaving(false);
        }
    };

    const field = 'w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400/50 focus:ring-2 focus:ring-violet-400/10 placeholder:text-slate-600';

    return (
        <div className="max-w-3xl mx-auto py-3 md:py-6">
            <div className="mb-6 rounded-3xl border border-violet-400/10 bg-gradient-to-br from-violet-500/[0.08] via-transparent to-cyan-500/[0.06] p-5 md:p-7">
                <p className="text-[10px] uppercase tracking-[0.3em] text-violet-400">New Loan</p>
                <h3 className="mt-1 text-2xl font-black text-white">Record a Loan</h3>
                <p className="mt-2 text-sm text-slate-500">Add money given to someone or money taken from someone.</p>
            </div>

            <form onSubmit={submit} className="grid gap-5 rounded-3xl border border-white/10 bg-white/[0.025] p-5 md:p-7">
                <label className="grid gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Loan Type</span>
                    <select value={type} onChange={e => setType(e.target.value)} className={field} required>
                        <option value="">Select loan type</option>
                        <option value="Given Loan">Given Loan</option>
                        <option value="Taken Loan">Taken Loan</option>
                    </select>
                </label>

                <label className="grid gap-2">
                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400"><FiDollarSign /> Amount</span>
                    <input type="number" min="0.01" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className={field} placeholder="Enter loan amount" required />
                </label>

                <label className="grid gap-2">
                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400"><FiUser /> Person Name</span>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className={field} placeholder="Who gave / received the loan?" required />
                </label>

                <label className="grid gap-2">
                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400"><FiCalendar /> Loan Date</span>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className={`${field} w-full min-w-0 relative cursor-pointer`} required />
                </label>

                <button disabled={saving} className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-violet-500 px-5 py-3.5 text-sm font-black text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50">
                    <FiSend /> {saving ? 'Saving...' : 'Save Loan'}
                </button>
            </form>
        </div>
    );
}
