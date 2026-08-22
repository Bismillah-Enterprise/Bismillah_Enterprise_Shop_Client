import React, { useRef, useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { NumberFormatBase, NumericFormat } from 'react-number-format';
import { Link, useLoaderData, useLocation, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import VoucherHeading from '../../Shared/VoucherHeading/VoucherHeading';

const Voucher = () => {
    const { voucher_no } = useParams();
    const client = useLoaderData();
    const [isEdit, setIsEdit] = useState(false);

    const matchedVoucher = client.vouchers.find(
        (voucher) => parseInt(voucher.voucher_no) === parseInt(voucher_no)
    );

    const [discount, setDiscount] = useState(matchedVoucher?.discount);
    const [due, setDue] = useState(matchedVoucher.due_amount);
    const [paid, setPaid] = useState(matchedVoucher.paid_amount);

    const location = useLocation();
    const from = location?.state?.pathname;
    const navigate = useNavigate();

    const [modal, setModal] = useState(false);
    const [statusError, setStatusError] = useState(false);

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

    // Add new products functions

    const [products, setProducts] = useState([
        ...matchedVoucher.products
    ]);

    const [voucher_calculation, set_voucher_calculation] = useState({});

    let totalBill = products.reduce((sum, item) => sum + item.total, 0);

    const discount_amount_ref = useRef();
    const paid_amount_ref = useRef();
    const status_ref = useRef();

    const handleChange = (index, field, value) => {
        const newProducts = [...products];
        newProducts[index][field] = value;

        const quantity = parseFloat(newProducts[index].quantity || 0);
        const rate = parseFloat(newProducts[index].rate || 0);

        newProducts[index].total = parseFloat(
            (quantity * rate).toFixed(2)
        );

        setProducts(newProducts);
    };

    const total = totalBill;

    const [Ndiscount, setNDiscount] = useState(0);
    const [Npaid, setNPaid] = useState(0);
    const [Ndue, setNDue] = useState(total);
    const [status, setStatus] = useState('Unpaid');

    const handleDeleteRow = (indexNo) => {
        Swal.fire({
            title: "Are you sure?",
            text: `You Are Deleting A Row`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, I am Sure"
        }).then((result) => {
            if (result.isConfirmed) {
                const allProducts = [...products]
                allProducts.splice(parseInt(indexNo), 1);
                setProducts(allProducts)
            }
        })
    }

    const addProduct = () => {
        setIsEdit(true);
        setProducts([
            ...products,
            {
                product_name: '',
                quantity: '',
                rate: '',
                total: 0
            }
        ]);
    };

    const handleNChange = (index, field, value) => {
        const newProducts = [...products];
        newProducts[index][field] = value;

        const quantity = parseFloat(newProducts[index].quantity || 0);
        const rate = parseFloat(newProducts[index].rate || 0);

        newProducts[index].total = parseFloat(
            (quantity * rate).toFixed(2)
        );

        setProducts(newProducts);
    };

    const handleEditVoucher = (vn) => {
        const voucher = {
            voucher_no: vn,
            products,
            total: parseFloat(totalBill.toFixed(2)),
            due_amount: parseFloat(
                (
                    totalBill -
                    matchedVoucher.paid_amount -
                    matchedVoucher.discount
                ).toFixed(2)
            ),
            status: `${due > 0 ? 'Unpaid' : 'Paid'}`
        }

        Swal.fire({
            title: "Are you sure?",
            text: `You Are Adding Those Items`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, I am Sure"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(
                    `https://bismillah-enterprise-server.onrender.com/edit_voucher/${client._id}`,
                    {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(voucher)
                    }
                )
                    .then(res => res.json())
                    .then(data => {
                        if (data.acknowledged) {
                            navigate(location?.pathname);
                            setIsEdit(false);

                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Voucher Edited Successfully",
                                showConfirmButton: false,
                                timer: 1000
                            })
                        }
                    })
            }
        })
    }

    // End Add new products functions

    const transection_amount_ref = useRef();
    const payment_status_ref = useRef();
    const more_discount_ref = useRef();
    const voucherPrintRef = useRef();

    const handleDiscountPaidChange = () => {
        const discountVal = parseFloat(
            more_discount_ref.current.value || 0
        );

        const totalDiscount = parseFloat(
            matchedVoucher.discount + discountVal
        );

        const totalDue = parseFloat(
            matchedVoucher.due_amount - discountVal
        );

        setDiscount(parseFloat(totalDiscount.toFixed(2)));
        setDue(parseFloat(totalDue.toFixed(2)));
    };

    const handlePaidChange = () => {
        const paidVal = parseFloat(
            transection_amount_ref.current.value || 0
        );

        const totalPaid = parseFloat(
            matchedVoucher.paid_amount + paidVal
        );

        setPaid(parseFloat(totalPaid.toFixed(2)));
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
          <title>Print</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            @page {
                size: A4 landscape;
                margin: 10mm;
            }

            body {
                font-family: sans-serif;
                color: black;
                display: flex;
                justify-content: end;
                width: 100%
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

    const handleTakePayment = (id) => {
        const transectionAmount =
            parseFloat(transection_amount_ref.current.value).toFixed(2);

        const moreDiscountAmount =
            parseFloat(more_discount_ref.current.value).toFixed(2);

        const paymentDetails = {
            date: `${currentDate}, ${Time}`,
            reference_voucher: voucher_no,
            paid_amount: paid,
            transection_amount: parseFloat(transectionAmount),
            due: parseFloat(
                (
                    matchedVoucher.due_amount -
                    transectionAmount -
                    moreDiscountAmount
                ).toFixed(2)
            ),
            payment_status:
                matchedVoucher.total <= (discount + paid)
                    ? 'Paid'
                    : 'Unpaid',
            voucher_no: `${voucher_no}`,
            discount: discount
        }

        Swal.fire({
            title: "Are you sure?",
            text: `You Are Taking a Payment From ${client?.name}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, I am Sure"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(
                    `https://bismillah-enterprise-server.onrender.com/take_payment/${id}`,
                    {
                        method: 'PUT',
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify(paymentDetails)
                    }
                )
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            more_discount_ref.current.value = '';
                            transection_amount_ref.current.value = '';
                            setModal(!modal);
                            navigate(location.pathname)

                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: 'Payment Taking Successfully',
                                showConfirmButton: false,
                                timer: 1000,
                            })
                        }
                    })
            }
        })
    }

    return (
        <div className="relative min-h-full w-full text-slate-200">

            {/* Ambient Background */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-pink-500/[0.035] blur-[130px]" />
                <div className="absolute -right-40 top-[25%] h-[450px] w-[450px] rounded-full bg-violet-500/[0.035] blur-[140px]" />
                <div className="absolute -bottom-40 left-[35%] h-[500px] w-[500px] rounded-full bg-cyan-500/[0.025] blur-[150px]" />
            </div>

            {/* ================= PAYMENT MODAL ================= */}
            {modal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
                    onClick={() => setModal(false)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-pink-300/20 bg-[#081513]/95 shadow-2xl shadow-pink-500/10 backdrop-blur-2xl"
                    >

                        {/* Modal Header */}
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
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-300"
                            >
                                <MdOutlineCancel className="text-xl" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="space-y-5 p-6">

                            {/* Summary */}
                            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                                <div className="grid grid-cols-2 gap-4">

                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-slate-500">
                                            Bill
                                        </p>

                                        <p className="mt-1 text-lg font-black text-white">
                                            {matchedVoucher.total}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-[10px] uppercase tracking-wider text-slate-500">
                                            Discount
                                        </p>

                                        <p className="mt-1 text-lg font-black text-pink-300">
                                            {discount}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-slate-500">
                                            Paid
                                        </p>

                                        <p className="mt-1 text-lg font-black text-emerald-300">
                                            {paid}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-[10px] uppercase tracking-wider text-slate-500">
                                            Due
                                        </p>

                                        <p className={`mt-1 text-lg font-black ${due > 0
                                            ? 'text-amber-300'
                                            : 'text-emerald-300'
                                            }`}>
                                            {due}
                                        </p>
                                    </div>

                                </div>
                            </div>

                            {/* More Discount */}
                            <div>
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    More Discount
                                </label>

                                <div className="h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 transition focus-within:border-pink-400/40 focus-within:bg-white/[0.06]">
                                    <NumericFormat
                                        defaultValue={0}
                                        getInputRef={more_discount_ref}
                                        onChange={handleDiscountPaidChange}
                                        className="h-full w-full bg-transparent text-white outline-none placeholder:text-slate-600"
                                        placeholder="Enter discount amount"
                                        allowNegative={false}
                                        decimalScale={2}
                                        fixedDecimalScale={false}
                                        thousandSeparator={false}
                                    />
                                </div>
                            </div>

                            {/* Transaction Amount */}
                            <div>
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Transaction Amount
                                </label>

                                <div className="h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 transition focus-within:border-emerald-400/40 focus-within:bg-white/[0.06]">
                                    <NumericFormat
                                        getInputRef={transection_amount_ref}
                                        onChange={handlePaidChange}
                                        className="h-full w-full bg-transparent text-white outline-none placeholder:text-slate-600"
                                        placeholder="Enter payment amount"
                                        allowNegative={false}
                                        decimalScale={2}
                                        fixedDecimalScale={false}
                                        thousandSeparator={false}
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                onClick={() => handleTakePayment(client._id)}
                                className="h-12 w-full rounded-xl bg-pink-500/10 border border-pink-400/20 text-pink-200 font-bold transition hover:bg-pink-500 hover:text-white hover:shadow-lg hover:shadow-pink-500/20"
                            >
                                Submit Payment
                            </button>

                        </div>
                    </div>
                </div>
            )}

            {/* ================= MAIN CONTENT ================= */}
            <div
                onClick={() => {
                    if (modal) setModal(false)
                }}
                className="relative z-10 mx-auto w-full max-w-6xl"
            >

                {/* Header */}
                <div className="mb-6 rounded-3xl border border-white/[0.07] bg-white/[0.025] p-4 sm:p-6">

                    <div className="flex flex-col gap-5">

                        <div className="flex items-center justify-between gap-4">

                            <Link to={`/admin/client_details/${client._id}`}>
                                <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-pink-400/30 hover:bg-pink-400/10 hover:text-pink-300">
                                    <span>←</span>
                                    Back
                                </button>
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

                        {/* Client Information */}
                        <div className="grid gap-4 rounded-2xl border border-white/[0.06] bg-black/10 p-4 sm:grid-cols-2">

                            <div className="space-y-2">
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-slate-500">
                                        Customer
                                    </p>

                                    <h2 className="mt-0.5 text-base font-bold text-white sm:text-lg">
                                        {client.name}
                                    </h2>
                                </div>

                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-slate-500">
                                        Address
                                    </p>

                                    <p className="mt-0.5 text-sm text-slate-300">
                                        {client.address}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 sm:text-right">

                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-slate-500">
                                        Date
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-slate-200">
                                        {matchedVoucher.date}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-slate-500">
                                        Mobile
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-slate-200">
                                        {client.mobile_no}
                                    </p>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>

                {/* ================= VIEW MODE ================= */}
                <div
                    className={`${isEdit ? 'hidden' : 'block'} overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.025] shadow-xl`}
                >

                    <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-pink-400">
                                Items
                            </p>

                            <h2 className="mt-1 text-lg font-bold text-white">
                                Voucher Summary
                            </h2>
                        </div>

                        <div className={`rounded-full border px-3 py-1 text-xs font-bold ${matchedVoucher.payment_status === 'Paid'
                            ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
                            : 'border-amber-400/20 bg-amber-400/10 text-amber-300'
                            }`}>
                            {matchedVoucher.payment_status}
                        </div>
                    </div>

                    <div className="overflow-x-auto scrollbar-hide p-5">
                        {matchedVoucher ? (
                            <table className="w-full min-w-[700px] text-sm text-slate-200">

                                <thead>
                                    <tr className="border-b border-white/[0.07] bg-white/[0.025] text-xs uppercase tracking-wider text-slate-500">
                                        <th className="px-5 py-4 text-left">SL</th>
                                        <th className="px-5 py-4 text-left">Product Name</th>
                                        <th className="px-5 py-4 text-right">Quantity</th>
                                        <th className="px-5 py-4 text-right">Rate</th>
                                        <th className="px-5 py-4 text-right">Total</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {matchedVoucher.products?.map((product, index) => (
                                        <tr
                                            key={index}
                                            className="border-b border-white/[0.05] transition hover:bg-white/[0.025]"
                                        >
                                            <td className="px-5 py-4 text-slate-500">
                                                {String(index + 1).padStart(2, '0')}
                                            </td>

                                            <td className="px-5 py-4 font-medium text-white">
                                                {product.product_name}
                                            </td>

                                            <td className="px-5 py-4 text-right">
                                                {product.quantity}
                                            </td>

                                            <td className="px-5 py-4 text-right text-slate-300">
                                                {product.rate}
                                            </td>

                                            <td className="px-5 py-4 text-right font-bold text-pink-300">
                                                {product.total}
                                            </td>
                                        </tr>
                                    ))}

                                    {/* Total */}
                                    <tr className="border-b border-white/[0.05]">
                                        <td colSpan={3} />

                                        <td className="px-5 py-4 text-right text-sm font-semibold text-slate-400">
                                            Total Bill
                                        </td>

                                        <td className="px-5 py-4 text-right text-lg font-black text-white">
                                            {matchedVoucher.total}
                                        </td>
                                    </tr>

                                    {/* Discount */}
                                    <tr className="border-b border-white/[0.05]">
                                        <td colSpan={3} />

                                        <td className="px-5 py-4 text-right text-sm font-semibold text-slate-400">
                                            Discount
                                        </td>

                                        <td className="px-5 py-4 text-right font-bold text-pink-300">
                                            {matchedVoucher.discount}
                                        </td>
                                    </tr>

                                    {/* Paid */}
                                    <tr className="border-b border-white/[0.05]">
                                        <td colSpan={3} />

                                        <td className="px-5 py-4 text-right text-sm font-semibold text-slate-400">
                                            Paid Amount
                                        </td>

                                        <td className="px-5 py-4 text-right font-bold text-emerald-300">
                                            {matchedVoucher.paid_amount}
                                        </td>
                                    </tr>

                                    {/* Due */}
                                    <tr className="bg-white/[0.025]">
                                        <td
                                            colSpan={3}
                                            className="px-5 py-5 text-left"
                                        >
                                            <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${matchedVoucher.payment_status === 'Paid'
                                                ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
                                                : 'border-amber-400/20 bg-amber-400/10 text-amber-300'
                                                }`}>
                                                {matchedVoucher.payment_status}
                                            </span>
                                        </td>

                                        <td className="px-5 py-5 text-right text-sm font-semibold text-slate-400">
                                            Due Amount
                                        </td>

                                        <td className="px-5 py-5 text-right text-lg font-black text-cyan-300">
                                            {matchedVoucher.due_amount}
                                        </td>
                                    </tr>

                                </tbody>
                            </table>
                        ) : (
                            <div className="p-10 text-center text-red-400">
                                Voucher not found.
                            </div>
                        )}
                    </div>
                </div>

                {/* ================= EDIT MODE ================= */}
                <div
                    className={`${!isEdit ? 'hidden' : 'block'} overflow-hidden rounded-3xl border border-pink-400/10 bg-white/[0.025] shadow-xl`}
                >

                    <div className="border-b border-white/[0.07] px-5 py-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-pink-400">
                            Edit Mode
                        </p>

                        <h2 className="mt-1 text-lg font-bold text-white">
                            Update Voucher Items
                        </h2>
                    </div>

                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full min-w-[780px] text-sm text-slate-200">

                            <thead>
                                <tr className="border-b border-white/[0.07] bg-white/[0.025] text-xs uppercase tracking-wider text-slate-500">
                                    <th className="w-12 px-3 py-4" />
                                    <th className="px-4 py-4 text-left">SL</th>
                                    <th className="px-4 py-4 text-left">Product</th>
                                    <th className="px-4 py-4 text-right">Qty</th>
                                    <th className="px-4 py-4 text-right">Rate</th>
                                    <th className="px-4 py-4 text-right">Total</th>
                                </tr>
                            </thead>

                            <tbody>
                                {products?.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="border-b border-white/[0.05]"
                                    >

                                        <td className="px-3 py-4 text-center">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    handleDeleteRow(index)
                                                }}
                                                className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-400/10 bg-red-500/5 text-lg text-red-400 transition hover:border-red-400/30 hover:bg-red-500/20"
                                            >
                                                −
                                            </button>
                                        </td>

                                        <td className="px-4 py-4 text-slate-500">
                                            {String(index + 1).padStart(2, '0')}
                                        </td>

                                        <td className="px-4 py-4">
                                            <input
                                                type="text"
                                                value={item.product_name}
                                                onChange={(e) =>
                                                    handleNChange(
                                                        index,
                                                        'product_name',
                                                        e.target.value
                                                    )
                                                }
                                                className="h-10 w-full min-w-[220px] rounded-xl border border-white/10 bg-white/[0.04] px-3 text-white outline-none transition placeholder:text-slate-600 focus:border-pink-400/40 focus:bg-white/[0.06]"
                                                placeholder="Product name"
                                            />
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="h-10 rounded-xl border border-white/10 bg-white/[0.04] px-3">
                                                <NumericFormat
                                                    value={item.quantity}
                                                    onChange={(e) =>
                                                        handleNChange(
                                                            index,
                                                            'quantity',
                                                            e.target.value
                                                        )
                                                    }
                                                    className="h-full w-full bg-transparent text-right text-white outline-none"
                                                    placeholder="0"
                                                    allowNegative={false}
                                                    decimalScale={2}
                                                    fixedDecimalScale={false}
                                                    thousandSeparator={false}
                                                />
                                            </div>
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="h-10 rounded-xl border border-white/10 bg-white/[0.04] px-3">
                                                <NumericFormat
                                                    value={item.rate}
                                                    onValueChange={(values) =>
                                                        handleNChange(
                                                            index,
                                                            'rate',
                                                            values.floatValue
                                                        )
                                                    }
                                                    className="h-full w-full bg-transparent text-right text-white outline-none"
                                                    placeholder="0"
                                                    allowNegative={false}
                                                    decimalScale={2}
                                                    fixedDecimalScale={false}
                                                    thousandSeparator={false}
                                                />
                                            </div>
                                        </td>

                                        <td className="px-4 py-4 text-right font-bold text-pink-300">
                                            {item.total.toFixed(2)}
                                        </td>

                                    </tr>
                                ))}

                                <tr className="bg-white/[0.025]">
                                    <td colSpan="4" />

                                    <td className="px-4 py-5 text-right font-bold text-slate-400">
                                        Total Bill
                                    </td>

                                    <td className="px-4 py-5 text-right text-lg font-black text-white">
                                        {totalBill.toFixed(2)}
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ================= ACTIONS ================= */}
                <div className="mt-6 rounded-3xl border border-white/[0.07] bg-white/[0.025] p-4 sm:p-5">

                    <div className="flex flex-wrap items-center justify-center gap-3">

                        {/* Payment */}
                        <button
                            onClick={() => {
                                setModal(true)
                            }}
                            disabled={matchedVoucher.due_amount < 1 || isEdit}
                            className={`${isEdit ? 'hidden' : 'inline-flex'} h-11 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-5 text-sm font-bold text-emerald-300 transition hover:bg-emerald-500 hover:text-[#071311] disabled:cursor-not-allowed disabled:opacity-40`}
                        >
                            Take A Payment
                        </button>

                        {/* Add Product */}
                        <button
                            onClick={addProduct}
                            disabled={products.length > 9}
                            className="inline-flex h-11 items-center justify-center rounded-xl border border-pink-400/20 bg-pink-500/10 px-5 text-sm font-bold text-pink-300 transition hover:bg-pink-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            + Add More Products
                        </button>

                        {/* Done */}
                        <button
                            onClick={() => {
                                handleEditVoucher(voucher_no)
                            }}
                            className={`${isEdit ? 'inline-flex' : 'hidden'} h-11 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-5 text-sm font-bold text-emerald-300 transition hover:bg-emerald-500 hover:text-white`}
                        >
                            Done
                        </button>

                        {/* Print */}
                        <button
                            onClick={handlePrint}
                            className={`${isEdit ? 'hidden' : 'inline-flex'} h-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-5 text-sm font-bold text-cyan-300 transition hover:bg-cyan-500 hover:text-[#071311]`}
                        >
                            Print
                        </button>

                    </div>
                </div>

            </div>

            {/* ================= PRINT CONTENT ================= */}
            <div
                ref={voucherPrintRef}
                className="nunito hidden w-[550px]"
            >

                <VoucherHeading />

                <div className="flex items-center justify-center">
                    <div className="grid w-full grid-cols-2 text-xs font-semibold text-black">

                        <div>
                            <h1>Name: {client.name}</h1>
                            <h1>Address: {client.address}</h1>
                        </div>

                        <div className="flex justify-end">
                            <div>
                                <h1>Date: {matchedVoucher.date}</h1>
                                <h1>Mobile No: {client.mobile_no}</h1>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="flex items-center justify-center nunito">
                    <h1 className="nunito px-5 text-center text-md font-bold text-black">
                        Voucher - {voucher_no}
                    </h1>
                </div>

                <div className="mt-1 flex items-center justify-center overflow-x-scroll overflow-y-hidden text-md scrollbar-hide sm:overflow-x-hidden">

                    <div className="absolute flex w-full items-center justify-center">
                        <div>
                            <h1 className="text-5xl font-bold opacity-20">
                                {matchedVoucher.payment_status}
                            </h1>
                        </div>
                    </div>

                    <table className="w-full text-xs text-black">

                        <thead>
                            <tr className="text-black">
                                <th className="border border-black p-2">SL</th>
                                <th className="border border-black p-2">Product Name</th>
                                <th className="w-28 border border-black p-2">Quantity</th>
                                <th className="w-28 border border-black p-2">Rate</th>
                                <th className="w-28 border border-black p-2">Total</th>
                            </tr>
                        </thead>

                        <tbody>

                            {matchedVoucher.products?.map((product, index) => (
                                <tr key={index}>

                                    <td className="border border-black p-2 text-center">
                                        {index + 1}
                                    </td>

                                    <td className="border border-black p-2">
                                        {product.product_name}
                                    </td>

                                    <td className="border border-black p-2 text-center">
                                        {product.quantity}
                                    </td>

                                    <td className="border border-black p-2 text-center">
                                        {product.rate}
                                    </td>

                                    <td className="border border-black p-2 text-center">
                                        {product.total}
                                    </td>

                                </tr>
                            ))}
                            {Array.from({
                                length: Math.max(0, 12 - (matchedVoucher.products?.length || 0))
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

                            <tr className="font-semibold text-black">
                                <td
                                    className="border border-black p-2"
                                    colSpan={3}
                                />

                                <td className="border border-black p-2 text-right">
                                    Total Bill
                                </td>

                                <td className="border border-black p-2 text-center">
                                    {matchedVoucher.total}
                                </td>
                            </tr>

                            <tr className="text-right font-semibold">
                                <td
                                    colSpan="3"
                                    className="border border-black p-2"
                                />

                                <td className="border border-black p-2">
                                    Discount
                                </td>

                                <td className="border border-black p-2 text-center">
                                    {matchedVoucher.discount}
                                </td>
                            </tr>

                            <tr className="text-right font-semibold">
                                <td
                                    colSpan="3"
                                    className="border border-black p-2"
                                />

                                <td className="border border-black p-2">
                                    Paid Amount
                                </td>

                                <td className="border border-black p-2 text-center">
                                    {matchedVoucher.paid_amount}
                                </td>
                            </tr>

                            <tr className="text-right font-semibold">
                                <td
                                    colSpan="3"
                                    className="border border-black p-2 text-center"
                                >
                                    {matchedVoucher.payment_status}
                                </td>

                                <td className="border border-black p-2">
                                    Due Amount
                                </td>

                                <td className="border border-black p-2 text-center">
                                    {matchedVoucher.due_amount}
                                </td>
                            </tr>

                        </tbody>

                    </table>
                </div>

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

export default Voucher;