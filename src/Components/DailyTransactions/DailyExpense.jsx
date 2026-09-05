import React, { useState } from 'react';
import { NumericFormat } from 'react-number-format';
import Swal from 'sweetalert2';

const API = 'http://localhost:5000';

export default function DailyExpense() {
    const [amount, setAmount] = useState('');
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const submit = async e => {
        e.preventDefault();
        const value = Number(amount) || 0;
        if (value <= 0) return Swal.fire('Invalid Amount', 'Enter a valid expense amount.', 'warning');
        if (!comment.trim()) return Swal.fire('Description Required', 'Describe this expense.', 'warning');
        try {
            setLoading(true);
            const res = await fetch(`${API}/daily_transactions/expense`, {
                method: 'PATCH', headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ amount: value, comment: comment.trim() })
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result?.error || 'Expense entry failed.');
            setAmount(''); setComment('');
            Swal.fire({ icon: 'success', title: 'Expense Added', showConfirmButton: false, timer: 1000, background: '#0b1b18', color: '#fff' });
            window.location.reload();
        } catch (e) { Swal.fire('Expense Failed', e.message, 'error'); }
        finally { setLoading(false); }
    };

    return <div className="rounded-3xl border border-red-400/15 bg-white/[0.025] overflow-scroll">
        <div className="p-6 border-b border-white/10"><p className="text-xs uppercase tracking-[0.25em] text-red-400">Expense Entry</p><h2 className="text-2xl font-bold text-white mt-1">Add Expense</h2></div>
        <form onSubmit={submit} className="p-6 grid md:grid-cols-2 gap-5">
            <NumericFormat value={amount} onValueChange={v => setAmount(v.value)} allowNegative={false} placeholder="Expense amount" className="h-12 rounded-xl bg-white/[0.04] border border-white/10 px-4 text-white" />
            <input value={comment} onChange={e => setComment(e.target.value)} placeholder="What was this expense for?" className="h-12 rounded-xl bg-white/[0.04] border border-white/10 px-4 text-white" />
            <button disabled={loading} className="md:col-span-2 h-12 rounded-xl bg-red-500 text-white font-black">{loading ? 'Saving...' : 'Add Expense'}</button>
        </form>
    </div>;
}



