import React, { useEffect, useMemo, useState } from 'react';
import { MdAdd, MdArrowBack, MdDeleteOutline, MdPrint } from 'react-icons/md';
import { NumericFormat } from 'react-number-format';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import AirTicketVoucherHeading from '../../Shared/AirTicketVoucherHeading/AirTicketVoucherHeading';

const API = 'https://bismillah-enterprise-server.onrender.com';
const money = v => Number.isFinite(Number(v)) ? Number(Number(v).toFixed(2)) : 0;
const emptyService = () => ({ service_name: '', destination: '', flight_date: '', ticket_price: '', ticket_agent_price: '' });

export default function AirTicketNewClientWithNewVoucher() {
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.pathname || '/air_ticket_client_corner';
    const [voucherSl, setVoucherSl] = useState(0);
    const [loading, setLoading] = useState(false);
    const [numberAlert, setNumberAlert] = useState(false);
    const [client, setClient] = useState({ name: '', address: '', mobile_no: '', date_of_birth: '', passport_no: '', date_of_expiry: '' });
    const [services, setServices] = useState([emptyService()]);
    const [discount, setDiscount] = useState('');
    const [paid, setPaid] = useState('');
    const printRef = React.useRef();

    useEffect(() => {
        fetch(`${API}/voucher_sl`).then(r => r.json()).then(d => setVoucherSl(Number(d?.sl_no || 0))).catch(console.error);
    }, []);

    const now = new Date();
    const time = now.toLocaleTimeString('en-BD', { hour: '2-digit', minute: '2-digit', hour12: true });
    const currentDate = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const totals = useMemo(() => {
        const ticket = services.reduce((s, x) => s + money(x.ticket_price), 0);
        const agent = services.reduce((s, x) => s + money(x.ticket_agent_price), 0);
        const disc = money(discount);
        const paidAmount = money(paid);
        const revenue = money(Math.max(0, ticket - agent - disc));
        const due = money(Math.max(0, ticket - disc - paidAmount));
        return { ticket, agent, disc, paidAmount, revenue, due, status: due > 0 ? 'Unpaid' : 'Paid' };
    }, [services, discount, paid]);

    const updateService = (index, key, value) => setServices(prev => prev.map((x, i) => i === index ? { ...x, [key]: value } : x));
    const addService = () => setServices(prev => [...prev, emptyService()]);
    const deleteService = index => {
        if (services.length === 1) return;
        setServices(prev => prev.filter((_, i) => i !== index));
    };

    const create = async () => {
        const name = client.name.trim();
        const phone = client.mobile_no.trim().startsWith('0') ? client.mobile_no.trim() : `0${client.mobile_no.trim()}`;
        if (!name) return Swal.fire('Client Name Required', 'Enter client name.', 'warning');
        if (phone.length !== 11 || phone.charAt(1) !== '1') { setNumberAlert(true); return; }
        if (services.some(s => !s.destination.trim() || money(s.ticket_price) <= 0 || money(s.ticket_agent_price) < 0)) return Swal.fire('Incomplete Service', 'Every service needs destination, ticket price and valid agent price.', 'warning');
        if (totals.agent > totals.ticket) return Swal.fire('Invalid Agent Price', 'Agent price cannot be greater than total ticket price.', 'warning');
        if (totals.disc < 0 || totals.disc > totals.ticket) return Swal.fire('Invalid Discount', 'Discount cannot exceed ticket price.', 'warning');
        if (totals.paidAmount < 0 || totals.paidAmount > totals.ticket - totals.disc) return Swal.fire('Invalid Payment', 'Paid amount cannot exceed the amount after discount.', 'warning');

        const newSlNo = String(voucherSl + 1);
        const voucher = {
            date: `${currentDate}, ${time}`,
            transaction_date: currentDate,
            voucher_no: newSlNo,
            services: services.map(s => ({ ...s, ticket_price: money(s.ticket_price), ticket_agent_price: money(s.ticket_agent_price) })),
            ticket_price: totals.ticket,
            ticket_agent_price: totals.agent,
            paid_amount: totals.paidAmount,
            due_amount: totals.due,
            payment_status: totals.status,
            discount: totals.disc,
        };
        const newClient = {
            name, mobile_no: phone, address: client.address.trim(), date_of_birth: client.date_of_birth,
            passport_no: client.passport_no, date_of_expiry: client.date_of_expiry,
            vouchers: [voucher], transections: totals.paidAmount > 0 ? [{ date: voucher.date, reference_voucher: newSlNo, paid_amount: totals.paidAmount, transection_amount: totals.paidAmount, due_amount: totals.due, payment_status: totals.status }] : []
        };

        const confirm = await Swal.fire({ title: 'Create Client + Voucher?', text: `Voucher #${newSlNo} will update Daily Transactions.`, icon: 'question', showCancelButton: true, confirmButtonColor: '#10b981', background: '#071311', color: '#ecfdf5' });
        if (!confirm.isConfirmed) return;
        try {
            setLoading(true);
            const r = await fetch(`${API}/air_ticket_new_client`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(newClient) });
            const result = await r.json();
            if (!r.ok || !result?.success) throw new Error(result?.error || 'Client creation failed');
            await fetch(`${API}/voucher_sl`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ new_sl_no: Number(newSlNo) }) });
            await Swal.fire({ icon: 'success', title: 'Created Successfully', showConfirmButton: false, timer: 1100 });
            navigate(from);
        } catch (e) { Swal.fire('Creation Failed', e.message, 'error'); }
        finally { setLoading(false); }
    };

    const print = () => {
        const iframe = document.createElement('iframe'); iframe.style.cssText = 'position:fixed;width:0;height:0;border:0'; document.body.appendChild(iframe);
        const doc = iframe.contentWindow.document; doc.open(); doc.write(`<html><head><title>Air Ticket Voucher</title><style>@page{size:A4 landscape;margin:10mm}body{font-family:Arial;color:#000}.voucher{width:48%;margin-left:auto}table{width:100%;border-collapse:collapse}th,td{border:1px solid #000;padding:6px;font-size:10px;text-align:center}</style></head><body>${printRef.current.innerHTML}</body></html>`); doc.close(); iframe.onload = () => { iframe.contentWindow.print(); setTimeout(() => iframe.remove(), 500); };
    };

    return <div className="min-h-full px-4 py-6 text-slate-200">
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-6"><Link to={from} className="rounded-xl border border-white/10 px-4 py-2"><MdArrowBack className="inline" /> Back</Link><div><h1 className="text-2xl font-black text-white">New Air Ticket Client + Voucher</h1><p className="text-xs text-slate-500">Voucher #{voucherSl + 1}</p></div></div>
            <div className="grid lg:grid-cols-2 gap-5">
                <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 space-y-4">
                    <h2 className="text-lg font-bold text-white">Client Details</h2>
                    {['name', 'address', 'mobile_no', 'date_of_birth', 'passport_no', 'date_of_expiry'].map(key => <input key={key} value={client[key]} onChange={e => { setClient(c => ({ ...c, [key]: e.target.value })); if (key === 'mobile_no') setNumberAlert(false); }} placeholder={key.replaceAll('_', ' ')} className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white" />)}
                    {numberAlert && <p className="text-sm text-red-300">Enter a valid Bangladesh mobile number.</p>}
                </section>
                <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
                    <div className="flex justify-between items-center mb-4"><div><p className="text-xs uppercase tracking-[0.25em] text-violet-400">Services</p><h2 className="text-lg font-bold text-white">Air Ticket Voucher</h2></div><button onClick={addService} className="inline-flex items-center gap-2 rounded-xl bg-violet-500/15 px-4 py-2 font-bold text-violet-300"><MdAdd /> Add Service</button></div>
                    <div className="space-y-4">{services.map((s, i) => <div key={i} className="rounded-2xl border border-white/10 p-4"><div className="flex justify-between mb-3"><b>Service {i + 1}</b><button onClick={() => deleteService(i)} className="text-red-300" disabled={services.length === 1}><MdDeleteOutline /></button></div><div className="grid md:grid-cols-2 gap-3"><input value={s.service_name} onChange={e => updateService(i, 'service_name', e.target.value)} placeholder="Service name (optional)" className="h-11 rounded-xl bg-white/[0.04] border border-white/10 px-3 text-white" /><input value={s.destination} onChange={e => updateService(i, 'destination', e.target.value)} placeholder="Destination" className="h-11 rounded-xl bg-white/[0.04] border border-white/10 px-3 text-white" /><input type="date" value={s.flight_date} onChange={e => updateService(i, 'flight_date', e.target.value)} className="h-11 rounded-xl bg-white/[0.04] border border-white/10 px-3 text-white" /><NumericFormat value={s.ticket_price} onValueChange={v => updateService(i, 'ticket_price', v.value)} allowNegative={false} placeholder="Ticket Price" className="h-11 rounded-xl bg-white/[0.04] border border-white/10 px-3 text-white" /><NumericFormat value={s.ticket_agent_price} onValueChange={v => updateService(i, 'ticket_agent_price', v.value)} allowNegative={false} placeholder="Ticket Agent Price" className="h-11 rounded-xl bg-white/[0.04] border border-white/10 px-3 text-white" /></div></div>)}</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5"><div className="p-3 rounded-xl bg-white/[0.03]">Ticket<br /><b>৳ {totals.ticket.toFixed(2)}</b></div><div className="p-3 rounded-xl bg-violet-500/10">Agent<br /><b>৳ {totals.agent.toFixed(2)}</b></div><div className="p-3 rounded-xl bg-pink-500/10"><input value={discount} onChange={e => setDiscount(e.target.value)} placeholder="Discount" className="w-full bg-transparent outline-none" />৳ {totals.disc.toFixed(2)}</div><div className="p-3 rounded-xl bg-amber-500/10">Due<br /><b>৳ {totals.due.toFixed(2)}</b></div></div>
                    <NumericFormat value={paid} onValueChange={v => setPaid(v.value)} allowNegative={false} placeholder="Paid Amount" className="mt-3 h-12 w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 text-white" />
                    <div className="mt-4 flex gap-3"><button onClick={create} disabled={loading} className="flex-1 h-12 rounded-xl bg-emerald-500 text-[#071311] font-black">{loading ? 'Saving...' : 'Create Voucher'}</button><button onClick={print} className="h-12 px-5 rounded-xl bg-cyan-500/10 text-cyan-300"><MdPrint /></button></div>
                </section>
            </div>
            <div ref={printRef} className="hidden"><div className="voucher"><AirTicketVoucherHeading /><p>Name: {client.name}</p><p>Mobile: {client.mobile_no}</p><p>Address: {client.address}</p><h3>Voucher - {voucherSl + 1}</h3><table><thead><tr><th>Service</th><th>Destination</th><th>Flight Date</th><th>Ticket Price</th></tr></thead><tbody>{services.map((s, i) => <tr key={i}><td>{s.service_name || 'Air Ticket'}</td><td>{s.destination}</td><td>{s.flight_date}</td><td>{money(s.ticket_price).toFixed(2)}</td></tr>)}</tbody></table><p>Total Ticket Price: {totals.ticket.toFixed(2)}</p><p>Discount: {totals.disc.toFixed(2)}</p><p>Paid: {totals.paidAmount.toFixed(2)}</p><p>Due: {totals.due.toFixed(2)}</p></div></div>
        </div>
    </div>;
}
