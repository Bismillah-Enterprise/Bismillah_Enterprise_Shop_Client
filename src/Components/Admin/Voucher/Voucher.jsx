import React, { useMemo, useRef, useState } from 'react';
import {
    MdAdd,
    MdDeleteOutline,
    MdOutlineCancel,
    MdPrint,
} from 'react-icons/md';
import { NumericFormat } from 'react-number-format';
import {
    Link,
    useLoaderData,
    useLocation,
    useNavigate,
    useParams,
} from 'react-router-dom';
import Swal from 'sweetalert2';
import VoucherHeading from '../../Shared/VoucherHeading/VoucherHeading';

const API = 'https://bismillah-enterprise-server.onrender.com';

const CATEGORIES = [
    'Computer',
    'Stationary',
    'Photocopy',
    'Others',
];

const getDateOnly = (value) => {
    if (!value) return '';
    const text = String(value).trim();
    const match = text.match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})/);
    return match ? `${match[1]} ${match[2]}, ${match[3]}` : text;
};

const getTodayDateOnly = () =>
    new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

const Voucher = () => {
    const { voucher_no } = useParams();
    const client = useLoaderData();
    const location = useLocation();
    const navigate = useNavigate();

    const matchedVoucher = client?.vouchers?.find(
        (voucher) =>
            String(voucher.voucher_no) === String(voucher_no)
    );

    const [isEdit, setIsEdit] = useState(false);
    const [products, setProducts] = useState(
        matchedVoucher?.products?.map((item) => ({
            ...item,
            category: item.category || '',
        })) || []
    );

    const [discount, setDiscount] = useState(
        Number(matchedVoucher?.discount || 0)
    );

    const [paid, setPaid] = useState(
        Number(matchedVoucher?.paid_amount || 0)
    );

    const [due, setDue] = useState(
        Number(matchedVoucher?.due_amount || 0)
    );

    const [modal, setModal] = useState(false);
    const [saving, setSaving] = useState(false);

    const isVoucherToday =
        getDateOnly(matchedVoucher?.date) === getTodayDateOnly();

    const paymentRef = useRef();
    const moreDiscountRef = useRef();
    const voucherPrintRef = useRef();

    const now = new Date();

    const time = now.toLocaleTimeString('en-BD', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

    const currentDate = now.toLocaleDateString('en-BD', {
        day: 'numeric',
        year: 'numeric',
        month: 'long',
    });

    const totalBill = useMemo(
        () => products.reduce(
            (sum, item) => sum + Number(item.total || 0),
            0
        ),
        [products]
    );

    const handleChange = (index, field, value) => {
        setProducts((prev) => {
            const updated = [...prev];
            const row = {
                ...updated[index],
                [field]: value,
            };

            row.total = Number(
                (
                    Number(row.quantity || 0) *
                    Number(row.rate || 0)
                ).toFixed(2)
            );

            updated[index] = row;
            return updated;
        });
    };

    const handleDeleteRow = (index) => {
        if (products.length === 1) return;

        Swal.fire({
            title: 'Delete this row?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#334155',
            background: '#0b1a17',
            color: '#ecfdf5',
        }).then((result) => {
            if (!result.isConfirmed) return;

            setProducts((prev) =>
                prev.filter((_, rowIndex) => rowIndex !== index)
            );
        });
    };

    const startEdit = () => {
        if (!isVoucherToday) {
            Swal.fire({
                icon: 'info',
                title: 'Voucher is locked',
                text: 'A voucher can only be edited on the same date it was created.',
                background: '#0b1a17',
                color: '#ecfdf5',
            });
            return;
        }
        setProducts((matchedVoucher?.products || []).map((item) => ({ ...item, category: item.category || '' })));
        setIsEdit(true);
    };

    const addProduct = () => {
        if (!isEdit || !isVoucherToday) return;
        setProducts((prev) => [
            ...prev,
            { product_name: '', quantity: '', rate: '', total: 0, category: '' },
        ]);
    };

    const handleEditVoucher = async () => {
        if (
            products.some(
                (item) =>
                    !item.product_name ||
                    !item.quantity ||
                    !item.rate ||
                    !item.category
            )
        ) {
            return Swal.fire({
                title: 'Incomplete Product',
                text: 'Every row needs product, quantity, rate and category.',
                icon: 'warning',
                background: '#0b1a17',
                color: '#ecfdf5',
            });
        }

        const newTotal = Number(totalBill.toFixed(2));
        const newDue = Math.max(
            0,
            newTotal -
            Number(matchedVoucher.paid_amount || 0) -
            Number(matchedVoucher.discount || 0)
        );

        const confirm = await Swal.fire({
            title: 'Update Voucher?',
            text: 'Daily Transactions will be adjusted according to the new categories and amounts.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#334155',
            background: '#0b1a17',
            color: '#ecfdf5',
        });

        if (!confirm.isConfirmed) return;

        try {
            setSaving(true);

            const response = await fetch(
                `${API}/edit_voucher/${client._id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        voucher_no: String(voucher_no),
                        products,
                        total: newTotal,
                        due_amount: Number(newDue.toFixed(2)),
                        status: newDue > 0 ? 'Unpaid' : 'Paid',
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok || !result?.success) {
                throw new Error(
                    result?.error || 'Voucher update failed'
                );
            }

            setDue(newDue);
            setIsEdit(false);
            navigate(location.pathname);

            await Swal.fire({
                icon: 'success',
                title: 'Voucher Updated',
                showConfirmButton: false,
                timer: 1000,
                background: '#0b1a17',
                color: '#ecfdf5',
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: error.message,
                background: '#0b1a17',
                color: '#ecfdf5',
            });
        } finally {
            setSaving(false);
        }
    };

    const handlePrint = () => {
        const content = voucherPrintRef.current?.innerHTML || '';
        const iframe = document.createElement('iframe');

        iframe.style.cssText =
            'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(`
            <html>
                <head>
                    <title>Voucher</title>
                    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
                    <style>
                        @page { size: A4 landscape; margin: 10mm; }
                        body { font-family: sans-serif; color: black; display: flex; justify-content: flex-end; }
                        .voucher-wrapper { width: 48%; box-sizing: border-box; }
                    </style>
                </head>
                <body><div class="voucher-wrapper">${content}</div></body>
            </html>
        `);
        doc.close();

        iframe.onload = () => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            setTimeout(() => iframe.remove(), 1000);
        };
    };

    const handleTakePayment = async () => {
        const payment = Number(paymentRef.current?.value || 0);
        const moreDiscount = Number(
            moreDiscountRef.current?.value || 0
        );

        if (payment <= 0 && moreDiscount <= 0) {
            return Swal.fire({
                icon: 'warning',
                title: 'Nothing to Update',
                text: 'Enter a payment or additional discount.',
                background: '#0b1a17',
                color: '#ecfdf5',
            });
        }

        if (payment > due) {
            return Swal.fire({
                icon: 'warning',
                title: 'Invalid Payment',
                text: 'Payment cannot be greater than the current due.',
                background: '#0b1a17',
                color: '#ecfdf5',
            });
        }

        if (payment + moreDiscount > due) {
            return Swal.fire({
                icon: 'warning',
                title: 'Invalid Amount',
                text: 'Payment + additional discount cannot be greater than the current due.',
                background: '#0b1a17',
                color: '#ecfdf5',
            });
        }

        const nextDue = Number(
            (due - payment - moreDiscount).toFixed(2)
        );

        const nextPaid = Number(
            (paid + payment).toFixed(2)
        );

        const nextDiscount = Number(
            (discount + moreDiscount).toFixed(2)
        );

        const nextStatus = nextDue > 0 ? 'Unpaid' : 'Paid';

        const confirm = await Swal.fire({
            title: 'Confirm Payment?',
            html: `
                <div style="text-align:left">
                    <p>Payment: <b>৳${payment.toFixed(2)}</b></p>
                    <p>Additional Discount: <b>৳${moreDiscount.toFixed(2)}</b></p>
                    <p>Remaining Due: <b>৳${nextDue.toFixed(2)}</b></p>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#334155',
            background: '#0b1a17',
            color: '#ecfdf5',
        });

        if (!confirm.isConfirmed) return;

        try {
            setSaving(true);

            const response = await fetch(
                `${API}/take_payment/${client._id}`,
                {
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        voucher_no: String(voucher_no),
                        reference_voucher: String(voucher_no),
                        paid_amount: nextPaid,
                        transection_amount: payment,
                        due: nextDue,
                        payment_status: nextStatus,
                        discount: nextDiscount,
                        additional_discount: moreDiscount,
                        date: `${currentDate}, ${time}`,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok || !result?.success) {
                throw new Error(
                    result?.error || 'Payment update failed'
                );
            }

            setPaid(nextPaid);
            setDiscount(nextDiscount);
            setDue(nextDue);
            setModal(false);

            if (paymentRef.current) paymentRef.current.value = '';
            if (moreDiscountRef.current) moreDiscountRef.current.value = '';

            await Swal.fire({
                icon: 'success',
                title: 'Payment Updated',
                text: `Remaining due: ৳${nextDue.toFixed(2)}`,
                showConfirmButton: false,
                timer: 1200,
                background: '#0b1a17',
                color: '#ecfdf5',
            });

            navigate(location.pathname);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Payment Failed',
                text: error.message,
                background: '#0b1a17',
                color: '#ecfdf5',
            });
        } finally {
            setSaving(false);
        }
    };

    if (!matchedVoucher) {
        return (
            <div className="p-10 text-center text-red-400">
                Voucher not found.
            </div>
        );
    }

    const displayProducts = isEdit
        ? products
        : matchedVoucher.products || [];

    return (
        <div className="relative min-h-full w-full text-slate-200">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-pink-500/[0.035] blur-[130px]" />
                <div className="absolute -right-40 top-[25%] h-[450px] w-[450px] rounded-full bg-violet-500/[0.035] blur-[140px]" />
                <div className="absolute -bottom-40 left-[35%] h-[500px] w-[500px] rounded-full bg-cyan-500/[0.025] blur-[150px]" />
            </div>

            {modal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
                    onClick={() => !saving && setModal(false)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-md rounded-3xl border border-pink-300/20 bg-[#081513]/95 shadow-2xl shadow-pink-500/10 backdrop-blur-2xl"
                    >
                        <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-pink-400">
                                    Payment
                                </p>
                                <h2 className="mt-1 text-xl font-black text-white">
                                    Payment Details
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setModal(false)}
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 hover:text-red-300"
                            >
                                <MdOutlineCancel className="text-xl" />
                            </button>
                        </div>

                        <div className="space-y-5 p-6">
                            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] uppercase text-slate-500">
                                            Bill
                                        </p>
                                        <p className="mt-1 text-lg font-black text-white">
                                            ৳ {Number(matchedVoucher.total || 0).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase text-slate-500">
                                            Discount
                                        </p>
                                        <p className="mt-1 text-lg font-black text-pink-300">
                                            ৳ {discount.toFixed(2)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-slate-500">
                                            Paid
                                        </p>
                                        <p className="mt-1 text-lg font-black text-emerald-300">
                                            ৳ {paid.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase text-slate-500">
                                            Due
                                        </p>
                                        <p className="mt-1 text-lg font-black text-amber-300">
                                            ৳ {due.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-semibold uppercase text-slate-400">
                                    Additional Discount
                                </label>
                                <NumericFormat
                                    getInputRef={moreDiscountRef}
                                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none focus:border-pink-400/40"
                                    placeholder="Enter discount amount"
                                    allowNegative={false}
                                    decimalScale={2}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-semibold uppercase text-slate-400">
                                    Payment Amount
                                </label>
                                <NumericFormat
                                    getInputRef={paymentRef}
                                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none focus:border-emerald-400/40"
                                    placeholder="Enter payment amount"
                                    allowNegative={false}
                                    decimalScale={2}
                                />
                            </div>

                            <button
                                onClick={handleTakePayment}
                                disabled={saving}
                                className="h-12 w-full rounded-xl border border-pink-400/20 bg-pink-500/10 font-bold text-pink-200 transition hover:bg-pink-500 hover:text-white disabled:opacity-40"
                            >
                                {saving ? 'Updating...' : 'Submit Payment'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="relative z-10 mx-auto w-full max-w-6xl">
                <div className="mb-6 rounded-3xl border border-white/[0.07] bg-white/[0.025] p-4 sm:p-6">
                    <div className="flex items-center justify-between gap-4">
                        <Link to={location.pathname.includes('admin') ? `/admin/client_details/${client._id}` : location.pathname.includes('daily_transactions') ? `/daily_transactions/client_details/${client._id}` : `/client_details/${client._id}`}>
                            <span className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-slate-300 hover:border-pink-400/30 hover:text-pink-300">
                                ← Back
                            </span>
                        </Link>

                        <div className="text-right">
                            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-pink-400">
                                Sales Voucher
                            </p>
                            <h1 className="mt-1 text-xl font-black text-white sm:text-2xl">
                                #{voucher_no}
                            </h1>
                        </div>
                    </div>

                    <div className="mt-5 grid gap-4 rounded-2xl border border-white/[0.06] bg-black/10 p-4 sm:grid-cols-2">
                        <div>
                            <p className="text-[10px] uppercase text-slate-500">
                                Customer
                            </p>
                            <h2 className="mt-1 text-lg font-bold text-white">
                                {client.name}
                            </h2>
                            <p className="mt-3 text-sm text-slate-300">
                                {client.address}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:text-right">
                            <div>
                                <p className="text-[10px] uppercase text-slate-500">
                                    Date
                                </p>
                                <p className="mt-1 text-sm font-semibold text-slate-200">
                                    {matchedVoucher.date}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase text-slate-500">
                                    Mobile
                                </p>
                                <p className="mt-1 text-sm font-semibold text-slate-200">
                                    {client.mobile_no}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.025]">
                    <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-pink-400">
                                Items
                            </p>
                            <h2 className="mt-1 text-lg font-bold text-white">
                                {isEdit ? 'Edit Voucher Items' : 'Voucher Summary'}
                            </h2>
                        </div>

                        <div
                            className={`rounded-full border px-3 py-1 text-xs font-bold ${matchedVoucher.payment_status === 'Paid'
                                ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
                                : 'border-amber-400/20 bg-amber-400/10 text-amber-300'
                                }`}
                        >
                            {matchedVoucher.payment_status}
                        </div>
                    </div>

                    <div className="overflow-x-auto p-5 scrollbar-hide">
                        <table className="w-full min-w-[820px] text-sm">
                            <thead>
                                <tr className="border-b border-white/[0.07] text-xs uppercase text-slate-500">
                                    {isEdit && <th className="px-4 py-4" />}
                                    <th className="px-4 py-4 text-left">SL</th>
                                    <th className="px-4 py-4 text-left">Product</th>
                                    <th className="px-4 py-4">Category</th>
                                    <th className="px-4 py-4 text-right">Qty</th>
                                    <th className="px-4 py-4 text-right">Rate</th>
                                    <th className="px-4 py-4 text-right">Total</th>
                                </tr>
                            </thead>

                            <tbody>
                                {displayProducts.map((product, index) => (
                                    <tr key={index} className="border-b border-white/[0.05]">
                                        {isEdit && (
                                            <td className="px-4 py-4">
                                                <button
                                                    onClick={() => handleDeleteRow(index)}
                                                    className="text-red-400"
                                                >
                                                    <MdDeleteOutline />
                                                </button>
                                            </td>
                                        )}

                                        <td className="px-4 py-4 text-slate-500">
                                            {String(index + 1).padStart(2, '0')}
                                        </td>

                                        <td className="px-4 py-4">
                                            {isEdit ? (
                                                <input
                                                    value={product.product_name}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            index,
                                                            'product_name',
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-white outline-none"
                                                />
                                            ) : (
                                                <span className="font-medium text-white">
                                                    {product.product_name}
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-4 py-4 text-center">
                                            {isEdit ? (
                                                <select
                                                    value={product.category || ''}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            index,
                                                            'category',
                                                            e.target.value
                                                        )
                                                    }
                                                    className="rounded-xl border border-white/10 bg-[#0b1a17] px-3 py-2 text-white outline-none"
                                                >
                                                    <option value="">Select</option>
                                                    {CATEGORIES.map((category) => (
                                                        <option
                                                            key={category}
                                                            value={category}
                                                        >
                                                            {category}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-slate-300">
                                                    {product.category || '—'}
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-4 py-4 text-right">
                                            {isEdit ? (
                                                <NumericFormat
                                                    value={product.quantity}
                                                    onValueChange={(values) =>
                                                        handleChange(
                                                            index,
                                                            'quantity',
                                                            values.value
                                                        )
                                                    }
                                                    className="w-24 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-right text-white outline-none"
                                                    allowNegative={false}
                                                    decimalScale={2}
                                                />
                                            ) : (
                                                product.quantity
                                            )}
                                        </td>

                                        <td className="px-4 py-4 text-right">
                                            {isEdit ? (
                                                <NumericFormat
                                                    value={product.rate}
                                                    onValueChange={(values) =>
                                                        handleChange(
                                                            index,
                                                            'rate',
                                                            values.floatValue || 0
                                                        )
                                                    }
                                                    className="w-24 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-right text-white outline-none"
                                                    allowNegative={false}
                                                    decimalScale={2}
                                                />
                                            ) : (
                                                product.rate
                                            )}
                                        </td>

                                        <td className="px-4 py-4 text-right font-bold text-pink-300">
                                            {Number(product.total || 0).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}

                                <tr>
                                    <td
                                        colSpan={isEdit ? 6 : 5}
                                        className="px-4 py-4 text-right font-semibold text-slate-400"
                                    >
                                        Total Bill
                                    </td>
                                    <td className="px-4 py-4 text-right text-lg font-black text-white">
                                        {isEdit
                                            ? totalBill.toFixed(2)
                                            : Number(matchedVoucher.total || 0).toFixed(2)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-6 rounded-3xl border border-white/[0.07] bg-white/[0.025] p-4 sm:p-5">
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {!isEdit && (
                            <button
                                onClick={() => setModal(true)}
                                disabled={due <= 0}
                                className="inline-flex h-11 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-5 text-sm font-bold text-emerald-300 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Take A Payment
                            </button>
                        )}

                        {!isEdit ? (
                            <button
                                onClick={startEdit}
                                disabled={!isVoucherToday}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-pink-400/20 bg-pink-500/10 px-5 text-sm font-bold text-pink-300 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <MdAdd />
                                {isVoucherToday ? 'Add / Edit Products' : 'Editing Locked'}
                            </button>
                        ) : (
                            <button
                                onClick={addProduct}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-pink-400/20 bg-pink-500/10 px-5 text-sm font-bold text-pink-300"
                            >
                                <MdAdd />
                                Add New Item
                            </button>
                        )}

                        {isEdit && (
                            <button
                                onClick={handleEditVoucher}
                                disabled={saving}
                                className="inline-flex h-11 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-5 text-sm font-bold text-emerald-300 disabled:opacity-40"
                            >
                                {saving ? 'Saving...' : 'Done'}
                            </button>
                        )}

                        {!isEdit && (
                            <button
                                onClick={handlePrint}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-5 text-sm font-bold text-cyan-300"
                            >
                                <MdPrint />
                                Print
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div ref={voucherPrintRef} className="nunito hidden w-[550px]">
                <VoucherHeading />
                <div className="grid grid-cols-2 text-xs font-semibold text-black">
                    <div>
                        <h1>Name: {client.name}</h1>
                        <h1>Address: {client.address}</h1>
                    </div>
                    <div className="text-right">
                        <h1>Date: {matchedVoucher.date}</h1>
                        <h1>Mobile No: {client.mobile_no}</h1>
                    </div>
                </div>
                <h1 className="mt-2 text-center text-md font-bold text-black">
                    Voucher - {voucher_no}
                </h1>
                <table className="mt-2 w-full text-xs text-black">
                    <thead>
                        <tr>
                            <th className="border border-black p-2">SL</th>
                            <th className="border border-black p-2">Product</th>
                            <th className="border border-black p-2">Category</th>
                            <th className="border border-black p-2">Quantity</th>
                            <th className="border border-black p-2">Rate</th>
                            <th className="border border-black p-2">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {matchedVoucher.products?.map((product, index) => (
                            <tr key={index}>
                                <td className="border border-black p-2 text-center">{index + 1}</td>
                                <td className="border border-black p-2">{product.product_name}</td>
                                <td className="border border-black p-2 text-center">{product.category}</td>
                                <td className="border border-black p-2 text-center">{product.quantity}</td>
                                <td className="border border-black p-2 text-center">{product.rate}</td>
                                <td className="border border-black p-2 text-center">{product.total}</td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan="5" className="border border-black p-2 text-right">Total Bill</td>
                            <td className="border border-black p-2 text-center">{matchedVoucher.total}</td>
                        </tr>
                        <tr>
                            <td colSpan="5" className="border border-black p-2 text-right">Discount</td>
                            <td className="border border-black p-2 text-center">{discount}</td>
                        </tr>
                        <tr>
                            <td colSpan="5" className="border border-black p-2 text-right">Paid</td>
                            <td className="border border-black p-2 text-center">{paid}</td>
                        </tr>
                        <tr>
                            <td colSpan="5" className="border border-black p-2 text-right">Due</td>
                            <td className="border border-black p-2 text-center">{due}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Voucher;




