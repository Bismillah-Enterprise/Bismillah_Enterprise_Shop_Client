import React, { useMemo, useRef, useState } from 'react';
import { MdAdd, MdDeleteOutline, MdOutlineCancel, MdPrint } from 'react-icons/md';
import { NumericFormat } from 'react-number-format';
import { Link, useLoaderData, useLocation, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import AirTicketVoucherHeading from '../../Shared/AirTicketVoucherHeading/AirTicketVoucherHeading';


const API = 'https://bismillah-enterprise-server.onrender.com';
const money = value => Number.isFinite(Number(value)) ? Number(Number(value).toFixed(2)) : 0;
const dateOnly = value => {
    if (!value) return '';
    const text = String(value).trim();
    const match = text.match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})/);
    return match ? `${match[1]} ${match[2]}, ${match[3]}` : text.split(',')[0].trim();
};
const todayOnly = () => new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
const normalizeServices = voucher => {
    if (Array.isArray(voucher?.services) && voucher.services.length) return voucher.services.map(x => ({
        service_name: x?.service_name || 'Air Ticket', destination: x?.destination || '', flight_date: x?.flight_date || '',
        ticket_price: money(x?.ticket_price), ticket_agent_price: money(x?.ticket_agent_price ?? x?.agent_price)
    }));
    return [{ service_name: 'Air Ticket', destination: voucher?.destination || '', flight_date: voucher?.flight_date || '', ticket_price: money(voucher?.ticket_price), ticket_agent_price: money(voucher?.ticket_agent_price ?? voucher?.agent_price) }];
};

export default function AirTicketVoucher() {
    const { voucher_no } = useParams();
    const client = useLoaderData();
    const location = useLocation();
    const navigate = useNavigate();
    const matchedVoucher = client?.vouchers?.find(v => String(v?.voucher_no) === String(voucher_no));
    const [isEdit, setIsEdit] = useState(false);
    const [services, setServices] = useState(() => normalizeServices(matchedVoucher));
    const [discount, setDiscount] = useState(money(matchedVoucher?.discount));
    const [paid, setPaid] = useState(money(matchedVoucher?.paid_amount));
    const [due, setDue] = useState(money(matchedVoucher?.due_amount));
    const [modal, setModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const paymentRef = useRef();
    const discountRef = useRef();
    const voucherPrintRef = useRef();

    const totals = useMemo(() => {
        const ticket = services.reduce((s, x) => s + money(x.ticket_price), 0);
        const agent = services.reduce((s, x) => s + money(x.ticket_agent_price), 0);
        const revenue = money(Math.max(0, ticket - agent - money(discount)));
        const calculatedDue = money(Math.max(0, ticket - money(discount) - money(paid)));
        return { ticket, agent, revenue, due: isEdit ? calculatedDue : money(due), discount: money(discount) };
    }, [services, discount, due]);

    const canEdit = !!matchedVoucher && dateOnly(matchedVoucher.date) === todayOnly();
    const update = (i, key, value) => setServices(prev => prev.map((x, index) => index === i ? { ...x, [key]: value } : x));
    const addService = () => setServices(prev => [...prev, { service_name: '', destination: '', flight_date: '', ticket_price: '', ticket_agent_price: '' }]);
    const deleteService = i => { if (services.length > 1) setServices(prev => prev.filter((_, index) => index !== i)); };

    const startEdit = () => {
        if (!canEdit) return Swal.fire({ icon: 'info', title: 'Voucher Locked', text: 'This voucher can only be edited on the date it was created.' });
        setServices(normalizeServices(matchedVoucher)); setDiscount(money(matchedVoucher.discount)); setPaid(money(matchedVoucher.paid_amount)); setDue(money(matchedVoucher.due_amount)); setIsEdit(true);
    };

    const saveEdit = async () => {
        if (services.some(s => !s.destination.trim() || money(s.ticket_price) <= 0 || money(s.ticket_agent_price) < 0)) return Swal.fire('Incomplete Service', 'Every service needs destination, ticket price and valid agent price.', 'warning');
        if (totals.agent > totals.ticket) return Swal.fire('Invalid Agent Price', 'Agent price cannot exceed total ticket price.', 'warning');
        if (discount + paid > totals.ticket) return Swal.fire('Invalid Amount', 'Discount plus paid amount cannot exceed ticket price.', 'warning');
        const ok = await Swal.fire({ title: 'Update Air Ticket Voucher?', text: 'Daily Transactions will be adjusted automatically.', icon: 'question', showCancelButton: true, confirmButtonColor: '#10b981' });
        if (!ok.isConfirmed) return;
        try {
            setSaving(true);
            const response = await fetch(`${API}/air_ticket_edit_voucher/${client._id}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ voucher_no: String(voucher_no), services: services.map(s => ({ ...s, ticket_price: money(s.ticket_price), ticket_agent_price: money(s.ticket_agent_price) })), discount: money(discount) }) });
            const result = await response.json();
            if (!response.ok || !result?.success) throw new Error(result?.error || 'Voucher update failed');
            setIsEdit(false); navigate(location.pathname); await Swal.fire({ icon: 'success', title: 'Voucher Updated', showConfirmButton: false, timer: 1000 });
        } catch (e) { Swal.fire('Update Failed', e.message, 'error'); }
        finally { setSaving(false); }
    };

    const takePayment = async () => {
        const payment = money(paymentRef.current?.value); const extra = money(discountRef.current?.value);
        if (payment <= 0 && extra <= 0) return Swal.fire('Enter Amount', 'Enter payment or additional discount.', 'warning');
        if (payment + extra > due) return Swal.fire('Invalid Amount', 'Payment plus discount cannot exceed current due.', 'warning');
        const nextPaid = money(paid + payment), nextDiscount = money(discount + extra), nextDue = money(due - payment - extra);
        const ok = await Swal.fire({ title: 'Confirm Payment?', html: `<p>Payment: <b>৳${payment.toFixed(2)}</b></p><p>Additional Discount: <b>৳${extra.toFixed(2)}</b></p><p>Remaining Due: <b>৳${nextDue.toFixed(2)}</b></p>`, icon: 'question', showCancelButton: true, confirmButtonColor: '#10b981' });
        if (!ok.isConfirmed) return;
        try {
            setSaving(true);
            const response = await fetch(`${API}/air_ticket_take_payment/${client._id}`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ voucher_no: String(voucher_no), reference_voucher: String(voucher_no), transection_amount: payment, additional_discount: extra, date: `${todayOnly()}, ${new Date().toLocaleTimeString('en-BD', { hour: '2-digit', minute: '2-digit', hour12: true })}` }) });
            const result = await response.json(); if (!response.ok || !result?.success) throw new Error(result?.error || 'Payment failed');
            setPaid(nextPaid); setDiscount(nextDiscount); setDue(nextDue); setModal(false); if (paymentRef.current) paymentRef.current.value = ''; if (discountRef.current) discountRef.current.value = ''; navigate(location.pathname);
        } catch (e) { Swal.fire('Payment Failed', e.message, 'error'); } finally { setSaving(false); }
    };

    const handlePrint = () => {
        const content = voucherPrintRef.current.innerHTML;

        const iframe = document.createElement('iframe');

        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';

        document.body.appendChild(iframe);

        const doc = iframe.contentWindow.document;

        doc.open();

        doc.write(`
        <html>
            <head>
                <title>Air Ticket Voucher - ${voucher_no}</title>

                <link
                    href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
                    rel="stylesheet"
                >

                <style>
                    @page {
                        size: A4 landscape;
                    }

                    body {
                        font-family: sans-serif;
                        color: black;
                        display: flex;
                        justify-content: end;
                        width: 100%;
                    }

                    .voucher-wrapper {
                        width: 48%;
                        height: 100%;
                        box-sizing: border-box;
                        page-break-inside: avoid;
                    }
                </style>
            </head>

            <body>

                <div class="voucher-wrapper">
                    ${content}
                </div>

            </body>
        </html>
    `);

        doc.close();

        iframe.onload = () => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();

            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 1000);
        };
    };

    if (!matchedVoucher) return <div className="p-10 text-center text-red-300">Voucher not found.</div>;
    const shown = isEdit ? services : normalizeServices(matchedVoucher);

    return <div className="min-h-full px-4 py-6 text-slate-200"><div className="max-w-6xl mx-auto">
        {modal && <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"><div className="w-full max-w-md rounded-3xl bg-[#071311] border border-white/10 p-6"><div className="flex justify-between"><h2 className="text-xl font-black text-white">Payment</h2><button onClick={() => setModal(false)}><MdOutlineCancel /></button></div><p className="mt-3 text-slate-400">Due: ৳ {due.toFixed(2)}</p><NumericFormat getInputRef={discountRef} allowNegative={false} placeholder="Additional discount" className="mt-4 h-12 w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 text-white" /><NumericFormat getInputRef={paymentRef} allowNegative={false} placeholder="Payment amount" className="mt-3 h-12 w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 text-white" /><button disabled={saving} onClick={takePayment} className="mt-4 h-12 w-full rounded-xl bg-emerald-500 text-[#071311] font-black">{saving ? 'Processing...' : 'Confirm Payment'}</button></div></div>}
        <div className="flex items-center justify-between mb-6"><Link to={location.pathname.includes('admin') ? `/admin/air_ticket_client_details/${client._id}` : `/air_ticket_client_details/${client._id}`} className="rounded-xl border border-white/10 px-4 py-2">← Back</Link><div className="text-right"><p className="text-xs uppercase tracking-[0.25em] text-violet-400">Air Ticket Voucher</p><h1 className="text-2xl font-black text-white">#{voucher_no}</h1></div></div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5"><div className="flex justify-between mb-5"><div><p className="text-xs text-slate-500">Customer</p><h2 className="text-xl font-bold text-white">{client.name}</h2><p className="text-sm text-slate-400">{matchedVoucher.date}</p></div><span className={due > 0 ? 'text-amber-300' : 'text-emerald-300'}>{due > 0 ? 'Unpaid' : 'Paid'}</span></div>
            <div className="overflow-x-auto"><table className="w-full min-w-[950px] text-sm"><thead><tr className="border-b border-white/10"><th className="p-3 text-left">Service</th><th className="p-3 text-left">Destination</th><th className="p-3">Flight Date</th><th className="p-3 text-right">Ticket Price</th><th className="p-3 text-right">Ticket Agent Price</th><th className="p-3 text-right">Revenue</th>{isEdit && <th className="p-3" />}</tr></thead><tbody>{shown.map((s, i) => { const rowRevenue = money(s.ticket_price) - money(s.ticket_agent_price); return <tr key={i} className="border-b border-white/5"><td className="p-3">{isEdit ? <input value={s.service_name} onChange={e => update(i, 'service_name', e.target.value)} className="w-full rounded-lg bg-white/[0.04] p-2" /> : (s.service_name || 'Air Ticket')}</td><td className="p-3">{isEdit ? <input value={s.destination} onChange={e => update(i, 'destination', e.target.value)} className="w-full rounded-lg bg-white/[0.04] p-2" /> : s.destination}</td><td className="p-3 text-center">{isEdit ? <input type="date" value={s.flight_date} onChange={e => update(i, 'flight_date', e.target.value)} className="relative rounded-lg bg-white/[0.04] p-2" /> : s.flight_date}</td><td className="p-3 text-right">{isEdit ? <NumericFormat value={s.ticket_price} onValueChange={v => update(i, 'ticket_price', v.value)} allowNegative={false} className="w-28 rounded-lg bg-white/[0.04] p-2 text-right" /> : money(s.ticket_price).toFixed(2)}</td><td className="p-3 text-right">{isEdit ? <NumericFormat value={s.ticket_agent_price} onValueChange={v => update(i, 'ticket_agent_price', v.value)} allowNegative={false} className="w-28 rounded-lg bg-white/[0.04] p-2 text-right" /> : money(s.ticket_agent_price).toFixed(2)}</td><td className="p-3 text-right text-violet-300">{rowRevenue.toFixed(2)}</td>{isEdit && <td className="p-3"><button disabled={services.length === 1} onClick={() => deleteService(i)} className="text-red-300 disabled:opacity-30"><MdDeleteOutline /></button></td>}</tr> })}</tbody></table></div>
            {isEdit && <button onClick={addService} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-violet-500/15 px-4 py-2 font-bold text-violet-300"><MdAdd /> Add Service</button>}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-5"><div className="p-4 rounded-xl bg-white/[0.03]">Ticket<br /><b>৳ {totals.ticket.toFixed(2)}</b></div><div className="p-4 rounded-xl bg-violet-500/10">Agent<br /><b>৳ {totals.agent.toFixed(2)}</b></div><div className="p-4 rounded-xl bg-pink-500/10">Discount<br /><b>৳ {money(discount).toFixed(2)}</b></div><div className="p-4 rounded-xl bg-emerald-500/10">Revenue<br /><b>৳ {totals.revenue.toFixed(2)}</b></div><div className="p-4 rounded-xl bg-amber-500/10">Due<br /><b>৳ {due.toFixed(2)}</b></div></div>
            <div className="flex flex-wrap justify-center gap-3 mt-6">{!isEdit && <button disabled={due <= 0} onClick={() => setModal(true)} className="px-5 py-3 rounded-xl bg-emerald-500/10 text-emerald-300 font-bold disabled:opacity-30">Take A Payment</button>}<button disabled={!canEdit && !isEdit} onClick={isEdit ? saveEdit : startEdit} className="px-5 py-3 rounded-xl bg-violet-500/10 text-violet-300 font-bold disabled:opacity-30">{isEdit ? (saving ? 'Saving...' : 'Save Changes') : (canEdit ? 'Edit Voucher' : 'Voucher Locked')}</button>{isEdit && <button onClick={() => setIsEdit(false)} className="px-5 py-3 rounded-xl bg-white/10">Cancel</button>}{!isEdit && <button onClick={handlePrint} className="px-5 py-3 rounded-xl bg-cyan-500/10 text-cyan-300 font-bold"><MdPrint className="inline" /> Print</button>}</div>
        </div>
        <div
                ref={voucherPrintRef}
                className="nunito w-[550px] hidden"
            >
                <AirTicketVoucherHeading />

                <div className="flex items-center justify-center">

                    <div className="text-sm font-semibold grid grid-cols-2 text-black w-full">

                        <div>
                            <h1>Name: {client.name}</h1>
                            <h1>Mobile No: {client.mobile_no}</h1>
                            <h1>Date of Birth: {client.date_of_birth}</h1>
                            <h1>Address: {client.address}</h1>
                        </div>

                        <div className="flex justify-end">

                            <div>
                                <h1>Date: {matchedVoucher.date}</h1>
                                <h1>Passport No: {client.passport_no}</h1>
                                <h1>Date of Expiry: {client.date_of_expiry}</h1>
                            </div>

                        </div>

                    </div>

                </div>

                <div className="flex items-center justify-center nunito">

                    <h1 className="nunito text-xl text-center font-bold px-5 text-black">
                        Voucher - {voucher_no}
                    </h1>

                </div>

                <div className="flex items-center justify-center mt-1 overflow-x-scroll sm:overflow-x-hidden overflow-y-hidden scrollbar-hide text-md">

                    <div className="absolute w-full flex items-center justify-center">

                        <div>
                            <h1 className="text-7xl font-bold opacity-20">
                                {matchedVoucher.payment_status}
                            </h1>
                        </div>

                    </div>

                    <table className="text-black w-full border-collapse">

                        <thead>

                            <tr className="text-black">

                                <th className="border border-black p-2">
                                    Destination
                                </th>

                                <th className="border border-black p-2">
                                    Flight Date
                                </th>

                                <th className="border border-black p-2">
                                    Ticket Price
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            <tr>

                                <td className="border border-black p-2 text-center">
                                    {matchedVoucher.destination}
                                </td>

                                <td className="border border-black p-2 text-center">
                                    {matchedVoucher.flight_date}
                                </td>

                                <td className="border border-black p-2 text-center">
                                    {matchedVoucher.ticket_price}
                                </td>

                            </tr>

                            <tr className="text-right font-semibold">

                                <td className="p-2 border border-black">
                                    &nbsp;
                                </td>

                                <td className="p-2 border border-black">
                                    Discount
                                </td>

                                <td className="p-2 border border-black text-center">
                                    {matchedVoucher.discount}
                                </td>

                            </tr>

                            <tr className="text-right font-semibold">

                                <td className="p-2 border border-black">
                                    &nbsp;
                                </td>

                                <td className="p-2 border border-black">
                                    Paid Amount
                                </td>

                                <td className="p-2 border border-black text-center">
                                    {matchedVoucher.paid_amount}
                                </td>

                            </tr>

                            <tr className="text-right font-semibold">

                                <td className="p-2 border border-black text-center">
                                    {matchedVoucher.payment_status}
                                </td>

                                <td className="p-2 border border-black">
                                    Due Amount
                                </td>

                                <td className="p-2 border border-black text-center">
                                    {matchedVoucher.due_amount}
                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>

                <div className="flex items-center justify-between mt-20 text-xs absolute bottom-0 w-1/2">

                    <div className="border-t-2 border-black pt-1 w-fit px-5 ml-4">
                        <h1>Buyer Sign</h1>
                    </div>

                    <div className="border-t-2 border-black pt-1 w-fit px-5 mr-8">
                        <h1>Seller Sign</h1>
                    </div>

                </div>

            </div>
    </div></div>;
}
