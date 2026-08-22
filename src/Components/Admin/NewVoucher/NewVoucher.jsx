import React, { useEffect, useRef, useState } from 'react';
import { MdArrowBack, MdAdd, MdDeleteOutline, MdPrint, MdSave, MdReceiptLong } from 'react-icons/md';
import { NumericFormat } from 'react-number-format';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import VoucherHeading from '../../Shared/VoucherHeading/VoucherHeading';

const NewVoucher = () => {
    const client = useLoaderData();
    const location = useLocation();
    const from = location?.state?.pathname;
    const navigate = useNavigate();

    const [voucherSl, setVoucherSl] = useState(0);
    const [products, setProducts] = useState([
        { product_name: '', quantity: '', rate: '', total: 0 },
    ]);

    const [discount, setDiscount] = useState(0);
    const [paid, setPaid] = useState(0);
    const [due, setDue] = useState(0);
    const [status, setStatus] = useState('Unpaid');
    const [loading, setLoading] = useState(false);

    const discount_amount_ref = useRef();
    const paid_amount_ref = useRef();
    const voucherPrintRef = useRef();

    useEffect(() => {
        fetch('https://bismillah-enterprise-server.onrender.com/voucher_sl')
            .then((res) => res.json())
            .then((data) => {
                setVoucherSl(data.sl_no || 0);
            });
    }, []);

    const now = new Date();

    const Time = now.toLocaleTimeString('en-BD', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

    const currentDate = now.toLocaleDateString('en-BD', {
        day: 'numeric',
        year: 'numeric',
        month: 'long',
    });

    const totalBill = products.reduce(
        (sum, item) => sum + item.total,
        0
    );

    const calculatePayment = (discountValue, paidValue) => {
        const calculatedDue = Math.max(
            0,
            totalBill - discountValue - paidValue
        );

        setDiscount(discountValue);
        setPaid(paidValue);
        setDue(parseFloat(calculatedDue.toFixed(2)));
        setStatus(calculatedDue > 0 ? 'Unpaid' : 'Paid');
    };

    const handleDiscountPaidChange = () => {
        const discountValue = parseFloat(
            discount_amount_ref.current?.value || 0
        );

        const paidValue = parseFloat(
            paid_amount_ref.current?.value || 0
        );

        calculatePayment(discountValue, paidValue);
    };

    const handleChange = (index, field, value) => {
        setProducts((prev) => {
            const updated = [...prev];

            updated[index] = {
                ...updated[index],
                [field]: value,
            };

            const quantity = parseFloat(updated[index].quantity || 0);
            const rate = parseFloat(updated[index].rate || 0);

            updated[index].total = parseFloat(
                (quantity * rate).toFixed(2)
            );

            return updated;
        });
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

    const addProduct = () => {
        if (products.length >= 9) return;

        setProducts((prev) => [
            ...prev,
            {
                product_name: '',
                quantity: '',
                rate: '',
                total: 0,
            },
        ]);
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
                    <title>Voucher</title>
                    <link
                        href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
                        rel="stylesheet"
                    />

                    <style>
                        @page {
                            size: A4 landscape;
                            margin: 10mm;
                        }

                        body {
                            font-family: sans-serif;
                            color: black;
                            display: flex;
                            justify-content: flex-end;
                            width: 100%;
                        }

                        .voucher-wrapper {
                            width: 48%;
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

    const handleSubmit = () => {
        if (!client?._id) return;

        if (
            products.some(
                (item) =>
                    !item.product_name ||
                    !item.quantity ||
                    !item.rate
            )
        ) {
            Swal.fire({
                title: 'Incomplete Voucher',
                text: 'Please complete every product row.',
                icon: 'warning',
                background: '#0b1a17',
                color: '#ecfdf5',
                confirmButtonColor: '#10b981',
            });

            return;
        }

        const newSlNo = voucherSl + 1;

        const discountAmount = parseFloat(
            discount_amount_ref.current?.value || 0
        );

        const voucher = {
            date: `${currentDate}, ${Time}`,
            voucher_no: newSlNo,
            products,
            total: parseFloat(totalBill.toFixed(2)),
            paid_amount: paid,
            due_amount: due,
            payment_status: status,
            discount: discountAmount,
        };

        Swal.fire({
            title: 'Create Voucher?',
            text: `Voucher #${newSlNo} will be added to ${client.name}.`,
            icon: 'question',
            background: '#0b1a17',
            color: '#ecfdf5',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#334155',
            confirmButtonText: 'Create Voucher',
        }).then((result) => {
            if (!result.isConfirmed) return;

            setLoading(true);

            fetch(`https://bismillah-enterprise-server.onrender.com/new_voucher/${client._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(voucher),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (!data.acknowledged) {
                        throw new Error('Voucher creation failed');
                    }

                    if (paid > 0) {
                        const paymentDetails = {
                            date: `${currentDate}, ${Time}`,
                            reference_voucher: newSlNo,
                            paid_amount: paid,
                            transection_amount: paid,
                            due: due,
                            payment_status: status,
                            voucher_no: String(newSlNo),
                            discount: discountAmount,
                        };

                        return fetch(
                            `https://bismillah-enterprise-server.onrender.com/take_payment/${client._id}`,
                            {
                                method: 'PUT',
                                headers: {
                                    'content-type': 'application/json',
                                },
                                body: JSON.stringify(paymentDetails),
                            }
                        );
                    }
                })
                .then(() =>
                    fetch(
                        'https://bismillah-enterprise-server.onrender.com/voucher_sl',
                        {
                            method: 'POST',
                            headers: {
                                'content-type': 'application/json',
                            },
                            body: JSON.stringify({
                                new_sl_no: newSlNo,
                            }),
                        }
                    )
                )
                .then(() => {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Voucher Created',
                        text: `Voucher #${newSlNo} created successfully.`,
                        background: '#0b1a17',
                        color: '#ecfdf5',
                        showConfirmButton: false,
                        timer: 1200,
                    }).then(() => {
                        navigate(from || `/client_details/${client._id}`);
                    });
                })
                .catch(() => {
                    Swal.fire({
                        title: 'Something went wrong',
                        text: 'Unable to create voucher.',
                        icon: 'error',
                        background: '#0b1a17',
                        color: '#ecfdf5',
                        confirmButtonColor: '#10b981',
                    });
                })
                .finally(() => setLoading(false));
        });
    };

    return (
        <div className="min-h-full py-5 sm:py-7">

            {/* Header */}
            <div className="flex items-center gap-4 mb-7 print:hidden">

                <Link
                    to={from || '/client_corner'}
                    className="hidden md:flex group items-center gap-2 px-4 py-2 rounded-xl
                    border border-white/10 bg-white/[0.03]
                    text-slate-300 hover:text-emerald-300
                    hover:border-emerald-400/30 transition-all"
                >
                    <MdArrowBack className="text-xl group-hover:-translate-x-1 transition-transform" />
                    Back
                </Link>

                <div className="flex-1 flex items-center justify-center md:justify-start gap-3">
                    <div className="p-3 rounded-xl bg-emerald-400/10 border border-emerald-400/20">
                        <MdReceiptLong className="text-2xl text-emerald-300" />
                    </div>

                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-white">
                            New Voucher
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            {client?.name} • Voucher #{voucherSl + 1}
                        </p>
                    </div>
                </div>
            </div>

            {/* Client mini profile */}
            <div className="max-w-5xl mx-auto mb-5 print:hidden">
                <div className="rounded-2xl border border-white/[0.07]
                    bg-white/[0.025] p-4 flex flex-col sm:flex-row
                    sm:items-center justify-between gap-3">

                    <div>
                        <p className="text-xs text-slate-500">Client</p>
                        <h2 className="text-lg font-bold text-white">
                            {client.name}
                        </h2>
                    </div>

                    <div className="text-xs text-slate-500 sm:text-right">
                        <p>{client.address}</p>
                        <p>{client.mobile_no}</p>
                    </div>
                </div>
            </div>

            {/* Voucher */}
            <div className="max-w-5xl mx-auto rounded-3xl
                border border-white/[0.08]
                bg-white/[0.025]
                backdrop-blur-xl
                overflow-hidden print:hidden">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between
                    gap-3 p-5 border-b border-white/[0.06]">

                    <div>
                        <h2 className="font-bold text-white">
                            Voucher #{voucherSl + 1}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            {currentDate} • {Time}
                        </p>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-semibold w-fit
                        ${status === 'Paid'
                            ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20'
                            : 'bg-red-400/10 text-red-400 border border-red-400/20'
                        }`}>
                        {status}
                    </span>
                </div>

                <div className="overflow-x-auto scrollbar-hide p-5">

                    <table className="w-full min-w-[700px] text-sm">

                        <thead>
                            <tr className="text-xs text-slate-500 border-b border-white/[0.06]">
                                <th className="p-4 w-10"></th>
                                <th className="p-4">SL</th>
                                <th className="p-4 text-left">Product</th>
                                <th className="p-4">Qty</th>
                                <th className="p-4">Rate</th>
                                <th className="p-4 text-right">Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.map((item, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-white/[0.04]"
                                >
                                    <td className="p-3 text-center">
                                        <button
                                            onClick={() => handleDeleteRow(index)}
                                            className="text-red-400/60 hover:text-red-400 transition-colors"
                                        >
                                            <MdDeleteOutline className="text-xl" />
                                        </button>
                                    </td>

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
                                            className="w-full px-3 py-2 rounded-lg
                                            bg-white/[0.03]
                                            border border-white/10
                                            text-slate-200
                                            outline-none
                                            focus:border-emerald-400/30"
                                        />
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
                                            className="w-24 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-slate-200 outline-none"
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
                                            className="w-24 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-slate-200 outline-none"
                                            allowNegative={false}
                                            decimalScale={2}
                                        />
                                    </td>

                                    <td className="p-3 text-right font-semibold text-slate-200">
                                        {item.total.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Calculation */}
                <div className="p-5 sm:p-6">

                    <div className="max-w-md ml-auto space-y-3">

                        <div className="flex justify-between">
                            <span className="text-slate-500 text-sm">
                                Total Bill
                            </span>

                            <span className="text-white font-bold">
                                {totalBill.toFixed(2)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-slate-500 text-sm">
                                Discount
                            </span>

                            <NumericFormat
                                value={discount}
                                getInputRef={discount_amount_ref}
                                onChange={handleDiscountPaidChange}
                                className="w-32 px-3 py-2 rounded-lg
                                bg-white/[0.03]
                                border border-white/10
                                text-slate-200 text-right outline-none"
                                allowNegative={false}
                                decimalScale={2}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-slate-500 text-sm">
                                Paid Amount
                            </span>

                            <NumericFormat
                                value={paid}
                                getInputRef={paid_amount_ref}
                                onChange={handleDiscountPaidChange}
                                className="w-32 px-3 py-2 rounded-lg
                                bg-white/[0.03]
                                border border-white/10
                                text-slate-200 text-right outline-none"
                                allowNegative={false}
                                decimalScale={2}
                            />
                        </div>

                        <div className="h-px bg-white/[0.06]" />

                        <div className="flex justify-between">
                            <span className="text-slate-400 font-semibold">
                                Due Amount
                            </span>

                            <span className="text-red-400 font-bold">
                                {due.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row justify-end gap-3 mt-7">

                        <button
                            onClick={addProduct}
                            disabled={products.length >= 9}
                            className="flex items-center justify-center gap-2
                            px-4 py-2.5 rounded-xl
                            border border-white/10
                            bg-white/[0.03]
                            text-slate-300
                            hover:text-emerald-300
                            hover:border-emerald-400/30
                            disabled:opacity-40
                            transition-all"
                        >
                            <MdAdd />
                            Add Product
                        </button>

                        <button
                            onClick={handlePrint}
                            className="flex items-center justify-center gap-2
                            px-4 py-2.5 rounded-xl
                            border border-cyan-400/20
                            bg-cyan-400/[0.05]
                            text-cyan-300
                            hover:bg-cyan-400/10
                            transition-all"
                        >
                            <MdPrint />
                            Print
                        </button>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex items-center justify-center gap-2
                            px-5 py-2.5 rounded-xl
                            border border-emerald-400/20
                            bg-emerald-400/10
                            text-emerald-300
                            hover:bg-emerald-400/15
                            disabled:opacity-40
                            transition-all font-semibold"
                        >
                            <MdSave />
                            {loading ? 'Creating...' : 'Create Voucher'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Print layout */}
            <div
                ref={voucherPrintRef}
                className="nunito w-[550px] hidden"
            >
                <VoucherHeading />

                <div className="flex items-center justify-center">
                    <div className="text-xs font-semibold grid grid-cols-2 text-black w-full">

                        <div>
                            <h1>Name: {client.name}</h1>
                            <h1>Address: {client.address}</h1>
                        </div>

                        <div className="flex justify-end">
                            <div>
                                <h1>Date: {currentDate}</h1>
                                <h1>Mobile No: {client.mobile_no}</h1>
                            </div>
                        </div>

                    </div>
                </div>

                <h1 className="text-md text-center font-bold text-black mt-2">
                    Voucher - {voucherSl + 1}
                </h1>

                <table className="text-black w-full text-xs mt-2">

                    <thead>
                        <tr>
                            <th className="border border-black p-2">SL</th>
                            <th className="border border-black p-2">Product</th>
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
                                    {item.quantity}
                                </td>

                                <td className="border border-black p-2 text-center">
                                    {item.rate}
                                </td>

                                <td className="border border-black p-2 text-center">
                                    {item.total.toFixed(2)}
                                </td>

                            </tr>
                        ))}

                        {Array.from({
                            length: Math.max(0, 8 - (products?.length || 0))
                        }).map((_, index) => (
                            <tr key={`empty-${index}`}>

                                <td className="border border-black p-2 text-center">
                                    &nbsp;
                                </td>

                                <td className="border border-black p-2">
                                    &nbsp;
                                </td>

                                <td className="border border-black p-2 text-center">
                                    &nbsp;
                                </td>

                                <td className="border border-black p-2 text-center">
                                    &nbsp;
                                </td>

                                <td className="border border-black p-2 text-center">
                                    &nbsp;
                                </td>

                            </tr>
                        ))}

                        <tr>
                            <td
                                colSpan="4"
                                className="border border-black p-2 text-right"
                            >
                                Total Bill
                            </td>

                            <td className="border border-black p-2 text-center">
                                {totalBill.toFixed(2)}
                            </td>
                        </tr>

                        <tr>
                            <td
                                colSpan="4"
                                className="border border-black p-2 text-right"
                            >
                                Discount
                            </td>

                            <td className="border border-black p-2 text-center">
                                {discount.toFixed(2)}
                            </td>
                        </tr>

                        <tr>
                            <td
                                colSpan="4"
                                className="border border-black p-2 text-right"
                            >
                                Paid Amount
                            </td>

                            <td className="border border-black p-2 text-center">
                                {paid.toFixed(2)}
                            </td>
                        </tr>

                        <tr>
                            <td
                                colSpan="4"
                                className="border border-black p-2 text-right"
                            >
                                Due Amount
                            </td>

                            <td className="border border-black p-2 text-center">
                                {due.toFixed(2)}
                            </td>
                        </tr>

                    </tbody>

                </table>
                <div className="absolute bottom-0 mt-20 flex w-1/2 items-center justify-between text-xs">

                    <div className="ml-4 w-fit border-t-2 border-black px-5 pt-1">
                        <h1>Buyer Sign</h1>
                    </div>

                    <div className="mr-8 w-fit border-t-2 border-black px-5 pt-1">
                        <h1>Seller Sign</h1>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default NewVoucher;