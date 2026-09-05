import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    MdAdd,
    MdArrowBack,
    MdDeleteOutline,
    MdPersonAdd,
    MdPrint,
    MdSave,
} from 'react-icons/md';
import { NumericFormat } from 'react-number-format';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import VoucherHeading from '../../Shared/VoucherHeading/VoucherHeading';

const API = 'http://localhost:5000';

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

const CreateNewClientWithVoucher = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.pathname;

    const [value, setValue] = useState('');
    const [numberAlert, setNumberAlert] = useState(false);
    const [voucherSl, setVoucherSl] = useState(0);
    const [loading, setLoading] = useState(false);

    const clientNameRef = useRef();
    const onBehalfRef = useRef();
    const addressRef = useRef();
    const phoneNoRef = useRef();
    const discountAmountRef = useRef();
    const paidAmountRef = useRef();
    const voucherPrintRef = useRef();

    const [products, setProducts] = useState([emptyProduct()]);
    const [discount, setDiscount] = useState(0);
    const [paid, setPaid] = useState(0);
    const [due, setDue] = useState(0);
    const [status, setStatus] = useState('Unpaid');

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

    const calculatePayment = (discountValue, paidValue) => {
        const nextDue = Math.max(
            0,
            totalBill - Number(discountValue || 0) - Number(paidValue || 0)
        );

        setDiscount(Number(discountValue || 0));
        setPaid(Number(paidValue || 0));
        setDue(Number(nextDue.toFixed(2)));
        setStatus(nextDue > 0 ? 'Unpaid' : 'Paid');
    };

    const handlePaymentChange = () => {
        calculatePayment(
            Number(discountAmountRef.current?.value || 0),
            Number(paidAmountRef.current?.value || 0)
        );
    };

    const handleChange = (index, field, value) => {
        setProducts((prev) => {
            const updated = [...prev];
            const row = {
                ...updated[index],
                [field]: value,
            };

            const quantity = Number(row.quantity || 0);
            const rate = Number(row.rate || 0);

            row.total = Number((quantity * rate).toFixed(2));
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
                    <link
                        href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
                        rel="stylesheet"
                    />
                    <style>
                        @page { size: A4 landscape; margin: 10mm; }
                        body {
                            font-family: sans-serif;
                            color: black;
                            display: flex;
                            justify-content: flex-end;
                        }
                        .voucher-wrapper {
                            width: 48%;
                            box-sizing: border-box;
                        }
                    </style>
                </head>
                <body>
                    <div class="voucher-wrapper">${content}</div>
                </body>
            </html>
        `);
        doc.close();

        iframe.onload = () => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            setTimeout(() => iframe.remove(), 1000);
        };
    };

    const handleCreateNewClient = async () => {
        const clientName = clientNameRef.current?.value.trim();
        const onBehalf = onBehalfRef.current?.value.trim();
        const address = addressRef.current?.value.trim();
        const phoneNo = phoneNoRef.current?.value || '';

        const phone = `0${phoneNo}`;

        if (!clientName || !onBehalf || !address) {
            return Swal.fire({
                title: 'Incomplete Information',
                text: 'Please fill in all client information.',
                icon: 'warning',
                background: '#0b1a17',
                color: '#ecfdf5',
                confirmButtonColor: '#10b981',
            });
        }

        if (phone.length !== 11 || value.charAt(0) !== '1') {
            setNumberAlert(true);
            return;
        }

        const incomplete = products.some(
            (item) =>
                !item.product_name ||
                !item.quantity ||
                !item.rate ||
                !item.category
        );

        if (incomplete) {
            return Swal.fire({
                title: 'Incomplete Voucher',
                text: 'Please complete product, quantity, rate and category for every row.',
                icon: 'warning',
                background: '#0b1a17',
                color: '#ecfdf5',
                confirmButtonColor: '#10b981',
            });
        }

        const newSlNo = voucherSl + 1;
        const discountAmount = Number(
            discountAmountRef.current?.value || 0
        );

        const voucher = {
            date: `${currentDate}, ${time}`,
            voucher_no: String(newSlNo),
            products,
            total: Number(totalBill.toFixed(2)),
            paid_amount: Number(paid.toFixed(2)),
            due_amount: Number(due.toFixed(2)),
            payment_status: status,
            discount: Number(discountAmount.toFixed(2)),
        };

        const newClient = {
            name: clientName,
            on_behalf: onBehalf,
            mobile_no: phone,
            address,
            vouchers: [],
            transections: [],
        };

        const confirm = await Swal.fire({
            title: 'Create Client + Voucher?',
            text: `Voucher #${newSlNo} will be created and added to Daily Transactions.`,
            icon: 'question',
            background: '#0b1a17',
            color: '#ecfdf5',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#334155',
            confirmButtonText: 'Create',
        });

        if (!confirm.isConfirmed) return;

        try {
            setLoading(true);

            const clientResponse = await fetch(`${API}/new_client`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(newClient),
            });

            const clientResult = await clientResponse.json();

            if (!clientResponse.ok || !clientResult?.insertedId) {
                throw new Error(
                    clientResult?.error || 'Client creation failed'
                );
            }

            const voucherResponse = await fetch(
                `${API}/new_voucher/${clientResult.insertedId}`,
                {
                    method: 'PUT',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({
                        ...voucher,
                        transaction_date: currentDate,
                    }),
                }
            );

            const voucherResult = await voucherResponse.json();

            if (!voucherResponse.ok || !voucherResult?.success) {
                throw new Error(
                    voucherResult?.error || 'Daily transaction sync failed'
                );
            }

            await fetch(`${API}/voucher_sl`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ new_sl_no: newSlNo }),
            });

            await Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Client & Voucher Created',
                showConfirmButton: false,
                timer: 1200,
                background: '#0b1a17',
                color: '#ecfdf5',
            });

            navigate(from || '/client_corner');
        } catch (error) {
            console.error('Create client/voucher error:', error);

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
        <div className="min-h-full overflow-scroll py-5 text-slate-200 sm:py-7">
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
                        <MdPersonAdd className="text-2xl text-emerald-300" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white sm:text-2xl">
                            New Client + Voucher
                        </h1>
                        <p className="mt-1 text-xs text-slate-500">
                            Create client and first voucher together
                        </p>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-5xl rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5 backdrop-blur-xl sm:p-7 print:hidden">
                <div className="mb-6">
                    <h2 className="font-bold text-white">Client Information</h2>
                    <p className="mt-1 text-xs text-slate-500">
                        Enter client information before preparing the voucher.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {[
                        ['Client Name', clientNameRef, 'Enter client name'],
                        ['On Behalf', onBehalfRef, 'Enter representative'],
                        ['Address', addressRef, 'Enter address'],
                    ].map(([label, ref, placeholder]) => (
                        <div key={label}>
                            <label className="mb-2 block text-xs text-slate-500">
                                {label}
                            </label>
                            <input
                                ref={ref}
                                type="text"
                                placeholder={placeholder}
                                className="w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-slate-200 outline-none placeholder:text-slate-700 focus:border-emerald-400/40"
                            />
                        </div>
                    ))}

                    <div>
                        <label className="mb-2 block text-xs text-slate-500">
                            Phone Number
                        </label>
                        <div
                            className={`rounded-xl border bg-white/[0.035] px-4 py-3 ${numberAlert
                                ? 'border-red-500'
                                : 'border-white/10'
                                }`}
                        >
                            <NumericFormat
                                getInputRef={phoneNoRef}
                                className="w-full bg-transparent text-slate-200 outline-none"
                                placeholder="01XXXXXXXXX"
                                format="0##########"
                                mask="_"
                                onValueChange={(values) => {
                                    setValue(values.value);
                                    setNumberAlert(false);
                                }}
                                isAllowed={(values) => values.value.length <= 11}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto mt-5 max-w-5xl rounded-3xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-xl print:hidden">
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
                                <tr
                                    key={index}
                                    className="border-b border-white/[0.04]"
                                >
                                    <td className="p-3 text-center text-slate-500">
                                        {index + 1}
                                    </td>

                                    <td className="p-3">
                                        <input
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
                                                <option
                                                    key={category}
                                                    value={category}
                                                >
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
                            onClick={handleCreateNewClient}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-2.5 font-semibold text-emerald-300 transition hover:bg-emerald-400/15 disabled:opacity-40"
                        >
                            <MdSave />
                            {loading ? 'Creating...' : 'Create Client & Voucher'}
                        </button>
                    </div>
                </div>
            </div>

            <div ref={voucherPrintRef} className="nunito hidden w-[550px]">
                <VoucherHeading />

                <div className="grid grid-cols-2 text-xs font-semibold text-black">
                    <div>
                        <h1>Name: {clientNameRef.current?.value}</h1>
                        <h1>Address: {addressRef.current?.value}</h1>
                    </div>
                    <div className="text-right">
                        <h1>Date: {currentDate}</h1>
                        <h1>Mobile No: 0{phoneNoRef.current?.value}</h1>
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

export default CreateNewClientWithVoucher;


