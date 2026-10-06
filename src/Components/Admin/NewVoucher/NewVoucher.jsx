import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    MdAdd,
    MdArrowBack,
    MdDeleteOutline,
    MdPrint,
    MdReceiptLong,
    MdSave,
} from 'react-icons/md';
import { NumericFormat } from 'react-number-format';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import VoucherHeading from '../../Shared/VoucherHeading/VoucherHeading';

const API = 'https://bismillah-enterprise-server.onrender.com';

const CATEGORIES = [
    'Computer',
    'Stationary',
    'Photocopy',
    'Others',
];

const emptyProduct = () => ({
    product_name: '',
    quantity: '',
    rate: '',
    total: 0,
    category: '',
});

const NewVoucher = () => {
    const client = useLoaderData();
    const location = useLocation();
    const navigate = useNavigate();
    const from = location?.state?.pathname;

    const [voucherSl, setVoucherSl] = useState(0);
    const [products, setProducts] = useState([emptyProduct()]);
    const [discount, setDiscount] = useState(0);
    const [paid, setPaid] = useState(0);
    const [due, setDue] = useState(0);
    const [status, setStatus] = useState('Unpaid');
    const [loading, setLoading] = useState(false);

    const discountAmountRef = useRef();
    const paidAmountRef = useRef();
    const voucherPrintRef = useRef();

    useEffect(() => {
        fetch(`${API}/voucher_sl`)
            .then((res) => res.json())
            .then((data) => setVoucherSl(Number(data?.sl_no) || 0))
            .catch(() => { });
    }, []);

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
        () => products.reduce((sum, item) => sum + Number(item.total || 0), 0),
        [products]
    );

    useEffect(() => {
        const nextDue = Math.max(
            0,
            totalBill - Number(discount || 0) - Number(paid || 0)
        );

        setDue(Number(nextDue.toFixed(2)));
        setStatus(nextDue > 0 ? 'Unpaid' : 'Paid');
    }, [totalBill, discount, paid]);

    const handlePaymentChange = () => {
        setDiscount(Number(discountAmountRef.current?.value || 0));
        setPaid(Number(paidAmountRef.current?.value || 0));
    };

    const handleChange = (index, field, value) => {
        setProducts((prev) => {
            const updated = [...prev];
            const row = {
                ...updated[index],
                [field]: value,
            };

            row.total = Number(
                (Number(row.quantity || 0) * Number(row.rate || 0)).toFixed(2)
            );

            updated[index] = row;
            return updated;
        });
    };

    const addProduct = () => {
        if (products.length >= 9) return;
        setProducts((prev) => [...prev, emptyProduct()]);
    };

    const handleDeleteRow = (index) => {
        if (products.length === 1) return;

        Swal.fire({
            title: 'Delete Product Row?',
            text: 'This product row will be removed.',
            icon: 'warning',
            background: '#0b1a17',
            color: '#ecfdf5',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#334155',
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                setProducts((prev) =>
                    prev.filter((_, rowIndex) => rowIndex !== index)
                );
            }
        });
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

    const handleSubmit = async () => {
        if (!client?._id) return;

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
                title: 'Incomplete Voucher',
                text: 'Please complete product, quantity, rate and category for every row.',
                icon: 'warning',
                background: '#0b1a17',
                color: '#ecfdf5',
                confirmButtonColor: '#10b981',
            });
        }

        if (discount < 0 || paid < 0 || discount + paid > totalBill) {
            return Swal.fire({
                title: 'Invalid Payment',
                text: 'Discount + paid amount cannot be greater than the bill.',
                icon: 'warning',
                background: '#0b1a17',
                color: '#ecfdf5',
                confirmButtonColor: '#10b981',
            });
        }

        const newSlNo = voucherSl + 1;
        const voucher = {
            date: `${currentDate}, ${time}`,
            transaction_date: currentDate,
            voucher_no: String(newSlNo),
            products,
            total: Number(totalBill.toFixed(2)),
            paid_amount: Number(paid.toFixed(2)),
            due_amount: Number(due.toFixed(2)),
            payment_status: status,
            discount: Number(discount.toFixed(2)),
        };

        const confirm = await Swal.fire({
            title: 'Create Voucher?',
            text: `Voucher #${newSlNo} will also update Daily Transactions.`,
            icon: 'question',
            background: '#0b1a17',
            color: '#ecfdf5',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#334155',
            confirmButtonText: 'Create Voucher',
        });

        if (!confirm.isConfirmed) return;

        try {
            setLoading(true);

            const response = await fetch(
                `${API}/new_voucher/${client._id}`,
                {
                    method: 'PUT',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(voucher),
                }
            );

            const result = await response.json();

            if (!response.ok || !result?.success) {
                throw new Error(
                    result?.error || 'Voucher creation failed'
                );
            }

            const slResponse = await fetch(`${API}/voucher_sl`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ new_sl_no: newSlNo }),
            });

            if (!slResponse.ok) {
                throw new Error('Voucher serial update failed');
            }

            await Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Voucher Created',
                text: `Voucher #${newSlNo} created successfully.`,
                showConfirmButton: false,
                timer: 1200,
                background: '#0b1a17',
                color: '#ecfdf5',
            });

            navigate(from || `/client_details/${client._id}`);
        } catch (error) {
            console.error('Voucher creation error:', error);

            Swal.fire({
                title: 'Something went wrong',
                text: error.message,
                icon: 'error',
                background: '#0b1a17',
                color: '#ecfdf5',
                confirmButtonColor: '#10b981',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-full overflow-hidden py-5 text-slate-200 sm:py-7">
            <div className="mb-7 flex items-center gap-4 print:hidden">
                <Link
                    to={from || '/client_corner'}
                    className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-slate-300 transition hover:border-emerald-400/30 hover:text-emerald-300 md:flex"
                >
                    <MdArrowBack />
                    Back
                </Link>

                <div className="flex flex-1 items-center justify-center gap-3 md:justify-start">
                    <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3">
                        <MdReceiptLong className="text-2xl text-emerald-300" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white sm:text-2xl">
                            New Voucher
                        </h1>
                        <p className="mt-1 text-xs text-slate-500">
                            {client?.name} • Voucher #{voucherSl + 1}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mx-auto mb-5 max-w-5xl rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-xs text-slate-500">Client</p>
                        <h2 className="text-lg font-bold text-white">
                            {client?.name}
                        </h2>
                    </div>
                    <div className="text-xs text-slate-500 sm:text-right">
                        <p>{client?.address}</p>
                        <p>{client?.mobile_no}</p>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-xl print:hidden">
                <div className="flex flex-col justify-between gap-3 border-b border-white/[0.06] p-5 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="font-bold text-white">
                            Voucher #{voucherSl + 1}
                        </h2>
                        <p className="mt-1 text-xs text-slate-500">
                            {currentDate} • {time}
                        </p>
                    </div>

                    <span
                        className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${status === 'Paid'
                            ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-400'
                            : 'border-red-400/20 bg-red-400/10 text-red-400'
                            }`}
                    >
                        {status}
                    </span>
                </div>

                <div className="overflow-x-auto p-5 scrollbar-hide">
                    <table className="w-full min-w-[860px] text-sm">
                        <thead>
                            <tr className="border-b border-white/[0.06] text-xs text-slate-500">
                                <th className="p-3">#</th>
                                <th className="p-3 text-left">Product</th>
                                <th className="p-3">Category</th>
                                <th className="p-3">Qty</th>
                                <th className="p-3">Rate</th>
                                <th className="p-3 text-right">Total</th>
                                <th className="p-3" />
                            </tr>
                        </thead>

                        <tbody>
                            {products.map((item, index) => (
                                <tr key={index} className="border-b border-white/[0.04]">
                                    <td className="p-3 text-center text-slate-500">
                                        {index + 1}
                                    </td>

                                    <td className="p-3">
                                        <input
                                            type="text"
                                            value={item.product_name}
                                            onChange={(e) =>
                                                handleChange(
                                                    index,
                                                    'product_name',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Product name"
                                            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-slate-200 outline-none focus:border-emerald-400/30"
                                        />
                                    </td>

                                    <td className="p-3">
                                        <select
                                            value={item.category}
                                            onChange={(e) =>
                                                handleChange(
                                                    index,
                                                    'category',
                                                    e.target.value
                                                )
                                            }
                                            className="w-36 rounded-lg border border-white/10 bg-[#0b1a17] px-3 py-2 text-slate-200 outline-none focus:border-emerald-400/30"
                                        >
                                            <option value="">Select</option>
                                            {CATEGORIES.map((category) => (
                                                <option key={category} value={category}>
                                                    {category}
                                                </option>
                                            ))}
                                        </select>
                                    </td>

                                    <td className="p-3">
                                        <NumericFormat
                                            value={item.quantity}
                                            onValueChange={(values) =>
                                                handleChange(
                                                    index,
                                                    'quantity',
                                                    values.value
                                                )
                                            }
                                            className="w-24 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-slate-200 outline-none"
                                            allowNegative={false}
                                            decimalScale={2}
                                        />
                                    </td>

                                    <td className="p-3">
                                        <NumericFormat
                                            value={item.rate}
                                            onValueChange={(values) =>
                                                handleChange(
                                                    index,
                                                    'rate',
                                                    values.floatValue || 0
                                                )
                                            }
                                            className="w-24 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-slate-200 outline-none"
                                            allowNegative={false}
                                            decimalScale={2}
                                        />
                                    </td>

                                    <td className="p-3 text-right font-semibold text-slate-200">
                                        {Number(item.total || 0).toFixed(2)}
                                    </td>

                                    <td className="p-3 text-center">
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteRow(index)}
                                            className="text-red-400/60 transition hover:text-red-400"
                                        >
                                            <MdDeleteOutline className="text-xl" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-5 sm:p-6">
                    <div className="ml-auto max-w-md space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Total Bill</span>
                            <span className="font-semibold text-white">
                                {totalBill.toFixed(2)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-5">
                            <span className="text-sm text-slate-500">Discount</span>
                            <NumericFormat
                                value={discount}
                                getInputRef={discountAmountRef}
                                onChange={handlePaymentChange}
                                className="w-32 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-right text-slate-200 outline-none"
                                allowNegative={false}
                                decimalScale={2}
                            />
                        </div>

                        <div className="flex items-center justify-between gap-5">
                            <span className="text-sm text-slate-500">Paid Amount</span>
                            <NumericFormat
                                value={paid}
                                getInputRef={paidAmountRef}
                                onChange={handlePaymentChange}
                                className="w-32 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-right text-slate-200 outline-none"
                                allowNegative={false}
                                decimalScale={2}
                            />
                        </div>

                        <div className="h-px bg-white/[0.06]" />

                        <div className="flex justify-between">
                            <span className="font-semibold text-slate-400">
                                Due Amount
                            </span>
                            <span className="font-bold text-amber-300">
                                {due.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col justify-end gap-3 sm:flex-row">
                        <button
                            onClick={addProduct}
                            disabled={products.length >= 9}
                            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-slate-300 transition hover:border-emerald-400/30 hover:text-emerald-300 disabled:opacity-40"
                        >
                            <MdAdd />
                            Add Product
                        </button>

                        <button
                            onClick={handlePrint}
                            className="flex items-center justify-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.05] px-4 py-2.5 text-cyan-300 transition hover:bg-cyan-400/10"
                        >
                            <MdPrint />
                            Print
                        </button>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-2.5 font-semibold text-emerald-300 transition hover:bg-emerald-400/15 disabled:opacity-40"
                        >
                            <MdSave />
                            {loading ? 'Creating...' : 'Create Voucher'}
                        </button>
                    </div>
                </div>
            </div>

            <div ref={voucherPrintRef} className="nunito hidden w-[550px]">
                <VoucherHeading />
                <div className="grid grid-cols-2 text-xs font-semibold text-black">
                    <div>
                        <h1>Name: {client?.name}</h1>
                        <h1>Address: {client?.address}</h1>
                    </div>
                    <div className="text-right">
                        <h1>Date: {currentDate}</h1>
                        <h1>Mobile No: {client?.mobile_no}</h1>
                    </div>
                </div>

                <h1 className="mt-2 text-center text-md font-bold text-black">
                    Voucher - {voucherSl + 1}
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
                        {products.map((item, index) => (
                            <tr key={index}>
                                <td className="border border-black p-2 text-center">
                                    {index + 1}
                                </td>
                                <td className="border border-black p-2">
                                    {item.product_name}
                                </td>
                                <td className="border border-black p-2 text-center">
                                    {item.category}
                                </td>
                                <td className="border border-black p-2 text-center">
                                    {item.quantity}
                                </td>
                                <td className="border border-black p-2 text-center">
                                    {item.rate}
                                </td>
                                <td className="border border-black p-2 text-center">
                                    {Number(item.total || 0).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan="5" className="border border-black p-2 text-right">
                                Total Bill
                            </td>
                            <td className="border border-black p-2 text-center">
                                {totalBill.toFixed(2)}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="5" className="border border-black p-2 text-right">
                                Discount
                            </td>
                            <td className="border border-black p-2 text-center">
                                {discount.toFixed(2)}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="5" className="border border-black p-2 text-right">
                                Paid
                            </td>
                            <td className="border border-black p-2 text-center">
                                {paid.toFixed(2)}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="5" className="border border-black p-2 text-right">
                                Due
                            </td>
                            <td className="border border-black p-2 text-center">
                                {due.toFixed(2)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default NewVoucher;



