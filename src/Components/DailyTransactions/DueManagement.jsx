import React, { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';

const API = 'https://bismillah-enterprise-server.onrender.com';

export default function DueManagement() {
    const [data, setData] = useState(null), [search, setSearch] = useState(''), [selected, setSelected] = useState(null), [payment, setPayment] = useState(''), [loading, setLoading] = useState(true), [paying, setPaying] = useState(false);

    const load = async () => {
        try { setLoading(true); const r = await fetch(`${API}/daily_transactions/ensure_today`), j = await r.json(); if (!r.ok) throw new Error(j?.error || 'Failed to load dues.'); setData(j); }
        catch (e) { Swal.fire('Due Loading Failed', e.message, 'error'); } finally { setLoading(false); }
    };
    useEffect(() => { load(); }, []);

    const items = useMemo(() => Array.isArray(data?.due_list) ? data.due_list.flatMap(g => (g.due_data || []).map((d, i) => ({ ...d, date: g.date, index: i }))) : [], [data]);
    const filtered = useMemo(() => { const q = search.trim().toLowerCase(); return q ? items.filter(x => String(x.reference || '').toLowerCase().includes(q) || String(x.date || '').toLowerCase().includes(q) || String(x.amount || '').includes(q)) : items; }, [items, search]);

    const pay = async () => {
        const value = Number(payment) || 0, current = Number(selected?.amount) || 0;
        if (value <= 0 || value > current) return Swal.fire('Invalid Payment', 'Payment must be greater than 0 and not exceed current due.', 'warning');
        const ok = await Swal.fire({ title: 'Confirm Payment?', html: `<p>Reference: <b>${selected.reference || '-'}</b></p><p>Due: <b>৳${current}</b></p><p>Payment: <b>৳${value}</b></p><p>Remaining: <b>৳${current - value}</b></p>`, icon: 'question', showCancelButton: true, confirmButtonColor: '#059669', background: '#0b1b18', color: '#fff' });
        if (!ok.isConfirmed) return;
        try {
            setPaying(true);
            const r = await fetch(`${API}/daily_transactions/pay_due`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ date: selected.date, reference: selected.reference, paid_amount: value }) });
            const j = await r.json(); if (!r.ok) throw new Error(j?.error || 'Payment failed.');
            setSelected(null); setPayment(''); await load();
            Swal.fire({ icon: 'success', title: 'Payment Successful', showConfirmButton: false, timer: 1000, background: '#0b1b18', color: '#fff' });
        } catch (e) { Swal.fire('Payment Failed', e.message, 'error'); } finally { setPaying(false); }
    };

    if (loading) return <div className="p-10 text-center text-slate-400">Loading dues...</div>;
    return <div className="rounded-3xl border border-amber-400/15 bg-white/[0.025] overflow-scroll">
        <div className="p-6 border-b border-white/10"><p className="text-xs uppercase tracking-[0.25em] text-amber-400">Accounts Receivable</p><h2 className="text-2xl font-bold text-white mt-1">Due Management</h2></div>
        <div className="p-6"><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customer, voucher, date or amount..." className="w-full h-12 rounded-xl bg-white/[0.04] border border-white/10 px-4 text-white mb-5" />
            <div className="space-y-3">{filtered.filter(item => !item.reference.includes('Air Ticket')).map((x, i) => <div key={`${x.date}-${x.reference}-${i}`} className="rounded-2xl border border-white/10 p-4 flex flex-col sm:flex-row justify-between gap-4"><div><b className="text-white">{x.reference || 'No reference'}</b><p className="text-xs text-slate-500 mt-1">{x.date}</p></div><div className="flex items-center gap-4"><b className="text-xl text-amber-300">৳ {Number(x.amount || 0).toLocaleString()}</b><button onClick={() => { setSelected(x); setPayment(x.amount) }} disabled={x.reference.includes('Voucher no')} className="px-4 py-2 rounded-xl bg-emerald-500/15 text-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-bold">Pay</button></div></div>)}</div>
        </div>
        {selected && <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"><div className="w-full max-w-md rounded-3xl bg-[#0b1b18] border border-amber-400/20 p-6"><h3 className="text-xl font-black text-white">Due Payment</h3><p className="text-sm text-slate-400 mt-2">{selected.reference} · {selected.date}</p><input type="number" min="0.01" max={selected.amount} value={payment} onChange={e => setPayment(e.target.value)} className="mt-5 w-full h-12 rounded-xl bg-white/[0.04] border border-white/10 px-4 text-white" /><div className="flex gap-3 mt-5"><button onClick={() => setSelected(null)} className="flex-1 h-11 rounded-xl bg-white/10 text-white">Cancel</button><button disabled={paying} onClick={pay} className="flex-1 h-11 rounded-xl bg-emerald-500 text-[#071311] font-black">{paying ? 'Processing...' : 'Confirm'}</button></div></div></div>}
    </div>;
}



