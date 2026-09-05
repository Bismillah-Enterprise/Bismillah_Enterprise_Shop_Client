import React, { useState } from 'react';
import { NumericFormat } from 'react-number-format';
import Swal from 'sweetalert2';

const API = 'http://localhost:5000';

export default function DailyRevenue() {
    const [form, setForm] = useState({ category:'', amount:'', discount:'', paid:'', reference:'', comment:'' });
    const [loading, setLoading] = useState(false);

    const set = (key, value) => setForm(f => ({ ...f, [key]: value }));
    const total = Number(form.amount) || 0;
    const discount = Number(form.discount) || 0;
    const paid = Number(form.paid) || 0;
    const net = Math.max(0, total - discount);
    const due = Math.max(0, net - paid);

    const submit = async e => {
        e.preventDefault();
        if (!form.category) return Swal.fire('Category Required', 'Select a category.', 'warning');
        if (total <= 0) return Swal.fire('Invalid Amount', 'Enter a valid sale amount.', 'warning');
        if (discount < 0 || discount >= total) return Swal.fire('Invalid Discount', 'Discount must be less than sale amount.', 'warning');
        if (paid < 0 || paid > net) return Swal.fire('Invalid Payment', 'Paid amount cannot exceed net amount.', 'warning');
        if (due > 0 && !form.reference.trim()) return Swal.fire('Reference Required', 'Enter customer name or voucher number.', 'warning');

        try {
            setLoading(true);
            const res = await fetch(`${API}/daily_transactions/revenue`, {
                method:'PATCH',
                headers:{'content-type':'application/json'},
                body:JSON.stringify({
                    category:form.category, amount:total, discount,
                    paid_amount:paid, due_amount:due,
                    reference:form.reference.trim(), comment:form.comment.trim()
                })
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result?.error || 'Revenue entry failed.');
            setForm({ category:'', amount:'', discount:'', paid:'', reference:'', comment:'' });
            Swal.fire({ icon:'success', title:'Revenue Added', showConfirmButton:false, timer:1100, background:'#0b1b18', color:'#fff' }).then(() => {window.location.reload();});
            
        } catch(e) {
            Swal.fire('Revenue Failed', e.message, 'error');
        } finally { setLoading(false); }
    };

    return <div className="rounded-3xl border border-emerald-400/15 bg-white/[0.025] overflow-scroll">
        <div className="p-6 border-b border-white/10">
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-400">Revenue Entry</p>
            <h2 className="text-2xl font-bold text-white mt-1">Add Revenue</h2>
        </div>
        <form onSubmit={submit} className="p-6 grid md:grid-cols-2 gap-5">
            <select value={form.category} onChange={e=>set('category',e.target.value)} className="rounded-lg border bg-[#0b1a17] border-white/10 px-3 py-2 text-slate-200 outline-none focus:border-emerald-400/30">
                <option value="">Select category</option><option value="computer">Computer</option><option value="stationary">Stationary</option><option value="photocopy">Photocopy</option><option value="others">Others</option>
            </select>
            <NumericFormat value={form.amount} onValueChange={v=>set('amount',v.value)} allowNegative={false} placeholder="Sale amount" className="h-12 rounded-xl bg-white/[0.04] border border-white/10 px-4 text-white"/>
            <NumericFormat value={form.discount} onValueChange={v=>set('discount',v.value)} allowNegative={false} placeholder="Discount" className="h-12 rounded-xl bg-white/[0.04] border border-white/10 px-4 text-white"/>
            <NumericFormat value={form.paid} onValueChange={v=>set('paid',v.value)} allowNegative={false} placeholder="Paid amount" className="h-12 rounded-xl bg-white/[0.04] border border-white/10 px-4 text-white"/>
            <input value={form.reference} onChange={e=>set('reference',e.target.value)} placeholder="Customer name / Voucher no" className="h-12 rounded-xl bg-white/[0.04] border border-white/10 px-4 text-white"/>
            <input value={form.comment} onChange={e=>set('comment',e.target.value)} placeholder="Comment (optional)" className="h-12 rounded-xl bg-white/[0.04] border border-white/10 px-4 text-white"/>
            <div className="md:col-span-2 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-emerald-500/10 p-4"><small className="text-slate-500">Net</small><div className="text-xl font-black text-emerald-300">৳ {net.toLocaleString()}</div></div>
                <div className="rounded-xl bg-cyan-500/10 p-4"><small className="text-slate-500">Paid</small><div className="text-xl font-black text-cyan-300">৳ {paid.toLocaleString()}</div></div>
                <div className="rounded-xl bg-amber-500/10 p-4"><small className="text-slate-500">Due</small><div className="text-xl font-black text-amber-300">৳ {due.toLocaleString()}</div></div>
            </div>
            <button disabled={loading} className="md:col-span-2 h-12 rounded-xl bg-emerald-500 text-[#071311] font-black">{loading?'Saving...':'Add Revenue'}</button>
        </form>
    </div>;
}




